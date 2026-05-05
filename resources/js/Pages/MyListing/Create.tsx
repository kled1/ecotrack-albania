import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import AppLayout from '@/Layouts/AppLayout';
import { Material, PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props extends PageProps {
    materials: Material[];
}

export default function MyListingCreate({ materials }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        capacity_kg: '',
        material_types: [] as string[],
        location: '',
        license_number: '',
        license_expires_at: '',
        description: '',
    });

    const toggleMaterial = (value: string) => {
        setData('material_types',
            data.material_types.includes(value)
                ? data.material_types.filter((m) => m !== value)
                : [...data.material_types, value]
        );
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/my-listing');
    };

    return (
        <AppLayout>
            <Head title="Create Listing" />

            <div className="mx-auto max-w-2xl space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Create Marketplace Listing</h1>
                    <p className="text-sm text-gray-500">
                        Publish your recycling services so producers can find and contact you.
                    </p>
                </div>

                <Card>
                    <CardHeader><CardTitle>Listing Details</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-5">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Capacity (kg) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        step="0.01"
                                        value={data.capacity_kg}
                                        onChange={(e) => setData('capacity_kg', e.target.value)}
                                        placeholder="e.g. 50000"
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                        required
                                    />
                                    {errors.capacity_kg && <p className="mt-1 text-xs text-red-600">{errors.capacity_kg}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Location <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="e.g. Tiranë, Albania"
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                        required
                                    />
                                    {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        License Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.license_number}
                                        onChange={(e) => setData('license_number', e.target.value)}
                                        placeholder="e.g. LIC-2024-001"
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                        required
                                    />
                                    {errors.license_number && <p className="mt-1 text-xs text-red-600">{errors.license_number}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">License Expires</label>
                                    <input
                                        type="date"
                                        value={data.license_expires_at}
                                        onChange={(e) => setData('license_expires_at', e.target.value)}
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    />
                                    {errors.license_expires_at && <p className="mt-1 text-xs text-red-600">{errors.license_expires_at}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Material Types <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {materials.map((m) => (
                                        <button
                                            key={m.value}
                                            type="button"
                                            onClick={() => toggleMaterial(m.value)}
                                            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
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
                                <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    placeholder="Describe your recycling services, certifications, special capabilities…"
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating…' : 'Create Listing'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => history.back()}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
