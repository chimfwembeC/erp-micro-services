import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Pagination } from '@/Components/ui/pagination';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/Components/ui/breadcrumb';
import { CalendarIcon, ClockIcon, PlusIcon, UserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/lib/utils';

interface Project {
  id: number;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  status: 'not_started' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  user_id: number;
  client_name: string | null;
  budget: number | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface ProjectsIndexProps extends PageProps {
  projects: {
    data: Project[];
    links: any[];
    current_page: number;
    last_page: number;
  };
}

export default function Index({ auth, projects }: ProjectsIndexProps) {
  const { t } = useTranslation();

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'bg-gray-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'on_hold':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'not_started':
        return t('projects.status.not_started');
      case 'in_progress':
        return t('projects.status.in_progress');
      case 'on_hold':
        return t('projects.status.on_hold');
      case 'completed':
        return t('projects.status.completed');
      case 'cancelled':
        return t('projects.status.cancelled');
      default:
        return status;
    }
  };

  return (
    <AppLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {t('projects.title')}
        </h2>
      }
    >
      <Head title={t('projects.title')} />

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
                  <BreadcrumbPage>{t('projects.title')}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{t('projects.all_projects')}</h1>
            <Button asChild>
              <Link href={route('projects.create')}>
                <PlusIcon className="mr-2 h-4 w-4" />
                {t('projects.create_new')}
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.data.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">
                      <Link
                        href={route('projects.show', project.id)}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {project.name}
                      </Link>
                    </CardTitle>
                    <Badge className={getStatusBadgeColor(project.status)}>
                      {getStatusLabel(project.status)}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {project.description || t('projects.no_description')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <UserIcon className="mr-2 h-4 w-4 opacity-70" />
                      <span>{project.user.name}</span>
                    </div>
                    {project.client_name && (
                      <div className="flex items-center">
                        <UserIcon className="mr-2 h-4 w-4 opacity-70" />
                        <span>{project.client_name}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                      <span>
                        {formatDate(project.start_date)} - {project.end_date ? formatDate(project.end_date) : t('projects.no_end_date')}
                      </span>
                    </div>
                    {project.budget && (
                      <div className="flex items-center">
                        <span className="font-semibold">{t('projects.budget')}:</span>
                        <span className="ml-2">${project.budget.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-2 flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href={route('projects.show', project.id)}>
                      {t('common.view')}
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={route('projects.tasks.index', project.id)}>
                      {t('tasks.view_tasks')}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {projects.data.length === 0 && (
            <Card className="mt-6">
              <CardContent className="pt-6 text-center">
                <p className="mb-4">{t('projects.no_projects')}</p>
                <Button asChild>
                  <Link href={route('projects.create')}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    {t('projects.create_new')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {projects.last_page > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={projects.current_page}
                totalPages={projects.last_page}
                onPageChange={(page) => router.visit(route('projects.index', { page }))}
              />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
