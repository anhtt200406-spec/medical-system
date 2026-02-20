import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Calendar, Heart, Shield } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        const result = login(email, password);
        if (result.success) {
            if (result.user.role === 'patient') {
                navigate('/patient/dashboard');
            } else if (result.user.role === 'staff') {
                navigate('/staff/dashboard');
            }
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="glass sticky top-0 z-10">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-medical-teal rounded-lg flex items-center justify-center">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-display font-bold text-slate-900">Hệ thống Y tế</h1>
                            <p className="text-xs text-slate-600">NEU MEDICAL</p>
                        </div>
                    </div>
                    <Button variant="outline" onClick={() => setEmail('patient@neu.edu.vn')}>
                        Demo
                    </Button>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 container mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Marketing Content */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-5xl font-display font-bold text-slate-900 leading-tight">
                                Chăm sóc sức khỏe
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-medical-teal">
                                    Thông minh & Toàn diện
                                </span>
                            </h2>
                            <p className="text-lg text-slate-600">
                                Hệ thống quản lý y tế hiện đại dành cho sinh viên và cán bộ NEU
                            </p>
                        </div>

                        {/* Features */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-4 glass rounded-xl">
                                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Calendar className="w-5 h-5 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Đăng ký khám</h3>
                                    <p className="text-sm text-slate-600">Đặt lịch nhanh chóng</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 glass rounded-xl">
                                <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Heart className="w-5 h-5 text-success-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Theo dõi sức khỏe</h3>
                                    <p className="text-sm text-slate-600">Lịch sử khám bệnh</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 glass rounded-xl">
                                <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Activity className="w-5 h-5 text-warning-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Cảnh báo dị ứng</h3>
                                    <p className="text-sm text-slate-600">An toàn kê đơn</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 glass rounded-xl">
                                <div className="w-10 h-10 bg-medical-teal/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-5 h-5 text-medical-teal" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Bảo hiểm y tế</h3>
                                    <p className="text-sm text-slate-600">Tích hợp BHYT</p>
                                </div>
                            </div>
                        </div>

                        {/* Demo credentials */}
                        <div className="glass-dark p-4 rounded-xl space-y-2">
                            <p className="text-white font-semibold text-sm">Demo Accounts:</p>
                            <div className="grid grid-cols-2 gap-2 text-xs text-white/80">
                                <div>
                                    <span className="block font-medium text-white">Bệnh nhân:</span>
                                    <code>patient@neu.edu.vn</code>
                                </div>
                                <div>
                                    <span className="block font-medium text-white">Nhân viên:</span>
                                    <code>doctor@neu.edu.vn</code>
                                </div>
                            </div>
                            <p className="text-xs text-white/60">Password: 123456</p>
                        </div>
                    </div>

                    {/* Right: Login Form */}
                    <div className="glass p-8 rounded-2xl shadow-strong">
                        <h3 className="text-2xl font-display font-semibold text-slate-900 mb-6">
                            Đăng nhập
                        </h3>

                        {error && (
                            <Alert type="danger" className="mb-4">
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            <Input
                                label="Email"
                                type="email"
                                placeholder="example@neu.edu.vn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <Input
                                label="Mật khẩu"
                                type="password"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <Button type="submit" className="w-full" size="lg">
                                Đăng nhập
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-slate-600">
                            Chưa có tài khoản?{' '}
                            <button className="text-primary-600 hover:text-primary-700 font-medium">
                                Liên hệ phòng Y tế
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
