const CACHE_NAME = 'high-low-game-cache-v1';
const urlsToCache = [
  '/', // アプリのルートパス
  '/index.html', // メインHTMLファイル
  '/style.css',  // もしCSSを別ファイルにする場合
  '/script.js',  // もしJSを別ファイルにする場合
  // 必要に応じて他のアセットを追加
  '/icons/icon-192x192.png', // manifest.jsonで指定したアイコン
  '/icons/icon-512x512.png', // manifest.jsonで指定したアイコン
  'https://via.placeholder.com/100x150?text=Card', // カードのプレースホルダー画像
  'https://via.placeholder.com/100x150?text=?' // カードのプレースホルダー画像
  // deckofcardsapi.comからの画像もキャッシュしたい場合は、それらのURLもここに追加
  // 例: 'https://deckofcardsapi.com/static/img/AH.png', など
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
