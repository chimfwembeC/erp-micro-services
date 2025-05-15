import React, { FormEventHandler } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps, AppRole } from '@/types';
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

interface CreatePermissionProps extends PageProps {
  roles: AppRole[];
}

export default function Create({ roles }: CreatePermissionProps) {
  const route = useRoute();
  const { data, setData, errors, processing } = useForm({
    name: '',
    description: '',
    roles: [] as number[],
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    router.post(route('permissions.store'), data, {
      onSuccess: () => {
        showSuccess('Permission created successfully', {
          description: `Permission ${data.name} has been created.`
        });
      },
      onError: () => {
        showError('Failed to create permission', {
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

  return (
    <AppLayout
      title="Create Permission"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Create Permission
        </h2>
      )}
    >
      <Head title="Create Permission" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-6">
            <BreadcrumbWrapper
              items={[
                { label: 'Permissions', href: route('permissions.index') },
                { label: 'Create Permission' }
              ]}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Create New Permission</CardTitle>
              <CardDescription>Add a new permission to the system</CardDescription>
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
                    placeholder="e.g., manage_content"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Use snake_case format (e.g., view_users, manage_content)
                  </p>
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
                    placeholder="e.g., Can manage all content in the system"
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
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={route('permissions.index')}>
                  <Button variant="outline" type="button">Cancel</Button>
                </Link>
                <Button type="submit" disabled={processing}>Create Permission</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
