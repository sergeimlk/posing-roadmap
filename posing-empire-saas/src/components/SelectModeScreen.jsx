import { motion } from 'framer-motion';
import BackgroundGrid from './BackgroundGrid';

const MODES = [
  {
    id: 'onboarding',
    icon: '📋',
    title: 'Questionnaire d\'Onboarding',
    subtitle: 'Première fois ici ?',
    description: 'Remplis ce questionnaire d\'inscription pour recevoir ta roadmap personnalisée de 12 semaines.',
    cta: 'Commencer l\'onboarding',
  },
  {
    id: 'bilan',
    icon: '📊',
    title: 'Bilan Hebdomadaire',
    subtitle: 'Déjà membre ?',
    description: 'Remplis ton bilan de la semaine pour recevoir ta roadmap de coaching personnalisée.',
    cta: 'Faire mon bilan',
  },
];

export default function SelectModeScreen({ onSelect }) {
  return (
    <main className="screen active">
      <BackgroundGrid />

      <motion.div
        className="select-mode-wrapper"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="select-mode-header">
          <div className="badge-pulse">
            <span className="pulse-dot"></span>
            <span>Posing Empire · Skool</span>
          </div>
          <h1 className="form-title">
            <span className="text-white-gradient">BIENVENUE CHEZ </span>
            <span className="text-gold-gradient">POSING EMPIRE</span>
          </h1>
          <p className="form-subtitle">
            Que souhaites-tu faire aujourd'hui ?
          </p>
        </div>

        {/* Mode Cards */}
        <div className="select-mode-grid">
          {MODES.map((mode, i) => (
            <motion.button
              key={mode.id}
              className="mode-card"
              onClick={() => onSelect(mode.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
              whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(212,168,67,0.15)' }}
              whileTap={{ y: 0 }}
              type="button"
              aria-label={mode.title}
            >
              <div className="mode-card-glow" aria-hidden="true" />
              <span className="mode-card-icon" aria-hidden="true">{mode.icon}</span>
              <span className="mode-card-subtitle">{mode.subtitle}</span>
              <span className="mode-card-title">{mode.title}</span>
              <span className="mode-card-desc">{mode.description}</span>
              <span className="mode-card-cta">
                {mode.cta}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
