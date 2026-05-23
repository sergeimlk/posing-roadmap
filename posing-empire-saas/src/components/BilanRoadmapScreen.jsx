import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import BackgroundGrid from './BackgroundGrid';
import { buildBilanRoadmap } from '../utils/buildBilanRoadmap';
import { generatePDF } from '../utils/generatePDF';

const LEVEL_LABELS = ['Débutant', 'Novice', 'Intermédiaire', 'Confirmé', 'Avancé', 'Expert'];

function SectionHeader({ icon, title, delay = 0 }) {
  return (
    <motion.div
      className="bilan-road-section-header"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <span className="bilan-road-section-icon" aria-hidden="true">{icon}</span>
      <h2 className="bilan-road-section-title">{title}</h2>
    </motion.div>
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
      <span className="link-arrow" aria-hidden="true">↗</span>
    </a>
  );
}

export default function BilanRoadmapScreen({ data, onRestart, onBack }) {
  const [downloading, setDownloading] = useState(false);
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
        <motion.button
          className="btn-primary-gold btn-download"
          onClick={handleDownload}
          disabled={downloading}
          whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(212,168,67,0.4)' }}
          whileTap={{ y: 0 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
          </svg>
          <span>Refaire le bilan</span>
        </motion.button>
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
              <span className="info-label">Catégorie</span>
              <span className="info-value">{meta.category}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Fédération</span>
              <span className="info-value">{meta.federation}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Niveau</span>
              <span className="info-value gold">{meta.level}/5 — {LEVEL_LABELS[meta.level]}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Semaine</span>
              <span className="info-value gold">S{String(meta.weekNumber).padStart(2, '0')}</span>
            </div>
          </div>

          {/* ═══ BILAN DE LA SEMAINE ═══ */}
          <SectionHeader icon="📋" title="Bilan de la semaine" delay={0.1} />
          <motion.div
            className="bilan-road-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
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
          </motion.div>

          {/* ═══ PRIORITÉS DE LA SEMAINE ═══ */}
          <SectionHeader icon="🎯" title="Priorités de la semaine" delay={0.2} />
          <motion.div
            className="bilan-road-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <ol className="bilan-road-priorities">
              {priorites.map((p, i) => <li key={i}>{p}</li>)}
            </ol>
          </motion.div>

          {/* ═══ PLAN D'ACTION ═══ */}
          <SectionHeader icon="📅" title="Plan d'action" delay={0.3} />

          {/* Mobilité */}
          {hasMobilite && (
            <motion.div
              className="bilan-road-section bilan-road-action-block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              <div className="bilan-road-action-title">🧘 Mobilité</div>
              {planAction.mobilite.map((ex, i) => (
                <div key={i} className="bilan-road-exercise">
                  <div className="bilan-road-exercise-name">{ex.exercice}</div>
                  <div className="bilan-road-exercise-obj">{ex.objectif}</div>
                  <VideoLink text="Voir la vidéo" link={ex.link} />
                </div>
              ))}
            </motion.div>
          )}

          {/* Activation musculaire */}
          {hasActivation && (
            <motion.div
              className="bilan-road-section bilan-road-action-block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="bilan-road-action-title">💪 Activation musculaire</div>
              {planAction.activation.map((ex, i) => (
                <div key={i} className="bilan-road-exercise">
                  <div className="bilan-road-exercise-name">{ex.exercice}</div>
                  <div className="bilan-road-exercise-obj">{ex.objectif}</div>
                  <VideoLink text="Voir la vidéo" link={ex.link} />
                </div>
              ))}
            </motion.div>
          )}

          {/* Vacuum */}
          {hasVacuum && (
            <motion.div
              className="bilan-road-section bilan-road-action-block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              <div className="bilan-road-action-title">💨 Vacuum</div>
              {planAction.vacuum.map((v, i) => (
                <div key={i} className="bilan-road-exercise">
                  {v.consigne && <div className="bilan-road-exercise-obj">{v.consigne}</div>}
                  {v.progression && <div className="bilan-road-vacuum-progress">{v.progression}</div>}
                  <VideoLink text={v.linkLabel} link={v.link} />
                </div>
              ))}
            </motion.div>
          )}

          {/* Posing Technique */}
          {(hasPoses || hasTransitions || hasCorrections) && (
            <motion.div
              className="bilan-road-section bilan-road-action-block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
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
            </motion.div>
          )}

          {/* Routine libre */}
          {hasRoutine && (
            <motion.div
              className="bilan-road-section bilan-road-action-block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
            >
              <div className="bilan-road-action-title">🎬 Routine libre / Présentation</div>
              {planAction.routineLibre.map((r, i) => (
                <div key={i} className="bilan-road-task">
                  <VideoLink text={r.text} link={r.link} />
                </div>
              ))}
            </motion.div>
          )}

          {/* ═══ RESSOURCES DE LA SEMAINE ═══ */}
          <SectionHeader icon="📚" title="Ressources de la semaine" delay={0.6} />
          <motion.div
            className="bilan-road-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.5 }}
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
                        Voir ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* ═══ OBJECTIFS DE LA SEMAINE ═══ */}
          <SectionHeader icon="✅" title="Objectifs de la semaine" delay={0.7} />
          <motion.div
            className="bilan-road-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.5 }}
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
          </motion.div>

          {/* ═══ CTA CALENDLY ═══ */}
          {!meta.isAccompagnement && (
            <motion.div
              className="bilan-road-section bilan-road-cta"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
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
            </motion.div>
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
