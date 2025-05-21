<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ProjectController extends Controller
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
    public function index()
    {
        $projects = Project::with('user')
            ->when(!Auth::user()->hasRole('admin'), function ($query) {
                return $query->where('user_id', Auth::id());
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::all();

        return Inertia::render('Projects/Create', [
            'users' => $users,
            'statuses' => $this->getStatusOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'required|in:not_started,in_progress,on_hold,completed,cancelled',
            'user_id' => 'required|exists:users,id',
            'client_name' => 'nullable|string|max:255',
            'budget' => 'nullable|numeric|min:0',
        ]);

        $project = Project::create($validated);

        return Redirect::route('projects.show', $project)
            ->with('success', 'Project created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        $project->load([
            'user',
            'tasks' => function ($query) {
                $query->with(['assignedUser', 'creator']);
            },
            'attachments' => function ($query) {
                $query->with('user')->latest();
            }
        ]);

        return Inertia::render('Projects/Show', [
            'project' => $project,
            'tasks' => $project->tasks,
            'completionPercentage' => $project->completionPercentage,
            'totalEstimatedHours' => $project->totalEstimatedHours,
            'totalActualHours' => $project->totalActualHours,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        $users = User::all();

        return Inertia::render('Projects/Edit', [
            'project' => $project,
            'users' => $users,
            'statuses' => $this->getStatusOptions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'required|in:not_started,in_progress,on_hold,completed,cancelled',
            'user_id' => 'required|exists:users,id',
            'client_name' => 'nullable|string|max:255',
            'budget' => 'nullable|numeric|min:0',
        ]);

        $project->update($validated);

        return Redirect::route('projects.show', $project)
            ->with('success', 'Project updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $project->delete();

        return Redirect::route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }

    /**
     * Get the status options for projects.
     */
    private function getStatusOptions(): array
    {
        return [
            ['value' => 'not_started', 'label' => 'Not Started'],
            ['value' => 'in_progress', 'label' => 'In Progress'],
            ['value' => 'on_hold', 'label' => 'On Hold'],
            ['value' => 'completed', 'label' => 'Completed'],
            ['value' => 'cancelled', 'label' => 'Cancelled'],
        ];
    }
}
