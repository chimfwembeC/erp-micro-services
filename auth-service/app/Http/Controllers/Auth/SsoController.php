<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class SsoController extends Controller
{
    /**
     * Handle a login request to the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function login(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string',
                'device_name' => 'nullable|string',
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
            $deviceName = $request->device_name ?? ($request->userAgent() ?? 'unknown-device');
            $token = $user->createToken($deviceName, $permissions)->plainTextToken;

            // Log the successful login
            Log::info('User logged in via SSO', [
                'user_id' => $user->id,
                'email' => $user->email,
                'roles' => $roleNames,
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
            Log::error('SSO login error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'email' => $request->email ?? 'not provided',
            ]);

            return response()->json([
                'message' => 'An error occurred during authentication',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        try {
            // Get the user
            $user = $request->user();

            if ($user) {
                // Revoke the token that was used to authenticate the current request
                $user->currentAccessToken()->delete();

                // Log the logout
                Log::info('User logged out via SSO', [
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ]);
            }

            // Clear the SSO cookie if it exists
            $cookieName = config('sanctum.cookie.name', 'tekrem_token');
            if ($request->hasCookie($cookieName)) {
                Cookie::queue(Cookie::forget($cookieName));
            }

            return response()->json(['message' => 'Successfully logged out']);
        } catch (\Exception $e) {
            Log::error('SSO logout error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => $request->user()->id ?? 'unknown',
            ]);

            return response()->json([
                'message' => 'An error occurred during logout',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
