import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps } from '@/types';
import PermissionErrorExample from '@/Components/Examples/PermissionErrorExample';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';

const PermissionErrorHandling: React.FC<PageProps> = ({ auth }) => {
  return (
    <AppLayout user={auth.user}>
      <Head title="Permission Error Handling" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permission Error Handling System</CardTitle>
              <CardDescription>
                A comprehensive guide to handling permission errors in the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="usage">Usage</TabsTrigger>
                  <TabsTrigger value="api">API Reference</TabsTrigger>
                  <TabsTrigger value="examples">Examples</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6 space-y-6">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>About the Permission Error Handling System</AlertTitle>
                    <AlertDescription>
                      This system provides a consistent way to handle permission-related errors (401 Unauthorized and 403 Forbidden) across the application.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Key Features</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Global error interceptor for all Axios requests</li>
                      <li>User-friendly toast notifications for permission errors</li>
                      <li>Custom hooks for API requests and form submissions</li>
                      <li>Utility functions for manual error handling</li>
                      <li>Fallback mechanisms for API routes</li>
                    </ul>

                    <h3 className="text-lg font-medium mt-6">Error Types</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>401 Unauthorized</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>Occurs when the user is not authenticated or their session has expired.</p>
                          <p className="mt-2">Default message: <strong>"You need to log in to access this feature"</strong></p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>403 Forbidden</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>Occurs when the user is authenticated but doesn't have permission to access a resource.</p>
                          <p className="mt-2">Default message: <strong>"You don't have permission to perform this action"</strong></p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="usage" className="mt-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Global Error Handling</h3>
                    <p>
                      The system automatically intercepts all Axios requests and handles permission errors globally.
                      This is set up in the <code>bootstrap.ts</code> file.
                    </p>

                    <h3 className="text-lg font-medium mt-6">Using the useApi Hook</h3>
                    <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                      {`// Import the hook
import useApi from '@/Hooks/useApi';

// Use the hook in your component
const { data, loading, error, fetch } = useApi('/api/roles');

// Call fetch when needed
const handleFetchRoles = () => {
  fetch();
};`}
                    </pre>

                    <h3 className="text-lg font-medium mt-6">Using the useFormSubmit Hook</h3>
                    <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                      {`// Import the hook
import useFormSubmit from '@/Hooks/useFormSubmit';

// Use the hook in your component
const {
  loading,
  formErrors,
  submit,
  getFieldError
} = useFormSubmit('/api/roles', 'POST', {
  successMessage: 'Role Created',
  successDescription: 'The role has been created successfully.'
});

// Submit the form when needed
const handleSubmit = (formData) => {
  submit(formData);
};`}
                    </pre>

                    <h3 className="text-lg font-medium mt-6">Manual Error Handling</h3>
                    <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                      {`// Import the utility
import { handlePermissionError } from '@/utils/permissionErrorHandler';

// Use in a try/catch block
try {
  const response = await axios.get('/api/roles');
  // Handle success
} catch (error) {
  handlePermissionError(error, {
    customMessages: {
      401: 'Your session has expired. Please log in again.',
      403: 'You don\'t have permission to access roles.'
    }
  });
}`}
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="api" className="mt-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">API Reference</h3>
                    
                    <h4 className="text-md font-medium mt-4">permissionErrorHandler.ts</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><code>handlePermissionError(error, options)</code> - Handles permission errors and shows toast notifications</li>
                      <li><code>setupPermissionErrorInterceptor(options)</code> - Sets up a global Axios interceptor for permission errors</li>
                      <li><code>isPermissionError(error)</code> - Checks if an error is a permission error (401 or 403)</li>
                      <li><code>isAuthenticationError(error)</code> - Checks if an error is an authentication error (401)</li>
                      <li><code>isAuthorizationError(error)</code> - Checks if an error is an authorization error (403)</li>
                    </ul>
                    
                    <h4 className="text-md font-medium mt-4">formErrorHandler.ts</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><code>handleFormError(error, options)</code> - Handles form submission errors, including permission errors</li>
                      <li><code>isValidationError(error)</code> - Checks if an error is a validation error (422)</li>
                      <li><code>getValidationErrors(error)</code> - Extracts validation errors from an Axios error</li>
                      <li><code>getFieldError(errors, field)</code> - Gets the first validation error message for a specific field</li>
                    </ul>
                    
                    <h4 className="text-md font-medium mt-4">useApi.ts</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><code>useApi(url, options)</code> - Custom hook for making API requests with built-in error handling</li>
                    </ul>
                    
                    <h4 className="text-md font-medium mt-4">useFormSubmit.ts</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><code>useFormSubmit(url, method, options)</code> - Custom hook for form submissions with built-in error handling</li>
                    </ul>
                    
                    <h4 className="text-md font-medium mt-4">notifications.ts</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><code>showAuthenticationError(options)</code> - Shows an authentication error notification</li>
                      <li><code>showAuthorizationError(options)</code> - Shows an authorization error notification</li>
                      <li><code>showSessionExpiredError(options)</code> - Shows a session expired notification</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="examples" className="mt-6">
                  <PermissionErrorExample />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default PermissionErrorHandling;
