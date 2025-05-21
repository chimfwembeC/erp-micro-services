<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class SsoApiController extends Controller
{
    /**
     * Handle a login request via API.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string',
                'service' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                throw ValidationException::withMessages([
                    'email' => ['The provided credentials are incorrect.'],
                ]);
            }

            // Load the user's roles and permissions
            $user->load('roles.permissions');

            // Get the user's role names
            $roleNames = $user->roles->pluck('name')->toArray();

            // Get all permissions from roles and direct permissions
            $permissions = collect($user->permissions)->pluck('name')->toArray();

            // Create a token with abilities based on permissions
            $service = $request->service ?? 'api';
            $tokenName = $service . '-' . now()->timestamp;
            $token = $user->createToken($tokenName, $permissions)->plainTextToken;

            // Log the successful API login
            Log::info('User logged in via SSO API', [
                'user_id' => $user->id,
                'email' => $user->email,
                'roles' => $roleNames,
                'service' => $service,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            // Set the authenticated user in the session
            Auth::login($user);

            // Create a cookie with the token
            $cookieName = config('sanctum.cookie.name', 'tekrem_token');
            $cookie = cookie(
                $cookieName,
                $token,
                config('sanctum.expiration', 120), // minutes
                null,
                null,
                false,
                true, // httpOnly
                false,
                'lax'
            );

            // Return the token and user data with the cookie
            return response()->json([
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $roleNames,
                    'primary_role' => count($roleNames) > 0 ? $roleNames[0] : null,
                    'permissions' => $permissions,
                ],
                'message' => 'Login successful'
            ])->withCookie($cookie);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Authentication failed',
                'errors' => $e->errors()
            ], 401);
        } catch (\Exception $e) {
            Log::error('SSO API login error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'email' => $request->email ?? 'not provided',
                'service' => $request->service ?? 'not provided',
            ]);

            return response()->json([
                'message' => 'An error occurred during authentication',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Validate a token.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function validateToken(Request $request)
    {
        try {
            // Log the request for debugging
            Log::info('Token validation request received', [
                'headers' => $request->headers->all(),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);

            // Get the user from the request (already authenticated via sanctum)
            $user = $request->user();

            if (!$user) {
                Log::warning('Token validation failed: No user found');
                return response()->json(['valid' => false], 401);
            }

            // Load the user's roles and permissions
            $user->load('roles.permissions');

            // Get the user's role names
            $roleNames = $user->roles->pluck('name')->toArray();

            // Get all permissions from roles and direct permissions
            $permissions = collect($user->permissions)->pluck('name')->toArray();

            // Log the successful validation
            Log::info('Token validation successful', [
                'user_id' => $user->id,
                'email' => $user->email,
                'roles' => $roleNames,
            ]);

            // Return the validation result with user data
            return response()->json([
                'valid' => true,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $roleNames,
                    'primary_role' => count($roleNames) > 0 ? $roleNames[0] : null,
                    'permissions' => $permissions,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Token validation error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'valid' => false,
                'message' => 'An error occurred during token validation',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
