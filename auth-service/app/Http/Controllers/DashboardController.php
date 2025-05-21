<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Services\ProjectService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    /**
     * Get statistics for the main dashboard.
     */
    public function statistics(Request $request)
    {
        try {
            // Ensure the user is authenticated
            if (!$request->user()) {
                Log::warning('Unauthenticated access attempt to dashboard statistics');
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }

            // Log the authenticated user for debugging
            Log::info('Dashboard statistics accessed by user', [
                'user_id' => $request->user()->id,
                'user_email' => $request->user()->email,
                'user_roles' => $request->user()->roles->pluck('name'),
            ]);

            // Check permissions based on user role
            $adminData = $this->getAdminDashboardData();
            $managerData = $this->getManagerDashboardData($request);
            $userData = $this->getUserDashboardData();
            $customerData = $this->getCustomerDashboardData();

            return response()->json([
                'admin' => $adminData,
                'manager' => $managerData,
                'user' => $userData,
                'customer' => $customerData,
            ]);
        } catch (\Exception $e) {
            Log::error('Error generating dashboard statistics: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Failed to generate dashboard statistics',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get admin dashboard data
     *
     * @return array
     */
    private function getAdminDashboardData()
    {
        // Check if user has permission to view admin dashboard
        if (!Gate::allows('view_users') && !Gate::allows('view_roles')) {
            return $this->getEmptyAdminData();
        }

        // Get user counts with eager loading to reduce queries
        $totalUsers = User::count();

        // Get active users (users who logged in within the last 7 days)
        $activeUsers = User::where('updated_at', '>=', Carbon::now()->subDays(7))->count();

        // Get new users (registered within the last 30 days)
        $newUsers = User::where('created_at', '>=', Carbon::now()->subDays(30))->count();

        // Calculate percentage changes
        $previousMonthUsers = User::where('created_at', '>=', Carbon::now()->subDays(60))
            ->where('created_at', '<', Carbon::now()->subDays(30))
            ->count();

        $previousWeekActiveUsers = User::where('updated_at', '>=', Carbon::now()->subDays(14))
            ->where('updated_at', '<', Carbon::now()->subDays(7))
            ->count();

        $userChangePercent = $previousMonthUsers > 0
            ? round((($newUsers - $previousMonthUsers) / $previousMonthUsers) * 100, 0)
            : 0;

        $activeChangePercent = $previousWeekActiveUsers > 0
            ? round((($activeUsers - $previousWeekActiveUsers) / $previousWeekActiveUsers) * 100, 0)
            : 0;

        // Get user activity data (last 7 months) - optimize with a single query
        $userActivity = $this->getUserActivityData();

        // Get role distribution data
        $roleDistribution = $this->getRoleDistributionData();

        // Get recent users
        $recentUsers = $this->getRecentUsersData();

        // Get role permissions data
        $rolePermissions = $this->getRolePermissionsData();

        return [
            'summary' => [
                'total_users' => $totalUsers,
                'active_users' => $activeUsers,
                'new_users' => $newUsers,
                'user_change_percent' => $userChangePercent,
                'active_change_percent' => $activeChangePercent,
            ],
            'user_activity' => $userActivity,
            'role_distribution' => $roleDistribution,
            'recent_users' => $recentUsers,
            'role_permissions' => $rolePermissions,
        ];
    }

    /**
     * Get user activity data for the last 7 months
     *
     * @return array
     */
    private function getUserActivityData()
    {
        $userActivity = [];

        // Get all the data in a single query for better performance
        $monthlyActiveUsers = DB::table('users')
            ->select(
                DB::raw('MONTH(updated_at) as month'),
                DB::raw('YEAR(updated_at) as year'),
                DB::raw('COUNT(*) as active_count')
            )
            ->where('updated_at', '>=', Carbon::now()->subMonths(7))
            ->groupBy('year', 'month')
            ->get();

        $monthlyNewUsers = DB::table('users')
            ->select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('YEAR(created_at) as year'),
                DB::raw('COUNT(*) as new_count')
            )
            ->where('created_at', '>=', Carbon::now()->subMonths(7))
            ->groupBy('year', 'month')
            ->get();

        // Create a map for easy lookup
        $activeUsersMap = [];
        foreach ($monthlyActiveUsers as $item) {
            $key = $item->year . '-' . $item->month;
            $activeUsersMap[$key] = $item->active_count;
        }

        $newUsersMap = [];
        foreach ($monthlyNewUsers as $item) {
            $key = $item->year . '-' . $item->month;
            $newUsersMap[$key] = $item->new_count;
        }

        // Generate the activity data for the last 7 months
        for ($i = 6; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $monthName = $month->format('M');
            $key = $month->year . '-' . $month->month;

            $userActivity[] = [
                'name' => $monthName,
                'users' => $activeUsersMap[$key] ?? 0,
                'newUsers' => $newUsersMap[$key] ?? 0
            ];
        }

        return $userActivity;
    }

    /**
     * Get role distribution data
     *
     * @return array
     */
    private function getRoleDistributionData()
    {
        $roles = Role::withCount('users')->get();
        $totalUsers = User::count();

        return $roles->map(function ($role) use ($totalUsers) {
            $percentage = $totalUsers > 0 ? round(($role->users_count / $totalUsers) * 100, 1) : 0;

            return [
                'name' => $role->name,
                'value' => $role->users_count,
                'percentage' => $percentage,
                'description' => $role->description
            ];
        })->toArray();
    }

    /**
     * Get recent users data
     *
     * @return array
     */
    private function getRecentUsersData()
    {
        return User::with('roles')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($user) {
                return [
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->roles->first() ? $user->roles->first()->name : 'User',
                    'created_at' => $user->created_at->format('Y-m-d')
                ];
            })
            ->toArray();
    }

    /**
     * Get role permissions data
     *
     * @return array
     */
    private function getRolePermissionsData()
    {
        return Role::with(['permissions', 'users'])
            ->withCount('users')
            ->get()
            ->map(function ($role) {
                // Get the most recent users with this role (up to 5)
                $recentUsers = $role->users->sortByDesc('created_at')->take(5)->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'created_at' => $user->created_at->format('Y-m-d')
                    ];
                })->values()->toArray();

                // Group permissions by category (based on naming convention)
                $permissionsByCategory = [];
                foreach ($role->permissions as $permission) {
                    $parts = explode('_', $permission->name);
                    $category = count($parts) > 1 ? $parts[1] : 'other';

                    if (!isset($permissionsByCategory[$category])) {
                        $permissionsByCategory[$category] = [];
                    }

                    $permissionsByCategory[$category][] = [
                        'id' => $permission->id,
                        'name' => $permission->name,
                        'description' => $permission->description
                    ];
                }

                // For customer role, add placeholder for future service integrations
                $externalServiceIntegrations = [];
                if ($role->name === 'customer') {
                    $externalServiceIntegrations = [
                        'invoicing' => ['status' => 'pending', 'service' => 'Invoicing Service'],
                        'orders' => ['status' => 'pending', 'service' => 'Order Management Service'],
                        'tickets' => ['status' => 'pending', 'service' => 'Support Ticket Service']
                    ];
                }

                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'description' => $role->description,
                    'users_count' => $role->users_count,
                    'permissions' => $role->permissions->pluck('name')->toArray(),
                    'permissions_by_category' => $permissionsByCategory,
                    'recent_users' => $recentUsers,
                    'created_at' => $role->created_at ? $role->created_at->format('Y-m-d') : null,
                    'updated_at' => $role->updated_at ? $role->updated_at->format('Y-m-d') : null,
                    'external_service_integrations' => $externalServiceIntegrations
                ];
            })
            ->toArray();
    }

    /**
     * Get empty admin data structure
     *
     * @return array
     */
    private function getEmptyAdminData()
    {
        return [
            'summary' => [
                'total_users' => 0,
                'active_users' => 0,
                'new_users' => 0,
                'user_change_percent' => 0,
                'active_change_percent' => 0,
            ],
            'user_activity' => [],
            'role_distribution' => [],
            'recent_users' => [],
            'role_permissions' => [],
        ];
    }

    /**
     * Get manager dashboard data
     *
     * @param Request $request
     * @return array
     */
    private function getManagerDashboardData(Request $request = null)
    {
        // Check if user has permission to view manager dashboard
        if (!Gate::allows('view_users')) {
            return $this->getEmptyManagerData();
        }

        // Get team members (users with 'user' role)
        $teamMembers = User::whereHas('roles', function ($query) {
            $query->where('name', 'user');
        })
        ->with('roles')
        ->take(10)
        ->get()
        ->map(function ($user) {
            // Get the user's last activity time
            $lastActivity = $user->updated_at;
            $status = $lastActivity && $lastActivity->gt(Carbon::now()->subDays(7))
                ? 'Active'
                : 'Inactive';

            return [
                'name' => $user->name,
                'email' => $user->email,
                'position' => $user->roles->first() ? $user->roles->first()->name : 'User',
                'status' => $status
            ];
        })
        ->toArray();

        // Get project data from the external service
        $projectService = new ProjectService();
        $userId = $request ? $request->user()->id : auth()->id();

        try {
            // Get project statistics
            $projectStats = $projectService->getProjectStatistics($userId);
            $projectStatusData = $projectStats['project_status'] ?? [];
            $taskCompletionData = $projectStats['task_completion'] ?? [];

            // Get active projects
            $activeProjects = $projectService->getActiveProjects($userId);

            // Count statistics
            $activeProjectsCount = count($activeProjects);
            $completedTasksCount = array_sum(array_column($taskCompletionData, 'completed'));

            // Calculate week-over-week change for completed tasks (mock data for now)
            $weekOverWeekChange = '+8%';

            return [
                'team_members' => $teamMembers,
                'project_status' => $projectStatusData,
                'task_completion' => $taskCompletionData,
                'active_projects' => $activeProjects,
                'stats' => [
                    'team_members_count' => count($teamMembers),
                    'active_projects_count' => $activeProjectsCount,
                    'completed_tasks_count' => $completedTasksCount,
                    'week_over_week_change' => $weekOverWeekChange
                ]
            ];
        } catch (\Exception $e) {
            Log::error('Error getting project data for manager dashboard', [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Fallback to mock data if the service is unavailable
            return [
                'team_members' => $teamMembers,
                'project_status' => [
                    ['name' => 'In Progress', 'value' => 5],
                    ['name' => 'Completed', 'value' => 3],
                    ['name' => 'Not Started', 'value' => 2],
                ],
                'task_completion' => [
                    ['name' => 'Mon', 'completed' => 5, 'assigned' => 7],
                    ['name' => 'Tue', 'completed' => 6, 'assigned' => 8],
                    ['name' => 'Wed', 'completed' => 4, 'assigned' => 6],
                    ['name' => 'Thu', 'completed' => 7, 'assigned' => 9],
                    ['name' => 'Fri', 'completed' => 5, 'assigned' => 7],
                ],
                'active_projects' => [
                    ['name' => 'Website Redesign', 'client' => 'ABC Corp', 'deadline' => Carbon::now()->addDays(15)->format('Y-m-d'), 'progress' => 75, 'status' => 'In Progress'],
                    ['name' => 'Mobile App', 'client' => 'XYZ Inc', 'deadline' => Carbon::now()->addDays(30)->format('Y-m-d'), 'progress' => 40, 'status' => 'In Progress'],
                    ['name' => 'CRM Integration', 'client' => 'Acme Ltd', 'deadline' => Carbon::now()->addDays(10)->format('Y-m-d'), 'progress' => 90, 'status' => 'In Progress'],
                    ['name' => 'E-commerce Platform', 'client' => 'Shop Co', 'deadline' => Carbon::now()->addDays(20)->format('Y-m-d'), 'progress' => 60, 'status' => 'In Progress'],
                    ['name' => 'Analytics Dashboard', 'client' => 'Data Inc', 'deadline' => Carbon::now()->addDays(5)->format('Y-m-d'), 'progress' => 85, 'status' => 'In Progress'],
                ],
                'stats' => [
                    'team_members_count' => count($teamMembers),
                    'active_projects_count' => 5,
                    'completed_tasks_count' => 28,
                    'week_over_week_change' => '+8%'
                ]
            ];
        }
    }

    /**
     * Get empty manager data structure
     *
     * @return array
     */
    private function getEmptyManagerData()
    {
        return [
            'team_members' => [],
            'project_status' => [],
            'task_completion' => [],
            'active_projects' => [],
            'stats' => [
                'team_members_count' => 0,
                'active_projects_count' => 0,
                'completed_tasks_count' => 0,
                'week_over_week_change' => '0%'
            ]
        ];
    }

    /**
     * Get user dashboard data
     *
     * @return array
     */
    private function getUserDashboardData()
    {
        // Generate tasks based on system permissions
        $permissions = Permission::all();
        $tasks = $permissions->take(5)->map(function ($permission, $index) {
            $projects = ['User Management', 'Role System', 'Permission Framework', 'Authentication Service', 'Dashboard System'];
            $statuses = ['In Progress', 'Not Started', 'Completed'];
            $priorities = ['Low', 'Medium', 'High', 'Critical'];

            return [
                'name' => 'Implement ' . $permission->name,
                'project' => $projects[$index % count($projects)],
                'deadline' => Carbon::now()->addDays(rand(1, 14))->format('Y-m-d'),
                'status' => $statuses[rand(0, count($statuses) - 1)],
                'priority' => $priorities[rand(0, count($priorities) - 1)]
            ];
        })->toArray();

        return [
            'tasks' => $tasks,
        ];
    }

    /**
     * Get customer dashboard data
     *
     * @return array
     */
    private function getCustomerDashboardData()
    {
        // Get customer role
        $customerRole = Role::where('name', 'customer')->first();

        if (!$customerRole) {
            return $this->getEmptyCustomerData();
        }

        // Get customer users count
        $customersCount = $customerRole->users()->count();

        // Get new customers (registered within the last 30 days)
        $newCustomers = $customerRole->users()
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->count();

        // Get active customers (users who logged in within the last 7 days)
        $activeCustomers = $customerRole->users()
            ->where('updated_at', '>=', Carbon::now()->subDays(7))
            ->count();

        // Calculate percentage changes
        $previousMonthCustomers = $customerRole->users()
            ->where('created_at', '>=', Carbon::now()->subDays(60))
            ->where('created_at', '<', Carbon::now()->subDays(30))
            ->count();

        $customerChangePercent = $previousMonthCustomers > 0
            ? round((($newCustomers - $previousMonthCustomers) / $previousMonthCustomers) * 100, 0)
            : 0;

        // Get recent customers
        $recentCustomers = $customerRole->users()
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at->format('Y-m-d'),
                    'verified' => $user->email_verified_at ? true : false
                ];
            })
            ->toArray();

        // Get customer permissions
        $customerPermissions = $customerRole->permissions->map(function ($permission) {
            return [
                'id' => $permission->id,
                'name' => $permission->name,
                'description' => $permission->description
            ];
        })->toArray();

        // Mock data for services that will be integrated later
        $mockServices = [
            [
                'id' => 1,
                'name' => 'Cloud Server Hosting',
                'type' => 'Infrastructure',
                'status' => 'Active',
                'next_renewal' => Carbon::now()->addDays(30)->format('Y-m-d'),
                'usage' => 78
            ],
            [
                'id' => 2,
                'name' => 'Database Management',
                'type' => 'Database',
                'status' => 'Active',
                'next_renewal' => Carbon::now()->addDays(45)->format('Y-m-d'),
                'usage' => 45
            ],
            [
                'id' => 3,
                'name' => 'Web Application Firewall',
                'type' => 'Security',
                'status' => 'Active',
                'next_renewal' => Carbon::now()->addDays(15)->format('Y-m-d'),
                'usage' => 92
            ]
        ];

        // Mock data for future service integrations
        $pendingIntegrations = [
            'invoicing' => [
                'status' => 'pending',
                'service' => 'Invoicing Service',
                'description' => 'Will provide customer invoice data'
            ],
            'orders' => [
                'status' => 'pending',
                'service' => 'Order Management Service',
                'description' => 'Will provide customer order data'
            ],
            'tickets' => [
                'status' => 'pending',
                'service' => 'Support Ticket Service',
                'description' => 'Will provide customer support ticket data'
            ]
        ];

        return [
            'summary' => [
                'total_customers' => $customersCount,
                'active_customers' => $activeCustomers,
                'new_customers' => $newCustomers,
                'customer_change_percent' => $customerChangePercent
            ],
            'recent_customers' => $recentCustomers,
            'permissions' => $customerPermissions,
            'services' => $mockServices,
            'pending_integrations' => $pendingIntegrations,
            'stats' => [
                'active_services_count' => count($mockServices),
                'pending_tickets_count' => 1,
                'unpaid_invoices_count' => 2,
                'upcoming_renewals_count' => 1
            ]
        ];
    }

    /**
     * Get empty customer data structure
     *
     * @return array
     */
    private function getEmptyCustomerData()
    {
        return [
            'summary' => [
                'total_customers' => 0,
                'active_customers' => 0,
                'new_customers' => 0,
                'customer_change_percent' => 0
            ],
            'recent_customers' => [],
            'permissions' => [],
            'services' => [],
            'pending_integrations' => [],
            'stats' => [
                'active_services_count' => 0,
                'pending_tickets_count' => 0,
                'unpaid_invoices_count' => 0,
                'upcoming_renewals_count' => 0
            ]
        ];
    }
}
