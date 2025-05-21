<?php

namespace App\Console\Commands;

use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskDueDateReminderNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SendTaskDueDateReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tasks:send-due-date-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send reminders for tasks that are due soon';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Sending task due date reminders...');

        // Get tasks due today
        $this->sendRemindersForTasksDueInDays(0);

        // Get tasks due in 1 day
        $this->sendRemindersForTasksDueInDays(1);

        // Get tasks due in 3 days
        $this->sendRemindersForTasksDueInDays(3);

        // Get tasks due in 7 days
        $this->sendRemindersForTasksDueInDays(7);

        $this->info('Task due date reminders sent successfully!');

        return Command::SUCCESS;
    }

    /**
     * Send reminders for tasks due in a specific number of days.
     */
    private function sendRemindersForTasksDueInDays(int $days)
    {
        $date = Carbon::now()->addDays($days)->format('Y-m-d');

        $tasks = Task::where('due_date', $date)
            ->where('status', '!=', 'done')
            ->whereNotNull('assigned_to')
            ->get();

        $count = $tasks->count();

        if ($count === 0) {
            $this->info("No tasks due in $days days.");
            return;
        }

        $this->info("Found $count tasks due in $days days. Sending reminders...");

        foreach ($tasks as $task) {
            $assignee = User::find($task->assigned_to);

            if ($assignee) {
                $assignee->notify(new TaskDueDateReminderNotification($task, $days));
                $this->info("Reminder sent to {$assignee->name} for task: {$task->title}");
            }
        }
    }
}
