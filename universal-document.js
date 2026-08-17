/* Document helper: local text extraction for common text formats. */
(function(){
  async function text(file){
    if(!file)return '';
    const ext=(file.name.split('.').pop()||'').toLowerCase();
    if(['txt','md','csv','json','html','htm'].includes(ext))return await file.text();
    return '';
  }
  window.SaidDocumentTools={text};
})();
