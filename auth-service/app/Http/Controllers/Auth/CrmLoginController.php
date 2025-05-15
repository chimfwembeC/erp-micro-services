<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CrmLoginController extends Controller
{
    /**
     * Show the login view for CRM users.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function showLoginForm(Request $request)
    {
        // Get the CRM callback URL from environment or use default
        $crmCallbackUrl = env('CRM_SERVICE_URL', 'http://localhost:8001') . '/auth/callback';

        // Store the redirect URL in the session
        session(['redirect_after_login' => $crmCallbackUrl]);

        // Get the redirect parameter if provided
        $redirect = $request->input('redirect');
        if ($redirect) {
            session(['redirect_after_login' => $redirect]);
            $crmCallbackUrl = $redirect;
        }

        // Log the CRM login request
        Log::info('CRM login page accessed', [
            'session_id' => session()->getId(),
            'referer' => $request->headers->get('referer'),
            'user_agent' => $request->userAgent(),
            'callback_url' => $crmCallbackUrl,
            'redirect_param' => $redirect,
        ]);

        // Return the login view with CRM-specific data
        return Inertia::render('Auth/Login', [
            'canResetPassword' => route('password.request'),
            'status' => session('status'),
            'fromCrm' => true,
            'callbackUrl' => $crmCallbackUrl,
        ]);
    }
}
