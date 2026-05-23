import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BackgroundGrid from './BackgroundGrid';

const DEFAULT_STEPS = [
  'Analyse de ton profil...',
  'Sélection des modules adaptés...',
  'Création de ta roadmap personnalisée...',
];

const BILAN_STEPS = [
  'Analyse de ton bilan hebdomadaire...',
  'Sélection des exercices et vidéos adaptés...',
  'Génération de ta roadmap personnalisée...',
];

export default function LoadingScreen({ onComplete, formData, loadingText }) {
  const STEPS = loadingText ? BILAN_STEPS : DEFAULT_STEPS;
  const [currentStep, setCurrentStep] = useState(-1);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const timers = [];

    timers.push(setTimeout(() => {
      setCurrentStep(0);
      setBarWidth(33);
    }, 600));

    timers.push(setTimeout(() => {
      setCurrentStep(1);
      setBarWidth(66);
    }, 1400));

    timers.push(setTimeout(() => {
      setCurrentStep(2);
      setBarWidth(100);
    }, 2200));

    timers.push(setTimeout(() => {
      onComplete(formData);
    }, 3000));

    return () => timers.forEach(clearTimeout);
  }, [onComplete, formData]);

  return (
    <main className="screen active">
      <BackgroundGrid />
      <motion.div
        className="loading-wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Spinning Ring */}
        <div className="loading-ring">
          <div className="ring-segment"></div>
          <div className="ring-inner">
            <img src="/posing-empire.svg" alt="PE Logo" className="loading-logo-img" draggable="false" style={{ pointerEvents: 'none', userSelect: 'none' }} />
          </div>
        </div>

        {/* Title */}
        <h2 className="loading-title">
          <span className="text-white-gradient">Génération de ta </span>
          <span className="text-gold-gradient">Roadmap...</span>
        </h2>

        {/* Steps */}
        <div className="loading-steps">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              className={`loading-step${currentStep >= i ? ' done' : ''}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2, duration: 0.4 }}
            >
              <span className="step-check">
                {currentStep >= i ? '✅' : '⏳'}
              </span>
              <span>{step}</span>
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="loading-bar-container">
          <motion.div
            className="loading-bar"
            animate={{ width: `${barWidth}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </motion.div>
    </main>
  );
}
