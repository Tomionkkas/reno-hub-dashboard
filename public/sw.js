// Kill-switch service worker.
//
// A previously-installed worker could pin a stale build in users' browsers
// (serving old JS that generated apex auth links). This worker replaces any
// existing one, clears all caches, unregisters itself, and reloads open tabs
// once so they pick up the current build. index.html no longer registers a
// worker, so this does not re-install — it cleans up and goes away.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (e) { /* ignore */ }
    try { await self.registration.unregister(); } catch (e) { /* ignore */ }
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach((client) => client.navigate(client.url));
  })());
});

// While briefly active, never serve from cache — always hit the network.
self.addEventListener('fetch', (event) => event.respondWith(fetch(event.request)));
