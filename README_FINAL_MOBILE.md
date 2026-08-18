# Said Assistant 3.0 — FINAL Mobile Release

This folder is the final standalone mobile/PWA interface included in the complete project.

## Main workflow

1. Open the Assistant.
2. Say or type what you want.
3. For jobs, either:
   - say `Sök lagerjobb i Stockholm, heltid`, or
   - open **Sök jobb**, type a job title, choose area and employment type, then press **Sök jobb**.
4. The assistant shows a focused list of relevant advertisements.
5. Select a job.
6. Prepare the personal letter, adapt the CV, or prepare the application.
7. Open the real advertisement.

## Mobile storage

Profile, CV text, letter text and selected-job information are stored locally in the browser.

## Offline

The application shell and local functions continue to work without internet. Current job searches and other live information require internet.

## Desktop automation

The full desktop project remains in the parent archive. Static GitHub Pages cannot bypass employer-site browser security, CAPTCHA, authentication or cross-origin restrictions. The mobile interface therefore prepares and opens the application; the desktop Job Automation Engine handles the deeper browser workflow.


## V13 FINAL — Transport & Universal Intelligence
The publishable mobile client includes the project's Transport & körkort routing and the improved universal question/relevance layer directly in `app.js`. Use the files in this `MOBILE_PUBLISH` folder as the single mobile publishing set. The service worker cache is versioned V13 to force the updated client to load.


V13 FINAL UNIVERSAL/TRAVEL PATCH: natural-language travel routing, origin/destination extraction, walking/driving estimates, public-transit web lookup, stronger generic web fallback. Mobile Publisher includes universal-intelligence.js and transport-intelligence.js.


V13 FINAL: chat history is persistent across app restarts using local browser storage with an IndexedDB mirror. Chats remain available until the user explicitly deletes them.
