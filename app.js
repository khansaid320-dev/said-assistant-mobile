
/* ===== MOBILE RUNTIME COMPONENT: universal-smart-web.js ===== */
/* Final universal web coordinator: multi-engine, concise, no raw URLs in answers. */
(function(){
  const sources=['Google','Bing','DuckDuckGo','Wikipedia','Yahoo','Brave'];
  const clean=s=>String(s||'').replace(/https?:\/\/\S+/gi,'').replace(/\s+/g,' ').trim();
  const unique=a=>{const seen=new Set();return a.filter(x=>{const k=clean(x.text).toLowerCase();if(!k||seen.has(k))return false;seen.add(k);return true})};
  function rank(q,rows){const words=q.toLowerCase().split(/[^a-zåäöéü0-9]+/).filter(x=>x.length>2);return unique(rows).map(x=>({...x,score:(x.score||0)+words.filter(w=>clean(x.text).toLowerCase().includes(w)).length/Math.max(1,words.length)})).sort((a,b)=>b.score-a.score)}
  function answer(q,rows){const r=rank(q,rows||[]).slice(0,5);if(!r.length)return null;const best=r.slice(0,3).map(x=>clean(x.text)).filter(x=>x.length>35);if(!best.length)return null;let text=best[0];if(best[1]&&best[1]!==best[0])text+=' '+best[1];if(best[2]&&best[2]!==best[0]&&best[2]!==best[1])text+=' '+best[2];text=clean(text);if(text.length>1100)text=text.slice(0,1097).trim()+'…';return {text,source:r.slice(0,3).map(x=>x.source).filter(Boolean).join(', '),sources:r.slice(0,3)};}
  window.SaidSmartWeb={sources,rank,answer,clean};
})();
/* ===== MOBILE RUNTIME COMPONENT: universal-context-engine.js ===== */
/* Final conversation context engine: topic, references, pending facts. */
(function(){
 const K='saidAssistantContextV22';
 const get=()=>{try{return JSON.parse(localStorage.getItem(K)||'{}')}catch{return{}}};
 const set=v=>{try{localStorage.setItem(K,JSON.stringify(v))}catch{}};
 function analyze(text,history){const q=String(text||'').trim();const h=(history||[]).map(x=>String(x||'')).slice(-8);const low=q.toLowerCase();let topic='general';if(/resa|flyg|arlanda|turkiet|restid|flygplats/.test(low))topic='travel';else if(/jobb|arbete|arbetsförmedlingen|cv|anställ/.test(low))topic='work';else if(/migrationsverket|uppehåll|medborgarskap|pass|skatteverket/.test(low))topic='government';else if(/taxi|körprov|trafik|körkort/.test(low))topic='transport';else if(/spara|kom ihåg|påminn|minna/.test(low))topic='memory';const vague=/^(det|den|där|här|samma|okej|nej|ja|den här|det här)\b/i.test(q)||/\b(den|det|där|här|samma)\b/i.test(low);return {topic,vague,history:h,query:q};}
 function save(c){set({...get(),...c,updatedAt:Date.now()});return get()}
 window.SaidContextEngine={analyze,save,get};
})();
/* ===== MOBILE RUNTIME COMPONENT: universal-source-manager.js ===== */
/* Source policy: use multiple independent sources and prefer authority when relevant. */
(function(){
 const official=['migrationsverket.se','arbetsformedlingen.se','skatteverket.se','forsakringskassan.se','trafikverket.se','transportstyrelsen.se','polisen.se','1177.se','regeringen.se','europa.eu'];
 function policy(q){const s=String(q||'').toLowerCase();const officialNeeded=official.some(d=>s.includes(d.replace('.se','')))||/regler|lag|myndighet|tillstånd|bidrag|ersättning|körprov|pass|migration/.test(s);return {officialNeeded,minSources:officialNeeded?2:2};}
 window.SaidSourceManager={official,policy};
})();
/* ===== MOBILE RUNTIME COMPONENT: universal-calculator.js ===== */
/* Free local calculations without web search. */
(function(){function calc(expr){let e=String(expr||'').replace(/,/g,'.').replace(/[^0-9+\-*/().% ]/g,'');if(!e)return null;try{if(/[^0-9+\-*/().% ]/.test(e))return null;const v=Function('"use strict";return ('+e+')')();return Number.isFinite(v)?v:null}catch{return null}}window.SaidCalculator={calc};})();
/* ===== MOBILE RUNTIME COMPONENT: universal-time-planner.js ===== */
/* Travel/time planning helpers. */
(function(){function toMin(t){const m=String(t||'').match(/(\d{1,2})(?::(\d{2}))?/);return m?Math.min(1439,+m[1]*60+(+(m[2]||0))):null}function fmt(m){m=(m+1440)%1440;return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0')}function departure(flightMinutes,travelMinutes,buffer=180){const x=toMin(flightMinutes);if(x==null)return null;return fmt(x-buffer-travelMinutes)}window.SaidTimePlanner={toMin,fmt,departure};})();
/* ===== MOBILE RUNTIME COMPONENT: universal-memory-plus.js ===== */
/* Explicit memory confirmations and recall helpers. */
(function(){const K='saidAssistantMemoryV22';const get=()=>{try{return JSON.parse(localStorage.getItem(K)||'[]')}catch{return[]}};function save(text){const a=get().filter(x=>x.text!==text);a.push({text:String(text),savedAt:Date.now()});try{localStorage.setItem(K,JSON.stringify(a.slice(-100)))}catch{}return true}function list(){return get()}window.SaidMemoryPlus={save,list};})();
/* ===== MOBILE RUNTIME COMPONENT: universal-reminder-plus.js ===== */
/* Local reminder planner; browser notifications still require permission. */
(function(){const K='saidAssistantRemindersV22';const get=()=>{try{return JSON.parse(localStorage.getItem(K)||'[]')}catch{return[]}};function add(text,at){const a=get();const r={id:Date.now(),text:String(text),at:at||'',done:false};a.push(r);localStorage.setItem(K,JSON.stringify(a));return r}function list(){return get().filter(x=>!x.done)}window.SaidReminderPlus={add,list};})();
/* ===== MOBILE RUNTIME COMPONENT: universal-app-actions-plus.js ===== */
/* Safe iOS/web app opening helpers. */
(function(){const map={whatsapp:'https://wa.me/',youtube:'https://www.youtube.com/',tiktok:'https://www.tiktok.com/',gmail:'https://mail.google.com/',outlook:'https://outlook.live.com/',instagram:'https://www.instagram.com/',facebook:'https://www.facebook.com/',maps:'https://maps.google.com/'};function open(name){const k=String(name||'').toLowerCase();const key=Object.keys(map).find(x=>k.includes(x));if(!key)return false;window.location.href=map[key];return true}window.SaidAppActionsPlus={open,map};})();
/* ===== MOBILE RUNTIME COMPONENT: universal-safety-plus.js ===== */
/* Final answer safety: do not invent certainty when sources conflict or are absent. */
(function(){function clean(text){return String(text||'').replace(/https?:\/\/\S+/gi,'').replace(/\bURL Source\b:?/gi,'').replace(/Markdown Content\s*:/gi,'').replace(/\s+/g,' ').trim()}function enough(rows){return Array.isArray(rows)&&rows.filter(x=>x&&x.text&&String(x.text).length>35).length>=1}window.SaidSafetyPlus={clean,enough};})();
/* ===== MOBILE RUNTIME COMPONENT: universal-language-plus.js ===== */
/* Full UI language marker used by final build. */
(function(){const K='saidAssistantLanguageV22';function get(){return localStorage.getItem(K)==='en'?'en':'sv'}function set(v){localStorage.setItem(K,v==='en'?'en':'sv');document.documentElement.lang=get();return get()}window.SaidLanguagePlus={get,set};})();
/* ===== MOBILE RUNTIME COMPONENT: universal-smart-help.js ===== */
/* Capability registry for the final universal assistant. */
(function(){window.SaidSmartCapabilities={items:['multi-source web research','conversation context','travel planning','memory','reminders','calculator','weather','news','documents','images','CV','jobs','government information','transport information','app opening','Swedish/English','source ranking','concise answer formatting']};})();
/* ===== MOBILE RUNTIME COMPONENT: universal-context.js ===== */
/* Said Assistant 3.0 — Universal Conversation Context
   Free/local-first helper. No API key. Keeps short conversational context and
   creates better search queries for fragments such as "Arlanda", "och imorgon?".
*/
(function(){
  const STOP=new Set('och jag du den det är en ett att till från med för på som vad hur varför vilken vilket var vart när om i av de ett jag ska vill kan har har vi gör göra min mitt min mamma bara också här där nu nästa'.split(' '));
  function clean(s){return String(s||'').replace(/\s+/g,' ').trim()}
  function words(s){return clean(s).toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu,' ').split(/\s+/).filter(x=>x.length>2&&!STOP.has(x))}
  function recent(limit=12){try{const a=window.chatState?.messages||[];return a.slice(-limit).map(x=>({role:x.role,text:clean(x.text)})).filter(x=>x.text)}catch{return[]}}
  function contextFor(query){
    const q=clean(query), history=recent(10), users=history.filter(x=>x.role==='user').map(x=>x.text);
    const last=users.slice(-5).join(' | ');
    const qWords=new Set(words(q));
    const useful=users.filter(x=>{const w=words(x);return w.some(v=>qWords.has(v))||/^(och|men|ja|nej|den|det|där|här|imorgon|i morgon|nästa|klockan|kl)/i.test(x)}).slice(-4);
    return {query:q,recent:history,lastUser:users.at(-1)||'',context:useful.join(' | '),searchText:clean([useful.join(' '),q].filter(Boolean).join(' '))};
  }
  function intent(q){
    const s=clean(q).toLowerCase();
    return {
      travel:/\b(resa|reser|åka|åker|flyg|flyga|bil|buss|tåg|tunnelbana|promenad|promenera|restid|hur långt|hur länge)\b/.test(s),
      health:/\b(huvudvärk|feber|hosta|förkyld|håravfall|tappar håret|smärta|ont|sjuk|läkare|medicin)\b/.test(s),
      news:/\b(nyhet|nyheter|senaste|idag|igår|imorgon|världen)\b/.test(s),
      law:/\b(lag|lagen|lagar|regel|regler|förordning|rättighet|förbud|tillåtet|krav)\b/.test(s),
      person:/\b(vem är|född|föddes|ålder|gammal|person)\b/.test(s),
      place:/\b(var ligger|var finns|adress|närmaste|nära|sjukhus|apotek|skola)\b/.test(s),
      job:/\b(jobb|arbete|anställning|lager|butik|chaufför|elektriker|cv)\b/.test(s)
    };
  }
  function queryVariants(q){
    const c=contextFor(q), i=intent(q), base=c.searchText||q, variants=[base];
    if(i.news)variants.unshift(base+' senaste Sverige');
    if(i.law)variants.unshift(base+' Sverige aktuell lag regler');
    if(i.health)variants.unshift(base+' 1177 vård råd');
    if(i.place)variants.unshift(base+' adress Sverige');
    if(i.travel)variants.unshift(base+' restid rutt Sverige');
    if(i.person)variants.unshift(base+' fakta ålder biografi');
    return [...new Set(variants)].slice(0,4);
  }
  window.SaidUniversalContext={recent,contextFor,intent,queryVariants};
})();

/* ===== MOBILE RUNTIME COMPONENT: universal-conversation.js ===== */
/* Universal Conversation Orchestrator V17 — local persistent facts, topic isolation. */
(function(){
const K='saidAssistantFactsV17',get=()=>{try{return JSON.parse(localStorage.getItem(K)||'{}')||{}}catch{return{}}},set=v=>{try{localStorage.setItem(K,JSON.stringify(v))}catch{}},clean=s=>String(s||'').replace(/\s+/g,' ').trim();
function profile(){return{name:clean(localStorage.getItem('profileName')||''),surname:clean(localStorage.getItem('profileSurname')||''),birthDate:clean(localStorage.getItem('birthDate')||''),personalNumber:clean(localStorage.getItem('profilePersonalNumber')||''),location:clean(localStorage.getItem('profileLocation')||''),address:clean(localStorage.getItem('profileAddress')||''),job:clean(localStorage.getItem('profileJob')||'')}}
function syncProfile(){const p=profile(),f=get();for(const k of ['name','surname','birthDate','personalNumber','job'])if(p[k])f[k]={value:p[k],updatedAt:Date.now()};if(p.location)f.home={value:p.location,updatedAt:Date.now()};if(p.address)f.address={value:p.address,updatedAt:Date.now()};set(f)}
function summary(){syncProfile();const f=get(),a=[];if(f.home?.value)a.push('Hemort: '+f.home.value);if(f.address?.value)a.push('Adress: '+f.address.value);if(f.exam?.value)a.push('Prov: '+f.exam.value+(f.exam.date?' den '+f.exam.date:'')+(f.exam.time?' kl. '+f.exam.time:''));return a.join(' | ')}
function shouldContinueTravel(q){
  const s=clean(q).toLowerCase();
  // Travel mode is activated by actual travel language, a route expression,
  // or a short answer that clearly continues an active travel conversation.
  // A stored travel context alone is NOT enough: a later unrelated question
  // (for example “Vad ska man göra på taxiprovet?”) must start its own topic.
  if(/\b(resa|reser|åka|åker|flyg|flyga|bil|buss|tåg|tunnelbana|promenera|gå|restid|hur länge|hur långt|flygplats|från .+ till |till .+ från )\b/.test(s))return true;
  if(/^\s*(?:det|den|det här|den här)\s+(?:är|ar)\s+.+$/i.test(s))return true;
  return /^(arlanda|turkiet|stockholm|solna|sollentuna|uppsala|upplands väsby|imorgon|i morgon|nästa vecka|\d{1,2}([:.]\d{2})?)$/i.test(s);
}
function answerProfileQuestion(q){const s=clean(q).toLowerCase(),p=profile();if(/\b(var bor jag|vart bor jag|vilken ort bor jag)\b/.test(s))return p.location?'Du bor i '+p.location+'.':'Jag har ingen sparad hemort ännu.';if(/\b(vilken adress|min adress|vad är min adress)\b/.test(s))return p.address?'Din sparade adress är '+p.address+(p.location?', '+p.location:'')+'.':'Jag har ingen sparad adress ännu.';if(/\b(vad heter jag|mitt namn)\b/.test(s))return [p.name,p.surname].filter(Boolean).join(' ')||'Jag har inget namn sparat ännu.';if(/\b(mitt personnummer|personnummer)\b/.test(s))return p.personalNumber?'Ditt sparade personnummer är '+p.personalNumber+'.':'Jag har inget personnummer sparat.';if(/\b(födelsedatum|när är jag född)\b/.test(s))return p.birthDate?'Ditt sparade födelsedatum är '+p.birthDate+'.':'Jag har inget födelsedatum sparat.';return null}
function answerMemoryQuestion(q){const s=clean(q).toLowerCase(),f=get();if(/\b(vad har vi pratat om|vad pratade vi om|vad kommer du ihåg|kommer du ihåg)\b/.test(s)){const r=(window.chatState?.messages||[]).filter(x=>x.role==='user').slice(-8).map(x=>x.text).filter(Boolean);return 'Jag kommer ihåg sparade uppgifter och den här chattens tidigare meddelanden.\n'+(summary()||'Inga särskilda uppgifter är sparade ännu.')+(r.length?'\nSenaste frågor: '+r.slice(-5).join(' • '):'')}if(/\b(vilket datum.*prov|när.*prov|när har jag.*prov|mitt.*taxi.*prov)\b/.test(s))return f.exam?.date?'Ditt sparade prov är '+(f.exam.value||'körprov')+' den '+f.exam.date+(f.exam.time?' kl. '+f.exam.time:'')+'.':'Jag har inget provdatum sparat ännu.';return null}
function observe(q){const s=clean(q),f=get();const home=s.match(/\b(?:jag\s+)?(?:bor|hemma)\s+(?:i|på)\s+(.+?)(?=\s+(?:och|men|nästa|imorgon|idag)\b|[?.!]|$)/i);if(home){const v=clean(home[1]);f.home={value:v,updatedAt:Date.now()};localStorage.setItem('profileLocation',v)}const addr=s.match(/\b(?:min\s+)?adress(?:en)?\s+(?:är|ar)\s+(.+?)(?=[?.!]|$)/i);if(addr){const v=clean(addr[1]);f.address={value:v,updatedAt:Date.now()};localStorage.setItem('profileAddress',v)}const ex=s.match(/\b(?:jag\s+har|jag ska ha|jag har bokat|jag har ett)\s+(.{0,60}?(?:körprov|körprovet|taxiprov|taxiprovet|teoriprov|prov))\b(?:.*?\b(20\d{2}[-/.]\d{1,2}[-/.]\d{1,2})\b)?(?:.*?\bkl(?:ockan)?\.?\s*(\d{1,2}(?::\d{2})?)\b)?/i);if(ex){f.exam={value:clean(ex[1]),date:ex[2]||'',time:ex[3]||'',updatedAt:Date.now()}}set(f);syncProfile()}
window.SaidConversation={profile,syncProfile,summary,shouldContinueTravel,answerProfileQuestion,answerMemoryQuestion,observe};
})();
/* ===== MOBILE RUNTIME COMPONENT: universal-memory.js ===== */
/* Said Assistant 3.0 — Durable conversation memory
   Local-first, per-chat. Stores useful facts/slots instead of replacing history.
*/
(function(){
  const KEY='saidAssistantUniversalMemoryV1';
  const S={get:(k,f='')=>{try{return localStorage.getItem(k)??f}catch{return f}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch{}}};
  function db(){try{return JSON.parse(S.get(KEY,'{}'))||{}}catch{return {}}}
  function save(x){S.set(KEY,JSON.stringify(x||{}))}
  function id(){return window.chatState?.id||'global'}
  function get(){const all=db();return all[id()]||{facts:{},slots:{},topics:[],updatedAt:0}}
  function put(m){const all=db();all[id()]={...m,updatedAt:Date.now()};save(all);return all[id()]}
  function clean(s){return String(s||'').replace(/\s+/g,' ').trim()}
  function observe(text){
    const q=clean(text), m=get(), l=q.toLowerCase();
    const home=q.match(/\b(?:jag\s+)?(?:bor|hemma)\s+(?:i|på)\s+(.+?)(?=\s+(?:och|men|nästa|imorgon|idag)\b|[?.!]|$)/i);
    if(home)m.facts.home=clean(home[1]);
    const time=l.match(/\b(?:kl(?:ockan)?\.?\s*)?(\d{1,2})(?::(\d{2}))\b/);if(time)m.slots.time=String(time[1]).padStart(2,'0')+':'+time[2];
    if(/\b(imorgon|i morgon)\b/.test(l))m.slots.date='imorgon';
    else if(/\bnästa vecka\b/.test(l))m.slots.date='nästa vecka';
    else if(/\bidag\b/.test(l))m.slots.date='idag';
    const from=q.match(/\bfrån\s+(.+?)(?=\s+till\s+|\s+med\s+|\s+kl\.?\s*\d|[?.!]|$)/i);if(from)m.slots.from=clean(from[1]);
    const to=q.match(/\btill\s+(.+?)(?=\s+med\s+|\s+kl\.?\s*\d|\s+(?:imorgon|i morgon|idag|nästa vecka)\b|[?.!]|$)/i);if(to)m.slots.to=clean(to[1]);
    const modes=[['driving',/\b(med|i)\s+(?:person)?bil\b|köra\s+bil/i],['walking',/\b(promenera|promenad|till fots|gå)\b/i],['transit',/\b(buss|tåg|tunnelbana|pendeltåg|kollektivtrafik|sl)\b/i],['flight',/\b(flyg|flyga|flygplan)\b/i]];
    for(const [name,re] of modes)if(re.test(q))m.slots.mode=name;
    const topicRules=[['travel',/\b(resa|reser|åka|åker|flyg|restid|hur länge|hur långt)\b/i],['jobs',/\bjobb|arbete|anställning|lagerarbete|cv\b/i],['transport',/\bkörkort|körprov|taxi|trafik|teoriprov|ykb\b/i],['news',/\bnyheter|senaste|världen\b/i],['law',/\blag|lagar|regel|regler|förordning\b/i],['health',/\bhuvudvärk|feber|hosta|smärta|läkare|sjuk\b/i],['document',/\bdokument|fil|pdf|brev\b/i]];
    for(const [name,re] of topicRules)if(re.test(q)){m.topics=[name,...(m.topics||[]).filter(x=>x!==name)].slice(0,6);break}
    return put(m);
  }
  function context(){return get()}
  function summary(){const m=get(),f=m.facts||{},s=m.slots||{};const bits=[];if(f.home)bits.push('hemort: '+f.home);if(s.from)bits.push('från: '+s.from);if(s.to)bits.push('till: '+s.to);if(s.date)bits.push('datum: '+s.date);if(s.time)bits.push('tid: '+s.time);if(s.mode)bits.push('färdsätt: '+s.mode);if(m.topics?.length)bits.push('ämnen: '+m.topics.slice(0,3).join(', '));return bits.join(' | ')}
  window.SaidUniversalMemory={observe,context,summary,clear:function(){const all=db();delete all[id()];save(all)}};
})();

/* ===== MOBILE RUNTIME COMPONENT: universal-query.js ===== */
/* Universal natural-language normalization and intent helpers. */
(function(){
  const aliases=[
    ['upplands väsby',['plansvesby','upplandsvasby','upplands väsby','upplands-väsby']],
    ['lagerarbete',['lagarbete','lager jobb','lagerjobb','lager arbete']],
    ['taxiprovet',['taxi prov','taxiprov','taxi körprov','taxikörprov']],
    ['personbil',['bilkörkort','b körkort','b-körkort']]
  ];
  function normalize(s){let q=String(s||'').replace(/[\u200B-\u200D\uFEFF]/g,'').replace(/\s+/g,' ').trim();for(const [canon,arr] of aliases){for(const a of arr)q=q.replace(new RegExp('\\b'+a.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','gi'),canon)}return q}
  function classify(q){const s=normalize(q).toLowerCase();return {
    travel:/\b(resa|reser|åka|åker|flyg|flyga|restid|hur länge|hur långt|från .+ till .+)/i.test(s),
    image:/\b(bild|foto|skärmdump|screenshot)\b/i.test(s),
    file:/\b(fil|pdf|dokument|word|text)\b/i.test(s),
    current:/\b(idag|igår|imorgon|senaste|aktuell|nu|2026)\b/i.test(s),
    question:/\?|\b(vad|hur|var|vem|vilken|vilket|varför|när|kan|ska|får|finns|är)\b/i.test(s),
    job:/\bjobb|arbete|anställning|lagerarbete|butik|chaufför|elektriker\b/i.test(s),
    transport:/\bkörkort|körprov|taxi|trafik|teoriprov|ykb\b/i.test(s),
    news:/\bnyhet|nyheter|senaste|världen\b/i.test(s)
  }}
  function expand(q,context=''){const n=normalize(q);const c=normalize(context);const out=[n];if(c&&/\b(den|det|där|här|samma|och|sen|då|nu)\b/i.test(n))out.unshift(n+' Kontext: '+c);if(classify(n).news)out.push(n+' senaste nyheter');if(classify(n).current)out.push(n+' aktuell information');return [...new Set(out)].slice(0,5)}
  window.SaidUniversalQuery={normalize,classify,expand};
})();

/* ===== MOBILE RUNTIME COMPONENT: universal-research.js ===== */
/* FINAL V22 multi-source public web research. Free/keyless; concise source-backed snippets. */
(function(){
 const timeout=10000;
 const clean=s=>String(s||'').replace(/https?:\/\/\S+/gi,'').replace(/<[^>]+>/g,' ').replace(/\[[^\]]*\]\([^)]*\)/g,' ').replace(/\s+/g,' ').trim();
 async function get(url){try{const r=await fetch(url,{headers:{accept:'text/plain,application/json'},signal:AbortSignal.timeout?.(timeout)});if(!r.ok)return '';return await r.text()}catch{return ''}}
 function sentences(t){return clean(t).split(/(?<=[.!?])\s+/).map(x=>x.trim()).filter(x=>x.length>45&&x.length<700)}
 async function ddg(q){const t=await get('https://api.duckduckgo.com/?q='+encodeURIComponent(q)+'&format=json&no_html=1&skip_disambig=0');try{const j=JSON.parse(t);return [...(j.RelatedTopics||[]).flatMap(x=>x.Topics||[]).map(x=>x.Text),j.AbstractText,j.Answer,j.Definition].filter(Boolean).map(x=>({text:clean(x),source:'DuckDuckGo'}))}catch{return[]}}
 async function jina(engine,q){const urls={Google:'https://r.jina.ai/https://www.google.com/search?q='+encodeURIComponent(q)+'&hl=sv',Bing:'https://r.jina.ai/https://www.bing.com/search?q='+encodeURIComponent(q)+'&setlang=sv-se',Yahoo:'https://r.jina.ai/https://search.yahoo.com/search?p='+encodeURIComponent(q),Brave:'https://r.jina.ai/https://search.brave.com/search?q='+encodeURIComponent(q)};const t=await get(urls[engine]);return sentences(t).slice(0,8).map(x=>({text:x,source:engine}))}
 async function wiki(q){const host=window.SaidLanguage?.get?.()==='en'?'en':'sv';const t=await get('https://r.jina.ai/https://'+host+'.wikipedia.org/w/index.php?search='+encodeURIComponent(q));return sentences(t).slice(0,6).map(x=>({text:x,source:'Wikipedia'}))}
 async function search(query){const q=String(query||'').trim();if(!q)return[];const tasks=[ddg(q),jina('Google',q),jina('Bing',q),jina('Yahoo',q),jina('Brave',q),wiki(q)];const all=(await Promise.all(tasks)).flat().filter(x=>x.text);const words=q.toLowerCase().split(/[^a-zåäöéü0-9]+/).filter(x=>x.length>2);for(const x of all){const h=x.text.toLowerCase();x.score=words.length?words.filter(w=>h.includes(w)).length/words.length:0}const seen=new Set();return all.filter(x=>{const k=x.text.toLowerCase();if(seen.has(k))return false;seen.add(k);return true}).sort((a,b)=>b.score-a.score).slice(0,18)}
 window.SaidUniversalResearch={search};
})();
/* ===== MOBILE RUNTIME COMPONENT: universal-route.js ===== */
/* Route intelligence: geocoding + driving + walking estimates. */
(function(){
  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
  async function geocode(place){const q=clean(place);if(!q)return null;for(const query of [q,q+', Sweden']){try{const r=await fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&accept-language=sv&q='+encodeURIComponent(query),{headers:{accept:'application/json'},signal:AbortSignal.timeout?.(8000)});if(!r.ok)continue;const rows=await r.json();if(rows?.length)return {lat:+rows[0].lat,lon:+rows[0].lon,name:rows[0].display_name||q};}catch{}}return null}
  async function driving(a,b){if(!a||!b)return null;try{const r=await fetch(`https://router.project-osrm.org/route/v1/driving/${a.lon},${a.lat};${b.lon},${b.lat}?overview=false`,{signal:AbortSignal.timeout?.(9000)});const j=await r.json();const x=j?.routes?.[0];return x?{seconds:x.duration,distanceKm:x.distance/1000}:null}catch{return null}}
  async function walking(a,b){if(!a||!b)return null;try{const r=await fetch('https://valhalla1.openstreetmap.de/route', {method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({locations:[{lat:a.lat,lon:a.lon},{lat:b.lat,lon:b.lon}],costing:'pedestrian',units:'kilometers'}),signal:AbortSignal.timeout?.(10000)});const j=await r.json();const x=j?.trip?.summary;return x?{seconds:x.time,distanceKm:x.length}:null}catch{return null}}
  function straight(a,b){const R=6371,rad=x=>x*Math.PI/180,dLat=rad(b.lat-a.lat),dLon=rad(b.lon-a.lon),v=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLon/2)**2;return R*2*Math.atan2(Math.sqrt(v),Math.sqrt(1-v))}
  window.SaidUniversalRoute={geocode,driving,walking,straight};
})();

/* ===== MOBILE RUNTIME COMPONENT: universal-news.js ===== */
/* Current-news helper using GDELT + public search fallback. */
(function(){
  async function search(query){
    const q=String(query||'').trim();
    if(!q)return null;
    try{
      const url='https://api.gdeltproject.org/api/v2/doc/doc?query='+encodeURIComponent(q)+'&mode=artlist&format=json&maxrecords=8&sort=datedesc';
      const r=await fetch(url,{signal:AbortSignal.timeout?.(9000)});
      if(!r.ok)return null;
      const j=await r.json();
      const arts=(j.articles||[]).map(a=>({title:a.title,url:a.url,date:a.seendate||a.date,domain:a.domain}));
      return arts.length?arts:null;
    }catch{return null}
  }
  window.SaidUniversalNews={search};
})();

/* ===== MOBILE RUNTIME COMPONENT: universal-file.js ===== */
/* Universal attachment reader for chat. Supports text formats locally and PDF via PDF.js. */
(function(){
  async function pdfText(file){
    if(!window.SaidPdfJs){try{window.SaidPdfJs=await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs');}catch{return ''}}
    const pdfjs=window.SaidPdfJs;
    if(!pdfjs?.getDocument)return '';
    try{const buf=await file.arrayBuffer();const doc=await pdfjs.getDocument({data:buf}).promise;let out='';for(let i=1;i<=doc.numPages;i++){const p=await doc.getPage(i),c=await p.getTextContent();out+=c.items.map(x=>x.str).join(' ')+'\n';if(out.length>30000)break}return out.trim()}catch{return ''}
  }
  async function read(file){if(!file)return '';const ext=(file.name.split('.').pop()||'').toLowerCase();if(['txt','md','csv','json','html','htm','xml','rtf'].includes(ext))return await file.text();if(ext==='pdf')return await pdfText(file);return ''}
  window.SaidUniversalFile={read,isText:f=>!!f&&/\.(txt|md|csv|json|html?|xml|rtf|pdf)$/i.test(f.name)};
})();

/* ===== MOBILE RUNTIME COMPONENT: universal-reminders.js ===== */
/* Local reminder engine. Reliable while the PWA is open; OS push while fully closed requires a push backend. */
(function(){
  const KEY='saidAssistantRemindersV1';
  const get=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []}};
  const put=x=>{try{localStorage.setItem(KEY,JSON.stringify(x))}catch{}};
  async function permission(){if(!('Notification' in window))return 'unsupported';if(Notification.permission==='default')return await Notification.requestPermission();return Notification.permission}
  function add(reminder){const list=get();const r={id:'rem_'+Date.now(),text:String(reminder.text||'Påminnelse'),at:Number(reminder.at),done:false};list.push(r);put(list);return r}
  function remove(id){put(get().filter(x=>x.id!==id))}
  async function tick(){const now=Date.now(),list=get();for(const r of list.filter(x=>!x.done&&x.at<=now)){r.done=true;const p=await permission();if(p==='granted')new Notification('Said Assistant – påminnelse',{body:r.text});else if(document.visibilityState==='visible')alert('⏰ '+r.text)}put(list)}
  setInterval(tick,15000);document.addEventListener('visibilitychange',tick);
  window.SaidReminders={add,remove,list:get,permission,tick};
})();

/* ===== MOBILE RUNTIME COMPONENT: universal-capabilities.js ===== */
/* Capability registry: makes the mobile build self-describing and debuggable. */
window.SaidAssistantCapabilities={version:'V14-FINAL-SUPER-UNIVERSAL',modules:[
  'conversation-memory','natural-language-query-routing','multi-source-web-research','travel-routing','transport-and-driving-licences','current-news','image-ocr','file-reading','document-tools','local-reminders','voice-input','speech-output','chat-history','cv','jobs','personal-letter','profile'
],limits:['No paid AI API is required. Web retrieval depends on internet and public endpoints. OS push notifications while the app is completely closed require a push service.']};

/* ===== MOBILE RUNTIME COMPONENT: universal-image.js ===== */
/* Said Assistant 3.0 — Free image text/OCR helper. Uses Tesseract.js only when
   the user asks to read an image. No API key. Visual interpretation beyond text
   is deliberately not claimed; extracted text can be sent to the universal chat. */
(function(){
  let loaded=null;
  async function load(){
    if(window.Tesseract)return window.Tesseract;
    if(loaded)return loaded;
    loaded=new Promise((resolve,reject)=>{
      const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
      s.onload=()=>resolve(window.Tesseract);s.onerror=reject;document.head.appendChild(s);
    });
    return loaded;
  }
  async function read(file,onProgress){
    if(!file)throw new Error('Ingen bild vald.');
    const T=await load();
    const r=await T.recognize(file,'swe+eng',{logger:m=>{if(m?.status&&onProgress)onProgress(m)}});
    return String(r?.data?.text||'').trim();
  }
  function questions(text){
    return String(text||'').split(/\n+/).map(x=>x.trim()).filter(x=>x.length>4&&(/[?？]$/.test(x)||/^(vad|hur|var|när|varför|vilken|vilket|vem|kan|ska|är)\b/i.test(x)));
  }
  window.SaidImageTools={read,questions};
})();

/* ===== MOBILE RUNTIME COMPONENT: universal-planner.js ===== */
/* Everyday planner: small, deterministic helpers for dates, reminders and travel preparation. */
(function(){
  function parseTime(s){const m=String(s||'').match(/\b(?:kl(?:ockan)?\s*)?(\d{1,2})(?::(\d{2}))?\b/i);return m?`${String(m[1]).padStart(2,'0')}:${String(m[2]||'00').padStart(2,'0')}`:''}
  function dateWord(s){const q=String(s||'').toLowerCase();if(/i morgon|imorgon/.test(q))return 'i morgon';if(/nästa vecka/.test(q))return 'nästa vecka';if(/idag/.test(q))return 'idag';return ''}
  function travelChecklist(text){const q=String(text||'').toLowerCase();if(!/resa|flyg|flyga/.test(q))return null;return '✈️ Resplan\n• Kontrollera avgångstid och flygplats.\n• Räkna restid från startplatsen till flygplatsen.\n• Lägg till extra marginal för trafik, incheckning och säkerhetskontroll.\n• Ta med biljett/boardingkort och giltig resehandling.\n• Jag kan fortsätta när du anger datum, tid och färdsätt.'}
  window.SaidPlanner={parseTime,dateWord,travelChecklist};
})();

/* ===== MOBILE RUNTIME COMPONENT: universal-document.js ===== */
/* Document helper: local text extraction for common text formats. */
(function(){
  async function text(file){
    if(!file)return '';
    const ext=(file.name.split('.').pop()||'').toLowerCase();
    if(['txt','md','csv','json','html','htm'].includes(ext))return await file.text();
    return '';
  }
  window.SaidDocumentTools={text};
})();

/* ===== MOBILE RUNTIME COMPONENT: universal-safety.js ===== */
/* Safety guard for universal answers. It does not diagnose. */
(function(){
  window.SaidSafety={isUrgent:function(q){return /\b(plötslig|svårt att andas|medvetslös|kramper|stroke|bröstsmärta|allvarlig skada)\b/i.test(String(q||''))},
    disclaimer:function(){return 'Detta är allmän information och ersätter inte professionell bedömning.'}};
})();

/* ===== MOBILE RUNTIME COMPONENT: universal-intelligence.js ===== */
/* Said Assistant 3.0 — Mobile Universal Intelligence
   V13 FINAL / Universal Natural-Language Patch
   The production router remains bundled in app.js so the app works as a
   single static mobile client. This module exposes the capability/version
   marker used by Mobile Publisher. */
window.SaidAssistantMobileModules = window.SaidAssistantMobileModules || {};
window.SaidAssistantMobileModules.universal = {
  version: "V14-FINAL-SUPER-UNIVERSAL",
  capabilities: [
    "natural-language routing",
    "multi-turn conversation context",
    "question intent detection",
    "relevance filtering",
    "web research",
    "travel intent extraction",
    "origin/destination context",
    "driving distance and duration",
    "walking estimates",
    "public-transit web lookup",
    "flight-trip clarification",
    "durable conversation memory",
    "multi-source research",
    "current-news retrieval",
    "file attachments",
    "image OCR",
    "local reminders",
    "route/geocoding helpers"
  ]
};

/* ===== MOBILE RUNTIME COMPONENT: transport-intelligence.js ===== */
/* Said Assistant 3.0 — Mobile Transport Intelligence
   V13 FINAL / Transport + Universal Travel integration. */
window.SaidAssistantMobileModules = window.SaidAssistantMobileModules || {};
window.SaidAssistantMobileModules.transport = {
  version: "V13-FINAL-TRANSPORT-INTELLIGENCE",
  capabilities: [
    "B-körkort","taxi","buss","lastbil","släp","MC","YKB",
    "teori","riskutbildning","körprov","trafiksäkerhet",
    "natural-language transport questions"
  ]
};

/* ===== MOBILE RUNTIME COMPONENT: universal-language.js ===== */
/* Said Assistant 3.0 — universal language layer (SV/EN). */
(function(){
  const KEY='saidAssistantLanguageV21';
  const S=window.SaidStore||{get:(k,f='')=>{try{return localStorage.getItem(k)??f}catch{return f}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch{}}};
  const dict={
    'sv':{
      assistant:'Assistent',jobs:'Jobb',cv:'CV',letter:'Brev',documents:'Dokument',images:'Bild',profile:'Profil',
      language:'Språk',swedish:'Svenska',english:'English',send:'Skicka',talk:'Prata',read:'Läs svar',pause:'Pausa',resume:'Fortsätt',
      apps:'Appar',open:'Öppna',ready:'Klar',online:'Online',offline:'Offline – lokalt läge',
      hello:'Hej Said! 👋 Jag är redo. Du kan skriva eller prata med mig.'
    },
    'en':{
      assistant:'Assistant',jobs:'Jobs',cv:'CV',letter:'Letter',documents:'Documents',images:'Image',profile:'Profile',
      language:'Language',swedish:'Swedish',english:'English',send:'Send',talk:'Talk',read:'Read answer',pause:'Pause',resume:'Resume',
      apps:'Apps',open:'Open',ready:'Ready',online:'Online',offline:'Offline – local mode',
      hello:'Hi Said! 👋 I am ready. You can type or speak to me.'
    }
  };
  function lang(){return S.get(KEY,'sv')==='en'?'en':'sv'}
  function setLang(v){const l=v==='en'?'en':'sv';S.set(KEY,l);document.documentElement.lang=l==='en'?'en':'sv';apply();return l}
  function t(k){return dict[lang()][k]||dict.sv[k]||k}
  function apply(){
    const l=lang();
    const sel=document.querySelector('#languageSelect'); if(sel)sel.value=l;
    const nav=document.querySelectorAll('.main-nav a');
    const keys=['assistant','jobs','cv','letter','documents','images','profile'];
    nav.forEach((a,i)=>{if(keys[i])a.textContent=(i===0?'💬 ':i===1?'💼 ':i===2?'📄 ':i===3?'✉️ ':i===4?'📁 ':i===5?'🖼️ ':'👤 ')+t(keys[i])});
    const labels={
      '#send':'send','#mic':'talk','#readLast':'read','#pauseAll':'pause','#resumeAll':'resume',
      '#appsTitle':'apps'
    };
    for(const [sel,key] of Object.entries(labels)){const e=document.querySelector(sel);if(e)e.textContent=t(key)}
    // IMPORTANT: never replace #languageLabel.textContent because the <select>
    // lives inside that label. Doing so removes the actual language selector.
    const languageLabel=document.querySelector('#languageLabel');
    if(languageLabel){
      const first=languageLabel.firstChild;
      if(first && first.nodeType===Node.TEXT_NODE) first.nodeValue=t('language');
      else languageLabel.insertBefore(document.createTextNode(t('language')),languageLabel.firstChild||null);
    }
    document.querySelectorAll('[data-lang-sv]').forEach(e=>e.textContent=t('swedish'));
    document.querySelectorAll('[data-lang-en]').forEach(e=>e.textContent=t('english'));
    document.querySelectorAll('[data-lang-title]').forEach(e=>{
      if(e.id!=='languageLabel') e.setAttribute('title',t('language'));
    });
    if(typeof window.updateLanguageSpeech==='function')window.updateLanguageSpeech();
  }
  window.SaidLanguage={get:lang,set:setLang,t,apply};
  window.addEventListener('DOMContentLoaded',()=>{const s=document.querySelector('#languageSelect');if(s)s.addEventListener('change',()=>setLang(s.value));apply()});
})();

/* ===== MOBILE RUNTIME COMPONENT: universal-device-actions.js ===== */
/* Said Assistant 3.0 — safe mobile app launch layer. */
(function(){
  const apps={
    whatsapp:{name:'WhatsApp',scheme:'whatsapp://send',web:'https://wa.me/'},
    tiktok:{name:'TikTok',scheme:'tiktok://',web:'https://www.tiktok.com/'},
    youtube:{name:'YouTube',scheme:'youtube://',web:'https://www.youtube.com/'},
    instagram:{name:'Instagram',scheme:'instagram://',web:'https://www.instagram.com/'},
    facebook:{name:'Facebook',scheme:'fb://',web:'https://www.facebook.com/'},
    messenger:{name:'Messenger',scheme:'fb-messenger://',web:'https://m.me/'},
    maps:{name:'Kartor',scheme:'maps://',web:'https://maps.apple.com/'},
    mail:{name:'Mail',scheme:'mailto:',web:'mailto:'}
  };
  function key(q){const s=String(q||'').toLowerCase();for(const [k,v] of Object.entries(apps)){if(s.includes(k)||s.includes(v.name.toLowerCase()))return k}return null}
  function open(name){const k=key(name);if(!k)return false;const a=apps[k];
    try{window.location.href=a.scheme;setTimeout(()=>{if(document.visibilityState==='visible'&&a.web)window.location.href=a.web},900);return a.name}catch{return false}}
  function detect(text){const q=String(text||'').toLowerCase();if(!/\b(öppna|oppna|starta|launch|open)\b/.test(q))return null;return key(q)}
  window.SaidDeviceActions={apps,open,detect};
})();

/* ===== MOBILE RUNTIME COMPONENT: universal-language-v26.js ===== */
/* Said Assistant 3.0 — FINAL V26 complete language system. */
(function(){
'use strict';
const KEY='saidAssistantLanguageV26';
const S={get(k,d=''){try{return localStorage.getItem(k)??d}catch{return d}},set(k,v){try{localStorage.setItem(k,v)}catch{}}};
const EN={
'Said Assistant 3.0 Mobile V13 · Fristående klient · gratis · inga betalda AI-tjänster eller API-nycklar.':'Said Assistant 3.0 Mobile · Standalone client · free · no paid AI services or API keys.',
'Din smarta mobilassistent':'Your smart mobile assistant','Fristående · fungerar utan dator · samtal · CV · jobb · brev · dokument':'Standalone · works without a computer · chat · CV · jobs · letters · documents','Fristående':'Standalone','Språk':'Language','Svenska':'Swedish','English':'English','Assistent':'Assistant','Jobb':'Jobs','Brev':'Letter','Dokument':'Documents','Bild':'Image','Profil':'Profile','Ny chatt':'New chat','Mina chattar':'My chats','Sparas automatiskt':'Saved automatically','Skicka':'Send','Prata':'Talk','Bild/fil':'Image/file','Läs svar':'Read answer','Pausa':'Pause','Fortsätt':'Resume','Klar':'Ready','Snabbkommandon':'Quick commands','Fler jobb':'More jobs','Förbered ansökan':'Prepare application','Anpassa CV':'Adapt CV','Skriv brev':'Write letter','Klockan':'Time','Appar':'Apps','Pågående uppgift':'Current task','Ingen uppgift just nu.':'No task right now.','Sök jobb':'Search jobs','Smart jobbsökning':'Smart job search','Sök jobb åt mig':'Search jobs for me','Sök själv':'Search myself','Vilket jobb vill du söka?':'What job do you want to search for?','Område':'Location','Snabbval område':'Quick location','Anställning':'Employment','Sortera':'Sort','Bäst matchning':'Best match','Nyast':'Newest','Senaste ansökningsdag':'Latest application deadline','Visa fler':'Show more','Rensa':'Clear','Uppdatera':'Refresh','Öppna Google Jobs':'Open Google Jobs','Inget jobb valt ännu.':'No job selected yet.','Inga jobb hämtade ännu.':'No jobs loaded yet.','Min profil':'My profile','Fullständigt namn':'Full name','Personnummer':'Personal number','Födelsedatum':'Date of birth','Förnamn':'First name','Efternamn':'Last name','Ort':'City','Adress':'Address','Önskad jobbtitel':'Desired job title','Spara profil':'Save profile','Profilen sparas bara lokalt på telefonen.':'Your profile is saved locally on this phone only.','Mitt CV':'My CV','Analysera':'Analyze','Spara CV':'Save CV','Skapa PDF':'Create PDF','Ladda ner CV':'Download CV','Personligt brev':'Personal letter','Spara brev':'Save letter','Förbättra':'Improve','Bildfrågor':'Image questions','Läs och analysera bild':'Read and analyze image','Lägg texten i chatten':'Put text in chat','Ingen bild analyserad.':'No image analyzed.','Öppna':'Open','Spara text':'Save text','Läs upp':'Read aloud','Inget dokument öppnat.':'No document opened.','Öppna dokument':'Open document','Spara redigerad PDF':'Save edited PDF','Nytt dokument':'New document','Ångra ändring':'Undo change','Hela Sverige':'All Sweden','Alla':'All','Heltid':'Full-time','Deltid':'Part-time','Tillsvidare':'Permanent','Tidsbegränsad':'Temporary','Jobbtitel':'Job title','Företag':'Company','Text som hittades i bilden…':'Text found in the image…','Klistra in ditt CV här…':'Paste your CV here…','Personligt brev…':'Personal letter…','Dokumentets text…':'Document text…','Du kan bifoga en bild eller fil direkt i chatten.':'You can attach an image or file directly in the chat.','Skriv eller prata direkt med assistenten. Du behöver inte lämna sidan för att söka jobb, välja jobb eller förbereda CV och personligt brev.':'Type or speak directly with the assistant. You do not need to leave the page to search for jobs, choose jobs, or prepare a CV and personal letter.','Lägg in CV:t en gång. Assistenten använder det vid jobbsökning.':'Add your CV once. The assistant uses it when searching for jobs.','Assistenten kan fylla jobbtitel och företag från valt jobb.':'The assistant can fill in the job title and company from the selected job.','Här sparar du dina riktiga personuppgifter som assistenten använder när CV, brev och ansökan förbereds.':'Here you save your personal details that the assistant uses when preparing CVs, letters and applications.','Profilen är sparad lokalt. Jag använder uppgifterna när jag förbereder CV, brev och ansökan.':'The profile is saved locally. I use the information when preparing CVs, letters and applications.','CV importerat. Tryck ”Spara CV” när du är nöjd.':'CV imported. Press “Save CV” when you are satisfied.','Skicka en bild med text eller frågor. Assistenten läser texten och visar den tydligt i chatten. Du kan sedan be den svara på frågorna.':'Send an image with text or questions. The assistant reads the text and displays it clearly in the chat. You can then ask it to answer the questions.','Skriv själv eller använd assistenten ovan.':'Type yourself or use the assistant above.','＋ Ny chatt':'＋ New chat','🗂 Mina chattar':'🗂 My chats','🌐 Öppna Öppna Google Jobs':'🌐 Open Google Jobs','🔊 Läs upp':'🔊 Read aloud','💾 Spara text':'💾 Save text','📄 Skapa PDF':'📄 Create PDF','💾 Spara redigerad PDF':'💾 Save edited PDF','🆕 Nytt dokument':'🆕 New document','↩️ Ångra ändring':'↩️ Undo change','✏️ Öppna och redigera CV':'✏️ Open and edit CV','💾 Spara CV-ändringar':'💾 Save CV changes','📄 Skapa ny PDF':'📄 Create new PDF','🧠 Läs flera bilder':'🧠 Analyze multiple images','💬 Lägg alla bilder i chatten':'💬 Put all images in chat','🧹 Rensa bilder':'🧹 Clear images','Ingen bild vald.':'No image selected.','Välj en bild först.':'Choose an image first.','Välj en fil först.':'Choose a file first.','Ändringarna har sparats.':'Changes saved.','Alla CV-ändringar är sparade lokalt.':'All CV changes are saved locally.','Ny PDF skapad från dina sparade CV-ändringar.':'A new PDF was created from your saved CV changes.','CV öppnat och redigerbart. Du kan ändra allt direkt i rutan.':'CV opened and editable. You can change everything directly in the editor.','Dokumentet öppnades och är redigerbart. Du kan ändra texten och sedan skapa en ny PDF.':'The document is open and editable. You can change the text and then create a new PDF.','Bildanalysen är klar.':'Image analysis is complete.','Jag hittade ingen tydlig text i bilden.':'I could not find clear text in the image.','Flera bilder är klara. Jag kan använda texten från alla bilder tillsammans.':'Multiple images are ready. I can use the text from all images together.','Sökningen är rensad.':'The search has been cleared.','Redo för en ny jobbsökning. Välj yrke, område och anställning.':'Ready for a new job search. Choose a job, location and employment type.','Kunde inte läsa dokumentet.':'Could not read the document.','Filen kunde öppnas men ingen redigerbar text kunde läsas.':'The file could be opened, but no editable text could be extracted.','Det finns ingen text att spara.':'There is no text to save.','CV:t är tomt.':'The CV is empty.','Jag kunde inte slutföra svaret just nu. Försök igen så fortsätter jag i samma chatt.':'I could not complete the answer right now. Try again and I will continue in the same chat.','Jag fick ett tekniskt fel när jag försökte hitta svaret. Jag har inte raderat din fråga eller chatthistorik. Försök igen så fortsätter vi härifrån.':'I got a technical error while trying to find the answer. I did not delete your question or chat history. Try again and we will continue here.','Jag förstår frågan och letar efter ett relevant svar…':'I understand the question and I am looking for a relevant answer…','🔎 Söker och analyserar…':'🔎 Searching and analyzing…','Jag öppnar':'Opening','nu.':'now.','Jag kunde inte öppna':'I could not open','från den här webbläsaren.':'from this browser.','Ja, jag är kvar.':'Yes, I am here.','Jag är kvar.':'I am here.','Jag har sparat':'I saved','Okej. Jag har sparat':'Okay. I saved','Jag har lagt in en påminnelse':'I added a reminder','Jag har pausat det som pågår.':'I paused the current task.','Jag fortsätter där det går.':'I will continue where possible.','Klockan är':'The time is','Idag är det':'Today is','Du är':'You are','år gammal.':'years old.','Jag har ingen sparad hemort ännu.':'I do not have a saved home location yet.','Jag förstår.':'I understand.','Jag har valt jobb':'I selected job','Jag har hämtat fler jobb.':'I fetched more jobs.','relevanta jobb.':'relevant jobs.','Jag har förberett CV-anpassningen':'I prepared the CV adaptation','Jag har skrivit ett första personligt brev':'I wrote a first draft of the personal letter','Jag har sökt':'I searched for','och hittade':'and found','Jag kunde inte':'I could not','Skriv eller säg en fråga.':'Type or say a question.','Jag förstår frågan.':'I understand the question.','Jag är offline.':'I am offline.','Aktuell webbinformation kräver internet.':'Current web information requires an internet connection.','Klar.':'Ready.','Pausad.':'Paused.','Stoppad.':'Stopped.','Fortsätter.':'Continuing.','Uppläsning stöds inte i den här webbläsaren':'Read aloud is not supported in this browser','Inget svar att läsa upp':'There is no answer to read aloud','Kunde inte läsa upp svaret':'Could not read the answer aloud','Välj ditt CV först.':'Choose your CV first.','Kunde inte läsa CV-filen.':'Could not read the CV file.','Senaste ändringarna har ångrats.':'The latest changes have been undone.','Texten sparades.':'Text saved.','Bildfilen kunde inte omvandlas till redigerbar text utan OCR.':'The image could not be converted to editable text without OCR.','Bildinnehåll kan inte omvandlas till redigerbar text utan OCR.':'Image content cannot be converted to editable text without OCR.'
};
// Swedish source -> English; reverse map is intentionally generated for exact static nodes.
const SV={};Object.keys(EN).forEach(k=>SV[EN[k]]=k);
const EXTRA={
'. Google Jobs öppnas bara när du väljer knappen.':'. Google Jobs opens only when you choose the button.',
'Du kan antingen säga':'You can either say',
'Hej Said! 👋 Jag är redo. Du kan skriva eller prata med mig. Säg till exempel:':'Hi Said! 👋 I am ready. You can type or speak to me. For example:',
'Jag hämtar aktuella jobb, filtrerar dem och rangordnar dem mot ditt CV.':'I fetch current jobs, filter them and rank them against your CV.',
'Prata med assistenten eller sök själv. Du väljer jobb, område och anställningsform.':'Talk to the assistant or search yourself. You choose the job, location and employment type.',
'Säg eller skriv till exempel: ”Öppna WhatsApp”. På iPhone försöker assistenten öppna appen direkt.':'Say or type for example: “Open WhatsApp”. On iPhone the assistant tries to open the app directly.',
'Säg till exempel:':'For example:',
'så söker assistenten åt dig, eller fylla i fälten själv och trycka':'the assistant will search for you, or fill in the fields yourself and press',
'”Sök jobb enligt mitt CV i Stockholm.”':'“Search for jobs using my CV in Stockholm.”',
'”Sök lagerarbete i Stockholm, heltid.”':'“Search for warehouse work in Stockholm, full-time.”',
'”Sök lagerjobb i Stockholm, heltid”':'“Search for warehouse jobs in Stockholm, full-time”',
'▶️ Fortsätt':'▶️ Resume','● Fristående':'● Standalone','✨ Förbättra':'✨ Improve','🌐 Öppna Google Jobs':'🌐 Open Google Jobs','💬 Lägg texten i chatten':'💬 Put text in chat','💼 Sök jobb':'💼 Search jobs','💼 Sök jobb enligt CV':'💼 Search jobs using CV','💼 Sök jobb åt mig':'💼 Search jobs for me','📂 Öppna':'📂 Open','📋 Förbered ansökan':'📋 Prepare application','🔊 Läs svar':'🔊 Read answer','🔎 Sök jobb':'🔎 Search jobs','🔎 Sök själv':'🔎 Search yourself','🖼️ Bildfrågor':'🖼️ Image questions','🤖 Smart jobbsökning':'🤖 Smart job search','🧠 Läs och analysera bild':'🧠 Read and analyze image','🧠 Pågående uppgift':'🧠 Current task','🧠 Sök enligt mitt CV':'🧠 Search using my CV'
};
Object.assign(EN,EXTRA);Object.keys(EXTRA).forEach(k=>SV[EXTRA[k]]=k);

function get(){const v=S.get(KEY,S.get('saidAssistantLanguageV25',S.get('saidAssistantLanguageV24','sv')));return v==='en'?'en':'sv'}
function t(x){if(x==null)return x;const s=String(x);return get()==='en'?(EN[s]??s):(SV[s]??s)}
function shouldSkip(el){return !el||el.closest('.bubble.user')||el.closest('#chatHistoryPanel')||el.closest('input,textarea,[contenteditable="true"]')}
function apply(){
 const l=get();document.documentElement.lang=l;document.documentElement.dir='ltr';document.documentElement.dataset.assistantLanguage=l;
 const root=document.body;if(!root)return;
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const ns=[];let n;while(n=w.nextNode())ns.push(n);
 ns.forEach(node=>{const p=node.parentElement;if(shouldSkip(p))return;const raw=node.nodeValue.trim();if(!raw)return;const tr=t(raw);if(tr!==raw)node.nodeValue=node.nodeValue.replace(raw,tr)});
 document.querySelectorAll('input,textarea,button,select,[title],[aria-label]').forEach(el=>{
   ['placeholder','title','aria-label'].forEach(a=>{const raw=el.getAttribute(a);if(raw){const tr=t(raw);if(tr!==raw)el.setAttribute(a,tr)}});
   if(el.tagName==='SELECT')el.querySelectorAll('option').forEach(o=>{const tr=t(o.textContent.trim());if(tr!==o.textContent.trim())o.textContent=tr});
 });
 const sel=document.querySelector('#languageSelect');if(sel){sel.value=l;sel.setAttribute('aria-label',l==='en'?'Language':'Språk')}
 const ll=document.querySelector('#languageLabel');if(ll){const tn=[...ll.childNodes].find(x=>x.nodeType===3&&x.nodeValue.trim());if(tn)tn.nodeValue=' '+(l==='en'?'Language':'Språk')}
 window.SaidSpeechLanguage=l==='en'?'en-US':'sv-SE';window.SaidVoiceLanguage=window.SaidSpeechLanguage;
 if(window.updateLanguageSpeech)try{window.updateLanguageSpeech()}catch{}
}
function set(v){const l=v==='en'?'en':'sv';S.set(KEY,l);S.set('saidAssistantLanguageV25',l);S.set('saidAssistantLanguageV24',l);document.documentElement.lang=l;apply();window.dispatchEvent(new CustomEvent('said-language-changed',{detail:{language:l}}));setTimeout(apply,30);setTimeout(apply,200);setTimeout(apply,800);return l}
window.SaidLanguage={get,set,t,apply,dict:{sv:SV,en:EN}};
window.addEventListener('DOMContentLoaded',()=>{const sel=document.querySelector('#languageSelect');if(sel)sel.onchange=()=>set(sel.value);apply();const mo=new MutationObserver(()=>{if(window.__saidLangApplying)return;window.__saidLangApplying=true;queueMicrotask(()=>{window.__saidLangApplying=false;apply()})});mo.observe(document.body,{subtree:true,childList:true,characterData:true});});
})();

/* ===== MOBILE RUNTIME COMPONENT: universal-document-v26.js ===== */
/* Said Assistant 3.0 — FINAL V26 document editor. */
(function(){'use strict';
const $=s=>document.querySelector(s);let original='',currentName='dokument';
const isEn=()=>window.SaidLanguage?.get?.()==='en';const say=(sv,en)=>isEn()?en:sv;
function status(x){const e=$('#docStatus');if(e)e.textContent=x}
function download(name,blob){if(!blob)return;const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)}
function cp(c){const n=c.charCodeAt(0);const sp={'€':128,'‚':130,'ƒ':131,'„':132,'…':133,'†':134,'‡':135,'ˆ':136,'‰':137,'Š':138,'‹':139,'Œ':140,'Ž':142,'‘':145,'’':146,'“':147,'”':148,'•':149,'–':150,'—':151,'˜':152,'™':153,'š':154,'›':155,'œ':156,'ž':158,'Ÿ':159};return n<=255?n:(sp[c]??63)}
function esc(s){return String(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)')}
function bytes(s){return Array.from(String(s),cp)}
function makePdf(text,title='Dokument'){
 const chunks=[];String(text||'').replace(/\r/g,'').split('\n').forEach(line=>{let x=line;if(!x){chunks.push('');return}while(x.length>92){chunks.push(x.slice(0,92));x=x.slice(92)}chunks.push(x)});if(!chunks.length)chunks.push('');
 const pp=46,pages=Math.max(1,Math.ceil(chunks.length/pp)),o=[''];o.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');const ids=[];
 for(let p=0;p<pages;p++){const pid=3+p*2,cid=4+p*2;ids.push(pid);o[pid]='';o[cid]=''}o[2]=`<< /Type /Pages /Count ${pages} /Kids [${ids.map(x=>x+' 0 R').join(' ')}] >>`;
 for(let p=0;p<pages;p++){const cid=4+p*2,pid=3+p*2,lines=chunks.slice(p*pp,(p+1)*pp);let y=800;const ops=lines.map(line=>{const q=`BT /F1 10 Tf 45 ${y} Td (${esc(line)}) Tj ET`;y-=16;return q}).join('\n');o[pid]=`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 1 0 R >> >> /Contents ${cid} 0 R >>`;o[cid]=`<< /Length ${bytes(ops).length} >>\nstream\n${ops}\nendstream`}
 const root=o.length;o.push('<< /Type /Catalog /Pages 2 0 R >>');let all=[];const off=[0];const add=s=>all.push(...bytes(s));add('%PDF-1.4\n');for(let i=1;i<o.length;i++){off[i]=all.length;add(`${i} 0 obj\n${o[i]}\nendobj\n`)}const x=all.length;add(`xref\n0 ${o.length}\n0000000000 65535 f \n`);for(let i=1;i<o.length;i++)add(String(off[i]).padStart(10,'0')+' 00000 n \n');add(`trailer\n<< /Size ${o.length} /Root ${root} 0 R >>\nstartxref\n${x}\n%%EOF`);return new Blob([new Uint8Array(all)],{type:'application/pdf'})
}
async function loadPdfJs(){if(window.pdfjsLib)return window.pdfjsLib;if(window.__saidPdfJs)return window.__saidPdfJs;window.__saidPdfJs=import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs').then(m=>{window.pdfjsLib=m;if(m.GlobalWorkerOptions)m.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';return m}).catch(()=>null);return window.__saidPdfJs}
async function loadTesseract(){if(window.Tesseract)return window.Tesseract;if(window.__saidTesseract)return window.__saidTesseract;window.__saidTesseract=new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';s.onload=()=>res(window.Tesseract);s.onerror=rej;document.head.appendChild(s)});return window.__saidTesseract}
async function pdfText(file,onProgress){
 const pdfjs=await loadPdfJs();if(!pdfjs?.getDocument)return '';
 try{const doc=await pdfjs.getDocument({data:await file.arrayBuffer()}).promise;let out='';for(let i=1;i<=doc.numPages;i++){const p=await doc.getPage(i),c=await p.getTextContent();out+=c.items.map(x=>x.str).join(' ')+'\n';if(onProgress)onProgress(i,doc.numPages);if(out.length>50000)break}return out.trim()}catch{return ''}
}
async function pdfOcr(file,onProgress){
 const pdfjs=await loadPdfJs(),T=await loadTesseract();if(!pdfjs||!T)return '';
 const doc=await pdfjs.getDocument({data:await file.arrayBuffer()}).promise;let out='';
 for(let i=1;i<=Math.min(doc.numPages,30);i++){const p=await doc.getPage(i),vp=p.getViewport({scale:1.5}),c=document.createElement('canvas');c.width=vp.width;c.height=vp.height;await p.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;const r=await T.recognize(c,'swe+eng',{logger:m=>{if(onProgress&&m.progress)onProgress(i,doc.numPages,m.progress)}});out+=`\n${r?.data?.text||''}`;if(out.length>50000)break}return out.trim()}
async function docxText(file){
 try{if(!window.mammoth){await new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://unpkg.com/mammoth@1.8.0/mammoth.browser.min.js';s.onload=res;s.onerror=rej;document.head.appendChild(s)})}const r=await window.mammoth.extractRawText({arrayBuffer:await file.arrayBuffer()});return String(r.value||'').trim()}catch{return ''}
}
async function read(file,onProgress){const ext=(file.name.split('.').pop()||'').toLowerCase();if(ext==='pdf'){let t=await pdfText(file,onProgress);if(!t)t=await pdfOcr(file,onProgress);return t}if(ext==='docx')return docxText(file);if(['txt','md','csv','json','html','htm','xml','rtf'].includes(ext))return file.text();return ''}
function addControls(){const box=document.querySelector('#documents .buttons');if(!box)return;[['editDocument','secondary','✏️ Redigera','✏️ Edit'],['saveEditedPdf','primary','💾 Spara redigerad PDF','💾 Save edited PDF'],['newDocument','secondary','🆕 Nytt dokument','🆕 New document'],['undoDocument','secondary','↩️ Ångra ändring','↩️ Undo change']].forEach(([id,cl,sv,en])=>{let b=document.getElementById(id);if(!b){b=document.createElement('button');b.id=id;b.className=cl;box.appendChild(b)}b.textContent=say(sv,en)})}
async function openDocument(){const f=$('#documentFile')?.files?.[0];if(!f){status(say('Välj en fil först.','Choose a file first.'));return}currentName=(f.name||'dokument').replace(/\.[^.]+$/,'');status(say(`Öppnar ${f.name}…`,`Opening ${f.name}…`));try{const text=await read(f,(p,total,prog)=>{status(say(`Läser sida ${p} av ${total}…`,`Reading page ${p} of ${total}…`))});if(text){original=text;$('#documentText').value=text;$('#documentText').focus();status(say(`Dokumentet är öppnat. Du kan redigera all text direkt, spara ändringarna och skapa en ny PDF.`,`The document is open. You can edit all extracted text, save your changes, and create a new PDF.`))}else status(say('Filen kunde öppnas men ingen redigerbar text kunde läsas. För en skannad PDF försöker jag OCR automatiskt.','The file could be opened, but no editable text could be extracted. For a scanned PDF, OCR is attempted automatically.'))}catch(e){console.error(e);status(say('Kunde inte läsa dokumentet.','Could not read the document.'))}}
function saveEditedPdf(){const t=$('#documentText')?.value||'';if(!t.trim()){status(say('Det finns ingen text att spara.','There is no text to save.'));return}localStorage.setItem('saidDocumentDraftV26',t);download((currentName||'dokument')+'_redigerat.pdf',makePdf(t,currentName));status(say('Ändringarna har sparats och en ny PDF har skapats.','The changes were saved and a new PDF was created.'))}
function saveText(){const t=$('#documentText')?.value||'';localStorage.setItem('saidDocumentDraftV26',t);download((currentName||'dokument')+'_redigerat.txt',new Blob([t],{type:'text/plain;charset=utf-8'}));status(say('Texten sparades.','Text saved.'))}
function wire(){addControls();$('#openFile')?.addEventListener('click',openDocument);$('#editDocument')?.addEventListener('click',()=>{$('#documentText')?.focus();$('#documentText')?.scrollIntoView({behavior:'smooth',block:'center'});status(say('Redigeringsläge aktivt. Ändra texten direkt och tryck sedan Spara redigerad PDF.','Edit mode is active. Edit the text directly, then press Save edited PDF.'))});$('#saveEditedPdf')?.addEventListener('click',saveEditedPdf);$('#saveText')?.addEventListener('click',saveText);$('#makePdf')?.addEventListener('click',()=>{const t=$('#documentText')?.value||'';if(t.trim())download((currentName||'dokument')+'.pdf',makePdf(t,currentName))});$('#newDocument')?.addEventListener('click',()=>{$('#documentText').value='';original='';currentName='dokument';if($('#documentFile'))$('#documentFile').value='';status(say('Nytt dokument klart. Du kan skriva eller klistra in text och skapa en ny PDF.','New document ready. You can type or paste text and create a new PDF.'))});$('#undoDocument')?.addEventListener('click',()=>{$('#documentText').value=original;status(say('Ändringarna har ångrats.','The changes have been undone.'))});window.addEventListener('said-language-changed',addControls)}
window.SaidDocumentEditorV26={read,readPdfText:pdfText,makePdf,openDocument,saveEditedPdf};window.addEventListener('DOMContentLoaded',wire);
})();

/* ===== MOBILE RUNTIME COMPONENT: universal-cv-editor-v26.js ===== */
/* Said Assistant 3.0 — FINAL V26 CV editor. */
(function(){'use strict';const $=s=>document.querySelector(s);const S={get(k,d=''){try{return localStorage.getItem(k)??d}catch{return d}},set(k,v){try{localStorage.setItem(k,v)}catch{}}};const en=()=>window.SaidLanguage?.get?.()==='en';const say=(sv,e)=>en()?e:sv;let original='';
function addControls(){const box=document.querySelector('#cv .buttons');if(!box)return;[['openCvEditor','secondary','✏️ Öppna och redigera CV','✏️ Open and edit CV'],['saveCvChanges','primary','💾 Spara CV-ändringar','💾 Save CV changes'],['undoCv','secondary','↩️ Ångra ändring','↩️ Undo change'],['createNewCvPdf','secondary','📄 Skapa ny PDF','📄 Create new PDF']].forEach(([id,cl,sv,e])=>{let b=document.getElementById(id);if(!b){b=document.createElement('button');b.id=id;b.className=cl;box.appendChild(b)}b.textContent=say(sv,e)})}
function dl(n,b){if(!b)return;const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=n;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},800)}
async function importCv(){const f=$('#cvFile')?.files?.[0];if(!f){$('#cvAnalysis').textContent=say('Välj ditt CV först.','Choose your CV first.');return}$('#cvAnalysis').textContent=say('Öppnar CV…','Opening CV…');try{let t='';if(f.name.toLowerCase().endsWith('.pdf'))t=await window.SaidDocumentEditorV26?.readPdfText?.(f);if(!t&&window.SaidDocumentEditorV26?.read)t=await window.SaidDocumentEditorV26.read(f);if(!t&&window.SaidUniversalFile?.read)t=await window.SaidUniversalFile.read(f);if(!t&&!f.name.toLowerCase().endsWith('.pdf'))t=await f.text();if(t){$('#cvText').value=t;original=t;S.set('cvText',t);$('#cvAnalysis').textContent=say('CV öppnat och redigerbart. Du kan ändra allt direkt i rutan.','CV opened and editable. You can change everything directly in the editor.')}else $('#cvAnalysis').textContent=say('CV-filen kunde inte läsas. Prova en textbaserad eller skannad PDF.','The CV file could not be read. Try a text-based or scanned PDF.')}catch(e){console.error(e);$('#cvAnalysis').textContent=say('Kunde inte läsa CV-filen.','Could not read the CV file.')}}
function save(){const t=$('#cvText').value||'';S.set('cvText',t);original=t;$('#cvAnalysis').textContent=say('Alla CV-ändringar är sparade lokalt.','All CV changes are saved locally.')}function undo(){if(original!==undefined){$('#cvText').value=original;$('#cvAnalysis').textContent=say('Senaste ändringarna har ångrats.','The latest changes have been undone.')}}function pdf(){const t=$('#cvText').value||'';if(!t.trim()){$('#cvAnalysis').textContent=say('CV:t är tomt.','The CV is empty.');return}S.set('cvText',t);const b=window.SaidDocumentEditorV26?.makePdf?.(t,'CV');if(b)dl('CV_uppdaterat.pdf',b);$('#cvAnalysis').textContent=say('Ny PDF skapad från dina sparade CV-ändringar.','A new PDF was created from your saved CV changes.')}function wire(){addControls();$('#cvFile')?.addEventListener('change',importCv);$('#openCvEditor')?.addEventListener('click',()=>{$('#cvText')?.focus();$('#cvText')?.scrollIntoView({behavior:'smooth',block:'center'})});$('#saveCvChanges')?.addEventListener('click',save);$('#undoCv')?.addEventListener('click',undo);$('#createNewCvPdf')?.addEventListener('click',pdf);window.addEventListener('said-language-changed',addControls)}window.SaidCvEditorV26={importCv,save,pdf};window.addEventListener('DOMContentLoaded',wire)})();

/* ===== MOBILE RUNTIME COMPONENT: universal-image-v26.js ===== */
/* Said Assistant 3.0 — FINAL V26 image workspace. Free OCR + multi-image workflow. */
(function(){'use strict';let files=[];let lastText='';const $=s=>document.querySelector(s);const en=()=>window.SaidLanguage?.get?.()==='en';const say=(sv,e)=>en()?e:sv;
async function load(){if(window.Tesseract)return window.Tesseract;if(window.__saidTesseract)return window.__saidTesseract;window.__saidTesseract=new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';s.onload=()=>res(window.Tesseract);s.onerror=rej;document.head.appendChild(s)});return window.__saidTesseract}
function questions(text){return String(text||'').split(/\n+/).map(x=>x.trim()).filter(x=>x.length>4&&(/[?？]$/.test(x)||/^(vad|hur|var|när|varför|vilken|vilket|vem|kan|ska|är|what|how|where|when|why|which|who|can|is|are)\b/i.test(x)))}
async function readOne(file,onProgress){const T=await load();const r=await T.recognize(file,'swe+eng',{logger:m=>{if(onProgress&&m?.progress)onProgress(m.progress)}});return String(r?.data?.text||'').trim()}
async function analyze(){const input=$('#imageFile');if(!input?.files?.length){$('#imageStatus').textContent=say('Välj en eller flera bilder först.','Choose one or more images first.');return}files=[...input.files];let all=[];for(let i=0;i<files.length;i++){const f=files[i];$('#imageStatus').textContent=say(`Läser bild ${i+1} av ${files.length}…`,`Reading image ${i+1} of ${files.length}…`);try{const text=await readOne(f,p=>{$('#imageStatus').textContent=say(`Läser bild ${i+1} av ${files.length}… ${Math.round(p*100)}%`,`Reading image ${i+1} of ${files.length}… ${Math.round(p*100)}%`)});all.push(`--- ${f.name} ---\n${text||say('[Ingen tydlig text hittades]','[No clear text found]')}`)}catch(e){all.push(`--- ${f.name} ---\n${say('[Kunde inte läsa bilden]','[Could not read image]')}`)}}lastText=all.join('\n\n');$('#imageText').value=lastText;const qs=questions(lastText);$('#imageStatus').textContent=qs.length?say(`Klart. ${files.length} bilder lästes och ${qs.length} möjliga frågor hittades. Du kan be assistenten svara på dem tillsammans.`,`Done. ${files.length} images were read and ${qs.length} possible questions were found. You can ask the assistant to answer them together.`):say(`Klart. ${files.length} bilder lästes.`,`Done. ${files.length} images were read.`)}
function send(){const text=$('#imageText')?.value.trim();if(!text){$('#imageStatus').textContent=say('Det finns ingen läst text att skicka.','There is no extracted text to send.');return}const qs=questions(text);$('#command').value=qs.length?say(`Jag har skickat ${files.length||1} bilder. Använd all läst text tillsammans. Svara på frågorna en i taget och numrera svaren.`,`I sent ${files.length||1} images. Use all extracted text together. Answer the questions one by one and number the answers.`):say('Jag har skickat bilden/bilderna. Använd all läst text tillsammans och förklara vad som finns där.','I sent the image(s). Use all extracted text together and explain what is there.');if(window.SaidImageQuestionContext)window.SaidImageQuestionContext={text,files:files.map(f=>f.name),questions:qs};$('#send')?.click()}
function clear(){files=[];lastText='';if($('#imageFile'))$('#imageFile').value='';if($('#imageText'))$('#imageText').value='';if($('#imageStatus'))$('#imageStatus').textContent=say('Ingen bild analyserad.','No image analyzed.')}
function wire(){if(!$('#imageFile'))return;const box=$('#images .buttons');if(box){[['analyzeImageMulti','primary','🧠 Läs flera bilder','🧠 Analyze multiple images'],['sendImageText','secondary','💬 Lägg alla bilder i chatten','💬 Put all images in chat'],['clearImages','secondary','🧹 Rensa bilder','🧹 Clear images']].forEach(([id,cl,sv,e])=>{let b=document.getElementById(id);if(!b){b=document.createElement('button');b.id=id;b.className=cl;box.appendChild(b)}b.textContent=say(sv,e)})}$('#analyzeImageMulti')?.addEventListener('click',analyze);$('#sendImageText')?.addEventListener('click',send);$('#clearImages')?.addEventListener('click',clear);window.addEventListener('said-language-changed',()=>{const a=$('#analyzeImageMulti');if(a)a.textContent=say('🧠 Läs flera bilder','🧠 Analyze multiple images');const s=$('#sendImageText');if(s)s.textContent=say('💬 Lägg alla bilder i chatten','💬 Put all images in chat');const c=$('#clearImages');if(c)c.textContent=say('🧹 Rensa bilder','🧹 Clear images')})}
window.SaidImageToolsV26={analyze,send,clear,questions,read:readOne};window.addEventListener('DOMContentLoaded',wire)})();

/* ===== MOBILE RUNTIME COMPONENT: FINAL_SMART_MOBILE_ENGINE_V23.js ===== */
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

/* ===== MOBILE RUNTIME COMPONENT: FINAL_SMART_MOBILE_ENGINE_V24.js ===== */
/* Said Assistant 3.0 — FINAL V24 SMART ENGINE
   Integrated final layer. Keeps the existing V23 engine and adds:
   - one-language control
   - natural travel time planning
   - explicit distinction between "what time is it?" and "my trip is at 10"
   - concise answers without raw search URLs
   - local save/recall confirmations
   - better app-command handling
*/
(function(){
  'use strict';
  const S={get(k,d=''){try{return localStorage.getItem(k)??d}catch{return d}},
           set(k,v){try{localStorage.setItem(k,v)}catch{}}};
  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
  const lang=()=>window.SaidLanguage?.get?.()==='en'?'en':'sv';
  const say=(sv,en)=>lang()==='en'?en:sv;
  const msgs=()=>Array.isArray(window.chatState?.messages)?window.chatState.messages:[];
  const users=()=>msgs().filter(x=>x.role==='user').map(x=>String(x.text||'').trim()).filter(Boolean).slice(-12);
  const timeRe=/\b(?:klockan|kl\.?|at)\s*(\d{1,2})(?::([0-5]\d))?\b/i;
  const bareTime=/^\s*(?:kl\.?\s*)?(\d{1,2})(?::([0-5]\d))?\s*$/i;
  const timeOfDay=s=>{const m=String(s||'').match(timeRe)||String(s||'').match(bareTime);return m?`${String(+m[1]).padStart(2,'0')}:${m[2]||'00'}`:''};
  const home=()=>{
    const p=S.get('profileLocation','').trim();if(p)return p;
    for(const x of users().slice().reverse()){
      const m=x.match(/\b(?:jag\s+)?(?:bor|hemma)\s+(?:i|på)\s+(.+?)(?=\s+(?:och|men|resan|flyget|flyg|klockan|kl\.?)\b|[?.!]|$)/i);
      if(m)return m[1].trim();
      const f=x.match(/^\s*(?:det|den)(?:\s+här)?\s+(?:är|ar)\s+(.+?)\s*[?.!]*$/i);if(f)return f[1].trim();
    } return '';
  };
  const activeTravel=()=>users().some(x=>/\b(resa|resan|reser|flyg|flyget|flyga|arlanda|turkiet|flygplats|utomlands|utlandsresa)\b/i.test(x));
  const currentClockQuestion=q=>/^\s*(?:vad är|vad ar|what is)?\s*(?:klockan|tiden|the time)\s*\??\s*$/i.test(q);
  const travelTimeStatement=q=>!!timeOfDay(q)&&(activeTravel()||/\b(resa|resan|flyg|flyget|flyga|flygplats|utlandsresa|från hem|hemifrån)\b/i.test(q));
  function saveIntent(q){return /\b(spara|save|kom ihåg|kom ihag|remember|lägg till i minnet|lägg in i minnet)\b/i.test(q)}
  function reminderIntent(q){return /\b(påminn mig|påminn|remind me|remind)\b/i.test(q)}
  function answerLanguage(q){
    const s=q.toLowerCase();
    if(/\b(byt|ändra|välj|switch|change|use)\b.*\b(svenska|svedish|english|engelska)\b|\b(svenska|engelska|english)\s+(språk|language)\b/.test(s)){
      const en=/english|engelska/.test(s);window.SaidLanguage?.set?.(en?'en':'sv');
      return say('Språket är nu svenska. Jag fortsätter på svenska.','The language is now English. I will continue in English.');
    } return null;
  }
  function saveAnswer(q){
    const content=q.replace(/^.*?\b(?:spara|save|kom ihåg|kom ihag|remember|lägg till i minnet|lägg in i minnet)\b\s*/i,'').trim()||q;
    const list=(()=>{try{return JSON.parse(S.get('saidAssistantSavedItemsV24','[]'))||[]}catch{return[]}})();
    list.push({text:content,at:Date.now()});S.set('saidAssistantSavedItemsV24',JSON.stringify(list.slice(-100)));
    return say(`Okej. Jag har sparat det: ${content}. Jag kommer ihåg det när du frågar senare.`,`Okay. I saved it: ${content}. I will remember it when you ask later.`);
  }
  function reminderAnswer(q){
    const content=q.replace(/^.*?\b(?:påminn mig|påminn|remind me|remind)\b\s*/i,'').trim()||q;
    const list=(()=>{try{return JSON.parse(S.get('saidAssistantRemindersV24','[]'))||[]}catch{return[]}})();
    list.push({text:content,at:Date.now(),done:false});S.set('saidAssistantRemindersV24',JSON.stringify(list.slice(-100)));
    return say(`Okej. Jag har lagt till en påminnelse: ${content}.`,`Okay. I added a reminder: ${content}.`);
  }
  function routeMinutes(a,b){return Math.max(1,Math.round((b-a+1440)%1440))}
  async function geocode(place){
    try{
      const u='https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&accept-language='+encodeURIComponent(lang()==='en'?'en':'sv')+'&q='+encodeURIComponent(place);
      const r=await fetch(u,{headers:{accept:'application/json'},signal:AbortSignal.timeout?.(8000)});if(!r.ok)return null;
      const rows=await r.json();return rows?.[0]?{lat:+rows[0].lat,lon:+rows[0].lon,name:rows[0].display_name}:null;
    }catch{return null}
  }
  async function drive(a,b){
    try{
      const u=`https://router.project-osrm.org/route/v1/driving/${a.lon},${a.lat};${b.lon},${b.lat}?overview=false`;
      const r=await fetch(u,{headers:{accept:'application/json'},signal:AbortSignal.timeout?.(9000)});if(!r.ok)return null;
      const j=await r.json(),x=j?.routes?.[0];return x?{min:Math.max(1,Math.round(x.duration/60)),km:x.distance/1000}:null;
    }catch{return null}
  }
  function fmtMin(m){m=((m%1440)+1440)%1440;return `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`}
  function extractFlight(){
    const all=users().join(' | ');
    const m=all.match(/\b(?:klockan|kl\.?|at)\s*(\d{1,2})(?::([0-5]\d))?\b/i)||all.match(/\b(?:flyget|flyg|resan|resa)\s+(?:går|avgår|är)\s+(?:klockan|kl\.?)?\s*(\d{1,2})(?::([0-5]\d))?\b/i);
    return m?`${String(+m[1]).padStart(2,'0')}:${m[2]||'00'}`:'';
  }
  function extractAirport(){
    const all=users().join(' | ');
    const m=all.match(/\b(?:från|at|from)\s+(Arlanda|Skavsta|Bromma|Landvetter|Kastrup)\b/i);
    if(m)return m[1];
    if(/\barlanda\b/i.test(all))return 'Arlanda';
    return '';
  }
  function extractDestination(){
    const all=users().join(' | ');
    const m=all.match(/\b(?:till|to|mot)\s+(Turkiet|Afghanistan|Pakistan|Tyskland|Frankrike|Spanien|Italien|England|Storbritannien|USA|Kanada|Norge|Danmark|Finland|Europa)\b/i);
    return m?m[1]:'';
  }
  async function travelPlan(q){
    if(!(travelTimeStatement(q)||(/^\s*\d{1,2}(?::\d{2})?\s*$/.test(q)&&activeTravel())))return null;
    const h=home(),airport=extractAirport(),dest=extractDestination(),flight=timeOfDay(q)||extractFlight();
    if(!h||!airport||!flight)return null;
    const hg=await geocode(h),ag=await geocode(airport);if(!hg||!ag)return null;
    const d=await drive(hg,ag);if(!d)return null;
    const flightMin=+flight.slice(0,2)*60+(+flight.slice(3)||0);
    const early=3*60; // international trip target
    const airportTime=flightMin-early;
    const leave=airportTime-d.min-20;
    return say(
      `✈️ Jag förstår resan nu: ${h} → ${airport} → ${dest||'utlandet'}.\n🕐 Flyget avgår kl. ${flight}.\n🚗 Med bil från ${h} till ${airport}: cirka ${d.min} min (${d.km.toFixed(1)} km).\n⏰ För en utlandsresa räknar jag med 3 timmar före avgång på flygplatsen. Du bör alltså vara på ${airport} omkring ${fmtMin(airportTime)} och lämna hemmet omkring ${fmtMin(leave)} med cirka 20 minuters extra marginal.\nJag har förstått tiden som flygtid — inte som en fråga om vad klockan är. Om du säger en ny flygtid räknar jag om.`,
      `✈️ I understand the trip now: ${h} → ${airport} → ${dest||'abroad'}.\n🕐 The flight departs at ${flight}.\n🚗 By car from ${h} to ${airport}: about ${d.min} min (${d.km.toFixed(1)} km).\n⏰ For an international trip I use 3 hours before departure at the airport. You should therefore be at ${airport} around ${fmtMin(airportTime)} and leave home around ${fmtMin(leave)}, with about 20 minutes extra margin.\nI understood the time as the flight time — not as a question asking what time it is. If you give me a new flight time, I will recalculate.`
    );
  }
  function stripLinks(x){return String(x||'').replace(/https?:\/\/\S+/gi,'').replace(/\b(?:URL Source|Markdown Content)\s*:\s*/gi,'').replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/\s{2,}/g,' ').trim()}
  async function answer(q,base){
    const t=clean(q);
    const l=answerLanguage(t);if(l)return l;
    if(saveIntent(t))return saveAnswer(t);
    if(reminderIntent(t))return reminderAnswer(t);
    if(currentClockQuestion(t)&&!travelTimeStatement(t)){
      const now=new Date();
      return lang()==='en'?`The current time is ${now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}.`:`Klockan är ${now.toLocaleTimeString('sv-SE',{hour:'2-digit',minute:'2-digit'})}.`;
    }
    const tp=await travelPlan(t);if(tp)return tp;
    const result=await base(t);
    return stripLinks(result);
  }
  window.SaidFinalV24={answer,travelPlan,lang,say};
  window.addEventListener('said-language-changed',()=>{try{document.documentElement.lang=lang()==='en'?'en':'sv'}catch{}});
})();

/* ===== MOBILE APPLICATION CORE: app.js ===== */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const S={get:(k,f='')=>{try{return localStorage.getItem(k)??f}catch{return f}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch{}}};
const state={running:false,jobOffset:0,lastJobQuery:'',lastJobs:[],selectedJob:null,recognition:null,abort:null,voiceMode:false,lastWebResult:null,lastAssistantText:'',lastFilters:{location:'ALL',locationText:'',employment:'ALL',sort:'MATCH',term:''}};

const CHAT_STORE_KEY='saidAssistantChatsV1';
const CHAT_CURRENT_KEY='saidAssistantCurrentChatV1';
let chatState={id:null,messages:[]};

function chatStore(){
  try{return JSON.parse(S.get(CHAT_STORE_KEY,'{}'))||{}}catch{return {}}
}
const CHAT_DB_NAME='SaidAssistantChatDBV1';
function chatStoreLocalOnly(store){S.set(CHAT_STORE_KEY,JSON.stringify(store||{}));}
function idbRequest(mode,storeName='chats'){
  return new Promise((resolve,reject)=>{
    if(!('indexedDB' in window)){resolve(null);return;}
    const req=indexedDB.open(CHAT_DB_NAME,1);
    req.onupgradeneeded=()=>{try{req.result.createObjectStore(storeName);}catch{}};
    req.onsuccess=()=>{const db=req.result;try{const tx=db.transaction(storeName,mode);resolve({db,store:tx.objectStore(storeName),tx});}catch{resolve(null);}};
    req.onerror=()=>resolve(null);
  });
}
function idbSaveChatStore(store){
  try{const p=idbRequest('readwrite');if(!p)return;Promise.resolve(p).then(r=>{if(!r)return;r.store.put(store||{},'all');r.tx.oncomplete=()=>r.db.close();r.tx.onerror=()=>r.db.close();});}catch{}
}
function idbLoadChatStore(){
  return new Promise(resolve=>{
    if(!('indexedDB' in window)){resolve({});return;}
    try{
      const req=indexedDB.open(CHAT_DB_NAME,1);
      req.onupgradeneeded=()=>{try{req.result.createObjectStore('chats');}catch{}};
      req.onsuccess=()=>{const db=req.result;const tx=db.transaction('chats','readonly');const get=tx.objectStore('chats').get('all');get.onsuccess=()=>{const v=get.result;db.close();resolve(v&&typeof v==='object'?v:{});};get.onerror=()=>{db.close();resolve({});};};
      req.onerror=()=>resolve({});
    }catch{resolve({});}
  });
}
function saveChatStore(store){
  chatStoreLocalOnly(store);
  idbSaveChatStore(store);
}
async function restoreChatStore(){
  const local=chatStore();
  const indexed=await idbLoadChatStore();
  const merged={...indexed,...local};
  for(const [id,item] of Object.entries(indexed||{})){
    const current=local[id];
    if(current && (current.updatedAt||0) >= (item?.updatedAt||0))merged[id]=current;
    else merged[id]=item;
  }
  if(Object.keys(merged).length && JSON.stringify(merged)!==JSON.stringify(local))chatStoreLocalOnly(merged);
  return merged;
}
function chatTitle(messages){
  const first=messages.find(m=>m.role==='user');
  const text=(first?.text||'Ny chatt').trim().replace(/\\s+/g,' ');
  return text.length>48?text.slice(0,48)+'…':text;
}
function createChat(){
  const id='chat_'+Date.now()+'_'+Math.random().toString(36).slice(2,8);
  const welcome='Hej Said! 👋 Jag är redo. Du kan skriva eller prata med mig. Säg till exempel: ”Sök jobb enligt mitt CV i Stockholm.”';
  chatState={id,messages:[{role:'assistant',text:welcome}]};
  const store=chatStore();
  store[id]={id,createdAt:Date.now(),updatedAt:Date.now(),messages:chatState.messages};
  saveChatStore(store);S.set(CHAT_CURRENT_KEY,id);
  return id;
}
function persistCurrentChat(){
  if(!chatState.id)return;
  const store=chatStore();
  store[chatState.id]={id:chatState.id,createdAt:store[chatState.id]?.createdAt||Date.now(),updatedAt:Date.now(),messages:chatState.messages};
  saveChatStore(store);S.set(CHAT_CURRENT_KEY,chatState.id);renderChatHistory();
}
function renderMessage(m){
  const d=document.createElement('div');d.className='bubble '+(m.role==='user'?'user':'assistant');
  d.textContent=m.text;
  if(m.link?.url){
    const a=document.createElement('a');a.href=m.link.url;a.target='_blank';a.rel='noopener noreferrer';
    a.textContent=m.link.label||'🌐 Öppna webbsökning';a.className='assistant-action-link';
    a.style.display='inline-block';a.style.marginTop='10px';a.style.fontWeight='700';
    d.appendChild(document.createElement('br'));d.appendChild(a);
  }
  $('#conversation').appendChild(d);
}
function renderCurrentChat(){
  const box=$('#conversation');box.innerHTML='';
  chatState.messages.forEach(renderMessage);
  box.scrollTop=box.scrollHeight;
  renderChatHistory();
}
function add(t,w='assistant',link=null){
  const d=document.createElement('div');d.className='bubble '+w;d.textContent=t;
  if(link && link.url){
    const a=document.createElement('a');a.href=link.url;a.target='_blank';a.rel='noopener noreferrer';
    a.textContent=link.label||'🌐 Öppna webbsökning';a.className='assistant-action-link';
    a.style.display='inline-block';a.style.marginTop='10px';a.style.fontWeight='700';
    d.appendChild(document.createElement('br'));d.appendChild(a);
  }
  $('#conversation').appendChild(d);$('#conversation').scrollTop=$('#conversation').scrollHeight;
  chatState.messages.push({role:w==='user'?'user':'assistant',text:String(t||''),link:link||null});
  persistCurrentChat();
}
function openChat(id){
  const store=chatStore(), item=store[id]; if(!item)return;
  chatState={id:item.id,messages:Array.isArray(item.messages)?item.messages:[]};
  if(!chatState.messages.length)chatState.messages=[{role:'assistant',text:'Ny chatt startad. Jag är redo. Vad vill du göra?'}];
  S.set(CHAT_CURRENT_KEY,id);renderCurrentChat();
  $('#chatHistoryPanel').hidden=true;
}
function deleteChat(id){
  const store=chatStore();delete store[id];saveChatStore(store);
  if(chatState.id===id){
    createChat();renderCurrentChat();
  }else renderChatHistory();
}
function renderChatHistory(){
  const list=$('#chatHistoryList');if(!list)return;
  const store=chatStore();
  const items=Object.values(store).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0));
  list.innerHTML='';
  if(!items.length){list.innerHTML='<div class="muted">Inga sparade chattar ännu.</div>';return}
  items.forEach(item=>{
    const row=document.createElement('div');row.className='chat-history-item';
    const open=document.createElement('button');open.className='chat-history-open';
    const title=document.createElement('span');title.className='chat-history-title';title.textContent=item.id===chatState.id?'● '+chatTitle(item.messages):chatTitle(item.messages);
    const date=document.createElement('span');date.className='chat-history-date';date.textContent=new Date(item.updatedAt||Date.now()).toLocaleString('sv-SE');
    open.append(title,date);open.onclick=()=>openChat(item.id);
    const del=document.createElement('button');del.className='chat-history-delete';del.textContent='🗑 Radera';del.title='Radera denna chatt';del.onclick=()=>{if(confirm('Radera denna chatt? Detta går inte att ångra.'))deleteChat(item.id)};
    row.append(open,del);list.appendChild(row);
  });
}
async function initChatHistory(){
  const store=await restoreChatStore();let id=S.get(CHAT_CURRENT_KEY,'');
  // If localStorage lost the current-chat pointer but IndexedDB still has the
  // history, reopen the newest saved conversation instead of silently starting
  // a blank chat. A genuinely empty installation still gets a new chat.
  if(!id||!store[id]){
    const saved=Object.values(store).filter(x=>x&&Array.isArray(x.messages)).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0));
    if(saved.length){id=saved[0].id;S.set(CHAT_CURRENT_KEY,id);chatState={id,messages:saved[0].messages};}
    else id=createChat();
  }else chatState={id,messages:Array.isArray(store[id].messages)?store[id].messages:[]};
  renderCurrentChat();
}
window.addEventListener('pagehide',()=>{try{persistCurrentChat();}catch{}});
window.addEventListener('beforeunload',()=>{try{persistCurrentChat();}catch{}});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){try{persistCurrentChat();}catch{}}});
function esc(s){const d=document.createElement('div');d.textContent=s==null?'':String(s);return d.innerHTML}
function cleanText(s){return String(s||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}
function dateOf(s){const m=String(s).match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);if(!m)return null;const d=new Date(+m[1],+m[2]-1,+m[3]);return isNaN(d)?null:d}
function age(s){const b=dateOf(s);if(!b)return null;const n=new Date();let a=n.getFullYear()-b.getFullYear();if(n.getMonth()<b.getMonth()||(n.getMonth()===b.getMonth()&&n.getDate()<b.getDate()))a--;return a}
function calc(t){const m=t.match(/(?:vad är|vad blir|räkna ut|beräkna|berakna|räkna|calc)?\s*([0-9][0-9\s+\-*/%().,^]*)$/i);if(!m)return null;const e=m[1].replace(/,/g,'.').replace(/(\d+(?:\.\d+)?)\s*%/g,'($1/100)').replace(/\^/g,'**');if(!/^[0-9\s+\-*/%().]+$/.test(e))return null;try{const v=Function('"use strict";return ('+e+')')();return Number.isFinite(v)?'Svaret är '+(Number.isInteger(v)?v:Number(v.toFixed(4)))+'.':null}catch{return null}}
function convUnit(t){const m=t.match(/(-?[\d.,]+)\s*(km|kilometer|miles?|kg|kilogram|lb|lbs|cm|centimeter|tum|inch|inches|°?c|celsius|°?f|fahrenheit)\b/i);if(!m)return null;const n=+m[1].replace(',','.'),u=m[2].toLowerCase();if(/^(km|kilometer)$/.test(u))return `${n} km är cirka ${(n*.621371).toFixed(2)} miles.`;if(/mile/.test(u))return `${n} miles är cirka ${(n*1.609344).toFixed(2)} km.`;if(/kg|kilogram/.test(u))return `${n} kg är cirka ${(n*2.204623).toFixed(2)} lb.`;if(/lb/.test(u))return `${n} lb är cirka ${(n*.45359237).toFixed(2)} kg.`;if(/cm|centimeter/.test(u))return `${n} cm är cirka ${(n/2.54).toFixed(2)} tum.`;if(/tum|inch/.test(u))return `${n} tum är cirka ${(n*2.54).toFixed(2)} cm.`;if(/celsius|°?c$/.test(u))return `${n} °C är ${(n*9/5+32).toFixed(1)} °F.`;return `${n} °F är ${((n-32)*5/9).toFixed(1)} °C.`}

function cvText(){return S.get('cvText','').trim()}
function profileLocation(){return S.get('profileLocation','Stockholm').trim()||'Stockholm'}
function profileJob(){return S.get('profileJob','').trim()}
function extractJobKeywords(text){
  const src=(String(text||'')+' '+profileJob()).toLowerCase();
  const map=['lagerarbetare','lager','logistik','truckförare','truck','terminal','orderplockare','plockare','paketering','transport','chaufför','bud','leverans','distribution','c-chaufför','b-chaufför','butik','butiksmedarbetare','kundservice','kundtjänst','kassa','elektriker','elmontör','installation','elteknik','bygg','betong','markarbetare','anläggning','montör','produktion','maskinoperatör','städ','lokalvård','trädgård','trädgårdsarbete','park','diskare','restaurang','kök','servitör'];
  const hits=map.filter(k=>src.includes(k));
  if(hits.length)return [...new Set(hits)].slice(0,10);
  const stop=new Set(['jag','mitt','min','mina','jobb','jobba','sök','soka','enligt','stockholm','med','och','det','som','för','från','till','har','vill','kan','inte','den','din','cv','sverige','heltid','deltid']);
  return [...new Set(src.replace(/[^a-zåäö0-9\s-]/gi,' ').split(/\s+/).filter(x=>x.length>=4&&!stop.has(x)))].slice(0,10);
}
function buildCvSearchQueries(){
  const explicit=profileJob().split(/[,;/]+/).map(x=>x.trim()).filter(Boolean);
  const base=[...explicit,...extractJobKeywords(cvText())];
  return [...new Set(base.map(x=>x.toLowerCase()).map(x=>base.find(y=>y.toLowerCase()===x)))].slice(0,6);
}
function jobMatchScore(job,cv,query=''){
  const hay=(job.headline+' '+job.company+' '+job.city+' '+job.region+' '+job.text+' '+job.occupation).toLowerCase();
  const qWords=String(query||'').toLowerCase().replace(/[^a-zåäö0-9\s-]/gi,' ').split(/\s+/).filter(w=>w.length>=3);
  const keys=extractJobKeywords(cv);
  let qHits=0,cvHits=0;
  [...new Set(qWords)].forEach(k=>{if(hay.includes(k))qHits++});
  keys.forEach(k=>{if(hay.includes(k))cvHits++});
  const qScore=qWords.length?Math.round((qHits/Math.min(qWords.length,6))*70):0;
  const cvScore=keys.length?Math.round((cvHits/Math.min(keys.length,8))*30):0;
  return Math.min(99,qScore+cvScore);
}
function matchScore(job,cv){return jobMatchScore(job,cv,state.lastFilters?.term||state.lastJobQuery||'')}
function employmentMatches(job,filter){
  if(!filter||filter==='ALL')return true;
  const t=(job.employment+' '+job.scope+' '+job.text).toLowerCase();
  if(filter==='FULL')return /heltid|full.?time|100\s*%/.test(t);
  if(filter==='PART')return /deltid|part.?time|50\s*%|75\s*%|25\s*%/.test(t);
  if(filter==='PERM')return /tillsvidare|fast anställ|vanlig anställ/.test(t);
  if(filter==='TEMP')return /tidsbegrän|visstid|vikariat|behovsanställ|säsong/.test(t);
  return true;
}
function locationMatches(job,loc){
  if(!loc||loc==='ALL')return true;
  const wanted=String(loc).trim().toLowerCase(); if(!wanted)return true;
  return (job.city+' '+job.region+' '+job.text).toLowerCase().includes(wanted);
}
function sortJobs(jobs,sort){
  if(sort==='NEW')return jobs.sort((a,b)=>(Date.parse(b.published||'')||0)-(Date.parse(a.published||'')||0));
  if(sort==='DEADLINE')return jobs.sort((a,b)=>(Date.parse(a.deadline||'')||Number.MAX_SAFE_INTEGER)-(Date.parse(b.deadline||'')||Number.MAX_SAFE_INTEGER));
  return jobs.sort((a,b)=>(b._score||0)-(a._score||0));
}
function extractSearchTerm(text){
  let q=String(text||'').toLowerCase().trim().replace(/[.,!?]+/g,' ');
  q=q.replace(/\b(enligt mitt cv|med mitt cv|efter mitt cv|utifrån mitt cv|utifran mitt cv)\b/gi,' ');
  q=q.replace(/\b(sök jobb|sok jobb|sök efter jobb|sok efter jobb|hitta jobb|leta jobb|hitta ett jobb|sök ett jobb|sok ett jobb)\b/gi,' ');
  q=q.replace(/\b(åt mig|at mig|till mig|för mig|for mig|jag vill|jag söker|jag soker|kan du|vill du|hjälp mig|hjalp mig|snälla|snalla)\b/gi,' ');
  q=q.replace(/\b(heltid|deltid|tillsvidare|tidsbegränsad|tidsbegransad|alla)\b/gi,' ');
  q=q.replace(/\b(i|på|pa)\s+(hela sverige|sverige|stockholm|uppsala|skåne|västra götaland|östergötland|jönköping|örebro|västmanland|gävleborg|norrbotten|västerbotten|södermanland|halland|kalmar|kronoberg|blekinge|värmland|dalarna|jämtland|gotland)\b/gi,' ');
  return q.replace(/\s+/g,' ').trim();
}
function dedupeJobs(jobs){
  const seen=new Set(),out=[];
  jobs.forEach(j=>{const key=j.id||[j.headline,j.company,j.city,j.deadline].join('|');if(!seen.has(key)){seen.add(key);out.push(j)}});
  return out;
}
function jobLink(j){return j.webpage_url||j.application_url||j.url||('https://arbetsformedlingen.se/platsbanken/annonser/'+encodeURIComponent(j.id||''))}
function normalizeJob(x){const employer=x.employer||{};const address=x.workplace_address||x.workplaceAddress||{};const desc=x.description||{};const app=x.application_details||{};const scope=x.scopeofwork||x.scopeOfWork||{};return {id:String(x.id||x.annonsId||''),headline:x.headline||x.title||'Jobbannons',company:employer.name||x.company||x.employer_name||'Arbetsgivare',city:address.city||x.city||x.workplace||'',region:address.region||x.region||'',deadline:x.application_deadline||x.applicationDeadline||'',text:cleanText(desc.text||x.description||x.text||x.needs||''),conditions:cleanText(x.conditions||''),employment:cleanText(x.employment_type?.label||x.employmentType?.label||''),scope:scope.min||scope.max?`${scope.min||''}-${scope.max||''}%`:cleanText(x.scopeofwork||''),url:app.url||x.webpage_url||x.url||'',webpage_url:x.webpage_url||'',application_url:app.url||'',occupation:x.occupation?.label||x.occupation||'',published:x.publication_date||x.publicationDate||x.created||''}}

async function fetchJobs(query,offset=0,limit=20){
  const base='https://jobsearch.api.jobtechdev.se/search';
  const url=base+'?'+new URLSearchParams({q:query,limit:String(Math.min(100,Math.max(1,limit))),offset:String(offset)});
  const r=await fetch(url,{headers:{accept:'application/json'},signal:state.abort?.signal});
  if(!r.ok)throw new Error('JobSearch '+r.status);
  const j=await r.json();
  return {total:Number(j.total?.value??j.total??0),hits:(j.hits||[]).map(normalizeJob)};
}
async function fetchJobsMulti(queries,offset=0){
  const unique=[...new Set(queries.map(q=>String(q||'').trim()).filter(Boolean))].slice(0,6);
  if(!unique.length)return {total:0,hits:[]};
  const results=await Promise.all(unique.map(q=>fetchJobs(q,offset,20)));
  return {total:results.reduce((n,x)=>n+Number(x.total||0),0),hits:dedupeJobs(results.flatMap(x=>x.hits))};
}
function googleJobsUrl(query){return 'https://www.google.com/search?q='+encodeURIComponent('jobs '+query)}
function renderJobs(jobs,total=jobs.length,source='Arbetsförmedlingens öppna JobSearch'){
  const box=$('#jobResults');box.innerHTML='';
  if(!jobs.length){
    box.innerHTML='<div class="result">Jag hittade inga jobb som passar dina val. Prova ett annat sökord, ett annat område eller ”Alla” under anställning.</div>';
    $('#jobSummary').textContent='0 relevanta jobb hittades.';return;
  }
  jobs.forEach((j,i)=>{
    const score=jobMatchScore(j,cvText(),state.lastFilters.term);
    const d=document.createElement('article');d.className='job-card'+(i===0?' best':'');d.dataset.jobId=j.id;
    d.innerHTML=`<div class="job-title">${esc(j.headline)}</div><div class="job-company">${esc(j.company)}</div>
      <div class="job-meta">${esc([j.city,j.region,j.employment,j.scope,j.deadline?'Ansök senast '+j.deadline:''].filter(Boolean).join(' · '))}</div>
      ${score?`<span class="match">${score}% match mot CV</span>`:''}
      <div class="why">Ditt sökord styr träffarna. CV:t används därefter för rangordning.</div>
      <div class="job-actions"><button class="apply" data-action="select">✅ Välj jobb</button><button data-action="open">🌐 Öppna annons</button><button data-action="letter">✉️ Brev</button><button data-action="cv">📄 Anpassa CV</button><button data-action="application">📋 Förbered ansökan</button></div>`;
    d.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>jobAction(b.dataset.action,j));
    box.appendChild(d);
  });
  $('#jobSummary').textContent=`${jobs.length} relevanta jobb visas${total?` av ${total.toLocaleString('sv-SE')}`:''} · källa: ${source}.`;
}
function selectJob(j){
  state.selectedJob=j; $('#letterJob').value=j.headline; $('#letterCompany').value=j.company; S.set('selectedJob',JSON.stringify(j));
  const box=$('#selectedJobBox');
  if(box)box.innerHTML=`<strong>✅ Valt jobb</strong><br>${esc(j.headline)}<br><span class="muted">${esc(j.company)} · ${esc([j.city,j.region].filter(Boolean).join(' · '))}</span><div class="buttons"><button id="selectedOpen" class="tiny primary">🌐 Öppna annons</button><button id="selectedLetter" class="tiny secondary">✉️ Brev</button><button id="selectedCv" class="tiny secondary">📄 Anpassa CV</button><button id="selectedApplication" class="tiny secondary">📋 Förbered ansökan</button></div>`;
  $('#selectedOpen')?.addEventListener('click',()=>window.open(jobLink(j),'_blank','noopener')); $('#selectedLetter')?.addEventListener('click',()=>prepareLetter(j)); $('#selectedCv')?.addEventListener('click',()=>prepareCV(j)); $('#selectedApplication')?.addEventListener('click',()=>prepareApplication());
  $('#taskStatus').textContent=`Valt jobb: ${j.headline} hos ${j.company}.`;
}
function jobAction(action,j){selectJob(j);if(action==='open'){window.open(jobLink(j),'_blank','noopener');return}if(action==='select'){add(`Jag valde: ${j.headline} hos ${j.company}. Vad vill du göra med jobbet?`,'assistant');return}if(action==='letter'){prepareLetter(j);add(`Jag har valt ${j.headline}. Jag kan nu förbereda ett personligt brev för jobbet.`,'assistant');return}if(action==='cv'){prepareCV(j);add(`Jag har valt ${j.headline}. Jag kan nu anpassa ditt CV efter annonsens krav.`,'assistant');return}
if(action==='application'){prepareApplication();add(`Ansökan är förberedd för ${j.headline}. Kontrollera CV och brev innan du går vidare.`,'assistant');return}}
async function searchJobsForUser(query,more=false,options={}){
  if(state.running)return;
  state.running=true;
  const term=String(options.term??query??'').trim();
  const locationText=String(options.locationText??$('#jobLocationText')?.value??'').trim();
  const location=locationText||String(options.location??$('#jobLocation')?.value??'ALL');
  const employment=options.employment??$('#jobEmployment')?.value??'ALL';
  const sort=options.sort??$('#jobSort')?.value??'MATCH';
  const cvOnly=/enligt mitt cv|med mitt cv|efter mitt cv|utifrån mitt cv|utifran mitt cv/i.test(term);
  state.lastFilters={location,locationText,employment,sort,term};
  $('#taskStatus').textContent='🔎 Jag söker aktuella jobb och sorterar dem efter dina val och ditt CV…';
  $('#jobSearchStatus').textContent='Söker aktuella annonser…';$('#jobSummary').textContent='Söker…';
  try{
    const cv=cvText(),q=extractSearchTerm(term);
    let queries=cvOnly?buildCvSearchQueries():[q||'jobb'];
    if(cvOnly&&!queries.length)queries=[profileJob()||'jobb'];
    const locQ=location&&location!=='ALL'?location:'';
    queries=queries.map(x=>locQ&&!x.toLowerCase().includes(locQ.toLowerCase())?`${x} ${locQ}`:x);
    state.lastJobQuery=queries.join(' | ');state.abort=new AbortController();
    const data=await fetchJobsMulti(queries,more?state.jobOffset:0);
    let jobs=dedupeJobs(data.hits).filter(j=>locationMatches(j,location)).filter(j=>employmentMatches(j,employment));
    const requestedWords=extractSearchTerm(term).toLowerCase().replace(/[^a-zåäö0-9\s-]/gi,' ').split(/\s+/).filter(w=>w.length>=3&&!['jobb','arbete','jobbannonser','sverige'].includes(w));
    if(requestedWords.length&&!cvOnly)jobs=jobs.filter(j=>{const hay=(j.headline+' '+j.occupation+' '+j.text+' '+j.company).toLowerCase();return requestedWords.some(w=>hay.includes(w))});
    jobs=jobs.map(j=>({...j,_score:jobMatchScore(j,cv,cvOnly?j.headline:term)}));
    if(cvOnly&&cv)jobs=jobs.filter(j=>(j._score||0)>=10);
    sortJobs(jobs,sort);state.jobOffset=(more?state.jobOffset:0)+data.hits.length;state.lastJobs=jobs;
    renderJobs(jobs,data.total,cvOnly?'Arbetsförmedlingens öppna JobSearch · CV-matchad flerquery':'Arbetsförmedlingens öppna JobSearch');
    $('#jobSearchStatus').textContent=jobs.length?`Klart – ${jobs.length} relevanta jobb hittades.`:'Inga jobb matchade dina val.';
    $('#taskStatus').textContent=jobs.length?`✅ Klart. Jag hittade och sorterade ${jobs.length} relevanta jobb.`:'⚠️ Inga jobb matchade dina val.';
    if(jobs.length){add(`Jag hittade ${jobs.length} relevanta jobb${cvOnly?' från flera CV-relevanta sökningar':''}. Du kan välja ett jobb direkt, öppna annonsen, anpassa CV eller förbereda brev.`,'assistant');document.querySelector('#jobs').scrollIntoView({behavior:'smooth',block:'start'})}
    else add('Jag hittade inga jobb som passar exakt med dina val. Prova ett annat sökord, ett annat område eller ”Alla” under anställning.','assistant');
  }catch(e){
    if(e.name==='AbortError')return;
    const q=state.lastJobQuery||term||('jobb '+(location==='ALL'?'':location));
    $('#taskStatus').textContent='⚠️ Jobblistan kunde inte hämtas direkt just nu.';$('#jobSearchStatus').textContent='Direktkällan svarade inte. En aktuell webbsökning kan öppnas.';$('#jobSummary').textContent='Ingen direkt lista tillgänglig just nu.';
    $('#jobResults').innerHTML=`<div class="result">Jag kunde inte hämta jobblistan direkt just nu. Dina sökval är sparade. Tryck <strong>🔄 Ny jobbsökning</strong> eller försök igen om en liten stund.</div>`;
    add('Jag kunde inte hämta jobblistan direkt just nu. Jag öppnar inte Google automatiskt. Dina sökval är kvar så att du kan försöka igen.','assistant');
  }finally{state.running=false;state.abort=null}
}
function stopTask(){if(state.abort)state.abort.abort();state.running=false;if(state.recognition){try{state.recognition.stop()}catch{}state.recognition=null}if(typeof speechSynthesis!=='undefined')speechSynthesis.cancel();$('#taskStatus').textContent='⏹ Uppgiften stoppades. Du kan fortsätta när du vill.'}
function prepareLetter(j=state.selectedJob){if(!j){add('Välj ett jobb först, så kan jag förbereda brevet.','assistant');return}const cv=cvText();const job=j.headline,co=j.company;const skills=extractJobKeywords(cv).slice(0,5).join(', ');let t=`Ansökan till ${job}\n${co}\n\nHej,\n\nJag vill gärna söka tjänsten som ${job} hos ${co}. Jag har erfarenhet och kunskaper som är relevanta för rollen, bland annat ${skills||'arbete, ansvar och samarbete'}.\n\nJag är motiverad, noggrann och vill gärna bidra hos er. Jag ser fram emot möjligheten att berätta mer om mig själv och min erfarenhet.\n\nMed vänliga hälsningar\n${S.get('profileName','Said')}`;$('#letterJob').value=job;$('#letterCompany').value=co;$('#letterText').value=t;S.set('letterText',t);$('#letterStatus').textContent='Brevet är förberett från valt jobb och ditt CV. Kontrollera texten innan du skickar.';$('#taskStatus').textContent=`✉️ Personligt brev förberett för ${job}.`;document.querySelector('.letter-card').scrollIntoView({behavior:'smooth',block:'start'})}
function prepareCV(j=state.selectedJob){if(!j){add('Välj ett jobb först, så kan jag anpassa CV:t.','assistant');return}const base=cvText();if(!base){add('Jag behöver ditt CV först. Klistra in eller importera det under ”Mitt CV” och spara det.','assistant');document.querySelector('.cv-card').scrollIntoView({behavior:'smooth',block:'start'});return}const keys=extractJobKeywords(base+' '+j.headline+' '+j.text);const note=`\n\n--- Anpassning för ${j.headline} hos ${j.company} ---\nRelevanta ord från annons/CV: ${keys.join(', ')}\n\nTips: flytta upp den erfarenhet och de kompetenser som bäst matchar annonsen. Ändra inte fakta eller lägg till erfarenhet du inte har.`;$('#cvAnalysis').textContent=note;document.querySelector('.cv-card').scrollIntoView({behavior:'smooth',block:'start'});$('#taskStatus').textContent=`📄 CV-anpassning klar för ${j.headline}.`}
function prepareApplication(){if(!state.selectedJob){add('Välj ett jobb i listan först. Sedan kan jag förbereda både CV och personligt brev.','assistant');return}prepareCV(state.selectedJob);prepareLetter(state.selectedJob);}


function googleSearchUrl(query){return 'https://www.google.com/search?q='+encodeURIComponent(query)}
function normaliseQuery(q){return String(q||'').replace(/\s+/g,' ').replace(/[?!.]+$/,'').trim()}
function tokens(q){
  return [...new Set(normaliseQuery(q).toLowerCase()
    .replace(/[^a-zåäöéü0-9\s-]/gi,' ')
    .split(/\s+/).filter(x=>x.length>=3)
    .map(x=>x.replace(/^(vad|vilken|vilket|vilka|var|varför|hur|kan|jag|du|den|det|är|e|och|att|som|på|i|om|för|med|till|en|ett|de|the|what|which|where|why|how|can|is|are|of|for|in|to)$/i,'' ))
    .filter(Boolean))];
}
function editDistance(a,b){
  a=String(a||'');b=String(b||'');
  if(a===b)return 0;
  if(!a)return b.length;if(!b)return a.length;
  const prev=Array.from({length:b.length+1},(_,i)=>i);
  for(let i=1;i<=a.length;i++){
    let cur=[i];
    for(let j=1;j<=b.length;j++)cur[j]=Math.min(cur[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));
    for(let j=0;j<cur.length;j++)prev[j]=cur[j];
  }
  return prev[b.length];
}
function nearestKnownJobTerm(text){
  const t=normaliseQuery(text).toLowerCase();
  const candidates=['lagerarbete','lagerjobb','lagerarbetare','butiksmedarbetare','butiksjobb','chaufför','transportjobb','elektriker','städare','trädgårdsarbete','restaurang','diskare','byggarbete','produktion','montör'];
  const words=t.split(/\s+/);
  let best=null;
  for(const w of words){
    if(w.length<5)continue;
    for(const c of candidates){
      const d=editDistance(w,c);
      const allowed=c.length>=10?2:1;
      if(d<=allowed && (!best||d<best.distance))best={word:w,canonical:c,distance:d};
    }
  }
  return best;
}
function looksLikeHealthQuestion(s){return /huvudvärk|huvudvark|feber|hosta|förkylning|forkylning|ont i|smärta|smarta|illamående|illamaende|medicin|tablett|vad ska jag ta/.test(s)}
function safeHealthAnswer(s){
  if(/huvudvärk|huvudvark/.test(s)) return 'Vid vanlig tillfällig huvudvärk kan vuxna ofta använda receptfria smärtstillande enligt förpackningens dosering, till exempel paracetamol eller ibuprofen om det passar personen. Undvik att kombinera läkemedel utan att kontrollera innehållet. Drick vatten, vila och följ doseringsanvisningen. Sök vård snabbt vid plötslig mycket svår huvudvärk, huvudvärk efter allvarlig skada, eller om den kommer tillsammans med svaghet, förvirring, kramper, medvetslöshet eller andra allvarliga symtom. Om du är osäker på vilket läkemedel som passar dig, fråga apotek eller vården.';
  return 'Jag kan ge allmän information, men inte ställa diagnos. Berätta gärna vilka symtom du har, hur länge du haft dem och om något allvarligt har hänt samtidigt. Vid allvarliga eller snabbt försämrade symtom ska du kontakta vården.';
}
function looksLikePlaceQuestion(s){
  return /\b(var ligger|var finns|nära mig|närmsta|närmaste|nara mig|adress|vägen till|vagen till)\b/i.test(s) &&
         /\b(sjukhus|vårdcentral|vardcentral|apotek|polis|polisen|skola|bank|post|postkontor|restaurang|bensin|butik|affär|affar)\b/i.test(s);
}
function placeType(s){
  const t=s.toLowerCase();
  if(/sjukhus/.test(t))return {tag:'amenity=hospital',label:'sjukhus'};
  if(/vårdcentral|vardcentral/.test(t))return {tag:'amenity=clinic',label:'vårdcentral'};
  if(/apotek/.test(t))return {tag:'amenity=pharmacy',label:'apotek'};
  if(/polis/.test(t))return {tag:'amenity=police',label:'polisstation'};
  if(/skola/.test(t))return {tag:'amenity=school',label:'skola'};
  if(/post/.test(t))return {tag:'amenity=post_office',label:'postkontor'};
  if(/bank/.test(t))return {tag:'amenity=bank',label:'bank'};
  if(/bensin/.test(t))return {tag:'amenity=fuel',label:'bensinstation'};
  return null;
}
function geoPosition(){
  return new Promise((resolve,reject)=>{
    if(!navigator.geolocation)return reject(new Error('geolocation unavailable'));
    navigator.geolocation.getCurrentPosition(resolve,reject,{enableHighAccuracy:false,timeout:8000,maximumAge:300000});
  });
}
async function nearbyPlaceAnswer(query){
  const type=placeType(query); if(!type)return null;
  try{
    const pos=await geoPosition(),lat=pos.coords.latitude,lon=pos.coords.longitude;
    const radius=12000;
    const q=`[out:json][timeout:10];nwr["${type.tag.split('=')[0]}"="${type.tag.split('=')[1]}"](around:${radius},${lat},${lon});out center tags;`;
    const url='https://overpass-api.de/api/interpreter?data='+encodeURIComponent(q);
    const r=await fetch(url,{headers:{accept:'application/json'},signal:AbortSignal.timeout?.(12000)});
    if(!r.ok)throw new Error('overpass '+r.status);
    const data=await r.json();
    const items=(data.elements||[]).map(x=>{
      const la=x.lat??x.center?.lat,lo=x.lon??x.center?.lon,t=x.tags||{};
      if(la==null||lo==null)return null;
      const d=haversineKm(lat,lon,la,lo);
      const name=t.name||type.label;
      const address=[t['addr:street'],t['addr:housenumber'],t['addr:postcode'],t['addr:city']].filter(Boolean).join(' ');
      return {name,address,d};
    }).filter(Boolean).sort((a,b)=>a.d-b.d).slice(0,5);
    if(!items.length)return {text:`Jag hittade inga registrerade ${type.label} nära din position just nu.`,source:'OpenStreetMap',url:'https://www.openstreetmap.org/'};
    const lines=items.map((x,i)=>`${i+1}. ${x.name}${x.address?' — '+x.address:''} (${x.d<1?Math.round(x.d*1000)+' m':x.d.toFixed(1)+' km'})`);
    return {text:`Jag hittade de närmaste registrerade ${type.label} från din aktuella position:\n\n${lines.join('\n')}\n\nPlatserna kommer från OpenStreetMap.`,source:'OpenStreetMap',url:'https://www.openstreetmap.org/'};
  }catch(e){
    return null;
  }
}
function haversineKm(a,b,c,d){
  const R=6371,rad=x=>x*Math.PI/180;
  const da=rad(c-a),db=rad(d-b);
  const x=Math.sin(da/2)**2+Math.cos(rad(a))*Math.cos(rad(c))*Math.sin(db/2)**2;
  return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
}
async function wikipediaAnswer(query){
  const q=normaliseQuery(query); if(!q)return null;
  const endpoints=[
    'https://sv.wikipedia.org/w/api.php?action=query&list=search&srsearch='+encodeURIComponent(q)+'&format=json&origin=*&utf8=1&srlimit=5',
    'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch='+encodeURIComponent(q)+'&format=json&origin=*&utf8=1&srlimit=5'
  ];
  let best=null;
  for(const url of endpoints){
    try{
      const r=await fetch(url,{headers:{accept:'application/json'},signal:AbortSignal.timeout?.(7000)});
      if(!r.ok)continue;
      const data=await r.json(), hits=data?.query?.search||[];
      for(const hit of hits){
        if(!hit?.title)continue;
        const titleScore=webRelevance(q,hit.title+' '+cleanText(hit.snippet||''),true);
        if(titleScore<0.35)continue;
        const lang=url.includes('sv.wikipedia')?'sv':'en';
        const summary=await fetch('https://'+lang+'.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(hit.title),{headers:{accept:'application/json'},signal:AbortSignal.timeout?.(7000)});
        if(!summary.ok)continue;
        const j=await summary.json();
        if(j?.extract){
          const score=webRelevance(q,hit.title+' '+j.extract,true);
          if(!best||score>best.score)best={score,text:j.extract,source:'Wikipedia',url:j.content_urls?.desktop?.page||('https://'+lang+'.wikipedia.org/wiki/'+encodeURIComponent(hit.title))};
        }
      }
    }catch{}
  }
  return best;
}
function flattenDuckTopics(items,out=[]){
  for(const x of (items||[])){
    if(x?.Text)out.push({text:cleanText(x.Text),url:x.FirstURL||''});
    if(x?.Topics)flattenDuckTopics(x.Topics,out);
  }
  return out;
}
function webRelevance(query,text,allowPartial=false){
  const q=tokens(query), hay=tokens(text);
  if(!q.length||!hay.length)return 0;
  let hits=0;
  for(const t of q){
    if(hay.some(h=>h===t||h.includes(t)||t.includes(h)||editDistance(h,t)<=1))hits++;
  }
  const ratio=hits/q.length;
  const phrase=normaliseQuery(text).toLowerCase().includes(normaliseQuery(query).toLowerCase())?0.25:0;
  return Math.min(1,ratio*0.75+phrase+(allowPartial?0:0.05));
}
async function duckAnswer(query){
  try{
    const url='https://api.duckduckgo.com/?q='+encodeURIComponent(normaliseQuery(query))+'&format=json&no_html=1&skip_disambig=0';
    const r=await fetch(url,{headers:{accept:'application/json'},signal:AbortSignal.timeout?.(7000)});
    if(!r.ok)return null;
    const j=await r.json();
    const candidates=[];
    if(j.AbstractText)candidates.push({text:cleanText(j.AbstractText),url:j.AbstractURL||''});
    if(j.Answer)candidates.push({text:cleanText(j.Answer),url:j.AbstractURL||''});
    if(j.Definition)candidates.push({text:cleanText(j.Definition),url:j.AbstractURL||''});
    candidates.push(...flattenDuckTopics(j.RelatedTopics));
    let best=null;
    for(const c of candidates){
      if(!c.text)continue;
      const score=webRelevance(query,c.text,true);
      if(score<0.42)continue;
      if(!best||score>best.score)best={score,text:c.text,source:'DuckDuckGo',url:c.url||googleSearchUrl(query)};
    }
    return best;
  }catch{return null}
}
async function jinaSearchAnswer(query){
  // Multi-source, keyless public web reader. We ask more than one search
  // engine so one bad result is less likely to become the answer.
  try{
    const en=window.SaidLanguage?.get?.()==='en';
    const engines=[
      ['Google','https://www.google.com/search?q='+encodeURIComponent(query)+'&hl='+(en?'en':'sv')],
      ['Bing','https://www.bing.com/search?q='+encodeURIComponent(query)+'&setlang='+(en?'en-us':'sv-se')]
    ];
    const responses=await Promise.all(engines.map(async([name,target])=>{
      try{
        const r=await fetch('https://r.jina.ai/'+target,{headers:{accept:'text/plain'},signal:AbortSignal.timeout?.(10000)});
        if(!r.ok)return null;
        const text=cleanText(await r.text());
        if(!text)return null;
        const lines=text.split(/(?<=\.)\s+/).filter(x=>x.length>40);
        const ranked=lines.map(x=>({x,score:improvedWebRelevance(query,x,true)}))
          .filter(x=>x.score>=0.40).sort((a,b)=>b.score-a.score).slice(0,4);
        if(!ranked.length)return null;
        return {name,ranked};
      }catch{return null;}
    }));
    const all=responses.filter(Boolean).flatMap(r=>r.ranked.map(x=>({x:x.x,score:x.score,engine:r.name})));
    all.sort((a,b)=>b.score-a.score);
    const unique=[];const seen=new Set();
    for(const item of all){
      const key=item.x.toLowerCase().replace(/\s+/g,' ').slice(0,260);
      if(seen.has(key))continue;seen.add(key);unique.push(item);
      if(unique.length>=4)break;
    }
    if(!unique.length)return null;
    return {text:`Jag hittade detta från aktuella webbsökningar:\n\n${unique.slice(0,3).map(x=>x.x).join('\n\n')}`,source:'Google + Bing via aktuell webbsökning',url:googleSearchUrl(query)};
  }catch{return null}
}

async function universalWebAnswer(query){
  const q=normaliseQuery(query); if(!q)return null;
  const ctx=window.SaidUniversalContext?.contextFor?.(q);
  const variants=window.SaidUniversalContext?.queryVariants?.(q)||[q];
  if(looksLikeHealthQuestion(q.toLowerCase())){
    const base=safeHealthAnswer(q);
    return {text:base+'\n\n'+(window.SaidSafety?.disclaimer?.()||''),source:'Allmän säkerhetsinformation',url:googleSearchUrl(q)};
  }
  const place=await nearbyPlaceAnswer(q); if(place)return place;
  const directQueries=variants.slice(0,2);
  const direct=await Promise.all(directQueries.map(x=>Promise.all([duckAnswer(x),wikipediaAnswer(x)])));
  const candidates=direct.flat().filter(Boolean).sort((a,b)=>(b.score||0)-(a.score||0));
  if(candidates.length&&((candidates[0].score||0)>=0.55))return candidates[0];
  for(const v of variants){
    const web=await jinaSearchAnswer(v);
    if(web){const wt=v20CleanWebText(web.text);return {text:ctx?.context&&ctx.context!==q?`Jag tog hänsyn till det vi pratade om tidigare.\n\n${wt}`:wt,source:web.source,url:web.url||googleSearchUrl(v)};}
  }
  if(candidates.length)return candidates[0];
  return {text:'Jag förstod att du ställer en fråga, men jag hittade inget tillräckligt säkert och relevant svar från de öppna webbkällorna just nu. Jag vill inte gissa eller svara på en annan fråga.',source:'Webbsökning',url:googleSearchUrl(q)};
}


// === FINAL V13 ADDITION: Transport & körkort + stronger universal question routing ===
// This mobile layer mirrors the project's two production services without requiring
// Python on the phone. It is additive: existing CV/job/letter/document/voice/chat
// functions remain unchanged.

const TRANSPORT_TOPICS={
  personbil:['körkort','b körkort','b-körkort','bilkörkort','personbil'],
  taxi:['taxi','taxiförarprov','taxiförarlegitimation','taxiförare','taxiprovet','taxikörprov'],
  buss:['busskörkort','d körkort','d-körkort','bussförare','buss'],
  lastbil:['lastbilskörkort','c körkort','c-körkort','lastbil'],
  släp:['släp','släpvagn','be körkort','b96'],
  mc:['motorcykel','mc-körkort','a körkort','a-körkort'],
  yrkestrafik:['yrkestrafik','yrkesförare','yrkeskompetens','ykb'],
  trafiksäkerhet:['trafiksäkerhet','säker körning','säkerhet i trafiken','hastighet','bilbälte','barn i bil'],
  förarprov:['teoriprov','kunskapsprov','körprov','uppkörning','förarprov','riskutbildning','riskettan','risktvåan','risk 1','risk 2']
};
const TRANSPORT_GENERAL=['körkort','körprov','teoriprov','uppkörning','trafik','taxi','busskörkort','lastbilskörkort','släpvagn','motorcykel','förarprov','riskutbildning','riskettan','risktvåan','yrkestrafik','ykb','taxiprovet'];
const TRANSPORT_STUDY=['prov','provet','plugga','pluggar','teorifrågor','inför prov','innan provet','vad ska jag tänka','vad kan de fråga','vad kommer på provet','hur börjar','vad ska jag göra först','steg','studieplan'];
const TRANSPORT_CURRENT=['aktuell','aktuella','idag','nu','senaste','gäller','regler','krav','pris','avgift','adress','boka','bokning','öppettid'];

function hasPhrase(text,phrase){
  const t=normaliseQuery(text).toLowerCase(), p=normaliseQuery(phrase).toLowerCase();
  if(p.length<=2)return new RegExp('(^|\\s)'+p.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'($|\\s|[-])','i').test(t);
  return t.includes(p);
}
function transportIntent(text){
  const t=normaliseQuery(text).toLowerCase();
  if(!TRANSPORT_GENERAL.some(x=>hasPhrase(t,x)))return null;
  let topic='';
  for(const [name,aliases] of Object.entries(TRANSPORT_TOPICS)){
    if(aliases.some(x=>hasPhrase(t,x))){topic=name;break;}
  }
  if(!topic&&/\bkörkort\b/i.test(t))topic='personbil';
  const study=TRANSPORT_STUDY.some(x=>hasPhrase(t,x));
  const current=TRANSPORT_CURRENT.some(x=>hasPhrase(t,x));
  return {topic:topic||'trafik',kind:study?'study':current?'current':'general'};
}
function transportStudyAnswer(intent){
  const label={
    taxi:'TAXI / TAXIFÖRARPROV',
    personbil:'B-KÖRKORT / PERSONBIL',
    buss:'BUSS / D-KÖRKORT',
    lastbil:'LASTBIL / C-KÖRKORT',
    släp:'SLÄP / BE / B96',
    mc:'MC / A-KÖRKORT',
    yrkestrafik:'YRKESFÖRARE / YKB',
    trafiksäkerhet:'TRAFIKSÄKERHET',
    förarprov:'FÖRARPROV'
  }[intent.topic]||'KÖRKORT OCH TRAFIK';
  if(intent.topic==='taxi'){
    return `🚕 ${label}\n\n1. Kontrollera vilket prov du ska göra och vilka aktuella krav som gäller.\n2. Träna trafikregler, säkerhet, hastighetsanpassning, placering, väjningsregler och riskbedömning.\n3. Inför körprovet: planera långt fram, läs skyltar och trafik, kör mjukt och säkert och stressa inte.\n4. Tänk särskilt på passagerarsäkerhet, tydlig planering, filbyten, korsningar, avstånd och att anpassa hastigheten efter situationen.\n5. Jag kan träna dig med frågor en i taget och förklara varför varje svar är rätt.\n\nFör aktuella provregler använder jag Trafikverket och Transportstyrelsen som källor i stället för att gissa.`;
  }
  return `🚗 ${label}\n\n1. Börja med behörighet och grundläggande trafikregler.\n2. Plugga vägmärken, väjningsregler, hastighet, placering och avstånd.\n3. Träna risker: trötthet, alkohol/droger, hastighet och oskyddade trafikanter.\n4. Gå igenom fordon, säkerhetskontroll och passagerarsäkerhet där det är relevant.\n5. Träna blandade teorifrågor och förklara varför svaret är rätt.\n6. Inför körprovet: planera, titta långt fram, anpassa hastigheten och kör säkert – inte bara efter en memorerad rutt.\n\nJag kan också göra ett komplett övningsprov och rätta frågorna en i taget.`;
}
function transportSearchQuery(original,intent){
  const official='site:trafikverket.se OR site:transportstyrelsen.se';
  if(intent.kind==='current')return `${normaliseQuery(original)} ${official}`;
  return `${normaliseQuery(original)} ${official}`;
}

// Stronger universal relevance: keep the user's question intact, but rank by
// meaningful terms, exact phrases and query coverage. Irrelevant pages are rejected.
function universalQuestionProfile(query){
  const q=normaliseQuery(query).toLowerCase();
  const words=tokens(q);
  const type=
    /\b(vem|person|född|ålder|gammal)\b/.test(q)?'person':
    /\b(var ligger|var finns|närmaste|adress|vägen till|nära)\b/.test(q)?'place':
    /\b(nyhet|nyheter|senaste|idag|igår|imorgon|världen)\b/.test(q)?'news':
    /\b(lag|lagen|regler|regel|rätt|krav|förbud|tillåtet)\b/.test(q)?'law':
    /\b(från .* till|till .* från|resa|resan|buss|tåg|flyg|bil|hur lång tid|restid)\b/.test(q)?'travel':
    /\b(pris|kostar|avgift)\b/.test(q)?'price':
    'general';
  return {q,words,type};
}
function improvedSearchQuery(query){
  const p=universalQuestionProfile(query);
  if(p.type==='news')return `${p.q} senaste nyheter Sverige`;
  if(p.type==='law')return `${p.q} Sverige aktuell lag regler`;
  if(p.type==='travel')return `${p.q} Sverige restid resa`;
  return p.q;
}
function improvedWebRelevance(query,text,allowPartial=true){
  const p=universalQuestionProfile(query);
  const hay=normaliseQuery(text).toLowerCase();
  const ht=tokens(hay);
  if(!p.words.length||!ht.length)return 0;
  let hits=0;
  for(const w of p.words){
    if(ht.some(h=>h===w || h.includes(w) || w.includes(h) || editDistance(h,w)<=1))hits++;
  }
  const coverage=hits/p.words.length;
  const exact=hay.includes(p.q)?0.32:0;
  const anchorHits=p.words.filter(w=>w.length>=5 && ht.some(h=>h===w||h.includes(w)||w.includes(h))).length;
  const anchorCoverage=p.words.filter(w=>w.length>=5).length ? anchorHits/p.words.filter(w=>w.length>=5).length : coverage;
  const questionBoost=(p.type==='person'&&anchorHits>=1)||(p.type!=='general'&&anchorHits>=1)?0.08:0;
  return Math.min(1,coverage*0.48+anchorCoverage*0.24+exact+questionBoost+(allowPartial?0:0.04));
}

function contextualUniversalQuery(query){
  const q=window.SaidUniversalQuery?.normalize?.(normaliseQuery(query))||normaliseQuery(query);
  const lower=q.toLowerCase();
  const vague=/\b(det|den|den här|det här|där|här|han|hon|denna|detta|samma|igår|imorgon|nästa vecka|senare|och hur|vilken tid|var då)\b/.test(lower);
  const users=recentUserMessages(8);
  const mem=window.SaidUniversalMemory?.summary?.()||'';
  if(!vague&& !mem)return q;
  const previous=users.slice(0,-1).slice(-3).join(' | ');
  return `${q}${previous?' Kontext från tidigare frågor: '+previous:''}${mem?' Sparad situationskontext: '+mem:''}`;
}
async function universalNewsAnswerV14(query){
  if(!window.SaidUniversalNews?.search)return null;
  const q=normaliseQuery(query);
  const articles=await window.SaidUniversalNews.search(q);
  if(!articles?.length)return null;
  const lines=articles.slice(0,5).map((a,i)=>`${i+1}. ${a.title}${a.domain?' — '+a.domain:''}${a.date?' ('+a.date+')':''}`);
  return {text:`📰 Jag hittade aktuella nyheter som matchar frågan:

${lines.join('\n')}

Jag visar rubrikerna från aktuell nyhetssökning. Öppna länken om du vill läsa källorna.`,source:'GDELT aktuell nyhetssökning',url:articles[0].url||googleSearchUrl(q)};
}

async function universalWebAnswerV12(query){
  const original=normaliseQuery(query);
  if(!original)return null;
  const contextual=contextualUniversalQuery(original);
  const searchQ=improvedSearchQuery(contextual);
  // Place lookup remains the most precise path when the question asks for a nearby place.
  const place=await nearbyPlaceAnswer(original);
  if(place)return place;

  const [ddg,wiki]=await Promise.all([duckAnswer(searchQ),wikipediaAnswer(searchQ)]);
  const candidates=[ddg,wiki].filter(Boolean).map(x=>({...x,score:Math.max(x.score||0,improvedWebRelevance(original,x.text||'',true))}))
    .filter(x=>(x.score||0)>=0.60).sort((a,b)=>(b.score||0)-(a.score||0));
  if(candidates.length)return candidates[0];

  const web=await jinaSearchAnswer(searchQ);
  if(web){
    const score=improvedWebRelevance(original,web.text||'',true);
    if(score>=0.52)return web;
  }
  if(window.SaidUniversalResearch?.search){
    const rows=await window.SaidUniversalResearch.search(searchQ);
    const ranked=(rows||[]).map(x=>({...x,score:improvedWebRelevance(original,x.text||'',true)})).filter(x=>x.score>=0.42).sort((a,b)=>b.score-a.score);
    if(ranked.length){
      return {text:`Jag hittade ett relevant svar i en aktuell webbsökning:

${ranked[0].text}`,source:`${ranked[0].source} + fler öppna källor`,url:googleSearchUrl(searchQ)};
    }
  }
  return null;
}

async function transportAnswerV12(original,intent){
  if(intent.kind==='study')return {text:transportStudyAnswer(intent),source:'Said Assistant 3.0 – Transport & körkort',url:'https://www.trafikverket.se/'};
  const result=await universalWebAnswerV12(transportSearchQuery(original,intent));
  if(result)return result;
  return {text:`Jag förstår att frågan gäller ${intent.topic}. Jag hittade inget tillräckligt tydligt aktuellt svar just nu, så jag vill inte gissa. För regler och prov använder jag Trafikverket och Transportstyrelsen när aktuell information behövs.`,source:'Officiella transportkällor',url:'https://www.trafikverket.se/'};
}


// === FINAL UNIVERSAL INTELLIGENCE PATCH ===
// This layer is intentionally mobile-first. It makes ordinary natural-language
// questions actionable instead of routing only by a few keywords.
// It never opens Google automatically; external pages are links only.
function recentConversationText(limit=10){
  const msgs=Array.isArray(chatState?.messages)?chatState.messages:[];
  return msgs.slice(-limit).map(m=>`${m.role==='user'?'USER':'ASSISTANT'}: ${String(m.text||'')}`).join('\n');
}
function recentUserMessages(limit=8){
  const msgs=Array.isArray(chatState?.messages)?chatState.messages:[];
  return msgs.filter(m=>m.role==='user'&&String(m.text||'').trim()).slice(-limit).map(m=>String(m.text||'').trim());
}
const TRAVEL_CONTEXT_PREFIX='saidAssistantTravelContextV13_';
function travelContext(){
  try{return JSON.parse(S.get(TRAVEL_CONTEXT_PREFIX+(chatState?.id||''), '{}'))||{}}catch{return {};}
}
function saveTravelContext(ctx){
  try{S.set(TRAVEL_CONTEXT_PREFIX+(chatState?.id||''),JSON.stringify(ctx||{}));}catch{}
}
function mergeTravelContext(next){
  const prev=travelContext();
  const merged={...prev,...Object.fromEntries(Object.entries(next||{}).filter(([,v])=>v!==''&&v!==null&&v!==undefined))};
  saveTravelContext(merged); return merged;
}
function travelWords(){return /\b(resa|reser|resan|åka|åker|åk|köra|kör|flyga|flyg|promenera|gå|tåg|buss|tunnelbana|pendeltåg|bil|personbil|restid|restiden|hur länge|hur långt|kilometer|minuter|tim|hemifrån|hemmet|flygplats)\b/i}
function cleanPlaceName(s){
  let v=normaliseQuery(String(s||''))
    .replace(/^(?:det\s+är|det\s+var|jag\s+ska|jag\s+vill|jag\s+reser|jag\s+åker)\s+/i,'')
    .replace(/^(?:jag\s+ska\s+)?(?:åka|resa|köra|flyga|promenera|gå)\s+/i,'')
    .replace(/^(?:till|från|ifrån|mot)\s+/i,'')
    .replace(/\s+(?:och|,)?\s+jag\s+(?:ska\s+)?(?:åka|resa|köra|flyga|promenera|gå)\b.*$/i,'')
    .replace(/\s+(?:för att|eftersom|därför att|för jag|för att jag)\b.*$/i,'')
    .replace(/\s+(?:med|på)\s+(?:personbil|bil|bilen|tåg|buss|tunnelbana|pendeltåg|sl|kollektivtrafik|fots|till fots)$/i,'')
    .replace(/\s+(?:imorgon|i morgon|idag|nu|senare|nästa vecka|nästa månad|den här veckan)$/i,'')
    .replace(/[,.!?]+$/,'').trim();
  if(/^(?:jag\s+ska|jag\s+vill|jag\s+reser|jag\s+åker|jag\s+ska\s+resa|resa|åka|köra|flyga|det\s+är|och|för|eftersom)$/.test(v.toLowerCase()))return '';
  return v;
}
function extractMode(text){
  const q=normaliseQuery(text).toLowerCase();
  if(/(?:^|\s)(personbil|bil|bilen|bilresa)(?:\s|$|[,?.!])/.test(q)||/med\s+(?:bil|bilen)|köra\s+bil|egen\s+bil/.test(q))return 'driving';
  if(/(?:^|\s)(promenera|promenad|gå|gång)(?:\s|$|[,?.!])|till\s+fots/.test(q))return 'walking';
  if(/(?:^|\s)(buss|tåg|tunnelbana|pendeltåg|kollektivtrafik|kollektiv|sl)(?:\s|$|[,?.!])/.test(q))return 'transit';
  if(/(?:^|\s)(flyga|flyg|flygplan)(?:\s|$|[,?.!])/.test(q))return 'flight';
  return 'all';
}
function extractDateTime(text){
  const q=normaliseQuery(text).toLowerCase();
  const time=(q.match(/\b(?:kl(?:ockan)?\.?\s*)?(\d{1,2})(?:[:.](\d{2}))?\b/)||[]);
  const timeText=time[1]?(time[2]?`${String(time[1]).padStart(2,'0')}:${time[2]}`:`${String(time[1]).padStart(2,'0')}:00`):'';
  let dateText='';
  if(/\b(imorgon|i morgon)\b/.test(q))dateText='imorgon';
  else if(/\b(nästa vecka)\b/.test(q))dateText='nästa vecka';
  else if(/\b(nästa månad)\b/.test(q))dateText='nästa månad';
  else if(/\b(idag)\b/.test(q))dateText='idag';
  const iso=q.match(/\b(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})\b/);
  if(iso)dateText=`${iso[1]}-${String(iso[2]).padStart(2,'0')}-${String(iso[3]).padStart(2,'0')}`;
  return {time:timeText,date:dateText};
}
function parseTravelPlaces(text){
  const q=normaliseQuery(text);
  let from='',to='';
  const stop=/\s+(?:med|på|för att|eftersom|därför att|och jag|men jag|jag har|har jag|flyget|flyg|imorgon|i morgon|idag|nu|senare|nästa vecka|nästa månad|klockan\s*\d|kl\.?\s*\d|\d{1,2}[:.]\d{2})\b|[?.!]/i;
  const patterns=[
    new RegExp('\\bfrån\\s+(.+?)\\s+till\\s+(.+?)(?='+stop.source+'|$)','i'),
    new RegExp('\\b(.+?)\\s+till\\s+(.+?)(?='+stop.source+'|$)','i')
  ];
  for(const re of patterns){
    const m=q.match(re);
    if(m){from=cleanPlaceName(m[1]);to=cleanPlaceName(m[2]);if(from&&to)break;}
  }
  if(!from||!to){
    const m=q.match(/\btill\s+(.+?)\s+från\s+(.+?)(?=\s+(?:med|på|för att|eftersom|och jag|jag har|flyget|imorgon|i morgon|idag|nästa vecka|klockan\s*\d|kl\.?\s*\d|\d{1,2}[:.]\d{2})\b|[?.!]|$)/i);
    if(m){to=cleanPlaceName(m[1]);from=cleanPlaceName(m[2]);}
  }
  return {from,to};
}
function extractSingleTravelPlace(text,label){
  const q=normaliseQuery(text);
  const stop='(?=\\s+(?:till|från|ifrån|och|men|med|på|för att|eftersom|jag har|flyget|flyg|imorgon|i morgon|idag|nu|senare|nästa vecka|kl\\.?\\s*\\d|\\d{1,2}[:.]\\d{2})\\b|[?.!]|$)';
  const re=label==='from'?new RegExp('\\b(?:från|ifrån)\\s+(.+?)'+stop,'i'):new RegExp('\\b(?:till|mot)\\s+(.+?)'+stop,'i');
  const m=q.match(re);return m?cleanPlaceName(m[1]):'';
}
function extractHomePlace(text){
  const q=normaliseQuery(text);
  const patterns=[
    /\b(?:jag\s+)?(?:bor|hemma)\s+(?:i|på)\s+(.+?)(?=\s+(?:och|men|nästa|imorgon|idag)\b|[?.!]|$)/i,
    /\b(?:min\s+)?hemort\s*(?:är|ar|=)?\s*(.+?)(?=[?.!]|$)/i,
    /\b(?:jag\s+)?bor\s+(.+?)(?=[?.!]|$)/i
  ];
  for(const re of patterns){const m=q.match(re);if(m){const v=cleanPlaceName(m[1]);if(v&&v.length<=80)return v;}}
  return '';
}
function extractHomeFollowup(text){
  const q=normaliseQuery(text);
  const m=q.match(/^\s*(?:det|den|det här|den här)\s+(?:är|ar)\s+(.+?)\s*[?.!]*\s*$/i);
  if(m){const v=cleanPlaceName(m[1]);if(v&&v.length<=80)return v;}
  return '';
}
function extractFlightDestination(text){
  const q=normaliseQuery(text);
  const m=q.match(/\b(?:flyg(?:et|plan)?|flyger|resa|reser|åka|åk(?:er)?)\s+(?:utomlands\s+)?(?:till|mot)\s+(.+?)(?=\s+(?:från|via|nästa|imorgon|i morgon|idag|nu|hemifrån|med|på|klockan\s*\d|kl\.?\s*\d|\d{1,2}[:.]\d{2})\b|[?.!]|$)/i);
  return m?cleanPlaceName(m[1]):'';
}
function isCountryLike(place){return /^(turkiet|afghanistan|pakistan|tyskland|frankrike|spanien|italien|england|storbritannien|usa|kanada|norge|danmark|finland|europa|utlandet|utomlands)$/i.test(cleanPlaceName(place));}
function isAirportLike(place){return /\b(arlanda|airport|flygplats|landvetter|skavsta|bromma|kastrup|istanbul airport|sabiha)\b/i.test(cleanPlaceName(place));}
function extractTravelIntent(text){
  const q=normaliseQuery(text);
  const users=recentUserMessages(12);
  const currentPlaces=parseTravelPlaces(q);
  const explicitPair=!!currentPlaces.from&&!!currentPlaces.to;
  const currentFlightDestination=extractFlightDestination(q);
  const freshFlight=!!currentFlightDestination || isCountryLike(currentPlaces.to) || /\b(utomlands|utlandsresa|flygresa|flyget|flyg)\b/i.test(q);
  let from=currentPlaces.from,to=currentPlaces.to;
  let home=extractHomePlace(q);
  const ctxBefore=travelContext();
  // A short answer to a previous home-location question, such as
  // “Det är Upplands Väsby”, is a continuation of the active travel plan.
  // It must never be sent to the generic web search as a new question.
  if(!home && (ctxBefore.from||ctxBefore.to||ctxBefore.flightDestination)) home=extractHomeFollowup(q);
  if(!home && S.get('profileLocation','').trim()) home=S.get('profileLocation','').trim();
  // Natural follow-ups: when the assistant previously asked for the airport or
  // destination, a short answer such as "Arlanda" or "Turkiet" is still
  // interpreted from the active conversation instead of being treated as a
  // brand-new unrelated query.
  if(!from&&!to && isAirportLike(q) && (ctxBefore.to||ctxBefore.flightDestination)) from=cleanPlaceName(q);
  if(!from&&!to && isCountryLike(q) && ctxBefore.from) to=cleanPlaceName(q);
  let flightDestination=currentFlightDestination;
  if(!from)from=extractSingleTravelPlace(q,'from');
  if(!to)to=extractSingleTravelPlace(q,'to');
  const dt=extractDateTime(q);
  const ctx=travelContext();
  // A complete origin→destination sentence starts a new trip. This prevents
  // yesterday's route, date or flight destination from contaminating a new one.
  if(explicitPair){
    const keepHome=home||ctx.home||String(S.get('profileLocation','')||'').trim();
    Object.keys(ctx).forEach(k=>delete ctx[k]);
    if(keepHome)ctx.home=keepHome;
  }else{
    if(!from&&ctx.from)from=ctx.from;
    if(!to&&ctx.to)to=ctx.to;
  }
  let homeFromContext=home||ctx.home||'';
  if(!homeFromContext){
    for(let i=users.length-1;i>=0;i--){const h=extractHomePlace(users[i]);if(h){homeFromContext=h;break;}}
  }
  // Only inherit old route fields when this is a follow-up, not a fresh route.
  if(!explicitPair){
    for(let i=users.length-1;i>=0;i--){
      const old=users[i],p=parseTravelPlaces(old);
      if(!from&&p.from)from=p.from;
      if(!to&&p.to)to=p.to;
      if(!flightDestination){const f=extractFlightDestination(old);if(f)flightDestination=f;}
      if(from&&to&&flightDestination)break;
    }
  }
  const mode=extractMode(q)!=='all'?extractMode(q):(explicitPair?'all':(ctx.mode||'all'));
  const date=dt.date|| (explicitPair?'':(ctx.date||''));
  const time=dt.time|| (explicitPair?'':(ctx.time||''));
  const savedHome=String(S.get('profileLocation','')||'').trim();
  const travelLike=travelWords().test(q)||!!(from||to||home||currentFlightDestination)||!!ctx.from||!!ctx.to||!!ctx.flightDestination;
  if(!travelLike)return null;
  if(homeFromContext)ctx.home=homeFromContext;
  if(from)ctx.from=from;
  if(to)ctx.to=to;
  if(flightDestination)ctx.flightDestination=flightDestination;
  if(date)ctx.date=date;
  if(time)ctx.time=time;
  if(mode&&mode!=='all')ctx.mode=mode;
  ctx.international=!!(freshFlight||isAirportLike(from)&&isCountryLike(to)||isCountryLike(to)||isCountryLike(ctx.flightDestination)||(!explicitPair&&ctx.international));
  if(explicitPair){
    // Save the new context directly; do not merge old persisted context back in.
    saveTravelContext(ctx);
  }else{
    mergeTravelContext(ctx);
  }
  from=ctx.from||from;to=ctx.to||to;
  const flightDestinationFinal=ctx.flightDestination||flightDestination||'';
  if(!to&&flightDestinationFinal)to=flightDestinationFinal;
  const international=!!ctx.international;
  if(!from&&homeFromContext)from=homeFromContext;
  if(!from&&!to)return {kind:'incomplete',from:'',to:'',home:homeFromContext||savedHome,date,time,mode,international,original:q};
  if(!from||!to)return {kind:'incomplete',from:from||'',to:to||'',home:homeFromContext||savedHome,date,time,mode,international,original:q};
  return {kind:'route',from,to,home:homeFromContext||savedHome,date,time,mode,international,flightDestination:flightDestinationFinal,original:q};
}
async function geocodePlace(place){
  const q=cleanPlaceName(place);if(!q)return null;
  const queries=[q,`${q}, Sweden`];
  let best=null;
  for(const query of queries){
    try{
      const url='https://nominatim.openstreetmap.org/search?format=jsonv2&limit=8&accept-language=sv&q='+encodeURIComponent(query);
      const r=await fetch(url,{headers:{accept:'application/json'},signal:AbortSignal.timeout?.(9000)});
      if(!r.ok)continue;
      const rows=await r.json();
      for(const row of (rows||[])){
        const lat=Number(row.lat),lon=Number(row.lon);if(!Number.isFinite(lat)||!Number.isFinite(lon))continue;
        const hay=normaliseQuery(`${row.display_name||''} ${row.name||''}`).toLowerCase();
        const qt=tokens(q);
        const hits=qt.filter(w=>hay.includes(w)).length;
        const exact=hay.includes(q.toLowerCase())?0.5:0;
        const typeBoost=/city|town|village|suburb|airport|municipality|administrative|station/i.test(row.type||'')?0.08:0;
        const score=(qt.length?hits/qt.length:0)+exact+typeBoost;
        if(!best||score>best.score)best={score,lat,lon,name:row.display_name||q,raw:row};
      }
      if(best && best.score>=0.95)break;
    }catch{}
  }
  return best;
}
async function osrmRoute(from,to,mode){
  if(mode!=='driving')return null;
  try{
    const url=`https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=false&alternatives=true`;
    const r=await fetch(url,{headers:{accept:'application/json'},signal:AbortSignal.timeout?.(10000)});
    if(!r.ok)return null;
    const j=await r.json(),routes=j?.routes||[];if(!routes.length)return null;
    const best=routes[0];return {seconds:best.duration,distanceKm:best.distance/1000};
  }catch{return null;}
}
function haversineKm2(lat1,lon1,lat2,lon2){
  const R=6371,rad=x=>x*Math.PI/180;
  const dLat=rad(lat2-lat1),dLon=rad(lon2-lon1);
  const a=Math.sin(dLat/2)**2+Math.cos(rad(lat1))*Math.cos(rad(lat2))*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}
function routeDurationText(seconds){
  const total=Math.max(0,Math.round(Number(seconds)||0)/60);
  const minutes=Math.max(1,Math.round(total));
  if(minutes<60)return `${minutes} min`;
  const h=Math.floor(minutes/60),m=minutes%60;
  return m?`${h} h ${m} min`:`${h} h`;
}
function walkingEstimate(straightKm){const routeKm=straightKm*1.25;return {km:routeKm,minutes:Math.max(1,Math.round((routeKm/5)*60))};}
async function transitSearchEstimate(from,to){
  try{
    const queries=[
      `${from} till ${to} restid buss tåg tunnelbana idag`,
      `${from} ${to} kollektivtrafik restid SL`,
      `${from} ${to} Google Maps transit restid`
    ];
    const responses=await Promise.all(queries.map(async q=>{
      try{
        const target='https://www.google.com/search?q='+encodeURIComponent(q)+'&hl=sv';
        const r=await fetch('https://r.jina.ai/'+target,{headers:{accept:'text/plain'},signal:AbortSignal.timeout?.(12000)});
        if(!r.ok)return '';
        return cleanText(await r.text());
      }catch{return '';}
    }));
    const lines=responses.flatMap(text=>text.split(/(?<=\.)\s+/).map(x=>x.trim()))
      .filter(x=>x.length>35)
      .filter(x=>/SL|buss|tåg|pendeltåg|tunnelbana|kollektiv|restid|minut|timme|km/i.test(x));
    const ranked=lines.map(x=>({x,score:improvedWebRelevance(`${from} ${to} restid buss tåg`,x,true)}))
      .filter(x=>x.score>=0.32).sort((a,b)=>b.score-a.score);
    const unique=[];const seen=new Set();
    for(const x of ranked){const k=x.x.toLowerCase().replace(/\s+/g,' ').slice(0,220);if(seen.has(k))continue;seen.add(k);unique.push(x.x);if(unique.length>=3)break;}
    return unique.length?unique.join('\n'):null;
  }catch{return null;}
}
function usersHaveHomeOrigin(query){
  const q=normaliseQuery(query).toLowerCase();
  if(/\b(hemifrån|från hemmet|från mitt hem|hemifrån hemma)\b/.test(q))return true;
  const saved=profileLocation();
  if(saved && /\b(hem|hemifrån|bor i|hemort)\b/i.test(q))return true;
  return !!travelContext().home;
}
function googleMapsDirectionsUrl(from,to,mode){
  const tm=mode==='driving'?'driving':mode==='walking'?'walking':mode==='transit'?'transit':'transit';
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}&travelmode=${tm}`;
}
function flightCheckinHours(query){
  const q=normaliseQuery(query).toLowerCase();
  if(/\b(usa|kanada|storbritannien|uk|london)\b/.test(q))return 3;
  if(/\b(utrikes|utomlands|turkiet|internationell|internationellt)\b/.test(q))return 3;
  return 2;
}
async function universalTravelAnswerV12(query){
  const intent=extractTravelIntent(query); if(!intent)return null;
  if(intent.kind==='incomplete'){
    if(intent.from&&!intent.to)return {text:`Jag förstår. Du ska resa från ${intent.from}. Vart ska du åka? Du kan bara svara med platsen, till exempel ”Turkiet” eller ”Sollentuna”.`,source:'Reseplanering',url:null};
    if(intent.to&&!intent.from)return {text:`Jag förstår att du ska resa till ${intent.to}. Varifrån startar du? Om du har sparat din hemort använder jag den automatiskt.`,source:'Reseplanering',url:null};
    return {text:'Jag förstår att du planerar en resa. Säg bara vart du ska och gärna när; jag håller kvar det vi redan har sagt i samma chatt.',source:'Reseplanering',url:null};
  }
  // International trip: an airport/country pair is a flight plan, not a road route.
  if(intent.international && (isAirportLike(intent.from)||isCountryLike(intent.to))){
    const ctx=travelContext();
    const home=ctx.home||intent.home||'';
    const time=ctx.time||intent.time||'';
    const date=ctx.date||intent.date||'';
    const airport=isAirportLike(intent.from)?intent.from:'';
    const flightDestination=intent.flightDestination||intent.to;
    const homePlace=home && airport && normaliseQuery(home).toLowerCase()!==normaliseQuery(airport).toLowerCase()?home:'';
    if(!airport){
      return {text:`Jag förstår att du ska resa till ${flightDestination}. Vilken flygplats ska du åka från?`,source:'Reseplanering',url:null };
    }
    if(!homePlace){
      return {text:`Jag förstår: du ska flyga från ${airport} till ${flightDestination}. Om du vill att jag räknar när du behöver lämna hemmet behöver jag din hemort. Om den redan finns sparad använder jag den.`,source:'Reseplanering',url:null };
    }
    const airportGeo=await geocodePlace(airport),homeGeo=await geocodePlace(homePlace);
    if(!airportGeo||!homeGeo)return {text:`Jag förstår resan: ${homePlace} → ${airport} → ${intent.to}. Jag kunde inte verifiera vägen till flygplatsen just nu.`,source:'Reseplanering',url:null};
    const drive=await osrmRoute(homeGeo,airportGeo,'driving');
    const walk=walkingEstimate(haversineKm2(homeGeo.lat,homeGeo.lon,airportGeo.lat,airportGeo.lon));
    const checkHours=flightCheckinHours(flightDestination);
    const lines=[`✈️ Jag förstår resan nu: ${homePlace} → ${airport} → ${flightDestination}.`];
    if(date)lines.push(`📅 Datum: ${date}.`);
    if(time)lines.push(`🕐 Flyget avgår kl. ${time}.`); else lines.push('🕐 Jag saknar fortfarande avgångstiden för flyget.');
    lines.push(drive?`🚗 Med bil från ${homePlace} till ${airport}: cirka ${routeDurationText(drive.seconds)} (${drive.distanceKm.toFixed(1)} km).`:`🚗 Bil: jag kunde inte verifiera aktuell körtid just nu.`);
    lines.push(`🚶 Promenad från ${homePlace} till ${airport}: ungefär ${routeDurationText(walk.minutes*60)} (${walk.km.toFixed(1)} km uppskattning).`);
    if(time){
      const parts=time.split(':').map(Number); const dep=parts[0]*60+parts[1]; const airportTarget=dep-checkHours*60;
      const leave=drive?airportTarget-Math.ceil(drive.seconds/60)-20:null;
      if(leave!==null){const hh=Math.floor(((leave%1440)+1440)%1440/60),mm=((leave%60)+60)%60;lines.push(`⏰ För en utlandsresa rekommenderar jag att vara på flygplatsen ungefär ${checkHours} timmar före avgång. Med cirka 20 minuters extra marginal blir en rimlig avgång hemifrån omkring ${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}.`);}
    }
    lines.push('Jag håller kvar resan i samtalet. Säg bara en ny tid eller till exempel ”med bil”, så räknar jag om.');
    return {text:lines.join('\n'),source:'OpenStreetMap + OSRM + aktuell webbsökning',url:null};
  }
  const [a,b]=await Promise.all([geocodePlace(intent.from),geocodePlace(intent.to)]);
  if(!a||!b)return {text:`Jag förstår frågan som en resa från ${intent.from} till ${intent.to}, men jag kunde inte verifiera båda platserna säkert just nu. Jag vill inte hitta på en restid.`,source:'Resesökning',url:null};
  const straight=haversineKm2(a.lat,a.lon,b.lat,b.lon),drive=await osrmRoute(a,b,'driving'),walk=walkingEstimate(straight),transit=await transitSearchEstimate(intent.from,intent.to);
  const lines=[`📍 ${intent.from} → ${intent.to}`];
  if(intent.mode==='driving')lines.push(drive?`🚗 Personbil: cirka ${routeDurationText(drive.seconds)} (${drive.distanceKm.toFixed(1)} km på väg).`:`🚗 Personbil: aktuell vägrutt kunde inte hämtas just nu.`);
  else if(intent.mode==='walking')lines.push(`🚶 Promenad: ungefär ${routeDurationText(walk.minutes*60)} och cirka ${walk.km.toFixed(1)} km som uppskattning.`);
  else if(intent.mode==='transit')lines.push(transit?`🚌🚆 Buss/tåg: ${transit}`:`🚌🚆 Buss/tåg: aktuell restid kunde inte verifieras just nu.`);
  else {lines.push(`🚶 Promenad: ungefär ${routeDurationText(walk.minutes*60)} (${walk.km.toFixed(1)} km uppskattning).`);lines.push(drive?`🚗 Personbil: cirka ${routeDurationText(drive.seconds)} (${drive.distanceKm.toFixed(1)} km på väg).`:`🚗 Personbil: aktuell körtid kunde inte hämtas just nu.`);lines.push(transit?`🚌🚆 Buss/tåg: ${transit}`:`🚌🚆 Buss/tåg: aktuell restid kunde inte verifieras just nu.`);}
  lines.push('Jag förstod detta som en resefråga även utan ett särskilt kommando. Du kan fortsätta naturligt, till exempel ”i morgon”, ”med bil” eller ”och hur långt är det?”.');
  return {text:lines.join('\n'),source:'OpenStreetMap + OSRM + aktuell webbsökning',url:null};
}
function universalClarificationV12(query){
  const intent=extractTravelIntent(query);if(!intent||intent.kind!=='incomplete')return null;
  return null;
}


// === V20 FINAL CONVERSATION INTELLIGENCE PATCH ===
function v20CleanWebText(text){
  let x=String(text||'').replace(/\r/g,'');
  x=x.replace(/https?:\/\/[^\s)]+/gi,'').replace(/\bURL Source\s*:\s*/gi,'').replace(/\bMarkdown Content\s*:/gi,'');
  x=x.replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/\[[^\]]*\]/g,'').replace(/\s+/g,' ').trim();
  return x.length>1200?x.slice(0,1197).trim()+'…':x;
}
function v20EventStore(){try{return JSON.parse(S.get('saidAssistantEventsV20','{}'))||{}}catch{return {}}}
function v20SaveEvent(name,event){const all=v20EventStore();all[name]={...(all[name]||{}),...event,updatedAt:Date.now()};S.set('saidAssistantEventsV20',JSON.stringify(all));return all[name]}
function v20GetEvent(name){return v20EventStore()[name]||null}
function v20ParseExamEvent(text){
  const q=normaliseQuery(text).toLowerCase();
  if(!/(taxi|taxiförar|körprov|körprovet|uppkörning|förarprov|teoriprov)/.test(q))return null;
  const d=q.match(/\b(20\d{2})[-/.\s](\d{1,2})[-/.\s](\d{1,2})\b/);
  const date=d?`${d[1]}-${String(d[2]).padStart(2,'0')}-${String(d[3]).padStart(2,'0')}`:'';
  const tm=q.match(/\b(?:klockan|kl\.?)\s*(\d{1,2})(?:[:.]([0-5]\d))?\b/i);
  const time=tm?`${String(+tm[1]).padStart(2,'0')}:${tm[2]||'00'}`:'';
  const type=/taxi/.test(q)?'taxi körprov':/teoriprov/.test(q)?'teoriprov':'körprov';
  return {type,date,time,text:normaliseQuery(text)};
}
function v20SaveIntent(text){
  const q=normaliseQuery(text).toLowerCase(), explicit=/\b(spara|lägg in|lägg till|kom ihåg|kom ihag|påminn mig|paminn mig|minna mig|glöm inte)\b/.test(q);
  const event=v20ParseExamEvent(text);
  if(explicit&&event){const saved=v20SaveEvent('taxi_prov',event);return `Okej. Jag har sparat ${saved.type}${saved.date?' den '+saved.date:''}${saved.time?' kl. '+saved.time:''}.`; }
  if(explicit&&/\b(den|det|det här|den här)\b/.test(q)){const prev=v20GetEvent('taxi_prov')||v20GetEvent('travel_plan');if(prev){const name=prev.type||'resan';v20SaveEvent(prev.type==='travel_plan'?'travel_plan':'taxi_prov',prev);return `Okej. Jag har sparat ${name}${prev.date?' den '+prev.date:''}${prev.time?' kl. '+prev.time:''}.`;}}
  return null;
}
function v20RecallIntent(text){
  const q=normaliseQuery(text).toLowerCase(),ev=v20GetEvent('taxi_prov');
  if(ev&&/(när har jag|vilket datum.*prov|när.*körprov|mitt.*taxi.*prov|vilken dag.*prov)/.test(q))return `Ditt ${ev.type} är sparat till ${ev.date||'datum saknas'}${ev.time?' kl. '+ev.time:''}.`;
  return null;
}
function v20TravelStatementGuard(text){
  const q=normaliseQuery(text).toLowerCase();
  return /\b(resa|resan|reser|flyg|flyget|flyga|åka|åker|från|till|flygplats|hemifrån|hemma|bor)\b/.test(q) && (/\b(?:klockan|kl\.?|avgång|avgang|resan är|resan ar|flyget är|flyget ar|flyget avgår|avgår)\s*\d{1,2}(?::\d{2})?\b/.test(q) || /\bresan\s+(?:är|ar)\s+\d{1,2}(?::\d{2})?\b/.test(q));
}

function v21DeviceCommand(text){
  const k=window.SaidDeviceActions?.detect?.(text); if(!k)return null;
  const name=window.SaidDeviceActions.apps[k]?.name||k;
  const opened=window.SaidDeviceActions.open(k);
  const en=window.SaidLanguage?.get?.()==='en';
  return opened?(en?`Opening ${name} now.`:`Jag öppnar ${name} nu.`):(en?`I couldn't open ${name} from this browser.`:`Jag kunde inte öppna ${name} från den här webbläsaren.`);
}
function v21EnglishResponse(text){
  if(window.SaidLanguage?.get?.()!=='en')return text;
  let x=String(text||'');
  // Use the final language dictionary first so built-in answers, statuses and
  // document/CV messages are consistently English without a paid translation API.
  try{
    const dict=window.SaidLanguage?.dict?.en||{};
    const pairs=Object.entries(dict)
      .filter(([sv,en])=>sv&&en&&sv!==en)
      .sort((a,b)=>b[0].length-a[0].length);
    for(const [sv,en] of pairs)x=x.split(sv).join(en);
  }catch{}
  const replacements=[
    ['Jag förstår resan nu:','I understand the trip now:'],['Jag förstår:','I understand:'],['Flyget avgår kl.','The flight departs at'],
    ['Med bil från','By car from'],['till','to'],['cirka','about'],['min','min'],['Jag håller kvar resan i samtalet.','I will keep the trip context in this conversation.'],
    ['Säg bara en ny tid eller till exempel','Just give me a new time or for example'],['så räknar jag om.','and I will recalculate.'],
    ['För en utlandsresa rekommenderar jag att vara på flygplatsen ungefär','For an international trip, I recommend being at the airport about'],
    ['timmar före avgång.','hours before departure.'],['Med cirka 20 minuters extra marginal blir en rimlig avgång hemifrån omkring','With about 20 minutes of extra margin, a reasonable time to leave home is around'],
    ['Jag har sparat','I saved'],['Okej. Jag har sparat','Okay. I saved'],['Klockan är','The current time is'],['Idag är det','Today is'],
    ['Du är','You are'],['år gammal.','years old.'],['Jag har ingen sparad hemort ännu.','I do not have a saved home location yet.'],
    ['Jag har sökt','I searched for'],['och hittade','and found'],['relevanta jobb.','relevant jobs.'],['Jag öppnade','I opened'],['Jag kunde inte','I could not'],
    ['Skriv eller säg en fråga.','Type or say a question.'],['Jag är kvar.','I am here.'],['Jag förstår frågan.','I understand the question.']
  ];
  for(const [aa,b] of replacements)x=x.split(aa).join(b);
  return x;
}

window.updateLanguageSpeech=function(){ if(typeof reader!=='undefined') reader.lang=window.SaidLanguage?.get?.()==='en'?'en-US':'sv-SE'; };

async function answer(t){
  t=window.SaidUniversalQuery?.normalize?.(t)||t;
  t=window.SaidFinalSmart?.preprocess?.(t)||t;
  const s=t.toLowerCase().trim();
  if(!s)return window.SaidLanguage?.get?.()==='en'?'Type or say a question.':'Skriv eller säg en fråga.';
  const local=window.SaidFinalSmart?.localAnswer?.(t); if(local)return local;
  const v21App=v21DeviceCommand(t); if(v21App)return v21App;
  if(/^(hej|hejsan|hallå|halla|tjena)\b/.test(s))return 'Hej Saidkhan! 👋 Jag är redo. Du kan fråga om jobb, CV, brev, dokument, tid, beräkningar eller vanliga frågor. Jag stannar i samma chatt.';
  if(/varför svarar du inte|varfor svarar du inte|svarar du inte|är du kvar|ar du kvar/.test(s))return 'Ja, jag är kvar. Jag arbetar med den senaste frågan. Om jag behöver söka på webben visar jag det tydligt i chatten och om något misslyckas säger jag det direkt i stället för att lämna chatten tom.';
  if(/stoppa|avbryt|sluta söka/.test(s)){stopTask();return 'Jag har stoppat den pågående uppgiften. Du kan fortsätta när du vill.'}
  if(/pausa/.test(s)){pauseAll();return 'Jag har pausat det som pågår. Säg ”fortsätt” när du vill fortsätta.'}
  if(/fortsätt|fortsatt|kör igen/.test(s)){resumeAll();return 'Jag fortsätter där det går. Om inget var pausat kan du skicka nästa fråga.'}
  if(/vad heter du|vem är du/.test(s))return 'Jag är Said Assistant 3.0 – din fristående assistent. Jag kan prata med dig, söka aktuella jobb, matcha mot ditt CV, förbereda CV och brev, hantera dokument och hämta svar från öppna webbkällor när internet finns.';
  if(/vad kan du|vad kan du hjälpa/.test(s))return 'Jag kan hjälpa dig med jobb, CV, personligt brev, dokument, beräkningar, enheter, tid och datum samt vanliga frågor. När en fråga behöver aktuell information försöker jag hämta ett svar från öppna webbkällor och visar svaret här i chatten. Jag öppnar inte Google automatiskt.';
  const v20Recall=v20RecallIntent(t);if(v20Recall)return v20Recall;
  const v20Saved=v20SaveIntent(t);if(v20Saved)return v20Saved;
  if(v20TravelStatementGuard(t)){const travel=await universalTravelAnswerV12(t);if(travel){v20SaveEvent('travel_plan',{type:'travel_plan',text:t});state.lastWebResult=travel;return travel.text;}}
  if(/hur gammal är jag|hur gammal e jag/.test(s)){const a=age(S.get('birthDate','2003-11-14'));return a==null?'Spara ett giltigt födelsedatum under Min profil.':`Du är ${a} år gammal. Du är född ${S.get('birthDate','2003-11-14')}.`}
  if(/^(?:vad är|vad ar)\s+(?:klockan|tiden)|^(?:klockan|tiden)\??$/.test(s))return 'Klockan är '+new Date().toLocaleTimeString('sv-SE',{hour:'2-digit',minute:'2-digit'})+'.';
  if(/dagens datum|vilket datum|datum idag/.test(s))return 'Idag är det '+new Date().toLocaleDateString('sv-SE')+'.';
  const c=calc(t);if(c)return c;
  const u=convUnit(t);if(u)return u;
  const remembered=window.SaidConversation?.answerMemoryQuestion?.(t); if(remembered)return remembered;
  const profileAnswer=window.SaidConversation?.answerProfileQuestion?.(t); if(profileAnswer)return profileAnswer;
  if(/\b(var|vart)\s+(bor|bor jag)\b|\bvar bor jag\b/.test(s)){
    const home=String(travelContext().home||S.get('profileLocation','')||'').trim();
    return home?`Du har sparad hemort: ${home}. Jag använder den när vi planerar resor, om du inte anger en annan startplats.`:'Jag har ingen sparad hemort ännu. Säg till exempel ”Jag bor i Upplands Väsby”, så sparar jag den lokalt.';
  }
  const spokenHome=extractHomePlace(t);
  if(spokenHome){
    S.set('profileLocation',spokenHome);
    const ctx=travelContext();ctx.home=spokenHome;saveTravelContext(ctx);
    const input=$('#profileLocation');if(input)input.value=spokenHome;
    return `Jag förstår. Jag har sparat din hemort som ${spokenHome} och kommer ihåg den i den här chatten när vi planerar resor.`;
  }
  if(/välj (?:det )?(?:första|1|ett)|första jobbet|jobbet 1/.test(s)){if(!state.lastJobs.length)return 'Jag har inga visade jobb att välja ännu. Säg ”sök jobb enligt mitt CV”.';selectJob(state.lastJobs[0]);return `Jag har valt jobb 1: ${state.lastJobs[0].headline} hos ${state.lastJobs[0].company}. Du kan säga ”förbered ansökan”, ”brev” eller ”anpassa CV”.`}
  const num=s.match(/(?:välj|jobbet|jobb)\s*(?:nummer\s*)?(\d{1,2})\b/);
  if(num){const n=Number(num[1]);if(!state.lastJobs[n-1])return `Jag hittar inget jobb nummer ${n} i den aktuella listan.`;selectJob(state.lastJobs[n-1]);return `Jag har valt jobb ${n}: ${state.lastJobs[n-1].headline} hos ${state.lastJobs[n-1].company}.`}
  if(/öppna (?:det )?(?:första|1)|öppna första/.test(s)){if(!state.lastJobs.length)return 'Jag har inga visade jobb ännu.';selectJob(state.lastJobs[0]);window.open(jobLink(state.lastJobs[0]),'_blank','noopener');return 'Jag öppnade den valda annonsen. Jobblistan och chatten är kvar i assistenten.'}
  if(/visa fler jobb|fler jobb|fortsätt söka|nästa jobb/.test(s)){if(!state.lastJobQuery)return 'Jag har ingen tidigare jobbsökning att fortsätta. Säg ”sök jobb enligt mitt CV”.';await searchJobsForUser(state.lastJobQuery,true);return state.lastJobs.length?`Jag har hämtat fler jobb. Nu visas ${state.lastJobs.length} relevanta jobb i jobblistan.`:''}
  if(/förbered ansökan|forbered ansokan/.test(s)){prepareApplication();return state.selectedJob?'Jag har förberett CV-anpassning och personligt brev för det valda jobbet.':'Välj ett jobb först så förbereder jag ansökan.'}
  if(/anpassa.*cv|cv.*anpassa/.test(s)){prepareCV();return state.selectedJob?'Jag har förberett CV-anpassningen för det valda jobbet.':'Välj ett jobb först.'}
  if(/personligt brev|skriv.*brev|brev.*jobb/.test(s)){prepareLetter();return state.selectedJob?'Jag har skrivit ett första personligt brev för det valda jobbet.':'Välj ett jobb först.'}
  // Job commands stay inside the assistant. Speech-to-text can drop a letter
  // (for example "lagarbete" for "lagerarbete"), so accept close job terms
  // only when the sentence clearly asks to search for work.
  const nearJob=nearestKnownJobTerm(s);
  const explicitJobRequest=/sök|soka|söka|hitta|leta|jag söker|jag soker|jag vill jobba|jobba som|jobb åt mig|jobb at mig/.test(s);
  if((explicitJobRequest&&nearJob)||/sök jobb|sok jobb|hitta jobb|leta jobb|lagerjobb|lagerarbete|transport|trädgård|trädgårdsarbete|städ|restaurang|elektriker|butik|chaufför|jobb åt mig|jag söker|jag vill jobba|jobba som/.test(s)){
    let locText=$('#jobLocationText').value.trim(),loc=$('#jobLocation').value,emp=$('#jobEmployment').value;
    if(nearJob&&nearJob.canonical==='lagerarbete'&&/lagarbete/.test(s))t=t.replace(/lagarbete/ig,'lagerarbete');    const lm=t.match(/\b(?:i|på|pa|inom)\s+([a-zåäöA-ZÅÄÖ0-9][a-zåäöA-ZÅÄÖ0-9 -]{1,60}?)(?=\s*,|\s+heltid\b|\s+deltid\b|\s+tillsvidare\b|\s+tidsbegränsad\b|$)/i);
    if(lm){const spokenLoc=lm[1].trim();if(/hela sverige|sverige/i.test(spokenLoc)){loc='ALL';locText='';}else{loc='ALL';locText=spokenLoc;}}
    if(/heltid/i.test(t))emp='FULL';else if(/deltid/i.test(t))emp='PART';else if(/tillsvidare/i.test(t))emp='PERM';else if(/tidsbegränsad|tidsbegransad|vikariat/i.test(t))emp='TEMP';
    if(locText)$('#jobLocationText').value=locText; $('#jobLocation').value=loc; $('#jobEmployment').value=emp;
    await searchJobsForUser(t,false,{term:t,location:loc,locationText:locText,employment:emp,sort:$('#jobSort').value});
    if(state.lastJobs.length)return `Klart. Jag har sökt ${locText?`i ${locText}`:'efter jobb'}${emp==='FULL'?' på heltid':emp==='PART'?' på deltid':''} och hittade ${state.lastJobs.length} relevanta jobb. Jobblistan visas direkt här nedanför och du kan välja ett utan att lämna chatten.`;
    return 'Jag sökte direkt i assistenten men hittade inga jobb som matchar just den sökningen. Ändra yrke, område eller heltid/deltid och sök igen.';
  }
  // FINAL UNIVERSAL TRAVEL MODE: route ordinary origin/destination questions
  // before the transport knowledge mode. This prevents "Upplands Väsby till
  // Sollentuna" from being mistaken for a generic web question.
  const travelActive=window.SaidConversation?.shouldContinueTravel?.(t);
  const travel=travelActive?await universalTravelAnswerV12(t):null;
  if(travel){state.lastWebResult=travel;return travel.text;}
  const clarification=universalClarificationV12(t);
  if(clarification)return clarification;

  // V13: Transport & körkort is routed before the generic web layer.
  const transport=transportIntent(t);
  if(transport){
    const result=await transportAnswerV12(t,transport);
    if(result){state.lastWebResult=result;return result.text;}
  }

  // Current-news questions use a dedicated news source before generic web search.
  const qprofile=window.SaidUniversalQuery?.classify?.(t)||{};
  if(qprofile.news){const news=await universalNewsAnswerV14(t);if(news){state.lastWebResult=news;return news.text;}}

  // V13 universal mode: every ordinary question is treated as a question,
  // not only sentences beginning with a small list of question words.
  // The exact user wording is retained and irrelevant search results are rejected.
  if(looksLikeHealthQuestion(s))return safeHealthAnswer(s);
  if(!navigator.onLine)return 'Jag är offline. Jag kan fortfarande hjälpa med lokala funktioner som tid, datum, beräkningar, enheter, CV och sparade uppgifter. Aktuell webbinformation kräver internet.';
  const result=await universalWebAnswerV12(t);
  if(result){state.lastWebResult=result;return result.text;}
  // One broader retry uses the complete natural-language question instead of
  // forcing a guessed category. This is deliberately a retry, not a redirect.
  const broad=await jinaSearchAnswer(normaliseQuery(t));
  if(broad){
    state.lastWebResult=broad;
    return broad.text;
  }
  return 'Jag förstår att du ställer en fråga, men jag kunde inte hitta ett tillräckligt säkert svar från de öppna källorna just nu. Jag vill inte gissa eller svara på en annan fråga. Försök gärna skriva plats, person eller ämne lite tydligare så försöker jag igen här i chatten.';
}

function setAnswerStatus(text=''){const el=$('#answerStatus');if(el)el.textContent=text;}
async function send(){
  const t=$('#command').value.trim();
  if(!t||state.running||state.answering)return;
  $('#command').value='';state.lastWebResult=null;state.answering=true;
  try{window.SaidUniversalMemory?.observe?.(t)}catch{} try{window.SaidConversation?.observe?.(t)}catch{}
  add(t,'user');
  const pendingId='answer_pending_'+Date.now();
  const pending=document.createElement('div');pending.id=pendingId;pending.className='bubble assistant pending-answer';pending.textContent=window.SaidLanguage?.get?.()==='en'?'⏳ I understand the question and I am looking for a relevant answer…':'⏳ Jag förstår frågan och letar efter ett relevant svar…';
  $('#conversation').appendChild(pending);$('#conversation').scrollTop=$('#conversation').scrollHeight;setAnswerStatus(window.SaidLanguage?.get?.()==='en'?'🔎 Searching and analyzing…':'🔎 Söker och analyserar…');
  try{
    const timeout=new Promise((_,reject)=>setTimeout(()=>reject(new Error('answer-timeout')),30000));
    let r=await Promise.race([(window.SaidFinalV24?.answer ? window.SaidFinalV24.answer(t,answer) : answer(t)),timeout]);
    r=v21EnglishResponse(r);
    r=window.SaidFinalSmart?.formatWebText?.(r)||r;
    pending.remove();
    if(r){state.lastAssistantText=r;if(state.lastWebResult){add(r,'assistant');state.lastWebResult=null}else add(r,'assistant');if(state.voiceMode)startReading(r)}
    else add(window.SaidLanguage?.get?.()==='en'?'I could not complete the answer right now. Try again and I will continue in the same chat.':'Jag kunde inte slutföra svaret just nu. Försök igen så fortsätter jag i samma chatt.','assistant');
  }catch(e){
    pending.remove();
    add(window.SaidLanguage?.get?.()==='en'?'I got a technical error while trying to find the answer. I did not delete your question or chat history. Try again and we will continue here.':'Jag fick ett tekniskt fel när jag försökte hitta svaret. Jag har inte raderat din fråga eller chatthistorik. Försök igen så fortsätter vi härifrån.','assistant');
    console.error('Said Assistant answer error:',e);
  }finally{state.answering=false;setAnswerStatus('Klar');}
}
$('#send').onclick=send;$('#command').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}});$$('[data-q]').forEach(b=>b.onclick=()=>{$('#command').value=b.dataset.q;send()});
$('#newChat').onclick=()=>{persistCurrentChat();createChat();renderCurrentChat();stopTask();state.voiceMode=false;$('#chatHistoryPanel').hidden=false};
$('#toggleChats').onclick=()=>{const p=$('#chatHistoryPanel');p.hidden=!p.hidden;renderChatHistory()};
$('#refreshJobs').onclick=()=>{$('#clearJobSearch').click();$('#jobSearch').focus();$('#jobSearchStatus').textContent='Redo för en ny jobbsökning. Välj yrke, område och anställning.';document.querySelector('#jobs').scrollIntoView({behavior:'smooth',block:'start'});};

$('#profileName').value=S.get('profileName',''); $('#profileSurname').value=S.get('profileSurname',''); $('#profilePersonalNumber').value=S.get('profilePersonalNumber',''); $('#birthDate').value=S.get('birthDate',''); $('#profileLocation').value=S.get('profileLocation',''); $('#profileAddress').value=S.get('profileAddress',''); $('#profileJob').value=S.get('profileJob','');
$('#jobSearch').value=S.get('lastJobTerm',''); $('#jobLocation').value=S.get('lastJobLocation','ALL'); $('#jobLocationText').value=S.get('lastJobLocationText',''); $('#jobEmployment').value=S.get('lastJobEmployment','ALL'); $('#jobSort').value=S.get('lastJobSort','MATCH');
function updateProfilePreview(){
  const full=[$('#profileName').value.trim(),$('#profileSurname').value.trim()].filter(Boolean).join(' ');
  $('#profileFullNamePreview').textContent=full||'—';
  $('#profilePersonalNumberPreview').textContent=$('#profilePersonalNumber').value.trim()||'—';
  const bd=$('#birthDate').value;
  $('#profileBirthPreview').textContent=bd?new Date(bd+'T00:00:00').toLocaleDateString('sv-SE',{day:'numeric',month:'short',year:'numeric'}):'—';
}
['profileName','profileSurname','profilePersonalNumber','birthDate'].forEach(id=>$('#'+id).addEventListener('input',updateProfilePreview)); updateProfilePreview();
$('#saveProfile').onclick=()=>{S.set('profileName',$('#profileName').value.trim());S.set('profileSurname',$('#profileSurname').value.trim());S.set('profilePersonalNumber',$('#profilePersonalNumber').value.trim());S.set('birthDate',$('#birthDate').value);S.set('profileLocation',$('#profileLocation').value.trim());S.set('profileAddress',$('#profileAddress').value.trim());S.set('profileJob',$('#profileJob').value.trim());updateProfilePreview();$('#profileStatus').textContent='✅ Profilen är sparad lokalt. Fullständigt namn, personnummer, födelsedatum, ort och önskat jobb är redo för CV, brev och ansökningar.';add('Profilen är sparad lokalt. Jag använder uppgifterna när jag förbereder CV, brev och ansökan.','assistant')};
$('#clearProfile').onclick=()=>{['profileName','profileSurname','profilePersonalNumber','birthDate','profileLocation','profileAddress','profileJob'].forEach(k=>S.set(k,''));['profileName','profileSurname','profilePersonalNumber','birthDate','profileLocation','profileAddress','profileJob'].forEach(k=>$('#'+k).value='');updateProfilePreview();$('#profileStatus').textContent='Profilen är rensad lokalt.'};
function runManualJobSearch(useCv=false){const term=useCv?'Sök jobb enligt mitt CV':$('#jobSearch').value.trim();const location=$('#jobLocation').value,locationText=$('#jobLocationText').value.trim(),employment=$('#jobEmployment').value,sort=$('#jobSort').value;S.set('lastJobTerm',useCv?'':$('#jobSearch').value.trim());S.set('lastJobLocation',location);S.set('lastJobLocationText',locationText);S.set('lastJobEmployment',employment);S.set('lastJobSort',sort);searchJobsForUser(term,false,{term,location,locationText,employment,sort})}
$$('.job-preset').forEach(b=>b.onclick=()=>{ $('#jobSearch').value=b.dataset.term||''; runManualJobSearch(false); });
$('#clearJobSearch').onclick=()=>{
  $('#jobSearch').value='';$('#jobLocation').value='ALL';$('#jobLocationText').value='';$('#jobEmployment').value='ALL';$('#jobSort').value='MATCH';
  state.jobOffset=0;state.lastJobQuery='';state.lastJobs=[];state.lastFilters={location:'ALL',locationText:'',employment:'ALL',sort:'MATCH',term:''};
  $('#jobResults').innerHTML='';$('#jobSummary').textContent='Ingen jobbsökning ännu.';$('#jobSearchStatus').textContent='Sökningen är rensad.';$('#taskStatus').textContent='Ingen uppgift just nu.';
  S.set('lastJobTerm','');S.set('lastJobLocation','ALL');S.set('lastJobLocationText','');S.set('lastJobEmployment','ALL');S.set('lastJobSort','MATCH');
};
$('#searchJobs').onclick=()=>runManualJobSearch(false); $('#searchCvJobs').onclick=()=>runManualJobSearch(true); $('#smartSearchCv').onclick=()=>{$('#command').value='Sök jobb enligt mitt CV';send()}; $('#showMoreJobs').onclick=()=>{if(state.lastJobQuery)searchJobsForUser(state.lastJobQuery,true,state.lastFilters);else runManualJobSearch(false)};
$('#jobSearch').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();runManualJobSearch(false)}}); $('#jobLocationText').addEventListener('input',()=>S.set('lastJobLocationText',$('#jobLocationText').value)); $('#jobLocation').onchange=()=>{if($('#jobLocation').value!=='ALL')$('#jobLocationText').value='';S.set('lastJobLocation',$('#jobLocation').value);S.set('lastJobLocationText',$('#jobLocationText').value)}; $('#jobEmployment').onchange=()=>S.set('lastJobEmployment',$('#jobEmployment').value); $('#jobSort').onchange=()=>S.set('lastJobSort',$('#jobSort').value);
$('#jobGoogle').onclick=()=>{
  const q=['jobb', $('#jobSearch').value.trim(), $('#jobLocationText').value.trim() || $('#jobLocation').value, $('#jobEmployment').value==='FULL'?'heltid':$('#jobEmployment').value==='PART'?'deltid':''].filter(Boolean).join(' ');
  window.open('https://www.google.com/search?q='+encodeURIComponent(q),'_blank','noopener');
}; $('#jobIndeed').onclick=()=>window.open('https://se.indeed.com/jobs?q='+encodeURIComponent($('#jobSearch').value||'jobb')+'&l='+encodeURIComponent($('#jobLocationText').value||$('#jobLocation').value),'_blank','noopener'); $('#jobLinkedin').onclick=()=>window.open('https://www.linkedin.com/jobs/search/?keywords='+encodeURIComponent($('#jobSearch').value||'jobb')+'&location='+encodeURIComponent($('#jobLocationText').value||$('#jobLocation').value),'_blank','noopener');

function download(name,blob){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1200)}
function pdf(text){let lines=[];String(text||'').split(/\n/).forEach(x=>{x=x.trim();if(!x){lines.push('');return}while(x.length>88){lines.push(x.slice(0,88));x=x.slice(88)}lines.push(x)});lines=lines.slice(0,45);const content=lines.map((x,i)=>`BT /F1 10 Tf 45 ${800-i*16} Td (${String(x).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)')}) Tj ET`).join('\n');const objs=['','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>','<< /Type /Pages /Count 1 /Kids [3 0 R] >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 1 0 R >> >> /Contents 4 0 R >>',`<< /Length ${content.length} >>\nstream\n${content}\nendstream`,'<< /Type /Catalog /Pages 2 0 R >>'];let out='%PDF-1.4\n',o=[0];for(let i=1;i<objs.length;i++){o[i]=out.length;out+=`${i} 0 obj\n${objs[i]}\nendobj\n`}const st=out.length;out+=`xref\n0 ${objs.length}\n0000000000 65535 f \n`;for(let i=1;i<objs.length;i++)out+=String(o[i]).padStart(10,'0')+' 00000 n \n';out+=`trailer\n<< /Size ${objs.length} /Root 6 0 R >>\nstartxref\n${st}\n%%EOF`;return new Blob([out],{type:'application/pdf'})}
window.SaidMakePdf=pdf;
function analyzeCV(t){const s=String(t||'').trim();if(!s)return 'Skriv eller importera ditt CV först.';const low=s.toLowerCase();const checks=[];if(!/kontakt|telefon|email|e-post|@/.test(low))checks.push('• Lägg till tydliga kontaktuppgifter.');if(!/erfarenhet|arbetsliv|arbete|anställ/.test(low))checks.push('• Lägg till arbetslivserfarenhet.');if(!/utbildning|gymnas|skola/.test(low))checks.push('• Lägg till utbildning.');if(!/kompetens|färdighet|kunskap/.test(low))checks.push('• Lägg till relevanta kompetenser.');if(!/profil|sammanfattning/.test(low))checks.push('• Lägg till en kort profil.');checks.push(`• Längd: cirka ${s.split(/\s+/).filter(Boolean).length} ord.`);checks.push('• Vid jobbsökning används relevanta ord från CV:t för att rangordna träffarna.');return 'CV-analys:\n'+checks.join('\n')}

$('#cvText').value=cvText();$('#letterText').value=S.get('letterText','');
// FINAL V25 CV editor owns CV import/edit/save actions.
$('#cvFile').onchange=null;
$('#saveCv').onclick=()=>{S.set('cvText',$('#cvText').value);add(lang()==='en'?'CV saved locally.':'CV sparat lokalt.');};
$('#analyzeCv').onclick=()=>$('#cvAnalysis').textContent=analyzeCV($('#cvText').value);
$('#cvPdf').onclick=()=>{const b=window.SaidDocumentEditorV26?.makePdf?.($('#cvText').value,'CV')||pdf($('#cvText').value);download('CV.pdf',b)};
$('#downloadCv').onclick=()=>download('CV.txt',new Blob([$('#cvText').value],{type:'text/plain;charset=utf-8'}));
$('#saveLetter').onclick=()=>{S.set('letterText',$('#letterText').value);$('#letterStatus').textContent='Personligt brev sparat lokalt på mobilen.'};
$('#improveLetter').onclick=()=>{let t=$('#letterText').value.trim();if(!t){prepareLetter();return}const job=$('#letterJob').value.trim(),co=$('#letterCompany').value.trim();let prefix=`Ansökan till ${job||'tjänsten'}${co?' hos '+co:''}\n\n`;if(!t.toLowerCase().startsWith('ansökan till'))t=prefix+t;$('#letterText').value=t;$('#letterStatus').textContent='Strukturen har förbättrats lokalt. Kontrollera texten innan du skickar.'};
$('#letterPdf').onclick=()=>download('personligt_brev.pdf',pdf($('#letterText').value));

async function handleChatAttachment(){
  const f=$('#chatFile')?.files?.[0]; if(!f)return;
  const status=$('#chatAttachmentStatus'); if(status)status.textContent='⏳ Läser '+f.name+'…';
  try{
    if(f.type.startsWith('image/')){
      const text=await window.SaidImageToolsV26?.read?.(f,m=>{if(status&&m?.progress)status.textContent=`⏳ Läser bild… ${Math.round(m.progress*100)}%`;});
      $('#command').value=`Jag har bifogat bilden "${f.name}". Läs den här bilden och hjälp mig med allt som går att läsa. Om det finns flera frågor, skriv fråga 1 med svar, fråga 2 med svar osv.

Text som OCR läste:
${text||'(ingen tydlig text)'}`;
    }else{
      const text=await window.SaidUniversalFile?.read?.(f);
      $('#command').value=`Jag har bifogat filen "${f.name}". Läs innehållet och hjälp mig förstå det. Om det finns frågor eller uppgifter, ta dem en i taget och ge tydliga svar.

Innehåll:
${text||'(filtypen kunde inte läsas lokalt)'}`;
    }
    if(status)status.textContent='✅ Bilagan är klar och ligger i chatten. Tryck Skicka.';
  }catch(e){if(status)status.textContent='❌ Kunde inte läsa bilagan. Försök igen.';console.error(e)}
}
$('#attachChat')?.addEventListener('click',()=>$('#chatFile')?.click());
$('#chatFile')?.addEventListener('change',handleChatAttachment);

async function analyzeSelectedImage(){
  const f=$('#imageFile')?.files?.[0];
  if(!f){$('#imageStatus').textContent='Välj en bild först.';return}
  $('#imageStatus').textContent='⏳ Jag läser bilden och letar efter text…';
  try{
    const text=await window.SaidImageToolsV26?.read?.(f,m=>{if(m?.progress)$('#imageStatus').textContent=`⏳ Läser bilden… ${Math.round(m.progress*100)}%`;});
    $('#imageText').value=text||'Ingen tydlig text kunde läsas i bilden.';
    const qs=window.SaidImageTools.questions(text);
    $('#imageStatus').textContent=qs.length?`✅ Bilden lästes. Jag hittade ${qs.length} möjliga frågor. Texten finns nedan. Jag kan nu ta dem en i taget i chatten.`:'✅ Bilden lästes. Texten finns nedan.';
    if(text){S.set('lastImageText',text);S.set('lastImageName',f.name);}
  }catch(e){console.error(e);$('#imageStatus').textContent='❌ Jag kunde inte läsa bilden just nu. Kontrollera internetanslutningen och försök igen.';}
}
$('#analyzeImage')?.addEventListener('click',()=>window.SaidImageToolsV26?.analyze?.());
// FINAL V26 image workspace owns the send/analyze workflow.

// FINAL V26 document editor owns document open/edit/save/PDF actions.

const reader={parts:[],index:0,active:false,paused:false};
function splitSpeech(t){return String(t||'').replace(/https?:\/\/\S+/g,'').split(/(?<=[.!?])\s+/).map(x=>x.trim()).filter(Boolean)}
function pickSwedishVoice(){const voices=speechSynthesis.getVoices();const en=window.SaidLanguage?.get?.()==='en';return en?(voices.find(v=>/^en(-|_)/i.test(v.lang))||voices.find(v=>/english/i.test(v.name))||null):(voices.find(v=>/^sv(-|_)/i.test(v.lang))||voices.find(v=>/swedish|svenska/i.test(v.name))||null)}
function speakNext(){if(!reader.active||reader.paused)return;if(reader.index>=reader.parts.length){reader.active=false;$('#readStatus').textContent=window.SaidLanguage?.get?.()==='en'?'Ready':'Klar';return}const text=reader.parts[reader.index];$('#readStatus').textContent=`🔊 Läser ${reader.index+1}/${reader.parts.length}`;const u=new SpeechSynthesisUtterance(text);u.lang=window.SaidLanguage?.get?.()==='en'?'en-US':'sv-SE';u.rate=1;const voice=pickSwedishVoice();if(voice)u.voice=voice;u.onend=()=>{reader.index++;speakNext()};u.onerror=()=>{reader.active=false;$('#readStatus').textContent='Kunde inte läsa upp svaret'};speechSynthesis.cancel();speechSynthesis.speak(u)}
function startReading(text){if(!('speechSynthesis'in window)){$('#readStatus').textContent='Uppläsning stöds inte i den här webbläsaren';return}const clean=String(text||'').trim();if(!clean){$('#readStatus').textContent='Inget svar att läsa upp';return}reader.parts=splitSpeech(clean);reader.index=0;reader.active=true;reader.paused=false;$('#readStatus').textContent='🔊 Startar uppläsning…';const run=()=>speakNext();if(speechSynthesis.getVoices().length)run();else{speechSynthesis.onvoiceschanged=()=>{speechSynthesis.onvoiceschanged=null;run()};setTimeout(run,150)}}
$('#readLast').onclick=()=>{if(state.lastAssistantText)startReading(state.lastAssistantText);else $('#readStatus').textContent='Inget svar att läsa upp ännu'}
function pauseAll(){
  if(typeof speechSynthesis!=='undefined'&&speechSynthesis.speaking){speechSynthesis.pause();reader.paused=true;$('#readStatus').textContent='⏸ Pausad';return}
  if(rec){try{rec.stop()}catch{};voicePaused=true;$('#mic').textContent='🎤 Prata';$('#readStatus').textContent='⏸ Tal pausat';return}
  if(state.running){stopTask();$('#readStatus').textContent='⏸ Uppgift pausad';return}
  $('#readStatus').textContent='Inget pågående att pausa';
}
function resumeAll(){
  if(typeof speechSynthesis!=='undefined'&&reader.paused){reader.paused=false;speechSynthesis.resume();$('#readStatus').textContent='▶️ Fortsätter';return}
  if(voicePaused){voicePaused=false;startVoice();$('#readStatus').textContent='▶️ Tal fortsätter';return}
  $('#readStatus').textContent='Inget pausat';
}
$('#pauseAll').onclick=pauseAll;
$('#resumeAll').onclick=resumeAll;
$('#readDoc').onclick=()=>startReading($('#documentText').value);

let rec=null,voicePaused=false;
function startVoice(){
  const R=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!R){$('#command').focus();add('Direkt taligenkänning saknas i den här Safari-versionen. Använd gärna iPhone-tangentbordets mikrofon och tryck sedan Skicka.','assistant');return}
  if(rec)return;
  rec=new R();rec.lang=window.SaidSpeechLanguage||((window.SaidLanguage?.get?.()==='en')?'en-US':'sv-SE');rec.interimResults=false;rec.continuous=false;$('#mic').textContent='🎤 Lyssnar…';voicePaused=false;
  rec.onresult=e=>{$('#command').value=e.results[0][0].transcript;try{rec.stop()}catch{}rec=null;if($('#command').value.trim())send();$('#mic').textContent='🎤 Prata'};
  rec.onerror=()=>{rec=null;$('#mic').textContent='🎤 Prata'};rec.onend=()=>{rec=null;if(!voicePaused)$('#mic').textContent='🎤 Prata'};rec.start();
}
function stopVoice(){if(rec){try{rec.stop()}catch{}rec=null}voicePaused=false;$('#mic').textContent='🎤 Prata';$('#readStatus').textContent='Klar'}
$('#mic').onclick=()=>{if(rec){stopVoice();return}state.voiceMode=true;startVoice();};

document.querySelectorAll('[data-open-app]').forEach(b=>b.addEventListener('click',()=>{const k=b.getAttribute('data-open-app');const name=window.SaidDeviceActions?.apps?.[k]?.name||k;window.SaidDeviceActions?.open?.(k);add((window.SaidLanguage?.get?.()==='en'?`Opening ${name} now.`:`Jag öppnar ${name} nu.`),'assistant')}));
initChatHistory();
function net(){const on=navigator.onLine;$('#online').textContent=on?'● Online':'● Offline – lokalt läge';$('#online').style.color=on?'#7ee9ba':'#ffd166'}window.addEventListener('online',net);window.addEventListener('offline',net);net();
if(navigator.storage?.persist)navigator.storage.persist().catch(()=>{});/* GitHub Pages hardening: service worker intentionally disabled in the final mobile build. */
try{const raw=S.get('selectedJob','');if(raw){state.selectedJob=JSON.parse(raw);selectJob(state.selectedJob)}}catch{}


/* ========================================================================
   FINAL V22 SMART UNIVERSAL PATCH
   One conversation, multi-source research, concise answers, explicit memory,
   better follow-up context. Existing CV/job/travel functions remain intact.
   ======================================================================== */
(function(){
  const _answerV21 = answer;
  function lang(){return window.SaidLanguage?.get?.()==='en'?'en':'sv'}
  function say(sv,en){return lang()==='en'?en:sv}
  function clean(x){return window.SaidSafetyPlus?.clean?.(x)||String(x||'').replace(/https?:\/\/\S+/gi,'').replace(/\s+/g,' ').trim()}
  function isGeneralQuestion(q){const s=q.toLowerCase();return /\?|^(vad|hur|var|vem|vilken|vilket|varför|när|kan|får|finns|berätta|förklara|är|ska|var bor|hur mycket|hur gammal)\b/.test(s)||/\b(senaste|aktuellt|just nu|kolla upp|ta reda på|leta efter|jämför)\b/.test(s)}
  function isExplicitSave(q){return /\b(spara|kom ihåg|kom ihag|lägg till i minnet|lägg in i minnet|glöm inte)\b/i.test(q)}
  function isReminder(q){return /\b(påminn mig|minna mig|påminn|paminn mig)\b/i.test(q)}
  function saveText(q){let x=q.replace(/^.*?\b(?:spara|kom ihåg|kom ihag|lägg till i minnet|lägg in i minnet|glöm inte)\b\s*/i,'').trim();return x||q}
  function reminderText(q){return q.replace(/^.*?\b(?:påminn mig|minna mig|påminn|paminn mig)\b\s*/i,'').trim()||q}
  function contextQuery(q){
    const msgs=recentUserMessages(8); const c=window.SaidContextEngine?.analyze?.(q,msgs)||{};
    if(c.vague&&msgs.length>1)return `${q} — sammanhang från tidigare samtal: ${msgs.slice(-3,-1).join(' | ')}`;
    return q;
  }
  async function smartResearch(q){
    if(!navigator.onLine)return null;
    const searchQ=contextQuery(q);
    let rows=[];
    try{rows=await window.SaidUniversalResearch?.search?.(searchQ)||[]}catch{}
    const policy=window.SaidSourceManager?.policy?.(q)||{minSources:2};
    if(policy.officialNeeded){
      const domains=['migrationsverket.se','arbetsformedlingen.se','skatteverket.se','forsakringskassan.se','trafikverket.se','transportstyrelsen.se'];
      const s=q.toLowerCase(); const d=domains.find(x=>s.includes(x.split('.')[0]));
      if(d){try{rows=rows.concat(await window.SaidUniversalResearch.search(searchQ+' site:'+d))}catch{}}
    }
    const ans=window.SaidSmartWeb?.answer?.(q,rows); if(!ans)return null;
    const src=[...new Set((ans.sources||[]).map(x=>x.source).filter(Boolean))];
    return {text:clean(ans.text)+(src.length?`\n\n${say('Källor kontrollerade: ','Sources checked: ')}${src.join(', ')}.`:''),source:src.join(', '),url:null};
  }
  answer = async function(t){
    const q=window.SaidUniversalQuery?.normalize?.(t)||String(t||'').trim(); const s=q.toLowerCase();
    if(isExplicitSave(q)){
      const item=saveText(q);try{window.SaidMemoryPlus?.save?.(item)}catch{};
      const ev=v20GetEvent('taxi_prov')||v20GetEvent('travel_plan'); if(/\b(den|det|det här|den här)\b/i.test(q)&&ev)try{v20SaveEvent(ev.type==='travel_plan'?'travel_plan':'taxi_prov',ev)}catch{};
      return say(`Okej. Jag har sparat: ${item}. Jag kommer ihåg det när du frågar senare.`,`Okay. I saved: ${item}. I will remember it when you ask later.`);
    }
    if(isReminder(q)){
      const r=reminderText(q);try{window.SaidReminderPlus?.add?.(r,'')}catch{};
      return say(`Okej. Jag har lagt in en påminnelse: ${r}.`,`Okay. I added a reminder: ${r}.`);
    }
    const appMatch=s.match(/^(?:öppna|starta|open|launch)\s+(?:min\s+)?(.+)$/i);
    if(appMatch&&window.SaidAppActionsPlus?.open?.(appMatch[1]))return say(`Jag öppnar ${appMatch[1]}.`,`Opening ${appMatch[1]}.`);
    // Keep all existing specialized capabilities first: travel, CV, jobs,
    // transport, documents, etc. Only ordinary questions enter the new web layer.
    const specialized=/resa|reser|flyg|arlanda|turkiet|jobb|cv|personligt brev|körprov|taxi|dokument|bild|pdf|spara|minne|profil|väder|klockan|datum/.test(s);
    if(!specialized&&isGeneralQuestion(q)){
      const web=await smartResearch(q); if(web){state.lastWebResult=web;return web.text;}
    }
    const result=await _answerV21(t); if(result)return clean(result);
    // Final fallback: ordinary questions get one last multi-source attempt
    // instead of exposing a search-engine page or a huge URL.
    if(isGeneralQuestion(q)){const web=await smartResearch(q);if(web){state.lastWebResult=web;return web.text;}}
    return result;
  };
  window.SaidFinalV22={smartResearch,contextQuery};
})();
