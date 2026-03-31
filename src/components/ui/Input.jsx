import React from 'react';
import { cn } from '../../utils/helpers';

const Input = React.forwardRef(({
    className,
    label,
    error,
    type = 'text',
    ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                    style={{ color: 'rgba(226,232,240,0.45)' }}>
                    {label}
                </label>
            )}
            <input
                ref={ref}
                type={type}
                className={cn('dark-input', error && 'border-rose-500/50 focus:ring-rose-500/30', className)}
                {...props}
            />
            {error && (
                <p className="mt-1.5 text-xs" style={{ color: '#fb7185' }}>{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';
export default Input;
