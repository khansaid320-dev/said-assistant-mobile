/* Said Assistant 3.0 — FINAL V24 document editor
   Local-first: import readable PDF/text, edit, undo, save TXT and create a
   new PDF from the edited text. The original file is never overwritten.
*/
(function(){
  'use strict';
  const $=s=>document.querySelector(s);
  let original='';
  function status(s){const e=$('#docStatus');if(e)e.textContent=s}
  function addButtons(){
    const box=document.querySelector('#documents .buttons');if(!box)return;
    if(!document.querySelector('#saveEditedPdf')){const b=document.createElement('button');b.id='saveEditedPdf';b.className='primary';b.textContent=window.SaidLanguage?.get?.()==='en'?'Save edited PDF':'Spara redigerad PDF';box.appendChild(b)}
    if(!document.querySelector('#newDocument')){const b=document.createElement('button');b.id='newDocument';b.className='secondary';b.textContent=window.SaidLanguage?.get?.()==='en'?'New document':'Nytt dokument';box.appendChild(b)}
    if(!document.querySelector('#undoDocument')){const b=document.createElement('button');b.id='undoDocument';b.className='secondary';b.textContent=window.SaidLanguage?.get?.()==='en'?'Undo change':'Ångra ändring';box.appendChild(b)}
  }
  async function openAndRead(){
    const f=$('#documentFile')?.files?.[0];if(!f)return;
    try{
      const text=await window.SaidUniversalFile?.read?.(f);
      if(text){
        original=text;$('#documentText').value=text;
        status((window.SaidLanguage?.get?.()==='en'?'Opened and extracted: ':'Öppnad och text hämtad: ')+f.name);
        return true;
      }
      if(f.type.startsWith('image/')){original='';$('#documentText').value='';status(window.SaidLanguage?.get?.()==='en'?'Image selected. Use Image Questions for OCR.':'Bild vald. Använd Bildfrågor för OCR.');return false}
      status(window.SaidLanguage?.get?.()==='en'?'This file could not be read locally.':'Den här filen kunde inte läsas lokalt.');
    }catch(e){status(window.SaidLanguage?.get?.()==='en'?'Could not read the document.':'Kunde inte läsa dokumentet.');}
    return false;
  }
  function pdfBlob(text){
    if(typeof window.SaidMakePdf==='function')return window.SaidMakePdf(text);
    // Minimal PDF fallback using the existing app generator.
    try{const ev=document.createEvent('Event');ev.initEvent('said-make-pdf',false,false);window.__saidPdfText=text;window.dispatchEvent(ev)}catch{}
    return null;
  }
  function download(name,blob){if(!blob)return;const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
  function wire(){
    addButtons();
    const open=$('#openFile');if(open)open.addEventListener('click',()=>setTimeout(openAndRead,20));
    $('#saveEditedPdf')?.addEventListener('click',()=>{
      const text=$('#documentText')?.value||'';if(!text.trim()){status(window.SaidLanguage?.get?.()==='en'?'There is no text to save.':'Det finns ingen text att spara.');return}
      const blob=pdfBlob(text);if(blob)download('dokument_redigerat.pdf',blob);
      else status(window.SaidLanguage?.get?.()==='en'?'PDF creation is unavailable in this browser.':'PDF-skapande är inte tillgängligt i den här webbläsaren.');
    });
    $('#newDocument')?.addEventListener('click',()=>{$('#documentText').value='';original='';if($('#documentFile'))$('#documentFile').value='';status(window.SaidLanguage?.get?.()==='en'?'New document ready.':'Nytt dokument klart.')});
    $('#undoDocument')?.addEventListener('click',()=>{$('#documentText').value=original;status(window.SaidLanguage?.get?.()==='en'?'Changes undone.':'Ändringar ångrade.')});
    window.addEventListener('said-language-changed',addButtons);
  }
  window.SaidDocumentEditorV24={openAndRead};
  window.addEventListener('DOMContentLoaded',wire);
})();
