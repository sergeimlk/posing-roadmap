import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundGrid from './BackgroundGrid';
import { buildTimeline } from '../utils/buildTimeline';
import { generatePDF } from '../utils/generatePDF';

const LEVEL_LABELS = ['Débutant total', 'Novice', 'Intermédiaire', 'Confirmé', 'Avancé', 'Expert'];
const NEEDS_LABELS = {
  routine_libre: 'Routine Libre',
  presentation_individuelle: 'Présentation Individuelle',
  accompagnement_1_1: 'Accompagnement 1:1',
};

function escHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default function RoadmapScreen({ data, onRestart }) {
  const [downloading, setDownloading] = useState(false);
  const [openIndices, setOpenIndices] = useState([0]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const toggleSection = useCallback((index) => {
    setOpenIndices(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  }, []);

  const timeline = buildTimeline(data);

  const needsDisplay = data.needs.length
    ? data.needs.map(n => NEEDS_LABELS[n] || n).join(' · ')
    : 'Aucun besoin spécifique sélectionné';

  const today = new Date();
  const dateStr = today.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    const success = await generatePDF('roadmap-pdf-content', data.fullname);
    if (!success) {
      alert('Erreur lors de la génération du PDF. Essaye à nouveau.');
    }
    setDownloading(false);
  }, [data.fullname]);

  return (
    <main className="screen active">
      <BackgroundGrid />

      {/* Action Buttons */}
      <motion.div
        className="roadmap-actions-top"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          className="btn-primary-gold btn-download"
          onClick={handleDownload}
          disabled={downloading}
          whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(212,168,67,0.4)' }}
          whileTap={{ y: 0 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          <span>{downloading ? 'Génération en cours...' : 'Télécharger ma Roadmap PDF'}</span>
        </motion.button>
        <motion.button
          className="btn-secondary-gold btn-restart"
          onClick={onRestart}
          whileHover={{ y: -1 }}
          whileTap={{ y: 0 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
          </svg>
          <span>Recommencer</span>
        </motion.button>
      </motion.div>

      {/* PDF-RENDERABLE ROADMAP */}
      <motion.div
        id="roadmap-pdf-content"
        className="roadmap-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="roadmap-page">
          {/* HEADER */}
          <div className="roadmap-header">
            <div className="roadmap-logo-container">
              <img src="/posing-empire.svg" alt="Posing Empire Logo" className="roadmap-logo" draggable="false" style={{ pointerEvents: 'none', userSelect: 'none' }} />
            </div>
            {/* 
            <div className="roadmap-brand">
              <span className="text-white-gradient">POSING </span>
              <span className="text-gold-gradient">EMPIRE</span>
            </div>
            */}
            <div className="roadmap-program-label">ROAD MAP — PROGRAMME PERSONNALISÉ</div>
          </div>

          {/* CLIENT INFO */}
          <div className="roadmap-client-info">
            <div className="info-item">
              <span className="info-label">Athlète</span>
              <span className="info-value gold">{data.fullname}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Date</span>
              <span className="info-value">{dateStr}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Catégorie</span>
              <span className="info-value">{data.category}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Fédération</span>
              <span className="info-value">{data.federation}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Niveau</span>
              <span className="info-value gold">{data.level}/5 — {LEVEL_LABELS[data.level]}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Temps quotidien</span>
              <span className="info-value">{data.time}</span>
            </div>
            <div className="info-item" style={{ gridColumn: '1 / -1' }}>
              <span className="info-label">Objectifs</span>
              <span className="info-value">{data.objectives}</span>
            </div>
            <div className="info-item" style={{ gridColumn: '1 / -1' }}>
              <span className="info-label">Problématiques</span>
              <span className="info-value">{data.problems}</span>
            </div>
            <div className="info-item" style={{ gridColumn: '1 / -1' }}>
              <span className="info-label">Besoins</span>
              <span className="info-value">{needsDisplay}</span>
            </div>
          </div>

          {/* TIMELINE */}
          <div className="roadmap-section-title">📋 Ta Roadmap Semaine par Semaine</div>
          <div className="roadmap-timeline">
            {timeline.map((item, i) => {
              const isFirst = i === 0;
              const isOpen = openIndices.includes(i);
              const isHovered = hoveredIndex === i;

              return (
                <motion.div
                  key={i}
                  className={`timeline-item ${!isFirst ? 'locked' : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
                >
                  <div className="timeline-left">
                    <div className={`timeline-number ${!isFirst ? 'locked-number' : ''}`}>
                      {isFirst ? (
                        `S${String(i + 1).padStart(2, '0')}`
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: 'translateY(-1px)' }}>
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      )}
                    </div>
                    <div className="timeline-line"></div>
                  </div>

                  <div className={`timeline-content ${!isFirst ? 'locked-content' : 'accordion-item'}`}>
                    <div 
                      className="accordion-header" 
                      onClick={() => toggleSection(i)}
                      onMouseEnter={() => !isFirst && setHoveredIndex(i)}
                      onMouseLeave={() => !isFirst && setHoveredIndex(null)}
                      style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isOpen}
                      aria-controls={`accordion-body-${i}`}
                      id={`accordion-header-${i}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleSection(i);
                        }
                      }}
                    >
                      <div style={{ flex: 1, paddingRight: '1rem', textAlign: 'left' }}>
                        <div className="timeline-header-meta">
                          <span className="timeline-phase">{item.phase}</span>
                          {!isFirst && (
                            <span className="lock-badge">
                              🔒 Verrouillé
                            </span>
                          )}
                        </div>
                        <div className="timeline-title" style={{ margin: 0 }}>
                          {!isFirst ? `S${String(i + 1).padStart(2, '0')} — ${item.title}` : item.title}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
                        {/* Tooltip on Desktop */}
                        {!isFirst && isHovered && (
                          <div className="timeline-tooltip">
                            Les prochaines roadmaps des prochaines semaines seront générées au fur et à mesure en fonction des blocages personnels et difficultés que tu rencontres au fil du coaching.
                          </div>
                        )}
                        <motion.span 
                          className="accordion-arrow"
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ display: 'flex', alignItems: 'center' }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: isFirst ? '#D4A843' : '#666' }}>
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </motion.span>
                      </div>
                    </div>
 
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`accordion-body-${i}`}
                          role="region"
                          aria-labelledby={`accordion-header-${i}`}
                          className="accordion-body"
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: 'auto', opacity: 1, marginTop: '1rem' }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          style={{ overflow: 'hidden' }}
                        >
                          {isFirst ? (
                            <div className="timeline-tasks">
                              {item.tasks.map((task, j) => {
                                if (!task) return null;
                                const content = (
                                  <>
                                    <span className="task-icon">{task.icon}</span>
                                    <span className="task-text">{task.text}</span>
                                  </>
                                );
                                if (task.link) {
                                  return (
                                    <a
                                      key={j}
                                      href={task.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="timeline-task timeline-task-link"
                                    >
                                      {content}
                                      <span className="link-arrow">↗</span>
                                    </a>
                                  );
                                }
                                return (
                                  <div key={j} className="timeline-task">
                                    {content}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="timeline-locked-info">
                              {item.description && (
                                <p className="timeline-week-description">
                                  {item.description}
                                </p>
                              )}
                              <div className="locked-card">
                                <div className="locked-card-header">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#D4A843', marginRight: '0.25rem' }}>
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                  </svg>
                                  <span className="locked-card-title">Contenu verrouillé</span>
                                </div>
                                <p className="locked-text">
                                  Les prochaines roadmaps des prochaines semaines seront générées au fur et à mesure en fonction des blocages personnels et difficultés que tu rencontres au fil du coaching.
                                </p>
                                <div className="locked-card-footer">
                                  Bilan hebdomadaire requis
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* FOOTER */}
          <div className="roadmap-footer">
            <div className="roadmap-footer-brand">POSING EMPIRE — COACHING PROFESSIONNEL DE POSING</div>
            <div className="roadmap-footer-url">© 2026 Posing Empire · www.posingempire.com</div>
          </div>
        </div>
      </motion.div>

      {/* Beta Suggestions Footer */}
      <div className="beta-footer">
        <span className="beta-badge">Version Beta</span>
        <p className="beta-text">
          Posing Empire est en amélioration continue. Une suggestion ou un retour d'expérience ?
        </p>
        <div className="beta-links">
          <a href="https://www.skool.com/posing-empire-groupe-prive-6566" target="_blank" rel="noopener noreferrer" className="beta-link">
            Contacte-moi directement sur Skool
          </a>
        </div>
        <p className="beta-thankyou">
          Merci infiniment pour ton aide et ta contribution précieuse ! 🙏
        </p>
      </div>
    </main>
  );
}
