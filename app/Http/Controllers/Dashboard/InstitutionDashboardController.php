<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\ReportStatus;
use App\Http\Controllers\Controller;
use App\Models\CollaborationRequest;
use App\Models\RecyclingCertificate;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InstitutionDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $stats = [
            'total_producers' => User::role('producer')->count(),
            'total_recyclers' => User::role('recycler')->count(),
            'total_reports' => Report::count(),
            'non_reporting' => User::role('producer')
                ->whereDoesntHave('reports', fn ($q) => $q->whereYear('created_at', now()->year))
                ->count(),
            'verified_this_year' => Report::where('status', ReportStatus::Verified)
                ->whereYear('verified_at', now()->year)
                ->count(),
            'total_certificates' => RecyclingCertificate::count(),
            'total_collaborations' => CollaborationRequest::count(),
        ];

        $nonReportingCompanies = User::role('producer')
            ->whereDoesntHave('reports', fn ($q) => $q->whereYear('created_at', now()->year))
            ->get(['id', 'name', 'company_name', 'nipt', 'sector']);

        return Inertia::render('Dashboard/Institution', [
            'stats' => $stats,
            'nonReportingCompanies' => $nonReportingCompanies,
        ]);
    }
}
