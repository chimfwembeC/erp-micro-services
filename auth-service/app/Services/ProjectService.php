<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
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
            // Make API request to the project service
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'Accept' => 'application/json',
            ])->get("{$this->baseUrl}/api/projects/statistics", [
                'user_id' => $userId,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                // Cache the response
                Cache::put($cacheKey, $data, Carbon::now()->addMinutes($this->cacheTtl));
                
                return $data;
            }
            
            Log::warning('Failed to fetch project statistics from external service', [
                'status' => $response->status(),
                'response' => $response->body(),
            ]);
            
            // Return fallback data if the request fails
            return $this->getFallbackProjectStatistics();
        } catch (\Exception $e) {
            Log::error('Error fetching project statistics from external service', [
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
            // Make API request to the project service
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'Accept' => 'application/json',
            ])->get("{$this->baseUrl}/api/projects/active", [
                'user_id' => $userId,
                'limit' => 5,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                // Cache the response
                Cache::put($cacheKey, $data, Carbon::now()->addMinutes($this->cacheTtl));
                
                return $data;
            }
            
            Log::warning('Failed to fetch active projects from external service', [
                'status' => $response->status(),
                'response' => $response->body(),
            ]);
            
            // Return fallback data if the request fails
            return $this->getFallbackActiveProjects();
        } catch (\Exception $e) {
            Log::error('Error fetching active projects from external service', [
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
