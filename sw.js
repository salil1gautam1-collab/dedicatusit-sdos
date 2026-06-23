const CACHE="dedicatusit-sdos-v21";
const ASSETS=["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS).catch(()=>{})));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{const req=e.request;const u=new URL(req.url);
  if(u.hostname.includes("googleapis.com")||u.hostname.includes("google.com")){return;}
  if(u.origin!==self.location.origin){return;}
  const isApp = req.mode==="navigate" || req.destination==="document" || u.pathname.endsWith("/") || u.pathname.endsWith("index.html") || u.pathname.endsWith("sw.js") || u.pathname.endsWith("manifest.webmanifest");
  if(isApp){
    e.respondWith(fetch(req).then(resp=>{const cp=resp.clone();caches.open(CACHE).then(c=>c.put(req,cp).catch(()=>{}));return resp;}).catch(()=>caches.match(req).then(r=>r||caches.match("./index.html"))));
    return;
  }
  e.respondWith(caches.match(req).then(r=>r||fetch(req).then(resp=>{const cp=resp.clone();caches.open(CACHE).then(c=>c.put(req,cp).catch(()=>{}));return resp;})));
});
