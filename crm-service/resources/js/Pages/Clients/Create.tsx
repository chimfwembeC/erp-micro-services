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

export default function Create() {
  const { t } = useTranslation();

  const form = useForm({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    website: '',
    status: 'potential',
    notes: '',
  });

  function onSubmit(data: any) {
    form.post(route('clients.store'), {
      onSuccess: () => {
        toast.success(t('clients.createSuccess'));
      },
      onError: (errors) => {
        toast.error(t('clients.createError'));
        console.error(errors);
      },
    });
  }

  return (
    <AppLayout
      title={t('clients.addClient')}
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {t('clients.addClient')}
        </h2>
      )}
    >
      <Head title={t('clients.addClient')} />

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
                { label: t('clients.addClient') },
              ]}
            />
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>{t('clients.addClient')}</CardTitle>
              <CardDescription>
                {t('clients.addClientDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit(form.data);
                  }}
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
                              placeholder={t('clients.namePlaceholder')}
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
                              placeholder={t('clients.emailPlaceholder')}
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
                              placeholder={t('clients.phonePlaceholder')}
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
                              placeholder={t('clients.companyPlaceholder')}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('common.website')}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={t('clients.websitePlaceholder')}
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
                                  placeholder={t('clients.selectStatus')}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">
                                {t('clients.active')}
                              </SelectItem>
                              <SelectItem value="inactive">
                                {t('clients.inactive')}
                              </SelectItem>
                              <SelectItem value="potential">
                                {t('clients.potential')}
                              </SelectItem>
                              <SelectItem value="former">
                                {t('clients.former')}
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
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('common.address')}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder={t('clients.addressPlaceholder')}
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('common.notes')}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder={t('clients.notesPlaceholder')}
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
