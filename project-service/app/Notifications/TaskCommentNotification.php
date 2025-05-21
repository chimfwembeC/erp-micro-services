<?php

namespace App\Notifications;

use App\Models\Comment;
use App\Models\Task;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class TaskCommentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The comment instance.
     *
     * @var \App\Models\Comment
     */
    protected $comment;

    /**
     * The task instance.
     *
     * @var \App\Models\Task
     */
    protected $task;

    /**
     * The user who commented.
     *
     * @var \App\Models\User
     */
    protected $commenter;

    /**
     * Create a new notification instance.
     */
    public function __construct(Comment $comment, Task $task, User $commenter)
    {
        $this->comment = $comment;
        $this->task = $task;
        $this->commenter = $commenter;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $url = url('/projects/' . $this->task->project_id . '/tasks/' . $this->task->id);
        $commentPreview = Str::limit($this->comment->content, 100);

        $subject = $this->comment->parent_id
            ? 'New Reply on Task: ' . $this->task->title
            : 'New Comment on Task: ' . $this->task->title;

        return (new MailMessage)
            ->subject($subject)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line($this->commenter->name . ' has ' . ($this->comment->parent_id ? 'replied to a comment' : 'commented') . ' on a task you are involved with.')
            ->line('Task: ' . $this->task->title)
            ->line('Project: ' . $this->task->project->name)
            ->line('Comment: "' . $commentPreview . '"')
            ->action('View Task', $url)
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'comment_id' => $this->comment->id,
            'task_id' => $this->task->id,
            'project_id' => $this->task->project_id,
            'commenter_id' => $this->commenter->id,
            'commenter_name' => $this->commenter->name,
            'task_title' => $this->task->title,
            'comment_preview' => Str::limit($this->comment->content, 100),
            'is_reply' => $this->comment->parent_id !== null,
            'message' => $this->commenter->name . ' ' . ($this->comment->parent_id ? 'replied to a comment' : 'commented') . ' on task "' . $this->task->title . '"',
            'type' => 'task_comment'
        ];
    }
}
