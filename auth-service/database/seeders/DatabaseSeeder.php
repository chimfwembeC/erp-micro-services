<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed roles and permissions
        $this->call(RolesAndPermissionsSeeder::class);

        // Seed services for service-to-service authentication
        $this->call(ServicesSeeder::class);

        // Create admin user
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@tekrem.com',
        ]);

        // Assign admin role to admin user
        $admin->roles()->attach(\App\Models\Role::where('name', 'admin')->first());

        // Create manager user
        $manager = User::factory()->create([
            'name' => 'Manager User',
            'email' => 'manager@tekrem.com',
        ]);

        // Assign manager role to manager user
        $manager->roles()->attach(\App\Models\Role::where('name', 'manager')->first());

        // Create regular user
        $user = User::factory()->create([
            'name' => 'Regular User',
            'email' => 'user@tekrem.com',
        ]);


        // Assign user role to regular user
        $user->roles()->attach(\App\Models\Role::where('name', 'user')->first());

        $customer = User::factory()->create([
            'name' => 'Customer User',
            'email' => 'customer@tekrem.com',
        ]);

        // Assign user role to regular user
        $customer->roles()->attach(\App\Models\Role::where('name', 'customer')->first());

    }
}
