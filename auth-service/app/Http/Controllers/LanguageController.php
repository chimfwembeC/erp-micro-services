<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;

class LanguageController extends Controller
{
    /**
     * Available languages
     */
    protected $languages = ['en', 'bem', 'nya', 'toi'];

    /**
     * Change the application language
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function changeLanguage(Request $request)
    {
        $request->validate([
            'language' => 'required|string|in:en,bem,nya,toi',
        ]);

        $language = $request->language;

        // Set the application locale
        App::setLocale($language);
        Session::put('locale', $language);

        // If user is authenticated, save the preference
        if (Auth::check()) {
            $user = Auth::user();
            $user->preferred_language = $language;
            $user->save();

            Log::info('User language preference updated', [
                'user_id' => $user->id,
                'language' => $language
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => __('messages.language_changed'),
            'language' => $language
        ]);
    }

    /**
     * Get the current language
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCurrentLanguage(Request $request)
    {
        // Get language from user preference, session, or default
        $language = Auth::check()
            ? Auth::user()->preferred_language
            : (Session::get('locale') ?? App::getLocale());

        return response()->json([
            'language' => $language
        ]);
    }

    /**
     * Get all available languages
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAvailableLanguages()
    {
        $languages = [
            'en' => ['name' => 'English', 'nativeName' => 'English', 'flag' => '🇬🇧'],
            'bem' => ['name' => 'Bemba', 'nativeName' => 'Bemba', 'flag' => '🇿🇲'],
            'nya' => ['name' => 'Nyanja', 'nativeName' => 'Nyanja', 'flag' => '🇿🇲'],
            'toi' => ['name' => 'Tonga', 'nativeName' => 'Tonga', 'flag' => '🇿🇲'],
        ];

        return response()->json([
            'languages' => $languages
        ]);
    }
}
