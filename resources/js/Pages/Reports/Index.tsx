import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import AppLayout from '@/Layouts/AppLayout';
import { formatKg } from '@/lib/utils';
import { PageProps, PaginatedData, Report } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { FileText, Plus, Trash2 } from 'lucide-react';

interface Props extends PageProps {
    reports: PaginatedData<Report>;
}

export default function ReportsIndex({ reports }: Props) {
    const handleSubmit = (id: number) => {
        if (confirm('Submit this report for verification?')) {
            router.post(`/reports/${id}/submit`);
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this draft report?')) {
            router.delete(`/reports/${id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="My Reports" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
                    <Link href="/reports/create">
                        <Button>
                            <Plus className="h-4 w-4" />
                            New Report
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle>
                            Reports ({reports.total})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {reports.data.length === 0 ? (
                            <div className="py-16 text-center">
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
                                            <th className="pb-3 pr-4">#</th>
                                            <th className="pb-3 pr-4">Period</th>
                                            <th className="pb-3 pr-4">Category</th>
                                            <th className="pb-3 pr-4">Quantity</th>
                                            <th className="pb-3 pr-4">Status</th>
                                            <th className="pb-3 pr-4">Submitted</th>
                                            <th className="pb-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {reports.data.map((r) => (
                                            <tr key={r.id} className="hover:bg-gray-50">
                                                <td className="py-3 pr-4 text-gray-400">
                                                    {r.id}
                                                </td>
                                                <td className="py-3 pr-4 font-medium text-gray-900">
                                                    {r.period_label}
                                                </td>
                                                <td className="py-3 pr-4 text-gray-600 capitalize">
                                                    {r.material_category}
                                                </td>
                                                <td className="py-3 pr-4 text-gray-600">
                                                    {formatKg(Number(r.quantity_kg))}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <Badge variant={r.status as any}>
                                                        {r.status}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 pr-4 text-gray-500">
                                                    {r.submitted_at ?? '—'}
                                                </td>
                                                <td className="py-3">
                                                    <div className="flex items-center gap-2">
                                                        {r.status === 'draft' && (
                                                            <>
                                                                <Link
                                                                    href={`/reports/${r.id}/edit`}
                                                                >
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                    >
                                                                        Edit
                                                                    </Button>
                                                                </Link>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        handleSubmit(r.id)
                                                                    }
                                                                >
                                                                    Submit
                                                                </Button>
                                                                <Button
                                                                    variant="destructive"
                                                                    size="icon"
                                                                    onClick={() =>
                                                                        handleDelete(r.id)
                                                                    }
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                </Button>
                                                            </>
                                                        )}
                                                        {r.status !== 'draft' && (
                                                            <Link href={`/reports/${r.id}`}>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                >
                                                                    View
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {reports.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                                <span>
                                    Showing {reports.from}–{reports.to} of {reports.total}
                                </span>
                                <div className="flex gap-1">
                                    {reports.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url ?? '#'}
                                            className={`rounded px-3 py-1 ${
                                                link.active
                                                    ? 'bg-green-700 text-white'
                                                    : 'hover:bg-gray-100'
                                            } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
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
