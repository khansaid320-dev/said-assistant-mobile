# Said Assistant 3.0 — iPhone voice/app integration

The published MOBILE_PUBLISH version can open supported app URL schemes when the user triggers the action from the web app.

## Important iPhone limitation
A normal Safari/PWA web app cannot register a system-wide wake phrase such as “Said Assistant” while the iPhone is locked, nor can it silently control other apps in the background. That requires a native iOS target using App Intents/Shortcuts and the appropriate Siri integration.

## What this release does
- Keeps the complete local PWA.
- Adds direct app-launch commands for common apps such as WhatsApp, TikTok, YouTube, Instagram, Messenger, Maps and Mail.
- Adds a Swedish/English language selector for the mobile interface and speech output.
- Preserves chat history, travel context, CV/job/letter/document functions and existing mobile files.

## Native future target
A separate native iOS shell can expose an App Intent such as “Open Said Assistant” and a Siri Shortcut phrase. The native shell should hand the request to the same local assistant engine rather than replacing the existing MOBILE_PUBLISH app.
