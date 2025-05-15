import React from 'react';
import { Link } from '@inertiajs/react';
import { MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Props {
  entityType: 'client' | 'lead';
  entityId: number;
  unreadCount?: number;
}

export default function ChatButton({ entityType, entityId, unreadCount = 0 }: Props) {
  const { t } = useTranslation();

  return (
    <Button
      variant="outline"
      size="sm"
      asChild
      className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
    >
      <Link href={route(`${entityType}s.chat`, entityId)}>
        <MessageSquare className="mr-2 h-4 w-4" />
        {t('chat.liveChat')}
        {unreadCount > 0 && (
          <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
            {unreadCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
}
