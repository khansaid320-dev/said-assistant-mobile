/* Final conversation context engine: topic, references, pending facts. */
(function(){
 const K='saidAssistantContextV22';
 const get=()=>{try{return JSON.parse(localStorage.getItem(K)||'{}')}catch{return{}}};
 const set=v=>{try{localStorage.setItem(K,JSON.stringify(v))}catch{}};
 function analyze(text,history){const q=String(text||'').trim();const h=(history||[]).map(x=>String(x||'')).slice(-8);const low=q.toLowerCase();let topic='general';if(/resa|flyg|arlanda|turkiet|restid|flygplats/.test(low))topic='travel';else if(/jobb|arbete|arbetsförmedlingen|cv|anställ/.test(low))topic='work';else if(/migrationsverket|uppehåll|medborgarskap|pass|skatteverket/.test(low))topic='government';else if(/taxi|körprov|trafik|körkort/.test(low))topic='transport';else if(/spara|kom ihåg|påminn|minna/.test(low))topic='memory';const vague=/^(det|den|där|här|samma|okej|nej|ja|den här|det här)\b/i.test(q)||/\b(den|det|där|här|samma)\b/i.test(low);return {topic,vague,history:h,query:q};}
 function save(c){set({...get(),...c,updatedAt:Date.now()});return get()}
 window.SaidContextEngine={analyze,save,get};
})();