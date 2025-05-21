import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/Components/ui/breadcrumb';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface User {
  id: number;
  name: string;
  email: string;
}

interface StatusOption {
  value: string;
  label: string;
}

interface CreateProjectProps extends PageProps {
  users: User[];
  statuses: StatusOption[];
}

export default function Create({ auth, users, statuses }: CreateProjectProps) {
  const { t } = useTranslation();
  
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    start_date: new Date().toISOString().split('T')[0], // Today's date as default
    end_date: '',
    status: 'not_started',
    user_id: auth.user.id,
    client_name: '',
    budget: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    post(route('projects.store'), {
      onSuccess: () => {
        toast.success(t('projects.created_successfully'));
      },
      onError: () => {
        toast.error(t('common.error_occurred'));
      }
    });
  };

  return (
    <AppLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {t('projects.create_new')}
        </h2>
      }
    >
      <Head title={t('projects.create_new')} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href={route('dashboard')}>{t('dashboard.title')}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={route('projects.index')}>{t('projects.title')}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{t('projects.create_new')}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('projects.create_new')}</CardTitle>
              <CardDescription>{t('projects.create_description')}</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('projects.name')}</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t('projects.description')}</Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={4}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">{t('projects.start_date')}</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={data.start_date}
                      onChange={(e) => setData('start_date', e.target.value)}
                      required
                    />
                    {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end_date">{t('projects.end_date')}</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={data.end_date}
                      onChange={(e) => setData('end_date', e.target.value)}
                    />
                    {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">{t('projects.status')}</Label>
                    <Select
                      value={data.status}
                      onValueChange={(value) => setData('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('projects.select_status')} />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user_id">{t('projects.manager')}</Label>
                    <Select
                      value={data.user_id.toString()}
                      onValueChange={(value) => setData('user_id', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('projects.select_manager')} />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.user_id && <p className="text-red-500 text-sm mt-1">{errors.user_id}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client_name">{t('projects.client_name')}</Label>
                    <Input
                      id="client_name"
                      value={data.client_name}
                      onChange={(e) => setData('client_name', e.target.value)}
                    />
                    {errors.client_name && <p className="text-red-500 text-sm mt-1">{errors.client_name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">{t('projects.budget')}</Label>
                    <Input
                      id="budget"
                      type="number"
                      step="0.01"
                      min="0"
                      value={data.budget}
                      onChange={(e) => setData('budget', e.target.value)}
                    />
                    {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? t('common.creating') : t('common.create')}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
