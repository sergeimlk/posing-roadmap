/**
 * submitData.js — Envoi centralisé vers Supabase + Google Sheets
 *
 * Envoie les données du formulaire simultanément :
 * 1. Vers Supabase (via l'API REST native, pas de SDK requis)
 * 2. Vers Google Sheets (via un Webhook Google Apps Script)
 *
 * Les deux envois sont indépendants : si l'un échoue,
 * l'autre fonctionne quand même. Le PDF et la roadmap
 * sont toujours générés côté client, quel que soit le résultat.
 */

/**
 * @param {"onboarding" | "bilan"} type  — Type de formulaire
 * @param {Object} payload               — Données du formulaire
 * @returns {Promise<{supabase: boolean, sheets: boolean}>}
 */
export async function submitData(type, payload) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const onboardingSheetWebhookUrl = import.meta.env.VITE_GOOGLE_SHEET_ONBOARDING_WEBHOOK_URL;
  const bilanSheetWebhookUrl = import.meta.env.VITE_GOOGLE_SHEET_BILAN_WEBHOOK_URL;

  const results = { supabase: false, sheets: false };
  const promises = [];

  // ── 1. Envoi vers Supabase ──
  if (supabaseUrl && supabaseKey) {
    const table = type === 'onboarding' ? 'questionnaires' : 'bilans';

    // Transformer le payload JS en format compatible avec le schéma SQL
    const supabasePayload = type === 'onboarding'
      ? {
          fullname: payload.fullname,
          categories: payload.categories,
          category: payload.category,
          primary_category: payload.primaryCategory,
          category_other: payload.categoryOther || null,
          federations: payload.federations,
          federation: payload.federation,
          primary_federation: payload.primaryFederation,
          federation_other: payload.federationOther || null,
          stage_intent: payload.stageIntent || null,
          has_shorts: payload.hasShorts || null,
          level: payload.level,
          objectives: payload.objectives,
          selected_problems: payload.selectedProblems || [],
          problems: payload.problems,
          time: payload.time,
          needs: payload.needs || [],
          morphology: payload.morphology || null,
          points_forts_custom: payload.pointsFortsCustom || null,
          points_forts_physique_custom: payload.pointsFortsPhysiqueCustom || null,
          points_forts_posing_custom: payload.pointsFortsPosingCustom || null,
          points_faibles_custom: payload.pointsFaiblesCustom || null,
          stage_date: payload.stageDate || null,
        }
      : {
          fullname: payload.fullname,
          categories: payload.categories,
          category: payload.category,
          primary_category: payload.primaryCategory,
          federations: payload.federations,
          federation: payload.federation,
          primary_federation: payload.primaryFederation,
          level: payload.level,
          week_number: payload.weekNumber,
          work_done: payload.workDone || [],
          work_done_details: payload.workDoneDetails || null,
          difficulties: payload.difficulties || [],
          difficulties_details: payload.difficultiesDetails || null,
          mobility_zones: payload.mobilityZones || [],
          mobility_details: payload.mobilityDetails || null,
          presentation_progress: payload.presentationProgress || null,
          routine_progress: payload.routineProgress || null,
          next_week_goal: payload.nextWeekGoal,
          is_accompagnement: payload.isAccompagnement || false,
          morphology: payload.morphology,
          points_forts_custom: payload.pointsFortsCustom || null,
          points_forts_physique_custom: payload.pointsFortsPhysiqueCustom || '',
          points_forts_posing_custom: payload.pointsFortsPosingCustom || '',
          points_faibles_custom: payload.pointsFaiblesCustom || '',
          stage_date: payload.stageDate || null,
        };

    promises.push(
      fetch(`${supabaseUrl}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(supabasePayload),
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Supabase ${res.status}: ${res.statusText}`);
          results.supabase = true;
          console.log('✅ Données envoyées vers Supabase');
        })
        .catch((err) => {
          console.warn('⚠️ Erreur Supabase (non bloquant) :', err.message);
        })
    );
  } else {
    console.info('ℹ️ Supabase non configuré — envoi ignoré');
  }

  // ── 2. Envoi vers Google Sheets ──
  const sheetWebhookUrl = type === 'onboarding'
    ? onboardingSheetWebhookUrl
    : bilanSheetWebhookUrl;
  const sheetsSecret = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_SECRET;

  if (sheetWebhookUrl) {
    promises.push(
      fetch(sheetWebhookUrl, {
        method: 'POST',
        mode: 'no-cors', // Obligatoire pour les Google Apps Script déployés en Web App
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, secret: sheetsSecret, ...payload }),
      })
        .then(() => {
          results.sheets = true;
          console.log('✅ Données envoyées vers Google Sheets');
        })
        .catch((err) => {
          console.warn('⚠️ Erreur Google Sheets (non bloquant) :', err.message);
        })
    );
  } else {
    console.info('ℹ️ Google Sheets Webhook non configuré — envoi ignoré');
  }

  // Attendre tous les envois (sans bloquer si l'un échoue)
  if (promises.length > 0) {
    await Promise.allSettled(promises);
  }

  return results;
}
