#!/usr/bin/env python3
"""Build Kayley's offline Verse of the Day library from official WEB USFX.

The World English Bible text is public domain. This script keeps the verse text
unchanged, selects a calm and encouraging hand-reviewed set, and emits a small
browser-ready JavaScript data file.
"""

from __future__ import annotations

import argparse
import json
import re
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from pathlib import Path


BOOKS = {
    "GEN": "Genesis", "EXO": "Exodus", "LEV": "Leviticus", "NUM": "Numbers",
    "DEU": "Deuteronomy", "JOS": "Joshua", "JDG": "Judges", "RUT": "Ruth",
    "1SA": "1 Samuel", "2SA": "2 Samuel", "1KI": "1 Kings", "2KI": "2 Kings",
    "1CH": "1 Chronicles", "2CH": "2 Chronicles", "EZR": "Ezra", "NEH": "Nehemiah",
    "EST": "Esther", "JOB": "Job", "PSA": "Psalm", "PRO": "Proverbs",
    "ECC": "Ecclesiastes", "SNG": "Song of Solomon", "ISA": "Isaiah",
    "JER": "Jeremiah", "LAM": "Lamentations", "EZK": "Ezekiel", "DAN": "Daniel",
    "HOS": "Hosea", "JOL": "Joel", "AMO": "Amos", "OBA": "Obadiah",
    "JON": "Jonah", "MIC": "Micah", "NAM": "Nahum", "HAB": "Habakkuk",
    "ZEP": "Zephaniah", "HAG": "Haggai", "ZEC": "Zechariah", "MAL": "Malachi",
    "MAT": "Matthew", "MRK": "Mark", "LUK": "Luke", "JHN": "John", "ACT": "Acts",
    "ROM": "Romans", "1CO": "1 Corinthians", "2CO": "2 Corinthians",
    "GAL": "Galatians", "EPH": "Ephesians", "PHP": "Philippians",
    "COL": "Colossians", "1TH": "1 Thessalonians", "2TH": "2 Thessalonians",
    "1TI": "1 Timothy", "2TI": "2 Timothy", "TIT": "Titus", "PHM": "Philemon",
    "HEB": "Hebrews", "JAS": "James", "1PE": "1 Peter", "2PE": "2 Peter",
    "1JN": "1 John", "2JN": "2 John", "3JN": "3 John", "JUD": "Jude",
    "REV": "Revelation",
}

THEMES = {
    "peace": (r"\bpeace\b", r"\brest\b", r"\bbe still\b", r"\bquiet(?:ness)?\b", r"\bcalm\b"),
    "courage": (r"\bdon[’']t be afraid\b", r"\bdo not be afraid\b", r"\bfear not\b", r"\bcourage\b", r"\bbold(?:ly|ness)?\b", r"\bbe strong\b"),
    "presence": (r"\bwith you\b", r"\bnever leave\b", r"\bnot forsake\b", r"\bdraw near\b", r"\bis near\b", r"\bam near\b"),
    "love": (r"\blove(?:d|s|ly)?\b", r"\bbeloved\b", r"\bcompassion\b", r"\bkindness\b", r"\bkind\b", r"\btender\b"),
    "hope": (r"\bhope\b", r"\bfuture\b", r"\bwait for\b", r"\brenew(?:ed|s)?\b", r"\bnew thing\b", r"\bjoy comes in the morning\b"),
    "guidance": (r"\bguide(?:d|s)?\b", r"\bpaths?\b", r"\bwisdom\b", r"\bunderstanding\b", r"\bteach me\b", r"\blead me\b", r"\bdirect your\b"),
    "strength": (r"\bstrength(?:en|ened|ens)?\b", r"\bmy help\b", r"\bwill help\b", r"\buphold\b", r"\brefuge\b", r"\bfortress\b", r"\bshelter\b", r"\bshield\b"),
    "joy": (r"\bjoy(?:ful|fully)?\b", r"\brejoice\b", r"\bglad(?:ness)?\b", r"\bdelight\b", r"\bsing(?:ing)?\b", r"\bpraise\b"),
    "grace": (r"\bgrace\b", r"\bmercy\b", r"\bforgive(?:n|ness)?\b", r"\bsalvation\b", r"\bredeem(?:ed|er)?\b"),
    "identity": (r"\bchosen\b", r"\bchild of God\b", r"\bchildren of God\b", r"\bworkmanship\b", r"\bcreated in\b", r"\bcalled you\b", r"\bknown you\b", r"\bwonderfully made\b"),
    "faith": (r"\bfaith(?:ful|fully)?\b", r"\bbelieve(?:d|s)?\b", r"\btrust\b", r"\bseek\b", r"\bpray(?:er|ed|ing)?\b"),
    "light": (r"\blight\b", r"\blamp\b", r"\btruth\b", r"\bset you free\b", r"\bfreedom\b", r"\beternal life\b", r"\babundant life\b"),
}

# Chapters with enough stand-alone devotional material to avoid accidental
# fragments from genealogies, battle records, judgements, or legal lists.
SAFE_CHAPTERS = {
    "GEN": {1, 9, 12, 15, 21, 28, 32, 39, 50},
    "EXO": {3, 14, 15, 20, 33, 34},
    "NUM": {6, 14, 23, 24},
    "DEU": {4, 6, 7, 8, 10, 30, 31, 32, 33},
    "JOS": {1, 23, 24}, "RUT": {1, 2, 4},
    "1SA": {2, 12, 16, 17}, "2SA": {7, 22},
    "1KI": {3, 8, 18, 19}, "1CH": {16, 29}, "2CH": {7, 15, 20},
    "NEH": {8, 9}, "EST": {4, 8}, "JOB": {1, 5, 11, 19, 22, 23, 28, 33, 37, 38, 42},
    "PSA": set(range(1, 151)), "PRO": set(range(1, 32)), "ECC": set(range(1, 13)),
    "SNG": set(range(1, 9)),
    "ISA": {9, 12, 25, 26, 30, 32, 35, 40, 41, 42, 43, 44, 46, 49, 51, 52, 54, 55, 57, 58, 60, 61, 62, 64, 65, 66},
    "JER": {1, 6, 17, 29, 31, 32, 33}, "LAM": {3, 5}, "EZK": {11, 34, 36, 37, 47},
    "DAN": {2, 3, 6, 9, 10, 12}, "HOS": {2, 6, 10, 11, 14}, "JOL": {2, 3},
    "AMO": {5, 9}, "MIC": {4, 5, 6, 7}, "HAB": {2, 3}, "ZEP": {3},
    "ZEC": {2, 4, 8, 9, 12, 14}, "MAL": {3, 4},
    "MAT": {5, 6, 7, 11, 18, 22, 25, 28},
    "MRK": {1, 2, 4, 5, 8, 9, 10, 12, 14, 15, 16},
    "LUK": {1, 2, 4, 6, 8, 10, 11, 12, 15, 18, 19, 23, 24},
    "JHN": {1, 3, 4, 6, 8, 10, 11, 13, 14, 15, 16, 17, 20},
    "ACT": {1, 2, 4, 9, 10, 16, 17, 20, 27},
    "ROM": {5, 8, 10, 12, 15}, "1CO": {1, 2, 10, 12, 13, 15, 16},
    "2CO": {1, 3, 4, 5, 9, 12}, "GAL": {2, 3, 5, 6},
    "EPH": set(range(1, 7)), "PHP": set(range(1, 5)), "COL": set(range(1, 5)),
    "1TH": set(range(1, 6)), "2TH": set(range(1, 4)),
    "1TI": {1, 4, 6}, "2TI": set(range(1, 5)), "TIT": set(range(1, 4)),
    "HEB": {4, 6, 10, 11, 12, 13}, "JAS": set(range(1, 6)),
    "1PE": set(range(1, 6)), "2PE": {1, 3}, "1JN": set(range(1, 6)),
    "2JN": {1}, "3JN": {1}, "JUD": {1}, "REV": {1, 3, 7, 19, 21, 22},
}

BOOK_BONUS = {
    "PSA": 5, "PRO": 4, "ISA": 4, "MAT": 4, "MRK": 3, "LUK": 4, "JHN": 4,
    "ROM": 4, "2CO": 3, "GAL": 3, "EPH": 4, "PHP": 4, "COL": 3,
    "1TH": 3, "2TH": 3, "2TI": 3, "HEB": 3, "JAS": 3, "1PE": 3, "1JN": 4,
}

# Every generated reading is deliberately reviewed as a stand-alone daily
# anchor.  Automatic keyword matching is useful for finding candidates, but it
# cannot reliably distinguish comfort from a verse that merely mentions joy,
# peace or light while making a very different point.
CURATED_REFS = set("""
Psalm 7:17
Psalm 9:2
Psalm 18:2
Psalm 18:28
Psalm 21:6
Psalm 21:13
Psalm 25:5
Psalm 25:6
Psalm 27:14
Psalm 28:7
Psalm 30:4
Psalm 31:3
Psalm 31:7
Psalm 31:24
Psalm 32:11
Psalm 33:3
Psalm 35:9
Psalm 35:27
Psalm 40:11
Psalm 40:16
Psalm 43:3
Psalm 46:1
Psalm 49:3
Psalm 51:1
Psalm 51:6
Psalm 61:4
Psalm 62:7
Psalm 64:10
Psalm 67:4
Psalm 68:4
Psalm 69:16
Psalm 70:4
Psalm 71:22
Psalm 100:2
Psalm 104:33
Psalm 111:10
Psalm 118:24
Psalm 119:105
Psalm 119:159
Psalm 130:5
Psalm 135:3
Psalm 143:10
Psalm 146:2
Psalm 147:1
Psalm 149:1
Proverbs 2:6
Proverbs 3:13
Proverbs 3:19
Proverbs 4:5
Proverbs 4:7
Proverbs 4:11
Proverbs 9:9
Proverbs 9:10
Proverbs 11:12
Proverbs 14:26
Proverbs 16:16
Proverbs 23:18
Proverbs 23:25
Isaiah 25:9
Isaiah 32:17
Isaiah 35:1
Isaiah 35:2
Isaiah 40:9
Isaiah 41:10
Isaiah 41:13
Isaiah 41:17
Isaiah 42:10
Isaiah 43:5
Isaiah 49:13
Isaiah 51:3
Isaiah 52:9
Isaiah 55:6
Isaiah 55:12
Isaiah 61:7
Lamentations 3:25
Lamentations 3:26
Lamentations 3:57
Matthew 5:9
Matthew 5:12
Luke 1:14
Luke 1:28
John 3:16
John 6:47
John 10:28
John 16:20
John 17:3
Romans 8:14
1 Corinthians 16:13
2 Corinthians 4:14
Galatians 3:26
Galatians 5:5
Ephesians 2:10
Ephesians 6:10
Philippians 4:9
Philippians 4:23
2 Thessalonians 3:5
2 Thessalonians 3:16
1 Timothy 4:12
2 Timothy 4:22
Hebrews 4:16
Hebrews 11:6
1 John 2:25
1 John 3:1
1 John 3:2
1 John 4:7
1 John 4:11
1 John 5:11
1 John 5:20
2 John 1:3
Jude 1:21
Revelation 22:5
""".strip().splitlines())

EXCLUDE = re.compile(
    r"\b(kill|killed|slaughter|bloodshed|wrath|vengeance|curse|cursed|"
    r"enemy|enemies|sword|destroyed|destruction|wicked|hell|harlot|whore|"
    r"rod|slave|slaves|master|circumcision|uncircumcision|boast|boasting|"
    r"famine|plague|terror|rebuke|condemn|judgement|judgment|darkened|"
    r"discipline|suffering|sufferings|evil|died|die|death|mourning|weeping|"
    r"ambush|ambushers|struck|captive|captivity|torment|tormented|worm|"
    r"devil|demons?|sacrifice|sacrifices|plunder|prostitute|prostitutes|"
    r"adulterer|adulterers|adultery|fool|fools|folly|wickedness)\b",
    re.IGNORECASE,
)

FRAGMENT_START = re.compile(
    r"^(and|but|because|so that|then|that|which|who|whom|whose|to |from |of |as |"
    r"therefore|he |she |they |these |those |his |her |their |our )",
    re.IGNORECASE,
)
NARRATIVE = re.compile(
    r"\b(he said|she said|they said|answered|asked him|asked her|going out|came to pass|"
    r"wish to see|hope to stay|wrote this greeting|journeyed|departed)\b",
    re.IGNORECASE,
)
DIVINE = re.compile(r"\b(God|LORD|Lord|Jesus|Christ|Spirit|Saviour|Savior)\b")

HEADING_STYLES = ("s", "ms", "mr", "r", "d", "sp", "qa", "mt", "is", "ip", "toc")
SKIP_TAGS = {"f", "x", "fig"}


def tag_name(element: ET.Element) -> str:
    return element.tag.rsplit("}", 1)[-1]


def normalise(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    return text.replace("\u00a0", " ")


def parse_book(book: ET.Element) -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    current_ref: str | None = None
    fragments: list[str] = []

    def flush() -> None:
        nonlocal current_ref, fragments
        if current_ref and fragments:
            text = normalise("".join(fragments))
            if text:
                rows.append({"bcv": current_ref, "text": text})
        current_ref = None
        fragments = []

    def walk(node: ET.Element) -> None:
        nonlocal current_ref, fragments
        for child in node:
            tag = tag_name(child)
            if tag == "v":
                flush()
                current_ref = child.attrib.get("bcv")
                if child.tail:
                    fragments.append(child.tail)
                continue
            if tag == "c":
                flush()
                continue
            if tag in SKIP_TAGS:
                if current_ref and child.tail:
                    fragments.append(child.tail)
                continue
            if tag == "p":
                style = child.attrib.get("style", child.attrib.get("sfm", ""))
                if style.startswith(HEADING_STYLES):
                    flush()
                    continue
            if current_ref and child.text:
                fragments.append(child.text)
            walk(child)
            if current_ref and child.tail:
                fragments.append(child.tail)

    walk(book)
    flush()
    return rows


def parse_usfx(path: Path) -> list[dict[str, str]]:
    root = ET.parse(path).getroot()
    verses: list[dict[str, str]] = []
    for book in root.findall("book"):
        code = book.attrib.get("id", "")
        if code not in BOOKS:
            continue
        for row in parse_book(book):
            parts = row["bcv"].split(".")
            if len(parts) != 3:
                continue
            _, chapter, verse = parts
            row.update({
                "book": code,
                "chapter": chapter,
                "verse": verse,
                "ref": f"{BOOKS[code]} {chapter}:{verse}",
            })
            verses.append(row)
    return verses


def theme_and_score(text: str, book: str) -> tuple[str, int]:
    low = text.casefold().replace("’", "'")
    scores: dict[str, int] = {}
    for theme, needles in THEMES.items():
        score = 0
        for needle in needles:
            if re.search(needle, low, re.IGNORECASE):
                score += 9 if "\\b" in needle and " " in needle else 6
        scores[theme] = score
    theme = max(scores, key=scores.get)
    return theme, scores[theme] + BOOK_BONUS.get(book, 1)


def is_semantically_safe(theme: str, text: str) -> bool:
    low = text.casefold()
    # A lone “with you” often occurs in incidental narrative or letter closings.
    if theme == "presence" and not DIVINE.search(text):
        return False
    # Literal lamps, arrows and celestial descriptions are not useful daily anchors.
    if theme == "light" and not (
        DIVINE.search(text)
        or re.search(r"\b(truth|darkness|path|word|eternal life|abundant life)\b", low)
    ):
        return False
    if theme == "identity" and not DIVINE.search(text):
        return False
    return True


def select_year(verses: list[dict[str, str]], count: int = len(CURATED_REFS)) -> list[dict[str, str]]:
    candidates: list[dict[str, str | int]] = []
    seen_text: set[str] = set()
    for verse in verses:
        text = verse["text"]
        if verse["ref"] not in CURATED_REFS:
            continue
        if int(verse["chapter"]) not in SAFE_CHAPTERS.get(verse["book"], set()):
            continue
        if (
            not 55 <= len(text) <= 235
            or EXCLUDE.search(text)
            or FRAGMENT_START.search(text)
            or NARRATIVE.search(text)
            or "?" in text
            or text[-1] in ",;:"
        ):
            continue
        key = text.casefold()
        if key in seen_text:
            continue
        theme, score = theme_and_score(text, verse["book"])
        # A book bonus can rank good matches, but cannot create a match.
        if score - BOOK_BONUS.get(verse["book"], 1) < 9:
            continue
        if not is_semantically_safe(theme, text):
            continue
        if text.count("“") != text.count("”"):
            continue
        seen_text.add(key)
        candidates.append({**verse, "theme": theme, "score": score})

    candidates.sort(key=lambda item: (-int(item["score"]), item["bcv"]))
    selected: list[dict[str, str | int]] = []
    per_book: Counter[str] = Counter()
    per_chapter: Counter[str] = Counter()
    per_theme: Counter[str] = Counter()

    # Multiple passes widen the caps only if the strongest, balanced pass needs help.
    for book_cap, chapter_cap, theme_cap in ((36, 3, 42), (54, 4, 54), (80, 5, 72)):
        for item in candidates:
            if item in selected:
                continue
            book = str(item["book"])
            chapter = f"{book}.{item['chapter']}"
            theme = str(item["theme"])
            if per_book[book] >= book_cap or per_chapter[chapter] >= chapter_cap or per_theme[theme] >= theme_cap:
                continue
            selected.append(item)
            per_book[book] += 1
            per_chapter[chapter] += 1
            per_theme[theme] += 1
            if len(selected) == count:
                break
        if len(selected) == count:
            break

    if len(selected) != count:
        raise SystemExit(f"Could only select {len(selected)} suitable verses; expected {count}")

    # Canonical order in the data file makes it reviewable. Runtime rotation supplies variety.
    book_order = {code: index for index, code in enumerate(BOOKS)}
    selected.sort(key=lambda item: (book_order[str(item["book"])], int(item["chapter"]), int(item["verse"])))
    return [{key: str(item[key]) for key in ("ref", "text", "theme")} for item in selected]


def write_js(rows: list[dict[str, str]], output: Path) -> None:
    payload = json.dumps(rows, ensure_ascii=False, indent=2)
    output.write_text(
        "// Generated from the official public-domain World English Bible British Edition.\n"
        "// Regenerate with: python3 scripts/build_daily_verses.py SOURCE.xml daily-verses.js\n"
        f"const DAILY_VERSE_LIBRARY = {payload};\n",
        encoding="utf-8",
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--count", type=int, default=len(CURATED_REFS))
    args = parser.parse_args()
    verses = parse_usfx(args.source)
    rows = select_year(verses, args.count)
    write_js(rows, args.output)
    counts = Counter(row["theme"] for row in rows)
    print(f"Wrote {len(rows)} unique daily verses to {args.output}")
    print("Themes:", ", ".join(f"{name}={value}" for name, value in sorted(counts.items())))


if __name__ == "__main__":
    main()
