import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { router } from '@inertiajs/react';

/**
 * Error messages for different HTTP status codes
 */
export const ERROR_MESSAGES = {
  401: 'You need to log in to access this feature',
  403: 'You don\'t have permission to perform this action',
  404: 'The requested resource was not found',
  500: 'An internal server error occurred',
  default: 'An unexpected error occurred'
};

/**
 * SSO-specific error messages
 */
export const SSO_ERROR_MESSAGES = {
  401: 'Your session has expired. Please log in again to continue.',
  403: 'You don\'t have permission to access this service. Please contact your administrator.',
  token_invalid: 'Your authentication token is invalid. Please log in again.',
  token_expired: 'Your authentication token has expired. Please log in again.',
  session_expired: 'Your session has expired. Please log in again to continue.',
  cross_domain_error: 'There was an issue with cross-domain authentication. Please try logging in again.'
};

/**
 * Interface for permission error options
 */
export interface PermissionErrorOptions {
  redirectTo?: string;
  customMessages?: Record<number | string, string>;
  showToast?: boolean;
  toastDuration?: number;
  isSsoError?: boolean;
  ssoLoginUrl?: string;
}

/**
 * Handle permission errors (401, 403) and other API errors
 *
 * @param error - The error object from axios
 * @param options - Options for handling the error
 * @returns The original error for further handling if needed
 */
export const handlePermissionError = (
  error: unknown,
  options: PermissionErrorOptions = {}
): unknown => {
  // Default options
  const {
    redirectTo,
    customMessages = {},
    showToast = true,
    toastDuration = 5000,
    isSsoError = false,
    ssoLoginUrl = '/auth/login'
  } = options;

  // If it's not an axios error, just return it
  if (!axios.isAxiosError(error)) {
    console.error('Non-Axios error:', error);
    if (showToast) {
      toast.error(ERROR_MESSAGES.default, {
        duration: toastDuration,
        description: 'Please try again or contact support if the issue persists.'
      });
    }
    return error;
  }

  const axiosError = error as AxiosError;
  const status = axiosError.response?.status;

  // Log the error for debugging
  console.error(`API Error (${status}):`, axiosError);

  // Check for SSO-specific errors in the response data
  const responseData = axiosError.response?.data;
  const isSsoTokenError = responseData &&
    (responseData.message === 'Unauthenticated.' ||
     responseData.message === 'Token is invalid' ||
     responseData.message === 'Token has expired');

  // Use SSO error messages if it's an SSO error
  const errorMessages = isSsoError ? SSO_ERROR_MESSAGES : ERROR_MESSAGES;

  // Handle based on status code
  if (status) {
    // Get the appropriate error message
    let message;

    if (isSsoTokenError) {
      // Use token-specific error message
      if (responseData.message === 'Token is invalid') {
        message = customMessages['token_invalid'] || SSO_ERROR_MESSAGES.token_invalid;
      } else if (responseData.message === 'Token has expired') {
        message = customMessages['token_expired'] || SSO_ERROR_MESSAGES.token_expired;
      } else {
        message = customMessages['session_expired'] || SSO_ERROR_MESSAGES.session_expired;
      }
    } else {
      // Use status code error message
      message = customMessages[status] || errorMessages[status as keyof typeof errorMessages] || errorMessages.default;
    }

    if (showToast) {
      toast.error(status === 401 ? 'Authentication Required' : 'Permission Error', {
        duration: toastDuration,
        description: message
      });
    }

    // Handle redirects for authentication errors
    if (status === 401) {
      if (isSsoError && ssoLoginUrl) {
        // For SSO errors, redirect to the SSO login URL with the current URL as the redirect parameter
        const currentUrl = window.location.href;
        const redirectParam = encodeURIComponent(currentUrl);
        const loginUrl = `${ssoLoginUrl}?redirect=${redirectParam}`;

        console.log('Redirecting to SSO login:', loginUrl);
        window.location.href = loginUrl;
      } else if (redirectTo) {
        // For regular auth errors, use the specified redirect
        router.visit(redirectTo);
      }
    }
  } else {
    // Network error or other non-HTTP error
    if (showToast) {
      // Check if it might be a cross-domain issue
      const isLikelyCrossDomainError = axiosError.message.includes('Network Error') && isSsoError;

      if (isLikelyCrossDomainError) {
        toast.error('Authentication Error', {
          duration: toastDuration,
          description: customMessages['cross_domain_error'] || SSO_ERROR_MESSAGES.cross_domain_error
        });

        // Redirect to SSO login for cross-domain errors
        if (ssoLoginUrl) {
          const currentUrl = window.location.href;
          const redirectParam = encodeURIComponent(currentUrl);
          const loginUrl = `${ssoLoginUrl}?redirect=${redirectParam}`;

          console.log('Redirecting to SSO login due to cross-domain error:', loginUrl);
          window.location.href = loginUrl;
        }
      } else {
        toast.error('Network Error', {
          duration: toastDuration,
          description: 'Unable to connect to the server. Please check your internet connection.'
        });
      }
    }
  }

  return error;
};

/**
 * Create an axios interceptor to handle permission errors globally
 *
 * @param options - Options for handling the error
 */
export const setupPermissionErrorInterceptor = (options: PermissionErrorOptions = {}) => {
  // Detect if we're in an SSO environment
  const isSsoEnvironment = window.location.hostname.includes('tekrem.local') ||
                          window.location.hostname === 'localhost' ||
                          window.location.hostname === '127.0.0.1';

  // Get the SSO login URL based on the environment
  const ssoLoginUrl = isSsoEnvironment
    ? (window.location.hostname.includes('crm') || window.location.port === '8001'
        ? 'http://auth.tekrem.local/auth/login'
        : '/auth/login')
    : '/login';

  // Add a response interceptor
  axios.interceptors.response.use(
    (response) => response, // Return successful responses as-is
    (error) => {
      // Merge default SSO options with provided options
      const mergedOptions: PermissionErrorOptions = {
        ...options,
        isSsoError: isSsoEnvironment,
        ssoLoginUrl: options.ssoLoginUrl || ssoLoginUrl
      };

      // Log SSO environment detection
      console.log('SSO environment detection:', {
        isSsoEnvironment,
        hostname: window.location.hostname,
        port: window.location.port,
        ssoLoginUrl: mergedOptions.ssoLoginUrl
      });

      // Handle the error
      handlePermissionError(error, mergedOptions);

      // Reject the promise so the error can still be handled locally if needed
      return Promise.reject(error);
    }
  );
};

/**
 * Utility function to check if an error is a permission error (401 or 403)
 *
 * @param error - The error to check
 * @returns True if the error is a permission error
 */
export const isPermissionError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) return false;

  const status = error.response?.status;
  return status === 401 || status === 403;
};

/**
 * Utility function to check if an error is an authentication error (401)
 *
 * @param error - The error to check
 * @returns True if the error is an authentication error
 */
export const isAuthenticationError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) return false;

  return error.response?.status === 401;
};

/**
 * Utility function to check if an error is an authorization error (403)
 *
 * @param error - The error to check
 * @returns True if the error is an authorization error
 */
export const isAuthorizationError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) return false;

  return error.response?.status === 403;
};
