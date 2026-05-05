<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function index(Request $request): Response
    {
        $companies = User::whereHas('roles', fn ($q) => $q->whereIn('name', ['producer', 'recycler', 'shpzp']))
            ->with('roles:name')
            ->when($request->role, fn ($q, $r) => $q->whereHas('roles', fn ($rq) => $rq->where('name', $r)))
            ->when($request->search, fn ($q, $s) => $q->where(function ($w) use ($s) {
                $w->where('company_name', 'like', "%{$s}%")
                  ->orWhere('nipt', 'like', "%{$s}%")
                  ->orWhere('name', 'like', "%{$s}%");
            }))
            ->latest()
            ->paginate(20)
            ->through(fn ($u) => [
                'id'           => $u->id,
                'name'         => $u->name,
                'company_name' => $u->company_name,
                'nipt'         => $u->nipt,
                'email'        => $u->email,
                'city'         => $u->city,
                'sector'       => $u->sector?->value,
                'is_active'    => $u->is_active,
                'role'         => $u->roles->first()?->name,
                'created_at'   => $u->created_at->toDateString(),
            ]);

        $stats = [
            'producers' => User::whereHas('roles', fn ($q) => $q->where('name', 'producer'))->count(),
            'recyclers' => User::whereHas('roles', fn ($q) => $q->where('name', 'recycler'))->count(),
            'shpzp'     => User::whereHas('roles', fn ($q) => $q->where('name', 'shpzp'))->count(),
        ];

        return Inertia::render('Admin/Companies', [
            'companies' => $companies,
            'stats'     => $stats,
            'filters'   => $request->only(['role', 'search']),
        ]);
    }
}
