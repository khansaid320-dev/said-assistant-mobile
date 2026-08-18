# Said Assistant 3.0 — Mobile Publisher V15

This folder is the complete mobile publishing set. Copy/deploy the **whole folder** together.

## New universal layer
The assistant now keeps more conversational context and creates multiple relevant web-search variants instead of depending on one exact command. Follow-ups such as `Arlanda`, `nästa vecka`, `med bil`, or `och hur länge?` can be interpreted from the active conversation when the context supports it.

## Image questions
`universal-image.js` provides optional OCR using the free Tesseract.js browser library. The user can select an image, read its text, and send the extracted text into the assistant. The app does not claim visual understanding that it does not have; it clearly separates OCR text from true image interpretation.

## Everyday modules
- `universal-context.js` — conversation context and query variants
- `universal-image.js` — image OCR helper
- `universal-planner.js` — everyday travel/time helpers
- `universal-document.js` — local text document helper
- `universal-safety.js` — safety guard/disclaimer helper
- `universal-intelligence.js` — universal web/intelligence layer
- `transport-intelligence.js` — transport and driving-licence layer
- `app.js` — final mobile application

The existing CV, job, letter, document, voice, profile, chat-history and transport functionality remains part of the same mobile app.
