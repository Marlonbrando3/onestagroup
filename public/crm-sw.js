/* Service worker aplikacji Onesta CRM: tylko powiadomienia push (bez cache'owania stron). */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    data = { title: "Onesta CRM", body: event.data ? event.data.text() : "" };
  }
  const title = data.title || "Onesta CRM";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || "",
      icon: "/crm-app/icon-192.png",
      badge: "/crm-app/icon-192.png",
      tag: data.tag || undefined,
      renotify: Boolean(data.tag),
      data: { url: data.url || "/crm" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/crm";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client && client.url.includes("/crm")) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});
