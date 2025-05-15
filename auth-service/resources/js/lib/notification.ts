import { toast } from 'sonner';

// Define notification types
type NotificationType = 'success' | 'error' | 'info' | 'warning';

// Define notification options
interface NotificationOptions {
  id?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  cancel?: {
    label: string;
    onClick?: () => void;
  };
  onDismiss?: () => void;
  onAutoClose?: () => void;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
}

// Create a notification function
export const notify = (
  message: string,
  type: NotificationType = 'info',
  options?: NotificationOptions
) => {
  const { 
    id, 
    description, 
    duration = 5000, 
    action, 
    cancel, 
    onDismiss, 
    onAutoClose,
    position = 'top-right'
  } = options || {};

  // Configure toast based on type
  switch (type) {
    case 'success':
      return toast.success(message, {
        id,
        description,
        duration,
        action: action ? {
          label: action.label,
          onClick: action.onClick,
        } : undefined,
        cancel: cancel ? {
          label: cancel.label,
          onClick: cancel.onClick,
        } : undefined,
        onDismiss,
        onAutoClose,
        position,
      });
    case 'error':
      return toast.error(message, {
        id,
        description,
        duration,
        action: action ? {
          label: action.label,
          onClick: action.onClick,
        } : undefined,
        cancel: cancel ? {
          label: cancel.label,
          onClick: cancel.onClick,
        } : undefined,
        onDismiss,
        onAutoClose,
        position,
      });
    case 'warning':
      return toast.warning(message, {
        id,
        description,
        duration,
        action: action ? {
          label: action.label,
          onClick: action.onClick,
        } : undefined,
        cancel: cancel ? {
          label: cancel.label,
          onClick: cancel.onClick,
        } : undefined,
        onDismiss,
        onAutoClose,
        position,
      });
    case 'info':
    default:
      return toast.info(message, {
        id,
        description,
        duration,
        action: action ? {
          label: action.label,
          onClick: action.onClick,
        } : undefined,
        cancel: cancel ? {
          label: cancel.label,
          onClick: cancel.onClick,
        } : undefined,
        onDismiss,
        onAutoClose,
        position,
      });
  }
};

// Promise toast for async operations
export const promiseToast = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  },
  options?: NotificationOptions
) => {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
    ...options,
  });
};

// Dismiss a specific toast by ID
export const dismissToast = (id: string) => {
  toast.dismiss(id);
};

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};
