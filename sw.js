const CACHE = 'sfa-cf67aa3e09';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'].concat(["./leyes/ADN.json", "./leyes/ARM.json", "./leyes/CJM.json", "./leyes/COT.json", "./leyes/CP.json", "./leyes/CPP.json", "./leyes/CPR.json", "./leyes/DL2460.json", "./leyes/EIV.json", "./leyes/L17336.json", "./leyes/L18216.json", "./leyes/L19913.json", "./leyes/L20000.json", "./leyes/L20066.json", "./leyes/L20084.json", "./leyes/L20214.json", "./leyes/L20393.json", "./leyes/L20477.json", "./leyes/L21459.json", "./leyes/L21732.json", "./leyes/L21849.json", "./leyes/LOC.json", "./leyes/TRA.json"]);
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (req.mode === 'navigate' || url.pathname.endsWith('/index.html')) {   // red primero: si hay internet, siempre la última versión
    e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', cp)); return r; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {   // fuentes e íconos: caché primero
    if (r.ok || r.type === 'opaque') { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
    return r;
  }).catch(() => hit)));
});
