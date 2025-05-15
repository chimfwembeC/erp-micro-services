import React, { FormEventHandler } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps, Permission, AppRole } from '@/types';
import useRoute from '@/Hooks/useRoute';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import BreadcrumbWrapper from '@/Components/BreadcrumbWrapper';
import { showSuccess, showError } from '@/utils/notifications';

interface EditPermissionProps extends PageProps {
  permission: Permission;
  roles: AppRole[];
  permissionRoles: number[];
}

export default function Edit({ permission, roles, permissionRoles }: EditPermissionProps) {
  const route = useRoute();
  const { data, setData, errors, processing } = useForm({
    name: permission.name,
    description: permission.description || '',
    roles: permissionRoles,
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    router.put(route('permissions.update', permission.id), data, {
      onSuccess: () => {
        showSuccess('Permission updated successfully', {
          description: `Permission ${data.name} has been updated.`
        });
      },
      onError: () => {
        showError('Failed to update permission', {
          description: 'Please check the form for errors.'
        });
      }
    });
  };

  const toggleRole = (roleId: number) => {
    setData('roles',
      data.roles.includes(roleId)
        ? data.roles.filter(id => id !== roleId)
        : [...data.roles, roleId]
    );
  };

  // Core permissions that cannot be edited
  const corePermissions = [
    'view_users', 'create_users', 'edit_users', 'delete_users',
    'view_roles', 'create_roles', 'edit_roles', 'delete_roles',
    'view_permissions', 'assign_permissions'
  ];

  const isCorePermission = corePermissions.includes(permission.name);

  return (
    <AppLayout
      title="Edit Permission"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Edit Permission
        </h2>
      )}
    >
      <Head title="Edit Permission" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-6">
            <BreadcrumbWrapper
              items={[
                { label: 'Permissions', href: route('permissions.index') },
                { label: `Edit Permission: ${permission.name}` }
              ]}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Edit Permission: {permission.name}</CardTitle>
              <CardDescription>Update permission information and role assignments</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                    disabled={isCorePermission} // Prevent editing core permission names
                  />
                  {isCorePermission && (
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      Core permission names cannot be changed.
                    </p>
                  )}
                  {errors.name && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={3}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Assign to Roles</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {roles.map((role) => (
                      <div key={role.id} className="flex items-center space-x-2">
                        <Switch
                          id={`role-${role.id}`}
                          checked={data.roles.includes(role.id)}
                          onCheckedChange={() => toggleRole(role.id)}
                          disabled={isCorePermission && role.name === 'admin'} // Admin must keep core permissions
                        />
                        <Label htmlFor={`role-${role.id}`} className="cursor-pointer">
                          {role.name}
                          {role.description && (
                            <span className="text-sm text-gray-500 dark:text-gray-400 block">
                              {role.description}
                            </span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {isCorePermission && (
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      Core permissions cannot be removed from the admin role.
                    </p>
                  )}
                  {errors.roles && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.roles}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={route('permissions.index')}>
                  <Button variant="outline" type="button">Cancel</Button>
                </Link>
                <Button type="submit" disabled={processing}>Update Permission</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
