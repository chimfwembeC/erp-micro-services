<?php

use App\Http\Controllers\Api\ServiceAuthController;
use App\Http\Controllers\Api\SsoApiController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Authentication routes for SSO
Route::prefix('auth')->group(function () {
    // Routes that require authentication
    Route::middleware(['auth:sanctum'])->group(function () {
        // Token validation
        Route::get('/validate-token', [SsoApiController::class, 'validateToken']);

        // User logout
        Route::post('/logout', [SsoApiController::class, 'logout']);

        // Service token validation
        Route::get('/validate-service-token', [ServiceAuthController::class, 'validateServiceToken']);
    });

    // Routes that don't require authentication
    Route::post('/login', [SsoApiController::class, 'login']);
    Route::post('/service-token', [ServiceAuthController::class, 'getServiceToken']);
});

// User routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // User routes - using web middleware to ensure session auth works
    Route::apiResource('users', UserController::class)->middleware(['web']);

    // Role routes - using web middleware to ensure session auth works
    Route::apiResource('roles', RoleController::class)->middleware(['web']);
    Route::get('/roles-statistics', [RoleController::class, 'statistics'])
        ->middleware(['web'])
        ->name('roles.statistics');

    // Dashboard routes - using web middleware to ensure session auth works
    Route::get('/dashboard-statistics', [DashboardController::class, 'statistics'])
        ->middleware(['web'])
        ->name('dashboard.statistics');

    // Permission routes - using web middleware to ensure session auth works
    Route::apiResource('permissions', PermissionController::class)->middleware(['web']);

    // Language routes
    Route::prefix('language')->group(function () {
        Route::post('/change', [LanguageController::class, 'changeLanguage']);
        Route::get('/current', [LanguageController::class, 'getCurrentLanguage']);
        Route::get('/available', [LanguageController::class, 'getAvailableLanguages']);
    });

    // Test routes for permission error handling
    Route::get('/simulate-error/{status}', function (Request $request, $status) {
        $statusCode = (int) $status;
        $messages = [
            401 => 'Unauthenticated.',
            403 => 'Forbidden.',
            404 => 'Not Found.',
            422 => 'Validation Error.',
            500 => 'Server Error.'
        ];

        $message = $messages[$statusCode] ?? 'Unknown Error';

        return response()->json(['message' => $message], $statusCode);
    });
});
