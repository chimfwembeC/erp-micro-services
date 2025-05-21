import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import axios from 'axios';
import { handlePermissionError } from '@/utils/permissionErrorHandler';
import useApi from '@/Hooks/useApi';
import useFormSubmit from '@/Hooks/useFormSubmit';
import { showAuthenticationError, showAuthorizationError } from '@/utils/notifications';

const PermissionErrorExample: React.FC = () => {
  const [activeTab, setActiveTab] = useState('manual');

  // Example 1: Manual error handling
  const simulateManualError = async (status: 401 | 403) => {
    try {
      // Simulate an API call that returns an error
      await axios.get(`/api/simulate-error/${status}`);
    } catch (error) {
      // Handle the error using our utility
      handlePermissionError(error, {
        customMessages: {
          401: 'Custom message: Your session has expired. Please log in again.',
          403: 'Custom message: You don\'t have permission to access this resource.',
        },
      });
    }
  };

  // Example 2: Using the useApi hook
  const { data: rolesData, loading: rolesLoading, error: rolesError, fetch: fetchRoles } = useApi('/api/roles', {
    // The hook will automatically handle permission errors
  });

  // Example 3: Using the useFormSubmit hook
  const {
    loading: submitLoading,
    formErrors,
    submit: submitForm,
    getFieldError,
  } = useFormSubmit('/api/roles', 'POST', {
    successMessage: 'Role Created',
    successDescription: 'The role has been created successfully.',
    // The hook will automatically handle permission errors and validation errors
  });

  // Example 4: Direct notification calls
  const showDirectNotifications = () => {
    showAuthenticationError();
    setTimeout(() => {
      showAuthorizationError({
        description: 'You do not have the required permissions to edit roles.',
      });
    }, 2000);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Permission Error Handling Examples</CardTitle>
        <CardDescription>
          Examples of how to handle permission errors in different scenarios
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="manual">Manual</TabsTrigger>
            <TabsTrigger value="hook">useApi Hook</TabsTrigger>
            <TabsTrigger value="form">Form Submit</TabsTrigger>
            <TabsTrigger value="direct">Direct Calls</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="mt-4 space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Manual Error Handling</AlertTitle>
              <AlertDescription>
                This example shows how to manually handle permission errors using the handlePermissionError utility.
              </AlertDescription>
            </Alert>
            <div className="flex gap-4">
              <Button onClick={() => simulateManualError(401)}>
                Simulate 401 Error
              </Button>
              <Button onClick={() => simulateManualError(403)}>
                Simulate 403 Error
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="hook" className="mt-4 space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>useApi Hook</AlertTitle>
              <AlertDescription>
                This example shows how to use the useApi hook which has built-in permission error handling.
              </AlertDescription>
            </Alert>
            <div className="flex gap-4">
              <Button onClick={() => fetchRoles()} disabled={rolesLoading}>
                {rolesLoading ? 'Loading...' : 'Fetch Roles'}
              </Button>
            </div>
            {rolesError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  An error occurred while fetching roles. The error has been handled automatically.
                </AlertDescription>
              </Alert>
            )}
            {rolesData && (
              <Alert variant="default">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Successfully fetched {rolesData.length} roles.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="form" className="mt-4 space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Form Submit Hook</AlertTitle>
              <AlertDescription>
                This example shows how to use the useFormSubmit hook which has built-in permission and validation error handling.
              </AlertDescription>
            </Alert>
            <div className="flex gap-4">
              <Button
                onClick={() => submitForm({ name: '', permissions: [] })}
                disabled={submitLoading}
              >
                {submitLoading ? 'Submitting...' : 'Submit Form (Will Fail)'}
              </Button>
            </div>
            {Object.keys(formErrors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Validation Errors</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5">
                    {Object.keys(formErrors).map((field) => (
                      <li key={field}>
                        {field}: {getFieldError(field)}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="direct" className="mt-4 space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Direct Notification Calls</AlertTitle>
              <AlertDescription>
                This example shows how to directly call the permission error notification functions.
              </AlertDescription>
            </Alert>
            <div className="flex gap-4">
              <Button onClick={showDirectNotifications}>
                Show Permission Error Notifications
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          These examples demonstrate different ways to handle permission errors in your application.
        </p>
      </CardFooter>
    </Card>
  );
};

export default PermissionErrorExample;
