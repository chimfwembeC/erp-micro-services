<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class LeadController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = Lead::with(['createdBy:id,name', 'updatedBy:id,name']);

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Search by name or email
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%");
            });
        }

        // Sort by field
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Paginate results
        $perPage = $request->input('per_page', 15);
        $leads = $query->paginate($perPage);

        return response()->json($leads);
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
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:leads,email',
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:255',
            'status' => 'required|in:new,contacted,qualified,unqualified,negotiation,won,lost',
            'notes' => 'nullable|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $lead = new Lead($request->all());
        $lead->created_by_id = Auth::id();
        $lead->updated_by_id = Auth::id();
        $lead->save();

        return response()->json($lead, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $lead = Lead::with(['createdBy:id,name', 'updatedBy:id,name'])->findOrFail($id);
        return response()->json($lead);
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
        $lead = Lead::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:leads,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:255',
            'status' => 'required|in:new,contacted,qualified,unqualified,negotiation,won,lost',
            'notes' => 'nullable|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $lead->fill($request->all());
        $lead->updated_by_id = Auth::id();
        $lead->save();

        return response()->json($lead);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $lead = Lead::findOrFail($id);
        $lead->delete();

        return response()->json(null, 204);
    }

    /**
     * Convert a lead to a client.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function convertToClient($id)
    {
        $lead = Lead::findOrFail($id);

        // Create a new client from the lead data
        $client = new Client([
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

        return response()->json([
            'message' => 'Lead converted to client successfully',
            'client' => $client,
            'lead' => $lead
        ]);
    }

    /**
     * Get lead statistics.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function statistics()
    {
        $stats = [
            'total' => Lead::count(),
            'new' => Lead::where('status', 'new')->count(),
            'contacted' => Lead::where('status', 'contacted')->count(),
            'qualified' => Lead::where('status', 'qualified')->count(),
            'unqualified' => Lead::where('status', 'unqualified')->count(),
            'negotiation' => Lead::where('status', 'negotiation')->count(),
            'won' => Lead::where('status', 'won')->count(),
            'lost' => Lead::where('status', 'lost')->count(),
        ];

        return response()->json($stats);
    }
}
