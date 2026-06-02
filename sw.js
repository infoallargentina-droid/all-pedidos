const CACHE_NAME = 'all-pedidos-v1.2'
const ASSETS = [
  '/all-pedidos/',
  '/all-pedidos/index.html'
]

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(ASSETS)
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE_NAME }).map(function(k){ return caches.delete(k) })
      )
    })
  )
  self.clients.claim()
})

self.addEventListener('fetch', function(e){
  // solo cachear GET, no supabase ni google maps
  if(e.request.method !== 'GET') return
  var url = e.request.url
  if(url.includes('supabase.co') || url.includes('googleapis') || url.includes('maps.gstatic')) return

  e.respondWith(
    fetch(e.request).catch(function(){
      return caches.match(e.request).then(function(r){
        return r || caches.match('/all-pedidos/index.html')
      })
    })
  )
})
