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
