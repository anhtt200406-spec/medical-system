import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/helpers';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0"
                style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(12px)' }}
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={cn('relative w-full overflow-hidden', sizes[size])}
                style={{
                    background: 'linear-gradient(135deg, rgba(10,16,30,0.98) 0%, rgba(8,47,73,0.97) 100%)',
                    border: '1px solid rgba(56,189,248,0.2)',
                    borderRadius: '20px',
                    boxShadow: '0 0 60px rgba(56,189,248,0.12), 0 25px 60px rgba(0,0,0,0.7)',
                    animation: 'modal-slide-in 0.35s cubic-bezier(.22,1,.36,1) both',
                }}
            >
                <style>{`
                    @keyframes modal-slide-in {
                        from { opacity:0; transform:scale(0.94) translateY(16px); }
                        to   { opacity:1; transform:scale(1) translateY(0); }
                    }
                `}</style>

                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between px-6 py-4"
                        style={{ borderBottom: '1px solid rgba(56,189,248,0.1)' }}>
                        <h3 className="text-lg font-bold text-white">{title}</h3>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(226,232,240,0.4)' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'white'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(226,232,240,0.4)'; }}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Body */}
                <div className="px-6 py-5 max-h-[calc(100vh-160px)] overflow-y-auto scrollbar-thin">
                    {children}
                </div>
            </div>
        </div>
    );
}
