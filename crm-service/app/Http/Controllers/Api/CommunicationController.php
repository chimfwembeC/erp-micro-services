<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Communication;
use App\Models\Client;
use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CommunicationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = Communication::with(['client', 'lead', 'createdBy:id,name']);

        // Filter by type if provided
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by client_id if provided
        if ($request->has('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        // Filter by lead_id if provided
        if ($request->has('lead_id')) {
            $query->where('lead_id', $request->lead_id);
        }

        // Search by subject or content
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // Sort by field
        $sortField = $request->input('sort_field', 'date');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Paginate results
        $perPage = $request->input('per_page', 15);
        $communications = $query->paginate($perPage);

        return response()->json($communications);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'client_id' => 'nullable|exists:clients,id',
            'lead_id' => 'nullable|exists:leads,id',
            'type' => 'required|in:email,call,meeting,note,other',
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
            'date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Ensure either client_id or lead_id is provided, but not both
        if (empty($request->client_id) && empty($request->lead_id)) {
            return response()->json(['error' => 'Either client or lead must be specified.'], 422);
        }

        if (!empty($request->client_id) && !empty($request->lead_id)) {
            return response()->json(['error' => 'Communication cannot be associated with both a client and a lead.'], 422);
        }

        $communication = new Communication($request->all());
        $communication->created_by_id = Auth::id();
        $communication->save();

        return response()->json($communication, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $communication = Communication::with(['client', 'lead', 'createdBy:id,name'])->findOrFail($id);
        return response()->json($communication);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $communication = Communication::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'type' => 'required|in:email,call,meeting,note,other',
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
            'date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $communication->update($request->only(['type', 'subject', 'content', 'date']));

        return response()->json($communication);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $communication = Communication::findOrFail($id);
        $communication->delete();

        return response()->json(null, 204);
    }

    /**
     * Get communications for a specific client.
     *
     * @param  int  $clientId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getClientCommunications($clientId)
    {
        $client = Client::findOrFail($clientId);
        $communications = $client->communications()
            ->with('createdBy:id,name')
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($communications);
    }

    /**
     * Get communications for a specific lead.
     *
     * @param  int  $leadId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLeadCommunications($leadId)
    {
        $lead = Lead::findOrFail($leadId);
        $communications = $lead->communications()
            ->with('createdBy:id,name')
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($communications);
    }
}
