# Said Assistant 3.0 — FINAL V13 Universal Conversation + Travel Fix

This is the final mobile universal-intelligence update. Existing CV, jobs, letters, documents, voice, profile and chat systems remain in place.

## Fixed
- Natural-language questions no longer require an exact command phrase.
- Multi-turn travel conversations keep origin, destination, date, time and travel mode in the same chat.
- A fresh origin → destination question starts a new route instead of inheriting an old route.
- Flight conversations distinguish the airport route from the final country destination.
- Examples such as “Jag ska resa från Arlanda till Turkiet”, “Flyget är klockan 11 nästa vecka”, “Jag ska till Turkiet” and “Hur länge tar det från Upplands Väsby till Sollentuna med bil?” are handled as natural conversation.
- Driving routes use OpenStreetMap geocoding + OSRM when available.
- Walking results are clearly marked as estimates.
- Public transport searches use multiple current web queries and are shown in chat when sufficiently relevant.
- Current web answers still use relevance filtering and do not automatically open Google.
- Chat history is saved locally and mirrored to IndexedDB, with page-hide/unload persistence.
- Service-worker cache version is bumped so published phones receive the final code.

## Mobile Publisher
`MOBILE_PUBLISH` contains the synchronized final mobile files.

## Final reliability correction
- Fixed the missing travel route helper functions that could cause the assistant to stop without producing a response.
- Added natural single-word travel follow-ups using the existing conversation context.
- Added explicit visible answer/search progress and a 30-second timeout so the chat never waits silently forever.
- Preserved chat history recovery through IndexedDB and reopened the newest saved chat when the current-chat pointer is unavailable.
