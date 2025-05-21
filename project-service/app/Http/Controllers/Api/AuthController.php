<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Validate a token.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function validateToken(Request $request)
    {
        // Log the request for debugging
        \Illuminate\Support\Facades\Log::info('Token validation request received', [
            'headers' => $request->headers->all(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        // Get the user from the request (already authenticated via sanctum)
        $user = $request->user();

        if (!$user) {
            \Illuminate\Support\Facades\Log::warning('Token validation failed: No user found');
            return response()->json(['valid' => false], 401);
        }

        // Load the user's roles and permissions
        $user->load('roles.permissions');

        // Get the user's role names
        $roleNames = $user->roles->pluck('name')->toArray();

        // Add a simple role field for easier access in the CRM service
        $userData = $user->toArray();
        $userData['role'] = count($roleNames) > 0 ? $roleNames[0] : 'User';

        // Log successful validation
        \Illuminate\Support\Facades\Log::info('Token validation successful', [
            'user_id' => $user->id,
            'user_email' => $user->email,
            'role' => $userData['role']
        ]);

        // Return the user data
        return response()->json([
            'valid' => true,
            'user' => $userData
        ]);
    }

    /**
     * Validate a token directly (without requiring authentication).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function validateTokenDirect(Request $request)
    {
        // Log the request for debugging
        \Illuminate\Support\Facades\Log::info('Direct token validation request received', [
            'headers' => $request->headers->all(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        // Get the token from the Authorization header
        $bearerToken = $request->bearerToken();

        if (!$bearerToken) {
            \Illuminate\Support\Facades\Log::warning('Direct token validation failed: No token provided');
            return response()->json(['valid' => false, 'message' => 'No token provided'], 401);
        }

        try {
            // Find the token in the database
            $token = \Laravel\Sanctum\PersonalAccessToken::findToken($bearerToken);

            if (!$token) {
                \Illuminate\Support\Facades\Log::warning('Direct token validation failed: Invalid token');
                return response()->json(['valid' => false, 'message' => 'Invalid token'], 401);
            }

            // Get the user associated with the token
            $user = $token->tokenable;

            if (!$user) {
                \Illuminate\Support\Facades\Log::warning('Direct token validation failed: User not found');
                return response()->json(['valid' => false, 'message' => 'User not found'], 401);
            }

            // Load the user's roles and permissions
            $user->load('roles.permissions');

            // Get the user's role names
            $roleNames = $user->roles->pluck('name')->toArray();

            // Add a simple role field for easier access in the CRM service
            $userData = $user->toArray();
            $userData['role'] = count($roleNames) > 0 ? $roleNames[0] : 'User';

            // Log successful validation
            \Illuminate\Support\Facades\Log::info('Direct token validation successful', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'role' => $userData['role']
            ]);

            // Return the user data
            return response()->json([
                'valid' => true,
                'user' => $userData
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Direct token validation error: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json(['valid' => false, 'message' => 'Error validating token'], 500);
        }
    }

    /**
     * Get the authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function user(Request $request)
    {
        // Get the user from the request (already authenticated via sanctum)
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        // Load the user's roles and permissions
        $user->load('roles.permissions');

        // Get the user's role names
        $roleNames = $user->roles->pluck('name')->toArray();

        // Add a simple role field for easier access in the CRM service
        $userData = $user->toArray();
        $userData['role'] = count($roleNames) > 0 ? $roleNames[0] : 'User';

        // Return the user data
        return response()->json($userData);
    }
}
