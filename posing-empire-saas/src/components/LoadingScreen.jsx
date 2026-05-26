import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import BackgroundGrid from './BackgroundGrid';
import { polishTextWithAI } from '../utils/polishText';

const DEFAULT_STEPS = [
  'Analyse de ton profil...',
  'Optimisation de tes réponses par l\'IA...',
  'Sélection des modules adaptés...',
  'Création de ta roadmap sur 12 mois...',
];

const BILAN_STEPS = [
  'Analyse de ton bilan hebdomadaire...',
  'Optimisation de tes réponses par l\'IA...',
  'Sélection des exercices et vidéos adaptés...',
  'Génération de ta roadmap personnalisée...',
];

export default function LoadingScreen({ onComplete, formData, loadingText }) {
  const STEPS = loadingText ? BILAN_STEPS : DEFAULT_STEPS;
  const [currentStep, setCurrentStep] = useState(-1);
  const [barWidth, setBarWidth] = useState(0);
  const [processedData, setProcessedData] = useState(formData);
  const dataRef = useRef(formData);

  useEffect(() => {
    dataRef.current = processedData;
  }, [processedData]);

  // Asynchronously polish the text fields when mounted
  useEffect(() => {
    let active = true;
    async function performPolishing() {
      const updated = { ...formData };
      try {
        if (!loadingText) {
          // Onboarding fields
          if (formData.objectives) {
            updated.objectives = await polishTextWithAI(formData.objectives, 'objectives');
          }
          if (formData.problems) {
            updated.problems = await polishTextWithAI(formData.problems, 'problems');
          }
        } else {
          // Bilan fields
          if (formData.workDoneDetails) {
            updated.workDoneDetails = await polishTextWithAI(formData.workDoneDetails, 'workDoneDetails');
          }
          if (formData.difficultiesDetails) {
            updated.difficultiesDetails = await polishTextWithAI(formData.difficultiesDetails, 'difficultiesDetails');
          }
          if (formData.mobilityDetails) {
            updated.mobilityDetails = await polishTextWithAI(formData.mobilityDetails, 'mobilityDetails');
          }
          if (formData.nextWeekGoal) {
            updated.nextWeekGoal = await polishTextWithAI(formData.nextWeekGoal, 'nextWeekGoal');
          }
        }
      } catch (err) {
        console.error('Error during loading screen text polishing:', err);
      }
      if (active) {
        setProcessedData(updated);
      }
    }
    performPolishing();
    return () => { active = false; };
  }, [formData, loadingText]);

  // Timers to step through loading animation sequentially
  useEffect(() => {
    const timers = [];

    timers.push(setTimeout(() => {
      setCurrentStep(0);
      setBarWidth(25);
    }, 600));

    timers.push(setTimeout(() => {
      setCurrentStep(1);
      setBarWidth(50);
    }, 1300));

    timers.push(setTimeout(() => {
      setCurrentStep(2);
      setBarWidth(75);
    }, 2000));

    timers.push(setTimeout(() => {
      setCurrentStep(3);
      setBarWidth(100);
    }, 2700));

    timers.push(setTimeout(() => {
      onComplete(dataRef.current);
    }, 3400));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

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
