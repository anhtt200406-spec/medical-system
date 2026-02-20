import React from 'react';
import { cn } from '../../utils/helpers';

export default function Card({ className, children, hover = false, ...props }) {
    return (
        <div
            className={cn(
                'bg-white rounded-xl shadow-soft border border-slate-200 overflow-hidden',
                hover && 'card-hover cursor-pointer',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className, children }) {
    return (
        <div className={cn('px-6 py-4 border-b border-slate-200', className)}>
            {children}
        </div>
    );
}

export function CardBody({ className, children }) {
    return (
        <div className={cn('px-6 py-4', className)}>
            {children}
        </div>
    );
}

export function CardFooter({ className, children }) {
    return (
        <div className={cn('px-6 py-4 border-t border-slate-200 bg-slate-50', className)}>
            {children}
        </div>
    );
}
