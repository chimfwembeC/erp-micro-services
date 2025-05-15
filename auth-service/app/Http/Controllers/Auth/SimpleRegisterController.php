<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules;

class SimpleRegisterController extends Controller
{
    /**
     * Show the registration form.
     *
     * @return \Illuminate\View\View
     */
    public function showRegistrationForm()
    {
        return view('auth.simple-register');
    }
    
    /**
     * Handle a registration request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function register(Request $request)
    {
        // Log the request
        Log::info('Simple registration request', [
            'name' => $request->input('name'),
            'email' => $request->input('email'),
        ]);
        
        // Validate the request
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
        
        if ($validator->fails()) {
            Log::error('Simple registration validation failed', [
                'errors' => $validator->errors()->toArray(),
            ]);
            
            return redirect()->back()->withErrors($validator)->withInput();
        }
        
        // Create the user
        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
        ]);
        
        // Log the user creation
        Log::info('User created', [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ]);
        
        // Fire the Registered event
        event(new Registered($user));
        
        // Return a success message
        return redirect()->back()->with('status', 'Registration successful! Please check your email for a verification link.');
    }
}
