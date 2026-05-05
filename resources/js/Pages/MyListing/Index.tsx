import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import AppLayout from '@/Layouts/AppLayout';
import { formatKg } from '@/lib/utils';
import { Material, PageProps, RecyclerListing } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Package, Plus, ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Props extends PageProps {
    listing: RecyclerListing | null;
    materials: Material[];
}

export default function MyListingIndex({ listing, materials }: Props) {
    const [editing, setEditing] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        capacity_kg: listing?.capacity_kg?.toString() ?? '',
        material_types: listing?.material_types ?? [] as string[],
        location: listing?.location ?? '',
        license_number: listing?.license_number ?? '',
        license_expires_at: listing?.license_expires_at ?? '',
        description: listing?.description ?? '',
    });

    const handleUpdate: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/my-listing/${listing!.id}`, {
            onSuccess: () => setEditing(false),
        });
    };

    const handleToggle = () => {
        if (confirm(listing?.active ? 'Deactivate your listing?' : 'Activate your listing?')) {
            router.post(`/my-listing/${listing!.id}/toggle`);
        }
    };

    const toggleMaterial = (value: string) => {
        setData('material_types',
            data.material_types.includes(value)
                ? data.material_types.filter((m) => m !== value)
                : [...data.material_types, value]
        );
    };

    if (!listing) {
        return (
            <AppLayout>
                <Head title="My Listing" />
                <div className="space-y-6">
                    <h1 className="text-2xl font-bold text-gray-900">My Listing</h1>
                    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-16 text-center">
                        <Package className="mx-auto h-12 w-12 text-gray-300" />
                        <p className="mt-3 text-sm text-gray-500">You don't have a marketplace listing yet.</p>
                        <Link href="/my-listing/create">
                            <Button className="mt-4">
                                <Plus className="h-4 w-4" />
                                Create Listing
                            </Button>
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title="My Listing" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Listing</h1>
                        <p className="text-sm text-gray-500">Manage your recycling service listing</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleToggle}
                            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                        >
                            {listing.active
                                ? <ToggleRight className="h-4 w-4 text-green-600" />
                                : <ToggleLeft className="h-4 w-4 text-gray-400" />}
                            {listing.active ? 'Active' : 'Inactive'}
                        </button>
                        <Button onClick={() => setEditing(!editing)} variant="outline">
                            {editing ? 'Cancel' : 'Edit Listing'}
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 bg-white p-5">
                        <p className="text-sm text-gray-500">Pending Requests</p>
                        <p className="mt-1 text-3xl font-bold text-yellow-600">{listing.pending_requests ?? 0}</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-5">
                        <p className="text-sm text-gray-500">Active Collaborations</p>
                        <p className="mt-1 text-3xl font-bold text-green-600">{listing.active_collaborations ?? 0}</p>
                    </div>
                </div>

                {editing ? (
                    <Card>
                        <CardHeader><CardTitle>Edit Listing</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Capacity (kg)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            step="0.01"
                                            value={data.capacity_kg}
                                            onChange={(e) => setData('capacity_kg', e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                                        />
                                        {errors.capacity_kg && <p className="mt-1 text-xs text-red-600">{errors.capacity_kg}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Location</label>
                                        <input
                                            type="text"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                                        />
                                        {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">License Number</label>
                                        <input
                                            type="text"
                                            value={data.license_number}
                                            onChange={(e) => setData('license_number', e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                                        />
                                        {errors.license_number && <p className="mt-1 text-xs text-red-600">{errors.license_number}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">License Expires</label>
                                        <input
                                            type="date"
                                            value={data.license_expires_at}
                                            onChange={(e) => setData('license_expires_at', e.target.value)}
                                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Material Types</label>
                                    <div className="flex flex-wrap gap-2">
                                        {materials.map((m) => (
                                            <button
                                                key={m.value}
                                                type="button"
                                                onClick={() => toggleMaterial(m.value)}
                                                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                                    data.material_types.includes(m.value)
                                                        ? 'bg-green-600 text-white'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                            >
                                                {m.label}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.material_types && <p className="mt-1 text-xs text-red-600">{errors.material_types}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Saving…' : 'Save Changes'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader><CardTitle>Listing Details</CardTitle></CardHeader>
                        <CardContent>
                            <dl className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Capacity</dt>
                                    <dd className="mt-1 text-sm font-semibold text-gray-900">{formatKg(Number(listing.capacity_kg))}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Location</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{listing.location}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">License Number</dt>
                                    <dd className="mt-1 flex items-center gap-1.5 text-sm text-gray-900">
                                        <ShieldCheck className="h-4 w-4 text-green-600" />
                                        {listing.license_number}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">License Expires</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{listing.license_expires_at ?? '—'}</dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Material Types</dt>
                                    <dd className="mt-2 flex flex-wrap gap-1.5">
                                        {listing.material_types.map((m) => (
                                            <span key={m} className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 capitalize">
                                                {m}
                                            </span>
                                        ))}
                                    </dd>
                                </div>
                                {listing.description && (
                                    <div className="sm:col-span-2">
                                        <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Description</dt>
                                        <dd className="mt-1 text-sm text-gray-700">{listing.description}</dd>
                                    </div>
                                )}
                                <div>
                                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Status</dt>
                                    <dd className="mt-1">
                                        <Badge variant={listing.active ? 'active' : 'cancelled'}>
                                            {listing.active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>
                )}

                <div className="text-center">
                    <Link href="/collaborations" className="text-sm text-green-700 hover:underline">
                        View all collaboration requests →
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
