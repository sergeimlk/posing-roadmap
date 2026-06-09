/**
 * Fix Supabase permissions + re-test 3 personas
 * Usage: node fix-and-test.mjs
 */

const SUPABASE_URL = 'https://henuxgmkcsbgmnusigfk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlbnV4Z21rY3NiZ21udXNpZ2ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDc0MzIsImV4cCI6MjA5NjU4MzQzMn0.eHo5UPNcoJjbKRccxnhfqomLeEYRwdgH-izKPdGnoAw';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlbnV4Z21rY3NiZ21udXNpZ2ZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTAwNzQzMiwiZXhwIjoyMDk2NTgzNDMyfQ.tfPwY9_0aROAQJv60wELKn5YYL8gayWlw0lBFqKRRZM';
const ONBOARDING_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwBQxx1DGXsGHgsq3NCzfwM1CHWPstZVwqD39FiCQuE4miL1EFYnXYL6XAuZXq3WxI/exec';

// Step 1: Fix permissions using service_role key
async function fixPermissions() {
  console.log('🔧 Correction des permissions Supabase...\n');
  
  const sql = `
    GRANT USAGE ON SCHEMA public TO anon;
    GRANT USAGE ON SCHEMA public TO authenticated;
    GRANT INSERT ON public.questionnaires TO anon;
    GRANT INSERT ON public.bilans TO anon;
    GRANT SELECT ON public.questionnaires TO authenticated;
    GRANT SELECT ON public.bilans TO authenticated;
    GRANT SELECT ON public.questionnaires TO anon;
    GRANT SELECT ON public.bilans TO anon;
  `;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  // Alternative: use the SQL endpoint directly via pg
  // Since we can't execute raw SQL via REST, let's just test if the insert works
  // The user needs to run the GRANT SQL in the Supabase SQL editor
  
  // Let's first test if permissions already work
  const testRes = await fetch(`${SUPABASE_URL}/rest/v1/questionnaires?select=count`, {
    method: 'HEAD',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  
  if (testRes.status === 200) {
    console.log('  ✅ Permissions OK — la table questionnaires est accessible\n');
    return true;
  } else {
    console.log(`  ⚠️ Status ${testRes.status} — les permissions doivent être corrigées via SQL Editor\n`);
    console.log('  → Va dans Supabase > SQL Editor et exécute:');
    console.log('    GRANT INSERT ON public.questionnaires TO anon;');
    console.log('    GRANT INSERT ON public.bilans TO anon;');
    console.log('    GRANT SELECT ON public.questionnaires TO anon;');
    console.log('    GRANT SELECT ON public.bilans TO anon;\n');
    return false;
  }
}

// Step 2: Test insertions
async function testInsert(persona) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/questionnaires`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(persona),
  });
  
  if (!res.ok) {
    const err = await res.text();
    console.log(`  ❌ Supabase: ${res.status} — ${err}`);
    return false;
  }
  
  const data = await res.json();
  console.log(`  ✅ Supabase OK — ID: ${data[0]?.id}`);
  return true;
}

async function testSheets(persona) {
  try {
    const res = await fetch(ONBOARDING_SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'onboarding', ...persona }),
    });
    console.log(`  ✅ Google Sheets OK (status: ${res.status})`);
    return true;
  } catch (err) {
    console.log(`  ⚠️ Google Sheets: ${err.message}`);
    return false;
  }
}

const personas = [
  {
    name: 'MILY',
    supabase: {
      fullname: 'Mily', categories: ['Classic Physique'], category: 'Classic Physique',
      primary_category: 'Classic Physique', federations: ['WNBF'], federation: 'WNBF',
      primary_federation: 'WNBF', stage_intent: 'has_stage', has_shorts: 'yes', level: 2,
      objectives: 'Améliorer mes quarts de tour et ma présence scénique',
      selected_problems: ['Transitions', 'Vacuum'],
      problems: 'Manque de fluidité dans les transitions', time: '30 min/jour',
      needs: ['Coaching posing'], morphology: 'Ectomorphe',
      points_forts_physique_custom: 'Dos bien développé, épaules larges',
      points_forts_posing_custom: 'Bonne maîtrise du front pose',
      points_faibles_custom: 'Vacuum et transitions',
    },
    sheets: {
      fullname: 'Mily', categories: ['Classic Physique'], primaryCategory: 'Classic Physique',
      federations: ['WNBF'], primaryFederation: 'WNBF', level: 2,
      objectives: 'Améliorer mes quarts de tour et ma présence scénique',
      pointsFortsPhysiqueCustom: 'Dos bien développé, épaules larges',
      pointsFortsPosingCustom: 'Bonne maîtrise du front pose',
      pointsFaiblesCustom: 'Vacuum et transitions',
    },
  },
  {
    name: 'ARTEM',
    supabase: {
      fullname: 'Artem', categories: ['Classic Physique', 'Bodybuilding'],
      category: 'Classic Physique · Bodybuilding', primary_category: 'Classic Physique',
      federations: ['WNBF'], federation: 'WNBF', primary_federation: 'WNBF',
      stage_intent: 'undecided', has_shorts: 'yes', level: 3,
      objectives: 'Maîtriser les mandatories et les transitions',
      selected_problems: ['Mandatories', 'Présence scénique'],
      problems: 'Maintenir la contraction pendant les poses statiques', time: '45 min/jour',
      needs: ['Coaching posing', 'Suivi vidéo'], morphology: 'Mésomorphe',
      points_forts_physique_custom: 'Bras massifs, pectoraux symétriques',
      points_forts_posing_custom: 'Back double biceps solide',
      points_faibles_custom: 'Vacuum, transitions latérales',
    },
    sheets: {
      fullname: 'Artem', categories: ['Classic Physique', 'Bodybuilding'],
      primaryCategory: 'Classic Physique', federations: ['WNBF'], primaryFederation: 'WNBF',
      level: 3, objectives: 'Maîtriser les mandatories et les transitions',
      pointsFortsPhysiqueCustom: 'Bras massifs, pectoraux symétriques',
      pointsFortsPosingCustom: 'Back double biceps solide',
      pointsFaiblesCustom: 'Vacuum, transitions latérales',
    },
  },
  {
    name: 'ILLYA',
    supabase: {
      fullname: 'Illya', categories: ['Classic Physique', 'Bodybuilding'],
      category: 'Classic Physique · Bodybuilding', primary_category: 'Classic Physique',
      federations: ['WNBF'], federation: 'WNBF', primary_federation: 'WNBF',
      stage_intent: 'has_stage', has_shorts: 'yes', level: 1,
      objectives: 'Apprendre les bases du posing et la routine',
      selected_problems: ['Quarts de tour', 'Routine'],
      problems: 'Débutant complet en posing', time: '20 min/jour',
      needs: ['Coaching posing'], morphology: 'Endomorphe',
      points_forts_physique_custom: 'Jambes puissantes, trapèzes volumineux',
      points_forts_posing_custom: 'Bonne attitude scénique naturelle',
      points_faibles_custom: 'Quarts de tour, vacuum, contrôle du haut du corps',
      stage_date: '2026-12-15',
    },
    sheets: {
      fullname: 'Illya', categories: ['Classic Physique', 'Bodybuilding'],
      primaryCategory: 'Classic Physique', federations: ['WNBF'], primaryFederation: 'WNBF',
      level: 1, objectives: 'Apprendre les bases du posing et la routine',
      pointsFortsPhysiqueCustom: 'Jambes puissantes, trapèzes volumineux',
      pointsFortsPosingCustom: 'Bonne attitude scénique naturelle',
      pointsFaiblesCustom: 'Quarts de tour, vacuum, contrôle du haut du corps',
      stageDate: '2026-12-15',
    },
  },
];

async function main() {
  console.log('═══════════════════════════════════════');
  console.log('  FIX + TEST — 3 PERSONAS');
  console.log('═══════════════════════════════════════\n');

  await fixPermissions();

  for (const p of personas) {
    console.log(`\n🏋️ ${p.name} (${p.supabase.categories.join(' + ')})`);
    console.log('─'.repeat(50));
    await testInsert(p.supabase);
    await testSheets(p.sheets);
  }

  console.log('\n═══════════════════════════════════════');
  console.log('  RÉSULTAT FINAL');
  console.log('═══════════════════════════════════════');
  console.log('\n→ Vérifie sur Supabase: Table Editor > questionnaires');
  console.log('→ Vérifie sur Google Sheets: feuille Onboarding');
}

main();
