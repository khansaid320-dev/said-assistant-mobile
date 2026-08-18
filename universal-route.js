/* Route intelligence: geocoding + driving + walking estimates. */
(function(){
  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
  async function geocode(place){const q=clean(place);if(!q)return null;for(const query of [q,q+', Sweden']){try{const r=await fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&accept-language=sv&q='+encodeURIComponent(query),{headers:{accept:'application/json'},signal:AbortSignal.timeout?.(8000)});if(!r.ok)continue;const rows=await r.json();if(rows?.length)return {lat:+rows[0].lat,lon:+rows[0].lon,name:rows[0].display_name||q};}catch{}}return null}
  async function driving(a,b){if(!a||!b)return null;try{const r=await fetch(`https://router.project-osrm.org/route/v1/driving/${a.lon},${a.lat};${b.lon},${b.lat}?overview=false`,{signal:AbortSignal.timeout?.(9000)});const j=await r.json();const x=j?.routes?.[0];return x?{seconds:x.duration,distanceKm:x.distance/1000}:null}catch{return null}}
  async function walking(a,b){if(!a||!b)return null;try{const r=await fetch('https://valhalla1.openstreetmap.de/route', {method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({locations:[{lat:a.lat,lon:a.lon},{lat:b.lat,lon:b.lon}],costing:'pedestrian',units:'kilometers'}),signal:AbortSignal.timeout?.(10000)});const j=await r.json();const x=j?.trip?.summary;return x?{seconds:x.time,distanceKm:x.length}:null}catch{return null}}
  function straight(a,b){const R=6371,rad=x=>x*Math.PI/180,dLat=rad(b.lat-a.lat),dLon=rad(b.lon-a.lon),v=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLon/2)**2;return R*2*Math.atan2(Math.sqrt(v),Math.sqrt(1-v))}
  window.SaidUniversalRoute={geocode,driving,walking,straight};
})();
