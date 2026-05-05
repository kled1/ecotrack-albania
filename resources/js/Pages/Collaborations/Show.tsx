import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import AppLayout from '@/Layouts/AppLayout';
import { formatKg } from '@/lib/utils';
import { CollaborationRequest, PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Clock, MapPin } from 'lucide-react';

interface Props extends PageProps {
    collaboration: CollaborationRequest;
    role: string;
}

const STATUS_ORDER = ['pending', 'accepted', 'active', 'completed'];

export default function CollaborationShow({ collaboration, role }: Props) {
    const isRecycler = role === 'recycler' || role === 'super-admin';
    const isProducer = role === 'producer' || role === 'super-admin';

    const confirm_action = (msg: string, url: string) => {
        if (confirm(msg)) router.post(url);
    };

    return (
        <AppLayout>
            <Head title={`Collaboration #${collaboration.id}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Link href="/collaborations">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Collaboration #{collaboration.id}</h1>
                    </div>
                    <Badge variant={collaboration.status as any} className="ml-auto">
                        {collaboration.status}
                    </Badge>
                </div>

                {/* Status progress bar */}
                {!['rejected', 'cancelled'].includes(collaboration.status) && (
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <div className="flex items-center justify-between">
                            {STATUS_ORDER.map((s, i) => {
                                const currentIdx = STATUS_ORDER.indexOf(collaboration.status);
                                const done = i < currentIdx;
                                const active = i === currentIdx;
                                return (
                                    <div key={s} className="flex flex-1 items-center">
                                        <div className="flex flex-col items-center">
                                            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                                                done ? 'bg-green-600 text-white' : active ? 'bg-green-700 text-white ring-4 ring-green-100' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                                {done ? '✓' : i + 1}
                                            </div>
                                            <span className={`mt-1 text-xs capitalize ${active ? 'font-semibold text-green-700' : 'text-gray-400'}`}>{s}</span>
                                        </div>
                                        {i < STATUS_ORDER.length - 1 && (
                                            <div className={`h-0.5 flex-1 mx-2 ${i < currentIdx ? 'bg-green-600' : 'bg-gray-200'}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Details */}
                    <Card>
                        <CardHeader><CardTitle>Details</CardTitle></CardHeader>
                        <CardContent>
                            <dl className="space-y-3">
                                <div className="flex justify-between">
                                    <dt className="text-sm text-gray-500">Producer</dt>
                                    <dd className="text-sm font-medium text-gray-900">
                                        {collaboration.producer?.company_name ?? collaboration.producer?.name}
                                    </dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-sm text-gray-500">NIPT</dt>
                                    <dd className="text-sm text-gray-700">{(collaboration.producer as any)?.nipt ?? '—'}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-sm text-gray-500">Recycler</dt>
                                    <dd className="text-sm font-medium text-gray-900">
                                        {collaboration.recycler?.company_name ?? collaboration.recycler?.name}
                                    </dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-sm text-gray-500">Material</dt>
                                    <dd className="text-sm capitalize text-gray-900">{collaboration.material_type}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-sm text-gray-500">Quantity</dt>
                                    <dd className="text-sm font-semibold text-gray-900">{formatKg(Number(collaboration.quantity_kg))}</dd>
                                </div>
                                {collaboration.recyclerListing && (
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-500">Listing</dt>
                                        <dd className="flex items-center gap-1 text-sm text-gray-700">
                                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                                            {collaboration.recyclerListing.location}
                                        </dd>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <dt className="text-sm text-gray-500">Created</dt>
                                    <dd className="text-sm text-gray-700">{collaboration.created_at as string}</dd>
                                </div>
                                {collaboration.accepted_at && (
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-500">Accepted</dt>
                                        <dd className="text-sm text-gray-700">{collaboration.accepted_at}</dd>
                                    </div>
                                )}
                                {collaboration.completed_at && (
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-500">Completed</dt>
                                        <dd className="text-sm text-gray-700">{collaboration.completed_at}</dd>
                                    </div>
                                )}
                                {collaboration.notes && (
                                    <div className="pt-2">
                                        <dt className="text-sm text-gray-500">Notes</dt>
                                        <dd className="mt-1 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">{collaboration.notes}</dd>
                                    </div>
                                )}
                            </dl>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card>
                        <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            {isRecycler && collaboration.status === 'pending' && (
                                <>
                                    <Button
                                        className="w-full"
                                        onClick={() => confirm_action('Accept this collaboration?', `/collaborations/${collaboration.id}/accept`)}
                                    >
                                        Accept Request
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => confirm_action('Reject this request?', `/collaborations/${collaboration.id}/reject`)}
                                    >
                                        Reject Request
                                    </Button>
                                </>
                            )}
                            {isRecycler && collaboration.status === 'accepted' && (
                                <Button
                                    className="w-full"
                                    onClick={() => confirm_action('Activate this collaboration to start tracking waste batches?', `/collaborations/${collaboration.id}/activate`)}
                                >
                                    Activate Collaboration
                                </Button>
                            )}
                            {isRecycler && collaboration.status === 'active' && (
                                <>
                                    <Link href="/waste-batches" className="block">
                                        <Button variant="outline" className="w-full">Manage Waste Batches</Button>
                                    </Link>
                                    <Button
                                        className="w-full"
                                        onClick={() => confirm_action('Mark this collaboration as completed?', `/collaborations/${collaboration.id}/complete`)}
                                    >
                                        Mark Completed
                                    </Button>
                                </>
                            )}
                            {isProducer && (collaboration.status === 'pending' || collaboration.status === 'accepted') && (
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => confirm_action('Cancel this collaboration request?', `/collaborations/${collaboration.id}/cancel`)}
                                >
                                    Cancel Request
                                </Button>
                            )}
                            {['completed', 'rejected', 'cancelled'].includes(collaboration.status) && (
                                <p className="text-center text-sm text-gray-400">No actions available.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Waste Batches */}
                {collaboration.wasteBatches && collaboration.wasteBatches.length > 0 && (
                    <Card>
                        <CardHeader className="flex-row items-center justify-between pb-2">
                            <CardTitle>Waste Batches</CardTitle>
                            <Link href="/waste-batches" className="text-sm text-green-700 hover:underline">View all</Link>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                                            <th className="pb-3 pr-4">Batch Code</th>
                                            <th className="pb-3 pr-4">Material</th>
                                            <th className="pb-3 pr-4">Quantity</th>
                                            <th className="pb-3 pr-4">Status</th>
                                            <th className="pb-3">Origin Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {collaboration.wasteBatches.map((b) => (
                                            <tr key={b.id} className="hover:bg-gray-50">
                                                <td className="py-3 pr-4 font-mono text-xs text-gray-700">{b.batch_code}</td>
                                                <td className="py-3 pr-4 capitalize text-gray-600">{b.material_type}</td>
                                                <td className="py-3 pr-4 text-gray-600">{formatKg(Number(b.quantity_kg))}</td>
                                                <td className="py-3 pr-4">
                                                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 capitalize">
                                                        {b.current_status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {b.origin_date}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
