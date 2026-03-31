import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Activity, Calendar, Heart, Shield, Users, Award, Microscope,
    Stethoscope, BookOpen, Briefcase, MapPin, Clock, ChevronRight,
    CheckCircle, X, LogIn, Eye, EyeOff
} from 'lucide-react';

const BG_IMG_1 = 'https://cdn.baohatinh.vn/images/5d67f8d3ba210b5701fd4a54adb936f20fe9278a2cadaf67c93571cdd2740b1ce27d0da5668851345b8ea8f6be306c68/133d0211033t73280l0.jpg';
const BG_IMG_2 = 'https://ant-arc.com/wp-content/uploads/2023/04/3-2.jpg';
const RECRUITMENT_EMAIL = 'anhtt200406@gmail.com';

/* ─────────────── Floating particles canvas ─────────────── */
function ParticleCanvas() {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const particles = Array.from({ length: 60 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 0.5,
            dx: (Math.random() - 0.5) * 0.4,
            dy: (Math.random() - 0.5) * 0.4,
            alpha: Math.random() * 0.5 + 0.1,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(56,189,248,${p.alpha})`;
                ctx.fill();
            });
            // Draw connecting lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(56,189,248,${0.08 * (1 - dist / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            animId = requestAnimationFrame(draw);
        };
        draw();
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);
    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

/* ─────────────── Animated counter ─────────────── */
function CountUp({ target, suffix = '' }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            observer.disconnect();
            const num = parseInt(target.replace(/\D/g, ''), 10);
            let start = 0;
            const step = Math.ceil(num / 60);
            const timer = setInterval(() => {
                start += step;
                if (start >= num) { setCount(num); clearInterval(timer); }
                else setCount(start);
            }, 20);
        }, { threshold: 0.3 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target]);
    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─────────────── Login Modal ─────────────── */
function LoginModal({ onClose }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        await new Promise(r => setTimeout(r, 600));
        const result = login(email, password);
        setLoading(false);
        if (result.success) {
            if (result.user.role === 'patient') navigate('/patient/dashboard');
            else if (result.user.role === 'staff') navigate('/staff/dashboard');
        } else {
            setError(result.error);
        }
    };

    // Close on backdrop click
    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ backdropFilter: 'blur(12px)', background: 'rgba(2,8,23,0.75)' }}
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md animate-modal"
                onClick={e => e.stopPropagation()}
                style={{
                    background: 'linear-gradient(135deg, rgba(15,23,42,0.97) 0%, rgba(8,47,73,0.97) 100%)',
                    border: '1px solid rgba(56,189,248,0.25)',
                    borderRadius: '20px',
                    boxShadow: '0 0 60px rgba(56,189,248,0.15), 0 25px 50px rgba(0,0,0,0.6)',
                    padding: '2.5rem',
                }}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Logo */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg,#0ea5e9,#14b8a6)' }}>
                        <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-lg leading-none">NEU Medical</p>
                        <p className="text-sky-400/70 text-xs">Hệ thống Y tế</p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-1">Chào mừng trở lại</h2>
                <p className="text-white/40 text-sm mb-6">Đăng nhập để tiếp tục</p>

                {error && (
                    <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-300 flex items-center gap-2"
                        style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
                        <span className="w-4 h-4 text-red-400">⚠</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Email</label>
                        <input
                            type="email"
                            placeholder="example@neu.edu.vn"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl text-white placeholder-white/25 outline-none transition-all focus:ring-2 focus:ring-sky-500/50"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Mật khẩu</label>
                        <div className="relative">
                            <input
                                type={showPass ? 'text' : 'password'}
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 pr-12 rounded-xl text-white placeholder-white/25 outline-none transition-all focus:ring-2 focus:ring-sky-500/50"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(v => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                            >
                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                        style={{ background: 'linear-gradient(135deg,#0ea5e9,#14b8a6)', boxShadow: '0 4px 20px rgba(14,165,233,0.35)' }}
                    >
                        {loading ? (
                            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                        ) : <LogIn className="w-4 h-4" />}
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>

                {/* Demo hint */}
                <div className="mt-6 p-3 rounded-xl space-y-1"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-white/40 text-xs font-semibold mb-2">Tài khoản demo:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <span className="text-sky-400 block font-medium">Bệnh nhân</span>
                            <code className="text-white/50">patient@neu.edu.vn</code>
                        </div>
                        <div>
                            <span className="text-teal-400 block font-medium">Nhân viên</span>
                            <code className="text-white/50">doctor@neu.edu.vn</code>
                        </div>
                    </div>
                    <p className="text-white/30 text-xs mt-1">Mật khẩu: <code className="text-white/50">123456</code></p>
                </div>
            </div>
        </div>
    );
}

/* ─────────────── Main Page ─────────────── */
export default function LoginPage() {
    const [loginOpen, setLoginOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [visibleSection, setVisibleSection] = useState('');

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Intersection observer for section reveal
    useEffect(() => {
        const sections = document.querySelectorAll('[data-reveal]');
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) e.target.classList.add('revealed');
            });
        }, { threshold: 0.08 });
        sections.forEach(s => obs.observe(s));
        return () => obs.disconnect();
    }, []);

    return (
        <div className="min-h-screen flex flex-col" style={{ background: '#080f1e', color: '#e2e8f0' }}>
            <style>{`
                @keyframes modal-in {
                    from { opacity:0; transform:scale(0.92) translateY(20px); }
                    to   { opacity:1; transform:scale(1) translateY(0); }
                }
                .animate-modal { animation: modal-in 0.35s cubic-bezier(.22,1,.36,1) both; }

                @keyframes float-up {
                    from { opacity:0; transform:translateY(40px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                .hero-text-1 { animation: float-up 0.8s 0.1s cubic-bezier(.22,1,.36,1) both; }
                .hero-text-2 { animation: float-up 0.8s 0.25s cubic-bezier(.22,1,.36,1) both; }
                .hero-text-3 { animation: float-up 0.8s 0.4s cubic-bezier(.22,1,.36,1) both; }
                .hero-text-4 { animation: float-up 0.8s 0.55s cubic-bezier(.22,1,.36,1) both; }
                .hero-text-5 { animation: float-up 0.8s 0.7s cubic-bezier(.22,1,.36,1) both; }

                @keyframes pulse-ring {
                    0%   { box-shadow: 0 0 0 0 rgba(14,165,233,0.4); }
                    70%  { box-shadow: 0 0 0 12px rgba(14,165,233,0); }
                    100% { box-shadow: 0 0 0 0 rgba(14,165,233,0); }
                }
                .pulse-ring { animation: pulse-ring 2s infinite; }

                @keyframes shimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                .shimmer-text {
                    background: linear-gradient(90deg, #38bdf8, #14b8a6, #818cf8, #38bdf8);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shimmer 4s linear infinite;
                }

                [data-reveal] {
                    opacity: 0;
                    transform: translateY(32px);
                    transition: opacity 0.7s ease, transform 0.7s ease;
                }
                [data-reveal].revealed {
                    opacity: 1;
                    transform: translateY(0);
                }
                [data-reveal-delay="1"] { transition-delay: 0.1s; }
                [data-reveal-delay="2"] { transition-delay: 0.2s; }
                [data-reveal-delay="3"] { transition-delay: 0.3s; }
                [data-reveal-delay="4"] { transition-delay: 0.4s; }

                .glass-dark-card {
                    background: rgba(15,23,42,0.8);
                    border: 1px solid rgba(56,189,248,0.12);
                    backdrop-filter: blur(16px);
                }
                .glow-btn {
                    background: linear-gradient(135deg,#0ea5e9,#14b8a6);
                    box-shadow: 0 0 20px rgba(14,165,233,0.35);
                    transition: all 0.3s ease;
                }
                .glow-btn:hover {
                    box-shadow: 0 0 30px rgba(14,165,233,0.55);
                    transform: translateY(-1px);
                }
                .nav-link {
                    color: rgba(226,232,240,0.6);
                    transition: color 0.2s, text-shadow 0.2s;
                    font-size: 0.875rem;
                    font-weight: 500;
                }
                .nav-link:hover {
                    color: #38bdf8;
                    text-shadow: 0 0 12px rgba(56,189,248,0.6);
                }
                .feature-card {
                    background: rgba(15,23,42,0.6);
                    border: 1px solid rgba(255,255,255,0.06);
                    transition: all 0.3s ease;
                }
                .feature-card:hover {
                    background: rgba(15,23,42,0.9);
                    border-color: rgba(56,189,248,0.25);
                    transform: translateY(-3px);
                    box-shadow: 0 12px 30px rgba(0,0,0,0.4), 0 0 20px rgba(56,189,248,0.08);
                }
                .stat-card {
                    transition: all 0.3s ease;
                }
                .stat-card:hover {
                    transform: translateY(-4px) scale(1.02);
                    filter: brightness(1.1);
                }
                .specialty-row {
                    background: rgba(15,23,42,0.5);
                    border: 1px solid rgba(255,255,255,0.05);
                    transition: all 0.2s ease;
                }
                .specialty-row:hover {
                    background: rgba(14,165,233,0.08);
                    border-color: rgba(14,165,233,0.2);
                    padding-left: 1.25rem;
                }
                .job-card {
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    transition: all 0.3s ease;
                }
                .job-card:hover {
                    background: rgba(255,255,255,0.07);
                    border-color: rgba(251,191,36,0.3);
                    transform: translateY(-3px);
                }
                .scrollbar-thin::-webkit-scrollbar { width: 4px; }
                .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
                .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(56,189,248,0.3); border-radius: 4px; }
            `}</style>

            <ParticleCanvas />

            {/* ─── NAVBAR ─── */}
            <header
                className="sticky top-0 z-50 transition-all duration-300"
                style={{
                    background: scrolled ? 'rgba(8,15,30,0.92)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(20px)' : 'none',
                    borderBottom: scrolled ? '1px solid rgba(56,189,248,0.1)' : '1px solid transparent',
                }}
            >
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center pulse-ring"
                            style={{ background: 'linear-gradient(135deg,#0ea5e9,#14b8a6)' }}>
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-white">Hệ thống Y tế</h1>
                            <p className="text-xs" style={{ color: '#38bdf8', opacity: 0.7 }}>NEU MEDICAL</p>
                        </div>
                    </div>

                    <nav className="hidden sm:flex items-center gap-6">
                        <a href="#about" className="nav-link">Giới thiệu</a>
                        <a href="#recruitment" className="nav-link">Tuyển dụng</a>
                        <button
                            onClick={() => setLoginOpen(true)}
                            className="glow-btn flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm"
                        >
                            <LogIn className="w-4 h-4" />
                            Đăng nhập
                        </button>
                    </nav>

                    {/* Mobile login button */}
                    <button
                        onClick={() => setLoginOpen(true)}
                        className="sm:hidden glow-btn flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-semibold text-sm"
                    >
                        <LogIn className="w-4 h-4" />
                        Đăng nhập
                    </button>
                </div>
            </header>

            {/* ─── HERO ─── */}
            <section className="relative flex-none overflow-hidden"
                style={{ minHeight: 'calc(100vh - 68px)' }}>
                {/* Gradient blobs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div style={{
                        position: 'absolute', width: '600px', height: '600px',
                        background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)',
                        top: '-100px', left: '-100px', borderRadius: '50%'
                    }} />
                    <div style={{
                        position: 'absolute', width: '500px', height: '500px',
                        background: 'radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)',
                        bottom: '-80px', right: '10%', borderRadius: '50%'
                    }} />
                    <div style={{
                        position: 'absolute', width: '400px', height: '400px',
                        background: 'radial-gradient(circle, rgba(129,140,248,0.08) 0%, transparent 70%)',
                        top: '40%', left: '40%', borderRadius: '50%'
                    }} />
                </div>

                <div className="relative z-10 container mx-auto px-6 py-16 flex flex-col items-center justify-center text-center"
                    style={{ minHeight: 'calc(100vh - 68px)' }}>

                    <div className="hero-text-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
                        style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.25)' }}>
                        <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                        <span className="text-xs font-semibold text-sky-400 uppercase tracking-widest">Hệ thống y tế số NEU</span>
                    </div>

                    <h2 className="hero-text-2 text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4">
                        Chăm sóc sức khỏe<br />
                        <span className="shimmer-text">Thông minh & Toàn diện</span>
                    </h2>

                    <p className="hero-text-3 text-lg text-white/50 max-w-xl mb-10">
                        Hệ thống quản lý y tế hiện đại dành cho sinh viên và cán bộ NEU — đặt lịch, theo dõi sức khỏe, tra cứu kết quả mọi lúc mọi nơi.
                    </p>

                    <div className="hero-text-4 flex flex-wrap gap-4 justify-center mb-16">
                        <button
                            onClick={() => setLoginOpen(true)}
                            className="glow-btn flex items-center gap-2.5 px-8 py-4 rounded-2xl text-white font-bold text-base"
                        >
                            <LogIn className="w-5 h-5" />
                            Đăng nhập hệ thống
                        </button>
                        <a href="#about"
                            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all hover:scale-[1.02]"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(226,232,240,0.8)' }}>
                            Tìm hiểu thêm <ChevronRight className="w-5 h-5" />
                        </a>
                    </div>

                    {/* Quick feature pills */}
                    <div className="hero-text-5 flex flex-wrap gap-3 justify-center">
                        {[
                            { icon: Calendar, label: 'Đặt lịch khám online', color: '#0ea5e9' },
                            { icon: Heart, label: 'Theo dõi sức khỏe', color: '#f43f5e' },
                            { icon: Shield, label: 'Bảo hiểm y tế BHYT', color: '#14b8a6' },
                            { icon: Activity, label: 'Cảnh báo dị ứng', color: '#f59e0b' },
                        ].map(({ icon: Icon, label, color }, i) => (
                            <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <Icon className="w-4 h-4" style={{ color }} />
                                <span className="text-sm text-white/60">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
                    <div className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
                        style={{ border: '1.5px solid rgba(255,255,255,0.3)' }}>
                        <div className="w-1 h-2 rounded-full bg-white/60" style={{
                            animation: 'float-up 1.5s ease-in-out infinite alternate'
                        }} />
                    </div>
                    <span className="text-xs text-white/40">Cuộn xuống</span>
                </div>
            </section>

            {/* ─── ABOUT SECTION ─── */}
            <section id="about" className="py-24 relative overflow-hidden"
                style={{ background: 'linear-gradient(180deg, #080f1e 0%, #0f172a 100%)' }}>
                <div className="container mx-auto px-6">

                    {/* Header */}
                    <div className="text-center mb-16" data-reveal>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
                            style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)' }}>
                            <span className="text-xs font-semibold text-sky-400 uppercase tracking-widest">Về chúng tôi</span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-white mb-4">
                            Hệ thống Y tế{' '}
                            <span className="shimmer-text">NEU Medical</span>
                        </h2>
                        <p className="text-white/50 max-w-2xl mx-auto">
                            Phòng Y tế Trường Đại học Kinh tế Quốc dân cung cấp dịch vụ chăm sóc sức khỏe toàn diện cho hơn 30.000 sinh viên và cán bộ nhân viên.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
                        {[
                            { label: 'Năm hoạt động', value: '25+', rawNum: '25', icon: Award, grad: 'from-violet-600 to-purple-800' },
                            { label: 'Sinh viên phục vụ', value: '30.000+', rawNum: '30000', icon: Users, grad: 'from-sky-500 to-blue-700' },
                            { label: 'Bác sĩ chuyên khoa', value: '12', rawNum: '12', icon: Stethoscope, grad: 'from-emerald-500 to-teal-700' },
                            { label: 'Lượt khám / năm', value: '15.000+', rawNum: '15000', icon: Microscope, grad: 'from-amber-500 to-orange-700' },
                        ].map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <div key={i} data-reveal data-reveal-delay={i + 1}
                                    className={`stat-card bg-gradient-to-br ${s.grad} rounded-2xl p-6 text-center`}>
                                    <div className="w-12 h-12 bg-white/15 rounded-xl mx-auto flex items-center justify-center mb-3">
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-3xl font-extrabold text-white">
                                        <CountUp target={s.value} />
                                        {s.value.includes('+') ? '+' : ''}
                                    </p>
                                    <p className="text-white/60 text-sm mt-1">{s.label}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Two-col */}
                    <div className="grid lg:grid-cols-2 gap-14 items-start">
                        {/* Left: Mission */}
                        <div data-reveal className="space-y-6">
                            <h3 className="text-2xl font-bold text-white">Sứ mệnh & Giá trị cốt lõi</h3>
                            <p className="text-white/50 leading-relaxed">
                                Phòng Y tế NEU được thành lập với sứ mệnh bảo vệ và nâng cao sức khỏe cho toàn thể cộng đồng NEU. Chúng tôi không ngừng đổi mới và ứng dụng công nghệ hiện đại để mang lại dịch vụ y tế tốt nhất.
                            </p>
                            <div className="space-y-3">
                                {[
                                    { icon: Heart, title: 'Chăm sóc tận tâm', desc: 'Đội ngũ y bác sĩ giàu kinh nghiệm, luôn đặt sức khỏe bệnh nhân lên hàng đầu', color: '#f43f5e' },
                                    { icon: Shield, title: 'An toàn & Bảo mật', desc: 'Hệ thống quản lý hồ sơ bảo mật, tích hợp đầy đủ bảo hiểm y tế BHYT', color: '#0ea5e9' },
                                    { icon: BookOpen, title: 'Đào tạo y tế', desc: 'Tổ chức thường xuyên các buổi tư vấn sức khỏe, phòng bệnh cho sinh viên', color: '#a78bfa' },
                                    { icon: Microscope, title: 'Trang thiết bị hiện đại', desc: 'Được trang bị máy móc y tế tiên tiến, đảm bảo chẩn đoán chính xác', color: '#14b8a6' },
                                ].map((item, i) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={i} className="feature-card flex items-start gap-4 p-4 rounded-xl">
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                                style={{ background: `${item.color}18` }}>
                                                <Icon className="w-5 h-5" style={{ color: item.color }} />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white mb-0.5">{item.title}</h4>
                                                <p className="text-sm text-white/45">{item.desc}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right: Image + Specialties */}
                        <div data-reveal data-reveal-delay="2" className="space-y-6">
                            <div className="relative rounded-2xl overflow-hidden h-64 group">
                                <img
                                    src="https://media.istockphoto.com/id/856544984/vi/anh/nh%C3%B3m-b%C3%A1c-s%C4%A9-v%E1%BB%99i-v%C3%A3-xu%E1%BB%91ng-h%C3%A0nh-lang-b%E1%BB%87nh-vi%E1%BB%87n.jpg?s=612x612&w=0&k=20&c=OHHvKC2Oq75VKkfRLrF2yeG_FG97gDV6fPBKH8jCZIU="
                                    alt="Đội ngũ bác sĩ NEU Medical"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0"
                                    style={{ background: 'linear-gradient(to top, rgba(8,15,30,0.85) 0%, rgba(8,15,30,0.2) 50%, transparent 100%)' }} />
                                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                                    <div>
                                        <p className="text-white font-bold text-lg">Đội ngũ chuyên gia</p>
                                        <p className="text-white/60 text-sm">Tận tâm vì sức khỏe cộng đồng NEU</p>
                                    </div>
                                    <div className="rounded-xl px-3 py-1.5 text-center"
                                        style={{ background: 'rgba(14,165,233,0.2)', border: '1px solid rgba(14,165,233,0.3)', backdropFilter: 'blur(8px)' }}>
                                        <p className="text-white font-bold text-lg leading-none">12</p>
                                        <p className="text-sky-300/80 text-xs">Bác sĩ</p>
                                    </div>
                                </div>
                            </div>

                            {/* Specialties */}
                            <h3 className="text-xl font-bold text-white">Các chuyên khoa</h3>
                            <div className="grid gap-2">
                                {[
                                    { name: 'Khám Tổng quát', desc: 'Thứ 2 – Thứ 6, 7:30–17:00', col: '#10b981' },
                                    { name: 'Khám Nội khoa', desc: 'Thứ 2 – Thứ 6, 7:30–17:00', col: '#38bdf8' },
                                    { name: 'Khám Ngoại khoa', desc: 'Thứ 3, Thứ 5', col: '#a78bfa' },
                                    { name: 'Khám Tai Mũi Họng', desc: 'Thứ 2, Thứ 4, Thứ 6', col: '#fbbf24' },
                                    { name: 'Khám Mắt', desc: 'Thứ 3, Thứ 5', col: '#f43f5e' },
                                    { name: 'Tiêm chủng', desc: 'Thứ 2 – Thứ 6, 7:30–11:00', col: '#14b8a6' },
                                ].map((sp, i) => (
                                    <div key={i} className="specialty-row flex items-center justify-between p-3.5 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                                style={{ background: sp.col, boxShadow: `0 0 6px ${sp.col}` }} />
                                            <div>
                                                <p className="font-semibold text-white/90 text-sm">{sp.name}</p>
                                                <p className="text-xs text-white/40 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />{sp.desc}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-white/25" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── RECRUITMENT SECTION ─── */}
            <section id="recruitment" className="py-24 relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 grid grid-cols-1 sm:grid-cols-2">
                        <div className="bg-cover bg-center" style={{ backgroundImage: `url('${BG_IMG_1}')` }} />
                        <div className="bg-cover bg-center" style={{ backgroundImage: `url('${BG_IMG_2}')` }} />
                    </div>
                    <div className="absolute inset-0"
                        style={{ background: 'linear-gradient(135deg, rgba(8,15,30,0.95) 0%, rgba(5,25,50,0.92) 50%, rgba(8,15,30,0.95) 100%)' }} />
                </div>

                <div className="relative z-10 container mx-auto px-6">
                    <div className="text-center mb-14" data-reveal>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
                            style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)' }}>
                            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Cơ hội việc làm</span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-white mb-4">
                            Cùng chúng tôi xây dựng<br />
                            <span className="text-transparent bg-clip-text"
                                style={{ backgroundImage: 'linear-gradient(90deg,#fbbf24,#f97316)' }}>
                                Tương lai y tế NEU
                            </span>
                        </h2>
                        <p className="text-white/50 max-w-2xl mx-auto">
                            Phòng Y tế NEU luôn tìm kiếm những tài năng nhiệt huyết, yêu nghề y để cùng phát triển.
                        </p>
                    </div>

                    {/* Jobs */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                        {[
                            { title: 'Bác sĩ Đa khoa', type: 'Toàn thời gian', location: 'Hà Nội', salary: '15–25 triệu/tháng', hot: true, tags: ['Khám tổng quát', 'Kê đơn thuốc', 'BHYT'], desc: 'Khám và điều trị cho sinh viên, cán bộ NEU. Tham gia các chương trình y tế học đường.' },
                            { title: 'Điều dưỡng viên', type: 'Toàn thời gian', location: 'Hà Nội', salary: '8–12 triệu/tháng', hot: true, tags: ['Chăm sóc BN', 'Tiêm chủng', 'Hồ sơ y tế'], desc: 'Hỗ trợ bác sĩ trong quá trình khám chữa bệnh, quản lý hồ sơ bệnh nhân điện tử.' },
                            { title: 'Dược sĩ', type: 'Toàn thời gian', location: 'Hà Nội', salary: '10–18 triệu/tháng', hot: false, tags: ['Quản lý kho thuốc', 'Tư vấn dược', 'BHYT'], desc: 'Quản lý kho thuốc, tư vấn và cấp phát thuốc theo đơn.' },
                            { title: 'Kỹ thuật viên XN', type: 'Bán thời gian', location: 'Hà Nội', salary: '7–11 triệu/tháng', hot: false, tags: ['Xét nghiệm máu', 'Nước tiểu', 'Báo cáo KQ'], desc: 'Thực hiện các xét nghiệm cơ bản hỗ trợ chẩn đoán, vận hành thiết bị phòng lab.' },
                            { title: 'Chuyên viên CNTT Y tế', type: 'Toàn thời gian', location: 'Hà Nội', salary: '12–20 triệu/tháng', hot: true, tags: ['Phần mềm y tế', 'Database', 'Bảo mật'], desc: 'Phát triển và duy trì hệ thống quản lý y tế, hỗ trợ chuyển đổi số phòng y tế NEU.' },
                            { title: 'Cộng tác viên Y tế', type: 'Thực tập', location: 'Hà Nội', salary: 'Thỏa thuận', hot: false, tags: ['Sinh viên Y', 'Thực tập', 'Học nghề'], desc: 'Cơ hội thực tập lý tưởng cho sinh viên các trường Y Dược.' },
                        ].map((job, i) => (
                            <div key={i} data-reveal data-reveal-delay={((i % 3) + 1).toString()} className="job-card rounded-2xl p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-white">{job.title}</h3>
                                            {job.hot && (
                                                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                                                    style={{ background: '#fbbf2430', color: '#fbbf24', border: '1px solid #fbbf2440' }}>HOT</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-white/40">
                                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.type}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-white/50 text-sm leading-relaxed mb-4">{job.desc}</p>
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {job.tags.map((tag, j) => (
                                        <span key={j} className="text-xs px-2.5 py-1 rounded-full"
                                            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between pt-3"
                                    style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                    <span className="text-amber-400 font-semibold text-sm">{job.salary}</span>
                                    <button className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors">
                                        Ứng tuyển <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Benefits */}
                    <div data-reveal className="rounded-2xl p-8"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
                        <h3 className="text-2xl font-bold text-white text-center mb-8">Quyền lợi khi làm việc tại NEU Medical</h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: 'Lương cạnh tranh', desc: 'Thu nhập hấp dẫn, xét tăng lương định kỳ 6 tháng/lần' },
                                { title: 'BHXH đầy đủ', desc: 'Bảo hiểm xã hội, y tế, thất nghiệp theo quy định nhà nước' },
                                { title: 'Đào tạo chuyên môn', desc: 'Được tài trợ học các khóa đào tạo chuyên sâu' },
                                { title: 'Môi trường năng động', desc: 'Làm việc cùng đội ngũ trẻ trung, chuyên nghiệp' },
                            ].map((b, i) => (
                                <div key={i} className="text-center">
                                    <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center mb-3"
                                        style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.2)' }}>
                                        <CheckCircle className="w-6 h-6 text-amber-400" />
                                    </div>
                                    <h4 className="font-semibold text-white mb-1 text-sm">{b.title}</h4>
                                    <p className="text-white/40 text-xs leading-relaxed">{b.desc}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 text-center">
                            <p className="text-white/40 text-sm mb-4">Gửi CV và thư xin việc của bạn tới:</p>
                            <a href={`mailto:${RECRUITMENT_EMAIL}`}
                                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-amber-900 transition-all hover:scale-[1.02]"
                                style={{ background: 'linear-gradient(90deg,#fbbf24,#f97316)', boxShadow: '0 4px 20px rgba(251,191,36,0.3)' }}>
                                {RECRUITMENT_EMAIL}
                                <ChevronRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="py-8 text-center" style={{ background: '#060c18', borderTop: '1px solid rgba(56,189,248,0.08)' }}>
                <p className="text-white/25 text-sm">© 2025 NEU Medical — Hệ thống Y tế Trường Đại học Kinh tế Quốc dân</p>
            </footer>

            {/* ─── LOGIN MODAL ─── */}
            {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
        </div>
    );
}
