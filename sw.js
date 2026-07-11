/* 서비스 워커 — 게임 파일을 폰에 저장해서 인터넷 없이도 실행되게 해줘요.
   (파일을 바꾼 뒤에는 아래 CACHE 이름의 숫자를 v2, v3... 으로 올리면 새로고침돼요.) */
const CACHE = "cloud-jump-v1";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request).catch(() => caches.match("./index.html")))
  );
});
