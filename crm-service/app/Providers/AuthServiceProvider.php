<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Define gates for roles and permissions
        Gate::define('admin', function ($user) {
            return $user->role === 'admin';
        });

        Gate::define('manager', function ($user) {
            return $user->role === 'manager' || $user->role === 'admin';
        });

        Gate::define('user', function ($user) {
            return $user->role === 'user' || $user->role === 'manager' || $user->role === 'admin';
        });
    }
}
