/* Said Assistant 3.0 — FINAL V25 complete language system
   One selector controls the entire static/dynamic UI, placeholders, controls,
   speech recognition and speech synthesis. User-entered content is never translated.
*/
(function(){
'use strict';
const KEY='saidAssistantLanguageV25';
const S={get(k,d=''){try{return localStorage.getItem(k)??d}catch{return d}},set(k,v){try{localStorage.setItem(k,v)}catch{}}};
const en={
  "Din smarta mobilassistent": "Your smart mobile assistant",
  "Skriv eller prata direkt med assistenten. Du behöver inte lämna sidan för att söka jobb, välja jobb eller förbereda CV och personligt brev.": "Type or speak directly with the assistant. You do not need to leave the page to search for jobs, choose jobs, or prepare a CV and personal letter.",
  "Lägg in CV:t en gång. Assistenten använder det vid jobbsökning.": "Add your CV once. The assistant uses it when searching for jobs.",
  "Assistenten kan fylla jobbtitel och företag från valt jobb.": "The assistant can fill in the job title and company from the selected job.",
  "Du kan bifoga en bild eller fil direkt i chatten.": "You can attach an image or file directly in the chat.",
  "Skriv eller prata direkt med assistenten.": "Type or speak directly with the assistant.",
  "Hej Said! 👋 Jag är redo. Du kan skriva eller prata med mig. Säg till exempel:": "Hi Said! 👋 I am ready. You can type or speak to me. For example:",
  "”Sök jobb enligt mitt CV i Stockholm.”": "“Search for jobs using my CV in Stockholm.”",
  "Jag har bifogat bilden": "I attached the image",
  "Jag har bifogat filen": "I attached the file",
  "Fristående · fungerar utan dator · samtal · CV · jobb · brev · dokument": "Standalone · works without a computer · chat · CV · jobs · letters · documents",
  "Fristående": "Standalone",
  "Språk": "Language",
  "Svenska": "Swedish",
  "English": "English",
  "Assistent": "Assistant",
  "Jobb": "Jobs",
  "Brev": "Letter",
  "Dokument": "Documents",
  "Bild": "Image",
  "Profil": "Profile",
  "Ny chatt": "New chat",
  "Mina chattar": "My chats",
  "Sparas automatiskt": "Saved automatically",
  "Skicka": "Send",
  "Prata": "Talk",
  "Bild/fil": "Image/file",
  "Läs svar": "Read answer",
  "Pausa": "Pause",
  "Fortsätt": "Resume",
  "Klar": "Ready",
  "Snabbkommandon": "Quick commands",
  "Fler jobb": "More jobs",
  "Förbered ansökan": "Prepare application",
  "Anpassa CV": "Adapt CV",
  "Skriv brev": "Write letter",
  "Klockan": "Time",
  "Appar": "Apps",
  "Pågående uppgift": "Current task",
  "Ingen uppgift just nu.": "No task right now.",
  "Sök jobb": "Search jobs",
  "Smart jobbsökning": "Smart job search",
  "Sök jobb åt mig": "Search jobs for me",
  "Sök själv": "Search myself",
  "Vilket jobb vill du söka?": "What job do you want to search for?",
  "Område": "Location",
  "Snabbval område": "Quick location",
  "Anställning": "Employment",
  "Sortera": "Sort",
  "Bäst matchning": "Best match",
  "Nyast": "Newest",
  "Senaste ansökningsdag": "Latest application deadline",
  "Visa fler": "Show more",
  "Rensa": "Clear",
  "Uppdatera": "Refresh",
  "Öppna Google Jobs": "Open Google Jobs",
  "Inget jobb valt ännu.": "No job selected yet.",
  "Inga jobb hämtade ännu.": "No jobs loaded yet.",
  "Min profil": "My profile",
  "Fullständigt namn": "Full name",
  "Personnummer": "Personal number",
  "Födelsedatum": "Date of birth",
  "Förnamn": "First name",
  "Efternamn": "Last name",
  "Ort": "City",
  "Adress": "Address",
  "Önskad jobbtitel": "Desired job title",
  "Spara profil": "Save profile",
  "Profilen sparas bara lokalt på telefonen.": "Your profile is saved locally on this phone only.",
  "Mitt CV": "My CV",
  "Analysera": "Analyze",
  "Spara CV": "Save CV",
  "Skapa PDF": "Create PDF",
  "Ladda ner CV": "Download CV",
  "Personligt brev": "Personal letter",
  "Spara brev": "Save letter",
  "Förbättra": "Improve",
  "Bildfrågor": "Image questions",
  "Läs och analysera bild": "Read and analyze image",
  "Lägg texten i chatten": "Put text in chat",
  "Ingen bild analyserad.": "No image analyzed.",
  "Hela Sverige": "All Sweden",
  "Stockholm": "Stockholm",
  "Uppsala": "Uppsala",
  "Västra Götaland": "Västra Götaland",
  "Skåne": "Skåne",
  "Östergötland": "Östergötland",
  "Jönköping": "Jönköping",
  "Örebro": "Örebro",
  "Västmanland": "Västmanland",
  "Gävleborg": "Gävleborg",
  "Norrbotten": "Norrbotten",
  "Västerbotten": "Västerbotten",
  "Södermanland": "Södermanland",
  "Halland": "Halland",
  "Kalmar": "Kalmar",
  "Kronoberg": "Kronoberg",
  "Blekinge": "Blekinge",
  "Värmland": "Värmland",
  "Dalarna": "Dalarna",
  "Jämtland": "Jämtland",
  "Gotland": "Gotland",
  "Alla": "All",
  "Heltid": "Full-time",
  "Deltid": "Part-time",
  "Tillsvidare": "Permanent",
  "Tidsbegränsad": "Temporary",
  "Öppna": "Open",
  "Spara text": "Save text",
  "Läs upp": "Read aloud",
  "Inget dokument öppnat.": "No document opened.",
  "Öppna dokument": "Open document",
  "Spara redigerad PDF": "Save edited PDF",
  "Nytt dokument": "New document",
  "Ångra ändring": "Undo change",
  "● Fristående": "● Standalone",
  "📱 Appar": "📱 Apps",
  "Du behöver inte lämna sidan för att söka jobb, välja jobb eller förbereda CV och personligt brev.": "You do not need to leave the page to search for jobs, choose a job, or prepare a CV or personal letter.",
  "＋ Ny chatt": "＋ New chat",
  "🗂 Mina chattar": "🗂 My chats",
  "🌐 Öppna Öppna Google Jobs": "🌐 Open Google Jobs",
  "Du kan antingen säga": "You can either say",
  "så söker assistenten åt dig, eller fylla i fälten själv och trycka": "the assistant will search for you, or fill in the fields yourself and press",
  ". Google Jobs öppnas bara när du väljer knappen.": ". Google Jobs opens only when you choose the button.",
  "Skriv själv eller använd assistenten ovan.": "Type yourself or use the assistant above.",
  "Här sparar du dina riktiga personuppgifter som assistenten använder när CV, brev och ansökan förbereds.": "Here you save your personal details that the assistant uses when preparing CVs, letters and applications.",
  "14 nov. 2003": "14 Nov. 2003",
  "Profilen är sparad lokalt. Jag använder uppgifterna när jag förbereder CV, brev och ansökan.": "The profile is saved locally. I use the information when preparing CVs, letters and applications.",
  "CV importerat. Tryck ”Spara CV” när du är nöjd.": "CV imported. Press “Save CV” when you are satisfied.",
  "Skicka en bild med text eller frågor. Assistenten läser texten och visar den tydligt i chatten. Du kan sedan be den svara på frågorna.": "Send an image with text or questions. The assistant reads the text and displays it clearly in the chat. You can then ask it to answer the questions.",
  "Said Assistant 3.0 Mobile V13 · Fristående klient · gratis · inga betalda AI-tjänster eller API-nycklar.": "Said Assistant 3.0 Mobile V13 · Standalone client · free · no paid AI services or API keys.",
  "Text som hittades i bilden…": "Text found in the image…",
  "Klistra in ditt CV här…": "Paste your CV here…",
  "Jobbtitel": "Job title",
  "Företag": "Company",
  "Personligt brev…": "Personal letter…",
  "Dokumentets text…": "Document text…",
  "💾 Spara text": "💾 Save text",
  "📄 Skapa PDF": "📄 Create PDF",
  "💾 Spara redigerad PDF": "💾 Save edited PDF",
  "🆕 Nytt dokument": "🆕 New document",
  "↩️ Ångra ändring": "↩️ Undo change",
  "🔊 Läs upp": "🔊 Read aloud",
  "Type or speak directly with the assistant. You do not need to leave the page to search for jobs, choose jobs, or prepare a CV and personal letter.": "Type or speak directly with the assistant. You do not need to leave the page to search for jobs, choose a job, or prepare a CV and personal letter.",
  "Talk": "Talk",
  "Ready": "Ready",
  "No task right now.": "No task right now.",
  "Search jobs": "Search jobs",
  "Search by my CV": "Search using my CV",
  "CV imported. Press “Save CV” when you are satisfied.": "CV imported. Press “Save CV” when you are satisfied.",
  "New document ready.": "New document ready."
};
const sv={}; Object.keys(en).forEach(k=>sv[en[k]]=k);
const lang=()=>S.get(KEY,S.get('saidAssistantLanguageV24','sv'))==='en'?'en':'sv';
const t=k=>lang()==='en'?(en[k]??k):(sv[k]??k);
function translateNode(node){
  if(!node || node.nodeType!==3)return;
  const p=node.parentElement;
  if(!p || p.closest('#conversation') || p.closest('#chatHistoryPanel'))return;
  const raw=node.nodeValue.trim(); if(!raw)return;
  const tr=t(raw); if(tr!==raw) node.nodeValue=node.nodeValue.replace(raw,tr);
}
function apply(){
 document.documentElement.lang=lang();
 document.documentElement.setAttribute('data-assistant-language',lang());
 const root=document.body; if(!root)return;
 // Exact leaf text, including labels and headings.
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 const nodes=[]; let n; while(n=walker.nextNode())nodes.push(n);
 nodes.forEach(translateNode);
 // Attributes.
 document.querySelectorAll('input,textarea,button,select,[title],[aria-label]').forEach(el=>{
   ['placeholder','title','aria-label'].forEach(a=>{const raw=el.getAttribute(a);if(raw){const tr=t(raw);if(tr!==raw)el.setAttribute(a,tr)}});
 });
 const sel=document.querySelector('#languageSelect');
 if(sel){sel.value=lang();sel.setAttribute('aria-label',lang()==='en'?'Language':'Språk')}
 const ll=document.querySelector('#languageLabel');
 if(ll){
   const tn=[...ll.childNodes].find(x=>x.nodeType===3&&x.nodeValue.trim());
   if(tn)tn.nodeValue=' '+t('Språk');
 }
 window.SaidSpeechLanguage=lang()==='en'?'en-US':'sv-SE';
 if(window.SaidLanguageBaseApply)try{window.SaidLanguageBaseApply()}catch{}
}
function setLang(v){
 const l=v==='en'?'en':'sv'; S.set(KEY,l); S.set('saidAssistantLanguageV24',l);
 document.documentElement.lang=l;
 apply();
 window.dispatchEvent(new CustomEvent('said-language-changed',{detail:{language:l}}));
 // Re-apply after dynamic controls/results are rendered.
 setTimeout(apply,50); setTimeout(apply,300);
 return l;
}
window.SaidLanguage={get:lang,set:setLang,t,apply,dict:{sv,en}};
window.SaidLanguageBaseApply=window.SaidLanguageBaseApply||null;
window.addEventListener('DOMContentLoaded',()=>{
 const sel=document.querySelector('#languageSelect');
 if(sel){sel.value=lang();sel.onchange=()=>setLang(sel.value)}
 apply();
 const mo=new MutationObserver(()=>{if(!window.__saidLangBusy){window.__saidLangBusy=true;queueMicrotask(()=>{window.__saidLangBusy=false;apply()})}});
 mo.observe(document.body,{subtree:true,childList:true,characterData:true});
});
})();
