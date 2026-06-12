import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundGrid from './BackgroundGrid';
import gsap from 'gsap';
import useMagnetic from '../hooks/useMagnetic';
import useTilt from '../hooks/useTilt';
import BorderGlow from './reactbits/BorderGlow';

import Calendar from './reactbits/Calendar';
import { submitData } from '../utils/submitData';

const CATEGORIES = [
  { value: "Men's Physique", label: "Men's Physique" },
  { value: 'Classic Physique', label: 'Classic Physique' },
  { value: 'Bodybuilding', label: 'Bodybuilding' },
  { value: 'Non compétiteur', label: 'Non compétiteur' },
  { value: 'Autre', label: 'Autre...' },
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
  { value: '5 min', label: '5 min' },
  { value: '10 min', label: '10 min' },
  { value: '15-30 min', label: '15-30 min' },
  { value: '30+ min', label: '30+ min' },
];

const LEVELS = [
  { value: 1, label: 'Débutant' },
  { value: 2, label: 'Intermédiaire' },
  { value: 3, label: 'Avancé' },
  { value: 4, label: 'Expert' },
];

function isGibberishText(text) {
  if (!text || !text.trim()) return false;
  
  const val = text.trim();
  const words = val.split(/[^a-zA-Zà-üÀ-Ü\d']+/).filter(w => w.length > 0);
  if (words.length === 0) return false;
  
  const whitelist2 = ['mr', 'dr', 'vs', 'st', 'ms', 'pr', 'kd', 'dj', 'mp', 'cp', 'bb'];
  
  for (const word of words) {
    const len = word.length;
    const lower = word.toLowerCase();
    const vowelMatch = word.match(/[aeiouyâäéèêëîïôöûüœæ]/gi);
    const vowelCount = vowelMatch ? vowelMatch.length : 0;
    
    // 1. 2-letter word without vowels (unless whitelisted)
    if (len === 2 && vowelCount === 0 && !whitelist2.includes(lower)) {
      return true;
    }
    
    // 2. 3+ letter word without vowels
    if (len >= 3 && vowelCount === 0) {
      return true;
    }
    
    // 3. 6+ letter word with only 1 vowel, unless it matches sport/strict/struct
    if (len >= 6 && vowelCount <= 1 && !/sport|strict|struct/i.test(lower)) {
      return true;
    }
    
    // 4. 5+ consecutive consonants
    if (/[bcdfghjklmnpqrstvwxz]{5,}/i.test(lower)) {
      return true;
    }
    
    // 5. Triple repeating characters
    if (/(.)\1\1/.test(lower)) {
      return true;
    }
  }
  
  return false;
}

export default function FormScreen({ onSubmit }) {
  const savedProfile = (() => {
    try {
      const raw = localStorage.getItem('pe_athlete_profile');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  const [formData, setFormData] = useState({
    fullname: savedProfile?.fullname || '',
    categories: savedProfile?.categories || [],
    categoryOther: savedProfile?.categoryOther || '',
    federations: savedProfile?.federations || [],
    federationOther: savedProfile?.federationOther || '',
    stageIntent: savedProfile?.stageIntent || '', // 'has_stage' | 'undecided' | 'no_stage'
    hasShorts: savedProfile?.hasShorts || '', // 'yes' | 'no'
    level: savedProfile?.level ?? null,
    objectives: savedProfile?.objectives || '',
    selectedProblems: savedProfile?.selectedProblems || [], // Array of physical difficulty keys
    problems: savedProfile?.problems || '',
    time: savedProfile?.time || '',
    needs: savedProfile?.needs || [],
    morphology: savedProfile?.morphology || '',
    pointsFortsPhysiqueCustom: savedProfile?.pointsFortsPhysiqueCustom || (savedProfile?.pointsFortsCustom ? savedProfile.pointsFortsCustom : ''),
    pointsFortsPosingCustom: savedProfile?.pointsFortsPosingCustom || '',
    pointsFaiblesCustom: savedProfile?.pointsFaiblesCustom || '',
    stageDate: savedProfile?.stageDate || '',
  });

  const [shakeField, setShakeField] = useState(null);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(null); // 'cgu' | 'rgpd' | null
  const [showCalendarPopover, setShowCalendarPopover] = useState(false);
  const [calendarCoords, setCalendarCoords] = useState({ top: 0, left: 0, width: 290 });
  const calendarBtnRef = useRef(null);

  const submitBtnRef = useMagnetic({ strength: 0.3, textStrength: 0.15, maxTravelX: 6, maxTravelY: 10 });
  const cardRef = useTilt({ maxTilt: 2, scale: 1.002 });

  useEffect(() => {
    gsap.fromTo('.form-header > *', 
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
    );
    gsap.fromTo('.form-card', 
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
      0.2
    );
    gsap.fromTo('.form-group',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' },
      0.3
    );
  }, []);

  useEffect(() => {
    if (formData.level === null) return;
    gsap.fromTo('.level-dot.active .dot-circle',
      { scale: 0.8 },
      { scale: 1, duration: 0.45, ease: 'back.out(2.5)', overwrite: 'auto' }
    );
  }, [formData.level]);

  useEffect(() => {
    if (!showLegalModal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowLegalModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLegalModal]);

  const animateChipClick = useCallback((target) => {
    if (!target) return;
    gsap.fromTo(target,
      { scale: 0.94 },
      { scale: 1, duration: 0.35, ease: 'back.out(2.2)', overwrite: 'auto' }
    );
  }, []);

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleCategoryToggle = useCallback((val, e) => {
    if (e && e.currentTarget) animateChipClick(e.currentTarget);
    setFormData(prev => {
      let nextCategories = prev.categories || [];
      if (val === 'Non compétiteur') {
        nextCategories = ['Non compétiteur'];
      } else {
        nextCategories = nextCategories.filter(c => c !== 'Non compétiteur');
        if (nextCategories.includes(val)) {
          nextCategories = nextCategories.filter(c => c !== val);
        } else {
          if (nextCategories.length < 3) {
            nextCategories = [...nextCategories, val];
          } else {
            return prev;
          }
        }
      }

      const next = { ...prev, categories: nextCategories };
      if (!nextCategories.includes('Autre')) {
        next.categoryOther = '';
      }

      if (nextCategories.includes('Non compétiteur') || nextCategories.length === 0) {
        next.stageIntent = 'no_stage';
        next.federations = ['Aucune'];
        next.hasShorts = 'yes';
      } else {
        if (prev.categories && prev.categories.includes('Non compétiteur')) {
          next.stageIntent = '';
          next.federations = [];
          next.hasShorts = '';
        }
      }
      return next;
    });
  }, [animateChipClick]);

  const handleFederationToggle = useCallback((val, e) => {
    if (e && e.currentTarget) animateChipClick(e.currentTarget);
    setFormData(prev => {
      let nextFeds = prev.federations || [];
      if (nextFeds.includes(val)) {
        nextFeds = nextFeds.filter(f => f !== val);
      } else {
        nextFeds = [...nextFeds, val];
      }
      const next = { ...prev, federations: nextFeds };
      if (!nextFeds.includes('Autre')) {
        next.federationOther = '';
      }
      return next;
    });
  }, [animateChipClick]);

  const handleStageIntentChange = useCallback((val, e) => {
    if (e && e.currentTarget) animateChipClick(e.currentTarget);
    setFormData(prev => {
      const next = { ...prev, stageIntent: val };
      if (val === 'no_stage') {
        next.federations = ['Aucune'];
        next.hasShorts = 'yes';
      } else {
        if (prev.stageIntent === 'no_stage') {
          next.federations = [];
          next.hasShorts = '';
        }
      }
      return next;
    });
  }, [animateChipClick]);

  const toggleProblem = useCallback((probValue, e) => {
    if (e && e.currentTarget) animateChipClick(e.currentTarget);
    setFormData(prev => ({
      ...prev,
      selectedProblems: prev.selectedProblems.includes(probValue)
        ? prev.selectedProblems.filter(p => p !== probValue)
        : [...prev.selectedProblems, probValue]
    }));
  }, [animateChipClick]);

  const toggleNeed = useCallback((need, e) => {
    if (e && e.currentTarget) {
      const card = e.currentTarget.closest('.checkbox-card');
      if (card) animateChipClick(card);
    }
    setFormData(prev => ({
      ...prev,
      needs: prev.needs.includes(need)
        ? prev.needs.filter(n => n !== need)
        : [...prev.needs, need],
    }));
  }, [animateChipClick]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required selectors
    if (!formData.categories || formData.categories.length === 0) { triggerShake('category'); return; }
    if (formData.categories.includes('Autre') && !formData.categoryOther.trim()) { triggerShake('categoryOther'); return; }

    const isCompetitor = !formData.categories.includes('Non compétiteur');

    if (isCompetitor) {
      if (!formData.stageIntent) { triggerShake('stageIntent'); return; }

      const needsFedAndShorts = formData.stageIntent !== 'no_stage';
      if (needsFedAndShorts) {
        if (!formData.federations || formData.federations.length === 0) { triggerShake('federation'); return; }
        if (formData.federations.includes('Autre') && !formData.federationOther.trim()) { triggerShake('federationOther'); return; }
        if (!formData.hasShorts) { triggerShake('hasShorts'); return; }
      }
      if (formData.stageIntent === 'has_stage' && !formData.stageDate) { triggerShake('stageDate'); return; }
    }

    if (formData.level === null) { triggerShake('level'); return; }
    if (!formData.time) { triggerShake('time'); return; }

    if (isGibberishText(formData.fullname)) { triggerShake('fullname'); return; }
    if (isGibberishText(formData.objectives)) { triggerShake('objectives'); return; }
    if (isGibberishText(formData.problems)) { triggerShake('problems'); return; }
    if (formData.pointsFortsPhysiqueCustom && isGibberishText(formData.pointsFortsPhysiqueCustom)) { triggerShake('pointsFortsPhysiqueCustom'); return; }
    if (formData.pointsFortsPosingCustom && isGibberishText(formData.pointsFortsPosingCustom)) { triggerShake('pointsFortsPosingCustom'); return; }
    if (formData.pointsFaiblesCustom && isGibberishText(formData.pointsFaiblesCustom)) { triggerShake('pointsFaiblesCustom'); return; }
    if (formData.categories.includes('Autre') && isGibberishText(formData.categoryOther)) { triggerShake('categoryOther'); return; }
    if (isCompetitor && formData.stageIntent !== 'no_stage' && formData.federations.includes('Autre') && isGibberishText(formData.federationOther)) { triggerShake('federationOther'); return; }

    if (!consentAccepted) { triggerShake('consent'); return; }

    const resolvedCategories = formData.categories.map(c => 
      c === 'Autre' ? (formData.categoryOther.trim() || 'Autre') : c
    );
    const primaryCategory = resolvedCategories[0] || 'Non compétiteur';

    const resolvedFederations = isCompetitor && formData.stageIntent !== 'no_stage'
      ? formData.federations.map(f => f === 'Autre' ? (formData.federationOther.trim() || 'Autre') : f)
      : ['Aucune'];
    const primaryFederation = resolvedFederations[0] || 'Aucune';

    // Collect data
    const submissionData = {
      fullname: formData.fullname.trim(),
      categories: resolvedCategories,
      category: resolvedCategories.join(' · '),
      primaryCategory,
      categoryOther: formData.categoryOther.trim(),
      federations: resolvedFederations,
      federation: resolvedFederations.join(' · '),
      primaryFederation,
      federationOther: formData.federationOther.trim(),
      stageIntent: formData.stageIntent,
      hasShorts: formData.hasShorts,
      level: formData.level,
      objectives: formData.objectives.trim(),
      selectedProblems: formData.selectedProblems,
      problems: formData.problems.trim(),
      time: formData.time,
      needs: formData.needs,
      morphology: formData.morphology,
      pointsFortsCustom: (formData.pointsFortsPhysiqueCustom.trim() || formData.pointsFortsPosingCustom.trim()) 
        ? `Physique : ${formData.pointsFortsPhysiqueCustom.trim()}\nPosing : ${formData.pointsFortsPosingCustom.trim()}`.trim()
        : '',
      pointsFortsPhysiqueCustom: formData.pointsFortsPhysiqueCustom.trim(),
      pointsFortsPosingCustom: formData.pointsFortsPosingCustom.trim(),
      pointsFaiblesCustom: formData.pointsFaiblesCustom.trim(),
      stageDate: formData.stageDate,
    };

    // Save profile to localStorage for pre-populating Bilan and preserving data
    try {
      localStorage.setItem('pe_athlete_profile', JSON.stringify({
        fullname: formData.fullname.trim(),
        categories: formData.categories,
        categoryOther: formData.categoryOther.trim(),
        federations: resolvedFederations,
        federationOther: formData.federationOther.trim(),
        level: formData.level,
        morphology: formData.morphology,
        pointsFortsCustom: (formData.pointsFortsPhysiqueCustom.trim() || formData.pointsFortsPosingCustom.trim()) 
          ? `Physique : ${formData.pointsFortsPhysiqueCustom.trim()}\nPosing : ${formData.pointsFortsPosingCustom.trim()}`.trim()
          : '',
        pointsFortsPhysiqueCustom: formData.pointsFortsPhysiqueCustom.trim(),
        pointsFortsPosingCustom: formData.pointsFortsPosingCustom.trim(),
        pointsFaiblesCustom: formData.pointsFaiblesCustom.trim(),
        stageDate: formData.stageDate,
        stageIntent: formData.stageIntent,
      }));
    } catch { /* silent fail */ }

    // Envoi en arrière-plan vers Supabase + Google Sheets (non bloquant)
    submitData('onboarding', submissionData).catch(() => {});

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

        {/* Form Card with BorderGlow */}
        <BorderGlow
          as="form"
          ref={cardRef}
          className="form-card"
          autoComplete="off"
          onSubmit={handleSubmit}
          edgeSensitivity={30}
          glowColor="43 75 55"
          backgroundColor="#0a0a0a"
          borderRadius={20}
          glowRadius={25}
          glowIntensity={0.6}
          fillOpacity={0.15}
          coneSpread={25}
          colors={['#FFD54F', '#D4A843', '#B8942D']}
        >
          {/* <div className="form-gold-line"></div> */}

          {/* Nom & Prénom */}
          <motion.div
            className="form-group"
            id="group-fullname"
            animate={shakeField === 'fullname' ? { x: [-6, 6, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <label htmlFor="fullname">Nom & Prénom <span className="required">*</span></label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              placeholder="Ex: Manaël Dupont"
              required
              autoComplete="name"
              value={formData.fullname}
              onChange={(e) => updateField('fullname', e.target.value)}
            />
            <AnimatePresence>
              {isGibberishText(formData.fullname) && (
                <motion.span
                  className="error-text"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ color: '#ff4d4d', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}
                >
                  Veuillez écrire un nom correct (pas de texte aléatoire).
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Catégorie */}
          <motion.div
            className="form-group"
            id="group-category"
            animate={shakeField === 'category' ? { x: [-6, 6, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <label id="label-category">Catégories (Sélectionne jusqu'à 3) <span className="required">*</span></label>
            <div className="selector-grid selector-grid-2x2" role="group" aria-labelledby="label-category">
              {CATEGORIES.map(cat => {
                const isSelected = formData.categories.includes(cat.value);
                return (
                  <motion.button
                    key={cat.value}
                    type="button"
                    className={`selector-btn${isSelected ? ' selected' : ''}`}
                    onClick={(e) => handleCategoryToggle(cat.value, e)}
                    aria-pressed={isSelected}
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{cat.label}</span>
                  </motion.button>
                );
              })}
            </div>
            <AnimatePresence>
              {formData.categories.includes('Autre') && (
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
                    aria-label="Précise ta catégorie"
                    value={formData.categoryOther}
                    onChange={(e) => updateField('categoryOther', e.target.value)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Projet de scène / Compétition */}
          <AnimatePresence mode="wait">
            {formData.categories && formData.categories.length > 0 && !formData.categories.includes('Non compétiteur') && (
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
                  {STAGE_INTENTS.map(opt => {
                    const isSelected = formData.stageIntent === opt.value;
                    return (
                      <motion.button
                        key={opt.value}
                        type="button"
                        className={`selector-btn selector-btn-sm${isSelected ? ' selected' : ''}`}
                        onClick={(e) => handleStageIntentChange(opt.value, e)}
                        aria-pressed={isSelected}
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        {opt.label}
                      </motion.button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {formData.stageIntent === 'has_stage' && (
                    <motion.div
                      id="group-stageDate"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0, x: shakeField === 'stageDate' ? [-6, 6, -6, 6, 0] : 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginTop: '1rem' }}
                    >
                      <label style={{ fontSize: '0.85rem', color: '#ccc' }}>Date de la compétition <span className="required">*</span></label>
                      <button
                        ref={calendarBtnRef}
                        type="button"
                        className="calendar-trigger-btn"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setCalendarCoords({
                            top: rect.bottom,
                            left: rect.left,
                            width: rect.width
                          });
                          setShowCalendarPopover(prev => !prev);
                        }}
                        style={{
                          color: formData.stageDate ? '#FFF' : '#666'
                        }}
                      >
                        <span>
                          {formData.stageDate 
                            ? new Date(formData.stageDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                            : 'Sélectionner une date...'}
                        </span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6, color: '#D4A843' }}>
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </button>
                      {showCalendarPopover && createPortal(
                        <div
                          className="calendar-portal-backdrop"
                          onClick={() => setShowCalendarPopover(false)}
                          style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 9998,
                            background: 'transparent'
                          }}
                        >
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              position: 'fixed',
                              zIndex: 9999,
                              top: calendarCoords.top + 8,
                              left: calendarCoords.left,
                              width: calendarCoords.width,
                              display: 'flex',
                              justifyContent: 'center'
                            }}
                          >
                            <Calendar
                              selected={formData.stageDate ? new Date(formData.stageDate) : null}
                              onSelect={(date) => {
                                const y = date.getFullYear();
                                const m = String(date.getMonth() + 1).padStart(2, '0');
                                const d = String(date.getDate()).padStart(2, '0');
                                updateField('stageDate', `${y}-${m}-${d}`);
                                setShowCalendarPopover(false);
                              }}
                            />
                          </motion.div>
                        </div>,
                        document.body
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fédération */}
          <AnimatePresence mode="wait">
            {formData.categories && formData.categories.length > 0 && !formData.categories.includes('Non compétiteur') && formData.stageIntent && formData.stageIntent !== 'no_stage' && (
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
                <label id="label-federation">Fédérations (Multi-sélection) <span className="required">*</span></label>
                <div className="selector-grid selector-grid-fed" role="group" aria-labelledby="label-federation">
                  {FEDERATIONS.map(fed => {
                    const isSelected = formData.federations.includes(fed.value);
                    return (
                      <motion.button
                        key={fed.value}
                        type="button"
                        className={`selector-btn selector-btn-sm${isSelected ? ' selected' : ''}`}
                        onClick={(e) => handleFederationToggle(fed.value, e)}
                        aria-pressed={isSelected}
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {fed.label}
                      </motion.button>
                    );
                  })}
                </div>
                <AnimatePresence>
                  {formData.federations.includes('Autre') && (
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
                        aria-label="Précise ta fédération ou compétition"
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
            {formData.categories && formData.categories.length > 0 && !formData.categories.includes('Non compétiteur') && formData.stageIntent && formData.stageIntent !== 'no_stage' && (
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
                  {HAS_SHORTS.map(opt => {
                    const isSelected = formData.hasShorts === opt.value;
                    return (
                      <motion.button
                        key={opt.value}
                        type="button"
                        className={`selector-btn selector-btn-sm${isSelected ? ' selected' : ''}`}
                        onClick={(e) => {
                          animateChipClick(e.currentTarget);
                          updateField('hasShorts', opt.value);
                        }}
                        aria-pressed={isSelected}
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {opt.label}
                      </motion.button>
                    );
                  })}
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
                  animate={{ width: formData.level !== null ? `${((formData.level - 1) / 3) * 100}%` : '0%' }}
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
          <motion.div
            className="form-group"
            id="group-objectives"
            animate={shakeField === 'objectives' ? { x: [-6, 6, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <label htmlFor="objectives">Objectifs du Skool</label>
            <textarea
              id="objectives"
              name="objectives"
              placeholder="Ex: Maîtriser les mandatories, préparer ma première compétition, améliorer mes transitions..."
              rows="3"
              value={formData.objectives}
              onChange={(e) => updateField('objectives', e.target.value)}
            />
            <AnimatePresence>
              {isGibberishText(formData.objectives) && (
                <motion.span
                  className="error-text"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ color: '#ff4d4d', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}
                >
                  Veuillez écrire une phrase correcte (pas de texte aléatoire).
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Difficultés physiques */}
          <div className="form-group">
            <label id="label-selectedProblems">Difficultés ou limitations physiques (Coche toutes les options <span style={{ whiteSpace: 'nowrap' }}>concernées) :</span></label>
            <div className="problems-grid" role="group" aria-labelledby="label-selectedProblems">
              {PHYSICAL_PROBLEMS.map(prob => {
                const isSelected = formData.selectedProblems.includes(prob.value);
                return (
                  <button
                    key={prob.value}
                    type="button"
                    className={`problem-chip${isSelected ? ' selected' : ''}`}
                    onClick={(e) => toggleProblem(prob.value, e)}
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
          <motion.div
            className="form-group"
            id="group-problems"
            animate={shakeField === 'problems' ? { x: [-6, 6, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <label htmlFor="problems">Précise tes difficultés physiques (Détails complémentaires, douleurs, raideurs...)</label>
            <textarea
              id="problems"
              name="problems"
              placeholder="Ex: Douleur épaule droite lors des poses arrières, limitation mobilité omoplate, difficulté sur le vacuum, etc."
              rows="3"
              value={formData.problems}
              onChange={(e) => updateField('problems', e.target.value)}
            />
            <AnimatePresence>
              {isGibberishText(formData.problems) && (
                <motion.span
                  className="error-text"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ color: '#ff4d4d', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}
                >
                  Veuillez écrire une phrase correcte (pas de texte aléatoire).
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Points forts physiques custom */}
          <motion.div
            className="form-group"
            id="group-pointsFortsPhysiqueCustom"
            animate={shakeField === 'pointsFortsPhysiqueCustom' ? { x: [-6, 6, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <label htmlFor="pointsFortsPhysiqueCustom">Décris tes points forts physiques (Optionnel)</label>
            <textarea
              id="pointsFortsPhysiqueCustom"
              name="pointsFortsPhysiqueCustom"
              placeholder="Ex: Bonne largeur de clavicules, sangle abdominale contrôlée, dos fort..."
              rows="2"
              value={formData.pointsFortsPhysiqueCustom}
              onChange={(e) => updateField('pointsFortsPhysiqueCustom', e.target.value)}
            />
          </motion.div>

          {/* Points forts posing custom */}
          <motion.div
            className="form-group"
            id="group-pointsFortsPosingCustom"
            animate={shakeField === 'pointsFortsPosingCustom' ? { x: [-6, 6, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <label htmlFor="pointsFortsPosingCustom">Décris tes points forts posing (Optionnel)</label>
            <textarea
              id="pointsFortsPosingCustom"
              name="pointsFortsPosingCustom"
              placeholder="Ex: Bonne présence scénique, fluidité des transitions, tenue des poses..."
              rows="2"
              value={formData.pointsFortsPosingCustom}
              onChange={(e) => updateField('pointsFortsPosingCustom', e.target.value)}
            />
          </motion.div>

          {/* Points faibles custom */}
          <motion.div
            className="form-group"
            id="group-pointsFaiblesCustom"
            animate={shakeField === 'pointsFaiblesCustom' ? { x: [-6, 6, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <label htmlFor="pointsFaiblesCustom">Décris tes points faibles physiques / posing (Optionnel)</label>
            <textarea
              id="pointsFaiblesCustom"
              name="pointsFaiblesCustom"
              placeholder="Ex: Manque de volume sur les ischios, rigidité thoracique..."
              rows="2"
              value={formData.pointsFaiblesCustom}
              onChange={(e) => updateField('pointsFaiblesCustom', e.target.value)}
            />
          </motion.div>

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
                  onClick={(e) => {
                    animateChipClick(e.currentTarget);
                    updateField('time', t.value);
                  }}
                  aria-pressed={formData.time === t.value}
                  whileHover={{ scale: 1.005 }}
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
                  onChange={(e) => toggleNeed('routine_libre', e)}
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
                  onChange={(e) => toggleNeed('presentation_individuelle', e)}
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
              {/* Option Accompagnement 1:1 retirée */}
            </div>
          </div>

          {/* Submit */}
          <button
            ref={submitBtnRef}
            type="submit"
            className="btn-primary-gold btn-submit"
            id="btn-submit"
            style={{ width: '100%' }}
          >
            <span>Générer ma Roadmap personnalisée</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

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
                J'accepte les <button type="button" className="legal-btn-link" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowLegalModal('cgu'); }}>CGU</button> & la <span style={{ whiteSpace: 'nowrap' }}><button type="button" className="legal-btn-link" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowLegalModal('rgpd'); }}>Politique de Confidentialité</button>.<span className="required">&nbsp;*</span></span>
              </span>
            </label>
          </motion.div>

          <p className="form-privacy">
            Vos données de profil sont traitées de manière sécurisée pour générer votre roadmap personnalisée.
          </p>
        </BorderGlow>
      </motion.div>

      {/* Beta Suggestions Footer */}
      <div className="beta-footer">
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
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
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
                <h3 id="modal-title">{showLegalModal === 'cgu' ? "Conditions Générales d'Utilisation" : "Politique de Confidentialité (RGPD)"}</h3>
                <button
                  className="legal-modal-close"
                  onClick={() => setShowLegalModal(null)}
                  aria-label="Fermer la modal"
                >
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
