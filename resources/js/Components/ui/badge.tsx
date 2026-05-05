import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-gray-100 text-gray-800',
                draft: 'bg-gray-100 text-gray-700',
                submitted: 'bg-blue-100 text-blue-800',
                verified: 'bg-green-100 text-green-800',
                rejected: 'bg-red-100 text-red-800',
                pending: 'bg-yellow-100 text-yellow-800',
                active: 'bg-green-100 text-green-800',
                completed: 'bg-emerald-100 text-emerald-800',
                cancelled: 'bg-gray-100 text-gray-600',
                accepted: 'bg-blue-100 text-blue-800',
            },
        },
        defaultVariants: { variant: 'default' },
    },
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
