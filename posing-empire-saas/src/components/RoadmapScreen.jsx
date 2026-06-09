import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundGrid from './BackgroundGrid';
import { buildTimeline } from '../utils/buildTimeline';
import { generatePDF } from '../utils/generatePDF';
import gsap from 'gsap';
import useMagnetic from '../hooks/useMagnetic';

const LEVEL_LABELS = {
  1: '1 – Débutant',
  2: '2 – Intermédiaire',
  3: '3 – Avancé',
  4: '4 – Expert'
};
const NEEDS_LABELS = {
  routine_libre: 'Routine Libre',
  presentation_individuelle: 'Présentation Individuelle',
};


function LinkArrowIcon() {
  return (
    <span className="link-arrow" style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
      {/* ================= OPTION A (Chain Link) ================= */}
      <svg 
        viewBox="0 0 24 24" 
        width="14" 
        height="14" 
        fill="none" 
        stroke="url(#goldGradientIcon)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px', transition: 'transform 0.2s ease' }}
      >
        <defs>
          <linearGradient id="goldGradientIcon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD54F" />
            <stop offset="50%" stopColor="#D4A843" />
            <stop offset="100%" stopColor="#B8942D" />
          </linearGradient>
        </defs>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>

      {/* ================= OPTION B (External Link Box-Arrow) - Commenté pour switch ================= */}
      {/* 
      <svg 
        viewBox="0 0 24 24" 
        width="14" 
        height="14" 
        fill="none" 
        stroke="url(#goldGradientIcon)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px', transition: 'transform 0.2s ease' }}
      >
        <defs>
          <linearGradient id="goldGradientIcon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD54F" />
            <stop offset="50%" stopColor="#D4A843" />
            <stop offset="100%" stopColor="#B8942D" />
          </linearGradient>
        </defs>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
      */}
    </span>
  );
}

function getWeeksRemaining(stageDateStr) {
  if (!stageDateStr) return null;
  const stageDate = new Date(stageDateStr);
  const today = new Date();
  
  stageDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = stageDate.getTime() - today.getTime();
  if (diffTime <= 0) return 0;
  
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.ceil(diffDays / 7);
}

function formatStageCountdown(stageDateStr) {
  if (!stageDateStr) return '';
  const weeks = getWeeksRemaining(stageDateStr);
  
  const parts = stageDateStr.split('-');
  let formattedDate = stageDateStr;
  if (parts.length === 3) {
    formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  
  if (weeks === null) return formattedDate;
  if (weeks <= 0) return `Jour J (${formattedDate})`;
  return `S-${weeks} (${formattedDate})`;
}

export default function RoadmapScreen({ data, onRestart }) {
  const [downloading, setDownloading] = useState(false);
  const [openIndices, setOpenIndices] = useState([0]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const downloadBtnRef = useMagnetic({ strength: 0.1, textStrength: 0.05, maxTravelX: 6, maxTravelY: 6 });
  const restartBtnRef = useMagnetic({ strength: 0.1, textStrength: 0.05, maxTravelX: 6, maxTravelY: 6 });

  useEffect(() => {
    // 1. Stagger entry for client info and header elements
    gsap.fromTo('.roadmap-header > *', 
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
    );
    gsap.fromTo('.info-item', 
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out', delay: 0.2 }
    );
    // 2. Stagger reveal for months blocks in the timeline
    gsap.fromTo('.timeline-item', 
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', delay: 0.4 }
    );
    // 3. Dynamic scale animation for the timeline line itself
    gsap.fromTo('.timeline-line',
      { scaleY: 0, transformOrigin: 'top center' },
      { scaleY: 1, duration: 1.5, ease: 'power3.out', delay: 0.6 }
    );
  }, []);
  
  const toggleSection = useCallback((index) => {
    setOpenIndices(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  }, []);

  const shakeLock = useCallback((index, e) => {
    if (index === 0) return; // M01 is not locked
    const container = e.currentTarget.closest('.timeline-item');
    if (!container) return;
    const lockIcon = container.querySelector('.timeline-number svg');
    const lockBadge = container.querySelector('.lock-badge');
    
    // Animate lock icon: slight scale up and rapid rotate left/right (wiggle)
    if (lockIcon) {
      gsap.killTweensOf(lockIcon);
      gsap.timeline()
        .to(lockIcon, { scale: 1.25, duration: 0.1, ease: 'power1.out' })
        .to(lockIcon, { rotation: -12, duration: 0.08 })
        .to(lockIcon, { rotation: 12, duration: 0.08 })
        .to(lockIcon, { rotation: -8, duration: 0.08 })
        .to(lockIcon, { rotation: 8, duration: 0.08 })
        .to(lockIcon, { rotation: 0, scale: 1, duration: 0.15, ease: 'power1.inOut' });
    }

    if (lockBadge) {
      gsap.killTweensOf(lockBadge);
      gsap.timeline()
        .to(lockBadge, { scale: 1.1, duration: 0.1, ease: 'power1.out' })
        .to(lockBadge, { x: -3, duration: 0.08 })
        .to(lockBadge, { x: 3, duration: 0.08 })
        .to(lockBadge, { x: -2, duration: 0.08 })
        .to(lockBadge, { x: 2, duration: 0.08 })
        .to(lockBadge, { x: 0, scale: 1, duration: 0.15, ease: 'power1.inOut' });
    }
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
        <button
          ref={downloadBtnRef}
          className="btn-primary-gold btn-download"
          onClick={handleDownload}
          disabled={downloading}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          <span>{downloading ? 'Génération en cours...' : 'Télécharger ma Roadmap PDF'}</span>
        </button>
        <button
          ref={restartBtnRef}
          className="btn-secondary-gold btn-restart"
          onClick={onRestart}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
          </svg>
          <span>Recommencer</span>
        </button>
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
              <span className="info-label">Catégories</span>
              <span className="info-value">{(data.categories && data.categories.length > 0) ? data.categories.join(' · ') : data.category}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Fédérations</span>
              <span className="info-value">{(data.federations && data.federations.length > 0) ? data.federations.join(' · ') : data.federation}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Niveau</span>
              <span className="info-value gold">{data.level}/4 — {LEVEL_LABELS[data.level]}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Temps quotidien</span>
              <span className="info-value">{data.time}</span>
            </div>
            {data.morphology && (
              <div className="info-item">
                <span className="info-label">Morphologie</span>
                <span className="info-value gold">Type {data.morphology}</span>
              </div>
            )}
            {data.stageDate && (
              <div className="info-item">
                <span className="info-label">Échéance Scène</span>
                <span className="info-value gold">{formatStageCountdown(data.stageDate)}</span>
              </div>
            )}
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
          <div className="roadmap-section-title">📋 Ta Roadmap sur 6 mois</div>
          <div className="roadmap-timeline">
            {timeline.map((item, i) => {
              const isFirst = i === 0;
              const isOpen = openIndices.includes(i);
              const isHovered = hoveredIndex === i;

              return (
                <div
                  key={i}
                  className={`timeline-item ${!isFirst ? 'locked' : ''}`}
                  style={{ opacity: 0 }}
                >
                  <div className="timeline-left">
                    <div className={`timeline-number ${!isFirst ? 'locked-number' : ''}`}>
                      {isFirst ? (
                        `M${String(i + 1).padStart(2, '0')}`
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
                      onMouseEnter={(e) => {
                        if (!isFirst) {
                          setHoveredIndex(i);
                          shakeLock(i, e);
                        }
                      }}
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
                          {!isFirst ? `M${String(i + 1).padStart(2, '0')} — ${item.title}` : `M01 — ${item.title}`}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
                        {/* Tooltip on Desktop */}
                        {!isFirst && isHovered && (
                          <div className="timeline-tooltip">
                            Les prochains blocs de ta roadmap seront générés au fur et à mesure en fonction des blocages personnels et difficultés que tu rencontres au fil du coaching.
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
                          style={{ overflow: isOpen ? 'visible' : 'hidden' }}
                        >
                          {isFirst ? (
                            <div className="timeline-tasks">
                              <div className="timeline-week-header" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: '#D4A843',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                marginBottom: '1rem',
                                borderBottom: '1px solid rgba(212, 168, 67, 0.15)',
                                paddingBottom: '0.5rem'
                              }}>
                                📅 Semaine 01 — Fondations & Point de départ
                              </div>
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
                                      <LinkArrowIcon />
                                    </a>
                                  );
                                }
                                return (
                                  <div key={j} className="timeline-task">
                                    {content}
                                  </div>
                                );
                              })}
                              <div className="timeline-week-notice-card" style={{
                                marginTop: '1.5rem',
                                background: 'rgba(212, 168, 67, 0.02)',
                                border: '1px dashed rgba(212, 168, 67, 0.2)',
                                borderRadius: '8px',
                                padding: '1rem',
                                display: 'flex',
                                alignItems: 'start',
                                gap: '0.75rem'
                              }}>
                                <span style={{ fontSize: '1.25rem', lineHeight: '1' }}>💡</span>
                                <div style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: '1.4' }}>
                                  <strong style={{ color: '#D4A843', display: 'block', marginBottom: '0.25rem' }}>
                                    Pour voir les autres semaines du premier mois :
                                  </strong>
                                  Effectue ton bilan hebdomadaire à la fin de la semaine dans le module <strong>Bilan Hebdomadaire</strong> pour débloquer automatiquement la suite personnalisée de ta roadmap.
                                </div>
                              </div>
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
                                  Les prochains blocs de ta roadmap seront générés au fur et à mesure en fonction des blocages personnels et difficultés que tu rencontres au fil du coaching.
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
                </div>
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
        <span className="beta-badge">Version Beta 1.6</span>
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
        <div style={{ color: '#151515', fontSize: '8px', marginTop: '6px', fontFamily: 'monospace' }}>
          29.05.2026
        </div>
      </div>
    </main>
  );
}
