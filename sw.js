const CACHE = "novasaki-orders-v8";
const ASSETS = ["./","./index.html","./manifest.webmanifest","./novasaki-logo.jpg","./novasaki-logo.png","./icon-novasaki.jpg"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.pathname.includes("/novasaki-orders/reagent/")) return;
  event.respondWith(
    fetch(event.request, {cache:"no-store"})
      .then(resp => { const copy = resp.clone(); caches.open(CACHE).then(c => c.put(event.request, copy)); return resp; })
      .catch(() => caches.match(event.request).then(cached => cached || caches.match("./index.html")))
  );
});