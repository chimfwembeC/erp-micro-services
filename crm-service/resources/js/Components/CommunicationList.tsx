import React, { useEffect, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { PlusCircle, Eye, Pencil, Trash2, Mail, Phone, Calendar, FileText, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

interface Communication {
  id: number;
  client_id: number | null;
  lead_id: number | null;
  type: 'email' | 'call' | 'meeting' | 'note' | 'other';
  subject: string;
  content: string;
  date: string;
  created_at: string;
  created_by?: {
    id: number;
    name: string;
  };
}

interface Props {
  entityType: 'client' | 'lead';
  entityId: number;
  entityName: string;
}

export default function CommunicationList({ entityType, entityId, entityName }: Props) {
  const { t } = useTranslation();
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunications = async () => {
      try {
        const response = await axios.get(
          route(`${entityType}s.communications.index`, entityId)
        );
        setCommunications(response.data);
      } catch (error) {
        console.error('Error fetching communications:', error);
        toast.error(t('communications.fetchError'));
      } finally {
        setLoading(false);
      }
    };

    fetchCommunications();
  }, [entityType, entityId]);

  const handleDelete = (id: number) => {
    if (confirm(t('common.confirmDelete'))) {
      router.delete(route('communications.destroy', id), {
        onSuccess: () => {
          setCommunications(communications.filter(comm => comm.id !== id));
          toast.success(t('communications.deleteSuccess'));
        },
        onError: () => {
          toast.error(t('communications.deleteError'));
        },
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4 mr-2" />;
      case 'call':
        return <Phone className="h-4 w-4 mr-2" />;
      case 'meeting':
        return <Calendar className="h-4 w-4 mr-2" />;
      case 'note':
        return <FileText className="h-4 w-4 mr-2" />;
      default:
        return <MessageSquare className="h-4 w-4 mr-2" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'email':
        return <Badge className="bg-blue-500">{t(`communications.${type}`)}</Badge>;
      case 'call':
        return <Badge className="bg-green-500">{t(`communications.${type}`)}</Badge>;
      case 'meeting':
        return <Badge className="bg-purple-500">{t(`communications.${type}`)}</Badge>;
      case 'note':
        return <Badge className="bg-yellow-500">{t(`communications.${type}`)}</Badge>;
      default:
        return <Badge>{t(`communications.${type}`)}</Badge>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          {t('communications.recentCommunications')}
        </h3>
        <Button asChild size="sm">
          <Link href={route(`${entityType}s.communications.create`, entityId)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('communications.addCommunication')}
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : communications.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>{t('communications.noCommunicationsYet')}</p>
          <p className="mt-2">
            {t('communications.addFirstCommunication', { name: entityName })}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {communications.map((communication) => (
            <Card key={communication.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    {getTypeIcon(communication.type)}
                    <CardTitle className="text-base">{communication.subject}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTypeBadge(communication.type)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <span className="sr-only">{t('common.openMenu')}</span>
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
                          <Link href={route('communications.edit', communication.id)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            {t('common.edit')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDelete(communication.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('common.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardDescription className="text-xs">
                  {format(parseISO(communication.date), 'PPP p')}
                  {communication.created_by && (
                    <> • {t('common.by')} {communication.created_by.name}</>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-sm whitespace-pre-line">
                  {communication.content.length > 300
                    ? `${communication.content.substring(0, 300)}...`
                    : communication.content}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
