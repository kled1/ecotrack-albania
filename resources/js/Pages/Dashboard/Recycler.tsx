import StatCard from '@/Components/StatCard';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import AppLayout from '@/Layouts/AppLayout';
import { formatKg, formatNumber } from '@/lib/utils';
import { CollaborationRequest, PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Package, Plus, ShieldCheck, Truck } from 'lucide-react';

interface Props extends PageProps {
    stats: {
        active_collaborations: number;
        pending_requests: number;
        completed_collaborations: number;
        total_quantity_processed: number;
        certificates_issued: number;
        listing_active: boolean;
    };
    recentRequests: CollaborationRequest[];
}

export default function RecyclerDashboard({ stats, recentRequests }: Props) {
    return (
        <AppLayout>
            <Head title="Recycler Dashboard" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Recycler Dashboard
                        </h1>
                        <p className="text-sm text-gray-500">
                            Manage your recycling services and collaborations
                        </p>
                    </div>
                    {!stats.listing_active && (
                        <Link href="/my-listing/create">
                            <Button>
                                <Plus className="h-4 w-4" />
                                Create Listing
                            </Button>
                        </Link>
                    )}
                </div>

                {!stats.listing_active && (
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                        <strong>No active listing.</strong> Create a marketplace listing so
                        producers can find and contact you.
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Active Collaborations"
                        value={formatNumber(stats.active_collaborations)}
                        icon={Truck}
                        iconClassName="bg-blue-50 text-blue-600"
                    />
                    <StatCard
                        label="Pending Requests"
                        value={formatNumber(stats.pending_requests)}
                        icon={Package}
                        iconClassName="bg-yellow-50 text-yellow-700"
                    />
                    <StatCard
                        label="Quantity Processed"
                        value={formatKg(stats.total_quantity_processed)}
                        icon={CheckCircle}
                        iconClassName="bg-green-50 text-green-700"
                    />
                    <StatCard
                        label="Certificates Issued"
                        value={formatNumber(stats.certificates_issued)}
                        icon={ShieldCheck}
                        iconClassName="bg-emerald-50 text-emerald-700"
                    />
                </div>

                <Card>
                    <CardHeader className="flex-row items-center justify-between pb-2">
                        <CardTitle>Recent Collaboration Requests</CardTitle>
                        <Link
                            href="/collaborations"
                            className="text-sm text-green-700 hover:underline"
                        >
                            View all
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {recentRequests.length === 0 ? (
                            <div className="py-12 text-center">
                                <Truck className="mx-auto h-12 w-12 text-gray-300" />
                                <p className="mt-3 text-sm text-gray-500">
                                    No collaboration requests yet.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                                            <th className="pb-3 pr-4">Producer</th>
                                            <th className="pb-3 pr-4">Material</th>
                                            <th className="pb-3 pr-4">Quantity</th>
                                            <th className="pb-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {recentRequests.map((r) => (
                                            <tr key={r.id} className="hover:bg-gray-50">
                                                <td className="py-3 pr-4 font-medium text-gray-900">
                                                    {r.producer?.company_name || r.producer?.name}
                                                </td>
                                                <td className="py-3 pr-4 text-gray-600 capitalize">
                                                    {r.material_type}
                                                </td>
                                                <td className="py-3 pr-4 text-gray-600">
                                                    {formatKg(Number(r.quantity_kg))}
                                                </td>
                                                <td className="py-3">
                                                    <Badge variant={r.status as any}>
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
