// ══════════════════════════════════════════════
//  SERVICE WORKER — علي الناهي
//  يعمل في الخلفية حتى لو التطبيق مغلق
// ══════════════════════════════════════════════

const CACHE_NAME = 'ali-alnahi-v1';

// تثبيت الـ Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Installed');
  self.skipWaiting();
});

// تفعيل الـ Service Worker
self.addEventListener('activate', event => {
  console.log('[SW] Activated');
  event.waitUntil(clients.claim());
});

// استقبال إشعار من الصفحة الرئيسية
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'NEW_ORDER') {
    const { customerName, orderNum } = event.data;
    self.registration.showNotification('🧵 طلب جديد — علي الناهي', {
      body: `وصل طلب جديد من ${customerName} — رقم #${orderNum}`,
      icon: './icon-192.png',
      badge: './icon-192.png',
      tag: 'new-order-' + Date.now(),
      renotify: true,
      requireInteraction: false,
      vibrate: [200, 100, 200, 100, 400],
      data: { url: './index.html' },
      actions: [
        { action: 'open', title: '📋 فتح الطلبات' }
      ]
    });
  }
});

// عند الضغط على الإشعار — فتح التطبيق
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // إذا التطبيق مفتوح — ركّز عليه
      for (const client of clientList) {
        if (client.url.includes('index.html') || client.url.endsWith('/')) {
          client.focus();
          return;
        }
      }
      // إذا مغلق — افتحه
      clients.openWindow('./index.html');
    })
  );
});
