<?php

namespace App\Http\Controllers\Marketplace;

use App\Enums\MaterialCategory;
use App\Http\Controllers\Controller;
use App\Models\RecyclerListing;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MyListingController extends Controller
{
    public function index(Request $request): Response
    {
        $listing = $request->user()->recyclerListing;

        return Inertia::render('MyListing/Index', [
            'listing' => $listing ? [
                'id'                  => $listing->id,
                'capacity_kg'         => $listing->capacity_kg,
                'material_types'      => $listing->material_types,
                'location'            => $listing->location,
                'license_number'      => $listing->license_number,
                'license_expires_at'  => $listing->license_expires_at?->toDateString(),
                'description'         => $listing->description,
                'active'              => $listing->active,
                'pending_requests'    => $listing->collaborationRequests()->where('status', 'pending')->count(),
                'active_collaborations' => $listing->collaborationRequests()->where('status', 'active')->count(),
            ] : null,
            'materials' => collect(MaterialCategory::cases())->map(fn ($c) => [
                'value' => $c->value,
                'label' => $c->label(),
            ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('MyListing/Create', [
            'materials' => collect(MaterialCategory::cases())->map(fn ($c) => [
                'value' => $c->value,
                'label' => $c->label(),
            ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        if ($request->user()->recyclerListing) {
            return redirect()->route('my-listing.index')->with('error', 'You already have a listing.');
        }

        $data = $request->validate([
            'capacity_kg'        => 'required|numeric|min:1|max:9999999',
            'material_types'     => 'required|array|min:1',
            'material_types.*'   => 'string',
            'location'           => 'required|string|max:255',
            'license_number'     => 'required|string|max:100|unique:recycler_listings,license_number',
            'license_expires_at' => 'nullable|date|after:today',
            'description'        => 'nullable|string|max:2000',
        ]);

        $request->user()->recyclerListing()->create([...$data, 'active' => true]);

        return redirect()->route('my-listing.index')->with('success', 'Listing created successfully.');
    }

    public function update(Request $request, RecyclerListing $recyclerListing): RedirectResponse
    {
        abort_if($recyclerListing->user_id !== $request->user()->id, 403);

        $data = $request->validate([
            'capacity_kg'        => 'required|numeric|min:1|max:9999999',
            'material_types'     => 'required|array|min:1',
            'material_types.*'   => 'string',
            'location'           => 'required|string|max:255',
            'license_number'     => 'required|string|max:100|unique:recycler_listings,license_number,' . $recyclerListing->id,
            'license_expires_at' => 'nullable|date',
            'description'        => 'nullable|string|max:2000',
        ]);

        $recyclerListing->update($data);

        return redirect()->route('my-listing.index')->with('success', 'Listing updated successfully.');
    }

    public function toggle(Request $request, RecyclerListing $recyclerListing): RedirectResponse
    {
        abort_if($recyclerListing->user_id !== $request->user()->id, 403);

        $recyclerListing->update(['active' => !$recyclerListing->active]);
        $status = $recyclerListing->active ? 'activated' : 'deactivated';

        return back()->with('success', "Listing {$status}.");
    }
}
