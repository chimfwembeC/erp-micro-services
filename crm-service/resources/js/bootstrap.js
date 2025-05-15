/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

// Only set up Echo if the Pusher key is configured
if (import.meta.env.VITE_PUSHER_APP_KEY) {
    try {
        window.Echo = new Echo({
            broadcaster: 'pusher',
            key: import.meta.env.VITE_PUSHER_APP_KEY,
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1',
            forceTLS: (import.meta.env.VITE_PUSHER_SCHEME || 'https') === 'https',
            wsHost: import.meta.env.VITE_PUSHER_HOST || window.location.hostname,
            wsPort: import.meta.env.VITE_PUSHER_PORT || 6001,
            wssPort: import.meta.env.VITE_PUSHER_PORT || 6001,
            disableStats: true,
            enabledTransports: ['ws', 'wss'],
        });
        console.log('WebSocket connection initialized');
    } catch (error) {
        console.warn('WebSocket connection could not be established:', error);
    }
} else {
    console.warn('WebSocket connection not configured (VITE_PUSHER_APP_KEY is missing)');
}
