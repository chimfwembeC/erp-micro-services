<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ServicesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create CRM service
        Service::firstOrCreate(
            ['name' => 'crm'],
            [
                'description' => 'Customer Relationship Management Service',
                'service_id' => 'crm-service',
                'service_secret' => Str::random(32),
                'permissions' => ['read:users', 'read:roles', 'read:permissions'],
                'is_active' => true,
            ]
        );

        // Create ERP service
        Service::firstOrCreate(
            ['name' => 'erp'],
            [
                'description' => 'Enterprise Resource Planning Service',
                'service_id' => 'erp-service',
                'service_secret' => Str::random(32),
                'permissions' => ['read:users', 'read:roles', 'read:permissions'],
                'is_active' => true,
            ]
        );

        // Create Inventory service
        Service::firstOrCreate(
            ['name' => 'inventory'],
            [
                'description' => 'Inventory Management Service',
                'service_id' => 'inventory-service',
                'service_secret' => Str::random(32),
                'permissions' => ['read:users'],
                'is_active' => true,
            ]
        );

        // Create Project service
        Service::firstOrCreate(
            ['name' => 'project'],
            [
                'description' => 'Project Management Service',
                'service_id' => 'project-service',
                'service_secret' => Str::random(32),
                'permissions' => ['read:users', 'read:roles', 'read:permissions'],
                'is_active' => true,
            ]
        );

        // Output the service credentials for initial setup
        $this->command->info('Service credentials:');
        $services = Service::all();
        foreach ($services as $service) {
            $this->command->info("Service: {$service->name}");
            $this->command->info("Service ID: {$service->service_id}");
            $this->command->info("Service Secret: {$service->service_secret}");
            $this->command->info('---');
        }
    }
}
