import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps, AppRole } from '@/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ShowRoleProps extends PageProps {
  role: AppRole;
}

export default function Show({ auth, role }: ShowRoleProps) {
  // Check if this is the admin role
  const isAdminRole = role.name === 'admin';

  return (
    <AppLayout
      title="Role Details"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Role Details
        </h2>
      )}
    >
      <Head title="Role Details" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Role: {role.name}</CardTitle>
              <CardDescription>Role details and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">ID:</span>
                        <span>{role.id}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Name:</span>
                        <span>{role.name}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Description:</span>
                        <span>{role.description || 'No description'}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Created At:</span>
                        <span>{new Date(role.created_at).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Updated At:</span>
                        <span>{new Date(role.updated_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Permissions</h3>
                    {role.permissions && role.permissions.length > 0 ? (
                      <div className="mt-2">
                        {/* Group permissions by their prefix */}
                        {Object.entries(
                          role.permissions.reduce((groups, permission) => {
                            const prefix = permission.name.split('_')[0];
                            if (!groups[prefix]) {
                              groups[prefix] = [];
                            }
                            groups[prefix].push(permission);
                            return groups;
                          }, {} as Record<string, typeof role.permissions>)
                        ).map(([group, permissions]) => (
                          <div key={group} className="mb-4">
                            <h4 className="text-md font-medium capitalize mb-2">{group} Permissions</h4>
                            <div className="flex flex-wrap gap-2">
                              {permissions.map((permission) => (
                                <div 
                                  key={permission.id} 
                                  className="bg-gray-100 dark:bg-gray-700 rounded-md px-3 py-2 text-sm"
                                >
                                  <div className="font-medium">{permission.name}</div>
                                  {permission.description && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {permission.description}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2 text-gray-500 dark:text-gray-400">
                        No permissions assigned to this role.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={route('roles.index')}>
                <Button variant="outline">Back to Roles</Button>
              </Link>
              <div className="space-x-2">
                <Link href={route('roles.edit', role.id)}>
                  <Button disabled={isAdminRole}>Edit Role</Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
