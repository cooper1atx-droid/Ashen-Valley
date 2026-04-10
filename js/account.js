// ============================================================
//  ACCOUNT.JS — localStorage account management
// ============================================================

const ACCOUNTS_KEY = 'ashenValley_accounts';
const SESSION_KEY  = 'ashenValley_session';

function getAccounts() {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]'); }
  catch { return []; }
}

function saveAccounts(accounts) {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Save failed (storage full?):', e);
    alert('Warning: progress could not be saved. Your browser storage may be full.');
  }
}

// Simple hash (not cryptographic — fine for local game saves)
function hashPassword(pw) {
  let h = 0;
  for (let i = 0; i < pw.length; i++) {
    h = (Math.imul(31, h) + pw.charCodeAt(i)) | 0;
  }
  return h.toString(16);
}

function createAccount(username, password) {
  if (!username || username.length < 2)
    return { ok: false, error: 'Username must be at least 2 characters.' };
  if (!password || password.length < 4)
    return { ok: false, error: 'Password must be at least 4 characters.' };

  const accounts = getAccounts();
  if (accounts.find(a => a.username.toLowerCase() === username.toLowerCase()))
    return { ok: false, error: 'That username is already taken.' };

  const account = {
    username,
    passwordHash: hashPassword(password),
    created: Date.now(),
    stats: {
      gamesPlayed: 0,
      bestScore:   0,
      bestWave:    0,
      totalKills:  0,
      victories:   0,
    },
    history: [],
    crystals: 300,
    unlockedUnits: [],
  };
  accounts.push(account);
  saveAccounts(accounts);
  startSession(account);
  return { ok: true, account };
}

function loginAccount(username, password) {
  const accounts = getAccounts();
  const account = accounts.find(a => a.username.toLowerCase() === username.toLowerCase());
  if (!account)
    return { ok: false, error: 'Account not found.' };
  if (account.passwordHash !== hashPassword(password))
    return { ok: false, error: 'Incorrect password.' };
  startSession(account);
  return { ok: true, account };
}

function startSession(account) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ username: account.username }));
}

function getCurrentUser() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); }
  catch { return null; }
}

function getAccountData(username) {
  return getAccounts().find(a => a.username.toLowerCase() === username.toLowerCase()) || null;
}

function saveGameResult({ username, score, wave, kills, won, gems }) {
  const accounts = getAccounts();
  const idx = accounts.findIndex(a => a.username.toLowerCase() === username.toLowerCase());
  if (idx === -1) return;
  const acc = accounts[idx];
  acc.stats.gamesPlayed++;
  if (score > acc.stats.bestScore) acc.stats.bestScore = score;
  if (wave  > acc.stats.bestWave)  acc.stats.bestWave  = wave;
  acc.stats.totalKills += kills;
  if (won) acc.stats.victories++;
  acc.history.unshift({ score, wave, kills, won, gems: gems || 0, date: Date.now() });
  if (acc.history.length > 20) acc.history.pop();
  acc.crystals = (acc.crystals || 0) + (gems || 0);
  accounts[idx] = acc;
  saveAccounts(accounts);
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = 'login.html';
}

function adminLogin() {
  const ALL_UNITS = GACHA_POOL.map(u => u.key);
  const accounts = getAccounts();
  let adminAcc = accounts.find(a => a.username === 'Admin');
  if (!adminAcc) {
    adminAcc = {
      username: 'Admin',
      passwordHash: '',
      created: Date.now(),
      stats: { gamesPlayed: 0, bestScore: 0, bestWave: 0, totalKills: 0, victories: 0 },
      history: [],
      crystals: 999999,
      unlockedUnits: ALL_UNITS,
    };
    accounts.push(adminAcc);
  } else {
    adminAcc.crystals = 999999;
    adminAcc.unlockedUnits = ALL_UNITS;
    const idx = accounts.findIndex(a => a.username === 'Admin');
    accounts[idx] = adminAcc;
  }
  saveAccounts(accounts);
  startSession(adminAcc);
  return adminAcc;
}

// ============================================================
//  GACHA / CRYSTAL SYSTEM
// ============================================================

const GACHA_POOL = [
  // ── TIER 1 — Common (weight ≈ 4.23 each) ──
  { key: 'archer',          name: 'Archer',           tier: 1, rarity: 'common',    weight: 4.23, color: '#a0d060', textColor: '#2a4010', abbr: 'AR' },
  { key: 'stoneThrower',    name: 'Stone Thrower',    tier: 1, rarity: 'common',    weight: 4.23, color: '#a08060', textColor: '#301800', abbr: 'ST' },
  { key: 'spearman',        name: 'Spearman',         tier: 1, rarity: 'common',    weight: 4.23, color: '#e0c060', textColor: '#302000', abbr: 'SP' },
  { key: 'scout',           name: 'Scout',            tier: 1, rarity: 'common',    weight: 4.23, color: '#80c0e0', textColor: '#102030', abbr: 'SC' },
  { key: 'cannon',          name: 'Cannon',           tier: 1, rarity: 'common',    weight: 4.23, color: '#808080', textColor: '#181818', abbr: 'CN' },
  { key: 'crossbow',        name: 'Crossbowman',      tier: 1, rarity: 'common',    weight: 4.23, color: '#b0d080', textColor: '#1a3008', abbr: 'CX' },
  { key: 'slingshot',       name: 'Slingshot',        tier: 1, rarity: 'common',    weight: 4.23, color: '#c8a060', textColor: '#281800', abbr: 'SL' },
  { key: 'militiaPike',     name: 'Militia Pike',     tier: 1, rarity: 'common',    weight: 4.23, color: '#a07850', textColor: '#201000', abbr: 'MP' },
  { key: 'oilThrower',      name: 'Oil Thrower',      tier: 1, rarity: 'common',    weight: 4.23, color: '#505050', textColor: '#c8c8c8', abbr: 'OT' },
  { key: 'ballistae',       name: 'Ballistae',        tier: 1, rarity: 'common',    weight: 4.23, color: '#787870', textColor: '#181818', abbr: 'BA' },
  { key: 'bombPoster',      name: 'Bomb Thrower',     tier: 1, rarity: 'common',    weight: 4.23, color: '#484848', textColor: '#e8e8e8', abbr: 'BT' },
  { key: 'thornBush',       name: 'Thorn Bush',       tier: 1, rarity: 'common',    weight: 4.23, color: '#408040', textColor: '#f0f0f0', abbr: 'TB' },
  { key: 'flarePost',       name: 'Flare Post',       tier: 1, rarity: 'common',    weight: 4.23, color: '#e8a020', textColor: '#201000', abbr: 'FP' },
  // ── TIER 2 — Rare (weight ≈ 2.31 each) ──
  { key: 'frostMage',       name: 'Frost Mage',       tier: 2, rarity: 'rare',      weight: 2.31, color: '#60c0f0', textColor: '#102030', abbr: 'FM' },
  { key: 'fireWizard',      name: 'Fire Wizard',      tier: 2, rarity: 'rare',      weight: 2.31, color: '#f06020', textColor: '#300800', abbr: 'FW' },
  { key: 'poisonAlchemist', name: 'Poison Alch.',     tier: 2, rarity: 'rare',      weight: 2.31, color: '#80c040', textColor: '#102008', abbr: 'PA' },
  { key: 'gatling',         name: 'Gatling Gunner',   tier: 2, rarity: 'rare',      weight: 2.31, color: '#c0a040', textColor: '#201800', abbr: 'GG' },
  { key: 'goldMine',        name: 'Gold Mine',        tier: 2, rarity: 'rare',      weight: 2.31, color: '#ffd700', textColor: '#201800', abbr: 'GM' },
  { key: 'stormArcher',     name: 'Storm Archer',     tier: 2, rarity: 'rare',      weight: 2.31, color: '#80c8f0', textColor: '#081828', abbr: 'SA' },
  { key: 'plagueDoctor',    name: 'Plague Doctor',    tier: 2, rarity: 'rare',      weight: 2.31, color: '#70b050', textColor: '#0a1808', abbr: 'PD' },
  { key: 'shadowStalker',   name: 'Shadow Stalker',   tier: 2, rarity: 'rare',      weight: 2.31, color: '#503870', textColor: '#e0d0f8', abbr: 'SS' },
  { key: 'pyromancer',      name: 'Pyromancer',       tier: 2, rarity: 'rare',      weight: 2.31, color: '#e05818', textColor: '#fff0e0', abbr: 'PY' },
  { key: 'runesmith',       name: 'Runesmith',        tier: 2, rarity: 'rare',      weight: 2.31, color: '#d0a8f0', textColor: '#180828', abbr: 'RS' },
  { key: 'stoneGolem',      name: 'Stone Golem',      tier: 2, rarity: 'rare',      weight: 2.31, color: '#909090', textColor: '#181818', abbr: 'SG' },
  { key: 'crystalBow',      name: 'Crystal Bow',      tier: 2, rarity: 'rare',      weight: 2.31, color: '#80e0d0', textColor: '#083020', abbr: 'CB' },
  { key: 'trapMaster',      name: 'Trap Master',      tier: 2, rarity: 'rare',      weight: 2.31, color: '#c89040', textColor: '#201008', abbr: 'TM' },
  // ── TIER 3 — Epic (weight ≈ 0.55 each) ──
  { key: 'lightningSage',   name: 'Lightning Sage',   tier: 3, rarity: 'epic',      weight: 0.55, color: '#f0f040', textColor: '#201800', abbr: 'LS' },
  { key: 'amplifier',       name: 'Amplifier',        tier: 3, rarity: 'epic',      weight: 0.55, color: '#e0c0ff', textColor: '#180828', abbr: 'AM' },
  { key: 'teslaCoil',       name: 'Tesla Coil',       tier: 3, rarity: 'epic',      weight: 0.55, color: '#80e0ff', textColor: '#081820', abbr: 'TC' },
  { key: 'healerMonk',      name: 'Healer Monk',      tier: 3, rarity: 'epic',      weight: 0.55, color: '#fff080', textColor: '#201800', abbr: 'HM' },
  { key: 'necromancer',     name: 'Necromancer',      tier: 3, rarity: 'epic',      weight: 0.55, color: '#a040c0', textColor: '#180820', abbr: 'NC' },
  { key: 'droneLauncher',   name: 'Drone Launcher',   tier: 3, rarity: 'epic',      weight: 0.55, color: '#80a0c0', textColor: '#101820', abbr: 'DL' },
  { key: 'stormCaller',     name: 'Storm Caller',     tier: 3, rarity: 'epic',      weight: 0.55, color: '#b0d0ff', textColor: '#080818', abbr: 'SC' },
  { key: 'bloodKnight',     name: 'Blood Knight',     tier: 3, rarity: 'epic',      weight: 0.55, color: '#c83030', textColor: '#ffe0e0', abbr: 'BK' },
  { key: 'voidRifter',      name: 'Void Rifter',      tier: 3, rarity: 'epic',      weight: 0.55, color: '#6030a0', textColor: '#e0c8ff', abbr: 'VR' },
  { key: 'banshee',         name: 'Banshee Tower',    tier: 3, rarity: 'epic',      weight: 0.55, color: '#c0c0e0', textColor: '#101018', abbr: 'BN' },
  { key: 'mechanic',        name: 'Mechanic',         tier: 3, rarity: 'epic',      weight: 0.55, color: '#90b0d0', textColor: '#081820', abbr: 'MC' },
  { key: 'gravityWell',     name: 'Gravity Well',     tier: 3, rarity: 'epic',      weight: 0.55, color: '#4020c0', textColor: '#d0c0ff', abbr: 'GW' },
  { key: 'thornGolem',      name: 'Thorn Golem',      tier: 3, rarity: 'epic',      weight: 0.55, color: '#30a030', textColor: '#e0ffe0', abbr: 'TG' },
  { key: 'shadowPriest',    name: 'Shadow Priest',    tier: 3, rarity: 'epic',      weight: 0.55, color: '#803060', textColor: '#ffd8f0', abbr: 'SP' },
  { key: 'iceGolem',        name: 'Ice Golem',        tier: 3, rarity: 'epic',      weight: 0.55, color: '#60c8f0', textColor: '#082030', abbr: 'IG' },
  { key: 'manaVortex',      name: 'Mana Vortex',      tier: 3, rarity: 'epic',      weight: 0.55, color: '#8060e0', textColor: '#f0e8ff', abbr: 'MV' },
  { key: 'thunderstrike',   name: 'Thunderstrike',    tier: 3, rarity: 'epic',      weight: 0.55, color: '#e0e040', textColor: '#202000', abbr: 'TS' },
  { key: 'spiritGuide',     name: 'Spirit Guide',     tier: 3, rarity: 'epic',      weight: 0.55, color: '#e0f0ff', textColor: '#081020', abbr: 'SG' },
  { key: 'acidCatapult',    name: 'Acid Catapult',    tier: 3, rarity: 'epic',      weight: 0.55, color: '#90d050', textColor: '#102000', abbr: 'AC' },
  { key: 'soulHarvester',   name: 'Soul Harvester',   tier: 3, rarity: 'epic',      weight: 0.55, color: '#c060c0', textColor: '#fff0ff', abbr: 'SH' },
  { key: 'mirrorMage',      name: 'Mirror Mage',      tier: 3, rarity: 'epic',      weight: 0.55, color: '#d0e8ff', textColor: '#101828', abbr: 'MM' },
  { key: 'vortexCannon',    name: 'Vortex Cannon',    tier: 3, rarity: 'epic',      weight: 0.55, color: '#7080c0', textColor: '#f0f0ff', abbr: 'VC' },
  // ── TIER 4 — Legendary (weight = 0.25 each) ──
  { key: 'dragonNest',      name: 'Dragon Nest',      tier: 4, rarity: 'legendary', weight: 0.25, color: '#f06040', textColor: '#200800', abbr: 'DN' },
  { key: 'blackHole',       name: 'Black Hole',       tier: 4, rarity: 'legendary', weight: 0.25, color: '#4020a0', textColor: '#c0a0ff', abbr: 'BH' },
  { key: 'timeWarden',      name: 'Time Warden',      tier: 4, rarity: 'legendary', weight: 0.25, color: '#d0c0ff', textColor: '#180820', abbr: 'TW' },
  { key: 'arcaneColossus',  name: 'Arcane Colossus',  tier: 4, rarity: 'legendary', weight: 0.25, color: '#ff80ff', textColor: '#200020', abbr: 'AC' },
  { key: 'celestialBeacon', name: 'Celestial Beacon', tier: 4, rarity: 'legendary', weight: 0.25, color: '#fffff0', textColor: '#202010', abbr: 'CB' },
  { key: 'abyssalShrine',   name: 'Abyssal Shrine',   tier: 4, rarity: 'legendary', weight: 0.25, color: '#280840', textColor: '#e0a0ff', abbr: 'AS' },
  { key: 'chronoFortress',  name: 'Chrono Fortress',  tier: 4, rarity: 'legendary', weight: 0.25, color: '#c0b0ff', textColor: '#180820', abbr: 'CF' },
  { key: 'thunderGod',      name: 'Thunder God',      tier: 4, rarity: 'legendary', weight: 0.25, color: '#f8f840', textColor: '#202000', abbr: 'TG' },
  { key: 'naturesWrath',    name: "Nature's Wrath",   tier: 4, rarity: 'legendary', weight: 0.25, color: '#40c040', textColor: '#002000', abbr: 'NW' },
  { key: 'voidGolem',       name: 'Void Golem',       tier: 4, rarity: 'legendary', weight: 0.25, color: '#303060', textColor: '#c0c0ff', abbr: 'VG' },
  { key: 'starfallTower',   name: 'Starfall Tower',   tier: 4, rarity: 'legendary', weight: 0.25, color: '#f0d8ff', textColor: '#180820', abbr: 'SF' },
  { key: 'prismTower',      name: 'Prism Tower',      tier: 4, rarity: 'legendary', weight: 0.25, color: '#ffffff', textColor: '#181818', abbr: 'PT' },
  // ── NEW COMMON ──
  { key:'torchbearer',     name:'Torchbearer',    tier:1, rarity:'common',    weight:4.23, color:'#e86020', textColor:'#fff0e0', abbr:'TB' },
  { key:'hedgeKnight',     name:'Hedge Knight',   tier:1, rarity:'common',    weight:4.23, color:'#8090a0', textColor:'#0a1018', abbr:'HK' },
  { key:'rifleman',        name:'Rifleman',       tier:1, rarity:'common',    weight:4.23, color:'#b0a080', textColor:'#201808', abbr:'RF' },
  { key:'netThrower',      name:'Net Thrower',    tier:1, rarity:'common',    weight:4.23, color:'#909860', textColor:'#181c08', abbr:'NT' },
  { key:'brawler',         name:'Brawler',        tier:1, rarity:'common',    weight:4.23, color:'#c06040', textColor:'#200800', abbr:'BW' },
  { key:'herbalist',       name:'Herbalist',      tier:1, rarity:'common',    weight:4.23, color:'#70c060', textColor:'#081808', abbr:'HL' },
  { key:'watchtowerPost',  name:'Watch Post',     tier:1, rarity:'common',    weight:4.23, color:'#d0b870', textColor:'#201000', abbr:'WP' },
  { key:'demolisher',      name:'Demolisher',     tier:1, rarity:'common',    weight:4.23, color:'#606060', textColor:'#e0e0e0', abbr:'DM' },
  // ── NEW RARE ──
  { key:'bloodArcher',     name:'Blood Archer',   tier:2, rarity:'rare',      weight:2.31, color:'#c03030', textColor:'#ffe8e8', abbr:'BA' },
  { key:'ironGolemTower',  name:'Iron Golem',     tier:2, rarity:'rare',      weight:2.31, color:'#707080', textColor:'#e0e0f0', abbr:'IG' },
  { key:'chronoMage',      name:'Chrono Mage',    tier:2, rarity:'rare',      weight:2.31, color:'#a0c0ff', textColor:'#081828', abbr:'CM' },
  { key:'boneShaman',      name:'Bone Shaman',    tier:2, rarity:'rare',      weight:2.31, color:'#c8b870', textColor:'#281808', abbr:'BS' },
  { key:'tideCaller',      name:'Tide Caller',    tier:2, rarity:'rare',      weight:2.31, color:'#4080c0', textColor:'#e0f0ff', abbr:'TI' },
  { key:'vineTrap',        name:'Vine Trap',      tier:2, rarity:'rare',      weight:2.31, color:'#508040', textColor:'#e8ffe0', abbr:'VT' },
  { key:'glassCannonTower',name:'Glass Cannon',   tier:2, rarity:'rare',      weight:2.31, color:'#d0e0ff', textColor:'#102040', abbr:'GC' },
  { key:'sandGolemTower',  name:'Sand Golem',     tier:2, rarity:'rare',      weight:2.31, color:'#d0b870', textColor:'#201000', abbr:'SG' },
  { key:'thunderDrum',     name:'Thunder Drum',   tier:2, rarity:'rare',      weight:2.31, color:'#8060c0', textColor:'#f0e8ff', abbr:'TD' },
  // ── NEW EPIC ──
  { key:'phoenixTower',    name:'Phoenix Tower',  tier:3, rarity:'epic',      weight:0.55, color:'#ff6820', textColor:'#200800', abbr:'PX' },
  { key:'voidStalkerTower',name:'Void Stalker',   tier:3, rarity:'epic',      weight:0.55, color:'#502080', textColor:'#e0c0ff', abbr:'VS' },
  { key:'astralCannon',    name:'Astral Cannon',  tier:3, rarity:'epic',      weight:0.55, color:'#6080e0', textColor:'#f0f0ff', abbr:'AC' },
  { key:'runeForger',      name:'Rune Forger',    tier:3, rarity:'epic',      weight:0.55, color:'#e0a8f8', textColor:'#200820', abbr:'RN' },
  { key:'infernoDrake',    name:'Inferno Drake',  tier:3, rarity:'epic',      weight:0.55, color:'#d04010', textColor:'#fff0e0', abbr:'IK' },
  { key:'tempestCallerTower',name:'Tempest Caller',tier:3,rarity:'epic',      weight:0.55, color:'#80a8f8', textColor:'#081020', abbr:'TL' },
  { key:'deathKnight',     name:'Death Knight',   tier:3, rarity:'epic',      weight:0.55, color:'#403060', textColor:'#d0c0ff', abbr:'DK' },
  { key:'leechWraith',     name:'Leech Wraith',   tier:3, rarity:'epic',      weight:0.55, color:'#602080', textColor:'#f0c0ff', abbr:'LW' },
  { key:'warpGate',        name:'Warp Gate',      tier:3, rarity:'epic',      weight:0.55, color:'#8040e0', textColor:'#f8f0ff', abbr:'WG' },
  { key:'crystalGolem',    name:'Crystal Golem',  tier:3, rarity:'epic',      weight:0.55, color:'#80e8d8', textColor:'#081820', abbr:'CG' },
  { key:'stormWyvern',     name:'Storm Wyvern',   tier:3, rarity:'epic',      weight:0.55, color:'#90b8f8', textColor:'#081020', abbr:'SW' },
  { key:'mysticWell',      name:'Mystic Well',    tier:3, rarity:'epic',      weight:0.55, color:'#80d0e0', textColor:'#082028', abbr:'MW' },
  // ── NEW LEGENDARY ──
  { key:'omegaCannon',     name:'Omega Cannon',   tier:4, rarity:'legendary', weight:0.25, color:'#a08870', textColor:'#100800', abbr:'OC' },
  { key:'lichLord',        name:'Lich Lord',      tier:4, rarity:'legendary', weight:0.25, color:'#604080', textColor:'#e0c0ff', abbr:'LL' },
  { key:'celestialDragon', name:'Celestial Dragon',tier:4,rarity:'legendary', weight:0.25, color:'#e0d0ff', textColor:'#180828', abbr:'CD' },
  { key:'eternalFlame',    name:'Eternal Flame',  tier:4, rarity:'legendary', weight:0.25, color:'#ff4010', textColor:'#200000', abbr:'EF' },
  { key:'worldTree',       name:'World Tree',     tier:4, rarity:'legendary', weight:0.25, color:'#208030', textColor:'#e0ffe0', abbr:'WT' },
  { key:'stormGodTower',   name:'Storm God',      tier:4, rarity:'legendary', weight:0.25, color:'#d0e8ff', textColor:'#081020', abbr:'SG' },
  // ── TIER 5 — Divine (weight = 0.06 each) ──
  { key: 'seraphGuardian',      name: 'Seraph Guardian',      tier: 5, rarity: 'divine', weight: 0.06, color: '#fffbe8', textColor: '#a07800', abbr: 'SG' },
  { key: 'archangelCommander',  name: 'Archangel Commander',  tier: 5, rarity: 'divine', weight: 0.06, color: '#fff4c0', textColor: '#604000', abbr: 'AC' },
  { key: 'divineOracle',        name: 'Divine Oracle',        tier: 5, rarity: 'divine', weight: 0.06, color: '#e8f0ff', textColor: '#203060', abbr: 'DO' },
  { key: 'fallenSeraph',        name: 'Fallen Seraph',        tier: 5, rarity: 'divine', weight: 0.06, color: '#c0a0ff', textColor: '#100020', abbr: 'FS' },
  { key: 'dawnArbiter',         name: 'Dawn Arbiter',         tier: 5, rarity: 'divine', weight: 0.06, color: '#fff8d0', textColor: '#503000', abbr: 'DA' },
  // ── DRAFT REWARD — not rollable (weight 0), unique rarity ──
  { key: 'jester', name: 'The Jester', tier: 5, rarity: 'mystery', weight: 0, color: '#d020c8', textColor: '#fff0ff', abbr: 'JE' },
];

const RARITY_DUPE_CRYSTALS = { common: 10, rare: 25, epic: 60, legendary: 200, divine: 900, mystery: 500 };
const SINGLE_ROLL_COST = 100;
const MULTI_ROLL_COST  = 900;
const DEFAULT_UNLOCKED = [];

function getUnlockedUnits(username) {
  const acc = getAccountData(username);
  if (!acc) return [...DEFAULT_UNLOCKED];
  return acc.unlockedUnits || [...DEFAULT_UNLOCKED];
}

function getLoadout(username) {
  const acc = getAccountData(username);
  if (!acc) return [...DEFAULT_UNLOCKED];
  const unlocked = acc.unlockedUnits || [...DEFAULT_UNLOCKED];
  const saved = acc.loadout || [];
  // Return only saved keys that are still unlocked (up to 5)
  return saved.filter(k => unlocked.includes(k)).slice(0, 6);
}

function saveLoadout(username, keys) {
  const accounts = getAccounts();
  const idx = accounts.findIndex(a => a.username.toLowerCase() === username.toLowerCase());
  if (idx === -1) return;
  accounts[idx].loadout = keys.slice(0, 6);
  saveAccounts(accounts);
}

function getCrystals(username) {
  const acc = getAccountData(username);
  return acc ? (acc.crystals || 0) : 0;
}

function addCrystals(username, amount) {
  const accounts = getAccounts();
  const idx = accounts.findIndex(a => a.username.toLowerCase() === username.toLowerCase());
  if (idx === -1) return;
  accounts[idx].crystals = (accounts[idx].crystals || 0) + amount;
  saveAccounts(accounts);
}

function spendCrystals(username, amount) {
  const accounts = getAccounts();
  const idx = accounts.findIndex(a => a.username.toLowerCase() === username.toLowerCase());
  if (idx === -1) return false;
  if ((accounts[idx].crystals || 0) < amount) return false;
  accounts[idx].crystals -= amount;
  saveAccounts(accounts);
  return true;
}

function _unlockUnit(username, unitKey) {
  const accounts = getAccounts();
  const idx = accounts.findIndex(a => a.username.toLowerCase() === username.toLowerCase());
  if (idx === -1) return false;
  if (!accounts[idx].unlockedUnits) accounts[idx].unlockedUnits = [];
  if (!accounts[idx].unlockedUnits.includes(unitKey)) {
    accounts[idx].unlockedUnits.push(unitKey);
  }
  saveAccounts(accounts);
  return true;
}

function _performSingleRoll(username) {
  const totalWeight = GACHA_POOL.reduce((s, u) => s + u.weight, 0);
  let rand = Math.random() * totalWeight;
  let selected = GACHA_POOL[GACHA_POOL.length - 1];
  for (const unit of GACHA_POOL) {
    rand -= unit.weight;
    if (rand <= 0) { selected = unit; break; }
  }
  const unlocked = getUnlockedUnits(username);
  const isDupe = unlocked.includes(selected.key);
  if (!isDupe) {
    _unlockUnit(username, selected.key);
  } else {
    addCrystals(username, RARITY_DUPE_CRYSTALS[selected.rarity] || 10);
  }
  return { ...selected, isDupe };
}

function rollGacha(username) {
  if (!spendCrystals(username, SINGLE_ROLL_COST)) return null;
  return [_performSingleRoll(username)];
}

function tenRollGacha(username) {
  if (!spendCrystals(username, MULTI_ROLL_COST)) return null;
  const results = [];
  for (let i = 0; i < 10; i++) {
    results.push(_performSingleRoll(username));
  }
  return results;
}
