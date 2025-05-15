# Fixing "Target class [auth.sso] does not exist" Error

## Problem

When accessing the CRM service, the following error occurred:

```
Illuminate\Contracts\Container\BindingResolutionException
Target class [auth.sso] does not exist.
GET 127.0.0.1:8001
PHP 8.2.4 — Laravel 12.13.0
```

This error occurred because Laravel 12 changed how middleware is registered, and the middleware alias 'auth.sso' was not properly registered.

## Solution

### 1. Update Kernel.php to use Laravel 12's new middleware registration format

In Laravel 12, middleware registration has changed from using properties to using methods. The following changes were made to `app/Http/Kernel.php`:

#### Before:

```php
protected $middleware = [
    // Middleware list
];

protected $middlewareGroups = [
    'web' => [
        // Web middleware list
    ],
    'api' => [
        // API middleware list
    ],
];

protected $middlewareAliases = [
    'auth' => \App\Http\Middleware\Authenticate::class,
    // Other middleware aliases
    'auth.sso' => \App\Http\Middleware\ValidateAuthToken::class,
];
```

#### After:

```php
protected function middleware(): array
{
    return [
        // Middleware list
    ];
}

protected function middlewareGroups(): array
{
    return [
        'web' => [
            // Web middleware list
        ],
        'api' => [
            // API middleware list
        ],
    ];
}

protected function middlewareAliases(): array
{
    return [
        'auth' => \App\Http\Middleware\Authenticate::class,
        // Other middleware aliases
        'auth.sso' => \App\Http\Middleware\ValidateAuthToken::class,
    ];
}
```

### 2. Ensure consistent configuration usage

The `ValidateAuthToken` middleware was using `config('auth.sso_login_url')` instead of `config('auth_sso.sso_login_url')`. This was fixed by updating all references to use the `auth_sso` configuration:

```php
// Before
return redirect(config('auth.sso_login_url') . '?redirect=' . urlencode(config('app.url')));

// After
return redirect(config('auth_sso.sso_login_url') . '?redirect=' . urlencode(config('app.url')));
```

### 3. Remove duplicate SSO configuration

The SSO configuration was duplicated in both `config/auth.php` and `config/auth_sso.php`. The duplicate configuration was removed from `config/auth.php` to avoid confusion.

### 4. Update the HandleInertiaRequests middleware

The `HandleInertiaRequests` middleware was updated to share the authenticated user data with the frontend:

```php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'auth' => [
            'user' => $request->auth_user ?? null,
        ],
        'flash' => [
            'message' => fn () => $request->session()->get('message'),
            'error' => fn () => $request->session()->get('error'),
            'success' => fn () => $request->session()->get('success'),
        ],
    ];
}
```

## Verification

After making these changes, the error was resolved, and users can now log in through the auth service and access the CRM service without having to log in again.

## Key Files Modified

1. `app/Http/Kernel.php` - Updated middleware registration to use Laravel 12's new format
2. `app/Http/Middleware/ValidateAuthToken.php` - Updated configuration references
3. `config/auth.php` - Removed duplicate SSO configuration
4. `app/Http/Middleware/HandleInertiaRequests.php` - Added auth_user to shared Inertia data

## Additional Resources

For a more comprehensive explanation of the SSO implementation, see [SSO_IMPLEMENTATION.md](./SSO_IMPLEMENTATION.md).
