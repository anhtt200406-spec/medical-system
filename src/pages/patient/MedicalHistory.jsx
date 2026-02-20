import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { FileText, Pill, Calendar, User } from 'lucide-react';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import { formatDate, formatCurrency } from '../../utils/helpers';

export default function MedicalHistory() {
    const { user } = useAuth();
    const { completedHistory } = useApp();
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    // Lọc lịch sử của bệnh nhân hiện tại
    const history = completedHistory.filter(
        a => a.patientId === user?.id && (a.status === 'completed')
    );

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-success-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-display font-semibold text-slate-900">
                                Lịch sử khám bệnh
                            </h1>
                            <p className="text-sm text-slate-600">
                                Tổng số lần khám: {history.length}
                            </p>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {history.length > 0 ? (
                <div className="space-y-4">
                    {history.map((apt) => (
                        <Card
                            key={apt.id}
                            hover
                            onClick={() => setSelectedAppointment(apt)}
                        >
                            <CardBody>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="badge badge-success">Đã khám</span>
                                            <span className="text-sm text-slate-500">
                                                {formatDate(apt.date)} {apt.time && `- ${apt.time}`}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                            {apt.specialty}
                                        </h3>

                                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <User className="w-4 h-4" />
                                                <span>Bác sĩ: {apt.doctorName}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <FileText className="w-4 h-4" />
                                                <span>Chẩn đoán: {apt.diagnosis}</span>
                                            </div>
                                        </div>

                                        {apt.prescription && apt.prescription.length > 0 && (
                                            <div className="mt-3 p-3 bg-primary-50 rounded-lg">
                                                <p className="text-sm font-medium text-primary-900 mb-1 flex items-center gap-2">
                                                    <Pill className="w-4 h-4" />
                                                    Đơn thuốc ({apt.prescription.length} loại)
                                                </p>
                                                <div className="text-xs text-primary-700 space-y-0.5">
                                                    {apt.prescription.map((drug, idx) => (
                                                        <div key={idx}>
                                                            • {drug.medicine} - {drug.quantity} viên
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-right ml-4">
                                        <p className="text-sm text-slate-600">Đã thanh toán</p>
                                        <p className="text-lg font-semibold text-slate-900">
                                            {formatCurrency(apt.patientPaid || apt.patientPays)}
                                        </p>
                                        <p className="text-xs text-success-600">
                                            BHYT hỗ trợ: {formatCurrency(apt.insuranceCovered)}
                                        </p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardBody>
                        <div className="text-center py-12 text-slate-500">
                            <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                            <p className="text-lg font-medium">Chưa có lịch sử khám bệnh</p>
                            <p className="text-sm mt-2">
                                Các lần khám của bạn sẽ được lưu trữ tại đây
                            </p>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Detail Modal */}
            <Modal
                isOpen={!!selectedAppointment}
                onClose={() => setSelectedAppointment(null)}
                title="Chi tiết khám bệnh"
                size="lg"
            >
                {selectedAppointment && (
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                            <div>
                                <p className="text-sm text-slate-600">Ngày khám</p>
                                <p className="font-semibold text-slate-900">
                                    {formatDate(selectedAppointment.date)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Chuyên khoa</p>
                                <p className="font-semibold text-slate-900">
                                    {selectedAppointment.specialty}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Bác sĩ khám</p>
                                <p className="font-semibold text-slate-900">
                                    {selectedAppointment.doctorName}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Giờ khám</p>
                                <p className="font-semibold text-slate-900">
                                    {selectedAppointment.time || '—'}
                                </p>
                            </div>
                        </div>

                        {/* Diagnosis */}
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary-600" />
                                Chẩn đoán
                            </h4>
                            <p className="text-slate-700 p-4 bg-slate-50 rounded-lg">
                                {selectedAppointment.diagnosis}
                            </p>
                        </div>

                        {/* Prescription */}
                        {selectedAppointment.prescription && selectedAppointment.prescription.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                    <Pill className="w-5 h-5 text-success-600" />
                                    Đơn thuốc
                                </h4>
                                <div className="space-y-3">
                                    {selectedAppointment.prescription.map((drug, idx) => (
                                        <div key={idx} className="p-4 bg-success-50 border border-success-200 rounded-lg">
                                            <p className="font-semibold text-success-900">{drug.medicine}</p>
                                            <p className="text-sm text-success-700">Số lượng: {drug.quantity} viên</p>
                                            <p className="text-sm text-success-700 mt-1">
                                                Liều dùng: {drug.dosage}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Advice */}
                        {selectedAppointment.advice && (
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-2">Lời dặn</h4>
                                <p className="text-slate-700 p-4 bg-primary-50 rounded-lg border-l-4 border-primary-500">
                                    {selectedAppointment.advice}
                                </p>
                            </div>
                        )}

                        {/* Contraindications */}
                        {selectedAppointment.contraindications && (
                            <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
                                <h4 className="font-semibold text-warning-900 mb-2">Chống chỉ định</h4>
                                <p className="text-sm text-warning-800">
                                    {Array.isArray(selectedAppointment.contraindications)
                                        ? selectedAppointment.contraindications.join(', ')
                                        : selectedAppointment.contraindications}
                                </p>
                            </div>
                        )}

                        {/* Cost Breakdown */}
                        <div className="p-4 bg-slate-900 text-white rounded-lg">
                            <h4 className="font-semibold mb-3">Chi phí</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Tổng chi phí:</span>
                                    <span className="font-semibold">
                                        {formatCurrency(selectedAppointment.totalPrice || selectedAppointment.totalCost)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-success-300">
                                    <span>BHYT hỗ trợ (80%):</span>
                                    <span className="font-semibold">
                                        - {formatCurrency(selectedAppointment.insuranceCovered)}
                                    </span>
                                </div>
                                <div className="h-px bg-white/20 my-2" />
                                <div className="flex justify-between text-lg">
                                    <span>Bạn đã thanh toán:</span>
                                    <span className="font-bold">
                                        {formatCurrency(selectedAppointment.patientPaid || selectedAppointment.patientPays)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
