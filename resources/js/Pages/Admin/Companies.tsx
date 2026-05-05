import StatCard from '@/Components/StatCard';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps, PaginatedData, User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Building2, Factory, Recycle, Search, Users } from 'lucide-react';
import { useState } from 'react';

interface CompanyUser extends User {
    role: string;
    created_at: string;
}

interface Props extends PageProps {
    companies: PaginatedData<CompanyUser>;
    stats: { producers: number; recyclers: number; shpzp: number };
    filters: { role?: string; search?: string };
}

const ROLE_COLORS: Record<string, string> = {
    producer: 'bg-blue-50 text-blue-700',
    recycler: 'bg-green-50 text-green-700',
    shpzp: 'bg-purple-50 text-purple-700',
};

export default function AdminCompanies({ companies, stats, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [role, setRole] = useState(filters.role ?? '');

    const handleFilter = () => {
        router.get('/admin/companies', { search, role }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout>
            <Head title="Companies" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
                    <p className="text-sm text-gray-500">Registered producers, recyclers and PROs</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <StatCard label="Producers" value={stats.producers} icon={Factory} iconClassName="bg-blue-50 text-blue-600" />
                    <StatCard label="Recyclers" value={stats.recyclers} icon={Recycle} iconClassName="bg-green-50 text-green-700" />
                    <StatCard label="PROs (SHPZP)" value={stats.shpzp} icon={Users} iconClassName="bg-purple-50 text-purple-700" />
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
                            placeholder="Search by company name or NIPT…"
                            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-green-500 focus:outline-none"
                        />
                    </div>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                    >
                        <option value="">All roles</option>
                        <option value="producer">Producer</option>
                        <option value="recycler">Recycler</option>
                        <option value="shpzp">SHPZP</option>
                    </select>
                    <Button variant="outline" size="sm" onClick={handleFilter}>Filter</Button>
                    {(filters.search || filters.role) && (
                        <Button variant="ghost" size="sm" onClick={() => router.get('/admin/companies')}>Clear</Button>
                    )}
                </div>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle>Companies ({companies.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {companies.data.length === 0 ? (
                            <div className="py-16 text-center">
                                <Building2 className="mx-auto h-12 w-12 text-gray-300" />
                                <p className="mt-3 text-sm text-gray-500">No companies found.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                                            <th className="pb-3 pr-4">Company</th>
                                            <th className="pb-3 pr-4">NIPT</th>
                                            <th className="pb-3 pr-4">Role</th>
                                            <th className="pb-3 pr-4">Sector</th>
                                            <th className="pb-3 pr-4">Status</th>
                                            <th className="pb-3">Registered</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {companies.data.map((c) => (
                                            <tr key={c.id} className="hover:bg-gray-50">
                                                <td className="py-3 pr-4">
                                                    <p className="font-medium text-gray-900">{c.company_name ?? c.name}</p>
                                                    <p className="text-xs text-gray-400">{c.email}</p>
                                                </td>
                                                <td className="py-3 pr-4 font-mono text-xs text-gray-500">{c.nipt ?? '—'}</td>
                                                <td className="py-3 pr-4">
                                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${ROLE_COLORS[c.role] ?? 'bg-gray-50 text-gray-600'}`}>
                                                        {c.role}
                                                    </span>
                                                </td>
                                                <td className="py-3 pr-4 capitalize text-gray-600">{c.sector ?? '—'}</td>
                                                <td className="py-3 pr-4">
                                                    <Badge variant={c.is_active ? 'active' : 'cancelled'}>
                                                        {c.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 text-gray-500">{c.created_at}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {companies.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                                <span>Showing {companies.from}–{companies.to} of {companies.total}</span>
                                <div className="flex gap-1">
                                    {companies.links.map((link, i) => (
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
        </AppLayout>
    );
}
