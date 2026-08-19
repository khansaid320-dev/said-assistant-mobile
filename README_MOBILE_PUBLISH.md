# Said Assistant 3.0 — Mobile Publish

This folder is the standalone GitHub Pages mobile client.

## V27.3 Safari/GitHub Pages fix
- Single JavaScript runtime to reduce startup requests.
- No service-worker registration in the new client.
- Old service workers are unregistered on startup.
- Cache-busting is used for the runtime and stylesheet so stale browser caches cannot keep the previous broken client.
- Personal profile fields start empty and are stored locally on the phone.
- All existing mobile capabilities are bundled into the runtime.
