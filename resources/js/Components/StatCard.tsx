import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    className?: string;
    iconClassName?: string;
}

export default function StatCard({
    label,
    value,
    icon: Icon,
    trend,
    trendUp,
    className,
    iconClassName,
}: StatCardProps) {
    return (
        <div
            className={cn(
                'rounded-xl border border-gray-200 bg-white p-6 shadow-sm',
                className,
            )}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">{label}</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <p
                            className={cn(
                                'mt-1 text-xs font-medium',
                                trendUp ? 'text-green-600' : 'text-red-500',
                            )}
                        >
                            {trend}
                        </p>
                    )}
                </div>
                <div
                    className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-xl',
                        iconClassName ?? 'bg-green-50 text-green-700',
                    )}
                >
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
}
