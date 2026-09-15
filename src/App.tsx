import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContextProvider, useApp } from './contexts/AppContext';
import LiveSpaceBackground from './components/LiveSpaceBackground';
import { playAppLaunchSound } from './utils/soundEffects';
import { lazyWithRetry } from './utils/lazyRetry';
// Critical First-Paint Layout & Auth (Loaded Eagerly)
import DashboardLayout from './layouts/DashboardLayout';
import AuthPage from './pages/AuthPage';
import Welcome from './pages/Welcome';
import Home from './pages/Home';

// Resilient Lazy-Loaded Routes with Automatic Retry to prevent blank screens
const CommunitiesPage = lazyWithRetry(() => import('./pages/CommunitiesPage'));
const VoiceRoomsPage = lazyWithRetry(() => import('./pages/VoiceRoomsPage'));
const LodaviaMatchPage = lazyWithRetry(() => import('./pages/LodaviaMatchPage'));
const LodaviaWorldPage = lazyWithRetry(() => import('./pages/LodaviaWorldPage'));
const ProfilePage = lazyWithRetry(() => import('./pages/ProfilePage'));
const CreatorEconomyPage = lazyWithRetry(() => import('./pages/CreatorEconomyPage'));
const MarketplacePage = lazyWithRetry(() => import('./pages/MarketplacePage'));
const NotificationsPage = lazyWithRetry(() => import('./pages/NotificationsPage'));
const SettingsPageNew = lazyWithRetry(() => import('./pages/SettingsPageNew'));
const AccountCenterPage = lazyWithRetry(() => import('./pages/settings/AccountCenterPage'));
const ProfileManagementPage = lazyWithRetry(() => import('./pages/settings/ProfileManagementPage'));
const PrivacyPage = lazyWithRetry(() => import('./pages/settings/PrivacyPage'));
const PrivacyPolicyPage = lazyWithRetry(() => import('./pages/settings/PrivacyPolicyPage'));
const SecurityPage = lazyWithRetry(() => import('./pages/settings/SecurityPage'));
const PasswordAuthPage = lazyWithRetry(() => import('./pages/settings/PasswordAuthPage'));
const NotificationsSettingsPage = lazyWithRetry(() => import('./pages/settings/NotificationsPage'));
const ActivityHistoryPage = lazyWithRetry(() => import('./pages/settings/ActivityHistoryPage'));
const SavedItemsPage = lazyWithRetry(() => import('./pages/settings/SavedItemsPage'));
const LanguagePage = lazyWithRetry(() => import('./pages/settings/LanguagePage'));
const AppearancePage = lazyWithRetry(() => import('./pages/settings/AppearancePage'));
const AIPreferencesPage = lazyWithRetry(() => import('./pages/settings/AIPreferencesPage'));
const AISubscriptionPage = lazyWithRetry(() => import('./pages/AISubscriptionPage'));
const SearchPreferencesPage = lazyWithRetry(() => import('./pages/settings/SearchPreferencesPage'));
const DataStoragePage = lazyWithRetry(() => import('./pages/settings/DataStoragePage'));
const DownloadsPage = lazyWithRetry(() => import('./pages/settings/DownloadsPage'));
const DevicesSessionsPage = lazyWithRetry(() => import('./pages/settings/DevicesSessionsPage'));
const ConnectedAccountsPage = lazyWithRetry(() => import('./pages/settings/ConnectedAccountsPage'));
const PermissionsPage = lazyWithRetry(() => import('./pages/settings/PermissionsPage'));
const ContentPreferencesPage = lazyWithRetry(() => import('./pages/settings/ContentPreferencesPage'));
const CommunitySafetyPage = lazyWithRetry(() => import('./pages/settings/CommunitySafetyPage'));
const BrandingKitPage = lazyWithRetry(() => import('./pages/BrandingKitPage'));
const SearchPage = lazyWithRetry(() => import('./pages/SearchPage'));
const MessagesPage = lazyWithRetry(() => import('./pages/MessagesPage'));
const LumoPage = lazyWithRetry(() => import('./pages/LumoPage'));
const AIAssistantPage = lazyWithRetry(() => import('./pages/AIAssistantPage'));
const AIReplyAssistantPage = lazyWithRetry(() => import('./pages/AIReplyAssistantPage'));
const AIDailyBriefPage = lazyWithRetry(() => import('./pages/AIDailyBriefPage'));
const MediaPage = lazyWithRetry(() => import('./pages/MediaPage'));
const LodaviaGamesPage = lazyWithRetry(() => import('./pages/LodaviaGamesPage'));
const StorePage = lazyWithRetry(() => import('./pages/StorePage'));
const LodaviaJourneyPage = lazyWithRetry(() => import('./pages/LodaviaJourneyPage'));
const ReferralPage = lazyWithRetry(() => import('./pages/ReferralPage'));
const ParallelWorldPage = lazyWithRetry(() => import('./pages/ParallelWorldPage'));
const LodaviaAudioPage = lazyWithRetry(() => import('./pages/LodaviaAudioPage'));
const LodaviaNowPage = lazyWithRetry(() => import('./pages/LodaviaNowPage'));
const LodaviaSkyPage = lazyWithRetry(() => import('./pages/LodaviaSkyPage'));
const ExplorePage = lazyWithRetry(() => import('./pages/ExplorePage'));
const ExploreSpacePage = lazyWithRetry(() => import('./pages/ExploreSpacePage'));
const OfflineCenterPage = lazyWithRetry(() => import('./pages/OfflineCenterPage'));
const ProjectsPage = lazyWithRetry(() => import('./pages/ProjectsPage'));
const CameraStudioPage = lazyWithRetry(() => import('./pages/CameraStudioPage'));
const MorePage = lazyWithRetry(() => import('./pages/MorePage'));

import OfflineIndicator from './components/offline/OfflineIndicator';
import { AudioProvider } from './contexts/AudioContext';
import { StoriesProvider } from './contexts/StoriesContext';
import { StoriesModals } from './components/stories/StoriesModals';
import MiniAudioPlayer from './components/audio/MiniAudioPlayer';
import FullAudioPlayerModal from './components/audio/FullAudioPlayerModal';
import AmbientMixerModal from './components/audio/AmbientMixerModal';

// Import Lodavia Cosmic Redesigned Logo
import LodaviaCosmicLogo from './components/LodaviaCosmicLogo';

// Import Feedback States
import { Cosmic404Page } from './components/FeedbackStates';

// Lightweight Cosmic Suspense Fallback
function CosmicPageFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full gap-3 p-8 animate-pulse">
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-0.5 shadow-lg shadow-sky-500/20 animate-spin">
        <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px]" />
      </div>
      <span className="text-xs font-mono font-bold text-sky-600 dark:text-cyan-400">
        LODAVIA CORE...
      </span>
    </div>
  );
}

function MainAppContent() {
  const { currentUser } = useApp();
  const isLoggedIn = !!currentUser && currentUser.id !== '';

  return (
    <Suspense fallback={<CosmicPageFallback />}>
      <Routes>
        {/* Public / Authentication Routes */}
        <Route path="/" element={<Navigate to={isLoggedIn ? "/home" : "/welcome"} replace />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/intro" element={<Welcome />} />
        <Route path="/onboarding" element={<Welcome />} />
        <Route path="/auth" element={!isLoggedIn ? <AuthPage /> : <Navigate to="/home" replace />} />
        <Route path="/login" element={!isLoggedIn ? <AuthPage initialMode="login" /> : <Navigate to="/home" replace />} />
        <Route path="/signup" element={!isLoggedIn ? <AuthPage initialMode="register" /> : <Navigate to="/home" replace />} />

        {/* Private Dashboard Shell and Pages */}
        <Route element={isLoggedIn ? <DashboardLayout /> : <Navigate to="/welcome" replace />}>
          <Route path="/home" element={<Home />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/voice-rooms" element={<VoiceRoomsPage />} />
          <Route path="/lodavia-match" element={<LodaviaMatchPage />} />
          <Route path="/lodavia-world" element={<LodaviaWorldPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/creator-economy" element={<CreatorEconomyPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPageNew />} />
          <Route path="/settings-new" element={<SettingsPageNew />} />
          <Route path="/settings/account-center" element={<AccountCenterPage />} />
          <Route path="/settings/profile" element={<ProfileManagementPage />} />
          <Route path="/settings/privacy" element={<PrivacyPage />} />
          <Route path="/settings/privacy/policy" element={<PrivacyPolicyPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/settings/security" element={<SecurityPage />} />
          <Route path="/settings/password" element={<PasswordAuthPage />} />
          <Route path="/settings/notifications" element={<NotificationsSettingsPage />} />
          <Route path="/settings/activity" element={<ActivityHistoryPage />} />
          <Route path="/settings/saved" element={<SavedItemsPage />} />
          <Route path="/settings/language" element={<LanguagePage />} />
          <Route path="/settings/appearance" element={<AppearancePage />} />
          <Route path="/settings/ai-preferences" element={<AIPreferencesPage />} />
          <Route path="/settings/ai-subscription" element={<AISubscriptionPage />} />
          <Route path="/ai-subscription" element={<AISubscriptionPage />} />
          <Route path="/settings/search-preferences" element={<SearchPreferencesPage />} />
          <Route path="/settings/data-storage" element={<DataStoragePage />} />
          <Route path="/settings/downloads" element={<DownloadsPage />} />
          <Route path="/settings/devices" element={<DevicesSessionsPage />} />
          <Route path="/settings/connected-accounts" element={<ConnectedAccountsPage />} />
          <Route path="/settings/permissions" element={<PermissionsPage />} />
          <Route path="/settings/content-preferences" element={<ContentPreferencesPage />} />
          <Route path="/settings/community-safety" element={<CommunitySafetyPage />} />
          <Route path="/branding-kit" element={<BrandingKitPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/lumo" element={<LumoPage />} />
          <Route path="/ai-assistant" element={<LumoPage />} />
          <Route path="/ai-reply-assistant" element={<AIReplyAssistantPage />} />
          <Route path="/ai-daily" element={<AIDailyBriefPage />} />
          <Route path="/media" element={<MediaPage />} />
          <Route path="/lodavia-games" element={<LodaviaGamesPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/journey" element={<LodaviaJourneyPage />} />
          <Route path="/referral" element={<ReferralPage />} />
          <Route path="/parallel-world" element={<ParallelWorldPage />} />
          <Route path="/audio" element={<LodaviaAudioPage />} />
          <Route path="/lodavia-now" element={<LodaviaNowPage />} />
          <Route path="/sky" element={<LodaviaSkyPage />} />
          <Route path="/lodavia-sky" element={<LodaviaSkyPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/explore-space" element={<ExploreSpacePage />} />
          <Route path="/offline-center" element={<OfflineCenterPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/camera" element={<CameraStudioPage />} />
          <Route path="/camera-studio" element={<CameraStudioPage />} />
          <Route path="/more" element={<MorePage />} />
        </Route>

        {/* Default 404 Page Fallback */}
        <Route path="*" element={<Cosmic404Page />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  useEffect(() => {
    playAppLaunchSound();
  }, []);

  return (
    <BrowserRouter>
      <AppContextProvider>
        <AudioProvider>
          <StoriesProvider>
            <div className="relative min-h-screen cosmic-app-container text-slate-900 dark:text-slate-100 font-sans overflow-x-hidden flex flex-col selection:bg-cyan-500/30 selection:text-white transition-colors duration-500">
              {/* Immersive Space Atmosphere Canvas */}
              <LiveSpaceBackground starCount={60} shootingStars={2} className="fixed inset-0 z-0" />

              <OfflineIndicator />

              <MainAppContent />

              {/* Stories Modals Overlay */}
              <StoriesModals />

              {/* Persistent Global Audio Overlay Components */}
              <MiniAudioPlayer />
              <FullAudioPlayerModal />
              <AmbientMixerModal />
            </div>
          </StoriesProvider>
        </AudioProvider>
      </AppContextProvider>
    </BrowserRouter>
  );
}
