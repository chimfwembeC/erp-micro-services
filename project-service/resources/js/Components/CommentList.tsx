import React, { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Textarea } from '@/Components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/Components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { 
  MessageSquareIcon,
  PencilIcon,
  TrashIcon,
  ReplyIcon,
  SendIcon
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

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

interface CommentListProps {
  comments: Comment[];
  taskId: number;
  currentUserId: number;
  isAdmin?: boolean;
  onCommentAdded?: () => void;
}

export default function CommentList({
  comments,
  taskId,
  currentUserId,
  isAdmin = false,
  onCommentAdded
}: CommentListProps) {
  const { t } = useTranslation();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    
    router.post(route('tasks.comments.store', taskId), {
      content: newComment,
      parent_id: null
    }, {
      onSuccess: () => {
        toast.success(t('comments.added_successfully'));
        setNewComment('');
        if (onCommentAdded) {
          onCommentAdded();
        }
      },
      onError: () => {
        toast.error(t('common.error_occurred'));
      },
      onFinish: () => {
        setIsSubmitting(false);
      }
    });
  };

  const handleAddReply = () => {
    if (!replyContent.trim() || !replyingTo) return;
    
    setIsSubmitting(true);
    
    router.post(route('tasks.comments.store', taskId), {
      content: replyContent,
      parent_id: replyingTo.id
    }, {
      onSuccess: () => {
        toast.success(t('comments.reply_added_successfully'));
        setReplyContent('');
        setReplyingTo(null);
        if (onCommentAdded) {
          onCommentAdded();
        }
      },
      onError: () => {
        toast.error(t('common.error_occurred'));
      },
      onFinish: () => {
        setIsSubmitting(false);
      }
    });
  };

  const handleUpdateComment = () => {
    if (!editContent.trim() || !editingComment) return;
    
    setIsSubmitting(true);
    
    router.put(route('comments.update', editingComment.id), {
      content: editContent
    }, {
      onSuccess: () => {
        toast.success(t('comments.updated_successfully'));
        setEditContent('');
        setEditingComment(null);
        if (onCommentAdded) {
          onCommentAdded();
        }
      },
      onError: () => {
        toast.error(t('common.error_occurred'));
      },
      onFinish: () => {
        setIsSubmitting(false);
      }
    });
  };

  const handleDeleteComment = () => {
    if (!commentToDelete) return;
    
    router.delete(route('comments.destroy', commentToDelete.id), {
      onSuccess: () => {
        toast.success(t('comments.deleted_successfully'));
        setIsDeleteDialogOpen(false);
        setCommentToDelete(null);
        if (onCommentAdded) {
          onCommentAdded();
        }
      },
      onError: () => {
        toast.error(t('common.error_occurred'));
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
    setCommentToDelete(comment);
    setIsDeleteDialogOpen(true);
  };

  const canModifyComment = (comment: User['id']) => {
    return comment === currentUserId || isAdmin;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <Card key={comment.id} className={`mb-4 ${isReply ? 'ml-12' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            {comment.user.profile_photo_url ? (
              <AvatarImage src={comment.user.profile_photo_url} alt={comment.user.name} />
            ) : (
              <AvatarFallback>{getInitials(comment.user.name)}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">{comment.user.name}</span>
                <span className="text-sm text-gray-500 ml-2">
                  {formatDateTime(comment.created_at)}
                </span>
              </div>
              {canModifyComment(comment.user_id) && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => startEdit(comment)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => confirmDelete(comment)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="mt-2 whitespace-pre-wrap">{comment.content}</div>
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => startReply(comment)}
              >
                <ReplyIcon className="h-4 w-4 mr-1" />
                {t('comments.reply')}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <MessageSquareIcon className="h-5 w-5 mr-2" />
        <h3 className="text-lg font-medium">{t('comments.title')}</h3>
      </div>

      <div className="mb-6">
        <Textarea
          placeholder={t('comments.add_comment')}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
        />
        <div className="flex justify-end mt-2">
          <Button 
            onClick={handleAddComment}
            disabled={!newComment.trim() || isSubmitting}
          >
            <SendIcon className="h-4 w-4 mr-2" />
            {t('comments.post')}
          </Button>
        </div>
      </div>

      {comments.length > 0 ? (
        <div>
          {comments.map(comment => (
            <React.Fragment key={comment.id}>
              {renderComment(comment)}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-12 mt-2">
                  {comment.replies.map(reply => renderComment(reply, true))}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          {t('comments.no_comments')}
        </div>
      )}

      {/* Reply Dialog */}
      {replyingTo && (
        <Card className="mt-4 ml-12">
          <CardContent className="p-4">
            <div className="mb-2">
              <span className="text-sm text-gray-500">
                {t('comments.replying_to')} {replyingTo.user.name}
              </span>
            </div>
            <Textarea
              placeholder={t('comments.write_reply')}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button
                variant="outline"
                onClick={() => setReplyingTo(null)}
              >
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handleAddReply}
                disabled={!replyContent.trim() || isSubmitting}
              >
                {t('comments.post_reply')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      {editingComment && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="mb-2">
              <span className="text-sm text-gray-500">
                {t('comments.editing_comment')}
              </span>
            </div>
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end gap-2 mt-2">
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
                {t('comments.update')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('comments.confirm_delete')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>{t('comments.delete_warning')}</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteComment}
            >
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
