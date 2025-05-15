<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class SsoApiController extends Controller
{
    /**
     * Handle a login request from the CRM service.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        // Log the request for debugging
        Log::info('SSO API login request received', [
            'email' => $request->input('email'),
            'has_password' => !empty($request->input('password')),
            'remember' => $request->input('remember'),
            'redirect' => $request->input('redirect'),
            'headers' => $request->headers->all(),
        ]);

        try {
            // Validate the request
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            if ($validator->fails()) {
                Log::error('SSO API login validation failed', [
                    'errors' => $validator->errors()->toArray(),
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Attempt to authenticate the user
            if (!Auth::attempt($request->only('email', 'password'), $request->filled('remember'))) {
                Log::error('SSO API login authentication failed', [
                    'email' => $request->input('email'),
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ], 401);
            }

            // Get the user
            $user = Auth::user();

            // Generate a token for the user
            $token = $user->createToken('sso-token')->plainTextToken;

            // Get the redirect URL
            $redirect = $request->input('redirect', 'http://localhost:8001/auth/callback');

            // Check if the redirect URL is for the CRM dashboard directly
            $crmDashboardUrl = env('CRM_SERVICE_URL', 'http://localhost:8001') . '/dashboard';
            $isCrmDashboardRedirect = $redirect === $crmDashboardUrl;

            // Store the intended URL if it's a direct dashboard redirect
            $intended = null;

            // If it's a direct dashboard redirect, handle it properly
            if ($isCrmDashboardRedirect) {
                // Store the original dashboard URL as the intended destination after auth
                $intended = $crmDashboardUrl;

                // Use the callback URL instead
                $redirect = env('CRM_SERVICE_URL', 'http://localhost:8001') . '/auth/callback';

                Log::info('API: Redirecting to CRM callback instead of dashboard directly', [
                    'original_redirect' => $crmDashboardUrl,
                    'new_redirect' => $redirect,
                    'intended_url' => $intended
                ]);
            }

            // Log the successful login
            Log::info('SSO API login successful', [
                'user_id' => $user->id,
                'email' => $user->email,
                'token_length' => strlen($token),
                'redirect' => $redirect,
                'intended' => $intended
            ]);

            // Prepare the redirect URL with the token
            $redirectUrl = $redirect . (strpos($redirect, '?') !== false ? '&' : '?') . 'token=' . $token;

            // Add the intended URL if we have one
            if ($intended) {
                $redirectUrl .= '&intended=' . urlencode($intended);
            }

            // Return the token and redirect URL
            return response()->json([
                'success' => true,
                'token' => $token,
                'redirect' => $redirectUrl,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'intended' => $intended
            ]);

        } catch (\Exception $e) {
            Log::error('SSO API login error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred: ' . $e->getMessage()
            ], 500);
        }
    }
}
