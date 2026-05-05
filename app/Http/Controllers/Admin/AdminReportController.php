<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminReportController extends Controller
{
    public function index(Request $request): Response
    {
        $reports = Report::with('user:id,name,company_name,nipt')
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->when($request->search, fn ($q, $s) => $q->whereHas(
                'user',
                fn ($u) => $u->where('company_name', 'like', "%{$s}%")
                             ->orWhere('nipt', 'like', "%{$s}%")
            ))
            ->latest()
            ->paginate(20)
            ->through(fn ($r) => [
                'id'               => $r->id,
                'period_label'     => $r->period_label,
                'material_category' => $r->material_category,
                'quantity_kg'      => $r->quantity_kg,
                'status'           => $r->status,
                'submitted_at'     => $r->submitted_at?->toDateString(),
                'created_at'       => $r->created_at->toDateString(),
                'user'             => [
                    'id'           => $r->user->id,
                    'name'         => $r->user->name,
                    'company_name' => $r->user->company_name,
                    'nipt'         => $r->user->nipt,
                ],
            ]);

        $stats = [
            'total'     => Report::count(),
            'draft'     => Report::where('status', 'draft')->count(),
            'submitted' => Report::where('status', 'submitted')->count(),
            'verified'  => Report::where('status', 'verified')->count(),
        ];

        return Inertia::render('Admin/Reports', [
            'reports' => $reports,
            'stats'   => $stats,
            'filters' => $request->only(['status', 'search']),
        ]);
    }
}
