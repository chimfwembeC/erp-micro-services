import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle, Eye, Pencil, Trash2, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import AppLayout from '@/Layouts/AppLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source?: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'negotiation' | 'won' | 'lost';
  created_at: string;
  updated_at: string;
  created_by?: {
    id: number;
    name: string;
  };
  updated_by?: {
    id: number;
    name: string;
  };
}

interface PaginationLinks {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationData {
  current_page: number;
  data: Lead[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLinks[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

interface Props {
  leads: PaginationData;
}

export default function Index({ leads }: Props) {
  const { t } = useTranslation();

  const handleDelete = (id: number) => {
    if (confirm(t('common.confirmDelete'))) {
      router.delete(route('leads.destroy', id), {
        onSuccess: () => {
          toast.success(t('leads.deleteSuccess'));
        },
        onError: () => {
          toast.error(t('leads.deleteError'));
        },
      });
    }
  };

  const handleConvert = (id: number) => {
    if (confirm(t('leads.confirmConvert'))) {
      router.post(route('leads.convert', id), {}, {
        onSuccess: () => {
          toast.success(t('leads.convertSuccess'));
        },
        onError: () => {
          toast.error(t('leads.convertError'));
        },
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500">{t(`leads.${status}`)}</Badge>;
      case 'contacted':
        return <Badge className="bg-purple-500">{t(`leads.${status}`)}</Badge>;
      case 'qualified':
        return <Badge className="bg-green-500">{t(`leads.${status}`)}</Badge>;
      case 'unqualified':
        return <Badge className="bg-red-500">{t(`leads.${status}`)}</Badge>;
      case 'negotiation':
        return <Badge className="bg-yellow-500">{t(`leads.${status}`)}</Badge>;
      case 'won':
        return <Badge className="bg-emerald-500">{t(`leads.${status}`)}</Badge>;
      case 'lost':
        return <Badge className="bg-gray-500">{t(`leads.${status}`)}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AppLayout
      title={t('leads.leadManagement')}
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {t('leads.leadManagement')}
        </h2>
      )}
    >
      <Head title={t('leads.leadManagement')} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <Breadcrumb
              items={[
                { label: t('common.dashboard'), href: route('dashboard') },
                { label: t('leads.leadManagement') },
              ]}
            />
          </div>

          <Card className="mt-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t('leads.leadList')}</CardTitle>
                <CardDescription>
                  {t('leads.manageLeads')}
                </CardDescription>
              </div>
              <Button asChild>
                <Link href={route('leads.create')}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('leads.addLead')}
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('common.name')}</TableHead>
                    <TableHead>{t('common.email')}</TableHead>
                    <TableHead>{t('common.company')}</TableHead>
                    <TableHead>{t('leads.source')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead className="text-right">
                      {t('common.actions')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        {t('leads.noLeadsFound')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    leads.data.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">
                          {lead.name}
                        </TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell>
                          {lead.company || (
                            <span className="text-muted-foreground italic">
                              {t('common.notSpecified')}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {lead.source || (
                            <span className="text-muted-foreground italic">
                              {t('common.notSpecified')}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(lead.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <span className="sr-only">
                                  {t('common.openMenu')}
                                </span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4"
                                >
                                  <circle cx="12" cy="12" r="1" />
                                  <circle cx="12" cy="5" r="1" />
                                  <circle cx="12" cy="19" r="1" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={route('leads.show', lead.id)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  {t('common.view')}
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={route('leads.edit', lead.id)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  {t('common.edit')}
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleConvert(lead.id)}
                                className="text-green-600 focus:text-green-600"
                              >
                                <UserPlus className="mr-2 h-4 w-4" />
                                {t('leads.convertToClient')}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => handleDelete(lead.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t('common.delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {leads.last_page > 1 && (
                <div className="mt-6 flex items-center justify-center">
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                      {t('common.page')} {leads.current_page} {t('common.of')}{' '}
                      {leads.last_page}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        disabled={!leads.prev_page_url}
                        onClick={() =>
                          router.get(
                            leads.prev_page_url || leads.first_page_url
                          )
                        }
                      >
                        <span className="sr-only">{t('common.previous')}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="m15 18-6-6 6-6" />
                        </svg>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        disabled={!leads.next_page_url}
                        onClick={() =>
                          router.get(
                            leads.next_page_url || leads.last_page_url
                          )
                        }
                      >
                        <span className="sr-only">{t('common.next')}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
