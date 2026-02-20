import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock } from 'lucide-react';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { specialties, users } from '../../data/mockData';

// Khung giờ khám cố định
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

    const [formData, setFormData] = useState({
        specialty: '',
        doctor: '',
        date: '',
        time: '',
    });
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const doctors = users.staff;

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Tự động chọn bác sĩ đầu tiên phù hợp khi chọn chuyên khoa
        if (field === 'specialty' && value) {
            const availableDoctors = doctors.filter(d => d.specialty === value);
            setFormData(prev => ({
                ...prev,
                specialty: value,
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
            patientId: user.id,
            patientName: user.name,
            doctorId: formData.doctor,
            doctorName: selectedDoctor?.name || '',
            specialty: formData.specialty,
            specialtyPrice: selectedSpecialty?.price || 200000,
            date: formData.date,
            time: formData.time,
            bhyt: user.bhyt || '',
        });

        setSuccess(true);
        setTimeout(() => {
            navigate('/patient/dashboard');
        }, 2000);
    };

    const availableDoctors = formData.specialty
        ? doctors.filter(d => d.specialty === formData.specialty)
        : doctors;

    // Ngày tối thiểu = hôm nay
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="max-w-3xl mx-auto">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-display font-semibold text-slate-900">
                                Đăng ký khám bệnh
                            </h1>
                            <p className="text-sm text-slate-600">Vui lòng điền đầy đủ thông tin</p>
                        </div>
                    </div>
                </CardHeader>

                <CardBody>
                    {success && (
                        <Alert type="success" className="mb-6">
                            ✅ Đăng ký khám thành công! Lịch hẹn đã được ghi nhận. Đang chuyển hướng...
                        </Alert>
                    )}

                    {errorMsg && (
                        <Alert type="danger" className="mb-6">
                            {errorMsg}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Patient Info (Read-only) */}
                        <div className="grid md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                            <div>
                                <p className="text-sm text-slate-600">Họ và tên</p>
                                <p className="font-semibold text-slate-900">{user?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Mã BHYT</p>
                                <p className="font-semibold text-slate-900">{user?.bhyt}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Số điện thoại</p>
                                <p className="font-semibold text-slate-900">{user?.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Ngày sinh</p>
                                <p className="font-semibold text-slate-900">{user?.birthDate}</p>
                            </div>
                        </div>

                        {/* Chuyên khoa */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-slate-900">1. Chọn Chuyên khoa</h3>
                            <select
                                value={formData.specialty}
                                onChange={(e) => handleChange('specialty', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                            <h3 className="font-semibold text-slate-900">2. Chọn Bác sĩ</h3>
                            <select
                                value={formData.doctor}
                                onChange={(e) => handleChange('doctor', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                                disabled={!formData.specialty}
                            >
                                <option value="">-- Chọn bác sĩ --</option>
                                {availableDoctors.map(doctor => (
                                    <option key={doctor.id} value={doctor.id}>
                                        {doctor.name}
                                    </option>
                                ))}
                            </select>
                            {formData.specialty && availableDoctors.length === 0 && (
                                <p className="text-sm text-warning-600">
                                    ⚠️ Hiện chưa có bác sĩ phụ trách chuyên khoa này.
                                </p>
                            )}
                        </div>

                        {/* Ngày khám */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-slate-900">3. Ngày khám</h3>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => handleChange('date', e.target.value)}
                                min={today}
                                required
                            />
                        </div>

                        {/* Giờ khám */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary-600" />
                                4. Chọn Giờ khám
                            </h3>
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                {TIME_SLOTS.map(slot => (
                                    <button
                                        key={slot}
                                        type="button"
                                        onClick={() => handleChange('time', slot)}
                                        className={`py-2 px-3 rounded-lg text-sm font-medium border-2 transition-all ${formData.time === slot
                                            ? 'bg-primary-600 text-white border-primary-600'
                                            : 'bg-white text-slate-700 border-slate-200 hover:border-primary-400'
                                            }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                            {!formData.time && (
                                <p className="text-xs text-slate-500">Vui lòng chọn một khung giờ.</p>
                            )}
                        </div>

                        {/* Preview lịch đã chọn */}
                        {formData.specialty && formData.date && formData.time && (
                            <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg text-sm">
                                <h4 className="font-semibold text-primary-900 mb-2">📋 Thông tin lịch hẹn</h4>
                                <div className="grid grid-cols-2 gap-2 text-primary-800">
                                    <span>Chuyên khoa: <strong>{formData.specialty}</strong></span>
                                    <span>Bác sĩ: <strong>{doctors.find(d => d.id === formData.doctor)?.name || '—'}</strong></span>
                                    <span>Ngày: <strong>{new Date(formData.date).toLocaleDateString('vi-VN')}</strong></span>
                                    <span>Giờ: <strong>{formData.time}</strong></span>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 pt-4">
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
