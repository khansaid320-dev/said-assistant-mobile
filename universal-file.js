/* Universal attachment reader for chat. Supports text formats locally and PDF via PDF.js. */
(function(){
  async function pdfText(file){
    if(!window.SaidPdfJs){try{window.SaidPdfJs=await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs');}catch{return ''}}
    const pdfjs=window.SaidPdfJs;
    if(!pdfjs?.getDocument)return '';
    try{const buf=await file.arrayBuffer();const doc=await pdfjs.getDocument({data:buf}).promise;let out='';for(let i=1;i<=doc.numPages;i++){const p=await doc.getPage(i),c=await p.getTextContent();out+=c.items.map(x=>x.str).join(' ')+'\n';if(out.length>30000)break}return out.trim()}catch{return ''}
  }
  async function read(file){if(!file)return '';const ext=(file.name.split('.').pop()||'').toLowerCase();if(['txt','md','csv','json','html','htm','xml','rtf'].includes(ext))return await file.text();if(ext==='pdf')return await pdfText(file);return ''}
  window.SaidUniversalFile={read,isText:f=>!!f&&/\.(txt|md|csv|json|html?|xml|rtf|pdf)$/i.test(f.name)};
})();
