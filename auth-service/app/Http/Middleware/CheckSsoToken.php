<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cookie;
use Laravel\Sanctum\PersonalAccessToken;
use Symfony\Component\HttpFoundation\Response;

class CheckSsoToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Check if the user is already authenticated
        if (Auth::check()) {
            return $next($request);
        }

        // Try to authenticate with Sanctum token from Authorization header
        if ($request->bearerToken()) {
            $token = $request->bearerToken();

            // Find the token in the database
            $accessToken = PersonalAccessToken::findToken($token);

            if ($accessToken) {
                // Get the token's owner
                $user = $accessToken->tokenable;

                if ($user instanceof User) {
                    // Log the successful token authentication
                    Log::info('User authenticated via Sanctum bearer token', [
                        'user_id' => $user->id,
                        'email' => $user->email,
                        'token_id' => $accessToken->id,
                    ]);

                    // Set the authenticated user
                    Auth::login($user);

                    // Also store user data in session for Inertia
                    $user->load('roles.permissions');
                    session(['auth_user' => $user]);

                    return $next($request);
                }
            }
        }

        // Try to authenticate with Sanctum token from cookie
        $cookieName = config('sanctum.cookie.name', 'tekrem_token');
        $token = $request->cookie($cookieName);

        if ($token) {
            // Find the token in the database
            $accessToken = PersonalAccessToken::findToken($token);

            if ($accessToken) {
                // Get the token's owner
                $user = $accessToken->tokenable;

                if ($user instanceof User) {
                    // Log the successful token authentication
                    Log::info('User authenticated via Sanctum cookie token', [
                        'user_id' => $user->id,
                        'email' => $user->email,
                        'token_id' => $accessToken->id,
                    ]);

                    // Set the authenticated user
                    Auth::login($user);

                    // Also store user data in session for Inertia
                    $user->load('roles.permissions');
                    session(['auth_user' => $user]);

                    return $next($request);
                }
            }
        }

        // If we reach here, no valid token was found
        Log::warning('No valid authentication token found', [
            'url' => $request->fullUrl(),
            'has_bearer' => (bool)$request->bearerToken(),
            'has_cookie' => (bool)$token,
        ]);

        // Get the auth service URL
        $authServiceUrl = config('app.url', 'http://localhost:8000');

        // Redirect to the login page with the current URL as the redirect parameter
        $redirectUrl = $authServiceUrl . '/login?redirect=' . urlencode($request->fullUrl());

        Log::info('Redirecting to login page', [
            'redirect_url' => $redirectUrl,
        ]);

        return redirect($redirectUrl);
    }
}
