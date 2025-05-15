import React, { FormEventHandler, useState } from 'react';
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

import { Switch } from '@/components/ui/switch';
import BreadcrumbWrapper from '@/Components/BreadcrumbWrapper';
import { showSuccess, showError } from '@/utils/notifications';

interface CreateUserProps extends PageProps {
  roles: AppRole[];
  permissions: Permission[];
  canAssignRoles: boolean;
  canAssignDirectPermissions: boolean;
}

export default function Create({
  roles,
  permissions,
  canAssignRoles,
  canAssignDirectPermissions
}: CreateUserProps) {
  const route = useRoute();
  const { data, setData, errors, processing } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    roles: [] as number[],
    directPermissions: [] as number[],
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    router.post(route('users.store'), data, {
      onSuccess: () => {
        showSuccess('User created successfully', {
          description: `User ${data.name} has been created.`
        });
      },
      onError: () => {
        showError('Failed to create user', {
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

  const togglePermission = (permissionId: number) => {
    setData('directPermissions',
      data.directPermissions.includes(permissionId)
        ? data.directPermissions.filter(id => id !== permissionId)
        : [...data.directPermissions, permissionId]
    );
  };

  return (
    <AppLayout
      title="Create User"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Create User
        </h2>
      )}
    >
      <Head title="Create User" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-6">
            <BreadcrumbWrapper
              items={[
                { label: 'Users', href: route('users.index') },
                { label: 'Create User' }
              ]}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Create New User</CardTitle>
              <CardDescription>Add a new user to the system</CardDescription>
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
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    required
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">Confirm Password</Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    required
                  />
                </div>

                {canAssignRoles ? (
                  <div className="space-y-2">
                    <Label>Roles</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {roles.map((role) => (
                        <div key={role.id} className="flex items-center space-x-2">
                          <Switch
                            id={`role-${role.id}`}
                            checked={data.roles.includes(role.id)}
                            onCheckedChange={() => toggleRole(role.id)}
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
                    {errors.roles && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.roles}</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Roles</Label>
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      You don't have permission to assign roles. The user will be assigned the default 'user' role.
                    </p>
                  </div>
                )}

                {/* Direct Permissions Section */}
                {canAssignDirectPermissions ? (
                  <div className="space-y-2">
                    <Label>Direct Permissions</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      These permissions are assigned directly to the user, regardless of their roles.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Switch
                            id={`permission-${permission.id}`}
                            checked={data.directPermissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
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
                    {errors.directPermissions && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.directPermissions}</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Direct Permissions</Label>
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      You don't have permission to assign permissions directly to users.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={route('users.index')}>
                  <Button variant="outline" type="button">Cancel</Button>
                </Link>
                <Button type="submit" disabled={processing}>Create User</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
