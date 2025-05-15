<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class PermissionController extends Controller
{
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

        // Check if user has permission to view permissions
        if (! Gate::allows('view_permissions')) {
            if ($isApiRequest) {
                return response()->json(['message' => 'Unauthorized. You do not have permission to view permissions.'], 403);
            }
            abort(403);
        }

        // Log the authenticated user for debugging
        \Illuminate\Support\Facades\Log::info('Permissions accessed by user', [
            'user_id' => $request->user()->id,
            'user_email' => $request->user()->email,
            'is_api_request' => $isApiRequest
        ]);

        // Get permissions with roles
        $permissions = Permission::with('roles')->get();

        // Return JSON for API requests, Inertia view for web requests
        if ($isApiRequest) {
            return response()->json($permissions);
        }

        return Inertia::render('Permissions/Index', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (! Gate::allows('assign_permissions')) {
            abort(403);
        }

        return Inertia::render('Permissions/Create', [
            'roles' => Role::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (! Gate::allows('assign_permissions')) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions',
            'description' => 'nullable|string|max:255',
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,id',
        ]);

        $permission = Permission::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
        ]);

        if (isset($validated['roles'])) {
            $permission->roles()->attach($validated['roles']);
        }

        return redirect()->route('permissions.index')
            ->with('message', 'Permission created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        if (! Gate::allows('view_permissions')) {
            abort(403);
        }

        $permission = Permission::with('roles')->findOrFail($id);

        return Inertia::render('Permissions/Show', [
            'permission' => $permission,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        if (! Gate::allows('assign_permissions')) {
            abort(403);
        }

        $permission = Permission::with('roles')->findOrFail($id);

        return Inertia::render('Permissions/Edit', [
            'permission' => $permission,
            'roles' => Role::all(),
            'permissionRoles' => $permission->roles->pluck('id')->toArray(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        if (! Gate::allows('assign_permissions')) {
            abort(403);
        }

        $permission = Permission::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,' . $id,
            'description' => 'nullable|string|max:255',
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,id',
        ]);

        $permission->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
        ]);

        if (isset($validated['roles'])) {
            $permission->roles()->sync($validated['roles']);
        } else {
            $permission->roles()->detach();
        }

        return redirect()->route('permissions.index')
            ->with('message', 'Permission updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        if (! Gate::allows('assign_permissions')) {
            abort(403);
        }

        $permission = Permission::findOrFail($id);

        // Don't allow deleting core permissions
        $corePermissions = [
            'view_users', 'create_users', 'edit_users', 'delete_users',
            'view_roles', 'create_roles', 'edit_roles', 'delete_roles',
            'view_permissions', 'assign_permissions'
        ];

        if (in_array($permission->name, $corePermissions)) {
            return redirect()->route('permissions.index')
                ->with('error', 'Cannot delete core permissions.');
        }

        // Detach all roles
        $permission->roles()->detach();

        $permission->delete();

        return redirect()->route('permissions.index')
            ->with('message', 'Permission deleted successfully.');
    }
}
