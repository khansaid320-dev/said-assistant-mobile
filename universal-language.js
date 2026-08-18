/* Said Assistant 3.0 — universal language layer (SV/EN). */
(function(){
  const KEY='saidAssistantLanguageV21';
  const S=window.SaidStore||{get:(k,f='')=>{try{return localStorage.getItem(k)??f}catch{return f}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch{}}};
  const dict={
    'sv':{
      assistant:'Assistent',jobs:'Jobb',cv:'CV',letter:'Brev',documents:'Dokument',images:'Bild',profile:'Profil',
      language:'Språk',swedish:'Svenska',english:'English',send:'Skicka',talk:'Prata',read:'Läs svar',pause:'Pausa',resume:'Fortsätt',
      apps:'Appar',open:'Öppna',ready:'Klar',online:'Online',offline:'Offline – lokalt läge',
      hello:'Hej Said! 👋 Jag är redo. Du kan skriva eller prata med mig.'
    },
    'en':{
      assistant:'Assistant',jobs:'Jobs',cv:'CV',letter:'Letter',documents:'Documents',images:'Image',profile:'Profile',
      language:'Language',swedish:'Swedish',english:'English',send:'Send',talk:'Talk',read:'Read answer',pause:'Pause',resume:'Resume',
      apps:'Apps',open:'Open',ready:'Ready',online:'Online',offline:'Offline – local mode',
      hello:'Hi Said! 👋 I am ready. You can type or speak to me.'
    }
  };
  function lang(){return S.get(KEY,'sv')==='en'?'en':'sv'}
  function setLang(v){const l=v==='en'?'en':'sv';S.set(KEY,l);document.documentElement.lang=l==='en'?'en':'sv';apply();return l}
  function t(k){return dict[lang()][k]||dict.sv[k]||k}
  function apply(){
    const l=lang();
    const sel=document.querySelector('#languageSelect'); if(sel)sel.value=l;
    const nav=document.querySelectorAll('.main-nav a');
    const keys=['assistant','jobs','cv','letter','documents','images','profile'];
    nav.forEach((a,i)=>{if(keys[i])a.textContent=(i===0?'💬 ':i===1?'💼 ':i===2?'📄 ':i===3?'✉️ ':i===4?'📁 ':i===5?'🖼️ ':'👤 ')+t(keys[i])});
    const labels={
      '#send':'send','#mic':'talk','#readLast':'read','#pauseAll':'pause','#resumeAll':'resume',
      '#appsTitle':'apps'
    };
    for(const [sel,key] of Object.entries(labels)){const e=document.querySelector(sel);if(e)e.textContent=t(key)}
    // IMPORTANT: never replace #languageLabel.textContent because the <select>
    // lives inside that label. Doing so removes the actual language selector.
    const languageLabel=document.querySelector('#languageLabel');
    if(languageLabel){
      const first=languageLabel.firstChild;
      if(first && first.nodeType===Node.TEXT_NODE) first.nodeValue=t('language');
      else languageLabel.insertBefore(document.createTextNode(t('language')),languageLabel.firstChild||null);
    }
    document.querySelectorAll('[data-lang-sv]').forEach(e=>e.textContent=t('swedish'));
    document.querySelectorAll('[data-lang-en]').forEach(e=>e.textContent=t('english'));
    document.querySelectorAll('[data-lang-title]').forEach(e=>{
      if(e.id!=='languageLabel') e.setAttribute('title',t('language'));
    });
    if(typeof window.updateLanguageSpeech==='function')window.updateLanguageSpeech();
  }
  window.SaidLanguage={get:lang,set:setLang,t,apply};
  window.addEventListener('DOMContentLoaded',()=>{const s=document.querySelector('#languageSelect');if(s)s.addEventListener('change',()=>setLang(s.value));apply()});
})();
