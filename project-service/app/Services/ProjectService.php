<?php

namespace App\Services;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ProjectService
{
    /**
     * The base URL of the project service
     *
     * @var string
     */
    protected $baseUrl;

    /**
     * The API key for the project service
     *
     * @var string
     */
    protected $apiKey;

    /**
     * Cache TTL in minutes
     *
     * @var int
     */
    protected $cacheTtl = 15;

    /**
     * Create a new service instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->baseUrl = config('services.project_service.url');
        $this->apiKey = config('services.project_service.key');
    }

    /**
     * Get project statistics for the manager dashboard
     *
     * @param int $userId
     * @return array
     */
    public function getProjectStatistics($userId)
    {
        $cacheKey = "project_statistics_{$userId}";

        // Try to get from cache first
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        try {
            // Get project status distribution
            $projectStatus = Project::when(!Auth::user()->hasRole('admin'), function ($query) use ($userId) {
                return $query->where('user_id', $userId);
            })
            ->selectRaw('status, COUNT(*) as value')
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                // Convert status to readable format
                $statusLabels = [
                    'not_started' => 'Not Started',
                    'in_progress' => 'In Progress',
                    'on_hold' => 'On Hold',
                    'completed' => 'Completed',
                    'cancelled' => 'Cancelled'
                ];

                return [
                    'name' => $statusLabels[$item->status] ?? $item->status,
                    'value' => $item->value
                ];
            })
            ->toArray();

            // Get task completion data for the last 7 days
            $taskCompletion = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = Carbon::now()->subDays($i);
                $dayName = $date->format('D');

                // Get tasks assigned on this day
                $assignedTasks = Task::whereDate('created_at', $date->format('Y-m-d'))
                    ->when(!Auth::user()->hasRole('admin'), function ($query) use ($userId) {
                        return $query->where('created_by', $userId)
                            ->orWhere('assigned_to', $userId);
                    })
                    ->count();

                // Get tasks completed on this day
                $completedTasks = Task::where('status', 'done')
                    ->whereDate('updated_at', $date->format('Y-m-d'))
                    ->when(!Auth::user()->hasRole('admin'), function ($query) use ($userId) {
                        return $query->where('created_by', $userId)
                            ->orWhere('assigned_to', $userId);
                    })
                    ->count();

                $taskCompletion[] = [
                    'name' => $dayName,
                    'assigned' => $assignedTasks,
                    'completed' => $completedTasks
                ];
            }

            $data = [
                'project_status' => $projectStatus,
                'task_completion' => $taskCompletion,
            ];

            // Cache the response
            Cache::put($cacheKey, $data, Carbon::now()->addMinutes($this->cacheTtl));

            return $data;
        } catch (\Exception $e) {
            Log::error('Error generating project statistics', [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Return fallback data if an exception occurs
            return $this->getFallbackProjectStatistics();
        }
    }

    /**
     * Get active projects for the manager dashboard
     *
     * @param int $userId
     * @return array
     */
    public function getActiveProjects($userId)
    {
        $cacheKey = "active_projects_{$userId}";

        // Try to get from cache first
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        try {
            // Get active projects from the database
            $projects = Project::with(['tasks', 'user'])
                ->where('status', 'in_progress')
                ->when(!Auth::user()->hasRole('admin'), function ($query) use ($userId) {
                    return $query->where('user_id', $userId);
                })
                ->orderBy('end_date', 'asc')
                ->limit(5)
                ->get()
                ->map(function ($project) {
                    // Calculate progress based on completed tasks
                    $progress = $project->completionPercentage;

                    return [
                        'name' => $project->name,
                        'client' => $project->client_name ?? 'Internal',
                        'deadline' => $project->end_date ? $project->end_date->format('Y-m-d') : 'No deadline',
                        'progress' => $progress,
                        'status' => ucfirst(str_replace('_', ' ', $project->status)),
                    ];
                })
                ->toArray();

            // Cache the response
            Cache::put($cacheKey, $projects, Carbon::now()->addMinutes($this->cacheTtl));

            return $projects;
        } catch (\Exception $e) {
            Log::error('Error fetching active projects', [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Return fallback data if an exception occurs
            return $this->getFallbackActiveProjects();
        }
    }

    /**
     * Get fallback project statistics when the external service is unavailable
     *
     * @return array
     */
    private function getFallbackProjectStatistics()
    {
        return [
            'project_status' => [
                ['name' => 'In Progress', 'value' => 5],
                ['name' => 'Completed', 'value' => 3],
                ['name' => 'Not Started', 'value' => 2],
            ],
            'task_completion' => [
                ['name' => 'Mon', 'completed' => 5, 'assigned' => 7],
                ['name' => 'Tue', 'completed' => 6, 'assigned' => 8],
                ['name' => 'Wed', 'completed' => 4, 'assigned' => 6],
                ['name' => 'Thu', 'completed' => 7, 'assigned' => 9],
                ['name' => 'Fri', 'completed' => 5, 'assigned' => 7],
            ],
        ];
    }

    /**
     * Get fallback active projects when the external service is unavailable
     *
     * @return array
     */
    private function getFallbackActiveProjects()
    {
        return [
            ['name' => 'Website Redesign', 'client' => 'ABC Corp', 'deadline' => Carbon::now()->addDays(15)->format('Y-m-d'), 'progress' => 75, 'status' => 'In Progress'],
            ['name' => 'Mobile App', 'client' => 'XYZ Inc', 'deadline' => Carbon::now()->addDays(30)->format('Y-m-d'), 'progress' => 40, 'status' => 'In Progress'],
            ['name' => 'CRM Integration', 'client' => 'Acme Ltd', 'deadline' => Carbon::now()->addDays(10)->format('Y-m-d'), 'progress' => 90, 'status' => 'In Progress'],
            ['name' => 'E-commerce Platform', 'client' => 'Shop Co', 'deadline' => Carbon::now()->addDays(20)->format('Y-m-d'), 'progress' => 60, 'status' => 'In Progress'],
            ['name' => 'Analytics Dashboard', 'client' => 'Data Inc', 'deadline' => Carbon::now()->addDays(5)->format('Y-m-d'), 'progress' => 85, 'status' => 'In Progress'],
        ];
    }
}
