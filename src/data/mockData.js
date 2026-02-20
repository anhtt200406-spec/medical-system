// Mock users
export const users = {
    patients: [
        {
            id: 'P001',
            name: 'Sinh viên NEU',
            email: 'patient@neu.edu.vn',
            password: '123456',
            birthDate: '2004-01-01',
            phone: '0987654321',
            gender: 'Nam',
            address: 'Ký túc xá NEU, Hà Nội',
            cccd: '001206000567',
            bhyt: 'SV12345678',
            bhytActive: true,
            allergies: ['Amoxicillin', 'Aspirin'],
            contraindications: ['Ibuprofen'], // Chống chỉ định
            role: 'patient',
        },
    ],
    staff: [
        {
            id: 'D001',
            name: 'BS. Nguyễn Văn A',
            email: 'doctor@neu.edu.vn',
            password: '123456',
            specialty: 'Khám Tổng quát',
            role: 'staff',
        },
        {
            id: 'D002',
            name: 'BS. Lê Văn C',
            email: 'doctor2@neu.edu.vn',
            password: '123456',
            specialty: 'Khám Nội khoa',
            role: 'staff',
        },
    ],
};

// Mock specialties
export const specialties = [
    { id: 'S001', name: 'Khám Tổng quát', price: 200000 },
    { id: 'S002', name: 'Khám Nội khoa', price: 200000 },
    { id: 'S003', name: 'Khám Ngoại khoa', price: 200000 },
    { id: 'S004', name: 'Khám Tai Mũi Họng', price: 150000 },
    { id: 'S005', name: 'Khám Mắt', price: 150000 },
];

// Mock medicines database
export const medicinesDB = [
    { id: 'M001', name: 'Paracetamol 500mg', price: 5000, unit: 'Viên' },
    { id: 'M002', name: 'Ibuprofen 400mg', price: 8000, unit: 'Viên' },
    { id: 'M003', name: 'Amoxicillin 500mg', price: 12000, unit: 'Viên' },
    { id: 'M004', name: 'Vitamin C 500mg', price: 3000, unit: 'Viên' },
    { id: 'M005', name: 'Aspirin 100mg', price: 6000, unit: 'Viên' },
    { id: 'M006', name: 'Cetirizine 10mg', price: 7000, unit: 'Viên' },
    { id: 'M007', name: 'Omeprazole 20mg', price: 15000, unit: 'Viên' },
    { id: 'M008', name: 'Metformin 500mg', price: 10000, unit: 'Viên' },
];

// Mock appointments
export const appointments = [
    {
        id: 'A001',
        patientId: 'P001',
        patientName: 'Sinh viên NEU',
        doctorId: 'D001',
        doctorName: 'BS. Nguyễn Văn A',
        specialty: 'Khám Tổng quát',
        date: '2026-02-14',
        time: '09:00',
        status: 'completed',
        diagnosis: 'Viêm họng cấp',
        prescription: [
            { medicine: 'Paracetamol 500mg', quantity: 10, dosage: 'Uống 2 viên/lần, 3 lần/ngày sau ăn' },
            { medicine: 'Vitamin C 500mg', quantity: 20, dosage: 'Uống 1 viên/ngày' },
        ],
        advice: 'Kiêng nước đá, đồ lạnh. Uống nhiều nước',
        contraindications: 'Không dùng thuốc nhóm Aspirin',
        totalPrice: 250000,
        insuranceCovered: 200000,
        patientPaid: 50000,
    },
];

// Mock pending appointments
export const pendingAppointments = [
    {
        id: 'A002',
        patientId: 'P001',
        patientName: 'Sinh viên NEU',
        doctorId: 'D002',
        doctorName: 'BS. Lê Văn C',
        specialty: 'Khám Nội khoa',
        date: '2026-02-16',
        time: '14:00',
        status: 'pending',
    },
];

// Mock appointments awaiting payment
export const awaitingPaymentAppointments = [
    {
        id: 'A003',
        patientId: 'P001',
        patientName: 'Sinh viên NEU',
        bhyt: 'SV12345678',
        doctorId: 'D001',
        doctorName: 'BS. Nguyễn Văn A',
        specialty: 'Khám Tổng quát',
        date: '2026-02-16',
        time: '10:00',
        status: 'awaiting_payment',
        diagnosis: 'Cảm cúm',
        prescription: [
            { medicine: 'Paracetamol 500mg', quantity: 10, dosage: 'Uống 2 viên/lần, 3 lần/ngày sau ăn' },
            { medicine: 'Vitamin C 500mg', quantity: 15, dosage: 'Uống 1 viên/ngày' },
        ],
        specialtyPrice: 200000,
        medicineTotal: 95000,
        totalCost: 295000,
        insuranceCovered: 236000,
        patientPays: 59000,
        paymentStatus: 'pending',
    },
    {
        id: 'A004',
        patientId: 'P001',
        patientName: 'Sinh viên NEU',
        bhyt: 'SV12345678',
        doctorId: 'D002',
        doctorName: 'BS. Lê Văn C',
        specialty: 'Khám Nội khoa',
        date: '2026-02-16',
        time: '11:30',
        status: 'awaiting_payment',
        diagnosis: 'Đau dạ dày',
        prescription: [
            { medicine: 'Omeprazole 20mg', quantity: 20, dosage: 'Uống 1 viên/lần, 2 lần/ngày trước ăn' },
        ],
        specialtyPrice: 200000,
        medicineTotal: 300000,
        totalCost: 500000,
        insuranceCovered: 400000,
        patientPays: 100000,
        paymentStatus: 'pending',
    },
];

// Insurance coverage percentage
export const INSURANCE_COVERAGE = 0.80; // 80% coverage
