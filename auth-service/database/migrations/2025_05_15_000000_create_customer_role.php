<?php

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create customer role if it doesn't exist
        $customerRole = Role::firstOrCreate(
            ['name' => 'customer'],
            ['description' => 'Customer with limited access']
        );

        // Define customer permissions
        $customerPermissions = [
            'view_profile' => 'Can view own profile',
            'edit_profile' => 'Can edit own profile',
            'view_orders' => 'Can view own orders',
            'create_orders' => 'Can create new orders',
            'view_invoices' => 'Can view own invoices',
            'download_invoices' => 'Can download own invoices',
            'submit_support_tickets' => 'Can submit support tickets',
            'view_support_tickets' => 'Can view own support tickets',
        ];

        // Create permissions if they don't exist
        foreach ($customerPermissions as $name => $description) {
            Permission::firstOrCreate(
                ['name' => $name],
                ['description' => $description]
            );
        }

        // Attach permissions to customer role
        $permissions = Permission::whereIn('name', array_keys($customerPermissions))->get();
        $customerRole->permissions()->syncWithoutDetaching($permissions);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Find the customer role
        $customerRole = Role::where('name', 'customer')->first();

        if ($customerRole) {
            // Detach all permissions from the customer role
            $customerRole->permissions()->detach();

            // Delete the customer role
            $customerRole->delete();
        }

        // We don't delete the permissions as they might be used by other roles
    }
};
