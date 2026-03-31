import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, User, AlertCircle, ChevronRight, Activity } from 'lucide-react';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import { formatDate } from '../../utils/helpers';

export default function PatientDashboard() {
    const { user } = useAuth();
    const { pendingQueue, completedHistory } = useApp();

    const myAppointments = pendingQueue.filter(a => a.patientId === user?.id);
    const myHistory = completedHistory.filter(a => a.patientId === user?.id);

    return (
        <div className="space-y-6">
            {/* Welcome */}
            <div className="animate-fade-in dark-card p-6 rounded-2xl"
                style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.12) 0%, rgba(20,184,166,0.08) 100%)', borderColor: 'rgba(56,189,248,0.2)' }}>
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg,#0ea5e9,#14b8a6)', boxShadow: '0 0 20px rgba(14,165,233,0.4)' }}>
                        {user?.name?.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">
                            Xin chào, <span className="shimmer-text">{user?.name}</span>
                        </h1>
                        <p style={{ color: 'rgba(226,232,240,0.5)' }} className="mt-1">Chúc bạn một ngày tốt lành! 🌟</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="animate-fade-in-1 stat-sky rounded-2xl p-5 hover:scale-[1.02] transition-transform">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sky-100/70 text-sm mb-1">Mã BHYT</p>
                            <p className="text-lg font-bold text-white">{user?.bhyt}</p>
                            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
                                {user?.bhytActive ? '✓ Đang hoạt động' : '✗ Hết hạn'}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="animate-fade-in-2 stat-teal rounded-2xl p-5 hover:scale-[1.02] transition-transform">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-teal-100/70 text-sm mb-1">Lịch hẹn</p>
                            <p className="text-3xl font-bold text-white">{myAppointments.length}</p>
                            <p className="text-xs mt-1 text-white/65">Đang chờ khám</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="animate-fade-in-3 stat-violet rounded-2xl p-5 hover:scale-[1.02] transition-transform">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-violet-100/70 text-sm mb-1">Lần khám</p>
                            <p className="text-3xl font-bold text-white">{myHistory.length}</p>
                            <p className="text-xs mt-1 text-white/65">Đã thực hiện</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="animate-fade-in-2">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white">Lịch hẹn sắp tới</h2>
                            <Link to="/patient/register">
                                <button className="text-sky-400 hover:text-sky-300 text-sm font-medium flex items-center gap-1 transition-colors">
                                    Đăng ký khám
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardBody>
                        {myAppointments.length > 0 ? (
                            <div className="space-y-3">
                                {myAppointments.map((apt) => (
                                    <div
                                        key={apt.id}
                                        className="dark-row flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 gap-3"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                                                style={{ background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(56,189,248,0.2)' }}>
                                                <Calendar className="w-5 h-5 text-sky-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-white">{apt.specialty}</h3>
                                                <p className="text-sm" style={{ color: 'rgba(226,232,240,0.5)' }}>Bác sĩ: {apt.doctorName}</p>
                                                <div className="flex items-center gap-3 mt-1.5 text-sm" style={{ color: 'rgba(226,232,240,0.4)' }}>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {formatDate(apt.date)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {apt.time}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="badge badge-warning">Chờ khám</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Calendar className="w-12 h-12 mx-auto mb-3" style={{ color: 'rgba(226,232,240,0.15)' }} />
                                <p style={{ color: 'rgba(226,232,240,0.4)' }}>Chưa có lịch hẹn nào</p>
                                <Link to="/patient/register">
                                    <button className="text-sky-400 hover:text-sky-300 text-sm font-medium mt-2 transition-colors">
                                        Đăng ký khám ngay →
                                    </button>
                                </Link>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>

            {/* Allergy Warning */}
            {user?.allergies && user.allergies.length > 0 && (
                <div className="animate-fade-in-3 rounded-2xl p-4 flex items-start gap-3"
                    style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
                    <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-amber-300 mb-0.5">Tiền sử dị ứng</h3>
                        <p className="text-sm text-amber-400/70">
                            Bạn có tiền sử dị ứng với: <strong className="text-amber-300">{user.allergies.join(', ')}</strong>
                        </p>
                        <p className="text-xs text-amber-400/50 mt-1">Vui lòng thông báo với bác sĩ trước khi kê đơn thuốc</p>
                    </div>
                </div>
            )}
        </div>
    );
}
