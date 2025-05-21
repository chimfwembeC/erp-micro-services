# Sonner Toast Notifications for TekRem Auth Service

This document explains how to use the Sonner toast notification system that has been integrated into the TekRem Auth Service.

## Overview

Sonner is a lightweight, customizable toast notification library for React applications. It provides a simple way to display notifications to users for various events such as:

- Success messages
- Error messages
- Warnings
- Information
- Loading states for async operations

## Basic Usage

The notification system has been abstracted into a simple API in `resources/js/lib/notification.ts`. Here's how to use it:

### Import the Notification Functions

```tsx
import { notify, promiseToast, dismissToast, dismissAllToasts } from '@/lib/notification';
```

### Display a Simple Notification

```tsx
// Success notification
notify('Operation completed successfully!', 'success');

// Error notification
notify('An error occurred', 'error');

// Info notification
notify('Did you know?', 'info');

// Warning notification
notify('Warning', 'warning');
```

### Notification with Description

```tsx
notify('Operation completed successfully!', 'success', {
  description: 'Your changes have been saved.',
});
```

### Notification with Action Button

```tsx
notify('New feature available', 'info', {
  description: 'Check out our new dashboard features.',
  action: {
    label: 'View',
    onClick: () => {
      // Handle action click
      window.location.href = '/new-feature';
    },
  },
});
```

### Notification with Cancel Button

```tsx
notify('Are you sure?', 'warning', {
  description: 'This action cannot be undone.',
  action: {
    label: 'Confirm',
    onClick: () => {
      // Handle confirmation
    },
  },
  cancel: {
    label: 'Cancel',
    onClick: () => {
      // Handle cancellation
    },
  },
});
```

### Custom Duration

```tsx
notify('Quick notification', 'info', {
  duration: 2000, // 2 seconds
});
```

### Promise-Based Notifications

For async operations, you can use the `promiseToast` function to show loading, success, and error states:

```tsx
const fetchData = async () => {
  // Your async operation
  return await api.getData();
};

promiseToast(fetchData(), {
  loading: 'Loading data...',
  success: 'Data loaded successfully!',
  error: 'Failed to load data',
});
```

### Dismissing Notifications

```tsx
// Dismiss a specific notification by ID
const toastId = notify('This will be dismissed', 'info');
dismissToast(toastId);

// Dismiss all notifications
dismissAllToasts();
```

## Advanced Usage

### Custom Positioning

```tsx
notify('Custom position', 'info', {
  position: 'bottom-center',
});
```

Available positions:
- `top-left`
- `top-right` (default)
- `bottom-left`
- `bottom-right`
- `top-center`
- `bottom-center`

### Callbacks

```tsx
notify('With callbacks', 'info', {
  onDismiss: () => {
    console.log('Notification was dismissed');
  },
  onAutoClose: () => {
    console.log('Notification closed automatically after timeout');
  },
});
```

## Integration with Controllers

You can use the notification system with Inertia.js to display notifications after server-side operations:

```php
// In your Laravel controller
public function store(Request $request)
{
    // Process the request
    
    return redirect()->route('users.index')->with('toast', [
        'type' => 'success',
        'message' => 'User created successfully!',
    ]);
}
```

Then in your layout component, you can check for flash messages:

```tsx
// In your layout component
useEffect(() => {
  const toast = page.props.flash.toast;
  if (toast) {
    notify(toast.message, toast.type);
  }
}, [page.props.flash]);
```

## Customizing the Theme

The Sonner toast component has been styled to match the ShadCN UI theme. If you want to customize the appearance further, you can modify the `resources/js/components/ui/sonner.tsx` file.

## Example Component

Check out the `NotificationExample` component in `resources/js/Components/NotificationExample.tsx` for examples of how to use the notification system.

## Further Reading

- [Sonner Documentation](https://sonner.emilkowal.ski/)
- [ShadCN UI](https://ui.shadcn.com/)
