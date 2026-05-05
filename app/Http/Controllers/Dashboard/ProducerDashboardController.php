<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\ReportStatus;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProducerDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $stats = [
            'total_reports' => $user->reports()->count(),
            'submitted_reports' => $user->reports()->where('status', ReportStatus::Submitted)->count(),
            'verified_reports' => $user->reports()->where('status', ReportStatus::Verified)->count(),
            'draft_reports' => $user->reports()->where('status', ReportStatus::Draft)->count(),
            'total_quantity_kg' => (float) $user->reports()->where('status', ReportStatus::Verified)->sum('quantity_kg'),
            'total_credits' => $user->totalCredits(),
            'active_collaborations' => $user->collaborationsAsProducer()->where('status', 'active')->count(),
        ];

        $recentReports = $user->reports()
            ->latest()
            ->take(5)
            ->get(['id', 'period_type', 'period_year', 'period_quarter', 'material_category', 'quantity_kg', 'status', 'submitted_at']);

        return Inertia::render('Dashboard/Producer', [
            'stats' => $stats,
            'recentReports' => $recentReports,
        ]);
    }
}
