import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, User, AlertCircle, ChevronRight } from 'lucide-react';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import { formatDate } from '../../utils/helpers';

export default function PatientDashboard() {
    const { user } = useAuth();
    const { pendingQueue, completedHistory } = useApp();

    // Lọc lịch hẹn chờ khám của bệnh nhân hiện tại
    const myAppointments = pendingQueue.filter(a => a.patientId === user?.id);
    // Lịch sử đã khám
    const myHistory = completedHistory.filter(a => a.patientId === user?.id);

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="glass p-6 rounded-2xl">
                <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
                    Xin chào, {user?.name}
                </h1>
                <p className="text-slate-600">Chúc bạn một ngày tốt lành!</p>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-primary-500 to-primary-700 text-white border-none">
                    <CardBody>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-primary-100 text-sm mb-1">BHYT</p>
                                <p className="text-2xl font-bold">{user?.bhyt}</p>
                                <p className="text-xs text-primary-100 mt-1">
                                    {user?.bhytActive ? '✓ Đang hoạt động' : '✗ Hết hạn'}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6" />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-gradient-to-br from-success-500 to-success-700 text-white border-none">
                    <CardBody>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-success-100 text-sm mb-1">Lịch hẹn</p>
                                <p className="text-2xl font-bold">{myAppointments.length}</p>
                                <p className="text-xs text-success-100 mt-1">Đang chờ khám</p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <Calendar className="w-6 h-6" />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-gradient-to-br from-warning-500 to-warning-700 text-white border-none">
                    <CardBody>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-warning-100 text-sm mb-1">Lần khám</p>
                                <p className="text-2xl font-bold">{myHistory.length}</p>
                                <p className="text-xs text-warning-100 mt-1">Đã thực hiện</p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Upcoming Appointments */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-slate-900">Lịch hẹn sắp tới</h2>
                        <Link to="/patient/register">
                            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
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
                                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                            <Calendar className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{apt.specialty}</h3>
                                            <p className="text-sm text-slate-600">Bác sĩ: {apt.doctorName}</p>
                                            <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(apt.date)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
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
                        <div className="text-center py-8 text-slate-500">
                            <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                            <p>Chưa có lịch hẹn nào</p>
                            <Link to="/patient/register">
                                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2">
                                    Đăng ký khám ngay
                                </button>
                            </Link>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Allergy Warning */}
            {user?.allergies && user.allergies.length > 0 && (
                <Card className="border-warning-200 bg-warning-50">
                    <CardBody>
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-warning-900 mb-1">Tiền sử dị ứng</h3>
                                <p className="text-sm text-warning-800">
                                    Bạn có tiền sử dị ứng với: <strong>{user.allergies.join(', ')}</strong>
                                </p>
                                <p className="text-xs text-warning-700 mt-1">
                                    Vui lòng thông báo với bác sĩ trước khi kê đơn thuốc
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            )}
        </div>
    );
}
