import React, { FormEventHandler } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps, AppRole, Permission } from '@/types';
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

interface EditRoleProps extends PageProps {
  role: AppRole;
  permissions: Permission[];
  rolePermissions: number[];
}

export default function Edit({ role, permissions, rolePermissions }: EditRoleProps) {
  const route = useRoute();
  const { data, setData, errors, processing } = useForm({
    name: role.name,
    description: role.description || '',
    permissions: rolePermissions,
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    router.put(route('roles.update', role.id), data, {
      onSuccess: () => {
        showSuccess('Role updated successfully', {
          description: `Role ${data.name} has been updated.`
        });
      },
      onError: () => {
        showError('Failed to update role', {
          description: 'Please check the form for errors.'
        });
      }
    });
  };

  const togglePermission = (permissionId: number) => {
    setData('permissions',
      data.permissions.includes(permissionId)
        ? data.permissions.filter(id => id !== permissionId)
        : [...data.permissions, permissionId]
    );
  };

  // Group permissions by their prefix (e.g., view_*, create_*, etc.)
  const groupedPermissions = permissions.reduce((groups, permission) => {
    const prefix = permission.name.split('_')[0];
    if (!groups[prefix]) {
      groups[prefix] = [];
    }
    groups[prefix].push(permission);
    return groups;
  }, {} as Record<string, Permission[]>);

  // Check if this is the admin role (to prevent editing name)
  const isAdminRole = role.name === 'admin';

  return (
    <AppLayout
      title="Edit Role"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Edit Role
        </h2>
      )}
    >
      <Head title="Edit Role" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-6">
            <BreadcrumbWrapper
              items={[
                { label: 'Roles', href: route('roles.index') },
                { label: `Edit Role: ${role.name}` }
              ]}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Edit Role: {role.name}</CardTitle>
              <CardDescription>Update role information and permissions</CardDescription>
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
                    disabled={isAdminRole} // Prevent editing admin role name
                  />
                  {isAdminRole && (
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      The admin role name cannot be changed.
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

                <div className="space-y-4">
                  <Label>Permissions</Label>

                  {Object.entries(groupedPermissions).map(([group, groupPermissions]) => (
                    <div key={group} className="space-y-2">
                      <h3 className="text-md font-medium capitalize">{group} Permissions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groupPermissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Switch
                              id={`permission-${permission.id}`}
                              checked={data.permissions.includes(permission.id)}
                              onCheckedChange={() => togglePermission(permission.id)}
                              disabled={isAdminRole} // Prevent editing admin role permissions
                            />
                            <Label htmlFor={`permission-${permission.id}`} className="cursor-pointer">
                              {permission.name}
                              {permission.description && (
                                <span className="text-sm text-gray-500 dark:text-gray-400 block">
                                  {permission.description}
                                </span>
                              )}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {isAdminRole && (
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      The admin role permissions cannot be changed.
                    </p>
                  )}

                  {errors.permissions && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.permissions}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={route('roles.index')}>
                  <Button variant="outline" type="button">Cancel</Button>
                </Link>
                <Button type="submit" disabled={processing || isAdminRole}>Update Role</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
