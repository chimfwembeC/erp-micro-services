import React from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ShoppingCart, 
  FileText, 
  TicketCheck, 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Cpu,
  Server,
  HardDrive,
  Wifi,
  Globe,
  Code,
  Database,
  Shield
} from 'lucide-react';

interface CustomerDashboardProps {
  user: User | null;
  data: {
    orders?: any[];
    invoices?: any[];
    support_tickets?: any[];
    services?: any[];
    stats?: {
      active_services_count: number;
      pending_tickets_count: number;
      unpaid_invoices_count: number;
      upcoming_renewals_count: number;
    };
  };
  isLoading?: boolean;
  error?: string | null;
}

export default function CustomerDashboard({ user, data, isLoading = false, error = null }: CustomerDashboardProps) {
  const { t } = useTranslation();

  // Get stats with defaults
  const stats = data.stats || {
    active_services_count: data.services?.length || 0,
    pending_tickets_count: data.support_tickets?.filter(ticket => ticket.status === 'Open').length || 0,
    unpaid_invoices_count: data.invoices?.filter(invoice => invoice.status === 'Unpaid').length || 0,
    upcoming_renewals_count: 0
  };

  // Mock data for technology services
  const services = data.services || [
    { 
      id: 1, 
      name: 'Cloud Server Hosting', 
      type: 'Infrastructure',
      status: 'Active', 
      next_renewal: '2023-08-15',
      usage: 78,
      icon: Server
    },
    { 
      id: 2, 
      name: 'Database Management', 
      type: 'Database',
      status: 'Active', 
      next_renewal: '2023-09-22',
      usage: 45,
      icon: Database
    },
    { 
      id: 3, 
      name: 'Web Application Firewall', 
      type: 'Security',
      status: 'Active', 
      next_renewal: '2023-07-30',
      usage: 92,
      icon: Shield
    },
    { 
      id: 4, 
      name: 'Content Delivery Network', 
      type: 'Network',
      status: 'Pending Setup', 
      next_renewal: '2023-10-15',
      usage: 0,
      icon: Globe
    }
  ];

  // Mock data for recent orders
  const recentOrders = data.orders || [
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
  ];

  // Mock data for recent invoices
  const recentInvoices = data.invoices || [
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
  ];

  // Mock data for support tickets
  const supportTickets = data.support_tickets || [
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
  ];

  // Function to render status badge
  const renderStatusBadge = (status: string) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";
    
    switch(status.toLowerCase()) {
      case 'active':
      case 'completed':
      case 'paid':
      case 'closed':
        variant = "default";
        break;
      case 'pending':
      case 'processing':
      case 'in progress':
        variant = "secondary";
        break;
      case 'unpaid':
      case 'open':
        variant = "destructive";
        break;
      default:
        variant = "outline";
    }
    
    return <Badge variant={variant}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            {t('dashboard.customer.overview')}
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            {t('dashboard.customer.services')}
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t('dashboard.customer.billing')}
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2">
            <TicketCheck className="h-4 w-4" />
            {t('dashboard.customer.support')}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{t('dashboard.customer.activeServices')}</CardTitle>
                <CardDescription>{t('dashboard.customer.currentlyActive')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stats.active_services_count}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{t('dashboard.customer.pendingTickets')}</CardTitle>
                <CardDescription>{t('dashboard.customer.openSupportRequests')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stats.pending_tickets_count}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{t('dashboard.customer.unpaidInvoices')}</CardTitle>
                <CardDescription>{t('dashboard.customer.pendingPayments')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stats.unpaid_invoices_count}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{t('dashboard.customer.upcomingRenewals')}</CardTitle>
                <CardDescription>{t('dashboard.customer.next30Days')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stats.upcoming_renewals_count}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.customer.recentOrders')}</CardTitle>
                <CardDescription>{t('dashboard.customer.latestPurchases')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('dashboard.customer.orderID')}</TableHead>
                      <TableHead>{t('dashboard.customer.date')}</TableHead>
                      <TableHead>{t('dashboard.customer.status')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.slice(0, 3).map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{renderStatusBadge(order.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto">
                  {t('dashboard.customer.viewAllOrders')}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.customer.recentTickets')}</CardTitle>
                <CardDescription>{t('dashboard.customer.latestSupportRequests')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('dashboard.customer.ticketID')}</TableHead>
                      <TableHead>{t('dashboard.customer.subject')}</TableHead>
                      <TableHead>{t('dashboard.customer.status')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supportTickets.slice(0, 3).map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.id}</TableCell>
                        <TableCell>{ticket.subject}</TableCell>
                        <TableCell>{renderStatusBadge(ticket.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto">
                  {t('dashboard.customer.viewAllTickets')}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.customer.technologyServices')}</CardTitle>
              <CardDescription>{t('dashboard.customer.managedServices')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => {
                  const Icon = service.icon || Cpu;
                  return (
                    <Card key={service.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5" />
                            <div>
                              <CardTitle className="text-lg">{service.name}</CardTitle>
                              <CardDescription>{service.type}</CardDescription>
                            </div>
                          </div>
                          {renderStatusBadge(service.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{t('dashboard.customer.nextRenewal')}</span>
                            <span>{service.next_renewal}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{t('dashboard.customer.resourceUsage')}</span>
                              <span>{service.usage}%</span>
                            </div>
                            <Progress value={service.usage} />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">
                          {t('dashboard.customer.manageService')}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                {t('dashboard.customer.orderNewService')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.customer.invoices')}</CardTitle>
              <CardDescription>{t('dashboard.customer.billingHistory')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('dashboard.customer.invoiceID')}</TableHead>
                    <TableHead>{t('dashboard.customer.date')}</TableHead>
                    <TableHead>{t('dashboard.customer.dueDate')}</TableHead>
                    <TableHead>{t('dashboard.customer.amount')}</TableHead>
                    <TableHead>{t('dashboard.customer.status')}</TableHead>
                    <TableHead>{t('dashboard.customer.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.due_date}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>{renderStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            {t('dashboard.customer.view')}
                          </Button>
                          {invoice.status === 'Unpaid' && (
                            <Button size="sm">
                              {t('dashboard.customer.pay')}
                            </Button>
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

        {/* Support Tab */}
        <TabsContent value="support" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.customer.supportTickets')}</CardTitle>
              <CardDescription>{t('dashboard.customer.helpRequests')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('dashboard.customer.ticketID')}</TableHead>
                    <TableHead>{t('dashboard.customer.date')}</TableHead>
                    <TableHead>{t('dashboard.customer.subject')}</TableHead>
                    <TableHead>{t('dashboard.customer.priority')}</TableHead>
                    <TableHead>{t('dashboard.customer.status')}</TableHead>
                    <TableHead>{t('dashboard.customer.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supportTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>{ticket.date}</TableCell>
                      <TableCell>{ticket.subject}</TableCell>
                      <TableCell>
                        <Badge variant={
                          ticket.priority === 'High' ? 'destructive' : 
                          ticket.priority === 'Medium' ? 'secondary' : 'outline'
                        }>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{renderStatusBadge(ticket.status)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          {t('dashboard.customer.viewTicket')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                {t('dashboard.customer.createNewTicket')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
