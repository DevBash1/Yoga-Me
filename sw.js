// sw.js

importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.3.1/workbox-sw.js');

// SETTINGS
workbox.setConfig({
    // set the local path is not using Google CDN
    //modulePathPrefix: '/directory/to/workbox/'

    // By default, workbox-sw will use the debug build for sites on localhost,
    // but for any other origin it’ll use the production build. Force by setting to true.
    // debug: true
});
// Force verbose logging even for the production
// workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug)

// Cache settings
workbox.core.setCacheNameDetails({
    // set the default cache name prefix. each domain should be unique to stop clashes
    // this is used for runtime and precaching only
    prefix: 'app-cache'
});

workbox.routing.registerRoute(// match only with assets on the assets domain
new RegExp('^.*\/.*$'), workbox.strategies.cacheFirst({
    cacheName: 'cache',
    plugins: [new workbox.expiration.Plugin({
        // 7 days cache before expiration
        maxAgeSeconds: 24 * 60 * 60 * 7,
        // Opt-in to automatic cleanup whenever a quota errors occurs anywhere in Workbox
        purgeOnQuotaError: true // Opt-in to automatic cleanup.
    })]
}));

// If any precache rules are defined in the Workbox setup this is where they will be injected
workbox.precaching.precacheAndRoute([]);

// skip the 'worker in waiting' phase and activate immediately
workbox.skipWaiting();
// claim any clients that match the worker scope immediately. requests on these pages will
// now go via the service worker. 
workbox.clientsClaim();

self.addEventListener('install', e=>{
    self.skipWaiting()
    // always activate updated SW immediately
}
)