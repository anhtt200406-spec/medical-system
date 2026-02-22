import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity, Home, Calendar, FileText, User, LogOut, Stethoscope, DollarSign, BarChart2, Menu, X } from 'lucide-react';

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
            <div className="p-6 border-b border-white/10">
                <Link to={isPatient ? '/patient/dashboard' : '/staff/dashboard'} onClick={handleNavClick}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-medical-teal rounded-lg flex items-center justify-center">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-display font-bold text-white">Hệ thống Y tế</h1>
                            <p className="text-xs text-white/60">NEU MEDICAL</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-medical-teal flex items-center justify-center text-white font-bold">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-xs text-white/60">
                            {isPatient ? 'Bệnh nhân' : isStaff ? user?.specialty : 'Người dùng'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menu.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path ||
                        (item.path !== '/patient/dashboard' && item.path !== '/staff/dashboard' && location.pathname.startsWith(item.path));

                    return (
                        <Link
                            key={item.path + item.name}
                            to={item.path}
                            onClick={handleNavClick}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                ? 'bg-white/20 text-white shadow-glow'
                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-danger-600 hover:text-white transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Đăng xuất</span>
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen flex">
            {/* ── Desktop Sidebar ── */}
            <aside className="hidden md:flex w-64 glass-dark flex-col shrink-0">
                <SidebarContent />
            </aside>

            {/* ── Mobile Sidebar Overlay ── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Mobile Sidebar Drawer ── */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 z-50 glass-dark flex flex-col transition-transform duration-300 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Close button inside drawer */}
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="absolute top-4 right-4 p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
                >
                    <X className="w-5 h-5" />
                </button>
                <SidebarContent />
            </aside>

            {/* ── Main Content ── */}
            <main className="flex-1 overflow-y-auto min-w-0">
                {/* Mobile top bar */}
                <div className="md:hidden glass-dark flex items-center gap-3 px-4 py-3 sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-medical-teal rounded-md flex items-center justify-center">
                            <Activity className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-bold text-sm font-display">Hệ thống Y tế</span>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-4 md:px-8 md:py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
