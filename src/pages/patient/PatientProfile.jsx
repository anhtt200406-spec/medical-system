import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Edit2, Save } from 'lucide-react';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

export default function PatientProfile() {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        email: user?.email || '',
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        updateProfile(formData);
        setIsEditing(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            phone: user?.phone || '',
            address: user?.address || '',
            email: user?.email || '',
        });
        setIsEditing(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                <User className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-display font-semibold text-slate-900">
                                    Hồ sơ cá nhân
                                </h1>
                                <p className="text-sm text-slate-600">Quản lý thông tin của bạn</p>
                            </div>
                        </div>
                        {!isEditing && (
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2"
                            >
                                <Edit2 className="w-4 h-4" />
                                Sửa hồ sơ
                            </Button>
                        )}
                    </div>
                </CardHeader>

                <CardBody>
                    {success && (
                        <Alert type="success" className="mb-6">
                            Cập nhật thông tin thành công!
                        </Alert>
                    )}

                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Avatar */}
                        <div className="flex justify-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-medical-teal flex items-center justify-center text-white text-3xl font-bold">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                        </div>

                        {/* Personal Info */}
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-4">Thông tin cá nhân</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Họ và tên"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    disabled={!isEditing}
                                />
                                <Input
                                    label="Ngày sinh"
                                    type="date"
                                    value={user?.birthDate}
                                    disabled
                                />
                                <Input
                                    label="Giới tính"
                                    value={user?.gender}
                                    disabled
                                />
                                <Input
                                    label="CCCD"
                                    value={user?.cccd}
                                    disabled
                                />
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-4">Thông tin liên hệ</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    disabled={!isEditing}
                                />
                                <Input
                                    label="Số điện thoại"
                                    value={formData.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    disabled={!isEditing}
                                />
                                <div className="md:col-span-2">
                                    <Input
                                        label="Địa chỉ"
                                        value={formData.address}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Insurance Info */}
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-4">Bảo hiểm y tế</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Mã BHYT"
                                    value={user?.bhyt}
                                    disabled
                                />
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Trạng thái BHYT
                                    </label>
                                    <div className="px-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50">
                                        <span className={user?.bhytActive ? 'badge badge-success' : 'badge badge-danger'}>
                                            {user?.bhytActive ? '✓ Đang hoạt động' : '✗ Hết hạn'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Medical Info */}
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-4">Thông tin y tế</h3>
                            <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
                                <p className="text-sm font-medium text-warning-900 mb-2">
                                    Tiền sử dị ứng thuốc
                                </p>
                                {user?.allergies && user.allergies.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {user.allergies.map((allergy, idx) => (
                                            <span key={idx} className="badge badge-warning">
                                                {allergy}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-warning-700">Không có tiền sử dị ứng</p>
                                )}
                                <p className="text-xs text-warning-700 mt-2">
                                    Liên hệ phòng Y tế để cập nhật thông tin dị ứng
                                </p>
                            </div>

                            <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg mt-4">
                                <p className="text-sm font-medium text-danger-900 mb-2">
                                    Chống chỉ định thuốc
                                </p>
                                {user?.contraindications && user.contraindications.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {user.contraindications.map((item, idx) => (
                                            <span key={idx} className="badge badge-danger">
                                                🚫 {item}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-danger-700">Không có chống chỉ định</p>
                                )}
                                <p className="text-xs text-danger-700 mt-2">
                                    Bác sĩ sẽ cập nhật thông tin này khi khám bệnh
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex gap-3 pt-4">
                                <Button type="submit" className="flex-1 flex items-center justify-center gap-2">
                                    <Save className="w-4 h-4" />
                                    Lưu thay đổi
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                >
                                    Hủy
                                </Button>
                            </div>
                        )}
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}
