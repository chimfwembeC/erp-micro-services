import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

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

interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source?: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'negotiation' | 'won' | 'lost';
  notes?: string;
}

interface Props {
  lead: Lead;
}

export default function Edit({ lead }: Props) {
  const { t } = useTranslation();

  const form = useForm({
    name: lead.name || '',
    email: lead.email || '',
    phone: lead.phone || '',
    company: lead.company || '',
    source: lead.source || '',
    status: lead.status || 'new',
    notes: lead.notes || '',
  });

  function onSubmit(data: any) {
    form.put(route('leads.update', lead.id), {
      onSuccess: () => {
        toast.success(t('leads.updateSuccess'));
      },
      onError: (errors) => {
        toast.error(t('leads.updateError'));
        console.error(errors);
      },
    });
  }

  return (
    <AppLayout
      title={t('leads.editLead')}
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {t('leads.editLead')}
        </h2>
      )}
    >
      <Head title={t('leads.editLead')} />

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
                { label: t('leads.editLead') },
              ]}
            />
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>{t('leads.editLead')}</CardTitle>
              <CardDescription>
                {t('leads.editLeadDescription')}
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
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('common.name')}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={t('leads.namePlaceholder')}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('common.email')}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder={t('leads.emailPlaceholder')}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('common.phone')}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={t('leads.phonePlaceholder')}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('common.company')}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={t('leads.companyPlaceholder')}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="source"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('leads.source')}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={t('leads.sourcePlaceholder')}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('common.status')}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t('leads.selectStatus')}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="new">
                                {t('leads.new')}
                              </SelectItem>
                              <SelectItem value="contacted">
                                {t('leads.contacted')}
                              </SelectItem>
                              <SelectItem value="qualified">
                                {t('leads.qualified')}
                              </SelectItem>
                              <SelectItem value="unqualified">
                                {t('leads.unqualified')}
                              </SelectItem>
                              <SelectItem value="negotiation">
                                {t('leads.negotiation')}
                              </SelectItem>
                              <SelectItem value="won">
                                {t('leads.won')}
                              </SelectItem>
                              <SelectItem value="lost">
                                {t('leads.lost')}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('common.notes')}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder={t('leads.notesPlaceholder')}
                            rows={5}
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
