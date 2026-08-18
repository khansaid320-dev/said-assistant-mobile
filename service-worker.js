const CACHE='said-assistant-mobile-final-v24';
const ASSETS=["./FINAL_SMART_MOBILE_ENGINE_V23.js","./FINAL_SMART_MOBILE_ENGINE_V24.js","./app.css","./app.js","./icon-180.png","./icon-512.png","./icon.svg","./index.html","./manifest.webmanifest","./service-worker.js","./transport-intelligence.js","./universal-app-actions-plus.js","./universal-calculator.js","./universal-capabilities.js","./universal-context-engine.js","./universal-context.js","./universal-conversation.js","./universal-device-actions.js","./universal-document-v24.js","./universal-document.js","./universal-file.js","./universal-image.js","./universal-intelligence.js","./universal-language-plus.js","./universal-language-v24.js","./universal-language.js","./universal-memory-plus.js","./universal-memory.js","./universal-news.js","./universal-planner.js","./universal-query.js","./universal-reminder-plus.js","./universal-reminders.js","./universal-research.js","./universal-route.js","./universal-safety-plus.js","./universal-safety.js","./universal-smart-help.js","./universal-smart-web.js","./universal-source-manager.js","./universal-time-planner.js"];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('message',e=>{if(e.data==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{
    const copy=r.clone(); caches.open(CACHE).then(ca=>ca.put(e.request,copy)); return r;
  }).catch(()=>caches.match('./index.html'))));
});