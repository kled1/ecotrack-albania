<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $users = User::with('roles:name')
            ->when($request->role, fn ($q, $r) => $q->whereHas('roles', fn ($rq) => $rq->where('name', $r)))
            ->when($request->search, fn ($q, $s) => $q->where(function ($w) use ($s) {
                $w->where('name', 'like', "%{$s}%")
                  ->orWhere('email', 'like', "%{$s}%")
                  ->orWhere('company_name', 'like', "%{$s}%");
            }))
            ->latest()
            ->paginate(20)
            ->through(fn ($u) => [
                'id'           => $u->id,
                'name'         => $u->name,
                'email'        => $u->email,
                'company_name' => $u->company_name,
                'nipt'         => $u->nipt,
                'is_active'    => $u->is_active,
                'role'         => $u->roles->first()?->name,
                'created_at'   => $u->created_at->toDateString(),
            ]);

        return Inertia::render('Admin/Users', [
            'users'   => $users,
            'roles'   => Role::pluck('name'),
            'filters' => $request->only(['role', 'search']),
        ]);
    }

    public function toggle(User $user): RedirectResponse
    {
        abort_if($user->isSuperAdmin(), 403, 'Cannot deactivate super admin.');

        $user->update(['is_active' => !$user->is_active]);
        $status = $user->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "User {$user->name} {$status}.");
    }

    public function updateRole(Request $request, User $user): RedirectResponse
    {
        abort_if($user->isSuperAdmin(), 403, 'Cannot change super admin role.');

        $data = $request->validate([
            'role' => 'required|string|exists:roles,name',
        ]);

        $user->syncRoles([$data['role']]);

        return back()->with('success', "Role updated to {$data['role']}.");
    }
}
