<?php

namespace App\Http\Controllers\Collaboration;

use App\Enums\CollaborationStatus;
use App\Http\Controllers\Controller;
use App\Models\CollaborationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CollaborationController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        if ($user->isRecycler() || $user->isSuperAdmin()) {
            $collaborations = $user->collaborationsAsRecycler()
                ->with('producer:id,name,company_name')
                ->latest()
                ->paginate(15)
                ->through(fn ($c) => $this->format($c, 'producer'));
        } else {
            $collaborations = $user->collaborationsAsProducer()
                ->with('recycler:id,name,company_name')
                ->latest()
                ->paginate(15)
                ->through(fn ($c) => $this->format($c, 'recycler'));
        }

        return Inertia::render('Collaborations/Index', [
            'collaborations' => $collaborations,
            'role' => $user->getPrimaryRole(),
        ]);
    }

    public function show(Request $request, CollaborationRequest $collaboration): Response
    {
        $user = $request->user();
        abort_if(
            $collaboration->producer_id !== $user->id &&
            $collaboration->recycler_id !== $user->id &&
            !$user->isSuperAdmin(),
            403
        );

        $collaboration->load([
            'producer:id,name,company_name,nipt',
            'recycler:id,name,company_name',
            'recyclerListing:id,location,license_number',
            'wasteBatches' => fn ($q) => $q->with('events')->latest(),
        ]);

        return Inertia::render('Collaborations/Show', [
            'collaboration' => $collaboration,
            'role' => $user->getPrimaryRole(),
        ]);
    }

    public function accept(Request $request, CollaborationRequest $collaboration): RedirectResponse
    {
        abort_if($collaboration->recycler_id !== $request->user()->id && !$request->user()->isSuperAdmin(), 403);
        abort_if($collaboration->status !== CollaborationStatus::Pending, 422, 'Only pending requests can be accepted.');

        $collaboration->update(['status' => CollaborationStatus::Accepted, 'accepted_at' => now()]);

        return back()->with('success', 'Collaboration request accepted.');
    }

    public function reject(Request $request, CollaborationRequest $collaboration): RedirectResponse
    {
        abort_if($collaboration->recycler_id !== $request->user()->id && !$request->user()->isSuperAdmin(), 403);
        abort_if($collaboration->status !== CollaborationStatus::Pending, 422, 'Only pending requests can be rejected.');

        $collaboration->update(['status' => CollaborationStatus::Rejected]);

        return back()->with('success', 'Collaboration request rejected.');
    }

    public function activate(Request $request, CollaborationRequest $collaboration): RedirectResponse
    {
        abort_if($collaboration->recycler_id !== $request->user()->id && !$request->user()->isSuperAdmin(), 403);
        abort_if($collaboration->status !== CollaborationStatus::Accepted, 422, 'Only accepted collaborations can be activated.');

        $collaboration->update(['status' => CollaborationStatus::Active]);

        return back()->with('success', 'Collaboration activated.');
    }

    public function complete(Request $request, CollaborationRequest $collaboration): RedirectResponse
    {
        abort_if($collaboration->recycler_id !== $request->user()->id && !$request->user()->isSuperAdmin(), 403);
        abort_if($collaboration->status !== CollaborationStatus::Active, 422, 'Only active collaborations can be completed.');

        $collaboration->update(['status' => CollaborationStatus::Completed, 'completed_at' => now()]);

        return back()->with('success', 'Collaboration marked as completed.');
    }

    public function cancel(Request $request, CollaborationRequest $collaboration): RedirectResponse
    {
        $user = $request->user();
        abort_if($collaboration->producer_id !== $user->id && !$user->isSuperAdmin(), 403);
        abort_if(
            !in_array($collaboration->status, [CollaborationStatus::Pending, CollaborationStatus::Accepted]),
            422,
            'This collaboration cannot be cancelled.'
        );

        $collaboration->update(['status' => CollaborationStatus::Cancelled]);

        return back()->with('success', 'Collaboration cancelled.');
    }

    private function format(CollaborationRequest $c, string $party): array
    {
        $counterparty = $c->$party;
        return [
            'id'           => $c->id,
            'status'       => $c->status->value,
            'material_type' => $c->material_type,
            'quantity_kg'  => $c->quantity_kg,
            'notes'        => $c->notes,
            'accepted_at'  => $c->accepted_at?->toDateString(),
            'completed_at' => $c->completed_at?->toDateString(),
            'created_at'   => $c->created_at->toDateString(),
            $party         => $counterparty ? [
                'id'           => $counterparty->id,
                'name'         => $counterparty->name,
                'company_name' => $counterparty->company_name,
            ] : null,
        ];
    }
}
