/* Final universal web coordinator: multi-engine, concise, no raw URLs in answers. */
(function(){
  const sources=['Google','Bing','DuckDuckGo','Wikipedia','Yahoo','Brave'];
  const clean=s=>String(s||'').replace(/https?:\/\/\S+/gi,'').replace(/\s+/g,' ').trim();
  const unique=a=>{const seen=new Set();return a.filter(x=>{const k=clean(x.text).toLowerCase();if(!k||seen.has(k))return false;seen.add(k);return true})};
  function rank(q,rows){const words=q.toLowerCase().split(/[^a-zåäöéü0-9]+/).filter(x=>x.length>2);return unique(rows).map(x=>({...x,score:(x.score||0)+words.filter(w=>clean(x.text).toLowerCase().includes(w)).length/Math.max(1,words.length)})).sort((a,b)=>b.score-a.score)}
  function answer(q,rows){const r=rank(q,rows||[]).slice(0,5);if(!r.length)return null;const best=r.slice(0,3).map(x=>clean(x.text)).filter(x=>x.length>35);if(!best.length)return null;let text=best[0];if(best[1]&&best[1]!==best[0])text+=' '+best[1];if(best[2]&&best[2]!==best[0]&&best[2]!==best[1])text+=' '+best[2];text=clean(text);if(text.length>1100)text=text.slice(0,1097).trim()+'…';return {text,source:r.slice(0,3).map(x=>x.source).filter(Boolean).join(', '),sources:r.slice(0,3)};}
  window.SaidSmartWeb={sources,rank,answer,clean};
})();