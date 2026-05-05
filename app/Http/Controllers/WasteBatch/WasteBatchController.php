<?php

namespace App\Http\Controllers\WasteBatch;

use App\Enums\CollaborationStatus;
use App\Enums\WasteBatchStatus;
use App\Http\Controllers\Controller;
use App\Models\CollaborationRequest;
use App\Models\WasteBatch;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WasteBatchController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        if ($user->isRecycler() || $user->isSuperAdmin()) {
            $batches = WasteBatch::whereHas('collaboration', fn ($q) => $q->where('recycler_id', $user->id))
                ->with('collaboration.producer:id,name,company_name')
                ->latest()
                ->paginate(15);

            $activeCollaborations = CollaborationRequest::where('recycler_id', $user->id)
                ->where('status', CollaborationStatus::Active->value)
                ->with('producer:id,name,company_name')
                ->get(['id', 'producer_id', 'material_type', 'quantity_kg']);
        } else {
            $batches = WasteBatch::whereHas('collaboration', fn ($q) => $q->where('producer_id', $user->id))
                ->with('collaboration.recycler:id,name,company_name')
                ->latest()
                ->paginate(15);

            $activeCollaborations = collect();
        }

        return Inertia::render('WasteBatches/Index', [
            'batches'              => $batches,
            'activeCollaborations' => $activeCollaborations,
            'statuses'             => collect(WasteBatchStatus::cases())->map(fn ($s) => [
                'value' => $s->value,
                'label' => $s->label(),
            ]),
            'role' => $user->getPrimaryRole(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'collaboration_id' => 'required|exists:collaboration_requests,id',
            'material_type'    => 'required|string|max:100',
            'quantity_kg'      => 'required|numeric|min:0.001|max:9999999',
            'origin_date'      => 'required|date|before_or_equal:today',
            'notes'            => 'nullable|string|max:1000',
        ]);

        $collaboration = CollaborationRequest::findOrFail($data['collaboration_id']);
        abort_if(
            $collaboration->recycler_id !== $request->user()->id && !$request->user()->isSuperAdmin(),
            403
        );
        abort_if(
            $collaboration->status !== CollaborationStatus::Active,
            422,
            'Collaboration must be active to add waste batches.'
        );

        $batch = WasteBatch::create([
            ...$data,
            'current_status' => WasteBatchStatus::Collected->value,
        ]);

        $batch->events()->create([
            'status'   => WasteBatchStatus::Collected->value,
            'actor_id' => $request->user()->id,
            'notes'    => 'Batch created',
        ]);

        return back()->with('success', "Waste batch {$batch->batch_code} created.");
    }

    public function updateStatus(Request $request, WasteBatch $wasteBatch): RedirectResponse
    {
        abort_if(
            $wasteBatch->collaboration->recycler_id !== $request->user()->id && !$request->user()->isSuperAdmin(),
            403
        );

        $validStatuses = implode(',', array_column(WasteBatchStatus::cases(), 'value'));
        $data = $request->validate([
            'status' => "required|string|in:{$validStatuses}",
            'notes'  => 'nullable|string|max:500',
        ]);

        $wasteBatch->update(['current_status' => $data['status']]);

        $wasteBatch->events()->create([
            'status'   => $data['status'],
            'actor_id' => $request->user()->id,
            'notes'    => $data['notes'] ?? null,
        ]);

        return back()->with('success', 'Batch status updated.');
    }
}
