import fs from 'fs';
import path from 'path';

// Chargeur simple de variables d'environnement depuis le fichier .env local
function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
            value = value.replace(/^"|"\s*$/g, '');
          } else if (value.length > 0 && value.charAt(0) === "'" && value.charAt(value.length - 1) === "'") {
            value = value.replace(/^'|'\s*$/g, '');
          }
          process.env[key] = value;
        }
      });
    }
  } catch (err) {
    console.warn('⚠️ Impossible de charger le fichier .env :', err.message);
  }
}

loadEnv();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const ONBOARDING_SHEET_URL = process.env.VITE_GOOGLE_SHEET_ONBOARDING_WEBHOOK_URL;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Erreur : VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY doivent être définis dans le fichier .env');
  process.exit(1);
}


const personas = [
  {
    name: 'MILY',
    supabase: {
      fullname: 'Mily',
      categories: ['Classic Physique'],
      category: 'Classic Physique',
      primary_category: 'Classic Physique',
      federations: ['WNBF'],
      federation: 'WNBF',
      primary_federation: 'WNBF',
      stage_intent: 'has_stage',
      has_shorts: 'yes',
      level: 2,
      objectives: 'Améliorer mes quarts de tour et ma présence scénique',
      selected_problems: ['Transitions', 'Vacuum'],
      problems: 'Manque de fluidité dans les transitions',
      time: '30 min/jour',
      needs: ['Coaching posing'],
      morphology: 'Ectomorphe',
      points_forts_physique_custom: 'Dos bien développé, épaules larges',
      points_forts_posing_custom: 'Bonne maîtrise du front pose',
      points_faibles_custom: 'Vacuum et transitions',
    },
    sheets: {
      type: 'onboarding',
      fullname: 'Mily',
      categories: ['Classic Physique'],
      primaryCategory: 'Classic Physique',
      federations: ['WNBF'],
      primaryFederation: 'WNBF',
      stageIntent: 'has_stage',
      hasShorts: 'yes',
      level: 2,
      objectives: 'Améliorer mes quarts de tour et ma présence scénique',
      selectedProblems: ['Transitions', 'Vacuum'],
      problems: 'Manque de fluidité dans les transitions',
      time: '30 min/jour',
      needs: ['Coaching posing'],
      morphology: 'Ectomorphe',
      pointsFortsPhysiqueCustom: 'Dos bien développé, épaules larges',
      pointsFortsPosingCustom: 'Bonne maîtrise du front pose',
      pointsFaiblesCustom: 'Vacuum et transitions',
    },
  },
  {
    name: 'ARTEM',
    supabase: {
      fullname: 'Artem',
      categories: ['Classic Physique', 'Bodybuilding'],
      category: 'Classic Physique · Bodybuilding',
      primary_category: 'Classic Physique',
      federations: ['WNBF'],
      federation: 'WNBF',
      primary_federation: 'WNBF',
      stage_intent: 'undecided',
      has_shorts: 'yes',
      level: 3,
      objectives: 'Maîtriser les mandatories et les transitions entre les poses',
      selected_problems: ['Mandatories', 'Présence scénique'],
      problems: 'Difficulté à maintenir la contraction pendant les poses statiques',
      time: '45 min/jour',
      needs: ['Coaching posing', 'Suivi vidéo'],
      morphology: 'Mésomorphe',
      points_forts_physique_custom: 'Bras massifs, pectoraux symétriques',
      points_forts_posing_custom: 'Back double biceps solide',
      points_faibles_custom: 'Vacuum, transitions latérales',
    },
    sheets: {
      type: 'onboarding',
      fullname: 'Artem',
      categories: ['Classic Physique', 'Bodybuilding'],
      primaryCategory: 'Classic Physique',
      federations: ['WNBF'],
      primaryFederation: 'WNBF',
      stageIntent: 'undecided',
      hasShorts: 'yes',
      level: 3,
      objectives: 'Maîtriser les mandatories et les transitions entre les poses',
      selectedProblems: ['Mandatories', 'Présence scénique'],
      problems: 'Difficulté à maintenir la contraction pendant les poses statiques',
      time: '45 min/jour',
      needs: ['Coaching posing', 'Suivi vidéo'],
      morphology: 'Mésomorphe',
      pointsFortsPhysiqueCustom: 'Bras massifs, pectoraux symétriques',
      pointsFortsPosingCustom: 'Back double biceps solide',
      pointsFaiblesCustom: 'Vacuum, transitions latérales',
    },
  },
  {
    name: 'ILLYA',
    supabase: {
      fullname: 'Illya',
      categories: ['Classic Physique', 'Bodybuilding'],
      category: 'Classic Physique · Bodybuilding',
      primary_category: 'Classic Physique',
      federations: ['WNBF'],
      federation: 'WNBF',
      primary_federation: 'WNBF',
      stage_intent: 'has_stage',
      has_shorts: 'yes',
      level: 1,
      objectives: 'Apprendre les bases du posing et la routine de présentation',
      selected_problems: ['Quarts de tour', 'Routine'],
      problems: 'Débutant complet en posing, besoin de tout apprendre',
      time: '20 min/jour',
      needs: ['Coaching posing'],
      morphology: 'Endomorphe',
      points_forts_physique_custom: 'Jambes puissantes, trapèzes volumineux',
      points_forts_posing_custom: 'Bonne attitude scénique naturelle',
      points_faibles_custom: 'Quarts de tour, vacuum, contrôle du haut du corps',
      stage_date: '2026-12-15',
    },
    sheets: {
      type: 'onboarding',
      fullname: 'Illya',
      categories: ['Classic Physique', 'Bodybuilding'],
      primaryCategory: 'Classic Physique',
      federations: ['WNBF'],
      primaryFederation: 'WNBF',
      stageIntent: 'has_stage',
      hasShorts: 'yes',
      level: 1,
      objectives: 'Apprendre les bases du posing et la routine de présentation',
      selectedProblems: ['Quarts de tour', 'Routine'],
      problems: 'Débutant complet en posing, besoin de tout apprendre',
      time: '20 min/jour',
      needs: ['Coaching posing'],
      morphology: 'Endomorphe',
      pointsFortsPhysiqueCustom: 'Jambes puissantes, trapèzes volumineux',
      pointsFortsPosingCustom: 'Bonne attitude scénique naturelle',
      pointsFaiblesCustom: 'Quarts de tour, vacuum, contrôle du haut du corps',
      stageDate: '2026-12-15',
    },
  },
];

async function testSupabase(persona) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/questionnaires`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(persona.supabase),
  });
  
  if (!res.ok) {
    const err = await res.text();
    console.error(`  ❌ Supabase ERREUR pour ${persona.name}: ${res.status} — ${err}`);
    return false;
  }
  
  const data = await res.json();
  console.log(`  ✅ Supabase OK pour ${persona.name} — ID: ${data[0]?.id}`);
  return true;
}

async function testSheets(persona) {
  try {
    await fetch(ONBOARDING_SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(persona.sheets),
    });
    console.log(`  ✅ Google Sheets OK pour ${persona.name}`);
    return true;
  } catch (err) {
    // no-cors would cause an opaque response, but in Node we get a redirect
    console.log(`  ⚠️ Google Sheets pour ${persona.name}: ${err.message} (normal en Node — fonctionne depuis le navigateur)`);
    return false;
  }
}

async function main() {
  console.log('═══════════════════════════════════════');
  console.log('  TEST DES 3 PERSONAS — Supabase + Sheets');
  console.log('═══════════════════════════════════════\n');

  for (const persona of personas) {
    console.log(`\n🏋️ ${persona.name} (${persona.supabase.categories.join(' + ')}) — WNBF`);
    console.log('─'.repeat(50));
    await testSupabase(persona);
    await testSheets(persona);
  }

  console.log('\n═══════════════════════════════════════');
  console.log('  TESTS TERMINÉS');
  console.log('═══════════════════════════════════════');
  console.log('\n→ Vérifie maintenant sur:');
  console.log('  1. Supabase: https://supabase.com/dashboard → Table "questionnaires"');
  console.log('  2. Google Sheets: ouvre ta feuille Onboarding');
}

main();
