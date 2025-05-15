import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

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

interface Communication {
  id: number;
  client_id: number | null;
  lead_id: number | null;
  type: 'email' | 'call' | 'meeting' | 'note' | 'other';
  subject: string;
  content: string;
  date: string;
  client?: Client;
  lead?: Lead;
}

interface Props {
  communication: Communication;
  entityType: 'client' | 'lead';
  entityId: number;
}

export default function Edit({ communication, entityType, entityId }: Props) {
  const { t } = useTranslation();
  const entity = entityType === 'client' ? communication.client : communication.lead;

  const form = useForm({
    type: communication.type,
    subject: communication.subject,
    content: communication.content,
    date: format(parseISO(communication.date), 'yyyy-MM-dd\'T\'HH:mm'),
  });

  function onSubmit(data: any) {
    form.put(route('communications.update', communication.id), {
      onSuccess: () => {
        toast.success(t('communications.updateSuccess'));
      },
      onError: (errors) => {
        toast.error(t('communications.updateError'));
        console.error(errors);
      },
    });
  }

  const breadcrumbItems = entityType === 'client'
    ? [
        { label: t('common.dashboard'), href: route('dashboard') },
        { label: t('clients.clientManagement'), href: route('clients.index') },
        { label: entity?.name || '', href: route('clients.show', entityId) },
        { label: t('communications.editCommunication') },
      ]
    : [
        { label: t('common.dashboard'), href: route('dashboard') },
        { label: t('leads.leadManagement'), href: route('leads.index') },
        { label: entity?.name || '', href: route('leads.show', entityId) },
        { label: t('communications.editCommunication') },
      ];

  return (
    <AppLayout
      title={t('communications.editCommunication')}
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {t('communications.editCommunication')}
        </h2>
      )}
    >
      <Head title={t('communications.editCommunication')} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>{t('communications.editCommunication')}</CardTitle>
              <CardDescription>
                {entityType === 'client'
                  ? t('communications.editClientCommunicationDescription', { name: entity?.name })
                  : t('communications.editLeadCommunicationDescription', { name: entity?.name })}
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
