import StatCard from '@/Components/StatCard';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import AppLayout from '@/Layouts/AppLayout';
import { formatKg } from '@/lib/utils';
import { PageProps, PaginatedData, Report } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { BarChart3, CheckCircle, FileText, Search } from 'lucide-react';
import { useState } from 'react';

interface Props extends PageProps {
    reports: PaginatedData<Report>;
    stats: { total: number; draft: number; submitted: number; verified: number };
    filters: { status?: string; search?: string };
}

export default function AdminReports({ reports, stats, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const handleFilter = () => {
        router.get('/admin/reports', { search, status }, { preserveState: true, replace: true });
    };

    const handleVerify = (id: number) => {
        if (confirm('Verify this report?')) router.post(`/reports/${id}/verify`);
    };

    return (
        <AppLayout>
            <Head title="All Reports" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">All Reports</h1>
                    <p className="text-sm text-gray-500">National EPR compliance reporting overview</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Total Reports" value={stats.total} icon={FileText} />
                    <StatCard label="Draft" value={stats.draft} icon={FileText} iconClassName="bg-gray-50 text-gray-500" />
                    <StatCard label="Awaiting Verification" value={stats.submitted} icon={BarChart3} iconClassName="bg-blue-50 text-blue-600" />
                    <StatCard label="Verified" value={stats.verified} icon={CheckCircle} iconClassName="bg-green-50 text-green-700" />
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
                            placeholder="Search by company or NIPT…"
                            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-green-500 focus:outline-none"
                        />
                    </div>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                    >
                        <option value="">All statuses</option>
                        <option value="draft">Draft</option>
                        <option value="submitted">Submitted</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <Button variant="outline" size="sm" onClick={handleFilter}>Filter</Button>
                    {(filters.search || filters.status) && (
                        <Button variant="ghost" size="sm" onClick={() => router.get('/admin/reports')}>Clear</Button>
                    )}
                </div>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle>Reports ({reports.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {reports.data.length === 0 ? (
                            <div className="py-16 text-center">
                                <FileText className="mx-auto h-12 w-12 text-gray-300" />
                                <p className="mt-3 text-sm text-gray-500">No reports found.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                                            <th className="pb-3 pr-4">#</th>
                                            <th className="pb-3 pr-4">Company</th>
                                            <th className="pb-3 pr-4">NIPT</th>
                                            <th className="pb-3 pr-4">Period</th>
                                            <th className="pb-3 pr-4">Category</th>
                                            <th className="pb-3 pr-4">Quantity</th>
                                            <th className="pb-3 pr-4">Status</th>
                                            <th className="pb-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {reports.data.map((r) => (
                                            <tr key={r.id} className="hover:bg-gray-50">
                                                <td className="py-3 pr-4 text-gray-400">{r.id}</td>
                                                <td className="py-3 pr-4 font-medium text-gray-900">
                                                    {r.user?.company_name ?? r.user?.name}
                                                </td>
                                                <td className="py-3 pr-4 font-mono text-xs text-gray-500">{r.user?.nipt ?? '—'}</td>
                                                <td className="py-3 pr-4 text-gray-600">{r.period_label}</td>
                                                <td className="py-3 pr-4 capitalize text-gray-600">{r.material_category}</td>
                                                <td className="py-3 pr-4 text-gray-600">{formatKg(Number(r.quantity_kg))}</td>
                                                <td className="py-3 pr-4">
                                                    <Badge variant={r.status as any}>{r.status}</Badge>
                                                </td>
                                                <td className="py-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <Link href={`/reports/${r.id}`}>
                                                            <Button variant="ghost" size="sm">View</Button>
                                                        </Link>
                                                        {r.status === 'submitted' && (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleVerify(r.id)}
                                                            >
                                                                Verify
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {reports.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                                <span>Showing {reports.from}–{reports.to} of {reports.total}</span>
                                <div className="flex gap-1">
                                    {reports.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url ?? '#'}
                                            className={`rounded px-3 py-1 ${link.active ? 'bg-green-700 text-white' : 'hover:bg-gray-100'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
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
