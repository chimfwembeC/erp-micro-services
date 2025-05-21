<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (! Gate::allows('view_services')) {
            abort(403);
        }

        $services = Service::all();

        return Inertia::render('Services/Index', [
            'services' => $services->map(function ($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'description' => $service->description,
                    'service_id' => $service->service_id,
                    'permissions' => $service->permissions,
                    'is_active' => $service->is_active,
                    'created_at' => $service->created_at,
                ];
            }),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (! Gate::allows('create_services')) {
            abort(403);
        }

        return Inertia::render('Services/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (! Gate::allows('create_services')) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:services,name',
            'description' => 'nullable|string|max:1000',
            'service_id' => 'required|string|max:255|unique:services,service_id',
            'permissions' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        // Generate a random service secret
        $validated['service_secret'] = Str::random(32);

        // Create the service
        $service = Service::create($validated);

        Log::info('Service created', [
            'service_id' => $service->id,
            'service_name' => $service->name,
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('services.index')
            ->with('message', 'Service created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        if (! Gate::allows('view_services')) {
            abort(403);
        }

        $service = Service::findOrFail($id);

        return Inertia::render('Services/Show', [
            'service' => [
                'id' => $service->id,
                'name' => $service->name,
                'description' => $service->description,
                'service_id' => $service->service_id,
                'service_secret' => $service->service_secret,
                'permissions' => $service->permissions,
                'is_active' => $service->is_active,
                'created_at' => $service->created_at,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        if (! Gate::allows('edit_services')) {
            abort(403);
        }

        $service = Service::findOrFail($id);

        return Inertia::render('Services/Edit', [
            'service' => [
                'id' => $service->id,
                'name' => $service->name,
                'description' => $service->description,
                'service_id' => $service->service_id,
                'permissions' => $service->permissions,
                'is_active' => $service->is_active,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        if (! Gate::allows('edit_services')) {
            abort(403);
        }

        $service = Service::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:services,name,' . $id,
            'description' => 'nullable|string|max:1000',
            'service_id' => 'required|string|max:255|unique:services,service_id,' . $id,
            'permissions' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $service->update($validated);

        Log::info('Service updated', [
            'service_id' => $service->id,
            'service_name' => $service->name,
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('services.index')
            ->with('message', 'Service updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        if (! Gate::allows('delete_services')) {
            abort(403);
        }

        $service = Service::findOrFail($id);
        $serviceName = $service->name;

        // Delete the service
        $service->delete();

        Log::info('Service deleted', [
            'service_id' => $id,
            'service_name' => $serviceName,
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('services.index')
            ->with('message', 'Service deleted successfully.');
    }

    /**
     * Regenerate the service secret.
     */
    public function regenerateSecret(string $id)
    {
        if (! Gate::allows('edit_services')) {
            abort(403);
        }

        $service = Service::findOrFail($id);
        
        // Generate a new service secret
        $service->service_secret = Str::random(32);
        $service->save();

        Log::info('Service secret regenerated', [
            'service_id' => $service->id,
            'service_name' => $service->name,
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('services.show', $service->id)
            ->with('message', 'Service secret regenerated successfully.');
    }
}
