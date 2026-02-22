import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';
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
            {/* Welcome Section */}
            <div className="glass p-6 rounded-2xl">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-2">
                    Xin chào, {user?.name}
                </h1>
                <p className="text-slate-600">Chuyên khoa: {user?.specialty}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-warning-500 to-warning-700 text-white border-none">
                    <CardBody>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-warning-100 text-sm mb-1">Đang chờ</p>
                                <p className="text-2xl font-bold">{pendingQueue.length}</p>
                                <p className="text-xs text-warning-100 mt-1">Bệnh nhân</p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <Clock className="w-6 h-6" />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-gradient-to-br from-success-500 to-success-700 text-white border-none">
                    <CardBody>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-success-100 text-sm mb-1">Đã khám</p>
                                <p className="text-2xl font-bold">{examinedToday}</p>
                                <p className="text-xs text-success-100 mt-1">Hôm nay</p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-gradient-to-br from-primary-500 to-primary-700 text-white border-none">
                    <CardBody>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-primary-100 text-sm mb-1">Tổng bệnh nhân</p>
                                <p className="text-2xl font-bold">{pendingQueue.length + examinedToday}</p>
                                <p className="text-xs text-primary-100 mt-1">Hôm nay</p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Waiting Queue */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Hàng đợi ({pendingQueue.length})
                        </h2>
                        <span className="badge badge-warning">Chờ khám</span>
                    </div>
                </CardHeader>
                <CardBody>
                    {pendingQueue.length > 0 ? (
                        <div className="space-y-3">
                            {pendingQueue.map((apt) => (
                                <div
                                    key={apt.id}
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer gap-3"
                                    onClick={() => handleSelectPatient(apt.id)}
                                >
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-medical-teal rounded-full flex items-center justify-center text-white text-xl font-bold">
                                            {apt.patientName.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-900">{apt.patientName}</h3>
                                            <p className="text-sm text-slate-600">Mã BN: {apt.patientId}</p>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                                <span>{apt.specialty}</span>
                                                <span>•</span>
                                                <span>{formatDate(apt.date)} - {apt.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-warning-600" />
                                        <span className="text-sm font-medium text-slate-900">Tiếp nhận →</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500">
                            <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                            <p className="text-lg font-medium">Không có bệnh nhân chờ khám</p>
                            <p className="text-sm mt-2">Danh sách trống</p>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
