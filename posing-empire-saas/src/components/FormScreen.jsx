import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundGrid from './BackgroundGrid';

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

const STAGE_INTENTS = [
  { value: 'has_stage', label: "Oui, j'ai une compétition de prévue" },
  { value: 'undecided', label: "Je ne sais pas encore / Indécis" },
  { value: 'no_stage', label: "Non, pratique esthétique / perso (hors scène)" },
];

const HAS_SHORTS = [
  { value: 'yes', label: "Oui, j'ai déjà ma tenue" },
  { value: 'no', label: "Non, je dois encore me la procurer" },
];

const PHYSICAL_PROBLEMS = [
  { value: 'symmetry', label: 'Symétrie & équilibre général' },
  { value: 'vacuum', label: 'Contrôle abdominal / Vacuum' },
  { value: 'dorsaux', label: 'Ouverture du dos (dorsaux)' },
  { value: 'shoulders', label: 'Douleurs / Mobilité épaules' },
  { value: 'pelvis', label: 'Mobilité hanches / bassin' },
  { value: 'spine', label: 'Raideur colonne / omoplates' },
  { value: 'rotation', label: 'Rotation / Torsion du buste' },
  { value: 'legs', label: 'Activation jambes & fessiers' },
];

const TIMES = [
  { value: '15 min', label: '15 min' },
  { value: '30 min', label: '30 min' },
  { value: '45 min', label: '45 min' },
  { value: '1h+', label: '1h+' },
];

const LEVELS = [
  { value: 0, label: 'Débutant' },
  { value: 1, label: 'Novice' },
  { value: 2, label: 'Intermédiaire' },
  { value: 3, label: 'Confirmé' },
  { value: 4, label: 'Avancé' },
  { value: 5, label: 'Expert' },
];

export default function FormScreen({ onSubmit }) {
  const [formData, setFormData] = useState({
    fullname: '',
    category: '',
    categoryOther: '',
    federation: '',
    federationOther: '',
    stageIntent: '', // 'has_stage' | 'undecided' | 'no_stage'
    hasShorts: '', // 'yes' | 'no'
    level: null,
    objectives: '',
    selectedProblems: [], // Array of physical difficulty keys
    problems: '',
    time: '',
    needs: [],
  });

  const [shakeField, setShakeField] = useState(null);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(null); // 'cgu' | 'rgpd' | null

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleCategoryChange = useCallback((val) => {
    setFormData(prev => {
      const next = { ...prev, category: val };
      if (val !== 'Autre') {
        next.categoryOther = '';
      }

      if (val === 'Non compétiteur') {
        next.stageIntent = 'no_stage';
        next.federation = 'Aucune';
        next.hasShorts = 'yes';
      } else {
        if (prev.category === 'Non compétiteur') {
          next.stageIntent = '';
          next.federation = '';
          next.hasShorts = '';
        }
      }
      return next;
    });
  }, []);

  const handleStageIntentChange = useCallback((val) => {
    setFormData(prev => {
      const next = { ...prev, stageIntent: val };
      if (val === 'no_stage') {
        next.federation = 'Aucune';
        next.hasShorts = 'yes';
      } else {
        if (prev.stageIntent === 'no_stage') {
          next.federation = '';
          next.hasShorts = '';
        }
      }
      return next;
    });
  }, []);

  const toggleProblem = useCallback((probValue) => {
    setFormData(prev => ({
      ...prev,
      selectedProblems: prev.selectedProblems.includes(probValue)
        ? prev.selectedProblems.filter(p => p !== probValue)
        : [...prev.selectedProblems, probValue]
    }));
  }, []);

  const toggleNeed = useCallback((need) => {
    setFormData(prev => ({
      ...prev,
      needs: prev.needs.includes(need)
        ? prev.needs.filter(n => n !== need)
        : [...prev.needs, need],
    }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required selectors
    if (!formData.category) { triggerShake('category'); return; }
    if (formData.category === 'Autre' && !formData.categoryOther.trim()) { triggerShake('categoryOther'); return; }

    const isCompetitor = formData.category !== 'Non compétiteur';

    if (isCompetitor) {
      if (!formData.stageIntent) { triggerShake('stageIntent'); return; }

      const needsFedAndShorts = formData.stageIntent !== 'no_stage';
      if (needsFedAndShorts) {
        if (!formData.federation) { triggerShake('federation'); return; }
        if (formData.federation === 'Autre' && !formData.federationOther.trim()) { triggerShake('federationOther'); return; }
        if (!formData.hasShorts) { triggerShake('hasShorts'); return; }
      }
    }

    if (formData.level === null) { triggerShake('level'); return; }
    if (!formData.time) { triggerShake('time'); return; }
    if (!consentAccepted) { triggerShake('consent'); return; }

    // Collect data
    const submissionData = {
      fullname: formData.fullname.trim(),
      category: formData.category === 'Autre' ? (formData.categoryOther.trim() || 'Autre') : formData.category,
      categoryOther: formData.categoryOther.trim(),
      federation: formData.category === 'Non compétiteur' || formData.stageIntent === 'no_stage'
        ? 'Aucune'
        : (formData.federation === 'Autre'
          ? (formData.federationOther.trim() || 'Autre')
          : formData.federation),
      federationOther: formData.federationOther.trim(),
      stageIntent: formData.stageIntent,
      hasShorts: formData.hasShorts,
      level: formData.level,
      objectives: formData.objectives.trim(),
      selectedProblems: formData.selectedProblems,
      problems: formData.problems.trim(),
      time: formData.time,
      needs: formData.needs,
    };

    onSubmit(submissionData);
  };

  const triggerShake = (field) => {
    setShakeField(field);
    setTimeout(() => setShakeField(null), 500);

    // Scroll to the element
    const el = document.getElementById(`group-${field}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

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
            <span>Onboarding Skool · Posing Empire</span>
          </div>
          <h1 className="form-title">
            <span className="text-white-gradient">TA ROADMAP </span>
            <span className="text-gold-gradient">PERSONNALISÉE</span>
          </h1>
          <p className="form-subtitle">
            Remplis ce questionnaire en 2 minutes — on génère ta roadmap de coaching sur-mesure.
          </p>
        </div>

        {/* Form Card */}
        <form className="form-card" autoComplete="off" onSubmit={handleSubmit}>
          <div className="form-gold-line"></div>

          {/* Nom & Prénom */}
          <div className="form-group">
            <label htmlFor="fullname">Nom & Prénom <span className="required">*</span></label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              placeholder="Ex: Manaël Dupont"
              required
              value={formData.fullname}
              onChange={(e) => updateField('fullname', e.target.value)}
            />
          </div>

          {/* Catégorie */}
          <motion.div
            className="form-group"
            id="group-category"
            animate={shakeField === 'category' ? { x: [-6, 6, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <label id="label-category">Catégorie <span className="required">*</span></label>
            <div className="selector-grid selector-grid-2x2" role="group" aria-labelledby="label-category">
              {CATEGORIES.map(cat => (
                <motion.button
                  key={cat.value}
                  type="button"
                  className={`selector-btn${formData.category === cat.value ? ' selected' : ''}`}
                  onClick={() => handleCategoryChange(cat.value)}
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
                  animate={{
                    opacity: 1,
                    height: 'auto',
                    marginTop: '0.5rem',
                    x: shakeField === 'categoryOther' ? [-6, 6, -6, 6, 0] : 0
                  }}
                  exit={{ opacity: 0, height: 0, marginTop: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.25 }}
                >
                  <input
                    type="text"
                    placeholder="Précise ta catégorie..."
                    value={formData.categoryOther}
                    onChange={(e) => updateField('categoryOther', e.target.value)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Projet de scène / Compétition */}
          <AnimatePresence mode="wait">
            {formData.category && formData.category !== 'Non compétiteur' && (
              <motion.div
                className="form-group"
                id="group-stageIntent"
                key="stageIntent-group"
                initial={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                animate={{
                  opacity: 1,
                  height: 'auto',
                  marginBottom: '1.5rem',
                  x: shakeField === 'stageIntent' ? [-6, 6, -6, 6, 0] : 0
                }}
                transition={{ duration: 0.4 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
              >
                <label id="label-stageIntent">Projet de compétition / Scène <span className="required">*</span></label>
                <div className="selector-grid selector-grid-vertical" role="group" aria-labelledby="label-stageIntent">
                  {STAGE_INTENTS.map(opt => (
                    <motion.button
                      key={opt.value}
                      type="button"
                      className={`selector-btn selector-btn-sm${formData.stageIntent === opt.value ? ' selected' : ''}`}
                      onClick={() => handleStageIntentChange(opt.value)}
                      aria-pressed={formData.stageIntent === opt.value}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {opt.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fédération */}
          <AnimatePresence mode="wait">
            {formData.category && formData.category !== 'Non compétiteur' && formData.stageIntent && formData.stageIntent !== 'no_stage' && (
              <motion.div
                className="form-group"
                id="group-federation"
                key="federation-group"
                initial={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                animate={{
                  opacity: 1,
                  height: 'auto',
                  marginBottom: '1.5rem',
                  x: shakeField === 'federation' ? [-6, 6, -6, 6, 0] : 0
                }}
                transition={{ duration: 0.4 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
              >
                <label id="label-federation">Fédération <span className="required">*</span></label>
                <div className="selector-grid selector-grid-fed" role="group" aria-labelledby="label-federation">
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
                      animate={{
                        opacity: 1,
                        height: 'auto',
                        marginTop: '0.5rem',
                        x: shakeField === 'federationOther' ? [-6, 6, -6, 6, 0] : 0
                      }}
                      exit={{ opacity: 0, height: 0, marginTop: 0, overflow: 'hidden' }}
                      transition={{ duration: 0.25 }}
                    >
                      <input
                        type="text"
                        placeholder="Précise ta fédération / compétition..."
                        value={formData.federationOther}
                        onChange={(e) => updateField('federationOther', e.target.value)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tenue de scène */}
          <AnimatePresence mode="wait">
            {formData.category && formData.category !== 'Non compétiteur' && formData.stageIntent && formData.stageIntent !== 'no_stage' && (
              <motion.div
                className="form-group"
                id="group-hasShorts"
                key="hasShorts-group"
                initial={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                animate={{
                  opacity: 1,
                  height: 'auto',
                  marginBottom: '1.5rem',
                  x: shakeField === 'hasShorts' ? [-6, 6, -6, 6, 0] : 0
                }}
                transition={{ duration: 0.4 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
              >
                <label id="label-hasShorts">As-tu déjà ta tenue de scène / posing (short, slip, maillot) ? <span className="required">*</span></label>
                <div className="selector-grid selector-grid-2x2" role="group" aria-labelledby="label-hasShorts">
                  {HAS_SHORTS.map(opt => (
                    <motion.button
                      key={opt.value}
                      type="button"
                      className={`selector-btn selector-btn-sm${formData.hasShorts === opt.value ? ' selected' : ''}`}
                      onClick={() => updateField('hasShorts', opt.value)}
                      aria-pressed={formData.hasShorts === opt.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {opt.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Niveau actuel */}
          <motion.div
            className="form-group"
            id="group-level"
            animate={shakeField === 'level' ? { x: [-6, 6, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <label id="label-level">Niveau actuel en posing <span className="required">*</span></label>
            <div className="level-selector" role="group" aria-labelledby="label-level">
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

          {/* Objectifs */}
          <div className="form-group">
            <label htmlFor="objectives">Objectifs du Skool <span className="required">*</span></label>
            <textarea
              id="objectives"
              name="objectives"
              placeholder="Ex: Maîtriser les mandatories, préparer ma première compétition, améliorer mes transitions..."
              rows="3"
              required
              value={formData.objectives}
              onChange={(e) => updateField('objectives', e.target.value)}
            />
          </div>

          {/* Difficultés physiques */}
          <div className="form-group">
            <label id="label-selectedProblems">Difficultés ou limitations physiques (Coche toutes les options concernées) :</label>
            <div className="problems-grid" role="group" aria-labelledby="label-selectedProblems">
              {PHYSICAL_PROBLEMS.map(prob => {
                const isSelected = formData.selectedProblems.includes(prob.value);
                return (
                  <button
                    key={prob.value}
                    type="button"
                    className={`problem-chip${isSelected ? ' selected' : ''}`}
                    onClick={() => toggleProblem(prob.value)}
                    role="checkbox"
                    aria-checked={isSelected}
                  >
                    <span className="chip-checkbox">
                      {isSelected && (
                        <svg viewBox="0 0 16 16" fill="none" style={{ width: '10px', height: '10px', display: 'block' }}>
                          <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className="chip-label">{prob.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Problématiques */}
          <div className="form-group">
            <label htmlFor="problems">Précise tes difficultés physiques (Détails complémentaires, douleurs, raideurs...) <span className="required">*</span></label>
            <textarea
              id="problems"
              name="problems"
              placeholder="Ex: Douleur épaule droite lors des poses arrières, limitation mobilité omoplate, difficulté sur le vacuum, etc."
              rows="3"
              required
              value={formData.problems}
              onChange={(e) => updateField('problems', e.target.value)}
            />
          </div>

          {/* Temps pratique quotidien */}
          <motion.div
            className="form-group"
            id="group-time"
            animate={shakeField === 'time' ? { x: [-6, 6, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <label id="label-time">Temps de pratique quotidienne envisagé <span className="required">*</span></label>
            <div className="selector-grid selector-grid-row" role="group" aria-labelledby="label-time">
              {TIMES.map(t => (
                <motion.button
                  key={t.value}
                  type="button"
                  className={`selector-btn selector-btn-sm${formData.time === t.value ? ' selected' : ''}`}
                  onClick={() => updateField('time', t.value)}
                  aria-pressed={formData.time === t.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Besoins */}
          <div className="form-group">
            <label>Besoins spécifiques</label>
            <div className="checkbox-group">
              <label className={`checkbox-card${formData.needs.includes('routine_libre') ? ' checked' : ''}`}>
                <input
                  type="checkbox"
                  name="needs"
                  value="routine_libre"
                  checked={formData.needs.includes('routine_libre')}
                  onChange={() => toggleNeed('routine_libre')}
                />
                <span className="checkbox-visual">
                  <span className="check-icon">
                    <svg viewBox="0 0 16 16" fill="none">
                      <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </span>
                <span className="checkbox-content">
                  <span className="checkbox-title">Créer une Routine Libre</span>
                  <span className="checkbox-desc">Chorégraphie personnalisée pour les poses libres</span>
                </span>
              </label>
              <label className={`checkbox-card${formData.needs.includes('presentation_individuelle') ? ' checked' : ''}`}>
                <input
                  type="checkbox"
                  name="needs"
                  value="presentation_individuelle"
                  checked={formData.needs.includes('presentation_individuelle')}
                  onChange={() => toggleNeed('presentation_individuelle')}
                />
                <span className="checkbox-visual">
                  <span className="check-icon">
                    <svg viewBox="0 0 16 16" fill="none">
                      <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </span>
                <span className="checkbox-content">
                  <span className="checkbox-title">Créer une Présentation Individuelle</span>
                  <span className="checkbox-desc">Entrée en scène et présentation solo personnalisée</span>
                </span>
              </label>
              <label className={`checkbox-card${formData.needs.includes('accompagnement_1_1') ? ' checked' : ''}`}>
                <input
                  type="checkbox"
                  name="needs"
                  value="accompagnement_1_1"
                  checked={formData.needs.includes('accompagnement_1_1')}
                  onChange={() => toggleNeed('accompagnement_1_1')}
                />
                <span className="checkbox-visual">
                  <span className="check-icon">
                    <svg viewBox="0 0 16 16" fill="none">
                      <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </span>
                <span className="checkbox-content">
                  <span className="checkbox-title">Accompagnement 1:1</span>
                  <span className="checkbox-desc">Je suis membre de l'accompagnement premium de Manaël</span>
                </span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            className="btn-primary-gold btn-submit"
            id="btn-submit"
            whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(212,168,67,0.4)' }}
            whileTap={{ y: 0 }}
          >
            <span>Générer ma Roadmap</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.button>

          {/* RGPD Consent */}
          <motion.div
            className="form-group privacy-consent-group"
            id="group-consent"
            animate={shakeField === 'consent' ? { x: [-6, 6, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <label className="privacy-checkbox-card">
              <input
                type="checkbox"
                checked={consentAccepted}
                onChange={(e) => setConsentAccepted(e.target.checked)}
              />
              <span className="checkbox-visual">
                <span className="check-icon">
                  <svg viewBox="0 0 16 16" fill="none">
                    <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </span>
              <span className="privacy-checkbox-text">
                J'accepte les <button type="button" className="legal-btn-link" onClick={() => setShowLegalModal('cgu')}>CGU</button> et la <button type="button" className="legal-btn-link" onClick={() => setShowLegalModal('rgpd')}>Politique de Confidentialité (RGPD)</button> de Posing Empire. <span className="required">*</span>
              </span>
            </label>
          </motion.div>

          <p className="form-privacy">
            Vos données de profil sont traitées de manière sécurisée pour générer votre roadmap personnalisée.
          </p>
        </form>
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

      {/* Glassmorphism Legal Modal */}
      <AnimatePresence>
        {showLegalModal && (
          <motion.div
            className="legal-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLegalModal(null)}
          >
            <motion.div
              className="legal-modal-card"
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="legal-modal-header">
                <h3>{showLegalModal === 'cgu' ? "Conditions Générales d'Utilisation" : "Politique de Confidentialité (RGPD)"}</h3>
                <button className="legal-modal-close" onClick={() => setShowLegalModal(null)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className="legal-modal-body">
                {showLegalModal === 'cgu' ? (
                  <>
                    <h4>1. Objet</h4>
                    <p>Les présentes CGU régissent l'accès et l'utilisation de l'application d'onboarding Posing Empire permettant de générer une feuille de route d'apprentissage personnalisée.</p>
                    <h4>2. Propriété Intellectuelle</h4>
                    <p>L'ensemble des contenus (roadmaps, cursus, vidéos, guides, textes et visuels) est la propriété exclusive de Posing Empire. Toute reproduction, redistribution ou revente est strictement interdite.</p>
                    <h4>3. Responsabilité</h4>
                    <p>Les programmes et conseils techniques de pose proposés sont fournis à titre indicatif et éducatif. Posing Empire ne saurait être tenu responsable des blessures ou accidents survenant durant la pratique autonome.</p>
                    <h4>4. Modification</h4>
                    <p>Posing Empire se réserve le droit de modifier le contenu des services et les présentes conditions à tout moment.</p>
                  </>
                ) : (
                  <>
                    <h4>1. Données Collectées</h4>
                    <p>Nous collectons votre nom, catégorie de pose, niveau d'expérience, objectifs physiques, problématiques rencontrées et disponibilités, uniquement via ce formulaire.</p>
                    <h4>2. Finalité du Traitement</h4>
                    <p>Ces informations sont traitées dans le but unique d'établir votre roadmap d'apprentissage personnalisée et de faciliter votre onboarding vers notre plateforme communautaire Skool.</p>
                    <h4>3. Conservation et Sécurité</h4>
                    <p>Vos données sont conservées de manière sécurisée et ne sont jamais vendues, louées ou transmises à des tiers sans votre consentement explicite.</p>
                    <h4>4. Vos Droits (RGPD)</h4>
                    <p>Conformément à la réglementation européenne (RGPD), vous bénéficiez d'un droit d'accès, de modification et de suppression de vos données. Pour toute demande, contactez : contact@posingempire.com.</p>
                  </>
                )}
              </div>
              <div className="legal-modal-footer">
                <button className="btn-primary-gold btn-modal-close" onClick={() => setShowLegalModal(null)}>Fermer</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
