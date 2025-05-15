import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { format } from 'date-fns';

import CommunicationList from '@/Components/CommunicationList';
import ChatButton from '@/Components/ChatButton';

import AppLayout from '@/Layouts/AppLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  website?: string;
  status: 'active' | 'inactive' | 'potential' | 'former';
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: {
    id: number;
    name: string;
  };
  updated_by?: {
    id: number;
    name: string;
  };
}

interface Props {
  client: Client;
}

export default function Show({ client }: Props) {
  const { t } = useTranslation();

  const handleDelete = () => {
    if (confirm(t('common.confirmDelete'))) {
      router.delete(route('clients.destroy', client.id), {
        onSuccess: () => {
          toast.success(t('clients.deleteSuccess'));
        },
        onError: () => {
          toast.error(t('clients.deleteError'));
        },
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">{t(`clients.${status}`)}</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500">{t(`clients.${status}`)}</Badge>;
      case 'potential':
        return <Badge className="bg-blue-500">{t(`clients.${status}`)}</Badge>;
      case 'former':
        return <Badge className="bg-red-500">{t(`clients.${status}`)}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AppLayout
      title={t('clients.viewClient')}
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {t('clients.viewClient')}
        </h2>
      )}
    >
      <Head title={t('clients.viewClient')} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <Breadcrumb
              items={[
                { label: t('common.dashboard'), href: route('dashboard') },
                {
                  label: t('clients.clientManagement'),
                  href: route('clients.index'),
                },
                { label: client.name },
              ]}
            />
          </div>

          <div className="flex justify-between items-center mt-4 px-4 sm:px-0">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="mb-4"
            >
              <Link href={route('clients.index')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('common.back')}
              </Link>
            </Button>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <Link href={route('clients.edit', client.id)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  {t('common.edit')}
                </Link>
              </Button>
              <ChatButton entityType="client" entityId={client.id} />
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t('common.delete')}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="details" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">{t('clients.clientDetails')}</TabsTrigger>
              <TabsTrigger value="communications">{t('clients.clientCommunications')}</TabsTrigger>
              <TabsTrigger value="tasks">{t('clients.clientTasks')}</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{client.name}</CardTitle>
                      <CardDescription>{client.email}</CardDescription>
                    </div>
                    <div>{getStatusBadge(client.status)}</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        {t('common.phone')}
                      </h3>
                      <p>{client.phone || t('common.notSpecified')}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        {t('common.company')}
                      </h3>
                      <p>{client.company || t('common.notSpecified')}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        {t('common.website')}
                      </h3>
                      <p>
                        {client.website ? (
                          <a
                            href={client.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {client.website}
                          </a>
                        ) : (
                          t('common.notSpecified')
                        )}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        {t('common.createdBy')}
                      </h3>
                      <p>
                        {client.created_by?.name || t('common.notSpecified')} (
                        {format(
                          new Date(client.created_at),
                          'MMM d, yyyy HH:mm'
                        )}
                        )
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      {t('common.address')}
                    </h3>
                    <p className="whitespace-pre-line">
                      {client.address || t('common.notSpecified')}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      {t('common.notes')}
                    </h3>
                    <p className="whitespace-pre-line">
                      {client.notes || t('common.notSpecified')}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <p className="text-sm text-muted-foreground">
                    {t('common.lastUpdated')}:{' '}
                    {format(new Date(client.updated_at), 'MMM d, yyyy HH:mm')}
                    {client.updated_by?.name &&
                      ` ${t('common.by')} ${client.updated_by.name}`}
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="communications">
              <Card>
                <CardHeader>
                  <CardTitle>{t('clients.clientCommunications')}</CardTitle>
                  <CardDescription>
                    {t('clients.communicationsDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CommunicationList
                    entityType="client"
                    entityId={client.id}
                    entityName={client.name}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="tasks">
              <Card>
                <CardHeader>
                  <CardTitle>{t('clients.clientTasks')}</CardTitle>
                  <CardDescription>
                    {t('clients.tasksDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-10 text-muted-foreground">
                    <p>{t('clients.noTasksYet')}</p>
                    <p className="mt-2">{t('clients.tasksComingSoon')}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}
