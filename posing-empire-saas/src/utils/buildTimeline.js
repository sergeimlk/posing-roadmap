// ══════════════════════════════════════════════════════════════
// POSING EMPIRE — ROADMAP TIMELINE ENGINE v2
// Basé sur le Cahier des charges v1 de Manaël
// Génère une roadmap avec les vrais modules & liens Skool
// ══════════════════════════════════════════════════════════════

const SKOOL_BASE = "https://www.skool.com/posing-empire-groupe-prive-6566/classroom";

// ── MODULE 1 LINKS ──
const M1 = {
  mindset: `${SKOOL_BASE}/00767693?md=8615761a804d4481b132edec55c87bf9`,
  roadmap: `${SKOOL_BASE}/00767693?md=2e1fb038a7d9487cb269de8ac6789a87`,
  catMP: `${SKOOL_BASE}/00767693?md=a4ba29b03f064fd09bc4ffd5d262be62`,
  catCP: `${SKOOL_BASE}/00767693?md=bca953373bac4405a0d294aea7b359ba`,
  catBB: `${SKOOL_BASE}/00767693?md=bbc1371343f74c72a894149886f43be9`,
  catNonCompet: `${SKOOL_BASE}/00767693?md=97ef21fb643349449e1f2236b8eeca1f`,
  bonus: `${SKOOL_BASE}/00767693?md=898f69a65d0b4191bfdae0e6b3ece846`,
  bestPoser: `${SKOOL_BASE}/00767693?md=e1526bff34734c0790732d1019c2b6c1`,
};

// ── MODULE 2 LINKS (Fondations) ──
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
  dorsauxPratique: `${SKOOL_BASE}/d7077c893fee42c9ab12014f73f1ced6`,
};

// ── MODULE 4 LINKS (Classic & Body) ──
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

// ── MODULE 5 (The Classic Class) ──
const M5 = {
  intro: `${SKOOL_BASE}/4fadaba1?md=ecbf3208b4b64602b8654bb19bdadf28`,
};

// ── MODULE 6 (Men's Physique) ──
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

// ── MODULE 7 (Compétition) ──
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

// ── Federation regulation links (Module 7) ──
const FED_LINKS = {
  WNBF: {
    pres: `${SKOOL_BASE}/23665039?md=e48edc76bfee4d3a9bb61aa2a0448546`,
    mp: `${SKOOL_BASE}/23665039?md=748ed09994bb44ee94978ffca97d6341`,
    cp: `${SKOOL_BASE}/23665039?md=c612158c600246419ab79d907da897cc`,
    bb: `${SKOOL_BASE}/23665039?md=53189dc2194149d58045b762206db90d`,
  },
  IFBB: {
    pres: `${SKOOL_BASE}/23665039?md=57f3ec2589e042ffb3cbe9ace8b813ad`,
    mp: `${SKOOL_BASE}/23665039?md=8b77173b0dd741c4a96ca4697eea93c5`,
    cp: `${SKOOL_BASE}/23665039?md=ae113bfeb057423fadf48aea54bd364b`,
    bb: `${SKOOL_BASE}/23665039?md=066444a03b7c476ab1441d236b52446d`,
  },
  NPC: {
    pres: `${SKOOL_BASE}/23665039?md=57820278d48d4b9b8a2a10aa67ef0d59`,
    mp: `${SKOOL_BASE}/23665039?md=88af55e028984bbfbc5701b5ef15397f`,
    cp: `${SKOOL_BASE}/23665039?md=9c033485c6674e4282aa155b689c131d`,
    bb: `${SKOOL_BASE}/23665039?md=c5f97dae91b54f5c87590052426ac87a`,
  },
  OCB: {
    pres: `${SKOOL_BASE}/23665039?md=57820278d48d4b9b8a2a10aa67ef0d59`,
    mp: `${SKOOL_BASE}/23665039?md=88af55e028984bbfbc5701b5ef15397f`,
    cp: `${SKOOL_BASE}/23665039?md=9c033485c6674e4282aa155b689c131d`,
    bb: `${SKOOL_BASE}/23665039?md=c5f97dae91b54f5c87590052426ac87a`,
  },
  ACP: {
    pres: `${SKOOL_BASE}/23665039?md=1b052308d77c452797bf57a7684e9ebc`,
    mp: `${SKOOL_BASE}/23665039?md=dd7475c0b7d14f4388ed4b97eddb1207`,
    bb: `${SKOOL_BASE}/23665039?md=ad3c6391ceb0442f8e331fc5eca163a8`,
  },
  FFFCN: {
    pres: `${SKOOL_BASE}/23665039?md=89edd5e3eb1a4e16a904f5df0a159764`,
    mp: `${SKOOL_BASE}/23665039?md=c18c5de54ada4c6f8cd2f806593b43d3`,
    cp: `${SKOOL_BASE}/23665039?md=5509b39dc4014eafacf3be039d5dcc68`,
    bb: `${SKOOL_BASE}/23665039?md=c046dd725fb043fdbed9371f55d03860`,
  },
  PCA: {
    pres: `${SKOOL_BASE}/23665039?md=4361b1ee6ce149d9b701f217e1baa50f`,
    mp: `${SKOOL_BASE}/23665039?md=ed6fe6dc46ee4743b37e0042aa0c89ee`,
    cp: `${SKOOL_BASE}/23665039?md=0574f6ccd6234ff1854ef5d1ab44d92c`,
    bb: `${SKOOL_BASE}/23665039?md=cfb26069230a42d180382b16d51cdf5d`,
  },
  NBFI: {
    pres: `${SKOOL_BASE}/23665039?md=115ed1cfef1b47dc9f273e5d93e5eef3`,
    mp: `${SKOOL_BASE}/23665039?md=da3dc2d6beed40c3a2947268da220702`,
    cp: `${SKOOL_BASE}/23665039?md=9675ad16170446e990e533d599c0506e`,
    bb: `${SKOOL_BASE}/23665039?md=ec0a6e75a5684eff99b0c6f8c7cec25b`,
  },
  WABBA: {
    pres: `${SKOOL_BASE}/23665039?md=50ff7cf414154a50bdd0c079a9b073b5`,
    mp: `${SKOOL_BASE}/23665039?md=34879bdfe73f4975a4b6e53faef9c2e4`,
    cp: `${SKOOL_BASE}/23665039?md=422287aa7ff84ec2864f4f8195c63995`,
    bb: `${SKOOL_BASE}/23665039?md=70ac24e5ba6445758c606a8ffbe77700`,
  },
  AFBBN: {
    pres: `${SKOOL_BASE}/23665039?md=f2182d4b7394471b98d183a17b031e8d`,
    mp: `${SKOOL_BASE}/23665039?md=d4a264b65df84078bcf022254804520c`,
    cp: `${SKOOL_BASE}/23665039?md=7f4852dcaab74f0bb8462cec6ec1b3c5`,
    bb: `${SKOOL_BASE}/23665039?md=c9cba2becc05441fa08ee0cdb31b8e0c`,
  },
};

// ── MODULE 8 (Mobilité & Activation) ──
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
  protractionH: `${SKOOL_BASE}/5fe8e755?md=86ac822eb1d54dd9b9912fbb4124512a`,
  protractionV: `${SKOOL_BASE}/5fe8e755?md=96dee7d358ab4fd8b575a808410c4cca`,
  massageBalle: `${SKOOL_BASE}/5fe8e755?md=3dd682b641c74ac582b2cabfa2e8c284`,
  massageRouleau: `${SKOOL_BASE}/5fe8e755?md=dfabcb2c5f9140828849e4a346efa867`,
  etirTrapeze: `${SKOOL_BASE}/5fe8e755?md=2d5366f1d5d949aba4baf26e1aa91d74`,
  rotIntElast: `${SKOOL_BASE}/5fe8e755?md=6ec869636320446bbb988ddbbd4dbaff`,
  rotExtElast: `${SKOOL_BASE}/5fe8e755?md=9e7c5fc3677c4d23b22233a977b6b568`,
  rotExtBDB: `${SKOOL_BASE}/5fe8e755?md=7d414582cfa144f88f1117b319428559`,
  quadsActElast: `${SKOOL_BASE}/5fe8e755?md=fdfc52f62f59482eae65ae7d2d3f483e`,
  ischiosActElast: `${SKOOL_BASE}/5fe8e755?md=f1aa460807714dbeb691ea0cbff60d4e`,
  ischiosActAllonge: `${SKOOL_BASE}/5fe8e755?md=b72ede35d3334af6812a7cc27ae06cdc`,
  grandsRonds: `${SKOOL_BASE}/5fe8e755?md=a57539cc57e04596b8df57d5defa7bb9`,
  fessiers: `${SKOOL_BASE}/5fe8e755?md=427b4db1956349d18149c8265d82e776`,
};

// ── MODULE 9 (Vacuum) ──
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

// ── MODULE 10, 11 ──
const M10 = { corrections: `${SKOOL_BASE}/b45370d9` };
const M11 = {
  posingNote: `${SKOOL_BASE}/7dd7c0a9?md=aa74b5c31eb045adb5d35f834f666e01`,
  partenariats: `${SKOOL_BASE}/7dd7c0a9?md=ad438663c8a8479c81432881bd0d9144`,
};

// ── MODULE 12 (Accompagnement 1:1) ──
const M12 = {
  mindset: `${SKOOL_BASE}/6a58266e?md=ad44f34753614e18b11e28833a095de7`,
  onboarding: `${SKOOL_BASE}/6a58266e?md=951ec9bfec46449eac8e09ffe7e543b3`,
  reglement: `${SKOOL_BASE}/6a58266e?md=ca375905ba7f4769ac07e0e418666761`,
  preparerSeance: `${SKOOL_BASE}/6a58266e?md=c639cf6fb6734abfbe29251e089560fa`,
  bilans: `${SKOOL_BASE}/6a58266e?md=6abefc037777475398e8050b1f2dea54`,
  docSuivi: `${SKOOL_BASE}/6a58266e?md=8f8fa1c74dad4e09a59c4e4da014bc72`,
  miseEnRelation: `${SKOOL_BASE}/6a58266e?md=e5de63ab2ea74ebf8e47947e015a27e1`,
};

const CALENDLY_DECOUVERTE = "https://calendly.com/posing-session-reservation/appel-decouverte-posing-empire-afbbn-clone";

// Helper: create a task with optional link
function t(icon, text, link) {
  return { icon, text, link: link || null };
}

// Get level-appropriate example link for pres/routine
function getExampleByLevel(lvl, deb, inter, avance, expert) {
  if (lvl <= 1) return deb;
  if (lvl === 2) return inter;
  if (lvl <= 4) return avance;
  return expert;
}

// ══════════════════════════════════════════════
// MAIN EXPORT
// ══════════════════════════════════════════════
export function buildTimeline(data) {
  const weeks = [];
  const cat = data.category;
  const fed = data.federation;
  const isAccompagnement = data.needs.includes("accompagnement_1_1");
  const problems = (data.problems || "").toLowerCase();

  const isMP = cat === "Men's Physique";
  const isCP = cat === "Classic Physique";
  const isBB = cat === "Bodybuilding";
  const isNonCompet = cat === "Non compétiteur";
  const isCPorBB = isCP || isBB;

  // ═══════════════════════════════════
  // SEMAINE 1 — TON POINT DE DÉPART & FONDATIONS
  // ═══════════════════════════════════
  const s1Tasks = [];

  // 1. Tenue de scène
  if (cat !== "Non compétiteur" && data.hasShorts === "no") {
    s1Tasks.push(t("👙", "Slip de Posing / Tenue de Scène - Les choix obligatoires", M4.tenueScene));
  }

  // 2. Mindset & Prés  // 3. Fondations
  s1Tasks.push(t("📖", "Le vocabulaire du poseur", M2.vocabulaire));
  s1Tasks.push(t("📹", "La méthodologie pour poser", M2.methodologie));
  s1Tasks.push(t("📹", "Organiser sa pratique", M2.organiser));
  s1Tasks.push(t("📹", "Créer son set up", M2.setup));
  s1Tasks.push(t("📊", "Posing Note (Carnet de Posing Google Sheet)", M11.posingNote));

  // 4. Stage Intent / Orientation
  if (data.stageIntent === "undecided") {
    s1Tasks.push(t("📹", "Choisir sa fédération", M2.choisirFed));
    s1Tasks.push(t("📹", "Choisir sa catégorie - Introduction", M2.choisirCatIntro));
    s1Tasks.push(t("📹", "Choisir sa catégorie - Hommes", M2.choisirCatHomme));
  } else if (fed && fed !== "Aucune" && fed !== "Autre" && FED_LINKS[fed]) {
    const fData = FED_LINKS[fed];
    if (fData.pres) {
      s1Tasks.push(t("📹", "Fédération " + fed + " — Présentation & Règlements", fData.pres));
    }
    if (isMP && fData.mp) {
      s1Tasks.push(t("📖", "Règlement Men's Physique — " + fed, fData.mp));
    } else if (isCP && fData.cp) {
      s1Tasks.push(t("📖", "Règlement Classic Physique — " + fed, fData.cp));
    } else if (isBB && fData.bb) {
      s1Tasks.push(t("📖", "Règlement Bodybuilding — " + fed, fData.bb));
    }
  }

  // 5. Physical Difficulties & Category Foundations
  const selProbs = data.selectedProblems || [];
  const hasSymmetry = selProbs.includes("symmetry") || /sym[ée]tr|d[ée]s[ée]quilibr|asym/i.test(problems);
  const hasVacuum = selProbs.includes("vacuum") || /vacuum|abdo|ventre|sangle/i.test(problems);
  const hasDorsaux = selProbs.includes("dorsaux") || /dorsa|lat|omoplate|protract/i.test(problems);
  const hasShoulderPain = selProbs.includes("shoulders") || /[ée]paule|shoulder/i.test(problems);
  const hasPelvis = selProbs.includes("pelvis") || /hanche|bassin/i.test(problems);
  const hasSpine = selProbs.includes("spine") || /colonne|omoplate|raideur|souplesse/i.test(problems);
  const hasRotation = selProbs.includes("rotation") || /rotation|torsion|pivot/i.test(problems);
  const hasLegs = selProbs.includes("legs") || /ischio|post[ée]rieur|fess|glute|quad|jambe|cuisse/i.test(problems);

  if (hasSymmetry) {
    s1Tasks.push(t("📹", "La symétrie en bodybuilding", M2.symetrieBB));
    s1Tasks.push(t("📹", "Résoudre une asymétrie (posing)", M2.symetrieResoudre));
    s1Tasks.push(t("📹", "Résoudre une asymétrie (training)", M2.symetrieTraining));
  }
  if (isCP || isBB || hasVacuum) {
    s1Tasks.push(t("📹", "La sangle abdominale", M2.sangleAbdo));
    s1Tasks.push(t("📹", "Introduction au Vacuum", M9.intro));
    s1Tasks.push(t("📹", "Tout savoir sur le vacuum", M9.toutSavoir));
  }
  if (hasDorsaux) {
    s1Tasks.push(t("📹", "Ouvrir les dorsaux — Théorie", M2.dorsauxTheorie));
    s1Tasks.push(t("📹", "Ouvrir les dorsaux — Pratique", M2.dorsauxPratique));
  }
  if (hasShoulderPain) {
    s1Tasks.push(t("🧘", "Protraction omoplates — Horizontale", M8.protractionH));
    s1Tasks.push(t("🧘", "Massage avec balle (trapèzes)", M8.massageBalle));
    s1Tasks.push(t("🧘", "Étirements des trapèzes", M8.etirTrapeze));
  }
  if (hasPelvis) {
    s1Tasks.push(t("🧘", "Mobilité de hanche — Le papillon", M8.hanchePapillon));
    s1Tasks.push(t("🧘", "Bassin — Antéversion", M8.bassinAntever));
  }
  if (hasSpine) {
    s1Tasks.push(t("🧘", "Mobilité de colonne — Cobra", M8.colonneCobra));
    s1Tasks.push(t("🧘", "Mobilité de colonne — Chat-vache", M8.colonneChatVache));
  }
  if (hasRotation) {
    s1Tasks.push(t("🧘", "Rotation de tronc — 4 pattes", M8.rotTronc4pattes));
    s1Tasks.push(t("🧘", "Rotation de tronc — Bâton", M8.rotTroncBaton));
  }
  if (hasLegs) {
    s1Tasks.push(t("💪", "Activation des fessiers (squeeze glutes)", M8.fessiers));
    s1Tasks.push(t("💪", "Ischios activation avec élastique", M8.ischiosActElast));
  }

  // 6. 1:1 Coaching vs Calendly Discovery
  if (isAccompagnement) {
    s1Tasks.push(t("📹", "Onboarding accompagnement 1:1", M12.onboarding));
    s1Tasks.push(t("📋", "Règlement de l'accompagnement", M12.reglement));
    s1Tasks.push(t("📹", "Bien faire ses bilans", M12.bilans));
  } else {
    s1Tasks.push(t("🚀", "Découvrir l'accompagnement 1:1 avec Manaël", CALENDLY_DECOUVERTE));
    s1Tasks.push(t("📞", "Réserfon appel de découverte gratuit", CALENDLY_DECOUVERTE));
  }

  // Wait, let's fix typo to "Réserver ton appel de découverte gratuit"
  s1Tasks.forEach(task => {
    if (task.text.includes("Réserfon")) {
      task.text = "Réserver ton appel de découverte gratuit";
    }
  });

  weeks.push({
    phase: "Fondations",
    title: "Ton Point de Départ & Fondations",
    description: "Vidéos d'onboarding, mindset, vocabulaire de base et mise en place de ton set up de posing.",
    tasks: s1Tasks
  });

  // Weeks 2 to 12
  if (isCPorBB) {
    const isNPC = fed === "NPC";
    weeks.push(
      { phase: "Catégorie", title: "Vacuum & Quarts de tour", description: "Apprentissage du Vacuum et travail de la sangle abdominale. Maîtrise des quarts de tour en placement symétrique et asymétrique. Mobilité des épaules si nécessaire.", tasks: [] },
      { phase: "Catégorie", title: "Poses selon fédération", description: "Étude et pratique des poses obligatoires (Mandatories) selon les règlements de ta fédération (FDB, Lat Spread, Side Chest...), mobilité ciblée et poursuite du vacuum.", tasks: [] },
      { phase: "Catégorie", title: "Continuation des mandatories", description: "Continuation de l'apprentissage et consolidation des poses imposées de ta catégorie face au miroir.", tasks: [] },
      { phase: "Catégorie", title: "Transitions quarts de tour", description: "Apprentissage des transitions fluides entre les quarts de tour.", tasks: [] },
      { phase: "Catégorie", title: "Transitions des mandatories", description: "Travail des transitions complexes entre les poses obligatoires (Mandatories).", tasks: [] },
      { 
        phase: "Présentation", 
        title: isNPC ? "Présentation individuelle (NPC)" : "Consolidation des acquis", 
        description: isNPC 
          ? "Apprentissage de ton entrée de présentation individuelle en scène (I-walk/T-walk NPC)." 
          : "Perfectionnement et consolidation de tes quarts de tour et de tes poses imposées. Les fédérations comme WNBF ou IFBB ne requérant pas de présentation individuelle à cette étape, nous mettons l'accent sur la tenue des poses.", 
        tasks: [] 
      },
      { phase: "Routine", title: "Routine libre & The Classic Class", description: "Création de ta routine libre et accès aux contenus avancés artistiques du module The Classic Class.", tasks: [] },
      { phase: "Routine", title: "Optimisation de la routine libre", description: "Optimisation du rythme, choix de la musique et synchronisation avec les transitions.", tasks: [] },
      { phase: "Technique", title: "Optimisation des poses", description: "Amélioration de la fluidité générale et corrections individuelles des poses clés via les corrections de groupe.", tasks: [] },
      { phase: "Performance", title: "Optimisation des transitions", description: "Pratique intensive des enchaînements, micro-transitions et endurance de pose.", tasks: [] },
      { phase: "Scène", title: "Finalisation routine & présentation", description: "Simulation de passage sur scène, gestion du stress, de la respiration et de l'attitude.", tasks: [] }
    );
  } else if (isMP) {
    const isWNBF = fed === "WNBF";
    const isIFBB = fed === "IFBB";
    const isNPC = fed === "NPC";
    const presTitle = isNPC ? "Présentation NPC (I-walk)" : isWNBF ? "Présentation WNBF (T-walk)" : isIFBB ? "Présentation IFBB (I-walk)" : "Présentation individuelle";
    const presDesc = isNPC 
      ? "Apprentissage de l'I-walk spécifique au règlement Men's Physique NPC." 
      : isWNBF 
      ? "Apprentissage de la T-walk spécifique au règlement Men's Physique WNBF." 
      : isIFBB 
      ? "Apprentissage de l'I-walk spécifique au règlement Men's Physique IFBB." 
      : "Apprentissage de la marche scénique (I-walk/T-walk) adaptée au règlement de ta fédération.";

    weeks.push(
      { phase: "Catégorie", title: "Poses selon fédération", description: "Apprentissage et perfectionnement de la Front Pose et de la Back Pose (quarts de tour ou placement front/back uniquement selon le règlement de ta fédération).", tasks: [] },
      { phase: "Catégorie", title: "Transitions selon fédération", description: "Travail sur les transitions et la fluidité des rotations adaptées au règlement de ta fédération.", tasks: [] },
      { phase: "Présentation", title: presTitle, description: presDesc, tasks: [] },
      { phase: "Présence", title: "Présence scénique", description: "Développement du charisme, de l'attitude, du regard et du sourire face aux juges (module Compétition) et optimisation via les séances de groupe.", tasks: [] },
      { phase: "Technique", title: "Optimisation des poses", description: "Ajustement de la hauteur des bras, de l'ouverture du dos et de la cambrure.", tasks: [] },
      { phase: "Technique", title: "Enchaînements", description: "Enchaînement rapide des poses et des transitions sans perte de contrôle de la sangle abdominale.", tasks: [] },
      { phase: "Performance", title: "Endurance", description: "Tenue des poses sous tension pour simuler les comparaisons de scène prolongées.", tasks: [] },
      { phase: "Performance", title: "Simulation", description: "Simulations de line-up complets et de call-outs avec des variations de rythme.", tasks: [] },
      { phase: "Technique", title: "Ajustements fins", description: "Corrections individualisées sur les détails de posture et de placement des mains/pieds.", tasks: [] },
      { phase: "Logistique", title: "Logistique/Tan", description: "Préparation logistique pour le jour J, gestion du tan et de la congestion (pump) backstage.", tasks: [] },
      { phase: "Scène", title: "Finalisation & plan long terme", description: "Répétitions finales et définition de la stratégie post-compétition.", tasks: [] }
    );
  } else if (isNonCompet) {
    weeks.push(
      { phase: "Bien-être", title: "Vacuum & Posture", description: "Travail quotidien de la sangle abdominale et développement d'une posture fière.", tasks: [] },
      { phase: "Bien-être", title: "Ouverture de dos", description: "Exercices de protraction des omoplates et apprentissage de l'ouverture des dorsaux.", tasks: [] },
      { phase: "Symétrie", title: "Symétrie quotidienne", description: "Correction des déséquilibres posturaux et des habitudes asymétriques du quotidien.", tasks: [] },
      { phase: "Mobilité", title: "Mobilité hanches/bassin", description: "Assouplissement du bassin et amélioration de l'antéversion/rétroversion.", tasks: [] },
      { phase: "Mobilité", title: "Mobilité épaules", description: "Routine d'étirement et d'activation pour libérer la raideur des épaules.", tasks: [] },
      { phase: "Flow", title: "Transitions douces", description: "Travail des transitions fluides entre postures esthétiques.", tasks: [] },
      { phase: "Esthétique", title: "Poses esthétiques personnelles", description: "Choix et apprentissage des poses mettant le plus en valeur ton physique.", tasks: [] },
      { phase: "Flow", title: "Rythme & Flow", description: "Pratique rythmée avec contrôle respiratoire et mouvements harmonieux.", tasks: [] },
      { phase: "Maintien", title: "Optimisation posture", description: "Consolidation de l'ouverture thoracique et du maintien.", tasks: [] },
      { phase: "Maintien", title: "Endurance de pose", description: "Travail d'endurance musculaire sur tes poses favorites.", tasks: [] },
      { phase: "Bilan", title: "Bilan & Shooting", description: "Finalisation de tes enchaînements et préparation de ton shooting de bilan (3 mois).", tasks: [] }
    );
  } else {
    weeks.push(
      { phase: "Catégorie", title: "Poses de base", description: "Apprentissage des poses imposées de ta catégorie.", tasks: [] },
      { phase: "Catégorie", title: "Transitions", description: "Fluidité des enchaînements entre les poses.", tasks: [] },
      { phase: "Présentation", title: "Présentation", description: "Marche, entrée et sortie de scène selon les règlements.", tasks: [] },
      { phase: "Présence", title: "Présence scénique", description: "Attitude face aux juges, regard et assurance.", tasks: [] },
      { phase: "Technique", title: "Optimisation technique", description: "Amélioration des lignes et ajustement des placements.", tasks: [] },
      { phase: "Performance", title: "Endurance de pose", description: "Répétitions des enchaînements sous fatigue.", tasks: [] },
      { phase: "Routine", title: "Routine/Chorégraphie", description: "Création de ta routine de passage.", tasks: [] },
      { phase: "Technique", title: "Perfectionnement", description: "Correction des points faibles techniques.", tasks: [] },
      { phase: "Technique", title: "Gestion sangle abdominale", description: "Maintien du contrôle abdominal sous tension.", tasks: [] },
      { phase: "Logistique", title: "Backstage & Tan", description: "Stratégie de congestion et logistique du jour J.", tasks: [] },
      { phase: "Scène", title: "Simulation scène", description: "Répetition finale en conditions réelles.", tasks: [] }
    );
  }

  return weeks;
}
