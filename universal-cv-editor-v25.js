/* Said Assistant 3.0 — FINAL V25 CV editor */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const S={get(k,d=''){try{return localStorage.getItem(k)??d}catch{return d}},set(k,v){try{localStorage.setItem(k,v)}catch{}}};
const en=()=>window.SaidLanguage?.get?.()==='en';
const say=(sv,e)=>en()?e:sv;
let original='';

function addControls(){
 const box=document.querySelector('#cv .buttons');if(!box)return;
 const defs=[
  ['openCvEditor','secondary','✏️ Öppna och redigera CV','✏️ Open and edit CV'],
  ['saveCvChanges','primary','💾 Spara CV-ändringar','💾 Save CV changes'],
  ['undoCv','secondary','↩️ Ångra ändring','↩️ Undo change'],
  ['createNewCvPdf','secondary','📄 Skapa ny PDF','📄 Create new PDF']
 ];
 defs.forEach(([id,cls,sv,e])=>{let b=document.getElementById(id);if(!b){b=document.createElement('button');b.id=id;b.className=cls;box.appendChild(b)}b.textContent=say(sv,e)});
}
function download(name,blob){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},800)}
async function importCv(){
 const f=$('#cvFile')?.files?.[0];if(!f){$('#cvAnalysis').textContent=say('Välj ditt CV först.','Choose your CV first.');return}
 try{
   let text='';
   if(f.name.toLowerCase().endsWith('.pdf'))text=await window.SaidDocumentEditorV25?.readPdfText?.(f);
   if(!text && window.SaidUniversalFile?.read)text=await window.SaidUniversalFile.read(f);
   if(!text && !f.name.toLowerCase().endsWith('.pdf'))text=await f.text();
   if(text){$('#cvText').value=text;original=text;S.set('cvText',text);$('#cvAnalysis').textContent=say('CV öppnat och redigerbart. Du kan ändra allt direkt i rutan.','CV opened and editable. You can change everything directly in the editor.')}
   else $('#cvAnalysis').textContent=say('CV-filen kunde inte läsas. Prova en textbaserad PDF eller TXT/DOC-liknande textfil.','The CV file could not be read. Try a text-based PDF or TXT/text file.')
 }catch(e){console.error(e);$('#cvAnalysis').textContent=say('Kunde inte läsa CV-filen.','Could not read the CV file.')}
}
function saveChanges(){const t=$('#cvText').value||'';S.set('cvText',t);original=t;$('#cvAnalysis').textContent=say('Alla CV-ändringar är sparade lokalt.','All CV changes are saved locally.')}
function undo(){if(original!==undefined){$('#cvText').value=original;$('#cvAnalysis').textContent=say('Senaste ändringarna har ångrats.','The latest changes have been undone.')}}
function newPdf(){
 const t=$('#cvText').value||'';if(!t.trim()){ $('#cvAnalysis').textContent=say('CV:t är tomt.','The CV is empty.');return}
 const blob=window.SaidDocumentEditorV25?.makePdf?.(t,'CV')||window.SaidMakePdf?.(t);
 if(blob)download('CV_uppdaterat.pdf',blob);
 $('#cvAnalysis').textContent=say('Ny PDF skapad från dina sparade CV-ändringar.','A new PDF was created from your saved CV changes.');
}
function wire(){
 addControls();
 $('#cvFile')?.addEventListener('change',importCv);
 $('#openCvEditor')?.addEventListener('click',()=>{$('#cvText')?.focus();document.querySelector('#cvText')?.scrollIntoView({behavior:'smooth',block:'center'})});
 $('#saveCvChanges')?.addEventListener('click',saveChanges);
 $('#undoCv')?.addEventListener('click',undo);
 $('#createNewCvPdf')?.addEventListener('click',newPdf);
 window.addEventListener('said-language-changed',addControls);
}
window.SaidCvEditorV25={importCv,saveChanges,newPdf};
window.addEventListener('DOMContentLoaded',wire);
})();