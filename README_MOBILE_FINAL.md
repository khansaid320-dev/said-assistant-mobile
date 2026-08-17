# Said Assistant 3.0 – FINAL MOBILE CLIENT

This folder is the standalone mobile client. It does NOT replace the complete desktop project.

## What it provides independently
- Mobile assistant UI
- Local profile storage
- CV editing, local import of text files, local CV checks and PDF export
- Personal-letter workspace and PDF export
- Job-search launchers for Google Jobs, Indeed, LinkedIn and Jobbsafari
- Document text editing and text/PDF export
- Web search through the phone's browser
- iPhone dictation fallback
- Text-to-speech where the browser supports it
- PWA/service-worker installation and offline app shell

## Important architecture
The desktop application remains the main Said Assistant 3.0 system. This mobile client is a separate mobile interface. It does not pretend to run Python/Tkinter or desktop browser automation on an iPhone.

To make this available when the computer is OFF, host THIS `mobile_independent/` folder on a permanent HTTPS static host (for example GitHub Pages). Once installed on the iPhone Home Screen, the mobile app does not require the desktop program to be running.

Current information and web searches require the iPhone's own internet connection.

## Install on iPhone
1. Publish this folder on HTTPS.
2. Open the URL in Safari.
3. Share -> Add to Home Screen -> Open as Web App -> Add.
4. Launch Said Assistant from the Home Screen.

The desktop project is untouched by this mobile client.


## FINAL V13 COMPLETE — unified assistant workspace

The complete V11 Said Assistant 3.0 project is retained in this archive. The existing mobile
client is updated as one continuous workspace.

Final mobile capabilities:
- conversation-first assistant on one page
- voice start/pause/resume/stop where browser speech recognition supports it
- speech playback with pause/resume/stop
- automatic CV-based multi-query job search
- manual job search with any job title
- whole Sweden or a custom area
- full-time / part-time / permanent / temporary filters
- sorting by CV match, newest or deadline
- choose job, open advertisement, prepare letter, adapt CV and prepare application
- complete local profile with full name, surname, date of birth, personal number, city and desired job
- local persistence for profile, CV, letter, selected job and search settings
- PWA/service-worker support
- no paid AI API key and no OpenAI dependency in the mobile client

All existing project folders/files from V11 remain in this ZIP.


V13 FINAL UNIVERSAL/TRAVEL PATCH: natural-language travel routing, origin/destination extraction, walking/driving estimates, public-transit web lookup, stronger generic web fallback. Mobile Publisher includes universal-intelligence.js and transport-intelligence.js.


V13 FINAL: chat history is persistent across app restarts using local browser storage with an IndexedDB mirror. Chats remain available until the user explicitly deletes them.
