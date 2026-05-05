import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps, Report } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

const MATERIAL_CATEGORIES = [
    { value: 'packaging', label: 'Packaging' },
    { value: 'electronics', label: 'Electronics (WEEE)' },
    { value: 'automotive', label: 'Automotive Parts' },
    { value: 'batteries', label: 'Batteries' },
    { value: 'lubricants', label: 'Lubricants/Oils' },
    { value: 'other', label: 'Other' },
];

interface Props extends PageProps {
    report: Report;
}

export default function EditReport({ report }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        period_type: report.period_type,
        period_year: report.period_year,
        period_quarter: report.period_quarter ?? 1,
        material_category: report.material_category,
        quantity_kg: String(report.quantity_kg),
        quantity_units: '',
        notes: report.notes ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/reports/${report.id}`);
    };

    return (
        <AppLayout>
            <Head title={`Edit Report #${report.id}`} />

            <div className="mx-auto max-w-2xl space-y-6">
                <div className="flex items-center gap-3">
                    <Link href="/reports">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Edit Report #{report.id}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Reporting Period</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Period Type
                                    </label>
                                    <select
                                        value={data.period_type}
                                        onChange={(e) =>
                                            setData('period_type', e.target.value as any)
                                        }
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-600 focus:outline-none"
                                    >
                                        <option value="quarterly">Quarterly</option>
                                        <option value="annual">Annual</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Year
                                    </label>
                                    <select
                                        value={data.period_year}
                                        onChange={(e) =>
                                            setData('period_year', Number(e.target.value))
                                        }
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-600 focus:outline-none"
                                    >
                                        {[2024, 2025, 2026].map((y) => (
                                            <option key={y} value={y}>
                                                {y}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {data.period_type === 'quarterly' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Quarter
                                    </label>
                                    <div className="mt-1 flex gap-2">
                                        {[1, 2, 3, 4].map((q) => (
                                            <button
                                                key={q}
                                                type="button"
                                                onClick={() => setData('period_quarter', q)}
                                                className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                                                    data.period_quarter === q
                                                        ? 'border-green-600 bg-green-700 text-white'
                                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                Q{q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Waste Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Material Category
                                </label>
                                <select
                                    value={data.material_category}
                                    onChange={(e) =>
                                        setData('material_category', e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-600 focus:outline-none"
                                >
                                    {MATERIAL_CATEGORIES.map((c) => (
                                        <option key={c.value} value={c.value}>
                                            {c.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.material_category && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.material_category}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Quantity (kg)
                                </label>
                                <input
                                    type="number"
                                    step="0.001"
                                    min="0"
                                    value={data.quantity_kg}
                                    onChange={(e) => setData('quantity_kg', e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-600 focus:outline-none"
                                />
                                {errors.quantity_kg && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.quantity_kg}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Notes
                                </label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-600 focus:outline-none"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing} className="flex-1">
                            <Save className="h-4 w-4" />
                            {processing ? 'Saving…' : 'Save Changes'}
                        </Button>
                        <Link href="/reports">
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
