import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '../../utils/helpers';

export default function Alert({ type = 'info', children, className }) {
    const config = {
        success: {
            bgColor: 'bg-success-50 border-success-200',
            textColor: 'text-success-800',
            icon: CheckCircle,
            iconColor: 'text-success-600',
        },
        warning: {
            bgColor: 'bg-warning-50 border-warning-200',
            textColor: 'text-warning-800',
            icon: AlertTriangle,
            iconColor: 'text-warning-600',
        },
        danger: {
            bgColor: 'bg-danger-50 border-danger-200',
            textColor: 'text-danger-800',
            icon: XCircle,
            iconColor: 'text-danger-600',
        },
        info: {
            bgColor: 'bg-primary-50 border-primary-200',
            textColor: 'text-primary-800',
            icon: Info,
            iconColor: 'text-primary-600',
        },
    };

    const { bgColor, textColor, icon: Icon, iconColor } = config[type];

    return (
        <div className={cn('flex items-start gap-3 p-4 rounded-lg border', bgColor, className)}>
            <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', iconColor)} />
            <div className={cn('flex-1 text-sm', textColor)}>
                {children}
            </div>
        </div>
    );
}
