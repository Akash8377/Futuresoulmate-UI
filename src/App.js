import React, { Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toast } from './components/Common/Toast';
import Home from './pages/Home/Home.jsx';
import Login from './pages/Users/Login.jsx';
import ProfileUpload from './pages/Users/ProfileUpload.jsx';
import VerifyProfile from './pages/Users/VerifyProfile.jsx';
import HobbiesInterests from './pages/Users/HobbiesInterests.jsx';
import FamilyDetailsForm from './pages/Users/FamilyDetailsForm.jsx';
import PartnerPreferences from './pages/Users/PartnerPreferences.jsx';
import DashboardPage from './components/Dashboard/DashboardPage.jsx';
import ForgotPasswordOTP from './pages/Users/forget-password/ForgotPasswordOTP.jsx';
import Matches from './components/Dashboard/Matches/Matches.jsx';
import Search from './components/Dashboard/search/Search.jsx';
import MessageInbox from './components/Dashboard/inboxmessage/MessageInbox.jsx';
import SearchResultsPage from './components/Dashboard/search/SearchResultsPage.jsx';
import Inbox from './components/Dashboard/inbox/Inbox.jsx';
import OnboardingLayout from './components/Layout/OnboardingLayout';
import DashboardLayout from './components/Layout/DashboardLayout';
import HLA_DNA from './components/Dashboard/dna/HLA_DNA.jsx'
import GeneticBiological from './components/Dashboard/dna/components/Biological.jsx';
import GeneticPhyscological from './components/Dashboard/dna/components/Psycholigical.jsx';
import GeneticBirthDefect from './components/Dashboard/dna/components/BirthDefect.jsx';
import IdentityEnrichment from './components/Dashboard/IdentityEnrichment/IdentityEnrichment.jsx';

// Protected Route Wrapper for Onboarding routes
const OnboardingRoute = () => {
  const { token } = useSelector((state) => state.user);
  return token ? (
    <OnboardingLayout>
      <Outlet />
    </OnboardingLayout>
  ) : (
    <Navigate to="/login" replace />
  );
};

// Protected Route Wrapper for Dashboard routes
const DashboardRoute = () => {
  const { token } = useSelector((state) => state.user);
  return token ? (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  ) : (
    <Navigate to="/login" replace />
  );
};

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Toast />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget-password" element={<ForgotPasswordOTP />} />
        {/* Protected Routes */}
        {/* Onboarding Routes (with HeaderOnboarding) */}
        <Route element={<OnboardingRoute />}>
          <Route path="/profile-upload" element={<ProfileUpload />} />
          <Route path="/hobbies" element={<HobbiesInterests />} />
          <Route path="/verify-profile" element={<VerifyProfile />} />
          <Route path="/family-details" element={<FamilyDetailsForm />} />
          <Route path="/partner-preferences" element={<PartnerPreferences />} />
        </Route>

        {/* Dashboard Routes (with HeaderDashboard) */}
        <Route element={<DashboardRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/message-inbox" element={<MessageInbox />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/search-profile" element={<Search />} />
          <Route path="/search-results" element={<SearchResultsPage />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/hla-dna" element={<HLA_DNA />} />
          <Route path="/gentics-biological-attraction" element={<GeneticBiological />} />
          <Route path="/gentics-psychological-compatibility" element={<GeneticPhyscological />} />
          <Route path="/gentics-birth-defect-risk" element={<GeneticBirthDefect />} />
          <Route path="//identity-enrichment" element={<IdentityEnrichment />} />
        </Route>
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;