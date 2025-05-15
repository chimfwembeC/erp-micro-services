<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use App\Models\Client;
use App\Models\Lead;
use App\Events\NewChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ChatController extends Controller
{
    /**
     * Get messages for a client.
     *
     * @param  int  $clientId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getClientMessages($clientId)
    {
        $client = Client::findOrFail($clientId);
        $messages = $client->chatMessages()
            ->with('user:id,name,profile_photo_url')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }

    /**
     * Get messages for a lead.
     *
     * @param  int  $leadId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLeadMessages($leadId)
    {
        $lead = Lead::findOrFail($leadId);
        $messages = $lead->chatMessages()
            ->with('user:id,name,profile_photo_url')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }

    /**
     * Send a message to a client.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $clientId
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendMessageToClient(Request $request, $clientId)
    {
        $client = Client::findOrFail($clientId);

        $validator = Validator::make($request->all(), [
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $message = new ChatMessage([
            'user_id' => Auth::id(),
            'client_id' => $client->id,
            'message' => $request->message,
            'is_from_user' => true,
            'is_read' => false,
        ]);

        $message->save();

        // Broadcast the new message
        broadcast(new NewChatMessage($message))->toOthers();

        return response()->json($message->load('user:id,name,profile_photo_url'), 201);
    }

    /**
     * Send a message to a lead.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $leadId
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendMessageToLead(Request $request, $leadId)
    {
        $lead = Lead::findOrFail($leadId);

        $validator = Validator::make($request->all(), [
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $message = new ChatMessage([
            'user_id' => Auth::id(),
            'lead_id' => $lead->id,
            'message' => $request->message,
            'is_from_user' => true,
            'is_read' => false,
        ]);

        $message->save();

        // Broadcast the new message
        broadcast(new NewChatMessage($message))->toOthers();

        return response()->json($message->load('user:id,name,profile_photo_url'), 201);
    }

    /**
     * Mark all messages as read for a client.
     *
     * @param  int  $clientId
     * @return \Illuminate\Http\JsonResponse
     */
    public function markClientMessagesAsRead($clientId)
    {
        $client = Client::findOrFail($clientId);
        $client->chatMessages()
            ->where('is_read', false)
            ->where('is_from_user', false)
            ->update(['is_read' => true]);

        return response()->json(['success' => true]);
    }

    /**
     * Mark all messages as read for a lead.
     *
     * @param  int  $leadId
     * @return \Illuminate\Http\JsonResponse
     */
    public function markLeadMessagesAsRead($leadId)
    {
        $lead = Lead::findOrFail($leadId);
        $lead->chatMessages()
            ->where('is_read', false)
            ->where('is_from_user', false)
            ->update(['is_read' => true]);

        return response()->json(['success' => true]);
    }

    /**
     * Get all unread messages.
     *
     * @return \Illuminate\Http\JsonResponse
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
