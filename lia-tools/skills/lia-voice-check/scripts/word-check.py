#!/usr/bin/env python3
"""
Word checker for the lia-voice-check skill.

Deterministic backstop under the LLM AI-pattern scan. Scans a draft for
hard-avoid words (corporate verbs + US spelling), an AI-tell vocabulary
watchlist, and soft-avoid filler. Regex matching only, no judgement.

Usage:
    python3 word-check.py <draft-file>
    python3 word-check.py --text "paste draft text here"
    cat draft.md | python3 word-check.py --stdin
    python3 word-check.py <file> --json

Exit code: 1 if any HARD-AVOID or US-spelling match, else 0.
WATCHLIST and SOFT-AVOID warn only; they never affect the exit code.

Source of truth is references/lia-voice.md + references/ai-patterns.md.
When the voice docs change an avoid word, update the lists below.
Adapted from Dan's voice-check word-check.py (Robson Studio vault); the
Dan-personal exceptions are removed for Lia's brand register.
LAST_SYNC: 2026-07-06
"""

import bisect
import re
import sys
import argparse
import json

# Corporate verbs + AI-buzz nouns that should never appear in Lia copy.
HARD_AVOID = [
    "leverage", "leveraging", "empower", "empowering", "unlock", "unlocking",
    "upskill", "utilize", "utilizing", "utilise", "utilising", "synergy",
    "synergies", "seamless",
    "seamlessly", "transformative", "groundbreaking", "supercharge",
    "turnkey", "best-in-class", "cutting-edge", "next-level",
]

# US spellings — flagged as hard errors (Lia writes Australian English).
US_SPELLING = [
    r"\b\w*iz(e|es|ed|ing|ation)\b",   # organize, realize, optimization…
    r"\b\w*yz(e|es|ed|ing)\b",         # analyze, paralyzed, catalyzing (AU: -yse)
    # Metric units only. NOT a general \w+meter net: parameter, diameter,
    # perimeter, thermometer, speedometer and micrometer (the instrument) are
    # all correct Australian spellings, and a net that caught them would fail
    # on correct input — the defect this file has already been fixed for twice.
    r"\b(kilo|centi|milli|deci|deka|hecto|nano)meter(s)?\b",
    r"\b(milli|centi|deci|kilo)?liter(s)?\b",
    r"\bcolor(s|ed|ing|ful)?\b", r"\bbehavior(s|al)?\b", r"\bfavor(s|ed|ing|ite|able)?\b",
    r"\bhonor(s|ed|ing|able)?\b", r"\blabor(s|ed|ing)?\b", r"\bneighbor(s|hood|ing)?\b",
    r"\bcenter(s|ed|ing)?\b", r"\btheater(s)?\b", r"\bfiber(s)?\b",
    r"\bdefense\b", r"\boffense\b",
    r"\bcatalog(s|ed|ing)?\b", r"\bdialog\b", r"\banalog\b",
    r"\btraveled\b", r"\btraveling\b", r"\bmodeled\b", r"\bmodeling\b",
    r"\bcanceled\b", r"\bfulfill\b", r"\benrollment\b",
]
# Spellings that are US in one sense and correct Australian in another. The
# script cannot tell the senses apart, so it warns instead of blocking — a
# guard that fails on correct input is a guard someone deletes in a hurry.
#   licence = the noun, license = the VERB (both standard AU/UK)
#   metre   = the unit,  meter  = the device (parking meter, power meter)
US_SPELLING_AMBIGUOUS = {
    r"\blicense(s|d|ing)?\b": "US for the noun; correct AU for the verb (licence = noun)",
    r"\bmeter(s)?\b": "US for the unit; correct AU for the device (metre = unit)",
}

# -ize words that are correct even in AU English (Macquarie): keep off the net,
# including their inflections (sized, sizing, prizes, seized, capsized…) AND
# their prefixed forms. Matching on startswith() alone failed every prefixed
# one — `resize`, `downsizing`, `supersized` all hard-failed a correct draft.
# The prefixes are listed rather than left open (`[a-z]*`): an open prefix
# allows `emphasizing` too, which is US (AU: emphasise). Stems drop their `e`
# before an ending, so match on the stem without it.
US_IZE_ALLOW = re.compile(
    r"^(re|down|up|over|super|mid|out)?"
    r"(siz|priz|seiz|maiz|assiz|capsiz)"
    r"(e|es|ed|ing)?$",
    re.IGNORECASE,
)


def _ize_allowed(tok):
    return bool(US_IZE_ALLOW.match(tok))

# AI-tell vocabulary — warn, run the filler test (real meaning = keep).
WATCHLIST = [
    "delve", "tapestry", "pivotal", "navigate", "navigating", "foster",
    "fostering", "elevate", "elevating", "landscape", "robust", "holistic",
    "crucial", "powerful", "innovative", "testament", "underscore",
    "underscores", "enhance", "enhancing", "streamline", "streamlining",
    "myriad", "realm", "vibrant", "bustling", "nuanced",
    "meticulous", "meticulously", "notably", "moreover", "furthermore",
]

# Filler — warn.
SOFT_AVOID = [
    "actually", "really", "literally", "basically", "essentially", "simply",
    "just", "very", "quite", "truly", "in order to", "due to the fact that",
    "it is important to note", "at the end of the day", "needless to say",
    "it's worth noting", "that being said",
]


def _line_index(text):
    """Offsets of each line start, so a whole-text match reports its line."""
    starts, pos = [0], 0
    for line in text.split("\n")[:-1]:
        pos += len(line) + 1
        starts.append(pos)
    return starts


def find(words, text, regex=False, notes=None):
    """Scan the WHOLE text, not line by line.

    Line-at-a-time matching silently no-opped on every multi-word entry the
    moment a draft was hard-wrapped — "in order to" broken across two lines
    matched nothing, in files the vault hard-wraps by convention. Spaces in a
    phrase therefore match any run of whitespace, newlines included.
    """
    hits = []
    starts = _line_index(text)
    lines = text.split("\n")
    for w in words:
        pat = w if regex else r"\b" + r"\s+".join(re.escape(p) for p in w.split()) + r"\b"
        for m in re.finditer(pat, text, re.IGNORECASE):
            tok = m.group(0)
            if regex and _ize_allowed(tok):
                continue
            i = bisect.bisect_right(starts, m.start())
            hits.append((i, " ".join(tok.split()), lines[i - 1].strip(), m.start(),
                         (notes or {}).get(w, "")))
    return sorted(hits, key=lambda h: (h[0], h[3]))


def merge(*hitlists):
    """One match, one hit. `utilize` is in HARD_AVOID and matches the -ize
    pattern; before this it was reported twice, and §Hard pass tells you to
    quote those counts."""
    seen, out = set(), []
    for hits in hitlists:
        for h in hits:
            key = (h[0], h[3], h[1].lower())
            if key in seen:
                continue
            seen.add(key)
            out.append(h)
    return sorted(out, key=lambda h: (h[0], h[3]))


def snip(line, n=90):
    return (line[:n] + "…") if len(line) > n else line


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("file", nargs="?")
    ap.add_argument("--text")
    ap.add_argument("--stdin", action="store_true")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()

    if a.text is not None:
        text = a.text
    elif a.stdin:
        text = sys.stdin.read()
    elif a.file:
        with open(a.file, encoding="utf-8") as f:
            text = f.read()
    else:
        ap.error("provide a file, --text, or --stdin")

    hard = find(HARD_AVOID, text)
    ussp = find(US_SPELLING, text, regex=True)
    ambig = find(list(US_SPELLING_AMBIGUOUS), text, regex=True,
                 notes=US_SPELLING_AMBIGUOUS)
    watch = find(WATCHLIST, text)
    soft = find(SOFT_AVOID, text)

    if a.json:
        print(json.dumps({
            "hard_avoid": [{"line": l, "match": t} for l, t, _, _, _ in merge(hard, ussp)],
            "spelling_check_sense": [{"line": l, "match": t, "note": n} for l, t, _, _, n in ambig],
            "watchlist": [{"line": l, "match": t} for l, t, _, _, _ in watch],
            "soft_avoid": [{"line": l, "match": t} for l, t, _, _, _ in soft],
        }, indent=2))
        sys.exit(1 if (hard or ussp) else 0)

    def block(title, hits, mark):
        if not hits:
            return
        print(f"\n{mark} {len(hits)} {title}:")
        for l, t, line, _, note in hits[:60]:
            print(f'  Line {l}: "{t}"' + (f"  ({note})" if note else ""))
            print(f"    → {snip(line)}")
        if len(hits) > 60:
            print(f"  … and {len(hits) - 60} more")

    total_hard = merge(hard, ussp)
    if not total_hard and not ambig and not watch and not soft:
        print("✓ clean — no hard-avoid, watchlist, or soft-avoid matches")
        sys.exit(0)

    block("HARD-AVOID match(es) — must fix (corporate verb / US spelling)", total_hard, "✗")
    block("spelling(s) to check by sense — correct AU in one sense, US in the other", ambig, "⚠")
    block("vocab-watchlist match(es) — run the filler test (real meaning = keep, decoration = cut)", watch, "⚠")
    block("SOFT-AVOID match(es) — review (filler)", soft, "⚠")

    sys.exit(1 if total_hard else 0)


if __name__ == "__main__":
    main()
