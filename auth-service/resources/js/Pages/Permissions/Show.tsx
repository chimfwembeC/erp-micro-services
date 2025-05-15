import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps, Permission } from '@/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ShowPermissionProps extends PageProps {
  permission: Permission;
}

export default function Show({ auth, permission }: ShowPermissionProps) {
  // Core permissions that cannot be edited
  const corePermissions = [
    'view_users', 'create_users', 'edit_users', 'delete_users',
    'view_roles', 'create_roles', 'edit_roles', 'delete_roles',
    'view_permissions', 'assign_permissions'
  ];

  const isCorePermission = corePermissions.includes(permission.name);

  return (
    <AppLayout
      title="Permission Details"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Permission Details
        </h2>
      )}
    >
      <Head title="Permission Details" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Permission: {permission.name}</CardTitle>
              <CardDescription>Permission details and assigned roles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">ID:</span>
                        <span>{permission.id}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Name:</span>
                        <span>{permission.name}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Description:</span>
                        <span>{permission.description || 'No description'}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Created At:</span>
                        <span>{new Date(permission.created_at).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Updated At:</span>
                        <span>{new Date(permission.updated_at).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Type:</span>
                        <span>{isCorePermission ? 'Core Permission' : 'Custom Permission'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Assigned Roles</h3>
                    {permission.roles && permission.roles.length > 0 ? (
                      <div className="mt-2 space-y-2">
                        {permission.roles.map((role) => (
                          <div key={role.id} className="border rounded-md p-3">
                            <div className="font-semibold">{role.name}</div>
                            {role.description && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {role.description}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2 text-gray-500 dark:text-gray-400">
                        This permission is not assigned to any roles.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={route('permissions.index')}>
                <Button variant="outline">Back to Permissions</Button>
              </Link>
              <div className="space-x-2">
                <Link href={route('permissions.edit', permission.id)}>
                  <Button>Edit Permission</Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
