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

import re
import sys
import argparse
import json

# Corporate verbs + AI-buzz nouns that should never appear in Lia copy.
HARD_AVOID = [
    "leverage", "leveraging", "empower", "empowering", "unlock", "unlocking",
    "upskill", "utilize", "utilizing", "synergy", "synergies", "seamless",
    "seamlessly", "transformative", "groundbreaking", "supercharge",
    "turnkey", "best-in-class", "cutting-edge", "next-level",
]

# US spellings — flagged as hard errors (Lia writes Australian English).
US_SPELLING = [
    r"\b\w*iz(e|es|ed|ing|ation)\b",   # organize, realize, optimization…
    r"\bcolor(s|ed|ing|ful)?\b", r"\bbehavior(s|al)?\b", r"\bfavor(s|ed|ing|ite|able)?\b",
    r"\bhonor(s|ed|ing|able)?\b", r"\blabor(s|ed|ing)?\b", r"\bneighbor(s|hood|ing)?\b",
    r"\bcenter(s|ed|ing)?\b", r"\bmeter(s)?\b", r"\btheater(s)?\b", r"\bfiber(s)?\b",
    r"\bdefense\b", r"\boffense\b", r"\blicense\b",   # (noun sense; verb 'license' is US-only anyway)
    r"\bcatalog(s|ed|ing)?\b", r"\bdialog\b", r"\banalog\b",
    r"\btraveled\b", r"\btraveling\b", r"\bmodeled\b", r"\bmodeling\b",
    r"\bcanceled\b", r"\bfulfill\b", r"\benrollment\b",
]
# -ize words that are correct even in AU English (Macquarie): keep off the net,
# including their inflections (sized, sizing, prizes, seized, capsized…).
US_IZE_ALLOW_ROOTS = ("size", "prize", "seize", "capsize", "maize", "assize", "downsize", "oversize")


def _ize_allowed(tok):
    t = tok.lower()
    return any(t == r or t.startswith(r) for r in US_IZE_ALLOW_ROOTS)

# AI-tell vocabulary — warn, run the filler test (real meaning = keep).
WATCHLIST = [
    "delve", "tapestry", "pivotal", "navigate", "navigating", "foster",
    "fostering", "elevate", "elevating", "landscape", "robust", "holistic",
    "crucial", "powerful", "innovative", "testament", "underscore",
    "underscores", "enhance", "enhancing", "streamline", "streamlining",
    "utilise", "myriad", "realm", "vibrant", "bustling", "nuanced",
    "meticulous", "meticulously", "notably", "moreover", "furthermore",
]

# Filler — warn.
SOFT_AVOID = [
    "actually", "really", "literally", "basically", "essentially", "simply",
    "just", "very", "quite", "truly", "in order to", "due to the fact that",
    "it is important to note", "at the end of the day", "needless to say",
    "it's worth noting", "that being said",
]


def find(words, text, regex=False):
    hits = []
    lines = text.split("\n")
    for i, line in enumerate(lines, 1):
        for w in words:
            pat = w if regex else r"\b" + re.escape(w) + r"\b"
            for m in re.finditer(pat, line, re.IGNORECASE):
                tok = m.group(0)
                if regex and _ize_allowed(tok):
                    continue
                hits.append((i, tok, line.strip()))
    return hits


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
    watch = find(WATCHLIST, text)
    soft = find(SOFT_AVOID, text)

    if a.json:
        print(json.dumps({
            "hard_avoid": [{"line": l, "match": t} for l, t, _ in hard + ussp],
            "watchlist": [{"line": l, "match": t} for l, t, _ in watch],
            "soft_avoid": [{"line": l, "match": t} for l, t, _ in soft],
        }, indent=2))
        sys.exit(1 if (hard or ussp) else 0)

    def block(title, hits, mark):
        if not hits:
            return
        print(f"\n{mark} {len(hits)} {title}:")
        for l, t, line in hits[:60]:
            print(f'  Line {l}: "{t}"\n    → {snip(line)}')
        if len(hits) > 60:
            print(f"  … and {len(hits) - 60} more")

    total_hard = hard + ussp
    if not total_hard and not watch and not soft:
        print("✓ clean — no hard-avoid, watchlist, or soft-avoid matches")
        sys.exit(0)

    block("HARD-AVOID match(es) — must fix (corporate verb / US spelling)", total_hard, "✗")
    block("vocab-watchlist match(es) — run the filler test (real meaning = keep, decoration = cut)", watch, "⚠")
    block("SOFT-AVOID match(es) — review (filler)", soft, "⚠")

    sys.exit(1 if total_hard else 0)


if __name__ == "__main__":
    main()
