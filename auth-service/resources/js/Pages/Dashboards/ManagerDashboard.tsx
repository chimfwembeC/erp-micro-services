import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Building, BarChart3, PieChartIcon, Users } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Chart colors
const PROJECT_STATUS_COLORS = ['#FF8042', '#0088FE', '#FFBB28'];

// Dashboard data interfaces
interface ProjectStatus {
  name: string;
  value: number;
}

interface TaskCompletion {
  name: string;
  completed: number;
  assigned: number;
}

interface TeamMember {
  name: string;
  email: string;
  position: string;
  status: string;
}

interface Project {
  name: string;
  client: string;
  deadline: string;
  progress: number;
  status: string;
}

interface Stats {
  team_members_count: number;
  active_projects_count: number;
  completed_tasks_count: number;
  week_over_week_change: string;
}

// Manager Dashboard Component
interface ManagerDashboardProps {
  user: any;
  data: {
    team_members: TeamMember[];
    project_status: ProjectStatus[];
    task_completion: TaskCompletion[];
    active_projects?: Project[];
    stats?: Stats;
  };
  isLoading?: boolean;
  error?: string | null;
}

export default function ManagerDashboard({ user, data, isLoading = false, error = null }: ManagerDashboardProps) {
  const { t } = useTranslation();

  // Get stats with defaults
  const stats = data.stats || {
    team_members_count: data.team_members?.length || 0,
    active_projects_count: data.active_projects?.length || 0,
    completed_tasks_count: 0,
    week_over_week_change: '0%'
  };

  // Get active projects with fallback
  const activeProjects = data.active_projects || [
    { name: 'No projects found', client: '-', deadline: '-', progress: 0, status: 'Not Started' }
  ];

  // Render error state
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t('dashboard.error', 'Error')}</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Render loading skeletons
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-16 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-60 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="team" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('dashboard.manager.team', 'Team Overview')}
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            {t('dashboard.manager.projects', 'Projects')}
          </TabsTrigger>
        </TabsList>

        {/* Team Overview Tab */}
        <TabsContent value="team" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{t('dashboard.manager.teamMembers', 'Team Members')}</CardTitle>
                <CardDescription>{t('dashboard.manager.totalMembers', 'Total members in your team')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stats.team_members_count}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{t('dashboard.manager.activeProjects', 'Active Projects')}</CardTitle>
                <CardDescription>{t('dashboard.manager.currentProjects', 'Currently active projects')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stats.active_projects_count}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{t('dashboard.manager.completedTasks', 'Completed Tasks')}</CardTitle>
                <CardDescription>{t('dashboard.manager.thisWeek', 'This week')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stats.completed_tasks_count}</div>
                <p className="text-xs text-muted-foreground mt-2">{stats.week_over_week_change} {t('dashboard.fromLastWeek', 'from last week')}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.manager.teamMembers', 'Team Members')}</CardTitle>
              <CardDescription>{t('dashboard.manager.managedTeam', 'Members in your managed team')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 font-medium">
                  <div>{t('users.name', 'Name')}</div>
                  <div>{t('users.email', 'Email')}</div>
                  <div>{t('dashboard.manager.position', 'Position')}</div>
                  <div>{t('dashboard.manager.status', 'Status')}</div>
                </div>
                <div className="space-y-2">
                  {data.team_members.map((member, i) => (
                    <div key={i} className="grid grid-cols-4 py-2 border-b">
                      <div>{member.name}</div>
                      <div className="text-muted-foreground">{member.email}</div>
                      <div>{member.position}</div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          member.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                          member.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {member.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  {t('dashboard.manager.projectStatus', 'Project Status')}
                </CardTitle>
                <CardDescription>{t('dashboard.manager.statusDistribution', 'Distribution of project statuses')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.project_status}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {data.project_status.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PROJECT_STATUS_COLORS[index % PROJECT_STATUS_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {t('dashboard.manager.taskCompletion', 'Task Completion')}
                </CardTitle>
                <CardDescription>{t('dashboard.manager.weeklyProgress', 'Weekly progress on tasks')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.task_completion}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="assigned" fill="#8884d8" name={t('dashboard.manager.assigned', 'Assigned')} />
                      <Bar dataKey="completed" fill="#82ca9d" name={t('dashboard.manager.completed', 'Completed')} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.manager.activeProjects', 'Active Projects')}</CardTitle>
              <CardDescription>{t('dashboard.manager.currentlyManaging', 'Projects you are currently managing')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-5 font-medium">
                  <div>{t('dashboard.manager.projectName', 'Project Name')}</div>
                  <div>{t('dashboard.manager.client', 'Client')}</div>
                  <div>{t('dashboard.manager.deadline', 'Deadline')}</div>
                  <div>{t('dashboard.manager.progress', 'Progress')}</div>
                  <div>{t('dashboard.manager.status', 'Status')}</div>
                </div>
                <div className="space-y-2">
                  {activeProjects.map((project, i) => (
                    <div key={i} className="grid grid-cols-5 py-2 border-b">
                      <div>{project.name}</div>
                      <div>{project.client}</div>
                      <div>{project.deadline}</div>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground">{project.progress}%</span>
                      </div>
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                          {project.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
