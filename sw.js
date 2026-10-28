const CACHE_NAME = 'vocab-trainer-v4';  // war v1
const ASSETS = ['/', '/index.html', '/style.css', '/app.js', '/manifest.json'];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )));
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(res => res || fetch(e.request).then(fr => {
            if (e.request.method === 'GET' && e.request.url.startsWith('http')) {
                const clone = fr.clone();
                caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
            }
            return fr;
        }).catch(() => caches.match('/index.html')))
    );
});