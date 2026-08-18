/* Local reminder engine. Reliable while the PWA is open; OS push while fully closed requires a push backend. */
(function(){
  const KEY='saidAssistantRemindersV1';
  const get=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []}};
  const put=x=>{try{localStorage.setItem(KEY,JSON.stringify(x))}catch{}};
  async function permission(){if(!('Notification' in window))return 'unsupported';if(Notification.permission==='default')return await Notification.requestPermission();return Notification.permission}
  function add(reminder){const list=get();const r={id:'rem_'+Date.now(),text:String(reminder.text||'Påminnelse'),at:Number(reminder.at),done:false};list.push(r);put(list);return r}
  function remove(id){put(get().filter(x=>x.id!==id))}
  async function tick(){const now=Date.now(),list=get();for(const r of list.filter(x=>!x.done&&x.at<=now)){r.done=true;const p=await permission();if(p==='granted')new Notification('Said Assistant – påminnelse',{body:r.text});else if(document.visibilityState==='visible')alert('⏰ '+r.text)}put(list)}
  setInterval(tick,15000);document.addEventListener('visibilitychange',tick);
  window.SaidReminders={add,remove,list:get,permission,tick};
})();
