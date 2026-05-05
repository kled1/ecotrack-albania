import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import AppLayout from '@/Layouts/AppLayout';
import { formatKg } from '@/lib/utils';
import { CollaborationRequest, PageProps, PaginatedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Truck } from 'lucide-react';

interface Props extends PageProps {
    collaborations: PaginatedData<CollaborationRequest>;
    role: string;
}

export default function CollaborationsIndex({ collaborations, role }: Props) {
    const isRecycler = role === 'recycler' || role === 'super-admin';
    const isProducer = role === 'producer' || role === 'super-admin';

    const confirm_action = (msg: string, url: string) => {
        if (confirm(msg)) router.post(url);
    };

    return (
        <AppLayout>
            <Head title="Collaborations" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Collaborations</h1>
                        <p className="text-sm text-gray-500">
                            {isRecycler ? 'Manage incoming collaboration requests' : 'Track your collaboration requests'}
                        </p>
                    </div>
                    {isProducer && role !== 'super-admin' && (
                        <Link href="/marketplace">
                            <Button>Browse Recyclers</Button>
                        </Link>
                    )}
                </div>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle>All Collaborations ({collaborations.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {collaborations.data.length === 0 ? (
                            <div className="py-16 text-center">
                                <Truck className="mx-auto h-12 w-12 text-gray-300" />
                                <p className="mt-3 text-sm text-gray-500">No collaborations yet.</p>
                                {isProducer && (
                                    <Link href="/marketplace" className="mt-2 inline-block text-sm text-green-700 hover:underline">
                                        Browse the marketplace to get started
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                                            <th className="pb-3 pr-4">#</th>
                                            <th className="pb-3 pr-4">{isRecycler ? 'Producer' : 'Recycler'}</th>
                                            <th className="pb-3 pr-4">Material</th>
                                            <th className="pb-3 pr-4">Quantity</th>
                                            <th className="pb-3 pr-4">Status</th>
                                            <th className="pb-3 pr-4">Date</th>
                                            <th className="pb-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {collaborations.data.map((c) => {
                                            const counterparty = isRecycler ? c.producer : c.recycler;
                                            return (
                                                <tr key={c.id} className="hover:bg-gray-50">
                                                    <td className="py-3 pr-4 text-gray-400">{c.id}</td>
                                                    <td className="py-3 pr-4 font-medium text-gray-900">
                                                        {counterparty?.company_name ?? counterparty?.name ?? '—'}
                                                    </td>
                                                    <td className="py-3 pr-4 capitalize text-gray-600">{c.material_type}</td>
                                                    <td className="py-3 pr-4 text-gray-600">{formatKg(Number(c.quantity_kg))}</td>
                                                    <td className="py-3 pr-4">
                                                        <Badge variant={c.status as any}>{c.status}</Badge>
                                                    </td>
                                                    <td className="py-3 pr-4 text-gray-500">{c.created_at}</td>
                                                    <td className="py-3">
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            <Link href={`/collaborations/${c.id}`}>
                                                                <Button variant="ghost" size="sm">View</Button>
                                                            </Link>
                                                            {isRecycler && c.status === 'pending' && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => confirm_action('Accept this request?', `/collaborations/${c.id}/accept`)}
                                                                    >
                                                                        Accept
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="destructive"
                                                                        onClick={() => confirm_action('Reject this request?', `/collaborations/${c.id}/reject`)}
                                                                    >
                                                                        Reject
                                                                    </Button>
                                                                </>
                                                            )}
                                                            {isRecycler && c.status === 'accepted' && (
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => confirm_action('Activate this collaboration?', `/collaborations/${c.id}/activate`)}
                                                                >
                                                                    Activate
                                                                </Button>
                                                            )}
                                                            {isRecycler && c.status === 'active' && (
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => confirm_action('Mark as completed?', `/collaborations/${c.id}/complete`)}
                                                                >
                                                                    Complete
                                                                </Button>
                                                            )}
                                                            {isProducer && (c.status === 'pending' || c.status === 'accepted') && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => confirm_action('Cancel this request?', `/collaborations/${c.id}/cancel`)}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {collaborations.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                                <span>Showing {collaborations.from}–{collaborations.to} of {collaborations.total}</span>
                                <div className="flex gap-1">
                                    {collaborations.links.map((link, i) => (
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
