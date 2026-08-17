/* Said Assistant 3.0 — safe mobile app launch layer. */
(function(){
  const apps={
    whatsapp:{name:'WhatsApp',scheme:'whatsapp://send',web:'https://wa.me/'},
    tiktok:{name:'TikTok',scheme:'tiktok://',web:'https://www.tiktok.com/'},
    youtube:{name:'YouTube',scheme:'youtube://',web:'https://www.youtube.com/'},
    instagram:{name:'Instagram',scheme:'instagram://',web:'https://www.instagram.com/'},
    facebook:{name:'Facebook',scheme:'fb://',web:'https://www.facebook.com/'},
    messenger:{name:'Messenger',scheme:'fb-messenger://',web:'https://m.me/'},
    maps:{name:'Kartor',scheme:'maps://',web:'https://maps.apple.com/'},
    mail:{name:'Mail',scheme:'mailto:',web:'mailto:'}
  };
  function key(q){const s=String(q||'').toLowerCase();for(const [k,v] of Object.entries(apps)){if(s.includes(k)||s.includes(v.name.toLowerCase()))return k}return null}
  function open(name){const k=key(name);if(!k)return false;const a=apps[k];
    try{window.location.href=a.scheme;setTimeout(()=>{if(document.visibilityState==='visible'&&a.web)window.location.href=a.web},900);return a.name}catch{return false}}
  function detect(text){const q=String(text||'').toLowerCase();if(!/\b(öppna|oppna|starta|launch|open)\b/.test(q))return null;return key(q)}
  window.SaidDeviceActions={apps,open,detect};
})();
