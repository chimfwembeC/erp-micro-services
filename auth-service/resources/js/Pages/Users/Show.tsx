import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps, User } from '@/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ShowUserProps extends PageProps {
  user: User;
}

export default function Show({ auth, user }: ShowUserProps) {
  return (
    <AppLayout
      title="User Details"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          User Details
        </h2>
      )}
    >
      <Head title="User Details" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>User: {user.name}</CardTitle>
              <CardDescription>User details and roles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">ID:</span>
                        <span>{user.id}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Name:</span>
                        <span>{user.name}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Email:</span>
                        <span>{user.email}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Email Verified:</span>
                        <span>{user.email_verified_at ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Created At:</span>
                        <span>{new Date(user.created_at).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Updated At:</span>
                        <span>{new Date(user.updated_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Roles</h3>
                    {user.roles && user.roles.length > 0 ? (
                      <div className="mt-2 space-y-2">
                        {user.roles.map((role) => (
                          <div key={role.id} className="border rounded-md p-3">
                            <div className="font-semibold">{role.name}</div>
                            {role.description && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {role.description}
                              </div>
                            )}
                            {role.permissions && role.permissions.length > 0 && (
                              <div className="mt-2">
                                <div className="text-sm font-medium">Permissions:</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {role.permissions.map((permission) => (
                                    <span 
                                      key={permission.id} 
                                      className="inline-block bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200"
                                    >
                                      {permission.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2 text-gray-500 dark:text-gray-400">
                        No roles assigned to this user.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={route('users.index')}>
                <Button variant="outline">Back to Users</Button>
              </Link>
              <div className="space-x-2">
                <Link href={route('users.edit', user.id)}>
                  <Button>Edit User</Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
