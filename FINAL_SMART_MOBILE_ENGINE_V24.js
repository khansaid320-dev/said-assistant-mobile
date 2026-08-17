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
