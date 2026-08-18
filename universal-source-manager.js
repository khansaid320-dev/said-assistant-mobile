/* Source policy: use multiple independent sources and prefer authority when relevant. */
(function(){
 const official=['migrationsverket.se','arbetsformedlingen.se','skatteverket.se','forsakringskassan.se','trafikverket.se','transportstyrelsen.se','polisen.se','1177.se','regeringen.se','europa.eu'];
 function policy(q){const s=String(q||'').toLowerCase();const officialNeeded=official.some(d=>s.includes(d.replace('.se','')))||/regler|lag|myndighet|tillstånd|bidrag|ersättning|körprov|pass|migration/.test(s);return {officialNeeded,minSources:officialNeeded?2:2};}
 window.SaidSourceManager={official,policy};
})();