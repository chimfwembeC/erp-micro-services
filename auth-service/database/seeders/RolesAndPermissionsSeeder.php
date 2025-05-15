<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles if they don't exist
        $adminRole = Role::firstOrCreate(
            ['name' => 'admin'],
            ['description' => 'Administrator with full access']
        );

        $managerRole = Role::firstOrCreate(
            ['name' => 'manager'],
            ['description' => 'Manager with limited access']
        );

        $userRole = Role::firstOrCreate(
            ['name' => 'user'],
            ['description' => 'Regular user']
        );

        // Create permissions
        $permissions = [
            // User management permissions
            'view_users' => 'Can view users',
            'create_users' => 'Can create users',
            'edit_users' => 'Can edit users',
            'delete_users' => 'Can delete users',
            'assign_roles' => 'Can assign roles to users',
            'assign_direct_permissions' => 'Can assign permissions directly to users',

            // Role management permissions
            'view_roles' => 'Can view roles',
            'create_roles' => 'Can create roles',
            'edit_roles' => 'Can edit roles',
            'delete_roles' => 'Can delete roles',

            // Permission management permissions
            'view_permissions' => 'Can view permissions',
            'assign_permissions' => 'Can assign permissions to roles',
        ];

        foreach ($permissions as $name => $description) {
            Permission::firstOrCreate(
                ['name' => $name],
                ['description' => $description]
            );
        }

        // Assign permissions to roles
        // First, detach all existing permissions
        $adminRole->permissions()->detach();
        $managerRole->permissions()->detach();
        $userRole->permissions()->detach();

        // Then, attach the appropriate permissions
        $adminRole->permissions()->attach(Permission::all());

        $managerPermissions = Permission::whereIn('name', [
            'view_users', 'create_users', 'edit_users', 'assign_roles', 'assign_direct_permissions',
            'view_roles', 'view_permissions'
        ])->get();

        $managerRole->permissions()->attach($managerPermissions);

        $userPermissions = Permission::whereIn('name', [
            'view_users'
        ])->get();

        $userRole->permissions()->attach($userPermissions);
    }
}
