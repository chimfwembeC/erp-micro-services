<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Laravel\Fortify\Contracts\LoginViewResponse;

class CustomLoginController extends Controller
{
    /**
     * Show the login view.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Laravel\Fortify\Contracts\LoginViewResponse
     */
    public function showLoginForm(Request $request)
    {
        // Store the redirect parameter in the session
        if ($request->has('redirect')) {
            session(['redirect_after_login' => $request->input('redirect')]);

            // Log the redirect parameter for debugging
            Log::info('Storing redirect parameter in session', [
                'redirect' => $request->input('redirect'),
                'session_id' => session()->getId(),
            ]);
        }

        // Check if the request is coming from the CRM service
        if ($request->has('from_crm')) {
            // Store the default CRM callback URL
            session(['redirect_after_login' => 'http://localhost:8001/auth/callback']);

            // Log the from_crm parameter for debugging
            Log::info('Request from CRM service detected', [
                'from_crm' => $request->input('from_crm'),
                'session_id' => session()->getId(),
            ]);
        }

        // Return the login view
        return Inertia::render('Auth/Login', [
            'canResetPassword' => route('password.request'),
            'status' => session('status'),
        ]);
    }
}
