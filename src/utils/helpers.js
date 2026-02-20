import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge className with Tailwind classes
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Format date to Vietnamese locale
 */
export function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

/**
 * Format currency to Vietnamese Dong
 */
export function formatCurrency(amount) {
    if (!amount && amount !== 0) return '';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

/**
 * Check if medicine conflicts with patient allergies
 */
export function checkAllergyConflict(medicine, patientAllergies) {
    if (!medicine || !patientAllergies) return null;

    const lowerMedicine = medicine.toLowerCase();
    const conflicts = patientAllergies.filter(allergy =>
        lowerMedicine.includes(allergy.toLowerCase()) ||
        allergy.toLowerCase().includes(lowerMedicine)
    );

    return conflicts.length > 0 ? conflicts : null;
}

/**
 * Check if medicine conflicts with patient contraindications
 */
export function checkContraindication(medicine, patientContraindications) {
    if (!medicine || !patientContraindications) return null;

    const lowerMedicine = medicine.toLowerCase();
    const conflicts = patientContraindications.filter(contraindication =>
        lowerMedicine.includes(contraindication.toLowerCase()) ||
        contraindication.toLowerCase().includes(lowerMedicine)
    );

    return conflicts.length > 0 ? conflicts : null;
}
