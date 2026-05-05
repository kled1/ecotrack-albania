<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RecyclerDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $stats = [
            'active_collaborations' => $user->collaborationsAsRecycler()->where('status', 'active')->count(),
            'pending_requests' => $user->collaborationsAsRecycler()->where('status', 'pending')->count(),
            'completed_collaborations' => $user->collaborationsAsRecycler()->where('status', 'completed')->count(),
            'total_quantity_processed' => (float) $user->collaborationsAsRecycler()
                ->where('status', 'completed')
                ->sum('quantity_kg'),
            'certificates_issued' => \App\Models\RecyclingCertificate::where('recycler_id', $user->id)->count(),
            'listing_active' => $user->recyclerListing?->active ?? false,
        ];

        $recentRequests = $user->collaborationsAsRecycler()
            ->with('producer:id,name,company_name')
            ->latest()
            ->take(5)
            ->get(['id', 'producer_id', 'status', 'material_type', 'quantity_kg', 'created_at']);

        return Inertia::render('Dashboard/Recycler', [
            'stats' => $stats,
            'recentRequests' => $recentRequests,
        ]);
    }
}
