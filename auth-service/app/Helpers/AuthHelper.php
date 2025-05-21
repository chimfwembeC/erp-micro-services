<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AuthHelper
{
    /**
     * Check if the user is authenticated via SSO.
     *
     * @return bool
     */
    public static function isAuthenticated()
    {
        // Get the token from the cookie
        $cookieName = env('SSO_TOKEN_NAME', 'tekrem_token');
        $token = request()->cookie($cookieName);

        // If we don't have a token, the user is not authenticated
        if (!$token) {
            return false;
        }

        // Check if we have the user data in the session
        if (session()->has('auth_user')) {
            return true;
        }

        // Validate the token with the auth service
        try {
            $authServiceUrl = env('AUTH_SERVICE_URL', 'http://localhost:8000');
            $response = Http::withToken($token)
                ->get($authServiceUrl . '/api/auth/validate-token');

            // Check if the token is valid
            if (!$response->successful() || !($response->json()['valid'] ?? false)) {
                return false;
            }

            // Get the user data from the response
            $userData = $response->json()['user'] ?? null;

            if (!$userData) {
                return false;
            }

            // Store the user data in the session
            session(['auth_user' => $userData]);

            return true;
        } catch (\Exception $e) {
            Log::error('Error validating token in AuthHelper', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return false;
        }
    }

    /**
     * Get the authenticated user.
     *
     * @return array|null
     */
    public static function getUser()
    {
        // Check if the user is authenticated
        if (!self::isAuthenticated()) {
            return null;
        }

        // Return the user data from the session
        return session('auth_user');
    }

    /**
     * Check if the user has a specific role.
     *
     * @param string $role
     * @return bool
     */
    public static function hasRole($role)
    {
        // Get the user
        $user = self::getUser();

        // If we don't have a user, return false
        if (!$user) {
            return false;
        }

        // Check if the user has the role
        return $user['role'] === $role;
    }

    /**
     * Check if the user has a specific permission.
     *
     * @param string $permission
     * @return bool
     */
    public static function hasPermission($permission)
    {
        // Get the user
        $user = self::getUser();

        // If we don't have a user, return false
        if (!$user) {
            return false;
        }

        // Check if the user has the permission directly
        if (isset($user['permissions']) && in_array($permission, $user['permissions'])) {
            return true;
        }

        // Check if the user has the permission through a role
        if (isset($user['roles']) && is_array($user['roles'])) {
            foreach ($user['roles'] as $role) {
                if (isset($role['permissions']) && in_array($permission, $role['permissions'])) {
                    return true;
                }
            }
        }

        return false;
    }
}
