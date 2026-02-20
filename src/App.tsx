import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/LoginPage';
import PatientDashboard from './pages/patient/PatientDashboard';
import RegisterAppointment from './pages/patient/RegisterAppointment';
import MedicalHistory from './pages/patient/MedicalHistory';
import PatientProfile from './pages/patient/PatientProfile';
import StaffDashboard from './pages/staff/StaffDashboard';
import ExaminationPage from './pages/staff/ExaminationPage';
import PaymentPage from './pages/staff/PaymentPage';

// Protected Route Component
function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) {
    const { user, loading } = useAuth() as any;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to={user.role === 'patient' ? '/patient/dashboard' : '/staff/dashboard'} replace />;
    }

    return <MainLayout>{children}</MainLayout>;
}

// Public Route (redirect if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth() as any;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (user) {
        return <Navigate to={user.role === 'patient' ? '/patient/dashboard' : '/staff/dashboard'} replace />;
    }

    return <>{children}</>;
}

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path="/"
                element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                }
            />

            {/* Patient Routes */}
            <Route
                path="/patient/dashboard"
                element={
                    <ProtectedRoute requiredRole="patient">
                        <PatientDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/patient/register"
                element={
                    <ProtectedRoute requiredRole="patient">
                        <RegisterAppointment />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/patient/history"
                element={
                    <ProtectedRoute requiredRole="patient">
                        <MedicalHistory />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/patient/profile"
                element={
                    <ProtectedRoute requiredRole="patient">
                        <PatientProfile />
                    </ProtectedRoute>
                }
            />

            {/* Staff Routes */}
            <Route
                path="/staff/dashboard"
                element={
                    <ProtectedRoute requiredRole="staff">
                        <StaffDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/staff/examination/:appointmentId"
                element={
                    <ProtectedRoute requiredRole="staff">
                        <ExaminationPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/staff/payment"
                element={
                    <ProtectedRoute requiredRole="staff">
                        <PaymentPage />
                    </ProtectedRoute>
                }
            />

            {/* 404 Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppProvider>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </AppProvider>
        </AuthProvider>
    );
}
