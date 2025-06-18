self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("tracker-cache").then((cache) => {
            return cache.addAll([
                "/",
                "/index.html",
                "/styles.css",
                "/tracker.js",
                "/manifest.json",
                "/ic1.jpg",
                "/ic1.jpg"
            ]);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
