<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskAssignedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Project $project)
    {
        $tasks = $project->tasks()
            ->with(['assignedUser', 'creator'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Tasks/Index', [
            'project' => $project,
            'tasks' => $tasks,
        ]);
    }

    /**
     * Display a listing of all tasks.
     */
    public function allTasks()
    {
        $tasks = Task::with(['project', 'assignedUser', 'creator'])
            ->when(!Auth::user()->hasRole('admin'), function ($query) {
                return $query->where('created_by', Auth::id())
                    ->orWhere('assigned_to', Auth::id());
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Tasks/AllTasks', [
            'tasks' => $tasks,
        ]);
    }

    /**
     * Display a listing of tasks assigned to the current user.
     */
    public function myTasks()
    {
        $tasks = Task::with(['project', 'creator'])
            ->where('assigned_to', Auth::id())
            ->orderBy('due_date', 'asc')
            ->paginate(10);

        return Inertia::render('Tasks/MyTasks', [
            'tasks' => $tasks,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Project $project)
    {
        $users = User::all();

        return Inertia::render('Tasks/Create', [
            'project' => $project,
            'users' => $users,
            'statuses' => $this->getStatusOptions(),
            'priorities' => $this->getPriorityOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'status' => 'required|in:backlog,todo,in_progress,review,done',
            'priority' => 'required|in:low,medium,high,urgent',
            'due_date' => 'nullable|date',
            'estimated_hours' => 'nullable|integer|min:0',
        ]);

        $task = $project->tasks()->create([
            ...$validated,
            'created_by' => Auth::id(),
            'project_id' => $project->id,
        ]);

        // Send notification if task is assigned to someone
        if ($task->assigned_to) {
            $assignee = User::find($task->assigned_to);
            $assignee->notify(new TaskAssignedNotification($task, Auth::user()));
        }

        return Redirect::route('projects.tasks.show', [$project, $task])
            ->with('success', 'Task created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project, Task $task)
    {
        $task->load([
            'project',
            'assignedUser',
            'creator',
            'timeLogs' => function ($query) {
                $query->with('user')->orderBy('start_time', 'desc');
            },
            'attachments' => function ($query) {
                $query->with('user')->latest();
            },
            'comments' => function ($query) {
                $query->with(['user', 'replies.user'])->latest();
            }
        ]);

        return Inertia::render('Tasks/Show', [
            'project' => $project,
            'task' => $task,
            'totalLoggedTime' => $task->totalLoggedTime,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project, Task $task)
    {
        $users = User::all();

        return Inertia::render('Tasks/Edit', [
            'project' => $project,
            'task' => $task,
            'users' => $users,
            'statuses' => $this->getStatusOptions(),
            'priorities' => $this->getPriorityOptions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project, Task $task)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'status' => 'required|in:backlog,todo,in_progress,review,done',
            'priority' => 'required|in:low,medium,high,urgent',
            'due_date' => 'nullable|date',
            'estimated_hours' => 'nullable|integer|min:0',
            'actual_hours' => 'nullable|integer|min:0',
        ]);

        // Check if assigned_to has changed
        $previousAssignedTo = $task->assigned_to;

        $task->update($validated);

        // Send notification if task is newly assigned to someone
        if ($task->assigned_to && $task->assigned_to !== $previousAssignedTo) {
            $assignee = User::find($task->assigned_to);
            $assignee->notify(new TaskAssignedNotification($task, Auth::user()));
        }

        return Redirect::route('projects.tasks.show', [$project, $task])
            ->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project, Task $task)
    {
        $task->delete();

        return Redirect::route('projects.tasks.index', $project)
            ->with('success', 'Task deleted successfully.');
    }

    /**
     * Display the Kanban board for the project.
     */
    public function kanban(Project $project)
    {
        $tasks = $project->tasks()
            ->with(['assignedUser', 'creator'])
            ->get()
            ->groupBy('status');

        // Ensure all status columns exist even if empty
        $statuses = ['backlog', 'todo', 'in_progress', 'review', 'done'];
        foreach ($statuses as $status) {
            if (!isset($tasks[$status])) {
                $tasks[$status] = collect();
            }
        }

        return Inertia::render('Tasks/Kanban', [
            'project' => $project,
            'tasks' => $tasks,
        ]);
    }

    /**
     * Get the status options for tasks.
     */
    private function getStatusOptions(): array
    {
        return [
            ['value' => 'backlog', 'label' => 'Backlog'],
            ['value' => 'todo', 'label' => 'To Do'],
            ['value' => 'in_progress', 'label' => 'In Progress'],
            ['value' => 'review', 'label' => 'Review'],
            ['value' => 'done', 'label' => 'Done'],
        ];
    }

    /**
     * Get the priority options for tasks.
     */
    private function getPriorityOptions(): array
    {
        return [
            ['value' => 'low', 'label' => 'Low'],
            ['value' => 'medium', 'label' => 'Medium'],
            ['value' => 'high', 'label' => 'High'],
            ['value' => 'urgent', 'label' => 'Urgent'],
        ];
    }
}
