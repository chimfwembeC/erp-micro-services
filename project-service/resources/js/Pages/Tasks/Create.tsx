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

interface Project {
  id: number;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  status: string;
  user_id: number;
  client_name: string | null;
  budget: number | null;
}

interface StatusOption {
  value: string;
  label: string;
}

interface PriorityOption {
  value: string;
  label: string;
}

interface CreateTaskProps extends PageProps {
  project: Project;
  users: User[];
  statuses: StatusOption[];
  priorities: PriorityOption[];
}

export default function Create({ auth, project, users, statuses, priorities }: CreateTaskProps) {
  const { t } = useTranslation();
  
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    description: '',
    assigned_to: '',
    status: 'backlog',
    priority: 'medium',
    due_date: '',
    estimated_hours: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    post(route('projects.tasks.store', project.id), {
      onSuccess: () => {
        toast.success(t('tasks.created_successfully'));
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
          {t('tasks.create_new')} - {project.name}
        </h2>
      }
    >
      <Head title={`${t('tasks.create_new')} - ${project.name}`} />

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
                  <BreadcrumbLink href={route('projects.show', project.id)}>{project.name}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={route('projects.tasks.index', project.id)}>{t('tasks.title')}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{t('tasks.create_new')}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('tasks.create_new')}</CardTitle>
              <CardDescription>{t('tasks.create_description')}</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t('tasks.title')}</Label>
                  <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    required
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t('tasks.description')}</Label>
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
                    <Label htmlFor="status">{t('tasks.status')}</Label>
                    <Select
                      value={data.status}
                      onValueChange={(value) => setData('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('tasks.select_status')} />
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
                    <Label htmlFor="priority">{t('tasks.priority')}</Label>
                    <Select
                      value={data.priority}
                      onValueChange={(value) => setData('priority', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('tasks.select_priority')} />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            {priority.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assigned_to">{t('tasks.assigned_to')}</Label>
                    <Select
                      value={data.assigned_to}
                      onValueChange={(value) => setData('assigned_to', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('tasks.select_assignee')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">
                          {t('tasks.unassigned')}
                        </SelectItem>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.assigned_to && <p className="text-red-500 text-sm mt-1">{errors.assigned_to}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="due_date">{t('tasks.due_date')}</Label>
                    <Input
                      id="due_date"
                      type="date"
                      value={data.due_date}
                      onChange={(e) => setData('due_date', e.target.value)}
                    />
                    {errors.due_date && <p className="text-red-500 text-sm mt-1">{errors.due_date}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimated_hours">{t('tasks.estimated_hours')}</Label>
                  <Input
                    id="estimated_hours"
                    type="number"
                    min="0"
                    step="1"
                    value={data.estimated_hours}
                    onChange={(e) => setData('estimated_hours', e.target.value)}
                  />
                  {errors.estimated_hours && <p className="text-red-500 text-sm mt-1">{errors.estimated_hours}</p>}
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
