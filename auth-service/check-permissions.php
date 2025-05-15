<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;

// Get all users with their roles
$users = User::with('roles')->get();

echo "=== Users and Their Roles ===\n";
foreach ($users as $user) {
    echo "User: {$user->name} ({$user->email})\n";
    echo "Roles: ";
    if ($user->roles->count() > 0) {
        foreach ($user->roles as $role) {
            echo "{$role->name}, ";
        }
    } else {
        echo "No roles assigned";
    }
    echo "\n\n";
}

// Get all roles with their permissions
$roles = Role::with('permissions')->get();

echo "=== Roles and Their Permissions ===\n";
foreach ($roles as $role) {
    echo "Role: {$role->name} ({$role->description})\n";
    echo "Permissions: ";
    if ($role->permissions->count() > 0) {
        foreach ($role->permissions as $permission) {
            echo "{$permission->name}, ";
        }
    } else {
        echo "No permissions assigned";
    }
    echo "\n\n";
}

// Get all permissions
$permissions = Permission::all();

echo "=== All Permissions ===\n";
foreach ($permissions as $permission) {
    echo "Permission: {$permission->name} ({$permission->description})\n";
}

// Create an admin user with admin role if it doesn't exist
$adminEmail = 'admin@tekrem.com';
$adminUser = User::where('email', $adminEmail)->first();

if (!$adminUser) {
    echo "\n=== Creating Admin User ===\n";
    $adminUser = User::create([
        'name' => 'Admin User',
        'email' => $adminEmail,
        'password' => Hash::make('password'),
        'email_verified_at' => now(),
    ]);
    echo "Admin user created with email: {$adminEmail}\n";
} else {
    echo "\n=== Admin User Already Exists ===\n";
}

// Get the admin role
$adminRole = Role::where('name', 'admin')->first();

if ($adminRole) {
    // Check if the admin user has the admin role
    if (!$adminUser->roles->contains($adminRole->id)) {
        $adminUser->roles()->attach($adminRole->id);
        echo "Admin role assigned to admin user\n";
    } else {
        echo "Admin user already has admin role\n";
    }
} else {
    echo "Admin role not found\n";
}

// Check if the admin user has the necessary permissions
echo "\n=== Admin User Permissions ===\n";
$requiredPermissions = [
    'view_users', 'create_users', 'edit_users', 'delete_users',
    'view_roles', 'create_roles', 'edit_roles', 'delete_roles',
    'view_permissions', 'assign_permissions'
];

foreach ($requiredPermissions as $permName) {
    $hasPerm = $adminUser->roles()->whereHas('permissions', function ($query) use ($permName) {
        $query->where('permissions.name', $permName);
    })->exists();
    
    echo "Permission '{$permName}': " . ($hasPerm ? "YES" : "NO") . "\n";
}

echo "\nDone!\n";
