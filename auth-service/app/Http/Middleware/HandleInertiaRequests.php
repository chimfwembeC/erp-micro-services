<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Get the current locale
        $locale = App::getLocale();

        // Get user's preferred language if authenticated
        $preferredLanguage = null;
        if ($request->user()) {
            $preferredLanguage = $request->user()->preferred_language;
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ?? session('auth_user'),
                'authenticated' => $request->user() !== null || session()->has('auth_user'),
            ],
            'locale' => [
                'current' => $locale,
                'preferred' => $preferredLanguage,
                'available' => [
                    'en' => ['name' => 'English', 'nativeName' => 'English', 'flag' => '🇬🇧'],
                    'bem' => ['name' => 'Bemba', 'nativeName' => 'Bemba', 'flag' => '🇿🇲'],
                    'nya' => ['name' => 'Nyanja', 'nativeName' => 'Nyanja', 'flag' => '🇿🇲'],
                    'toi' => ['name' => 'Tonga', 'nativeName' => 'Tonga', 'flag' => '🇿🇲'],
                ],
            ],
        ];
    }
}
