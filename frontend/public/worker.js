// let cacheData = "appV1";
// self.addEventListener("install",(event)=>{
//   event.waitUntil(
//     caches.open(cacheData).then((cache)=>{
//       cache.addAll([
//         "/static/js/bundle.js",
//         "/static/js/main.chunks.js",
//         "/static/js/0.chunk.js",
//         "/index.html",
//         "/"

//       ])
//     })
//   )
// })

// self.addEventListener("fetch",(event)=>{
//   event.respondWith(
//     caches.match(event.request).then((result)=>{
//       if(result)
//         return result
//     })
//   )
// })



function receivePushNotification(event) {
    const { title, body, image, icon, badge } = event.data.json();
  
    const options = {
      title: title,
      body: body,
      vibrate: [200, 100, 200],
      icon: icon,
      badge: badge,
      image: image,
    };
    event.waitUntil(self.registration.showNotification(title, options));
  }

  
  self.addEventListener("push", receivePushNotification);

  
