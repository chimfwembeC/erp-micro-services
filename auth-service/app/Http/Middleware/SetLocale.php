<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated and has a preferred language
        if (Auth::check() && Auth::user()->preferred_language) {
            $locale = Auth::user()->preferred_language;
        } 
        // Check if locale is set in session
        elseif (Session::has('locale')) {
            $locale = Session::get('locale');
        } 
        // Check if locale is set in request
        elseif ($request->has('lang')) {
            $locale = $request->input('lang');
            Session::put('locale', $locale);
        } 
        // Default to application locale
        else {
            $locale = config('app.locale', 'en');
        }

        // Ensure locale is valid
        $validLocales = ['en', 'bem', 'nya', 'toi'];
        if (!in_array($locale, $validLocales)) {
            $locale = 'en';
        }

        // Set the application locale
        App::setLocale($locale);

        return $next($request);
    }
}
