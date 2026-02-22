import { useState } from 'react';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, DollarSign, Activity, Users, Package, ArrowUpRight } from 'lucide-react';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import { monthlyStats, topMedicines } from '../../data/mockData';

// Formatter tiền tệ Việt Nam
const formatCurrency = (value) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);

const formatMillions = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
    return value.toLocaleString('vi-VN');
};

// Custom tooltip cho chart
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 text-white rounded-xl p-3 shadow-xl border border-white/10 text-sm">
                <p className="font-semibold mb-2">{label}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color }} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
                        {p.name}: {formatCurrency(p.value)}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// Trend icon
const TrendIcon = ({ trend }) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
};

export default function StatisticsDashboard() {
    const [activeChart, setActiveChart] = useState('area'); // 'area' | 'bar'

    // Lấy tháng hiện tại (chỉ số cuối trong mảng)
    const currentMonth = monthlyStats[monthlyStats.length - 1];
    const prevMonth = monthlyStats[monthlyStats.length - 2];
    const revenueGrowth = (((currentMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100).toFixed(1);
    const profitGrowth = (((currentMonth.profit - prevMonth.profit) / prevMonth.profit) * 100).toFixed(1);
    const patientGrowth = (((currentMonth.patients - prevMonth.patients) / prevMonth.patients) * 100).toFixed(1);

    const totalRevenue6m = monthlyStats.reduce((s, m) => s + m.revenue, 0);
    const maxMedicineQty = topMedicines[0].quantity;

    // KPI cards data
    const kpis = [
        {
            label: 'Doanh thu tháng 2',
            value: formatCurrency(currentMonth.revenue),
            growth: `+${revenueGrowth}%`,
            positive: true,
            icon: DollarSign,
            gradient: 'from-violet-500 to-purple-700',
            sub: `6 tháng: ${formatCurrency(totalRevenue6m)}`,
        },
        {
            label: 'Lợi nhuận tháng 2',
            value: formatCurrency(currentMonth.profit),
            growth: `+${profitGrowth}%`,
            positive: true,
            icon: TrendingUp,
            gradient: 'from-emerald-500 to-teal-700',
            sub: `Biên lợi nhuận: ${((currentMonth.profit / currentMonth.revenue) * 100).toFixed(0)}%`,
        },
        {
            label: 'Lượt khám tháng 2',
            value: `${currentMonth.patients}`,
            growth: `+${patientGrowth}%`,
            positive: true,
            icon: Users,
            gradient: 'from-sky-500 to-blue-700',
            sub: `So với tháng trước: ${prevMonth.patients} lượt`,
        },
        {
            label: 'Doanh thu / lượt khám',
            value: formatCurrency(Math.round(currentMonth.revenue / currentMonth.patients)),
            growth: 'Tháng 2',
            positive: true,
            icon: Activity,
            gradient: 'from-amber-500 to-orange-700',
            sub: 'Trung bình mỗi bệnh nhân',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="glass p-6 rounded-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-1">
                            Bảng thống kê
                        </h1>
                        <p className="text-slate-500 text-sm">Dữ liệu doanh thu, lợi nhuận và sản phẩm — cập nhật tháng 2/2026</p>
                    </div>
                    <div className="flex gap-2 mt-3 sm:mt-0">
                        <button
                            onClick={() => setActiveChart('area')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeChart === 'area' ? 'bg-primary-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            Vùng
                        </button>
                        <button
                            onClick={() => setActiveChart('bar')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeChart === 'bar' ? 'bg-primary-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            Cột
                        </button>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {kpis.map((kpi, idx) => {
                    const Icon = kpi.icon;
                    return (
                        <div
                            key={idx}
                            className={`bg-gradient-to-br ${kpi.gradient} text-white rounded-2xl p-5 shadow-lg hover:scale-[1.02] transition-transform`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${kpi.positive ? 'bg-white/20 text-white' : 'bg-red-400/30 text-red-100'}`}>
                                    <ArrowUpRight className="w-3 h-3" />
                                    {kpi.growth}
                                </span>
                            </div>
                            <p className="text-white/70 text-xs mb-1">{kpi.label}</p>
                            <p className="text-2xl font-bold font-display leading-tight">{kpi.value}</p>
                            <p className="text-white/50 text-xs mt-2">{kpi.sub}</p>
                        </div>
                    );
                })}
            </div>

            {/* Chart: Revenue & Profit */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">Doanh thu & Lợi nhuận</h2>
                            <p className="text-sm text-slate-500 mt-0.5">6 tháng gần nhất (triệu VNĐ)</p>
                        </div>
                        <span className="badge badge-primary">6 tháng</span>
                    </div>
                </CardHeader>
                <CardBody>
                    <div style={{ height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            {activeChart === 'area' ? (
                                <AreaChart data={monthlyStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.02} />
                                        </linearGradient>
                                        <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis tickFormatter={formatMillions} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={55} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                                    <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#7c3aed" strokeWidth={2.5} fill="url(#gradRevenue)" dot={{ r: 4, fill: '#7c3aed' }} activeDot={{ r: 6 }} />
                                    <Area type="monotone" dataKey="profit" name="Lợi nhuận" stroke="#10b981" strokeWidth={2.5} fill="url(#gradProfit)" dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                                </AreaChart>
                            ) : (
                                <BarChart data={monthlyStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis tickFormatter={formatMillions} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={55} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                                    <Bar dataKey="revenue" name="Doanh thu" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                                    <Bar dataKey="profit" name="Lợi nhuận" fill="#10b981" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </CardBody>
            </Card>

            {/* Bottom Row: Patients Chart + Top Medicines */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Patients bar chart - 2/5 */}
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <h2 className="text-lg font-semibold text-slate-900">Lượt khám theo tháng</h2>
                            <p className="text-xs text-slate-500 mt-0.5">Số bệnh nhân</p>
                        </CardHeader>
                        <CardBody>
                            <div style={{ height: 260 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyStats} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="gradPatients" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                                                <stop offset="100%" stopColor="#93c5fd" stopOpacity={0.8} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            formatter={(v) => [`${v} bệnh nhân`, 'Lượt khám']}
                                            contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 12, color: '#fff', fontSize: 12 }}
                                            labelStyle={{ fontWeight: 600 }}
                                        />
                                        <Bar dataKey="patients" name="Lượt khám" fill="url(#gradPatients)" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Top Medicines - 3/5 */}
                <div className="lg:col-span-3">
                    <Card className="h-full">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">Top thuốc bán nhiều</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">Tháng 2/2026</p>
                                </div>
                                <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
                                    <Package className="w-5 h-5 text-amber-600" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-4">
                                {topMedicines.map((med) => {
                                    const pct = Math.round((med.quantity / maxMedicineQty) * 100);
                                    const colors = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
                                    return (
                                        <div key={med.rank} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                                        style={{ background: colors[med.rank - 1] }}
                                                    >
                                                        {med.rank}
                                                    </span>
                                                    <span className="font-medium text-slate-800">{med.name}</span>
                                                    <TrendIcon trend={med.trend} />
                                                </div>
                                                <div className="text-right flex-shrink-0 ml-4">
                                                    <span className="font-semibold text-slate-900">{med.quantity.toLocaleString('vi-VN')} {med.unit}</span>
                                                    <span className="text-slate-400 text-xs ml-2">{formatCurrency(med.revenue)}</span>
                                                </div>
                                            </div>
                                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-700"
                                                    style={{ width: `${pct}%`, background: colors[med.rank - 1] }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* Summary Footer */}
            <div className="glass p-5 rounded-2xl flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 items-start sm:items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Activity className="w-4 h-4 text-primary-500" />
                    <span>Dữ liệu cập nhật lúc 22:00 ngày 21/02/2026</span>
                </div>
                <div className="flex gap-6 text-sm">
                    <div className="text-center">
                        <p className="font-bold text-slate-900 text-lg">{formatCurrency(totalRevenue6m)}</p>
                        <p className="text-slate-500 text-xs">Tổng doanh thu 6 tháng</p>
                    </div>
                    <div className="w-px bg-slate-200" />
                    <div className="text-center">
                        <p className="font-bold text-slate-900 text-lg">{formatCurrency(monthlyStats.reduce((s, m) => s + m.profit, 0))}</p>
                        <p className="text-slate-500 text-xs">Tổng lợi nhuận 6 tháng</p>
                    </div>
                    <div className="w-px bg-slate-200" />
                    <div className="text-center">
                        <p className="font-bold text-slate-900 text-lg">{monthlyStats.reduce((s, m) => s + m.patients, 0)}</p>
                        <p className="text-slate-500 text-xs">Tổng lượt khám 6 tháng</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
