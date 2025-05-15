import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, LayoutDashboard, PieChartIcon, ShieldCheck, Users } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  CartesianGrid, Legend, Line, LineChart, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// Dashboard data interfaces
interface DashboardSummary {
  total_users: number;
  active_users: number;
  new_users: number;
  user_change_percent: number;
  active_change_percent: number;
}

interface UserActivity {
  name: string;
  users: number;
  newUsers: number;
}

interface RoleDistribution {
  name: string;
  value: number;
}

interface RecentUser {
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface RolePermission {
  name: string;
  permissions: string[];
}

// Admin Dashboard Component
interface AdminDashboardProps {
  user: any;
  data: {
    summary: DashboardSummary;
    user_activity: UserActivity[];
    role_distribution: RoleDistribution[];
    recent_users: RecentUser[];
    role_permissions: RolePermission[];
  };
  isLoading?: boolean;
  error?: string | null;
}

export default function AdminDashboard({ user, data, isLoading = false, error = null }: AdminDashboardProps) {
  const { t } = useTranslation();

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-80 w-full rounded-lg" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-80 w-full rounded-lg" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            {t('dashboard.admin.overview', 'System Overview')}
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('dashboard.admin.users', 'Users')}
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            {t('dashboard.admin.roles', 'Roles')}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{t('dashboard.admin.totalUsers', 'Total Users')}</CardTitle>
                <CardDescription>{t('dashboard.admin.registeredUsers', 'Registered users in the system')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{data.summary.total_users}</div>
                <p className="text-xs text-muted-foreground mt-2">{data.summary.user_change_percent > 0 ? '+' : ''}{data.summary.user_change_percent}% {t('dashboard.fromLastMonth', 'from last month')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{t('dashboard.admin.activeUsers', 'Active Users')}</CardTitle>
                <CardDescription>{t('dashboard.admin.last7Days', 'Last 7 days')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{data.summary.active_users}</div>
                <p className="text-xs text-muted-foreground mt-2">{data.summary.active_change_percent > 0 ? '+' : ''}{data.summary.active_change_percent}% {t('dashboard.fromLastWeek', 'from last week')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{t('dashboard.admin.newUsers', 'New Users')}</CardTitle>
                <CardDescription>{t('dashboard.admin.last30Days', 'Last 30 days')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{data.summary.new_users}</div>
                <p className="text-xs text-muted-foreground mt-2">{data.summary.user_change_percent > 0 ? '+' : ''}{data.summary.user_change_percent}% {t('dashboard.fromLastMonth', 'from last month')}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  {t('dashboard.admin.userActivity', 'User Activity')}
                </CardTitle>
                <CardDescription>{t('dashboard.admin.last7Months', 'Last 7 months')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.user_activity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="newUsers" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  {t('dashboard.admin.roleDistribution', 'Role Distribution')}
                </CardTitle>
                <CardDescription>{t('dashboard.admin.usersByRole', 'Users by role')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.role_distribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {data.role_distribution.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.admin.recentUsers', 'Recent Users')}</CardTitle>
              <CardDescription>{t('dashboard.admin.newlyRegistered', 'Newly registered users')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 font-medium">
                  <div>{t('users.name', 'Name')}</div>
                  <div>{t('users.email', 'Email')}</div>
                  <div>{t('users.role', 'Role')}</div>
                  <div>{t('users.createdAt', 'Created At')}</div>
                </div>
                <div className="space-y-2">
                  {data.recent_users.map((user, i) => (
                    <div key={i} className="grid grid-cols-4 py-2 border-b">
                      <div>{user.name}</div>
                      <div className="text-muted-foreground">{user.email}</div>
                      <div>{user.role}</div>
                      <div className="text-muted-foreground">{user.created_at}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" asChild>
                  <a href="/users">{t('dashboard.admin.viewAllUsers', 'View All Users')}</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.admin.rolePermissions', 'Role Permissions')}</CardTitle>
              <CardDescription>{t('dashboard.admin.roleOverview', 'Overview of roles and their permissions')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.role_permissions.map((role, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="text-lg font-medium">{role.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permission, i) => (
                        <div key={i} className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs">{permission}</div>
                      ))}
                      {role.permissions.length === 0 && (
                        <div className="text-muted-foreground text-sm">No permissions assigned</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" asChild>
                  <a href="/roles">{t('dashboard.admin.manageRoles', 'Manage Roles')}</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
