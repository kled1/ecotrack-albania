<?php

namespace App\Http\Controllers\Reports;

use App\Enums\ReportStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReportRequest;
use App\Http\Requests\UpdateReportRequest;
use App\Models\Report;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $reports = $request->user()
            ->reports()
            ->latest()
            ->paginate(15)
            ->through(fn ($r) => [
                'id' => $r->id,
                'period_label' => $r->period_label,
                'material_category' => $r->material_category,
                'quantity_kg' => $r->quantity_kg,
                'status' => $r->status,
                'submitted_at' => $r->submitted_at?->toDateString(),
                'created_at' => $r->created_at->toDateString(),
            ]);

        return Inertia::render('Reports/Index', [
            'reports' => $reports,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Reports/Create');
    }

    public function store(StoreReportRequest $request): RedirectResponse
    {
        $report = $request->user()->reports()->create($request->validated());

        return redirect()->route('reports.index')
            ->with('success', 'Report saved as draft.');
    }

    public function show(Report $report): Response
    {
        $this->authorize('view', $report);

        return Inertia::render('Reports/Show', [
            'report' => $report->load('user:id,name,company_name,nipt'),
        ]);
    }

    public function edit(Report $report): Response
    {
        $this->authorize('update', $report);

        return Inertia::render('Reports/Edit', [
            'report' => $report,
        ]);
    }

    public function update(UpdateReportRequest $request, Report $report): RedirectResponse
    {
        $report->update($request->validated());

        return redirect()->route('reports.index')
            ->with('success', 'Report updated successfully.');
    }

    public function submit(Request $request, Report $report): RedirectResponse
    {
        $this->authorize('update', $report);

        abort_if($report->status !== ReportStatus::Draft, 422, 'Only draft reports can be submitted.');

        $report->update([
            'status' => ReportStatus::Submitted,
            'submitted_at' => now(),
        ]);

        return redirect()->route('reports.index')
            ->with('success', 'Report submitted for verification.');
    }

    public function verify(Request $request, Report $report): RedirectResponse
    {
        $this->authorize('reports.verify');

        abort_if($report->status !== ReportStatus::Submitted, 422, 'Only submitted reports can be verified.');

        $report->update([
            'status' => ReportStatus::Verified,
            'verified_at' => now(),
            'verified_by' => $request->user()->id,
        ]);

        return back()->with('success', 'Report verified successfully.');
    }

    public function destroy(Report $report): RedirectResponse
    {
        $this->authorize('delete', $report);

        abort_if($report->status !== ReportStatus::Draft, 422, 'Only draft reports can be deleted.');

        $report->delete();

        return redirect()->route('reports.index')
            ->with('success', 'Draft report deleted.');
    }
}
