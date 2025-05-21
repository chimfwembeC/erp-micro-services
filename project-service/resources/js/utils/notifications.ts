import { toast } from 'sonner';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationOptions {
  description?: string;
  duration?: number;
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Show a notification using sonner toast
 *
 * @param type The type of notification (success, error, info, warning)
 * @param title The title of the notification
 * @param options Additional options for the notification
 */
export const showNotification = (
  type: NotificationType,
  title: string,
  options?: NotificationOptions
) => {
  const { description, duration, position, action } = options || {};

  const toastOptions = {
    description,
    duration: duration || 5000,
    position: position || 'top-right',
    action: action ? {
      label: action.label,
      onClick: action.onClick,
    } : undefined,
  };

  switch (type) {
    case 'success':
      toast.success(title, toastOptions);
      break;
    case 'error':
      toast.error(title, toastOptions);
      break;
    case 'info':
      toast.info(title, toastOptions);
      break;
    case 'warning':
      toast.warning(title, toastOptions);
      break;
    default:
      toast(title, toastOptions);
  }
};

/**
 * Show a success notification
 *
 * @param title The title of the notification
 * @param options Additional options for the notification
 */
export const showSuccess = (title: string, options?: NotificationOptions) => {
  showNotification('success', title, options);
};

/**
 * Show an error notification
 *
 * @param title The title of the notification
 * @param options Additional options for the notification
 */
export const showError = (title: string, options?: NotificationOptions) => {
  showNotification('error', title, options);
};

/**
 * Show an info notification
 *
 * @param title The title of the notification
 * @param options Additional options for the notification
 */
export const showInfo = (title: string, options?: NotificationOptions) => {
  showNotification('info', title, options);
};

/**
 * Show a warning notification
 *
 * @param title The title of the notification
 * @param options Additional options for the notification
 */
export const showWarning = (title: string, options?: NotificationOptions) => {
  showNotification('warning', title, options);
};

/**
 * Show an authentication error notification (401)
 *
 * @param options Additional options for the notification
 */
export const showAuthenticationError = (options?: NotificationOptions) => {
  showError('Authentication Required', {
    description: 'You need to log in to access this feature',
    ...options,
  });
};

/**
 * Show an authorization error notification (403)
 *
 * @param options Additional options for the notification
 */
export const showAuthorizationError = (options?: NotificationOptions) => {
  showError('Permission Denied', {
    description: 'You don\'t have permission to perform this action',
    ...options,
  });
};

/**
 * Show a session expired notification
 *
 * @param options Additional options for the notification
 */
export const showSessionExpiredError = (options?: NotificationOptions) => {
  showError('Session Expired', {
    description: 'Your session has expired. Please log in again to continue.',
    ...options,
  });
};
