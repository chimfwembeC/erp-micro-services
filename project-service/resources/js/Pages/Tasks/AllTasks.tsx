import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/Components/ui/breadcrumb';
import { CalendarIcon, ClockIcon, PlusIcon, UserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/lib/utils';
import { Pagination } from '@/Components/ui/pagination';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Project {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
  description: string | null;
  project_id: number;
  project: Project;
  assigned_to: number | null;
  created_by: number;
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string | null;
  estimated_hours: number | null;
  actual_hours: number;
  created_at: string;
  updated_at: string;
  assignedUser: User | null;
  creator: User;
}

interface AllTasksProps extends PageProps {
  tasks: {
    data: Task[];
    links: any[];
    current_page: number;
    last_page: number;
  };
}

export default function AllTasks({ auth, tasks }: AllTasksProps) {
  const { t } = useTranslation();

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'backlog':
        return 'bg-gray-500';
      case 'todo':
        return 'bg-blue-500';
      case 'in_progress':
        return 'bg-yellow-500';
      case 'review':
        return 'bg-purple-500';
      case 'done':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'backlog':
        return t('tasks.status.backlog');
      case 'todo':
        return t('tasks.status.todo');
      case 'in_progress':
        return t('tasks.status.in_progress');
      case 'review':
        return t('tasks.status.review');
      case 'done':
        return t('tasks.status.done');
      default:
        return status;
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-500';
      case 'medium':
        return 'bg-blue-500';
      case 'high':
        return 'bg-yellow-500';
      case 'urgent':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low':
        return t('tasks.priority.low');
      case 'medium':
        return t('tasks.priority.medium');
      case 'high':
        return t('tasks.priority.high');
      case 'urgent':
        return t('tasks.priority.urgent');
      default:
        return priority;
    }
  };

  return (
    <AppLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {t('tasks.all_tasks')}
        </h2>
      }
    >
      <Head title={t('tasks.all_tasks')} />

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
                  <BreadcrumbPage>{t('tasks.all_tasks')}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{t('tasks.all_tasks')}</h1>
            <div className="flex space-x-2">
              <Button asChild variant="outline">
                <Link href={route('tasks.my-tasks')}>
                  {t('tasks.my_tasks')}
                </Link>
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('tasks.all_tasks')}</CardTitle>
              <CardDescription>{t('tasks.all_tasks_description')}</CardDescription>
            </CardHeader>
            <CardContent>
              {tasks.data.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">{t('tasks.title')}</th>
                        <th className="text-left py-3 px-4">{t('projects.title')}</th>
                        <th className="text-left py-3 px-4">{t('tasks.status')}</th>
                        <th className="text-left py-3 px-4">{t('tasks.priority')}</th>
                        <th className="text-left py-3 px-4">{t('tasks.assigned_to')}</th>
                        <th className="text-left py-3 px-4">{t('tasks.due_date')}</th>
                        <th className="text-left py-3 px-4">{t('common.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.data.map((task) => (
                        <tr key={task.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3 px-4">
                            <Link
                              href={route('projects.tasks.show', [task.project_id, task.id])}
                              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              {task.title}
                            </Link>
                          </td>
                          <td className="py-3 px-4">
                            <Link
                              href={route('projects.show', task.project_id)}
                              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              {task.project.name}
                            </Link>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusBadgeColor(task.status)}>
                              {getStatusLabel(task.status)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getPriorityBadgeColor(task.priority)}>
                              {getPriorityLabel(task.priority)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            {task.assignedUser ? task.assignedUser.name : '-'}
                          </td>
                          <td className="py-3 px-4">
                            {task.due_date ? formatDate(task.due_date) : '-'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button asChild size="sm" variant="outline">
                                <Link href={route('projects.tasks.show', [task.project_id, task.id])}>
                                  {t('common.view')}
                                </Link>
                              </Button>
                              <Button asChild size="sm" variant="outline">
                                <Link href={route('tasks.time-logs.index', task.id)}>
                                  {t('time_logs.title')}
                                </Link>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p>{t('tasks.no_tasks')}</p>
                </div>
              )}
            </CardContent>
            {tasks.last_page > 1 && (
              <CardFooter>
                <Pagination
                  currentPage={tasks.current_page}
                  totalPages={tasks.last_page}
                  onPageChange={(page) => router.visit(route('tasks.index', { page }))}
                />
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
