// If not in cache, fetch from network and cache
  return fetch(event.request).then((networkResponse) => {
    if (!networkResponse || networkResponse.status !== 200) {
      return networkResponse;
    }

    const responseToCache = networkResponse.clone();
    caches.open(CACHE_NAME).then((cache) => {
      cache.put(event.request, responseToCache);
    });

    return networkResponse;
  }).catch(() => {
    // Offline fallback for navigation requests
    if (event.request.mode === 'navigate') {
      return caches.match('/index.html');
    }
  });
})
