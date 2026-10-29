const C="fitszamka-v7";
const FONTS=["fonts.googleapis.com","fonts.gstatic.com"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(["./","index.html","recipes.json","manifest.json"])));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
const save=(req,res)=>{const cp=res.clone();caches.open(C).then(c=>c.put(req,cp));return res};
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=="GET")return;
  if(FONTS.includes(u.hostname)){e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request).then(r=>save(e.request,r))));return}
  if(u.origin!==location.origin)return;
  if(u.pathname.endsWith("recipes.json")||u.pathname.endsWith("/")||u.pathname.endsWith("index.html")){
    e.respondWith(fetch(e.request).then(r=>save(e.request,r)).catch(()=>caches.match(e.request)));
  }else{
    e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request).then(r=>save(e.request,r))));
  }
});
