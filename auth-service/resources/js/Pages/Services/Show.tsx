import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
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
import BreadcrumbWrapper from '@/Components/BreadcrumbWrapper';
import { showSuccess, showError } from '@/utils/notifications';
import { Badge } from '@/components/ui/badge';
import { Clipboard, Eye, EyeOff } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Service {
  id: number;
  name: string;
  description: string | null;
  service_id: string;
  service_secret: string;
  permissions: string[] | null;
  is_active: boolean;
  created_at: string;
}

interface ShowServiceProps extends PageProps {
  service: Service;
}

export default function Show({ service }: ShowServiceProps) {
  const route = useRoute();
  const { t } = useTranslate();
  const [showSecret, setShowSecret] = useState(false);
  const [regenerateDialogOpen, setRegenerateDialogOpen] = useState(false);

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        showSuccess('Copied to clipboard', {
          description: message
        });
      },
      () => {
        showError('Failed to copy', {
          description: 'Could not copy to clipboard. Please try again.'
        });
      }
    );
  };

  const handleRegenerateSecret = () => {
    router.post(route('services.regenerate-secret', service.id), {}, {
      onSuccess: () => {
        showSuccess('Service secret regenerated', {
          description: 'The service secret has been regenerated successfully.'
        });
        setRegenerateDialogOpen(false);
      },
      onError: () => {
        showError('Failed to regenerate secret', {
          description: 'An error occurred while regenerating the service secret.'
        });
      }
    });
  };

  return (
    <AppLayout
      title="Service Details"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {t('services.serviceDetails', 'Service Details')}
        </h2>
      )}
    >
      <Head title="Service Details" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-6">
            <BreadcrumbWrapper
              items={[
                { label: t('dashboard.title', 'Dashboard'), href: route('dashboard') },
                { label: t('services.title', 'Services'), href: route('services.index') },
                { label: service.name }
              ]}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">{t('services.serviceInfo', 'Service Information')}</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('common.id', 'ID')}
                      </p>
                      <p>{service.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('common.name', 'Name')}
                      </p>
                      <p>{service.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('common.description', 'Description')}
                      </p>
                      <p>{service.description || t('common.none', 'None')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('services.serviceId', 'Service ID')}
                      </p>
                      <div className="flex items-center space-x-2">
                        <p>{service.service_id}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(service.service_id, 'Service ID copied to clipboard')}
                        >
                          <Clipboard className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('services.serviceSecret', 'Service Secret')}
                      </p>
                      <div className="flex items-center space-x-2">
                        <p className="font-mono">
                          {showSecret ? service.service_secret : '••••••••••••••••••••••••••••••••'}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowSecret(!showSecret)}
                        >
                          {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(service.service_secret, 'Service secret copied to clipboard')}
                        >
                          <Clipboard className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setRegenerateDialogOpen(true)}
                      >
                        {t('services.regenerateSecret', 'Regenerate Secret')}
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">{t('services.additionalInfo', 'Additional Information')}</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('services.status', 'Status')}
                      </p>
                      <Badge variant={service.is_active ? 'default' : 'secondary'}>
                        {service.is_active
                          ? t('services.active', 'Active')
                          : t('services.inactive', 'Inactive')}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('services.permissions', 'Permissions')}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {service.permissions && service.permissions.length > 0 ? (
                          service.permissions.map((permission, index) => (
                            <Badge key={index} variant="outline">
                              {permission}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400">
                            {t('services.noPermissions', 'No permissions')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('common.createdAt', 'Created At')}
                      </p>
                      <p>{new Date(service.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium mb-4">{t('services.apiUsage', 'API Usage')}</h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                  <p className="text-sm font-medium mb-2">{t('services.tokenRequest', 'Token Request')}</p>
                  <pre className="bg-gray-200 dark:bg-gray-900 p-3 rounded-md overflow-x-auto text-sm">
                    {`POST /api/auth/service-token
Content-Type: application/json

{
  "service_id": "${service.service_id}",
  "service_secret": "${showSecret ? service.service_secret : '••••••••••••••••••••••••••••••••'}"
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={route('services.index')}>
                <Button variant="outline">
                  {t('common.back', 'Back')}
                </Button>
              </Link>
              <div className="space-x-2">
                <Link href={route('services.edit', service.id)}>
                  <Button>
                    {t('common.edit', 'Edit')}
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      <AlertDialog open={regenerateDialogOpen} onOpenChange={setRegenerateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('services.regenerateSecret', 'Regenerate Secret')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('services.regenerateWarning', 'Are you sure you want to regenerate the service secret? This will invalidate the current secret and any services using it will need to be updated.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleRegenerateSecret}>
              {t('services.regenerate', 'Regenerate')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
