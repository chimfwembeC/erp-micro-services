import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDateTime } from '@/Utils/formatters';
import useTranslate from '@/Hooks/useTranslate';

interface AuditShowProps {
  audit: {
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
  };
  auditable: any;
}

export default function AuditShow({ audit, auditable }: AuditShowProps) {
  const { t } = useTranslate();

  const getModelTypeName = (type: string) => {
    return type.split('\\').pop();
  };

  const getEventLabel = (event: string) => {
    switch (event) {
      case 'created':
        return <span className="text-green-600 font-medium">{t('audit.created', 'Created')}</span>;
      case 'updated':
        return <span className="text-blue-600 font-medium">{t('audit.updated', 'Updated')}</span>;
      case 'deleted':
        return <span className="text-red-600 font-medium">{t('audit.deleted', 'Deleted')}</span>;
      case 'restored':
        return <span className="text-amber-600 font-medium">{t('audit.restored', 'Restored')}</span>;
      default:
        return <span>{event}</span>;
    }
  };

  const renderValue = (value: any) => {
    if (value === null) return <span className="text-gray-400">null</span>;
    if (value === '') return <span className="text-gray-400">empty string</span>;
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return value.toString();
  };

  return (
    <AppLayout
      title={t('audit.auditDetails', 'Audit Details')}
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {t('audit.auditDetails', 'Audit Details')}
        </h2>
      )}
    >
      <Head title={t('audit.auditDetails', 'Audit Details')} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-4">
            <Link href={route('audits.index')}>
              <Button variant="outline">
                {t('common.back', 'Back to Audit Logs')}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('audit.generalInfo', 'General Information')}</CardTitle>
                <CardDescription>
                  {t('audit.generalInfoDescription', 'Basic information about this audit record')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{t('audit.id', 'ID')}</TableCell>
                      <TableCell>{audit.id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{t('audit.timestamp', 'Timestamp')}</TableCell>
                      <TableCell>{formatDateTime(audit.created_at)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{t('audit.user', 'User')}</TableCell>
                      <TableCell>
                        {audit.user ? (
                          <Link href={route('users.show', audit.user.id)} className="text-primary hover:underline">
                            {audit.user.name}
                          </Link>
                        ) : (
                          t('audit.system', 'System')
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{t('audit.event', 'Event')}</TableCell>
                      <TableCell>{getEventLabel(audit.event)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{t('audit.model', 'Model')}</TableCell>
                      <TableCell>{getModelTypeName(audit.auditable_type)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{t('audit.modelId', 'Model ID')}</TableCell>
                      <TableCell>{audit.auditable_id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{t('audit.url', 'URL')}</TableCell>
                      <TableCell className="break-all">{audit.url}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{t('audit.ipAddress', 'IP Address')}</TableCell>
                      <TableCell>{audit.ip_address}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {auditable && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('audit.currentState', 'Current State')}</CardTitle>
                  <CardDescription>
                    {t('audit.currentStateDescription', 'Current state of the audited model')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      {Object.entries(auditable).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell className="font-medium">{key}</TableCell>
                          <TableCell className="break-all">
                            {renderValue(value)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(audit.old_values).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('audit.oldValues', 'Old Values')}</CardTitle>
                  <CardDescription>
                    {t('audit.oldValuesDescription', 'Values before the change')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('audit.field', 'Field')}</TableHead>
                        <TableHead>{t('audit.value', 'Value')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(audit.old_values).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell className="font-medium">{key}</TableCell>
                          <TableCell className="break-all">
                            {renderValue(value)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {Object.keys(audit.new_values).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('audit.newValues', 'New Values')}</CardTitle>
                  <CardDescription>
                    {t('audit.newValuesDescription', 'Values after the change')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('audit.field', 'Field')}</TableHead>
                        <TableHead>{t('audit.value', 'Value')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(audit.new_values).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell className="font-medium">{key}</TableCell>
                          <TableCell className="break-all">
                            {renderValue(value)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
