/* Said Assistant 3.0 — Free image text/OCR helper. Uses Tesseract.js only when
   the user asks to read an image. No API key. Visual interpretation beyond text
   is deliberately not claimed; extracted text can be sent to the universal chat. */
(function(){
  let loaded=null;
  async function load(){
    if(window.Tesseract)return window.Tesseract;
    if(loaded)return loaded;
    loaded=new Promise((resolve,reject)=>{
      const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
      s.onload=()=>resolve(window.Tesseract);s.onerror=reject;document.head.appendChild(s);
    });
    return loaded;
  }
  async function read(file,onProgress){
    if(!file)throw new Error('Ingen bild vald.');
    const T=await load();
    const r=await T.recognize(file,'swe+eng',{logger:m=>{if(m?.status&&onProgress)onProgress(m)}});
    return String(r?.data?.text||'').trim();
  }
  function questions(text){
    return String(text||'').split(/\n+/).map(x=>x.trim()).filter(x=>x.length>4&&(/[?？]$/.test(x)||/^(vad|hur|var|när|varför|vilken|vilket|vem|kan|ska|är)\b/i.test(x)));
  }
  window.SaidImageTools={read,questions};
})();
