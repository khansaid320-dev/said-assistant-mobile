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
