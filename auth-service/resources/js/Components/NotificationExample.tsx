import React from 'react';
import { Button } from '@/components/ui/button';
import { notify, promiseToast } from '@/lib/notification';

export default function NotificationExample() {
  // Simple notification examples
  const showSuccessNotification = () => {
    notify('Operation completed successfully!', 'success', {
      description: 'Your changes have been saved.',
    });
  };

  const showErrorNotification = () => {
    notify('An error occurred', 'error', {
      description: 'Please try again later.',
    });
  };

  const showInfoNotification = () => {
    notify('Did you know?', 'info', {
      description: 'You can customize these notifications.',
    });
  };

  const showWarningNotification = () => {
    notify('Warning', 'warning', {
      description: 'This action cannot be undone.',
    });
  };

  // Notification with action
  const showNotificationWithAction = () => {
    notify('New feature available', 'info', {
      description: 'Check out our new dashboard features.',
      action: {
        label: 'View',
        onClick: () => {
          console.log('Action clicked');
        },
      },
    });
  };

  // Promise notification example
  const showPromiseNotification = () => {
    const promise = new Promise((resolve, reject) => {
      // Simulate an async operation
      setTimeout(() => {
        // Randomly resolve or reject to demonstrate both cases
        if (Math.random() > 0.5) {
          resolve('Data loaded successfully');
        } else {
          reject(new Error('Failed to load data'));
        }
      }, 2000);
    });

    promiseToast(promise, {
      loading: 'Loading data...',
      success: 'Data loaded successfully!',
      error: 'Failed to load data',
    });
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Notification Examples</h2>
      <div className="flex flex-wrap gap-2">
        <Button onClick={showSuccessNotification} variant="default">
          Success Notification
        </Button>
        <Button onClick={showErrorNotification} variant="destructive">
          Error Notification
        </Button>
        <Button onClick={showInfoNotification} variant="secondary">
          Info Notification
        </Button>
        <Button onClick={showWarningNotification} variant="outline">
          Warning Notification
        </Button>
        <Button onClick={showNotificationWithAction} variant="default">
          Notification with Action
        </Button>
        <Button onClick={showPromiseNotification} variant="default">
          Promise Notification
        </Button>
      </div>
    </div>
  );
}
