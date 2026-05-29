import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import BackgroundGrid from './BackgroundGrid';
import { buildBilanRoadmap } from '../utils/buildBilanRoadmap';
import { generatePDF } from '../utils/generatePDF';
import gsap from 'gsap';
import useMagnetic from '../hooks/useMagnetic';

const LEVEL_LABELS = {
  1: '1 – Débutant',
  2: '2 – Intermédiaire',
  3: '3 – Avancé',
  4: '4 – Expert'
};

function SectionHeader({ icon, title }) {
  return (
    <div
      className="bilan-road-section-header"
      style={{ opacity: 0 }}
    >
      <span className="bilan-road-section-icon" aria-hidden="true">{icon}</span>
      <h2 className="bilan-road-section-title">{title}</h2>
    </div>
  );
}

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

function VideoLink({ text, link }) {
  if (!link) return <span className="bilan-road-task-text">{text}</span>;
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="bilan-road-video-link"
    >
      <span>{text}</span>
      <LinkArrowIcon />
    </a>
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

export default function BilanRoadmapScreen({ data, onRestart, onBack }) {
  const [downloading, setDownloading] = useState(false);
  
  const downloadBtnRef = useMagnetic({ strength: 0.1, textStrength: 0.05, maxTravelX: 6, maxTravelY: 6 });
  const restartBtnRef = useMagnetic({ strength: 0.1, textStrength: 0.05, maxTravelX: 6, maxTravelY: 6 });

  useEffect(() => {
    gsap.fromTo('.roadmap-header > *', 
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
    );
    gsap.fromTo('.info-item', 
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out', delay: 0.2 }
    );
    gsap.fromTo('.bilan-road-section-header, .bilan-road-section', 
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power2.out', delay: 0.4 }
    );
  }, []);
  const roadmap = buildBilanRoadmap(data);
  const { meta, bilan, priorites, planAction, ressources, objectifs, calendlyLink } = roadmap;

  const today = new Date();
  const dateStr = today.toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    const success = await generatePDF('bilan-roadmap-pdf-content', `${meta.fullname}-S${meta.weekNumber}`);
    if (!success) alert('Erreur lors de la génération du PDF. Essaye à nouveau.');
    setDownloading(false);
  }, [meta.fullname, meta.weekNumber]);

  const hasMobilite = planAction.mobilite.length > 0;
  const hasActivation = planAction.activation.length > 0;
  const hasVacuum = planAction.vacuum.length > 0;
  const hasPoses = planAction.posingTechnique.poses.length > 0;
  const hasTransitions = planAction.posingTechnique.transitions.length > 0;
  const hasCorrections = planAction.posingTechnique.corrections.length > 0;
  const hasRoutine = planAction.routineLibre.length > 0;

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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          <span>{downloading ? 'Génération en cours...' : 'Télécharger ma Roadmap PDF'}</span>
        </button>
        <button
          ref={restartBtnRef}
          className="btn-secondary-gold btn-restart"
          onClick={onRestart}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
          </svg>
          <span>Refaire le bilan</span>
        </button>
      </motion.div>

      {/* ROADMAP CONTENT */}
      <motion.div
        id="bilan-roadmap-pdf-content"
        className="roadmap-container bilan-roadmap-container"
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
            <div className="roadmap-program-label">
              ROADMAP — SEMAINE {String(meta.weekNumber).padStart(2, '0')} | {meta.fullname} | {meta.category} — {meta.federation}
            </div>
          </div>

          {/* CLIENT INFO */}
          <div className="roadmap-client-info bilan-client-info">
            <div className="info-item">
              <span className="info-label">Athlète</span>
              <span className="info-value gold">{meta.fullname}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Date</span>
              <span className="info-value">{dateStr}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Catégories</span>
              <span className="info-value">{meta.categories && meta.categories.length > 0 ? meta.categories.join(' · ') : meta.category}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Fédérations</span>
              <span className="info-value">{meta.federations && meta.federations.length > 0 ? meta.federations.join(' · ') : meta.federation}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Niveau</span>
              <span className="info-value gold">{meta.level}/4 — {LEVEL_LABELS[meta.level]}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Semaine</span>
              <span className="info-value gold">S{String(meta.weekNumber).padStart(2, '0')}</span>
            </div>
            {meta.morphology && (
              <div className="info-item">
                <span className="info-label">Morphologie</span>
                <span className="info-value gold">Type {meta.morphology}</span>
              </div>
            )}
            {meta.stageDate && (
              <div className="info-item">
                <span className="info-label">Échéance Scène</span>
                <span className="info-value gold">{formatStageCountdown(meta.stageDate)}</span>
              </div>
            )}
          </div>

          {/* ═══ BILAN DE LA SEMAINE ═══ */}
          <div className="pdf-block">
            <SectionHeader icon="📋" title="Bilan de la semaine" />
            <div
              className="bilan-road-section"
              style={{ opacity: 0 }}
            >
              <div className="bilan-road-subsection">
                <div className="bilan-road-sub-label success">✅ Points forts</div>
                <ul className="bilan-road-list">
                  {bilan.pointsForts.map((pt, i) => <li key={i}>{pt}</li>)}
                </ul>
              </div>
              <div className="bilan-road-subsection">
                <div className="bilan-road-sub-label warning">⚠️ Points à améliorer</div>
                <ul className="bilan-road-list">
                  {bilan.pointsAAmeliorer.map((pt, i) => <li key={i}>{pt}</li>)}
                </ul>
              </div>
            </div>
          </div>

          {/* ═══ PRIORITÉS DE LA SEMAINE ═══ */}
          <div className="pdf-block">
            <SectionHeader icon="🎯" title="Priorités de la semaine" />
            <div
              className="bilan-road-section"
              style={{ opacity: 0 }}
            >
              <ol className="bilan-road-priorities">
                {priorites.map((p, i) => <li key={i}>{p}</li>)}
              </ol>
            </div>
          </div>

          {/* ═══ PLAN D'ACTION ═══ */}
          {(() => {
            const planBlocks = [];
            
            if (hasMobilite) {
              planBlocks.push(
                <div key="mobilite" className="bilan-road-section bilan-road-action-block" style={{ opacity: 0 }}>
                  <div className="bilan-road-action-title">🧘 Mobilité</div>
                  {planAction.mobilite.map((ex, i) => (
                    <div key={i} className="bilan-road-exercise">
                      <div className="bilan-road-exercise-name">{ex.exercice}</div>
                      <div className="bilan-road-exercise-obj">{ex.objectif}</div>
                      <VideoLink text="Voir la vidéo" link={ex.link} />
                    </div>
                  ))}
                </div>
              );
            }
            
            if (hasActivation) {
              planBlocks.push(
                <div key="activation" className="bilan-road-section bilan-road-action-block" style={{ opacity: 0 }}>
                  <div className="bilan-road-action-title">💪 Activation musculaire</div>
                  {planAction.activation.map((ex, i) => (
                    <div key={i} className="bilan-road-exercise">
                      <div className="bilan-road-exercise-name">{ex.exercice}</div>
                      <div className="bilan-road-exercise-obj">{ex.objectif}</div>
                      <VideoLink text="Voir la vidéo" link={ex.link} />
                    </div>
                  ))}
                </div>
              );
            }
            
            if (hasVacuum) {
              planBlocks.push(
                <div key="vacuum" className="bilan-road-section bilan-road-action-block" style={{ opacity: 0 }}>
                  <div className="bilan-road-action-title">💨 Vacuum</div>
                  {planAction.vacuum.map((v, i) => (
                    <div key={i} className="bilan-road-exercise">
                      {v.consigne && <div className="bilan-road-exercise-obj">{v.consigne}</div>}
                      {v.progression && <div className="bilan-road-vacuum-progress">{v.progression}</div>}
                      <VideoLink text={v.linkLabel} link={v.link} />
                    </div>
                  ))}
                </div>
              );
            }
            
            if (hasPoses || hasTransitions || hasCorrections) {
              planBlocks.push(
                <div key="posing" className="bilan-road-section bilan-road-action-block" style={{ opacity: 0 }}>
                  <div className="bilan-road-action-title">🎭 Posing technique</div>
                  {hasPoses && (
                    <div className="bilan-road-sub-group">
                      <div className="bilan-road-sub-label">Poses à travailler</div>
                      {planAction.posingTechnique.poses.map((p, i) => (
                        <div key={i} className="bilan-road-task">
                          <VideoLink text={p.text} link={p.link} />
                        </div>
                      ))}
                    </div>
                  )}
                  {hasTransitions && (
                    <div className="bilan-road-sub-group">
                      <div className="bilan-road-sub-label">Transitions</div>
                      {planAction.posingTechnique.transitions.map((tr, i) => (
                        <div key={i} className="bilan-road-task">
                          <VideoLink text={tr.text} link={tr.link} />
                        </div>
                      ))}
                    </div>
                  )}
                  {hasCorrections && (
                    <div className="bilan-road-sub-group">
                      <div className="bilan-road-sub-label">Corrections clés</div>
                      {planAction.posingTechnique.corrections.map((c, i) => (
                        <div key={i} className="bilan-road-task">
                          <VideoLink text={c.text} link={c.link} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            
            if (hasRoutine) {
              planBlocks.push(
                <div key="routine" className="bilan-road-section bilan-road-action-block" style={{ opacity: 0 }}>
                  <div className="bilan-road-action-title">🎬 Routine libre / Présentation</div>
                  {planAction.routineLibre.map((r, i) => (
                    <div key={i} className="bilan-road-task">
                      <VideoLink text={r.text} link={r.link} />
                    </div>
                  ))}
                </div>
              );
            }
            
            if (planBlocks.length === 0) return null;
            
            const [firstBlock, ...restBlocks] = planBlocks;
            return (
              <>
                <div className="pdf-block">
                  <SectionHeader icon="📅" title="Plan d'action" />
                  {firstBlock}
                </div>
                {restBlocks}
              </>
            );
          })()}

          {/* ═══ RESSOURCES DE LA SEMAINE ═══ */}
          <div className="pdf-block">
            <SectionHeader icon="📚" title="Ressources de la semaine" />
            <div
              className="bilan-road-section"
              style={{ opacity: 0 }}
            >
              <table className="bilan-road-table">
                <thead>
                  <tr>
                    <th>Contenu</th>
                    <th>Pourquoi</th>
                    <th>Lien</th>
                  </tr>
                </thead>
                <tbody>
                  {ressources.map((res, i) => (
                    <tr key={i}>
                      <td className="bilan-road-table-title">{res.title}</td>
                      <td className="bilan-road-table-reason">{res.reason}</td>
                      <td>
                        <a
                          href={res.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bilan-road-table-link"
                        >
                          <span>Voir</span>
                          <LinkArrowIcon />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ═══ OBJECTIFS DE LA SEMAINE ═══ */}
          <div className="pdf-block">
            <SectionHeader icon="✅" title="Objectifs de la semaine" />
            <div
              className="bilan-road-section"
              style={{ opacity: 0 }}
            >
              <div className="bilan-road-objectives">
                <div className="bilan-road-obj-main">
                  <span className="bilan-road-obj-icon" aria-hidden="true">🏆</span>
                  <div>
                    <div className="bilan-road-obj-label">Objectif principal</div>
                    <div className="bilan-road-obj-text">{objectifs.principal}</div>
                  </div>
                </div>
                {objectifs.secondaires.map((s, i) => (
                  <div key={i} className="bilan-road-obj-secondary">
                    <span className="bilan-road-obj-icon" aria-hidden="true">🎯</span>
                    <div>
                      <div className="bilan-road-obj-label">Objectif secondaire {i + 1}</div>
                      <div className="bilan-road-obj-text">{s}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══ CTA CALENDLY ═══ */}
          {!meta.isAccompagnement && (
            <div
              className="bilan-road-section bilan-road-cta"
              style={{ opacity: 0 }}
            >
              <div className="bilan-road-cta-icon" aria-hidden="true">📞</div>
              <div className="bilan-road-cta-title">Tu veux aller plus loin ?</div>
              <div className="bilan-road-cta-text">
                Réserve un appel découverte avec Manaël pour un accompagnement 1:1 personnalisé
              </div>
              <a
                href={calendlyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bilan-road-cta-btn"
              >
                👉 Réserver mon appel découverte
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          )}

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
