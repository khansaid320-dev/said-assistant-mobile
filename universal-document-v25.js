/* Said Assistant 3.0 — FINAL V25 universal document editor
   Imports text-based files and PDFs, makes the content editable, supports undo,
   local save, and creates a new downloadable PDF without overwriting the original.
*/
(function(){
'use strict';
const $=s=>document.querySelector(s);
let original='',currentName='dokument';

function lang(){return window.SaidLanguage?.get?.()==='en'}
function say(sv,en){return lang()?en:sv}
function status(s){const e=$('#docStatus');if(e)e.textContent=s}
function download(name,blob){if(!blob)return;const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},800)}

function cp1252Byte(c){
 const n=c.charCodeAt(0);
 const special={'€':0x80,'‚':0x82,'ƒ':0x83,'„':0x84,'…':0x85,'†':0x86,'‡':0x87,'ˆ':0x88,'‰':0x89,'Š':0x8A,'‹':0x8B,'Œ':0x8C,'Ž':0x8E,'‘':0x91,'’':0x92,'“':0x93,'”':0x94,'•':0x95,'–':0x96,'—':0x97,'˜':0x98,'™':0x99,'š':0x9A,'›':0x9B,'œ':0x9C,'ž':0x9E,'Ÿ':0x9F};
 return n<=255?n:(special[c]??0x3F);
}
function pdfEscape(s){return String(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');}
function bytesFor(s){const out=[];for(const c of s)out.push(cp1252Byte(c));return out}
function makePdf(text,title='Dokument'){
 const raw=String(text||'').replace(/\r/g,'');
 const chunks=[];
 raw.split('\n').forEach(line=>{
   let x=line;
   if(!x){chunks.push('');return}
   while(x.length>92){chunks.push(x.slice(0,92));x=x.slice(92)}
   chunks.push(x);
 });
 if(!chunks.length)chunks.push('');
 const perPage=46,pages=Math.max(1,Math.ceil(chunks.length/perPage));
 const objs=[''];
 objs.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
 const pageIds=[];
 for(let p=0;p<pages;p++){const pageId=3+p*2,contentId=4+p*2;pageIds.push(pageId);objs[pageId]='';objs[contentId]='';}
 // pages object is 2
 objs[2]=`<< /Type /Pages /Count ${pages} /Kids [${pageIds.map(x=>x+' 0 R').join(' ')}] >>`;
 for(let p=0;p<pages;p++){
   const contentId=4+p*2, pageId=3+p*2;
   const lines=chunks.slice(p*perPage,(p+1)*perPage);
   let y=800;
   const ops=[];
   lines.forEach(line=>{ops.push(`BT /F1 10 Tf 45 ${y} Td (${pdfEscape(line)}) Tj ET`);y-=16});
   const content=ops.join('\n');
   objs[pageId]=`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 1 0 R >> >> /Contents ${contentId} 0 R >>`;
   objs[contentId]=`<< /Length ${bytesFor(content).length} >>\nstream\n${content}\nendstream`;
 }
 const catalogId=objs.length;objs.push('<< /Type /Catalog /Pages 2 0 R >>');
 let all=[]; const offsets=[0]; 
 function addAscii(s){all.push(...bytesFor(s))}
 addAscii('%PDF-1.4\n');
 for(let i=1;i<objs.length;i++){offsets[i]=all.length;addAscii(`${i} 0 obj\n${objs[i]}\nendobj\n`)}
 const xref=all.length;addAscii(`xref\n0 ${objs.length}\n0000000000 65535 f \n`);
 for(let i=1;i<objs.length;i++)addAscii(String(offsets[i]).padStart(10,'0')+' 00000 n \n');
 addAscii(`trailer\n<< /Size ${objs.length} /Root ${catalogId} 0 R >>\nstartxref\n${xref}\n%%EOF`);
 return new Blob([new Uint8Array(all)],{type:'application/pdf'});
}

async function localPdfText(file){
 // First use the existing PDF.js loader when available/online.
 try{
   const x=await window.SaidUniversalFile?.read?.(file);
   if(x&&x.trim())return x;
 }catch{}
 // Local fallback for simple text PDFs (including PDFs created by this app).
 try{
   const buf=new Uint8Array(await file.arrayBuffer());
   const latin=Array.from(buf,b=>String.fromCharCode(b)).join('');
   const streams=[]; let pos=0;
   while((pos=latin.indexOf('stream',pos))>=0){
     let start=pos+6;if(latin[start]==='\r')start++;if(latin[start]==='\n')start++;
     const end=latin.indexOf('endstream',start);if(end<0)break;
     const header=latin.slice(Math.max(0,pos-600),pos);
     streams.push({header,data:buf.slice(start,end)});
     pos=end+9;
   }
   let result='';
   for(const s of streams){
     let data=s.data;
     if(/FlateDecode/i.test(s.header)&&'DecompressionStream' in window){
       try{const ds=new DecompressionStream('deflate');const ab=await new Response(new Blob([data]).stream().pipeThrough(ds)).arrayBuffer();data=new Uint8Array(ab)}catch{}
     }
     const txt=Array.from(data,b=>String.fromCharCode(b)).join('');
     // Parenthesized PDF strings and hex strings.
     const vals=[];
     let m; const re=/\(((?:\\.|[^\\)])*)\)\s*Tj/g;
     while((m=re.exec(txt)))vals.push(m[1].replace(/\\([\\()])/g,'$1').replace(/\\n/g,'\n'));
     const tj=/\[((?:.|\n)*?)\]\s*TJ/g;
     while((m=tj.exec(txt))){const inner=m[1],rr=/\(((?:\\.|[^\\)])*)\)/g;let q=[];let z;while((z=rr.exec(inner)))q.push(z[1].replace(/\\([\\()])/g,'$1'));if(q.length)vals.push(q.join(''))}
     if(vals.length)result+=vals.join(' ')+'\n';
   }
   return result.trim();
 }catch{return ''}
}

function addControls(){
 const box=document.querySelector('#documents .buttons'); if(!box)return;
 const defs=[
  ['saveEditedPdf','primary','💾 Spara redigerad PDF','💾 Save edited PDF'],
  ['newDocument','secondary','🆕 Nytt dokument','🆕 New document'],
  ['undoDocument','secondary','↩️ Ångra ändring','↩️ Undo change']
 ];
 defs.forEach(([id,cls,sv,en])=>{
   let b=document.getElementById(id);if(!b){b=document.createElement('button');b.id=id;b.className=cls;box.appendChild(b)}
   b.textContent=say(sv,en);
 });
}
async function openDocument(){
 const f=$('#documentFile')?.files?.[0];if(!f){status(say('Välj en fil först.','Choose a file first.'));return}
 currentName=(f.name||'dokument').replace(/\.[^.]+$/,'');
 try{
   const ext=(f.name.split('.').pop()||'').toLowerCase();
   let text='';
   if(ext==='pdf')text=await localPdfText(f);
   else if(['txt','md','csv','json','html','htm','xml','rtf'].includes(ext))text=await f.text();
   else if(/^image\//.test(f.type)){text=say(`Bildfil: ${f.name}. Bildinnehåll kan inte omvandlas till redigerbar text utan OCR.`,`Image file: ${f.name}. Image content cannot be converted to editable text without OCR.`)}
   if(text){
     original=text;$('#documentText').value=text;
     status(say(`Öppnad och redigerbar: ${f.name}. Du kan ändra allt i textfältet.`,`Opened and editable: ${f.name}. You can change everything in the editor.`));
   }else status(say('Filen kunde öppnas men ingen redigerbar text kunde läsas. För PDF kan du prova igen med internetanslutning.','The file could be opened, but no editable text could be extracted. For PDF, try again with an internet connection.'));
 }catch(e){console.error(e);status(say('Kunde inte läsa dokumentet.','Could not read the document.'))}
}
function saveEditedPdf(){
 const text=$('#documentText')?.value||'';if(!text.trim()){status(say('Det finns ingen text att spara.','There is no text to save.'));return}
 const name=(currentName||'dokument')+'_redigerat.pdf';download(name,makePdf(text,currentName));
 status(say(`Redigerad PDF skapad: ${name}`,`Edited PDF created: ${name}`));
}
function saveText(){const text=$('#documentText')?.value||'';download((currentName||'dokument')+'_redigerat.txt',new Blob([text],{type:'text/plain;charset=utf-8'}));status(say('Texten sparades.','Text saved.'))}
function wire(){
 addControls();
 $('#openFile')?.addEventListener('click',openDocument);
 $('#saveEditedPdf')?.addEventListener('click',saveEditedPdf);
 $('#saveText')?.addEventListener('click',saveText);
 $('#newDocument')?.addEventListener('click',()=>{$('#documentText').value='';original='';currentName='dokument';if($('#documentFile'))$('#documentFile').value='';status(say('Nytt dokument klart.','New document ready.'))});
 $('#undoDocument')?.addEventListener('click',()=>{$('#documentText').value=original;status(say('Ändringarna har ångrats.','Changes have been undone.'))});
 $('#readDoc')?.addEventListener('click',()=>window.startReading?.($('#documentText').value));
 window.addEventListener('said-language-changed',addControls);
}
window.SaidDocumentEditorV25={openDocument,saveEditedPdf,makePdf,readPdfText:localPdfText};
window.addEventListener('DOMContentLoaded',wire);
})();