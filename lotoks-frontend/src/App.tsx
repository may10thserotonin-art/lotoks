import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from '@/components/shared/Toast';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';

// Public pages
import HomePage from './pages/Home';
import AboutPage from './pages/About';
import ServicesPage from './pages/Services';
import TestimonialsPage from './pages/Testimonials';
import ContactPage from './pages/Contact';
import EligibilityPage from './pages/Eligibility';
import ApplyPage from './pages/Apply';
import DocumentsPage from './pages/Documents';
import PaymentPage from './pages/Payment';
import OpportunitiesPage from './pages/Opportunities';
import LoginPage from './pages/Login';

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
          {/* ── Public routes ── */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/eligibility" element={<EligibilityPage />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* ── Admin auth pages (no layout) ── */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/signup" element={<AdminSignupPage />} />
          <Route path="/admin/verify-email" element={<VerifyEmailPage />} />
          <Route path="/admin/reset-password" element={<ResetPasswordPage />} />

          {/* ── Protected admin layout ── */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/queue" replace />} />
            <Route path="queue" element={<AdminQueuePage />} />
            <Route path="listings" element={<AdminListingsPage />} />
            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="staff" element={<AdminStaffPage />} />
            <Route path="config" element={<AdminConfigPage />} />
            <Route path="languages" element={<AdminLanguagesPage />} />
            <Route path="requirements" element={<AdminRequirementsListPage />} />
            <Route path="requirements/:serviceType" element={<AdminRequirementsEditorPage />} />
          </Route>

          {/* ── 404 ── */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex flex-col items-center justify-center bg-navy text-white">
                <h1 className="text-6xl font-heading font-bold text-gold">404</h1>
                <p className="text-white/60 mt-3 mb-6">Page not found</p>
                <a href="/" className="px-6 py-3 rounded-xl bg-gold text-navy font-semibold hover:bg-gold/90 transition-colors">
                  Go Home
                </a>
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
