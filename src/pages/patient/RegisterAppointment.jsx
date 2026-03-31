import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { specialties, users } from '../../data/mockData';

const TIME_SLOTS = [
    '07:30', '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30',
    '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30',
];

export default function RegisterAppointment() {
    const { user } = useAuth();
    const { addAppointment } = useApp();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ specialty: '', doctor: '', date: '', time: '' });
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const doctors = users.staff;

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (field === 'specialty' && value) {
            const availableDoctors = doctors.filter(d => d.specialty === value);
            setFormData(prev => ({
                ...prev, specialty: value,
                doctor: availableDoctors.length > 0 ? availableDoctors[0].id : '',
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (!formData.specialty || !formData.doctor || !formData.date || !formData.time) {
            setErrorMsg('Vui lòng điền đầy đủ tất cả thông tin.');
            return;
        }
        const selectedDoctor = doctors.find(d => d.id === formData.doctor);
        const selectedSpecialty = specialties.find(s => s.name === formData.specialty);
        addAppointment({
            patientId: user.id, patientName: user.name,
            doctorId: formData.doctor, doctorName: selectedDoctor?.name || '',
            specialty: formData.specialty, specialtyPrice: selectedSpecialty?.price || 200000,
            date: formData.date, time: formData.time, bhyt: user.bhyt || '',
        });
        setSuccess(true);
        setTimeout(() => navigate('/patient/dashboard'), 2000);
    };

    const availableDoctors = formData.specialty
        ? doctors.filter(d => d.specialty === formData.specialty)
        : doctors;

    const today = new Date().toISOString().split('T')[0];
    const textSub = 'rgba(226,232,240,0.65)';

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                            style={{ background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(56,189,248,0.25)' }}>
                            <Calendar className="w-6 h-6 text-sky-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">Đăng ký khám bệnh</h1>
                            <p className="text-sm" style={{ color: textSub }}>Vui lòng điền đầy đủ thông tin</p>
                        </div>
                    </div>
                </CardHeader>

                <CardBody>
                    {success && <Alert type="success" className="mb-6">✅ Đăng ký khám thành công! Lịch hẹn đã được ghi nhận. Đang chuyển hướng...</Alert>}
                    {errorMsg && <Alert type="danger" className="mb-6">{errorMsg}</Alert>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Patient Info Read-only */}
                        <div className="grid md:grid-cols-2 gap-4 p-4 rounded-xl"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                            {[
                                { label: 'Họ và tên', value: user?.name },
                                { label: 'Mã BHYT', value: user?.bhyt },
                                { label: 'Số điện thoại', value: user?.phone },
                                { label: 'Ngày sinh', value: user?.birthDate },
                            ].map(({ label, value }) => (
                                <div key={label}>
                                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'rgba(226,232,240,0.4)' }}>{label}</p>
                                    <p className="font-semibold text-white">{value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Chuyên khoa */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                    style={{ background: 'rgba(14,165,233,0.2)', border: '1px solid rgba(56,189,248,0.3)', color: '#38bdf8' }}>1</span>
                                Chọn Chuyên khoa
                            </h3>
                            <select
                                value={formData.specialty}
                                onChange={(e) => handleChange('specialty', e.target.value)}
                                className="dark-select"
                                required
                            >
                                <option value="">-- Chọn chuyên khoa --</option>
                                {specialties.map(spec => (
                                    <option key={spec.id} value={spec.name}>
                                        {spec.name} - {spec.price.toLocaleString('vi-VN')} đ
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Bác sĩ */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                    style={{ background: 'rgba(14,165,233,0.2)', border: '1px solid rgba(56,189,248,0.3)', color: '#38bdf8' }}>2</span>
                                Chọn Bác sĩ
                            </h3>
                            <select
                                value={formData.doctor}
                                onChange={(e) => handleChange('doctor', e.target.value)}
                                className="dark-select"
                                required
                                disabled={!formData.specialty}
                            >
                                <option value="">-- Chọn bác sĩ --</option>
                                {availableDoctors.map(doctor => (
                                    <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                                ))}
                            </select>
                            {formData.specialty && availableDoctors.length === 0 && (
                                <p className="text-sm text-amber-400">⚠️ Hiện chưa có bác sĩ phụ trách chuyên khoa này.</p>
                            )}
                        </div>

                        {/* Ngày khám */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                    style={{ background: 'rgba(14,165,233,0.2)', border: '1px solid rgba(56,189,248,0.3)', color: '#38bdf8' }}>3</span>
                                Ngày khám
                            </h3>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => handleChange('date', e.target.value)}
                                min={today}
                                required
                            />
                        </div>

                        {/* Giờ khám */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                    style={{ background: 'rgba(14,165,233,0.2)', border: '1px solid rgba(56,189,248,0.3)', color: '#38bdf8' }}>4</span>
                                <Clock className="w-4 h-4 text-sky-400" />
                                Chọn Giờ khám
                            </h3>
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                {TIME_SLOTS.map(slot => (
                                    <button
                                        key={slot}
                                        type="button"
                                        onClick={() => handleChange('time', slot)}
                                        className={`time-slot ${formData.time === slot ? 'active' : ''}`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                            {!formData.time && (
                                <p className="text-xs" style={{ color: 'rgba(226,232,240,0.4)' }}>Vui lòng chọn một khung giờ.</p>
                            )}
                        </div>

                        {/* Preview */}
                        {formData.specialty && formData.date && formData.time && (
                            <div className="p-4 rounded-xl"
                                style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(56,189,248,0.2)' }}>
                                <h4 className="font-semibold text-sky-300 mb-3 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" /> Thông tin lịch hẹn
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    {[
                                        { label: 'Chuyên khoa', value: formData.specialty },
                                        { label: 'Bác sĩ', value: doctors.find(d => d.id === formData.doctor)?.name || '—' },
                                        { label: 'Ngày', value: new Date(formData.date).toLocaleDateString('vi-VN') },
                                        { label: 'Giờ', value: formData.time },
                                    ].map(({ label, value }) => (
                                        <div key={label}>
                                            <span style={{ color: textSub }}>{label}: </span>
                                            <span className="font-semibold text-white">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <Button type="submit" size="lg" className="flex-1" disabled={success}>
                                Xác nhận đăng ký
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                onClick={() => navigate('/patient/dashboard')}
                            >
                                Hủy
                            </Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}
