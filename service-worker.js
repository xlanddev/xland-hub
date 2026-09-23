const CACHE_NAME = "xland-support-v90.20.10";


const urlsToCache = [

    "./",
    "./index.html",
    "./style.css",
    "./script.js",

    "./banner.css",
    "./banner.js",

    "./security.js",

    "./xland-icon.png"

];



// نصب Service Worker

self.addEventListener("install", event => {


    event.waitUntil(


        caches.open(CACHE_NAME)

        .then(cache => {


            console.log("📦 Cache Created");


            return cache.addAll(urlsToCache);


        })


    );


    self.skipWaiting();


});






// فعال شدن و پاک کردن کش قدیمی

self.addEventListener("activate", event => {


    event.waitUntil(


        caches.keys()

        .then(keys => {


            return Promise.all(


                keys.map(key => {


                    if(key !== CACHE_NAME){


                        console.log("🗑 Removing old cache:", key);


                        return caches.delete(key);


                    }


                })


            );


        })


    );


    self.clients.claim();


});






// دریافت فایل‌ها

self.addEventListener("fetch", event => {


    event.respondWith(


        caches.match(event.request)

        .then(response => {


            return response || fetch(event.request);


        })


    );


});