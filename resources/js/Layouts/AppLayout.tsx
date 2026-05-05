import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Building2,
    ChevronLeft,
    FileText,
    Handshake,
    LayoutDashboard,
    LogOut,
    Menu,
    Package,
    Recycle,
    ScrollText,
    Settings,
    ShieldCheck,
    Truck,
    Users,
    X,
} from 'lucide-react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { PageProps } from '@/types';

interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
    roles?: string[];
}

const navItems: NavItem[] = [
    { label: 'Dashboard',     href: '/dashboard',       icon: LayoutDashboard },
    { label: 'My Reports',    href: '/reports',          icon: FileText,        roles: ['producer', 'super-admin'] },
    { label: 'New Report',    href: '/reports/create',   icon: ScrollText,      roles: ['producer', 'super-admin'] },
    { label: 'Marketplace',   href: '/marketplace',      icon: Handshake,       roles: ['producer', 'recycler', 'super-admin'] },
    { label: 'My Listing',    href: '/my-listing',       icon: Package,         roles: ['recycler', 'super-admin'] },
    { label: 'Collaborations', href: '/collaborations',  icon: Truck,           roles: ['producer', 'recycler', 'super-admin'] },
    { label: 'Waste Batches', href: '/waste-batches',    icon: Recycle,         roles: ['recycler', 'producer', 'super-admin'] },
    { label: 'Certificates',  href: '/certificates',     icon: ShieldCheck,     roles: ['producer', 'recycler', 'super-admin'] },
    { label: 'All Reports',   href: '/admin/reports',    icon: BarChart3,       roles: ['institution', 'shpzp', 'super-admin'] },
    { label: 'Companies',     href: '/admin/companies',  icon: Building2,       roles: ['institution', 'shpzp', 'super-admin'] },
    { label: 'Users',         href: '/admin/users',      icon: Users,           roles: ['super-admin'] },
    { label: 'Settings',      href: '/profile',          icon: Settings },
];

function isActive(href: string, pathname: string): boolean {
    if (href === '/dashboard') {
        return pathname === '/dashboard' || pathname.startsWith('/dashboard/');
    }
    return pathname === href || pathname.startsWith(href + '/');
}

export default function AppLayout({ children }: PropsWithChildren) {
    const { auth, url } = usePage<PageProps>().props as any;
    const pathname = (usePage().url as string).split('?')[0];
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const user = auth.user;
    const role = user.role ?? '';

    const visibleItems = navItems.filter(
        (item) => !item.roles || item.roles.includes(role),
    );

    // Close mobile menu on navigation
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    const sidebarContent = (
        <>
            {/* Logo */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-4">
                {!collapsed && (
                    <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-700">
                            <Recycle className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-sm font-bold text-green-800">EcoTrack</span>
                    </Link>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:flex"
                >
                    <ChevronLeft
                        className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')}
                    />
                </button>
                <button
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 lg:hidden"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Role badge */}
            {!collapsed && (
                <div className="shrink-0 border-b border-gray-100 px-4 py-3">
                    <p className="truncate text-xs font-medium text-gray-500">
                        {user.company_name || user.name}
                    </p>
                    <span className="mt-1 inline-block rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-green-700">
                        {role}
                    </span>
                </div>
            )}

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-0.5 px-2">
                    {visibleItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href, pathname);
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                        active
                                            ? 'bg-green-50 text-green-800'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                        collapsed && 'justify-center px-2',
                                    )}
                                    title={collapsed ? item.label : undefined}
                                >
                                    <Icon className={cn('h-4 w-4 shrink-0', active && 'text-green-700')} />
                                    {!collapsed && <span className="truncate">{item.label}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User footer */}
            <div className="shrink-0 border-t border-gray-200 p-3">
                {!collapsed ? (
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-800">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-800">{user.name}</p>
                            <p className="truncate text-xs text-gray-500">{user.email}</p>
                        </div>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                        >
                            <LogOut className="h-4 w-4" />
                        </Link>
                    </div>
                ) : (
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex w-full items-center justify-center rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                    >
                        <LogOut className="h-4 w-4" />
                    </Link>
                )}
            </div>
        </>
    );

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Desktop sidebar — sticky, never scrolls */}
            <aside
                className={cn(
                    'hidden h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 lg:flex',
                    collapsed ? 'w-16' : 'w-64',
                )}
            >
                {sidebarContent}
            </aside>

            {/* Mobile sidebar — slide-in drawer */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 lg:hidden',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                {sidebarContent}
            </aside>

            {/* Main content */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                {/* Top bar */}
                <header className="flex h-16 shrink-0 items-center border-b border-gray-200 bg-white px-4 lg:px-6">
                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="mr-3 rounded-md p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <div className="flex-1" />

                    <div className="flex items-center gap-4">
                        {user.nipt && (
                            <span className="hidden text-xs text-gray-500 sm:block">
                                NIPT: <strong>{user.nipt}</strong>
                            </span>
                        )}
                        <span className="text-sm text-gray-700">{user.name}</span>
                    </div>
                </header>

                {/* Flash messages */}
                <FlashMessages />

                {/* Page content — scrollable */}
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}

function FlashMessages() {
    const { flash } = usePage<PageProps>().props;

    if (!flash?.success && !flash?.error) return null;

    return (
        <div className="shrink-0 px-6 pt-4">
            {flash.success && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                    {flash.success}
                </div>
            )}
            {flash.error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {flash.error}
                </div>
            )}
        </div>
    );
}
