import React, { createContext, useContext, useState } from 'react';
import {
    appointments as initialAppointments,
    pendingAppointments as initialPendingAppointments,
    awaitingPaymentAppointments as initialPaymentQueue,
} from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    // Hàng đợi bệnh nhân chờ khám
    const [pendingQueue, setPendingQueue] = useState(initialPendingAppointments);
    // Hàng đợi chờ thanh toán
    const [paymentQueue, setPaymentQueue] = useState(initialPaymentQueue);
    // Lịch sử khám hoàn tất
    const [completedHistory, setCompletedHistory] = useState(initialAppointments);
    // Số BN đã khám hôm nay (cho stats)
    const [examinedToday, setExaminedToday] = useState(0);

    /**
     * Bệnh nhân đăng ký lịch hẹn mới
     * @param {object} appointmentData
     */
    const addAppointment = (appointmentData) => {
        const newAppointment = {
            id: `A${Date.now()}`,
            status: 'pending',
            ...appointmentData,
        };
        setPendingQueue(prev => [...prev, newAppointment]);
        return newAppointment;
    };

    /**
     * Bác sĩ hoàn tất khám - chuyển từ hàng chờ sang hàng chờ thanh toán
     * @param {string} appointmentId
     * @param {object} examData - { diagnosis, prescription, advice, contraindications, specialtyPrice, medicineTotal }
     */
    const completeExamination = (appointmentId, examData) => {
        const appointment = pendingQueue.find(a => a.id === appointmentId);
        if (!appointment) return;

        const { diagnosis, prescription, advice, contraindications, specialtyPrice, medicineTotal } = examData;
        const totalCost = specialtyPrice + medicineTotal;
        const insuranceCovered = totalCost * 0.8;
        const patientPays = totalCost - insuranceCovered;

        const completedAppointment = {
            ...appointment,
            status: 'awaiting_payment',
            diagnosis,
            prescription,
            advice,
            contraindications,
            specialtyPrice,
            medicineTotal,
            totalCost,
            insuranceCovered,
            patientPays,
            paymentStatus: 'pending',
            bhyt: 'SV12345678', // sẽ lấy từ patient data
        };

        // Xóa khỏi hàng đợi
        setPendingQueue(prev => prev.filter(a => a.id !== appointmentId));
        // Thêm vào hàng chờ thanh toán
        setPaymentQueue(prev => [...prev, completedAppointment]);
        setExaminedToday(prev => prev + 1);
    };

    /**
     * Thu ngân xác nhận đã thanh toán
     * @param {string} appointmentId
     */
    const completePayment = (appointmentId) => {
        const appointment = paymentQueue.find(a => a.id === appointmentId);
        if (!appointment) return;

        const historyEntry = {
            ...appointment,
            status: 'completed',
            paymentStatus: 'completed',
            totalPrice: appointment.totalCost,
            patientPaid: appointment.patientPays,
        };

        // Xóa khỏi hàng chờ thanh toán
        setPaymentQueue(prev => prev.filter(a => a.id !== appointmentId));
        // Thêm vào lịch sử
        setCompletedHistory(prev => [...prev, historyEntry]);
    };

    return (
        <AppContext.Provider value={{
            pendingQueue,
            paymentQueue,
            completedHistory,
            examinedToday,
            addAppointment,
            completeExamination,
            completePayment,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
