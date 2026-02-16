import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Button({ children, className, variant = 'primary', ...props }) {
    const variants = {
        primary: 'btn-primary',
        secondary: 'btn-primary bg-secondary text-white hover:bg-secondary/80',
        outline: 'btn-primary bg-transparent border border-glass-border text-white hover:bg-white/5',
        danger: 'btn-primary bg-red-600/20 text-red-500 border border-red-500/50 hover:bg-red-600/30',
    };

    return (
        <button
            className={twMerge(variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
}
