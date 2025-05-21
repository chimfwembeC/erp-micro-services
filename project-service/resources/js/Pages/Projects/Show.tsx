import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/Components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Progress } from '@/Components/ui/progress';
import { CalendarIcon, ClockIcon, PlusIcon, UserIcon, PencilIcon, TrashIcon, LayoutDashboardIcon, CheckSquareIcon, KanbanIcon, PaperclipIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { toast } from 'sonner';
import FileUpload from '@/Components/FileUpload';
import AttachmentList from '@/Components/AttachmentList';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Task {
  id: number;
  title: string;
  description: string | null;
  project_id: number;
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

interface Attachment {
  id: number;
  filename: string;
  original_filename: string;
  file_path: string;
  mime_type: string;
  file_size: number;
  description: string | null;
  created_at: string;
  user: User;
  url: string;
  extension: string;
  is_image: boolean;
  is_document: boolean;
  formatted_size: string;
}

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
  user: User;
  attachments: Attachment[];
}

interface ProjectShowProps extends PageProps {
  project: Project;
  tasks: Task[];
  completionPercentage: number;
  totalEstimatedHours: number;
  totalActualHours: number;
}

export default function Show({ auth, project, tasks, completionPercentage, totalEstimatedHours, totalActualHours }: ProjectShowProps) {
  const { t } = useTranslation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  const handleDelete = () => {
    router.delete(route('projects.destroy', project.id), {
      onSuccess: () => {
        toast.success(t('projects.deleted_successfully'));
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
          {project.name}
        </h2>
      }
    >
      <Head title={project.name} />

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
                  <BreadcrumbPage>{project.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <div className="flex space-x-2">
              <Button asChild variant="outline">
                <Link href={route('projects.edit', project.id)}>
                  <PencilIcon className="mr-2 h-4 w-4" />
                  {t('common.edit')}
                </Link>
              </Button>
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <TrashIcon className="mr-2 h-4 w-4" />
                    {t('common.delete')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('common.delete')} {project.name}</DialogTitle>
                    <DialogDescription>
                      {t('projects.delete_confirmation')}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                      {t('common.cancel')}
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                      {t('common.delete')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t('projects.status')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge className={getStatusBadgeColor(project.status)}>
                    {getStatusLabel(project.status)}
                  </Badge>
                  <span className="text-sm">{completionPercentage}% {t('common.completed')}</span>
                </div>
                <Progress value={completionPercentage} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t('projects.dates')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('projects.start_date')}:</span>
                    <span className="text-sm font-medium">{formatDate(project.start_date)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('projects.end_date')}:</span>
                    <span className="text-sm font-medium">{project.end_date ? formatDate(project.end_date) : t('projects.no_end_date')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t('projects.hours')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('tasks.estimated_hours')}:</span>
                    <span className="text-sm font-medium">{totalEstimatedHours}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('tasks.actual_hours')}:</span>
                    <span className="text-sm font-medium">{totalActualHours}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">
                <LayoutDashboardIcon className="h-4 w-4 mr-2" />
                {t('projects.details')}
              </TabsTrigger>
              <TabsTrigger value="tasks">
                <CheckSquareIcon className="h-4 w-4 mr-2" />
                {t('tasks.title')}
              </TabsTrigger>
              <TabsTrigger value="attachments">
                <PaperclipIcon className="h-4 w-4 mr-2" />
                {t('attachments.title')}
              </TabsTrigger>
              <TabsTrigger value="kanban" asChild>
                <Link href={route('projects.kanban', project.id)} className="flex items-center">
                  <KanbanIcon className="h-4 w-4 mr-2" />
                  {t('tasks.kanban_board')}
                </Link>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('projects.details')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">{t('projects.description')}</h3>
                      <p className="mt-1">{project.description || t('projects.no_description')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-medium">{t('projects.manager')}</h3>
                        <div className="flex items-center mt-1">
                          <UserIcon className="mr-2 h-4 w-4 opacity-70" />
                          <span>{project.user.name}</span>
                        </div>
                      </div>

                      {project.client_name && (
                        <div>
                          <h3 className="text-lg font-medium">{t('projects.client_name')}</h3>
                          <div className="flex items-center mt-1">
                            <UserIcon className="mr-2 h-4 w-4 opacity-70" />
                            <span>{project.client_name}</span>
                          </div>
                        </div>
                      )}

                      {project.budget && (
                        <div>
                          <h3 className="text-lg font-medium">{t('projects.budget')}</h3>
                          <p className="mt-1">${project.budget.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="tasks" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{t('tasks.title')}</CardTitle>
                  <Button asChild>
                    <Link href={route('projects.tasks.create', project.id)}>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      {t('tasks.create_new')}
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {tasks.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">{t('tasks.title')}</th>
                            <th className="text-left py-3 px-4">{t('tasks.status')}</th>
                            <th className="text-left py-3 px-4">{t('tasks.priority')}</th>
                            <th className="text-left py-3 px-4">{t('tasks.assigned_to')}</th>
                            <th className="text-left py-3 px-4">{t('tasks.due_date')}</th>
                            <th className="text-left py-3 px-4">{t('common.actions')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tasks.map((task) => (
                            <tr key={task.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                              <td className="py-3 px-4">
                                <Link
                                  href={route('projects.tasks.show', [project.id, task.id])}
                                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                  {task.title}
                                </Link>
                              </td>
                              <td className="py-3 px-4">
                                <Badge className={getStatusBadgeColor(task.status)}>
                                  {task.status}
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
                                    <Link href={route('projects.tasks.show', [project.id, task.id])}>
                                      {t('common.view')}
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
                      <p className="mb-4">{t('tasks.no_tasks')}</p>
                      <Button asChild>
                        <Link href={route('projects.tasks.create', project.id)}>
                          <PlusIcon className="mr-2 h-4 w-4" />
                          {t('tasks.create_new')}
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attachments" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{t('attachments.title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FileUpload
                    uploadUrl={route('projects.attachments.store', project.id)}
                    onUploadComplete={() => router.reload()}
                    maxFiles={5}
                    maxSize={10}
                    allowedTypes={['*/*']}
                  />

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">{t('attachments.title')}</h3>
                    <AttachmentList
                      attachments={project.attachments || []}
                      onDelete={() => router.reload()}
                    />
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
