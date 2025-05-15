<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class SsoLoginController extends Controller
{
    /**
     * Handle a login request from the CRM service.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function login(Request $request)
    {
        // Log the request for debugging
        Log::info('SSO login request received', [
            'email' => $request->input('email'),
            'has_password' => !empty($request->input('password')),
            'remember' => $request->input('remember'),
            'redirect' => $request->input('redirect'),
        ]);

        try {
            // Validate the request
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            if ($validator->fails()) {
                Log::error('SSO login validation failed', [
                    'errors' => $validator->errors()->toArray(),
                ]);

                // Check if the request wants JSON
                if ($request->expectsJson() || $request->wantsJson() || $request->ajax()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Validation failed',
                        'errors' => $validator->errors()
                    ], 422);
                }

                return redirect()->back()->withErrors($validator);
            }

            // Attempt to authenticate the user
            if (!Auth::attempt($request->only('email', 'password'), $request->filled('remember'))) {
                Log::error('SSO login authentication failed', [
                    'email' => $request->input('email'),
                ]);

                // Check if the request wants JSON
                if ($request->expectsJson() || $request->wantsJson() || $request->ajax()) {
                    return response()->json([
                        'success' => false,
                        'message' => __('auth.failed')
                    ], 401);
                }

                throw ValidationException::withMessages([
                    'email' => __('auth.failed'),
                ]);
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

                Log::info('Redirecting to CRM callback instead of dashboard directly', [
                    'original_redirect' => $crmDashboardUrl,
                    'new_redirect' => $redirect,
                    'intended_url' => $intended
                ]);
            }

            // Log the successful login
            Log::info('SSO login successful', [
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

            // Check if the request wants JSON
            if ($request->expectsJson() || $request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => true,
                    'token' => $token,
                    'redirect' => $redirectUrl
                ]);
            }

            // Otherwise, redirect to the CRM service with the token
            return redirect($redirectUrl);

        } catch (\Exception $e) {
            Log::error('SSO login error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Check if the request wants JSON
            if ($request->expectsJson() || $request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage()
                ], 401);
            }

            return redirect()->back()->withErrors([
                'email' => $e->getMessage(),
            ]);
        }
    }
}
