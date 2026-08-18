/* Said Assistant 3.0 — FINAL SMART MOBILE ENGINE V23
   One integrated client-side intelligence layer for the MOBILE_PUBLISH build.
   No paid AI/API is introduced. It strengthens intent, context, language,
   travel/time interpretation, memory actions, response formatting and
   device/app command handling around the existing V22 engine.
*/
(function(){
  'use strict';
  const KEY='saidAssistantFinalV23';
  const store={
    get(k,d=''){try{return localStorage.getItem(k)??d}catch{return d}},
    set(k,v){try{localStorage.setItem(k,v)}catch{}},
    json(k,d={}){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))||d}catch{return d}},
    put(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
  };
  const en=()=>window.SaidLanguage?.get?.()==='en';
  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
  const low=s=>clean(s).toLowerCase();
  const timeRe=/\b(?:klockan|kl\.?|at)\s*(\d{1,2})(?:[:.]([0-5]\d))?\b/i;
  const bareTimeRe=/^\s*(?:kl\.?\s*)?(\d{1,2})(?:[:.]([0-5]\d))?\s*$/i;

  function currentMessages(){
    try{return Array.isArray(window.__saidAssistantChatMessages)?window.__saidAssistantChatMessages:[];}catch{return []}
  }
  function profileHome(){
    const v=store.get('profileLocation','').trim();
    return v && v.toLowerCase()!=='stockholm' ? v : (v==='Stockholm' ? 'Stockholm' : '');
  }
  function explicitHome(text){
    const q=clean(text);
    const patterns=[
      /\b(?:jag\s+)?(?:bor|hemma)\s+(?:i|på)\s+(.+?)(?=\s+(?:och|men|samt|resan|flyget|flyg|den|det)\b|[?.!]|$)/i,
      /\b(?:min\s+)?hemort\s*(?:är|ar|=)\s*(.+?)(?=[?.!]|$)/i,
      /\b(?:jag\s+)?bor\s+(.+?)(?=[?.!]|$)/i
    ];
    for(const r of patterns){const m=q.match(r);if(m){let v=clean(m[1]).replace(/[,.!?]+$/,'');if(v&&v.length<80)return v;}}
    return '';
  }
  function rememberHome(text){
    const h=explicitHome(text); if(h){store.set('profileLocation',h); return h;}
    try{
      const msgs=Array.isArray(window.SaidUniversalContext?.recent?.(12))?window.SaidUniversalContext.recent(12):[];
      for(let i=msgs.length-1;i>=0;i--){const h2=explicitHome(msgs[i]);if(h2){store.set('profileLocation',h2);return h2;}}
    }catch{}
    return profileHome();
  }
  function travelActive(){
    try{
      const c=JSON.parse(store.get('saidAssistantTravelContextV22_'+(window.__saidAssistantCurrentChatId||''),'{}'))||{};
      return !!(c.from||c.to||c.flightDestination||c.home||c.time);
    }catch{return false}
  }
  function parseTime(text){
    const q=clean(text),m=q.match(timeRe)||q.match(bareTimeRe);if(!m)return '';
    return `${String(+m[1]).padStart(2,'0')}:${m[2]||'00'}`;
  }
  function hasTravelWords(text){return /\b(resa|resan|reser|åka|åker|flyg|flyget|flyga|flygplats|turkiet|arlanda|hemifrån|hemma|restid|bil|tåg|buss)\b/i.test(text)}
  function looksLikeTimeQuestion(text){
    const q=low(text);
    return /^(?:vad är|vad ar|hur mycket är|vilken tid är)?\s*(?:klockan|tiden)\??$/i.test(q) || /^(?:vad är|vad ar)\s+(?:klockan|tiden)/i.test(q);
  }
  function looksLikeTravelTimeStatement(text){
    return !!parseTime(text) && (hasTravelWords(text) || travelActive());
  }
  function localSave(text){
    const q=low(text);
    if(!/\b(spara|lägg in|lägg till|kom ihåg|kom ihag|påminn mig|minna mig|glöm inte)\b/.test(q))return null;
    const tm=parseTime(text), home=rememberHome(text);
    const event=store.json('saidAssistantFinalEventsV23',{});
    event.last={text:clean(text),time:tm,home,updatedAt:Date.now()};
    store.put('saidAssistantFinalEventsV23',event);
    return en() ? `Okay. I saved it${tm?` for ${tm}`:''}.` : `Okej. Jag har sparat det${tm?` till kl. ${tm}`:''}.`;
  }
  function localRecall(text){
    const q=low(text),event=store.json('saidAssistantFinalEventsV23',{}).last;
    if(!event)return null;
    if(/\b(påminn|minn|kommer du ihåg|kommer du ihag|vad sparade|vad har du sparat)\b/.test(q)){
      return en() ? `Yes. I remember the saved item${event.time?` at ${event.time}`:''}.` : `Ja. Jag kommer ihåg det sparade${event.time?` till kl. ${event.time}`:''}.`;
    }
    return null;
  }
  function formatWebText(text){
    let x=String(text||'').replace(/\r/g,'');
    x=x.replace(/https?:\/\/\S+/gi,'');
    x=x.replace(/\b(?:URL Source|Markdown Content)\s*:\s*/gi,'');
    x=x.replace(/\[([^\]]+)\]\([^)]*\)/g,'$1');
    x=x.replace(/\s{2,}/g,' ').trim();
    if(x.length>1600)x=x.slice(0,1597).trim()+'…';
    return x;
  }
  function localAnswer(text){
    const q=clean(text); if(!q)return null;
    const home=rememberHome(q);
    const save=localSave(q); if(save)return save;
    const recall=localRecall(q); if(recall)return recall;
    // Critical distinction: “kl 10” in an active travel conversation is a
    // departure time, not a request for the current clock time.
    if(looksLikeTravelTimeStatement(q))return null;
    if(looksLikeTimeQuestion(q))return null;
    return null;
  }
  function preprocess(text){
    const q=clean(text);
    const h=rememberHome(q);
    const tm=parseTime(q);
    if(tm && (hasTravelWords(q)||travelActive())){
      store.set('saidAssistantFinalFlightTimeV23',tm);
      if(h)store.set('saidAssistantFinalTravelHomeV23',h);
    }
    return q;
  }
  function classify(text){
    const q=low(text),tm=parseTime(text);
    return {
      travel:hasTravelWords(q)||travelActive(),
      travelTime:!!tm && (hasTravelWords(q)||travelActive()),
      currentTime:looksLikeTimeQuestion(q),
      save:/\b(spara|kom ihåg|påminn|lägg in)\b/.test(q),
      recall:/\b(vad sparade|kommer du ihåg|påminn mig|vad har du sparat)\b/.test(q),
      app:/\b(öppna|open)\b/.test(q),
      language:/\b(svenska|svenska språket|english|engelska|byta språk|byt språk)\b/.test(q)
    };
  }
  window.SaidFinalSmart={localAnswer,preprocess,classify,formatWebText,rememberHome,parseTime};
  window.addEventListener('DOMContentLoaded',()=>{
    // Re-apply the language layer after all page scripts have loaded.
    setTimeout(()=>window.SaidLanguage?.apply?.(),0);
  });
})();
