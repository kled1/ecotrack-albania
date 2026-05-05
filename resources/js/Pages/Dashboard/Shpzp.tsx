import StatCard from '@/Components/StatCard';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import AppLayout from '@/Layouts/AppLayout';
import { formatKg, formatNumber } from '@/lib/utils';
import { PageProps, Report } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BarChart3, Building2, CheckCircle, FileText } from 'lucide-react';

interface Props extends PageProps {
    stats: {
        total_producers: number;
        total_reports: number;
        verified_reports: number;
        pending_verification: number;
        total_quantity_reported: number;
    };
    recentReports: (Report & { user: { id: number; name: string; company_name: string; nipt: string } })[];
}

export default function ShpzpDashboard({ stats, recentReports }: Props) {
    return (
        <AppLayout>
            <Head title="SHPZP Dashboard" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">SHPZP Overview</h1>
                    <p className="text-sm text-gray-500">
                        Collective Producer Responsibility Organization · {new Date().getFullYear()}
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Member Producers"
                        value={formatNumber(stats.total_producers)}
                        icon={Building2}
                        iconClassName="bg-blue-50 text-blue-600"
                    />
                    <StatCard
                        label="Total Reports"
                        value={formatNumber(stats.total_reports)}
                        icon={FileText}
                        iconClassName="bg-gray-50 text-gray-600"
                    />
                    <StatCard
                        label="Verified"
                        value={formatNumber(stats.verified_reports)}
                        icon={CheckCircle}
                        iconClassName="bg-green-50 text-green-700"
                    />
                    <StatCard
                        label="Quantity Reported"
                        value={formatKg(stats.total_quantity_reported)}
                        icon={BarChart3}
                        iconClassName="bg-emerald-50 text-emerald-700"
                    />
                </div>

                {stats.pending_verification > 0 && (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                        <strong>{stats.pending_verification} reports</strong> are awaiting
                        verification.
                    </div>
                )}

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle>Recent Submissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                                        <th className="pb-3 pr-4">Company</th>
                                        <th className="pb-3 pr-4">NIPT</th>
                                        <th className="pb-3 pr-4">Period</th>
                                        <th className="pb-3 pr-4">Category</th>
                                        <th className="pb-3 pr-4">Quantity</th>
                                        <th className="pb-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentReports.map((r) => (
                                        <tr key={r.id} className="hover:bg-gray-50">
                                            <td className="py-3 pr-4 font-medium text-gray-900">
                                                {r.user?.company_name || r.user?.name}
                                            </td>
                                            <td className="py-3 pr-4 text-gray-500">
                                                {r.user?.nipt ?? '—'}
                                            </td>
                                            <td className="py-3 pr-4 text-gray-600">
                                                {r.period_label}
                                            </td>
                                            <td className="py-3 pr-4 text-gray-600 capitalize">
                                                {r.material_category}
                                            </td>
                                            <td className="py-3 pr-4 text-gray-600">
                                                {formatKg(Number(r.quantity_kg))}
                                            </td>
                                            <td className="py-3">
                                                <Badge variant={r.status as any}>{r.status}</Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
