import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '../../utils/helpers';

export default function Alert({ type = 'info', children, className }) {
    const config = {
        success: { cls: 'alert-success', icon: CheckCircle },
        warning: { cls: 'alert-warning', icon: AlertTriangle },
        danger:  { cls: 'alert-danger',  icon: XCircle },
        info:    { cls: 'alert-info',    icon: Info },
    };

    const { cls, icon: Icon } = config[type] || config.info;

    return (
        <div className={cn('flex items-start gap-3', cls, className)}>
            <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="flex-1 text-sm">{children}</div>
        </div>
    );
}
