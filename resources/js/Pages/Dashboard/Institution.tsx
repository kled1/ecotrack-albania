import StatCard from '@/Components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import AppLayout from '@/Layouts/AppLayout';
import { formatNumber } from '@/lib/utils';
import { PageProps, User } from '@/types';
import { Head } from '@inertiajs/react';
import { AlertTriangle, BarChart3, Building2, FileCheck, Recycle, ShieldCheck } from 'lucide-react';

interface Props extends PageProps {
    stats: {
        total_producers: number;
        total_recyclers: number;
        total_reports: number;
        non_reporting: number;
        verified_this_year: number;
        total_certificates: number;
        total_collaborations: number;
    };
    nonReportingCompanies: (User & { sector: string })[];
}

export default function InstitutionDashboard({ stats, nonReportingCompanies }: Props) {
    return (
        <AppLayout>
            <Head title="Institution Dashboard" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">National Overview</h1>
                    <p className="text-sm text-gray-500">
                        EPR Compliance Monitoring · Albania · {new Date().getFullYear()}
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Registered Producers"
                        value={formatNumber(stats.total_producers)}
                        icon={Building2}
                        iconClassName="bg-blue-50 text-blue-600"
                    />
                    <StatCard
                        label="Registered Recyclers"
                        value={formatNumber(stats.total_recyclers)}
                        icon={Recycle}
                        iconClassName="bg-green-50 text-green-700"
                    />
                    <StatCard
                        label="Verified Reports (Year)"
                        value={formatNumber(stats.verified_this_year)}
                        icon={FileCheck}
                        iconClassName="bg-emerald-50 text-emerald-700"
                    />
                    <StatCard
                        label="Non-Reporting"
                        value={formatNumber(stats.non_reporting)}
                        icon={AlertTriangle}
                        iconClassName="bg-red-50 text-red-600"
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <StatCard
                        label="Certificates Issued"
                        value={formatNumber(stats.total_certificates)}
                        icon={ShieldCheck}
                        iconClassName="bg-purple-50 text-purple-700"
                    />
                    <StatCard
                        label="Total Collaborations"
                        value={formatNumber(stats.total_collaborations)}
                        icon={BarChart3}
                        iconClassName="bg-orange-50 text-orange-700"
                    />
                </div>

                {nonReportingCompanies.length > 0 && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-red-700">
                                <AlertTriangle className="h-5 w-5" />
                                Non-Reporting Companies ({new Date().getFullYear()})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                                            <th className="pb-3 pr-4">Company</th>
                                            <th className="pb-3 pr-4">NIPT</th>
                                            <th className="pb-3">Sector</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {nonReportingCompanies.map((c) => (
                                            <tr key={c.id} className="hover:bg-red-50">
                                                <td className="py-3 pr-4 font-medium text-gray-900">
                                                    {c.company_name || c.name}
                                                </td>
                                                <td className="py-3 pr-4 text-gray-500">
                                                    {c.nipt ?? '—'}
                                                </td>
                                                <td className="py-3 text-gray-600 capitalize">
                                                    {c.sector ?? '—'}
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
