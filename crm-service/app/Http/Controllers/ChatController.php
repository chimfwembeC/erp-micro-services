<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\Client;
use App\Models\Lead;
use App\Events\NewChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChatController extends Controller
{
    /**
     * Show the chat interface for a client.
     */
    public function showClientChat(Client $client)
    {
        $messages = $client->chatMessages()
            ->with('user:id,name,profile_photo_url')
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('Chat/Show', [
            'entityType' => 'client',
            'entity' => $client,
            'messages' => $messages,
        ]);
    }

    /**
     * Show the chat interface for a lead.
     */
    public function showLeadChat(Lead $lead)
    {
        $messages = $lead->chatMessages()
            ->with('user:id,name,profile_photo_url')
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('Chat/Show', [
            'entityType' => 'lead',
            'entity' => $lead,
            'messages' => $messages,
        ]);
    }

    /**
     * Send a message to a client.
     */
    public function sendMessageToClient(Request $request, Client $client)
    {
        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        $message = new ChatMessage([
            'user_id' => Auth::id(),
            'client_id' => $client->id,
            'message' => $validated['message'],
            'is_from_user' => true,
            'is_read' => false,
        ]);

        $message->save();

        // Broadcast the new message
        broadcast(new NewChatMessage($message))->toOthers();

        return response()->json($message->load('user:id,name,profile_photo_url'));
    }

    /**
     * Send a message to a lead.
     */
    public function sendMessageToLead(Request $request, Lead $lead)
    {
        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        $message = new ChatMessage([
            'user_id' => Auth::id(),
            'lead_id' => $lead->id,
            'message' => $validated['message'],
            'is_from_user' => true,
            'is_read' => false,
        ]);

        $message->save();

        // Broadcast the new message
        broadcast(new NewChatMessage($message))->toOthers();

        return response()->json($message->load('user:id,name,profile_photo_url'));
    }

    /**
     * Mark all messages as read for a client.
     */
    public function markClientMessagesAsRead(Client $client)
    {
        $client->chatMessages()
            ->where('is_read', false)
            ->where('is_from_user', false)
            ->update(['is_read' => true]);

        return response()->json(['success' => true]);
    }

    /**
     * Mark all messages as read for a lead.
     */
    public function markLeadMessagesAsRead(Lead $lead)
    {
        $lead->chatMessages()
            ->where('is_read', false)
            ->where('is_from_user', false)
            ->update(['is_read' => true]);

        return response()->json(['success' => true]);
    }

    /**
     * Get all unread messages for the authenticated user.
     */
    public function getUnreadMessages()
    {
        $clientMessages = ChatMessage::where('is_read', false)
            ->where('is_from_user', false)
            ->whereNotNull('client_id')
            ->with(['client:id,name', 'user:id,name,profile_photo_url'])
            ->get();

        $leadMessages = ChatMessage::where('is_read', false)
            ->where('is_from_user', false)
            ->whereNotNull('lead_id')
            ->with(['lead:id,name', 'user:id,name,profile_photo_url'])
            ->get();

        return response()->json([
            'clientMessages' => $clientMessages,
            'leadMessages' => $leadMessages,
        ]);
    }
}
