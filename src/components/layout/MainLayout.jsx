import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity, Home, Calendar, FileText, User, LogOut, Stethoscope, DollarSign } from 'lucide-react';

export default function MainLayout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

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
    ];

    const menu = isPatient ? patientMenu : isStaff ? staffMenu : [];

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 glass-dark flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-white/10">
                    <Link to={isPatient ? '/patient/dashboard' : '/staff/dashboard'}>
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
                                key={item.path}
                                to={item.path}
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
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-8 py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
