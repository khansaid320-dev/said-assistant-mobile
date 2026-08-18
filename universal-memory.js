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
