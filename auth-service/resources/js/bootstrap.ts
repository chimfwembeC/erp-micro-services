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
  console.log('CSRF token found in meta tag:', token.getAttribute('content'));
} else {
  console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

// Also get XSRF token from cookie if available
const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
};

const xsrfToken = getCookie('XSRF-TOKEN');
if (xsrfToken) {
  axios.defaults.headers.common['X-XSRF-TOKEN'] = xsrfToken;
  console.log('XSRF-TOKEN found in cookie:', xsrfToken);
} else {
  console.warn('XSRF-TOKEN cookie not found. Attempting to fetch it...');
  // Fetch the CSRF cookie
  axios.get('/sanctum/csrf-cookie').then(() => {
    const refreshedToken = getCookie('XSRF-TOKEN');
    if (refreshedToken) {
      axios.defaults.headers.common['X-XSRF-TOKEN'] = refreshedToken;
      console.log('XSRF-TOKEN refreshed:', refreshedToken);
    } else {
      console.error('Failed to refresh XSRF-TOKEN');
    }
  }).catch(error => {
    console.error('Error fetching CSRF cookie:', error);
  });
}

// Add a request interceptor to handle errors globally and add auth token
axios.interceptors.request.use(
  config => {
    // Add the auth token from localStorage if available
    const token = localStorage.getItem('auth_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

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
    403: 'You don\'t have permission to perform this action. Please contact your administrator if you need access.'
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
