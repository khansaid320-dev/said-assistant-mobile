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
