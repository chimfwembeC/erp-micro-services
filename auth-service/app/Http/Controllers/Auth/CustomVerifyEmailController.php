<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;

class CustomVerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function verify(Request $request, $id)
    {
        // Log the verification attempt
        Log::info('Email verification attempt', [
            'id' => $id,
            'hash' => $request->route('hash'),
            'signature' => $request->query('signature'),
            'expires' => $request->query('expires'),
        ]);
        
        // Find the user
        $user = User::findOrFail($id);
        
        // Check if the URL is valid
        if (!URL::hasValidSignature($request)) {
            Log::error('Invalid signature for email verification', [
                'id' => $id,
                'user_email' => $user->email,
            ]);
            
            return redirect()->route('verification.notice')
                ->with('error', 'The verification link is invalid.');
        }
        
        // Check if the email has already been verified
        if ($user->hasVerifiedEmail()) {
            Log::info('Email already verified', [
                'id' => $id,
                'user_email' => $user->email,
            ]);
            
            // Log the user in
            Auth::login($user);
            
            return redirect()->route('dashboard')
                ->with('status', 'Your email has already been verified.');
        }
        
        // Mark the email as verified
        $user->markEmailAsVerified();
        
        // Fire the Verified event
        event(new Verified($user));
        
        Log::info('Email verified successfully', [
            'id' => $id,
            'user_email' => $user->email,
        ]);
        
        // Log the user in
        Auth::login($user);
        
        return redirect()->route('dashboard')
            ->with('status', 'Your email has been verified!');
    }
}
