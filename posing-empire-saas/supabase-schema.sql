-- ══════════════════════════════════════════════════════════════
-- SCHEMA DE LA BASE DE DONNÉES & POLITIQUE DE SÉCURITÉ (RLS)
-- ══════════════════════════════════════════════════════════════
-- À copier-coller dans le SQL Editor de Supabase pour configurer
-- correctement les tables et sécuriser les accès publics.

-- ── 1. TABLE : QUESTIONNAIRES (ONBOARDING) ──
CREATE TABLE IF NOT EXISTS public.questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  fullname TEXT NOT NULL,
  categories TEXT[] NOT NULL,
  category TEXT NOT NULL,
  primary_category TEXT NOT NULL,
  category_other TEXT,
  federations TEXT[] NOT NULL,
  federation TEXT NOT NULL,
  primary_federation TEXT NOT NULL,
  federation_other TEXT,
  stage_intent TEXT,
  has_shorts TEXT,
  level INT,
  objectives TEXT,
  selected_problems TEXT[],
  problems TEXT,
  time TEXT,
  needs TEXT[],
  morphology TEXT,
  points_forts_custom TEXT,
  points_forts_physique_custom TEXT,
  points_forts_posing_custom TEXT,
  points_faibles_custom TEXT,
  stage_date TEXT
);

-- ── 2. TABLE : BILANS (BILANS HEBDOMADAIRES) ──
CREATE TABLE IF NOT EXISTS public.bilans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  fullname TEXT NOT NULL,
  categories TEXT[] NOT NULL,
  category TEXT NOT NULL,
  primary_category TEXT NOT NULL,
  federations TEXT[] NOT NULL,
  federation TEXT NOT NULL,
  primary_federation TEXT NOT NULL,
  level INT,
  week_number INT NOT NULL,
  work_done TEXT[] NOT NULL,
  work_done_details TEXT,
  difficulties TEXT[],
  difficulties_details TEXT,
  mobility_zones TEXT[],
  mobility_details TEXT,
  presentation_progress TEXT,
  routine_progress TEXT,
  next_week_goal TEXT,
  is_accompagnement BOOLEAN DEFAULT false,
  morphology TEXT,
  points_forts_custom TEXT,
  points_forts_physique_custom TEXT,
  points_forts_posing_custom TEXT,
  points_faibles_custom TEXT,
  stage_date TEXT
);

-- ── 3. ACTIVATION DU ROW LEVEL SECURITY (RLS) ──
-- Cette étape est essentielle pour empêcher les fuites de données privées.
ALTER TABLE public.questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bilans ENABLE ROW LEVEL SECURITY;

-- ── 4. CONSTITUTION DES PRIVILÈGES DES RÔLES ──
-- On retire tous les privilèges publics par défaut.
REVOKE ALL ON public.questionnaires FROM anon, authenticated;
REVOKE ALL ON public.bilans FROM anon, authenticated;

-- On autorise uniquement l'utilisation du schéma public.
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- On autorise l'insertion (écriture) pour les utilisateurs anonymes et connectés.
GRANT INSERT ON public.questionnaires TO anon, authenticated;
GRANT INSERT ON public.bilans TO anon, authenticated;

-- On autorise la lecture (SELECT) UNIQUEMENT pour les administrateurs ou les utilisateurs connectés
-- (pour de futurs dashboards d'administration). Le rôle 'anon' n'a pas accès en lecture !
GRANT SELECT ON public.questionnaires TO authenticated;
GRANT SELECT ON public.bilans TO authenticated;

-- ── 5. CRÉATION DES POLITIQUES DE SÉCURITÉ (POLICIES) ──

-- Politique d'insertion pour questionnaires (rôle anon)
CREATE POLICY "Allow anonymous inserts" 
ON public.questionnaires FOR INSERT 
TO anon 
WITH CHECK (true);

-- Politique d'insertion pour bilans (rôle anon)
CREATE POLICY "Allow anonymous inserts" 
ON public.bilans FOR INSERT 
TO anon 
WITH CHECK (true);

-- Politique de lecture pour utilisateurs authentifiés (dashboard coach)
CREATE POLICY "Allow authenticated read access" 
ON public.questionnaires FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated read access" 
ON public.bilans FOR SELECT 
TO authenticated 
USING (true);
