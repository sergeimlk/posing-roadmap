import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundGrid from './BackgroundGrid';

// ── Reusable constants (same as onboarding) ──
const CATEGORIES = [
  { value: "Men's Physique", icon: '🏋️', label: "Men's Physique" },
  { value: 'Classic Physique', icon: '🏛️', label: 'Classic Physique' },
  { value: 'Bodybuilding', icon: '💪', label: 'Bodybuilding' },
  { value: 'Figure', icon: '👑', label: 'Figure' },
  { value: 'Non compétiteur', icon: '🎯', label: 'Non compétiteur' },
  { value: 'Autre', icon: '✨', label: 'Autre...' },
];

const FEDERATIONS = [
  { value: 'WNBF', label: 'WNBF' },
  { value: 'IFBB', label: 'IFBB' },
  { value: 'NPC', label: 'NPC' },
  { value: 'OCB', label: 'OCB' },
  { value: 'ACP', label: 'ACP' },
  { value: 'FFFCN', label: 'FFFCN' },
  { value: 'PCA', label: 'PCA' },
  { value: 'NBFI', label: 'NBFI' },
  { value: 'WABBA', label: 'WABBA' },
  { value: 'AFBBN', label: 'AFBBN' },
  { value: 'Autre', label: 'Autre' },
];

const LEVELS = [
  { value: 0, label: 'Débutant' },
  { value: 1, label: 'Novice' },
  { value: 2, label: 'Intermédiaire' },
  { value: 3, label: 'Confirmé' },
  { value: 4, label: 'Avancé' },
  { value: 5, label: 'Expert' },
];

// ── Bilan-specific constants ──
const WORK_CHIPS = [
  { value: 'poses', label: 'Poses' },
  { value: 'transitions', label: 'Transitions' },
  { value: 'vacuum', label: 'Vacuum' },
  { value: 'mobilite', label: 'Mobilité' },
  { value: 'routine', label: 'Routine libre' },
  { value: 'presentation', label: 'Présentation individuelle' },
  { value: 'quarts_de_tour', label: 'Quarts de tour' },
  { value: 'endurance', label: 'Endurance de pose' },
  { value: 'videos', label: 'Vidéos Skool regardées' },
];

const DIFFICULTY_CHIPS = [
  { value: 'poses', label: 'Poses imposées' },
  { value: 'transitions', label: 'Transitions' },
  { value: 'vacuum', label: 'Vacuum / Sangle abdo' },
  { value: 'mobilite', label: 'Mobilité générale' },
  { value: 'routine', label: 'Routine libre' },
  { value: 'presentation', label: 'Présentation individuelle' },
  { value: 'endurance', label: 'Endurance de pose' },
  { value: 'symetrie', label: 'Symétrie / Équilibre' },
  { value: 'dorsaux', label: 'Ouverture dorsaux' },
  { value: 'stress', label: 'Gestion du stress' },
];

const MOBILITY_ZONES = [
  { value: 'hanches', label: 'Hanches' },
  { value: 'epaules', label: 'Épaules' },
  { value: 'colonne', label: 'Colonne vertébrale' },
  { value: 'bassin', label: 'Bassin' },
  { value: 'rotation_tronc', label: 'Rotation du tronc' },
  { value: 'omoplates', label: 'Omoplates / Dos' },
  { value: 'autre', label: 'Autre' },
];

const PROGRESS_OPTIONS = [
  { value: 'na', label: 'Non applicable' },
  { value: 'not_started', label: 'Pas encore commencé' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'advanced', label: 'Avancé' },
  { value: 'done', label: 'Terminé' },
];

export default function BilanFormScreen({ onSubmit, onBack }) {
  // Try to load saved profile from localStorage
  const savedProfile = (() => {
    try {
      const raw = localStorage.getItem('pe_athlete_profile');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  const [formData, setFormData] = useState({
    fullname: savedProfile?.fullname || '',
    category: savedProfile?.category || '',
    categoryOther: savedProfile?.categoryOther || '',
    federation: savedProfile?.federation || '',
    federationOther: savedProfile?.federationOther || '',
    level: savedProfile?.level ?? null,
    weekNumber: '',
    workDone: [],
    workDoneDetails: '',
    difficulties: [],
    difficultiesDetails: '',
    mobilityZones: [],
    mobilityDetails: '',
    presentationProgress: 'na',
    routineProgress: 'na',
    nextWeekGoal: '',
    isAccompagnement: savedProfile?.isAccompagnement || false,
  });

  const [shakeField, setShakeField] = useState(null);

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const toggleChip = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }));
  }, []);

  const triggerShake = useCallback((field) => {
    setShakeField(field);
    setTimeout(() => setShakeField(null), 500);
    const el = document.getElementById(`group-${field}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.fullname.trim()) { triggerShake('fullname'); return; }
    if (!formData.category) { triggerShake('category'); return; }
    if (formData.category === 'Autre' && !formData.categoryOther.trim()) { triggerShake('categoryOther'); return; }

    const isCompetitor = formData.category !== 'Non compétiteur';
    if (isCompetitor) {
      if (!formData.federation) { triggerShake('federation'); return; }
      if (formData.federation === 'Autre' && !formData.federationOther.trim()) { triggerShake('federationOther'); return; }
    }

    if (formData.level === null) { triggerShake('level'); return; }
    if (!formData.weekNumber || formData.weekNumber < 1) { triggerShake('weekNumber'); return; }
    if (formData.workDone.length === 0 && !formData.workDoneDetails.trim()) { triggerShake('workDone'); return; }
    if (!formData.nextWeekGoal.trim()) { triggerShake('nextWeekGoal'); return; }

    // Save profile for next time
    try {
      localStorage.setItem('pe_athlete_profile', JSON.stringify({
        fullname: formData.fullname.trim(),
        category: formData.category,
        categoryOther: formData.categoryOther.trim(),
        federation: formData.federation,
        federationOther: formData.federationOther.trim(),
        level: formData.level,
        isAccompagnement: formData.isAccompagnement,
      }));
    } catch { /* silent fail */ }

    const submissionData = {
      fullname: formData.fullname.trim(),
      category: formData.category === 'Autre' ? (formData.categoryOther.trim() || 'Autre') : formData.category,
      federation: !isCompetitor ? 'Aucune' : (formData.federation === 'Autre' ? (formData.federationOther.trim() || 'Autre') : formData.federation),
      level: formData.level,
      weekNumber: parseInt(formData.weekNumber, 10),
      workDone: formData.workDone,
      workDoneDetails: formData.workDoneDetails.trim(),
      difficulties: formData.difficulties,
      difficultiesDetails: formData.difficultiesDetails.trim(),
      mobilityZones: formData.mobilityZones,
      mobilityDetails: formData.mobilityDetails.trim(),
      presentationProgress: formData.presentationProgress,
      routineProgress: formData.routineProgress,
      nextWeekGoal: formData.nextWeekGoal.trim(),
      isAccompagnement: formData.isAccompagnement,
    };

    onSubmit(submissionData);
  };

  const isCompetitor = formData.category && formData.category !== 'Non compétiteur';

  return (
    <main className="screen active">
      <BackgroundGrid />

      <motion.div
        className="form-wrapper"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="form-header">
          <div className="badge-pulse">
            <span className="pulse-dot"></span>
            <span>Bilan Hebdomadaire · Posing Empire</span>
          </div>
          <h1 className="form-title">
            <span className="text-white-gradient">BILAN </span>
            <span className="text-gold-gradient">PERSONNALISÉ</span>
          </h1>
          <p className="form-subtitle">
            Remplis ton bilan hebdomadaire — on génère ta roadmap de coaching pour la semaine.
          </p>
        </div>

        {/* Form Card */}
        <form className="form-card" autoComplete="off" onSubmit={handleSubmit}>
          <div className="form-gold-line"></div>

          {/* ═══ SECTION 1: Profil ═══ */}
          <div className="bilan-section-divider">
            <span className="bilan-section-icon" aria-hidden="true">👤</span>
            <span>Ton profil</span>
          </div>

          {/* Prénom */}
          <motion.div
            className="form-group"
            id="group-fullname"
            animate={shakeField === 'fullname' ? { x: [-6, 6, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <label htmlFor="bilan-fullname">Prénom <span className="required">*</span></label>
            <input
              type="text"
              id="bilan-fullname"
              name="fullname"
              placeholder="Ex: Manaël"
              required
              autoComplete="given-name"
              value={formData.fullname}
              onChange={(e) => updateField('fullname', e.target.value)}
            />
          </motion.div>

          {/* Catégorie */}
          <motion.div
            className="form-group"
            id="group-category"
            animate={shakeField === 'category' ? { x: [-6, 6, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <label id="bilan-label-category">Catégorie <span className="required">*</span></label>
            <div className="selector-grid selector-grid-2x2" role="group" aria-labelledby="bilan-label-category">
              {CATEGORIES.map(cat => (
                <motion.button
                  key={cat.value}
                  type="button"
                  className={`selector-btn${formData.category === cat.value ? ' selected' : ''}`}
                  onClick={() => {
                    updateField('category', cat.value);
                    if (cat.value !== 'Autre') updateField('categoryOther', '');
                    if (cat.value === 'Non compétiteur') {
                      updateField('federation', 'Aucune');
                    } else if (formData.category === 'Non compétiteur') {
                      updateField('federation', '');
                    }
                  }}
                  aria-pressed={formData.category === cat.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="selector-icon" aria-hidden="true">{cat.icon}</span>
                  <span>{cat.label}</span>
                </motion.button>
              ))}
            </div>
            <AnimatePresence>
              {formData.category === 'Autre' && (
                <motion.div
                  id="group-categoryOther"
                  initial={{ opacity: 0, height: 0, marginTop: 0, overflow: 'hidden' }}
                  animate={{ opacity: 1, height: 'auto', marginTop: '0.5rem', x: shakeField === 'categoryOther' ? [-6, 6, -6, 6, 0] : 0 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.25 }}
                >
                  <input
                    type="text"
                    placeholder="Précise ta catégorie..."
                    aria-label="Précise ta catégorie"
                    value={formData.categoryOther}
                    onChange={(e) => updateField('categoryOther', e.target.value)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Fédération (competitors only) */}
          <AnimatePresence mode="wait">
            {isCompetitor && (
              <motion.div
                className="form-group"
                id="group-federation"
                key="bilan-federation"
                initial={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                animate={{ opacity: 1, height: 'auto', marginBottom: '1.5rem', x: shakeField === 'federation' ? [-6, 6, -6, 6, 0] : 0 }}
                transition={{ duration: 0.4 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
              >
                <label id="bilan-label-federation">Fédération <span className="required">*</span></label>
                <div className="selector-grid selector-grid-fed" role="group" aria-labelledby="bilan-label-federation">
                  {FEDERATIONS.map(fed => (
                    <motion.button
                      key={fed.value}
                      type="button"
                      className={`selector-btn selector-btn-sm${formData.federation === fed.value ? ' selected' : ''}`}
                      onClick={() => {
                        updateField('federation', fed.value);
                        if (fed.value !== 'Autre') updateField('federationOther', '');
                      }}
                      aria-pressed={formData.federation === fed.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {fed.label}
                    </motion.button>
                  ))}
                </div>
                <AnimatePresence>
                  {formData.federation === 'Autre' && (
                    <motion.div
                      id="group-federationOther"
                      initial={{ opacity: 0, height: 0, marginTop: 0, overflow: 'hidden' }}
                      animate={{ opacity: 1, height: 'auto', marginTop: '0.5rem', x: shakeField === 'federationOther' ? [-6, 6, -6, 6, 0] : 0 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0, overflow: 'hidden' }}
                      transition={{ duration: 0.25 }}
                    >
                      <input
                        type="text"
                        placeholder="Précise ta fédération..."
                        aria-label="Précise ta fédération"
                        value={formData.federationOther}
                        onChange={(e) => updateField('federationOther', e.target.value)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Niveau */}
          <motion.div
            className="form-group"
            id="group-level"
            animate={shakeField === 'level' ? { x: [-6, 6, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <label id="bilan-label-level">Niveau actuel en posing <span className="required">*</span></label>
            <div className="level-selector" role="group" aria-labelledby="bilan-label-level">
              <div className="level-track">
                <motion.div
                  className="level-fill"
                  animate={{ width: formData.level !== null ? `${(formData.level / 5) * 100}%` : '0%' }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
              <div className="level-dots">
                {LEVELS.map(lvl => (
                  <button
                    key={lvl.value}
                    type="button"
                    className={`level-dot${formData.level === lvl.value ? ' active' : ''}${formData.level !== null && lvl.value < formData.level ? ' passed' : ''}`}
                    onClick={() => updateField('level', lvl.value)}
                    aria-label={`Niveau ${lvl.value} : ${lvl.label}`}
                    aria-pressed={formData.level === lvl.value}
                  >
                    <span className="dot-circle" aria-hidden="true">{lvl.value}</span>
                    <span className="dot-label" aria-hidden="true">{lvl.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Semaine N° */}
          <motion.div
            className="form-group"
            id="group-weekNumber"
            animate={shakeField === 'weekNumber' ? { x: [-6, 6, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <label htmlFor="bilan-weekNumber">Semaine N° (depuis le début de l'accompagnement) <span className="required">*</span></label>
            <input
              type="number"
              id="bilan-weekNumber"
              name="weekNumber"
              placeholder="Ex: 3"
              min="1"
              max="52"
              required
              value={formData.weekNumber}
              onChange={(e) => updateField('weekNumber', e.target.value)}
            />
          </motion.div>

          {/* Accompagnement 1:1 */}
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="privacy-checkbox-card">
              <input
                type="checkbox"
                checked={formData.isAccompagnement}
                onChange={(e) => updateField('isAccompagnement', e.target.checked)}
              />
              <span className="checkbox-visual">
                <span className="check-icon">
                  <svg viewBox="0 0 16 16" fill="none">
                    <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </span>
              <span className="privacy-checkbox-text">
                Je fais partie de l'accompagnement 1:1 avec Manaël
              </span>
            </label>
          </div>

          {/* ═══ SECTION 2: Bilan de la semaine ═══ */}
          <div className="bilan-section-divider">
            <span className="bilan-section-icon" aria-hidden="true">📋</span>
            <span>Bilan de la semaine</span>
          </div>

          {/* Travail effectué */}
          <motion.div
            className="form-group"
            id="group-workDone"
            animate={shakeField === 'workDone' ? { x: [-6, 6, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <label id="bilan-label-workDone">Travail effectué cette semaine <span className="required">*</span></label>
            <div className="bilan-chips-grid" role="group" aria-labelledby="bilan-label-workDone">
              {WORK_CHIPS.map(chip => (
                <button
                  key={chip.value}
                  type="button"
                  className={`bilan-chip${formData.workDone.includes(chip.value) ? ' selected' : ''}`}
                  onClick={() => toggleChip('workDone', chip.value)}
                  aria-pressed={formData.workDone.includes(chip.value)}
                >
                  {chip.label}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Précisions : quelles poses, combien de séances, quelles vidéos regardées..."
              rows="2"
              value={formData.workDoneDetails}
              onChange={(e) => updateField('workDoneDetails', e.target.value)}
              aria-label="Précisions sur le travail effectué"
            />
          </motion.div>

          {/* Difficultés rencontrées */}
          <div className="form-group" id="group-difficulties">
            <label id="bilan-label-difficulties">Difficultés rencontrées</label>
            <div className="bilan-chips-grid" role="group" aria-labelledby="bilan-label-difficulties">
              {DIFFICULTY_CHIPS.map(chip => (
                <button
                  key={chip.value}
                  type="button"
                  className={`bilan-chip${formData.difficulties.includes(chip.value) ? ' selected' : ''}`}
                  onClick={() => toggleChip('difficulties', chip.value)}
                  aria-pressed={formData.difficulties.includes(chip.value)}
                >
                  {chip.label}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Décris tes difficultés en détail..."
              rows="2"
              value={formData.difficultiesDetails}
              onChange={(e) => updateField('difficultiesDetails', e.target.value)}
              aria-label="Précisions sur les difficultés"
            />
          </div>

          {/* Zones de mobilité limitées */}
          <div className="form-group" id="group-mobilityZones">
            <label id="bilan-label-mobility">Zones de mobilité limitées</label>
            <div className="bilan-chips-grid" role="group" aria-labelledby="bilan-label-mobility">
              {MOBILITY_ZONES.map(chip => (
                <button
                  key={chip.value}
                  type="button"
                  className={`bilan-chip${formData.mobilityZones.includes(chip.value) ? ' selected' : ''}`}
                  onClick={() => toggleChip('mobilityZones', chip.value)}
                  aria-pressed={formData.mobilityZones.includes(chip.value)}
                >
                  {chip.label}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Précisions sur tes limitations de mobilité..."
              rows="2"
              value={formData.mobilityDetails}
              onChange={(e) => updateField('mobilityDetails', e.target.value)}
              aria-label="Précisions sur la mobilité"
            />
          </div>

          {/* ═══ SECTION 3: Avancement ═══ */}
          <div className="bilan-section-divider">
            <span className="bilan-section-icon" aria-hidden="true">📈</span>
            <span>Avancement</span>
          </div>

          {/* Présentation individuelle */}
          <div className="form-group">
            <label htmlFor="bilan-presentationProgress">Avancement — Présentation individuelle</label>
            <div className="bilan-select-wrapper">
              <select
                id="bilan-presentationProgress"
                className="bilan-select"
                value={formData.presentationProgress}
                onChange={(e) => updateField('presentationProgress', e.target.value)}
              >
                {PROGRESS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <svg className="bilan-select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          {/* Routine libre */}
          <div className="form-group">
            <label htmlFor="bilan-routineProgress">Avancement — Routine libre</label>
            <div className="bilan-select-wrapper">
              <select
                id="bilan-routineProgress"
                className="bilan-select"
                value={formData.routineProgress}
                onChange={(e) => updateField('routineProgress', e.target.value)}
              >
                {PROGRESS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <svg className="bilan-select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          {/* ═══ SECTION 4: Objectif ═══ */}
          <div className="bilan-section-divider">
            <span className="bilan-section-icon" aria-hidden="true">🎯</span>
            <span>Objectif</span>
          </div>

          {/* Objectif semaine prochaine */}
          <motion.div
            className="form-group"
            id="group-nextWeekGoal"
            animate={shakeField === 'nextWeekGoal' ? { x: [-6, 6, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <label htmlFor="bilan-nextWeekGoal">Objectif que tu souhaites atteindre la semaine prochaine <span className="required">*</span></label>
            <textarea
              id="bilan-nextWeekGoal"
              name="nextWeekGoal"
              placeholder="Ex: Maîtriser la front double biceps, améliorer mes transitions de quarts de tour..."
              rows="3"
              required
              value={formData.nextWeekGoal}
              onChange={(e) => updateField('nextWeekGoal', e.target.value)}
            />
          </motion.div>

          {/* Submit */}
          <div className="form-actions">
            <motion.button
              type="button"
              className="btn-secondary-gold"
              onClick={onBack}
              whileHover={{ y: -1 }}
              whileTap={{ y: 0 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Retour</span>
            </motion.button>
            <motion.button
              type="submit"
              className="btn-submit"
              whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(212,168,67,0.4)' }}
              whileTap={{ y: 0 }}
            >
              <span>Générer ma Roadmap</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </main>
  );
}
