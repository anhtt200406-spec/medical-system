import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { FileText, Pill, Calendar, User, ChevronRight } from 'lucide-react';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import { formatDate, formatCurrency } from '../../utils/helpers';

export default function MedicalHistory() {
    const { user } = useAuth();
    const { completedHistory } = useApp();
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const history = completedHistory.filter(
        a => a.patientId === user?.id && (a.status === 'completed')
    );

    const textSub  = 'rgba(226,232,240,0.65)';
    const textMuted = 'rgba(226,232,240,0.4)';

    return (
        <div className="space-y-6">
            {/* Header card */}
            <div className="animate-fade-in dark-card p-6 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <FileText className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Lịch sử khám bệnh</h1>
                    <p className="text-sm mt-1" style={{ color: textSub }}>Tổng số lần khám: <span className="text-emerald-400 font-semibold">{history.length}</span></p>
                </div>
            </div>

            {history.length > 0 ? (
                <div className="space-y-4">
                    {history.map((apt, i) => (
                        <div
                            key={apt.id}
                            className={`animate-fade-in-${Math.min(i + 1, 4)} dark-card dark-card-hover card-hover rounded-2xl overflow-hidden cursor-pointer`}
                            onClick={() => setSelectedAppointment(apt)}
                        >
                            <div className="px-6 py-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="badge badge-success">Đã khám</span>
                                            <span className="text-sm" style={{ color: textMuted }}>
                                                {formatDate(apt.date)}{apt.time && ` - ${apt.time}`}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-3">{apt.specialty}</h3>

                                        <div className="grid md:grid-cols-2 gap-2 text-sm">
                                            <div className="flex items-center gap-2" style={{ color: textSub }}>
                                                <User className="w-4 h-4 text-sky-400 flex-shrink-0" />
                                                <span>Bác sĩ: <span className="text-white font-medium">{apt.doctorName}</span></span>
                                            </div>
                                            <div className="flex items-center gap-2" style={{ color: textSub }}>
                                                <FileText className="w-4 h-4 text-violet-400 flex-shrink-0" />
                                                <span>Chẩn đoán: <span className="text-white">{apt.diagnosis}</span></span>
                                            </div>
                                        </div>

                                        {apt.prescription && apt.prescription.length > 0 && (
                                            <div className="mt-3 p-3 rounded-xl"
                                                style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(56,189,248,0.15)' }}>
                                                <p className="text-sm font-semibold text-sky-300 mb-1 flex items-center gap-2">
                                                    <Pill className="w-4 h-4" />
                                                    Đơn thuốc ({apt.prescription.length} loại)
                                                </p>
                                                <div className="text-xs space-y-0.5" style={{ color: textSub }}>
                                                    {apt.prescription.map((drug, idx) => (
                                                        <div key={idx}>• {drug.medicine} - {drug.quantity} viên</div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-right flex-shrink-0">
                                        <p className="text-xs mb-1" style={{ color: textMuted }}>Đã thanh toán</p>
                                        <p className="text-xl font-bold text-white">
                                            {formatCurrency(apt.patientPaid || apt.patientPays)}
                                        </p>
                                        <p className="text-xs mt-1 text-emerald-400">
                                            BHYT: {formatCurrency(apt.insuranceCovered)}
                                        </p>
                                        <div className="mt-2 flex items-center gap-1 text-sky-400 text-xs font-medium justify-end">
                                            Chi tiết <ChevronRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardBody>
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: 'rgba(226,232,240,0.12)' }} />
                            <p className="text-lg font-medium text-white">Chưa có lịch sử khám bệnh</p>
                            <p className="text-sm mt-2" style={{ color: textMuted }}>
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
                    <div className="space-y-5">
                        {/* Basic Info */}
                        <div className="grid md:grid-cols-2 gap-4 p-4 rounded-xl"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                            {[
                                { label: 'Ngày khám', value: formatDate(selectedAppointment.date) },
                                { label: 'Chuyên khoa', value: selectedAppointment.specialty },
                                { label: 'Bác sĩ khám', value: selectedAppointment.doctorName },
                                { label: 'Giờ khám', value: selectedAppointment.time || '—' },
                            ].map(({ label, value }) => (
                                <div key={label}>
                                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: textMuted }}>{label}</p>
                                    <p className="font-semibold text-white">{value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Diagnosis */}
                        <div>
                            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-sky-400" /> Chẩn đoán
                            </h4>
                            <p className="p-4 rounded-xl text-white/80"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                {selectedAppointment.diagnosis}
                            </p>
                        </div>

                        {/* Prescription */}
                        {selectedAppointment.prescription && selectedAppointment.prescription.length > 0 && (
                            <div>
                                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                    <Pill className="w-4 h-4 text-emerald-400" /> Đơn thuốc
                                </h4>
                                <div className="space-y-2">
                                    {selectedAppointment.prescription.map((drug, idx) => (
                                        <div key={idx} className="p-3 rounded-xl"
                                            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)' }}>
                                            <p className="font-semibold text-emerald-300">{drug.medicine}</p>
                                            <p className="text-sm mt-0.5" style={{ color: textSub }}>Số lượng: {drug.quantity} viên • Liều: {drug.dosage}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Advice */}
                        {selectedAppointment.advice && (
                            <div>
                                <h4 className="font-bold text-white mb-2">Lời dặn</h4>
                                <p className="p-4 rounded-xl border-l-4 border-sky-500" style={{ background: 'rgba(14,165,233,0.07)', color: textSub }}>
                                    {selectedAppointment.advice}
                                </p>
                            </div>
                        )}

                        {/* Contraindications */}
                        {selectedAppointment.contraindications && (
                            <div className="p-4 rounded-xl"
                                style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
                                <h4 className="font-bold text-amber-300 mb-1">Chống chỉ định</h4>
                                <p className="text-sm text-amber-200/70">
                                    {Array.isArray(selectedAppointment.contraindications)
                                        ? selectedAppointment.contraindications.join(', ')
                                        : selectedAppointment.contraindications}
                                </p>
                            </div>
                        )}

                        {/* Cost Breakdown */}
                        <div className="p-4 rounded-xl"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <h4 className="font-bold text-white mb-3">Chi phí</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span style={{ color: textSub }}>Tổng chi phí:</span>
                                    <span className="font-semibold text-white">{formatCurrency(selectedAppointment.totalPrice || selectedAppointment.totalCost)}</span>
                                </div>
                                <div className="flex justify-between text-emerald-400">
                                    <span>BHYT hỗ trợ (80%):</span>
                                    <span className="font-semibold">- {formatCurrency(selectedAppointment.insuranceCovered)}</span>
                                </div>
                                <div className="dark-divider" />
                                <div className="flex justify-between text-lg">
                                    <span className="text-white font-semibold">Bạn đã thanh toán:</span>
                                    <span className="font-bold text-amber-400">{formatCurrency(selectedAppointment.patientPaid || selectedAppointment.patientPays)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
