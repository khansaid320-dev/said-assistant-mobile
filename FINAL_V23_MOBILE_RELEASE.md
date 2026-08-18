# Said Assistant 3.0 — FINAL V23

This is the single final package update. The existing project and MOBILE_PUBLISH files are retained.

## V23 fixes
- Fixed the language selector so the `<select>` is not destroyed when the language label is translated.
- Added a final smart mobile engine for context-aware intent, travel/time distinction, memory actions, clean web-response formatting and stronger bilingual handling hooks.
- A time such as “kl 10” during an active travel conversation is treated as the trip/flight time, not as a request for the current clock.
- Explicit home locations are remembered and preferred for travel context.
- Raw long URLs and search-page boilerplate are stripped from assistant-facing text where the final formatter is used.

## Package rule
Use this ZIP as one complete version. Do not copy individual files from older versions unless you are intentionally recovering a file.
