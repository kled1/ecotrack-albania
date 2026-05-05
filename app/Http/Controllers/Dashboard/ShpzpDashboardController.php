<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\ReportStatus;
use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShpzpDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $stats = [
            'total_producers' => User::role('producer')->count(),
            'total_reports' => Report::count(),
            'verified_reports' => Report::where('status', ReportStatus::Verified)->count(),
            'pending_verification' => Report::where('status', ReportStatus::Submitted)->count(),
            'total_quantity_reported' => (float) Report::where('status', ReportStatus::Verified)->sum('quantity_kg'),
        ];

        $recentReports = Report::with('user:id,name,company_name,nipt')
            ->where('status', '!=', ReportStatus::Draft)
            ->latest()
            ->take(10)
            ->get(['id', 'user_id', 'period_type', 'period_year', 'material_category', 'quantity_kg', 'status']);

        return Inertia::render('Dashboard/Shpzp', [
            'stats' => $stats,
            'recentReports' => $recentReports,
        ]);
    }
}
