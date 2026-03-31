import React from 'react';
import { cn } from '../../utils/helpers';

export default function Card({ className, children, hover = false, ...props }) {
    return (
        <div
            className={cn('dark-card overflow-hidden', hover && 'dark-card-hover cursor-pointer card-hover', className)}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className, children }) {
    return (
        <div className={cn('px-6 py-4', className)}
            style={{ borderBottom: '1px solid rgba(56,189,248,0.1)' }}>
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
        <div className={cn('px-6 py-4', className)}
            style={{ borderTop: '1px solid rgba(56,189,248,0.1)', background: 'rgba(255,255,255,0.02)' }}>
            {children}
        </div>
    );
}
