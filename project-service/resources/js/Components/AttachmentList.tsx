import React, { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { 
  FileIcon, 
  ImageIcon, 
  FileTextIcon, 
  FilePdfIcon, 
  FileSpreadsheetIcon, 
  FilePresentationIcon,
  DownloadIcon,
  TrashIcon,
  ExternalLinkIcon,
  UserIcon,
  CalendarIcon
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Attachment {
  id: number;
  filename: string;
  original_filename: string;
  file_path: string;
  mime_type: string;
  file_size: number;
  description: string | null;
  created_at: string;
  user: {
    id: number;
    name: string;
  };
  url: string;
  extension: string;
  is_image: boolean;
  is_document: boolean;
  formatted_size: string;
}

interface AttachmentListProps {
  attachments: Attachment[];
  onDelete?: (attachment: Attachment) => void;
  showUser?: boolean;
  showDate?: boolean;
  canDelete?: boolean;
}

export default function AttachmentList({
  attachments,
  onDelete,
  showUser = true,
  showDate = true,
  canDelete = true,
}: AttachmentListProps) {
  const { t } = useTranslation();
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const getFileIcon = (attachment: Attachment) => {
    if (attachment.is_image) {
      return <ImageIcon className="h-6 w-6 text-blue-500" />;
    }
    
    if (attachment.mime_type === 'application/pdf') {
      return <FilePdfIcon className="h-6 w-6 text-red-500" />;
    }
    
    if (attachment.mime_type.includes('spreadsheet') || attachment.mime_type.includes('excel')) {
      return <FileSpreadsheetIcon className="h-6 w-6 text-green-500" />;
    }
    
    if (attachment.mime_type.includes('presentation') || attachment.mime_type.includes('powerpoint')) {
      return <FilePresentationIcon className="h-6 w-6 text-orange-500" />;
    }
    
    if (attachment.mime_type.includes('word') || attachment.mime_type === 'text/plain') {
      return <FileTextIcon className="h-6 w-6 text-blue-500" />;
    }
    
    return <FileIcon className="h-6 w-6 text-gray-500" />;
  };

  const handleDelete = (attachment: Attachment) => {
    router.delete(route('attachments.destroy', attachment.id), {
      onSuccess: () => {
        toast.success(t('attachments.delete_success'));
        setIsDeleteDialogOpen(false);
        if (onDelete) {
          onDelete(attachment);
        }
      },
      onError: () => {
        toast.error(t('attachments.delete_error'));
      }
    });
  };

  const openPreview = (attachment: Attachment) => {
    setSelectedAttachment(attachment);
    setIsPreviewOpen(true);
  };

  const confirmDelete = (attachment: Attachment) => {
    setSelectedAttachment(attachment);
    setIsDeleteDialogOpen(true);
  };

  if (attachments.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        {t('attachments.no_attachments')}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {attachments.map((attachment) => (
        <Card key={attachment.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {getFileIcon(attachment)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{attachment.original_filename}</div>
                <div className="text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1 mt-1">
                  <span>{attachment.formatted_size}</span>
                  {showUser && attachment.user && (
                    <span className="flex items-center">
                      <UserIcon className="h-3 w-3 mr-1" />
                      {attachment.user.name}
                    </span>
                  )}
                  {showDate && (
                    <span className="flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {formatDate(attachment.created_at)}
                    </span>
                  )}
                </div>
                {attachment.description && (
                  <div className="text-sm mt-1">{attachment.description}</div>
                )}
                {attachment.is_image && (
                  <div 
                    className="mt-2 cursor-pointer" 
                    onClick={() => openPreview(attachment)}
                  >
                    <img 
                      src={attachment.url} 
                      alt={attachment.original_filename} 
                      className="h-20 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
              <div className="flex-shrink-0 flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                >
                  <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLinkIcon className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                >
                  <a href={attachment.url} download={attachment.original_filename}>
                    <DownloadIcon className="h-4 w-4" />
                  </a>
                </Button>
                {canDelete && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => confirmDelete(attachment)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Image Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedAttachment?.original_filename}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            {selectedAttachment?.is_image && (
              <img 
                src={selectedAttachment.url} 
                alt={selectedAttachment.original_filename} 
                className="max-h-[70vh] object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('attachments.confirm_delete')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>{t('attachments.delete_warning')}</p>
            <p className="font-medium mt-2">{selectedAttachment?.original_filename}</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedAttachment && handleDelete(selectedAttachment)}
            >
              {t('common.delete')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
