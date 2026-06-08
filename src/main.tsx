import React, { StrictMode, useEffect, useState, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import App from './App.tsx';
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminLogin = lazy(() => import('./components/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const ProjectsAdmin = lazy(() => import('./components/admin/ProjectsAdmin'));
const SkillsAdmin = lazy(() => import('./components/admin/SkillsAdmin'));
const CertificationsAdmin = lazy(() => import('./components/admin/CertificationsAdmin'));
const AchievementsAdmin = lazy(() => import('./components/admin/AchievementsAdmin'));
const TimelineAdmin = lazy(() => import('./components/admin/TimelineAdmin'));
const MessagesAdmin = lazy(() => import('./components/admin/MessagesAdmin'));
const SettingsAdmin = lazy(() => import('./components/admin/SettingsAdmin'));
const AiKnowledgeAdmin = lazy(() => import('./components/admin/AiKnowledgeAdmin'));
const BlogAdmin = lazy(() => import('./components/admin/BlogAdmin'));
const MediaAdmin = lazy(() => import('./components/admin/MediaAdmin'));
const ResumeAdmin = lazy(() => import('./components/admin/ResumeAdmin'));
import './index.css';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { AnimatePresence, motion } from 'motion/react';

function AnimatedRoutes({ isAdmin }: { isAdmin: boolean | null }) {
  const location = useLocation();

  // Key based on top-level route (either root, admin login, or admin layout)
  const topLevelPath = location.pathname.startsWith('/admin')
    ? location.pathname === '/admin/login'
      ? '/admin/login'
      : '/admin'
    : '/';

  return (
    <React.Fragment>
      {/* @ts-ignore */}
      <Suspense fallback={<div className="min-h-screen bg-[#0A0A0B]" />}>
        <Routes location={location}>
          <Route path="/" element={<App />} />
          <Route path="/admin/login" element={isAdmin ? <Navigate to="/admin" /> : <AdminLogin />} />
          <Route path="/admin" element={isAdmin ? <AdminLayout /> : <Navigate to="/admin/login" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="skills" element={<SkillsAdmin />} />
            <Route path="certifications" element={<CertificationsAdmin />} />
            <Route path="achievements" element={<AchievementsAdmin />} />
            <Route path="timeline" element={<TimelineAdmin />} />
            <Route path="messages" element={<MessagesAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
            <Route path="blog" element={<BlogAdmin />} />
            <Route path="media" element={<MediaAdmin />} />
            <Route path="resume" element={<ResumeAdmin />} />
            <Route path="knowledge" element={<AiKnowledgeAdmin />} />
          </Route>
        </Routes>
      </Suspense>
    </React.Fragment>
  );
}

import { Toaster } from 'sonner';

function Root() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.email === 'vanshkhanna800@gmail.com') {
          setIsAdmin(true);
        } else {
          const adminDoc = await getDoc(doc(db, 'admins', user.uid));
          setIsAdmin(adminDoc.exists());
        }
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Toaster theme="dark" position="bottom-right" />
      <AnimatedRoutes isAdmin={isAdmin} />
    </Router>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
