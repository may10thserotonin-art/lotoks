import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from '@/components/shared/Toast';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { GuestRoute } from '@/components/auth/GuestRoute';

// Public pages
import HomePage from './pages/Home';
import AboutPage from './pages/About';
import ServicesPage from './pages/Services';
import TestimonialsPage from './pages/Testimonials';
import ContactPage from './pages/Contact';
import EligibilityPage from './pages/Eligibility';
import ApplyPage from './pages/Apply';
import DocumentsPage from './pages/Documents';
import OpportunitiesPage from './pages/Opportunities';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import SignupPage from './pages/Signup';
import ForgotPasswordPage from './pages/ForgotPassword';
import UserResetPasswordPage from './pages/ResetPassword';
import DashboardPage from './pages/Dashboard';

// Admin layout + auth pages (outside protected layout)
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/Login';
import { AdminSignupPage } from './pages/admin/Signup';
import { VerifyEmailPage } from './pages/admin/VerifyEmail';
import { ResetPasswordPage } from './pages/admin/ResetPassword';

// Admin pages
import { AdminQueuePage } from './pages/admin/Queue';
import { AdminListingsPage } from './pages/admin/Listings';
import { AdminPaymentsPage } from './pages/admin/Payments';
import { AdminUsersPage } from './pages/admin/Users';
import { AdminStaffPage } from './pages/admin/Staff';
import { AdminConfigPage } from './pages/admin/Config';
import { AdminLanguagesPage } from './pages/admin/Languages';
import { AdminRequirementsListPage } from './pages/admin/requirements/List';
import { AdminRequirementsEditorPage } from './pages/admin/requirements/Editor';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* ── Public routes (accessible to everyone) ── */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/eligibility" element={<EligibilityPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<UserResetPasswordPage />} />
          <Route path="/admin/verify-email" element={<VerifyEmailPage />} />
          <Route path="/admin/reset-password" element={<ResetPasswordPage />} />

          {/* ── Guest-only routes (redirect to dashboard if logged in) ── */}
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />
          <Route path="/admin/login" element={<GuestRoute adminOnly><AdminLoginPage /></GuestRoute>} />

          {/* ── User-protected routes (must be logged in as user) ── */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/apply" element={<ProtectedRoute><ApplyPage /></ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
          <Route path="/opportunities" element={<ProtectedRoute><OpportunitiesPage /></ProtectedRoute>} />

          {/* ── Admin-only pages (must be logged in as admin) ── */}
          <Route path="/admin/signup" element={
            <ProtectedRoute requireAdmin allowedRoles={['super_admin']}>
              <AdminSignupPage />
            </ProtectedRoute>
          } />

          {/* ── Protected admin layout ── */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/queue" replace />} />
            <Route path="queue" element={<AdminQueuePage />} />
            <Route path="listings" element={<AdminListingsPage />} />
            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="requirements" element={<AdminRequirementsListPage />} />
            <Route path="requirements/:serviceType" element={<AdminRequirementsEditorPage />} />

            {/* Super admin only */}
            <Route path="staff" element={
              <ProtectedRoute requireAdmin allowedRoles={['super_admin']}>
                <AdminStaffPage />
              </ProtectedRoute>
            } />
            <Route path="config" element={
              <ProtectedRoute requireAdmin allowedRoles={['super_admin']}>
                <AdminConfigPage />
              </ProtectedRoute>
            } />
            <Route path="languages" element={
              <ProtectedRoute requireAdmin allowedRoles={['super_admin']}>
                <AdminLanguagesPage />
              </ProtectedRoute>
            } />
          </Route>

          {/* ── 404 ── */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex flex-col items-center justify-center bg-navy text-white">
                <h1 className="text-6xl font-heading font-bold text-gold">404</h1>
                <p className="text-white/60 mt-3 mb-6">Page not found</p>
                <Link to="/" className="px-6 py-3 rounded-xl bg-gold text-navy font-semibold hover:bg-gold/90 transition-colors">
                  Go Home
                </Link>
              </div>
            }
          />
        </Routes>

        {/* Global toast notifications */}
        <ToastContainer />

        {/* Global floating WhatsApp CTA */}
        <WhatsAppButton />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
