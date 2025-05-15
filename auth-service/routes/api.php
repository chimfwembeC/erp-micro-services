<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SsoApiController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Authentication routes for SSO
Route::prefix('auth')->group(function () {
    // Routes that require authentication
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/validate-token', [AuthController::class, 'validateToken']);
        Route::get('/user', [AuthController::class, 'user']);
    });

    // Routes that don't require authentication
    Route::get('/validate-token-direct', [AuthController::class, 'validateTokenDirect']);

    // SSO login API endpoint (no CSRF protection)
    Route::post('/sso-login', [SsoApiController::class, 'login']);
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
