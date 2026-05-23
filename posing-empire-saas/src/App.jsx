import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import SelectModeScreen from './components/SelectModeScreen';
import FormScreen from './components/FormScreen';
import LoadingScreen from './components/LoadingScreen';
import RoadmapScreen from './components/RoadmapScreen';
import BilanFormScreen from './components/BilanFormScreen';
import BilanRoadmapScreen from './components/BilanRoadmapScreen';

function getInitialMode() {
  try {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    if (mode === 'bilan') return 'bilan-form';
    if (mode === 'onboarding') return 'form';
  } catch { /* no-op */ }
  return 'select';
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

  // ── Mode select ──
  const handleModeSelect = useCallback((mode) => {
    if (mode === 'onboarding') setCurrentScreen('form');
    else if (mode === 'bilan') setCurrentScreen('bilan-form');
  }, []);

  const handleBackToSelect = useCallback(() => {
    setFormData(null);
    setBilanData(null);
    setCurrentScreen('select');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        {/* ═══ MODE SELECT ═══ */}
        {currentScreen === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SelectModeScreen onSelect={handleModeSelect} />
          </motion.div>
        )}

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
              onBack={handleBackToSelect}
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
              onBack={handleBackToSelect}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
