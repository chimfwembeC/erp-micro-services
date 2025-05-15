<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\CommunicationController;
use App\Http\Controllers\Api\ChatController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Protected API routes
Route::middleware('auth:sanctum')->group(function () {
    // Client routes
    Route::apiResource('clients', ClientController::class);
    Route::get('client-statistics', [ClientController::class, 'statistics']);

    // Lead routes
    Route::apiResource('leads', LeadController::class);
    Route::post('leads/{id}/convert', [LeadController::class, 'convertToClient']);
    Route::get('lead-statistics', [LeadController::class, 'statistics']);

    // Communication routes
    Route::apiResource('communications', CommunicationController::class);
    Route::get('clients/{clientId}/communications', [CommunicationController::class, 'getClientCommunications']);
    Route::get('leads/{leadId}/communications', [CommunicationController::class, 'getLeadCommunications']);

    // Chat routes
    Route::get('clients/{clientId}/messages', [ChatController::class, 'getClientMessages']);
    Route::get('leads/{leadId}/messages', [ChatController::class, 'getLeadMessages']);
    Route::post('clients/{clientId}/messages', [ChatController::class, 'sendMessageToClient']);
    Route::post('leads/{leadId}/messages', [ChatController::class, 'sendMessageToLead']);
    Route::post('clients/{clientId}/messages/read', [ChatController::class, 'markClientMessagesAsRead']);
    Route::post('leads/{leadId}/messages/read', [ChatController::class, 'markLeadMessagesAsRead']);
    Route::get('messages/unread', [ChatController::class, 'getUnreadMessages']);
});
