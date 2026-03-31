import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Users, Clock, CheckCircle, AlertCircle, Stethoscope } from 'lucide-react';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import { formatDate } from '../../utils/helpers';

export default function StaffDashboard() {
    const { user } = useAuth();
    const { pendingQueue, examinedToday } = useApp();
    const navigate = useNavigate();

    const handleSelectPatient = (appointmentId) => {
        navigate(`/staff/examination/${appointmentId}`);
    };

    return (
        <div className="space-y-6">
            {/* Welcome */}
            <div className="animate-fade-in dark-card p-6 rounded-2xl"
                style={{ background: 'linear-gradient(135deg, rgba(129,140,248,0.12) 0%, rgba(14,165,233,0.08) 100%)', borderColor: 'rgba(129,140,248,0.2)' }}>
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg,#818cf8,#6d28d9)', boxShadow: '0 0 20px rgba(129,140,248,0.4)' }}>
                        <Stethoscope className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">
                            Xin chào, <span style={{ color: '#818cf8' }}>{user?.name}</span>
                        </h1>
                        <p style={{ color: 'rgba(226,232,240,0.5)' }} className="mt-1">
                            Chuyên khoa: <span style={{ color: '#a5b4fc' }}>{user?.specialty}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="animate-fade-in-1 stat-amber rounded-2xl p-5 hover:scale-[1.02] transition-transform">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-amber-100/70 text-sm mb-1">Đang chờ</p>
                            <p className="text-3xl font-bold text-white">{pendingQueue.length}</p>
                            <p className="text-xs mt-1 text-white/65">Bệnh nhân</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="animate-fade-in-2 stat-emerald rounded-2xl p-5 hover:scale-[1.02] transition-transform">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-emerald-100/70 text-sm mb-1">Đã khám</p>
                            <p className="text-3xl font-bold text-white">{examinedToday}</p>
                            <p className="text-xs mt-1 text-white/65">Hôm nay</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="animate-fade-in-3 stat-sky rounded-2xl p-5 hover:scale-[1.02] transition-transform">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sky-100/70 text-sm mb-1">Tổng bệnh nhân</p>
                            <p className="text-3xl font-bold text-white">{pendingQueue.length + examinedToday}</p>
                            <p className="text-xs mt-1 text-white/65">Hôm nay</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Waiting Queue */}
            <div className="animate-fade-in-2">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white">
                                Hàng đợi ({pendingQueue.length})
                            </h2>
                            <span className="badge badge-warning">Chờ khám</span>
                        </div>
                    </CardHeader>
                    <CardBody>
                        {pendingQueue.length > 0 ? (
                            <div className="space-y-3">
                                {pendingQueue.map((apt, idx) => (
                                    <div
                                        key={apt.id}
                                        className="dark-row flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 gap-3"
                                        onClick={() => handleSelectPatient(apt.id)}
                                    >
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-base font-bold flex-shrink-0"
                                                style={{ background: 'linear-gradient(135deg,#0ea5e9,#14b8a6)' }}>
                                                {apt.patientName.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-white">{apt.patientName}</h3>
                                                    <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                                                        style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.2)' }}>
                                                        #{idx + 1}
                                                    </span>
                                                </div>
                                                <p className="text-sm" style={{ color: 'rgba(226,232,240,0.45)' }}>Mã BN: {apt.patientId}</p>
                                                <div className="flex items-center gap-3 mt-1 text-sm" style={{ color: 'rgba(226,232,240,0.4)' }}>
                                                    <span>{apt.specialty}</span>
                                                    <span>•</span>
                                                    <span>{formatDate(apt.date)} - {apt.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sky-400 font-medium text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            Tiếp nhận →
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Users className="w-16 h-16 mx-auto mb-4" style={{ color: 'rgba(226,232,240,0.1)' }} />
                                <p className="text-lg font-medium" style={{ color: 'rgba(226,232,240,0.4)' }}>Không có bệnh nhân chờ khám</p>
                                <p className="text-sm mt-2" style={{ color: 'rgba(226,232,240,0.25)' }}>Danh sách trống</p>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
