import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps, PaginatedData, User } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Search, Users } from 'lucide-react';
import { useState } from 'react';

interface AdminUser extends User {
    role: string;
    created_at: string;
}

interface Props extends PageProps {
    users: PaginatedData<AdminUser>;
    roles: string[];
    filters: { role?: string; search?: string };
}

export default function AdminUsers({ users, roles, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [role, setRole] = useState(filters.role ?? '');
    const [changingRoleUser, setChangingRoleUser] = useState<AdminUser | null>(null);

    const roleForm = useForm({ role: '' });

    const handleFilter = () => {
        router.get('/admin/users', { search, role }, { preserveState: true, replace: true });
    };

    const handleToggle = (user: AdminUser) => {
        if (confirm(`${user.is_active ? 'Deactivate' : 'Activate'} ${user.name}?`)) {
            router.post(`/admin/users/${user.id}/toggle`);
        }
    };

    const openRoleChange = (user: AdminUser) => {
        setChangingRoleUser(user);
        roleForm.setData('role', user.role ?? '');
    };

    const handleRoleChange = () => {
        if (!changingRoleUser) return;
        roleForm.post(`/admin/users/${changingRoleUser.id}/role`, {
            onSuccess: () => setChangingRoleUser(null),
        });
    };

    return (
        <AppLayout>
            <Head title="Users" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                    <p className="text-sm text-gray-500">Manage all platform users and their roles</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-48">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                            placeholder="Search by name, email or company…"
                            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-green-500 focus:outline-none"
                        />
                    </div>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                    >
                        <option value="">All roles</option>
                        {roles.map((r) => (
                            <option key={r} value={r} className="capitalize">{r}</option>
                        ))}
                    </select>
                    <Button variant="outline" size="sm" onClick={handleFilter}>Filter</Button>
                    {(filters.search || filters.role) && (
                        <Button variant="ghost" size="sm" onClick={() => router.get('/admin/users')}>Clear</Button>
                    )}
                </div>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle>All Users ({users.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {users.data.length === 0 ? (
                            <div className="py-16 text-center">
                                <Users className="mx-auto h-12 w-12 text-gray-300" />
                                <p className="mt-3 text-sm text-gray-500">No users found.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                                            <th className="pb-3 pr-4">#</th>
                                            <th className="pb-3 pr-4">Name</th>
                                            <th className="pb-3 pr-4">Email</th>
                                            <th className="pb-3 pr-4">Company / NIPT</th>
                                            <th className="pb-3 pr-4">Role</th>
                                            <th className="pb-3 pr-4">Status</th>
                                            <th className="pb-3 pr-4">Joined</th>
                                            <th className="pb-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {users.data.map((u) => (
                                            <tr key={u.id} className="hover:bg-gray-50">
                                                <td className="py-3 pr-4 text-gray-400">{u.id}</td>
                                                <td className="py-3 pr-4 font-medium text-gray-900">{u.name}</td>
                                                <td className="py-3 pr-4 text-gray-600">{u.email}</td>
                                                <td className="py-3 pr-4">
                                                    <p className="text-gray-700">{u.company_name ?? '—'}</p>
                                                    {u.nipt && <p className="font-mono text-xs text-gray-400">{u.nipt}</p>}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    {u.role ? (
                                                        <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold capitalize text-green-700">
                                                            {u.role}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">—</span>
                                                    )}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <Badge variant={u.is_active ? 'active' : 'cancelled'}>
                                                        {u.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 pr-4 text-gray-500">{u.created_at}</td>
                                                <td className="py-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => openRoleChange(u)}
                                                        >
                                                            Role
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant={u.is_active ? 'destructive' : 'outline'}
                                                            onClick={() => handleToggle(u)}
                                                        >
                                                            {u.is_active ? 'Deactivate' : 'Activate'}
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {users.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                                <span>Showing {users.from}–{users.to} of {users.total}</span>
                                <div className="flex gap-1">
                                    {users.links.map((link, i) => (
                                        <button
                                            key={i}
                                            onClick={() => link.url && router.get(link.url)}
                                            disabled={!link.url}
                                            className={`rounded px-3 py-1 ${link.active ? 'bg-green-700 text-white' : 'hover:bg-gray-100'} ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Change Role Modal */}
            {changingRoleUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
                        <h2 className="text-lg font-semibold text-gray-900">Change Role</h2>
                        <p className="mt-1 text-sm text-gray-500">{changingRoleUser.name}</p>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">New Role</label>
                            <select
                                value={roleForm.data.role}
                                onChange={(e) => roleForm.setData('role', e.target.value)}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                            >
                                <option value="">Select role…</option>
                                {roles.map((r) => (
                                    <option key={r} value={r} className="capitalize">{r}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-4 flex gap-3">
                            <Button
                                className="flex-1"
                                disabled={roleForm.processing || !roleForm.data.role}
                                onClick={handleRoleChange}
                            >
                                {roleForm.processing ? 'Saving…' : 'Save'}
                            </Button>
                            <Button variant="outline" onClick={() => setChangingRoleUser(null)}>Cancel</Button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
