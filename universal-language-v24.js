/* Said Assistant 3.0 — FINAL V24 language system
   One selector controls the complete mobile UI, speech recognition, speech
   synthesis and assistant language. Swedish/English is persisted locally.
*/
(function(){
  'use strict';
  const KEY='saidAssistantLanguageV24';
  const S={get(k,d=''){try{return localStorage.getItem(k)??d}catch{return d}},
           set(k,v){try{localStorage.setItem(k,v)}catch{}}};
  const dict={
    sv:{
      'Din smarta mobilassistent':'Din smarta mobilassistent',
      'Fristående · fungerar utan dator · samtal · CV · jobb · brev · dokument':'Fristående · fungerar utan dator · samtal · CV · jobb · brev · dokument',
      'Fristående':'Fristående','Språk':'Språk','Svenska':'Svenska','English':'English',
      'Assistent':'Assistent','Jobb':'Jobb','Brev':'Brev','Dokument':'Dokument','Bild':'Bild','Profil':'Profil',
      'Ny chatt':'Ny chatt','Mina chattar':'Mina chattar','Sparas automatiskt':'Sparas automatiskt',
      'Skicka':'Skicka','Prata':'Prata','Bild/fil':'Bild/fil','Läs svar':'Läs svar','Pausa':'Pausa','Fortsätt':'Fortsätt','Klar':'Klar',
      'Snabbkommandon':'Snabbkommandon','Fler jobb':'Fler jobb','Förbered ansökan':'Förbered ansökan','Anpassa CV':'Anpassa CV','Skriv brev':'Skriv brev','Klockan':'Klockan',
      'Appar':'Appar','Pågående uppgift':'Pågående uppgift','Ingen uppgift just nu.':'Ingen uppgift just nu.',
      'Sök jobb':'Sök jobb','Smart jobbsökning':'Smart jobbsökning','Sök jobb åt mig':'Sök jobb åt mig','Sök själv':'Sök själv',
      'Vilket jobb vill du söka?':'Vilket jobb vill du söka?','Område':'Område','Snabbval område':'Snabbval område','Anställning':'Anställning','Sortera':'Sortera',
      'Bäst matchning':'Bäst matchning','Nyast':'Nyast','Senaste ansökningsdag':'Senaste ansökningsdag','Visa fler':'Visa fler','Rensa':'Rensa',
      'Uppdatera':'Uppdatera','Öppna Google Jobs':'Öppna Google Jobs','Inget jobb valt ännu.':'Inget jobb valt ännu.','Inga jobb hämtade ännu.':'Inga jobb hämtade ännu.',
      'Min profil':'Min profil','Fullständigt namn':'Fullständigt namn','Personnummer':'Personnummer','Födelsedatum':'Födelsedatum','Förnamn':'Förnamn','Efternamn':'Efternamn','Ort':'Ort','Adress':'Adress','Önskad jobbtitel':'Önskad jobbtitel',
      'Spara profil':'Spara profil','Profilen sparas bara lokalt på telefonen.':'Profilen sparas bara lokalt på telefonen.',
      'Mitt CV':'Mitt CV','Analysera':'Analysera','Spara CV':'Spara CV','Skapa PDF':'Skapa PDF','Ladda ner CV':'Ladda ner CV',
      'Personligt brev':'Personligt brev','Spara brev':'Spara brev','Förbättra':'Förbättra',
      'Bildfrågor':'Bildfrågor','Läs och analysera bild':'Läs och analysera bild','Lägg texten i chatten':'Lägg texten i chatten','Ingen bild analyserad.':'Ingen bild analyserad.',
      'Öppna':'Öppna','Spara text':'Spara text','Läs upp':'Läs upp','Inget dokument öppnat.':'Inget dokument öppnat.',
      'Öppna dokument':'Öppna dokument','Spara redigerad PDF':'Spara redigerad PDF','Nytt dokument':'Nytt dokument','Ångra ändring':'Ångra ändring',
      'Din smarta mobilassistent':'Din smarta mobilassistent'
    },
    en:{
      'Din smarta mobilassistent':'Your smart mobile assistant',
      'Skriv eller prata direkt med assistenten. Du behöver inte lämna sidan för att söka jobb, välja jobb eller förbereda CV och personligt brev.':'Type or speak directly with the assistant. You do not need to leave the page to search for jobs, choose jobs, or prepare a CV and personal letter.',
      'Lägg in CV:t en gång. Assistenten använder det vid jobbsökning.':'Add your CV once. The assistant uses it when searching for jobs.',
      'Assistenten kan fylla jobbtitel och företag från valt jobb.':'The assistant can fill in the job title and company from the selected job.',
      'Du kan bifoga en bild eller fil direkt i chatten.':'You can attach an image or file directly in the chat.',
      'Skriv eller prata direkt med assistenten.':'Type or speak directly with the assistant.',
      'Hej Said! 👋 Jag är redo. Du kan skriva eller prata med mig. Säg till exempel:':'Hi Said! 👋 I am ready. You can type or speak to me. For example:',
      '”Sök jobb enligt mitt CV i Stockholm.”':'“Search for jobs using my CV in Stockholm.”',
      'Jag har bifogat bilden':'I attached the image',
      'Jag har bifogat filen':'I attached the file',
      'Fristående · fungerar utan dator · samtal · CV · jobb · brev · dokument':'Standalone · works without a computer · chat · CV · jobs · letters · documents',
      'Fristående':'Standalone','Språk':'Language','Svenska':'Swedish','English':'English',
      'Assistent':'Assistant','Jobb':'Jobs','Brev':'Letter','Dokument':'Documents','Bild':'Image','Profil':'Profile',
      'Ny chatt':'New chat','Mina chattar':'My chats','Sparas automatiskt':'Saved automatically',
      'Skicka':'Send','Prata':'Talk','Bild/fil':'Image/file','Läs svar':'Read answer','Pausa':'Pause','Fortsätt':'Resume','Klar':'Ready',
      'Snabbkommandon':'Quick commands','Fler jobb':'More jobs','Förbered ansökan':'Prepare application','Anpassa CV':'Adapt CV','Skriv brev':'Write letter','Klockan':'Time',
      'Appar':'Apps','Pågående uppgift':'Current task','Ingen uppgift just nu.':'No task right now.',
      'Sök jobb':'Search jobs','Smart jobbsökning':'Smart job search','Sök jobb åt mig':'Search jobs for me','Sök själv':'Search myself',
      'Vilket jobb vill du söka?':'What job do you want to search for?','Område':'Location','Snabbval område':'Quick location','Anställning':'Employment','Sortera':'Sort',
      'Bäst matchning':'Best match','Nyast':'Newest','Senaste ansökningsdag':'Latest application deadline','Visa fler':'Show more','Rensa':'Clear',
      'Uppdatera':'Refresh','Öppna Google Jobs':'Open Google Jobs','Inget jobb valt ännu.':'No job selected yet.','Inga jobb hämtade ännu.':'No jobs loaded yet.',
      'Min profil':'My profile','Fullständigt namn':'Full name','Personnummer':'Personal number','Födelsedatum':'Date of birth','Förnamn':'First name','Efternamn':'Last name','Ort':'City','Adress':'Address','Önskad jobbtitel':'Desired job title',
      'Spara profil':'Save profile','Profilen sparas bara lokalt på telefonen.':'Your profile is saved locally on this phone only.',
      'Mitt CV':'My CV','Analysera':'Analyze','Spara CV':'Save CV','Skapa PDF':'Create PDF','Ladda ner CV':'Download CV',
      'Personligt brev':'Personal letter','Spara brev':'Save letter','Förbättra':'Improve',
      'Bildfrågor':'Image questions','Läs och analysera bild':'Read and analyze image','Lägg texten i chatten':'Put text in chat','Ingen bild analyserad.':'No image analyzed.',
      'Hela Sverige':'All Sweden','Stockholm':'Stockholm','Uppsala':'Uppsala','Västra Götaland':'Västra Götaland','Skåne':'Skåne','Östergötland':'Östergötland','Jönköping':'Jönköping','Örebro':'Örebro','Västmanland':'Västmanland','Gävleborg':'Gävleborg','Norrbotten':'Norrbotten','Västerbotten':'Västerbotten','Södermanland':'Södermanland','Halland':'Halland','Kalmar':'Kalmar','Kronoberg':'Kronoberg','Blekinge':'Blekinge','Värmland':'Värmland','Dalarna':'Dalarna','Jämtland':'Jämtland','Gotland':'Gotland','Alla':'All','Heltid':'Full-time','Deltid':'Part-time','Tillsvidare':'Permanent','Tidsbegränsad':'Temporary',
      'Öppna':'Open','Spara text':'Save text','Läs upp':'Read aloud','Inget dokument öppnat.':'No document opened.',
      'Öppna dokument':'Open document','Spara redigerad PDF':'Save edited PDF','Nytt dokument':'New document','Ångra ändring':'Undo change'
    }
  };
  const lang=()=>S.get(KEY,'sv')==='en'?'en':'sv';
  const t=k=>dict[lang()][k]??dict.sv[k]??k;
  const setLang=v=>{
    const l=v==='en'?'en':'sv';S.set(KEY,l);
    document.documentElement.lang=l==='en'?'en':'sv';
    document.documentElement.setAttribute('data-assistant-language',l);
    apply();
    window.dispatchEvent(new CustomEvent('said-language-changed',{detail:{language:l}}));
    return l;
  };
  function textNodes(root){
    const out=[];const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let n;while(n=w.nextNode())out.push(n);return out;
  }
  function replaceStaticText(){
    const skip=new Set(['conversation','command','cvText','letterText','documentText','imageText','chatHistoryList']);
    document.querySelectorAll('body *').forEach(el=>{
      if(skip.has(el.id)||el.closest('#conversation')||el.closest('#chatHistoryPanel'))return;
      if(el.children.length===0){
        const raw=(el.textContent||'').trim();
        if(dict.en[raw]||dict.sv[raw]){
          const tr=t(raw);
          if(el.textContent.trim()!==tr)el.textContent=tr;
        }
      }
    });
    document.querySelectorAll('label').forEach(label=>{
      if(label.id==='languageLabel')return;
      const node=[...label.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim());
      if(!node)return;
      const raw=node.textContent.trim(),tr=t(raw);
      if(dict.en[raw]||dict.sv[raw])node.textContent=node.textContent.replace(raw,tr);
    });
    const attrs=['placeholder','aria-label','title'];
    document.querySelectorAll('input,textarea,button,select,[title]').forEach(el=>{
      attrs.forEach(a=>{
        const raw=el.getAttribute(a);if(raw&&dict.en[raw])el.setAttribute(a,t(raw));
      });
    });
    const sel=document.querySelector('#languageSelect');if(sel)sel.value=lang();
    const conv=document.querySelector('#conversation');
    if(conv && conv.children.length===1){
      const b=conv.firstElementChild;
      const raw=(b?.textContent||'').trim();
      const tr=t(raw);
      if(raw && tr!==raw)b.textContent=tr;
    }
    const label=document.querySelector('#languageLabel');
    if(label){
      const node=[...label.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim());
      if(node)node.textContent=' '+t('Språk');
    }
    document.querySelectorAll('[data-lang-sv]').forEach(e=>e.textContent=t('Svenska'));
    document.querySelectorAll('[data-lang-en]').forEach(e=>e.textContent=t('English'));
  }
  function apply(){
    replaceStaticText();
    // Update speech recognition language and speech output immediately.
    window.SaidSpeechLanguage=lang()==='en'?'en-US':'sv-SE';
    if(window.SaidLanguageBaseApply)try{window.SaidLanguageBaseApply()}catch{}
  }
  const base=window.SaidLanguage||{};
  window.SaidLanguageBaseApply=base.apply;
  window.SaidLanguage={
    get:lang,set:setLang,t,
    apply,
    dict
  };
  window.addEventListener('DOMContentLoaded',()=>{
    const sel=document.querySelector('#languageSelect');
    if(sel){
      sel.value=lang();
      sel.onchange=()=>setLang(sel.value);
    }
    apply();
  });
})();
