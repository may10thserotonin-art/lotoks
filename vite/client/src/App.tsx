import { Routes, Route } from 'react-router-dom';

import HomePage          from './app/page';
import AboutPage         from './app/about/page';
import ServicesPage      from './app/services/page';
import ContactPage       from './app/contact/page';
import TestimonialsPage  from './app/testimonials/page';
import LoginPage         from './app/login/page';
import DashboardPage     from './app/dashboard/page';
import RequirementsPage  from './app/requirements/page';
import ApplyPage         from './app/apply/page';
import EligibilityPage   from './app/eligibility/page';
import OpportunitiesPage from './app/opportunities/page';
import DocumentsPage     from './app/documents/page';
import PaymentPage       from './app/payment/page';
import AdminQueuePage    from './app/admin/queue/page';
import AdminListingsPage from './app/admin/listings/page';
import AdminPaymentsPage from './app/admin/payments/page';
import AdminStaffPage    from './app/admin/staff/page';
import AdminConfigPage   from './app/admin/config/page';
import AdminLanguagesPage from './app/admin/languages/page';

function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0B1D3A', color: '#fff' }}>
      <h1 style={{ fontSize: '6rem', fontWeight: 800, color: '#C9A44B', margin: 0 }}>404</h1>
      <p style={{ fontSize: '1.25rem', marginTop: '1rem', opacity: 0.7 }}>Page not found</p>
      <a href="/" style={{ marginTop: '2rem', color: '#C9A44B', fontWeight: 600 }}>← Back to Home</a>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/"                  element={<HomePage />} />
      <Route path="/about"             element={<AboutPage />} />
      <Route path="/services"          element={<ServicesPage />} />
      <Route path="/contact"           element={<ContactPage />} />
      <Route path="/testimonials"      element={<TestimonialsPage />} />
      <Route path="/login"             element={<LoginPage />} />
      <Route path="/dashboard"         element={<DashboardPage />} />
      <Route path="/requirements"      element={<RequirementsPage />} />
      <Route path="/apply"             element={<ApplyPage />} />
      <Route path="/eligibility"       element={<EligibilityPage />} />
      <Route path="/opportunities"     element={<OpportunitiesPage />} />
      <Route path="/documents"         element={<DocumentsPage />} />
      <Route path="/payment"           element={<PaymentPage />} />
      <Route path="/admin/queue"       element={<AdminQueuePage />} />
      <Route path="/admin/listings"    element={<AdminListingsPage />} />
      <Route path="/admin/payments"    element={<AdminPaymentsPage />} />
      <Route path="/admin/staff"       element={<AdminStaffPage />} />
      <Route path="/admin/config"      element={<AdminConfigPage />} />
      <Route path="/admin/languages"   element={<AdminLanguagesPage />} />
      <Route path="*"                  element={<NotFound />} />
    </Routes>
  );
}
