<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Role;

// Get all roles
$adminRole = Role::where('name', 'admin')->first();
$managerRole = Role::where('name', 'manager')->first();
$userRole = Role::where('name', 'user')->first();

if (!$adminRole || !$managerRole || !$userRole) {
    echo "Error: One or more roles not found. Please run the RolesAndPermissionsSeeder first.\n";
    exit(1);
}

// Get all users
$users = User::all();

echo "=== Assigning Roles to Users ===\n";

foreach ($users as $user) {
    echo "User: {$user->name} ({$user->email})\n";
    
    // Skip users that already have roles
    if ($user->roles()->count() > 0) {
        echo "  Already has roles. Skipping.\n";
        continue;
    }
    
    // Assign admin role to admin@tekrem.com
    if ($user->email === 'admin@tekrem.com') {
        $user->roles()->attach($adminRole->id);
        echo "  Assigned admin role\n";
    } 
    // Assign manager role to test@example.com
    else if ($user->email === 'test@example.com') {
        $user->roles()->attach($managerRole->id);
        echo "  Assigned manager role\n";
    } 
    // Assign user role to all other users
    else {
        $user->roles()->attach($userRole->id);
        echo "  Assigned user role\n";
    }
}

echo "\n=== Verifying User Roles ===\n";

$users = User::with('roles')->get();
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

echo "Done!\n";
