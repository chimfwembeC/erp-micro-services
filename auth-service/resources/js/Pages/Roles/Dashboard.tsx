import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps, AppRole, Permission } from '@/types';
import useRoute from '@/Hooks/useRoute';
import usePermissions from '@/Hooks/usePermissions';
import BreadcrumbWrapper from '@/Components/BreadcrumbWrapper';
import { showError } from '@/utils/notifications';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Badge
} from '@/components/ui/badge';
import {
  Skeleton
} from '@/components/ui/skeleton';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  ShieldCheck,
  Lock,
  Info,
  Users,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Clock,
  CheckCircle,
  User,
  Percent
} from 'lucide-react';

interface RoleStatistics {
  id: number;
  name: string;
  description: string | null;
  users_count: number;
  permissions_count: number;
  percentage_of_users: number;
  last_modified: string;
  common_permissions: { id: number; name: string }[];
  created_at: string;
  updated_at: string;
}

interface RoleDistribution {
  name: string;
  value: number;
}

interface PermissionUsage {
  name: string;
  value: number;
}

interface RolesDashboardStats {
  summary: {
    total_roles: number;
    total_permissions: number;
    total_users: number;
  };
  roles: RoleStatistics[];
  role_distribution: RoleDistribution[];
  permission_usage: PermissionUsage[];
}

interface RolesDashboardProps extends PageProps {
  roles?: AppRole[];
}

// Chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1'];

export default function RolesDashboard({ auth }: RolesDashboardProps) {
  const route = useRoute();
  const { hasPermission } = usePermissions();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [stats, setStats] = useState<RolesDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Check if user has permission to view roles
  const canViewRoles = hasPermission('view_roles');
  const canEditRoles = hasPermission('edit_roles');
  const canCreateRoles = hasPermission('create_roles');
  const canDeleteRoles = hasPermission('delete_roles');

  useEffect(() => {
    // Fetch roles data from the API
    const fetchRoles = async () => {
      try {
        setLoading(true);

        let response;

        try {
          // First try the API endpoint with Axios
          response = await axios.get('/api/roles', {
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            withCredentials: true
          });

          console.log('API response for roles:', response.data);

        } catch (apiError) {
          console.log('API endpoint failed, trying web endpoint as fallback');

          // If API endpoint fails, try the web endpoint as fallback
          response = await axios.get('/web-roles', {
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            withCredentials: true
          });

          console.log('Web fallback response for roles:', response.data);
        }

        // With axios, the data is already parsed as JSON
        setRoles(response.data);
        setError(null);

      } catch (err) {
        console.error('Error fetching roles:', err);
        setError('Failed to load roles. Please try again later.');
        showError('Error', {
          description: 'Failed to load roles data. Please try again later.'
        });
      } finally {
        setLoading(false);
      }
    };

    // Fetch role statistics
    const fetchRoleStats = async () => {
      try {
        setStatsLoading(true);

        let response;

        try {
          // First try the API endpoint with Axios
          response = await axios.get('/api/roles-statistics', {
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            withCredentials: true
          });

          console.log('API response for roles statistics:', response.data);

        } catch (apiError) {
          console.log('API endpoint failed, trying web endpoint as fallback');

          // If API endpoint fails, try the web endpoint as fallback
          response = await axios.get('/web-roles-statistics', {
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            withCredentials: true
          });

          console.log('Web fallback response for roles statistics:', response.data);
        }

        // With axios, the data is already parsed as JSON
        setStats(response.data);
        setStatsError(null);

      } catch (err) {
        console.error('Error fetching role statistics:', err);
        setStatsError('Failed to load role statistics. Please try again later.');
        // Don't show error notification for stats to avoid multiple notifications
      } finally {
        setStatsLoading(false);
      }
    };

    if (canViewRoles) {
      fetchRoles();
      fetchRoleStats();
    } else {
      setError('You do not have permission to view roles.');
      setStatsError('You do not have permission to view role statistics.');
      setLoading(false);
      setStatsLoading(false);
    }
  }, [canViewRoles]);

  // Group permissions by category
  const groupPermissionsByCategory = (permissions: Permission[]) => {
    return permissions.reduce((groups, permission) => {
      const category = permission.name.split('_')[0];
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
      return groups;
    }, {} as Record<string, Permission[]>);
  };

  // Get permission category color
  const getPermissionCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      view: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      create: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      edit: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      delete: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      assign: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      manage: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    };

    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  // Render statistics skeleton
  const renderStatsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-24 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Render charts skeleton
  const renderChartsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/2 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full rounded-lg" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/2 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full rounded-lg" />
        </CardContent>
      </Card>
    </div>
  );

  // Render statistics
  const renderStats = () => {
    if (!stats) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Total Roles
            </CardTitle>
            <CardDescription>System roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.summary.total_roles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Each with unique permissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Total Permissions
            </CardTitle>
            <CardDescription>Access controls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.summary.total_permissions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Distributed across roles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Total Users
            </CardTitle>
            <CardDescription>System users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.summary.total_users}</div>
            <p className="text-xs text-muted-foreground mt-1">
              With assigned roles
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render charts
  const renderCharts = () => {
    if (!stats) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Role Distribution
            </CardTitle>
            <CardDescription>Users by role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.role_distribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.role_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
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
              Most Used Permissions
            </CardTitle>
            <CardDescription>Permissions by usage frequency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.permission_usage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={false} />
                  <YAxis />
                  <Tooltip formatter={(value, name, props) => [`${value} roles`, props.payload.name]} />
                  <Legend />
                  <Bar dataKey="value" name="Roles Count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render role metrics
  const renderRoleMetrics = () => {
    if (!stats) return null;

    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Role Usage Metrics</h2>
        <div className="grid grid-cols-1 gap-4">
          {stats.roles.map(role => (
            <Card key={role.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5" />
                      {role.name}
                    </CardTitle>
                    <CardDescription>
                      {role.description || 'No description provided'}
                    </CardDescription>
                  </div>
                  <Badge className="ml-2" variant={role.users_count > 0 ? "default" : "outline"}>
                    {role.users_count} {role.users_count === 1 ? 'user' : 'users'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium flex items-center gap-1">
                      <Percent className="h-4 w-4" />
                      User Distribution
                    </div>
                    <div className="text-2xl font-bold">{role.percentage_of_users}%</div>
                    <p className="text-xs text-muted-foreground">of total users</p>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium flex items-center gap-1">
                      <Lock className="h-4 w-4" />
                      Permissions
                    </div>
                    <div className="text-2xl font-bold">{role.permissions_count}</div>
                    <p className="text-xs text-muted-foreground">assigned to this role</p>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Last Modified
                    </div>
                    <div className="text-md font-medium">
                      {new Date(role.last_modified).toLocaleDateString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(role.last_modified).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {role.common_permissions.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-2">Most Common Permissions</div>
                    <div className="flex flex-wrap gap-2">
                      {role.common_permissions.map(permission => (
                        <Badge key={permission.id} variant="outline">
                          {permission.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-muted/30 flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Created: {new Date(role.created_at).toLocaleDateString()}
                </div>
                <div className="space-x-2">
                  <Link href={route('roles.show', role.id)}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                  {canEditRoles && role.name !== 'admin' && (
                    <Link href={route('roles.edit', role.id)}>
                      <Button size="sm">
                        Edit Role
                      </Button>
                    </Link>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // Render loading skeleton
  const renderSkeleton = () => (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Render error state
  const renderError = () => (
    <Card className="border-red-300 dark:border-red-700">
      <CardHeader>
        <CardTitle className="flex items-center text-red-600 dark:text-red-400">
          <AlertCircle className="mr-2 h-5 w-5" />
          Error Loading Roles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{error}</p>
        {canViewRoles && (
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <AppLayout
      title="Roles Dashboard"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Roles Dashboard
        </h2>
      )}
    >
      <Head title="Roles Dashboard" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <BreadcrumbWrapper
            items={[
              { label: 'Dashboard', href: route('dashboard') },
              { label: 'Roles Dashboard', href: route('roles.dashboard') },
            ]}
          />

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6 mt-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold">User Roles Overview</h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Manage and view all roles and their associated permissions
                </p>
              </div>
              {canCreateRoles && (
                <Link href={route('roles.create')}>
                  <Button className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Create New Role
                  </Button>
                </Link>
              )}
            </div>

            {/* Statistics Section */}
            {statsLoading ? (
              renderStatsSkeleton()
            ) : statsError ? (
              <Card className="mb-6 border-red-300 dark:border-red-700">
                <CardContent className="p-4">
                  <p className="text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {statsError}
                  </p>
                </CardContent>
              </Card>
            ) : (
              renderStats()
            )}

            {/* Charts Section */}
            {statsLoading ? (
              renderChartsSkeleton()
            ) : !statsError && (
              renderCharts()
            )}

            {/* Role Metrics Section */}
            {statsLoading ? (
              renderSkeleton()
            ) : !statsError && (
              renderRoleMetrics()
            )}

            {/* Roles List Section */}
            <Tabs defaultValue="cards" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="cards">Card View</TabsTrigger>
                <TabsTrigger value="table">Table View</TabsTrigger>
              </TabsList>

              {loading ? (
                renderSkeleton()
              ) : error ? (
                renderError()
              ) : (
                <>
                  <TabsContent value="cards" className="space-y-6">
                    {roles.map((role) => {
                      const groupedPermissions = groupPermissionsByCategory(role.permissions || []);

                      return (
                        <Card key={role.id} className="overflow-hidden">
                          <CardHeader className="bg-muted/50">
                            <CardTitle className="flex items-center gap-2">
                              <ShieldCheck className="h-5 w-5" />
                              {role.name}
                            </CardTitle>
                            <CardDescription>
                              {role.description || 'No description provided'}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <h3 className="text-sm font-medium mb-2 flex items-center">
                              <Lock className="h-4 w-4 mr-1" />
                              Permissions ({role.permissions?.length || 0})
                            </h3>

                            {Object.entries(groupedPermissions).length > 0 ? (
                              <div className="space-y-4">
                                {Object.entries(groupedPermissions).map(([category, permissions]) => (
                                  <div key={category} className="space-y-2">
                                    <h4 className="text-xs font-semibold uppercase text-muted-foreground">
                                      {category}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {permissions.map((permission) => (
                                        <HoverCard key={permission.id}>
                                          <HoverCardTrigger>
                                            <Badge
                                              variant="outline"
                                              className={`cursor-help ${getPermissionCategoryColor(category)}`}
                                            >
                                              {permission.name}
                                            </Badge>
                                          </HoverCardTrigger>
                                          <HoverCardContent className="w-80">
                                            <div className="space-y-1">
                                              <h4 className="text-sm font-semibold">{permission.name}</h4>
                                              <p className="text-sm">
                                                {permission.description || 'No description available'}
                                              </p>
                                            </div>
                                          </HoverCardContent>
                                        </HoverCard>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">No permissions assigned to this role.</p>
                            )}
                          </CardContent>
                          <CardFooter className="bg-muted/30 flex justify-between">
                            <div className="text-sm text-muted-foreground">
                              Created: {new Date(role.created_at).toLocaleDateString()}
                            </div>
                            <div className="space-x-2">
                              <Link href={route('roles.show', role.id)}>
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </Link>
                              {canEditRoles && role.name !== 'admin' && (
                                <Link href={route('roles.edit', role.id)}>
                                  <Button size="sm">
                                    Edit Role
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </TabsContent>

                  <TabsContent value="table">
                    <Card>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Role Name</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Permissions</TableHead>
                              <TableHead>Created</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {roles.map((role) => (
                              <TableRow key={role.id}>
                                <TableCell className="font-medium">{role.name}</TableCell>
                                <TableCell>{role.description || 'No description'}</TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1 max-w-md">
                                    {role.permissions && role.permissions.length > 0 ? (
                                      role.permissions.slice(0, 5).map((permission) => (
                                        <Badge key={permission.id} variant="outline" className="text-xs">
                                          {permission.name}
                                        </Badge>
                                      ))
                                    ) : (
                                      <span className="text-muted-foreground text-xs">No permissions</span>
                                    )}
                                    {role.permissions && role.permissions.length > 5 && (
                                      <Badge variant="outline" className="bg-muted text-xs">
                                        +{role.permissions.length - 5} more
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>{new Date(role.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Link href={route('roles.show', role.id)}>
                                      <Button variant="outline" size="sm">View</Button>
                                    </Link>
                                    {canEditRoles && role.name !== 'admin' && (
                                      <Link href={route('roles.edit', role.id)}>
                                        <Button size="sm">Edit</Button>
                                      </Link>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
