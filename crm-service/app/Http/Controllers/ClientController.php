<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $clients = Client::with(['createdBy:id,name', 'updatedBy:id,name'])
            ->orderBy('name')
            ->paginate(10);

        return Inertia::render('Clients/Index', [
            'clients' => $clients,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Clients/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:clients,email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:1000',
            'company' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'status' => 'required|in:active,inactive,potential,former',
            'notes' => 'nullable|string|max:5000',
        ]);

        $client = new Client($validated);
        $client->created_by_id = Auth::id();
        $client->updated_by_id = Auth::id();
        $client->save();

        return Redirect::route('clients.index')
            ->with('success', 'Client created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        $client->load(['createdBy:id,name', 'updatedBy:id,name']);

        return Inertia::render('Clients/Show', [
            'client' => $client,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Client $client)
    {
        return Inertia::render('Clients/Edit', [
            'client' => $client,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:clients,email,' . $client->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:1000',
            'company' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'status' => 'required|in:active,inactive,potential,former',
            'notes' => 'nullable|string|max:5000',
        ]);

        $client->fill($validated);
        $client->updated_by_id = Auth::id();
        $client->save();

        return Redirect::route('clients.index')
            ->with('success', 'Client updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        $client->delete();

        return Redirect::route('clients.index')
            ->with('success', 'Client deleted successfully.');
    }
}
