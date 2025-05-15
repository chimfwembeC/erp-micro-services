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
  potential: number;
}

interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  negotiation: number;
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

interface Communication {
  id: number;
  client_id: number | null;
  lead_id: number | null;
  type: string;
  subject: string;
  date: string;
  client?: {
    id: number;
    name: string;
  };
  lead?: {
    id: number;
    name: string;
  };
  created_by: {
    id: number;
    name: string;
  };
}

interface Props {
  role: string;
  clientStats: ClientStats;
  leadStats: LeadStats;
  recentClients: Client[];
  recentLeads: Lead[];
  recentCommunications: Communication[];
  unreadMessages: number;
}

export default function ManagerDashboard({
  role,
  clientStats,
  leadStats,
  recentClients,
  recentLeads,
  recentCommunications,
  unreadMessages,
}: Props) {
  const { t } = useTranslation();

  // Client status pie chart data
  const clientPieData = [
    { name: t('clients.statusActive'), value: clientStats.active },
    { name: t('clients.statusPotential'), value: clientStats.potential },
    { name: t('clients.statusOther'), value: clientStats.total - clientStats.active - clientStats.potential },
  ];

  // Lead status pie chart data
  const leadPieData = [
    { name: t('leads.statusNew'), value: leadStats.new },
    { name: t('leads.statusContacted'), value: leadStats.contacted },
    { name: t('leads.statusQualified'), value: leadStats.qualified },
    { name: t('leads.statusNegotiation'), value: leadStats.negotiation },
    { name: t('leads.statusOther'), value: leadStats.total - leadStats.new - leadStats.contacted - leadStats.qualified - leadStats.negotiation },
  ];

  // Colors for pie charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <AppLayout
      title={t('dashboard.title')}
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {t('dashboard.title')} - {t('dashboard.managerView')}
        </h2>
      )}
    >
      <Head title={t('dashboard.title')} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
          </div>

          {/* Recent Communications */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('dashboard.recentCommunications')}</CardTitle>
              <CardDescription>{t('dashboard.recentCommunicationsDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCommunications.map(communication => (
                  <div key={communication.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">{communication.subject}</div>
                      <div className="text-sm text-muted-foreground">
                        {communication.type} - {communication.client 
                          ? `${t('common.client')}: ${communication.client.name}` 
                          : `${t('common.lead')}: ${communication.lead?.name}`}
                      </div>
                    </div>
                    <div className="text-sm">
                      {new Date(communication.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
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
