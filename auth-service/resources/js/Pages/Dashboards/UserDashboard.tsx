import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface UserTask {
  name: string;
  project: string;
  deadline: string;
  status: string;
  priority: string;
}

// Regular User Dashboard Component
interface UserDashboardProps {
  user: any;
  data: {
    tasks: UserTask[];
  };
}

export default function UserDashboard({ user, data }: UserDashboardProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{t('dashboard.user.assignedTasks', 'Assigned Tasks')}</CardTitle>
            <CardDescription>{t('dashboard.user.yourTasks', 'Tasks assigned to you')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-2">2 {t('dashboard.user.dueSoon', 'due soon')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{t('dashboard.user.completedTasks', 'Completed Tasks')}</CardTitle>
            <CardDescription>{t('dashboard.user.thisWeek', 'This week')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-2">+2 {t('dashboard.fromLastWeek', 'from last week')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{t('dashboard.user.upcomingMeetings', 'Upcoming Meetings')}</CardTitle>
            <CardDescription>{t('dashboard.user.scheduled', 'Scheduled meetings')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-2">1 {t('dashboard.user.today', 'today')}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.user.yourTasks', 'Your Tasks')}</CardTitle>
          <CardDescription>{t('dashboard.user.currentTasks', 'Your current tasks and their status')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.tasks.map((task, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h3 className="font-medium">{task.name}</h3>
                  <p className="text-sm text-muted-foreground">{t('dashboard.user.project', 'Project')}: {task.project}</p>
                  <p className="text-sm text-muted-foreground">{t('dashboard.user.deadline', 'Deadline')}: {task.deadline}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                  }`}>
                    {task.status}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    task.priority === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                    task.priority === 'High' ? 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100' :
                    'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.user.accountInfo', 'Account Information')}</CardTitle>
          <CardDescription>{t('dashboard.user.yourDetails', 'Your account details')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="font-semibold">{t('users.name', 'Name')}:</span> {user?.name}
            </div>
            <div>
              <span className="font-semibold">{t('users.email', 'Email')}:</span> {user?.email}
            </div>
            <div>
              <span className="font-semibold">{t('dashboard.user.emailVerified', 'Email Verified')}:</span> {user?.email_verified_at ? t('dashboard.user.yes', 'Yes') : t('dashboard.user.no', 'No')}
            </div>
            <div>
              <span className="font-semibold">{t('dashboard.user.accountCreated', 'Account Created')}:</span> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : ''}
            </div>
            <div>
              <span className="font-semibold">{t('dashboard.user.roles', 'Roles')}:</span>
              {user?.roles && user.roles.length > 0 ? (
                <span className="ml-2">
                  {user.roles.map((role: any) => role.name).join(', ')}
                </span>
              ) : (
                <span className="ml-2 text-muted-foreground">{t('dashboard.user.noRoles', 'No roles assigned')}</span>
              )}
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" asChild>
              <a href="/profile">{t('dashboard.user.editProfile', 'Edit Profile')}</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
