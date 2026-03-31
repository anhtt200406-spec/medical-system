import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity, Home, Calendar, FileText, User, LogOut, Stethoscope, DollarSign, BarChart2, Menu, X, ChevronRight } from 'lucide-react';

export default function MainLayout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isPatient = user?.role === 'patient';
    const isStaff = user?.role === 'staff';

    const patientMenu = [
        { name: 'Tổng quan', path: '/patient/dashboard', icon: Home },
        { name: 'Đăng ký khám', path: '/patient/register', icon: Calendar },
        { name: 'Lịch sử khám', path: '/patient/history', icon: FileText },
        { name: 'Hồ sơ', path: '/patient/profile', icon: User },
    ];

    const staffMenu = [
        { name: 'Tổng quan', path: '/staff/dashboard', icon: Home },
        { name: 'Khám bệnh', path: '/staff/dashboard', icon: Stethoscope },
        { name: 'Thanh toán', path: '/staff/payment', icon: DollarSign },
        { name: 'Thống kê', path: '/staff/statistics', icon: BarChart2 },
    ];

    const menu = isPatient ? patientMenu : isStaff ? staffMenu : [];
    const handleNavClick = () => setSidebarOpen(false);

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className="p-6" style={{ borderBottom: '1px solid rgba(56,189,248,0.1)' }}>
                <Link to={isPatient ? '/patient/dashboard' : '/staff/dashboard'} onClick={handleNavClick}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center pulse-glow"
                            style={{ background: 'linear-gradient(135deg,#0ea5e9,#14b8a6)' }}>
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-base font-bold text-white leading-none">NEU Medical</p>
                            <p className="text-xs mt-0.5" style={{ color: 'rgba(56,189,248,0.7)' }}>Hệ thống Y tế</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* User Info */}
            <div className="p-4 mx-3 my-3 rounded-xl"
                style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.1)' }}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg,#0ea5e9,#14b8a6)' }}>
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-xs" style={{ color: 'rgba(226,232,240,0.45)' }}>
                            {isPatient ? 'Bệnh nhân' : isStaff ? user?.specialty : 'Người dùng'}
                        </p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"
                        style={{ boxShadow: '0 0 6px #34d399' }} />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                {menu.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path ||
                        (item.path !== '/patient/dashboard' && item.path !== '/staff/dashboard' && location.pathname.startsWith(item.path));

                    return (
                        <Link
                            key={item.path + item.name}
                            to={item.path}
                            onClick={handleNavClick}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                                ? 'text-white'
                                : 'text-white/50 hover:text-white'
                                }`}
                            style={isActive ? {
                                background: 'linear-gradient(135deg, rgba(14,165,233,0.2), rgba(20,184,166,0.15))',
                                border: '1px solid rgba(56,189,248,0.25)',
                                boxShadow: '0 0 16px rgba(56,189,248,0.1)',
                            } : {
                                border: '1px solid transparent',
                            }}
                        >
                            <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-sky-400' : 'text-white/40 group-hover:text-sky-400'}`} />
                            <span className="font-medium text-sm">{item.name}</span>
                            {isActive && <ChevronRight className="w-3.5 h-3.5 text-sky-400/60 ml-auto" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-3" style={{ borderTop: '1px solid rgba(56,189,248,0.08)' }}>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group text-white/45 hover:text-white"
                    style={{ border: '1px solid transparent' }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(244,63,94,0.12)';
                        e.currentTarget.style.borderColor = 'rgba(244,63,94,0.25)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                    }}
                >
                    <LogOut className="w-4 h-4 group-hover:text-rose-400 transition-colors" />
                    <span className="font-medium text-sm">Đăng xuất</span>
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen flex" style={{ background: 'var(--bg-base)' }}>
            {/* Subtle background blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div style={{
                    position: 'absolute', width: '500px', height: '500px',
                    background: 'radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)',
                    top: '-100px', left: '50px', borderRadius: '50%'
                }} />
                <div style={{
                    position: 'absolute', width: '400px', height: '400px',
                    background: 'radial-gradient(circle, rgba(20,184,166,0.05) 0%, transparent 70%)',
                    bottom: '0', right: '10%', borderRadius: '50%'
                }} />
            </div>

            {/* ── Desktop Sidebar ── */}
            <aside className="hidden md:flex w-64 flex-col shrink-0 relative z-10"
                style={{
                    background: 'rgba(5,10,20,0.92)',
                    borderRight: '1px solid rgba(56,189,248,0.1)',
                    backdropFilter: 'blur(24px)',
                }}>
                <SidebarContent />
            </aside>

            {/* ── Mobile Sidebar Overlay ── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 md:hidden"
                    style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Mobile Sidebar Drawer ── */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 z-50 flex flex-col transition-transform duration-300 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                style={{
                    background: 'rgba(5,10,20,0.97)',
                    borderRight: '1px solid rgba(56,189,248,0.15)',
                    backdropFilter: 'blur(24px)',
                }}
            >
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(226,232,240,0.5)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(226,232,240,0.5)'; }}
                >
                    <X className="w-4 h-4" />
                </button>
                <SidebarContent />
            </aside>

            {/* ── Main Content ── */}
            <main className="flex-1 overflow-y-auto min-w-0 relative z-10">
                {/* Mobile top bar */}
                <div className="md:hidden flex items-center gap-3 px-4 py-3 sticky top-0 z-30"
                    style={{
                        background: 'rgba(5,10,20,0.92)',
                        borderBottom: '1px solid rgba(56,189,248,0.1)',
                        backdropFilter: 'blur(20px)',
                    }}>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-xl transition-all"
                        style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(226,232,240,0.6)' }}
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg,#0ea5e9,#14b8a6)' }}>
                            <Activity className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-bold text-sm">NEU Medical</span>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-6 md:px-8 md:py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
