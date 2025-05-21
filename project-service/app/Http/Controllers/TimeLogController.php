<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TimeLog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class TimeLogController extends Controller
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
    public function index(Task $task)
    {
        $timeLogs = $task->timeLogs()
            ->with('user')
            ->orderBy('start_time', 'desc')
            ->paginate(10);

        return Inertia::render('TimeLogs/Index', [
            'task' => $task->load('project'),
            'timeLogs' => $timeLogs,
        ]);
    }

    /**
     * Display a listing of all time logs.
     */
    public function allLogs()
    {
        $timeLogs = TimeLog::with(['task.project', 'user'])
            ->when(!Auth::user()->hasRole('admin'), function ($query) {
                return $query->where('user_id', Auth::id());
            })
            ->orderBy('start_time', 'desc')
            ->paginate(10);

        return Inertia::render('TimeLogs/AllLogs', [
            'timeLogs' => $timeLogs,
        ]);
    }

    /**
     * Display a listing of time logs for the current user.
     */
    public function myLogs()
    {
        $timeLogs = TimeLog::with(['task.project'])
            ->where('user_id', Auth::id())
            ->orderBy('start_time', 'desc')
            ->paginate(10);

        return Inertia::render('TimeLogs/MyLogs', [
            'timeLogs' => $timeLogs,
        ]);
    }

    /**
     * Display time log reports.
     */
    public function reports()
    {
        // Get time logs for the last 30 days
        $startDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now();

        $timeLogs = TimeLog::with(['task.project', 'user'])
            ->whereBetween('start_time', [$startDate, $endDate])
            ->when(!Auth::user()->hasRole('admin'), function ($query) {
                return $query->where('user_id', Auth::id());
            })
            ->get();

        // Group by date
        $logsByDate = $timeLogs->groupBy(function ($log) {
            return Carbon::parse($log->start_time)->format('Y-m-d');
        });

        // Group by project
        $logsByProject = $timeLogs->groupBy(function ($log) {
            return $log->task->project->name;
        });

        // Group by user
        $logsByUser = $timeLogs->groupBy(function ($log) {
            return $log->user->name;
        });

        return Inertia::render('TimeLogs/Reports', [
            'logsByDate' => $logsByDate,
            'logsByProject' => $logsByProject,
            'logsByUser' => $logsByUser,
            'startDate' => $startDate->format('Y-m-d'),
            'endDate' => $endDate->format('Y-m-d'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Task $task)
    {
        $validated = $request->validate([
            'start_time' => 'required|date',
            'end_time' => 'nullable|date|after:start_time',
            'description' => 'nullable|string',
            'is_billable' => 'boolean',
        ]);

        $timeLog = $task->timeLogs()->create([
            ...$validated,
            'user_id' => Auth::id(),
        ]);

        // Calculate duration if end_time is provided
        if (isset($validated['end_time'])) {
            $timeLog->calculateDuration();
        }

        return Redirect::route('tasks.time-logs.index', $task)
            ->with('success', 'Time log created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task, TimeLog $timeLog)
    {
        $validated = $request->validate([
            'start_time' => 'required|date',
            'end_time' => 'nullable|date|after:start_time',
            'description' => 'nullable|string',
            'is_billable' => 'boolean',
        ]);

        $timeLog->update($validated);

        // Recalculate duration if end_time is provided
        if (isset($validated['end_time'])) {
            $timeLog->calculateDuration();
        }

        return Redirect::route('tasks.time-logs.index', $task)
            ->with('success', 'Time log updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task, TimeLog $timeLog)
    {
        $timeLog->delete();

        return Redirect::route('tasks.time-logs.index', $task)
            ->with('success', 'Time log deleted successfully.');
    }

    /**
     * Start a timer for a task.
     */
    public function startTimer(Task $task)
    {
        // Check if there's already an active timer for this user
        $activeTimer = TimeLog::where('user_id', Auth::id())
            ->whereNull('end_time')
            ->first();

        if ($activeTimer) {
            return Redirect::back()
                ->with('error', 'You already have an active timer. Please stop it before starting a new one.');
        }

        // Create a new time log with start_time
        $timeLog = $task->timeLogs()->create([
            'user_id' => Auth::id(),
            'start_time' => now(),
            'is_billable' => true,
        ]);

        return Redirect::back()
            ->with('success', 'Timer started successfully.');
    }

    /**
     * Stop a timer for a task.
     */
    public function stopTimer(Request $request, Task $task)
    {
        // Find the active timer for this user and task
        $activeTimer = TimeLog::where('user_id', Auth::id())
            ->where('task_id', $task->id)
            ->whereNull('end_time')
            ->first();

        if (!$activeTimer) {
            return Redirect::back()
                ->with('error', 'No active timer found for this task.');
        }

        // Update the time log with end_time and description
        $activeTimer->update([
            'end_time' => now(),
            'description' => $request->input('description'),
        ]);

        // Calculate duration
        $activeTimer->calculateDuration();

        return Redirect::back()
            ->with('success', 'Timer stopped successfully.');
    }
}
