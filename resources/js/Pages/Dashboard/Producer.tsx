import StatCard from '@/Components/StatCard';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import AppLayout from '@/Layouts/AppLayout';
import { formatKg, formatNumber } from '@/lib/utils';
import { PageProps, Report } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BarChart3, FileText, Leaf, Plus, TrendingUp } from 'lucide-react';

interface Props extends PageProps {
    stats: {
        total_reports: number;
        submitted_reports: number;
        verified_reports: number;
        draft_reports: number;
        total_quantity_kg: number;
        total_credits: number;
        active_collaborations: number;
    };
    recentReports: Report[];
}

export default function ProducerDashboard({ auth, stats, recentReports }: Props) {
    return (
        <AppLayout>
            <Head title="Producer Dashboard" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Welcome, {auth.user.company_name || auth.user.name}
                        </h1>
                        <p className="text-sm text-gray-500">
                            EPR Compliance Dashboard · {new Date().getFullYear()}
                        </p>
                    </div>
                    <Link href="/reports/create">
                        <Button>
                            <Plus className="h-4 w-4" />
                            New Report
                        </Button>
                    </Link>
                </div>

                {/* Stats grid */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Total Reports"
                        value={formatNumber(stats.total_reports)}
                        icon={FileText}
                        iconClassName="bg-blue-50 text-blue-600"
                    />
                    <StatCard
                        label="Quantity Reported"
                        value={formatKg(stats.total_quantity_kg)}
                        icon={BarChart3}
                        iconClassName="bg-green-50 text-green-700"
                    />
                    <StatCard
                        label="Recycling Credits"
                        value={stats.total_credits.toFixed(2)}
                        icon={Leaf}
                        iconClassName="bg-emerald-50 text-emerald-700"
                    />
                    <StatCard
                        label="Active Collaborations"
                        value={formatNumber(stats.active_collaborations)}
                        icon={TrendingUp}
                        iconClassName="bg-purple-50 text-purple-700"
                    />
                </div>

                {/* Progress indicators */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <ReportStatusCard
                        label="Draft"
                        count={stats.draft_reports}
                        total={stats.total_reports}
                        color="bg-gray-400"
                    />
                    <ReportStatusCard
                        label="Submitted"
                        count={stats.submitted_reports}
                        total={stats.total_reports}
                        color="bg-blue-500"
                    />
                    <ReportStatusCard
                        label="Verified"
                        count={stats.verified_reports}
                        total={stats.total_reports}
                        color="bg-green-600"
                    />
                </div>

                {/* Recent reports table */}
                <Card>
                    <CardHeader className="flex-row items-center justify-between pb-2">
                        <CardTitle>Recent Reports</CardTitle>
                        <Link
                            href="/reports"
                            className="text-sm text-green-700 hover:underline"
                        >
                            View all
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {recentReports.length === 0 ? (
                            <div className="py-12 text-center">
                                <FileText className="mx-auto h-12 w-12 text-gray-300" />
                                <p className="mt-3 text-sm text-gray-500">
                                    No reports yet.{' '}
                                    <Link
                                        href="/reports/create"
                                        className="text-green-700 hover:underline"
                                    >
                                        Create your first report.
                                    </Link>
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
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
                                                    {r.period_label}
                                                </td>
                                                <td className="py-3 pr-4 text-gray-600 capitalize">
                                                    {r.material_category}
                                                </td>
                                                <td className="py-3 pr-4 text-gray-600">
                                                    {formatKg(Number(r.quantity_kg))}
                                                </td>
                                                <td className="py-3">
                                                    <Badge
                                                        variant={r.status as any}
                                                    >
                                                        {r.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

function ReportStatusCard({
    label,
    count,
    total,
    color,
}: {
    label: string;
    count: number;
    total: number;
    color: string;
}) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{label}</span>
                <span className="text-lg font-bold text-gray-900">{count}</span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                    className={`h-full rounded-full ${color} transition-all`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            <p className="mt-1 text-xs text-gray-400">{pct}% of total</p>
        </div>
    );
}
