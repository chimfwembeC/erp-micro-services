<?php

namespace App\Models;

use App\Notifications\CustomVerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Jetstream\HasProfilePhoto;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens;

    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;
    use HasProfilePhoto;
    use Notifiable;
    use TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_recovery_codes',
        'two_factor_secret',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'profile_photo_url',
        'roles',
        'permissions'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * The roles that belong to the user.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    /**
     * The permissions that belong to the user directly.
     */
    public function directPermissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class);
    }

    /**
     * Get the roles attribute.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getRolesAttribute()
    {
        // Use the relationship directly to avoid infinite recursion
        return $this->getRelationValue('roles')->load('permissions');
    }

    /**
     * Get the permissions attribute.
     *
     * @return array
     */
    public function getPermissionsAttribute(): array
    {
        // Get permissions from roles
        $rolePermissions = collect();

        // Get the roles relationship directly
        $roles = $this->getRelationValue('roles');
        if ($roles) {
            // Make sure permissions are loaded
            $roles->load('permissions');

            // Collect all permissions from all roles
            foreach ($roles as $role) {
                if ($role->permissions) {
                    $rolePermissions = $rolePermissions->concat($role->permissions);
                }
            }
        }

        // Get direct permissions
        $directPermissions = $this->getRelationValue('directPermissions') ?: collect();

        // Merge role permissions and direct permissions
        $allPermissions = $rolePermissions->concat($directPermissions);

        // Remove duplicates and convert to array
        return $allPermissions->unique('id')->values()->toArray();
    }

    /**
     * Check if the user has a specific role.
     *
     * @param string $role
     * @return bool
     */
    public function hasRole(string $role): bool
    {
        return $this->roles()->where('name', $role)->exists();
    }

    /**
     * Check if the user has a specific permission directly.
     *
     * @param string $permission
     * @return bool
     */
    public function hasDirectPermission(string $permission): bool
    {
        return $this->directPermissions()->where('name', $permission)->exists();
    }

    /**
     * Check if the user has a specific permission (either directly or through roles).
     *
     * @param string $permission
     * @return bool
     */
    public function hasPermission(string $permission): bool
    {
        // Check for direct permission
        if ($this->hasDirectPermission($permission)) {
            return true;
        }

        // Check for permission through roles
        return $this->roles()->whereHas('permissions', function ($query) use ($permission) {
            $query->where('name', $permission);
        })->exists();
    }

    /**
     * Check if the user has any of the given roles.
     *
     * @param array $roles
     * @return bool
     */
    public function hasAnyRole(array $roles): bool
    {
        return $this->roles()->whereIn('name', $roles)->exists();
    }

    /**
     * Check if the user has all of the given roles.
     *
     * @param array $roles
     * @return bool
     */
    public function hasAllRoles(array $roles): bool
    {
        return $this->roles()->whereIn('name', $roles)->count() === count($roles);
    }

    /**
     * Send the email verification notification.
     *
     * @return void
     */
    public function sendEmailVerificationNotification()
    {
        $this->notify(new CustomVerifyEmail);
    }
}
