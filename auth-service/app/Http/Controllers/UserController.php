<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
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

        // Check if user has permission to view users
        if (! Gate::allows('view_users')) {
            if ($isApiRequest) {
                return response()->json(['message' => 'Unauthorized. You do not have permission to view users.'], 403);
            }
            abort(403);
        }

        // Log the authenticated user for debugging
        \Illuminate\Support\Facades\Log::info('Users accessed by user', [
            'user_id' => $request->user()->id,
            'user_email' => $request->user()->email,
            'is_api_request' => $isApiRequest
        ]);

        // Get users with roles and direct permissions
        $users = User::with(['roles', 'directPermissions'])->get();

        // Return JSON for API requests, Inertia view for web requests
        if ($isApiRequest) {
            return response()->json($users);
        }

        return Inertia::render('Users/Index', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (! Gate::allows('create_users')) {
            abort(403);
        }

        // Check if the user has permission to assign roles and direct permissions
        $canAssignRoles = Gate::allows('assign_roles');
        $canAssignDirectPermissions = Gate::allows('assign_direct_permissions');

        return Inertia::render('Users/Create', [
            'roles' => Role::all(),
            'permissions' => Permission::all(),
            'canAssignRoles' => $canAssignRoles,
            'canAssignDirectPermissions' => $canAssignDirectPermissions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (! Gate::allows('create_users')) {
            abort(403);
        }

        // Determine validation rules based on permissions
        $validationRules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ];

        // Only include roles validation if user has permission to assign roles
        if (Gate::allows('assign_roles')) {
            $validationRules['roles'] = 'required|array';
            $validationRules['roles.*'] = 'exists:roles,id';
        }

        // Only include direct permissions validation if user has permission to assign direct permissions
        if (Gate::allows('assign_direct_permissions')) {
            $validationRules['directPermissions'] = 'nullable|array';
            $validationRules['directPermissions.*'] = 'exists:permissions,id';
        }

        $validated = $request->validate($validationRules);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Only attach roles if user has permission to assign roles
        if (Gate::allows('assign_roles') && isset($validated['roles'])) {
            $user->roles()->attach($validated['roles']);
        } else {
            // If no roles assigned or no permission, assign default 'user' role
            $defaultRole = Role::where('name', 'user')->first();
            if ($defaultRole) {
                $user->roles()->attach($defaultRole->id);
            }
        }

        // Only attach direct permissions if user has permission to assign direct permissions
        if (Gate::allows('assign_direct_permissions') && isset($validated['directPermissions'])) {
            $user->directPermissions()->attach($validated['directPermissions']);
        }

        return redirect()->route('users.index')
            ->with('message', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        if (! Gate::allows('view_users')) {
            abort(403);
        }

        $user = User::with(['roles', 'directPermissions'])->findOrFail($id);

        return Inertia::render('Users/Show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        if (! Gate::allows('edit_users')) {
            abort(403);
        }

        $user = User::with(['roles', 'directPermissions'])->findOrFail($id);

        // Check if the user has permission to assign roles and direct permissions
        $canAssignRoles = Gate::allows('assign_roles');
        $canAssignDirectPermissions = Gate::allows('assign_direct_permissions');

        return Inertia::render('Users/Edit', [
            'user' => $user,
            'roles' => Role::all(),
            'permissions' => Permission::all(),
            'userRoles' => $user->roles->pluck('id')->toArray(),
            'userDirectPermissions' => $user->directPermissions->pluck('id')->toArray(),
            'canAssignRoles' => $canAssignRoles,
            'canAssignDirectPermissions' => $canAssignDirectPermissions,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        if (! Gate::allows('edit_users')) {
            abort(403);
        }

        $user = User::findOrFail($id);

        // Determine validation rules based on permissions
        $validationRules = [
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($id)],
            'password' => 'nullable|string|min:8|confirmed',
        ];

        // Only include roles validation if user has permission to assign roles
        if (Gate::allows('assign_roles')) {
            $validationRules['roles'] = 'required|array';
            $validationRules['roles.*'] = 'exists:roles,id';
        }

        // Only include direct permissions validation if user has permission to assign direct permissions
        if (Gate::allows('assign_direct_permissions')) {
            $validationRules['directPermissions'] = 'nullable|array';
            $validationRules['directPermissions.*'] = 'exists:permissions,id';
        }

        $validated = $request->validate($validationRules);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if (isset($validated['password']) && !empty($validated['password'])) {
            $user->update([
                'password' => Hash::make($validated['password']),
            ]);
        }

        // Only sync roles if user has permission to assign roles
        if (Gate::allows('assign_roles') && isset($validated['roles'])) {
            $user->roles()->sync($validated['roles']);
        }

        // Only sync direct permissions if user has permission to assign direct permissions
        if (Gate::allows('assign_direct_permissions') && isset($validated['directPermissions'])) {
            $user->directPermissions()->sync($validated['directPermissions']);
        }

        return redirect()->route('users.index')
            ->with('message', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        if (! Gate::allows('delete_users')) {
            abort(403);
        }

        $user = User::findOrFail($id);

        // Don't allow deleting the admin user
        if ($user->hasRole('admin') && User::whereHas('roles', function ($query) {
            $query->where('name', 'admin');
        })->count() <= 1) {
            return redirect()->route('users.index')
                ->with('error', 'Cannot delete the only admin user.');
        }

        // Detach all roles and direct permissions
        $user->roles()->detach();
        $user->directPermissions()->detach();

        $user->delete();

        return redirect()->route('users.index')
            ->with('message', 'User deleted successfully.');
    }
}
