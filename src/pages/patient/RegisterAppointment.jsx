import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar } from 'lucide-react';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { specialties, users } from '../../data/mockData';

export default function RegisterAppointment() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        specialty: '',
        doctor: '',
        date: '',
    });
    const [success, setSuccess] = useState(false);

    const doctors = users.staff;

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Auto-select first doctor when specialty changes
        if (field === 'specialty' && value) {
            const availableDoctors = doctors.filter(d => d.specialty === value);
            if (availableDoctors.length > 0) {
                setFormData(prev => ({ ...prev, doctor: availableDoctors[0].id }));
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccess(true);
        setTimeout(() => {
            navigate('/patient/dashboard');
        }, 2000);
    };

    const availableDoctors = formData.specialty
        ? doctors.filter(d => d.specialty === formData.specialty)
        : doctors;

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
                            Đăng ký khám thành công! Vui lòng đến đúng giờ hẹn.
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

                        {/* Appointment Details */}
                        <div className="space-y-4">
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

                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-900">2. Chọn Bác sĩ</h3>
                            <select
                                value={formData.doctor}
                                onChange={(e) => handleChange('doctor', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-900">3. Ngày khám</h3>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => handleChange('date', e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button type="submit" size="lg" className="flex-1">
                                Xác nhận
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
