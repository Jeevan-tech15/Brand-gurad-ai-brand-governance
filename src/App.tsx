import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { NewReviewPage } from './pages/NewReviewPage';
import { ReviewHistoryPage } from './pages/ReviewHistoryPage';
import { ReviewDetailsPage } from './pages/ReviewDetailsPage';
import { GuidelinesFactsPage } from './pages/GuidelinesFactsPage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  // Restore active review from URL query or localStorage on initial mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlReviewId = params.get('reviewId');
      const urlTab = params.get('tab') as NavTab;

      if (urlReviewId) {
        setSelectedReviewId(urlReviewId);
      } else if (urlTab && ['dashboard', 'new-review', 'history', 'guidelines'].includes(urlTab)) {
        setCurrentTab(urlTab);
      } else {
        const savedReviewId = localStorage.getItem('brandguard_active_review_id');
        if (savedReviewId) {
          setSelectedReviewId(savedReviewId);
        }
      }
    } catch (e) {
      console.warn('Could not read url params', e);
    }
  }, []);

  const updateUrl = (reviewId: string | null, tab?: NavTab) => {
    try {
      if (reviewId) {
        window.history.replaceState(null, '', `?reviewId=${encodeURIComponent(reviewId)}`);
        localStorage.setItem('brandguard_active_review_id', reviewId);
      } else {
        localStorage.removeItem('brandguard_active_review_id');
        const activeTab = tab || currentTab;
        if (activeTab === 'dashboard') {
          window.history.replaceState(null, '', window.location.pathname);
        } else {
          window.history.replaceState(null, '', `?tab=${encodeURIComponent(activeTab)}`);
        }
      }
    } catch (e) {
      console.warn('Could not update history state', e);
    }
  };

  const handleNavigateNewReview = () => {
    setSelectedReviewId(null);
    setCurrentTab('new-review');
    updateUrl(null, 'new-review');
  };

  const handleNavigateHistory = () => {
    setSelectedReviewId(null);
    setCurrentTab('history');
    updateUrl(null, 'history');
  };

  const handleNavigateGuidelines = () => {
    setSelectedReviewId(null);
    setCurrentTab('guidelines');
    updateUrl(null, 'guidelines');
  };

  const handleSelectReview = (id: string) => {
    setSelectedReviewId(id);
    updateUrl(id);
  };

  const handleBackFromDetails = () => {
    setSelectedReviewId(null);
    setCurrentTab('history');
    updateUrl(null, 'history');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Application Header */}
      <Header
        onNavigateNewReview={handleNavigateNewReview}
        storageConnected={true}
      />

      {/* Main Body with Sidebar + View Content */}
      <div className="flex grow">
        <Sidebar
          currentTab={selectedReviewId ? 'history' : currentTab}
          onSelectTab={(tab) => {
            setSelectedReviewId(null);
            setCurrentTab(tab);
            updateUrl(null, tab);
          }}
          storageProvider="Audit Storage"
        />

        <main className="grow overflow-y-auto">
          {selectedReviewId ? (
            <ReviewDetailsPage
              reviewId={selectedReviewId}
              onBack={handleBackFromDetails}
              onSelectReview={handleSelectReview}
            />
          ) : currentTab === 'dashboard' ? (
            <DashboardPage
              onNavigateNewReview={handleNavigateNewReview}
              onNavigateHistory={handleNavigateHistory}
              onNavigateGuidelines={handleNavigateGuidelines}
              onSelectReview={handleSelectReview}
            />
          ) : currentTab === 'new-review' ? (
            <NewReviewPage
              onBackToHistory={handleNavigateHistory}
              onReviewCreated={(reviewId) => {
                setSelectedReviewId(reviewId);
                updateUrl(reviewId);
              }}
            />
          ) : currentTab === 'history' ? (
            <ReviewHistoryPage
              onNavigateNewReview={handleNavigateNewReview}
              onSelectReview={handleSelectReview}
            />
          ) : currentTab === 'guidelines' ? (
            <GuidelinesFactsPage />
          ) : null}
        </main>
      </div>
    </div>
  );
}
