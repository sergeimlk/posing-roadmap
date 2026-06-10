// ══════════════════════════════════════════════════════════════
// POSING EMPIRE — BILAN HEBDOMADAIRE ROADMAP ENGINE v1
// Génère une roadmap personnalisée basée sur le bilan de la semaine
// Utilise les mêmes modules & liens Skool que buildTimeline.js
// ══════════════════════════════════════════════════════════════

const SKOOL_BASE = "https://www.skool.com/posing-empire-groupe-prive-6566/classroom";

// ══════ SKOOL MODULE LINKS ══════
// (Re-declared here to keep the bilan engine self-contained)

const M2 = {
  vocabulaire: `${SKOOL_BASE}/b4d92f9f?md=b15d60223ffd4b47992bec03798c2e92`,
  methodologie: `${SKOOL_BASE}/b4d92f9f?md=01b9fba0ad224384b1c3bd9bc503944c`,
  organiser: `${SKOOL_BASE}/b4d92f9f?md=7f2364b457f746189487cb7fbcd61165`,
  setup: `${SKOOL_BASE}/b4d92f9f?md=152ebbbc4eca42f586edb749bbdc3f1e`,
  choisirFed: `${SKOOL_BASE}/b4d92f9f?md=fa0be02fb3ff40ef84d70080533e06fe`,
  choisirCatIntro: `${SKOOL_BASE}/b4d92f9f?md=3129872b6d59453a88b9c3400f0e0915`,
  choisirCatHomme: `${SKOOL_BASE}/b4d92f9f?md=89da3601218d45c58293ef9cd854cb9c`,
  symetrieBB: `${SKOOL_BASE}/b4d92f9f?md=2c29dbb9a1074f0981d4653b0b5341a1`,
  symetrieResoudre: `${SKOOL_BASE}/b4d92f9f?md=e2afaff39ab64d1dbe1f5929998da549`,
  symetrieTraining: `${SKOOL_BASE}/b4d92f9f?md=4539abf40af6406991f80099fe25281d`,
  sangleAbdo: `${SKOOL_BASE}/b4d92f9f?md=a1c82e9d5f5b43fd8332aa09555e6de5`,
  dorsauxTheorie: `${SKOOL_BASE}/b4d92f9f?md=4b7bc6323a2b43b4a9aae6289cfc992a`,
  dorsauxPratique: `${SKOOL_BASE}/b4d92f9f?md=d7077c893fee42c9ab12014f73f1ced6`,
};

const M4 = {
  intro: `${SKOOL_BASE}/054c6ec4?md=fa6a4ab57887466397aa55a5de5e4534`,
  jambesSymetrique: `${SKOOL_BASE}/054c6ec4?md=0fd3652fc8754049b9c4f7c985ed40ef`,
  jambesAsymetrique: `${SKOOL_BASE}/054c6ec4?md=ccc8075b6dcb43a3b25495c354089608`,
  frontRelax: `${SKOOL_BASE}/054c6ec4?md=ea3dca91012742a6858fe483877ac111`,
  frontRelaxMethode: `${SKOOL_BASE}/054c6ec4?md=999a1f1e6e244159a7514f5a921f4384`,
  sideRelax: `${SKOOL_BASE}/054c6ec4?md=19d81513777546a69da490fce0e02afb`,
  sideRelaxMethode: `${SKOOL_BASE}/054c6ec4?md=638cbc34a44f4cdca9370e9c69b8e331`,
  backRelax: `${SKOOL_BASE}/054c6ec4?md=aa344329dd584c49b09af52fbd6da92e`,
  backRelaxMethode: `${SKOOL_BASE}/054c6ec4?md=cd4e74f7e8a04c7499a616611d310ee6`,
  frontDoubleBiceps: `${SKOOL_BASE}/054c6ec4?md=23062185be3b40fa9bd9d7b6c78511ac`,
  classicFDB: `${SKOOL_BASE}/054c6ec4?md=8dddd72a80444c1791928fe56786bc19`,
  frontLatSpread: `${SKOOL_BASE}/054c6ec4?md=2147b7c5b8fb49529156d2ea89f08755`,
  sideChest: `${SKOOL_BASE}/054c6ec4?md=b1f1ba683e33440c8cabdc3879b8a803`,
  classicSideChest: `${SKOOL_BASE}/054c6ec4?md=dfc7dcc92b5549d2a2be52c74eac311c`,
  sideTriceps: `${SKOOL_BASE}/054c6ec4?md=ccc70c61cda44902af8ab2198bf3456c`,
  classicSideTriceps: `${SKOOL_BASE}/054c6ec4?md=47f21ef3fb79441d99057e8892c64715`,
  backDoubleBiceps: `${SKOOL_BASE}/054c6ec4?md=b7ad8878847c40739d8c299a4808e1db`,
  classicBDB: `${SKOOL_BASE}/054c6ec4?md=edb61a664f2c433aa855c14f54a5b6a3`,
  backLatSpread: `${SKOOL_BASE}/054c6ec4?md=b3f656456f334e04a96e6c5d9fee770b`,
  absAndThighs: `${SKOOL_BASE}/054c6ec4?md=c2b661e5034a4b1d81416ecc49b506b4`,
  mostMuscHandsCl: `${SKOOL_BASE}/054c6ec4?md=454eb67f19f746da9d26f82a0c64c0f6`,
  mostMuscHandsHips: `${SKOOL_BASE}/054c6ec4?md=f468dcd58be74324821355168ef055f6`,
  mostMuscCrab: `${SKOOL_BASE}/054c6ec4?md=c2ac00596ca2448f95041bbb58e5d76e`,
  classicTeaCup: `${SKOOL_BASE}/054c6ec4?md=5ab5be31ad0344c095a7ea3caab568ef`,
  classicAbsBiceps: `${SKOOL_BASE}/054c6ec4?md=f1f8fd43fdbd4050ad5dd44fbc3701bb`,
  classicCrucifix: `${SKOOL_BASE}/054c6ec4?md=c9b94d7a20e345ee8f3f4efd3e77a68c`,
  classicArnold: `${SKOOL_BASE}/054c6ec4?md=225cc871379347bea72e8c85c750c079`,
  transQT: `${SKOOL_BASE}/054c6ec4?md=7f76056b85f5415ea986a33a4956d3de`,
  transBB: `${SKOOL_BASE}/054c6ec4?md=73e2d723a8014bc8a89cea0905ef224b`,
  transCP: `${SKOOL_BASE}/054c6ec4?md=9e77195ec34e45dc84ed53166e3faacf`,
  transCPwnbf: `${SKOOL_BASE}/054c6ec4?md=abaa6795f504461390c254af4cbe8429`,
  transClassicPoses: `${SKOOL_BASE}/054c6ec4?md=4ff0e5e23a9d48789886e48f3800c798`,
  presIndiv: `${SKOOL_BASE}/054c6ec4?md=0693e4a44cde4c9c914d7db88b9b8970`,
  presExDeb: `${SKOOL_BASE}/054c6ec4?md=9a36917e479745ad8082907b2f5403fb`,
  presExInter: `${SKOOL_BASE}/054c6ec4?md=9a36917e479745ad8082907b2f5403fb`,
  presExAvance: `${SKOOL_BASE}/054c6ec4?md=61ea7421b7634912b316628b86a5163c`,
  presExExpert: `${SKOOL_BASE}/054c6ec4?md=43cafa55224d42e4b67d6d5baafa5aa4`,
  routineLibre: `${SKOOL_BASE}/054c6ec4?md=24d2845705d14c5ba0fcf19c9d26c1fe`,
  routineExDeb: `${SKOOL_BASE}/054c6ec4?md=faac063f1bc746829d74b62914d33a8f`,
  routineExInter: `${SKOOL_BASE}/054c6ec4?md=13bf7ca5d9054bd0bedb282d49e94e47`,
  routineExAvance: `${SKOOL_BASE}/054c6ec4?md=9daffadaeffb487498d404aaeca1ace6`,
  routineExExpert: `${SKOOL_BASE}/054c6ec4?md=c50e9c3da54c4d6ebf8d5f4fcbae0641`,
  exIschio: `${SKOOL_BASE}/054c6ec4?md=0bb72425f7904773b8a01450a8113385`,
  exTendreJambes: `${SKOOL_BASE}/054c6ec4?md=d4656f72885546efb53ea275fee11be0`,
  exRotationArnold: `${SKOOL_BASE}/054c6ec4?md=8b8f9c2314b4473c8232bb68707c8161`,
  endurBB: `${SKOOL_BASE}/054c6ec4?md=9e79ba1193214458a862b00a89ad040a`,
  endurCP: `${SKOOL_BASE}/054c6ec4?md=98b756ad830a4e1bbf7d0f0247cb9dd6`,
  endurCPwnbf: `${SKOOL_BASE}/054c6ec4?md=ba05b003cf9047c5a068cc2c4469aab3`,
  tenueScene: `${SKOOL_BASE}/054c6ec4?md=9885392fa02847ab98913b6833a56585`,
};

const M5 = { intro: `${SKOOL_BASE}/4fadaba1?md=ecbf3208b4b64602b8654bb19bdadf28` };

const M6 = {
  intro: `${SKOOL_BASE}/5d616307?md=12e64aa3f94a4a1e83eb8eab695f278f`,
  frontPose: `${SKOOL_BASE}/5d616307?md=2702d42adf224de78b24fac8262dccf6`,
  sidePose: `${SKOOL_BASE}/5d616307?md=e43d8888775e4fc386696cf61be622a1`,
  backPoseNPC: `${SKOOL_BASE}/5d616307?md=895298f4ca4a40ccaa72c7e371e058eb`,
  backPoseNPCmethode: `${SKOOL_BASE}/5d616307?md=698a34546f1742d0887478aff0226ff7`,
  backPoseIFBB: `${SKOOL_BASE}/5d616307?md=508658451cb14d1ba587c40722bfc7b1`,
  transNPC: `${SKOOL_BASE}/5d616307?md=adae749086f847758cea57ef73fbe4c3`,
  transIFBB: `${SKOOL_BASE}/5d616307?md=be8cf7915ca24ce9bd5b6bd31dfecc6b`,
  presIndiv: `${SKOOL_BASE}/5d616307?md=5309407de0b34a64837e97a9c1e52d0c`,
  presNPC: `${SKOOL_BASE}/5d616307?md=83826b9ffa2d4b3cb346ad23f8591ebf`,
  presIFBB: `${SKOOL_BASE}/5d616307?md=f3bd23952a8742dc89de8d30defa2107`,
  presTwalk: `${SKOOL_BASE}/5d616307?md=bdeea6acee1d4584b103baf3244721c5`,
  endurIFBB: `${SKOOL_BASE}/5d616307?md=1f5289634f5c4eae82e825340aebe6a1`,
  endurNPC: `${SKOOL_BASE}/5d616307?md=935cb74dc3404ab6a24e20887e31857a`,
};

const M7 = {
  intro: `${SKOOL_BASE}/23665039?md=37149473458e4cdd8ebe01d942e500bc`,
  deroulement: `${SKOOL_BASE}/23665039?md=04325109c9094dc18ccbd8804eccc2a5`,
  attitude: `${SKOOL_BASE}/23665039?md=55be7559f9204762881ee3400508e601`,
  respiration: `${SKOOL_BASE}/23665039?md=25bc1c76bd974d9b81f32dd6457549e1`,
  tan: `${SKOOL_BASE}/23665039?md=48fd70b847834470ae27923a3f63a5bd`,
  phasesCachees: `${SKOOL_BASE}/23665039?md=f95f2cd8ea9c4dc7b15e9fe90fc01544`,
  pumpComment: `${SKOOL_BASE}/23665039?md=691462786f04422dab38275392dbca5b`,
  pumpRoutine: `${SKOOL_BASE}/23665039?md=cfa337487fca45c9b7d120ee48e09442`,
};

const M8 = {
  intro: `${SKOOL_BASE}/5fe8e755?md=05e99f07584943c99f58e885af162d95`,
  echauffement: `${SKOOL_BASE}/5fe8e755?md=fb29d14ec26b4af295f0eb5fa090988c`,
  hanchePapillon: `${SKOOL_BASE}/5fe8e755?md=4b477af201424b2c977a34581a8d8da8`,
  hancheHoward: `${SKOOL_BASE}/5fe8e755?md=0ab65a921ed94c9b8cd44b84776ca651`,
  bassinAntever: `${SKOOL_BASE}/5fe8e755?md=ef2bdedf17e14c4fb96f42fdf77fbb70`,
  bassinRetrover: `${SKOOL_BASE}/5fe8e755?md=ba319cae4c34434ca7efcd5ed6eb19aa`,
  colonneCobra: `${SKOOL_BASE}/5fe8e755?md=98b0e065d20f48f5b2eb24049aaa33e3`,
  colonneChatVache: `${SKOOL_BASE}/5fe8e755?md=77efb6110f9d46bf9b3f2dcccb395b15`,
  colonneEnroul: `${SKOOL_BASE}/5fe8e755?md=981998f60a0e43b383ecb42d74eb200d`,
  rotTronc4pattes: `${SKOOL_BASE}/5fe8e755?md=efdc3cc77b314c768963fe4ed5bd9379`,
  rotTroncBaton: `${SKOOL_BASE}/5fe8e755?md=f098eeb055964ffca4b561b2e33a7931`,
  rotTroncBallon: `${SKOOL_BASE}/5fe8e755?md=e0b408cb750b42e48c578376d2a91da5`,
  rotTroncStatique: `${SKOOL_BASE}/5fe8e755?md=725192d0604b4af5bee139761c072cbc`,
  rotTroncAllonge: `${SKOOL_BASE}/5fe8e755?md=46b69bd294ce4271ae5adb7e85fc7d81`,
  protractionH: `${SKOOL_BASE}/5fe8e755?md=86ac822eb1d54dd9b9912fbb4124512a`,
  protractionVrouleau: `${SKOOL_BASE}/5fe8e755?md=96dee7d358ab4fd8b575a808410c4cca`,
  protractionV: `${SKOOL_BASE}/5fe8e755?md=bc343355b7a64bff927cc48063bb728d`,
  protractionKettle: `${SKOOL_BASE}/5fe8e755?md=2557b22080724de8b8dfc9c4df69dfdb`,
  massageBalle: `${SKOOL_BASE}/5fe8e755?md=3dd682b641c74ac582b2cabfa2e8c284`,
  massageRouleau: `${SKOOL_BASE}/5fe8e755?md=dfabcb2c5f9140828849e4a346efa867`,
  etirTrapeze: `${SKOOL_BASE}/5fe8e755?md=2d5366f1d5d949aba4baf26e1aa91d74`,
  etirDorsaux: `${SKOOL_BASE}/5fe8e755?md=d63e4694ab064a0b921a2457c565c3db`,
  childsPose: `${SKOOL_BASE}/5fe8e755?md=fed22abe5c204e04a911ea2c11fe2f1f`,
  rotIntElast: `${SKOOL_BASE}/5fe8e755?md=6ec869636320446bbb988ddbbd4dbaff`,
  rotIntAllonge: `${SKOOL_BASE}/5fe8e755?md=12bcad3106c344909b8353f0c9335e9e`,
  rotExtElast: `${SKOOL_BASE}/5fe8e755?md=9e7c5fc3677c4d23b22233a977b6b568`,
  rotExtBDB: `${SKOOL_BASE}/5fe8e755?md=7d414582cfa144f88f1117b319428559`,
  rotExtAllonge: `${SKOOL_BASE}/5fe8e755?md=7ee8db3504eb4bf788a1b7eef685a263`,
  quadsActElast: `${SKOOL_BASE}/5fe8e755?md=fdfc52f62f59482eae65ae7d2d3f483e`,
  vouteBalle: `${SKOOL_BASE}/5fe8e755?md=e5d4f8d04d5c41b79a5d67965cae1db1`,
  vouteElast: `${SKOOL_BASE}/5fe8e755?md=0358edf21f2c4cedba2cc6dbd22f26f6`,
  ischiosActElast: `${SKOOL_BASE}/5fe8e755?md=f1aa460807714dbeb691ea0cbff60d4e`,
  ischiosActAllonge: `${SKOOL_BASE}/5fe8e755?md=b72ede35d3334af6812a7cc27ae06cdc`,
  grandsRonds: `${SKOOL_BASE}/5fe8e755?md=a57539cc57e04596b8df57d5defa7bb9`,
  fessiers: `${SKOOL_BASE}/5fe8e755?md=427b4db1956349d18149c8265d82e776`,
};

const M9 = {
  intro: `${SKOOL_BASE}/de36522b?md=355d9fd1b5bb4db5ac14d2bcaa2576e3`,
  toutSavoir: `${SKOOL_BASE}/de36522b?md=c854ebf78eb94047ae8f4f5fdfbbc1b0`,
  statL1: `${SKOOL_BASE}/de36522b?md=d566c0b2df064fac899bfff746cfd0a5`,
  statL2: `${SKOOL_BASE}/de36522b?md=66fb536393e84aaaa52aa5197acf1082`,
  statL3: `${SKOOL_BASE}/de36522b?md=15548c9cbaa04fd2ba2b0f4e4c5f44c2`,
  statL4: `${SKOOL_BASE}/de36522b?md=503e334047494e02b0e45b5bc6b89495`,
  dynL5: `${SKOOL_BASE}/de36522b?md=ec324f2177704efdaf155fb6f781d3fe`,
  dynL6: `${SKOOL_BASE}/de36522b?md=8c44916ea56945d8997115911cc62138`,
};

const M10 = { corrections: `${SKOOL_BASE}/b45370d9` };
const M11 = {
  posingNote: `${SKOOL_BASE}/7dd7c0a9?md=aa74b5c31eb045adb5d35f834f666e01`,
  partenariats: `${SKOOL_BASE}/7dd7c0a9?md=ad438663c8a8479c81432881bd0d9144`,
};

const M12 = {
  mindset: `${SKOOL_BASE}/6a58266e?md=ad44f34753614e18b11e28833a095de7`,
  onboarding: `${SKOOL_BASE}/6a58266e?md=951ec9bfec46449eac8e09ffe7e543b3`,
  reglement: `${SKOOL_BASE}/6a58266e?md=ca375905ba7f4769ac07e0e418666761`,
  preparerSeance: `${SKOOL_BASE}/6a58266e?md=c639cf6fb6734abfbe29251e089560fa`,
  bilans: `${SKOOL_BASE}/6a58266e?md=6abefc037777475398e8050b1f2dea54`,
  docSuivi: `${SKOOL_BASE}/6a58266e?md=8f8fa1c74dad4e09a59c4e4da014bc72`,
  miseEnRelation: `${SKOOL_BASE}/6a58266e?md=e5de63ab2ea74ebf8e47947e015a27e1`,
};

const CALENDLY = "https://calendly.com/posing-session-reservation/appel-decouverte-posing-empire-afbbn-clone";

// ══════════ HELPERS ══════════

function r(title, link, reason) {
  return { title, link, reason };
}

function getVacuumLevel(weekNumber) {
  if (weekNumber <= 2) return 1;
  if (weekNumber <= 4) return 2;
  if (weekNumber <= 6) return 3;
  if (weekNumber <= 8) return 4;
  if (weekNumber <= 10) return 5;
  return 6;
}

function getVacuumLink(level) {
  const links = [M9.statL1, M9.statL1, M9.statL2, M9.statL3, M9.statL4, M9.dynL5, M9.dynL6];
  return links[Math.min(level, 6)];
}

function getVacuumLabel(level) {
  const labels = [
    'Vacuum quadrupède statique',
    'Vacuum quadrupède statique',
    'Vacuum allongé statique',
    'Vacuum penché statique',
    'Vacuum sur pose statique',
    'Vacuum penché dynamique',
    'Vacuum sur pose dynamique',
  ];
  return labels[Math.min(level, 6)];
}

function getExampleByLevel(lvl, deb, inter, avance, expert) {
  if (lvl <= 1) return deb;
  if (lvl === 2) return inter;
  if (lvl === 3) return avance;
  return expert;
}

// ══════════════════════════════════════════════
// MAIN EXPORT — buildBilanRoadmap
// ══════════════════════════════════════════════
export function buildBilanRoadmap(data) {
  const {
    fullname, category, federation, level, weekNumber,
    workDone, difficulties, difficultiesDetails,
    mobilityZones, mobilityDetails, presentationProgress,
    routineProgress, nextWeekGoal, isAccompagnement,
    morphology, pointsFortsCustom, pointsFaiblesCustom, stageDate,
  } = data;

  const primaryCategory = data.primaryCategory || (data.categories && data.categories[0]) || category || 'Non compétiteur';
  const primaryFederation = data.primaryFederation || (data.federations && data.federations[0]) || federation || 'Aucune';

  const isMP = primaryCategory === "Men's Physique";
  const isCP = primaryCategory === "Classic Physique";
  const isBB = primaryCategory === "Bodybuilding";
  const isCPorBB = isCP || isBB;
  const isNonCompet = primaryCategory === "Non compétiteur";
  const isWNBF = primaryFederation === "WNBF";
  const isNPC = primaryFederation === "NPC";
  const isIFBB = primaryFederation === "IFBB";
  const allDetails = `${difficultiesDetails} ${mobilityDetails}`.toLowerCase();

  // ═══════════════════════════════════
  // 1. BILAN — Points forts & à améliorer
  // ═══════════════════════════════════
  const pointsForts = [];
  const pointsAAmeliorer = [];

  // Prepend customized feedback first
  if (pointsFortsCustom && pointsFortsCustom.trim()) {
    pointsForts.push(`Ressenti personnel : ${pointsFortsCustom.trim()}`);
  }
  if (pointsFaiblesCustom && pointsFaiblesCustom.trim()) {
    pointsAAmeliorer.push(`Ressenti personnel : ${pointsFaiblesCustom.trim()}`);
  }

  // Analyze work done
  if (workDone.includes('poses')) pointsForts.push(`Tu as travaillé tes poses imposées cette semaine — bon rythme !`);
  if (workDone.includes('transitions')) pointsForts.push(`Le travail sur les transitions montre que tu progresses dans la fluidité.`);
  if (workDone.includes('vacuum')) pointsForts.push(`La pratique régulière du vacuum va porter ses fruits sur le long terme.`);
  if (workDone.includes('mobilite')) pointsForts.push(`L'intégration de la mobilité dans ta routine est un excellent réflexe.`);
  if (workDone.includes('routine')) pointsForts.push(`Tu avances sur ta routine libre — c'est un gros investissement qui paye.`);
  if (workDone.includes('videos')) pointsForts.push(`Tu as pris le temps de visionner des contenus éducatifs — ça se reflètera dans ta pratique.`);
  if (workDone.includes('quarts_de_tour')) pointsForts.push(`Les quarts de tour sont la base — bravo de les travailler régulièrement.`);
  if (workDone.includes('endurance')) pointsForts.push(`L'endurance de pose est souvent négligée — continue ce travail essentiel.`);
  if (workDone.includes('presentation')) pointsForts.push(`Le travail sur ta présentation individuelle avance, c'est positif.`);
  if (workDone.length === 0 && (!pointsFortsCustom || !pointsFortsCustom.trim())) pointsForts.push(`N/A — aucun travail déclaré cette semaine. L'important est de reprendre dès maintenant.`);

  // Analyze difficulties
  if (difficulties.includes('poses')) pointsAAmeliorer.push(`Les poses imposées nécessitent encore du travail — c'est normal, la maîtrise vient avec la répétition.`);
  if (difficulties.includes('transitions')) pointsAAmeliorer.push(`Les transitions entre les poses manquent de fluidité — nous allons y remédier.`);
  if (difficulties.includes('vacuum')) pointsAAmeliorer.push(`Le contrôle du vacuum/sangle abdominale est un point à renforcer cette semaine.`);
  if (difficulties.includes('mobilite')) pointsAAmeliorer.push(`Des limitations de mobilité freinent ta progression — des exercices ciblés vont aider.`);
  if (difficulties.includes('routine')) pointsAAmeliorer.push(`La routine libre demande encore du polissage — c'est un processus créatif.`);
  if (difficulties.includes('symetrie')) pointsAAmeliorer.push(`Des asymétries ont été identifiées — travaillons sur les corrections posturales.`);
  if (difficulties.includes('dorsaux')) pointsAAmeliorer.push(`L'ouverture des dorsaux est un point clé à améliorer pour le rendu sur scène.`);
  if (difficulties.includes('endurance')) pointsAAmeliorer.push(`L'endurance de pose est insuffisante — intégrons des séries de maintien prolongé.`);
  if (difficulties.includes('stress')) pointsAAmeliorer.push(`La gestion du stress scénique est à travailler — des techniques de respiration vont aider.`);
  if (difficulties.includes('presentation')) pointsAAmeliorer.push(`La présentation individuelle nécessite plus de travail et de répétitions.`);
  if (pointsAAmeliorer.length === 0 && (!pointsFaiblesCustom || !pointsFaiblesCustom.trim())) pointsAAmeliorer.push(`Aucune difficulté majeure signalée — continue sur cette lancée !`);

  // ═══════════════════════════════════
  // 2. PRIORITÉS — 3-5 axes d'action
  // ═══════════════════════════════════
  const priorites = [];

  // Calculate weeks remaining until competition
  let weeksRemaining = null;
  if (stageDate) {
    const sDate = new Date(stageDate);
    const today = new Date();
    sDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = sDate.getTime() - today.getTime();
    if (diffTime > 0) {
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      weeksRemaining = Math.ceil(diffDays / 7);
    } else {
      weeksRemaining = 0;
    }
  }

  // Inject dynamic countdown-based priority at the very top
  if (weeksRemaining !== null) {
    if (weeksRemaining === 0) {
      priorites.push(`🚨 SEMAINE DE LA COMPÉTITION : Repos, réviser l'enchaînement mentalement, préparation logistique (tan, tenue) et focus mental.`);
    } else if (weeksRemaining <= 2) {
      priorites.push(`🚨 COMPÉTITION DANS ${weeksRemaining} S. (S-${weeksRemaining}) : Pratique complète en tenue, tenue de pose prolongée (30s+), simulation d'appels.`);
    } else if (weeksRemaining <= 4) {
      priorites.push(`⚠️ ÉCHÉANCE PROCHE (S-${weeksRemaining}) : Fixer définitivement les transitions et ta routine. Intensifier l'endurance de pose.`);
    } else if (weeksRemaining <= 8) {
      priorites.push(`⏳ Préparation Scène (S-${weeksRemaining}) : Pratique quotidienne régulière du posing (10-15 min) et enchaînements complets.`);
    } else {
      priorites.push(`📅 Objectif Compétition (S-${weeksRemaining}) : Structurer les fondations et installer une routine de posing régulière.`);
    }
  }

  // Priority based on week progression logic
  if (isCPorBB) {
    if (weekNumber <= 1) {
      priorites.push(`Assimiler les fondations du posing (méthodologie, vocabulaire, set up)`);
    } else if (weekNumber <= 2) {
      priorites.push(`Développer le vacuum et maîtriser les quarts de tour (front/side/back relax)`);
    } else if (weekNumber <= 4) {
      priorites.push(`Apprendre et consolider les poses imposées (Mandatories) de ta catégorie`);
    } else if (weekNumber <= 6) {
      priorites.push(`Travailler la fluidité des transitions entre les poses`);
    } else if (weekNumber <= 8) {
      priorites.push(`Développer ta routine libre et/ou présentation individuelle`);
    } else {
      priorites.push(`Optimiser et perfectionner l'ensemble de ton passage scénique`);
    }
  } else if (isMP) {
    if (weekNumber <= 1) {
      priorites.push(`Assimiler les fondations du posing (méthodologie, vocabulaire, set up)`);
    } else if (weekNumber <= 3) {
      priorites.push(`Maîtriser les poses spécifiques Men's Physique selon ta fédération`);
    } else if (weekNumber <= 5) {
      priorites.push(`Travailler ta présentation individuelle (I-walk/T-walk)`);
    } else {
      priorites.push(`Optimiser ta présence scénique et ton charisme face aux juges`);
    }
  } else {
    priorites.push(`Continuer ta progression en posing à ton rythme`);
  }

  // Add difficulty-based priorities
  if (difficulties.includes('vacuum') || (isCPorBB && weekNumber >= 2)) {
    priorites.push(`Progresser sur le vacuum — passer au palier suivant`);
  }
  if (difficulties.includes('mobilite') || mobilityZones.length > 0) {
    priorites.push(`Débloquer les zones de mobilité limitées avec des exercices ciblés`);
  }
  if (difficulties.includes('dorsaux')) {
    priorites.push(`Améliorer l'ouverture des dorsaux avec des exercices de protraction`);
  }
  if (difficulties.includes('symetrie')) {
    priorites.push(`Corriger les déséquilibres et travailler la symétrie corporelle`);
  }

  // Ensure 3-5 priorities
  if (priorites.length < 3) {
    if (!priorites.some(p => p.includes('Posing Note'))) {
      priorites.push(`Remplir ton Posing Note après chaque séance pour tracer ta progression`);
    }
    if (!priorites.some(p => p.includes('corrections'))) {
      priorites.push(`Poster une photo de ta pose dans les Corrections Quotidiennes pour un feedback personnalisé`);
    }
  }

  // ═══════════════════════════════════
  // 3. PLAN D'ACTION
  // ═══════════════════════════════════
  const mobilite = [];
  const activation = [];
  const vacuum = [];
  const posingTechnique = [];
  const routineLibre = [];

  // ── MOBILITÉ ──
  if (mobilityZones.includes('hanches') || allDetails.includes('hanche')) {
    mobilite.push({
      exercice: 'Le papillon',
      objectif: `Améliorer la mobilité de hanche pour les placements du bas du corps au sol.`,
      link: M8.hanchePapillon,
    });
    mobilite.push({
      exercice: 'Howard lunge stretch',
      objectif: `Ouvrir les hanches en profondeur pour faciliter les positions de lunging.`,
      link: M8.hancheHoward,
    });
  }
  if (mobilityZones.includes('bassin') || allDetails.includes('bassin')) {
    mobilite.push({
      exercice: 'Antéversion du bassin',
      objectif: `Corriger le placement du bassin sur les poses de face pour un meilleur rendu.`,
      link: M8.bassinAntever,
    });
    mobilite.push({
      exercice: 'Rétroversion du bassin',
      objectif: `Maintenir le bassin en position neutre sur les poses de dos et de profil.`,
      link: M8.bassinRetrover,
    });
  }
  if (mobilityZones.includes('colonne') || allDetails.includes('colonne') || allDetails.includes('cambr')) {
    mobilite.push({
      exercice: 'Étirement du cobra',
      objectif: `Améliorer l'extension de la colonne pour les cambures sur scène.`,
      link: M8.colonneCobra,
    });
    mobilite.push({
      exercice: 'Exercice chat-vache',
      objectif: `Mobiliser chaque segment vertébral pour plus de fluidité dans les transitions.`,
      link: M8.colonneChatVache,
    });
  }
  if (mobilityZones.includes('rotation_tronc') || allDetails.includes('rotation') || allDetails.includes('pivot') || allDetails.includes('torsion')) {
    mobilite.push({
      exercice: 'Rotation à 4 pattes',
      objectif: `Améliorer la rotation thoracique pour les poses avec torsion (side relax, side chest).`,
      link: M8.rotTronc4pattes,
    });
    mobilite.push({
      exercice: 'Rotation avec bâton',
      objectif: `Augmenter l'amplitude de rotation du tronc de manière progressive.`,
      link: M8.rotTroncBaton,
    });
  }
  if (mobilityZones.includes('epaules') || allDetails.includes('épaule') || allDetails.includes('shoulder')) {
    mobilite.push({
      exercice: 'Rotation interne avec élastique',
      objectif: `Améliorer la rotation interne des épaules pour les relaxes (front/side/back).`,
      link: M8.rotIntElast,
    });
    mobilite.push({
      exercice: 'Rotation externe avec élastique',
      objectif: `Augmenter la rotation externe pour le back double biceps.`,
      link: M8.rotExtElast,
    });
  }
  if (mobilityZones.includes('omoplates') || difficulties.includes('dorsaux') || allDetails.includes('omoplate') || allDetails.includes('dorsa')) {
    mobilite.push({
      exercice: 'Protraction horizontale (prioritaire)',
      objectif: `Activer la protraction des omoplates pour une meilleure ouverture des dorsaux.`,
      link: M8.protractionH,
    });
    mobilite.push({
      exercice: 'Protraction verticale avec rouleau (prioritaire)',
      objectif: `Renforcer la protraction en position verticale pour un transfert direct aux poses.`,
      link: M8.protractionVrouleau,
    });
  }

  // Always include warmup if any mobility is recommended
  if (mobilite.length > 0) {
    mobilite.unshift({
      exercice: 'Échauffement posing sessions',
      objectif: `Routine d'échauffement à réaliser avant chaque séance de posing.`,
      link: M8.echauffement,
    });
  }

  // Number all mobility exercises by priority order
  mobilite.forEach((ex, i) => {
    ex.exercice = `${i + 1}. ${ex.exercice}`;
  });

  // ── ACTIVATION MUSCULAIRE ──
  if (allDetails.includes('quad') || allDetails.includes('jambe') || allDetails.includes('cuisse')) {
    activation.push({
      exercice: 'Quads activation avec élastique',
      objectif: `Activer les quadriceps pour un meilleur rendu sur les poses de face.`,
      link: M8.quadsActElast,
    });
  }
  if (allDetails.includes('ischio') || allDetails.includes('postérieur') || allDetails.includes('arrière')) {
    activation.push({
      exercice: 'Ischios activation avec élastique',
      objectif: `Activer les ischio-jambiers pour les poses de dos.`,
      link: M8.ischiosActElast,
    });
    activation.push({
      exercice: 'Ischios activation allongé',
      objectif: `Compléter l'activation des ischio-jambiers en position allongée.`,
      link: M8.ischiosActAllonge,
    });
  }
  if (allDetails.includes('fess') || allDetails.includes('glute')) {
    activation.push({
      exercice: 'Activation des fessiers (squeeze glutes)',
      objectif: `Améliorer la contraction des fessiers sur les poses de dos.`,
      link: M8.fessiers,
    });
  }
  if (allDetails.includes('grand rond') || allDetails.includes('teres') || (difficulties.includes('dorsaux') && isCPorBB)) {
    activation.push({
      exercice: 'Activation des grands ronds',
      objectif: `Activer les grands ronds pour améliorer le back double biceps.`,
      link: M8.grandsRonds,
    });
  }

  // ── VACUUM ──
  if (isCP || difficulties.includes('vacuum') || workDone.includes('vacuum')) {
    const vLevel = getVacuumLevel(weekNumber);
    const vLabel = getVacuumLabel(vLevel);
    const vLink = getVacuumLink(vLevel);
    const nextLevel = Math.min(vLevel + 1, 6);
    const nextLabel = getVacuumLabel(nextLevel);

    vacuum.push({
      consigne: isCP
        ? 'Le vacuum est obligatoire pour le Classic Physique. Pratique-le quotidiennement, 3 à 5 séries de 10-15 secondes.'
        : 'Le contrôle de la sangle abdominale améliorera considérablement le rendu de tes poses.',
      progression: `Tu es actuellement au niveau ${vLevel}/6 — ${vLabel}. Prochain palier : ${nextLabel}.`,
      link: vLink,
      linkLabel: vLabel,
    });

    if (weekNumber <= 3) {
      vacuum.push({
        consigne: null,
        progression: null,
        link: M9.toutSavoir,
        linkLabel: 'Tout savoir sur le vacuum (vidéo de référence)',
      });
    }
  }

  // ── POSING TECHNIQUE ──
  const poses = [];
  const transitions = [];
  const corrections = [];

  if (isCPorBB) {
    // Determine poses based on week
    if (weekNumber <= 2) {
      poses.push({ text: 'Front Relax', link: M4.frontRelax });
      poses.push({ text: 'Side Relax', link: M4.sideRelax });
      poses.push({ text: 'Back Relax', link: M4.backRelax });
      poses.push({ text: 'Placement symétrique des jambes', link: M4.jambesSymetrique });
      if (isCP) poses.push({ text: 'Placement asymétrique des jambes', link: M4.jambesAsymetrique });
    } else if (weekNumber <= 4) {
      // Mandatories
      if (isWNBF && isCP) {
        poses.push({ text: 'Classic Front Double Biceps', link: M4.classicFDB });
        poses.push({ text: 'Classic Side Chest', link: M4.classicSideChest });
        poses.push({ text: 'Classic Side Triceps', link: M4.classicSideTriceps });
        poses.push({ text: 'Classic Back Double Biceps', link: M4.classicBDB });
      } else {
        poses.push({ text: 'Front Double Biceps', link: M4.frontDoubleBiceps });
        poses.push({ text: 'Side Chest', link: M4.sideChest });
        poses.push({ text: 'Back Double Biceps', link: M4.backDoubleBiceps });
        poses.push({ text: 'Abs and Thighs', link: M4.absAndThighs });
        if (isBB) {
          poses.push({ text: 'Front Lat Spread', link: M4.frontLatSpread });
          poses.push({ text: 'Back Lat Spread', link: M4.backLatSpread });
          poses.push({ text: 'Side Triceps', link: M4.sideTriceps });
        }
        if (isCP && (isIFBB || isNPC)) {
          poses.push({ text: 'Side Triceps', link: M4.sideTriceps });
        }
      }
    } else if (weekNumber <= 6) {
      transitions.push({ text: 'Transitions des quarts de tour', link: M4.transQT });
      if (isBB) transitions.push({ text: 'Transitions Bodybuilding — mandatories', link: M4.transBB });
      if (isCP && isWNBF) transitions.push({ text: 'Transitions Classic Physique — WNBF', link: M4.transCPwnbf });
      else if (isCP) transitions.push({ text: 'Transitions Classic Physique — mandatories', link: M4.transCP });
      if (isCP) transitions.push({ text: 'Classic poses — transitions', link: M4.transClassicPoses });
    } else if (weekNumber <= 8) {
      // Routine / Presentation
      if (isNPC) {
        poses.push({ text: 'Créer sa présentation individuelle', link: M4.presIndiv });
        const ex = getExampleByLevel(level, M4.presExDeb, M4.presExInter, M4.presExAvance, M4.presExExpert);
        poses.push({ text: 'Exemple de présentation — adapté à ton niveau', link: ex });
      }
      poses.push({ text: 'Créer sa routine libre', link: M4.routineLibre });
      if (isCP) poses.push({ text: 'The Classic Class — introduction', link: M5.intro });
    } else {
      // Optimization & endurance
      if (isBB) poses.push({ text: 'Round d\'endurance — Bodybuilding', link: M4.endurBB });
      else if (isCP && isWNBF) poses.push({ text: 'Round d\'endurance — CP WNBF', link: M4.endurCPwnbf });
      else if (isCP) poses.push({ text: 'Round d\'endurance — Classic Physique', link: M4.endurCP });
    }

    // Difficulty-specific corrections
    if (difficulties.includes('poses')) {
      if (allDetails.includes('side chest') || allDetails.includes('ischio')) {
        corrections.push({ text: 'Exercice — Plaquer l\'ischio sur le side chest', link: M4.exIschio });
      }
      if (allDetails.includes('side relax') || allDetails.includes('tendre')) {
        corrections.push({ text: 'Exercice — Tendre les jambes sur la side relax', link: M4.exTendreJambes });
      }
    }
    if (allDetails.includes('arnold')) {
      corrections.push({ text: 'Exercice — Rotation Arnold pose', link: M4.exRotationArnold });
    }
  } else if (isMP) {
    if (weekNumber <= 2) {
      poses.push({ text: 'Front Pose — Men\'s Physique', link: M6.frontPose });
      if (!isNPC) poses.push({ text: 'Side Pose', link: M6.sidePose });
      if (isNPC) {
        poses.push({ text: 'Back Pose — NPC', link: M6.backPoseNPC });
      } else {
        poses.push({ text: 'Back Pose — IFBB/WNBF', link: M6.backPoseIFBB });
      }
    } else if (weekNumber <= 4) {
      if (isNPC) transitions.push({ text: 'Transitions — NPC', link: M6.transNPC });
      else transitions.push({ text: 'Transitions — IFBB/WNBF', link: M6.transIFBB });
    } else if (weekNumber <= 6) {
      poses.push({ text: 'Créer sa présentation individuelle — MP', link: M6.presIndiv });
      if (isNPC) poses.push({ text: 'NPC — I-walk', link: M6.presNPC });
      else if (isWNBF) poses.push({ text: 'T-walk — WNBF', link: M6.presTwalk });
      else poses.push({ text: 'IFBB — I-walk', link: M6.presIFBB });
    } else {
      if (isNPC) poses.push({ text: 'Round d\'endurance — NPC', link: M6.endurNPC });
      else poses.push({ text: 'Round d\'endurance — IFBB/WNBF', link: M6.endurIFBB });
    }

    if (difficulties.includes('dorsaux') && allDetails.includes('back pose')) {
      corrections.push({ text: 'Méthode de mise en place — Back pose NPC', link: M6.backPoseNPCmethode });
    }
  }

  // Symmetry correction
  if (difficulties.includes('symetrie')) {
    corrections.push({ text: 'La symétrie en bodybuilding', link: M2.symetrieBB });
    corrections.push({ text: 'Résoudre une asymétrie (posing)', link: M2.symetrieResoudre });
    corrections.push({ text: 'Résoudre une asymétrie (training)', link: M2.symetrieTraining });
  }
  if (difficulties.includes('dorsaux')) {
    corrections.push({ text: 'Ouvrir les dorsaux — Théorie', link: M2.dorsauxTheorie });
    corrections.push({ text: 'Ouvrir les dorsaux — Pratique', link: M2.dorsauxPratique });
  }
  if (difficulties.includes('vacuum') && !isCPorBB) {
    corrections.push({ text: 'La sangle abdominale', link: M2.sangleAbdo });
  }

  posingTechnique.push({ poses, transitions, corrections });

  // ── ROUTINE LIBRE ──
  if (routineProgress === 'in_progress' || routineProgress === 'advanced' || difficulties.includes('routine')) {
    if (isCPorBB) {
      routineLibre.push({ text: 'Créer sa routine libre (de A à Z)', link: M4.routineLibre });
      const ex = getExampleByLevel(level, M4.routineExDeb, M4.routineExInter, M4.routineExAvance, M4.routineExExpert);
      routineLibre.push({ text: 'Exemple de routine — adapté à ton niveau', link: ex });
    }
  }
  if (presentationProgress === 'in_progress' || presentationProgress === 'advanced' || difficulties.includes('presentation')) {
    if (isCPorBB) {
      routineLibre.push({ text: 'Créer sa présentation individuelle (de A à Z)', link: M4.presIndiv });
    } else if (isMP) {
      routineLibre.push({ text: 'Créer sa présentation individuelle — MP', link: M6.presIndiv });
    }
  }

  // ═══════════════════════════════════
  // 4. RESSOURCES DE LA SEMAINE
  // ═══════════════════════════════════
  const ressources = [];

  // Always recommend Posing Note
  ressources.push(r('Posing Note (Carnet de Posing)', M11.posingNote, 'Note tes séances de posing pour tracer ta progression.'));

  // Corrections quotidiennes
  ressources.push(r('Corrections Quotidiennes', M10.corrections, 'Poste ta photo de pose pour recevoir un feedback personnalisé.'));

  // Competition module for advanced weeks
  if (weekNumber >= 6 && !isNonCompet) {
    ressources.push(r(`Le déroulement d'une compétition`, M7.deroulement, `Comprends les étapes d'une compétition pour te préparer mentalement.`));
    ressources.push(r(`Attitude scénique`, M7.attitude, `L'attitude face aux juges fait la différence — apprends les codes.`));
    ressources.push(r(`La respiration sur scène`, M7.respiration, `Quand et comment respirer pendant tes poses sur scène.`));
  }
  if (weekNumber >= 10 && !isNonCompet) {
    ressources.push(r('Le tan', M7.tan, 'Tout savoir sur la préparation du tan pour le jour J.'));
    ressources.push(r('Comment pumper', M7.pumpComment, 'Stratégie de congestion optimale en backstage.'));
    ressources.push(r(`Routine pump backstage`, M7.pumpRoutine, `Routine d'exercices pour congestionner avant de monter sur scène.`));
  }

  // 1:1 coaching
  if (isAccompagnement) {
    ressources.push(r('Préparer notre séance de coaching', M12.preparerSeance, 'Comment bien préparer ta séance 1:1 pour en tirer le maximum.'));
    ressources.push(r('Bien faire ses bilans', M12.bilans, 'La méthodologie pour des bilans hebdomadaires efficaces.'));
  }

  // ═══════════════════════════════════
  // 5. OBJECTIFS DE LA SEMAINE
  // ═══════════════════════════════════
  const objectifs = {
    principal: nextWeekGoal || 'Consolider les acquis et progresser sur les points faibles identifiés.',
    secondaires: [],
  };

  if (mobilite.length > 0) {
    objectifs.secondaires.push('Réaliser les exercices de mobilité au moins 3 fois cette semaine.');
  }
  if (vacuum.length > 0) {
    objectifs.secondaires.push('Pratiquer le vacuum quotidiennement (3-5 séries de 10-15 secondes).');
  }
  if (poses.length > 0) {
    objectifs.secondaires.push('Travailler les poses listées devant le miroir, en filmant au moins 1 séance.');
  }
  if (transitions.length > 0) {
    objectifs.secondaires.push('Enchaîner les transitions lentement puis accélérer progressivement.');
  }
  if (objectifs.secondaires.length === 0) {
    objectifs.secondaires.push('Continuer à pratiquer régulièrement et poster dans les Corrections Quotidiennes.');
    objectifs.secondaires.push('Remplir ton Posing Note après chaque séance.');
  }

  // ═══════════════════════════════════
  // RETURN STRUCTURED ROADMAP
  // ═══════════════════════════════════
  return {
    meta: {
      fullname,
      category,
      categories: data.categories,
      federation,
      federations: data.federations,
      level,
      weekNumber,
      isAccompagnement,
      morphology,
      stageDate,
    },
    bilan: {
      pointsForts,
      pointsAAmeliorer,
    },
    priorites: priorites.slice(0, 5),
    planAction: {
      mobilite,
      activation,
      vacuum,
      posingTechnique: posingTechnique[0] || { poses: [], transitions: [], corrections: [] },
      routineLibre,
    },
    ressources,
    objectifs,
    calendlyLink: CALENDLY,
  };
}
