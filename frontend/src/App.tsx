import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhyEligibleModal } from './components/WhyEligibleModal';
import { HomePage } from './pages/HomePage';
import { EligibilityPage } from './pages/EligibilityPage';
import { ResultsPage } from './pages/ResultsPage';
import { SchemeDetailsPage } from './pages/SchemeDetailsPage';
import { ExploreSchemesPage } from './pages/ExploreSchemesPage';
import { DashboardPage } from './pages/DashboardPage';
import { CopilotPage } from './pages/CopilotPage';
//import { CombinationCheckerPage } from './pages/CombinationCheckerPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { SavedSchemesPage } from './pages/SavedSchemesPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { FeedbackPage } from './pages/FeedbackPage';
const AppContent: React.FC = () => {
  const { currentPage } = useApp();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'eligibility':
        return <EligibilityPage />;
      case 'results':
        return <ResultsPage />;
      case 'scheme_details':
        return <SchemeDetailsPage />;
      case 'schemes':
        return <ExploreSchemesPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'copilot':
        return <CopilotPage />;
      // case 'combination':
      //   return <CombinationCheckerPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'profile':
        return <ProfilePage />;
      case 'saved':
        return <SavedSchemesPage />;
      case 'applications':
        return <ApplicationsPage />;
      case 'feedback':
        return <FeedbackPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <WhyEligibleModal />
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
