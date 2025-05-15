import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { format } from 'date-fns';

import AppLayout from '@/Layouts/AppLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Client {
  id: number;
  name: string;
  email: string;
}

interface Lead {
  id: number;
  name: string;
  email: string;
}

interface Props {
  client?: Client;
  lead?: Lead;
  entityType: 'client' | 'lead';
  entityId: number;
}

export default function Create({ client, lead, entityType, entityId }: Props) {
  const { t } = useTranslation();
  const entity = entityType === 'client' ? client : lead;

  const form = useForm({
    client_id: entityType === 'client' ? entityId : null,
    lead_id: entityType === 'lead' ? entityId : null,
    type: 'email',
    subject: '',
    content: '',
    date: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
  });

  function onSubmit(data: any) {
    form.post(route('communications.store'), {
      onSuccess: () => {
        toast.success(t('communications.createSuccess'));
      },
      onError: (errors) => {
        toast.error(t('communications.createError'));
        console.error(errors);
      },
    });
  }

  const breadcrumbItems = entityType === 'client'
    ? [
        { label: t('common.dashboard'), href: route('dashboard') },
        { label: t('clients.clientManagement'), href: route('clients.index') },
        { label: entity?.name || '', href: route('clients.show', entityId) },
        { label: t('communications.addCommunication') },
      ]
    : [
        { label: t('common.dashboard'), href: route('dashboard') },
        { label: t('leads.leadManagement'), href: route('leads.index') },
        { label: entity?.name || '', href: route('leads.show', entityId) },
        { label: t('communications.addCommunication') },
      ];

  return (
    <AppLayout
      title={t('communications.addCommunication')}
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {t('communications.addCommunication')}
        </h2>
      )}
    >
      <Head title={t('communications.addCommunication')} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>{t('communications.addCommunication')}</CardTitle>
              <CardDescription>
                {entityType === 'client'
                  ? t('communications.addClientCommunicationDescription', { name: entity?.name })
                  : t('communications.addLeadCommunicationDescription', { name: entity?.name })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('communications.communicationType')}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t('communications.selectType')}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="email">
                                {t('communications.email')}
                              </SelectItem>
                              <SelectItem value="call">
                                {t('communications.call')}
                              </SelectItem>
                              <SelectItem value="meeting">
                                {t('communications.meeting')}
                              </SelectItem>
                              <SelectItem value="note">
                                {t('communications.note')}
                              </SelectItem>
                              <SelectItem value="other">
                                {t('communications.other')}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('common.date')}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="datetime-local"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('communications.subject')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t('communications.subjectPlaceholder')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('communications.message')}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder={t('communications.messagePlaceholder')}
                            rows={8}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => window.history.back()}
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button
                      type="submit"
                      disabled={form.processing}
                      className="ml-4"
                    >
                      {form.processing
                        ? t('common.saving')
                        : t('common.save')}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
