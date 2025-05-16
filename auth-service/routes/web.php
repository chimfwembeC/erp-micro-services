<?php

use App\Http\Controllers\Auth\CustomLoginController;
use App\Http\Controllers\Auth\CustomVerifyEmailController;
use App\Http\Controllers\Auth\SimpleRegisterController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
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
Route::get('/login', [CustomLoginController::class, 'showLoginForm'])
    ->middleware(['guest'])
    ->name('login');



// Guest pages
Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/team', function () {
    return Inertia::render('Team');
})->name('team');

Route::get('/contact', function () {
    return Inertia::render('Contact');
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



Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', function () {


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
});
