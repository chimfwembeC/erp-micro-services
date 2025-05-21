import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps, AppRole } from '@/types';
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

interface RolesIndexProps extends PageProps {
  roles: AppRole[];
}

export default function Index({ roles }: RolesIndexProps) {
  const route = useRoute();
  const { t } = useTranslate();
  const [roleToDelete, setRoleToDelete] = useState<AppRole | null>(null);

  const handleDelete = () => {
    if (roleToDelete) {
      router.delete(route('roles.destroy', roleToDelete.id), {
        onSuccess: () => {
          setRoleToDelete(null);
          showSuccess(t('roles.deleteSuccess', 'Role deleted successfully'), {
            description: t('roles.deleteSuccessDescription', 'Role {{name}} has been deleted.', { name: roleToDelete.name })
          });
        },
        onError: () => {
          setRoleToDelete(null);
          showError(t('roles.deleteError', 'Failed to delete role'), {
            description: t('roles.deleteErrorDescription', 'An error occurred while deleting the role.')
          });
        }
      });
    }
  };

  return (
    <AppLayout
      title={t('roles.title', 'Roles')}
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {t('roles.title', 'Roles')}
        </h2>
      )}
    >
      <Head title={t('roles.title', 'Roles')} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-6">
            <BreadcrumbWrapper
              items={[
                { label: t('roles.title', 'Roles') }
              ]}
            />
          </div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t('roles.management', 'Role Management')}</CardTitle>
                <CardDescription>{t('roles.manageDescription', 'Manage your system roles')}</CardDescription>
              </div>
              <Link href={route('roles.create')}>
                <Button>{t('roles.addRole', 'Add Role')}</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('common.id', 'ID')}</TableHead>
                    <TableHead>{t('common.name', 'Name')}</TableHead>
                    <TableHead>{t('common.description', 'Description')}</TableHead>
                    <TableHead>{t('permissions.title', 'Permissions')}</TableHead>
                    <TableHead>{t('common.createdAt', 'Created At')}</TableHead>
                    <TableHead>{t('common.actions', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>{role.id}</TableCell>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions?.map((permission) => (
                            <span
                              key={permission.id}
                              className="inline-block bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200"
                            >
                              {permission.name}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(role.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              {t('common.actions', 'Actions')}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={route('roles.show', role.id)}>{t('common.view', 'View')}</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={route('roles.edit', role.id)}>{t('common.edit', 'Edit')}</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 dark:text-red-400"
                              onClick={() => setRoleToDelete(role)}
                              disabled={role.name === 'admin'} // Prevent deleting admin role
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

      <AlertDialog open={!!roleToDelete} onOpenChange={(open) => !open && setRoleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.areYouSure', 'Are you sure?')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('roles.deleteConfirmation', 'This will permanently delete the role "{{name}}". This action cannot be undone.', { name: roleToDelete?.name || '' })}
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
