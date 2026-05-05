import AppLayout from '@/Layouts/AppLayout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BarChart3, Building2, FileText, Recycle, Settings, ShieldCheck, Users } from 'lucide-react';

export default function AdminDashboard({ auth }: PageProps) {
    const quickLinks = [
        { href: '/admin/users', label: 'Manage Users', icon: Users, color: 'bg-blue-50 text-blue-700' },
        { href: '/admin/reports', label: 'All Reports', icon: FileText, color: 'bg-gray-50 text-gray-700' },
        { href: '/admin/companies', label: 'Companies', icon: Building2, color: 'bg-purple-50 text-purple-700' },
        { href: '/collaborations', label: 'Collaborations', icon: Recycle, color: 'bg-green-50 text-green-700' },
        { href: '/certificates', label: 'Certificates', icon: ShieldCheck, color: 'bg-emerald-50 text-emerald-700' },
        { href: '/profile', label: 'Settings', icon: Settings, color: 'bg-orange-50 text-orange-700' },
    ];

    return (
        <AppLayout>
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Admin Dashboard
                    </h1>
                    <p className="text-sm text-gray-500">
                        EcoTrack Albania · Super Administrator
                    </p>
                </div>

                <div className="rounded-xl border border-green-200 bg-green-50 p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-700">
                            <BarChart3 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-green-900">
                                Welcome, {auth.user.name}
                            </p>
                            <p className="text-sm text-green-700">
                                You have full access to all EcoTrack Albania modules.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {quickLinks.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                            >
                                <div
                                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>
                                <span className="font-medium text-gray-800">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
