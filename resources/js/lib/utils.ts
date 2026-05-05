import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatKg(kg: number): string {
    if (kg >= 1_000_000) return `${(kg / 1_000_000).toFixed(2)} t`;
    if (kg >= 1_000) return `${(kg / 1_000).toFixed(2)} kg`;
    return `${kg.toFixed(3)} kg`;
}

export function formatNumber(n: number): string {
    return new Intl.NumberFormat('sq-AL').format(n);
}
