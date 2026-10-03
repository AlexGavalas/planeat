self.addEventListener('push', (event) => {
    if (!event.data) {
        return;
    }

    const data = event.data.json();
    event.waitUntil(
        self.registration.showNotification(data.title, {
            badge: '/icons/icon-192x192.png',
            body: data.body,
            data: { url: data.url || '/meal-plan' },
            icon: data.icon || '/icons/icon-192x192.png',
            tag: data.tag,
        }),
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = new URL(
        event.notification.data?.url || '/meal-plan',
        self.location.origin,
    ).href;

    event.waitUntil(
        self.clients
            .matchAll({ includeUncontrolled: true, type: 'window' })
            .then(async (windows) => {
                const existing = windows[0];

                if (existing) {
                    await existing.focus();
                    return existing.navigate(url);
                }

                return self.clients.openWindow(url);
            }),
    );
});
