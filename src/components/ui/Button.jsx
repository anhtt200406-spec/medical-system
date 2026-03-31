import React from 'react';
import { cn } from '../../utils/helpers';

const Button = React.forwardRef(({
    className,
    variant = 'primary',
    size = 'md',
    children,
    disabled,
    ...props
}, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'glow-btn',
        secondary: 'text-white/70 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/05',
        success: 'text-white font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]',
        danger: 'text-white font-semibold rounded-xl transition-all hover:scale-[1.02]',
        outline: 'border border-sky-500/40 text-sky-400 hover:bg-sky-500/10 hover:border-sky-400/60',
        ghost: 'text-white/55 hover:text-white hover:bg-white/06',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    const inlineStyles = {
        success: { background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 4px 16px rgba(16,185,129,0.35)' },
        danger:  { background: 'linear-gradient(135deg,#f43f5e,#be123c)', boxShadow: '0 4px 16px rgba(244,63,94,0.35)' },
    };

    return (
        <button
            ref={ref}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            style={inlineStyles[variant] || {}}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = 'Button';
export default Button;
