import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Trash2, ArrowLeft, UserPlus } from 'lucide-react';
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

interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source?: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'negotiation' | 'won' | 'lost';
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
  lead: Lead;
}

export default function Show({ lead }: Props) {
  const { t } = useTranslation();

  const handleDelete = () => {
    if (confirm(t('common.confirmDelete'))) {
      router.delete(route('leads.destroy', lead.id), {
        onSuccess: () => {
          toast.success(t('leads.deleteSuccess'));
        },
        onError: () => {
          toast.error(t('leads.deleteError'));
        },
      });
    }
  };

  const handleConvert = () => {
    if (confirm(t('leads.confirmConvert'))) {
      router.post(route('leads.convert', lead.id), {}, {
        onSuccess: () => {
          toast.success(t('leads.convertSuccess'));
        },
        onError: () => {
          toast.error(t('leads.convertError'));
        },
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500">{t(`leads.${status}`)}</Badge>;
      case 'contacted':
        return <Badge className="bg-purple-500">{t(`leads.${status}`)}</Badge>;
      case 'qualified':
        return <Badge className="bg-green-500">{t(`leads.${status}`)}</Badge>;
      case 'unqualified':
        return <Badge className="bg-red-500">{t(`leads.${status}`)}</Badge>;
      case 'negotiation':
        return <Badge className="bg-yellow-500">{t(`leads.${status}`)}</Badge>;
      case 'won':
        return <Badge className="bg-emerald-500">{t(`leads.${status}`)}</Badge>;
      case 'lost':
        return <Badge className="bg-gray-500">{t(`leads.${status}`)}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AppLayout
      title={t('leads.viewLead')}
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {t('leads.viewLead')}
        </h2>
      )}
    >
      <Head title={t('leads.viewLead')} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <Breadcrumb
              items={[
                { label: t('common.dashboard'), href: route('dashboard') },
                {
                  label: t('leads.leadManagement'),
                  href: route('leads.index'),
                },
                { label: lead.name },
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
              <Link href={route('leads.index')}>
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
                <Link href={route('leads.edit', lead.id)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  {t('common.edit')}
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleConvert}
                className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-950"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {t('leads.convertToClient')}
              </Button>
              <ChatButton entityType="lead" entityId={lead.id} />
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">{t('leads.leadDetails')}</TabsTrigger>
              <TabsTrigger value="communications">{t('leads.leadCommunications')}</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{lead.name}</CardTitle>
                      <CardDescription>{lead.email}</CardDescription>
                    </div>
                    <div>{getStatusBadge(lead.status)}</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        {t('common.phone')}
                      </h3>
                      <p>{lead.phone || t('common.notSpecified')}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        {t('common.company')}
                      </h3>
                      <p>{lead.company || t('common.notSpecified')}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        {t('leads.source')}
                      </h3>
                      <p>{lead.source || t('common.notSpecified')}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        {t('common.createdBy')}
                      </h3>
                      <p>
                        {lead.created_by?.name || t('common.notSpecified')} (
                        {format(
                          new Date(lead.created_at),
                          'MMM d, yyyy HH:mm'
                        )}
                        )
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      {t('common.notes')}
                    </h3>
                    <p className="whitespace-pre-line">
                      {lead.notes || t('common.notSpecified')}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <p className="text-sm text-muted-foreground">
                    {t('common.lastUpdated')}:{' '}
                    {format(new Date(lead.updated_at), 'MMM d, yyyy HH:mm')}
                    {lead.updated_by?.name &&
                      ` ${t('common.by')} ${lead.updated_by.name}`}
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="communications">
              <Card>
                <CardHeader>
                  <CardTitle>{t('leads.leadCommunications')}</CardTitle>
                  <CardDescription>
                    {t('leads.communicationsDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CommunicationList
                    entityType="lead"
                    entityId={lead.id}
                    entityName={lead.name}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}
