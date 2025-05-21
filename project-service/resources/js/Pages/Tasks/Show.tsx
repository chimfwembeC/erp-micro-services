import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/Components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Progress } from '@/Components/ui/progress';
import { CalendarIcon, ClockIcon, PlusIcon, UserIcon, PencilIcon, TrashIcon, PlayIcon, StopIcon, PaperclipIcon, MessageSquareIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDate, formatDateTime, formatDuration } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Textarea } from '@/Components/ui/textarea';
import { toast } from 'sonner';
import FileUpload from '@/Components/FileUpload';
import AttachmentList from '@/Components/AttachmentList';
import CommentList from '@/Components/CommentList';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Project {
  id: number;
  name: string;
}

interface TimeLog {
  id: number;
  task_id: number;
  user_id: number;
  start_time: string;
  end_time: string | null;
  duration_minutes: number;
  description: string | null;
  is_billable: boolean;
  created_at: string;
  updated_at: string;
  user: User;
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

interface Comment {
  id: number;
  content: string;
  task_id: number;
  user_id: number;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  user: User;
  replies?: Comment[];
  has_replies?: boolean;
  is_reply?: boolean;
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
  timeLogs: TimeLog[];
  attachments: Attachment[];
  comments: Comment[];
}

interface TaskShowProps extends PageProps {
  project: Project;
  task: Task;
  totalLoggedTime: number;
}

export default function Show({ auth, project, task, totalLoggedTime }: TaskShowProps) {
  const { t } = useTranslation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStopTimerDialogOpen, setIsStopTimerDialogOpen] = useState(false);
  const [hasActiveTimer, setHasActiveTimer] = useState(
    task.timeLogs.some(log => log.user_id === auth.user.id && !log.end_time)
  );

  const { data, setData, post, processing } = useForm({
    description: '',
  });

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

  const handleDelete = () => {
    router.delete(route('projects.tasks.destroy', [project.id, task.id]), {
      onSuccess: () => {
        toast.success(t('tasks.deleted_successfully'));
      },
      onError: () => {
        toast.error(t('common.error_occurred'));
      }
    });
  };

  const handleStartTimer = () => {
    router.post(route('tasks.start-timer', task.id), {}, {
      onSuccess: () => {
        toast.success(t('time_logs.timer_started'));
        setHasActiveTimer(true);
      },
      onError: () => {
        toast.error(t('common.error_occurred'));
      }
    });
  };

  const handleStopTimer = (e: React.FormEvent) => {
    e.preventDefault();

    post(route('tasks.stop-timer', task.id), {
      onSuccess: () => {
        toast.success(t('time_logs.timer_stopped'));
        setHasActiveTimer(false);
        setIsStopTimerDialogOpen(false);
        setData('description', '');
        router.reload();
      },
      onError: () => {
        toast.error(t('common.error_occurred'));
      }
    });
  };

  const getCompletionPercentage = () => {
    if (task.status === 'done') return 100;
    if (task.status === 'review') return 90;
    if (task.status === 'in_progress') return 50;
    if (task.status === 'todo') return 10;
    return 0; // backlog
  };

  return (
    <AppLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {task.title}
        </h2>
      }
    >
      <Head title={task.title} />

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
                  <BreadcrumbPage>{task.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{task.title}</h1>
            <div className="flex space-x-2">
              {hasActiveTimer ? (
                <Button variant="destructive" onClick={() => setIsStopTimerDialogOpen(true)}>
                  <StopIcon className="mr-2 h-4 w-4" />
                  {t('time_logs.stop_timer')}
                </Button>
              ) : (
                <Button onClick={handleStartTimer}>
                  <PlayIcon className="mr-2 h-4 w-4" />
                  {t('time_logs.start_timer')}
                </Button>
              )}
              <Button asChild variant="outline">
                <Link href={route('projects.tasks.edit', [project.id, task.id])}>
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
                    <DialogTitle>{t('common.delete')} {task.title}</DialogTitle>
                    <DialogDescription>
                      {t('tasks.delete_confirmation')}
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
                <CardTitle>{t('tasks.status')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge className={getStatusBadgeColor(task.status)}>
                    {getStatusLabel(task.status)}
                  </Badge>
                  <Badge className={getPriorityBadgeColor(task.priority)}>
                    {getPriorityLabel(task.priority)}
                  </Badge>
                </div>
                <div className="mt-4">
                  <span className="text-sm">{getCompletionPercentage()}% {t('common.completed')}</span>
                  <Progress value={getCompletionPercentage()} className="mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t('tasks.assignment')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('tasks.assigned_to')}:</span>
                    <span className="text-sm font-medium">
                      {task.assignedUser ? task.assignedUser.name : t('tasks.unassigned')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('tasks.created_by')}:</span>
                    <span className="text-sm font-medium">{task.creator.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('tasks.due_date')}:</span>
                    <span className="text-sm font-medium">
                      {task.due_date ? formatDate(task.due_date) : t('tasks.no_due_date')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t('tasks.hours')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('tasks.estimated_hours')}:</span>
                    <span className="text-sm font-medium">
                      {task.estimated_hours !== null ? task.estimated_hours : '-'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('tasks.actual_hours')}:</span>
                    <span className="text-sm font-medium">{task.actual_hours}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('time_logs.duration')}:</span>
                    <span className="text-sm font-medium">{formatDuration(totalLoggedTime)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">
                {t('tasks.details')}
              </TabsTrigger>
              <TabsTrigger value="comments">
                <MessageSquareIcon className="h-4 w-4 mr-2" />
                {t('comments.title')}
              </TabsTrigger>
              <TabsTrigger value="attachments">
                <PaperclipIcon className="h-4 w-4 mr-2" />
                {t('attachments.title')}
              </TabsTrigger>
              <TabsTrigger value="time-logs" asChild>
                <Link href={route('tasks.time-logs.index', task.id)}>
                  {t('time_logs.title')}
                </Link>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('tasks.details')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">{t('tasks.description')}</h3>
                      <p className="mt-1">{task.description || t('tasks.no_description')}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">{t('projects.title')}</h3>
                      <div className="flex items-center mt-1">
                        <Link
                          href={route('projects.show', project.id)}
                          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {project.name}
                        </Link>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">{t('tasks.created_at')}</h3>
                      <p className="mt-1">{formatDateTime(task.created_at)}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">{t('tasks.updated_at')}</h3>
                      <p className="mt-1">{formatDateTime(task.updated_at)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('comments.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CommentList
                    comments={task.comments || []}
                    taskId={task.id}
                    currentUserId={auth.user.id}
                    isAdmin={auth.user.roles?.some(role => role.name === 'admin')}
                    onCommentAdded={() => router.reload()}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attachments" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('attachments.title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FileUpload
                    uploadUrl={route('tasks.attachments.store', task.id)}
                    onUploadComplete={() => router.reload()}
                    maxFiles={5}
                    maxSize={10}
                    allowedTypes={['*/*']}
                  />

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">{t('attachments.title')}</h3>
                    <AttachmentList
                      attachments={task.attachments || []}
                      onDelete={() => router.reload()}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Dialog open={isStopTimerDialogOpen} onOpenChange={setIsStopTimerDialogOpen}>
            <DialogContent>
              <form onSubmit={handleStopTimer}>
                <DialogHeader>
                  <DialogTitle>{t('time_logs.stop_timer')}</DialogTitle>
                  <DialogDescription>{t('time_logs.stop_timer_description')}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Textarea
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      placeholder={t('time_logs.description')}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsStopTimerDialogOpen(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit" disabled={processing}>
                    {processing ? t('time_logs.stopping') : t('common.stop')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AppLayout>
  );
}
