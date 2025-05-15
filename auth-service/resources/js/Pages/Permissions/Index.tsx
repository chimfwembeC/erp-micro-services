import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps, Permission } from '@/types';
import useRoute from '@/Hooks/useRoute';
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

interface PermissionsIndexProps extends PageProps {
  permissions: Permission[];
}

export default function Index({ permissions }: PermissionsIndexProps) {
  const route = useRoute();
  const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null);

  const handleDelete = () => {
    if (permissionToDelete) {
      router.delete(route('permissions.destroy', permissionToDelete.id), {
        onSuccess: () => {
          setPermissionToDelete(null);
          showSuccess('Permission deleted successfully', {
            description: `Permission ${permissionToDelete.name} has been deleted.`
          });
        },
        onError: () => {
          setPermissionToDelete(null);
          showError('Failed to delete permission', {
            description: 'An error occurred while deleting the permission.'
          });
        }
      });
    }
  };

  // Core permissions that cannot be deleted
  const corePermissions = [
    'view_users', 'create_users', 'edit_users', 'delete_users',
    'view_roles', 'create_roles', 'edit_roles', 'delete_roles',
    'view_permissions', 'assign_permissions'
  ];

  // Group permissions by their prefix (e.g., view_*, create_*, etc.)
  const groupedPermissions = permissions.reduce((groups, permission) => {
    const prefix = permission.name.split('_')[0];
    if (!groups[prefix]) {
      groups[prefix] = [];
    }
    groups[prefix].push(permission);
    return groups;
  }, {} as Record<string, Permission[]>);

  return (
    <AppLayout
      title="Permissions"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Permissions
        </h2>
      )}
    >
      <Head title="Permissions" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-6">
            <BreadcrumbWrapper
              items={[
                { label: 'Permissions' }
              ]}
            />
          </div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Permission Management</CardTitle>
                <CardDescription>Manage your system permissions</CardDescription>
              </div>
              <Link href={route('permissions.create')}>
                <Button>Add Permission</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {Object.entries(groupedPermissions).map(([group, groupPermissions]) => (
                <div key={group} className="mb-8">
                  <h3 className="text-lg font-semibold capitalize mb-4">{group} Permissions</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Assigned Roles</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupPermissions.map((permission) => (
                        <TableRow key={permission.id}>
                          <TableCell>{permission.id}</TableCell>
                          <TableCell className="font-medium">{permission.name}</TableCell>
                          <TableCell>{permission.description}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {permission.roles?.map((role) => (
                                <span
                                  key={role.id}
                                  className="inline-block bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200"
                                >
                                  {role.name}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{new Date(permission.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={route('permissions.show', permission.id)}>View</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={route('permissions.edit', permission.id)}>Edit</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600 dark:text-red-400"
                                  onClick={() => setPermissionToDelete(permission)}
                                  disabled={corePermissions.includes(permission.name)} // Prevent deleting core permissions
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={!!permissionToDelete} onOpenChange={(open) => !open && setPermissionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the permission "{permissionToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
