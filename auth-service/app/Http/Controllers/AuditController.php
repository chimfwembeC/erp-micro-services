<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use OwenIt\Auditing\Models\Audit;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use App\Models\Service;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class AuditController extends Controller
{
    /**
     * Display a listing of the audits.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        // Check if user has permission to view audit logs
        if (!Gate::allows('view_audit_logs')) {
            abort(403, 'Unauthorized action.');
        }

        // Get filters from request
        $filters = $request->only(['user', 'model_type', 'event', 'from_date', 'to_date']);

        // Build query
        $query = Audit::with('user')
            ->orderBy('created_at', 'desc');

        // Apply filters
        if (!empty($filters['user']) && $filters['user'] !== 'all') {
            $query->where('user_id', $filters['user']);
        }

        if (!empty($filters['model_type']) && $filters['model_type'] !== 'all') {
            $query->where('auditable_type', $filters['model_type']);
        }

        if (!empty($filters['event']) && $filters['event'] !== 'all') {
            $query->where('event', $filters['event']);
        }

        if (!empty($filters['from_date'])) {
            $query->whereDate('created_at', '>=', $filters['from_date']);
        }

        if (!empty($filters['to_date'])) {
            $query->whereDate('created_at', '<=', $filters['to_date']);
        }

        // Paginate results
        $audits = $query->paginate(15)
            ->withQueryString();

        // Get data for filters
        $users = User::select('id', 'name')->get();
        $modelTypes = [
            'App\\Models\\User' => 'User',
            'App\\Models\\Role' => 'Role',
            'App\\Models\\Permission' => 'Permission',
            'App\\Models\\Service' => 'Service',
        ];
        $eventTypes = ['created', 'updated', 'deleted', 'restored'];

        return Inertia::render('Audit/Index', [
            'audits' => $audits,
            'filters' => $filters,
            'users' => $users,
            'modelTypes' => $modelTypes,
            'eventTypes' => $eventTypes,
        ]);
    }

    /**
     * Display the specified audit.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        // Check if user has permission to view audit logs
        if (!Gate::allows('view_audit_logs')) {
            abort(403, 'Unauthorized action.');
        }

        $audit = Audit::with('user')->findOrFail($id);

        // Get the auditable model
        $auditableType = $audit->auditable_type;
        $auditableId = $audit->auditable_id;
        $auditable = null;

        if (class_exists($auditableType)) {
            $auditable = $auditableType::find($auditableId);
        }

        return Inertia::render('Audit/Show', [
            'audit' => $audit,
            'auditable' => $auditable,
        ]);
    }

    /**
     * Export audit logs as CSV.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function export(Request $request)
    {
        // Check if user has permission to export audit logs
        if (!Gate::allows('export_audit_logs')) {
            abort(403, 'Unauthorized action.');
        }

        // Get filters from request
        $filters = $request->only(['user', 'model_type', 'event', 'from_date', 'to_date']);

        // Build query
        $query = Audit::with('user')
            ->orderBy('created_at', 'desc');

        // Apply filters
        if (!empty($filters['user']) && $filters['user'] !== 'all') {
            $query->where('user_id', $filters['user']);
        }

        if (!empty($filters['model_type']) && $filters['model_type'] !== 'all') {
            $query->where('auditable_type', $filters['model_type']);
        }

        if (!empty($filters['event']) && $filters['event'] !== 'all') {
            $query->where('event', $filters['event']);
        }

        if (!empty($filters['from_date'])) {
            $query->whereDate('created_at', '>=', $filters['from_date']);
        }

        if (!empty($filters['to_date'])) {
            $query->whereDate('created_at', '<=', $filters['to_date']);
        }

        // Get all audits
        $audits = $query->get();

        // Create CSV content
        $headers = [
            'ID',
            'User',
            'Event',
            'Model Type',
            'Model ID',
            'Old Values',
            'New Values',
            'URL',
            'IP Address',
            'User Agent',
            'Created At'
        ];

        $callback = function() use ($audits, $headers) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $headers);

            foreach ($audits as $audit) {
                $row = [
                    $audit->id,
                    $audit->user ? $audit->user->name : 'System',
                    $audit->event,
                    class_basename($audit->auditable_type),
                    $audit->auditable_id,
                    json_encode($audit->old_values),
                    json_encode($audit->new_values),
                    $audit->url,
                    $audit->ip_address,
                    $audit->user_agent,
                    $audit->created_at
                ];

                fputcsv($file, $row);
            }

            fclose($file);
        };

        $filename = 'audit_logs_' . date('Y-m-d_H-i-s') . '.csv';

        return response()->stream($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }
}
