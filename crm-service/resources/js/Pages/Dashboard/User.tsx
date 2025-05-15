import React from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: string;
  created_at: string;
}

interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
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
}

interface Props {
  role: string;
  assignedClients: Client[];
  assignedLeads: Lead[];
  recentCommunications: Communication[];
  recentClients: Client[];
  recentLeads: Lead[];
  unreadMessages: number;
}

export default function UserDashboard({
  role,
  assignedClients,
  assignedLeads,
  recentCommunications,
  recentClients,
  recentLeads,
  unreadMessages,
}: Props) {
  const { t } = useTranslation();

  // Helper function to get status badge
  const getClientStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">{t('clients.statusActive')}</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500">{t('clients.statusInactive')}</Badge>;
      case 'potential':
        return <Badge className="bg-blue-500">{t('clients.statusPotential')}</Badge>;
      case 'former':
        return <Badge className="bg-red-500">{t('clients.statusFormer')}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getLeadStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500">{t('leads.statusNew')}</Badge>;
      case 'contacted':
        return <Badge className="bg-purple-500">{t('leads.statusContacted')}</Badge>;
      case 'qualified':
        return <Badge className="bg-green-500">{t('leads.statusQualified')}</Badge>;
      case 'unqualified':
        return <Badge className="bg-red-500">{t('leads.statusUnqualified')}</Badge>;
      case 'negotiation':
        return <Badge className="bg-yellow-500">{t('leads.statusNegotiation')}</Badge>;
      case 'won':
        return <Badge className="bg-emerald-500">{t('leads.statusWon')}</Badge>;
      case 'lost':
        return <Badge className="bg-gray-500">{t('leads.statusLost')}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AppLayout
      title={t('dashboard.title')}
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {t('dashboard.title')} - {t('dashboard.userView')}
        </h2>
      )}
    >
      <Head title={t('dashboard.title')} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Assigned Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.assignedClients')}</CardTitle>
                <CardDescription>{t('dashboard.assignedClientsDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                {assignedClients.length > 0 ? (
                  <div className="space-y-4">
                    {assignedClients.map(client => (
                      <div key={client.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-muted-foreground">{client.email}</div>
                          {client.company && (
                            <div className="text-sm text-muted-foreground">{client.company}</div>
                          )}
                        </div>
                        <div className="flex flex-col items-end">
                          {getClientStatusBadge(client.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    {t('dashboard.noAssignedClients')}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.assignedLeads')}</CardTitle>
                <CardDescription>{t('dashboard.assignedLeadsDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                {assignedLeads.length > 0 ? (
                  <div className="space-y-4">
                    {assignedLeads.map(lead => (
                      <div key={lead.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-sm text-muted-foreground">{lead.email}</div>
                          {lead.company && (
                            <div className="text-sm text-muted-foreground">{lead.company}</div>
                          )}
                        </div>
                        <div className="flex flex-col items-end">
                          {getLeadStatusBadge(lead.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    {t('dashboard.noAssignedLeads')}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Communications */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('dashboard.recentCommunications')}</CardTitle>
              <CardDescription>{t('dashboard.yourRecentCommunications')}</CardDescription>
            </CardHeader>
            <CardContent>
              {recentCommunications.length > 0 ? (
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
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  {t('dashboard.noCommunications')}
                </div>
              )}
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
