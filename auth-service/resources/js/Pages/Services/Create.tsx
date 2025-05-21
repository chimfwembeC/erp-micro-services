import React, { FormEventHandler } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps } from '@/types';
import useRoute from '@/Hooks/useRoute';
import useTranslate from '@/Hooks/useTranslate';
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
import { MultiSelect } from '@/Components/MultiSelect';

export default function Create() {
  const route = useRoute();
  const { t } = useTranslate();
  const { data, setData, errors, processing } = useForm({
    name: '',
    description: '',
    service_id: '',
    permissions: [] as string[],
    is_active: true,
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    router.post(route('services.store'), data, {
      onSuccess: () => {
        showSuccess('Service created successfully', {
          description: `Service ${data.name} has been created.`
        });
      },
      onError: () => {
        showError('Failed to create service', {
          description: 'Please check the form for errors.'
        });
      }
    });
  };

  // Common permission options for services
  const permissionOptions = [
    { value: 'read:users', label: 'Read Users' },
    { value: 'read:roles', label: 'Read Roles' },
    { value: 'read:permissions', label: 'Read Permissions' },
    { value: 'create:users', label: 'Create Users' },
    { value: 'update:users', label: 'Update Users' },
    { value: 'delete:users', label: 'Delete Users' },
    { value: 'read:audit_logs', label: 'Read Audit Logs' },
  ];

  return (
    <AppLayout
      title="Create Service"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {t('services.createService', 'Create Service')}
        </h2>
      )}
    >
      <Head title="Create Service" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-6">
            <BreadcrumbWrapper
              items={[
                { label: t('dashboard.title', 'Dashboard'), href: route('dashboard') },
                { label: t('services.title', 'Services'), href: route('services.index') },
                { label: t('services.createService', 'Create Service') }
              ]}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>{t('services.createService', 'Create Service')}</CardTitle>
              <CardDescription>{t('services.createDescription', 'Create a new service for service-to-service authentication')}</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('common.name', 'Name')}</Label>
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
                  <Label htmlFor="description">{t('common.description', 'Description')}</Label>
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
                  <Label htmlFor="service_id">{t('services.serviceId', 'Service ID')}</Label>
                  <Input
                    id="service_id"
                    value={data.service_id}
                    onChange={(e) => setData('service_id', e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('services.serviceIdHelp', 'A unique identifier for this service (e.g., "crm-service")')}
                  </p>
                  {errors.service_id && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.service_id}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="permissions">{t('services.permissions', 'Permissions')}</Label>
                  <MultiSelect
                    options={permissionOptions}
                    selected={data.permissions}
                    onChange={(selected) => setData('permissions', selected)}
                    placeholder={t('services.selectPermissions', 'Select permissions')}
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('services.permissionsHelp', 'Select the permissions this service should have')}
                  </p>
                  {errors.permissions && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.permissions}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={data.is_active}
                    onCheckedChange={(checked) => setData('is_active', checked)}
                  />
                  <Label htmlFor="is_active">{t('services.active', 'Active')}</Label>
                  {errors.is_active && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.is_active}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={route('services.index')}>
                  <Button variant="outline" type="button">
                    {t('common.cancel', 'Cancel')}
                  </Button>
                </Link>
                <Button type="submit" disabled={processing}>
                  {processing ? t('common.creating', 'Creating...') : t('common.create', 'Create')}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
