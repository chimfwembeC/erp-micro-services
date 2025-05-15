<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Get statistics for roles dashboard.
     */
    public function statistics(Request $request)
    {
        // Ensure the user is authenticated
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Check if user has permission to view roles
        if (! Gate::allows('view_roles')) {
            return response()->json(['message' => 'Unauthorized. You do not have permission to view roles.'], 403);
        }

        // Log the authenticated user for debugging
        \Illuminate\Support\Facades\Log::info('Roles statistics accessed by user', [
            'user_id' => $request->user()->id,
            'user_email' => $request->user()->email,
        ]);

        // Get total counts
        $totalRoles = Role::count();
        $totalPermissions = Permission::count();
        $totalUsers = \App\Models\User::count();

        // Get roles with user counts and permission counts
        $roles = Role::withCount(['users', 'permissions'])
            ->with('permissions')
            ->get()
            ->map(function ($role) use ($totalUsers) {
                // Calculate percentage of users with this role
                $percentageOfUsers = $totalUsers > 0 ? round(($role->users_count / $totalUsers) * 100, 2) : 0;

                // Get last modified date (either role update or last user assignment)
                $lastModified = $role->updated_at;

                // Get most commonly used permissions (top 5)
                $commonPermissions = $role->permissions->take(5)->map(function ($permission) {
                    return [
                        'id' => $permission->id,
                        'name' => $permission->name,
                    ];
                });

                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'description' => $role->description,
                    'users_count' => $role->users_count,
                    'permissions_count' => $role->permissions_count,
                    'percentage_of_users' => $percentageOfUsers,
                    'last_modified' => $lastModified,
                    'common_permissions' => $commonPermissions,
                    'created_at' => $role->created_at,
                    'updated_at' => $role->updated_at,
                ];
            });

        // Get role distribution data for charts
        $roleDistribution = $roles->map(function ($role) {
            return [
                'name' => $role['name'],
                'value' => $role['users_count'],
            ];
        });

        // Get permission usage data
        $permissionUsage = Permission::withCount('roles')
            ->orderBy('roles_count', 'desc')
            ->take(10)
            ->get()
            ->map(function ($permission) {
                return [
                    'name' => $permission->name,
                    'value' => $permission->roles_count,
                ];
            });

        return response()->json([
            'summary' => [
                'total_roles' => $totalRoles,
                'total_permissions' => $totalPermissions,
                'total_users' => $totalUsers,
            ],
            'roles' => $roles,
            'role_distribution' => $roleDistribution,
            'permission_usage' => $permissionUsage,
        ]);
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Check if this is an API request or a web request
        $isApiRequest = $request->expectsJson() || $request->is('api/*');

        // Ensure the user is authenticated
        if (!$request->user()) {
            if ($isApiRequest) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            abort(401);
        }

        // Check if user has permission to view roles
        if (! Gate::allows('view_roles')) {
            if ($isApiRequest) {
                return response()->json(['message' => 'Unauthorized. You do not have permission to view roles.'], 403);
            }
            abort(403);
        }

        // Log the authenticated user for debugging
        \Illuminate\Support\Facades\Log::info('Roles accessed by user', [
            'user_id' => $request->user()->id,
            'user_email' => $request->user()->email,
            'is_api_request' => $isApiRequest
        ]);

        // Get roles with permissions
        $roles = Role::with('permissions')->get();

        // Return JSON for API requests, Inertia view for web requests
        if ($isApiRequest) {
            return response()->json($roles);
        }

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (! Gate::allows('create_roles')) {
            abort(403);
        }

        return Inertia::render('Roles/Create', [
            'permissions' => Permission::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (! Gate::allows('create_roles')) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles',
            'description' => 'nullable|string|max:255',
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
        ]);

        $role->permissions()->attach($validated['permissions']);

        return redirect()->route('roles.index')
            ->with('message', 'Role created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        if (! Gate::allows('view_roles')) {
            abort(403);
        }

        $role = Role::with('permissions')->findOrFail($id);

        return Inertia::render('Roles/Show', [
            'role' => $role,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        if (! Gate::allows('edit_roles')) {
            abort(403);
        }

        $role = Role::with('permissions')->findOrFail($id);

        return Inertia::render('Roles/Edit', [
            'role' => $role,
            'permissions' => Permission::all(),
            'rolePermissions' => $role->permissions->pluck('id')->toArray(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        if (! Gate::allows('edit_roles')) {
            abort(403);
        }

        $role = Role::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $id,
            'description' => 'nullable|string|max:255',
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
        ]);

        $role->permissions()->sync($validated['permissions']);

        return redirect()->route('roles.index')
            ->with('message', 'Role updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        if (! Gate::allows('delete_roles')) {
            abort(403);
        }

        $role = Role::findOrFail($id);

        // Don't allow deleting the admin role
        if ($role->name === 'admin') {
            return redirect()->route('roles.index')
                ->with('error', 'Cannot delete the admin role.');
        }

        // Detach all permissions
        $role->permissions()->detach();

        // Detach all users
        $role->users()->detach();

        $role->delete();

        return redirect()->route('roles.index')
            ->with('message', 'Role deleted successfully.');
    }
}
