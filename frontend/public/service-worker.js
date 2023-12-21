// service-worker.js
self.addEventListener('push', function (event) {
  const options = {
    body: event.data.text(),
    icon: '/public/vite.svg', // Ganti dengan path ikon Anda
  };
  console.log('event.data', event.data.json().notification.title);
  event.waitUntil(self.registration.showNotification(event.data.json().notification.title, options));
});
