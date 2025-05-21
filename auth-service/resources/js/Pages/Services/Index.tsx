import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps } from '@/types';
import useRoute from '@/Hooks/useRoute';
import useTranslate from '@/Hooks/useTranslate';
import BreadcrumbWrapper from '@/Components/BreadcrumbWrapper';
import { showSuccess, showError } from '@/utils/notifications';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface Service {
  id: number;
  name: string;
  description: string | null;
  service_id: string;
  permissions: string[] | null;
  is_active: boolean;
  created_at: string;
}

interface ServicesIndexProps extends PageProps {
  services: Service[];
}

export default function Index({ services }: ServicesIndexProps) {
  const route = useRoute();
  const { t } = useTranslate();
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  const handleDelete = () => {
    if (!serviceToDelete) return;

    router.delete(route('services.destroy', serviceToDelete.id), {
      onSuccess: () => {
        showSuccess('Service deleted successfully', {
          description: `Service ${serviceToDelete.name} has been deleted.`
        });
        setServiceToDelete(null);
      },
      onError: () => {
        showError('Failed to delete service', {
          description: 'An error occurred while deleting the service.'
        });
      }
    });
  };

  const toggleServiceStatus = (service: Service) => {
    router.put(route('services.update', service.id), {
      ...service,
      is_active: !service.is_active
    }, {
      onSuccess: () => {
        showSuccess('Service status updated', {
          description: `Service ${service.name} is now ${!service.is_active ? 'active' : 'inactive'}.`
        });
      },
      onError: () => {
        showError('Failed to update service status', {
          description: 'An error occurred while updating the service status.'
        });
      }
    });
  };

  return (
    <AppLayout
      title="Services"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {t('services.title', 'Services')}
        </h2>
      )}
    >
      <Head title="Services" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-6">
            <BreadcrumbWrapper
              items={[
                { label: t('dashboard.title', 'Dashboard'), href: route('dashboard') },
                { label: t('services.title', 'Services') }
              ]}
            />
          </div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t('services.management', 'Service Management')}</CardTitle>
                <CardDescription>{t('services.manageDescription', 'Manage your system services')}</CardDescription>
              </div>
              <Link href={route('services.create')}>
                <Button>{t('services.addService', 'Add Service')}</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('common.id', 'ID')}</TableHead>
                    <TableHead>{t('common.name', 'Name')}</TableHead>
                    <TableHead>{t('common.description', 'Description')}</TableHead>
                    <TableHead>{t('services.serviceId', 'Service ID')}</TableHead>
                    <TableHead>{t('services.permissions', 'Permissions')}</TableHead>
                    <TableHead>{t('services.status', 'Status')}</TableHead>
                    <TableHead>{t('common.createdAt', 'Created At')}</TableHead>
                    <TableHead>{t('common.actions', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.id}</TableCell>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>{service.description}</TableCell>
                      <TableCell>{service.service_id}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {service.permissions && service.permissions.map((permission, index) => (
                            <Badge key={index} variant="outline">
                              {permission}
                            </Badge>
                          ))}
                          {(!service.permissions || service.permissions.length === 0) && (
                            <span className="text-gray-500 dark:text-gray-400">
                              {t('services.noPermissions', 'No permissions')}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={service.is_active}
                            onCheckedChange={() => toggleServiceStatus(service)}
                          />
                          <span>
                            {service.is_active
                              ? t('services.active', 'Active')
                              : t('services.inactive', 'Inactive')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(service.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              {t('common.actions', 'Actions')}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={route('services.show', service.id)}>{t('common.view', 'View')}</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={route('services.edit', service.id)}>{t('common.edit', 'Edit')}</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 dark:text-red-400"
                              onClick={() => setServiceToDelete(service)}
                            >
                              {t('common.delete', 'Delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={!!serviceToDelete} onOpenChange={(open) => !open && setServiceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('services.deleteService', 'Delete Service')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('services.deleteConfirmation', 'Are you sure you want to delete this service? This action cannot be undone.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              {t('common.delete', 'Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
