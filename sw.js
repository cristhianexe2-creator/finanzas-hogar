const C='fh-share1';

self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./manifest.webmanifest','./icon-192.png']).catch(()=>{})))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C&&k!=='fh-share').map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
 if(e.request.method==='POST'&&u.origin===location.origin&&u.pathname.endsWith('/compartir')){e.respondWith((async()=>{try{const fd=await e.request.formData(),fs=fd.getAll('archivos').filter(f=>f&&f.size),c=await caches.open('fh-share');for(const k of await c.keys())await c.delete(k);let i=0;for(const f of fs){await c.put('./__compartido/'+(i++),new Response(f,{headers:{'Content-Type':f.type||'application/octet-stream','X-Nombre':encodeURIComponent(f.name||('archivo'+i))}}))}const t=[fd.get('title'),fd.get('text')].filter(Boolean).join(' ');if(t)await c.put('./__compartido/texto',new Response(t))}catch(x){}return Response.redirect('./?compartido=1',303)})());return}
 if(e.request.method!=='GET')return;
 if(u.origin===location.origin){e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));return}
 });
self.addEventListener('push',e=>{let d={};try{d=e.data.json()}catch(x){d={title:'Finanzas del Hogar',body:e.data?e.data.text():''}}
 e.waitUntil(self.registration.showNotification(d.title||'Finanzas del Hogar',{body:d.body||'',icon:'icon-192.png',badge:'icon-192.png',tag:d.tag||undefined,data:{url:'./'}}))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{for(const c of l){if('focus' in c)return c.focus()}return clients.openWindow('./')}))});
