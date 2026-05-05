import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import AppLayout from '@/Layouts/AppLayout';
import { formatKg } from '@/lib/utils';
import { CollaborationRequest, PageProps, PaginatedData, WasteBatch } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Clock, Plus, Recycle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Props extends PageProps {
    batches: PaginatedData<WasteBatch>;
    activeCollaborations: CollaborationRequest[];
    statuses: { value: string; label: string }[];
    role: string;
}

export default function WasteBatchesIndex({ batches, activeCollaborations, statuses, role }: Props) {
    const isRecycler = role === 'recycler' || role === 'super-admin';
    const [showCreate, setShowCreate] = useState(false);
    const [updatingBatch, setUpdatingBatch] = useState<WasteBatch | null>(null);

    const createForm = useForm({
        collaboration_id: '',
        material_type: '',
        quantity_kg: '',
        origin_date: '',
        notes: '',
    });

    const statusForm = useForm({ status: '', notes: '' });

    const handleCreate: FormEventHandler = (e) => {
        e.preventDefault();
        createForm.post('/waste-batches', {
            onSuccess: () => { setShowCreate(false); createForm.reset(); },
        });
    };

    const handleStatusUpdate: FormEventHandler = (e) => {
        e.preventDefault();
        if (!updatingBatch) return;
        statusForm.post(`/waste-batches/${updatingBatch.id}/update-status`, {
            onSuccess: () => { setUpdatingBatch(null); statusForm.reset(); },
        });
    };

    return (
        <AppLayout>
            <Head title="Waste Batches" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Waste Batches</h1>
                        <p className="text-sm text-gray-500">Track waste from collection to recycling</p>
                    </div>
                    {isRecycler && activeCollaborations.length > 0 && (
                        <Button onClick={() => setShowCreate(true)}>
                            <Plus className="h-4 w-4" />
                            New Batch
                        </Button>
                    )}
                </div>

                {isRecycler && activeCollaborations.length === 0 && (
                    <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                        You need at least one <strong>active</strong> collaboration to create waste batches.{' '}
                        <Link href="/collaborations" className="underline">View collaborations</Link>
                    </div>
                )}

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle>All Batches ({batches.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {batches.data.length === 0 ? (
                            <div className="py-16 text-center">
                                <Recycle className="mx-auto h-12 w-12 text-gray-300" />
                                <p className="mt-3 text-sm text-gray-500">No waste batches recorded yet.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                                            <th className="pb-3 pr-4">Batch Code</th>
                                            <th className="pb-3 pr-4">
                                                {role === 'recycler' ? 'Producer' : 'Recycler'}
                                            </th>
                                            <th className="pb-3 pr-4">Material</th>
                                            <th className="pb-3 pr-4">Quantity</th>
                                            <th className="pb-3 pr-4">Status</th>
                                            <th className="pb-3 pr-4">Origin</th>
                                            {isRecycler && <th className="pb-3">Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {batches.data.map((b) => {
                                            const counterparty = role === 'recycler'
                                                ? b.collaboration?.producer
                                                : b.collaboration?.recycler;
                                            const isFinal = ['recycled', 'recovered'].includes(b.current_status);
                                            return (
                                                <tr key={b.id} className="hover:bg-gray-50">
                                                    <td className="py-3 pr-4 font-mono text-xs font-medium text-gray-800">
                                                        {b.batch_code}
                                                    </td>
                                                    <td className="py-3 pr-4 text-gray-700">
                                                        {counterparty?.company_name ?? counterparty?.name ?? '—'}
                                                    </td>
                                                    <td className="py-3 pr-4 capitalize text-gray-600">{b.material_type}</td>
                                                    <td className="py-3 pr-4 text-gray-600">{formatKg(Number(b.quantity_kg))}</td>
                                                    <td className="py-3 pr-4">
                                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                                                            isFinal ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                                                        }`}>
                                                            {b.current_status.replace('_', ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 pr-4 text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {b.origin_date}
                                                        </span>
                                                    </td>
                                                    {isRecycler && (
                                                        <td className="py-3">
                                                            {!isFinal && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        setUpdatingBatch(b);
                                                                        statusForm.setData('status', b.current_status);
                                                                        statusForm.setData('notes', '');
                                                                    }}
                                                                >
                                                                    Update Status
                                                                </Button>
                                                            )}
                                                        </td>
                                                    )}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {batches.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                                <span>Showing {batches.from}–{batches.to} of {batches.total}</span>
                                <div className="flex gap-1">
                                    {batches.links.map((link, i) => (
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

            {/* Create Modal */}
            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h2 className="text-lg font-semibold text-gray-900">New Waste Batch</h2>
                        <form onSubmit={handleCreate} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Collaboration</label>
                                <select
                                    value={createForm.data.collaboration_id}
                                    onChange={(e) => createForm.setData('collaboration_id', e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                                    required
                                >
                                    <option value="">Select collaboration…</option>
                                    {activeCollaborations.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            #{c.id} – {c.producer?.company_name ?? c.producer?.name} ({c.material_type})
                                        </option>
                                    ))}
                                </select>
                                {createForm.errors.collaboration_id && <p className="mt-1 text-xs text-red-600">{createForm.errors.collaboration_id}</p>}
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Material Type</label>
                                    <input
                                        type="text"
                                        value={createForm.data.material_type}
                                        onChange={(e) => createForm.setData('material_type', e.target.value)}
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Quantity (kg)</label>
                                    <input
                                        type="number"
                                        min="0.001"
                                        step="0.001"
                                        value={createForm.data.quantity_kg}
                                        onChange={(e) => createForm.setData('quantity_kg', e.target.value)}
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Origin Date</label>
                                <input
                                    type="date"
                                    value={createForm.data.origin_date}
                                    onChange={(e) => createForm.setData('origin_date', e.target.value)}
                                    max={new Date().toISOString().split('T')[0]}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Notes</label>
                                <textarea
                                    value={createForm.data.notes}
                                    onChange={(e) => createForm.setData('notes', e.target.value)}
                                    rows={2}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex gap-3 pt-1">
                                <Button type="submit" disabled={createForm.processing} className="flex-1">
                                    {createForm.processing ? 'Creating…' : 'Create Batch'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Update Status Modal */}
            {updatingBatch && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
                        <h2 className="text-lg font-semibold text-gray-900">Update Status</h2>
                        <p className="mt-1 text-xs text-gray-500 font-mono">{updatingBatch.batch_code}</p>
                        <form onSubmit={handleStatusUpdate} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Status</label>
                                <select
                                    value={statusForm.data.status}
                                    onChange={(e) => statusForm.setData('status', e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                                    required
                                >
                                    {statuses.map((s) => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Notes</label>
                                <textarea
                                    value={statusForm.data.notes}
                                    onChange={(e) => statusForm.setData('notes', e.target.value)}
                                    rows={2}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button type="submit" disabled={statusForm.processing} className="flex-1">
                                    {statusForm.processing ? 'Saving…' : 'Update'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setUpdatingBatch(null)}>Cancel</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
