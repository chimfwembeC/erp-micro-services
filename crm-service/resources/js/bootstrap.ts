import axios from 'axios';
import _ from 'lodash';
import '@/i18n';
import { setupPermissionErrorInterceptor } from '@/utils/permissionErrorHandler';

window._ = _;

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

// Configure axios defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.withCredentials = true; // Important for including cookies in the request

// Get CSRF token from meta tag and set it for all requests
const token = document.querySelector('meta[name="csrf-token"]');
if (token) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = token.getAttribute('content');
} else {
  console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

// Add a request interceptor to handle errors globally
axios.interceptors.request.use(
  config => {
    // You can modify the request config here (add headers, etc.)
    return config;
  },
  error => {
    console.error('Axios request error:', error);
    return Promise.reject(error);
  }
);

// Set up the permission error interceptor
setupPermissionErrorInterceptor({
  redirectTo: '/login',  // Redirect to login page for 401 errors
  toastDuration: 5000,   // Show toast notifications for 5 seconds
  customMessages: {
    401: 'Your session has expired. Please log in again to continue.',
    403: 'You don\'t have permission to perform this action. Please contact your administrator if you need access.',
    409: 'A conflict occurred with your authentication. Please try logging in again.'
  }
});

// Make axios available globally
(window as any).axios = axios;

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from 'laravel-echo';

// import Pusher from 'pusher-js';
// window.Pusher = Pusher;

// window.Echo = new Echo({
//   broadcaster: 'pusher',
//   key: import.meta.env.VITE_PUSHER_APP_KEY,
//   wsHost: import.meta.env.VITE_PUSHER_HOST ?? `ws-${import.meta.env.VITE_PUSHER_CLUSTER}.pusher.com`,
//   wsPort: import.meta.env.VITE_PUSHER_PORT ?? 80,
//   wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
//   forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
//   enabledTransports: ['ws', 'wss'],
// });
