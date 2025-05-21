<?php

namespace App\Providers;

use App\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Register gates for all permissions
        try {
            Permission::all()->each(function ($permission) {
                Gate::define($permission->name, function (User $user) use ($permission) {
                    // Check if user has the permission directly
                    $hasDirectPermission = $user->directPermissions()->where('permissions.id', $permission->id)->exists();

                    if ($hasDirectPermission) {
                        return true;
                    }

                    // Check if user has the permission through any of their roles
                    return $user->roles()->whereHas('permissions', function ($query) use ($permission) {
                        $query->where('permissions.id', $permission->id);
                    })->exists();
                });
            });
        } catch (\Exception $e) {
            // Handle the case when the permissions table doesn't exist yet (during migrations)
            // This prevents errors when running migrations for the first time
        }
    }
}
