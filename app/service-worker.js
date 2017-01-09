/**
 * Created by Sumit Patel on 06/01/2017.
 */
var staticCacheName = 'blooddonor-static-v2';

self.addEventListener('install', function (event) {
    console.log("install a fetch !");
    event.waitUntil(
        caches.open(staticCacheName).then(function (cache) {
            return cache.addAll([
                '/',
                /*'./lib/scripts/1.angular.min.js',
                './lib/scripts/1.jquery.min.js',
                './lib/scripts/2.angular-ui-router.js',

                './lib/scripts/3.angular-storage.js',
                './lib/scripts/3.floatingLabel.min.js',
                './lib/scripts/4.bootstrapValidator.min.js',
                './lib/scripts/bootstrap.min.js',
                './lib/scripts/firebase.js',
                './lib/scripts/google-map-api.js',*/
                './lib/scripts/app_lib.js',


                './lib/fonts/FontAwesome.otf',
                './lib/fonts/fontawesome-webfont.eot',
                './lib/fonts/fontawesome-webfont.svg',
                './lib/fonts/fontawesome-webfont.ttf',
                './lib/fonts/fontawesome-webfont.woff',
                './lib/fonts/fontawesome-webfont.woff2',


                /*'./lib/styles/bootstrap.min.css',
                './lib/styles/font-awesome.css',
                './lib/styles/font-awesome.min.css',*/
                './lib/styles/app_lib.css',
                './lib/styles/glyphicons-halflings-regular.ttf',
                './lib/styles/glyphicons-halflings-regular.woff',





               /* './scripts/controllers/bloodgroup.js',
                './scripts/controllers/data.js',
                './scripts/controllers/home.js',
                './scripts/controllers/login.js',
                './scripts/controllers/main.js',
                './scripts/controllers/menu.js',
                './scripts/controllers/newperson.js',
                './scripts/controllers/persons.js',
                './scripts/controllers/register.js',

                './scripts/directives/pwCheck.js',

                './scripts/services/authentication.js',
                './scripts/services/login.js',
                './scripts/services/user.local-storage.js',*/
                './scripts/app.js',

                './views/bloodgroup.html',
                './views/home.html',
                './views/login.html',
                './views/newperson.html',
                './views/persons.html',
                './views/register.html',

                /*'./styles/main.css',
                './styles/style.css',*/
                './styles/app.css'


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
