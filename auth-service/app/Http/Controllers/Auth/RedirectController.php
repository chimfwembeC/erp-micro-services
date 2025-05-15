<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RedirectController extends Controller
{
    /**
     * Redirect to CRM service with token.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function redirectToCrm(Request $request)
    {
        // Get the user
        $user = $request->user();

        if (!$user) {
            return redirect('/login');
        }

        // Generate a token for the user
        $token = $user->createToken('sso-token')->plainTextToken;

        // Log the redirect
        Log::info('Redirecting to CRM service', [
            'user_id' => $user->id,
            'token_length' => strlen($token),
        ]);

        // Get the redirect URL from the session or use the default from environment
        $defaultCallbackUrl = env('CRM_SERVICE_URL', 'http://localhost:8001') . '/auth/callback';
        $redirectUrl = session('redirect_after_login', $defaultCallbackUrl);

        // Check if the redirect URL is for the CRM dashboard directly
        $crmDashboardUrl = env('CRM_SERVICE_URL', 'http://localhost:8001') . '/dashboard';
        $isCrmDashboardRedirect = $redirectUrl === $crmDashboardUrl;

        // If it's a direct dashboard redirect, use the callback URL instead
        // This ensures proper authentication in the CRM service
        if ($isCrmDashboardRedirect) {
            $redirectUrl = $defaultCallbackUrl;

            // Store the original dashboard URL as the intended destination after auth
            session(['crm_intended_url' => $crmDashboardUrl]);

            Log::info('Redirecting to CRM callback instead of dashboard directly', [
                'original_redirect' => $crmDashboardUrl,
                'new_redirect' => $redirectUrl,
                'intended_url_stored' => session('crm_intended_url')
            ]);
        }

        // Log the redirect URL from session
        Log::info('Redirect URL from session', [
            'session_redirect' => session('redirect_after_login'),
            'default_callback' => $defaultCallbackUrl,
            'final_redirect' => $redirectUrl,
            'crm_intended_url' => session('crm_intended_url')
        ]);

        // Clear the redirect URL from the session
        session()->forget('redirect_after_login');

        // Add the token to the redirect URL
        $redirectUrl = $redirectUrl . (strpos($redirectUrl, '?') !== false ? '&' : '?') . 'token=' . $token;

        // If we have an intended URL for the CRM, add it to the redirect URL
        if (session('crm_intended_url')) {
            $redirectUrl .= '&intended=' . urlencode(session('crm_intended_url'));
            session()->forget('crm_intended_url');
        }

        // Log the final redirect URL
        Log::info('Final redirect URL', [
            'url' => $redirectUrl
        ]);

        // Redirect to CRM service with token
        return redirect($redirectUrl);
    }
}
