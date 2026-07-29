// 🍒 Cherry Adventure — service worker (offline shell + fast loads)
const CACHE = "cherry-adventure-v147";
const SHELL = [
  "./",
  "./index.html",
  "./dashboard.html",
  "./items.html",
  "./classes.html",
  "./heroes.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-180.png",
  "./icon-maskable-512.png",
  "https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js",
  "https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js",
  "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js",
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.allSettled(SHELL.map((u) => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // never cache Supabase / API traffic — always go to network
  if (url.hostname.includes("supabase")) return;

  // navigations → network-first (so game updates land), fall back to cached shell offline
  if (req.mode === "navigate") {
    const KNOWN = ["dashboard.html", "items.html", "classes.html", "heroes.html"];
    const hit = KNOWN.find((p) => url.pathname.endsWith("/" + p));
    const dest = hit ? "./" + hit : "./index.html"; // keep each page in its own cache slot
    e.respondWith(
      fetch(req)
        .then((r) => { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(dest, cp)); return r; })
        .catch(() => caches.match(dest).then((r) => r || caches.match("./index.html")))
    );
    return;
  }

  // static assets + CDN libs → cache-first, then network (and cache it)
  e.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((r) => {
      if (r && r.ok && (url.origin === self.location.origin || url.hostname.includes("jsdelivr"))) {
        const cp = r.clone();
        caches.open(CACHE).then((c) => c.put(req, cp));
      }
      return r;
    }).catch(() => cached))
  );
});
