<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

// Create a test user if it doesn't exist
$email = 'test@example.com';
$user = User::where('email', $email)->first();

if (!$user) {
    $user = new User();
    $user->name = 'Test User';
    $user->email = $email;
    $user->password = Hash::make('password');
    $user->email_verified_at = now();
    $user->save();
    echo "Test user created successfully.\n";
} else {
    echo "Test user already exists.\n";
}

// Send password reset link
$status = Password::sendResetLink(['email' => $email]);

if ($status === Password::RESET_LINK_SENT) {
    echo "Password reset link sent successfully to {$email}. Check your Mailtrap inbox.\n";
} else {
    echo "Failed to send password reset link: {$status}\n";
}
