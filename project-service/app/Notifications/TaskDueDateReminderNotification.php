<?php

namespace App\Notifications;

use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Carbon\Carbon;

class TaskDueDateReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The task instance.
     *
     * @var \App\Models\Task
     */
    protected $task;

    /**
     * The days remaining until the due date.
     *
     * @var int
     */
    protected $daysRemaining;

    /**
     * Create a new notification instance.
     */
    public function __construct(Task $task, int $daysRemaining)
    {
        $this->task = $task;
        $this->daysRemaining = $daysRemaining;
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
        $dueDate = Carbon::parse($this->task->due_date)->format('F j, Y');

        $subject = $this->daysRemaining === 0
            ? 'Task Due Today: ' . $this->task->title
            : 'Task Due in ' . $this->daysRemaining . ' Days: ' . $this->task->title;

        $message = (new MailMessage)
            ->subject($subject)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('This is a reminder about your task:');

        if ($this->daysRemaining === 0) {
            $message->line('Your task "' . $this->task->title . '" is due today!');
        } else {
            $message->line('Your task "' . $this->task->title . '" is due in ' . $this->daysRemaining . ' days.');
        }

        return $message
            ->line('Project: ' . $this->task->project->name)
            ->line('Due Date: ' . $dueDate)
            ->line('Priority: ' . ucfirst($this->task->priority))
            ->action('View Task', $url)
            ->line('Please make sure to complete it on time.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $message = $this->daysRemaining === 0
            ? 'Task "' . $this->task->title . '" is due today!'
            : 'Task "' . $this->task->title . '" is due in ' . $this->daysRemaining . ' days.';

        return [
            'task_id' => $this->task->id,
            'project_id' => $this->task->project_id,
            'title' => $this->task->title,
            'due_date' => $this->task->due_date,
            'days_remaining' => $this->daysRemaining,
            'message' => $message,
            'type' => 'task_due_date_reminder'
        ];
    }
}
