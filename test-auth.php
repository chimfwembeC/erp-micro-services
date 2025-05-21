<?php

require __DIR__ . '/vendor/autoload.php';

use App\Services\AuthService;
use Illuminate\Support\Facades\Log;

// Create a new instance of the AuthService
$authService = new AuthService();

// Get a token from the auth service
echo "Getting a token from the auth service...\n";
$token = null;

// Try to get a service token
$serviceToken = $authService->getServiceToken();
if ($serviceToken) {
    echo "Successfully obtained service token: " . substr($serviceToken, 0, 10) . "...\n";
    $token = $serviceToken;
} else {
    echo "Failed to get service token.\n";
}

// If we have a token, try to validate it
if ($token) {
    echo "Validating token...\n";
    $validationResult = $authService->validateToken($token);
    
    if ($validationResult) {
        echo "Token validation result: " . json_encode($validationResult, JSON_PRETTY_PRINT) . "\n";
    } else {
        echo "Token validation failed.\n";
    }
}

// Try to get user data with the token
if ($token) {
    echo "Getting user data...\n";
    $userData = $authService->getUserData($token);
    
    if ($userData) {
        echo "User data: " . json_encode($userData, JSON_PRETTY_PRINT) . "\n";
    } else {
        echo "Failed to get user data.\n";
    }
}

echo "Test completed.\n";
