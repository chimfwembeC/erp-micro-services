import React, { useState } from 'react';
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
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import axios from 'axios';
import { toast } from 'sonner';

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
  created_at: string;
  updated_at: string;
  user: User;
}

interface KanbanProps extends PageProps {
  project: Project;
  tasks: {
    backlog: Task[];
    todo: Task[];
    in_progress: Task[];
    review: Task[];
    done: Task[];
  };
}

export default function Kanban({ auth, project, tasks }: KanbanProps) {
  const { t } = useTranslation();
  const [columns, setColumns] = useState(tasks);
  const [loading, setLoading] = useState(false);

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

  const getColumnTitle = (columnId: string) => {
    switch (columnId) {
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
        return columnId;
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Get the task that was dragged
    const taskId = parseInt(draggableId.replace('task-', ''));
    const task = columns[source.droppableId as keyof typeof columns].find(t => t.id === taskId);

    if (!task) {
      return;
    }

    // Create a new columns object
    const newColumns = { ...columns };

    // Remove from the source column
    newColumns[source.droppableId as keyof typeof newColumns] = 
      newColumns[source.droppableId as keyof typeof newColumns].filter(t => t.id !== taskId);

    // Add to the destination column
    const updatedTask = { ...task, status: destination.droppableId };
    newColumns[destination.droppableId as keyof typeof newColumns] = [
      ...newColumns[destination.droppableId as keyof typeof newColumns],
      updatedTask
    ];

    // Update the state
    setColumns(newColumns);

    // Update the task status in the database
    setLoading(true);
    try {
      await axios.put(route('projects.tasks.update', { project: project.id, task: taskId }), {
        status: destination.droppableId,
        _method: 'PUT'
      });
      toast.success(t('tasks.status_updated'));
    } catch (error) {
      toast.error(t('common.error_occurred'));
      // Revert the state if the API call fails
      setColumns(columns);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {t('tasks.kanban_board')}
        </h2>
      }
    >
      <Head title={`${t('tasks.kanban_board')} - ${project.name}`} />

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
                  <BreadcrumbPage>{t('tasks.kanban_board')}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{project.name} - {t('tasks.kanban_board')}</h1>
            <Button asChild>
              <Link href={route('projects.tasks.create', project.id)}>
                <PlusIcon className="mr-2 h-4 w-4" />
                {t('tasks.create_new')}
              </Link>
            </Button>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto">
              {Object.keys(columns).map((columnId) => (
                <div key={columnId} className="min-w-[250px]">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex justify-between">
                        <span>{getColumnTitle(columnId)}</span>
                        <Badge>{columns[columnId as keyof typeof columns].length}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <Droppable droppableId={columnId}>
                      {(provided) => (
                        <CardContent
                          className="p-2 min-h-[500px]"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {columns[columnId as keyof typeof columns].map((task, index) => (
                            <Draggable
                              key={`task-${task.id}`}
                              draggableId={`task-${task.id}`}
                              index={index}
                            >
                              {(provided) => (
                                <Card
                                  className="mb-2 cursor-pointer"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <CardHeader className="p-3 pb-1">
                                    <CardTitle className="text-sm">
                                      <Link
                                        href={route('projects.tasks.show', [project.id, task.id])}
                                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                      >
                                        {task.title}
                                      </Link>
                                    </CardTitle>
                                    <Badge className={getPriorityBadgeColor(task.priority)}>
                                      {getPriorityLabel(task.priority)}
                                    </Badge>
                                  </CardHeader>
                                  <CardContent className="p-3 pt-1 text-xs">
                                    {task.assignedUser && (
                                      <div className="flex items-center mt-2">
                                        <UserIcon className="mr-1 h-3 w-3 opacity-70" />
                                        <span>{task.assignedUser.name}</span>
                                      </div>
                                    )}
                                    {task.due_date && (
                                      <div className="flex items-center mt-1">
                                        <CalendarIcon className="mr-1 h-3 w-3 opacity-70" />
                                        <span>{formatDate(task.due_date)}</span>
                                      </div>
                                    )}
                                    {task.estimated_hours && (
                                      <div className="flex items-center mt-1">
                                        <ClockIcon className="mr-1 h-3 w-3 opacity-70" />
                                        <span>{task.estimated_hours}h</span>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </CardContent>
                      )}
                    </Droppable>
                  </Card>
                </div>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>
    </AppLayout>
  );
}
