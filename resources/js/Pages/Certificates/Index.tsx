import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import AppLayout from '@/Layouts/AppLayout';
import { formatKg } from '@/lib/utils';
import { PageProps, PaginatedData, RecyclingCertificate } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ShieldCheck, Star } from 'lucide-react';

interface Props extends PageProps {
    certificates: PaginatedData<RecyclingCertificate>;
    totalCredits: number | null;
    role: string;
}

export default function CertificatesIndex({ certificates, totalCredits, role }: Props) {
    const isProducer = role === 'producer';

    return (
        <AppLayout>
            <Head title="Certificates" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Recycling Certificates</h1>
                    <p className="text-sm text-gray-500">Verified proof of waste recycling</p>
                </div>

                {isProducer && totalCredits !== null && (
                    <div className="flex items-center gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                            <Star className="h-6 w-6 text-emerald-700" />
                        </div>
                        <div>
                            <p className="text-sm text-emerald-700">Total Recycling Credits</p>
                            <p className="text-2xl font-bold text-emerald-800">
                                {totalCredits.toLocaleString('sq-AL', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                )}

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle>Certificates ({certificates.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {certificates.data.length === 0 ? (
                            <div className="py-16 text-center">
                                <ShieldCheck className="mx-auto h-12 w-12 text-gray-300" />
                                <p className="mt-3 text-sm text-gray-500">No certificates issued yet.</p>
                                {role === 'producer' && (
                                    <Link href="/marketplace" className="mt-2 inline-block text-sm text-green-700 hover:underline">
                                        Collaborate with a recycler to earn certificates
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                                            <th className="pb-3 pr-4">Certificate #</th>
                                            {role !== 'producer' && <th className="pb-3 pr-4">Producer</th>}
                                            {role !== 'recycler' && <th className="pb-3 pr-4">Recycler</th>}
                                            <th className="pb-3 pr-4">Material</th>
                                            <th className="pb-3 pr-4">Quantity</th>
                                            <th className="pb-3">Issued</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {certificates.data.map((cert) => (
                                            <tr key={cert.id} className="hover:bg-gray-50">
                                                <td className="py-3 pr-4">
                                                    <span className="flex items-center gap-1.5 font-mono text-xs font-semibold text-green-700">
                                                        <ShieldCheck className="h-3.5 w-3.5" />
                                                        {cert.certificate_number}
                                                    </span>
                                                </td>
                                                {role !== 'producer' && (
                                                    <td className="py-3 pr-4 text-gray-700">
                                                        {cert.producer?.company_name ?? cert.producer?.name ?? '—'}
                                                    </td>
                                                )}
                                                {role !== 'recycler' && (
                                                    <td className="py-3 pr-4 text-gray-700">
                                                        {cert.recycler?.company_name ?? cert.recycler?.name ?? '—'}
                                                    </td>
                                                )}
                                                <td className="py-3 pr-4 capitalize text-gray-600">{cert.material_type}</td>
                                                <td className="py-3 pr-4 font-medium text-gray-900">
                                                    {formatKg(Number(cert.quantity_kg))}
                                                </td>
                                                <td className="py-3 text-gray-500">{cert.issued_at}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {certificates.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                                <span>Showing {certificates.from}–{certificates.to} of {certificates.total}</span>
                                <div className="flex gap-1">
                                    {certificates.links.map((link, i) => (
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
        </AppLayout>
    );
}
