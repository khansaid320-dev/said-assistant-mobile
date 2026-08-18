/* Everyday planner: small, deterministic helpers for dates, reminders and travel preparation. */
(function(){
  function parseTime(s){const m=String(s||'').match(/\b(?:kl(?:ockan)?\s*)?(\d{1,2})(?::(\d{2}))?\b/i);return m?`${String(m[1]).padStart(2,'0')}:${String(m[2]||'00').padStart(2,'0')}`:''}
  function dateWord(s){const q=String(s||'').toLowerCase();if(/i morgon|imorgon/.test(q))return 'i morgon';if(/nästa vecka/.test(q))return 'nästa vecka';if(/idag/.test(q))return 'idag';return ''}
  function travelChecklist(text){const q=String(text||'').toLowerCase();if(!/resa|flyg|flyga/.test(q))return null;return '✈️ Resplan\n• Kontrollera avgångstid och flygplats.\n• Räkna restid från startplatsen till flygplatsen.\n• Lägg till extra marginal för trafik, incheckning och säkerhetskontroll.\n• Ta med biljett/boardingkort och giltig resehandling.\n• Jag kan fortsätta när du anger datum, tid och färdsätt.'}
  window.SaidPlanner={parseTime,dateWord,travelChecklist};
})();
