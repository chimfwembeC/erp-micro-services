<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\TimeLog;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display the dashboard with summary reports.
     */
    public function dashboard()
    {
        $user = Auth::user();

        // Get counts
        $projectCount = Project::count();
        $taskCount = Task::count();
        $completedTaskCount = Task::where('status', 'done')->count();
        $userCount = User::count();

        // Get tasks by status
        $tasksByStatus = Task::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item['status'] => $item['count']];
            });

        // Get tasks by priority
        $tasksByPriority = Task::select('priority', DB::raw('count(*) as count'))
            ->groupBy('priority')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item['priority'] => $item['count']];
            });

        // Get recent projects
        $recentProjects = Project::with('user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Get upcoming due tasks
        $upcomingTasks = Task::with(['project', 'assignedUser'])
            ->where('status', '!=', 'done')
            ->whereNotNull('due_date')
            ->where('due_date', '>=', Carbon::now())
            ->orderBy('due_date')
            ->take(5)
            ->get();

        // Get overdue tasks
        $overdueTasks = Task::with(['project', 'assignedUser'])
            ->where('status', '!=', 'done')
            ->whereNotNull('due_date')
            ->where('due_date', '<', Carbon::now())
            ->orderBy('due_date')
            ->take(5)
            ->get();

        return Inertia::render('Reports/Dashboard', [
            'stats' => [
                'projectCount' => $projectCount,
                'taskCount' => $taskCount,
                'completedTaskCount' => $completedTaskCount,
                'completionRate' => $taskCount > 0 ? round(($completedTaskCount / $taskCount) * 100, 2) : 0,
                'userCount' => $userCount,
            ],
            'tasksByStatus' => $tasksByStatus,
            'tasksByPriority' => $tasksByPriority,
            'recentProjects' => $recentProjects,
            'upcomingTasks' => $upcomingTasks,
            'overdueTasks' => $overdueTasks,
        ]);
    }

    /**
     * Display project reports.
     */
    public function projectReports(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->subMonths(3)->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::now()->format('Y-m-d'));

        // Get projects created in the date range
        $projects = Project::whereBetween('created_at', [$startDate, $endDate])
            ->withCount('tasks')
            ->with('user')
            ->get();

        // Get project completion rates
        $projectCompletionRates = Project::withCount([
                'tasks',
                'tasks as completed_tasks_count' => function ($query) {
                    $query->where('status', 'done');
                }
            ])
            ->having('tasks_count', '>', 0)
            ->get()
            ->map(function ($project) {
                return [
                    'id' => $project->id,
                    'name' => $project->name,
                    'completion_rate' => round(($project->completed_tasks_count / $project->tasks_count) * 100, 2),
                    'tasks_count' => $project->tasks_count,
                    'completed_tasks_count' => $project->completed_tasks_count,
                ];
            });

        // Get projects by status
        $projectsByStatus = Project::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item['status'] => $item['count']];
            });

        return Inertia::render('Reports/ProjectReports', [
            'projects' => $projects,
            'projectCompletionRates' => $projectCompletionRates,
            'projectsByStatus' => $projectsByStatus,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }

    /**
     * Display task reports.
     */
    public function taskReports(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->subMonths(3)->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::now()->format('Y-m-d'));
        $projectId = $request->input('project_id');

        $query = Task::whereBetween('created_at', [$startDate, $endDate])
            ->with(['project', 'assignedUser']);

        if ($projectId) {
            $query->where('project_id', $projectId);
        }

        $tasks = $query->get();

        // Get tasks by status
        $tasksByStatus = Task::select('status', DB::raw('count(*) as count'))
            ->when($projectId, function ($query) use ($projectId) {
                return $query->where('project_id', $projectId);
            })
            ->groupBy('status')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item['status'] => $item['count']];
            });

        // Get tasks by priority
        $tasksByPriority = Task::select('priority', DB::raw('count(*) as count'))
            ->when($projectId, function ($query) use ($projectId) {
                return $query->where('project_id', $projectId);
            })
            ->groupBy('priority')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item['priority'] => $item['count']];
            });

        // Get tasks by assignee
        $tasksByAssignee = Task::whereNotNull('assigned_to')
            ->when($projectId, function ($query) use ($projectId) {
                return $query->where('project_id', $projectId);
            })
            ->with('assignedUser')
            ->get()
            ->groupBy('assignedUser.name')
            ->map(function ($tasks) {
                return $tasks->count();
            });

        // Get projects for filter
        $projects = Project::orderBy('name')->get();

        return Inertia::render('Reports/TaskReports', [
            'tasks' => $tasks,
            'tasksByStatus' => $tasksByStatus,
            'tasksByPriority' => $tasksByPriority,
            'tasksByAssignee' => $tasksByAssignee,
            'projects' => $projects,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'project_id' => $projectId,
            ],
        ]);
    }

    /**
     * Display time tracking reports.
     */
    public function timeReports(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->subMonths(1)->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::now()->format('Y-m-d'));
        $userId = $request->input('user_id');
        $projectId = $request->input('project_id');

        $query = TimeLog::whereBetween('start_time', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->with(['task.project', 'user']);

        if ($userId) {
            $query->where('user_id', $userId);
        }

        if ($projectId) {
            $query->whereHas('task', function ($q) use ($projectId) {
                $q->where('project_id', $projectId);
            });
        }

        $timeLogs = $query->get();

        // Calculate total hours by day
        $period = CarbonPeriod::create($startDate, $endDate);
        $hoursByDay = [];

        foreach ($period as $date) {
            $dateString = $date->format('Y-m-d');
            $hoursByDay[$dateString] = 0;
        }

        foreach ($timeLogs as $log) {
            $date = Carbon::parse($log->start_time)->format('Y-m-d');
            if (isset($hoursByDay[$date])) {
                $hoursByDay[$date] += $log->duration_minutes / 60;
            }
        }

        // Calculate hours by project
        $hoursByProject = $timeLogs
            ->groupBy('task.project.name')
            ->map(function ($logs) {
                return round($logs->sum('duration_minutes') / 60, 2);
            });

        // Calculate hours by user
        $hoursByUser = $timeLogs
            ->groupBy('user.name')
            ->map(function ($logs) {
                return round($logs->sum('duration_minutes') / 60, 2);
            });

        // Get users and projects for filters
        $users = User::orderBy('name')->get();
        $projects = Project::orderBy('name')->get();

        return Inertia::render('Reports/TimeReports', [
            'timeLogs' => $timeLogs,
            'hoursByDay' => $hoursByDay,
            'hoursByProject' => $hoursByProject,
            'hoursByUser' => $hoursByUser,
            'totalHours' => round($timeLogs->sum('duration_minutes') / 60, 2),
            'users' => $users,
            'projects' => $projects,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'user_id' => $userId,
                'project_id' => $projectId,
            ],
        ]);
    }
}
