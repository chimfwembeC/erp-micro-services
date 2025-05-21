import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useTranslation } from 'react-i18next';
import usePermissions from '@/Hooks/usePermissions';
import { showError } from '@/utils/notifications';
import axios from 'axios';

// Import dashboard components from new location
import AdminDashboard from '@/Pages/Dashboards/AdminDashboard';
import ManagerDashboard from '@/Pages/Dashboards/ManagerDashboard';
import UserDashboard from '@/Pages/Dashboards/UserDashboard';
import CustomerDashboard from '@/Pages/Dashboards/CustomerDashboard';

// Dashboard data interface
interface DashboardData {
  admin: any;
  manager: any;
  user: any;
  customer: any;
}

export default function Dashboard({ auth }: PageProps) {
  const user = auth.user;
  const { t } = useTranslation();
  const { hasRole, isAdmin } = usePermissions();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userIsAdmin = isAdmin();
  const userIsManager = hasRole('manager');
  const userIsCustomer = hasRole('customer');
  const userIsRegular = hasRole('user') && !userIsAdmin && !userIsManager && !userIsCustomer;

  console.log('userIsAdmin', userIsAdmin);
  console.log('userIsCustomer', userIsCustomer);

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        try {
          // Try to fetch data from the API endpoint
          let response;

          try {
            // First try the API endpoint
            response = await axios.get('/api/dashboard-statistics', {
              headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              withCredentials: true
            });
          } catch (apiError) {
            console.log('API endpoint failed, trying web endpoint as fallback');

            // If API endpoint fails, try the web endpoint as fallback
            response = await axios.get('/web-dashboard-statistics', {
              headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              withCredentials: true
            });
          }

          // Log the response for debugging
          console.log('API response:', response.data);

          // With axios, the data is already parsed as JSON
          setDashboardData(response.data);
          setError(null);
        } catch (axiosError: any) {
          // Handle axios errors
          console.error('Axios error:', axiosError);

          if (axiosError.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error response:', axiosError.response.status, axiosError.response.data);

            if (axiosError.response.status === 404) {
              console.warn('API endpoint not found. Using mock data instead.');
              setDashboardData(getMockDashboardData());
              return;
            }

            setError(`Server error: ${axiosError.response.status} ${axiosError.response.statusText}`);
          } else if (axiosError.request) {
            // The request was made but no response was received
            console.error('No response received:', axiosError.request);
            console.warn('Network error. Using mock data instead.');
            setDashboardData(getMockDashboardData());
            return;
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Request setup error:', axiosError.message);
            setError(`Request error: ${axiosError.message}`);
          }

          // Show error notification
          showError('Error', {
            description: `Failed to load dashboard data: ${axiosError.message}`
          });
        }
      } catch (err: any) {
        // This catches any other errors that might occur
        console.error('Unexpected error in dashboard data handling:', err);
        const errorMessage = err.message || 'Unknown error occurred';
        setError(`Failed to load dashboard data: ${errorMessage}`);
        showError('Error', {
          description: `Failed to load dashboard data: ${errorMessage}`
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Mock data function for development/fallback
  const getMockDashboardData = (): DashboardData => {
    console.log('Using mock dashboard data');
    return {
      admin: {
        summary: {
          total_users: 125,
          active_users: 78,
          new_users: 12,
          user_change_percent: 8,
          active_change_percent: 5
        },
        user_activity: [
          { name: 'Jan', users: 65, newUsers: 4 },
          { name: 'Feb', users: 72, newUsers: 6 },
          { name: 'Mar', users: 80, newUsers: 8 },
          { name: 'Apr', users: 87, newUsers: 7 },
          { name: 'May', users: 95, newUsers: 8 },
          { name: 'Jun', users: 110, newUsers: 15 },
          { name: 'Jul', users: 125, newUsers: 12 }
        ],
        role_distribution: [
          { name: 'Admin', value: 5 },
          { name: 'Manager', value: 15 },
          { name: 'User', value: 105 }
        ],
        recent_users: [
          { name: 'John Doe', email: 'john@example.com', role: 'User', created_at: '2023-07-15' },
          { name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', created_at: '2023-07-12' },
          { name: 'Bob Johnson', email: 'bob@example.com', role: 'User', created_at: '2023-07-10' },
          { name: 'Alice Brown', email: 'alice@example.com', role: 'User', created_at: '2023-07-08' }
        ],
        role_permissions: [
          { name: 'Admin', permissions: ['view_users', 'edit_users', 'delete_users', 'view_roles', 'edit_roles', 'delete_roles'] },
          { name: 'Manager', permissions: ['view_users', 'edit_users', 'view_roles'] },
          { name: 'User', permissions: ['view_profile', 'edit_profile'] }
        ]
      },
      manager: {
        team_members: [
          { name: 'John Doe', email: 'john@example.com', position: 'Developer', status: 'Active' },
          { name: 'Jane Smith', email: 'jane@example.com', position: 'Designer', status: 'Active' },
          { name: 'Bob Johnson', email: 'bob@example.com', position: 'QA Engineer', status: 'On Leave' },
          { name: 'Alice Brown', email: 'alice@example.com', position: 'Developer', status: 'Active' }
        ],
        project_status: [
          { name: 'Completed', value: 12 },
          { name: 'In Progress', value: 5 },
          { name: 'Planned', value: 3 }
        ],
        task_completion: [
          { name: 'Week 1', completed: 15, assigned: 20 },
          { name: 'Week 2', completed: 18, assigned: 22 },
          { name: 'Week 3', completed: 20, assigned: 25 },
          { name: 'Week 4', completed: 22, assigned: 24 }
        ]
      },
      user: {
        tasks: [
          { name: 'Complete project documentation', project: 'Website Redesign', deadline: '2023-07-25', status: 'In Progress', priority: 'High' },
          { name: 'Fix navigation bug', project: 'Mobile App', deadline: '2023-07-20', status: 'In Progress', priority: 'Critical' },
          { name: 'Design new logo', project: 'Branding', deadline: '2023-07-30', status: 'Not Started', priority: 'Medium' },
          { name: 'Update user profile page', project: 'Website Redesign', deadline: '2023-08-05', status: 'Not Started', priority: 'Low' }
        ]
      },
      customer: {
        stats: {
          active_services_count: 3,
          pending_tickets_count: 1,
          unpaid_invoices_count: 2,
          upcoming_renewals_count: 1
        },
        services: [
          {
            id: 1,
            name: 'Cloud Server Hosting',
            type: 'Infrastructure',
            status: 'Active',
            next_renewal: '2023-08-15',
            usage: 78
          },
          {
            id: 2,
            name: 'Database Management',
            type: 'Database',
            status: 'Active',
            next_renewal: '2023-09-22',
            usage: 45
          },
          {
            id: 3,
            name: 'Web Application Firewall',
            type: 'Security',
            status: 'Active',
            next_renewal: '2023-07-30',
            usage: 92
          },
          {
            id: 4,
            name: 'Content Delivery Network',
            type: 'Network',
            status: 'Pending Setup',
            next_renewal: '2023-10-15',
            usage: 0
          }
        ],
        orders: [
          {
            id: 'ORD-2023-001',
            date: '2023-06-15',
            items: 'Cloud Server Upgrade',
            total: '$129.99',
            status: 'Completed'
          },
          {
            id: 'ORD-2023-002',
            date: '2023-06-28',
            items: 'SSL Certificate Renewal',
            total: '$79.99',
            status: 'Processing'
          },
          {
            id: 'ORD-2023-003',
            date: '2023-07-10',
            items: 'Database Backup Service',
            total: '$49.99',
            status: 'Pending'
          }
        ],
        invoices: [
          {
            id: 'INV-2023-001',
            date: '2023-06-15',
            due_date: '2023-07-15',
            amount: '$129.99',
            status: 'Paid'
          },
          {
            id: 'INV-2023-002',
            date: '2023-06-28',
            due_date: '2023-07-28',
            amount: '$79.99',
            status: 'Unpaid'
          },
          {
            id: 'INV-2023-003',
            date: '2023-07-10',
            due_date: '2023-08-10',
            amount: '$49.99',
            status: 'Unpaid'
          }
        ],
        support_tickets: [
          {
            id: 'TKT-2023-001',
            date: '2023-06-20',
            subject: 'Server Connection Issue',
            priority: 'High',
            status: 'Open'
          },
          {
            id: 'TKT-2023-002',
            date: '2023-06-25',
            subject: 'Billing Question',
            priority: 'Medium',
            status: 'Closed'
          },
          {
            id: 'TKT-2023-003',
            date: '2023-07-05',
            subject: 'Website Performance',
            priority: 'Low',
            status: 'In Progress'
          }
        ]
      }
    };
  };

  return (
    <AppLayout
      title={t('common.dashboard')}
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {t('common.dashboard')}
        </h2>
      )}
    >
      <Head title={t('common.dashboard')} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">{t('dashboard.welcome', { name: user?.name })}</h1>

            <>
              {/* Admin Dashboard */}
              {userIsAdmin && (
                <AdminDashboard
                  user={user}
                  data={dashboardData?.admin || {
                    summary: { total_users: 0, active_users: 0, new_users: 0, user_change_percent: 0, active_change_percent: 0 },
                    user_activity: [],
                    role_distribution: [],
                    recent_users: [],
                    role_permissions: []
                  }}
                  isLoading={loading}
                  error={error}
                />
              )}

              {/* Manager Dashboard */}
              {userIsManager && (
                <ManagerDashboard
                  user={user}
                  data={dashboardData?.manager || {
                    team_members: [],
                    project_status: [],
                    task_completion: [],
                    active_projects: [],
                    stats: {
                      team_members_count: 0,
                      active_projects_count: 0,
                      completed_tasks_count: 0,
                      week_over_week_change: '0%'
                    }
                  }}
                  isLoading={loading}
                  error={error}
                />
              )}

              {/* Regular User Dashboard */}
              {userIsRegular && (
                <UserDashboard
                  user={user}
                  data={dashboardData?.user || {
                    tasks: []
                  }}
                />
              )}

              {/* Customer Dashboard */}
              {userIsCustomer && (
                <CustomerDashboard
                  user={user}
                  data={dashboardData?.customer || {
                    stats: {
                      active_services_count: 0,
                      pending_tickets_count: 0,
                      unpaid_invoices_count: 0,
                      upcoming_renewals_count: 0
                    },
                    services: [],
                    orders: [],
                    invoices: [],
                    support_tickets: []
                  }}
                  isLoading={loading}
                  error={error}
                />
              )}
            </>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}



