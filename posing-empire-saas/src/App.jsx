import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import FormScreen from './components/FormScreen';
import LoadingScreen from './components/LoadingScreen';
import RoadmapScreen from './components/RoadmapScreen';
import BilanFormScreen from './components/BilanFormScreen';
import BilanRoadmapScreen from './components/BilanRoadmapScreen';
// import SandboxScreen from './components/SandboxScreen';

function getInitialMode() {
  try {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    if (mode === 'bilan') return 'bilan-form';
    // if (mode === 'sandbox') return 'sandbox';
  } catch { /* no-op */ }
  return 'form';
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(getInitialMode);
  const [formData, setFormData] = useState(null);
  const [bilanData, setBilanData] = useState(null);

  // ── Onboarding flow ──
  const handleFormSubmit = useCallback((data) => {
    setFormData(data);
    setCurrentScreen('loading');
  }, []);

  const handleLoadingComplete = useCallback((data) => {
    setFormData(data);
    setCurrentScreen('roadmap');
  }, []);

  const handleRestart = useCallback(() => {
    setFormData(null);
    setCurrentScreen('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ── Bilan flow ──
  const handleBilanSubmit = useCallback((data) => {
    setBilanData(data);
    setCurrentScreen('bilan-loading');
  }, []);

  const handleBilanLoadingComplete = useCallback((data) => {
    setBilanData(data);
    setCurrentScreen('bilan-roadmap');
  }, []);

  const handleBilanRestart = useCallback(() => {
    setBilanData(null);
    setCurrentScreen('bilan-form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ── Back to Onboarding (Clears URL query params) ──
  const handleBackToOnboarding = useCallback(() => {
    window.location.href = '/';
  }, []);

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        {/* ═══ ONBOARDING FLOW ═══ */}
        {currentScreen === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FormScreen onSubmit={handleFormSubmit} />
          </motion.div>
        )}

        {currentScreen === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingScreen
              onComplete={handleLoadingComplete}
              formData={formData}
            />
          </motion.div>
        )}

        {currentScreen === 'roadmap' && formData && (
          <motion.div
            key="roadmap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <RoadmapScreen
              data={formData}
              onRestart={handleRestart}
            />
          </motion.div>
        )}

        {/* ═══ BILAN FLOW ═══ */}
        {currentScreen === 'bilan-form' && (
          <motion.div
            key="bilan-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BilanFormScreen
              onSubmit={handleBilanSubmit}
              onBack={handleBackToOnboarding}
            />
          </motion.div>
        )}

        {currentScreen === 'bilan-loading' && (
          <motion.div
            key="bilan-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingScreen
              onComplete={handleBilanLoadingComplete}
              formData={bilanData}
              loadingText="Analyse de ton bilan en cours..."
            />
          </motion.div>
        )}

        {currentScreen === 'bilan-roadmap' && bilanData && (
          <motion.div
            key="bilan-roadmap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BilanRoadmapScreen
              data={bilanData}
              onRestart={handleBilanRestart}
              onBack={handleBackToOnboarding}
            />
          </motion.div>
        )}

        {/* 
        currentScreen === 'sandbox' && (
          <motion.div
            key="sandbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SandboxScreen
              onBack={() => {
                setCurrentScreen('form');
                window.history.pushState({}, '', '/');
              }}
            />
          </motion.div>
        )
        */}
      </AnimatePresence>
    </>
  );
}
