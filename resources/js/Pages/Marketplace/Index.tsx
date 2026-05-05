import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import AppLayout from '@/Layouts/AppLayout';
import { formatKg } from '@/lib/utils';
import { Material, PageProps, PaginatedData, RecyclerListing } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Handshake, MapPin, Package, Search, ShieldCheck } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Props extends PageProps {
    listings: PaginatedData<RecyclerListing>;
    myRequestedListingIds: number[];
    materials: Material[];
    filters: { material?: string; search?: string };
}

interface RequestForm {
    material_type: string;
    quantity_kg: string;
    notes: string;
}

export default function MarketplaceIndex({ listings, myRequestedListingIds, materials, filters, auth }: Props) {
    const [requestingListing, setRequestingListing] = useState<RecyclerListing | null>(null);
    const [search, setSearch] = useState(filters.search ?? '');
    const [material, setMaterial] = useState(filters.material ?? '');

    const { data, setData, post, processing, errors, reset } = useForm<RequestForm>({
        material_type: '',
        quantity_kg: '',
        notes: '',
    });

    const isProducer = auth.user.role === 'producer' || auth.user.role === 'super-admin';

    const handleFilter: FormEventHandler = (e) => {
        e.preventDefault();
        router.get('/marketplace', { search, material }, { preserveState: true, replace: true });
    };

    const openRequest = (listing: RecyclerListing) => {
        setRequestingListing(listing);
        reset();
    };

    const submitRequest: FormEventHandler = (e) => {
        e.preventDefault();
        if (!requestingListing) return;
        post(`/marketplace/${requestingListing.id}/request`, {
            onSuccess: () => setRequestingListing(null),
        });
    };

    return (
        <AppLayout>
            <Head title="Marketplace" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Recycling Marketplace</h1>
                    <p className="text-sm text-gray-500">Browse licensed recyclers and send collaboration requests</p>
                </div>

                {/* Filters */}
                <form onSubmit={handleFilter} className="flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-48">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by company or location…"
                            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                    </div>
                    <select
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                    >
                        <option value="">All materials</option>
                        {materials.map((m) => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                    </select>
                    <Button type="submit" variant="outline" size="sm">Filter</Button>
                    {(filters.search || filters.material) && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => router.get('/marketplace')}
                        >
                            Clear
                        </Button>
                    )}
                </form>

                {/* Listings grid */}
                {listings.data.length === 0 ? (
                    <div className="py-20 text-center">
                        <Handshake className="mx-auto h-12 w-12 text-gray-300" />
                        <p className="mt-3 text-sm text-gray-500">No active recycler listings found.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {listings.data.map((listing) => {
                            const alreadyRequested = myRequestedListingIds.includes(listing.id);
                            return (
                                <Card key={listing.id} className="flex flex-col">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <CardTitle className="text-base">
                                                    {listing.user?.company_name ?? listing.user?.name}
                                                </CardTitle>
                                                <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                                    <MapPin className="h-3 w-3" />
                                                    {listing.location}
                                                </div>
                                            </div>
                                            <Badge variant="active">Active</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex flex-1 flex-col gap-4">
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Package className="h-4 w-4 shrink-0 text-gray-400" />
                                                <span>Capacity: <strong>{formatKg(Number(listing.capacity_kg))}</strong></span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <ShieldCheck className="h-4 w-4 shrink-0 text-gray-400" />
                                                <span>License: <strong>{listing.license_number}</strong></span>
                                            </div>
                                            {listing.license_expires_at && (
                                                <p className="text-xs text-gray-400">
                                                    Expires: {listing.license_expires_at}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-1.5">
                                            {listing.material_types.map((m) => (
                                                <span
                                                    key={m}
                                                    className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 capitalize"
                                                >
                                                    {m}
                                                </span>
                                            ))}
                                        </div>

                                        {listing.description && (
                                            <p className="text-xs text-gray-500 line-clamp-2">{listing.description}</p>
                                        )}

                                        {isProducer && (
                                            <div className="mt-auto pt-2">
                                                {alreadyRequested ? (
                                                    <p className="text-xs font-medium text-blue-600">
                                                        ✓ Request already sent
                                                    </p>
                                                ) : (
                                                    <Button
                                                        className="w-full"
                                                        size="sm"
                                                        onClick={() => openRequest(listing)}
                                                    >
                                                        Send Collaboration Request
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {listings.last_page > 1 && (
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Showing {listings.from}–{listings.to} of {listings.total}</span>
                        <div className="flex gap-1">
                            {listings.links.map((link, i) => (
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
            </div>

            {/* Request Modal */}
            {requestingListing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h2 className="text-lg font-semibold text-gray-900">Send Collaboration Request</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            To: <strong>{requestingListing.user?.company_name ?? requestingListing.user?.name}</strong>
                        </p>

                        <form onSubmit={submitRequest} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Material Type</label>
                                <select
                                    value={data.material_type}
                                    onChange={(e) => setData('material_type', e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                                    required
                                >
                                    <option value="">Select material…</option>
                                    {requestingListing.material_types.map((m) => (
                                        <option key={m} value={m} className="capitalize">{m}</option>
                                    ))}
                                </select>
                                {errors.material_type && <p className="mt-1 text-xs text-red-600">{errors.material_type}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Estimated Quantity (kg)</label>
                                <input
                                    type="number"
                                    min="1"
                                    step="0.01"
                                    value={data.quantity_kg}
                                    onChange={(e) => setData('quantity_kg', e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                                    required
                                />
                                {errors.quantity_kg && <p className="mt-1 text-xs text-red-600">{errors.quantity_kg}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Notes (optional)</label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={3}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button type="submit" disabled={processing} className="flex-1">
                                    {processing ? 'Sending…' : 'Send Request'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setRequestingListing(null)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
