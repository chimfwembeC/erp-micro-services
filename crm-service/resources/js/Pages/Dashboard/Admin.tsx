import React from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface ClientStats {
  total: number;
  active: number;
  inactive: number;
  potential: number;
  former: number;
}

interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  unqualified: number;
  negotiation: number;
  won: number;
  lost: number;
}

interface CommunicationStats {
  total: number;
  email: number;
  call: number;
  meeting: number;
  note: number;
  other: number;
}

interface MonthlyData {
  month: number;
  year: number;
  count: number;
}

interface Client {
  id: number;
  name: string;
  email: string;
  status: string;
  created_at: string;
}

interface Lead {
  id: number;
  name: string;
  email: string;
  status: string;
  created_at: string;
}

interface Props {
  role: string;
  clientStats: ClientStats;
  leadStats: LeadStats;
  communicationStats: CommunicationStats;
  clientsByMonth: MonthlyData[];
  leadsByMonth: MonthlyData[];
  leadConversionRate: number;
  recentClients: Client[];
  recentLeads: Lead[];
  unreadMessages: number;
}

export default function AdminDashboard({
  role,
  clientStats,
  leadStats,
  communicationStats,
  clientsByMonth,
  leadsByMonth,
  leadConversionRate,
  recentClients,
  recentLeads,
  unreadMessages,
}: Props) {
  const { t } = useTranslation();

  // Format monthly data for charts
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const clientChartData = clientsByMonth.map(item => ({
    name: monthNames[item.month - 1],
    clients: item.count,
  }));

  const leadChartData = leadsByMonth.map(item => ({
    name: monthNames[item.month - 1],
    leads: item.count,
  }));

  // Client status pie chart data
  const clientPieData = [
    { name: t('clients.statusActive'), value: clientStats.active },
    { name: t('clients.statusInactive'), value: clientStats.inactive },
    { name: t('clients.statusPotential'), value: clientStats.potential },
    { name: t('clients.statusFormer'), value: clientStats.former },
  ];

  // Lead status pie chart data
  const leadPieData = [
    { name: t('leads.statusNew'), value: leadStats.new },
    { name: t('leads.statusContacted'), value: leadStats.contacted },
    { name: t('leads.statusQualified'), value: leadStats.qualified },
    { name: t('leads.statusUnqualified'), value: leadStats.unqualified },
    { name: t('leads.statusNegotiation'), value: leadStats.negotiation },
    { name: t('leads.statusWon'), value: leadStats.won },
    { name: t('leads.statusLost'), value: leadStats.lost },
  ];

  // Communication type pie chart data
  const communicationPieData = [
    { name: t('communications.typeEmail'), value: communicationStats.email },
    { name: t('communications.typeCall'), value: communicationStats.call },
    { name: t('communications.typeMeeting'), value: communicationStats.meeting },
    { name: t('communications.typeNote'), value: communicationStats.note },
    { name: t('communications.typeOther'), value: communicationStats.other },
  ];

  // Colors for pie charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#6B8E23'];

  return (
    <AppLayout
      title={t('dashboard.title')}
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {t('dashboard.title')} - {t('dashboard.adminView')}
        </h2>
      )}
    >
      <Head title={t('dashboard.title')} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t('dashboard.clientStats')}</CardTitle>
                <CardDescription>{t('dashboard.totalClients')}: {clientStats.total}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={clientPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {clientPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t('dashboard.leadStats')}</CardTitle>
                <CardDescription>{t('dashboard.totalLeads')}: {leadStats.total}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leadPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {leadPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t('dashboard.communicationStats')}</CardTitle>
                <CardDescription>{t('dashboard.totalCommunications')}: {communicationStats.total}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={communicationPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {communicationPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Acquisition Charts */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('dashboard.monthlyAcquisition')}</CardTitle>
              <CardDescription>{t('dashboard.acquisitionDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[...clientChartData, ...leadChartData]}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="clients" fill="#0088FE" name={t('dashboard.clients')} />
                    <Bar dataKey="leads" fill="#00C49F" name={t('dashboard.leads')} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Lead Conversion Rate */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('dashboard.leadConversionRate')}</CardTitle>
              <CardDescription>{t('dashboard.conversionRateDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-center py-8">
                {leadConversionRate.toFixed(2)}%
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Tabs defaultValue="clients" className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="clients">{t('dashboard.recentClients')}</TabsTrigger>
              <TabsTrigger value="leads">{t('dashboard.recentLeads')}</TabsTrigger>
            </TabsList>
            <TabsContent value="clients">
              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.recentClients')}</CardTitle>
                  <CardDescription>{t('dashboard.recentClientsDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentClients.map(client => (
                      <div key={client.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-muted-foreground">{client.email}</div>
                        </div>
                        <div className="text-sm">
                          {new Date(client.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="leads">
              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.recentLeads')}</CardTitle>
                  <CardDescription>{t('dashboard.recentLeadsDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentLeads.map(lead => (
                      <div key={lead.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-sm text-muted-foreground">{lead.email}</div>
                        </div>
                        <div className="text-sm">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
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
