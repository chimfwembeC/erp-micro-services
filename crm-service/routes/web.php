<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Direct login route
Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

// Direct register route
Route::get('/register', function () {
    return Inertia::render('Auth/Register');
})->name('register');

// Direct dashboard access (no authentication for now)
Route::group([], function () {
    // Dashboard route
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // Client routes
    Route::resource('clients', \App\Http\Controllers\ClientController::class);

    // Lead routes
    Route::resource('leads', \App\Http\Controllers\LeadController::class);
    Route::post('leads/{lead}/convert', [\App\Http\Controllers\LeadController::class, 'convertToClient'])->name('leads.convert');

    // Communication routes
    Route::resource('communications', \App\Http\Controllers\CommunicationController::class);
    Route::get('clients/{client}/communications/create', [\App\Http\Controllers\CommunicationController::class, 'createForClient'])->name('clients.communications.create');
    Route::get('leads/{lead}/communications/create', [\App\Http\Controllers\CommunicationController::class, 'createForLead'])->name('leads.communications.create');
    Route::get('clients/{client}/communications', [\App\Http\Controllers\CommunicationController::class, 'getClientCommunications'])->name('clients.communications.index');
    Route::get('leads/{lead}/communications', [\App\Http\Controllers\CommunicationController::class, 'getLeadCommunications'])->name('leads.communications.index');

    // Chat routes
    Route::get('clients/{client}/chat', [\App\Http\Controllers\ChatController::class, 'showClientChat'])->name('clients.chat');
    Route::get('leads/{lead}/chat', [\App\Http\Controllers\ChatController::class, 'showLeadChat'])->name('leads.chat');
    Route::post('clients/{client}/chat', [\App\Http\Controllers\ChatController::class, 'sendMessageToClient'])->name('clients.chat.send');
    Route::post('leads/{lead}/chat', [\App\Http\Controllers\ChatController::class, 'sendMessageToLead'])->name('leads.chat.send');
    Route::post('clients/{client}/chat/read', [\App\Http\Controllers\ChatController::class, 'markClientMessagesAsRead'])->name('clients.chat.read');
    Route::post('leads/{lead}/chat/read', [\App\Http\Controllers\ChatController::class, 'markLeadMessagesAsRead'])->name('leads.chat.read');
    Route::get('chat/unread', [\App\Http\Controllers\ChatController::class, 'getUnreadMessages'])->name('chat.unread');
});
