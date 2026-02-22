import { useState } from 'react';
import { DollarSign, User, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import { useApp } from '../../context/AppContext';
import { formatDate, formatCurrency } from '../../utils/helpers';

export default function PaymentPage() {
    const { paymentQueue, completePayment } = useApp();
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    // Tách hàng chờ theo trạng thái
    const pendingPayments = paymentQueue.filter(apt => apt.paymentStatus === 'pending');
    const completedPayments = paymentQueue.filter(apt => apt.paymentStatus === 'completed');

    const handleSelectPayment = (appointment) => {
        setSelectedAppointment(appointment);
        setShowPaymentModal(true);
    };

    const handleConfirmPayment = () => {
        if (!selectedAppointment) return;
        completePayment(selectedAppointment.id);
        const name = selectedAppointment.patientName;
        setShowPaymentModal(false);
        setSelectedAppointment(null);
        setSuccessMsg(`✅ Thanh toán thành công cho bệnh nhân ${name}!`);
        setTimeout(() => setSuccessMsg(''), 4000);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="glass p-6 rounded-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-2">
                            Quản lý Thanh toán
                        </h1>
                        <p className="text-slate-600">Xử lý thanh toán cho bệnh nhân sau khám</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-success-700 rounded-2xl flex items-center justify-center">
                        <DollarSign className="w-8 h-8 text-white" />
                    </div>
                </div>
            </div>

            {/* Success Alert */}
            {successMsg && (
                <Alert type="success">
                    {successMsg}
                </Alert>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-warning-500 to-warning-700 text-white border-none">
                    <CardBody>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-warning-100 text-sm mb-1">Chờ thanh toán</p>
                                <p className="text-2xl font-bold">{pendingPayments.length}</p>
                                <p className="text-xs text-warning-100 mt-1">Bệnh nhân</p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-gradient-to-br from-success-500 to-success-700 text-white border-none">
                    <CardBody>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-success-100 text-sm mb-1">Đã thanh toán</p>
                                <p className="text-2xl font-bold">{completedPayments.length}</p>
                                <p className="text-xs text-success-100 mt-1">Hôm nay</p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Pending Payments */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Danh sách chờ thanh toán ({pendingPayments.length})
                        </h2>
                        <span className="badge badge-warning">Chờ xử lý</span>
                    </div>
                </CardHeader>
                <CardBody>
                    {pendingPayments.length > 0 ? (
                        <div className="space-y-3">
                            {pendingPayments.map((apt) => (
                                <div
                                    key={apt.id}
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer gap-3"
                                    onClick={() => handleSelectPayment(apt)}
                                >
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-medical-teal rounded-full flex items-center justify-center text-white text-xl font-bold">
                                            {apt.patientName.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-900">{apt.patientName}</h3>
                                            <p className="text-sm text-slate-600">Mã BHYT: {apt.bhyt || '—'}</p>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                                <span>{apt.specialty}</span>
                                                <span>•</span>
                                                <span>{formatDate(apt.date)} - {apt.time}</span>
                                            </div>
                                            {apt.diagnosis && (
                                                <p className="text-xs text-slate-500 mt-1">Chẩn đoán: {apt.diagnosis}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-600 mb-1">Số tiền</p>
                                        <p className="text-xl font-bold text-success-600">
                                            {formatCurrency(apt.patientPays)}
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSelectPayment(apt);
                                            }}
                                        >
                                            Thanh toán →
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500">
                            <CreditCard className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                            <p className="text-lg font-medium">Không có thanh toán chờ xử lý</p>
                            <p className="text-sm mt-2">Danh sách trống</p>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Completed Payments */}
            {completedPayments.length > 0 && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-slate-900">
                                Đã thanh toán hôm nay ({completedPayments.length})
                            </h2>
                            <span className="badge badge-success">Hoàn tất</span>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-3">
                            {completedPayments.map((apt) => (
                                <div
                                    key={apt.id}
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-success-50 rounded-lg border border-success-200 gap-3"
                                >
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-700 rounded-full flex items-center justify-center text-white">
                                            <CheckCircle className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-900">{apt.patientName}</h3>
                                            <p className="text-sm text-slate-600">Mã BHYT: {apt.bhyt || '—'}</p>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                                <span>{apt.specialty}</span>
                                                <span>•</span>
                                                <span>{formatDate(apt.date)} - {apt.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-600 mb-1">Đã thanh toán</p>
                                        <p className="text-xl font-bold text-success-600">
                                            {formatCurrency(apt.patientPays)}
                                        </p>
                                        <span className="inline-flex items-center gap-1 text-xs text-success-600 mt-2">
                                            <CheckCircle className="w-3 h-3" />
                                            Hoàn tất
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Payment Modal */}
            {selectedAppointment && (
                <Modal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    title="Xác nhận thanh toán"
                    size="md"
                >
                    <div className="space-y-6">
                        {/* Patient Info */}
                        <div className="p-4 bg-slate-50 rounded-lg space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-medical-teal rounded-full flex items-center justify-center text-white text-xl font-bold">
                                    {selectedAppointment.patientName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">
                                        {selectedAppointment.patientName}
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        Mã BHYT: {selectedAppointment.bhyt || '—'}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-slate-600">Chuyên khoa:</span>
                                    <p className="font-semibold text-slate-900">
                                        {selectedAppointment.specialty}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-slate-600">Bác sĩ:</span>
                                    <p className="font-semibold text-slate-900">
                                        {selectedAppointment.doctorName}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Diagnosis */}
                        {selectedAppointment.diagnosis && (
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-2">Chẩn đoán</h4>
                                <p className="text-slate-700 p-3 bg-slate-50 rounded-lg">
                                    {selectedAppointment.diagnosis}
                                </p>
                            </div>
                        )}

                        {/* Prescription */}
                        {selectedAppointment.prescription && selectedAppointment.prescription.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-2">
                                    Đơn thuốc ({selectedAppointment.prescription.length} loại)
                                </h4>
                                <div className="space-y-2">
                                    {selectedAppointment.prescription.map((item, idx) => (
                                        <div key={idx} className="p-3 bg-slate-50 rounded-lg text-sm">
                                            <p className="font-semibold text-slate-900">{item.medicine}</p>
                                            <p className="text-slate-600">Số lượng: {item.quantity} viên</p>
                                            <p className="text-slate-600">Liều dùng: {item.dosage}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Payment Details */}
                        <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-lg">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <DollarSign className="w-5 h-5" />
                                Chi tiết thanh toán
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Phí khám:</span>
                                    <span>{formatCurrency(selectedAppointment.specialtyPrice)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Thuốc ({selectedAppointment.prescription?.length || 0} loại):</span>
                                    <span>{formatCurrency(selectedAppointment.medicineTotal)}</span>
                                </div>
                                <div className="h-px bg-white/20 my-2" />
                                <div className="flex justify-between font-semibold">
                                    <span>Tổng cộng:</span>
                                    <span>{formatCurrency(selectedAppointment.totalCost)}</span>
                                </div>
                                <div className="flex justify-between text-success-300">
                                    <span>BHYT hỗ trợ (80%):</span>
                                    <span>- {formatCurrency(selectedAppointment.insuranceCovered)}</span>
                                </div>
                                <div className="h-px bg-white/20 my-2" />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Bệnh nhân thanh toán:</span>
                                    <span className="text-warning-300">
                                        {formatCurrency(selectedAppointment.patientPays)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Alert type="info">
                            Vui lòng xác nhận sau khi bệnh nhân đã thanh toán{' '}
                            <strong>{formatCurrency(selectedAppointment.patientPays)}</strong> tại quầy thu ngân.
                        </Alert>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowPaymentModal(false)}
                                className="flex-1"
                            >
                                Hủy
                            </Button>
                            <Button
                                variant="success"
                                onClick={handleConfirmPayment}
                                className="flex-1 flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Xác nhận thanh toán
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
