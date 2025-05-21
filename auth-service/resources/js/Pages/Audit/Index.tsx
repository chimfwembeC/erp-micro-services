import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { formatDateTime } from '@/Utils/formatters';
import useTranslate from '@/Hooks/useTranslate';
import usePermissions from '@/Hooks/usePermissions';
import { Download } from 'lucide-react';
import useRoute from '@/Hooks/useRoute';

interface AuditIndexProps {
  audits: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
    data: Array<{
      id: number;
      user_id: number | null;
      event: string;
      auditable_type: string;
      auditable_id: number;
      old_values: Record<string, any>;
      new_values: Record<string, any>;
      url: string;
      ip_address: string;
      user_agent: string;
      created_at: string;
      user?: {
        id: number;
        name: string;
      };
    }>;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;

  };
  filters: {
    user?: string;
    model_type?: string;
    event?: string;
    from_date?: string;
    to_date?: string;
  };
  users: Array<{
    id: number;
    name: string;
  }>;
  modelTypes: Record<string, string>;
  eventTypes: Array<string>;
}

export default function AuditIndex({
  audits,
  filters,
  users,
  modelTypes,
  eventTypes,
}: AuditIndexProps) {
  const { t } = useTranslate();
  const route = useRoute();
  const { hasPermission } = usePermissions();
  const { data, setData, get, processing } = useForm({
    user: filters.user || 'all',
    model_type: filters.model_type || 'all',
    event: filters.event || 'all',
    from_date: filters.from_date || '',
    to_date: filters.to_date || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    get(route('audits.index'), {
      preserveState: true,
    });
  };

  const handleReset = () => {
    setData({
      user: 'all',
      model_type: 'all',
      event: 'all',
      from_date: '',
      to_date: '',
    });
    get(route('audits.index'), {
      preserveState: true,
    });
  };

  const getModelTypeName = (type: string) => {
    return modelTypes[type] || type.split('\\').pop();
  };

  const getEventLabel = (event: string) => {
    switch (event) {
      case 'created':
        return (
          <span className="text-green-600 font-medium">
            {t('audit.created', 'Created')}
          </span>
        );
      case 'updated':
        return (
          <span className="text-blue-600 font-medium">
            {t('audit.updated', 'Updated')}
          </span>
        );
      case 'deleted':
        return (
          <span className="text-red-600 font-medium">
            {t('audit.deleted', 'Deleted')}
          </span>
        );
      case 'restored':
        return (
          <span className="text-amber-600 font-medium">
            {t('audit.restored', 'Restored')}
          </span>
        );
      default:
        return <span>{event}</span>;
    }
  };


  return (
    <AppLayout
      title={t('audit.auditLogs', 'Audit Logs')}
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {t('audit.auditLogs', 'Audit Logs')}
        </h2>
      )}
    >
      <Head title={t('audit.auditLogs', 'Audit Logs')} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{t('audit.auditLogs', 'Audit Logs')}</CardTitle>
                  <CardDescription>
                    {t(
                      'audit.description',
                      'View and filter audit logs for all system activities.',
                    )}
                  </CardDescription>
                </div>
                {hasPermission('export_audit_logs') && (
                  <a
                    href={route('audits.export', data)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      {t('audit.export', 'Export')}
                    </Button>
                  </a>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user">{t('audit.user', 'User')}</Label>
                    <Select
                      value={data.user}
                      onValueChange={value => setData('user', value)}
                    >
                      <SelectTrigger id="user">
                        <SelectValue
                          placeholder={t('audit.allUsers', 'All Users')}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          {t('audit.allUsers', 'All Users')}
                        </SelectItem>
                        {users.map(user => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model_type">
                      {t('audit.modelType', 'Model Type')}
                    </Label>
                    <Select
                      value={data.model_type}
                      onValueChange={value => setData('model_type', value)}
                    >
                      <SelectTrigger id="model_type">
                        <SelectValue
                          placeholder={t('audit.allModels', 'All Models')}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          {t('audit.allModels', 'All Models')}
                        </SelectItem>
                        {Object.entries(modelTypes).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event">{t('audit.event', 'Event')}</Label>
                    <Select
                      value={data.event}
                      onValueChange={value => setData('event', value)}
                    >
                      <SelectTrigger id="event">
                        <SelectValue
                          placeholder={t('audit.allEvents', 'All Events')}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          {t('audit.allEvents', 'All Events')}
                        </SelectItem>
                        {eventTypes.map(event => (
                          <SelectItem key={event} value={event}>
                            {t(`audit.${event}`, event)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="from_date">
                      {t('audit.fromDate', 'From Date')}
                    </Label>
                    <Input
                      id="from_date"
                      type="date"
                      value={data.from_date}
                      onChange={e => setData('from_date', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="to_date">
                      {t('audit.toDate', 'To Date')}
                    </Label>
                    <Input
                      id="to_date"
                      type="date"
                      value={data.to_date}
                      onChange={e => setData('to_date', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={processing}
                  >
                    {t('common.reset', 'Reset')}
                  </Button>
                  <Button type="submit" disabled={processing}>
                    {t('audit.filter', 'Filter')}
                  </Button>
                </div>
              </form>

              <div className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('audit.timestamp', 'Timestamp')}</TableHead>
                      <TableHead>{t('audit.user', 'User')}</TableHead>
                      <TableHead>{t('audit.event', 'Event')}</TableHead>
                      <TableHead>{t('audit.model', 'Model')}</TableHead>
                      <TableHead>{t('audit.modelId', 'ID')}</TableHead>
                      <TableHead>{t('common.actions', 'Actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {audits.data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          {t('audit.noRecords', 'No audit records found')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      audits.data.map(audit => (
                        <TableRow key={audit.id}>
                          <TableCell>
                            {formatDateTime(audit.created_at)}
                          </TableCell>
                          <TableCell>
                            {audit.user
                              ? audit.user.name
                              : t('audit.system', 'System')}
                          </TableCell>
                          <TableCell>{getEventLabel(audit.event)}</TableCell>
                          <TableCell>
                            {getModelTypeName(audit.auditable_type)}
                          </TableCell>
                          <TableCell>{audit.auditable_id}</TableCell>
                          <TableCell>
                            <Link href={route('audits.show', audit.id)}>
                              <Button variant="ghost" size="sm">
                                {t('common.view', 'View')}
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {audits.data.length > 0 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      {audits.current_page > 1 && (
                        <PaginationItem>
                          <PaginationPrevious
                            href={route('audits.index', {
                              ...data,
                              page: audits.current_page - 1,
                            })}
                          />
                        </PaginationItem>
                      )}

                      {/* Use the links array directly */}
                      {audits.links.slice(1, -1).map((link, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            href={link.url || '#'}
                            isActive={link.active}
                          >
                            {link.label.replace(/&laquo;|&raquo;/g, '')}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      {audits.current_page < audits.last_page && (
                        <PaginationItem>
                          <PaginationNext
                            href={route('audits.index', {
                              ...data,
                              page: audits.current_page + 1,
                            })}
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
