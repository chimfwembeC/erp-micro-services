import React, { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Textarea } from '@/Components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/Components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { formatDateTime } from '@/lib/utils';
import { MessageSquareIcon, ReplyIcon, PencilIcon, TrashIcon } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  profile_photo_url?: string;
}

interface Comment {
  id: number;
  content: string;
  task_id: number;
  user_id: number;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  user: User;
  replies?: Comment[];
  has_replies?: boolean;
  is_reply?: boolean;
}

interface CommentSectionProps {
  taskId: number;
  comments: Comment[];
  currentUser: User;
}

export default function CommentSection({ taskId, comments, currentUser }: CommentSectionProps) {
  const { t } = useTranslation();
  const [newComment, setNewComment] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deletingComment, setDeletingComment] = useState<Comment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    
    router.post(route('tasks.comments.store', taskId), {
      content: newComment,
    }, {
      onSuccess: () => {
        toast.success(t('comments.added_successfully'));
        setNewComment('');
        setIsSubmitting(false);
      },
      onError: () => {
        toast.error(t('common.error_occurred'));
        setIsSubmitting(false);
      }
    });
  };

  const handleSubmitReply = () => {
    if (!replyContent.trim() || !replyingTo) return;
    
    setIsSubmitting(true);
    
    router.post(route('tasks.comments.store', taskId), {
      content: replyContent,
      parent_id: replyingTo.id,
    }, {
      onSuccess: () => {
        toast.success(t('comments.reply_added_successfully'));
        setReplyContent('');
        setReplyingTo(null);
        setIsSubmitting(false);
      },
      onError: () => {
        toast.error(t('common.error_occurred'));
        setIsSubmitting(false);
      }
    });
  };

  const handleUpdateComment = () => {
    if (!editContent.trim() || !editingComment) return;
    
    setIsSubmitting(true);
    
    router.put(route('comments.update', editingComment.id), {
      content: editContent,
    }, {
      onSuccess: () => {
        toast.success(t('comments.updated_successfully'));
        setEditContent('');
        setEditingComment(null);
        setIsSubmitting(false);
      },
      onError: () => {
        toast.error(t('common.error_occurred'));
        setIsSubmitting(false);
      }
    });
  };

  const handleDeleteComment = () => {
    if (!deletingComment) return;
    
    setIsSubmitting(true);
    
    router.delete(route('comments.destroy', deletingComment.id), {
      onSuccess: () => {
        toast.success(t('comments.deleted_successfully'));
        setDeletingComment(null);
        setIsSubmitting(false);
      },
      onError: () => {
        toast.error(t('common.error_occurred'));
        setIsSubmitting(false);
      }
    });
  };

  const startReply = (comment: Comment) => {
    setReplyingTo(comment);
    setReplyContent('');
  };

  const startEdit = (comment: Comment) => {
    setEditingComment(comment);
    setEditContent(comment.content);
  };

  const confirmDelete = (comment: Comment) => {
    setDeletingComment(comment);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const renderComment = (comment: Comment, isReply = false) => {
    return (
      <div key={comment.id} className={`${isReply ? 'ml-12 mt-3' : 'mt-4'}`}>
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            {comment.user.profile_photo_url ? (
              <AvatarImage src={comment.user.profile_photo_url} alt={comment.user.name} />
            ) : (
              <AvatarFallback>{getInitials(comment.user.name)}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium">{comment.user.name}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    {formatDateTime(comment.created_at)}
                  </span>
                </div>
                {(comment.user_id === currentUser.id) && (
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => startEdit(comment)}
                    >
                      <PencilIcon className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => confirmDelete(comment)}
                    >
                      <TrashIcon className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="mt-1 whitespace-pre-wrap">{comment.content}</div>
            </div>
            {!isReply && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-1 text-xs"
                onClick={() => startReply(comment)}
              >
                <ReplyIcon className="h-3 w-3 mr-1" />
                {t('comments.reply')}
              </Button>
            )}
          </div>
        </div>
        
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-3">
            {comment.replies.map(reply => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          {currentUser.profile_photo_url ? (
            <AvatarImage src={currentUser.profile_photo_url} alt={currentUser.name} />
          ) : (
            <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('comments.write_comment')}
            rows={3}
          />
          <Button 
            onClick={handleSubmitComment} 
            disabled={!newComment.trim() || isSubmitting}
          >
            <MessageSquareIcon className="h-4 w-4 mr-2" />
            {t('comments.add_comment')}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {t('comments.title')} ({comments.length})
        </h3>
        
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map(comment => renderComment(comment))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            {t('comments.no_comments')}
          </div>
        )}
      </div>

      {/* Reply Dialog */}
      <Dialog open={!!replyingTo} onOpenChange={(open) => !open && setReplyingTo(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('comments.reply_to')} {replyingTo?.user.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mb-4">
              <div className="font-medium">{replyingTo?.user.name}</div>
              <div className="mt-1">{replyingTo?.content}</div>
            </div>
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={t('comments.write_reply')}
              rows={3}
            />
          </div>
          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setReplyingTo(null)}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              onClick={handleSubmitReply}
              disabled={!replyContent.trim() || isSubmitting}
            >
              {t('comments.reply')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingComment} onOpenChange={(open) => !open && setEditingComment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('comments.edit_comment')}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setEditingComment(null)}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              onClick={handleUpdateComment}
              disabled={!editContent.trim() || isSubmitting}
            >
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingComment} onOpenChange={(open) => !open && setDeletingComment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('comments.delete_comment')}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p>{t('comments.delete_confirmation')}</p>
          </div>
          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setDeletingComment(null)}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteComment}
              disabled={isSubmitting}
            >
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
