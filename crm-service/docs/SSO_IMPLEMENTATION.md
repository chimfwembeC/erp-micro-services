# Single Sign-On (SSO) Implementation

This document explains how Single Sign-On (SSO) is implemented between the auth service and the CRM service in the TekRem microservices ecosystem.

## Overview

The SSO implementation allows users to log in once through the auth service and access all other microservices (like the CRM service) without having to log in again. This is achieved through token-based authentication, where the auth service issues a token that is stored in a cookie and validated by other services.

## Architecture

1. **Auth Service** (Primary Authentication Service):
   - Handles user registration, login, and authentication
   - Issues authentication tokens
   - Provides endpoints for token validation and user information

2. **CRM Service** (Client Service):
   - Validates tokens with the auth service
   - Redirects unauthenticated users to the auth service
   - Uses validated user information for authorization

## Implementation Details

### 1. Configuration

The SSO configuration is stored in `config/auth_sso.php`:

```php
return [
    // Auth service base URL
    'auth_service_url' => env('AUTH_SERVICE_URL', 'http://localhost:8000'),

    // SSO endpoints
    'sso_login_url' => env('SSO_LOGIN_URL', 'http://localhost:8000/login'),
    'sso_logout_url' => env('SSO_LOGOUT_URL', 'http://localhost:8000/logout'),
    'sso_register_url' => env('SSO_REGISTER_URL', 'http://localhost:8000/register'),
    'sso_validate_url' => env('SSO_VALIDATE_URL', 'http://localhost:8000/api/auth/validate-token'),
    'sso_user_url' => env('SSO_USER_URL', 'http://localhost:8000/api/auth/user'),

    // Token settings
    'token_name' => env('SSO_TOKEN_NAME', 'tekrem_token'),
    'token_lifetime' => env('SSO_TOKEN_LIFETIME', 60 * 24), // 24 hours in minutes

    // Cookie settings
    'cookie_secure' => env('SSO_COOKIE_SECURE', false),
    'cookie_http_only' => env('SSO_COOKIE_HTTP_ONLY', true),
    'cookie_same_site' => env('SSO_COOKIE_SAME_SITE', 'lax'),

    // Callback route
    'callback_route' => env('SSO_CALLBACK_ROUTE', '/auth/callback'),
];
```

### 2. Service Provider

The `SsoServiceProvider` registers the SSO configuration and sets up a custom authentication guard:

```php
class SsoServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Register the auth_sso config
        $this->mergeConfigFrom(
            __DIR__.'/../../config/auth_sso.php', 'auth_sso'
        );
    }

    public function boot(): void
    {
        // Add a custom guard for SSO authentication
        Auth::viaRequest('sso-token', function (Request $request) {
            $token = $request->cookie(config('auth_sso.token_name'));

            if (!$token) {
                return null;
            }

            try {
                // Validate token with auth service
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $token,
                    'Accept' => 'application/json',
                ])->get(config('auth_sso.sso_validate_url'));

                if ($response->successful()) {
                    return $response->json('user');
                }
            } catch (\Exception $e) {
                Log::error('SSO token validation failed: ' . $e->getMessage());
            }

            return null;
        });
    }
}
```

### 3. Middleware

The `ValidateAuthToken` middleware validates the token and redirects unauthenticated users:

```php
class ValidateAuthToken
{
    public function handle(Request $request, Closure $next): Response
    {
        // Skip token validation for specific routes
        if ($this->shouldSkipValidation($request)) {
            return $next($request);
        }

        // Get token from cookie
        $token = $request->cookie(config('auth_sso.token_name'));

        // If no token is present, redirect to auth service login
        if (!$token) {
            // Store the intended URL to redirect back after login
            session(['intended_url' => $request->fullUrl()]);

            // Redirect to auth service login
            return redirect(config('auth_sso.sso_login_url') . '?redirect=' . urlencode(config('app.url')));
        }

        try {
            // Validate token with auth service
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
                'Accept' => 'application/json',
            ])->get(config('auth_sso.sso_validate_url'));

            // If token is valid, proceed
            if ($response->successful()) {
                // Add user data to request for use in controllers
                $request->merge(['auth_user' => $response->json('user')]);
                return $next($request);
            }
        } catch (\Exception $e) {
            Log::error('Auth token validation failed: ' . $e->getMessage());
        }

        // If token validation failed, clear the cookie and redirect to login
        return redirect(config('auth_sso.sso_login_url') . '?redirect=' . urlencode(config('app.url')))
            ->withCookie(cookie()->forget(config('auth_sso.token_name')));
    }

    protected function shouldSkipValidation(Request $request): bool
    {
        // Skip validation for public routes
        $publicRoutes = [
            'welcome',
            'login',
            'register',
            'password.request',
            'password.reset',
            'verification.notice',
            'verification.verify',
            'auth.callback', // SSO callback route
        ];

        // Check if the route exists and has a name
        if (!$request->route() || !$request->route()->getName()) {
            return true; // Skip validation for routes without names
        }

        // Check if the route name is in the public routes list
        return $request->routeIs('welcome') || in_array($request->route()->getName(), $publicRoutes);
    }
}
```

### 4. Controller

The `SsoController` handles the SSO callback and user information:

```php
class SsoController extends Controller
{
    public function callback(Request $request)
    {
        // Validate the token from the request
        $token = $request->input('token');

        if (!$token) {
            return redirect()->route('welcome')->with('error', 'Authentication failed: No token provided');
        }

        try {
            // Validate token with auth service
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
                'Accept' => 'application/json',
            ])->get(config('auth_sso.sso_validate_url'));

            // If token is valid, set cookie and redirect
            if ($response->successful()) {
                // Get the intended URL from session or default to dashboard
                $intendedUrl = session('intended_url', route('dashboard'));

                // Clear the intended URL from session
                session()->forget('intended_url');

                // Set the token cookie
                $cookie = Cookie::make(
                    config('auth_sso.token_name'),
                    $token,
                    config('auth_sso.token_lifetime'),
                    '/',
                    null, // No domain specified
                    config('auth_sso.cookie_secure'),
                    config('auth_sso.cookie_http_only'),
                    false,
                    config('auth_sso.cookie_same_site')
                );

                return redirect($intendedUrl)->withCookie($cookie);
            }

            Log::error('SSO token validation failed: ' . $response->body());
            return redirect()->route('welcome')->with('error', 'Authentication failed: Invalid token');

        } catch (\Exception $e) {
            Log::error('SSO callback error: ' . $e->getMessage());
            return redirect()->route('welcome')->with('error', 'Authentication failed: ' . $e->getMessage());
        }
    }

    public function logout()
    {
        // Clear the token cookie
        $cookie = Cookie::forget(config('auth_sso.token_name'));

        // Redirect to auth service logout
        return redirect(config('auth_sso.sso_logout_url'))->withCookie($cookie);
    }

    public function user(Request $request)
    {
        // Get token from cookie
        $token = $request->cookie(config('auth_sso.token_name'));

        if (!$token) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        try {
            // Get user data from auth service
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
                'Accept' => 'application/json',
            ])->get(config('auth_sso.sso_user_url'));

            if ($response->successful()) {
                return response()->json($response->json());
            }

            return response()->json(['error' => 'Failed to get user data'], 401);

        } catch (\Exception $e) {
            Log::error('Failed to get user data: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to get user data'], 500);
        }
    }
}
```

## Authentication Flow

1. **User accesses CRM service without being authenticated**:
   - The `ValidateAuthToken` middleware checks for a token in the cookies
   - If no token is found, the user is redirected to the auth service login page
   - The current URL is stored in the session as the intended URL

2. **User logs in through the auth service**:
   - After successful login, the auth service redirects back to the CRM service's callback URL with a token
   - The `SsoController::callback` method validates the token with the auth service
   - If valid, the token is stored in a cookie and the user is redirected to the intended URL

3. **User accesses protected routes in the CRM service**:
   - The `ValidateAuthToken` middleware validates the token with the auth service
   - If valid, the user information is added to the request and the user can access the route
   - If invalid, the user is redirected to the auth service login page

4. **User logs out**:
   - The `SsoController::logout` method clears the token cookie
   - The user is redirected to the auth service logout page

## Frontend Integration

The frontend uses the auth_user data shared by the `HandleInertiaRequests` middleware:

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

## Conclusion

This SSO implementation provides a seamless authentication experience across the TekRem microservices ecosystem. Users only need to log in once through the auth service to access all other services, including the CRM service.
