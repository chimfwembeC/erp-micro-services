<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class LeadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $leads = Lead::with(['createdBy:id,name', 'updatedBy:id,name'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Leads/Index', [
            'leads' => $leads,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Leads/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:leads,email',
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:255',
            'status' => 'required|in:new,contacted,qualified,unqualified,negotiation,won,lost',
            'notes' => 'nullable|string|max:5000',
        ]);

        $lead = new Lead($validated);
        $lead->created_by_id = Auth::id();
        $lead->updated_by_id = Auth::id();
        $lead->save();

        return Redirect::route('leads.index')
            ->with('success', 'Lead created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Lead $lead)
    {
        $lead->load(['createdBy:id,name', 'updatedBy:id,name']);

        return Inertia::render('Leads/Show', [
            'lead' => $lead,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Lead $lead)
    {
        return Inertia::render('Leads/Edit', [
            'lead' => $lead,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Lead $lead)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:leads,email,' . $lead->id,
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:255',
            'status' => 'required|in:new,contacted,qualified,unqualified,negotiation,won,lost',
            'notes' => 'nullable|string|max:5000',
        ]);

        $lead->fill($validated);
        $lead->updated_by_id = Auth::id();
        $lead->save();

        return Redirect::route('leads.index')
            ->with('success', 'Lead updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lead $lead)
    {
        $lead->delete();

        return Redirect::route('leads.index')
            ->with('success', 'Lead deleted successfully.');
    }

    /**
     * Convert a lead to a client.
     */
    public function convertToClient(Lead $lead)
    {
        // Create a new client from the lead data
        $client = new \App\Models\Client([
            'name' => $lead->name,
            'email' => $lead->email,
            'phone' => $lead->phone,
            'company' => $lead->company,
            'status' => 'active',
            'notes' => $lead->notes . "\n\nConverted from lead on " . now()->format('Y-m-d H:i:s'),
        ]);

        $client->created_by_id = Auth::id();
        $client->updated_by_id = Auth::id();
        $client->save();

        // Mark the lead as won
        $lead->status = 'won';
        $lead->updated_by_id = Auth::id();
        $lead->save();

        return Redirect::route('clients.show', $client->id)
            ->with('success', 'Lead converted to client successfully.');
    }
}
