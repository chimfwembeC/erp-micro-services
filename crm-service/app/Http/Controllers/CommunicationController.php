<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Communication;
use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class CommunicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $communications = Communication::with(['client', 'lead', 'createdBy:id,name'])
            ->orderBy('date', 'desc')
            ->paginate(10);

        return Inertia::render('Communications/Index', [
            'communications' => $communications,
        ]);
    }

    /**
     * Show the form for creating a new resource for a client.
     */
    public function createForClient(Client $client)
    {
        return Inertia::render('Communications/Create', [
            'client' => $client,
            'entityType' => 'client',
            'entityId' => $client->id,
        ]);
    }

    /**
     * Show the form for creating a new resource for a lead.
     */
    public function createForLead(Lead $lead)
    {
        return Inertia::render('Communications/Create', [
            'lead' => $lead,
            'entityType' => 'lead',
            'entityId' => $lead->id,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'nullable|exists:clients,id',
            'lead_id' => 'nullable|exists:leads,id',
            'type' => 'required|in:email,call,meeting,note,other',
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
            'date' => 'required|date',
        ]);

        // Ensure either client_id or lead_id is provided, but not both
        if (empty($validated['client_id']) && empty($validated['lead_id'])) {
            return back()->withErrors(['error' => 'Either client or lead must be specified.']);
        }

        if (!empty($validated['client_id']) && !empty($validated['lead_id'])) {
            return back()->withErrors(['error' => 'Communication cannot be associated with both a client and a lead.']);
        }

        $communication = new Communication($validated);
        $communication->created_by_id = Auth::id();
        $communication->save();

        // Redirect based on whether this is for a client or lead
        if (!empty($validated['client_id'])) {
            return Redirect::route('clients.show', $validated['client_id'])
                ->with('success', 'Communication added successfully.');
        } else {
            return Redirect::route('leads.show', $validated['lead_id'])
                ->with('success', 'Communication added successfully.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Communication $communication)
    {
        $communication->load(['client', 'lead', 'createdBy:id,name']);

        return Inertia::render('Communications/Show', [
            'communication' => $communication,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Communication $communication)
    {
        $communication->load(['client', 'lead']);

        $entityType = $communication->client_id ? 'client' : 'lead';
        $entityId = $communication->client_id ?? $communication->lead_id;

        return Inertia::render('Communications/Edit', [
            'communication' => $communication,
            'entityType' => $entityType,
            'entityId' => $entityId,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Communication $communication)
    {
        $validated = $request->validate([
            'type' => 'required|in:email,call,meeting,note,other',
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
            'date' => 'required|date',
        ]);

        $communication->update($validated);

        // Redirect based on whether this is for a client or lead
        if ($communication->client_id) {
            return Redirect::route('clients.show', $communication->client_id)
                ->with('success', 'Communication updated successfully.');
        } else {
            return Redirect::route('leads.show', $communication->lead_id)
                ->with('success', 'Communication updated successfully.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Communication $communication)
    {
        // Store the IDs before deleting
        $clientId = $communication->client_id;
        $leadId = $communication->lead_id;

        $communication->delete();

        // Redirect based on whether this was for a client or lead
        if ($clientId) {
            return Redirect::route('clients.show', $clientId)
                ->with('success', 'Communication deleted successfully.');
        } else {
            return Redirect::route('leads.show', $leadId)
                ->with('success', 'Communication deleted successfully.');
        }
    }

    /**
     * Get communications for a specific client.
     */
    public function getClientCommunications(Client $client)
    {
        $communications = $client->communications()
            ->with('createdBy:id,name')
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($communications);
    }

    /**
     * Get communications for a specific lead.
     */
    public function getLeadCommunications(Lead $lead)
    {
        $communications = $lead->communications()
            ->with('createdBy:id,name')
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($communications);
    }
}
