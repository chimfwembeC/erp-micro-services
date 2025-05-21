<?php

use App\Http\Controllers\Auth\AuthCallbackController;
use App\Http\Controllers\Auth\CrmLoginController;
use App\Http\Controllers\Auth\CustomLoginController;
use App\Http\Controllers\Auth\CustomVerifyEmailController;
use App\Http\Controllers\Auth\RedirectController;
use App\Http\Controllers\Auth\SimpleRegisterController;
use App\Http\Controllers\Auth\SsoController;
use App\Http\Controllers\AuditController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Laravel\Fortify\Http\Controllers\EmailVerificationNotificationController;
use Laravel\Fortify\Http\Controllers\EmailVerificationPromptController;
use Laravel\Fortify\Http\Controllers\VerifyEmailController;

Route::get('/', function () {
    return Inertia::render('Welcome.new', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

// Custom login route to handle redirect parameter
// Route::get('/login', [CustomLoginController::class, 'showLoginForm'])
//     ->middleware(['guest'])
//     ->name('login');

// CRM-specific login route
Route::get('/auth/login', [CrmLoginController::class, 'showLoginForm'])
    ->middleware(['guest'])
    ->name('crm.login');

// SSO routes
Route::prefix('sso')->group(function () {
    // SSO login route
    Route::post('/login', [SsoController::class, 'login'])
        ->middleware(['web'])
        ->name('sso.login');

    // SSO logout route
    Route::post('/logout', [SsoController::class, 'logout'])
        ->middleware(['auth:sanctum'])
        ->name('sso.logout');
});

// Auth callback route to handle SSO from auth service
Route::get('/auth/callback', [AuthCallbackController::class, 'handleCallback'])
    ->name('auth.callback');

// Guest pages
Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/services', function () {
    return Inertia::render('Services');
})->name('services');

Route::get('/portfolio', function () {
    return Inertia::render('Portfolio');
})->name('portfolio');

Route::get('/team', function () {
    return Inertia::render('Team');
})->name('team');

Route::get('/contact', function () {
    $service = request()->query('service');
    return Inertia::render('Contact', [
        'service' => $service
    ]);
})->name('contact');

Route::get('/blog', function () {
    return Inertia::render('Blog');
})->name('blog');

Route::get('/privacy', function () {
    return Inertia::render('PrivacyPolicy');
})->name('privacy');

Route::get('/terms', function () {
    return Inertia::render('TermsOfService');
})->name('terms');

// Test route for password reset
Route::get('/test-password-reset', function () {
    $user = \App\Models\User::where('email', 'test@example.com')->first();

    if (!$user) {
        $user = new \App\Models\User();
        $user->name = 'Test User';
        $user->email = 'test@example.com';
        $user->password = \Illuminate\Support\Facades\Hash::make('password');
        $user->email_verified_at = now();
        $user->save();
    }

    \Illuminate\Support\Facades\Password::broker()->sendResetLink(
        ['email' => 'test@example.com']
    );

    return 'Password reset link sent to test@example.com. Check your Mailtrap inbox.';
});

// Test route for email verification
Route::get('/test-email-verification', function () {
    // Get the user
    $user = \App\Models\User::where('email', 'admin@tekrem.com')->first();

    if (!$user) {
        return 'User not found';
    }

    // Set email_verified_at to null to make the user unverified
    $user->email_verified_at = null;
    $user->save();

    // Send the verification email
    $user->sendEmailVerificationNotification();

    return 'Verification email sent to ' . $user->email . '. Check your Mailtrap inbox.';
});

// Test route for mail
Route::get('/test-mail', function () {
    try {
        \Illuminate\Support\Facades\Mail::raw('Test email from TekRem', function ($message) {
            $message->to('admin@tekrem.com')
                ->subject('Test Email');
        });

        return 'Test email sent to admin@tekrem.com. Check your Mailtrap inbox.';
    } catch (\Exception $e) {
        return 'Error sending email: ' . $e->getMessage();
    }
});

// Simple registration routes
Route::get('/simple-register', [SimpleRegisterController::class, 'showRegistrationForm'])
    ->name('simple.register.form');
Route::post('/simple-register', [SimpleRegisterController::class, 'register'])
    ->name('simple.register');

// Email Verification Routes
if (Features::enabled(Features::emailVerification())) {
    Route::get('/email/verify', [EmailVerificationPromptController::class, '__invoke'])
        ->middleware(['auth'])
        ->name('verification.notice');

    // Original verification route (requires auth)
    Route::get('/email/verify/{id}/{hash}', [VerifyEmailController::class, '__invoke'])
        ->middleware(['auth', 'signed', 'throttle:6,1'])
        ->name('verification.verify');

    // Custom verification route (doesn't require auth)
    Route::get('/verify-email/{id}/{hash}', [CustomVerifyEmailController::class, 'verify'])
        ->middleware(['throttle:6,1'])
        ->name('custom.verification.verify');

    Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware(['auth', 'throttle:6,1'])
        ->name('verification.send');
}

// Direct redirect to CRM service
Route::get('/redirect-to-crm', [RedirectController::class, 'redirectToCrm'])
    ->middleware(['auth:sanctum', config('jetstream.auth_session'), 'verified'])
    ->name('redirect.crm');

Route::middleware([
    'sso.auth',
])->group(function () {
    Route::get('/dashboard', function () {
        // Check if there's a redirect parameter in the session
        $redirect = session('redirect_after_login');

        // Log the redirect parameter for debugging
        \Illuminate\Support\Facades\Log::info('Dashboard accessed', [
            'redirect_param' => $redirect,
            'has_from_crm' => request()->has('from_crm'),
            'session_data' => session()->all(),
            'request_url' => request()->fullUrl(),
            'request_query' => request()->query(),
        ]);

        // Check if the user is coming from the CRM service or has a redirect parameter
        if (request()->has('from_crm') || $redirect) {
            return redirect()->route('redirect.crm');
        }

        // Check if there's a redirect query parameter
        if (request()->has('redirect')) {
            $redirectUrl = request()->input('redirect');

            // Check if the redirect URL is for the CRM dashboard directly
            $crmDashboardUrl = env('CRM_SERVICE_URL', 'http://localhost:8001') . '/dashboard';
            $isCrmDashboardRedirect = $redirectUrl === $crmDashboardUrl;

            // If it's a direct dashboard redirect, use the callback URL instead
            if ($isCrmDashboardRedirect) {
                // Store the original dashboard URL as the intended destination after auth
                session(['crm_intended_url' => $crmDashboardUrl]);

                // Use the callback URL instead
                $redirectUrl = env('CRM_SERVICE_URL', 'http://localhost:8001') . '/auth/callback';

                \Illuminate\Support\Facades\Log::info('Dashboard: Redirecting to CRM callback instead of dashboard directly', [
                    'original_redirect' => $crmDashboardUrl,
                    'new_redirect' => $redirectUrl,
                    'intended_url_stored' => session('crm_intended_url')
                ]);
            }

            // Store the redirect parameter in the session
            session(['redirect_after_login' => $redirectUrl]);
            return redirect()->route('redirect.crm');
        }

        return Inertia::render('Dashboard');
    })->name('dashboard');

    // User management routes
    Route::resource('users', UserController::class);

    // Role management routes
    Route::resource('roles', RoleController::class);

    // Roles Dashboard route
    Route::get('/roles-dashboard', function () {
        return Inertia::render('Roles/Dashboard');
    })->name('roles.dashboard')->middleware('can:view_roles');

    // Permission management routes
    Route::resource('permissions', PermissionController::class);

    // Dashboard statistics route (web version as fallback)
    Route::get('/web-dashboard-statistics', [DashboardController::class, 'statistics'])->name('web.dashboard.statistics');

    // Roles statistics route (web version as fallback)
    Route::get('/web-roles-statistics', [RoleController::class, 'statistics'])->name('web.roles.statistics');

    // Roles API fallback route
    Route::get('/web-roles', [RoleController::class, 'index'])->name('web.roles.index');

    // Permissions API fallback route
    Route::get('/web-permissions', [PermissionController::class, 'index'])->name('web.permissions.index');

    // Users API fallback route
    Route::get('/web-users', [UserController::class, 'index'])->name('web.users.index');

    // Example pages
    Route::get('/examples/permission-error-handling', function () {
        return Inertia::render('Examples/PermissionErrorHandling');
    })->name('examples.permission-error-handling');

    // Audit routes
    Route::get('/audits', [AuditController::class, 'index'])
        ->name('audits.index')
        ->middleware('can:view_audit_logs');
    Route::get('/audits/export', [AuditController::class, 'export'])
        ->name('audits.export')
        ->middleware('can:export_audit_logs');
    Route::get('/audits/{audit}', [AuditController::class, 'show'])
        ->name('audits.show')
        ->middleware('can:view_audit_logs');

    // Service management routes
    Route::resource('services', ServiceController::class);

    // Route for regenerating service secret
    Route::post('/services/{service}/regenerate-secret', [ServiceController::class, 'regenerateSecret'])
        ->name('services.regenerate-secret')
        ->middleware('can:edit_services');
});
