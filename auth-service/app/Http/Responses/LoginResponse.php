<?php

namespace App\Http\Responses;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Fortify;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request)
    {
        // Check if there's a redirect parameter in the session
        $redirect = session('redirect_after_login');

        // Log the redirect URL for debugging
        Log::info('Login response', [
            'redirect_param' => $redirect,
            'session_data' => session()->all(),
            'request_query' => $request->query(),
        ]);

        // If there's a redirect parameter, use it
        if ($redirect) {
            // Check if the redirect URL is for the CRM dashboard directly
            $crmDashboardUrl = env('CRM_SERVICE_URL', 'http://localhost:8001') . '/dashboard';
            $isCrmDashboardRedirect = $redirect === $crmDashboardUrl;

            // If it's a direct dashboard redirect, handle it properly
            if ($isCrmDashboardRedirect) {
                // Store the original dashboard URL as the intended destination after auth
                session(['crm_intended_url' => $crmDashboardUrl]);

                // Use the callback URL instead
                $redirect = env('CRM_SERVICE_URL', 'http://localhost:8001') . '/auth/callback';

                Log::info('Redirecting to CRM callback instead of dashboard directly', [
                    'original_redirect' => $crmDashboardUrl,
                    'new_redirect' => $redirect,
                    'intended_url_stored' => session('crm_intended_url')
                ]);
            }

            // Clear the redirect parameter from the session
            session()->forget('redirect_after_login');

            // Generate a token for the user
            $user = $request->user();
            $token = $user->createToken('sso-token')->plainTextToken;

            // Prepare the redirect URL with the token
            $redirectUrl = $redirect . (strpos($redirect, '?') !== false ? '&' : '?') . 'token=' . $token;

            // If we have an intended URL for the CRM, add it to the redirect URL
            if (session('crm_intended_url')) {
                $redirectUrl .= '&intended=' . urlencode(session('crm_intended_url'));
                session()->forget('crm_intended_url');
            }

            // Log the final redirect URL
            Log::info('Final redirect URL from login response', [
                'url' => $redirectUrl
            ]);

            // Redirect to the specified URL with the token
            return redirect($redirectUrl);
        }

        // Check if the request is coming from the CRM service
        $referer = $request->headers->get('referer');
        $fromCrm = $request->session()->get('from_crm') ||
                  (is_string($referer) && strpos($referer, 'localhost:8001') !== false);

        Log::info('Login referer check', [
            'referer' => $referer,
            'from_crm_session' => $request->session()->get('from_crm'),
            'from_crm_detected' => $fromCrm
        ]);

        if ($fromCrm) {
            // This is a login from the CRM service, redirect back to CRM
            // Store the default CRM callback URL if not already set
            if (!session('redirect_after_login')) {
                session(['redirect_after_login' => 'http://localhost:8001/auth/callback']);
            }

            return redirect()->route('redirect.crm');
        }

        // Otherwise, use the default behavior
        return $request->wantsJson()
                    ? response()->json(['two_factor' => false])
                    : redirect()->intended(Fortify::redirects('login', '/dashboard'));
    }
}
