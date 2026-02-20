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
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                type={type}
                className={cn(
                    'w-full px-4 py-2.5 rounded-lg border transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    'disabled:bg-slate-100 disabled:cursor-not-allowed',
                    error
                        ? 'border-danger-500 focus:ring-danger-500'
                        : 'border-slate-300 hover:border-slate-400',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1.5 text-sm text-danger-600">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
