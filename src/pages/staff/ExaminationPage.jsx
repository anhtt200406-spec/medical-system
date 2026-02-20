import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FileText, Pill, AlertTriangle, DollarSign, Plus, X, Search } from 'lucide-react';
import Card, { CardHeader, CardBody, CardFooter } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import { users, medicinesDB, specialties, INSURANCE_COVERAGE } from '../../data/mockData';
import { checkAllergyConflict, checkContraindication, formatCurrency } from '../../utils/helpers';

export default function ExaminationPage() {
    const { appointmentId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Mock patient data
    const patient = users.patients[0];

    const [diagnosis, setDiagnosis] = useState('');
    const [advice, setAdvice] = useState('');
    const [contraindications, setContraindications] = useState(patient.contraindications || []);
    const [contraindicationInput, setContraindicationInput] = useState('');
    const [prescription, setPrescription] = useState([]);
    const [allergyWarnings, setAllergyWarnings] = useState([]);
    const [contraindicationWarnings, setContraindicationWarnings] = useState([]);
    const [showMedicineModal, setShowMedicineModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [dosage, setDosage] = useState('');
    const [showPayment, setShowPayment] = useState(false);

    // Calculate costs
    const specialtyPrice = specialties.find(s => s.name === 'Khám Nội khoa')?.price || 200000;
    const medicineTotal = prescription.reduce((sum, item) => {
        const med = medicinesDB.find(m => m.name === item.medicine);
        return sum + (med ? med.price * item.quantity : 0);
    }, 0);
    const totalCost = specialtyPrice + medicineTotal;
    const insuranceCovered = totalCost * INSURANCE_COVERAGE;
    const patientPays = totalCost - insuranceCovered;

    // Check for allergy and contraindication conflicts when prescription changes
    useEffect(() => {
        const allergyWarn = [];
        const contraindicationWarn = [];

        prescription.forEach(item => {
            // Check allergies
            const allergyConflicts = checkAllergyConflict(item.medicine, patient.allergies);
            if (allergyConflicts) {
                allergyWarn.push({
                    medicine: item.medicine,
                    allergies: allergyConflicts,
                });
            }

            // Check contraindications
            const contraindicationConflicts = checkContraindication(item.medicine, contraindications);
            if (contraindicationConflicts) {
                contraindicationWarn.push({
                    medicine: item.medicine,
                    contraindications: contraindicationConflicts,
                });
            }
        });

        setAllergyWarnings(allergyWarn);
        setContraindicationWarnings(contraindicationWarn);
    }, [prescription, patient.allergies, contraindications]);

    const handleAddMedicine = () => {
        if (!selectedMedicine || !quantity || !dosage) return;

        const newMedicine = {
            medicine: selectedMedicine.name,
            quantity: parseInt(quantity),
            dosage: dosage,
        };

        setPrescription([...prescription, newMedicine]);
        setShowMedicineModal(false);
        setSelectedMedicine(null);
        setQuantity('');
        setDosage('');
        setSearchTerm('');
    };

    const handleRemoveMedicine = (index) => {
        setPrescription(prescription.filter((_, i) => i !== index));
    };

    const handleComplete = () => {
        if (!diagnosis) {
            alert('Vui lòng nhập chẩn đoán');
            return;
        }
        setShowPayment(true);
    };

    const handlePaymentComplete = () => {
        // Update patient contraindications in user data (mock)
        patient.contraindications = contraindications;
        alert('Khám bệnh hoàn tất! Thanh toán thành công.');
        navigate('/staff/dashboard');
    };

    const handleAddContraindication = () => {
        if (!contraindicationInput.trim()) return;
        if (!contraindications.includes(contraindicationInput.trim())) {
            setContraindications([...contraindications, contraindicationInput.trim()]);
        }
        setContraindicationInput('');
    };

    const handleRemoveContraindication = (item) => {
        setContraindications(contraindications.filter(c => c !== item));
    };

    const filteredMedicines = medicinesDB.filter(med =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Patient Info Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-display font-semibold text-slate-900">
                                {patient.name}
                            </h1>
                            <p className="text-sm text-slate-600">Mã BN: {patient.id} • BHYT: {patient.bhyt}</p>
                        </div>
                        <span className="badge badge-info">Đang khám</span>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-slate-600">Ngày sinh</p>
                            <p className="font-semibold text-slate-900">{patient.birthDate}</p>
                        </div>
                        <div>
                            <p className="text-slate-600">Giới tính</p>
                            <p className="font-semibold text-slate-900">{patient.gender}</p>
                        </div>
                        <div>
                            <p className="text-slate-600">Điện thoại</p>
                            <p className="font-semibold text-slate-900">{patient.phone}</p>
                        </div>
                        <div>
                            <p className="text-slate-600">Địa chỉ</p>
                            <p className="font-semibold text-slate-900">{patient.address}</p>
                        </div>
                    </div>

                    {/* Allergy Alert */}
                    {patient.allergies && patient.allergies.length > 0 && (
                        <Alert type="warning" className="mt-4">
                            <strong>⚠️ Tiền sử dị ứng:</strong> {patient.allergies.join(', ')}
                        </Alert>
                    )}

                    {/* Contraindications Alert */}
                    {contraindications && contraindications.length > 0 && (
                        <Alert type="danger" className="mt-4">
                            <strong>🚫 Chống chỉ định:</strong> {contraindications.join(', ')}
                        </Alert>
                    )}
                </CardBody>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Diagnosis */}
                    <Card>
                        <CardHeader>
                            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary-600" />
                                Chẩn đoán
                            </h2>
                        </CardHeader>
                        <CardBody>
                            <textarea
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                                placeholder="Nhập chẩn đoán bệnh..."
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                rows="4"
                            />
                        </CardBody>
                    </Card>

                    {/* Contraindications Management */}
                    <Card>
                        <CardHeader>
                            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-danger-600" />
                                Chống chỉ định
                            </h2>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={contraindicationInput}
                                        onChange={(e) => setContraindicationInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddContraindication()}
                                        placeholder="Nhập thuốc/nhóm thuốc chống chỉ định..."
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={handleAddContraindication}
                                        className="flex items-center gap-1"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Thêm
                                    </Button>
                                </div>
                                {contraindications.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {contraindications.map((item, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-danger-100 text-danger-700 rounded-lg text-sm font-medium"
                                            >
                                                🚫 {item}
                                                <button
                                                    onClick={() => handleRemoveContraindication(item)}
                                                    className="hover:bg-danger-200 rounded p-0.5"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <p className="text-xs text-slate-600">
                                    💡 Ghi chú các thuốc hoặc nhóm thuốc mà bệnh nhân không nên sử dụng
                                </p>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Advice */}
                    <Card>
                        <CardHeader>
                            <h2 className="font-semibold text-slate-900">Lời dặn</h2>
                        </CardHeader>
                        <CardBody>
                            <textarea
                                value={advice}
                                onChange={(e) => setAdvice(e.target.value)}
                                placeholder="Nhập lời dặn cho bệnh nhân..."
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                rows="3"
                            />
                        </CardBody>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Prescription */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                                    <Pill className="w-5 h-5 text-success-600" />
                                    Kê đơn thuốc
                                </h2>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowMedicineModal(true)}
                                    className="flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    Thêm thuốc
                                </Button>
                            </div>
                        </CardHeader>
                        <CardBody>
                            {allergyWarnings.length > 0 && (
                                <Alert type="danger" className="mb-4 animate-pulse">
                                    <div className="flex items-start gap-2">
                                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <strong>⚠️ CẢNH BÁO DỊ ỨNG!</strong>
                                            {allergyWarnings.map((warning, idx) => (
                                                <div key={idx} className="mt-1 text-sm">
                                                    • <strong>{warning.medicine}</strong> trùng với dị ứng:{' '}
                                                    <strong>{warning.allergies.join(', ')}</strong>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Alert>
                            )}

                            {contraindicationWarnings.length > 0 && (
                                <Alert type="danger" className="mb-4 animate-pulse">
                                    <div className="flex items-start gap-2">
                                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <strong>🚫 CẢNH BÁO CHỐNG CHỈ ĐỊNH!</strong>
                                            {contraindicationWarnings.map((warning, idx) => (
                                                <div key={idx} className="mt-1 text-sm">
                                                    • <strong>{warning.medicine}</strong> vi phạm chống chỉ định:{' '}
                                                    <strong>{warning.contraindications.join(', ')}</strong>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Alert>
                            )}

                            {prescription.length > 0 ? (
                                <div className="space-y-3">
                                    {prescription.map((item, index) => {
                                        const hasAllergyWarning = allergyWarnings.some(w => w.medicine === item.medicine);
                                        const hasContraindicationWarning = contraindicationWarnings.some(w => w.medicine === item.medicine);
                                        const hasWarning = hasAllergyWarning || hasContraindicationWarning;
                                        return (
                                            <div
                                                key={index}
                                                className={`p-3 rounded-lg border-2 ${hasWarning
                                                    ? 'bg-danger-50 border-danger-500'
                                                    : 'bg-success-50 border-success-200'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-semibold text-slate-900">{item.medicine}</h4>
                                                            {hasAllergyWarning && (
                                                                <span className="badge badge-danger text-xs">
                                                                    ⚠️ DỊ ỨNG
                                                                </span>
                                                            )}
                                                            {hasContraindicationWarning && (
                                                                <span className="badge badge-danger text-xs">
                                                                    🚫 CHỐNG CHỈ ĐỊNH
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-slate-700 mt-1">
                                                            Số lượng: <strong>{item.quantity} viên</strong>
                                                        </p>
                                                        <p className="text-sm text-slate-700">Liều dùng: {item.dosage}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveMedicine(index)}
                                                        className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-danger-600 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-500">
                                    <Pill className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                                    <p className="text-sm">Chưa có thuốc trong đơn</p>
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    {/* Payment Summary */}
                    <Card className="bg-slate-900 text-white border-none">
                        <CardHeader>
                            <h2 className="font-semibold flex items-center gap-2">
                                <DollarSign className="w-5 h-5" />
                                Tổng quan chi phí
                            </h2>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Khám bệnh:</span>
                                    <span>{formatCurrency(specialtyPrice)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Thuốc ({prescription.length} loại):</span>
                                    <span>{formatCurrency(medicineTotal)}</span>
                                </div>
                                <div className="h-px bg-white/20 my-2" />
                                <div className="flex justify-between font-semibold">
                                    <span>Tổng cộng:</span>
                                    <span>{formatCurrency(totalCost)}</span>
                                </div>
                                <div className="flex justify-between text-success-300">
                                    <span>BHYT hỗ trợ (80%):</span>
                                    <span>- {formatCurrency(insuranceCovered)}</span>
                                </div>
                                <div className="h-px bg-white/20 my-2" />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Bệnh nhân trả:</span>
                                    <span>{formatCurrency(patientPays)}</span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* Action Buttons */}
            <Card>
                <CardFooter>
                    <div className="flex gap-3 w-full">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => navigate('/staff/dashboard')}
                            className="flex-1"
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="success"
                            size="lg"
                            onClick={handleComplete}
                            className="flex-1"
                            disabled={allergyWarnings.length > 0 || contraindicationWarnings.length > 0}
                        >
                            {(allergyWarnings.length > 0 || contraindicationWarnings.length > 0)
                                ? '⚠️ Có cảnh báo thuốc'
                                : 'Hoàn tất & Thanh toán'}
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            {/* Medicine Selection Modal */}
            <Modal
                isOpen={showMedicineModal}
                onClose={() => setShowMedicineModal(false)}
                title="Thêm thuốc vào đơn"
                size="md"
            >
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm thuốc..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-2">
                        {filteredMedicines.map(med => (
                            <div
                                key={med.id}
                                onClick={() => setSelectedMedicine(med)}
                                className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${selectedMedicine?.id === med.id
                                    ? 'bg-primary-50 border-primary-500'
                                    : 'bg-white border-slate-200 hover:border-primary-300'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-slate-900">{med.name}</p>
                                        <p className="text-sm text-slate-600">{formatCurrency(med.price)}/{med.unit}</p>
                                    </div>
                                    {checkAllergyConflict(med.name, patient.allergies) && (
                                        <span className="badge badge-danger text-xs">⚠️ DỊ ỨNG</span>
                                    )}
                                    {checkContraindication(med.name, contraindications) && (
                                        <span className="badge badge-danger text-xs">🚫 CHỐNG CHỈ ĐỊNH</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {selectedMedicine && (
                        <div className="space-y-3 pt-4 border-t">
                            <Input
                                label="Số lượng (viên)"
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                min="1"
                                placeholder="Nhập số lượng"
                            />
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Liều dùng
                                </label>
                                <textarea
                                    value={dosage}
                                    onChange={(e) => setDosage(e.target.value)}
                                    placeholder="VD: Uống 2 viên/lần, 3 lần/ngày sau ăn"
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    rows="2"
                                />
                            </div>
                            <Button onClick={handleAddMedicine} className="w-full">
                                Thêm vào đơn
                            </Button>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Payment Modal */}
            <Modal
                isOpen={showPayment}
                onClose={() => setShowPayment(false)}
                title="Xác nhận thanh toán"
                size="md"
            >
                <div className="space-y-6">
                    <div className="p-4 bg-slate-50 rounded-lg space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Bệnh nhân:</span>
                            <span className="font-semibold text-slate-900">{patient.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Mã BHYT:</span>
                            <span className="font-semibold text-slate-900">{patient.bhyt}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Phí khám:</span>
                            <span>{formatCurrency(specialtyPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Thuốc:</span>
                            <span>{formatCurrency(medicineTotal)}</span>
                        </div>
                        <div className="h-px bg-slate-200 my-2" />
                        <div className="flex justify-between font-semibold">
                            <span>Tổng cộng:</span>
                            <span>{formatCurrency(totalCost)}</span>
                        </div>
                        <div className="flex justify-between text-success-600">
                            <span>BHYT hỗ trợ (80%):</span>
                            <span>- {formatCurrency(insuranceCovered)}</span>
                        </div>
                        <div className="h-px bg-slate-200 my-2" />
                        <div className="flex justify-between text-lg font-bold text-primary-600">
                            <span>Bệnh nhân thanh toán:</span>
                            <span>{formatCurrency(patientPays)}</span>
                        </div>
                    </div>

                    <Alert type="info">
                        Bệnh nhân sẽ thanh toán <strong>{formatCurrency(patientPays)}</strong> tại quầy thu ngân.
                    </Alert>

                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setShowPayment(false)} className="flex-1">
                            Quay lại
                        </Button>
                        <Button onClick={handlePaymentComplete} className="flex-1">
                            Xác nhận hoàn tất
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
