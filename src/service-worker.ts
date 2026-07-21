/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker';

const CACHE = 'cache-' + version;
const ASSETS = build.concat(files);

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(CACHE).then(function (cache) { return cache.addAll(ASSETS); }));
});

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (key) { if (key !== CACHE) { return caches.delete(key); } }));
  }));
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') { return; }
  event.respondWith(caches.match(event.request).then(function (cached) {
    return cached || fetch(event.request);
  }));
});