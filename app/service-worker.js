/**
 * Created by Sumit Patel on 06/01/2017.
 */
var staticCacheName = 'blooddonor-static-v1';

self.addEventListener('install', function (event) {
    console.log("install a fetch !");
    event.waitUntil(
        caches.open(staticCacheName).then(function (cache) {
            return cache.addAll([
                '/',
                './lib/styles/app_lib.css',
                './styles/app.css',

                './lib/scripts/app_lib.js',
                './scripts/app.js',

                './views/bloodgroup.html',
                './views/home.html',
                './views/login.html',
                './views/newperson.html',
                './views/persons.html',
                './views/register.html',

                './lib/fonts/FontAwesome.otf',
                './lib/fonts/fontawesome-webfont.eot',
                './lib/fonts/fontawesome-webfont.svg',
                './lib/fonts/fontawesome-webfont.ttf',
                './lib/fonts/fontawesome-webfont.woff',
                './lib/fonts/fontawesome-webfont.woff2',
                './lib/fonts/glyphicons-halflings-regular.ttf',
                './lib/fonts/glyphicons-halflings-regular.woff',
                './lib/fonts/glyphicons-halflings-regular.woff2',

                './images/launcher-icon-1x.jpg',
                './images/launcher-icon-2x.jpg',
                './images/launcher-icon-3x.jpg'


            ]);
        })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName.startsWith('blooddonor-static-') &&
                        cacheName != staticCacheName;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    var requestUrl = new URL(event.request.url);
    if (requestUrl.origin === location.origin) {
        if (requestUrl.pathname === '/lib' || requestUrl.pathname.startsWith('/lib/') || requestUrl.pathname.startsWith('/scripts/')|| requestUrl.pathname.startsWith('/styles/')|| requestUrl.pathname.startsWith('/views/')) {
            event.respondWith(caches.open(staticCacheName).then(function (cache) {
                return cache.match(requestUrl).then(function (response) {
                    if (response) {
                        return response;
                    }

                    return fetch(event.request).then(function (networkResponse) {
                        if (networkResponse.status < 400) {

                            cache.put(requestUrl, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(function (error) {
                        /*return caches.match('/js/src/index2.html');*/
                    });
                });
            }));

            return;
        }
    }


    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});
