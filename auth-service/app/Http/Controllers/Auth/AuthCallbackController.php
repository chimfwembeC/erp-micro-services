<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Redirect;

class AuthCallbackController extends Controller
{
    /**
     * Handle the callback from the auth service.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function handleCallback(Request $request)
    {
        // Log the callback request for debugging
        Log::info('Auth callback received', [
            'token_present' => $request->has('token'),
            'token_length' => $request->has('token') ? strlen($request->input('token')) : 0,
            'intended' => $request->input('intended'),
            'query_params' => $request->query(),
            'headers' => $request->headers->all(),
        ]);

        // Check if we have a token
        if (!$request->has('token')) {
            Log::error('Auth callback missing token');
            return redirect('/login?error=missing_token');
        }

        // Get the token from the request
        $token = $request->input('token');

        // Validate the token with the auth service
        try {
            $authServiceUrl = env('AUTH_SERVICE_URL', 'http://localhost:8000');
            $response = Http::withToken($token)
                ->get($authServiceUrl . '/api/auth/validate-token');

            // Log the validation response
            Log::info('Token validation response', [
                'status' => $response->status(),
                'body' => $response->json(),
            ]);

            // Check if the token is valid
            if (!$response->successful() || !($response->json()['valid'] ?? false)) {
                Log::error('Invalid token', [
                    'status' => $response->status(),
                    'body' => $response->json(),
                ]);
                return redirect('/login?error=invalid_token');
            }

            // Get the user data from the response
            $userData = $response->json()['user'] ?? null;

            if (!$userData) {
                Log::error('No user data in token validation response');
                return redirect('/login?error=no_user_data');
            }

            // Store the token in a cookie
            $cookieName = env('SSO_TOKEN_NAME', 'tekrem_token');
            $cookieLifetime = env('SSO_TOKEN_LIFETIME', 1440); // 24 hours in minutes
            $cookieDomain = env('SSO_COOKIE_DOMAIN', null);
            $cookieSecure = env('SSO_COOKIE_SECURE', false);
            $cookieHttpOnly = env('SSO_COOKIE_HTTP_ONLY', true);
            $cookieSameSite = env('SSO_COOKIE_SAME_SITE', 'lax');

            // Create the cookie
            Cookie::queue(
                $cookieName,
                $token,
                $cookieLifetime,
                '/',
                $cookieDomain,
                $cookieSecure,
                $cookieHttpOnly,
                false,
                $cookieSameSite
            );

            // Store the user data in the session
            session(['auth_user' => $userData]);

            // Log the successful authentication
            Log::info('User authenticated via SSO', [
                'user_id' => $userData['id'] ?? 'unknown',
                'user_email' => $userData['email'] ?? 'unknown',
                'user_role' => $userData['role'] ?? 'unknown',
            ]);

            // Check if we have an intended URL
            $intended = $request->input('intended');
            if ($intended) {
                Log::info('Redirecting to intended URL', [
                    'intended' => $intended,
                ]);
                return redirect($intended);
            }

            // Redirect to the dashboard
            return redirect('/dashboard');

        } catch (\Exception $e) {
            // Log the error
            Log::error('Error validating token', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Redirect to the login page with an error
            return redirect('/login?error=validation_error&message=' . urlencode($e->getMessage()));
        }
    }
}
