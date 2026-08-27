#!/usr/bin/env python3
"""copy-lint — the deterministic backstop under the ux-writing skill.

Checks interface strings against the house rules in ../references/. It reads
what the LLM pass can't hold consistently across 400 strings: capitalisation,
ending punctuation, banned words, and raw system text reaching a person.

    python3 copy-lint.py strings.txt              # kind<TAB>string, or bare lines
    python3 copy-lint.py --text "Add a toy" --kind label
    python3 copy-lint.py --stdin --kind body
    python3 copy-lint.py strings.json --json      # machine-readable in and out
    python3 copy-lint.py --self-test              # prove the checks go red

Kinds:
    label        button / link / menu item        title case, no ending stop
    title        screen, section, alert fragment  title case, no ending stop
    sentence     alert title that is a sentence   sentence case, ends in . or ?
    body         informative text, empty states   sentence case, ends in a stop
    placeholder  hint text in a field             sentence case, no ending stop

Exit 1 on any error (E-*). Warnings (W-*) never fail a run — they are judgment
calls the writer makes, and a lint that blocks on judgment gets switched off.

The rules are Apple's mechanics as distilled in ../references/apple-distilled.md,
with Lia's house decision (27 Aug 2026, CQ): Apple-exact title case.
"""

import argparse
import json
import re
import sys

TITLE_KINDS = {"label", "title"}
SENTENCE_KINDS = {"sentence", "body", "placeholder"}
KINDS = TITLE_KINDS | SENTENCE_KINDS

# Lowercase inside title case: articles, coordinating conjunctions, "as", "to"
# in infinitives, and prepositions of four letters or fewer. First and last word
# are always capitalised regardless. Apple Style Guide, June 2026, "capitalization".
ALWAYS_LOWER = {
    "a", "an", "the",
    "and", "but", "or", "nor", "for", "yet", "so",
    "as", "to",
    "at", "by", "from", "in", "into", "of", "off", "on", "onto", "out", "over",
    "up", "with",
}

# Prepositions capitalised anyway when they are part of a phrasal verb — the
# particle belongs to the verb, so it carries the verb's weight: "Turn On",
# "Back Up", "Sign In". A preposition that merely points at an object is NOT a
# particle and stays down: "Add to Library", "Go to Settings". Getting that
# wrong makes the lint demand a capitalisation Apple itself doesn't ship
# ("Add to Home Screen", "Add to Reading List"), so keep this table to real
# phrasal verbs and let everything else fall through to ALWAYS_LOWER.
PHRASAL = {
    "turn": {"on", "off"}, "sign": {"in", "out", "up"}, "log": {"in", "out"},
    "start": {"up", "over"}, "shut": {"down"}, "back": {"up"}, "set": {"up"},
    "put": {"back", "off"}, "pick": {"up"}, "hand": {"off", "over"},
    "clean": {"up"}, "tidy": {"up"}, "fill": {"in"}, "check": {"in", "out"},
    "opt": {"in", "out"}, "give": {"up"}, "clear": {"out"},
}

# Words that keep their own capitalisation whatever position they land in.
# Single words only — `_fixed` compares one word at a time, so a multi-word
# entry here would be dead weight that never matches. ("Toy Box" needs no
# entry: both words capitalise on their own in title case.)
FIXED_CASE = [
    "iPhone", "iPad", "iPod", "iCloud", "iMessage", "macOS", "iOS", "watchOS",
    "tvOS", "visionOS", "AirDrop", "lia.tools", "lia.build", "Lia",
]

BANNED = [
    (r"\boops\b", "E-BANNED", "no 'oops' — it reads as insincere in a failure"),
    (r"\buh-?oh\b", "E-BANNED", "no 'uh-oh'"),
    (r"\bwhoops\b", "E-BANNED", "no 'whoops'"),
    (r"\bsorry\b", "E-BANNED", "no apologising — say what happened and the way forward"),
    (r"\bplease\b", "E-BANNED", "no 'please' in instructional text"),
    (r"\binvalid\b", "E-BANNED", "say how to get it right, not that it's wrong"),
    (r"\bclick here\b", "E-BANNED", "a link names its destination"),
    (r"\bare you sure\b", "E-BANNED", "say what will happen instead"),
    (r"\billegal\b", "E-BANNED", "developer vocabulary aimed at a person"),
    (r"\benabled?\b", "W-WORD", "'turn on' acts now; 'enable' is developer framing"),
    (r"\bdisabled?\b", "W-WORD", "'turn off', or 'dimmed' for a control that can't be used"),
    (r"\b(abort|kill|terminate|execute)\b", "W-WORD", "use stop, cancel, quit or end"),
    (r"\bgrey?ed out\b", "W-WORD", "use 'dimmed'"),
    (r"\bdialog box\b", "W-WORD", "'dialog', never 'dialog box'"),
    (r"\bclick on\b", "W-WORD", "'click', never 'click on'"),
    (r"\bthe user\b", "W-WORD", "write to the person: 'you'"),
    (r"\bfailed to\b", "W-WORD",
     "\u201cCouldn\u2019t \u2026\u201d reads as a product; \u201cFailed to \u2026\u201d reads as a stack trace"),
    (r"\b(leverage|empower|seamless|utili[sz]e|supercharge|effortless)\b",
     "W-WORD", "corporate vocabulary"),
    # "just now", "just under a minute", "just a moment" are measurements, not
    # filler. Only the intensifier "just" is the tell.
    (r"\b(simply|easily|actually|really)\b"
     r"|\bjust\b(?!\s+(?:now|then|under|over|about|before|after|a|an|one|two|the)\b)",
     "W-FILLER", "filler — cut it"),
    (r"\bAI-powered\b|\bpowered by\b|\bsmart\b|\bmagic\b",
     "W-WORD", "AI invisible, outcomes in front"),
]

# Checked without re.I, because the case is the signal. "us" the pronoun is a
# defect; "US" the country is not, and folding them together fails a correct
# string — the exact class of bug that made `lia-voice-check`'s word-check
# unusable on real Australian copy (LIAB-997 review).
BANNED_CASED = [
    (r"\b(?:[Ww]e|[Ww]e[’'](?:re|ve|ll|d)|[Oo]ur(?:s)?|us)\b", "E-FIRSTPERSON",
     "no first person — rewrite in terms of the reader or the product"),
]

# Raw system text reaching a person. These are defects, not preferences — which
# is why each pattern has to earn its severity. A pattern that fires on ordinary
# English ("450 files were copied", "the stack of photos") turns a hard error
# into noise, and a hard error nobody believes is a hard error someone removes.
SYSTEM_LEAK = [
    r"non-2xx", r"\bundefined\b", r"\bnull\b", r"\bNaN\b",
    # An HTTP status code, only where it says it is one. A bare three-digit
    # number is a count far more often than it is a status.
    r"\b(?:HTTP|status(?:\s+code)?|error\s+code|response(?:\s+code)?)\b\W{0,4}[45]\d{2}\b",
    r"\b[45]\d{2}\b\s+(?:error|status|response)\b",
    r"\bstatus code\b", r"\bexception\b", r"\bENOENT\b",
    r"\bstack (?:trace|frame)\b",
    r"\bEdge Function\b", r"\bfailed to fetch\b", r"\btraceback\b",
    r"\berror code\b", r"\btimeout of \d+", r"\bunhandled\b", r"\bECONN",
]

US_SPELLING = [
    (r"\bcolor(s|ed|ing)?\b", "colour"), (r"\bfavorite(s|d)?\b", "favourite"),
    (r"\borgani[z]e(d|s|r)?\b", "organise"), (r"\bcustomi[z]e(d|s)?\b", "customise"),
    (r"\bcancel(ed|ing)\b", "cancelled / cancelling"), (r"\bgray\b", "grey"),
    (r"\bcatalog\b", "catalogue"), (r"\bcenter(s|ed)?\b", "centre"),
    (r"\bsynchroni[z]e(d|s)?\b", "synchronise"), (r"\bapologi[z]e\b", "apologise"),
]

WEAK_LABELS = {"ok", "yes", "no", "submit", "learn more", "more", "go", "here"}

# The rule families --self-test can switch off one at a time to plant a defect
# in the lint itself. A guard nobody has watched fail is a guard nobody knows
# works (lia-plugins CLAUDE.md, "Make the check fail on purpose") — and a single
# negative control only proves the one rule it breaks, so every family gets its
# own. `_DISABLED` is empty in every real run.
FAMILIES = ("titlecase", "punct", "system", "banned", "firstperson",
            "spelling", "typography", "weak", "sentencecase")
_DISABLED = set()


def _on(family):
    return family not in _DISABLED


def _fixed(word):
    for f in FIXED_CASE:
        if word.lower() == f.lower():
            return f
    return None


def _cap(word):
    fixed = _fixed(word)
    if fixed:
        return fixed
    if not word:
        return word
    if word.upper() == word and any(c.isalpha() for c in word):
        return word            # PDF, HEIC, RAW — leave acronyms alone
    if any(c.isdigit() for c in word):
        return word
    if "-" in word:
        parts = word.split("-")
        head = _cap(parts[0])
        tail = [p if p.lower() in ("in",) and head.lower() in ("built", "plug")
                else _cap(p) for p in parts[1:]]
        return "-".join([head] + tail)
    return word[0].upper() + word[1:]


def title_case(text):
    """Apple's title-style capitalisation, applied to a label."""
    words = text.split(" ")
    out = []
    after_colon = False
    for i, w in enumerate(words):
        bare = re.sub(r"[^\w.\-']", "", w).lower()
        first_or_last = i == 0 or i == len(words) - 1
        phrasal = i > 0 and bare in PHRASAL.get(
            re.sub(r"[^\w'-]", "", words[i - 1]).lower(), set())
        if not _on("titlecase"):
            out.append(w)
        elif bare in ALWAYS_LOWER and not first_or_last and not after_colon and not phrasal:
            fixed = _fixed(bare)
            out.append(w.lower() if not fixed else w)
        else:
            out.append(_cap(w))
        after_colon = w.endswith(":")
    return " ".join(out)


def looks_title_cased(text):
    words = [w for w in re.findall(r"[A-Za-z][\w'-]*", text)]
    if len(words) < 4:
        return False
    capped = sum(1 for w in words[1:] if w[0].isupper() and w.lower() not in ALWAYS_LOWER)
    lowerable = sum(1 for w in words[1:] if w.lower() not in ALWAYS_LOWER)
    return lowerable > 0 and capped / lowerable > 0.7


def check(text, kind="label", where=None):
    """Return a list of findings: (code, message)."""
    findings = []
    if kind not in KINDS:
        return [("E-KIND", f"unknown kind '{kind}' — one of {', '.join(sorted(KINDS))}")]

    if _on("system"):
        for pattern in SYSTEM_LEAK:
            if re.search(pattern, text, re.I):
                findings.append(("E-SYSTEM", "raw system text reaching a person — "
                                             f"matched /{pattern}/"))
                break

    if _on("banned"):
        for pattern, code, message in BANNED:
            if re.search(pattern, text, re.I):
                findings.append((code, message))

    if _on("firstperson"):
        for pattern, code, message in BANNED_CASED:
            if re.search(pattern, text):
                findings.append((code, message))

    if _on("spelling"):
        for pattern, fix in US_SPELLING:
            if re.search(pattern, text, re.I):
                findings.append(("W-SPELLING", f"American spelling — use '{fix}'"))

    if _on("typography"):
        if "..." in text:
            findings.append(("W-ELLIPSIS", "use the ellipsis character … , not three dots"))
        if "'" in text:
            findings.append(("W-APOSTROPHE", "use the typographic apostrophe ’"))
        if "!" in text:
            findings.append(("W-EXCLAIM", "exclamation marks: essentially never, "
                                          "and never in an error"))

    if kind in TITLE_KINDS:
        expected = title_case(text)
        if expected != text:
            findings.append(("E-CASE", f"title case — expected “{expected}”"))
        if _on("punct") and re.search(r"[.,;:!?]$", text.strip()):
            findings.append(("E-PUNCT", "no ending punctuation on a label or "
                                        "fragment title (… is the exception)"))
        # Count the words that carry meaning: "Export a Document as a PDF" is
        # three ideas, not six, and reads as short as it is.
        content = [w for w in re.findall(r"[\w’'-]+", text)
                   if w.lower() not in ALWAYS_LOWER]
        if len(content) > 4:
            findings.append(("W-LENGTH",
                             f"{len(content)} content words — a label wants one to three"))
        if _on("weak") and text.strip().lower().rstrip(".") in WEAK_LABELS:
            findings.append(("W-WEAK", "a label names the result — use the verb "
                                       "for what happens"))
    else:
        if _on("sentencecase") and looks_title_cased(text):
            findings.append(("W-CASE", "sentence case for body and informative text"))
        if _on("punct"):
            if kind in ("sentence", "body") and not re.search(r"[.?]$", text.strip()):
                findings.append(("W-PUNCT", "a complete sentence ends in a full stop "
                                            "or question mark"))
            if kind == "placeholder" and re.search(r"[.]$", text.strip()):
                findings.append(("W-PUNCT", "hint text takes no ending full stop"))

    return [(c, m if where is None else f"{m}") for c, m in findings]


def read_items(args):
    items = []
    if args.text is not None:
        return [{"kind": args.kind, "text": args.text, "where": "--text"}]
    if args.stdin:
        raw = sys.stdin.read()
        return [{"kind": args.kind, "text": line, "where": f"stdin:{i+1}"}
                for i, line in enumerate(raw.splitlines()) if line.strip()]
    for path in args.paths:
        if path.endswith(".json"):
            data = json.load(open(path))
            for i, entry in enumerate(data):
                if isinstance(entry, str):
                    items.append({"kind": args.kind, "text": entry,
                                  "where": f"{path}:{i+1}"})
                else:
                    items.append({"kind": entry.get("kind", args.kind),
                                  "text": entry["text"],
                                  "where": entry.get("where", f"{path}:{i+1}")})
        else:
            for i, line in enumerate(open(path).read().splitlines()):
                if not line.strip():
                    continue
                if "\t" in line:
                    kind, text = line.split("\t", 1)
                    kind = kind.strip() or args.kind
                else:
                    kind, text = args.kind, line
                items.append({"kind": kind, "text": text, "where": f"{path}:{i+1}"})
    return items


FIXTURES = [
    # (kind, text, codes that must fire)
    #
    # Half of this suite is defects the checks must catch. The other half is
    # correct Australian product copy the checks must leave alone — every one of
    # them a false positive this lint actually produced on 28 Aug 2026, before
    # anyone had run it on real strings. Those are the ones worth keeping: a
    # lint that cries wolf on good copy is a lint that gets switched off, and
    # the writer keeps the habit of ignoring it afterwards.
    ("label", "Add a Toy", []),
    ("label", "Put It Back", []),
    ("label", "Turn On Notifications", []),          # phrasal verb keeps its particle
    ("label", "Sign In to Lia", []),                 # "to" stays down, "In" comes up
    ("label", "Export a Document as a PDF", []),     # "as" down, acronym untouched
    ("label", "Add a toy", ["E-CASE"]),
    ("label", "Add A Toy", ["E-CASE"]),
    ("label", "Send Feedback.", ["E-PUNCT"]),
    ("label", "OK", ["W-WEAK"]),
    ("label", "Choose a Photo...", ["W-ELLIPSIS"]),
    ("body", "Something went wrong. Nothing was lost.", []),
    ("body", "Couldn’t reach Lia just now.", []),
    ("body", "Edge Function returned a non-2xx status code",
     ["E-SYSTEM", "W-PUNCT"]),
    ("body", "Oops! Please try again.", ["E-BANNED", "W-EXCLAIM"]),
    ("body", "We're having trouble loading this content.", ["E-FIRSTPERSON"]),
    ("body", "That name is invalid.", ["E-BANNED"]),
    ("body", "Failed to send a request.", ["W-WORD"]),
    ("body", "Choose Your Favorite Colors From The List.",
     ["W-CASE", "W-SPELLING"]),
    ("placeholder", "name@example.com", []),

    # --- regressions: correct copy the lint used to fail -------------------
    # A preposition pointing at an object is not a phrasal particle. Apple
    # ships "Add to Home Screen"; the lint demanded "Add To Library".
    ("label", "Add to Library", []),
    ("label", "Go to Settings", []),
    # A three-digit count is not an HTTP status. "450 files were copied" was a
    # hard E-SYSTEM error.
    ("body", "450 files were copied.", []),
    ("body", "It stopped after 500 milliseconds.", []),
    # …and a status code still is one when it says so.
    ("body", "The server returned status code 502.", ["E-SYSTEM"]),
    ("body", "It came back 503 error.", ["E-SYSTEM"]),
    # "stack" is an ordinary English noun. Only a stack trace is a leak.
    ("body", "The stack of photos is ready.", []),
    ("body", "A stack trace was written to the log.", ["E-SYSTEM"]),
    # "US" the place is not "us" the pronoun — the case is the whole signal.
    ("body", "The US team is on it.", []),
    ("body", "Send us a note.", ["E-FIRSTPERSON"]),
    ("body", "We’ve saved your work.", ["E-FIRSTPERSON"]),
    # "just" as a measurement, not an intensifier.
    ("body", "It took just under a minute.", []),
    ("body", "It just works.", ["W-FILLER"]),
    # Australian spelling passes clean; American spelling is caught.
    ("body", "The colour of the organiser is grey.", []),
    ("body", "The run was cancelled and recategorised.", []),
    ("body", "Your favourite catalogue is in the centre.", []),
]


def run_fixtures():
    """Returns a list of failure descriptions — empty means the suite passed."""
    failures = []
    for kind, text, expected in FIXTURES:
        codes = {c for c, _ in check(text, kind)}
        for want in expected:
            if want not in codes:
                failures.append(f"“{text}” ({kind}): expected {want}, got "
                                f"{sorted(codes) or 'nothing'}")
        if not expected and codes:
            failures.append(f"“{text}” ({kind}): expected clean, got {sorted(codes)}")
    return failures


def self_test():
    """Plant a defect in each rule family in turn and confirm it is caught.

    Two halves, and both matter. First the suite must pass with the lint
    intact — that is what proves the fixtures describe correct copy correctly.
    Then every rule family is switched off one at a time, and the suite must go
    red each time — that is what proves the fixtures are actually exercising
    that rule rather than sitting next to it.

    A single negative control (which is all this had until 28 Aug 2026) proves
    exactly one rule. Eight others could have been deleted and it still printed
    ok — the LIAB-959 failure repeated one layer up.
    """
    print("self-test: running fixtures with the checks intact")
    failures = run_fixtures()
    if failures:
        print("FAIL — the checks disagree with their own fixtures:")
        for f in failures:
            print(f"  · {f}")
        return 1
    print(f"self-test: ok — {len(FIXTURES)} fixtures clean")

    print("self-test: planting a defect in each rule family, one at a time")
    unproven = []
    for family in FAMILIES:
        _DISABLED.add(family)
        try:
            mutated = run_fixtures()
        finally:
            _DISABLED.discard(family)
        if mutated:
            print(f"  · {family:<13} switched off → {len(mutated)} fixture "
                  f"failure(s)  [caught]")
        else:
            print(f"  · {family:<13} switched off → suite still green  "
                  f"[NOT COVERED]")
            unproven.append(family)

    if unproven:
        print("\nFAIL — these rules can be deleted without the fixtures "
              "noticing: " + ", ".join(unproven))
        print("The suite proves nothing about them. Add a fixture that fires "
              "on each before trusting a green run.")
        return 1

    print(f"\nself-test: ok — clean when intact, red for all "
          f"{len(FAMILIES)} families when broken")
    return 0


def main():
    parser = argparse.ArgumentParser(description="Lint Lia interface copy.")
    parser.add_argument("paths", nargs="*", help=".txt (kind<TAB>string) or .json")
    parser.add_argument("--text", help="lint one string")
    parser.add_argument("--stdin", action="store_true", help="read strings from stdin")
    parser.add_argument("--kind", default="label", choices=sorted(KINDS),
                        help="kind for strings that don't declare one")
    parser.add_argument("--json", action="store_true", dest="as_json")
    parser.add_argument("--self-test", action="store_true", dest="selftest")
    args = parser.parse_args()

    if args.selftest:
        return self_test()
    if not args.paths and args.text is None and not args.stdin:
        parser.print_help()
        return 2

    items = read_items(args)
    results, errors, warnings = [], 0, 0
    for item in items:
        for code, message in check(item["text"], item["kind"], item["where"]):
            results.append({"where": item["where"], "kind": item["kind"],
                            "text": item["text"], "code": code, "message": message})
            if code.startswith("E-"):
                errors += 1
            else:
                warnings += 1

    if args.as_json:
        print(json.dumps({"checked": len(items), "errors": errors,
                          "warnings": warnings, "findings": results}, indent=2))
    else:
        for r in results:
            print(f"{r['code']:<15} {r['where']}\n    “{r['text']}”\n    {r['message']}")
        print(f"\n{len(items)} string(s) · {errors} error(s) · {warnings} warning(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
