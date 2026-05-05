<?php

namespace App\Http\Controllers\Marketplace;

use App\Enums\MaterialCategory;
use App\Http\Controllers\Controller;
use App\Models\CollaborationRequest;
use App\Models\RecyclerListing;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MarketplaceController extends Controller
{
    public function index(Request $request): Response
    {
        $listings = RecyclerListing::active()
            ->with('user:id,name,company_name,city')
            ->when($request->material, fn ($q, $m) => $q->whereJsonContains('material_types', $m))
            ->when($request->search, function ($q, $s) {
                $q->where('location', 'like', "%{$s}%")
                  ->orWhereHas('user', fn ($u) => $u->where('company_name', 'like', "%{$s}%"));
            })
            ->latest()
            ->paginate(12);

        $myRequestedListingIds = [];
        $user = $request->user();
        if ($user->isProducer() || $user->isSuperAdmin()) {
            $myRequestedListingIds = CollaborationRequest::where('producer_id', $user->id)
                ->whereIn('status', ['pending', 'accepted', 'active'])
                ->pluck('recycler_listing_id')
                ->filter()
                ->values()
                ->toArray();
        }

        return Inertia::render('Marketplace/Index', [
            'listings' => $listings,
            'myRequestedListingIds' => $myRequestedListingIds,
            'materials' => collect(MaterialCategory::cases())->map(fn ($c) => [
                'value' => $c->value,
                'label' => $c->label(),
            ]),
            'filters' => $request->only(['material', 'search']),
        ]);
    }

    public function sendRequest(Request $request, RecyclerListing $recyclerListing): RedirectResponse
    {
        abort_if(!$request->user()->isProducer() && !$request->user()->isSuperAdmin(), 403);
        abort_if(!$recyclerListing->active, 422, 'This listing is no longer active.');

        $data = $request->validate([
            'material_type' => 'required|string|max:100',
            'quantity_kg'   => 'required|numeric|min:1|max:9999999',
            'notes'         => 'nullable|string|max:1000',
        ]);

        $existing = CollaborationRequest::where('producer_id', $request->user()->id)
            ->where('recycler_listing_id', $recyclerListing->id)
            ->whereIn('status', ['pending', 'accepted', 'active'])
            ->exists();

        if ($existing) {
            return back()->with('error', 'You already have an active request with this recycler.');
        }

        CollaborationRequest::create([
            ...$data,
            'producer_id'         => $request->user()->id,
            'recycler_id'         => $recyclerListing->user_id,
            'recycler_listing_id' => $recyclerListing->id,
            'status'              => 'pending',
        ]);

        return back()->with('success', 'Collaboration request sent successfully.');
    }
}
