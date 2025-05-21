import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/Components/ui/breadcrumb';
import { CalendarIcon, ClockIcon, PlusIcon, UserIcon, PlayIcon, StopIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDate, formatDateTime, formatDuration } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Switch } from '@/Components/ui/switch';
import { Input } from '@/Components/ui/input';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Task {
  id: number;
  title: string;
  project_id: number;
  project: {
    id: number;
    name: string;
  };
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

interface TimeLogsIndexProps extends PageProps {
  task: Task;
  timeLogs: {
    data: TimeLog[];
    links: any[];
    current_page: number;
    last_page: number;
  };
}

export default function Index({ auth, task, timeLogs }: TimeLogsIndexProps) {
  const { t } = useTranslation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isStopDialogOpen, setIsStopDialogOpen] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    start_time: new Date().toISOString().slice(0, 16),
    end_time: '',
    description: '',
    is_billable: true,
  });

  const { data: stopTimerData, setData: setStopTimerData, post: postStopTimer, processing: stopTimerProcessing } = useForm({
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    post(route('tasks.time-logs.store', task.id), {
      onSuccess: () => {
        toast.success(t('time_logs.created_successfully'));
        setIsCreateDialogOpen(false);
        reset();
      },
      onError: () => {
        toast.error(t('common.error_occurred'));
      }
    });
  };

  const handleStartTimer = () => {
    post(route('tasks.start-timer', task.id), {
      onSuccess: () => {
        toast.success(t('time_logs.timer_started'));
        setIsTimerRunning(true);
      },
      onError: () => {
        toast.error(t('common.error_occurred'));
      }
    });
  };

  const handleStopTimer = (e: React.FormEvent) => {
    e.preventDefault();
    
    postStopTimer(route('tasks.stop-timer', task.id), {
      onSuccess: () => {
        toast.success(t('time_logs.timer_stopped'));
        setIsTimerRunning(false);
        setIsStopDialogOpen(false);
        setStopTimerData('description', '');
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
          {t('time_logs.title')}
        </h2>
      }
    >
      <Head title={`${t('time_logs.title')} - ${task.title}`} />

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
                  <BreadcrumbLink href={route('projects.show', task.project_id)}>{task.project.name}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={route('projects.tasks.show', [task.project_id, task.id])}>{task.title}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{t('time_logs.title')}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{task.title} - {t('time_logs.title')}</h1>
            <div className="flex space-x-2">
              {!isTimerRunning ? (
                <Button onClick={handleStartTimer}>
                  <PlayIcon className="mr-2 h-4 w-4" />
                  {t('time_logs.start_timer')}
                </Button>
              ) : (
                <Button variant="destructive" onClick={() => setIsStopDialogOpen(true)}>
                  <StopIcon className="mr-2 h-4 w-4" />
                  {t('time_logs.stop_timer')}
                </Button>
              )}
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    {t('time_logs.add_manually')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle>{t('time_logs.add_time_log')}</DialogTitle>
                      <DialogDescription>{t('time_logs.add_time_log_description')}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="start_time">{t('time_logs.start_time')}</Label>
                          <Input
                            id="start_time"
                            type="datetime-local"
                            value={data.start_time}
                            onChange={(e) => setData('start_time', e.target.value)}
                            required
                          />
                          {errors.start_time && <p className="text-red-500 text-sm">{errors.start_time}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="end_time">{t('time_logs.end_time')}</Label>
                          <Input
                            id="end_time"
                            type="datetime-local"
                            value={data.end_time}
                            onChange={(e) => setData('end_time', e.target.value)}
                          />
                          {errors.end_time && <p className="text-red-500 text-sm">{errors.end_time}</p>}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">{t('time_logs.description')}</Label>
                        <Textarea
                          id="description"
                          value={data.description}
                          onChange={(e) => setData('description', e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_billable"
                          checked={data.is_billable}
                          onCheckedChange={(checked) => setData('is_billable', checked)}
                        />
                        <Label htmlFor="is_billable">{t('time_logs.is_billable')}</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        {t('common.cancel')}
                      </Button>
                      <Button type="submit" disabled={processing}>
                        {processing ? t('common.saving') : t('common.save')}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('time_logs.all_time_logs')}</CardTitle>
              <CardDescription>{t('time_logs.all_time_logs_description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">{t('time_logs.user')}</th>
                      <th className="text-left py-3 px-4">{t('time_logs.start_time')}</th>
                      <th className="text-left py-3 px-4">{t('time_logs.end_time')}</th>
                      <th className="text-left py-3 px-4">{t('time_logs.duration')}</th>
                      <th className="text-left py-3 px-4">{t('time_logs.description')}</th>
                      <th className="text-left py-3 px-4">{t('time_logs.is_billable')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeLogs.data.map((timeLog) => (
                      <tr key={timeLog.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-3 px-4">{timeLog.user.name}</td>
                        <td className="py-3 px-4">{formatDateTime(timeLog.start_time)}</td>
                        <td className="py-3 px-4">{timeLog.end_time ? formatDateTime(timeLog.end_time) : '-'}</td>
                        <td className="py-3 px-4">{formatDuration(timeLog.duration_minutes)}</td>
                        <td className="py-3 px-4">{timeLog.description || '-'}</td>
                        <td className="py-3 px-4">
                          <Badge variant={timeLog.is_billable ? 'default' : 'outline'}>
                            {timeLog.is_billable ? t('common.yes') : t('common.no')}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {timeLogs.data.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-gray-500">
                          {t('time_logs.no_time_logs')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Dialog open={isStopDialogOpen} onOpenChange={setIsStopDialogOpen}>
            <DialogContent>
              <form onSubmit={handleStopTimer}>
                <DialogHeader>
                  <DialogTitle>{t('time_logs.stop_timer')}</DialogTitle>
                  <DialogDescription>{t('time_logs.stop_timer_description')}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="stop_description">{t('time_logs.description')}</Label>
                    <Textarea
                      id="stop_description"
                      value={stopTimerData.description}
                      onChange={(e) => setStopTimerData('description', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsStopDialogOpen(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit" disabled={stopTimerProcessing}>
                    {stopTimerProcessing ? t('common.stopping') : t('common.stop')}
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
