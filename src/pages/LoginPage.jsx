import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Calendar, Heart, Shield, Users, Award, Microscope, Stethoscope, BookOpen, Briefcase, MapPin, Clock, ChevronRight, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';

const BG_IMG_1 = 'https://cdn.baohatinh.vn/images/5d67f8d3ba210b5701fd4a54adb936f20fe9278a2cadaf67c93571cdd2740b1ce27d0da5668851345b8ea8f6be306c68/133d0211033t73280l0.jpg';
const BG_IMG_2 = 'https://ant-arc.com/wp-content/uploads/2023/04/3-2.jpg';
const RECRUITMENT_EMAIL = 'anhtt200406@gmail.com';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        const result = login(email, password);
        if (result.success) {
            if (result.user.role === 'patient') {
                navigate('/patient/dashboard');
            } else if (result.user.role === 'staff') {
                navigate('/staff/dashboard');
            }
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="glass sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-medical-teal rounded-lg flex items-center justify-center">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-display font-bold text-slate-900">Hệ thống Y tế</h1>
                            <p className="text-xs text-slate-600">NEU MEDICAL</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a href="#about" className="text-sm text-slate-600 hover:text-primary-600 font-medium transition-colors hidden sm:block">Giới thiệu</a>
                        <a href="#recruitment" className="text-sm text-slate-600 hover:text-primary-600 font-medium transition-colors hidden sm:block">Tuyển dụng</a>
                        <a
                            href="#login-form"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary-600 text-primary-600 font-medium text-sm hover:bg-primary-600 hover:text-white transition-all"
                        >
                            Đăng nhập
                        </a>
                    </div>
                </div>
            </header>

            {/* ======= HERO SECTION ======= */}
            <main className="container mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-72px)] py-4">
                    {/* Left: Marketing Content */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 px-4 py-1.5 rounded-full">
                                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                                <span className="text-xs font-semibold text-primary-700 uppercase tracking-wide">Hệ thống y tế NEU</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight">
                                Chăm sóc sức khỏe
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-medical-teal">
                                    Thông minh &amp; Toàn diện
                                </span>
                            </h2>
                            <p className="text-lg text-slate-600">
                                Hệ thống quản lý y tế hiện đại dành cho sinh viên và cán bộ NEU
                            </p>
                        </div>

                        {/* Features */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-4 glass rounded-xl hover:scale-[1.02] transition-transform">
                                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Calendar className="w-5 h-5 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Đăng ký khám</h3>
                                    <p className="text-sm text-slate-600">Đặt lịch nhanh chóng</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 glass rounded-xl hover:scale-[1.02] transition-transform">
                                <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Heart className="w-5 h-5 text-success-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Theo dõi sức khỏe</h3>
                                    <p className="text-sm text-slate-600">Lịch sử khám bệnh</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 glass rounded-xl hover:scale-[1.02] transition-transform">
                                <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Activity className="w-5 h-5 text-warning-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Cảnh báo dị ứng</h3>
                                    <p className="text-sm text-slate-600">An toàn kê đơn</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 glass rounded-xl hover:scale-[1.02] transition-transform">
                                <div className="w-10 h-10 bg-medical-teal/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-5 h-5 text-medical-teal" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Bảo hiểm y tế</h3>
                                    <p className="text-sm text-slate-600">Tích hợp BHYT</p>
                                </div>
                            </div>
                        </div>

                        {/* Demo credentials */}
                        <div className="glass-dark p-4 rounded-xl space-y-2">
                            <p className="text-white font-semibold text-sm">Demo Accounts:</p>
                            <div className="grid grid-cols-2 gap-2 text-xs text-white/80">
                                <div>
                                    <span className="block font-medium text-white">Bệnh nhân:</span>
                                    <code>patient@neu.edu.vn</code>
                                </div>
                                <div>
                                    <span className="block font-medium text-white">Nhân viên:</span>
                                    <code>doctor@neu.edu.vn</code>
                                </div>
                            </div>
                            <p className="text-xs text-white/60">Password: 123456</p>
                        </div>
                    </div>

                    {/* Right: Login Form */}
                    <div id="login-form" className="glass p-8 rounded-2xl shadow-strong">
                        <h3 className="text-2xl font-display font-semibold text-slate-900 mb-6">
                            Đăng nhập
                        </h3>

                        {error && (
                            <Alert type="danger" className="mb-4">
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            <Input
                                label="Email"
                                type="email"
                                placeholder="example@neu.edu.vn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <Input
                                label="Mật khẩu"
                                type="password"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <Button type="submit" className="w-full" size="lg">
                                Đăng nhập
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-slate-600">
                            Chưa có tài khoản?{' '}
                            <button className="text-primary-600 hover:text-primary-700 font-medium">
                                Liên hệ phòng Y tế
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* ======= SECTION 1: VỀ CHÚNG TÔI ======= */}
            <section id="about" className="py-20 bg-gradient-to-br from-slate-50 to-primary-50/40 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    {/* Section Header */}
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 bg-primary-100 border border-primary-200 px-4 py-1.5 rounded-full mb-4">
                            <span className="text-xs font-semibold text-primary-700 uppercase tracking-wide">Về chúng tôi</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-4">
                            Hệ thống Y tế
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-medical-teal"> NEU Medical</span>
                        </h2>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                            Phòng Y tế Trường Đại học Kinh tế Quốc dân cung cấp dịch vụ chăm sóc sức khỏe toàn diện cho hơn 30.000 sinh viên và cán bộ nhân viên.
                        </p>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {[
                            { label: 'Năm hoạt động', value: '25+', icon: Award, color: 'from-violet-500 to-purple-700' },
                            { label: 'Sinh viên phục vụ', value: '30.000+', icon: Users, color: 'from-sky-500 to-blue-700' },
                            { label: 'Bác sĩ chuyên khoa', value: '12', icon: Stethoscope, color: 'from-emerald-500 to-teal-700' },
                            { label: 'Lượt khám / năm', value: '15.000+', icon: Microscope, color: 'from-amber-500 to-orange-700' },
                        ].map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <div key={i} className={`bg-gradient-to-br ${stat.color} text-white rounded-2xl p-6 text-center shadow-lg hover:scale-[1.03] transition-transform`}>
                                    <div className="w-12 h-12 bg-white/20 rounded-xl mx-auto flex items-center justify-center mb-3">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <p className="text-3xl font-display font-bold">{stat.value}</p>
                                    <p className="text-white/70 text-sm mt-1">{stat.label}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Two-column content */}
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Left: Highlights */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-display font-bold text-slate-900">Sứ mệnh &amp; Giá trị cốt lõi</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Phòng Y tế NEU được thành lập với sứ mệnh bảo vệ và nâng cao sức khỏe cho toàn thể cộng đồng NEU. Chúng tôi không ngừng đổi mới và ứng dụng công nghệ hiện đại để mang lại dịch vụ y tế tốt nhất.
                            </p>
                            <div className="space-y-4">
                                {[
                                    { icon: Heart, title: 'Chăm sóc tận tâm', desc: 'Đội ngũ y bác sĩ giàu kinh nghiệm, luôn đặt sức khỏe bệnh nhân lên hàng đầu' },
                                    { icon: Shield, title: 'An toàn &amp; Bảo mật', desc: 'Hệ thống quản lý hồ sơ bảo mật, tích hợp đầy đủ bảo hiểm y tế BHYT' },
                                    { icon: BookOpen, title: 'Đào tạo y tế', desc: 'Tổ chức thường xuyên các buổi tư vấn sức khỏe, phòng bệnh cho sinh viên' },
                                    { icon: Microscope, title: 'Trang thiết bị hiện đại', desc: 'Được trang bị máy móc y tế tiên tiến, đảm bảo chẩn đoán chính xác' },
                                ].map((item, i) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-primary-200 transition-colors">
                                            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-5 h-5 text-primary-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-900 mb-0.5" dangerouslySetInnerHTML={{ __html: item.title }} />
                                                <p className="text-sm text-slate-500">{item.desc}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right: Image + Specialties */}
                        <div className="space-y-6">
                            {/* Hospital Hero Image */}
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-64 sm:h-72 group">
                                <img
                                    src="https://media.istockphoto.com/id/856544984/vi/anh/nh%C3%B3m-b%C3%A1c-s%C4%A9-v%E1%BB%99i-v%C3%A3-xu%E1%BB%91ng-h%C3%A0nh-lang-b%E1%BB%87nh-vi%E1%BB%87n.jpg?s=612x612&w=0&k=20&c=OHHvKC2Oq75VKkfRLrF2yeG_FG97gDV6fPBKH8jCZIU="
                                    alt="Đội ngũ bác sĩ NEU Medical"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/70 via-primary-900/20 to-transparent" />
                                {/* Badge overlay */}
                                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                                    <div>
                                        <p className="text-white font-display font-bold text-lg leading-tight">Đội ngũ chuyên gia</p>
                                        <p className="text-white/80 text-sm">Tận tâm vì sức khỏe cộng đồng NEU</p>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-3 py-1.5 text-center">
                                        <p className="text-white font-bold text-lg leading-none">12</p>
                                        <p className="text-white/80 text-xs">Bác sĩ</p>
                                    </div>
                                </div>
                            </div>

                            {/* Specialties */}
                            <div className="space-y-3">
                                <h3 className="text-xl font-display font-bold text-slate-900">Các chuyên khoa</h3>
                                <div className="grid gap-2.5">
                                    {[
                                        { name: 'Khám Tổng quát', desc: 'Thứ 2 – Thứ 6, 7:30–17:00', dot: 'bg-emerald-500' },
                                        { name: 'Khám Nội khoa', desc: 'Thứ 2 – Thứ 6, 7:30–17:00', dot: 'bg-sky-500' },
                                        { name: 'Khám Ngoại khoa', desc: 'Thứ 3, Thứ 5', dot: 'bg-violet-500' },
                                        { name: 'Khám Tai Mũi Họng', desc: 'Thứ 2, Thứ 4, Thứ 6', dot: 'bg-amber-500' },
                                        { name: 'Khám Mắt', desc: 'Thứ 3, Thứ 5', dot: 'bg-rose-500' },
                                        { name: 'Tiêm chủng', desc: 'Thứ 2 – Thứ 6, 7:30–11:00', dot: 'bg-teal-500' },
                                    ].map((sp, i) => (
                                        <div key={i} className="flex items-center justify-between p-3.5 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-3">
                                                <span className={`w-2.5 h-2.5 rounded-full ${sp.dot} flex-shrink-0`} />
                                                <div>
                                                    <p className="font-semibold text-slate-800 text-sm">{sp.name}</p>
                                                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                        <Clock className="w-3 h-3" />{sp.desc}
                                                    </p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-300" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* ======= SECTION 2: TUYỂN DỤNG ======= */}
            <section id="recruitment" className="py-20 relative overflow-hidden">
                {/* Layered background images */}
                <div className="absolute inset-0 grid grid-cols-1 sm:grid-cols-2">
                    <div
                        className="bg-cover bg-center"
                        style={{ backgroundImage: `url('${BG_IMG_1}')` }}
                    />
                    <div
                        className="bg-cover bg-center"
                        style={{ backgroundImage: `url('${BG_IMG_2}')` }}
                    />
                </div>
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/92 via-primary-900/85 to-slate-900/92" />

                <div className="relative z-10 container mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4">
                            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Cơ hội việc làm</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                            Cùng chúng tôi xây dựng
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                                Tương lai y tế NEU
                            </span>
                        </h2>
                        <p className="text-white/60 text-lg max-w-2xl mx-auto">
                            Phòng Y tế NEU luôn tìm kiếm những tài năng nhiệt huyết, yêu nghề y để cùng phát triển và phục vụ cộng đồng sinh viên.
                        </p>
                    </div>

                    {/* Job Positions */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
                        {[
                            {
                                title: 'Bác sĩ Đa khoa',
                                type: 'Toàn thời gian',
                                location: 'Hà Nội',
                                salary: '15–25 triệu/tháng',
                                hot: true,
                                tags: ['Khám tổng quát', 'Kê đơn thuốc', 'BHYT'],
                                desc: 'Khám và điều trị cho sinh viên, cán bộ NEU. Tham gia các chương trình y tế học đường.',
                            },
                            {
                                title: 'Điều dưỡng viên',
                                type: 'Toàn thời gian',
                                location: 'Hà Nội',
                                salary: '8–12 triệu/tháng',
                                hot: true,
                                tags: ['Chăm sóc BN', 'Tiêm chủng', 'Hồ sơ y tế'],
                                desc: 'Hỗ trợ bác sĩ trong quá trình khám chữa bệnh, quản lý hồ sơ bệnh nhân điện tử.',
                            },
                            {
                                title: 'Dược sĩ',
                                type: 'Toàn thời gian',
                                location: 'Hà Nội',
                                salary: '10–18 triệu/tháng',
                                hot: false,
                                tags: ['Quản lý kho thuốc', 'Tư vấn dược', 'BHYT'],
                                desc: 'Quản lý kho thuốc, tư vấn và cấp phát thuốc theo đơn, kiểm soát hạn sử dụng.',
                            },
                            {
                                title: 'Kỹ thuật viên XN',
                                type: 'Bán thời gian',
                                location: 'Hà Nội',
                                salary: '7–11 triệu/tháng',
                                hot: false,
                                tags: ['Xét nghiệm máu', 'Nước tiểu', 'Báo cáo KQ'],
                                desc: 'Thực hiện các xét nghiệm cơ bản hỗ trợ chẩn đoán, vận hành thiết bị phòng lab.',
                            },
                            {
                                title: 'Chuyên viên CNTT Y tế',
                                type: 'Toàn thời gian',
                                location: 'Hà Nội',
                                salary: '12–20 triệu/tháng',
                                hot: true,
                                tags: ['Phần mềm y tế', 'Database', 'Bảo mật'],
                                desc: 'Phát triển và duy trì hệ thống quản lý y tế, hỗ trợ chuyển đổi số phòng y tế NEU.',
                            },
                            {
                                title: 'Cộng tác viên Y tế',
                                type: 'Thực tập',
                                location: 'Hà Nội',
                                salary: 'Thỏa thuận',
                                hot: false,
                                tags: ['Sinh viên Y', 'Thực tập', 'Học nghề'],
                                desc: 'Cơ hội thực tập lý tưởng cho sinh viên các trường Y Dược, được hướng dẫn bởi đội ngũ chuyên nghiệp.',
                            },
                        ].map((job, i) => (
                            <div
                                key={i}
                                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:border-white/30 transition-all group"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-white text-lg">{job.title}</h3>
                                            {job.hot && (
                                                <span className="text-xs bg-amber-400 text-amber-900 font-bold px-2 py-0.5 rounded-full">HOT</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-white/50">
                                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.type}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-white/60 text-sm leading-relaxed mb-4">{job.desc}</p>
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {job.tags.map((tag, j) => (
                                        <span key={j} className="text-xs bg-white/10 text-white/70 px-2.5 py-1 rounded-full border border-white/10">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                    <span className="text-amber-400 font-semibold text-sm">{job.salary}</span>
                                    <button className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white font-medium group-hover:gap-2.5 transition-all">
                                        Ứng tuyển <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Benefits */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
                        <h3 className="text-2xl font-display font-bold text-white text-center mb-8">Quyền lợi khi làm việc tại NEU Medical</h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: 'Lương cạnh tranh', desc: 'Thu nhập hấp dẫn, xét tăng lương định kỳ 6 tháng/lần' },
                                { title: 'BHXH đầy đủ', desc: 'Bảo hiểm xã hội, y tế, thất nghiệp theo quy định nhà nước' },
                                { title: 'Đào tạo chuyên môn', desc: 'Được tài trợ học các khóa đào tạo chuyên sâu trong nước' },
                                { title: 'Môi trường năng động', desc: 'Làm việc cùng đội ngũ trẻ trung, chuyên nghiệp và tận tâm' },
                            ].map((benefit, i) => (
                                <div key={i} className="text-center">
                                    <div className="w-12 h-12 bg-amber-400/20 border border-amber-400/30 rounded-xl mx-auto flex items-center justify-center mb-3">
                                        <CheckCircle className="w-6 h-6 text-amber-400" />
                                    </div>
                                    <h4 className="font-semibold text-white mb-1 text-sm">{benefit.title}</h4>
                                    <p className="text-white/50 text-xs leading-relaxed">{benefit.desc}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 text-center">
                            <p className="text-white/50 text-sm mb-4">Gửi CV và thư xin việc của bạn tới:</p>
                            <a href={`mailto:${RECRUITMENT_EMAIL}`} className="inline-flex items-center gap-2 bg-amber-400 text-amber-900 font-bold px-8 py-3 rounded-xl hover:bg-amber-300 transition-colors">
                                {RECRUITMENT_EMAIL}
                                <ChevronRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
}
