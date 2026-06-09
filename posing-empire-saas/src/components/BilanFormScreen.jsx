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
  { value: 1, label: 'Débutant' },
  { value: 2, label: 'Intermédiaire' },
  { value: 3, label: 'Avancé' },
  { value: 4, label: 'Expert' },
];

const MORPHOLOGIES = [
  {
    value: 'X',
    label: 'Physique en X',
    desc: 'Épaules et hanches alignées, taille fine',
    svg: (
      <svg viewBox="0 0 40 60" width="24" height="36" fill="none" stroke="currentColor" className="morphology-svg">
        <path d="M10 12 L30 12 L12 48 L28 48 Z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" y1="30" x2="28" y2="30" strokeWidth="1" strokeDasharray="2,2" strokeOpacity="0.5" />
      </svg>
    )
  },
  {
    value: 'H',
    label: 'Physique en H',
    desc: 'Épaules, taille et hanches alignées',
    svg: (
      <svg viewBox="0 0 40 60" width="24" height="36" fill="none" stroke="currentColor" className="morphology-svg">
        <rect x="11" y="12" width="18" height="36" rx="2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="11" y1="30" x2="29" y2="30" strokeWidth="1" strokeDasharray="2,2" strokeOpacity="0.5" />
      </svg>
    )
  },
  {
    value: 'V',
    label: 'Physique en V',
    desc: 'Épaules larges, hanches et taille étroites',
    svg: (
      <svg viewBox="0 0 40 60" width="24" height="36" fill="none" stroke="currentColor" className="morphology-svg">
        <polygon points="8,12 32,12 20,48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="14" y1="30" x2="26" y2="30" strokeWidth="1" strokeDasharray="2,2" strokeOpacity="0.5" />
      </svg>
    )
  },
  {
    value: 'O',
    label: 'Physique en O',
    desc: 'Silhouette ronde, taille peu définie',
    svg: (
      <svg viewBox="0 0 40 60" width="24" height="36" fill="none" stroke="currentColor" className="morphology-svg">
        <ellipse cx="20" cy="30" rx="12" ry="18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="8" y1="30" x2="32" y2="30" strokeWidth="1" strokeDasharray="2,2" strokeOpacity="0.5" />
      </svg>
    )
  }
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

// ── Bilan-specific constants ──
const WORK_CHIPS = [
  { value: 'poses', label: 'Poses imposées' },
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
    categories: savedProfile?.categories || (savedProfile?.category ? [savedProfile.category] : []),
    categoryOther: savedProfile?.categoryOther || '',
    federations: savedProfile?.federations || (savedProfile?.federation ? [savedProfile.federation] : []),
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
    isAccompagnement: false,
    morphology: savedProfile?.morphology || '',
    pointsFortsPhysiqueCustom: savedProfile?.pointsFortsPhysiqueCustom || (savedProfile?.pointsFortsCustom ? savedProfile.pointsFortsCustom : ''),
    pointsFortsPosingCustom: savedProfile?.pointsFortsPosingCustom || '',
    pointsFaiblesCustom: savedProfile?.pointsFaiblesCustom || '',
    stageDate: savedProfile?.stageDate || '',
  });

  const [shakeField, setShakeField] = useState(null);
  const [showCalendarPopover, setShowCalendarPopover] = useState(false);
  const [calendarCoords, setCalendarCoords] = useState({ top: 0, left: 0, width: 290 });
  const calendarBtnRef = useRef(null);

  const submitBtnRef = useMagnetic({ strength: 0.3, textStrength: 0.15, maxTravelX: 6, maxTravelY: 10 });
  const backBtnRef = useMagnetic({ strength: 0.3, textStrength: 0.15, maxTravelX: 12, maxTravelY: 12 });
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

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const animateChipClick = useCallback((target) => {
    if (!target) return;
    gsap.fromTo(target,
      { scale: 0.94 },
      { scale: 1, duration: 0.35, ease: 'back.out(2.2)', overwrite: 'auto' }
    );
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
        next.federations = ['Aucune'];
      } else {
        if (prev.categories && prev.categories.includes('Non compétiteur')) {
          next.federations = [];
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

  const toggleChip = useCallback((field, value, e) => {
    if (e && e.currentTarget) animateChipClick(e.currentTarget);
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }));
  }, [animateChipClick]);

  const triggerShake = useCallback((field) => {
    setShakeField(field);
    setTimeout(() => setShakeField(null), 500);
    const el = document.getElementById(`group-${field}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.fullname.trim()) { triggerShake('fullname'); return; }
    if (!formData.categories || formData.categories.length === 0) { triggerShake('category'); return; }
    if (formData.categories.includes('Autre') && !formData.categoryOther.trim()) { triggerShake('categoryOther'); return; }

    const isCompetitorVal = formData.categories && formData.categories.length > 0 && !formData.categories.includes('Non compétiteur');
    if (isCompetitorVal) {
      if (!formData.federations || formData.federations.length === 0) { triggerShake('federation'); return; }
      if (formData.federations.includes('Autre') && !formData.federationOther.trim()) { triggerShake('federationOther'); return; }
    }

    if (formData.level === null) { triggerShake('level'); return; }
    if (!formData.morphology) { triggerShake('morphology'); return; }
    if (!formData.weekNumber || formData.weekNumber < 1) { triggerShake('weekNumber'); return; }
    if (formData.workDone.length === 0 && !formData.workDoneDetails.trim()) { triggerShake('workDone'); return; }
    if (!formData.pointsFortsPhysiqueCustom.trim()) { triggerShake('pointsFortsPhysiqueCustom'); return; }
    if (!formData.pointsFortsPosingCustom.trim()) { triggerShake('pointsFortsPosingCustom'); return; }
    if (!formData.pointsFaiblesCustom.trim()) { triggerShake('pointsFaiblesCustom'); return; }
    if (!formData.nextWeekGoal.trim()) { triggerShake('nextWeekGoal'); return; }

    // Validate text inputs for gibberish
    if (isGibberishText(formData.fullname)) { triggerShake('fullname'); return; }
    if (isGibberishText(formData.workDoneDetails)) { triggerShake('workDone'); return; }
    if (isGibberishText(formData.pointsFortsPhysiqueCustom)) { triggerShake('pointsFortsPhysiqueCustom'); return; }
    if (isGibberishText(formData.pointsFortsPosingCustom)) { triggerShake('pointsFortsPosingCustom'); return; }
    if (isGibberishText(formData.pointsFaiblesCustom)) { triggerShake('pointsFaiblesCustom'); return; }
    if (formData.difficultiesDetails && isGibberishText(formData.difficultiesDetails)) { triggerShake('difficulties'); return; }
    if (formData.mobilityDetails && isGibberishText(formData.mobilityDetails)) { triggerShake('mobilityZones'); return; }
    if (isGibberishText(formData.nextWeekGoal)) { triggerShake('nextWeekGoal'); return; }
    if (formData.categories.includes('Autre') && isGibberishText(formData.categoryOther)) { triggerShake('categoryOther'); return; }
    if (isCompetitorVal && formData.federations.includes('Autre') && isGibberishText(formData.federationOther)) { triggerShake('federationOther'); return; }

    // Save profile for next time
    try {
      localStorage.setItem('pe_athlete_profile', JSON.stringify({
        fullname: formData.fullname.trim(),
        categories: formData.categories,
        categoryOther: formData.categoryOther.trim(),
        federations: formData.federations,
        federationOther: formData.federationOther.trim(),
        level: formData.level,
        isAccompagnement: formData.isAccompagnement,
        morphology: formData.morphology,
        pointsFortsCustom: `Physique : ${formData.pointsFortsPhysiqueCustom.trim()}\nPosing : ${formData.pointsFortsPosingCustom.trim()}`.trim(),
        pointsFortsPhysiqueCustom: formData.pointsFortsPhysiqueCustom.trim(),
        pointsFortsPosingCustom: formData.pointsFortsPosingCustom.trim(),
        pointsFaiblesCustom: formData.pointsFaiblesCustom.trim(),
        stageDate: formData.stageDate,
      }));
    } catch { /* silent fail */ }

    const resolvedCategories = formData.categories.map(c => 
      c === 'Autre' ? (formData.categoryOther.trim() || 'Autre') : c
    );
    const resolvedFederations = !isCompetitorVal ? ['Aucune'] : formData.federations.map(f =>
      f === 'Autre' ? (formData.federationOther.trim() || 'Autre') : f
    );

    const submissionData = {
      fullname: formData.fullname.trim(),
      categories: resolvedCategories,
      category: resolvedCategories.join(' · '),
      primaryCategory: resolvedCategories[0] || 'Non compétiteur',
      federations: resolvedFederations,
      federation: resolvedFederations.join(' · '),
      primaryFederation: resolvedFederations[0] || 'Aucune',
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
      morphology: formData.morphology,
      pointsFortsCustom: `Physique : ${formData.pointsFortsPhysiqueCustom.trim()}\nPosing : ${formData.pointsFortsPosingCustom.trim()}`.trim(),
      pointsFortsPhysiqueCustom: formData.pointsFortsPhysiqueCustom.trim(),
      pointsFortsPosingCustom: formData.pointsFortsPosingCustom.trim(),
      pointsFaiblesCustom: formData.pointsFaiblesCustom.trim(),
      stageDate: formData.stageDate,
    };

    // Envoi en arrière-plan vers Supabase + Google Sheets (non bloquant)
    submitData('bilan', submissionData).catch(() => {});

    onSubmit(submissionData);
  };

  const isCompetitor = formData.categories && formData.categories.length > 0 && !formData.categories.includes('Non compétiteur');

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

          {/* Catégories */}
          <motion.div
            className="form-group"
            id="group-category"
            animate={shakeField === 'category' ? { x: [-6, 6, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <label id="bilan-label-category">Catégories (Sélectionne jusqu'à 3) <span className="required">*</span></label>
            <div className="selector-grid selector-grid-2x2" role="group" aria-labelledby="bilan-label-category">
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
                    <span className="selector-icon" aria-hidden="true">{cat.icon}</span>
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
                  <AnimatePresence>
                    {isGibberishText(formData.categoryOther) && (
                      <motion.span
                        className="error-text"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ color: '#ff4d4d', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}
                      >
                        Veuillez écrire une catégorie correcte.
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Fédérations (competitors only) */}
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
                <label id="bilan-label-federation">Fédérations (Multi-sélection) <span className="required">*</span></label>
                <div className="selector-grid selector-grid-fed" role="group" aria-labelledby="bilan-label-federation">
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
                      <AnimatePresence>
                        {isGibberishText(formData.federationOther) && (
                          <motion.span
                            className="error-text"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ color: '#ff4d4d', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}
                          >
                            Veuillez écrire une fédération correcte.
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Date de la compétition */}
          <AnimatePresence mode="wait">
            {isCompetitor && (
              <motion.div
                className="form-group"
                id="group-stageDate"
                key="stageDate-group"
                initial={{ opacity: 0, y: -10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  marginBottom: '1.5rem',
                  x: shakeField === 'stageDate' ? [-6, 6, -6, 6, 0] : 0
                }}
                transition={{ duration: 0.3 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <label>Date de ta prochaine compétition (Optionnel, permet de calculer le décompte S-X)</label>
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

          {/* Morphologie */}
          <motion.div
            className="form-group"
            id="group-morphology"
            animate={shakeField === 'morphology' ? { x: [-6, 6, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <label id="bilan-label-morphology">Type de Morphologie <span className="required">*</span></label>
            <div className="selector-grid selector-grid-2x2" role="group" aria-labelledby="bilan-label-morphology">
              {MORPHOLOGIES.map(morph => {
                const isSelected = formData.morphology === morph.value;
                return (
                  <button
                    key={morph.value}
                    type="button"
                    className={`selector-btn selector-btn-morph${isSelected ? ' selected' : ''}`}
                    onClick={(e) => {
                      animateChipClick(e.currentTarget);
                      updateField('morphology', morph.value);
                    }}
                    aria-pressed={isSelected}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0.5rem', gap: '0.375rem', minHeight: '120px' }}
                  >
                    {morph.svg}
                    <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{morph.label}</span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.7, textAlign: 'center', lineHeight: '1.2' }}>{morph.desc}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Semaine N° */}
          <motion.div
            className="form-group"
            id="group-weekNumber"
            animate={shakeField === 'weekNumber' ? { x: [-6, 6, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <label htmlFor="bilan-weekNumber">Semaine N° (depuis l'adhésion au Skool) <span className="required">*</span></label>
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
                  onClick={(e) => toggleChip('workDone', chip.value, e)}
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
            <AnimatePresence>
              {isGibberishText(formData.workDoneDetails) && (
                <motion.span
                  className="error-text"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ color: '#ff4d4d', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}
                >
                  Veuillez écrire une phrase correcte.
                </motion.span>
              )}
            </AnimatePresence>
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
                  onClick={(e) => toggleChip('difficulties', chip.value, e)}
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
            <AnimatePresence>
              {isGibberishText(formData.difficultiesDetails) && (
                <motion.span
                  className="error-text"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ color: '#ff4d4d', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}
                >
                  Veuillez écrire une phrase correcte.
                </motion.span>
              )}
            </AnimatePresence>
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
                  onClick={(e) => toggleChip('mobilityZones', chip.value, e)}
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
            <AnimatePresence>
              {isGibberishText(formData.mobilityDetails) && (
                <motion.span
                  className="error-text"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ color: '#ff4d4d', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}
                >
                  Veuillez écrire une phrase correcte.
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Points forts physiques custom */}
          <motion.div
            className="form-group"
            id="group-pointsFortsPhysiqueCustom"
            animate={shakeField === 'pointsFortsPhysiqueCustom' ? { x: [-6, 6, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <label htmlFor="bilan-pointsFortsPhysiqueCustom">Décris tes points forts physiques du moment <span className="required">*</span></label>
            <textarea
              id="bilan-pointsFortsPhysiqueCustom"
              name="pointsFortsPhysiqueCustom"
              placeholder="Ex: Bonne largeur d'épaules, dos bien dessiné, définition musculaire..."
              rows="2"
              required
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
            <label htmlFor="bilan-pointsFortsPosingCustom">Décris tes points forts posing du moment <span className="required">*</span></label>
            <textarea
              id="bilan-pointsFortsPosingCustom"
              name="pointsFortsPosingCustom"
              placeholder="Ex: Bonne présence scénique, fluidité des transitions, tenue des poses..."
              rows="2"
              required
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
            <label htmlFor="bilan-pointsFaiblesCustom">Décris tes points faibles du moment (Physique / Posing) <span className="required">*</span></label>
            <textarea
              id="bilan-pointsFaiblesCustom"
              name="pointsFaiblesCustom"
              placeholder="Ex: Difficulté à ouvrir le grand dorsal de dos, contrôle sangle abdominale..."
              rows="2"
              required
              value={formData.pointsFaiblesCustom}
              onChange={(e) => updateField('pointsFaiblesCustom', e.target.value)}
            />
          </motion.div>

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
            <AnimatePresence>
              {isGibberishText(formData.nextWeekGoal) && (
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

          {/* Submit */}
          <div className="form-actions">
            <button
              ref={backBtnRef}
              type="button"
              className="btn-secondary-gold"
              onClick={onBack}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Retour</span>
            </button>
            <button
              ref={submitBtnRef}
              type="submit"
              className="btn-primary-gold btn-submit"
            >
              <span>Générer ma Roadmap</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </BorderGlow>
      </motion.div>
    </main>
  );
}
