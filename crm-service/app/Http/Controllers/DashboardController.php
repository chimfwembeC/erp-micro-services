<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Lead;
use App\Models\Communication;
use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard based on user role.
     *
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        // Get user from request (set by ValidateAuthToken middleware)
        $user = $request->auth_user ?? null;

        // Log the user data for debugging
        \Illuminate\Support\Facades\Log::info('User data in DashboardController', ['user' => $user]);

        // Default role if user is not available
        $role = $user['role'] ?? 'User';

        // Common data for all dashboards
        $data = [
            'role' => $role,
            'user_id' => $user['id'] ?? 0,
            'recentClients' => Client::latest()->take(5)->get(),
            'recentLeads' => Lead::latest()->take(5)->get(),
            'unreadMessages' => $this->getUnreadMessagesCount(),
        ];

        // Role-specific data
        if ($role === 'Admin') {
            return $this->adminDashboard($data);
        } elseif ($role === 'Manager') {
            return $this->managerDashboard($data);
        } else {
            return $this->userDashboard($data);
        }
    }

    /**
     * Admin dashboard with full statistics.
     *
     * @param array $data
     * @return \Inertia\Response
     */
    private function adminDashboard($data)
    {
        // Client statistics
        $clientStats = [
            'total' => Client::count(),
            'active' => Client::where('status', 'active')->count(),
            'inactive' => Client::where('status', 'inactive')->count(),
            'potential' => Client::where('status', 'potential')->count(),
            'former' => Client::where('status', 'former')->count(),
        ];

        // Lead statistics
        $leadStats = [
            'total' => Lead::count(),
            'new' => Lead::where('status', 'new')->count(),
            'contacted' => Lead::where('status', 'contacted')->count(),
            'qualified' => Lead::where('status', 'qualified')->count(),
            'unqualified' => Lead::where('status', 'unqualified')->count(),
            'negotiation' => Lead::where('status', 'negotiation')->count(),
            'won' => Lead::where('status', 'won')->count(),
            'lost' => Lead::where('status', 'lost')->count(),
        ];

        // Communication statistics
        $communicationStats = [
            'total' => Communication::count(),
            'email' => Communication::where('type', 'email')->count(),
            'call' => Communication::where('type', 'call')->count(),
            'meeting' => Communication::where('type', 'meeting')->count(),
            'note' => Communication::where('type', 'note')->count(),
            'other' => Communication::where('type', 'other')->count(),
        ];

        // Monthly client acquisition
        $clientsByMonth = Client::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('YEAR(created_at) as year'),
            DB::raw('COUNT(*) as count')
        )
            ->whereYear('created_at', date('Y'))
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        // Monthly lead acquisition
        $leadsByMonth = Lead::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('YEAR(created_at) as year'),
            DB::raw('COUNT(*) as count')
        )
            ->whereYear('created_at', date('Y'))
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        // Lead conversion rate
        $leadConversionRate = Lead::where('status', 'won')->count() / max(1, Lead::count()) * 100;

        $data = array_merge($data, [
            'clientStats' => $clientStats,
            'leadStats' => $leadStats,
            'communicationStats' => $communicationStats,
            'clientsByMonth' => $clientsByMonth,
            'leadsByMonth' => $leadsByMonth,
            'leadConversionRate' => $leadConversionRate,
        ]);

        return Inertia::render('Dashboard/Admin', $data);
    }

    /**
     * Manager dashboard with team statistics.
     *
     * @param array $data
     * @return \Inertia\Response
     */
    private function managerDashboard($data)
    {
        // Client statistics
        $clientStats = [
            'total' => Client::count(),
            'active' => Client::where('status', 'active')->count(),
            'potential' => Client::where('status', 'potential')->count(),
        ];

        // Lead statistics
        $leadStats = [
            'total' => Lead::count(),
            'new' => Lead::where('status', 'new')->count(),
            'contacted' => Lead::where('status', 'contacted')->count(),
            'qualified' => Lead::where('status', 'qualified')->count(),
            'negotiation' => Lead::where('status', 'negotiation')->count(),
        ];

        // Recent communications
        $recentCommunications = Communication::with(['client', 'lead', 'createdBy'])
            ->latest('date')
            ->take(10)
            ->get();

        $data = array_merge($data, [
            'clientStats' => $clientStats,
            'leadStats' => $leadStats,
            'recentCommunications' => $recentCommunications,
        ]);

        return Inertia::render('Dashboard/Manager', $data);
    }

    /**
     * User dashboard with assigned clients and leads.
     *
     * @param array $data
     * @return \Inertia\Response
     */
    private function userDashboard($data)
    {
        $userId = $data['user_id'] ?? 0;

        // Assigned clients
        $assignedClients = Client::where('created_by_id', $userId)
            ->orWhere('updated_by_id', $userId)
            ->get();

        // Assigned leads
        $assignedLeads = Lead::where('created_by_id', $userId)
            ->orWhere('updated_by_id', $userId)
            ->get();

        // Recent communications
        $recentCommunications = Communication::where('created_by_id', $userId)
            ->with(['client', 'lead'])
            ->latest('date')
            ->take(10)
            ->get();

        $data = array_merge($data, [
            'assignedClients' => $assignedClients,
            'assignedLeads' => $assignedLeads,
            'recentCommunications' => $recentCommunications,
        ]);

        return Inertia::render('Dashboard/User', $data);
    }

    /**
     * Get the count of unread messages.
     *
     * @return int
     */
    private function getUnreadMessagesCount()
    {
        $clientMessages = ChatMessage::where('is_read', false)
            ->where('is_from_user', false)
            ->whereNotNull('client_id')
            ->count();

        $leadMessages = ChatMessage::where('is_read', false)
            ->where('is_from_user', false)
            ->whereNotNull('lead_id')
            ->count();

        return $clientMessages + $leadMessages;
    }
}
