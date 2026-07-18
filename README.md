# Kayley’s World

A focused, mobile-first home for Kayley’s daily skincare routines, product
collection and Scripture study.

The app intentionally contains four destinations only: Home, Routine, Products
and Scripture. Retired diary, motivation, highlights and cognitive-tool pages
are not part of the current experience.

## Daily content

- `daily-verses.js` contains the hand-reviewed offline Verse of the Day library.
- The source text is the public-domain World English Bible, British Edition.
- `shared.js` merges those readings with the original detailed study library,
  keeps the chosen verse stable for the whole day and avoids repeats until the
  rotation is exhausted.
- The Hero page builds a dated daily affirmation from hand-written components;
  Kayley can request another without changing tomorrow’s default.

Regenerate the WEB library from an official USFX download:

```sh
python3 scripts/build_daily_verses.py path/to/eng-webbe_usfx.xml daily-verses.js
```

Verify the library and rotation:

```sh
node tests/daily-content.test.js
```

Source and licence: [World English Bible](https://ebible.org/study/content/texts/engwebp/about.html).
