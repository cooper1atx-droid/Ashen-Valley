// ============================================================
//  TOWER.JS — All 20 tower definitions, placement, attacking, upgrades
// ============================================================

let towerIdCounter = 0;

// ============================================================
//  TOWER DEFINITIONS
// ============================================================
const TOWER_DEFS = [
  {
    id: 1, key: 'archer',
    name: 'Archer', abbr: 'AR', tier: 1,
    color: '#a0d060', textColor: '#2a4010',
    cost: 75,
    damage: 12, attackSpeed: 0.8, range: 120,
    targetType: 'single',
    description: 'Fast single-target bowman.',
    upgrades: [
      { cost: 60,  desc: '+5 dmg, +8 range' },
      { cost: 100, desc: 'Volley fires 5 arrows' },
      { cost: 180, desc: 'Arrows pierce 2 enemies' }
    ],
    abilityName: 'Volley', abilityCooldown: 10,
    abilityDesc: 'Fires 3 arrows simultaneously'
  },
  {
    id: 2, key: 'stoneThrower',
    name: 'Stone Thrower', abbr: 'ST', tier: 1,
    color: '#a08060', textColor: '#301800',
    cost: 100,
    damage: 25, attackSpeed: 2.5, range: 110,
    targetType: 'aoe', aoeRadius: 52,
    description: 'Hurls boulders for AoE damage.',
    upgrades: [
      { cost: 80,  desc: '+10 damage' },
      { cost: 140, desc: 'Splash radius +24px' },
      { cost: 200, desc: 'Shatter 30% chance' }
    ],
    abilityName: 'Shatter', shatterChance: 0.15,
    abilityDesc: '15% chance: rock shards hit 3 nearby for 50% dmg'
  },
  {
    id: 3, key: 'spearman',
    name: 'Spearman', abbr: 'SP', tier: 1,
    color: '#e0c060', textColor: '#302000',
    cost: 90,
    damage: 18, attackSpeed: 1.5, range: 150,
    targetType: 'pierce', pierceCount: 1,
    description: 'Linear pierce javelin thrower.',
    upgrades: [
      { cost: 70,  desc: 'Pierce +1 enemy' },
      { cost: 120, desc: 'Slow increases to 35%' },
      { cost: 190, desc: 'Stuns armored 0.5s' }
    ],
    abilityName: 'Impale',
    abilityDesc: 'Slows first hit enemy 20% for 2s'
  },
  {
    id: 4, key: 'scout',
    name: 'Watchtower Scout', abbr: 'SC', tier: 1,
    color: '#80c0e0', textColor: '#102030',
    cost: 50,
    damage: 0, attackSpeed: 0, range: 200,
    targetType: 'support',
    description: 'Reveals invisible enemies. Buffs adjacent towers.',
    upgrades: [
      { cost: 50,  desc: 'Detection range +96px' },
      { cost: 90,  desc: 'Adjacent buff +20% atk speed' },
      { cost: 150, desc: 'Revealed enemies take +15% dmg' }
    ],
    abilityName: 'Eagle Eye',
    abilityDesc: 'Reveals invisible, +10% adj atk speed'
  },
  {
    id: 5, key: 'cannon',
    name: 'Cannon', abbr: 'CN', tier: 1,
    color: '#808080', textColor: '#181818',
    cost: 180,
    damage: 50, attackSpeed: 4.0, range: 110,
    targetType: 'aoe', aoeRadius: 96,
    description: 'Massive AoE blast, slow reload.',
    upgrades: [
      { cost: 120, desc: '+20 damage' },
      { cost: 180, desc: 'Reload -0.8s' },
      { cost: 260, desc: 'Stun radius doubled' }
    ],
    abilityName: 'Concussive Blast',
    abilityDesc: 'Center enemies stunned 1s'
  },
  {
    id: 6, key: 'frostMage',
    name: 'Frost Mage', abbr: 'FM', tier: 2,
    color: '#60c0f0', textColor: '#102030',
    cost: 200,
    damage: 8, attackSpeed: 1.2, range: 110,
    targetType: 'single',
    description: 'Slows and freezes enemies.',
    upgrades: [
      { cost: 160, desc: 'Chill stacks faster' },
      { cost: 240, desc: 'Frozen +30% dmg taken' },
      { cost: 350, desc: 'Blizzard AoE pulse every 8s' }
    ],
    abilityName: 'Chill',
    abilityDesc: '5 stacks = freeze 1.5s'
  },
  {
    id: 7, key: 'fireWizard',
    name: 'Fire Wizard', abbr: 'FW', tier: 2,
    color: '#f06020', textColor: '#300800',
    cost: 225,
    damage: 15, burnDamage: 8, burnDuration: 4, attackSpeed: 1.4, range: 110,
    targetType: 'single',
    description: 'Applies burn DoT that spreads.',
    upgrades: [
      { cost: 175, desc: 'Burn duration → 6s' },
      { cost: 250, desc: 'Spread radius → 72px' },
      { cost: 380, desc: 'Burning enemies: +20% all dmg' }
    ],
    abilityName: 'Ignite',
    abilityDesc: 'Burns 4s, spreads to nearby'
  },
  {
    id: 8, key: 'poisonAlchemist',
    name: 'Poison Alchemist', abbr: 'PA', tier: 2,
    color: '#80c040', textColor: '#102008',
    cost: 185,
    damage: 5, poisonDamage: 12, poisonDuration: 5, attackSpeed: 2.0, range: 110,
    targetType: 'aoe', aoeRadius: 48,
    description: 'Creates toxic puddles that slow and poison.',
    upgrades: [
      { cost: 160, desc: 'Puddle duration → 8s' },
      { cost: 220, desc: 'Poison damage → 20/s' },
      { cost: 320, desc: 'Corrosive: -20% armor' }
    ],
    abilityName: 'Toxic Cloud',
    abilityDesc: 'Puddle slows 15% for 5s'
  },
  {
    id: 9, key: 'gatling',
    name: 'Gatling Gunner', abbr: 'GG', tier: 2,
    color: '#c0a040', textColor: '#201800',
    cost: 275,
    damage: 6, attackSpeed: 0.3, range: 110,
    targetType: 'single',
    description: 'Very fast fire rate, spin-up damage.',
    upgrades: [
      { cost: 200, desc: 'Spin Up cap +15' },
      { cost: 300, desc: 'Pierce armor 15%' },
      { cost: 420, desc: 'Target 2 enemies simultaneously' }
    ],
    abilityName: 'Spin Up',
    abilityDesc: '+1 dmg per consecutive hit, cap +10'
  },
  {
    id: 10, key: 'goldMine',
    name: 'Gold Mine', abbr: 'GM', tier: 2,
    color: '#ffd700', textColor: '#201800',
    cost: 300,
    damage: 0, attackSpeed: 0, range: 0,
    targetType: 'passive',
    description: 'Generates passive gold income.',
    upgrades: [
      { cost: 250, desc: 'Income → 25g/5s' },
      { cost: 350, desc: '+50g wave end bonus' },
      { cost: 500, desc: '40g/5s + 100g wave bonus' }
    ],
    abilityName: 'Passive Income',
    abilityDesc: '10g every 5s (2x on Gold Mine tile)'
  },
  {
    id: 11, key: 'lightningSage',
    name: 'Lightning Sage', abbr: 'LS', tier: 3,
    color: '#f0f040', textColor: '#201800',
    cost: 450,
    damage: 35, attackSpeed: 1.8, range: 130,
    targetType: 'chain', chainCount: 4,
    description: 'Lightning chains to 4 enemies.',
    upgrades: [
      { cost: 350, desc: 'Chain up to 6 enemies' },
      { cost: 450, desc: '+15 dmg per chain' },
      { cost: 600, desc: 'Overload shockwave 80 AoE' }
    ],
    abilityName: 'Overload',
    abilityDesc: '4 chained = stun all 0.5s'
  },
  {
    id: 12, key: 'amplifier',
    name: 'Amplifier', abbr: 'AM', tier: 3,
    color: '#e0c0ff', textColor: '#180828',
    cost: 400,
    damage: 0, attackSpeed: 0, range: 120,
    targetType: 'aura',
    description: 'Boosts nearby towers +18% dmg, +10% speed.',
    upgrades: [
      { cost: 300, desc: 'Aura radius +48px' },
      { cost: 400, desc: 'Damage buff +28%' },
      { cost: 550, desc: 'Cooldowns -20%' }
    ],
    abilityName: 'Power Surge',
    abilityDesc: '+18% dmg, +10% atk spd in range'
  },
  {
    id: 13, key: 'teslaCoil',
    name: 'Tesla Coil', abbr: 'TC', tier: 3,
    color: '#80e0ff', textColor: '#081820',
    cost: 475,
    damage: 20, attackSpeed: 0.9, range: 90,
    targetType: 'all_nearby',
    description: 'Hits all enemies in range. 30% stun.',
    upgrades: [
      { cost: 360, desc: 'Shock chance → 50%' },
      { cost: 480, desc: 'Stun duration → 0.8s' },
      { cost: 650, desc: 'Every 5th pulse: 3× damage' }
    ],
    abilityName: 'Shock',
    abilityDesc: '30% chance stun 0.4s'
  },
  {
    id: 14, key: 'healerMonk',
    name: 'Healer Monk', abbr: 'HM', tier: 3,
    color: '#fff080', textColor: '#201800',
    cost: 440,
    damage: 5, attackSpeed: 3.0, range: 96,
    targetType: 'aoe',
    description: 'Every 8s grants adjacent towers +20% atk speed for 5s. Slows enemies.',
    upgrades: [
      { cost: 380, desc: 'Mend buff → +25% atk speed' },
      { cost: 500, desc: 'Holy light +10 dmg' },
      { cost: 700, desc: 'Sanctify: -15% armor in area' }
    ],
    abilityName: 'Mend',
    abilityDesc: 'Every 8s: adjacent towers +20% atk speed for 5s'
  },
  {
    id: 15, key: 'necromancer',
    name: 'Necromancer', abbr: 'NC', tier: 3,
    color: '#a040c0', textColor: '#180820',
    cost: 600,
    damage: 18, attackSpeed: 2.2, range: 120,
    targetType: 'single',
    description: 'Raises slain enemies as skeletons.',
    upgrades: [
      { cost: 450, desc: 'Raise chance → 40%' },
      { cost: 550, desc: 'Skeletons last 15s' },
      { cost: 750, desc: 'Raise 2 skeletons' }
    ],
    abilityName: 'Raise Dead',
    abilityDesc: '25% on kill → skeleton for 8s'
  },
  {
    id: 16, key: 'droneLauncher',
    name: 'Drone Launcher', abbr: 'DL', tier: 3,
    color: '#80a0c0', textColor: '#101820',
    cost: 550,
    damage: 14, attackSpeed: 0.5, range: 999,
    targetType: 'drone',
    description: 'Deploys drones that chase enemies.',
    upgrades: [
      { cost: 420, desc: 'Max drones → 5' },
      { cost: 520, desc: 'Drone damage → 24' },
      { cost: 700, desc: 'Drones explode on expiry 40 AoE' }
    ],
    abilityName: 'Deploy',
    abilityDesc: '1 drone every 6s, max 3, expire 12s'
  },
  {
    id: 17, key: 'dragonNest',
    name: 'Dragon Nest', abbr: 'DN', tier: 4,
    color: '#f06040', textColor: '#200800',
    cost: 900,
    damage: 60, attackSpeed: 12.0, range: 9999,
    targetType: 'dragon',
    description: 'Sends dragon across battlefield.',
    upgrades: [
      { cost: 700,  desc: '2 dragons per flight' },
      { cost: 900,  desc: 'Burning trail 8dmg/s 3s' },
      { cost: 1200, desc: 'Dragon deals double damage' }
    ],
    abilityName: 'Dragon Flight',
    abilityDesc: 'Dragon flies across map every 12s'
  },
  {
    id: 18, key: 'blackHole',
    name: 'Black Hole Tower', abbr: 'BH', tier: 4,
    color: '#4020a0', textColor: '#c0a0ff',
    cost: 1000,
    damage: 10, attackSpeed: 0, range: 192,
    targetType: 'singularity',
    description: 'Pulls all enemies every 20s.',
    upgrades: [
      { cost: 800,  desc: 'Pull radius +96px' },
      { cost: 950,  desc: 'Hold duration → 6s' },
      { cost: 1200, desc: 'Collapse: 150 AoE at end' }
    ],
    abilityName: 'Singularity',
    abilityDesc: 'Every 20s: pull all 4s, others +50% dmg'
  },
  {
    id: 19, key: 'timeWarden',
    name: 'Time Warden', abbr: 'TW', tier: 4,
    color: '#d0c0ff', textColor: '#180820',
    cost: 1100,
    damage: 0, attackSpeed: 0, range: 160,
    targetType: 'time',
    description: 'Slows all enemies globally every 30s.',
    upgrades: [
      { cost: 850,  desc: 'Temporal field -25%' },
      { cost: 1000, desc: 'Time Slow duration → 8s' },
      { cost: 1400, desc: 'Time Rewind: enemies rewind 3s' }
    ],
    abilityName: 'Time Slow',
    abilityDesc: 'Every 30s: all enemies 30% speed 5s'
  },
  {
    id: 20, key: 'arcaneColossus',
    name: 'Arcane Colossus', abbr: 'AC', tier: 4,
    color: '#ff80ff', textColor: '#200020',
    cost: 1200,
    damage: 45, attackSpeed: 1.6, range: 192,
    targetType: 'aoe', aoeRadius: 72,
    description: 'All-element attacks + Cataclysm beam.',
    upgrades: [
      { cost: 900,  desc: '+20 base damage' },
      { cost: 1100, desc: 'Elemental effects last 50% longer' },
      { cost: 1500, desc: 'Cataclysm every 30s' }
    ],
    abilityName: 'Elemental Chaos',
    abilityDesc: 'Random element each attack'
  },

  // ── NEW TIER 1 (Common) ──────────────────────────────────────
  {
    id:21, key:'crossbow', name:'Crossbowman', abbr:'CX', tier:1,
    color:'#b0d080', textColor:'#1a3008',
    cost:80, damage:10, attackSpeed:0.5, range:130, targetType:'single',
    description:'Fast shots that apply bleed.',
    upgrades:[{cost:60,desc:'+5 dmg, bleed stronger'},{cost:100,desc:'Double bleed stacks'},{cost:160,desc:'50% chance armor pierce'}],
    abilityName:'Bleed', abilityDesc:'Every hit bleeds 4dmg/s for 3s'
  },
  {
    id:22, key:'slingshot', name:'Slingshot', abbr:'SL', tier:1,
    color:'#c8a060', textColor:'#281800',
    cost:55, damage:8, attackSpeed:1.0, range:110, targetType:'single',
    description:'Cheap; shot ricochets to 2 extra enemies.',
    upgrades:[{cost:45,desc:'+1 ricochet target'},{cost:80,desc:'+6 dmg'},{cost:130,desc:'Ricochet deals full damage'}],
    abilityName:'Ricochet', abilityDesc:'Bounces to 2 nearby enemies'
  },
  {
    id:23, key:'militiaPike', name:'Militia Pike', abbr:'MP', tier:1,
    color:'#a07850', textColor:'#201000',
    cost:65, damage:14, attackSpeed:2.0, range:70, targetType:'single',
    description:'Melee; slows nearby enemies 20%.',
    upgrades:[{cost:50,desc:'Slow increases to 30%'},{cost:90,desc:'+10 dmg'},{cost:140,desc:'Stuns on every 3rd hit'}],
    abilityName:'Slow Aura', abilityDesc:'Enemies within 70px move 20% slower'
  },
  {
    id:24, key:'oilThrower', name:'Oil Thrower', abbr:'OT', tier:1,
    color:'#505050', textColor:'#c8c8c8',
    cost:60, damage:5, attackSpeed:3.0, range:100, targetType:'aoe', aoeRadius:52,
    description:'Drops oil slicks. Oiled enemies take 2× fire damage.',
    upgrades:[{cost:70,desc:'Oil radius +20px'},{cost:120,desc:'Oil lasts longer'},{cost:180,desc:'Oil ignites: 8 dmg/s'}],
    abilityName:'Oil Slick', abilityDesc:'Oiled enemies take double fire dmg'
  },
  {
    id:25, key:'ballistae', name:'Ballistae', abbr:'BA', tier:1,
    color:'#787870', textColor:'#181818',
    cost:145, damage:30, attackSpeed:3.0, range:160, pierceCount:1, targetType:'pierce',
    description:'Very long range. Armor piercing.',
    upgrades:[{cost:90,desc:'+15 dmg'},{cost:140,desc:'Pierces 2 enemies'},{cost:200,desc:'30% armor shred on hit'}],
    abilityName:'Armor Pierce', abilityDesc:'Ignores 20% of enemy armor'
  },
  {
    id:26, key:'bombPoster', name:'Bomb Thrower', abbr:'BT', tier:1,
    color:'#484848', textColor:'#e8e8e8',
    cost:135, damage:35, attackSpeed:6.0, range:105, targetType:'aoe', aoeRadius:60,
    description:'Slow fire rate; every hit stuns 1s.',
    upgrades:[{cost:80,desc:'+20 dmg'},{cost:130,desc:'Stun radius doubles'},{cost:200,desc:'Cluster: 3 mini-bombs on impact'}],
    abilityName:'Stun Bomb', abilityDesc:'Every hit stuns center enemy 1s'
  },
  {
    id:27, key:'thornBush', name:'Thorn Bush', abbr:'TB', tier:1,
    color:'#408040', textColor:'#f0f0f0',
    cost:30, damage:0, attackSpeed:0, range:55, targetType:'passive',
    description:'Passive. Damages all enemies that enter range.',
    upgrades:[{cost:35,desc:'Thorn dmg +4/s'},{cost:60,desc:'Range +20px'},{cost:100,desc:'Slows enemies hit by thorns 15%'}],
    abilityName:'Thorns', abilityDesc:'6 dmg/s to all enemies in range'
  },
  {
    id:28, key:'flarePost', name:'Flare Post', abbr:'FP', tier:1,
    color:'#e8a020', textColor:'#201000',
    cost:50, damage:0, attackSpeed:0, range:160, targetType:'support',
    description:'Marks enemies: they take +10% damage from all sources.',
    upgrades:[{cost:40,desc:'Mark damage bonus → +25%'},{cost:70,desc:'Range +60px'},{cost:110,desc:'Marked enemies also slow nearby foes'}],
    abilityName:'Mark', abilityDesc:'Enemies in range take +10% damage'
  },

  // ── NEW TIER 2 (Rare) ────────────────────────────────────────
  {
    id:29, key:'stormArcher', name:'Storm Archer', abbr:'SA', tier:2,
    color:'#80c8f0', textColor:'#081828',
    cost:180, damage:18, attackSpeed:1.0, range:130, targetType:'single',
    description:'Lightning arrows chain to 1 extra nearby enemy.',
    upgrades:[{cost:140,desc:'Chain +1 target'},{cost:200,desc:'+12 dmg'},{cost:280,desc:'Chain stuns all hit 0.3s'}],
    abilityName:'Storm Arrow', abilityDesc:'Arrow chains to 1 nearby enemy'
  },
  {
    id:30, key:'plagueDoctor', name:'Plague Doctor', abbr:'PD', tier:2,
    color:'#70b050', textColor:'#0a1808',
    cost:195, damage:10, attackSpeed:2.0, range:115, targetType:'single',
    description:'Infects enemies; plague spreads to nearby on death.',
    upgrades:[{cost:150,desc:'Plague spreads further'},{cost:220,desc:'Infected enemies slow nearby 15%'},{cost:310,desc:'Plague also applies poison 12dmg/s'}],
    abilityName:'Infect', abilityDesc:'Target infected; spreads 80px on death'
  },
  {
    id:31, key:'shadowStalker', name:'Shadow Stalker', abbr:'SS', tier:2,
    color:'#503870', textColor:'#e0d0f8',
    cost:220, damage:20, attackSpeed:1.8, range:130, targetType:'single',
    description:'Targets camo enemies first. 3× crit on first hit per enemy.',
    upgrades:[{cost:170,desc:'Crit multiplier → 4×'},{cost:240,desc:'+10 dmg'},{cost:340,desc:'Permanently marks hit enemies'}],
    abilityName:'First Strike', abilityDesc:'3× crit on first hit per target'
  },
  {
    id:32, key:'pyromancer', name:'Pyromancer', abbr:'PY', tier:2,
    color:'#e05818', textColor:'#fff0e0',
    cost:230, damage:12, attackSpeed:2.5, range:110, targetType:'aoe', aoeRadius:56,
    description:'Creates persistent fire zones. Enemies take burn DoT inside.',
    upgrades:[{cost:180,desc:'Fire zone lasts longer'},{cost:260,desc:'Zone dmg +50%'},{cost:380,desc:'2 zones at once'}],
    abilityName:'Fire Zone', abilityDesc:'Persistent 5s fire zone, 15 dmg/s'
  },
  {
    id:33, key:'runesmith', name:'Runesmith', abbr:'RS', tier:2,
    color:'#d0a8f0', textColor:'#180828',
    cost:240, damage:0, attackSpeed:0, range:130, targetType:'support',
    description:'Enchants nearest tower: +25% damage permanently.',
    upgrades:[{cost:180,desc:'Buffs 2 nearest towers'},{cost:260,desc:'Buff → +35%'},{cost:360,desc:'Rune also adds +20% atk speed'}],
    abilityName:'Enchant', abilityDesc:'Nearest tower in range gets +25% dmg'
  },
  {
    id:34, key:'stoneGolem', name:'Stone Golem', abbr:'SG', tier:2,
    color:'#909090', textColor:'#181818',
    cost:260, damage:0, attackSpeed:0, range:72, targetType:'passive',
    description:'Extremely tanky. Slows enemies in range by 25%.',
    upgrades:[{cost:200,desc:'Slow → 35%, range +16px'},{cost:280,desc:'+20 dmg aura'},{cost:400,desc:'Taunt: enemies in range take -15% armor'}],
    abilityName:'Bulwark', abilityDesc:'25% slow aura; upgrade 3: Taunt reduces enemy armor 15%'
  },
  {
    id:35, key:'crystalBow', name:'Crystal Bow', abbr:'CB', tier:2,
    color:'#80e0d0', textColor:'#083020',
    cost:210, damage:14, attackSpeed:1.3, range:120, targetType:'single',
    description:'Ice arrows. Deals +60% damage to frozen/chilled enemies.',
    upgrades:[{cost:160,desc:'Chill stacks on hit'},{cost:230,desc:'+10 dmg'},{cost:320,desc:'Frozen bonus → +100%'}],
    abilityName:'Cryo Arrow', abilityDesc:'+60% dmg vs frozen/chilled targets'
  },
  {
    id:36, key:'trapMaster', name:'Trap Master', abbr:'TM', tier:2,
    color:'#c89040', textColor:'#201008',
    cost:250, damage:70, attackSpeed:8.0, range:110, targetType:'aoe', aoeRadius:40,
    description:'Places traps on path. Traps burst on contact for high burst+stun.',
    upgrades:[{cost:190,desc:'Trap dmg +40'},{cost:270,desc:'Max 4 traps'},{cost:380,desc:'Traps apply 50% slow 3s'}],
    abilityName:'Set Trap', abilityDesc:'Ground trap: 70 dmg + 1.5s stun'
  },

  // ── NEW TIER 3 (Epic) ────────────────────────────────────────
  {
    id:37, key:'stormCaller', name:'Storm Caller', abbr:'SC', tier:3,
    color:'#b0d0ff', textColor:'#080818',
    cost:500, damage:60, attackSpeed:0, range:999, targetType:'passive',
    description:'Every 4s calls lightning strike on 3 random enemies.',
    upgrades:[{cost:320,desc:'Strike 5 enemies'},{cost:420,desc:'Strike dmg +40'},{cost:580,desc:'Each strike chains to 1 nearby'}],
    abilityName:'Call Storm', abilityDesc:'Every 4s: 60 dmg lightning hits 3 enemies'
  },
  {
    id:38, key:'bloodKnight', name:'Blood Knight', abbr:'BK', tier:3,
    color:'#c83030', textColor:'#ffe0e0',
    cost:440, damage:20, attackSpeed:1.5, range:115, targetType:'single',
    description:'Gains +3 damage per kill. Stacks up to +120.',
    upgrades:[{cost:340,desc:'Kill bonus → +5/kill'},{cost:440,desc:'Cap doubles to +240'},{cost:600,desc:'On max stacks: bleed all in range'}],
    abilityName:'Blood Fury', abilityDesc:'+3 dmg per kill, max +120'
  },
  {
    id:39, key:'voidRifter', name:'Void Rifter', abbr:'VR', tier:3,
    color:'#6030a0', textColor:'#e0c8ff',
    cost:460, damage:0, attackSpeed:0, range:80, targetType:'passive',
    description:'Tears a void rift at placement. Enemies inside: 40% slower + 15 dmg/s.',
    upgrades:[{cost:350,desc:'Rift dmg → 25/s'},{cost:460,desc:'Slow → 55%'},{cost:620,desc:'Rift pulls enemies inward'}],
    abilityName:'Void Rift', abilityDesc:'Rift zone: 40% slow + 15 dmg/s'
  },
  {
    id:40, key:'banshee', name:'Banshee Tower', abbr:'BN', tier:3,
    color:'#c0c0e0', textColor:'#101018',
    cost:480, damage:0, attackSpeed:0, range:130, targetType:'passive',
    description:'Every 8s: deals 15% of max HP to all enemies in range.',
    upgrades:[{cost:360,desc:'% rises to 22%'},{cost:470,desc:'Also applies 2s stun'},{cost:640,desc:'HP drain radius +80px'}],
    abilityName:'Wail', abilityDesc:'Every 8s: 15% max HP to all in range'
  },
  {
    id:41, key:'mechanic', name:'Mechanic', abbr:'MC', tier:3,
    color:'#90b0d0', textColor:'#081820',
    cost:450, damage:0, attackSpeed:0, range:120, targetType:'support',
    description:'Nearby towers +20% atk speed. Every 15s Overclock: +30% atk speed burst for 4s.',
    upgrades:[{cost:340,desc:'Speed buff → +30%'},{cost:450,desc:'Overclock duration → 6s'},{cost:600,desc:'Also gives +15% dmg'}],
    abilityName:'Overclock', abilityDesc:'Every 15s: nearby towers +30% atk speed for 4s'
  },
  {
    id:42, key:'gravityWell', name:'Gravity Well', abbr:'GW', tier:3,
    color:'#4020c0', textColor:'#d0c0ff',
    cost:500, damage:0, attackSpeed:0, range:140, targetType:'passive',
    description:'Slows enemies based on proximity. Inner ring: 70% slow. Middle: 40%. Outer: 10%.',
    upgrades:[{cost:380,desc:'Pull force +50% (all rings stronger)'},{cost:490,desc:'Range +25'},{cost:660,desc:'Gravitational Collapse: stuns all enemies in range for 3s every 20s'}],
    abilityName:'Singularity', abilityDesc:'Slows enemies in 3 zones — strongest at center'
  },
  {
    id:43, key:'thornGolem', name:'Thorn Golem', abbr:'TG', tier:3,
    color:'#30a030', textColor:'#e0ffe0',
    cost:490, damage:18, attackSpeed:1.2, range:80, targetType:'all_nearby',
    description:'Hits all nearby enemies each attack. Poisons on upgrade.',
    upgrades:[{cost:370,desc:'+8 damage, range +10px'},{cost:480,desc:'+15 dmg'},{cost:650,desc:'On hit: poison nearby enemies'}],
    abilityName:'Thorn Slam', abilityDesc:'Hits all enemies in range each attack'
  },
  {
    id:44, key:'shadowPriest', name:'Shadow Priest', abbr:'SP', tier:3,
    color:'#803060', textColor:'#ffd8f0',
    cost:510, damage:12, attackSpeed:2.0, range:120, targetType:'single',
    description:'Curses enemies. Cursed foes spread 30% of received damage to nearby enemies.',
    upgrades:[{cost:390,desc:'Spread % → 45%'},{cost:500,desc:'Curse also slows 20%'},{cost:680,desc:'Curse stacks: max 3, +15% each'}],
    abilityName:'Curse', abilityDesc:'Cursed enemies spread 30% of dmg taken'
  },
  {
    id:45, key:'iceGolem', name:'Ice Golem', abbr:'IG', tier:3,
    color:'#60c8f0', textColor:'#082030',
    cost:520, damage:22, attackSpeed:3.5, range:100, targetType:'aoe', aoeRadius:80,
    description:'Slow attacks that freeze area. Frost nova every 12s.',
    upgrades:[{cost:400,desc:'Nova freezes 3s'},{cost:510,desc:'AoE radius +32px'},{cost:700,desc:'Permafrost: frozen ground lasts 6s after nova'}],
    abilityName:'Frost Nova', abilityDesc:'Every 12s: freeze all in range 2s'
  },
  {
    id:46, key:'manaVortex', name:'Mana Vortex', abbr:'MV', tier:3,
    color:'#8060e0', textColor:'#f0e8ff',
    cost:480, damage:0, attackSpeed:0, range:130, targetType:'support',
    description:'Enemies in range −35% speed. All towers on map attack 12% faster.',
    upgrades:[{cost:360,desc:'Speed penalty → −45%'},{cost:470,desc:'Tower haste → +18%'},{cost:640,desc:'Vortex drains 5 dmg/s to enemies'}],
    abilityName:'Haste Field', abilityDesc:'−35% enemy speed; all towers +12% atk speed'
  },
  {
    id:47, key:'thunderstrike', name:'Thunderstrike', abbr:'TS', tier:3,
    color:'#e0e040', textColor:'#202000',
    cost:530, damage:80, attackSpeed:0, range:120, targetType:'passive',
    description:'Every 15s drops a massive thunder strike. 80 dmg in 120 radius.',
    upgrades:[{cost:400,desc:'Cooldown → 7s'},{cost:520,desc:'Dmg → 220'},{cost:700,desc:'3 strikes per activation'}],
    abilityName:'Thunderbolt', abilityDesc:'Every 15s: 80 dmg AoE at enemy cluster'
  },
  {
    id:48, key:'spiritGuide', name:'Spirit Guide', abbr:'SG', tier:3,
    color:'#e0f0ff', textColor:'#081020',
    cost:420, damage:30, attackSpeed:0, range:130, targetType:'passive',
    description:'On enemy death in range: releases a homing spirit dealing 30 dmg.',
    upgrades:[{cost:360,desc:'Spirit dmg → 50'},{cost:460,desc:'2 spirits per kill'},{cost:620,desc:'Spirits chain to 1 extra enemy'}],
    abilityName:'Release Spirit', abilityDesc:'On nearby kill: homing spirit deals 30 dmg'
  },
  {
    id:49, key:'acidCatapult', name:'Acid Catapult', abbr:'AC', tier:3,
    color:'#90d050', textColor:'#102000',
    cost:490, damage:20, attackSpeed:3.0, range:120, targetType:'aoe', aoeRadius:64,
    description:'AoE acid that reduces enemy armor by 25% for 8s.',
    upgrades:[{cost:370,desc:'Armor shred → 35%'},{cost:480,desc:'Duration → 12s'},{cost:650,desc:'Acid also deals 10dmg/s'}],
    abilityName:'Corrosion', abilityDesc:'Splashes reduce enemy armor 25% for 8s'
  },
  {
    id:50, key:'soulHarvester', name:'Soul Harvester', abbr:'SH', tier:3,
    color:'#c060c0', textColor:'#fff0ff',
    cost:470, damage:0, attackSpeed:0, range:130, targetType:'passive',
    description:'Collects 1 soul per nearby kill. Every 12s releases burst: 25 dmg × souls.',
    upgrades:[{cost:420,desc:'Burst dmg → 35/soul'},{cost:540,desc:'Cooldown → 8s'},{cost:730,desc:'Souls also slow enemies on release'}],
    abilityName:'Soul Burst', abilityDesc:'Every 12s: releases accumulated souls as burst'
  },
  {
    id:51, key:'mirrorMage', name:'Mirror Mage', abbr:'MM', tier:3,
    color:'#d0e8ff', textColor:'#101828',
    cost:520, damage:0, attackSpeed:0, range:125, targetType:'support',
    description:'Enemies damaged in range spread 30% of that dmg to 2 nearby enemies.',
    upgrades:[{cost:390,desc:'Spread % → 45%'},{cost:500,desc:'+1 extra target'},{cost:680,desc:'Mirror also reflects slow/stun effects'}],
    abilityName:'Mirror Damage', abilityDesc:'30% of dmg splashes to 2 nearby enemies'
  },
  {
    id:52, key:'vortexCannon', name:'Vortex Cannon', abbr:'VC', tier:3,
    cost:540, damage:35, attackSpeed:2.5, range:130, targetType:'aoe', aoeRadius:70,
    color:'#7080c0', textColor:'#f0f0ff',
    description:'Fires a vortex that pulls 3 enemies toward impact point.',
    upgrades:[{cost:410,desc:'Pulls 5 enemies'},{cost:530,desc:'+25 dmg'},{cost:710,desc:'Vortex holds enemies 1s before exploding'}],
    abilityName:'Vortex', abilityDesc:'Impact pulls 3 nearby enemies inward'
  },

  // ── NEW TIER 4 (Legendary) ───────────────────────────────────
  {
    id:53, key:'celestialBeacon', name:'Celestial Beacon', abbr:'CB', tier:4,
    color:'#fffff0', textColor:'#202010',
    cost:1100, damage:0, attackSpeed:0, range:9999, targetType:'passive',
    description:'Every 40s: ALL towers on map gain +60% damage for 8s.',
    upgrades:[{cost:850,desc:'Cooldown → 30s'},{cost:1000,desc:'Buff duration → 12s'},{cost:1400,desc:'Also grants +30% attack speed during buff'}],
    abilityName:'Celestial Surge', abilityDesc:'Every 40s: all towers +60% dmg for 8s'
  },
  {
    id:54, key:'abyssalShrine', name:'Abyssal Shrine', abbr:'AS', tier:4,
    color:'#280840', textColor:'#e0a0ff',
    cost:1150, damage:40, attackSpeed:0, range:9999, targetType:'passive',
    description:'Every 25s spends 50g to summon a powerful demon for 15s.',
    upgrades:[{cost:880,desc:'Demon HP+dmg doubled'},{cost:1050,desc:'2 demons at once'},{cost:1400,desc:'Demon explodes on expiry: 80 AoE'}],
    abilityName:'Summon Demon', abilityDesc:'Every 25s: summon demon for 15s (costs 50g)'
  },
  {
    id:55, key:'chronoFortress', name:'Chrono Fortress', abbr:'CF', tier:4,
    color:'#c0b0ff', textColor:'#180820',
    cost:1200, damage:0, attackSpeed:0, range:170, targetType:'passive',
    description:'Permanent 50% slow aura. Global freeze every 60s.',
    upgrades:[{cost:920,desc:'Slow → 65%'},{cost:1100,desc:'Freeze duration → 8s'},{cost:1500,desc:'Rewind: strongest enemy teleports to start every 45s'}],
    abilityName:'Time Prison', abilityDesc:'50% slow aura; global 5s freeze every 60s'
  },
  {
    id:56, key:'thunderGod', name:'Thunder God', abbr:'TG', tier:4,
    color:'#f8f840', textColor:'#202000',
    cost:1250, damage:30, attackSpeed:1.5, range:180, targetType:'single',
    description:'Attacks with lightning bolts. Every 8s: chain lightning hits all enemies in range.',
    upgrades:[{cost:960,desc:'Chain dmg → 80'},{cost:1150,desc:'Also stuns all hit 0.5s'},{cost:1550,desc:'Overcharge: every 3rd activation triples damage'}],
    abilityName:'Divine Thunder', abilityDesc:'Every 8s: 30 lightning dmg to all enemies in range'
  },
  {
    id:57, key:'naturesWrath', name:"Nature's Wrath", abbr:'NW', tier:4,
    color:'#40c040', textColor:'#002000',
    cost:1100, damage:200, attackSpeed:0, range:200, targetType:'passive',
    description:'Every 15s: wave of thorns sweeps the path, dealing 200 AoE dmg.',
    upgrades:[{cost:840,desc:'Dmg → 300'},{cost:1000,desc:'2 thorn waves'},{cost:1350,desc:'Thorns also poison 20dmg/s for 5s'}],
    abilityName:'Thorn Wave', abilityDesc:'Every 15s: 200 dmg AoE sweeps path'
  },
  {
    id:58, key:'voidGolem', name:'Void Golem', abbr:'VG', tier:4,
    color:'#303060', textColor:'#c0c0ff',
    cost:1150, damage:60, attackSpeed:2.0, range:150, targetType:'single',
    description:'Every 30s: teleports the strongest enemy back to the start.',
    upgrades:[{cost:880,desc:'Cooldown → 20s'},{cost:1050,desc:'Teleport 2 enemies'},{cost:1400,desc:'Also deals 200 dmg on teleport'}],
    abilityName:'Void Banish', abilityDesc:'Every 30s: teleports strongest enemy to start'
  },
  {
    id:59, key:'starfallTower', name:'Starfall Tower', abbr:'SF', tier:4,
    color:'#f0d8ff', textColor:'#180820',
    cost:1200, damage:80, attackSpeed:0, range:9999, targetType:'passive',
    description:'Every 20s: 5 meteors rain on random enemy positions, 80 dmg each.',
    upgrades:[{cost:920,desc:'8 meteors'},{cost:1100,desc:'Meteor dmg → 130'},{cost:1500,desc:'Each meteor leaves fire zone 3s'}],
    abilityName:'Meteor Shower', abilityDesc:'Every 20s: 5 meteors, 80 dmg AoE each'
  },
  {
    id:60, key:'prismTower', name:'Prism Tower', abbr:'PT', tier:4,
    color:'#ffffff', textColor:'#181818',
    cost:1300, damage:25, attackSpeed:1.8, range:200, targetType:'passive',
    description:'Each attack fires 8 piercing beams in all directions simultaneously.',
    upgrades:[{cost:1000,desc:'Beam dmg → 40'},{cost:1200,desc:'Beams bounce off walls once'},{cost:1600,desc:'Every 3rd shot: rainbow beams deal all elements'}],
    abilityName:'Prism Burst', abilityDesc:'8 piercing beams in all directions'
  },

  // ── TIER 5 — Divine ──────────────────────────────────────────
  {
    id: 61, key: 'seraphGuardian',
    name: 'Seraph Guardian', abbr: 'SG', tier: 5,
    color: '#fffbe8', textColor: '#a07800',
    cost: 1400,
    damage: 0, attackSpeed: 0, range: 160,
    targetType: 'divine_aura',
    description: 'Slows all enemies in range 30%. Heals +1 life every 60s.',
    upgrades: [
      { cost: 1000, desc: 'Slow 30% → 40%, heal 60s → 45s' },
      { cost: 1200, desc: 'Slow 40% → 50%, heal 45s → 30s' },
      { cost: 1600, desc: 'Heal every 20s, slow aura +32px range' }
    ],
    abilityName: 'Divine Aura', abilityDesc: '30% slow aura, heal +1 life every 60s'
  },
  {
    id: 62, key: 'archangelCommander',
    name: 'Archangel Commander', abbr: 'AC', tier: 5,
    color: '#fff4c0', textColor: '#604000',
    cost: 1500,
    damage: 80, attackSpeed: 1.2, range: 160,
    targetType: 'single',
    description: 'High damage. Smites enemies below 20% HP. Buffs nearby tower speed.',
    upgrades: [
      { cost: 1100, desc: '+20 dmg, smite threshold 25%' },
      { cost: 1300, desc: 'Atk spd buff nearby +30%' },
      { cost: 1700, desc: 'Smite triggers 200 AoE divine burst' }
    ],
    abilityName: 'Divine Smite', abilityDesc: 'Instantly kills enemies below 20% HP'
  },
  {
    id: 63, key: 'divineOracle',
    name: 'Divine Oracle', abbr: 'DO', tier: 5,
    color: '#e8f0ff', textColor: '#203060',
    cost: 1350,
    damage: 0, attackSpeed: 0, range: 220,
    targetType: 'divine_aura',
    description: 'Reveals all invisible enemies. +50% gold from kills in range.',
    upgrades: [
      { cost: 1000, desc: 'Gold bonus → 75%' },
      { cost: 1200, desc: 'Wave complete: +100g bonus' },
      { cost: 1500, desc: 'Gold bonus → 100%, wave bonus → +200g' }
    ],
    abilityName: 'All-Seeing Eye', abilityDesc: 'Global invisibility reveal, +50% gold in range'
  },
  {
    id: 64, key: 'fallenSeraph',
    name: 'Fallen Seraph', abbr: 'FS', tier: 5,
    color: '#c0a0ff', textColor: '#100020',
    cost: 1450,
    damage: 70, attackSpeed: 1.5, range: 150,
    targetType: 'chain',
    chainCount: 2,
    description: 'Chain lightning. Full damage to armored and flying. Burns on upgrade.',
    upgrades: [
      { cost: 1050, desc: 'Chain +1 enemy (3 total)' },
      { cost: 1250, desc: '+20 damage' },
      { cost: 1600, desc: 'Chain applies burn 15/s for 2s' }
    ],
    abilityName: 'Void Chain', abilityDesc: 'Chain lightning hits 2 enemies, ignores armor'
  },
  {
    id: 65, key: 'dawnArbiter',
    name: 'Dawn Arbiter', abbr: 'DA', tier: 5,
    color: '#fff8d0', textColor: '#503000',
    cost: 1600,
    damage: 0, attackSpeed: 0, range: 9999,
    targetType: 'passive',
    description: 'Slows all enemies on map 10%. Every 10s: column of light 120 AoE.',
    upgrades: [
      { cost: 1200, desc: 'Global slow 15%, column dmg 150' },
      { cost: 1400, desc: 'Global slow 20%, fires 2 columns' },
      { cost: 1800, desc: 'Column dmg 200, stuns 2s' }
    ],
    abilityName: 'Judgment', abilityDesc: 'Global slow + column of divine light every 10s'
  },

  // ── NEW COMMON (Tier 1) ──────────────────────────────────────
  { id:66, key:'torchbearer', name:'Torchbearer', abbr:'TB', tier:1, color:'#e86020', textColor:'#fff0e0', cost:85, damage:10, attackSpeed:1.0, range:105, targetType:'single', description:'Applies burn on every hit.', upgrades:[{cost:60,desc:'Burn dmg 8→12/s'},{cost:100,desc:'Burn duration 2→3s'},{cost:160,desc:'+5 damage'}], abilityName:'Ignite', abilityDesc:'Every hit applies burn 8dmg/s 2s' },
  { id:67, key:'hedgeKnight', name:'Hedge Knight', abbr:'HK', tier:1, color:'#8090a0', textColor:'#0a1018', cost:140, damage:35, attackSpeed:2.8, range:80, targetType:'single', description:'Short-range melee powerhouse.', upgrades:[{cost:90,desc:'+10 damage'},{cost:140,desc:'Range +20px'},{cost:200,desc:'Cleave: hits 2nd closest enemy 50%'}], abilityName:'Cleave', abilityDesc:'Chance to hit adjacent enemy' },
  { id:68, key:'rifleman', name:'Rifleman', abbr:'RF', tier:1, color:'#b0a080', textColor:'#201808', cost:130, damage:28, attackSpeed:2.2, range:180, targetType:'single', description:'Long-range accurate single shot.', upgrades:[{cost:80,desc:'+8 damage'},{cost:130,desc:'Range +20px'},{cost:190,desc:'Headshot: 20% chance double dmg'}], abilityName:'Headshot', abilityDesc:'20% chance double damage' },
  { id:69, key:'netThrower', name:'Net Thrower', abbr:'NT', tier:1, color:'#909860', textColor:'#181c08', cost:95, damage:8, attackSpeed:2.0, range:115, targetType:'single', description:'Stuns enemies briefly on hit.', upgrades:[{cost:70,desc:'Stun 0.8→1.2s'},{cost:110,desc:'Range +20px'},{cost:170,desc:'Post-stun slow 30% for 2s'}], abilityName:'Ensnare', abilityDesc:'Stuns hit enemy 0.8s' },
  { id:70, key:'brawler', name:'Brawler', abbr:'BW', tier:1, color:'#c06040', textColor:'#200800', cost:80, damage:15, attackSpeed:0.6, range:65, targetType:'single', description:'Tiny range, rapid hits, bleeds enemy.', upgrades:[{cost:60,desc:'+5 damage'},{cost:100,desc:'Bleed dmg 5→8/s'},{cost:160,desc:'Range +15px'}], abilityName:'Frenzy', abilityDesc:'Applies bleed 5dmg/s 2s on hit' },
  { id:71, key:'herbalist', name:'Herbalist', abbr:'HL', tier:1, color:'#70c060', textColor:'#081808', cost:60, damage:6, attackSpeed:1.8, range:100, targetType:'aoe', aoeRadius:55, description:'Herb cloud slows nearby enemies.', upgrades:[{cost:65,desc:'Slow 25→35%'},{cost:110,desc:'AoE radius +15px'},{cost:175,desc:'Also applies poison 4dmg/s 2s'}], abilityName:'Herb Cloud', abilityDesc:'AoE slows 25%, small AoE damage' },
  { id:72, key:'watchtowerPost', name:'Watch Post', abbr:'WP', tier:1, color:'#d0b870', textColor:'#201000', cost:60, damage:0, attackSpeed:0, range:240, targetType:'support', description:'Reveals invisible. Marks enemies for +10% damage.', upgrades:[{cost:50,desc:'Range +50px'},{cost:90,desc:'Marked enemies take +10% dmg'},{cost:150,desc:'Mark bonus→20%'}], abilityName:'Vigilance', abilityDesc:'Reveals all invisible in range, marks targets' },
  { id:73, key:'demolisher', name:'Demolisher', abbr:'DM', tier:1, color:'#606060', textColor:'#e0e0e0', cost:160, damage:45, attackSpeed:8.0, range:120, targetType:'aoe', aoeRadius:70, description:'Slow-firing massive AoE bomb.', upgrades:[{cost:100,desc:'+20 damage'},{cost:150,desc:'AoE radius +20px'},{cost:220,desc:'Center stun 1s'}], abilityName:'Demolish', abilityDesc:'Large AoE explosion every 8s' },

  // ── NEW RARE (Tier 2) ────────────────────────────────────────
  { id:74, key:'bloodArcher', name:'Blood Archer', abbr:'BA', tier:2, color:'#c03030', textColor:'#ffe8e8', cost:220, damage:20, attackSpeed:1.0, range:130, targetType:'single', description:'Each kill grants bonus gold.', upgrades:[{cost:170,desc:'+8 damage'},{cost:240,desc:'Kill gold 3→5g'},{cost:320,desc:'Heal 1 life per 20 kills'}], abilityName:'Blood Price', abilityDesc:'+3g gold on every kill' },
  { id:75, key:'ironGolemTower', name:'Iron Golem', abbr:'IG', tier:2, color:'#707080', textColor:'#e0e0f0', cost:340, damage:55, attackSpeed:3.5, range:90, targetType:'single', description:'Ignores armor. Bonus damage to armored.', upgrades:[{cost:210,desc:'+15 damage'},{cost:290,desc:'Stuns armored 0.5s'},{cost:380,desc:'+15 damage, slam AoE 60px'}], abilityName:'Iron Fist', abilityDesc:'Ignores armor, +50% to armored enemies' },
  { id:76, key:'chronoMage', name:'Chrono Mage', abbr:'CM', tier:2, color:'#a0c0ff', textColor:'#081828', cost:240, damage:18, attackSpeed:2.5, range:120, targetType:'single', description:'Freezes each hit enemy briefly.', upgrades:[{cost:180,desc:'Freeze 0.5→0.8s'},{cost:260,desc:'+6 damage'},{cost:340,desc:'Frozen take +30% dmg from all'}], abilityName:'Timestop', abilityDesc:'Each hit freezes enemy 0.5s' },
  { id:77, key:'boneShaman', name:'Bone Shaman', abbr:'BS', tier:2, color:'#c8b870', textColor:'#281808', cost:230, damage:12, attackSpeed:1.2, range:115, targetType:'single', description:'Curses enemies to take more damage.', upgrades:[{cost:175,desc:'Curse dmg bonus 20→25%'},{cost:250,desc:'Curse duration 3→5s'},{cost:330,desc:'Curse spreads to nearest enemy'}], abilityName:'Bone Curse', abilityDesc:'Hit enemies take +20% dmg for 3s' },
  { id:78, key:'tideCaller', name:'Tide Caller', abbr:'TI', tier:2, color:'#4080c0', textColor:'#e0f0ff', cost:260, damage:15, attackSpeed:4.0, range:110, targetType:'aoe', aoeRadius:70, description:'Wave pushes enemies back.', upgrades:[{cost:200,desc:'Push distance 40→60px'},{cost:270,desc:'+10 damage'},{cost:360,desc:'Wave interval 4→3s'}], abilityName:'Tidal Wave', abilityDesc:'AoE wave pushes enemies back 40px' },
  { id:79, key:'vineTrap', name:'Vine Trap', abbr:'VT', tier:2, color:'#508040', textColor:'#e8ffe0', cost:210, damage:10, attackSpeed:2.5, range:105, targetType:'single', description:'Roots enemies in place on hit.', upgrades:[{cost:160,desc:'Root 1.5→2s'},{cost:230,desc:'+5 damage'},{cost:300,desc:'Root spreads to 1 adjacent enemy'}], abilityName:'Entangle', abilityDesc:'Roots hit enemy 1.5s' },
  { id:80, key:'glassCannonTower', name:'Glass Cannon', abbr:'GC', tier:2, color:'#d0e0ff', textColor:'#102040', cost:330, damage:50, attackSpeed:1.8, range:85, targetType:'single', description:'Highest tier-2 damage, short range.', upgrades:[{cost:230,desc:'+20 damage'},{cost:310,desc:'Range +15px'},{cost:400,desc:'25% crit chance: triple damage'}], abilityName:'Overcharge', abilityDesc:'Highest damage, very short range' },
  { id:81, key:'sandGolemTower', name:'Sand Golem', abbr:'SG', tier:2, color:'#d0b870', textColor:'#201000', cost:250, damage:20, attackSpeed:2.0, range:110, targetType:'aoe', aoeRadius:65, description:'AoE sand blast slows and blinds.', upgrades:[{cost:190,desc:'Slow 40→50%'},{cost:260,desc:'AoE radius +15px'},{cost:340,desc:'Blinded enemies deal -30% lives damage'}], abilityName:'Sandblast', abilityDesc:'AoE slows 40% for 3s' },
  { id:82, key:'thunderDrum', name:'Thunder Drum', abbr:'TD', tier:2, color:'#8060c0', textColor:'#f0e8ff', cost:245, damage:30, attackSpeed:14.0, range:100, targetType:'aoe', aoeRadius:80, description:'Stuns all enemies in range every 8s.', upgrades:[{cost:185,desc:'Stun 0.8→1.2s'},{cost:260,desc:'Range +20px'},{cost:340,desc:'Also deals 50 damage on stun'}], abilityName:'Thunder Clap', abilityDesc:'Stuns all in range every 8s' },

  // ── NEW EPIC (Tier 3) ────────────────────────────────────────
  { id:83, key:'phoenixTower', name:'Phoenix Tower', abbr:'PX', tier:3, color:'#ff6820', textColor:'#200800', cost:520, damage:40, attackSpeed:1.5, range:130, targetType:'single', description:'Attacks normally. Every 20s erupts in inferno burst.', upgrades:[{cost:400,desc:'+15 damage'},{cost:500,desc:'Burst AoE dmg 100→150'},{cost:680,desc:'Burst leaves fire zones 3s'}], abilityName:'Inferno Burst', abilityDesc:'Every 20s: 100 AoE fire dmg in range' },
  { id:84, key:'voidStalkerTower', name:'Void Stalker', abbr:'VS', tier:3, color:'#502080', textColor:'#e0c0ff', cost:630, damage:55, attackSpeed:1.3, range:160, targetType:'single', description:'Always targets highest HP enemy. Ignores armor.', upgrades:[{cost:420,desc:'+15 damage'},{cost:520,desc:'Slows target 20%'},{cost:700,desc:'On kill: instantly attacks next target'}], abilityName:'Hunt', abilityDesc:'Targets strongest, ignores armor' },
  { id:85, key:'astralCannon', name:'Astral Cannon', abbr:'AC2', tier:3, color:'#6080e0', textColor:'#f0f0ff', cost:560, damage:0, attackSpeed:0, range:9999, targetType:'passive', description:'Charges 15s then fires a beam dealing 300 dmg to all enemies in a line.', upgrades:[{cost:430,desc:'Charge 15→12s'},{cost:530,desc:'Beam dmg 300→450'},{cost:720,desc:'Fires 2 beams simultaneously'}], abilityName:'Stellar Beam', abilityDesc:'15s charge → devastating line beam, 300dmg' },
  { id:86, key:'runeForger', name:'Rune Forger', abbr:'RN', tier:3, color:'#e0a8f8', textColor:'#200820', cost:500, damage:25, attackSpeed:2.0, range:140, targetType:'single', description:'Empowers nearby towers with damage runes.', upgrades:[{cost:380,desc:'Rune bonus 25→30%'},{cost:480,desc:'Range +20px'},{cost:640,desc:'Also grants +15% range rune'}], abilityName:'Runic Empowerment', abilityDesc:'Towers within 80px gain +25% damage' },
  { id:87, key:'infernoDrake', name:'Inferno Drake', abbr:'IK', tier:3, color:'#d04010', textColor:'#fff0e0', cost:610, damage:35, attackSpeed:0.12, range:140, targetType:'single', description:'Rapid fire breath, ignites ground on upgrade.', upgrades:[{cost:410,desc:'+10 damage per shot'},{cost:510,desc:'Attack speed faster'},{cost:680,desc:'Leaves burning ground 5dmg/s 3s'}], abilityName:'Fire Breath', abilityDesc:'Rapid continuous fire breath' },
  { id:88, key:'tempestCallerTower', name:'Tempest Caller', abbr:'TL', tier:3, color:'#80a8f8', textColor:'#081020', cost:470, damage:25, attackSpeed:3.0, range:130, targetType:'aoe', aoeRadius:90, description:'Wind AoE pushes enemies back.', upgrades:[{cost:400,desc:'Push 50→70px'},{cost:500,desc:'+10 damage'},{cost:660,desc:'Push also slows 30% for 2s'}], abilityName:'Gale Force', abilityDesc:'AoE wind blast pushes enemies back 50px' },
  { id:89, key:'deathKnight', name:'Death Knight', abbr:'DK', tier:3, color:'#403060', textColor:'#d0c0ff', cost:600, damage:45, attackSpeed:1.8, range:120, targetType:'single', description:'Attacks enemies, summons skeleton every 15s.', upgrades:[{cost:430,desc:'Summon timer 15→10s'},{cost:530,desc:'+15 damage'},{cost:700,desc:'Death aura: 8dmg/s to nearby enemies'}], abilityName:'Raise Dead', abilityDesc:'Summons skeleton warrior every 15s' },
  { id:90, key:'leechWraith', name:'Leech Wraith', abbr:'LW', tier:3, color:'#602080', textColor:'#f0c0ff', cost:520, damage:30, attackSpeed:1.2, range:135, targetType:'single', description:'Each kill grants bonus gold and heals lives slowly.', upgrades:[{cost:400,desc:'Kill gold 8→12g'},{cost:490,desc:'Heals 1 life per 10 kills'},{cost:660,desc:'Drain 20% enemy max HP over 3s'}], abilityName:'Life Drain', abilityDesc:'+8g per kill, heals 1 life per 15 kills' },
  { id:91, key:'warpGate', name:'Warp Gate', abbr:'WG', tier:3, color:'#8040e0', textColor:'#f8f0ff', cost:580, damage:0, attackSpeed:0, range:130, targetType:'divine_aura', description:'Every 12s teleports nearest enemy back on the path.', upgrades:[{cost:440,desc:'Cooldown 12→8s'},{cost:540,desc:'Teleports 2 enemies'},{cost:720,desc:'Teleported enemies take 100 damage'}], abilityName:'Phase Shift', abilityDesc:'Every 12s: teleports nearest enemy to start of range' },
  { id:92, key:'crystalGolem', name:'Crystal Golem', abbr:'CG', tier:3, color:'#80e8d8', textColor:'#081820', cost:510, damage:40, attackSpeed:2.5, range:100, targetType:'aoe', aoeRadius:60, description:'AoE shard attack. Crystal nova every 20s.', upgrades:[{cost:390,desc:'+10 damage'},{cost:490,desc:'Shards pierce 2 enemies'},{cost:650,desc:'Crystal nova every 20s: 150 AoE dmg'}], abilityName:'Crystal Shards', abilityDesc:'AoE shard attack, crystal nova every 20s' },
  { id:93, key:'stormWyvern', name:'Storm Wyvern', abbr:'SW', tier:3, color:'#90b8f8', textColor:'#081020', cost:600, damage:35, attackSpeed:20.0, range:240, targetType:'passive', description:'Flies across map every 10s striking all enemies with lightning.', upgrades:[{cost:420,desc:'2 passes per flight'},{cost:520,desc:'+20 damage per strike'},{cost:700,desc:'Stuns 0.5s on each strike'}], abilityName:'Storm Strafe', abilityDesc:'Every 10s: flies across map, strikes all enemies' },
  { id:94, key:'mysticWell', name:'Mystic Well', abbr:'MW', tier:3, color:'#80d0e0', textColor:'#082028', cost:490, damage:0, attackSpeed:0, range:160, targetType:'divine_aura', description:'Slows enemies 35% in range. Pulses +5g every 8s.', upgrades:[{cost:370,desc:'Slow 35→45%'},{cost:470,desc:'Gold pulse every 6s'},{cost:630,desc:'Slow 45→55%, +8g per pulse'}], abilityName:'Arcane Flow', abilityDesc:'35% slow aura, +5g economy pulse every 8s' },

  // ── NEW LEGENDARY (Tier 4) ───────────────────────────────────
  { id:95, key:'omegaCannon', name:'Omega Cannon', abbr:'OC', tier:4, color:'#a08870', textColor:'#100800', cost:1400, damage:0, attackSpeed:0, range:220, targetType:'passive', description:'Charges 20s then fires a 280dmg AoE blast in range.', upgrades:[{cost:1000,desc:'Charge 20→15s, dmg 280→380'},{cost:1200,desc:'Blast radius 110→150px'},{cost:1600,desc:'Fires 2 blasts in rapid succession'}], abilityName:'Omega Blast', abilityDesc:'20s charge → 280 AoE dmg, 110px radius' },
  { id:96, key:'lichLord', name:'Lich Lord', abbr:'LL', tier:4, color:'#604080', textColor:'#e0c0ff', cost:1300, damage:35, attackSpeed:1.0, range:170, targetType:'single', description:'Raises skeletons on kill. Global death curse.', upgrades:[{cost:950,desc:'Raise 2 skeletons per kill'},{cost:1100,desc:'Curse slows enemies 15%'},{cost:1450,desc:'Lich bolt chains to 2 enemies'}], abilityName:'Lich Mastery', abilityDesc:'Raises skeleton on kill, global death curse' },
  { id:97, key:'celestialDragon', name:'Celestial Dragon', abbr:'CD', tier:4, color:'#e0d0ff', textColor:'#180828', cost:1350, damage:70, attackSpeed:8.0, range:9999, targetType:'dragon', description:'Holy dragon flies across map. Leaves blessing aura on towers.', upgrades:[{cost:980,desc:'2 dragons per flight'},{cost:1150,desc:'Blessing buff 20→30%'},{cost:1500,desc:'Dragon heals 1 life on each pass'}], abilityName:'Divine Flight', abilityDesc:'Dragon flies across map every 8s, leaves tower blessing' },
  { id:98, key:'eternalFlame', name:'Eternal Flame', abbr:'EF', tier:4, color:'#ff4010', textColor:'#200000', cost:1250, damage:0, attackSpeed:0, range:9999, targetType:'passive', description:'All enemies on map constantly burn 5dmg/s.', upgrades:[{cost:900,desc:'Burn 5→8dmg/s'},{cost:1050,desc:'Burn also slows 15%'},{cost:1400,desc:'Burn deals double to bosses'}], abilityName:'Eternal Fire', abilityDesc:'All enemies on map burn 5dmg/s permanently' },
  { id:99, key:'worldTree', name:'World Tree', abbr:'WT', tier:4, color:'#208030', textColor:'#e0ffe0', cost:1300, damage:0, attackSpeed:0, range:180, targetType:'passive', description:'Roots nearby enemies every 15s. Nature pulses 10dmg/s in range.', upgrades:[{cost:940,desc:'Root duration 2→3s, root dmg 80→120'},{cost:1100,desc:'Nature pulse 10→15dmg/s'},{cost:1450,desc:'Pulse also slows enemies 20%'}], abilityName:'Ancient Root', abilityDesc:'Every 15s: root nearby enemies 2s + 80 dmg. 10dmg/s pulse.' },
  { id:100, key:'stormGodTower', name:'Storm God', abbr:'SG', tier:4, color:'#d0e8ff', textColor:'#081020', cost:1450, damage:40, attackSpeed:1.2, range:180, targetType:'single', description:'Storm aura slows all 20%. Attacks chain to 3 enemies. Storm every 15s.', upgrades:[{cost:1050,desc:'Chain→5 enemies, storm dmg 200→280'},{cost:1250,desc:'Permanent slow 20→30%'},{cost:1600,desc:'Storm every 10s, also stuns 1s'}], abilityName:'Divine Storm', abilityDesc:'Storm aura, chain attacks, 200dmg storm every 15s' },

  // ── TIER 5 — Legendary (draft reward only) ──────────────────
  { id:101, key:'jester', name:'The Jester', abbr:'JE', tier:5,
    color:'#d020c8', textColor:'#fff0ff',
    cost:1400, damage:75, attackSpeed:1.2, range:165, targetType:'passive',
    description:'Cycles through 5 attack modes each shot: Single → Circle → Line → Cone → Full AOE. Legendary reward for completing Draft mode.',
    upgrades:[
      {cost:800,  desc:'+35 damage across all modes'},
      {cost:1000, desc:'Attack speed 1.2→0.8s'},
      {cost:1400, desc:'Full AOE mode stuns all enemies 2s'}
    ],
    abilityName:'Chaos Cycle', abilityDesc:'Rotates: Single → Circle → Line → Cone → Full AOE'
  }
];

// ── Per-tower placement limits ───────────────────────────────
// Keys listed here override the tier default (T1:8, T2:6, T3:5, T4:3, T5:2)
const _maxCountOverrides = {
  // Tier 1 — support/utility units capped lower
  scout: 5, flarePost: 5, watchtowerPost: 5,
  oilThrower: 6, bombPoster: 6, thornBush: 6, herbalist: 7,
  // Tier 2 — economy and strong buffers capped
  goldMine: 4, runesmith: 4,
  plagueDoctor: 5, shadowStalker: 5, pyromancer: 5, trapMaster: 5,
  stoneGolem: 5, ironGolemTower: 5, chronoMage: 5, thunderDrum: 5, glassCannonTower: 5,
  // Tier 3 — OP buffers / global effects capped hard
  amplifier: 3, manaVortex: 3,
  mechanic: 4, healerMonk: 4, stormCaller: 4, bloodKnight: 4,
  voidRifter: 4, banshee: 4, gravityWell: 4, shadowPriest: 4,
  iceGolem: 4, thunderstrike: 4, soulHarvester: 4, mirrorMage: 4,
  vortexCannon: 4, phoenixTower: 4, voidStalkerTower: 4,
  astralCannon: 3, runeForger: 4, infernoDrake: 4,
  deathKnight: 4, warpGate: 4, stormWyvern: 3, mysticWell: 4,
  // Tier 4 — global/mass effects capped to 2
  blackHole: 2, timeWarden: 2, celestialBeacon: 2, abyssalShrine: 2,
  chronoFortress: 2, thunderGod: 2, naturesWrath: 2, starfallTower: 2,
  eternalFlame: 2, celestialDragon: 2, omegaCannon: 2, stormGodTower: 2,
  // Tier 5 — global/most powerful, min 2
  dawnArbiter: 2, jester: 2,
};
const _tierMaxDefault = { 1: 8, 2: 6, 3: 5, 4: 3, 5: 2 };
for (const def of TOWER_DEFS) {
  def.maxCount = _maxCountOverrides[def.key] ?? _tierMaxDefault[def.tier] ?? 4;
}

// ============================================================
//  TOWER INSTANCE
// ============================================================
class Tower {
  constructor(defKey, px, py) {
    this.id = towerIdCounter++;
    this.def = TOWER_DEFS.find(d => d.key === defKey);
    this.x = px;
    this.y = py;
    this.col = Math.floor(px / CELL);
    this.row = Math.floor(py / CELL);
    this.upgradeLevel = 0;
    this.kills = 0;
    this.totalInvested = this.def.cost;
    this.attackTimer = 0;
    this.abilityTimer = this.def.abilityCooldown || 0;

    // Stats (modified by upgrades)
    this.damage = this.def.damage;
    this.attackSpeed = this.def.attackSpeed;
    this.range = this.def.range;
    this.aoeRadius = this.def.aoeRadius || 0;
    this.pierceCount = this.def.pierceCount || 1;
    this.chainCount = this.def.chainCount || 0;

    this.tileType = getTile(this.col, this.row); // kept for reference, no bonuses applied

    // Amplifier buff (applied externally)
    this.ampDmgBonus = 1.0;
    this.ampSpdBonus = 1.0;

    // Temporary speed buff timers
    this.mendSpdTimer = 0;    // from Healer Monk mend
    this.overclockTimer = 0;  // from Mechanic repair
    this.towerStunTimer = 0;  // from Disruptor enemy pulse

    // Specific tower state
    this.specialState = {};
    this._initSpecialState();

    // Visual
    this.shootFlash = 0;
    this.coneFlash = null;
    this.facingAngle = 0; // direction tower is aiming, updated each frame
    this.selected = false;
    this.maxHp = 100;
    this.currentHp = 100;
  }

  _initSpecialState() {
    const k = this.def.key;
    if (k === 'goldMine') {
      this.specialState = { incomeTimer: 0, incomePerInterval: 10, interval: 5 };
    } else if (k === 'frostMage') {
      this.specialState = { blizzardTimer: 0 };
    } else if (k === 'gatling') {
      this.specialState = { spinUp: {}, spinCap: 10, armorPierce: 0 };
    } else if (k === 'scout') {
      this.specialState = {};
    } else if (k === 'necromancer') {
      this.specialState = { raiseChance: 0.25, skeletonDuration: 8, maxSkeletons: 1 };
    } else if (k === 'droneLauncher') {
      this.specialState = { drones: [], maxDrones: 3, deployTimer: 0, deployInterval: 6 };
    } else if (k === 'blackHole') {
      this.specialState = { singularityTimer: 30, active: false, activeTimer: 0, holdDur: 4, pullRadius: 140 };
    } else if (k === 'timeWarden') {
      this.specialState = { slowTimer: 30, slowDur: 5, fieldSlow: 0.85, rewindUsed: false };
    } else if (k === 'healerMonk') {
      this.specialState = { mendTimer: 8, mendPct: 0.15, sanctify: false };
    } else if (k === 'amplifier') {
      this.specialState = { dmgBuff: 0.18, spdBuff: 0.1 };
    } else if (k === 'dragonNest') {
      this.specialState = { dragons: [], dragonCount: 1, burnTrail: false, doubleDmg: false };
    } else if (k === 'teslaCoil') {
      this.specialState = { pulseCount: 0, shockChance: 0.3, stunDur: 0.4 };
    } else if (k === 'arcaneColossus') {
      this.specialState = { cataclysmTimer: 45, cataclysmCooldown: 45, effectMult: 1.0 };
    } else if (k === 'lightningSage') {
      this.specialState = { shockwave: false };
    } else if (k === 'poisonAlchemist') {
      this.specialState = { puddles: [], pudDuration: 5, corrode: false };
    } else if (k === 'fireWizard') {
      this.specialState = { spreadRadius: 38, inferno: false };
    // ── New tower states ──────────────────────────────────────
    } else if (k === 'crossbow') {
      this.specialState = { bleedDmg: 4, bleedDur: 3 };
    } else if (k === 'slingshot') {
      this.specialState = { bounces: 2 };
    } else if (k === 'oilThrower') {
      this.specialState = { puddles: [] };
    } else if (k === 'trapMaster') {
      this.specialState = { traps: [], maxTraps: 3 };
    } else if (k === 'pyromancer') {
      this.specialState = { zones: [], maxZones: 1 };
    } else if (k === 'runesmith') {
      this.specialState = { runeTargets: [], runeBonus: 0.25, runeSpeedBonus: 0 };
    } else if (k === 'stoneGolem') {
      this.specialState = { slowPct: 0.75, damageAura: 0 };
      this.maxHp = 600; this.currentHp = 600;
    } else if (k === 'shadowStalker') {
      this.specialState = { firstHitTargets: new Set() };
    } else if (k === 'stormCaller') {
      this.specialState = { strikeTimer: 4, strikeCount: 3, strikeDmg: 60 };
    } else if (k === 'bloodKnight') {
      this.specialState = { killBonus: 0, killBonusPer: 3, killBonusCap: 120 };
    } else if (k === 'voidRifter') {
      this.specialState = { riftDmg: 15, riftSlow: 0.6, pull: false };
    } else if (k === 'banshee') {
      this.specialState = { wailTimer: 12, wailPct: 0.15, stunOnWail: false };
    } else if (k === 'mechanic') {
      this.specialState = { repairTimer: 15, speedBuff: 0.2, dmgBuff: 0, repairPct: 0.25 };
    } else if (k === 'gravityWell') {
      this.specialState = { pullDmg: 8, collapseTimer: 20, collapseActive: false };
    } else if (k === 'thornGolem') {
      this.specialState = { poisonOnHit: false };
    } else if (k === 'shadowPriest') {
      this.specialState = { cursed: new Set(), spreadPct: 0.30 };
    } else if (k === 'iceGolem') {
      this.specialState = { novaTimer: 12, novaFreeze: 2, permafrost: false };
    } else if (k === 'manaVortex') {
      this.specialState = { enemySlow: 0.65, towerHaste: 0.12, drain: 0 };
    } else if (k === 'thunderstrike') {
      this.specialState = { strikeTimer: 15, strikeDmg: 80, strikeRadius: 120, strikeCount: 1 };
    } else if (k === 'spiritGuide') {
      this.specialState = { spirits: [], spiritDmg: 30, spiritsPerKill: 1 };
    } else if (k === 'acidCatapult') {
      this.specialState = { shredPct: 0.25, shredDur: 8 };
    } else if (k === 'soulHarvester') {
      this.specialState = { souls: 0, releaseTimer: 12, burstDmg: 25, slowOnRelease: false };
    } else if (k === 'mirrorMage') {
      this.specialState = { spreadPct: 0.30, extraTargets: 0 };
    } else if (k === 'celestialBeacon') {
      this.specialState = { surgeTimer: 40, surgeDur: 0, surgeDmgBonus: 0.6, surgeActive: false, surgeSpd: false };
    } else if (k === 'abyssalShrine') {
      this.specialState = { demons: [], summonTimer: 25, demonDur: 15, demonDmg: 40, maxDemons: 1, explodeOnExpiry: false };
    } else if (k === 'chronoFortress') {
      this.specialState = { fieldSlow: 0.5, freezeTimer: 60, freezeDur: 5, rewindTimer: 999 };
    } else if (k === 'thunderGod') {
      this.specialState = { strikeTimer: 8, strikeDmg: 30, strikeCount: 0, stunOnStrike: false };
    } else if (k === 'naturesWrath') {
      this.specialState = { thrashTimer: 15, thrashDmg: 200, thrashCount: 1, thrashPoison: false };
    } else if (k === 'voidGolem') {
      this.specialState = { banishTimer: 30, banishCount: 1, banishDmg: 0 };
    } else if (k === 'starfallTower') {
      this.specialState = { strikeTimer: 20, meteorCount: 5, meteorDmg: 80, meteorRadius: 60, fireZone: false };
    } else if (k === 'prismTower') {
      this.specialState = { shotCount: 0, rainbow: false };
    } else if (k === 'torchbearer') {
      this.specialState = { burnDmg: 8, burnDur: 2 };
    } else if (k === 'hedgeKnight') {
      this.specialState = { cleave: false };
    } else if (k === 'rifleman') {
      this.specialState = { headshot: false };
    } else if (k === 'netThrower') {
      this.specialState = { stunDur: 0.8, postSlow: false };
    } else if (k === 'brawler') {
      this.specialState = { bleedDmg: 5, bleedDur: 2 };
    } else if (k === 'herbalist') {
      this.specialState = { slowPct: 0.75, poisonOnHit: false };
    } else if (k === 'watchtowerPost') {
      this.specialState = { markBonus: 0, marked: new Set() };
    } else if (k === 'demolisher') {
      this.specialState = { centerStun: false };
    } else if (k === 'bloodArcher') {
      this.specialState = { killGold: 3, killCount: 0, killsForHeal: 20, lifeHeal: false };
    } else if (k === 'ironGolemTower') {
      this.specialState = { slamAoe: false };
    } else if (k === 'chronoMage') {
      this.specialState = { freezeDur: 0.5, frozenBonus: false };
    } else if (k === 'boneShaman') {
      this.specialState = { curseBonus: 0.20, curseDur: 3, curseSpread: false };
    } else if (k === 'tideCaller') {
      this.specialState = { pushDist: 40, waveInterval: 4.0, waveTimer: 4.0 };
    } else if (k === 'vineTrap') {
      this.specialState = { rootDur: 1.5, rootSpread: false };
    } else if (k === 'glassCannonTower') {
      this.specialState = { critChance: 0, critMult: 3 };
    } else if (k === 'sandGolemTower') {
      this.specialState = { blindReduceDmg: false };
    } else if (k === 'thunderDrum') {
      this.specialState = { stunDur: 0.8, stunDmg: 0 };
    } else if (k === 'phoenixTower') {
      this.specialState = { burstTimer: 20, burstDmg: 100, fireZone: false, _fireZones: [] };
    } else if (k === 'voidStalkerTower') {
      this.specialState = { slowOnHit: false, instantNextTarget: false };
    } else if (k === 'astralCannon') {
      this.specialState = { chargeTimer: 15, chargeDur: 15, beamDmg: 300, beamCount: 1 };
    } else if (k === 'runeForger') {
      this.specialState = { runeBonus: 0.25, runeRange: 80, runeRangeBonus: false };
    } else if (k === 'infernoDrake') {
      this.specialState = { groundFire: false, _fireZones: [] };
    } else if (k === 'tempestCallerTower') {
      this.specialState = { pushDist: 50, postSlow: false };
    } else if (k === 'deathKnight') {
      this.specialState = { summonTimer: 15, summonInterval: 15, deathAura: false };
    } else if (k === 'leechWraith') {
      this.specialState = { killGold: 8, killCount: 0, killsForHeal: 15, drain: false };
    } else if (k === 'warpGate') {
      this.specialState = { warpTimer: 12, warpInterval: 12, warpCount: 1, warpDmg: 0 };
    } else if (k === 'crystalGolem') {
      this.specialState = { novaTimer: 20, novaDmg: 150, novaPrimed: false };
    } else if (k === 'stormWyvern') {
      this.specialState = { flyTimer: 10, wyvernDmg: 35, passes: 1, stunOnPass: false, _wyverns: [] };
    } else if (k === 'mysticWell') {
      this.specialState = { slowPct: 0.65, goldTimer: 8, goldInterval: 8, goldAmount: 5 };
    } else if (k === 'omegaCannon') {
      this.specialState = { chargeTimer: 20, chargeDur: 20, blastDmg: 280, blastRadius: 110, blastCount: 1 };
    } else if (k === 'lichLord') {
      this.specialState = { raisesPerKill: 1, chainBolt: false };
    } else if (k === 'celestialDragon') {
      this.specialState = { dragons: [], dragonCount: 1, blessingBuff: 0.20, healOnPass: false };
    } else if (k === 'eternalFlame') {
      this.specialState = { burnDmg: 5, burnSlow: false, doubleBoss: false };
    } else if (k === 'worldTree') {
      this.specialState = { rootTimer: 15, rootDur: 2, rootDmg: 80, pulseDmg: 10, pulseSlow: false };
    } else if (k === 'stormGodTower') {
      this.specialState = { stormTimer: 15, stormInterval: 15, stormDmg: 200, chainCount: 3, globalSlow: 0.80, stormStun: false };
    } else if (k === 'jester') {
      // mode: 0=single 1=circle 2=line 3=cone 4=full
      this.specialState = { mode: 0, attackTimer: 0, modeTimer: 3, stunOnFull: false };
    } else if (k === 'seraphGuardian') {
      this.specialState = { slowPct: 0.70, healTimer: 60, healInterval: 60 };
    } else if (k === 'archangelCommander') {
      this.specialState = { smiteThreshold: 0.20, spdBuff: 0.20, aoeOnSmite: false };
    } else if (k === 'divineOracle') {
      this.specialState = { goldBonus: 0.50, waveBonusGold: 0 };
    } else if (k === 'fallenSeraph') {
      this.specialState = { chainCount: 2, burnOnChain: false };
    } else if (k === 'dawnArbiter') {
      this.specialState = { globalSlow: 0.90, columnTimer: 10, columnDmg: 120, columnCount: 1, stunOnColumn: false, _fireZones: [] };
    } else if (k === 'plagueDoctor') {
      this.specialState = { spreadRadius: 80 };
    } else if (k === 'flarePost') {
      this.specialState = { markBonus: 0.10, marked: new Set() };
    } else if (k === 'stormArcher') {
      this.specialState = { chainRange: 100, chainStun: false };
    } else if (k === 'crystalBow') {
      this.specialState = { frozenBonus: 0.60 };
    } else if (k === 'vortexCannon') {
      this.specialState = { pullCount: 3, holdDur: 0 };
    } else if (k === 'thornBush') {
      this.specialState = { thornDmg: 6, slowOnHit: false };
    } else if (k === 'militiaPike') {
      this.specialState = { slowPct: 0.80, stunEvery: 0 };
    } else if (k === 'ballistae') {
      this.specialState = { armorShred: 0 };
    } else if (k === 'bombPoster') {
      this.specialState = {};
    }
  }

  getEffectiveAttackInterval() {
    let spd = this.ampSpdBonus;
    if (this.manaHaste)      spd *= (1 + this.manaHaste);
    if (this.mendSpdTimer   > 0) spd *= 1.20;
    if (this.overclockTimer > 0) spd *= 1.30;
    return this.attackSpeed / spd;
  }

  upgrade() {
    if (this.upgradeLevel >= 3) return false;
    const upg = this.def.upgrades[this.upgradeLevel];
    this.upgradeLevel++;
    this.totalInvested += upg.cost;
    this._applyUpgrade(this.upgradeLevel);
    // Reapply high ground bonus
    if (this.tileType === TILE.HIGH_GROUND) {
      // Range is re-set in apply
    }
    return true;
  }

  // Returns {damage, range, attackSpeed} deltas for the next upgrade level, without applying it.
  previewNextUpgrade() {
    if (this.upgradeLevel >= 3) return null;
    const nextLevel = this.upgradeLevel + 1;

    // Snapshot mutable stats
    const savedDamage      = this.damage;
    const savedRange       = this.range;
    const savedAttackSpeed = this.attackSpeed;
    const savedAoeRadius   = this.aoeRadius;
    const savedPierce      = this.pierceCount;
    const savedChain       = this.chainCount;
    const savedMaxHp       = this.maxHp;
    const savedCurrentHp   = this.currentHp;
    const savedDef         = this.def;

    // Save live arrays that hold Enemy references — these can't survive JSON.stringify
    // because enemy instances become POJOs, breaking .takeDamage() calls next frame
    const liveDrones  = this.specialState.drones;
    const liveDragons = this.specialState.dragons;
    const liveDemons  = this.specialState.demons;
    const liveTraps   = this.specialState.traps;

    // Temporarily null them out so JSON clone is clean
    if (liveDrones)  this.specialState.drones  = [];
    if (liveDragons) this.specialState.dragons = [];
    if (liveDemons)  this.specialState.demons  = [];
    if (liveTraps)   this.specialState.traps   = [];

    const savedSpecial = JSON.parse(JSON.stringify(this.specialState));

    // Restore live arrays on current specialState before running upgrade
    if (liveDrones)  this.specialState.drones  = liveDrones;
    if (liveDragons) this.specialState.dragons = liveDragons;
    if (liveDemons)  this.specialState.demons  = liveDemons;
    if (liveTraps)   this.specialState.traps   = liveTraps;

    // Run upgrade logic temporarily
    this._applyUpgrade(nextLevel);

    // Capture deltas for the three stats shown in the panel
    const deltas = {
      damage:      this.damage      - savedDamage,
      range:       this.range       - savedRange,
      attackSpeed: this.attackSpeed - savedAttackSpeed,
    };

    // Restore everything
    this.damage      = savedDamage;
    this.range       = savedRange;
    this.attackSpeed = savedAttackSpeed;
    this.aoeRadius   = savedAoeRadius;
    this.pierceCount = savedPierce;
    this.chainCount  = savedChain;
    this.maxHp       = savedMaxHp;
    this.currentHp   = savedCurrentHp;
    this.def         = savedDef;
    this.specialState = savedSpecial;
    // Re-attach live arrays (JSON clone would have turned enemy refs into dead POJOs)
    if (liveDrones)  this.specialState.drones  = liveDrones;
    if (liveDragons) this.specialState.dragons = liveDragons;
    if (liveDemons)  this.specialState.demons  = liveDemons;
    if (liveTraps)   this.specialState.traps   = liveTraps;

    return deltas;
  }

  _applyUpgrade(level) {
    const k = this.def.key;
    const base = this.def;

    if (k === 'archer') {
      if (level === 1) { this.damage += 5; this.range += 8; }
      if (level === 2) { /* volley arrow count handled in attack */ }
      if (level === 3) { this.pierceCount = 2; }
    } else if (k === 'stoneThrower') {
      if (level === 1) { this.damage += 10; }
      if (level === 2) { this.aoeRadius += 24; }
      if (level === 3) { this.def = { ...this.def, shatterChance: 0.3 }; }
    } else if (k === 'spearman') {
      if (level === 1) { this.pierceCount++; }
      if (level === 2) { /* slow 35% handled in attack */ }
      if (level === 3) { /* stun armored handled in attack */ }
    } else if (k === 'scout') {
      if (level === 1) { this.range += 96; }
      if (level === 2) { this.specialState.adjBuff = 0.2; }
      if (level === 3) { this.specialState.markDmg = true; }
    } else if (k === 'cannon') {
      if (level === 1) { this.damage += 20; }
      if (level === 2) { this.attackSpeed -= 0.8; }
      if (level === 3) { /* stun radius doubled handled in attack */ }
    } else if (k === 'frostMage') {
      if (level === 1) { /* handled in attack: double stack */ }
      if (level === 2) { /* handled in attack: frozenDmgBonus */ }
      if (level === 3) { this.specialState.blizzardTimer = 0; /* enable blizzard */ }
    } else if (k === 'fireWizard') {
      if (level === 1) { /* burn 6s handled in attack */ }
      if (level === 2) { this.specialState.spreadRadius = 72; }
      if (level === 3) { this.specialState.inferno = true; }
    } else if (k === 'poisonAlchemist') {
      if (level === 1) { this.specialState.pudDuration = 8; }
      if (level === 2) { /* poison 20/s handled in attack */ }
      if (level === 3) { this.specialState.corrode = true; }
    } else if (k === 'gatling') {
      if (level === 1) { this.specialState.spinCap = 15; }
      if (level === 2) { this.specialState.armorPierce = 0.15; }
      if (level === 3) { /* dual target handled in attack */ }
    } else if (k === 'goldMine') {
      if (level === 1) { this.specialState.incomePerInterval = 25; }
      if (level === 2) { this.specialState.waveBonusGold = 50; }
      if (level === 3) {
        this.specialState.incomePerInterval = 40;
        this.specialState.waveBonusGold = 100;
      }
    } else if (k === 'lightningSage') {
      if (level === 1) { this.chainCount = 6; }
      if (level === 2) { this.damage += 15; }
      if (level === 3) { this.specialState.shockwave = true; }
    } else if (k === 'amplifier') {
      if (level === 1) { this.range += 48; }
      if (level === 2) { this.specialState.dmgBuff = 0.28; }
      if (level === 3) { this.specialState.cooldownReduce = 0.2; }
    } else if (k === 'teslaCoil') {
      if (level === 1) { this.specialState.shockChance = 0.5; }
      if (level === 2) { this.specialState.stunDur = 0.8; }
      if (level === 3) { /* overcharge handled in attack */ }
    } else if (k === 'healerMonk') {
      if (level === 1) { this.specialState.mendPct = 0.25; }
      if (level === 2) { this.damage += 10; }
      if (level === 3) { this.specialState.sanctify = true; }
    } else if (k === 'necromancer') {
      if (level === 1) { this.specialState.raiseChance = 0.4; }
      if (level === 2) { this.specialState.skeletonDuration = 15; }
      if (level === 3) { this.specialState.maxSkeletons = 2; }
    } else if (k === 'droneLauncher') {
      if (level === 1) { this.specialState.maxDrones = 5; }
      if (level === 2) { /* drone dmg 24 handled in drone attack */ }
      if (level === 3) { this.specialState.explodeOnExpiry = true; }
    } else if (k === 'dragonNest') {
      if (level === 1) { this.specialState.dragonCount = 2; }
      if (level === 2) { this.specialState.burnTrail = true; }
      if (level === 3) { this.specialState.doubleDmg = true; }
    } else if (k === 'blackHole') {
      if (level === 1) { this.specialState.pullRadius += 96; this.range += 96; }
      if (level === 2) { this.specialState.holdDur = 6; }
      if (level === 3) { this.specialState.collapse = true; }
    } else if (k === 'timeWarden') {
      if (level === 1) { this.specialState.fieldSlow = 0.75; }
      if (level === 2) { this.specialState.slowDur = 8; }
      if (level === 3) { this.specialState.canRewind = true; }
    } else if (k === 'arcaneColossus') {
      if (level === 1) { this.damage += 20; }
      if (level === 2) { this.specialState.effectMult = 1.5; }
      if (level === 3) { this.specialState.cataclysmCooldown = 30; }
    // ── New tower upgrades ────────────────────────────────────
    } else if (k === 'crossbow') {
      if (level === 1) { this.damage += 5; this.specialState.bleedDmg = 6; }
      if (level === 2) { /* double bleed stacks handled in fire */ }
      if (level === 3) { this.specialState.armorPierce = true; }
    } else if (k === 'slingshot') {
      if (level === 1) { this.specialState.bounces = 3; }
      if (level === 2) { this.damage += 6; }
      if (level === 3) { this.specialState.fullDmg = true; }
    } else if (k === 'militiaPike') {
      if (level === 1) { this.specialState.slowPct = 0.70; }
      if (level === 2) { this.damage += 10; }
      if (level === 3) { this.specialState.stunEvery = 3; }
    } else if (k === 'oilThrower') {
      if (level === 1) { this.aoeRadius += 20; }
      if (level === 2) { /* longer duration handled */ }
      if (level === 3) { this.specialState.ignite = true; }
    } else if (k === 'ballistae') {
      if (level === 1) { this.damage += 15; }
      if (level === 2) { this.pierceCount = 2; }
      if (level === 3) { this.specialState.armorShred = 0.30; }
    } else if (k === 'bombPoster') {
      if (level === 1) { this.damage += 20; }
      if (level === 2) { /* stun radius doubled in fire */ }
      if (level === 3) { this.specialState.cluster = true; }
    } else if (k === 'thornBush') {
      if (level === 1) { this.specialState.thornDmg = 10; }
      if (level === 2) { this.range += 20; }
      if (level === 3) { this.specialState.slowOnHit = true; }
    } else if (k === 'flarePost') {
      if (level === 1) { this.specialState.markBonus = 0.25; }
      if (level === 2) { this.range += 60; }
      if (level === 3) { this.specialState.markSlow = true; }
    } else if (k === 'stormArcher') {
      if (level === 1) { this.specialState.chainRange = 130; }
      if (level === 2) { this.damage += 12; }
      if (level === 3) { this.specialState.chainStun = true; }
    } else if (k === 'plagueDoctor') {
      if (level === 1) { this.specialState.spreadRadius = 120; }
      if (level === 2) { /* slow nearby on infect */ }
      if (level === 3) { this.specialState.poisonPlague = true; }
    } else if (k === 'shadowStalker') {
      if (level === 1) { this.specialState.critMult = 4; }
      if (level === 2) { this.damage += 10; }
      if (level === 3) { this.specialState.permaMark = true; }
    } else if (k === 'pyromancer') {
      if (level === 1) { /* longer duration */ }
      if (level === 2) { this.specialState.zoneDmgMult = 1.5; }
      if (level === 3) { this.specialState.maxZones = 2; }
    } else if (k === 'runesmith') {
      if (level === 1) { this.specialState.runeCount = 2; }
      if (level === 2) { this.specialState.runeBonus = 0.35; }
      if (level === 3) { this.specialState.runeSpeedBonus = 0.20; }
    } else if (k === 'stoneGolem') {
      if (level === 1) { this.specialState.slowPct = 0.65; this.range += 16; }
      if (level === 2) { this.specialState.damageAura = 20; }
      if (level === 3) { this.specialState.taunt = true; }
    } else if (k === 'crystalBow') {
      if (level === 1) { /* chill on hit */ }
      if (level === 2) { this.damage += 10; }
      if (level === 3) { this.specialState.frozenBonus = 1.0; }
    } else if (k === 'trapMaster') {
      if (level === 1) { this.damage += 40; }
      if (level === 2) { this.specialState.maxTraps = 4; }
      if (level === 3) { this.specialState.trapSlow = true; }
    } else if (k === 'stormCaller') {
      if (level === 1) { this.specialState.strikeCount = 5; }
      if (level === 2) { this.specialState.strikeDmg += 40; }
      if (level === 3) { this.specialState.chainStrike = true; }
    } else if (k === 'bloodKnight') {
      if (level === 1) { this.specialState.killBonusPer = 5; }
      if (level === 2) { this.specialState.killBonusCap = 240; }
      if (level === 3) { this.specialState.bleedOnMax = true; }
    } else if (k === 'voidRifter') {
      if (level === 1) { this.specialState.riftDmg = 25; }
      if (level === 2) { this.specialState.riftSlow = 0.45; }
      if (level === 3) { this.specialState.pull = true; }
    } else if (k === 'banshee') {
      if (level === 1) { this.specialState.wailPct = 0.22; }
      if (level === 2) { this.specialState.stunOnWail = true; }
      if (level === 3) { this.range += 80; }
    } else if (k === 'mechanic') {
      if (level === 1) { this.specialState.speedBuff = 0.30; }
      if (level === 2) { this.specialState.overclockDur = 6; } // overclock lasts 6s instead of 4s
      if (level === 3) { this.specialState.dmgBuff = 0.15; }
    } else if (k === 'gravityWell') {
      if (level === 1) { this.specialState.pullStrength = 1.5; }
      if (level === 2) { this.range += 25; }
      if (level === 3) { this.specialState.collapseActive = true; }
    } else if (k === 'thornGolem') {
      if (level === 1) { this.damage += 8; this.range += 10; }
      if (level === 2) { this.damage += 15; }
      if (level === 3) { this.specialState.poisonOnHit = true; }
    } else if (k === 'shadowPriest') {
      if (level === 1) { this.specialState.spreadPct = 0.45; }
      if (level === 2) { /* slow on curse */ }
      if (level === 3) { this.specialState.maxCurseStacks = 3; }
    } else if (k === 'iceGolem') {
      if (level === 1) { this.specialState.novaFreeze = 3; }
      if (level === 2) { this.aoeRadius += 32; }
      if (level === 3) { this.specialState.permafrost = true; }
    } else if (k === 'manaVortex') {
      if (level === 1) { this.specialState.enemySlow = 0.55; }
      if (level === 2) { this.specialState.towerHaste = 0.18; }
      if (level === 3) { this.specialState.drain = 5; }
    } else if (k === 'thunderstrike') {
      if (level === 1) { this.specialState.strikeTimer = 7; }
      if (level === 2) { this.specialState.strikeDmg = 220; }
      if (level === 3) { this.specialState.strikeCount = 3; }
    } else if (k === 'spiritGuide') {
      if (level === 1) { this.specialState.spiritDmg = 50; }
      if (level === 2) { this.specialState.spiritsPerKill = 2; }
      if (level === 3) { this.specialState.spiritChain = true; }
    } else if (k === 'acidCatapult') {
      if (level === 1) { this.specialState.shredPct = 0.35; }
      if (level === 2) { this.specialState.shredDur = 12; }
      if (level === 3) { this.specialState.acidDot = 10; }
    } else if (k === 'soulHarvester') {
      if (level === 1) { this.specialState.burstDmg = 35; }
      if (level === 2) { this.specialState.releaseTimer = 8; }
      if (level === 3) { this.specialState.slowOnRelease = true; }
    } else if (k === 'mirrorMage') {
      if (level === 1) { this.specialState.spreadPct = 0.45; }
      if (level === 2) { this.specialState.extraTargets = 1; }
      if (level === 3) { /* reflect slow/stun */ }
    } else if (k === 'vortexCannon') {
      if (level === 1) { this.specialState.pullCount = 5; }
      if (level === 2) { this.damage += 25; }
      if (level === 3) { this.specialState.holdDur = 1; }
    } else if (k === 'celestialBeacon') {
      if (level === 1) { this.specialState.surgeTimer = 30; }
      if (level === 2) { this.specialState.surgeDur = 12; }
      if (level === 3) { this.specialState.surgeSpd = true; }
    } else if (k === 'abyssalShrine') {
      if (level === 1) { this.specialState.demonDmg *= 2; this.specialState.demonDur *= 2; }
      if (level === 2) { this.specialState.maxDemons = 2; }
      if (level === 3) { this.specialState.explodeOnExpiry = true; }
    } else if (k === 'chronoFortress') {
      if (level === 1) { this.specialState.fieldSlow = 0.35; }
      if (level === 2) { this.specialState.freezeDur = 8; }
      if (level === 3) { this.specialState.rewindTimer = 45; }
    } else if (k === 'thunderGod') {
      if (level === 1) { this.specialState.strikeDmg = 80; }
      if (level === 2) { this.specialState.stunOnStrike = true; }
      if (level === 3) { /* overcharge handled in update */ }
    } else if (k === 'naturesWrath') {
      if (level === 1) { this.specialState.thrashDmg = 300; }
      if (level === 2) { this.specialState.thrashCount = 2; }
      if (level === 3) { this.specialState.thrashPoison = true; }
    } else if (k === 'voidGolem') {
      if (level === 1) { this.specialState.banishTimer = 20; }
      if (level === 2) { this.specialState.banishCount = 2; }
      if (level === 3) { this.specialState.banishDmg = 200; }
    } else if (k === 'starfallTower') {
      if (level === 1) { this.specialState.meteorCount = 8; }
      if (level === 2) { this.specialState.meteorDmg = 130; }
      if (level === 3) { this.specialState.fireZone = true; }
    } else if (k === 'prismTower') {
      if (level === 1) { this.damage = 40; }
      if (level === 2) { /* bounce off walls — simplified: +1 pierce */ }
      if (level === 3) { this.specialState.rainbow = true; }
    // ── New unit upgrades ─────────────────────────────────────
    } else if (k === 'torchbearer') {
      if (level === 1) { this.specialState.burnDmg = 12; }
      if (level === 2) { this.specialState.burnDur = 3; }
      if (level === 3) { this.damage += 5; }
    } else if (k === 'hedgeKnight') {
      if (level === 1) { this.damage += 10; }
      if (level === 2) { this.range += 20; }
      if (level === 3) { this.specialState.cleave = true; }
    } else if (k === 'rifleman') {
      if (level === 1) { this.damage += 8; }
      if (level === 2) { this.range += 20; }
      if (level === 3) { this.specialState.headshot = true; }
    } else if (k === 'netThrower') {
      if (level === 1) { this.specialState.stunDur = 1.2; }
      if (level === 2) { this.range += 20; }
      if (level === 3) { this.specialState.postSlow = true; }
    } else if (k === 'brawler') {
      if (level === 1) { this.damage += 5; }
      if (level === 2) { this.specialState.bleedDmg = 8; }
      if (level === 3) { this.range += 15; }
    } else if (k === 'herbalist') {
      if (level === 1) { this.specialState.slowPct = 0.65; }
      if (level === 2) { this.aoeRadius += 15; }
      if (level === 3) { this.specialState.poisonOnHit = true; }
    } else if (k === 'watchtowerPost') {
      if (level === 1) { this.range += 50; }
      if (level === 2) { this.specialState.markBonus = 0.10; }
      if (level === 3) { this.specialState.markBonus = 0.20; }
    } else if (k === 'demolisher') {
      if (level === 1) { this.damage += 20; }
      if (level === 2) { this.aoeRadius += 20; }
      if (level === 3) { this.specialState.centerStun = true; }
    } else if (k === 'bloodArcher') {
      if (level === 1) { this.damage += 8; }
      if (level === 2) { this.specialState.killGold = 5; }
      if (level === 3) { this.specialState.lifeHeal = true; this.specialState.killsForHeal = 20; }
    } else if (k === 'ironGolemTower') {
      if (level === 1) { this.damage += 15; }
      if (level === 2) { /* stun armored handled in _fireAt */ }
      if (level === 3) { this.damage += 15; this.specialState.slamAoe = true; }
    } else if (k === 'chronoMage') {
      if (level === 1) { this.specialState.freezeDur = 0.8; }
      if (level === 2) { this.damage += 6; }
      if (level === 3) { this.specialState.frozenBonus = true; }
    } else if (k === 'boneShaman') {
      if (level === 1) { this.specialState.curseBonus = 0.25; }
      if (level === 2) { this.specialState.curseDur = 5; }
      if (level === 3) { this.specialState.curseSpread = true; }
    } else if (k === 'tideCaller') {
      if (level === 1) { this.specialState.pushDist = 60; }
      if (level === 2) { this.damage += 10; }
      if (level === 3) { this.specialState.waveInterval = 3.0; }
    } else if (k === 'vineTrap') {
      if (level === 1) { this.specialState.rootDur = 2.0; }
      if (level === 2) { this.damage += 5; }
      if (level === 3) { this.specialState.rootSpread = true; }
    } else if (k === 'glassCannonTower') {
      if (level === 1) { this.damage += 20; }
      if (level === 2) { this.range += 15; }
      if (level === 3) { this.specialState.critChance = 0.25; }
    } else if (k === 'sandGolemTower') {
      if (level === 1) { /* slow increase handled in _fireAt */ }
      if (level === 2) { this.aoeRadius += 15; }
      if (level === 3) { this.specialState.blindReduceDmg = true; }
    } else if (k === 'thunderDrum') {
      if (level === 1) { this.specialState.stunDur = 1.2; }
      if (level === 2) { this.range += 20; }
      if (level === 3) { this.specialState.stunDmg = 50; }
    } else if (k === 'phoenixTower') {
      if (level === 1) { this.damage += 15; }
      if (level === 2) { this.specialState.burstDmg = 150; }
      if (level === 3) { this.specialState.fireZone = true; }
    } else if (k === 'voidStalkerTower') {
      if (level === 1) { this.damage += 15; }
      if (level === 2) { this.specialState.slowOnHit = true; }
      if (level === 3) { this.specialState.instantNextTarget = true; }
    } else if (k === 'astralCannon') {
      if (level === 1) { this.specialState.chargeDur = 12; this.specialState.chargeTimer = Math.min(this.specialState.chargeTimer, 12); }
      if (level === 2) { this.specialState.beamDmg = 450; }
      if (level === 3) { this.specialState.beamCount = 2; }
    } else if (k === 'runeForger') {
      if (level === 1) { this.specialState.runeBonus = 0.30; }
      if (level === 2) { this.range += 20; }
      if (level === 3) { this.specialState.runeRangeBonus = true; }
    } else if (k === 'infernoDrake') {
      if (level === 1) { this.damage += 10; }
      if (level === 2) { this.attackSpeed *= 0.85; }
      if (level === 3) { this.specialState.groundFire = true; }
    } else if (k === 'tempestCallerTower') {
      if (level === 1) { this.specialState.pushDist = 70; }
      if (level === 2) { this.damage += 10; }
      if (level === 3) { this.specialState.postSlow = true; }
    } else if (k === 'deathKnight') {
      if (level === 1) { this.specialState.summonInterval = 10; }
      if (level === 2) { this.damage += 15; }
      if (level === 3) { this.specialState.deathAura = true; }
    } else if (k === 'leechWraith') {
      if (level === 1) { this.specialState.killGold = 12; }
      if (level === 2) { this.specialState.killsForHeal = 10; }
      if (level === 3) { this.specialState.drain = true; }
    } else if (k === 'warpGate') {
      if (level === 1) { this.specialState.warpInterval = 8; }
      if (level === 2) { this.specialState.warpCount = 2; }
      if (level === 3) { this.specialState.warpDmg = 100; }
    } else if (k === 'crystalGolem') {
      if (level === 1) { this.damage += 10; }
      if (level === 2) { /* pierce handled in _fireAt */ }
      if (level === 3) { this.specialState.novaPrimed = true; }
    } else if (k === 'stormWyvern') {
      if (level === 1) { this.specialState.passes = 2; }
      if (level === 2) { this.specialState.wyvernDmg += 20; }
      if (level === 3) { this.specialState.stunOnPass = true; }
    } else if (k === 'mysticWell') {
      if (level === 1) { this.specialState.slowPct = 0.55; }
      if (level === 2) { this.specialState.goldInterval = 6; }
      if (level === 3) { this.specialState.slowPct = 0.45; this.specialState.goldAmount = 8; }
    } else if (k === 'omegaCannon') {
      if (level === 1) { this.specialState.chargeDur = 15; this.specialState.blastDmg = 380; }
      if (level === 2) { this.specialState.blastRadius = 150; }
      if (level === 3) { this.specialState.blastCount = 2; }
    } else if (k === 'lichLord') {
      if (level === 1) { this.specialState.raisesPerKill = 2; }
      if (level === 2) { /* curse slow handled in update */ }
      if (level === 3) { this.specialState.chainBolt = true; }
    } else if (k === 'celestialDragon') {
      if (level === 1) { this.specialState.dragonCount = 2; }
      if (level === 2) { this.specialState.blessingBuff = 0.30; }
      if (level === 3) { this.specialState.healOnPass = true; }
    } else if (k === 'eternalFlame') {
      if (level === 1) { this.specialState.burnDmg = 8; }
      if (level === 2) { this.specialState.burnSlow = true; }
      if (level === 3) { this.specialState.doubleBoss = true; }
    } else if (k === 'worldTree') {
      if (level === 1) { this.specialState.rootDur = 3; this.specialState.rootDmg = 120; }
      if (level === 2) { this.specialState.pulseDmg = 15; }
      if (level === 3) { this.specialState.pulseSlow = true; }
    } else if (k === 'stormGodTower') {
      if (level === 1) { this.specialState.chainCount = 5; this.specialState.stormDmg = 280; }
      if (level === 2) { this.specialState.globalSlow = 0.70; }
      if (level === 3) { this.specialState.stormInterval = 10; this.specialState.stormStun = true; }
    } else if (k === 'jester') {
      if (level === 1) { this.damage += 35; }
      if (level === 2) { this.attackSpeed = 0.8; }
      if (level === 3) { this.specialState.stunOnFull = true; }
    } else if (k === 'seraphGuardian') {
      if (level === 1) { this.specialState.slowPct = 0.60; this.specialState.healInterval = 45; }
      if (level === 2) { this.specialState.slowPct = 0.50; this.specialState.healInterval = 30; }
      if (level === 3) { this.specialState.healInterval = 20; this.range += 32; }
    } else if (k === 'archangelCommander') {
      if (level === 1) { this.damage += 20; this.specialState.smiteThreshold = 0.25; }
      if (level === 2) { this.specialState.spdBuff = 0.30; }
      if (level === 3) { this.specialState.aoeOnSmite = true; }
    } else if (k === 'divineOracle') {
      if (level === 1) { this.specialState.goldBonus = 0.75; this.specialState.waveBonusGold = 0; }
      if (level === 2) { this.specialState.waveBonusGold = 100; }
      if (level === 3) { this.specialState.goldBonus = 1.00; this.specialState.waveBonusGold = 200; }
    } else if (k === 'fallenSeraph') {
      if (level === 1) { this.specialState.chainCount = 3; }
      if (level === 2) { this.damage += 20; }
      if (level === 3) { this.specialState.burnOnChain = true; }
    } else if (k === 'dawnArbiter') {
      if (level === 1) { this.specialState.globalSlow = 0.85; this.specialState.columnDmg = 150; }
      if (level === 2) { this.specialState.globalSlow = 0.80; this.specialState.columnCount = 2; }
      if (level === 3) { this.specialState.columnDmg = 200; this.specialState.stunOnColumn = true; }
    }

    // Re-apply high ground range bonus
    if (this.tileType === TILE.HIGH_GROUND) {
      this.range = Math.round(this.range * 1.0); // already applied at creation
    }
  }

  getSellValue() {
    return Math.floor(this.totalInvested * 0.6);
  }

  getNextUpgradeCost() {
    if (this.upgradeLevel >= 3) return null;
    return this.def.upgrades[this.upgradeLevel].cost;
  }

  // Main update: called each frame
  update(dt, enemies, projectiles, effects, economy, towers, allEnemies) {
    this.shootFlash = Math.max(0, this.shootFlash - dt * 4);
    if (this.coneFlash && this.coneFlash.timer > 0) this.coneFlash.timer = Math.max(0, this.coneFlash.timer - dt * 3);
    if (this.towerStunTimer > 0) { this.towerStunTimer = Math.max(0, this.towerStunTimer - dt); return; }
    // Update facing angle for AOE preview — only for towers that aim at targets
    if (this.def.damage > 0 && this.range > 0 && this.range < 9999) {
      const aimTarget = findFurthestEnemy(this.x, this.y, this.range, enemies);
      if (aimTarget) {
        this.facingAngle = Math.atan2(aimTarget.y - this.y, aimTarget.x - this.x);
      } else {
        this.facingAngle += dt * 0.7;
      }
    } else {
      this.facingAngle += dt * 0.5; // passive/global towers spin slowly
    }
    if (this.mendSpdTimer   > 0) this.mendSpdTimer   = Math.max(0, this.mendSpdTimer   - dt);
    if (this.overclockTimer > 0) this.overclockTimer = Math.max(0, this.overclockTimer - dt);
    if (this.manaHaste) this.manaHaste = 0; // reset each frame, re-applied by Mana Vortex

    const k = this.def.key;

    // Amplifier — apply buffs to nearby towers
    if (k === 'amplifier') {
      // Applied in main.js loop
      return;
    }

    // Scout — reveal invisible enemies, apply adj buff
    if (k === 'scout') {
      for (const e of enemies) {
        if (e.isInvisible) {
          const dx = e.x - this.x, dy = e.y - this.y;
          if (dx*dx + dy*dy <= this.range * this.range) {
            e.isRevealed = true;
            if (this.upgradeLevel >= 3) e.markedByScout = true;
          }
        }
      }
      return;
    }

    // Gold Mine — passive income
    if (k === 'goldMine') {
      this.specialState.incomeTimer += dt;
      if (this.specialState.incomeTimer >= this.specialState.interval) {
        this.specialState.incomeTimer -= this.specialState.interval;
        economy.addGold(this.specialState.incomePerInterval, this.x, this.y);
      }
      return;
    }

    // Black Hole Tower
    if (k === 'blackHole') {
      const ss = this.specialState;
      if (!ss.active) {
        ss.singularityTimer -= dt;
        if (ss.singularityTimer <= 0) {
          ss.singularityTimer = 20;
          ss.active = true;
          ss.activeTimer = ss.holdDur;
          effects.addScreenShake(4);
          effects.addFloatText(this.x, this.y - 20, 'SINGULARITY!', 'float-crit');
        }
        // Passive DoT within range
        for (const e of enemies) {
          if (!e.dead && !e.reached) {
            const dx = e.x - this.x, dy = e.y - this.y;
            if (dx*dx + dy*dy <= ss.pullRadius * ss.pullRadius) {
              e.takeDamage(this.damage * dt, this);
            }
          }
        }
      } else {
        ss.activeTimer -= dt;
        // Pull enemies toward center — slow them heavily instead of yanking off-path
        for (const e of enemies) {
          if (!e.dead && !e.reached) {
            const dx = this.x - e.x, dy = this.y - e.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist <= ss.pullRadius) {
              // 90% slow (nearly frozen) while in the singularity
              e.slowFactor = Math.min(e.slowFactor, 0.10);
              // Mild cosmetic nudge — won't overcome path movement
              const nudge = Math.min(20, 60) * dt;
              e.x += (dx / (dist || 1)) * nudge;
              e.y += (dy / (dist || 1)) * nudge;
              e.blackHolePulled = true;
              e.takeDamage(this.damage * dt, this);
            }
          }
        }
        if (ss.activeTimer <= 0) {
          ss.active = false;
          for (const e of enemies) e.blackHolePulled = false;
          if (ss.collapse) {
            for (const e of enemies) {
              if (!e.dead && !e.reached) {
                const dx = e.x - this.x, dy = e.y - this.y;
                if (dx*dx + dy*dy <= ss.pullRadius * ss.pullRadius) {
                  e.takeDamage(150, this);
                  effects.addHitEffect(e.x, e.y, 'shadow');
                }
              }
            }
            effects.addScreenShake(8);
            effects.addFloatText(this.x, this.y - 20, 'COLLAPSE!', 'float-crit');
          }
        }
      }
      return;
    }

    // Time Warden
    if (k === 'timeWarden') {
      const ss = this.specialState;
      // Temporal field: slow enemies in range permanently
      for (const e of enemies) {
        if (!e.dead && !e.reached) {
          const dx = e.x - this.x, dy = e.y - this.y;
          if (dx*dx + dy*dy <= this.range * this.range) {
            e.applySlow(ss.fieldSlow, 0.5); // refresh every frame
          }
        }
      }
      // Range-limited time slow burst
      ss.slowTimer -= dt;
      if (ss.slowTimer <= 0) {
        ss.slowTimer = 30;
        effects.addFloatText(this.x, this.y - 20, 'TIME SLOW!', 'float-crit');
        for (const e of enemies) {
          if (!e.dead && !e.reached) {
            const dx = e.x - this.x, dy = e.y - this.y;
            if (dx*dx + dy*dy <= this.range * this.range) {
              e.applySlow(0.4, ss.slowDur);
            }
          }
        }
      }
      return;
    }

    // Healer Monk mend ability
    if (k === 'healerMonk') {
      const ss = this.specialState;
      ss.mendTimer -= dt;
      if (ss.mendTimer <= 0) {
        ss.mendTimer = 8;
        // Mend: grant adjacent towers +20% attack speed for 5s
        for (const t of towers) {
          if (t !== this) {
            const dx = Math.abs(t.col - this.col), dy = Math.abs(t.row - this.row);
            if (dx <= 1 && dy <= 1) {
              t.mendSpdTimer = 5;
              effects.addHitEffect(t.x, t.y, 'holy');
            }
          }
        }
        effects.addFloatText(this.x, this.y - 20, '✦ MEND', 'float-gold');
      }
      // Sanctify: reduce armor of nearby enemies
      if (ss.sanctify) {
        for (const e of enemies) {
          if (!e.dead && !e.reached) {
            const dx = e.x - this.x, dy = e.y - this.y;
            if (dx*dx + dy*dy <= this.range * this.range) {
              e.sanctified = true;
            }
          }
        }
      }
    }

    // Dragon Nest
    if (k === 'dragonNest') {
      this.attackTimer += dt;
      const ss = this.specialState;
      const pixelWPs = buildPixelWaypoints();

      // Update existing dragons — fly along path waypoints
      for (let i = ss.dragons.length - 1; i >= 0; i--) {
        const d = ss.dragons[i];
        // Move toward current waypoint
        const wp = pixelWPs[d.wpIdx];
        if (!wp) { ss.dragons.splice(i, 1); continue; }
        const dx = wp.x - d.x, dy = wp.y - d.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 8) {
          d.wpIdx++;
          if (d.wpIdx >= pixelWPs.length) { ss.dragons.splice(i, 1); continue; }
        } else {
          const spd = d.speed * dt;
          d.vx = (dx / dist) * d.speed;
          d.vy = (dy / dist) * d.speed;
          d.x += (dx / dist) * spd;
          d.y += (dy / dist) * spd;
          d.angle = Math.atan2(dy, dx) - Math.PI / 2;
        }

        // Hit enemies within radius along path
        for (const e of enemies) {
          if (!e.dead && !e.reached && !d.hitEnemies.has(e.id)) {
            const ex = e.x - d.x, ey = e.y - d.y;
            if (ex*ex + ey*ey < 55*55) {
              const dmgMult = ss.doubleDmg ? 2 : 1;
              const dmg = e.takeDamage(this.damage * this.ampDmgBonus * dmgMult, this);
              effects.addHitEffect(e.x, e.y, 'fire');
              effects.addFloatText(e.x, e.y, `-${Math.round(dmg)}`, 'float-damage');
              if (ss.burnTrail) e.applyBurn(8, 3);
              d.hitEnemies.add(e.id);
              if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
            }
          }
        }
      }

      if (this.attackTimer >= this.def.attackSpeed) {
        this.attackTimer = 0;
        for (let d = 0; d < ss.dragonCount; d++) {
          const offset = d * 24; // slight Y separation for multi-dragon
          ss.dragons.push({
            x: pixelWPs[0].x, y: pixelWPs[0].y + offset,
            vx: 0, vy: 0,
            speed: 200,
            wpIdx: 1,
            angle: 0,
            hitEnemies: new Set()
          });
        }
        effects.addFloatText(this.x, this.y - 20, '🐉', 'float-crit');
      }
      return;
    }

    // Drone Launcher
    if (k === 'droneLauncher') {
      const ss = this.specialState;
      // Update drones
      for (let i = ss.drones.length - 1; i >= 0; i--) {
        const drone = ss.drones[i];
        drone.timer -= dt;
        drone.attackTimer += dt;
        // Move toward target
        if (!drone.target || drone.target.dead || drone.target.reached) {
          drone.target = findNearestEnemy(drone.x, drone.y, enemies);
        }
        if (drone.target) {
          const dx = drone.target.x - drone.x, dy = drone.target.y - drone.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          const speed = 200 * dt;
          if (dist > 5) {
            drone.x += (dx / dist) * speed;
            drone.y += (dy / dist) * speed;
          }
          // Attack
          if (drone.attackTimer >= 0.5) {
            drone.attackTimer = 0;
            const droneDmg = this.upgradeLevel >= 2 ? 24 : 14;
            const dmg = drone.target.takeDamage(droneDmg, this);
            effects.addHitEffect(drone.target.x, drone.target.y, 'physical');
            effects.addFloatText(drone.target.x, drone.target.y, `-${Math.round(dmg)}`, 'float-damage');
            if (drone.target.dead) {
              this.kills++;
              economy.addGold(drone.target.reward, drone.target.x, drone.target.y);
            }
          }
        }
        if (drone.timer <= 0) {
          if (ss.explodeOnExpiry) {
            for (const e of enemies) {
              if (!e.dead && !e.reached) {
                const dx = e.x - drone.x, dy = e.y - drone.y;
                if (dx*dx + dy*dy <= 40*40) {
                  e.takeDamage(40, this);
                  effects.addHitEffect(e.x, e.y, 'fire');
                }
              }
            }
            effects.addHitEffect(drone.x, drone.y, 'fire');
          }
          ss.drones.splice(i, 1);
        }
      }
      // Deploy new drones
      ss.deployTimer += dt;
      if (ss.deployTimer >= ss.deployInterval && ss.drones.length < ss.maxDrones) {
        ss.deployTimer = 0;
        const target = findNearestEnemy(this.x, this.y, enemies);
        ss.drones.push({
          x: this.x, y: this.y,
          timer: 12,
          attackTimer: 0,
          target
        });
        effects.addFloatText(this.x, this.y - 20, '🤖', 'float-gold');
      }
      return;
    }

    // Frost Mage blizzard
    if (k === 'frostMage' && this.upgradeLevel >= 3) {
      this.specialState.blizzardTimer += dt;
      if (this.specialState.blizzardTimer >= 8) {
        this.specialState.blizzardTimer = 0;
        for (const e of enemies) {
          if (!e.dead && !e.reached) {
            const dx = e.x - this.x, dy = e.y - this.y;
            if (dx*dx + dy*dy <= this.range * this.range) {
              e.applyChill(1);
              e.applySlow(0.75, 2.0);
            }
          }
        }
        effects.addHitEffect(this.x, this.y, 'ice');
      }
    }

    // ---- New tower update logic ────────────────────────────
    if (k === 'thornBush') {
      const ss = this.specialState;
      for (const e of enemies) {
        if (!e.dead && !e.reached && !(e.isInvisible && !e.isRevealed)) {
          const dx = e.x - this.x, dy = e.y - this.y;
          if (dx*dx + dy*dy <= this.range * this.range) {
            e.takeDamage(ss.thornDmg * dt, this);
            if (ss.slowOnHit) e.applySlow(0.85, 0.2);
          }
        }
      }
      return;
    }

    // Trap Master — check traps every frame so enemies can't walk through between ticks
    if (k === 'trapMaster') {
      const ss = this.specialState;
      if (ss.traps && ss.traps.length > 0) {
        for (let i = ss.traps.length - 1; i >= 0; i--) {
          const trap = ss.traps[i];
          let triggered = false;
          for (const e of enemies) {
            if (!e.dead && !e.reached && trap.active && !(e.isInvisible && !e.isRevealed)) {
              const dx = e.x - trap.x, dy = e.y - trap.y;
              if (dx*dx + dy*dy <= trap.r * trap.r) {
                e.takeDamage(this.damage * this.ampDmgBonus, this);
                e.applyStun(1.5);
                if (ss.trapSlow) e.applySlow(0.5, 3);
                effects.addAoEEffect(trap.x, trap.y, trap.r, 'physical');
                effects.addHitEffect(e.x, e.y, 'physical');
                if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
                triggered = true;
                break;
              }
            }
          }
          if (triggered) ss.traps.splice(i, 1);
        }
      }
    }

    if (k === 'flarePost') {
      const ss = this.specialState;
      for (const e of enemies) {
        if (!e.dead && !e.reached && !(e.isInvisible && !e.isRevealed)) {
          const dx = e.x - this.x, dy = e.y - this.y;
          if (dx*dx + dy*dy <= this.range * this.range) {
            e.flareMarked = true; e.flareMarkBonus = ss.markBonus;
            if (ss.markSlow) e.applySlow(0.85, 0.15);
          }
        }
      }
      return;
    }

    if (k === 'militiaPike') {
      const ss = this.specialState;
      for (const e of enemies) {
        if (!e.dead && !e.reached) {
          const dx = e.x - this.x, dy = e.y - this.y;
          if (dx*dx + dy*dy <= this.range * this.range) {
            e.applySlow(ss.slowPct, 0.2);
          }
        }
      }
    }

    if (k === 'stoneGolem') {
      const ss = this.specialState;
      for (const e of enemies) {
        if (!e.dead && !e.reached && !(e.isInvisible && !e.isRevealed)) {
          const dx = e.x - this.x, dy = e.y - this.y;
          if (dx*dx + dy*dy <= this.range * this.range) {
            e.applySlow(ss.slowPct, 0.2);
            if (ss.damageAura > 0) e.takeDamage(ss.damageAura * dt, this);
            if (ss.taunt) e.taunted = true; // -15% armor on taunted enemies
          }
        }
      }
      return;
    }

    if (k === 'runesmith') {
      const ss = this.specialState;
      const count = ss.runeCount || 1;
      // Apply rune buffs directly to ampDmgBonus/ampSpdBonus each frame
      const nearby = towers.filter(t => t !== this).sort((a,b) => {
        const da = (a.x-this.x)**2+(a.y-this.y)**2;
        const db = (b.x-this.x)**2+(b.y-this.y)**2;
        return da - db;
      }).slice(0, count).filter(t => {
        const dx = t.x-this.x, dy = t.y-this.y;
        return dx*dx+dy*dy <= this.range*this.range;
      });
      for (const t of nearby) {
        t.ampDmgBonus *= (1 + ss.runeBonus);
        if (ss.runeSpeedBonus > 0) t.ampSpdBonus *= (1 + ss.runeSpeedBonus);
      }
      return;
    }

    if (k === 'mechanic') {
      const ss = this.specialState;
      ss.repairTimer -= dt;
      // Overclock burst every 15s — nearby towers get +30% atk speed for 4s
      if (ss.repairTimer <= 0) {
        ss.repairTimer = 15;
        for (const t of towers) {
          if (t !== this) {
            const dx = t.x-this.x, dy = t.y-this.y;
            if (dx*dx+dy*dy <= this.range*this.range) {
              t.overclockTimer = ss.overclockDur || 4;
              effects.addHitEffect(t.x, t.y, 'lightning');
            }
          }
        }
        effects.addFloatText(this.x, this.y - 20, '⚡ OVERCLOCK', 'float-crit');
      }
      return;
    }

    if (k === 'manaVortex') {
      const ss = this.specialState;
      for (const e of enemies) {
        if (!e.dead && !e.reached) {
          const dx = e.x-this.x, dy = e.y-this.y;
          if (dx*dx+dy*dy <= this.range*this.range) {
            e.applySlow(ss.enemySlow, 0.2);
            if (ss.drain > 0) e.takeDamage(ss.drain * dt, this);
          }
        }
      }
      // Global haste — apply to all towers (they check this in getEffectiveAttackInterval via bonus)
      for (const t of towers) { if (t !== this) t.manaHaste = ss.towerHaste; }
      return;
    }

    if (k === 'voidRifter') {
      const ss = this.specialState;
      for (const e of enemies) {
        if (!e.dead && !e.reached) {
          const dx = e.x-this.x, dy = e.y-this.y;
          if (dx*dx+dy*dy <= this.range*this.range) {
            e.applySlow(ss.riftSlow, 0.2);
            e.takeDamage(ss.riftDmg * dt, this);
            if (ss.pull) {
              // Extra slow instead of position pull (avoids off-path trapping)
              e.slowFactor = Math.min(e.slowFactor, 0.45);
            }
          }
        }
      }
      return;
    }

    // ── Jester — cycles through 5 attack modes each shot ──
    if (k === 'jester') {
      const ss = this.specialState;

      // Mode switches every 3 seconds independently of attacks
      ss.modeTimer = (ss.modeTimer || 3) - dt;
      if (ss.modeTimer <= 0) {
        ss.modeTimer = 3;
        ss.mode = (ss.mode + 1) % 5;
      }

      // Attack on normal interval in whatever the current mode is
      const interval = this.getEffectiveAttackInterval();
      ss.attackTimer = (ss.attackTimer || 0) + dt;
      if (ss.attackTimer < interval) return;
      ss.attackTimer = 0;

      const dmg = this.damage * this.ampDmgBonus;
      const rng = this.range;
      const mode = ss.mode;
      const liveEnemies = enemies.filter(e => !e.dead && !e.reached && !(e.isInvisible && !e.isRevealed));

      const _hit = (e, mult) => {
        const d = e.takeDamage(dmg * (mult || 1), this);
        if (d > 0) {
          effects.addHitEffect(e.x, e.y, 'shadow');
          effects.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage');
        }
        if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
      };

      if (mode === 0) {
        // Single — highest damage, one target (furthest progressed in range)
        const target = liveEnemies.reduce((best, e) => {
          const dx = e.x-this.x, dy = e.y-this.y;
          if (dx*dx+dy*dy > rng*rng) return best;
          return (!best || e.distanceTraveled > best.distanceTraveled) ? e : best;
        }, null);
        if (target) { _hit(target, 1.5); this.shootFlash = 1.0; }

      } else if (mode === 1) {
        // Circle — a roaming circle that follows the nearest enemy in range, damages all caught in it
        const circleR = rng * 0.38;
        const nearest = liveEnemies.reduce((best, e) => {
          const dx = e.x-this.x, dy = e.y-this.y;
          if (dx*dx+dy*dy > rng*rng) return best;
          const d2 = dx*dx+dy*dy;
          return (!best || d2 < best.d2) ? { e, d2 } : best;
        }, null);
        const cx = nearest ? nearest.e.x : this.x;
        const cy = nearest ? nearest.e.y : this.y;
        ss.circleX = cx; ss.circleY = cy; ss.circleR = circleR;
        for (const e of liveEnemies) {
          const dx = e.x-cx, dy = e.y-cy;
          if (dx*dx+dy*dy <= circleR*circleR) _hit(e, 1.0);
        }
        effects.addAoEEffect(cx, cy, circleR, 'shadow');

      } else if (mode === 2) {
        // Line — all enemies within 28px of the line through facing angle
        const cos = Math.cos(this.facingAngle), sin = Math.sin(this.facingAngle);
        for (const e of liveEnemies) {
          const dx = e.x-this.x, dy = e.y-this.y;
          const distAlongLine = dx*cos + dy*sin;
          if (distAlongLine < 0 || distAlongLine > rng) continue;
          if (Math.abs(-dx*sin + dy*cos) <= 28) _hit(e, 1.2);
        }
        effects.addChainEffect([{x: this.x + cos*rng, y: this.y + sin*rng}], this.x, this.y);

      } else if (mode === 3) {
        // Cone — 70° arc in facing direction
        const halfAngle = 35 * Math.PI / 180;
        for (const e of liveEnemies) {
          const dx = e.x-this.x, dy = e.y-this.y;
          if (dx*dx+dy*dy > rng*rng) continue;
          let diff = Math.atan2(dy, dx) - this.facingAngle;
          while (diff > Math.PI) diff -= Math.PI*2;
          while (diff < -Math.PI) diff += Math.PI*2;
          if (Math.abs(diff) <= halfAngle) _hit(e, 1.0);
        }
        this.coneFlash = { timer: 0.35, angle: this.facingAngle, halfAngle, range: rng, color: 'shadow' };

      } else if (mode === 4) {
        // Full AOE — every enemy within range
        let hit = false;
        for (const e of liveEnemies) {
          const dx = e.x-this.x, dy = e.y-this.y;
          if (dx*dx+dy*dy <= rng*rng) {
            _hit(e, 0.65);
            if (ss.stunOnFull) e.applyStun(2);
            hit = true;
          }
        }
        if (hit) { effects.addAoEEffect(this.x, this.y, rng, 'shadow'); effects.addScreenShake(3); }
      }

      return;
    }

    if (k === 'gravityWell') {
      const ss = this.specialState;
      const pullStr = (ss.pullStrength || 1.0);
      // 3 rings: outer=10% slow, mid=40% slow, inner=70% slow
      const rings = [
        { threshold: 1.00, slow: 0.10 },
        { threshold: 0.60, slow: 0.40 },
        { threshold: 0.30, slow: 0.70 },
      ];
      for (const e of enemies) {
        if (!e.dead && !e.reached && !(e.isInvisible && !e.isRevealed)) {
          const dx = this.x-e.x, dy = this.y-e.y;
          const dist = Math.sqrt(dx*dx+dy*dy) || 1;
          if (dist <= this.range) {
            const proximity = dist / this.range; // 1=edge, 0=center
            // Pick the ring the enemy is in (innermost ring wins)
            let slowAmt = rings[0].slow;
            for (const ring of rings) {
              if (proximity <= ring.threshold) slowAmt = ring.slow;
            }
            slowAmt = Math.min(slowAmt * pullStr, 1.0);
            e.slowFactor = Math.min(e.slowFactor, 1 - slowAmt);
            // Mild cosmetic nudge toward tower
            const nudge = (1 - proximity) * pullStr * 14 * dt;
            e.x += (dx/dist) * nudge;
            e.y += (dy/dist) * nudge;
          }
        }
      }
      if (ss.collapseActive) {
        ss.collapseTimer = (ss.collapseTimer || 20) - dt;
        if (ss.collapseTimer <= 0) {
          ss.collapseTimer = 20;
          // Gravitational collapse: hard stun all enemies in range for 3s
          for (const e of enemies) {
            if (!e.dead && !e.reached && !(e.isInvisible && !e.isRevealed)) {
              const dx = e.x-this.x, dy = e.y-this.y;
              if (dx*dx+dy*dy <= this.range*this.range) {
                e.applyStun(3);
                effects.addHitEffect(e.x, e.y, 'shadow');
              }
            }
          }
          effects.addAoEEffect(this.x, this.y, this.range, 'shadow');
          effects.addScreenShake(5);
        }
      }
      return;
    }

    if (k === 'mirrorMage') {
      const ss = this.specialState;
      // Mark enemies; damage spreading is handled by enemy.takeDamage patch
      for (const e of enemies) {
        if (!e.dead && !e.reached) {
          const dx = e.x-this.x, dy = e.y-this.y;
          if (dx*dx+dy*dy <= this.range*this.range) {
            e.mirrorSpread = ss.spreadPct;
            e.mirrorTargets = 2 + ss.extraTargets;
            e.mirrorEnemies = enemies;
          }
        }
      }
      return;
    }

    if (k === 'shadowPriest') {
      const ss = this.specialState;
      for (const e of enemies) {
        if (!e.dead && !e.reached) {
          const dx = e.x-this.x, dy = e.y-this.y;
          if (dx*dx+dy*dy <= this.range*this.range) {
            e.cursed = true; e.curseSpread = ss.spreadPct;
            if (this.upgradeLevel >= 2) e.applySlow(0.80, 0.2);
          }
        }
      }
    }

    if (k === 'stormCaller') {
      const ss = this.specialState;
      ss.strikeTimer -= dt;
      if (ss.strikeTimer <= 0) {
        ss.strikeTimer = 4;
        const targets = [];
        const shuffled = [...enemies].filter(e => !e.dead && !e.reached).sort(() => Math.random()-0.5);
        for (let i = 0; i < Math.min(ss.strikeCount, shuffled.length); i++) {
          const e = shuffled[i];
          const d = e.takeDamage(ss.strikeDmg, this);
          effects.addHitEffect(e.x, e.y, 'lightning');
          effects.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage');
          if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
          if (ss.chainStrike) {
            const nearby = findNearestEnemyExcluding(e.x, e.y, 100, enemies, [e]);
            if (nearby) {
              nearby.takeDamage(ss.strikeDmg * 0.5, this);
              effects.addHitEffect(nearby.x, nearby.y, 'lightning');
              effects.addChainEffect([{x:nearby.x,y:nearby.y}], e.x, e.y);
              if (nearby.dead) { this.kills++; economy.addGold(nearby.reward, nearby.x, nearby.y); }
            }
          }
          targets.push(e);
        }
        if (targets.length > 0) effects.addAoEEffect(targets[0].x, targets[0].y, 40, 'lightning');
      }
      return;
    }

    if (k === 'banshee') {
      const ss = this.specialState;
      ss.wailTimer -= dt;
      if (ss.wailTimer <= 0) {
        ss.wailTimer = 8;
        effects.addAoEEffect(this.x, this.y, this.range, 'shadow');
        effects.addScreenShake(3);
        for (const e of enemies) {
          if (!e.dead && !e.reached) {
            const dx = e.x-this.x, dy = e.y-this.y;
            if (dx*dx+dy*dy <= this.range*this.range) {
              const hpDmg = e.maxHp * ss.wailPct;
              e.takeDamage(hpDmg, this);
              if (ss.stunOnWail) e.applyStun(2);
              if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
              effects.addHitEffect(e.x, e.y, 'shadow');
            }
          }
        }
        effects.addFloatText(this.x, this.y-20, 'WAIL!', 'float-crit');
      }
      return;
    }

    if (k === 'thunderstrike') {
      const ss = this.specialState;
      ss.strikeTimer -= dt;
      if (ss.strikeTimer <= 0) {
        ss.strikeTimer = 10;
        // Find densest cluster
        let bestX = this.x, bestY = this.y;
        let bestCount = 0;
        for (const e of enemies) {
          if (e.dead || e.reached) continue;
          let count = 0;
          for (const e2 of enemies) {
            if (!e2.dead && !e2.reached) {
              const dx = e2.x-e.x, dy = e2.y-e.y;
              if (dx*dx+dy*dy <= 60*60) count++;
            }
          }
          if (count > bestCount) { bestCount = count; bestX = e.x; bestY = e.y; }
        }
        for (let s = 0; s < ss.strikeCount; s++) {
          const sx = bestX + (Math.random()-0.5)*40;
          const sy = bestY + (Math.random()-0.5)*40;
          for (const e of enemies) {
            if (!e.dead && !e.reached) {
              const dx = e.x-sx, dy = e.y-sy;
              if (dx*dx+dy*dy <= ss.strikeRadius*ss.strikeRadius) {
                e.takeDamage(ss.strikeDmg, this);
                effects.addHitEffect(e.x, e.y, 'lightning');
                if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
              }
            }
          }
          effects.addAoEEffect(sx, sy, ss.strikeRadius, 'lightning');
          effects.addScreenShake(4);
        }
        effects.addFloatText(this.x, this.y-20, '⚡STRIKE!', 'float-crit');
      }
      return;
    }

    if (k === 'spiritGuide') {
      const ss = this.specialState;
      // Update spirits
      for (let i = ss.spirits.length-1; i >= 0; i--) {
        const sp = ss.spirits[i];
        sp.timer -= dt;
        if (!sp.target || sp.target.dead || sp.target.reached) {
          sp.target = findNearestEnemy(sp.x, sp.y, enemies);
        }
        if (sp.target) {
          const dx = sp.target.x-sp.x, dy = sp.target.y-sp.y;
          const dist = Math.sqrt(dx*dx+dy*dy) || 1;
          sp.x += (dx/dist)*180*dt;
          sp.y += (dy/dist)*180*dt;
          if (dist < 10) {
            sp.target.takeDamage(ss.spiritDmg, this);
            effects.addHitEffect(sp.target.x, sp.target.y, 'holy');
            if (ss.spiritChain) {
              const chain = findNearestEnemyExcluding(sp.target.x, sp.target.y, 80, enemies, [sp.target]);
              if (chain) { chain.takeDamage(ss.spiritDmg*0.5, this); effects.addHitEffect(chain.x, chain.y, 'holy'); }
            }
            if (sp.target.dead) { this.kills++; economy.addGold(sp.target.reward, sp.target.x, sp.target.y); }
            ss.spirits.splice(i, 1);
            continue;
          }
        }
        if (sp.timer <= 0) ss.spirits.splice(i, 1);
      }
      // Check for nearby deaths — done via kill tracking in _fireAt of OTHER towers
      // Instead: scan enemies that just died (hp <= 0) near us this frame
      for (const e of enemies) {
        if (e.dead && !e.spiritSpawned) {
          const dx = e.x-this.x, dy = e.y-this.y;
          if (dx*dx+dy*dy <= this.range*this.range) {
            e.spiritSpawned = true;
            for (let s = 0; s < ss.spiritsPerKill; s++) {
              ss.spirits.push({ x:e.x, y:e.y, target:null, timer:4 });
              effects.addHitEffect(e.x, e.y, 'holy');
            }
          }
        }
      }
      return;
    }

    if (k === 'soulHarvester') {
      const ss = this.specialState;
      ss.releaseTimer -= dt;
      // Collect souls from nearby deaths
      for (const e of enemies) {
        if (e.dead && !e.soulCollected) {
          const dx = e.x-this.x, dy = e.y-this.y;
          if (dx*dx+dy*dy <= this.range*this.range) {
            e.soulCollected = true;
            ss.souls++;
          }
        }
      }
      if (ss.releaseTimer <= 0 && ss.souls > 0) {
        ss.releaseTimer = 8 + (12 - 8) * (this.upgradeLevel < 2 ? 1 : 0);
        const burst = ss.souls * ss.burstDmg;
        ss.releaseTimer = this.upgradeLevel >= 2 ? 8 : 12;
        effects.addAoEEffect(this.x, this.y, this.range, 'shadow');
        effects.addFloatText(this.x, this.y-20, `💀×${ss.souls}`, 'float-crit');
        effects.addScreenShake(3);
        for (const e of enemies) {
          if (!e.dead && !e.reached) {
            const dx = e.x-this.x, dy = e.y-this.y;
            if (dx*dx+dy*dy <= this.range*this.range) {
              e.takeDamage(burst, this);
              if (ss.slowOnRelease) e.applySlow(0.6, 2);
              if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
            }
          }
        }
        ss.souls = 0;
      }
      return;
    }

    if (k === 'iceGolem') {
      const ss = this.specialState;
      ss.novaTimer -= dt;
      if (ss.novaTimer <= 0) {
        ss.novaTimer = 12;
        effects.addAoEEffect(this.x, this.y, this.aoeRadius || 80, 'ice');
        effects.addScreenShake(3);
        for (const e of enemies) {
          if (!e.dead && !e.reached) {
            const r = this.aoeRadius || 80;
            const dx = e.x-this.x, dy = e.y-this.y;
            if (dx*dx+dy*dy <= r*r) {
              e.applyFreeze(ss.novaFreeze);
              e.takeDamage(30, this);
              effects.addHitEffect(e.x, e.y, 'ice');
              if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
            }
          }
        }
        effects.addFloatText(this.x, this.y-20, 'FROST NOVA!', 'float-crit');
      }
    }

    if (k === 'celestialBeacon') {
      const ss = this.specialState;
      if (!ss.surgeActive) {
        ss.surgeTimer -= dt;
        if (ss.surgeTimer <= 0) {
          ss.surgeActive = true;
          ss.surgeDur = this.upgradeLevel >= 2 ? 12 : 8;
          effects.addAoEEffect(this.x, this.y, 300, 'holy');
          effects.addScreenShake(5);
          effects.addFloatText(this.x, this.y-20, '✦CELESTIAL SURGE!', 'float-crit');
        }
      } else {
        ss.surgeDur -= dt;
        // Apply surge to all towers
        for (const t of towers) {
          t.celestialBonus = ss.surgeDmgBonus;
          if (ss.surgeSpd) t.celestialSpdBonus = 0.30;
        }
        if (ss.surgeDur <= 0) {
          ss.surgeActive = false;
          ss.surgeTimer = this.upgradeLevel >= 1 ? 30 : 40;
          for (const t of towers) { t.celestialBonus = 0; t.celestialSpdBonus = 0; }
        }
      }
      return;
    }

    if (k === 'abyssalShrine') {
      const ss = this.specialState;
      // Update demons
      for (let i = ss.demons.length-1; i >= 0; i--) {
        const d = ss.demons[i];
        d.timer -= dt; d.attackTimer += dt;
        if (!d.target || d.target.dead || d.target.reached) d.target = findNearestEnemy(d.x, d.y, enemies);
        if (d.target) {
          const dx = d.target.x-d.x, dy = d.target.y-d.y;
          const dist = Math.sqrt(dx*dx+dy*dy) || 1;
          if (dist > 5) { d.x += (dx/dist)*160*dt; d.y += (dy/dist)*160*dt; }
          if (d.attackTimer >= 0.6) {
            d.attackTimer = 0;
            d.target.takeDamage(ss.demonDmg, this);
            effects.addHitEffect(d.target.x, d.target.y, 'shadow');
            effects.addFloatText(d.target.x, d.target.y, `-${ss.demonDmg}`, 'float-damage');
            if (d.target.dead) { this.kills++; economy.addGold(d.target.reward, d.target.x, d.target.y); }
          }
        }
        if (d.timer <= 0) {
          if (ss.explodeOnExpiry) {
            for (const e of enemies) {
              if (!e.dead && !e.reached) {
                const dx = e.x-d.x, dy = e.y-d.y;
                if (dx*dx+dy*dy <= 80*80) { e.takeDamage(80, this); effects.addHitEffect(e.x, e.y, 'shadow'); }
              }
            }
            effects.addAoEEffect(d.x, d.y, 80, 'shadow');
          }
          ss.demons.splice(i, 1);
        }
      }
      ss.summonTimer -= dt;
      if (ss.summonTimer <= 0 && ss.demons.length < ss.maxDemons) {
        if (economy.spendGold(50)) {
          ss.summonTimer = 25;
          ss.demons.push({ x:this.x, y:this.y, timer:ss.demonDur, attackTimer:0, target:null });
          effects.addHitEffect(this.x, this.y, 'shadow');
          effects.addFloatText(this.x, this.y-20, '👿SUMMONED', 'float-crit');
        } else { ss.summonTimer = 5; }
      }
      return;
    }

    if (k === 'chronoFortress') {
      const ss = this.specialState;
      for (const e of enemies) {
        if (!e.dead && !e.reached) {
          const dx = e.x-this.x, dy = e.y-this.y;
          if (dx*dx+dy*dy <= this.range*this.range) e.applySlow(ss.fieldSlow, 0.3);
        }
      }
      ss.freezeTimer -= dt;
      if (ss.freezeTimer <= 0) {
        ss.freezeTimer = 60;
        effects.addAoEEffect(this.x, this.y, 400, 'ice');
        effects.addFloatText(this.x, this.y-20, '❄ TIME FREEZE!', 'float-crit');
        effects.addScreenShake(6);
        for (const e of enemies) { if (!e.dead && !e.reached) e.applyFreeze(ss.freezeDur); }
      }
      if (ss.rewindTimer < 999) {
        ss.rewindTimer -= dt;
        if (ss.rewindTimer <= 0) {
          ss.rewindTimer = 45;
          const strongest = findStrongestEnemy(0, 0, 9999, enemies);
          if (strongest) {
            strongest.waypointIndex = 1;
            strongest.distanceTraveled = 0;
            strongest.x = strongest.waypoints[0].x;
            strongest.y = strongest.waypoints[0].y;
            effects.addFloatText(strongest.x, strongest.y, 'REWIND!', 'float-crit');
          }
        }
      }
      return;
    }

    if (k === 'thunderGod') {
      const ss = this.specialState;
      ss.strikeTimer -= dt;
      if (ss.strikeTimer <= 0) {
        ss.strikeTimer = 8;
        ss.strikeCount++;
        const tripleCharge = (this.upgradeLevel >= 3 && ss.strikeCount % 3 === 0);
        const finalDmg = tripleCharge ? ss.strikeDmg * 3 : ss.strikeDmg;
        const inRange = enemies.filter(e => !e.dead && !e.reached && ((e.x-this.x)**2+(e.y-this.y)**2) <= this.range*this.range);
        for (const e of inRange) {
          e.takeDamage(finalDmg, this);
          effects.addHitEffect(e.x, e.y, 'lightning');
          if (ss.stunOnStrike) e.applyStun(0.5);
          if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
        }
        if (inRange.length > 0) {
          effects.addChainEffect(inRange.map(e => ({x:e.x,y:e.y})), this.x, this.y);
          effects.addScreenShake(tripleCharge ? 10 : 5);
          effects.addFloatText(this.x, this.y-20, tripleCharge ? '⚡⚡⚡OVERCHARGE!' : '⚡DIVINE THUNDER!', 'float-crit');
        }
      }
      // falls through to standard single-target attack loop
    }

    if (k === 'naturesWrath') {
      const ss = this.specialState;
      ss.thrashTimer -= dt;
      if (ss.thrashTimer <= 0) {
        ss.thrashTimer = 15;
        for (let wave = 0; wave < ss.thrashCount; wave++) {
          const offsetY = wave * 30;
          for (const e of enemies) {
            if (!e.dead && !e.reached) {
              const dx = e.x-this.x, dy = (e.y+offsetY)-this.y;
              if (dx*dx + dy*dy <= this.range * this.range) { // hits enemies within range
                e.takeDamage(ss.thrashDmg, this);
                effects.addHitEffect(e.x, e.y, 'poison');
                if (ss.thrashPoison) e.applyPoison(20, 5);
                if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
              }
            }
          }
        }
        effects.addAoEEffect(COLS*CELL/2, ROWS*CELL/2, 400, 'poison');
        effects.addScreenShake(6);
        effects.addFloatText(this.x, this.y-20, '🌿NATURE\'S WRATH!', 'float-crit');
      }
      return;
    }

    if (k === 'voidGolem') {
      const ss = this.specialState;
      ss.banishTimer -= dt;
      if (ss.banishTimer <= 0) {
        ss.banishTimer = this.upgradeLevel >= 1 ? 20 : 30;
        const sorted = [...enemies].filter(e => !e.dead && !e.reached).sort((a,b) => b.hp - a.hp);
        const targets = sorted.slice(0, ss.banishCount);
        for (const e of targets) {
          if (ss.banishDmg > 0) e.takeDamage(ss.banishDmg, this);
          // Teleport to path start
          e.waypointIndex = 1;
          e.distanceTraveled = 0;
          e.x = e.waypoints[0].x;
          e.y = e.waypoints[0].y;
          effects.addHitEffect(e.x, e.y, 'shadow');
          effects.addFloatText(e.x, e.y, 'BANISHED!', 'float-crit');
        }
        if (targets.length) { effects.addAoEEffect(this.x, this.y, 80, 'shadow'); effects.addScreenShake(4); }
      }
    }

    if (k === 'starfallTower') {
      const ss = this.specialState;
      ss.strikeTimer -= dt;
      if (ss.strikeTimer <= 0) {
        ss.strikeTimer = 20;
        const pathEnemies = enemies.filter(e => !e.dead && !e.reached);
        effects.addFloatText(this.x, this.y-20, '☄ STARFALL!', 'float-crit');
        effects.addScreenShake(7);
        for (let m = 0; m < ss.meteorCount; m++) {
          const target = pathEnemies[Math.floor(Math.random()*pathEnemies.length)];
          if (!target) continue;
          const mx = target.x + (Math.random()-0.5)*60;
          const my = target.y + (Math.random()-0.5)*60;
          for (const e of enemies) {
            if (!e.dead && !e.reached) {
              const dx = e.x-mx, dy = e.y-my;
              if (dx*dx+dy*dy <= ss.meteorRadius*ss.meteorRadius) {
                e.takeDamage(ss.meteorDmg, this);
                effects.addHitEffect(e.x, e.y, 'fire');
                if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
              }
            }
          }
          effects.addAoEEffect(mx, my, ss.meteorRadius, 'fire');
          if (ss.fireZone) {
            // Add a temporary fire zone (simulate with a short-duration puddle-like effect)
            this.specialState._fireZones = this.specialState._fireZones || [];
            this.specialState._fireZones.push({ x:mx, y:my, r:ss.meteorRadius, timer:3 });
          }
        }
      }
      // Fire zones
      const fz = this.specialState._fireZones;
      if (fz && fz.length) {
        for (let i = fz.length-1; i >= 0; i--) {
          fz[i].timer -= dt;
          for (const e of enemies) {
            if (!e.dead && !e.reached) {
              const dx = e.x-fz[i].x, dy = e.y-fz[i].y;
              if (dx*dx+dy*dy <= fz[i].r*fz[i].r) e.applyBurn(15, 0.3);
            }
          }
          if (fz[i].timer <= 0) fz.splice(i,1);
        }
      }
      return;
    }

    // ---- Watch Post ----
    if (k === 'watchtowerPost') {
      for (const e of enemies) {
        if (e.isInvisible) {
          const dx = e.x - this.x, dy = e.y - this.y;
          if (dx*dx + dy*dy <= this.range * this.range) e.isRevealed = true;
        }
        if (this.specialState.markBonus > 0) {
          const dx = e.x - this.x, dy = e.y - this.y;
          if (dx*dx + dy*dy <= this.range * this.range) {
            e.marked = true; e.markBonus = this.specialState.markBonus;
          }
        }
      }
      return;
    }

    // ---- Tide Caller (wave timer) ----
    if (k === 'tideCaller') {
      const ss = this.specialState;
      ss.waveTimer -= dt;
      if (ss.waveTimer <= 0) {
        ss.waveTimer = ss.waveInterval;
        const alive = enemies.filter(e => !e.dead && !e.reached);
        for (const e of alive) {
          const dx = e.x - this.x, dy = e.y - this.y;
          if (dx*dx + dy*dy <= this.range * this.range) {
            const d = e.takeDamage(this.damage * this.ampDmgBonus, this);
            if (d > 0) effects.addHitEffect(e.x, e.y, 'ice');
            // Push back along path
            e.waypointIndex = Math.max(1, e.waypointIndex - 1);
            e.x = e.waypoints[e.waypointIndex - 1].x;
            e.y = e.waypoints[e.waypointIndex - 1].y;
            e.distanceTraveled = Math.max(0, e.distanceTraveled - 96);
            if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
          }
        }
        effects.addAoEEffect(this.x, this.y, this.range, 'ice');
        return;
      }
    }

    // ---- Thunder Drum ----
    if (k === 'thunderDrum') {
      // handled in standard attack loop via aoe
    }

    // ---- Phoenix Tower burst ----
    if (k === 'phoenixTower') {
      const ss = this.specialState;
      ss.burstTimer -= dt;
      if (ss.burstTimer <= 0) {
        ss.burstTimer = 20;
        effects.addAoEEffect(this.x, this.y, this.range, 'fire');
        effects.addScreenShake(4);
        effects.addFloatText(this.x, this.y - 20, 'INFERNO!', 'float-crit');
        for (const e of enemies) {
          if (!e.dead && !e.reached) {
            const dx = e.x - this.x, dy = e.y - this.y;
            if (dx*dx + dy*dy <= this.range * this.range) {
              e.takeDamage(ss.burstDmg, this);
              e.applyBurn(15, 2);
              if (ss.fireZone) ss._fireZones.push({ x: e.x, y: e.y, r: 40, timer: 3 });
              if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
            }
          }
        }
      }
      // Fire zones
      for (let i = ss._fireZones.length - 1; i >= 0; i--) {
        ss._fireZones[i].timer -= dt;
        for (const e of enemies) {
          if (!e.dead && !e.reached) {
            const dx = e.x - ss._fireZones[i].x, dy = e.y - ss._fireZones[i].y;
            if (dx*dx + dy*dy <= ss._fireZones[i].r * ss._fireZones[i].r) e.applyBurn(12, 0.3);
          }
        }
        if (ss._fireZones[i].timer <= 0) ss._fireZones.splice(i, 1);
      }
    }

    // ---- Void Stalker — override targeting to highest HP ----
    if (k === 'voidStalkerTower') {
      // targeting override: handled in standard attack loop via findFurthestEnemy, but we override below
      this.attackTimer += dt;
      const interval = this.getEffectiveAttackInterval();
      if (this.attackTimer >= interval) {
        const alive = enemies.filter(e => !e.dead && !e.reached);
        let bestTarget = null, bestHp = -1;
        for (const e of alive) {
          const dx = e.x - this.x, dy = e.y - this.y;
          if (dx*dx + dy*dy <= this.range * this.range && e.hp > bestHp) { bestHp = e.hp; bestTarget = e; }
        }
        if (bestTarget) {
          this.attackTimer = 0; this.shootFlash = 1.0;
          const dmg = this.damage * this.ampDmgBonus;
          const d = bestTarget.takeDamage(dmg, this, true);
          effects.addHitEffect(bestTarget.x, bestTarget.y, 'shadow');
          effects.addFloatText(bestTarget.x, bestTarget.y, `-${Math.round(d)}`, 'float-damage');
          if (this.specialState.slowOnHit) bestTarget.applySlow(0.80, 2);
          if (bestTarget.dead) {
            this.kills++; economy.addGold(bestTarget.reward, bestTarget.x, bestTarget.y);
            if (this.specialState.instantNextTarget) this.attackTimer = interval; // attack again immediately
          }
        }
      }
      return;
    }

    // ---- Astral Cannon ----
    if (k === 'astralCannon') {
      const ss = this.specialState;
      ss.chargeTimer -= dt;
      const pct = 1 - ss.chargeTimer / ss.chargeDur;
      if (ss.chargeTimer <= 0) {
        ss.chargeTimer = ss.chargeDur;
        // Fire beam(s) along random angle toward densest enemies
        const alive = enemies.filter(e => !e.dead && !e.reached);
        if (alive.length > 0) {
          for (let b = 0; b < ss.beamCount; b++) {
            const target = alive[Math.floor(Math.random() * alive.length)];
            const ang = Math.atan2(target.y - this.y, target.x - this.x);
            for (const e of alive) {
              const ex = e.x - this.x, ey = e.y - this.y;
              const proj = ex * Math.cos(ang) + ey * Math.sin(ang);
              const perp = Math.abs(-ex * Math.sin(ang) + ey * Math.cos(ang));
              if (proj > 0 && perp < 30) {
                e.takeDamage(ss.beamDmg, this);
                effects.addHitEffect(e.x, e.y, 'lightning');
                if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
              }
            }
            effects.addFloatText(this.x, this.y - 20, 'STELLAR BEAM!', 'float-crit');
            effects.addScreenShake(6);
          }
        }
      }
      // Show charge progress as float
      if (Math.floor(ss.chargeTimer) !== Math.floor(ss.chargeTimer + dt) && ss.chargeTimer > 0) {
        // Just a visual charging indicator every second would be nice but skip for now
      }
      return;
    }

    // ---- Rune Forger — buff nearby towers ----
    if (k === 'runeForger') {
      const ss = this.specialState;
      for (const t of towers) {
        if (t === this) continue;
        const dx = t.x - this.x, dy = t.y - this.y;
        if (dx*dx + dy*dy <= ss.runeRange * ss.runeRange) {
          t.ampDmgBonus *= (1 + ss.runeBonus);
          if (ss.runeRangeBonus) t.range = Math.round(t.range * 1.0); // range boost applied on upgrade
        }
      }
    }

    // ---- Inferno Drake fire zones ----
    if (k === 'infernoDrake') {
      const ss = this.specialState;
      for (let i = ss._fireZones.length - 1; i >= 0; i--) {
        ss._fireZones[i].timer -= dt;
        for (const e of enemies) {
          if (!e.dead && !e.reached) {
            const dx = e.x - ss._fireZones[i].x, dy = e.y - ss._fireZones[i].y;
            if (dx*dx + dy*dy <= 35 * 35) e.applyBurn(5, 0.3);
          }
        }
        if (ss._fireZones[i].timer <= 0) ss._fireZones.splice(i, 1);
      }
    }

    // ---- Death Knight summon + aura ----
    if (k === 'deathKnight') {
      const ss = this.specialState;
      ss.summonTimer -= dt;
      if (ss.summonTimer <= 0) {
        ss.summonTimer = ss.summonInterval;
        const skel = createSkeleton(this.x + (Math.random()-0.5)*20, this.y + (Math.random()-0.5)*20, 5);
        enemies.push(skel);
        effects.addHitEffect(this.x, this.y, 'shadow');
        effects.addFloatText(this.x, this.y - 20, 'RAISE DEAD!', 'float-crit');
      }
      if (ss.deathAura) {
        for (const e of enemies) {
          if (!e.dead && !e.reached && !e.isSkeleton) {
            const dx = e.x - this.x, dy = e.y - this.y;
            if (dx*dx + dy*dy <= this.range * this.range) e.takeDamage(8 * dt, this);
          }
        }
      }
    }

    // ---- Warp Gate ----
    if (k === 'warpGate') {
      const ss = this.specialState;
      ss.warpTimer -= dt;
      if (ss.warpTimer <= 0) {
        ss.warpTimer = ss.warpInterval;
        const alive = enemies.filter(e => !e.dead && !e.reached && !e.isFlyer).sort((a, b) => b.distanceTraveled - a.distanceTraveled);
        const toWarp = alive.slice(0, ss.warpCount);
        for (const e of toWarp) {
          e.waypointIndex = 1;
          e.distanceTraveled = 0;
          e.x = e.waypoints[0].x;
          e.y = e.waypoints[0].y;
          effects.addHitEffect(e.x, e.y, 'shadow');
          effects.addFloatText(e.x, e.y, 'WARPED!', 'float-crit');
          if (ss.warpDmg > 0) e.takeDamage(ss.warpDmg, this);
          if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
        }
        if (toWarp.length > 0) effects.addAoEEffect(this.x, this.y, this.range, 'shadow');
      }
      return;
    }

    // ---- Crystal Golem nova ----
    if (k === 'crystalGolem') {
      const ss = this.specialState;
      if (ss.novaPrimed) {
        ss.novaTimer -= dt;
        if (ss.novaTimer <= 0) {
          ss.novaTimer = 20;
          for (const e of enemies) {
            if (!e.dead && !e.reached) {
              const dx = e.x - this.x, dy = e.y - this.y;
              if (dx*dx + dy*dy <= this.range * this.range) {
                e.takeDamage(ss.novaDmg, this);
                effects.addHitEffect(e.x, e.y, 'ice');
                if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
              }
            }
          }
          effects.addAoEEffect(this.x, this.y, this.range, 'ice');
          effects.addFloatText(this.x, this.y - 20, 'CRYSTAL NOVA!', 'float-crit');
          effects.addScreenShake(4);
        }
      }
    }

    // ---- Storm Wyvern ----
    if (k === 'stormWyvern') {
      const ss = this.specialState;
      ss.flyTimer -= dt;
      if (ss.flyTimer <= 0) {
        ss.flyTimer = 10;
        for (let p = 0; p < ss.passes; p++) {
          for (const e of enemies) {
            if (!e.dead && !e.reached) {
              e.takeDamage(ss.wyvernDmg, this);
              effects.addHitEffect(e.x, e.y, 'lightning');
              if (ss.stunOnPass) e.applyStun(0.5);
              if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
            }
          }
        }
        effects.addFloatText(this.x, this.y - 20, '⚡ STRAFE!', 'float-crit');
        effects.addScreenShake(3);
      }
      return;
    }

    // ---- Mystic Well ----
    if (k === 'mysticWell') {
      const ss = this.specialState;
      for (const e of enemies) {
        if (!e.dead && !e.reached) {
          const dx = e.x - this.x, dy = e.y - this.y;
          if (dx*dx + dy*dy <= this.range * this.range) e.applySlow(ss.slowPct, 0.3);
        }
      }
      ss.goldTimer -= dt;
      if (ss.goldTimer <= 0) {
        ss.goldTimer = ss.goldInterval;
        economy.addGold(ss.goldAmount, this.x, this.y);
      }
      return;
    }

    // ---- Omega Cannon ----
    if (k === 'omegaCannon') {
      const ss = this.specialState;
      ss.chargeTimer -= dt;
      if (ss.chargeTimer <= 0) {
        ss.chargeTimer = ss.chargeDur;
        const alive = enemies.filter(e => !e.dead && !e.reached);
        if (alive.length > 0) {
          let best = alive[0]; let bestCount = 0;
          for (const e of alive) {
            let cnt = 0;
            for (const e2 of alive) { const dx = e2.x-e.x, dy = e2.y-e.y; if (dx*dx+dy*dy <= ss.blastRadius*ss.blastRadius) cnt++; }
            if (cnt > bestCount) { bestCount = cnt; best = e; }
          }
          const blasts = ss.blastCount;
          for (let b = 0; b < blasts; b++) {
            const bx = best.x + (Math.random()-0.5)*30*b;
            const by = best.y + (Math.random()-0.5)*30*b;
            for (const e of alive) {
              const dx = e.x-bx, dy = e.y-by;
              if (dx*dx + dy*dy <= ss.blastRadius * ss.blastRadius) {
                e.takeDamage(ss.blastDmg, this);
                effects.addHitEffect(e.x, e.y, 'fire');
                if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
              }
            }
            effects.addAoEEffect(bx, by, ss.blastRadius, 'fire');
            effects.addScreenShake(10);
          }
          effects.addFloatText(best.x, best.y - 20, 'OMEGA BLAST!', 'float-crit');
        }
      }
      return;
    }

    // ---- Lich Lord ----
    if (k === 'lichLord') {
      // Death curse: only affects enemies within range
      for (const e of enemies) {
        if (!e.dead && !e.reached) {
          const dx = e.x - this.x, dy = e.y - this.y;
          if (dx*dx + dy*dy <= this.range * this.range) {
            e.lichCursed = true;
            if (this.upgradeLevel >= 2) e.applySlow(0.85, 0.3);
          }
        }
      }
    }

    // ---- Celestial Dragon ----
    if (k === 'celestialDragon') {
      const ss = this.specialState;
      this.attackTimer += dt;
      const pixelWPs = buildPixelWaypoints();

      // Update in-flight dragons
      for (let i = ss.dragons.length - 1; i >= 0; i--) {
        const d = ss.dragons[i];
        const wp = pixelWPs[d.wpIdx];
        if (!wp) { ss.dragons.splice(i, 1); continue; }
        const dx = wp.x - d.x, dy = wp.y - d.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 8) {
          d.wpIdx++;
          if (d.wpIdx >= pixelWPs.length) {
            // Bless towers when dragon completes path
            for (const t of towers) {
              if (t !== this) t.ampDmgBonus *= (1 + ss.blessingBuff);
            }
            if (ss.healOnPass && economy.lives < economy.maxLives) {
              economy.healLife(1);
              effects.addFloatText(this.x, this.y - 20, '+1 ❤️', 'float-gold');
            }
            ss.dragons.splice(i, 1);
            continue;
          }
        } else {
          const spd = d.speed * dt;
          d.x += (dx / dist) * spd;
          d.y += (dy / dist) * spd;
          d.angle = Math.atan2(dy, dx) - Math.PI / 2;
        }
        // Holy damage to nearby enemies
        for (const e of enemies) {
          if (!e.dead && !e.reached && !d.hitEnemies.has(e.id)) {
            const ex = e.x - d.x, ey = e.y - d.y;
            if (ex*ex + ey*ey < 60*60) {
              const dmg = e.takeDamage(this.damage * this.ampDmgBonus, this);
              effects.addHitEffect(e.x, e.y, 'holy');
              effects.addFloatText(e.x, e.y, `-${Math.round(dmg)}`, 'float-damage');
              e.applyBurn(12, 2);
              d.hitEnemies.add(e.id);
              if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
            }
          }
        }
      }

      if (this.attackTimer >= this.attackSpeed) {
        this.attackTimer = 0;
        for (let d = 0; d < ss.dragonCount; d++) {
          ss.dragons.push({
            x: pixelWPs[0].x, y: pixelWPs[0].y + d * 28,
            speed: 220,
            wpIdx: 1,
            angle: 0,
            hitEnemies: new Set()
          });
        }
        effects.addFloatText(this.x, this.y - 20, '✨ DIVINE FLIGHT', 'float-crit');
      }
      return;
    }

    // ---- Eternal Flame ----
    if (k === 'eternalFlame') {
      const ss = this.specialState;
      for (const e of enemies) {
        if (!e.dead && !e.reached) {
          const dmg = (e.isBoss && ss.doubleBoss) ? ss.burnDmg * 2 : ss.burnDmg;
          e.applyBurn(dmg, 0.3);
          if (ss.burnSlow) e.applySlow(0.85, 0.3);
        }
      }
      return;
    }

    // ---- World Tree ----
    if (k === 'worldTree') {
      const ss = this.specialState;
      // Nature pulse dmg — range limited
      for (const e of enemies) {
        if (!e.dead && !e.reached) {
          const dx = e.x - this.x, dy = e.y - this.y;
          if (dx*dx + dy*dy <= this.range * this.range) {
            e.takeDamage(ss.pulseDmg * dt, this);
            if (ss.pulseSlow) e.applySlow(0.80, 0.3);
          }
        }
      }
      // Root timer — range limited
      ss.rootTimer -= dt;
      if (ss.rootTimer <= 0) {
        ss.rootTimer = 15;
        effects.addScreenShake(5);
        effects.addFloatText(this.x, this.y - 20, 'ANCIENT ROOT!', 'float-crit');
        for (const e of enemies) {
          if (!e.dead && !e.reached) {
            const dx = e.x - this.x, dy = e.y - this.y;
            if (dx*dx + dy*dy <= this.range * this.range) {
              e.applyStun(ss.rootDur);
              e.takeDamage(ss.rootDmg, this);
              effects.addHitEffect(e.x, e.y, 'poison');
              if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
            }
          }
        }
      }
      return;
    }

    // ---- Storm God Tower ----
    if (k === 'stormGodTower') {
      const ss = this.specialState;
      // Permanent slow aura
      for (const e of enemies) {
        if (!e.dead && !e.reached) e.applySlow(ss.globalSlow, 0.3);
      }
      // Storm timer
      ss.stormTimer -= dt;
      if (ss.stormTimer <= 0) {
        ss.stormTimer = ss.stormInterval;
        effects.addScreenShake(6);
        effects.addFloatText(this.x, this.y - 20, '⚡ DIVINE STORM!', 'float-crit');
        for (const e of enemies) {
          if (!e.dead && !e.reached) {
            e.takeDamage(ss.stormDmg, this);
            effects.addHitEffect(e.x, e.y, 'lightning');
            if (ss.stormStun) e.applyStun(1);
            if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
          }
        }
      }
    }

    // ---- Seraph Guardian ----
    if (k === 'seraphGuardian') {
      const ss = this.specialState;
      // Slow aura
      for (const e of enemies) {
        if (!e.dead && !e.reached) {
          const dx = e.x - this.x, dy = e.y - this.y;
          if (dx*dx + dy*dy <= this.range * this.range) {
            e.applySlow(ss.slowPct, 0.3);
          }
        }
      }
      // Heal lives
      ss.healTimer -= dt;
      if (ss.healTimer <= 0) {
        ss.healTimer = ss.healInterval;
        if (economy.lives < economy.maxLives) {
          economy.healLife(1);
          effects.addFloatText(this.x, this.y - 20, '+1 ❤️', 'float-gold');
          effects.addHitEffect(this.x, this.y, 'holy');
        }
      }
      return;
    }

    // ---- Divine Oracle ----
    if (k === 'divineOracle') {
      // Reveal all invisible globally
      for (const e of enemies) {
        if (e.isInvisible) e.isRevealed = true;
      }
      return;
    }

    // ---- Dawn Arbiter ----
    if (k === 'dawnArbiter') {
      const ss = this.specialState;
      // Global slow
      for (const e of enemies) {
        if (!e.dead && !e.reached) {
          e.applySlow(ss.globalSlow, 0.3);
        }
      }
      // Column of light
      ss.columnTimer -= dt;
      if (ss.columnTimer <= 0) {
        ss.columnTimer = 10;
        // Find densest cluster
        const alive = enemies.filter(e => !e.dead && !e.reached);
        if (alive.length > 0) {
          for (let col = 0; col < ss.columnCount; col++) {
            let best = alive[0];
            let bestCount = 0;
            for (const e of alive) {
              let count = 0;
              for (const e2 of alive) {
                const dx = e2.x-e.x, dy = e2.y-e.y;
                if (dx*dx+dy*dy <= 70*70) count++;
              }
              if (count > bestCount) { bestCount = count; best = e; }
            }
            const cx = best.x + (Math.random()-0.5)*20;
            const cy = best.y + (Math.random()-0.5)*20;
            effects.addAoEEffect(cx, cy, 80, 'holy');
            effects.addScreenShake(5);
            for (const e of alive) {
              const dx = e.x-cx, dy = e.y-cy;
              if (dx*dx+dy*dy <= 80*80) {
                e.takeDamage(ss.columnDmg, this);
                effects.addHitEffect(e.x, e.y, 'holy');
                if (ss.stunOnColumn) e.applyStun(2);
                if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
              }
            }
            effects.addFloatText(cx, cy - 20, 'JUDGMENT!', 'float-crit');
            // Remove best from consideration for next column
            alive.splice(alive.indexOf(best), 1);
            if (alive.length === 0) break;
          }
        }
      }
      return;
    }

    // ---- Standard attack loop ----
    if (this.def.damage <= 0 || this.def.targetType === 'passive' ||
        this.def.targetType === 'aura' || this.def.targetType === 'support' ||
        this.def.targetType === 'divine_aura' ||
        this.def.targetType === 'singularity' || this.def.targetType === 'time' ||
        this.def.targetType === 'dragon' || this.def.targetType === 'drone') return;

    this.attackTimer += dt;
    const interval = this.getEffectiveAttackInterval();
    if (this.attackTimer < interval) return;

    // Find target
    const target = findFurthestEnemy(this.x, this.y, this.range, enemies);
    if (!target) return;

    this.attackTimer = 0;
    this.shootFlash = 1.0;
    this._fireAt(target, enemies, projectiles, effects, economy, towers);

    // Volley ability for Archer
    if (k === 'archer') {
      this.abilityTimer -= interval;
      if (this.abilityTimer <= 0) {
        this.abilityTimer = this.def.abilityCooldown;
        const volleyCount = this.upgradeLevel >= 2 ? 5 : 3;
        const nearby = getEnemiesInRange(this.x, this.y, this.range, enemies).slice(0, volleyCount);
        for (const e of nearby) {
          if (e !== target) {
            const dmg = e.takeDamage(this.damage * this.ampDmgBonus, this);
            effects.addHitEffect(e.x, e.y, 'physical');
            effects.addFloatText(e.x, e.y, `-${Math.round(dmg)}`, 'float-damage');
            projectiles.push(new Projectile(this.x, this.y, e, 'physical', this.damage, this));
            if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
          }
        }
      }
    }
  }

  // ── Cone attack helper ──────────────────────────────────────
  // Instantly hits all enemies inside a cone from this tower toward `target`.
  // halfAngleDeg: half the cone spread in degrees
  // coneRange: max distance enemies can be from the tower
  // Returns array of enemies hit.
  _fireCone(target, halfAngleDeg, coneRange, enemies) {
    const dx = target.x - this.x, dy = target.y - this.y;
    const aimAngle = Math.atan2(dy, dx);
    const halfRad = halfAngleDeg * Math.PI / 180;
    const r2 = coneRange * coneRange;
    const hit = [];
    for (const e of enemies) {
      if (e.dead || e.reached) continue;
      if (e.isInvisible && !e.isRevealed) continue;
      const ex = e.x - this.x, ey = e.y - this.y;
      if (ex*ex + ey*ey > r2) continue;
      const eAngle = Math.atan2(ey, ex);
      let diff = Math.abs(eAngle - aimAngle);
      if (diff > Math.PI) diff = Math.PI * 2 - diff;
      if (diff <= halfRad) hit.push(e);
    }
    // Store cone flash for rendering
    this.coneFlash = { angle: aimAngle, halfAngle: halfRad, range: coneRange, timer: 0.35 };
    return hit;
  }

  _fireAt(target, enemies, projectiles, effects, economy, towers) {
    const k = this.def.key;
    const dmg = this.damage * this.ampDmgBonus;

    if (k === 'archer') {
      const proj = new Projectile(this.x, this.y, target, 'physical', dmg, this);
      proj.pierceCount = this.pierceCount;
      proj.pierceSlow = this.upgradeLevel >= 2 ? 0.65 : 0.80;
      proj.onHit = (e, p, eff, eco) => {
        const d = e.takeDamage(p.damage, p.tower);
        if (d > 0) { eff.addHitEffect(e.x, e.y, 'physical'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        e.applySlow(p.pierceSlow, 2.0);
        if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); }
      };
      projectiles.push(proj);

    } else if (k === 'stoneThrower') {
      // Shotgun scatter cone — 80° wide, hits up to 5 enemies in a fan
      const hit = this._fireCone(target, 40, this.range, enemies);
      const shatter = Math.random() < (this.upgradeLevel >= 3 ? 0.3 : 0.15);
      for (const e of hit) {
        const d = e.takeDamage(dmg, this);
        if (d > 0) { effects.addHitEffect(e.x, e.y, 'physical'); effects.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
      }
      if (shatter) {
        const nearby = getEnemiesInRange(this.x, this.y, this.range * 1.3, enemies).slice(0, 3);
        for (const e of nearby) {
          const d = e.takeDamage(dmg * 0.5, this);
          effects.addHitEffect(e.x, e.y, 'physical');
          if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
        }
      }
      effects.addAoEEffect(target.x, target.y, 30, 'physical');

    } else if (k === 'spearman') {
      // Linear pierce: fire in direction of target
      const dx = target.x - this.x, dy = target.y - this.y;
      const angle = Math.atan2(dy, dx);
      const proj = new PierceProjectile(this.x, this.y, angle, dmg, this.range, this);
      proj.pierceMax = 1 + (this.upgradeLevel >= 1 ? 1 : 0);
      proj.slowPct = this.upgradeLevel >= 2 ? 0.65 : 0.80;
      proj.stunArmored = this.upgradeLevel >= 3;
      proj.onHit = (e, p, eff, eco) => {
        const d = e.takeDamage(p.damage, p.tower);
        if (d > 0) { eff.addHitEffect(e.x, e.y, 'physical'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        e.applySlow(p.slowPct, 2.0);
        if (p.stunArmored && e.type === 'armored') e.applyStun(0.5);
        if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); }
      };
      projectiles.push(proj);

    } else if (k === 'cannon') {
      // Grapeshot cone — very wide (110°) short blast; primary ball + cone spray
      // First: send the main cannonball projectile to target (stuns center)
      const proj = new Projectile(this.x, this.y, target, 'physical', dmg, this);
      proj.speed = 150;
      proj.onLand = (landX, landY, enArr, eff, eco) => {
        const stunR = this.upgradeLevel >= 3 ? 48 : 24;
        const dx2 = target.x - landX, dy2 = target.y - landY;
        if (dx2*dx2 + dy2*dy2 <= stunR*stunR) target.applyStun(1.0);
        const d = target.takeDamage(dmg, this);
        if (d > 0) { eff.addHitEffect(landX, landY, 'physical'); eff.addFloatText(landX, landY, `-${Math.round(d)}`, 'float-damage'); }
        if (target.dead) { this.kills++; eco.addGold(target.reward, landX, landY); }
        eff.addAoEEffect(landX, landY, 40, 'physical');
      };
      projectiles.push(proj);
      // Then: spray the cone for splash hits (shorter range, half damage)
      const coneRange = this.range * 0.75;
      const coneHit = this._fireCone(target, 55, coneRange, enemies);
      for (const e of coneHit) {
        if (e === target) continue;
        const d = e.takeDamage(dmg * 0.6, this);
        if (d > 0) { effects.addHitEffect(e.x, e.y, 'physical'); effects.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        if (this.upgradeLevel >= 3) e.applyStun(0.4);
        if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
      }

    } else if (k === 'frostMage') {
      const proj = new Projectile(this.x, this.y, target, 'ice', dmg, this);
      proj.onHit = (e, p, eff, eco) => {
        const d = e.takeDamage(p.damage, p.tower);
        if (d > 0) { eff.addHitEffect(e.x, e.y, 'ice'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        const stacks = this.upgradeLevel >= 1 ? 2 : 1;
        e.applyChill(stacks);
        if (e.chillStacks >= 5 && !e.frozen) {
          e.applyFreeze(1.5);
          if (this.upgradeLevel >= 2) e.frozenDmgBonus = true;
        }
        if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); }
      };
      projectiles.push(proj);

    } else if (k === 'fireWizard') {
      const burnDur = this.upgradeLevel >= 1 ? 6 : 4;
      const spreadR = this.specialState.spreadRadius || 38;
      const proj = new Projectile(this.x, this.y, target, 'fire', dmg, this);
      proj.onHit = (e, p, eff, eco) => {
        const d = e.takeDamage(p.damage, p.tower);
        if (d > 0) { eff.addHitEffect(e.x, e.y, 'fire'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        e.applyBurn(8, burnDur);
        if (this.specialState.inferno) e.burningDmgBonus = true;
        // Spread
        for (const other of enemies) {
          if (!other.dead && !other.reached && other !== e && !(other.isInvisible && !other.isRevealed)) {
            const dx = other.x - e.x, dy = other.y - e.y;
            if (dx*dx + dy*dy <= spreadR * spreadR) {
              other.applyBurn(6, burnDur * 0.5);
              if (this.specialState.inferno) other.burningDmgBonus = true;
            }
          }
        }
        if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); }
      };
      projectiles.push(proj);

    } else if (k === 'poisonAlchemist') {
      const proj = new Projectile(this.x, this.y, target, 'poison', dmg, this);
      proj.aoeRadius = this.aoeRadius;
      proj.onLand = (landX, landY, enArr, eff, eco) => {
        const poisonDmg = this.upgradeLevel >= 2 ? 20 : 12;
        const pudDur = this.specialState.pudDuration;
        for (const e of enArr) {
          if (!e.dead && !e.reached) {
            const dx = e.x - landX, dy = e.y - landY;
            if (dx*dx + dy*dy <= proj.aoeRadius * proj.aoeRadius) {
              const d = e.takeDamage(5 * this.ampDmgBonus, this);
              eff.addHitEffect(e.x, e.y, 'poison');
              eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage');
              e.applyPoison(poisonDmg, pudDur);
              e.applySlow(0.85, pudDur);
              if (this.specialState.corrode) e.corrodedArmor = true;
              if (e.dead) { this.kills++; eco.addGold(e.reward, e.x, e.y); }
            }
          }
        }
        eff.addAoEEffect(landX, landY, proj.aoeRadius, 'poison');
        // Add puddle effect
        this.specialState.puddles.push({ x: landX, y: landY, r: proj.aoeRadius, timer: pudDur });
      };
      projectiles.push(proj);

    } else if (k === 'gatling') {
      const ss = this.specialState;
      const targets = this.upgradeLevel >= 3 ? [target, findFurthestEnemy(this.x, this.y, this.range, enemies, [target])].filter(Boolean) : [target];
      for (const t2 of targets) {
        if (!t2) continue;
        if (ss.spinUp === undefined) ss.spinUp = {};
        const consecutive = ss.spinUp[t2.id] || 0;
        const bonusDmg = Math.min(consecutive, ss.spinCap);
        const finalDmg = (dmg + bonusDmg) * (ss.armorPierce ? (1 + ss.armorPierce) : 1);
        ss.spinUp[t2.id] = consecutive + 1;
        const proj = new Projectile(this.x, this.y, t2, 'physical', finalDmg, this);
        proj.speed = 400;
        proj.onHit = (e, p, eff, eco) => {
          const d = e.takeDamage(p.damage, p.tower);
          if (d > 0) { eff.addHitEffect(e.x, e.y, 'physical'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
          if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); p.tower.specialState.spinUp[e.id] = 0; }
        };
        projectiles.push(proj);
      }
      // Reset spin-up for enemies no longer targeted
      for (const eId in ss.spinUp) {
        if (!targets.find(t2 => t2 && String(t2.id) === eId)) ss.spinUp[eId] = 0;
      }

    } else if (k === 'lightningSage') {
      // Chain lightning
      const chained = [target];
      let current = target;
      for (let i = 1; i < this.chainCount; i++) {
        const next = findNearestEnemyExcluding(current.x, current.y, 120, enemies, chained);
        if (!next) break;
        chained.push(next);
        current = next;
      }
      for (let i = 0; i < chained.length; i++) {
        const e = chained[i];
        const d = e.takeDamage(dmg, this);
        effects.addHitEffect(e.x, e.y, 'lightning');
        effects.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage');
        if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
      }
      if (chained.length >= 4) {
        for (const e of chained) e.applyStun(0.5);
        if (this.specialState.shockwave) {
          for (const e of enemies) {
            if (!e.dead && !e.reached && !(e.isInvisible && !e.isRevealed)) {
              const dx = e.x - target.x, dy = e.y - target.y;
              if (dx*dx + dy*dy <= 80*80) {
                e.takeDamage(80, this);
                effects.addHitEffect(e.x, e.y, 'lightning');
              }
            }
          }
        }
      }
      // Draw chain lightning visual
      effects.addChainEffect(chained.map(e => ({ x: e.x, y: e.y })), this.x, this.y);

    } else if (k === 'teslaCoil') {
      const ss = this.specialState;
      ss.pulseCount = (ss.pulseCount || 0) + 1;
      const isOvercharge = (this.upgradeLevel >= 3 && ss.pulseCount % 5 === 0);
      for (const e of enemies) {
        if (!e.dead && !e.reached && !(e.isInvisible && !e.isRevealed)) {
          const dx = e.x - this.x, dy = e.y - this.y;
          if (dx*dx + dy*dy <= this.range * this.range) {
            const d = e.takeDamage((isOvercharge ? dmg * 3 : dmg), this);
            effects.addHitEffect(e.x, e.y, 'lightning');
            effects.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage');
            if (Math.random() < ss.shockChance) e.applyStun(ss.stunDur);
            if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
          }
        }
      }
      if (isOvercharge) effects.addAoEEffect(this.x, this.y, this.range, 'lightning');

    } else if (k === 'healerMonk') {
      const proj = new Projectile(this.x, this.y, target, 'holy', dmg, this);
      proj.onHit = (e, p, eff, eco) => {
        const d = e.takeDamage(p.damage, p.tower);
        if (d > 0) { eff.addHitEffect(e.x, e.y, 'holy'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        e.applySlow(0.7, 1.5);
        if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); }
      };
      projectiles.push(proj);

    } else if (k === 'necromancer') {
      const proj = new Projectile(this.x, this.y, target, 'shadow', dmg, this);
      proj.onHit = (e, p, eff, eco) => {
        const d = e.takeDamage(p.damage, p.tower);
        if (d > 0) { eff.addHitEffect(e.x, e.y, 'shadow'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        if (e.dead) {
          p.tower.kills++;
          eco.addGold(e.reward, e.x, e.y);
          // Raise Dead
          if (!e.isSkeleton && Math.random() < p.tower.specialState.raiseChance) {
            const sk = createSkeleton(e.x, e.y, p.tower.specialState.skeletonDuration);
            enemies.push(sk);
            eff.addFloatText(e.x, e.y, '💀RISE', 'float-damage');
          }
        }
      };
      projectiles.push(proj);

    } else if (k === 'arcaneColossus') {
      const elements = ['fire', 'ice', 'lightning', 'poison'];
      const elem = elements[Math.floor(Math.random() * elements.length)];
      const ss = this.specialState;
      const proj = new Projectile(this.x, this.y, target, elem, dmg, this);
      proj.aoeRadius = 72;
      proj.onLand = (landX, landY, enArr, eff, eco) => {
        const mult = ss.effectMult;
        for (const e of enArr) {
          if (!e.dead && !e.reached) {
            const dx = e.x - landX, dy = e.y - landY;
            if (dx*dx + dy*dy <= proj.aoeRadius * proj.aoeRadius) {
              const d = e.takeDamage(dmg, this);
              eff.addHitEffect(e.x, e.y, elem);
              eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage');
              if (elem === 'fire') e.applyBurn(8, 4 * mult);
              else if (elem === 'ice') e.applySlow(0.5, 2 * mult);
              else if (elem === 'lightning') e.applyStun(0.5 * mult);
              else if (elem === 'poison') e.applyPoison(12, 4 * mult);
              if (e.dead) { this.kills++; eco.addGold(e.reward, e.x, e.y); }
            }
          }
        }
        eff.addAoEEffect(landX, landY, proj.aoeRadius, elem);
      };
      projectiles.push(proj);

      // Cataclysm ultimate
      ss.cataclysmTimer -= this.getEffectiveAttackInterval();
      if (ss.cataclysmTimer <= 0) {
        ss.cataclysmTimer = ss.cataclysmCooldown;
        effects.addCataclysmEffect();
        effects.addScreenShake(10);
        const cataclysmRange = 200;
        for (const e of enemies) {
          if (!e.dead && !e.reached && !(e.isInvisible && !e.isRevealed)) {
            const cdx = e.x - this.x, cdy = e.y - this.y;
            if (cdx*cdx + cdy*cdy > cataclysmRange * cataclysmRange) continue;
            e.takeDamage(200, this);
            effects.addHitEffect(e.x, e.y, 'fire');
            if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
          }
        }
        effects.addFloatText(this.x, this.y - 20, 'CATACLYSM!', 'float-crit');
      }

    // ── New tower fire logic ──────────────────────────────────
    } else if (k === 'crossbow') {
      const proj = new Projectile(this.x, this.y, target, 'physical', dmg, this);
      proj.speed = 380;
      proj.onHit = (e, p, eff, eco) => {
        const d = e.takeDamage(p.damage, p.tower);
        if (d > 0) { eff.addHitEffect(e.x, e.y, 'physical'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        const bd = p.tower.specialState.bleedDmg, dur = p.tower.specialState.bleedDur;
        e.applyPoison(bd, dur); // reuse poison for bleed
        if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); }
      };
      projectiles.push(proj);

    } else if (k === 'slingshot') {
      const ss = this.specialState;
      const hit = (e, remaining) => {
        const d = e.takeDamage(dmg * (ss.fullDmg ? 1 : 0.6 + 0.4 * (remaining / ss.bounces)), this);
        effects.addHitEffect(e.x, e.y, 'physical');
        effects.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage');
        if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
        if (remaining > 0) {
          const next = findNearestEnemyExcluding(e.x, e.y, 120, enemies, [e]);
          if (next) hit(next, remaining - 1);
        }
      };
      const proj = new Projectile(this.x, this.y, target, 'physical', dmg, this);
      proj.onHit = (e, p, eff, eco) => { hit(e, ss.bounces); };
      projectiles.push(proj);

    } else if (k === 'militiaPike') {
      const proj = new Projectile(this.x, this.y, target, 'physical', dmg, this);
      proj.speed = 200;
      const hitCount = { n: 0 };
      proj.onHit = (e, p, eff, eco) => {
        const d = e.takeDamage(p.damage, p.tower);
        if (d > 0) { eff.addHitEffect(e.x, e.y, 'physical'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        hitCount.n++;
        if (p.tower.specialState.stunEvery > 0 && hitCount.n % p.tower.specialState.stunEvery === 0) e.applyStun(0.8);
        if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); }
      };
      projectiles.push(proj);

    } else if (k === 'oilThrower') {
      const proj = new Projectile(this.x, this.y, target, 'physical', dmg, this);
      proj.aoeRadius = this.aoeRadius;
      proj.onLand = (lx, ly, enArr, eff, eco) => {
        const dur = this.upgradeLevel >= 2 ? 8 : 5;
        for (const e of enArr) {
          if (!e.dead && !e.reached) {
            const dx = e.x-lx, dy = e.y-ly;
            if (dx*dx+dy*dy <= proj.aoeRadius*proj.aoeRadius) {
              e.oiled = true;
              e.applySlow(0.80, dur);
              const d = e.takeDamage(dmg, this);
              eff.addHitEffect(e.x, e.y, 'physical');
              if (e.dead) { this.kills++; eco.addGold(e.reward, e.x, e.y); }
            }
          }
        }
        this.specialState.puddles.push({ x:lx, y:ly, r:proj.aoeRadius, timer:dur });
        eff.addAoEEffect(lx, ly, proj.aoeRadius, 'physical');
      };
      projectiles.push(proj);

    } else if (k === 'ballistae') {
      const angle = Math.atan2(target.y - this.y, target.x - this.x);
      const proj = new PierceProjectile(this.x, this.y, angle, dmg, this.range, this);
      proj.pierceMax = this.pierceCount;
      proj.color = '#a8a870';
      proj.onHit = (e, p, eff, eco) => {
        const mult = (1 + (p.tower.specialState.armorShred || 0));
        const d = e.takeDamage(p.damage * mult, p.tower);
        if (d > 0) { eff.addHitEffect(e.x, e.y, 'physical'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); }
      };
      projectiles.push(proj);

    } else if (k === 'bombPoster') {
      const proj = new Projectile(this.x, this.y, target, 'physical', dmg, this);
      proj.aoeRadius = this.aoeRadius;
      proj.speed = 130;
      proj.onLand = (lx, ly, enArr, eff, eco) => {
        const stunR = this.upgradeLevel >= 2 ? 60 : 30;
        for (const e of enArr) {
          if (!e.dead && !e.reached) {
            const dx = e.x-lx, dy = e.y-ly;
            const dist2 = dx*dx+dy*dy;
            if (dist2 <= proj.aoeRadius*proj.aoeRadius) {
              const d = e.takeDamage(dmg, this);
              eff.addHitEffect(e.x, e.y, 'physical');
              eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage');
              if (dist2 <= stunR*stunR) e.applyStun(1.0);
              if (e.dead) { this.kills++; eco.addGold(e.reward, e.x, e.y); }
            }
          }
        }
        if (this.specialState.cluster) {
          for (let c = 0; c < 3; c++) {
            const cx = lx + (Math.random()-0.5)*80, cy = ly + (Math.random()-0.5)*80;
            for (const e of enArr) {
              if (!e.dead && !e.reached) {
                const dx = e.x-cx, dy = e.y-cy;
                if (dx*dx+dy*dy <= 30*30) { e.takeDamage(dmg*0.4, this); eff.addHitEffect(e.x, e.y, 'physical'); }
              }
            }
            eff.addAoEEffect(cx, cy, 30, 'physical');
          }
        }
        eff.addAoEEffect(lx, ly, proj.aoeRadius, 'physical');
      };
      projectiles.push(proj);

    } else if (k === 'stormArcher') {
      const ss = this.specialState;
      const proj = new Projectile(this.x, this.y, target, 'lightning', dmg, this);
      proj.onHit = (e, p, eff, eco) => {
        const d = e.takeDamage(p.damage, p.tower);
        if (d > 0) { eff.addHitEffect(e.x, e.y, 'lightning'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        if (ss.chainStun) e.applyStun(0.3);
        // Chain to 1 nearby
        const chain = findNearestEnemyExcluding(e.x, e.y, ss.chainRange, enemies, [e]);
        if (chain) {
          const cd = chain.takeDamage(p.damage * 0.7, p.tower);
          eff.addHitEffect(chain.x, chain.y, 'lightning');
          eff.addFloatText(chain.x, chain.y, `-${Math.round(cd)}`, 'float-damage');
          eff.addChainEffect([{x:chain.x,y:chain.y}], e.x, e.y);
          if (ss.chainStun) chain.applyStun(0.3);
          if (chain.dead) { p.tower.kills++; eco.addGold(chain.reward, chain.x, chain.y); }
        }
        if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); }
      };
      projectiles.push(proj);

    } else if (k === 'plagueDoctor') {
      const ss = this.specialState;
      const proj = new Projectile(this.x, this.y, target, 'poison', dmg, this);
      proj.onHit = (e, p, eff, eco) => {
        const d = e.takeDamage(p.damage, p.tower);
        if (d > 0) { eff.addHitEffect(e.x, e.y, 'poison'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        e.plagued = true;
        if (ss.poisonPlague) e.applyPoison(12, 4);
        if (e.dead) {
          p.tower.kills++; eco.addGold(e.reward, e.x, e.y);
          for (const other of enemies) {
            if (!other.dead && !other.reached && other !== e) {
              const dx = other.x-e.x, dy = other.y-e.y;
              if (dx*dx+dy*dy <= ss.spreadRadius*ss.spreadRadius) {
                other.plagued = true;
                other.applyPoison(8, 3);
                eff.addHitEffect(other.x, other.y, 'poison');
              }
            }
          }
        }
      };
      projectiles.push(proj);

    } else if (k === 'shadowStalker') {
      const ss = this.specialState;
      const isFirst = !ss.firstHitTargets.has(target.id);
      const finalDmg = isFirst ? dmg * (ss.critMult || 3) : dmg;
      const proj = new Projectile(this.x, this.y, target, 'shadow', finalDmg, this);
      proj.onHit = (e, p, eff, eco) => {
        const d = e.takeDamage(p.damage, p.tower);
        if (d > 0) { eff.addHitEffect(e.x, e.y, 'shadow'); eff.addFloatText(e.x, e.y, isFirst ? `CRIT -${Math.round(d)}!` : `-${Math.round(d)}`, isFirst ? 'float-crit' : 'float-damage'); }
        ss.firstHitTargets.add(e.id);
        if (ss.permaMark) e.markedByScout = true;
        if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); ss.firstHitTargets.delete(e.id); }
      };
      projectiles.push(proj);

    } else if (k === 'pyromancer') {
      const ss = this.specialState;
      if ((ss.zones || []).length < ss.maxZones) {
        const proj = new Projectile(this.x, this.y, target, 'fire', dmg, this);
        proj.aoeRadius = this.aoeRadius;
        proj.onLand = (lx, ly, enArr, eff, eco) => {
          if (!ss.zones) ss.zones = [];
          const dur = this.upgradeLevel >= 1 ? 7 : 5;
          ss.zones.push({ x:lx, y:ly, r:proj.aoeRadius, timer:dur });
          eff.addAoEEffect(lx, ly, proj.aoeRadius, 'fire');
          for (const e of enArr) {
            if (!e.dead && !e.reached) {
              const dx = e.x-lx, dy = e.y-ly;
              if (dx*dx+dy*dy <= proj.aoeRadius*proj.aoeRadius) {
                const d = e.takeDamage(dmg, this);
                eff.addHitEffect(e.x, e.y, 'fire');
                if (e.dead) { this.kills++; eco.addGold(e.reward, e.x, e.y); }
              }
            }
          }
        };
        projectiles.push(proj);
      }
      // Update zones
      if (ss.zones) {
        for (let i = ss.zones.length-1; i >= 0; i--) {
          ss.zones[i].timer -= this.getEffectiveAttackInterval();
          const zoneDmgMult = ss.zoneDmgMult || 1;
          for (const e of enemies) {
            if (!e.dead && !e.reached && !(e.isInvisible && !e.isRevealed)) {
              const dx = e.x-ss.zones[i].x, dy = e.y-ss.zones[i].y;
              if (dx*dx+dy*dy <= ss.zones[i].r*ss.zones[i].r) {
                e.applyBurn(15 * zoneDmgMult, 0.5);
              }
            }
          }
          if (ss.zones[i].timer <= 0) ss.zones.splice(i, 1);
        }
      }

    } else if (k === 'crystalBow') {
      const ss = this.specialState;
      const proj = new Projectile(this.x, this.y, target, 'ice', dmg, this);
      proj.onHit = (e, p, eff, eco) => {
        const bonus = (e.frozen || e.chillStacks >= 2) ? (1 + ss.frozenBonus) : 1;
        const d = e.takeDamage(p.damage * bonus, p.tower);
        if (d > 0) { eff.addHitEffect(e.x, e.y, 'ice'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        if (p.tower.upgradeLevel >= 1) e.applyChill(1);
        if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); }
      };
      projectiles.push(proj);

    } else if (k === 'trapMaster') {
      const ss = this.specialState;
      if (!ss.traps) ss.traps = [];
      if (ss.traps.length < ss.maxTraps) {
        const proj = new Projectile(this.x, this.y, target, 'physical', dmg, this);
        proj.aoeRadius = 40;
        proj.onLand = (lx, ly, enArr, eff, eco) => {
          ss.traps.push({ x:lx, y:ly, r:40, active:true });
          eff.addHitEffect(lx, ly, 'physical');
        };
        projectiles.push(proj);
      }
      // Trap triggers are handled every frame in update() above

    } else if (k === 'bloodKnight') {
      const ss = this.specialState;
      const totalDmg = dmg + Math.min(ss.killBonus, ss.killBonusCap);
      const proj = new Projectile(this.x, this.y, target, 'physical', totalDmg, this);
      proj.onHit = (e, p, eff, eco) => {
        const d = e.takeDamage(p.damage, p.tower);
        if (d > 0) { eff.addHitEffect(e.x, e.y, 'physical'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        if (e.dead) {
          p.tower.kills++;
          eco.addGold(e.reward, e.x, e.y);
          ss.killBonus += ss.killBonusPer;
          if (ss.bleedOnMax && ss.killBonus >= ss.killBonusCap) {
            for (const other of enemies) {
              if (!other.dead && !other.reached && !(other.isInvisible && !other.isRevealed)) {
                const dx = other.x-p.tower.x, dy = other.y-p.tower.y;
                if (dx*dx+dy*dy <= 100*100) other.applyPoison(15, 4);
              }
            }
          }
        }
      };
      projectiles.push(proj);

    } else if (k === 'thornGolem') {
      const ss = this.specialState;
      for (const e of enemies) {
        if (!e.dead && !e.reached && !(e.isInvisible && !e.isRevealed)) {
          const dx = e.x-this.x, dy = e.y-this.y;
          if (dx*dx+dy*dy <= this.range*this.range) {
            const d = e.takeDamage(dmg * this.ampDmgBonus, this);
            if (d > 0) { effects.addHitEffect(e.x, e.y, 'poison'); effects.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
            if (ss.poisonOnHit) e.applyPoison(8, 3);
            if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
          }
        }
      }

    } else if (k === 'shadowPriest') {
      const spreadEnemies = enemies;
      const proj = new Projectile(this.x, this.y, target, 'shadow', dmg, this);
      proj.onHit = (e, p, eff, eco) => {
        const d = e.takeDamage(p.damage, p.tower);
        if (d > 0) { eff.addHitEffect(e.x, e.y, 'shadow'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        e.cursed = true; e.curseSpread = p.tower.specialState.spreadPct;
        // Spread % of damage dealt to nearby enemies
        if (d > 0 && e.curseSpread > 0) {
          const spreadDmg = d * e.curseSpread;
          for (const other of spreadEnemies) {
            if (other === e || other.dead || other.reached) continue;
            const dx = other.x - e.x, dy = other.y - e.y;
            if (dx*dx + dy*dy <= 80*80) {
              const sd = other.takeDamage(spreadDmg, p.tower);
              if (sd > 0) { eff.addHitEffect(other.x, other.y, 'shadow'); eff.addFloatText(other.x, other.y, `-${Math.round(sd)}`, 'float-damage'); }
              if (other.dead) { p.tower.kills++; eco.addGold(other.reward, other.x, other.y); }
            }
          }
        }
        if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); }
      };
      projectiles.push(proj);

    } else if (k === 'iceGolem') {
      // Frost breath cone — 90° wide, chills and slows everything in front
      const novaRadius = this.upgradeLevel >= 2 ? this.aoeRadius + 32 : this.aoeRadius || 80;
      const hit = this._fireCone(target, 45, novaRadius, enemies);
      for (const e of hit) {
        const d = e.takeDamage(dmg, this);
        if (d > 0) { effects.addHitEffect(e.x, e.y, 'ice'); effects.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        e.applyChill(1);
        e.applySlow(0.55, 2.5);
        if (e.chillStacks >= 5 && !e.frozen) e.applyFreeze(this.upgradeLevel >= 1 ? 3 : 2);
        if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
      }
      this.coneFlash = { ...this.coneFlash, color: 'ice' };

    } else if (k === 'acidCatapult') {
      const ss = this.specialState;
      const proj = new Projectile(this.x, this.y, target, 'poison', dmg, this);
      proj.aoeRadius = this.aoeRadius;
      proj.onLand = (lx, ly, enArr, eff, eco) => {
        for (const e of enArr) {
          if (!e.dead && !e.reached) {
            const dx = e.x-lx, dy = e.y-ly;
            if (dx*dx+dy*dy <= proj.aoeRadius*proj.aoeRadius) {
              const d = e.takeDamage(dmg, this);
              eff.addHitEffect(e.x, e.y, 'poison');
              eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage');
              e.corrodedArmor = true; e.corrodePct = ss.shredPct; e.corrodeTimer = ss.shredDur;
              if (ss.acidDot) e.applyPoison(ss.acidDot, ss.shredDur);
              if (e.dead) { this.kills++; eco.addGold(e.reward, e.x, e.y); }
            }
          }
        }
        eff.addAoEEffect(lx, ly, proj.aoeRadius, 'poison');
      };
      projectiles.push(proj);

    } else if (k === 'vortexCannon') {
      const ss = this.specialState;
      const proj = new Projectile(this.x, this.y, target, 'shadow', dmg, this);
      proj.aoeRadius = this.aoeRadius;
      proj.onLand = (lx, ly, enArr, eff, eco) => {
        const pullTargets = [...enArr].filter(e => !e.dead && !e.reached).sort((a,b) => {
          const da = (a.x-lx)**2+(a.y-ly)**2, db = (b.x-lx)**2+(b.y-ly)**2; return da-db;
        }).slice(0, ss.pullCount);
        for (const e of pullTargets) {
          e.x = lx + (Math.random()-0.5)*10; e.y = ly + (Math.random()-0.5)*10;
          const d = e.takeDamage(dmg, this);
          eff.addHitEffect(e.x, e.y, 'shadow');
          eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage');
          if (ss.holdDur > 0) e.applyStun(ss.holdDur);
          if (e.dead) { this.kills++; eco.addGold(e.reward, e.x, e.y); }
        }
        eff.addAoEEffect(lx, ly, proj.aoeRadius, 'shadow');
      };
      projectiles.push(proj);

    } else if (k === 'voidGolem') {
      const proj = new Projectile(this.x, this.y, target, 'shadow', dmg, this);
      proj.onHit = (e, p, eff, eco) => {
        const d = e.takeDamage(p.damage, p.tower);
        if (d > 0) { eff.addHitEffect(e.x, e.y, 'shadow'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); }
      };
      projectiles.push(proj);

    } else if (k === 'prismTower') {
      const ss = this.specialState;
      ss.shotCount++;
      const elements = ['fire','ice','lightning','poison','shadow','holy','physical','physical'];
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 / 8) * i;
        const elem = ss.rainbow ? elements[i % elements.length] : 'physical';
        const proj = new PierceProjectile(this.x, this.y, angle, dmg, this.range, this);
        proj.pierceMax = 10;
        proj.color = ss.rainbow ? (['#ff8040','#80c0ff','#ffff40','#80ff40','#c040ff','#ffff80','#d0d0d0','#d0d0d0'][i]) : '#ffffff';
        proj.onHit = (e, p, eff, eco) => {
          const d = e.takeDamage(p.damage, p.tower);
          if (d > 0) { eff.addHitEffect(e.x, e.y, elem); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
          if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); }
        };
        projectiles.push(proj);
      }

    } else if (k === 'archangelCommander') {
      const ss = this.specialState;
      // Smite: instant kill below threshold
      if (target.hp / target.maxHp <= ss.smiteThreshold) {
        target.takeDamage(target.maxHp * 10, this);
        effects.addHitEffect(target.x, target.y, 'holy');
        effects.addFloatText(target.x, target.y, 'SMITE!', 'float-crit');
        if (target.dead) { this.kills++; economy.addGold(target.reward, target.x, target.y); }
        if (ss.aoeOnSmite) {
          for (const e of enemies) {
            if (!e.dead && !e.reached && e !== target && !(e.isInvisible && !e.isRevealed)) {
              const dx = e.x-target.x, dy = e.y-target.y;
              if (dx*dx+dy*dy <= 80*80) {
                e.takeDamage(200, this);
                effects.addHitEffect(e.x, e.y, 'holy');
                if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
              }
            }
          }
          effects.addAoEEffect(target.x, target.y, 80, 'holy');
          effects.addScreenShake(4);
        }
      } else {
        const proj = new Projectile(this.x, this.y, target, 'holy', dmg, this);
        proj.onHit = (e, p, eff, eco) => {
          const d = e.takeDamage(p.damage, p.tower);
          if (d > 0) { eff.addHitEffect(e.x, e.y, 'holy'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
          if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); }
        };
        projectiles.push(proj);
      }

    } else if (k === 'fallenSeraph') {
      const ss = this.specialState;
      const proj = new Projectile(this.x, this.y, target, 'lightning', dmg, this);
      proj.onHit = (e, p, eff, eco) => {
        // Full damage to armored/flying
        const d = e.takeDamage(p.damage, p.tower, true);
        if (d > 0) { eff.addHitEffect(e.x, e.y, 'lightning'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        if (ss.burnOnChain) e.applyBurn(15, 2);
        if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); }
        // Chain
        const hit = [e];
        for (let c = 0; c < ss.chainCount - 1; c++) {
          const last = hit[hit.length-1];
          const next = findNearestEnemyExcluding(last.x, last.y, 120, enemies, hit);
          if (!next) break;
          hit.push(next);
          const cd = next.takeDamage(p.damage * 0.7, p.tower, true);
          eff.addHitEffect(next.x, next.y, 'lightning');
          eff.addFloatText(next.x, next.y, `-${Math.round(cd)}`, 'float-damage');
          eff.addChainEffect([{x:next.x,y:next.y}], last.x, last.y);
          if (ss.burnOnChain) next.applyBurn(15, 2);
          if (next.dead) { p.tower.kills++; eco.addGold(next.reward, next.x, next.y); }
        }
      };
      projectiles.push(proj);

    } else if (k === 'torchbearer') {
      const ss = this.specialState;
      const proj = new Projectile(this.x, this.y, target, 'fire', dmg, this);
      proj.onHit = (e, p, eff, eco) => {
        const d = e.takeDamage(p.damage, p.tower); if (d > 0) { eff.addHitEffect(e.x, e.y, 'fire'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        e.applyBurn(ss.burnDmg, ss.burnDur);
        if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); }
      }; projectiles.push(proj);

    } else if (k === 'hedgeKnight') {
      const d = target.takeDamage(dmg, this); effects.addHitEffect(target.x, target.y, 'physical'); effects.addFloatText(target.x, target.y, `-${Math.round(d)}`, 'float-damage');
      if (target.dead) { this.kills++; economy.addGold(target.reward, target.x, target.y); }
      if (this.specialState.cleave) {
        const nearby = findNearestEnemyExcluding(target.x, target.y, 80, enemies, [target]);
        if (nearby) { nearby.takeDamage(dmg * 0.5, this); effects.addHitEffect(nearby.x, nearby.y, 'physical'); if (nearby.dead) { this.kills++; economy.addGold(nearby.reward, nearby.x, nearby.y); } }
      }

    } else if (k === 'rifleman') {
      const ss = this.specialState;
      let finalDmg = dmg;
      if (ss.headshot && Math.random() < 0.20) { finalDmg *= 2; effects.addFloatText(target.x, target.y - 10, 'HEADSHOT!', 'float-crit'); }
      const proj = new Projectile(this.x, this.y, target, 'physical', finalDmg, this);
      proj.onHit = (e, p, eff, eco) => { const d = e.takeDamage(p.damage, p.tower); if (d > 0) { eff.addHitEffect(e.x, e.y, 'physical'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); } if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); } };
      projectiles.push(proj);

    } else if (k === 'netThrower') {
      const ss = this.specialState;
      const proj = new Projectile(this.x, this.y, target, 'physical', dmg, this);
      proj.onHit = (e, p, eff, eco) => {
        const d = e.takeDamage(p.damage, p.tower); if (d > 0) { eff.addHitEffect(e.x, e.y, 'physical'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        e.applyStun(ss.stunDur);
        if (ss.postSlow) setTimeout(() => { if (!e.dead) e.applySlow(0.70, 2); }, ss.stunDur * 1000);
        if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); }
      }; projectiles.push(proj);

    } else if (k === 'brawler') {
      const ss = this.specialState;
      const d = target.takeDamage(dmg, this); effects.addHitEffect(target.x, target.y, 'physical'); effects.addFloatText(target.x, target.y, `-${Math.round(d)}`, 'float-damage');
      target.applyBurn(ss.bleedDmg, ss.bleedDur);
      if (target.dead) { this.kills++; economy.addGold(target.reward, target.x, target.y); }

    } else if (k === 'herbalist') {
      const ss = this.specialState;
      for (const e of enemies) {
        if (!e.dead && !e.reached) {
          const dx = e.x - target.x, dy = e.y - target.y;
          if (dx*dx + dy*dy <= this.aoeRadius * this.aoeRadius) {
            e.takeDamage(dmg, this); e.applySlow(ss.slowPct, 2);
            if (ss.poisonOnHit) e.applyPoison(4, 2);
            effects.addHitEffect(e.x, e.y, 'poison');
            if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
          }
        }
      }
      effects.addAoEEffect(target.x, target.y, this.aoeRadius, 'poison');

    } else if (k === 'demolisher') {
      const ss = this.specialState;
      const proj = new Projectile(this.x, this.y, target, 'fire', dmg, this);
      proj.aoeRadius = this.aoeRadius;
      proj.onLand = (lx, ly, enArr, eff, eco) => {
        for (const e of enArr) {
          if (!e.dead && !e.reached) {
            const dx = e.x-lx, dy = e.y-ly;
            if (dx*dx+dy*dy <= this.aoeRadius * this.aoeRadius) {
              e.takeDamage(dmg, this); eff.addHitEffect(e.x, e.y, 'fire'); eff.addFloatText(e.x, e.y, `-${Math.round(dmg)}`, 'float-damage');
              const distSq = dx*dx+dy*dy;
              if (ss.centerStun && distSq <= (this.aoeRadius*0.4)*(this.aoeRadius*0.4)) e.applyStun(1);
              if (e.dead) { this.kills++; eco.addGold(e.reward, e.x, e.y); }
            }
          }
        }
        eff.addAoEEffect(lx, ly, this.aoeRadius, 'fire'); eff.addScreenShake(4);
      }; projectiles.push(proj);

    } else if (k === 'bloodArcher') {
      const ss = this.specialState;
      const proj = new Projectile(this.x, this.y, target, 'physical', dmg, this);
      proj.onHit = (e, p, eff, eco) => {
        const d = e.takeDamage(p.damage, p.tower); if (d > 0) { eff.addHitEffect(e.x, e.y, 'physical'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        if (e.dead) { p.tower.kills++; eco.addGold(e.reward + ss.killGold, e.x, e.y); ss.killCount++; if (ss.lifeHeal && ss.killCount % ss.killsForHeal === 0 && economy.lives < economy.maxLives) { economy.healLife(1); eff.addFloatText(e.x, e.y, '+1 ❤️', 'float-gold'); } }
      }; projectiles.push(proj);

    } else if (k === 'ironGolemTower') {
      const ss = this.specialState;
      const proj = new Projectile(this.x, this.y, target, 'physical', dmg, this);
      proj.onHit = (e, p, eff, eco) => {
        const d = e.takeDamage(p.damage, p.tower, true); if (d > 0) { eff.addHitEffect(e.x, e.y, 'physical'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        if (e.isArmored && this.upgradeLevel >= 2) e.applyStun(0.5);
        if (ss.slamAoe) { for (const e2 of enemies) { if (!e2.dead && !e2.reached && e2 !== e) { const dx = e2.x-e.x, dy = e2.y-e.y; if (dx*dx+dy*dy <= 60*60) { e2.takeDamage(p.damage*0.4, p.tower, true); eff.addHitEffect(e2.x, e2.y, 'physical'); if (e2.dead) { p.tower.kills++; eco.addGold(e2.reward, e2.x, e2.y); } } } } eff.addAoEEffect(e.x, e.y, 60, 'physical'); }
        if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); }
      }; projectiles.push(proj);

    } else if (k === 'chronoMage') {
      const ss = this.specialState;
      const proj = new Projectile(this.x, this.y, target, 'ice', dmg, this);
      proj.onHit = (e, p, eff, eco) => {
        const d = e.takeDamage(p.damage, p.tower); if (d > 0) { eff.addHitEffect(e.x, e.y, 'ice'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        e.applyFreeze(ss.freezeDur);
        if (ss.frozenBonus) e.frozenDmgBonus = 1.30;
        if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); }
      }; projectiles.push(proj);

    } else if (k === 'boneShaman') {
      const ss = this.specialState;
      const proj = new Projectile(this.x, this.y, target, 'shadow', dmg, this);
      proj.onHit = (e, p, eff, eco) => {
        const d = e.takeDamage(p.damage, p.tower); if (d > 0) { eff.addHitEffect(e.x, e.y, 'shadow'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        e.cursed = true; e.curseBonus = ss.curseBonus; e.curseTimer = ss.curseDur;
        if (ss.curseSpread) { const nearby = findNearestEnemyExcluding(e.x, e.y, 80, enemies, [e]); if (nearby) { nearby.cursed = true; nearby.curseBonus = ss.curseBonus; nearby.curseTimer = ss.curseDur; } }
        if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); }
      }; projectiles.push(proj);

    } else if (k === 'vineTrap') {
      const ss = this.specialState;
      const proj = new Projectile(this.x, this.y, target, 'poison', dmg, this);
      proj.onHit = (e, p, eff, eco) => {
        const d = e.takeDamage(p.damage, p.tower); if (d > 0) { eff.addHitEffect(e.x, e.y, 'poison'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        e.applyStun(ss.rootDur);
        if (ss.rootSpread) { const nearby = findNearestEnemyExcluding(e.x, e.y, 60, enemies, [e]); if (nearby) nearby.applyStun(ss.rootDur * 0.5); }
        if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); }
      }; projectiles.push(proj);

    } else if (k === 'glassCannonTower') {
      const ss = this.specialState;
      let finalDmg = dmg;
      if (ss.critChance > 0 && Math.random() < ss.critChance) { finalDmg *= ss.critMult; effects.addFloatText(target.x, target.y - 10, 'CRIT!', 'float-crit'); }
      const proj = new Projectile(this.x, this.y, target, 'physical', finalDmg, this);
      proj.onHit = (e, p, eff, eco) => { const d = e.takeDamage(p.damage, p.tower); if (d > 0) { eff.addHitEffect(e.x, e.y, 'physical'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); } if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); } };
      projectiles.push(proj);

    } else if (k === 'sandGolemTower') {
      const slowAmt = this.upgradeLevel >= 1 ? 0.50 : 0.60;
      for (const e of enemies) {
        if (!e.dead && !e.reached) {
          const dx = e.x - target.x, dy = e.y - target.y;
          if (dx*dx + dy*dy <= this.aoeRadius * this.aoeRadius) {
            e.takeDamage(dmg, this); e.applySlow(slowAmt, 3);
            effects.addHitEffect(e.x, e.y, 'fire');
            if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
          }
        }
      }
      effects.addAoEEffect(target.x, target.y, this.aoeRadius, 'fire');

    } else if (k === 'thunderDrum') {
      for (const e of enemies) {
        if (!e.dead && !e.reached) {
          const dx = e.x - this.x, dy = e.y - this.y;
          if (dx*dx + dy*dy <= this.range * this.range) {
            e.applyStun(this.specialState.stunDur);
            if (this.specialState.stunDmg > 0) { e.takeDamage(this.specialState.stunDmg, this); effects.addHitEffect(e.x, e.y, 'lightning'); if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); } }
          }
        }
      }
      effects.addAoEEffect(this.x, this.y, this.range, 'lightning'); effects.addScreenShake(3); effects.addFloatText(this.x, this.y - 20, '⚡CLAP!', 'float-crit');

    } else if (k === 'phoenixTower') {
      // Phoenix: standard single-target fire projectile (AoE burst handled in update)
      const proj = new Projectile(this.x, this.y, target, 'fire', dmg, this);
      proj.onHit = (e, p, eff, eco) => {
        const d = e.takeDamage(p.damage, p.tower); if (d > 0) { eff.addHitEffect(e.x, e.y, 'fire'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); }
      }; projectiles.push(proj);

    } else if (k === 'infernoDrake') {
      // Narrow fire breath cone — 50° wide, applies burn to all in front
      const hit = this._fireCone(target, 25, this.range, enemies);
      for (const e of hit) {
        const d = e.takeDamage(dmg, this);
        if (d > 0) { effects.addHitEffect(e.x, e.y, 'fire'); effects.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        e.applyBurn(12, 2.5);
        if (this.specialState.groundFire) this.specialState._fireZones.push({ x: e.x, y: e.y, r: 35, timer: 3 });
        if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
      }
      this.coneFlash = { ...this.coneFlash, color: 'fire' };

    } else if (k === 'tempestCallerTower') {
      // Wide wind blast cone — 120° spread, pushes enemies back along path
      const pushDist = this.upgradeLevel >= 1 ? 70 : 50;
      const hit = this._fireCone(target, 60, this.range, enemies);
      for (const e of hit) {
        const d = e.takeDamage(dmg, this);
        if (d > 0) { effects.addHitEffect(e.x, e.y, 'physical'); effects.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        const stepsBack = Math.round(pushDist / 48);
        e.waypointIndex = Math.max(1, e.waypointIndex - stepsBack);
        e.x = e.waypoints[e.waypointIndex - 1].x;
        e.y = e.waypoints[e.waypointIndex - 1].y;
        e.distanceTraveled = Math.max(0, e.distanceTraveled - pushDist);
        if (this.specialState.postSlow) e.applySlow(0.70, 2);
        if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
      }
      this.coneFlash = { ...this.coneFlash, color: 'wind' };

    } else if (k === 'crystalGolem') {
      for (const e of enemies) {
        if (!e.dead && !e.reached) {
          const dx = e.x - target.x, dy = e.y - target.y;
          if (dx*dx + dy*dy <= this.aoeRadius * this.aoeRadius) {
            const d = e.takeDamage(dmg, this); if (d > 0) { effects.addHitEffect(e.x, e.y, 'ice'); effects.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
            if (e.dead) { this.kills++; economy.addGold(e.reward, e.x, e.y); }
          }
        }
      }
      effects.addAoEEffect(target.x, target.y, this.aoeRadius, 'ice');

    } else if (k === 'leechWraith') {
      const ss = this.specialState;
      const proj = new Projectile(this.x, this.y, target, 'shadow', dmg, this);
      proj.onHit = (e, p, eff, eco) => {
        const d = e.takeDamage(p.damage, p.tower); if (d > 0) { eff.addHitEffect(e.x, e.y, 'shadow'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        if (ss.drain) e.applyPoison(e.maxHp * 0.20 / 3, 3);
        if (e.dead) { p.tower.kills++; eco.addGold(e.reward + ss.killGold, e.x, e.y); ss.killCount++; if (ss.killCount % ss.killsForHeal === 0 && economy.lives < economy.maxLives) { economy.healLife(1); eff.addFloatText(e.x, e.y, '+1 ❤️', 'float-gold'); } }
      }; projectiles.push(proj);

    } else if (k === 'runeForger') {
      const proj = new Projectile(this.x, this.y, target, 'lightning', dmg, this);
      proj.onHit = (e, p, eff, eco) => { const d = e.takeDamage(p.damage, p.tower); if (d > 0) { eff.addHitEffect(e.x, e.y, 'lightning'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); } if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); } };
      projectiles.push(proj);

    } else if (k === 'deathKnight') {
      const proj = new Projectile(this.x, this.y, target, 'shadow', dmg, this);
      proj.onHit = (e, p, eff, eco) => {
        const d = e.takeDamage(p.damage, p.tower); if (d > 0) { eff.addHitEffect(e.x, e.y, 'shadow'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        if (this.specialState.chainBolt) { const next = findNearestEnemyExcluding(e.x, e.y, 100, enemies, [e]); if (next) { next.takeDamage(p.damage * 0.5, p.tower); eff.addHitEffect(next.x, next.y, 'shadow'); eff.addChainEffect([{x:next.x,y:next.y}], e.x, e.y); if (next.dead) { p.tower.kills++; eco.addGold(next.reward, next.x, next.y); } } }
        if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); if (this.specialState.raisesPerKill > 0) { for (let r=0;r<this.specialState.raisesPerKill;r++) { enemies.push(createSkeleton(e.x+(Math.random()-0.5)*20, e.y+(Math.random()-0.5)*20, 5)); } } }
      }; projectiles.push(proj);

    } else if (k === 'lichLord') {
      const ss = this.specialState;
      const proj = new Projectile(this.x, this.y, target, 'shadow', dmg, this);
      proj.onHit = (e, p, eff, eco) => {
        const d = e.takeDamage(p.damage, p.tower); if (d > 0) { eff.addHitEffect(e.x, e.y, 'shadow'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        if (ss.chainBolt) { const n1 = findNearestEnemyExcluding(e.x, e.y, 120, enemies, [e]); if (n1) { n1.takeDamage(p.damage*0.6, p.tower); eff.addHitEffect(n1.x, n1.y, 'shadow'); eff.addChainEffect([{x:n1.x,y:n1.y}], e.x, e.y); const n2 = findNearestEnemyExcluding(n1.x, n1.y, 120, enemies, [e, n1]); if (n2) { n2.takeDamage(p.damage*0.3, p.tower); eff.addHitEffect(n2.x, n2.y, 'shadow'); eff.addChainEffect([{x:n2.x,y:n2.y}], n1.x, n1.y); } } }
        if (e.dead) {
          p.tower.kills++; eco.addGold(e.reward, e.x, e.y);
          for (let r=0;r<ss.raisesPerKill;r++) {
            const sk = createSkeleton(e.x + (Math.random()-0.5)*12, e.y + (Math.random()-0.5)*12, 5);
            enemies.push(sk);
            eff.addHitEffect(sk.x, sk.y, 'shadow');
            eff.addFloatText(sk.x, sk.y - 12, '☠ ARISE', 'float-crit');
          }
        }
      }; projectiles.push(proj);

    } else if (k === 'stormGodTower') {
      const ss = this.specialState;
      const proj = new Projectile(this.x, this.y, target, 'lightning', dmg, this);
      proj.onHit = (e, p, eff, eco) => {
        const d = e.takeDamage(p.damage, p.tower); if (d > 0) { eff.addHitEffect(e.x, e.y, 'lightning'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); }
        const hit = [e];
        for (let c = 0; c < ss.chainCount - 1; c++) { const last = hit[hit.length-1]; const next = findNearestEnemyExcluding(last.x, last.y, 130, enemies, hit); if (!next) break; hit.push(next); next.takeDamage(p.damage * 0.6, p.tower); eff.addHitEffect(next.x, next.y, 'lightning'); eff.addChainEffect([{x:next.x,y:next.y}], last.x, last.y); if (next.dead) { p.tower.kills++; eco.addGold(next.reward, next.x, next.y); } }
        if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); }
      }; projectiles.push(proj);

    } else {
      // Generic fallback for any unhandled keys
      const proj = new Projectile(this.x, this.y, target, 'physical', dmg, this);
      proj.onHit = (e, p, eff, eco) => { const d = e.takeDamage(p.damage, p.tower); if (d > 0) { eff.addHitEffect(e.x, e.y, 'physical'); eff.addFloatText(e.x, e.y, `-${Math.round(d)}`, 'float-damage'); } if (e.dead) { p.tower.kills++; eco.addGold(e.reward, e.x, e.y); } };
      projectiles.push(proj);
    }
  }

  render(ctx, isSelected) {
    const x = this.x, y = this.y;
    const r = 18;
    const k = this.def.key;
    const TIER_COLORS = ['#44bb44','#44aaff','#aa44ff','#ffaa22','#fffbe8'];
    const tc = TIER_COLORS[this.def.tier - 1];

    // ── World-space effects (behind tower) ──
    if (k === 'amplifier') {
      ctx.beginPath(); ctx.arc(x, y, this.range, 0, Math.PI*2);
      ctx.strokeStyle = 'rgba(220,200,255,0.12)'; ctx.lineWidth = 1; ctx.stroke();
    }
    if (k === 'blackHole' && this.specialState.active) {
      ctx.beginPath(); ctx.arc(x, y, this.specialState.pullRadius, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(40,0,80,0.3)'; ctx.fill();
      ctx.strokeStyle = 'rgba(160,80,255,0.5)'; ctx.lineWidth = 2; ctx.stroke();
    }
    if (k === 'timeWarden') {
      ctx.beginPath(); ctx.arc(x, y, this.range, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(200,180,255,0.05)'; ctx.fill();
    }
    if (k === 'gravityWell') {
      // Slow zone rings: outer=10%, mid=40%, inner=70%
      const gwTime = Date.now() / 1000;
      const ringDefs = [
        { r: 1.00, slow: 10,  color: [120, 80, 255] },
        { r: 0.60, slow: 40,  color: [160, 60, 255] },
        { r: 0.30, slow: 70,  color: [200, 40, 255] },
      ];
      for (const ring of ringDefs) {
        const pulse = 0.55 + 0.15 * Math.sin(gwTime * 1.5 + ring.r * 8);
        const [rr, gg, bb] = ring.color;
        ctx.beginPath(); ctx.arc(x, y, this.range * ring.r, 0, Math.PI*2);
        ctx.strokeStyle = `rgba(${rr},${gg},${bb},${pulse})`;
        ctx.lineWidth = ring.r === 1.00 ? 1.5 : 1;
        ctx.setLineDash(ring.r === 1.00 ? [] : [6, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        // Fill innermost ring slightly
        if (ring.r === 0.30) {
          ctx.beginPath(); ctx.arc(x, y, this.range * ring.r, 0, Math.PI*2);
          ctx.fillStyle = `rgba(${rr},${gg},${bb},0.06)`;
          ctx.fill();
        }
      }
      // Subtle radial gradient fill across whole range
      const gwGrad = ctx.createRadialGradient(x, y, 0, x, y, this.range);
      gwGrad.addColorStop(0, 'rgba(160,40,255,0.10)');
      gwGrad.addColorStop(1, 'rgba(80,20,180,0.00)');
      ctx.beginPath(); ctx.arc(x, y, this.range, 0, Math.PI*2);
      ctx.fillStyle = gwGrad; ctx.fill();
    }
    if (k === 'jester' && isSelected) {
      const ss = this.specialState;
      const mode = ss ? ss.mode || 0 : 0;
      const rng = this.range;
      const fa = this.facingAngle || 0;
      const t = Date.now() / 1000;
      // Mode colors: single=magenta, circle=cyan, line=yellow, cone=orange, full=red-pink
      const MC = ['#ff40ff','#40c0ff','#ffff40','#ff8040','#ff4080'];
      const mc = MC[mode];
      // Pulse alpha
      const pulse = 0.35 + 0.15 * Math.sin(t * 3);

      ctx.save();
      if (mode === 0) {
        // Single — small crosshair dot at range edge in facing direction
        ctx.beginPath(); ctx.arc(x, y, rng, 0, Math.PI*2);
        ctx.strokeStyle = `rgba(255,64,255,${pulse * 0.5})`; ctx.lineWidth = 1; ctx.stroke();
        // Crosshair at target point
        const tx2 = x + Math.cos(fa) * rng, ty2 = y + Math.sin(fa) * rng;
        ctx.strokeStyle = mc; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(tx2 - 6, ty2); ctx.lineTo(tx2 + 6, ty2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(tx2, ty2 - 6); ctx.lineTo(tx2, ty2 + 6); ctx.stroke();
        ctx.beginPath(); ctx.arc(tx2, ty2, 4, 0, Math.PI*2);
        ctx.strokeStyle = mc; ctx.lineWidth = 1.5; ctx.stroke();

      } else if (mode === 1) {
        // Circle — roaming circle following nearest enemy
        const cr = (ss && ss.circleR) || rng * 0.38;
        const ncx = (ss && ss.circleX != null) ? ss.circleX : x;
        const ncy = (ss && ss.circleY != null) ? ss.circleY : y;
        const grad = ctx.createRadialGradient(ncx, ncy, 0, ncx, ncy, cr);
        grad.addColorStop(0, `rgba(64,192,255,${pulse * 0.22})`);
        grad.addColorStop(1, `rgba(64,192,255,0)`);
        ctx.beginPath(); ctx.arc(ncx, ncy, cr, 0, Math.PI*2);
        ctx.fillStyle = grad; ctx.fill();
        ctx.strokeStyle = `rgba(64,192,255,${pulse})`; ctx.lineWidth = 1.5; ctx.stroke();
        // Outer range ring dim
        ctx.beginPath(); ctx.arc(x, y, rng, 0, Math.PI*2);
        ctx.strokeStyle = `rgba(64,192,255,${pulse * 0.3})`; ctx.lineWidth = 1; ctx.stroke();

      } else if (mode === 2) {
        // Line — ray from tower through facing angle
        const cos = Math.cos(fa), sin = Math.sin(fa);
        const grad2 = ctx.createLinearGradient(x, y, x + cos*rng, y + sin*rng);
        grad2.addColorStop(0, `rgba(255,255,64,${pulse})`);
        grad2.addColorStop(1, `rgba(255,255,64,0)`);
        ctx.strokeStyle = grad2; ctx.lineWidth = 3;
        ctx.setLineDash([8, 4]);
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + cos*rng, y + sin*rng); ctx.stroke();
        ctx.setLineDash([]);
        // Width indicator lines (28px either side)
        ctx.strokeStyle = `rgba(255,255,64,${pulse * 0.35})`; ctx.lineWidth = 1;
        const px = -sin * 28, py = cos * 28;
        ctx.beginPath(); ctx.moveTo(x + px, y + py); ctx.lineTo(x + cos*rng + px, y + sin*rng + py); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x - px, y - py); ctx.lineTo(x + cos*rng - px, y + sin*rng - py); ctx.stroke();
        // Outer range ring dim
        ctx.beginPath(); ctx.arc(x, y, rng, 0, Math.PI*2);
        ctx.strokeStyle = `rgba(255,255,64,${pulse * 0.2})`; ctx.lineWidth = 1; ctx.stroke();

      } else if (mode === 3) {
        // Cone — 70° arc
        const ha = 35 * Math.PI / 180;
        const cgrad = ctx.createRadialGradient(x, y, 0, x, y, rng);
        cgrad.addColorStop(0, `rgba(255,128,64,${pulse * 0.22})`);
        cgrad.addColorStop(1, `rgba(255,128,64,0)`);
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.arc(x, y, rng, fa - ha, fa + ha); ctx.closePath();
        ctx.fillStyle = cgrad; ctx.fill();
        ctx.strokeStyle = `rgba(255,128,64,${pulse})`; ctx.lineWidth = 1.5; ctx.stroke();
        // Outer range ring dim
        ctx.beginPath(); ctx.arc(x, y, rng, 0, Math.PI*2);
        ctx.strokeStyle = `rgba(255,128,64,${pulse * 0.2})`; ctx.lineWidth = 1; ctx.stroke();

      } else if (mode === 4) {
        // Full AOE — entire range filled
        const fgrad = ctx.createRadialGradient(x, y, 0, x, y, rng);
        fgrad.addColorStop(0, `rgba(255,64,128,${pulse * 0.22})`);
        fgrad.addColorStop(0.7, `rgba(255,64,128,${pulse * 0.10})`);
        fgrad.addColorStop(1, `rgba(255,64,128,0)`);
        ctx.beginPath(); ctx.arc(x, y, rng, 0, Math.PI*2);
        ctx.fillStyle = fgrad; ctx.fill();
        ctx.strokeStyle = `rgba(255,64,128,${pulse})`; ctx.lineWidth = 2; ctx.stroke();
        // Inner pulse ring
        ctx.beginPath(); ctx.arc(x, y, rng * (0.5 + 0.15 * Math.sin(t * 4)), 0, Math.PI*2);
        ctx.strokeStyle = `rgba(255,64,128,${pulse * 0.5})`; ctx.lineWidth = 1; ctx.stroke();
      }
      ctx.restore();
    }
    if (k === 'poisonAlchemist') {
      for (const puddle of this.specialState.puddles || []) {
        ctx.beginPath(); ctx.arc(puddle.x, puddle.y, puddle.r, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(80,200,40,0.18)'; ctx.fill();
        ctx.strokeStyle = 'rgba(80,200,40,0.35)'; ctx.lineWidth = 1; ctx.stroke();
      }
    }

    // ── Cone flash (fire breath, frost cone, wind blast, grapeshot) ──
    if (this.coneFlash && this.coneFlash.timer > 0) {
      const cf = this.coneFlash;
      const alpha = cf.timer / 0.35;
      const coneColors = {
        fire: `rgba(255,110,20,${alpha * 0.55})`,
        ice:  `rgba(100,210,255,${alpha * 0.5})`,
        wind: `rgba(160,200,255,${alpha * 0.4})`,
        physical: `rgba(220,180,100,${alpha * 0.45})`,
        shadow: `rgba(200,40,220,${alpha * 0.55})`,
      };
      const coneColor = coneColors[cf.color] || coneColors.physical;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x, y, cf.range, cf.angle - cf.halfAngle, cf.angle + cf.halfAngle);
      ctx.closePath();
      ctx.fillStyle = coneColor;
      ctx.fill();
      // Edge lines
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(cf.angle - cf.halfAngle) * cf.range, y + Math.sin(cf.angle - cf.halfAngle) * cf.range);
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(cf.angle + cf.halfAngle) * cf.range, y + Math.sin(cf.angle + cf.halfAngle) * cf.range);
      ctx.strokeStyle = coneColor.replace(/[\d.]+\)$/, `${alpha * 0.8})`);
      ctx.lineWidth = 1.5; ctx.stroke();
      ctx.restore();
    }

    // ── Range ring when selected ──
    if (isSelected) {
      ctx.beginPath(); ctx.arc(x, y, this.range, 0, Math.PI*2);
      ctx.strokeStyle = 'rgba(255,215,0,0.4)'; ctx.lineWidth = 1.5; ctx.stroke();
    }

    // ── AOE shape preview when selected ──
    if (isSelected) {
      const fa = this.facingAngle;
      const rng = this.range;
      ctx.save();

      if (k === 'infernoDrake') {
        // Narrow fire breath — 50° cone
        const ha = 25 * Math.PI / 180;
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.arc(x, y, rng, fa - ha, fa + ha); ctx.closePath();
        ctx.fillStyle = 'rgba(255,100,20,0.18)'; ctx.fill();
        ctx.strokeStyle = 'rgba(255,120,30,0.55)'; ctx.lineWidth = 1.5; ctx.stroke();
        // Animated inner heat shimmer
        const shimmer = 0.6 + 0.4 * Math.sin(Date.now() / 120);
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.arc(x, y, rng * shimmer, fa - ha * 0.5, fa + ha * 0.5); ctx.closePath();
        ctx.fillStyle = 'rgba(255,200,50,0.12)'; ctx.fill();

      } else if (k === 'tempestCallerTower') {
        // Wide wind blast — 120° cone with ripple lines
        const ha = 60 * Math.PI / 180;
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.arc(x, y, rng, fa - ha, fa + ha); ctx.closePath();
        ctx.fillStyle = 'rgba(140,190,255,0.12)'; ctx.fill();
        ctx.strokeStyle = 'rgba(160,210,255,0.5)'; ctx.lineWidth = 1.5; ctx.stroke();
        // Ripple arcs showing wind movement
        for (let i = 1; i <= 3; i++) {
          const t = ((Date.now() / 400 + i / 3) % 1);
          const arcR = rng * t;
          ctx.beginPath(); ctx.arc(x, y, arcR, fa - ha * 0.85, fa + ha * 0.85);
          ctx.strokeStyle = `rgba(180,220,255,${0.35 * (1 - t)})`; ctx.lineWidth = 1; ctx.stroke();
        }

      } else if (k === 'iceGolem') {
        // Frost breath — 90° cone with ice crystals
        const ha = 45 * Math.PI / 180;
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.arc(x, y, rng, fa - ha, fa + ha); ctx.closePath();
        ctx.fillStyle = 'rgba(80,200,255,0.14)'; ctx.fill();
        ctx.strokeStyle = 'rgba(120,220,255,0.55)'; ctx.lineWidth = 1.5; ctx.stroke();
        // Dashed inner arc to suggest freeze radius
        ctx.setLineDash([4, 4]); ctx.beginPath();
        ctx.arc(x, y, rng * 0.5, fa - ha, fa + ha);
        ctx.strokeStyle = 'rgba(180,240,255,0.4)'; ctx.lineWidth = 1; ctx.stroke();
        ctx.setLineDash([]);

      } else if (k === 'stoneThrower') {
        // Shotgun scatter — 80° wide cone with pellet spread lines
        const ha = 40 * Math.PI / 180;
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.arc(x, y, rng, fa - ha, fa + ha); ctx.closePath();
        ctx.fillStyle = 'rgba(200,160,90,0.14)'; ctx.fill();
        ctx.strokeStyle = 'rgba(210,175,100,0.5)'; ctx.lineWidth = 1.5; ctx.stroke();
        // Individual pellet lines spread across the cone
        for (let i = -2; i <= 2; i++) {
          const lineAngle = fa + (i / 2) * ha * 0.85;
          ctx.beginPath();
          ctx.moveTo(x + Math.cos(lineAngle) * 18, y + Math.sin(lineAngle) * 18);
          ctx.lineTo(x + Math.cos(lineAngle) * rng * 0.85, y + Math.sin(lineAngle) * rng * 0.85);
          ctx.strokeStyle = 'rgba(230,190,110,0.3)'; ctx.lineWidth = 1; ctx.stroke();
        }

      } else if (k === 'cannon') {
        // Grapeshot — very wide short cone + central cannonball line
        const ha = 55 * Math.PI / 180;
        const shortR = rng * 0.75;
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.arc(x, y, shortR, fa - ha, fa + ha); ctx.closePath();
        ctx.fillStyle = 'rgba(180,150,100,0.13)'; ctx.fill();
        ctx.strokeStyle = 'rgba(200,170,110,0.45)'; ctx.lineWidth = 1.5; ctx.stroke();
        // Central cannonball trajectory line
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(fa) * rng, y + Math.sin(fa) * rng);
        ctx.strokeStyle = 'rgba(240,200,120,0.6)'; ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]); ctx.stroke(); ctx.setLineDash([]);
        // Impact circle at end of line
        ctx.beginPath(); ctx.arc(x + Math.cos(fa) * rng, y + Math.sin(fa) * rng, 12, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(240,200,120,0.4)'; ctx.lineWidth = 1; ctx.stroke();

      } else if (k === 'spearman' || k === 'ballistae') {
        // Pierce line — sweeping line through full range
        ctx.beginPath();
        ctx.moveTo(x - Math.cos(fa) * rng * 0.15, y - Math.sin(fa) * rng * 0.15);
        ctx.lineTo(x + Math.cos(fa) * rng, y + Math.sin(fa) * rng);
        ctx.strokeStyle = 'rgba(240,220,120,0.7)'; ctx.lineWidth = 2.5;
        ctx.setLineDash([8, 4]); ctx.stroke(); ctx.setLineDash([]);
        // Arrowhead at tip
        const tipX = x + Math.cos(fa) * rng, tipY = y + Math.sin(fa) * rng;
        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(tipX - Math.cos(fa - 0.4) * 10, tipY - Math.sin(fa - 0.4) * 10);
        ctx.lineTo(tipX - Math.cos(fa + 0.4) * 10, tipY - Math.sin(fa + 0.4) * 10);
        ctx.closePath(); ctx.fillStyle = 'rgba(240,220,120,0.65)'; ctx.fill();

      } else if (k === 'lightningSage' || k === 'fallenSeraph') {
        // Chain lightning — branching lines from center
        const chainCount = k === 'lightningSage' ? 4 : 2;
        for (let i = 0; i < chainCount; i++) {
          const branchAngle = fa + (i / (chainCount - 1) - 0.5) * Math.PI * 0.9;
          ctx.beginPath(); ctx.moveTo(x, y);
          // Jagged chain segments
          let cx2 = x, cy2 = y;
          const steps = 4;
          for (let s = 1; s <= steps; s++) {
            const t = s / steps;
            const jitter = (Math.sin(Date.now() / 80 + i * 2 + s) * 12) * (1 - t);
            cx2 = x + Math.cos(branchAngle) * rng * t + Math.cos(branchAngle + Math.PI/2) * jitter;
            cy2 = y + Math.sin(branchAngle) * rng * t + Math.sin(branchAngle + Math.PI/2) * jitter;
            ctx.lineTo(cx2, cy2);
          }
          ctx.strokeStyle = 'rgba(220,220,80,0.5)'; ctx.lineWidth = 1.5; ctx.stroke();
        }

      } else if (k === 'teslaCoil' || k === 'thornGolem' || k === 'healerMonk') {
        // All-in-range — pulsing filled circle
        const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 300);
        ctx.beginPath(); ctx.arc(x, y, rng, 0, Math.PI * 2);
        const color = k === 'teslaCoil' ? `rgba(80,220,255,${0.07 + 0.06 * pulse})` :
                      k === 'thornGolem' ? `rgba(60,180,60,${0.08 + 0.06 * pulse})` :
                                           `rgba(255,240,80,${0.08 + 0.06 * pulse})`;
        ctx.fillStyle = color; ctx.fill();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = color.replace(/[\d.]+\)$/, '0.5)'); ctx.lineWidth = 1; ctx.stroke();
        ctx.setLineDash([]);

      } else if (this.def.targetType === 'aoe' && this.def.aoeRadius) {
        // Generic circle AoE — show impact circle orbiting around range ring
        const orbitAngle = fa;
        const impactX = x + Math.cos(orbitAngle) * rng * 0.75;
        const impactY = y + Math.sin(orbitAngle) * rng * 0.75;
        ctx.beginPath(); ctx.arc(impactX, impactY, this.aoeRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,215,0,0.4)'; ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
        // Line from tower to impact point
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(impactX, impactY);
        ctx.strokeStyle = 'rgba(255,215,0,0.25)'; ctx.lineWidth = 1; ctx.stroke();
      }

      ctx.restore();
    }

    // ── Glow states (only when selected or actively flashing) ──
    ctx.save();
    if (isSelected && this.ampDmgBonus > 1.0) { ctx.shadowColor = '#ffd700'; ctx.shadowBlur = 8; }
    if (this.towerStunTimer > 0) { ctx.shadowColor = '#cc44ff'; ctx.shadowBlur = 10; }
    if (this.shootFlash > 0)    { ctx.shadowColor = '#ffffff'; ctx.shadowBlur = 8 * this.shootFlash; }

    // ── Draw unique avatar ──
    _drawTowerAvatar(ctx, k, x, y, r, this.def.tier, tc, this);

    ctx.shadowBlur = 0; ctx.shadowColor = 'transparent';
    ctx.restore();

    // ── Upgrade dots ──
    if (this.upgradeLevel > 0) {
      for (let i = 0; i < this.upgradeLevel; i++) {
        ctx.beginPath();
        ctx.arc(x - 8 + i * 8, y + r + 5, 3, 0, Math.PI*2);
        ctx.fillStyle = tc; ctx.fill();
      }
    }

    // ── Drone launcher: draw drones ──
    if (k === 'droneLauncher') {
      for (const drone of this.specialState.drones || []) {
        ctx.save();
        ctx.translate(drone.x, drone.y);
        // drone body — small X-wing shape
        ctx.beginPath();
        ctx.moveTo(-5, -5); ctx.lineTo(5, 5);
        ctx.moveTo( 5, -5); ctx.lineTo(-5, 5);
        ctx.strokeStyle = '#80c0ff'; ctx.lineWidth = 2.5; ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, 2.5, 0, Math.PI*2);
        ctx.fillStyle = '#c0e0ff'; ctx.fill();
        ctx.restore();
      }
    }

    // ── Dragon Nest: draw dragons in flight ──
    if (k === 'dragonNest') {
      for (const d of this.specialState.dragons || []) {
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.angle || 0);
        // body
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(-7, 8);
        ctx.lineTo(7, 8);
        ctx.closePath();
        ctx.fillStyle = '#e04020'; ctx.fill();
        // wings
        ctx.beginPath();
        ctx.moveTo(-5, 0);
        ctx.lineTo(-16, -4);
        ctx.lineTo(-10, 8);
        ctx.closePath();
        ctx.fillStyle = '#a02010'; ctx.fill();
        ctx.beginPath();
        ctx.moveTo(5, 0);
        ctx.lineTo(16, -4);
        ctx.lineTo(10, 8);
        ctx.closePath();
        ctx.fillStyle = '#a02010'; ctx.fill();
        ctx.restore();
      }
    }

    // ── Celestial Dragon: draw dragons in flight ──
    if (k === 'celestialDragon') {
      for (const d of this.specialState.dragons || []) {
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.angle || 0);
        // holy aura glow
        const aura = ctx.createRadialGradient(0, 0, 2, 0, 0, 18);
        aura.addColorStop(0, 'rgba(220,200,255,0.5)');
        aura.addColorStop(1, 'rgba(180,150,255,0)');
        ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI*2);
        ctx.fillStyle = aura; ctx.fill();
        // body
        ctx.beginPath();
        ctx.moveTo(0, -11);
        ctx.lineTo(-6, 8);
        ctx.lineTo(6, 8);
        ctx.closePath();
        ctx.fillStyle = '#c8b8f0'; ctx.fill();
        ctx.strokeStyle = '#a090d0'; ctx.lineWidth = 1; ctx.stroke();
        // wings
        ctx.beginPath();
        ctx.moveTo(-4, 0);
        ctx.lineTo(-18, -5);
        ctx.lineTo(-11, 7);
        ctx.closePath();
        ctx.fillStyle = 'rgba(200,180,255,0.8)'; ctx.fill();
        ctx.beginPath();
        ctx.moveTo(4, 0);
        ctx.lineTo(18, -5);
        ctx.lineTo(11, 7);
        ctx.closePath();
        ctx.fillStyle = 'rgba(200,180,255,0.8)'; ctx.fill();
        ctx.restore();
      }
    }
  }
}

// ============================================================
//  PROJECTILE
// ============================================================
class Projectile {
  constructor(fromX, fromY, target, element, damage, tower) {
    this.x = fromX;
    this.y = fromY;
    this.target = target;
    this.element = element;
    this.damage = damage;
    this.tower = tower;
    this.speed = 300;
    this.done = false;
    this.aoeRadius = 0;
    this.onHit = null;
    this.onLand = null;
    this.pierceCount = 1;
    this.pierceSlow = 1.0;
    this.hitEnemies = new Set();
    this.isAoE = false;

    const PROJ_COLORS = {
      physical: '#c8c8c8', ice: '#80c0ff', fire: '#ff8040',
      lightning: '#ffff40', poison: '#80ff40', shadow: '#c040ff',
      holy: '#ffff80'
    };
    this.color = PROJ_COLORS[element] || '#fff';
  }

  update(dt, enemies, effects, economy) {
    if (this.done) return;

    // If target dead, either land on last known pos (AoE) or dissolve
    if (this.target.dead || this.target.reached) {
      if (this.onLand && this.aoeRadius > 0) {
        this.onLand(this.x, this.y, enemies, effects, economy);
      }
      this.done = true;
      return;
    }

    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const step = this.speed * dt;

    if (dist <= step + 4) {
      this.x = this.target.x;
      this.y = this.target.y;
      if (this.onLand) {
        this.onLand(this.target.x, this.target.y, enemies, effects, economy);
      } else if (this.onHit) {
        this.onHit(this.target, this, effects, economy);
      }
      this.done = true;
    } else {
      this.x += (dx / dist) * step;
      this.y += (dy / dist) * step;
    }
  }

  render(ctx) {
    if (this.done) return;
    const dx = this.target.x - this.x, dy = this.target.y - this.y;
    const angle = Math.atan2(dy, dx);
    const k = this.tower ? this.tower.def.key : '';
    const SHAPE_MAP = {
      archer:'arrow', crossbow:'arrow', scout:'arrow',
      stormArcher:'bolt', lightningSage:'bolt', teslaCoil:'bolt', thunderstrike:'bolt',
      stoneThrower:'stone', slingshot:'stone',
      cannon:'cannonball', bombPoster:'bomb',
      frostMage:'iceshard', crystalBow:'iceshard', iceGolem:'iceshard',
      fireWizard:'fireball', pyromancer:'fireball', dragonNest:'fireball', naturesWrath:'fireball',
      poisonAlchemist:'poison', plagueDoctor:'poison', acidCatapult:'poison',
      gatling:'bullet', mechanic:'bullet',
      necromancer:'shadow', shadowStalker:'shadow', shadowPriest:'shadow', bloodKnight:'shadow', voidGolem:'shadow', abyssalShrine:'shadow',
      healerMonk:'heal', spiritGuide:'heal',
      arcaneColossus:'arcane', amplifier:'arcane', mirrorMage:'arcane', celestialBeacon:'arcane',
      prismTower:'prism',
    };
    const shape = this.shape || SHAPE_MAP[k] || 'orb';
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(angle);
    switch (shape) {
      case 'arrow': {
        ctx.beginPath(); ctx.moveTo(-11,0); ctx.lineTo(5,0);
        ctx.strokeStyle='#b08840'; ctx.lineWidth=1.5; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(6,0); ctx.lineTo(11,0); ctx.lineTo(6.5,-3.5); ctx.lineTo(6.5,3.5); ctx.closePath();
        ctx.fillStyle='#d0d0b8'; ctx.fill();
        ctx.beginPath(); ctx.moveTo(-9,0); ctx.lineTo(-13,-3); ctx.moveTo(-9,0); ctx.lineTo(-13,3);
        ctx.strokeStyle='#c03030'; ctx.lineWidth=1.2; ctx.stroke();
        break;
      }
      case 'stone': {
        ctx.beginPath(); ctx.arc(0,0,5.5,0,Math.PI*2);
        const sg = ctx.createRadialGradient(-1.5,-1.5,0.5,0,0,5.5);
        sg.addColorStop(0,'#c0b090'); sg.addColorStop(0.7,'#807050'); sg.addColorStop(1,'#404030');
        ctx.fillStyle=sg; ctx.fill(); ctx.strokeStyle='rgba(200,180,100,0.4)'; ctx.lineWidth=0.8; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-2,-1); ctx.lineTo(1,2); ctx.strokeStyle='rgba(0,0,0,0.35)'; ctx.lineWidth=0.8; ctx.stroke();
        break;
      }
      case 'cannonball': {
        ctx.beginPath(); ctx.arc(0,0,7,0,Math.PI*2);
        const cg = ctx.createRadialGradient(-2.5,-2.5,0.5,0,0,7);
        cg.addColorStop(0,'#686868'); cg.addColorStop(0.5,'#282828'); cg.addColorStop(1,'#080808');
        ctx.fillStyle=cg; ctx.fill();
        ctx.beginPath(); ctx.arc(-2.5,-2.5,2,0,Math.PI*2); ctx.fillStyle='rgba(210,210,210,0.38)'; ctx.fill();
        break;
      }
      case 'fireball': {
        ctx.beginPath(); ctx.arc(0,0,6,0,Math.PI*2);
        const fg = ctx.createRadialGradient(0,0,0,0,0,6);
        fg.addColorStop(0,'#ffff80'); fg.addColorStop(0.4,'#ff8010'); fg.addColorStop(1,'#ff1800');
        ctx.fillStyle=fg; ctx.fill();
        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(-17,0);
        const tg = ctx.createLinearGradient(0,0,-17,0);
        tg.addColorStop(0,'rgba(255,100,0,0.8)'); tg.addColorStop(1,'rgba(255,100,0,0)');
        ctx.strokeStyle=tg; ctx.lineWidth=5; ctx.lineCap='round'; ctx.stroke(); ctx.lineCap='butt';
        break;
      }
      case 'iceshard': {
        ctx.beginPath(); ctx.moveTo(10,0); ctx.lineTo(2,-3.5); ctx.lineTo(-9,-1.8); ctx.lineTo(-10,0); ctx.lineTo(-9,1.8); ctx.lineTo(2,3.5); ctx.closePath();
        const ig = ctx.createLinearGradient(-10,0,10,0);
        ig.addColorStop(0,'#a0d8ff'); ig.addColorStop(0.5,'#38a0e0'); ig.addColorStop(1,'#80f0ff');
        ctx.fillStyle=ig; ctx.fill(); ctx.strokeStyle='rgba(200,240,255,0.7)'; ctx.lineWidth=0.8; ctx.stroke();
        break;
      }
      case 'bolt': {
        ctx.beginPath(); ctx.moveTo(9,0); ctx.lineTo(2,-4.5); ctx.lineTo(4,-2); ctx.lineTo(-4,-4.5); ctx.lineTo(-1.5,-1); ctx.lineTo(-9,0); ctx.lineTo(-1.5,1); ctx.lineTo(-4,4.5); ctx.lineTo(4,2); ctx.lineTo(2,4.5); ctx.closePath();
        ctx.fillStyle='#ffff30'; ctx.fill();
        break;
      }
      case 'bullet': {
        ctx.beginPath(); ctx.moveTo(7,0); ctx.quadraticCurveTo(9,-2.2,7,-2.2); ctx.lineTo(-6,-2.2); ctx.lineTo(-8,0); ctx.lineTo(-6,2.2); ctx.lineTo(7,2.2); ctx.quadraticCurveTo(9,2.2,7,0); ctx.closePath();
        const bl = ctx.createLinearGradient(-8,-2,9,2);
        bl.addColorStop(0,'#b0b0a0'); bl.addColorStop(0.5,'#808060'); bl.addColorStop(1,'#383828');
        ctx.fillStyle=bl; ctx.fill();
        ctx.beginPath(); ctx.arc(4,-0.5,1.5,0,Math.PI*2); ctx.fillStyle='rgba(220,220,200,0.5)'; ctx.fill();
        break;
      }
      case 'poison': {
        ctx.beginPath(); ctx.arc(0,0,6,0,Math.PI*2);
        const pg = ctx.createRadialGradient(-1,-1,0.5,0,0,6);
        pg.addColorStop(0,'#c0ff50'); pg.addColorStop(0.6,'#38b018'); pg.addColorStop(1,'#0e5810');
        ctx.fillStyle=pg; ctx.fill();
        ctx.beginPath(); ctx.arc(-1.8,-1.8,1.2,0,Math.PI*2); ctx.fillStyle='rgba(200,255,150,0.5)'; ctx.fill();
        break;
      }
      case 'shadow': {
        ctx.beginPath(); ctx.arc(0,0,5.5,0,Math.PI*2);
        const dg = ctx.createRadialGradient(0,0,0,0,0,5.5);
        dg.addColorStop(0,'#c080ff'); dg.addColorStop(0.5,'#5818a0'); dg.addColorStop(1,'#180828');
        ctx.fillStyle=dg; ctx.fill();
        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(-13,0);
        const wg = ctx.createLinearGradient(0,0,-13,0);
        wg.addColorStop(0,'rgba(170,70,255,0.8)'); wg.addColorStop(1,'rgba(170,70,255,0)');
        ctx.strokeStyle=wg; ctx.lineWidth=3.5; ctx.stroke();
        break;
      }
      case 'heal': {
        ctx.beginPath(); ctx.arc(0,0,5,0,Math.PI*2);
        const hg = ctx.createRadialGradient(0,0,0,0,0,5);
        hg.addColorStop(0,'#ffffff'); hg.addColorStop(0.4,'#80ffc0'); hg.addColorStop(1,'#20a050');
        ctx.fillStyle=hg; ctx.fill();
        break;
      }
      case 'arcane': {
        ctx.beginPath(); ctx.arc(0,0,5,0,Math.PI*2);
        const arcg = ctx.createRadialGradient(0,0,0,0,0,5);
        arcg.addColorStop(0,'#ffffff'); arcg.addColorStop(0.4,'#ff80ff'); arcg.addColorStop(1,'#7020c0');
        ctx.fillStyle=arcg; ctx.fill();
        break;
      }
      case 'prism': {
        const hue = (Date.now()/10)%360;
        ctx.beginPath(); ctx.arc(0,0,5,0,Math.PI*2);
        const prg = ctx.createRadialGradient(0,0,0,0,0,5);
        prg.addColorStop(0,'#ffffff'); prg.addColorStop(0.5,`hsl(${hue},100%,65%)`); prg.addColorStop(1,`hsl(${(hue+120)%360},100%,45%)`);
        ctx.fillStyle=prg; ctx.fill();
        break;
      }
      case 'bomb': {
        ctx.beginPath(); ctx.arc(0,0,7,0,Math.PI*2); ctx.fillStyle='#1a1a1a'; ctx.fill();
        ctx.strokeStyle='#383838'; ctx.lineWidth=1; ctx.stroke();
        ctx.beginPath(); ctx.arc(-2.5,-2.5,2.5,0,Math.PI*2); ctx.fillStyle='rgba(200,200,200,0.2)'; ctx.fill();
        ctx.beginPath(); ctx.moveTo(2,-7); ctx.lineTo(4,-11); ctx.strokeStyle='#ff7010'; ctx.lineWidth=1.5; ctx.stroke();
        ctx.beginPath(); ctx.arc(4,-11,2.2,0,Math.PI*2); ctx.fillStyle='#ffee20'; ctx.fill();
        break;
      }
      default: {
        ctx.beginPath(); ctx.arc(0,0,4.5,0,Math.PI*2); ctx.fillStyle=this.color||'#ffffff'; ctx.fill();
        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(-11,0);
        const otg = ctx.createLinearGradient(0,0,-11,0);
        otg.addColorStop(0,(this.color||'#ffffff')+'aa'); otg.addColorStop(1,(this.color||'#ffffff')+'00');
        ctx.strokeStyle=otg; ctx.lineWidth=2.5; ctx.stroke();
        break;
      }
    }
    ctx.restore();
  }
}

// Linear pierce projectile (Spearman)
class PierceProjectile {
  constructor(fromX, fromY, angle, damage, range, tower) {
    this.x = fromX;
    this.y = fromY;
    this.vx = Math.cos(angle);
    this.vy = Math.sin(angle);
    this.damage = damage;
    this.range = range;
    this.tower = tower;
    this.speed = 350;
    this.pierceMax = 1;
    this.pierceCount = 0;
    this.hitEnemies = new Set();
    this.traveled = 0;
    this.done = false;
    this.onHit = null;
    this.slowPct = 0.8;
    this.stunArmored = false;
    this.color = '#e0c060';
  }

  update(dt, enemies, effects, economy) {
    if (this.done) return;
    const step = this.speed * dt;
    this.x += this.vx * step;
    this.y += this.vy * step;
    this.traveled += step;

    for (const e of enemies) {
      if (!e.dead && !e.reached && !this.hitEnemies.has(e.id)) {
        const dx = e.x - this.x, dy = e.y - this.y;
        if (dx*dx + dy*dy <= (e.size + 5) * (e.size + 5)) {
          this.hitEnemies.add(e.id);
          if (this.onHit) this.onHit(e, this, effects, economy);
          this.pierceCount++;
          if (this.pierceCount >= this.pierceMax) { this.done = true; return; }
        }
      }
    }

    if (this.traveled >= this.range || this.x < 0 || this.x > COLS * CELL || this.y < 0 || this.y > ROWS * CELL) {
      this.done = true;
    }
  }

  render(ctx) {
    if (this.done) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.atan2(this.vy, this.vx));
    const k = this.tower ? this.tower.def.key : '';
    if (k === 'spearman' || k === 'militiaPike') {
      // Wooden spear shaft + metal head
      ctx.beginPath(); ctx.moveTo(-15,0); ctx.lineTo(9,0);
      ctx.strokeStyle='#c0a050'; ctx.lineWidth=3; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(9,0); ctx.lineTo(4,-5); ctx.lineTo(18,0); ctx.lineTo(4,5); ctx.closePath();
      ctx.fillStyle='#d0d0c0'; ctx.strokeStyle='#a0a090'; ctx.lineWidth=0.8; ctx.fill(); ctx.stroke();
    } else if (k === 'ballistae') {
      // Heavy crossbow bolt
      ctx.beginPath(); ctx.moveTo(-17,0); ctx.lineTo(10,0);
      ctx.strokeStyle='#a08840'; ctx.lineWidth=2.5; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(10,0); ctx.lineTo(5,-4); ctx.lineTo(17,0); ctx.lineTo(5,4); ctx.closePath();
      ctx.fillStyle='#d0d0b0'; ctx.fill();
      ctx.beginPath(); ctx.moveTo(-14,0); ctx.lineTo(-18,-4); ctx.moveTo(-14,0); ctx.lineTo(-18,4);
      ctx.strokeStyle='#c04040'; ctx.lineWidth=1.5; ctx.stroke();
    } else if (k === 'prismTower') {
      // Rainbow energy beam
      const hue = (Date.now()/8)%360;
      ctx.beginPath(); ctx.moveTo(-15,0); ctx.lineTo(15,0);
      const prg = ctx.createLinearGradient(-15,0,15,0);
      prg.addColorStop(0,`hsl(${hue},100%,65%)`); prg.addColorStop(1,`hsl(${(hue+180)%360},100%,65%)`);
      ctx.strokeStyle=prg; ctx.lineWidth=4; ctx.stroke();
    } else {
      // Generic bolt
      ctx.beginPath(); ctx.moveTo(-13,0); ctx.lineTo(13,0);
      ctx.strokeStyle=this.color||'#e0c060'; ctx.lineWidth=3; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(13,0); ctx.lineTo(8,-3); ctx.lineTo(15,0); ctx.lineTo(8,3); ctx.closePath();
      ctx.fillStyle=this.color||'#e0c060'; ctx.fill();
    }
    ctx.restore();
  }
}

// ============================================================
//  Helper targeting functions
// ============================================================
function findFurthestEnemy(fromX, fromY, range, enemies, excluding) {
  let best = null, bestDist = -1;
  for (const e of enemies) {
    if (e.dead || e.reached) continue;
    if (e.isInvisible && !e.isRevealed) continue;
    if (e.isSkeleton) continue;
    if (excluding && excluding.includes(e)) continue;
    const dx = e.x - fromX, dy = e.y - fromY;
    if (dx*dx + dy*dy <= range * range) {
      if (e.distanceTraveled > bestDist) {
        bestDist = e.distanceTraveled;
        best = e;
      }
    }
  }
  return best;
}

function findNearestEnemy(fromX, fromY, enemies) {
  let best = null, bestDist = Infinity;
  for (const e of enemies) {
    if (e.dead || e.reached || e.isSkeleton) continue;
    if (e.isInvisible && !e.isRevealed) continue;
    const dx = e.x - fromX, dy = e.y - fromY;
    const d2 = dx*dx + dy*dy;
    if (d2 < bestDist) { bestDist = d2; best = e; }
  }
  return best;
}

function findNearestEnemyExcluding(fromX, fromY, range, enemies, excluding) {
  let best = null, bestDist = Infinity;
  for (const e of enemies) {
    if (e.dead || e.reached || e.isSkeleton) continue;
    if (e.isInvisible && !e.isRevealed) continue;
    if (excluding.includes(e)) continue;
    const dx = e.x - fromX, dy = e.y - fromY;
    const d2 = dx*dx + dy*dy;
    if (d2 <= range * range && d2 < bestDist) { bestDist = d2; best = e; }
  }
  return best;
}

function getEnemiesInRange(fromX, fromY, range, enemies) {
  return enemies.filter(e => {
    if (e.dead || e.reached) return false;
    if (e.isInvisible && !e.isRevealed) return false;
    const dx = e.x - fromX, dy = e.y - fromY;
    return dx*dx + dy*dy <= range * range;
  });
}

function findStrongestEnemy(fromX, fromY, range, enemies) {
  let best = null, bestHp = -1;
  for (const e of enemies) {
    if (e.dead || e.reached || e.isSkeleton) continue;
    if (e.isInvisible && !e.isRevealed) continue;
    const dx = e.x - fromX, dy = e.y - fromY;
    if (dx*dx + dy*dy <= range * range && e.hp > bestHp) {
      bestHp = e.hp; best = e;
    }
  }
  return best;
}

// ============================================================
//  _drawTowerAvatar — unique pseudo-3D tower visuals
//  Each tower is circle-based but with gradients + unique icons
// ============================================================
function _sphere(ctx, x, y, r, colorMid, colorDark) {
  const g = ctx.createRadialGradient(x - r*0.32, y - r*0.38, r*0.08, x, y, r);
  g.addColorStop(0,   lighten(colorMid, 0.55));
  g.addColorStop(0.45, colorMid);
  g.addColorStop(1,   colorDark);
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2);
  ctx.fillStyle = g; ctx.fill();
}

function lighten(hex, amt) {
  let n = parseInt(hex.replace('#',''), 16);
  let r = Math.min(255, ((n>>16)&0xff) + Math.round(amt*255));
  let g = Math.min(255, ((n>>8)&0xff)  + Math.round(amt*180));
  let b = Math.min(255, (n&0xff)        + Math.round(amt*180));
  return `rgb(${r},${g},${b})`;
}

function _tierRing(ctx, x, y, r, tc, tier) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2);
  ctx.strokeStyle = tier === 5 ? '#fffbe8' : tc;
  ctx.lineWidth = tier === 5 ? 4 : tier === 4 ? 3.5 : tier === 3 ? 2.5 : 2;
  ctx.stroke();
  if (tier === 5) {
    // Second glow ring for divine
    ctx.beginPath(); ctx.arc(x, y, r + 3, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(255,248,180,0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function _icon(ctx, x, y, text, size, color) {
  ctx.font = `bold ${size}px Arial`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = color || 'rgba(255,255,255,0.9)';
  ctx.fillText(text, x, y);
}

function _drawTowerAvatar(ctx, key, x, y, r, tier, tc, tower) {
  // ground shadow
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(x, y + r*0.82, r*0.62, r*0.18, 0, 0, Math.PI*2);
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(x, y);

  switch (key) {

    /* ── TIER 1 WARRIORS ── */

    case 'archer': {
      // legs
      ctx.fillStyle='#3a2810'; ctx.fillRect(-r*.2,r*.22,r*.16,r*.5); ctx.fillRect(r*.04,r*.22,r*.16,r*.5);
      // green body
      ctx.beginPath(); ctx.moveTo(-r*.3,r*.24); ctx.lineTo(-r*.34,-r*.16); ctx.lineTo(r*.34,-r*.16); ctx.lineTo(r*.3,r*.24); ctx.closePath();
      ctx.fillStyle='#4a8030'; ctx.fill();
      // head
      ctx.beginPath(); ctx.arc(0,-r*.38,r*.24,0,Math.PI*2); ctx.fillStyle='#c8a070'; ctx.fill();
      // green hood over head
      ctx.beginPath(); ctx.moveTo(-r*.3,-r*.28); ctx.lineTo(0,-r*.72); ctx.lineTo(r*.3,-r*.28); ctx.closePath();
      ctx.fillStyle='#2e5a20'; ctx.fill();
      ctx.beginPath(); ctx.arc(0,-r*.38,r*.24,Math.PI,Math.PI*2); ctx.fillStyle='#2e5a20'; ctx.fill();
      // bow left side
      ctx.beginPath(); ctx.arc(-r*.46,-r*.05,r*.36,-Math.PI*.58,Math.PI*.58);
      ctx.strokeStyle='#a07830'; ctx.lineWidth=2.2; ctx.stroke();
      // arrow
      ctx.beginPath(); ctx.moveTo(-r*.46,-r*.05); ctx.lineTo(r*.22,-r*.05);
      ctx.strokeStyle='#d0b840'; ctx.lineWidth=1.4; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(r*.22,-r*.05); ctx.lineTo(r*.1,-r*.15); ctx.lineTo(r*.1,r*.05); ctx.closePath();
      ctx.fillStyle='#d0d0d0'; ctx.fill();
      // quiver
      ctx.fillStyle='#7a5030'; ctx.fillRect(r*.22,-r*.16,r*.11,r*.26);
      ctx.beginPath(); ctx.moveTo(r*.26,-r*.16); ctx.lineTo(r*.26,-r*.36); ctx.moveTo(r*.3,-r*.16); ctx.lineTo(r*.3,-r*.4);
      ctx.strokeStyle='#c8c060'; ctx.lineWidth=1.2; ctx.stroke();
      break;
    }

    case 'stoneThrower': {
      // wide legs
      ctx.fillStyle='#604030'; ctx.fillRect(-r*.25,r*.2,r*.22,r*.56); ctx.fillRect(r*.03,r*.2,r*.22,r*.56);
      // big wide body
      ctx.beginPath(); ctx.moveTo(-r*.4,r*.22); ctx.lineTo(-r*.44,-r*.2); ctx.lineTo(r*.44,-r*.2); ctx.lineTo(r*.4,r*.22); ctx.closePath();
      ctx.fillStyle='#806040'; ctx.fill();
      // big head
      ctx.beginPath(); ctx.arc(0,-r*.42,r*.3,0,Math.PI*2); ctx.fillStyle='#a07850'; ctx.fill();
      // eyes
      ctx.fillStyle='#201008'; ctx.beginPath(); ctx.arc(-r*.1,-r*.44,r*.06,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(r*.1,-r*.44,r*.06,0,Math.PI*2); ctx.fill();
      // arm raising rock
      ctx.beginPath(); ctx.moveTo(r*.32,-r*.12); ctx.lineTo(r*.2,-r*.78);
      ctx.strokeStyle='#906850'; ctx.lineWidth=r*.17; ctx.lineCap='round'; ctx.stroke();
      // rock
      ctx.beginPath(); ctx.arc(r*.12,-r*.9,r*.27,0,Math.PI*2);
      const rg=ctx.createRadialGradient(r*.05,-r*.96,r*.03,r*.12,-r*.9,r*.27);
      rg.addColorStop(0,'#c0b090'); rg.addColorStop(1,'#504030');
      ctx.fillStyle=rg; ctx.fill(); ctx.strokeStyle='rgba(150,130,90,0.5)'; ctx.lineWidth=1; ctx.stroke();
      break;
    }

    case 'spearman': {
      // armored legs
      ctx.fillStyle='#607090'; ctx.fillRect(-r*.22,r*.2,r*.18,r*.56); ctx.fillRect(r*.04,r*.2,r*.18,r*.56);
      // breastplate
      ctx.beginPath(); ctx.moveTo(-r*.3,r*.22); ctx.lineTo(-r*.34,-r*.18); ctx.lineTo(r*.34,-r*.18); ctx.lineTo(r*.3,r*.22); ctx.closePath();
      ctx.fillStyle='#8090b0'; ctx.fill(); ctx.strokeStyle='rgba(160,180,220,0.5)'; ctx.lineWidth=1; ctx.stroke();
      // helmet
      ctx.beginPath(); ctx.arc(0,-r*.42,r*.26,0,Math.PI*2); ctx.fillStyle='#7080a0'; ctx.fill();
      ctx.beginPath(); ctx.moveTo(-r*.3,-r*.3); ctx.lineTo(r*.3,-r*.3); ctx.strokeStyle='rgba(180,200,240,0.6)'; ctx.lineWidth=2; ctx.stroke();
      // spear diagonal
      ctx.beginPath(); ctx.moveTo(r*.28,r*.6); ctx.lineTo(-r*.1,-r*.88);
      ctx.strokeStyle='#a08840'; ctx.lineWidth=2; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-r*.1,-r*.88); ctx.lineTo(-r*.22,-r*.66); ctx.lineTo(r*.02,-r*.66); ctx.closePath();
      ctx.fillStyle='#d0d0e0'; ctx.fill();
      break;
    }

    case 'scout': {
      // watchtower structure
      ctx.fillStyle='#6a5030'; ctx.fillRect(-r*.32,r*.08,r*.64,r*.76);
      ctx.fillStyle='#7a6040'; ctx.fillRect(-r*.38,-r*.08,r*.76,r*.2);
      // battlements
      ctx.fillStyle='#8a7050';
      for (const bx of [-r*.3,-r*.1,r*.1,r*.3]) ctx.fillRect(bx,-r*.24,r*.14,r*.18);
      // person peeking out
      ctx.beginPath(); ctx.arc(0,-r*.28,r*.2,0,Math.PI*2); ctx.fillStyle='#c8a070'; ctx.fill();
      // spyglass
      ctx.beginPath(); ctx.moveTo(r*.18,-r*.28); ctx.lineTo(r*.6,-r*.22);
      ctx.strokeStyle='#a08040'; ctx.lineWidth=r*.1; ctx.lineCap='round'; ctx.stroke();
      ctx.beginPath(); ctx.arc(r*.62,-r*.22,r*.08,0,Math.PI*2); ctx.fillStyle='rgba(60,80,120,0.7)'; ctx.fill();
      break;
    }

    case 'cannon': {
      // wheels
      for (const wx of [-r*.36,r*.36]) {
        ctx.beginPath(); ctx.arc(wx,r*.58,r*.22,0,Math.PI*2); ctx.fillStyle='#4a3010'; ctx.fill();
        ctx.strokeStyle='#705020'; ctx.lineWidth=2; ctx.stroke();
        for (let sp=0;sp<4;sp++) {
          const sa=(Math.PI/4)*sp*2;
          ctx.beginPath(); ctx.moveTo(wx+Math.cos(sa)*r*.22,r*.58+Math.sin(sa)*r*.22); ctx.lineTo(wx+Math.cos(sa+Math.PI)*r*.22,r*.58+Math.sin(sa+Math.PI)*r*.22);
          ctx.strokeStyle='#604020'; ctx.lineWidth=1; ctx.stroke();
        }
      }
      // barrel horizontal
      ctx.beginPath(); ctx.moveTo(-r*.38,r*.1); ctx.lineTo(-r*.38,r*.44); ctx.lineTo(r*.24,r*.32); ctx.lineTo(r*.24,r*.12); ctx.closePath();
      const cg=ctx.createLinearGradient(-r*.38,0,r*.24,0);
      cg.addColorStop(0,'#604020'); cg.addColorStop(.5,'#a08040'); cg.addColorStop(1,'#604020');
      ctx.fillStyle=cg; ctx.fill(); ctx.strokeStyle='#503010'; ctx.lineWidth=1.2; ctx.stroke();
      // barrel end circle
      ctx.beginPath(); ctx.arc(r*.24,r*.22,r*.14,0,Math.PI*2); ctx.fillStyle='#806030'; ctx.fill();
      ctx.strokeStyle='#503010'; ctx.lineWidth=1.5; ctx.stroke();
      ctx.beginPath(); ctx.arc(r*.24,r*.22,r*.08,0,Math.PI*2); ctx.fillStyle='rgba(15,8,2,0.9)'; ctx.fill();
      if(tower.shootFlash>0){ctx.beginPath();ctx.arc(r*.4,r*.22,r*.14*tower.shootFlash,0,Math.PI*2);ctx.fillStyle=`rgba(200,200,180,${tower.shootFlash*.6})`;ctx.fill();}
      break;
    }

    case 'crossbow': {
      ctx.fillStyle='#505060'; ctx.fillRect(-r*.22,r*.2,r*.18,r*.56); ctx.fillRect(r*.04,r*.2,r*.18,r*.56);
      ctx.beginPath(); ctx.moveTo(-r*.3,r*.22); ctx.lineTo(-r*.34,-r*.18); ctx.lineTo(r*.34,-r*.18); ctx.lineTo(r*.3,r*.22); ctx.closePath();
      ctx.fillStyle='#707080'; ctx.fill();
      ctx.beginPath(); ctx.arc(0,-r*.42,r*.26,0,Math.PI*2); ctx.fillStyle='#606070'; ctx.fill();
      // pointed helm
      ctx.beginPath(); ctx.moveTo(-r*.24,-r*.38); ctx.lineTo(0,-r*.76); ctx.lineTo(r*.24,-r*.38); ctx.fillStyle='#505060'; ctx.fill();
      // crossbow held forward
      ctx.fillStyle='#806040'; ctx.fillRect(-r*.44,-r*.06,r*.88,r*.12);
      ctx.beginPath(); ctx.arc(r*.42,-r*.0,r*.32,-Math.PI*.5,Math.PI*.5); ctx.strokeStyle='#a07830'; ctx.lineWidth=2.2; ctx.stroke();
      ctx.beginPath(); ctx.arc(r*.42,0,r*.32,Math.PI*.5,-Math.PI*.5); ctx.strokeStyle='#a07830'; ctx.lineWidth=2.2; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-r*.44,0); ctx.lineTo(r*.44,0); ctx.strokeStyle='#d0c080'; ctx.lineWidth=1.4; ctx.stroke();
      break;
    }

    case 'slingshot': {
      ctx.fillStyle='#7a6040'; ctx.fillRect(-r*.17,r*.24,r*.14,r*.48); ctx.fillRect(r*.03,r*.24,r*.14,r*.48);
      ctx.beginPath(); ctx.moveTo(-r*.25,r*.26); ctx.lineTo(-r*.28,-r*.1); ctx.lineTo(r*.28,-r*.1); ctx.lineTo(r*.25,r*.26); ctx.closePath();
      ctx.fillStyle='#c8a060'; ctx.fill();
      ctx.beginPath(); ctx.arc(0,-r*.34,r*.22,0,Math.PI*2); ctx.fillStyle='#e0b880'; ctx.fill();
      // Y slingshot
      ctx.beginPath(); ctx.moveTo(r*.28,-r*.08); ctx.lineTo(-r*.22,-r*.6); ctx.strokeStyle='#8a5820'; ctx.lineWidth=3; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(r*.28,-r*.08); ctx.lineTo(r*.5,-r*.6); ctx.strokeStyle='#8a5820'; ctx.lineWidth=3; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-r*.22,-r*.6); ctx.quadraticCurveTo(r*.14,-r*.2,r*.5,-r*.6); ctx.strokeStyle='#c03020'; ctx.lineWidth=1.8; ctx.stroke();
      ctx.beginPath(); ctx.arc(r*.14,-r*.38,r*.1,0,Math.PI*2); ctx.fillStyle='#a09080'; ctx.fill();
      break;
    }

    case 'militiaPike': {
      ctx.fillStyle='#7a4020'; ctx.fillRect(-r*.22,r*.2,r*.18,r*.56); ctx.fillRect(r*.04,r*.2,r*.18,r*.56);
      ctx.beginPath(); ctx.moveTo(-r*.3,r*.22); ctx.lineTo(-r*.34,-r*.18); ctx.lineTo(r*.34,-r*.18); ctx.lineTo(r*.3,r*.22); ctx.closePath();
      ctx.fillStyle='#904828'; ctx.fill();
      ctx.beginPath(); ctx.arc(0,-r*.42,r*.26,0,Math.PI*2); ctx.fillStyle='#a07050'; ctx.fill();
      // rusty helmet dome
      ctx.beginPath(); ctx.arc(0,-r*.42,r*.26,Math.PI,Math.PI*2); ctx.fillStyle='#805020'; ctx.fill();
      // pike pole vertical right side
      ctx.beginPath(); ctx.moveTo(r*.38,r*.7); ctx.lineTo(r*.32,-r*.9); ctx.strokeStyle='#a08030'; ctx.lineWidth=2.2; ctx.stroke();
      // halberd blade
      ctx.beginPath(); ctx.moveTo(r*.32,-r*.9); ctx.lineTo(r*.6,-r*.7); ctx.lineTo(r*.48,-r*.46); ctx.closePath();
      ctx.fillStyle='#c0c0c8'; ctx.fill(); ctx.strokeStyle='#909098'; ctx.lineWidth=1; ctx.stroke();
      break;
    }

    case 'oilThrower': {
      ctx.fillStyle='#303040'; ctx.fillRect(-r*.22,r*.2,r*.18,r*.56); ctx.fillRect(r*.04,r*.2,r*.18,r*.56);
      ctx.beginPath(); ctx.moveTo(-r*.34,r*.22); ctx.lineTo(-r*.36,-r*.14); ctx.lineTo(r*.36,-r*.14); ctx.lineTo(r*.34,r*.22); ctx.closePath();
      ctx.fillStyle='#404050'; ctx.fill();
      ctx.beginPath(); ctx.arc(0,-r*.38,r*.26,0,Math.PI*2); ctx.fillStyle='#c0a070'; ctx.fill();
      // big pot
      ctx.beginPath(); ctx.moveTo(-r*.18,-r*.16); ctx.bezierCurveTo(-r*.46,r*.06,-r*.46,r*.52,0,r*.56); ctx.bezierCurveTo(r*.46,r*.52,r*.46,r*.06,r*.18,-r*.16); ctx.closePath();
      ctx.fillStyle='#a06830'; ctx.fill(); ctx.strokeStyle='#c08040'; ctx.lineWidth=1; ctx.stroke();
      // flame from pot spout
      ctx.beginPath(); ctx.moveTo(r*.14,-r*.14); ctx.bezierCurveTo(r*.36,-r*.3,r*.28,-r*.58,r*.14,-r*.54); ctx.bezierCurveTo(r*.0,-r*.5,r*.08,-r*.28,-r*.0,-r*.14); ctx.closePath();
      ctx.fillStyle='rgba(255,140,0,0.9)'; ctx.fill();
      ctx.beginPath(); ctx.moveTo(r*.1,-r*.2); ctx.bezierCurveTo(r*.26,-r*.34,r*.2,-r*.54,r*.1,-r*.5); ctx.bezierCurveTo(r*.0,-r*.46,r*.04,-r*.3,0,-r*.2); ctx.closePath();
      ctx.fillStyle='rgba(255,230,80,0.9)'; ctx.fill();
      break;
    }

    case 'ballistae': {
      // wooden H-frame
      ctx.fillStyle='#7a5828'; ctx.fillRect(-r*.44,r*.12,r*.1,r*.64); ctx.fillRect(r*.34,r*.12,r*.1,r*.64);
      ctx.fillRect(-r*.44,r*.3,r*.88,r*.12); // crossbar
      // bow limbs
      ctx.beginPath(); ctx.arc(-r*.44,r*.3,r*.5,-Math.PI*.7,0); ctx.strokeStyle='#a07830'; ctx.lineWidth=3.5; ctx.stroke();
      ctx.beginPath(); ctx.arc(-r*.44,r*.3,r*.5,0,Math.PI*.7); ctx.strokeStyle='#a07830'; ctx.lineWidth=3.5; ctx.stroke();
      // string
      ctx.beginPath(); ctx.moveTo(-r*.44+r*.5*Math.cos(-Math.PI*.7),r*.3+r*.5*Math.sin(-Math.PI*.7));
      ctx.lineTo(-r*.1,r*.3); ctx.lineTo(-r*.44+r*.5*Math.cos(Math.PI*.7),r*.3+r*.5*Math.sin(Math.PI*.7));
      ctx.strokeStyle='#d0c080'; ctx.lineWidth=1.2; ctx.stroke();
      // large bolt
      ctx.fillStyle='#c8b870'; ctx.fillRect(-r*.52,r*.26,r*.88,r*.08);
      ctx.beginPath(); ctx.moveTo(r*.36,r*.3); ctx.lineTo(r*.5,r*.22); ctx.lineTo(r*.5,r*.38); ctx.closePath();
      ctx.fillStyle='#d0d0e0'; ctx.fill();
      break;
    }

    case 'bombPoster': {
      ctx.fillStyle='#1a1a22'; ctx.fillRect(-r*.22,r*.2,r*.18,r*.56); ctx.fillRect(r*.04,r*.2,r*.18,r*.56);
      ctx.beginPath(); ctx.moveTo(-r*.3,r*.22); ctx.lineTo(-r*.34,-r*.18); ctx.lineTo(r*.34,-r*.18); ctx.lineTo(r*.3,r*.22); ctx.closePath();
      ctx.fillStyle='#2a2a32'; ctx.fill();
      ctx.beginPath(); ctx.arc(0,-r*.38,r*.26,0,Math.PI*2); ctx.fillStyle='#c0a060'; ctx.fill();
      // dark cap
      ctx.beginPath(); ctx.arc(0,-r*.38,r*.26,Math.PI,Math.PI*2); ctx.fillStyle='#181820'; ctx.fill();
      // bomb raised in hand
      ctx.beginPath(); ctx.arc(r*.28,-r*.26,r*.26,0,Math.PI*2); ctx.fillStyle='#1a1a1a'; ctx.fill(); ctx.strokeStyle='#444'; ctx.lineWidth=1; ctx.stroke();
      ctx.beginPath(); ctx.arc(r*.18,-r*.28,r*.08,0,Math.PI*2); ctx.fillStyle='rgba(255,255,255,0.15)'; ctx.fill();
      // fuse
      ctx.beginPath(); ctx.moveTo(r*.28,-r*.5); ctx.bezierCurveTo(r*.46,-r*.64,r*.36,-r*.8,r*.18,-r*.72); ctx.strokeStyle='#c09020'; ctx.lineWidth=1.8; ctx.stroke();
      for(let i=0;i<4;i++){const sa=(Math.PI*2/4)*i;ctx.beginPath();ctx.moveTo(r*.18,-r*.72);ctx.lineTo(r*.18+Math.cos(sa)*r*.12,-r*.72+Math.sin(sa)*r*.12);ctx.strokeStyle='rgba(255,180,0,0.9)';ctx.lineWidth=1.2;ctx.stroke();}
      break;
    }

    case 'thornBush': {
      // spiky green blob
      ctx.beginPath(); ctx.arc(0,r*.1,r*.38,0,Math.PI*2); ctx.fillStyle='#1e6010'; ctx.fill();
      for(let i=0;i<10;i++){
        const a=(Math.PI*2/10)*i, len=r*(.5+Math.sin(i*2.3)*.1);
        ctx.beginPath(); ctx.moveTo(Math.cos(a)*r*.3,r*.1+Math.sin(a)*r*.3);
        ctx.lineTo(Math.cos(a+.3)*len*.55,r*.1+Math.sin(a+.3)*len*.55);
        ctx.lineTo(Math.cos(a)*len,r*.1+Math.sin(a)*len);
        ctx.lineTo(Math.cos(a-.3)*len*.55,r*.1+Math.sin(a-.3)*len*.55); ctx.closePath();
        ctx.fillStyle=i%2===0?'#2e9020':'#50b832'; ctx.fill();
      }
      // eyes
      ctx.fillStyle='#f0d020'; ctx.beginPath(); ctx.arc(-r*.14,r*.02,r*.09,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(r*.14,r*.02,r*.09,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#201800'; ctx.beginPath(); ctx.arc(-r*.14,r*.02,r*.04,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(r*.14,r*.02,r*.04,0,Math.PI*2); ctx.fill();
      break;
    }

    case 'flarePost': {
      // post
      ctx.fillStyle='#7a5828'; ctx.fillRect(-r*.09,r*.06,r*.18,r*.72);
      ctx.fillStyle='#8a6838'; ctx.fillRect(-r*.16,-r*.18,r*.32,r*.28);
      // flame
      ctx.beginPath(); ctx.moveTo(0,r*.04); ctx.bezierCurveTo(-r*.36,-r*.22,-r*.28,-r*.68,0,-r*.76); ctx.bezierCurveTo(r*.28,-r*.68,r*.36,-r*.22,0,r*.04);
      const ff=ctx.createLinearGradient(0,r*.04,0,-r*.76); ff.addColorStop(0,'rgba(255,80,0,0.9)'); ff.addColorStop(.5,'rgba(255,200,0,0.9)'); ff.addColorStop(1,'rgba(255,240,180,0.85)'); ctx.fillStyle=ff; ctx.fill();
      ctx.beginPath(); ctx.moveTo(0,-r*.06); ctx.bezierCurveTo(-r*.18,-r*.28,-r*.12,-r*.56,0,-r*.6); ctx.bezierCurveTo(r*.12,-r*.56,r*.18,-r*.28,0,-r*.06);
      ctx.fillStyle='rgba(255,240,100,0.9)'; ctx.fill();
      break;
    }

    /* ── TIER 2 MAGIC ── */

    case 'frostMage': {
      // blue robe
      ctx.beginPath(); ctx.moveTo(-r*.18,r*.72); ctx.lineTo(-r*.36,-r*.16); ctx.lineTo(r*.36,-r*.16); ctx.lineTo(r*.18,r*.72); ctx.closePath();
      ctx.fillStyle='#2060b0'; ctx.fill(); ctx.strokeStyle='rgba(140,200,255,0.4)'; ctx.lineWidth=1; ctx.stroke();
      // head
      ctx.beginPath(); ctx.arc(0,-r*.36,r*.24,0,Math.PI*2); ctx.fillStyle='#d0e8ff'; ctx.fill();
      // eyes
      ctx.fillStyle='#2040a0'; ctx.beginPath(); ctx.arc(-r*.09,-r*.38,r*.05,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(r*.09,-r*.38,r*.05,0,Math.PI*2); ctx.fill();
      // pointy ice hat
      ctx.beginPath(); ctx.moveTo(-r*.28,-r*.24); ctx.lineTo(0,-r*.82); ctx.lineTo(r*.28,-r*.24); ctx.closePath(); ctx.fillStyle='#1848a0'; ctx.fill();
      ctx.beginPath(); ctx.ellipse(0,-r*.24,r*.28,r*.1,0,0,Math.PI*2); ctx.fillStyle='#2060c0'; ctx.fill();
      // ice staff
      ctx.beginPath(); ctx.moveTo(r*.32,-r*.08); ctx.lineTo(r*.38,r*.64); ctx.strokeStyle='#80b0d0'; ctx.lineWidth=2; ctx.stroke();
      // crystal tip
      ctx.beginPath(); ctx.moveTo(r*.32,-r*.08); ctx.lineTo(r*.22,-r*.28); ctx.lineTo(r*.32,-r*.46); ctx.lineTo(r*.42,-r*.28); ctx.closePath();
      ctx.fillStyle='#a0e0ff'; ctx.fill(); ctx.strokeStyle='#c0f0ff'; ctx.lineWidth=1; ctx.stroke();
      break;
    }

    case 'fireWizard': {
      // orange robe
      ctx.beginPath(); ctx.moveTo(-r*.18,r*.72); ctx.lineTo(-r*.36,-r*.16); ctx.lineTo(r*.36,-r*.16); ctx.lineTo(r*.18,r*.72); ctx.closePath();
      ctx.fillStyle='#c84010'; ctx.fill(); ctx.strokeStyle='rgba(255,160,40,0.4)'; ctx.lineWidth=1; ctx.stroke();
      ctx.beginPath(); ctx.arc(0,-r*.36,r*.24,0,Math.PI*2); ctx.fillStyle='#e0c098'; ctx.fill();
      ctx.fillStyle='#502010'; ctx.beginPath(); ctx.arc(-r*.09,-r*.38,r*.05,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(r*.09,-r*.38,r*.05,0,Math.PI*2); ctx.fill();
      // wide wizard hat
      ctx.beginPath(); ctx.moveTo(-r*.22,-r*.22); ctx.lineTo(r*.08,-r*.82); ctx.lineTo(r*.32,-r*.22); ctx.closePath(); ctx.fillStyle='#801a08'; ctx.fill();
      ctx.beginPath(); ctx.ellipse(r*.05,-r*.22,r*.32,r*.1,0,0,Math.PI*2); ctx.fillStyle='#a02010'; ctx.fill();
      // fireball in raised hand
      ctx.beginPath(); ctx.arc(-r*.36,-r*.24,r*.2,0,Math.PI*2);
      const fbg=ctx.createRadialGradient(-r*.36,-r*.24,0,-r*.36,-r*.24,r*.2);
      fbg.addColorStop(0,'rgba(255,240,200,0.95)'); fbg.addColorStop(.5,'rgba(255,140,0,0.9)'); fbg.addColorStop(1,'rgba(180,20,0,0.7)');
      ctx.fillStyle=fbg; ctx.fill();
      break;
    }

    case 'poisonAlchemist': {
      ctx.beginPath(); ctx.moveTo(-r*.18,r*.72); ctx.lineTo(-r*.36,-r*.16); ctx.lineTo(r*.36,-r*.16); ctx.lineTo(r*.18,r*.72); ctx.closePath();
      ctx.fillStyle='#2a7820'; ctx.fill();
      ctx.beginPath(); ctx.arc(0,-r*.36,r*.24,0,Math.PI*2); ctx.fillStyle='#b0d890'; ctx.fill();
      ctx.fillStyle='#103010'; ctx.beginPath(); ctx.arc(-r*.09,-r*.38,r*.05,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(r*.09,-r*.38,r*.05,0,Math.PI*2); ctx.fill();
      // green hood
      ctx.beginPath(); ctx.arc(0,-r*.36,r*.24,Math.PI,Math.PI*2); ctx.fillStyle='#1a5a10'; ctx.fill();
      ctx.beginPath(); ctx.moveTo(-r*.28,-r*.26); ctx.lineTo(0,-r*.7); ctx.lineTo(r*.28,-r*.26); ctx.closePath(); ctx.fillStyle='#1a5a10'; ctx.fill();
      // flask
      ctx.beginPath(); ctx.moveTo(-r*.12,-r*.58); ctx.lineTo(-r*.12,-r*.22); ctx.bezierCurveTo(-r*.42,0,-r*.42,r*.48,0,r*.52); ctx.bezierCurveTo(r*.42,r*.48,r*.42,0,r*.12,-r*.22); ctx.lineTo(r*.12,-r*.58); ctx.closePath();
      const pg=ctx.createLinearGradient(0,-r*.58,0,r*.52); pg.addColorStop(0,'rgba(180,255,100,0.3)'); pg.addColorStop(.4,'rgba(80,220,40,0.85)'); pg.addColorStop(1,'rgba(20,100,10,0.9)'); ctx.fillStyle=pg; ctx.fill();
      ctx.strokeStyle='rgba(120,255,60,0.6)'; ctx.lineWidth=1.2; ctx.stroke();
      break;
    }

    case 'gatling': {
      // turret base
      ctx.beginPath(); ctx.arc(0,r*.3,r*.4,0,Math.PI*2); ctx.fillStyle='#606070'; ctx.fill(); ctx.strokeStyle='#808090'; ctx.lineWidth=1.5; ctx.stroke();
      // rotating barrels
      const gRot=(Date.now()/80)%(Math.PI*2);
      for(let i=0;i<6;i++){
        ctx.save(); ctx.rotate(gRot+(Math.PI/3)*i);
        ctx.fillStyle=i%2===0?'rgba(160,160,180,0.9)':'rgba(100,100,120,0.9)';
        ctx.fillRect(-r*.08,-r*.72,r*.16,r*.54); ctx.restore();
      }
      ctx.beginPath(); ctx.arc(0,0,r*.28,0,Math.PI*2); ctx.fillStyle='#484860'; ctx.fill();
      ctx.strokeStyle='#6a6a80'; ctx.lineWidth=1.5; ctx.stroke();
      break;
    }

    case 'goldMine': {
      // mine tunnel arch
      ctx.beginPath(); ctx.moveTo(-r*.46,r*.72); ctx.lineTo(-r*.46,-r*.02); ctx.arc(0,-r*.02,r*.46,-Math.PI,0); ctx.lineTo(r*.46,r*.72); ctx.strokeStyle='#705020'; ctx.lineWidth=3; ctx.stroke();
      ctx.fillStyle='#1a1008'; ctx.beginPath(); ctx.moveTo(-r*.38,r*.72); ctx.lineTo(-r*.38,0); ctx.arc(0,0,r*.38,-Math.PI,0); ctx.lineTo(r*.38,r*.72); ctx.closePath(); ctx.fill();
      // timber supports
      ctx.strokeStyle='#7a5018'; ctx.lineWidth=2.5;
      ctx.beginPath(); ctx.moveTo(-r*.38,r*.72); ctx.lineTo(-r*.38,0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(r*.38,r*.72); ctx.lineTo(r*.38,0); ctx.stroke();
      // gold coins
      for(const[gx,gy]of[[-r*.2,r*.48],[0,r*.44],[r*.2,r*.48]]){
        ctx.beginPath(); ctx.ellipse(gx,gy,r*.12,r*.05,0,0,Math.PI*2); ctx.fillStyle='#e8c020'; ctx.fill();
        ctx.strokeStyle='rgba(255,220,80,0.6)'; ctx.lineWidth=0.8; ctx.stroke();
        ctx.font=`bold ${Math.round(r*.18)}px Arial`; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillStyle='rgba(120,80,0,0.8)'; ctx.fillText('$',gx,gy);
      }
      break;
    }

    case 'stormArcher': {
      // silver-blue armor
      ctx.fillStyle='#506080'; ctx.fillRect(-r*.22,r*.2,r*.18,r*.56); ctx.fillRect(r*.04,r*.2,r*.18,r*.56);
      ctx.beginPath(); ctx.moveTo(-r*.32,r*.22); ctx.lineTo(-r*.36,-r*.18); ctx.lineTo(r*.36,-r*.18); ctx.lineTo(r*.32,r*.22); ctx.closePath();
      ctx.fillStyle='#6080a0'; ctx.fill();
      ctx.beginPath(); ctx.arc(0,-r*.38,r*.26,0,Math.PI*2); ctx.fillStyle='#b0c8e0'; ctx.fill();
      ctx.beginPath(); ctx.arc(0,-r*.38,r*.26,Math.PI,Math.PI*2); ctx.fillStyle='#4060a0'; ctx.fill();
      // lightning bow
      ctx.beginPath(); ctx.arc(-r*.48,-r*.05,r*.36,-Math.PI*.58,Math.PI*.58); ctx.strokeStyle='#80d0ff'; ctx.lineWidth=2.5; ctx.stroke();
      // electric arrow
      ctx.beginPath(); ctx.moveTo(-r*.48,-r*.05); ctx.lineTo(r*.22,-r*.05); ctx.strokeStyle='rgba(160,220,255,0.9)'; ctx.lineWidth=1.4; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(r*.22,-r*.05); ctx.lineTo(r*.1,-r*.16); ctx.lineTo(r*.1,r*.06); ctx.closePath(); ctx.fillStyle='#e0f0ff'; ctx.fill();
      // sparks
      for(const[sx,sy]of[[-r*.48,-r*.38],[-r*.48,r*.28]]){ctx.beginPath();ctx.arc(sx,sy,r*.08,0,Math.PI*2);ctx.fillStyle='rgba(160,230,255,0.85)';ctx.fill();}
      break;
    }

    case 'plagueDoctor': {
      // long black coat
      ctx.beginPath(); ctx.moveTo(-r*.2,r*.72); ctx.lineTo(-r*.36,-r*.16); ctx.lineTo(r*.36,-r*.16); ctx.lineTo(r*.2,r*.72); ctx.closePath();
      ctx.fillStyle='#141418'; ctx.fill(); ctx.strokeStyle='rgba(60,60,80,0.5)'; ctx.lineWidth=1; ctx.stroke();
      // mask face oval
      ctx.beginPath(); ctx.ellipse(0,-r*.32,r*.22,r*.3,0,0,Math.PI*2); ctx.fillStyle='#c8c0a0'; ctx.fill();
      // beak
      ctx.beginPath(); ctx.moveTo(-r*.12,-r*.22); ctx.lineTo(r*.12,-r*.22); ctx.lineTo(0,r*.06); ctx.closePath();
      ctx.fillStyle='#b0a880'; ctx.fill(); ctx.strokeStyle='rgba(100,100,80,0.5)'; ctx.lineWidth=0.8; ctx.stroke();
      // goggles
      for(const gx of [-r*.12,r*.12]){ctx.beginPath();ctx.arc(gx,-r*.42,r*.1,0,Math.PI*2);ctx.fillStyle='rgba(40,60,20,0.85)';ctx.fill();ctx.strokeStyle='#604010';ctx.lineWidth=1.2;ctx.stroke();}
      // wide brim hat
      ctx.fillStyle='#0a0a10'; ctx.fillRect(-r*.44,-r*.52,r*.88,r*.12);
      ctx.fillRect(-r*.26,-r*.76,r*.52,r*.28);
      // cane
      ctx.beginPath(); ctx.moveTo(r*.32,-r*.12); ctx.lineTo(r*.42,r*.72); ctx.strokeStyle='#604810'; ctx.lineWidth=2.5; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(r*.28,-r*.1); ctx.bezierCurveTo(r*.36,-r*.22,r*.5,-r*.22,r*.52,-r*.12); ctx.strokeStyle='#604810'; ctx.lineWidth=2.5; ctx.stroke();
      break;
    }

    case 'shadowStalker': {
      // dark cloak (almost no body visible)
      ctx.beginPath(); ctx.moveTo(-r*.12,r*.72); ctx.lineTo(-r*.44,-r*.2); ctx.lineTo(0,-r*.52); ctx.lineTo(r*.44,-r*.2); ctx.lineTo(r*.12,r*.72); ctx.closePath();
      ctx.fillStyle='#0a0810'; ctx.fill();
      // glowing red eyes only
      for(const ex of [-r*.1,r*.1]){ctx.beginPath();ctx.arc(ex,-r*.2,r*.07,0,Math.PI*2);ctx.fillStyle='#ff2020';ctx.fill();}
      // raised daggers crossing
      for(const flip of[-1,1]){
        ctx.save();ctx.rotate(flip*Math.PI*.25);
        ctx.beginPath();ctx.moveTo(0,-r*.76);ctx.lineTo(r*.08,-r*.32);ctx.lineTo(r*.06,r*.18);ctx.lineTo(-r*.06,r*.18);ctx.lineTo(-r*.08,-r*.32);ctx.closePath();
        const dg=ctx.createLinearGradient(0,-r*.76,0,r*.18);dg.addColorStop(0,'rgba(220,220,240,0.95)');dg.addColorStop(1,'rgba(100,80,140,0.7)');ctx.fillStyle=dg;ctx.fill();
        ctx.fillStyle='rgba(120,80,160,0.9)';ctx.fillRect(-r*.2,-r*.22,r*.4,r*.09);
        ctx.restore();
      }
      break;
    }

    case 'pyromancer': {
      // crimson robe
      ctx.beginPath(); ctx.moveTo(-r*.18,r*.72); ctx.lineTo(-r*.38,-r*.16); ctx.lineTo(r*.38,-r*.16); ctx.lineTo(r*.18,r*.72); ctx.closePath();
      ctx.fillStyle='#8a1808'; ctx.fill();
      ctx.beginPath(); ctx.arc(0,-r*.36,r*.24,0,Math.PI*2); ctx.fillStyle='#d09060'; ctx.fill();
      // pointy red hat
      ctx.beginPath(); ctx.moveTo(-r*.26,-r*.24); ctx.lineTo(0,-r*.82); ctx.lineTo(r*.26,-r*.24); ctx.closePath(); ctx.fillStyle='#6a1006'; ctx.fill();
      ctx.beginPath(); ctx.ellipse(0,-r*.24,r*.26,r*.09,0,0,Math.PI*2); ctx.fillStyle='#8a1808'; ctx.fill();
      // both hands raised with fire
      for(const[hx,hy]of[[-r*.42,-r*.18],[r*.42,-r*.18]]){
        ctx.beginPath();ctx.arc(hx,hy,r*.22,0,Math.PI*2);
        const pfg=ctx.createRadialGradient(hx,hy,0,hx,hy,r*.22);pfg.addColorStop(0,'rgba(255,240,180,0.95)');pfg.addColorStop(.5,'rgba(255,120,0,0.9)');pfg.addColorStop(1,'rgba(180,0,0,0.6)');ctx.fillStyle=pfg;ctx.fill();
      }
      break;
    }

    case 'runesmith': {
      // stocky short body
      ctx.fillStyle='#604820'; ctx.fillRect(-r*.24,r*.3,r*.2,r*.46); ctx.fillRect(r*.04,r*.3,r*.2,r*.46);
      ctx.beginPath(); ctx.moveTo(-r*.38,r*.32); ctx.lineTo(-r*.44,-r*.18); ctx.lineTo(r*.44,-r*.18); ctx.lineTo(r*.38,r*.32); ctx.closePath();
      ctx.fillStyle='#8a6020'; ctx.fill();
      // leather apron
      ctx.beginPath(); ctx.moveTo(-r*.3,r*.32); ctx.lineTo(-r*.26,r*.04); ctx.lineTo(r*.26,r*.04); ctx.lineTo(r*.3,r*.32); ctx.closePath();
      ctx.fillStyle='#6a4010'; ctx.fill();
      // head with helmet
      ctx.beginPath(); ctx.arc(0,-r*.4,r*.28,0,Math.PI*2); ctx.fillStyle='#c09060'; ctx.fill();
      ctx.beginPath(); ctx.arc(0,-r*.4,r*.28,Math.PI,Math.PI*2); ctx.fillStyle='#808020'; ctx.fill();
      ctx.beginPath(); ctx.moveTo(-r*.32,-r*.32); ctx.lineTo(r*.32,-r*.32); ctx.strokeStyle='rgba(180,180,60,0.6)'; ctx.lineWidth=2; ctx.stroke();
      // glowing rune on chest
      ctx.beginPath(); ctx.moveTo(-r*.1,r*.06); ctx.lineTo(r*.1,r*.06); ctx.moveTo(0,r*.06); ctx.lineTo(0,r*.22); ctx.moveTo(-r*.1,r*.22); ctx.lineTo(r*.1,r*.22);
      ctx.strokeStyle='rgba(180,100,255,0.9)'; ctx.lineWidth=2; ctx.stroke();
      // hammer
      ctx.beginPath(); ctx.moveTo(r*.32,-r*.04); ctx.lineTo(r*.44,r*.48); ctx.strokeStyle='#a08030'; ctx.lineWidth=2.5; ctx.stroke();
      ctx.fillStyle='#909098'; ctx.fillRect(r*.24,-r*.14,r*.28,r*.18);
      break;
    }

    case 'stoneGolem': {
      // rocky boulder body (no human form)
      for(const[bx,by,br]of[[0,r*.1,r*.44],[-r*.3,-r*.24,r*.22],[r*.3,-r*.24,r*.22],[-r*.32,r*.28,r*.2],[r*.32,r*.28,r*.2]]){
        ctx.beginPath();ctx.arc(bx,by,br,0,Math.PI*2);
        const srg=ctx.createRadialGradient(bx-br*.3,by-br*.3,br*.1,bx,by,br);
        srg.addColorStop(0,'rgba(180,170,150,0.95)');srg.addColorStop(1,'rgba(80,75,65,0.98)');
        ctx.fillStyle=srg;ctx.fill();ctx.strokeStyle='rgba(60,55,45,0.5)';ctx.lineWidth=0.8;ctx.stroke();
      }
      // glowing crack eyes
      for(const ex of[-r*.18,r*.18]){
        ctx.beginPath();ctx.ellipse(ex,-r*.16,r*.1,r*.05,0,0,Math.PI*2);ctx.fillStyle='rgba(255,140,0,0.95)';ctx.fill();
        ctx.fill();
      }
      break;
    }

    case 'crystalBow': {
      // white-ice robes
      ctx.fillStyle='#8090a0'; ctx.fillRect(-r*.2,r*.2,r*.16,r*.56); ctx.fillRect(r*.04,r*.2,r*.16,r*.56);
      ctx.beginPath(); ctx.moveTo(-r*.28,r*.22); ctx.lineTo(-r*.32,-r*.18); ctx.lineTo(r*.32,-r*.18); ctx.lineTo(r*.28,r*.22); ctx.closePath();
      ctx.fillStyle='#a0c0d8'; ctx.fill();
      ctx.beginPath(); ctx.arc(0,-r*.38,r*.24,0,Math.PI*2); ctx.fillStyle='#d8eef8'; ctx.fill();
      // pointed elf ear hints
      for(const ex of[-r*.22,r*.22]){ctx.beginPath();ctx.moveTo(ex,-r*.3);ctx.lineTo(ex+Math.sign(ex)*r*.18,-r*.22);ctx.lineTo(ex,-r*.16);ctx.fillStyle='#d8eef8';ctx.fill();}
      // crystal bow
      ctx.beginPath(); ctx.arc(-r*.46,-r*.05,r*.36,-Math.PI*.56,Math.PI*.56); ctx.strokeStyle='rgba(140,220,255,0.9)'; ctx.lineWidth=2.5; ctx.stroke();
      // ice arrow
      ctx.beginPath(); ctx.moveTo(-r*.46,-r*.05); ctx.lineTo(r*.22,-r*.05); ctx.strokeStyle='rgba(200,240,255,0.85)'; ctx.lineWidth=1.4; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(r*.22,-r*.05); ctx.lineTo(r*.1,-r*.16); ctx.lineTo(r*.1,r*.06); ctx.closePath(); ctx.fillStyle='rgba(200,245,255,0.95)'; ctx.fill();
      break;
    }

    case 'trapMaster': {
      // brown leather gear
      ctx.fillStyle='#6a4018'; ctx.fillRect(-r*.22,r*.2,r*.18,r*.56); ctx.fillRect(r*.04,r*.2,r*.18,r*.56);
      ctx.beginPath(); ctx.moveTo(-r*.32,r*.22); ctx.lineTo(-r*.36,-r*.18); ctx.lineTo(r*.36,-r*.18); ctx.lineTo(r*.32,r*.22); ctx.closePath();
      ctx.fillStyle='#8a5020'; ctx.fill();
      ctx.beginPath(); ctx.arc(0,-r*.38,r*.26,0,Math.PI*2); ctx.fillStyle='#c8a060'; ctx.fill();
      // leather hat
      ctx.beginPath(); ctx.arc(0,-r*.38,r*.26,Math.PI,Math.PI*2); ctx.fillStyle='#6a3810'; ctx.fill();
      ctx.beginPath(); ctx.ellipse(0,-r*.62,r*.32,r*.1,0,0,Math.PI*2); ctx.fillStyle='#6a3810'; ctx.fill();
      // bear trap on ground
      for(const flip of[1,-1]){
        ctx.save();ctx.scale(flip,1);
        ctx.beginPath();ctx.arc(r*.14,r*.46,r*.28,0,Math.PI);ctx.strokeStyle='#a07830';ctx.lineWidth=2.2;ctx.stroke();
        for(let t=0;t<4;t++){const ta=(Math.PI/3)*t;ctx.beginPath();ctx.moveTo(r*.14+Math.cos(ta)*r*.28,r*.46+Math.sin(ta)*r*.28);ctx.lineTo(r*.14+Math.cos(ta+Math.PI/6)*r*.38,r*.46+Math.sin(ta+Math.PI/6)*r*.38);ctx.lineTo(r*.14+Math.cos(ta+Math.PI/3)*r*.28,r*.46+Math.sin(ta+Math.PI/3)*r*.28);ctx.fillStyle='#c0a050';ctx.fill();}
        ctx.restore();
      }
      ctx.beginPath();ctx.arc(0,r*.46,r*.1,0,Math.PI*2);ctx.fillStyle='#808040';ctx.fill();
      break;
    }

    /* ── TIER 3 EPIC ── */

    case 'lightningSage': {
      ctx.beginPath(); ctx.moveTo(-r*.18,r*.72); ctx.lineTo(-r*.36,-r*.16); ctx.lineTo(r*.36,-r*.16); ctx.lineTo(r*.18,r*.72); ctx.closePath();
      ctx.fillStyle='#b8a010'; ctx.fill();
      ctx.beginPath(); ctx.arc(0,-r*.36,r*.24,0,Math.PI*2); ctx.fillStyle='#f0e8a0'; ctx.fill();
      ctx.fillStyle='#302800'; ctx.beginPath();ctx.arc(-r*.09,-r*.38,r*.05,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(r*.09,-r*.38,r*.05,0,Math.PI*2);ctx.fill();
      // tall pointy hat
      ctx.beginPath();ctx.moveTo(-r*.28,-r*.24);ctx.lineTo(0,-r*.88);ctx.lineTo(r*.28,-r*.24);ctx.closePath();ctx.fillStyle='#807000';ctx.fill();
      ctx.beginPath();ctx.ellipse(0,-r*.24,r*.28,r*.1,0,0,Math.PI*2);ctx.fillStyle='#a09010';ctx.fill();
      // lightning staff
      ctx.beginPath();ctx.moveTo(r*.32,-r*.1);ctx.lineTo(r*.38,r*.66);ctx.strokeStyle='#c0c020';ctx.lineWidth=2;ctx.stroke();
      ctx.beginPath();ctx.moveTo(r*.32,-r*.1);ctx.lineTo(r*.18,-r*.34);ctx.lineTo(r*.36,-r*.34);ctx.lineTo(r*.22,-r*.58);ctx.strokeStyle='rgba(255,255,100,0.95)';ctx.lineWidth=2;ctx.stroke();
      // floating sparks
      const lsT=Date.now()/300;
      for(let i=0;i<4;i++){const a=lsT+i*Math.PI/2;ctx.beginPath();ctx.arc(Math.cos(a)*r*.48,Math.sin(a)*r*.3,r*.05,0,Math.PI*2);ctx.fillStyle='rgba(255,255,120,0.8)';ctx.fill();}
      break;
    }

    case 'amplifier': {
      // crystal pylon — no person
      ctx.fillStyle='#404050';ctx.fillRect(-r*.14,r*.1,r*.28,r*.64);
      ctx.beginPath();ctx.moveTo(-r*.28,r*.1);ctx.lineTo(r*.28,r*.1);ctx.lineTo(r*.22,-r*.1);ctx.lineTo(-r*.22,-r*.1);ctx.closePath();ctx.fillStyle='#505065';ctx.fill();
      // crystal tip
      ctx.beginPath();ctx.moveTo(-r*.22,-r*.1);ctx.lineTo(0,-r*.78);ctx.lineTo(r*.22,-r*.1);ctx.closePath();
      const ag=ctx.createLinearGradient(0,-r*.78,0,-r*.1);ag.addColorStop(0,'rgba(240,220,255,0.95)');ag.addColorStop(1,'rgba(160,100,255,0.8)');ctx.fillStyle=ag;ctx.fill();
      ctx.strokeStyle='rgba(200,160,255,0.7)';ctx.lineWidth=1;ctx.stroke();
      // signal rings
      const aT=Date.now()/600;
      for(let i=1;i<=3;i++){ctx.beginPath();ctx.arc(0,-r*.44,r*(i*.22),(aT+(i*.5)),aT+(i*.5)+Math.PI*.7);ctx.strokeStyle=`rgba(220,180,255,${0.5-i*.1})`;ctx.lineWidth=2;ctx.stroke();}
      break;
    }

    case 'teslaCoil': {
      // metal base
      ctx.fillStyle='#606870';ctx.fillRect(-r*.32,r*.18,r*.64,r*.56);
      ctx.fillStyle='#505860';ctx.fillRect(-r*.42,r*.1,r*.84,r*.12);
      // column
      ctx.fillRect(-r*.14,-r*.44,r*.28,r*.58);
      // glowing top sphere
      ctx.beginPath();ctx.arc(0,-r*.52,r*.24,0,Math.PI*2);
      const tsg=ctx.createRadialGradient(-r*.07,-r*.58,r*.02,0,-r*.52,r*.24);tsg.addColorStop(0,'rgba(220,240,255,0.95)');tsg.addColorStop(1,'rgba(80,130,220,0.9)');ctx.fillStyle=tsg;ctx.fill();
      // arcs
      const tcT=Date.now()/150;
      for(let i=0;i<3;i++){
        const a=tcT+i*Math.PI*2/3;
        ctx.beginPath();ctx.moveTo(0,-r*.52);ctx.lineTo(Math.cos(a)*r*.62,-r*.52+Math.sin(a)*r*.62);ctx.strokeStyle=`rgba(160,210,255,${0.6+Math.sin(tcT*2+i)*0.3})`;ctx.lineWidth=1.5;ctx.stroke();
      }
      break;
    }

    case 'healerMonk': {
      // white robes
      ctx.beginPath();ctx.moveTo(-r*.18,r*.72);ctx.lineTo(-r*.34,-r*.16);ctx.lineTo(r*.34,-r*.16);ctx.lineTo(r*.18,r*.72);ctx.closePath();
      ctx.fillStyle='#e8e0c0';ctx.fill();ctx.strokeStyle='rgba(220,180,80,0.5)';ctx.lineWidth=1.5;ctx.stroke();
      // gold trim lines
      ctx.beginPath();ctx.moveTo(-r*.18,r*.72);ctx.lineTo(-r*.34,-r*.16);ctx.moveTo(r*.18,r*.72);ctx.lineTo(r*.34,-r*.16);ctx.strokeStyle='rgba(220,180,60,0.7)';ctx.lineWidth=1.5;ctx.stroke();
      ctx.beginPath();ctx.arc(0,-r*.36,r*.24,0,Math.PI*2);ctx.fillStyle='#e8d4a8';ctx.fill();
      ctx.fillStyle='#504020';ctx.beginPath();ctx.arc(-r*.09,-r*.38,r*.05,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(r*.09,-r*.38,r*.05,0,Math.PI*2);ctx.fill();
      // halo
      ctx.beginPath();ctx.arc(0,-r*.44,r*.34,0,Math.PI*2);ctx.strokeStyle='rgba(255,210,60,0.45)';ctx.lineWidth=2.5;ctx.stroke();
      // healing staff
      ctx.beginPath();ctx.moveTo(-r*.36,-r*.1);ctx.lineTo(-r*.4,r*.66);ctx.strokeStyle='#c0a040';ctx.lineWidth=2;ctx.stroke();
      ctx.beginPath();ctx.arc(-r*.36,-r*.18,r*.18,0,Math.PI*2);
      const hg=ctx.createRadialGradient(-r*.36,-r*.18,0,-r*.36,-r*.18,r*.18);hg.addColorStop(0,'rgba(180,255,160,0.95)');hg.addColorStop(1,'rgba(60,180,60,0.7)');ctx.fillStyle=hg;ctx.fill();
      break;
    }

    case 'necromancer': {
      // dark purple tattered robe
      ctx.beginPath();ctx.moveTo(-r*.2,r*.72);ctx.lineTo(-r*.42,-r*.16);ctx.lineTo(r*.42,-r*.16);ctx.lineTo(r*.2,r*.72);ctx.closePath();
      ctx.fillStyle='#2a1040';ctx.fill();ctx.strokeStyle='rgba(140,60,200,0.4)';ctx.lineWidth=1;ctx.stroke();
      // tattered robe hem
      for(let t=0;t<6;t++){const tx=-r*.2+t*r*.08,ty=r*.72-Math.sin(t*1.3)*r*.12;ctx.beginPath();ctx.arc(tx,ty,r*.06,0,Math.PI*2);ctx.fillStyle='#1a0830';ctx.fill();}
      ctx.beginPath();ctx.arc(0,-r*.36,r*.24,0,Math.PI*2);ctx.fillStyle='#c0a0e0';ctx.fill();
      // glowing purple eyes
      for(const ex of[-r*.09,r*.09]){ctx.beginPath();ctx.arc(ex,-r*.38,r*.06,0,Math.PI*2);ctx.fillStyle='#c040ff';ctx.fill();}
      // skull staff
      ctx.beginPath();ctx.moveTo(r*.32,-r*.1);ctx.lineTo(r*.38,r*.66);ctx.strokeStyle='#8060a0';ctx.lineWidth=2;ctx.stroke();
      ctx.beginPath();ctx.arc(r*.32,-r*.2,r*.16,0,Math.PI*2);ctx.fillStyle='#d0d0d0';ctx.fill();
      for(const ex of[r*.24,r*.4]){ctx.beginPath();ctx.arc(ex,-r*.24,r*.05,0,Math.PI*2);ctx.fillStyle='rgba(10,0,20,0.9)';ctx.fill();}
      break;
    }

    case 'droneLauncher': {
      // futuristic armored suit
      ctx.fillStyle='#303848';ctx.fillRect(-r*.24,r*.2,r*.2,r*.56);ctx.fillRect(r*.04,r*.2,r*.2,r*.56);
      ctx.beginPath();ctx.moveTo(-r*.34,r*.22);ctx.lineTo(-r*.38,-r*.18);ctx.lineTo(r*.38,-r*.18);ctx.lineTo(r*.34,r*.22);ctx.closePath();
      ctx.fillStyle='#404858';ctx.fill();ctx.strokeStyle='rgba(100,160,220,0.4)';ctx.lineWidth=1;ctx.stroke();
      // visor helmet
      ctx.beginPath();ctx.arc(0,-r*.38,r*.28,0,Math.PI*2);ctx.fillStyle='#303848';ctx.fill();
      ctx.beginPath();ctx.ellipse(0,-r*.36,r*.22,r*.12,0,0,Math.PI*2);ctx.fillStyle='rgba(0,180,255,0.6)';ctx.fill();ctx.strokeStyle='rgba(0,220,255,0.8)';ctx.lineWidth=1;ctx.stroke();
      // shoulder launcher
      ctx.fillStyle='#252a35';ctx.fillRect(r*.3,-r*.24,r*.36,r*.18);ctx.fillRect(r*.56,-r*.34,r*.14,r*.08);
      ctx.beginPath();ctx.arc(r*.56,-r*.28,r*.06,0,Math.PI*2);ctx.fillStyle='rgba(0,200,255,0.8)';ctx.fill();
      break;
    }

    case 'dragonNest': {
      // stone nest
      ctx.beginPath();ctx.arc(0,r*.26,r*.46,0,Math.PI*2);ctx.fillStyle='#605040';ctx.fill();ctx.strokeStyle='#807060';ctx.lineWidth=1.5;ctx.stroke();
      // nest rim stones
      for(let i=0;i<8;i++){const a=(Math.PI/4)*i;ctx.beginPath();ctx.arc(Math.cos(a)*r*.44,r*.26+Math.sin(a)*r*.2,r*.1+Math.sin(i)*r*.03,0,Math.PI*2);ctx.fillStyle='#504030';ctx.fill();}
      // dragon head emerging
      ctx.beginPath();ctx.arc(0,-r*.12,r*.32,0,Math.PI*2);ctx.fillStyle='#c84020';ctx.fill();
      // snout
      ctx.beginPath();ctx.moveTo(-r*.2,-r*.06);ctx.lineTo(r*.28,-r*.14);ctx.lineTo(r*.32,r*.04);ctx.lineTo(-r*.2,r*.1);ctx.closePath();ctx.fillStyle='#e05028';ctx.fill();
      // nostril
      ctx.beginPath();ctx.arc(r*.24,-r*.08,r*.05,0,Math.PI*2);ctx.fillStyle='#1a0808';ctx.fill();
      // eye
      ctx.beginPath();ctx.arc(-r*.06,-r*.22,r*.09,0,Math.PI*2);ctx.fillStyle='#f0e020';ctx.fill();
      ctx.beginPath();ctx.arc(-r*.06,-r*.22,r*.04,0,Math.PI*2);ctx.fillStyle='#200800';ctx.fill();
      // small wings
      ctx.beginPath();ctx.moveTo(-r*.28,-r*.06);ctx.bezierCurveTo(-r*.58,-r*.36,-r*.56,-r*.62,-r*.28,-r*.44);ctx.lineTo(-r*.22,-r*.12);ctx.closePath();ctx.fillStyle='#a03018';ctx.fill();
      break;
    }

    case 'blackHole': {
      // dark robed void entity
      ctx.beginPath();ctx.moveTo(-r*.14,r*.72);ctx.lineTo(-r*.46,-r*.18);ctx.lineTo(0,-r*.54);ctx.lineTo(r*.46,-r*.18);ctx.lineTo(r*.14,r*.72);ctx.closePath();
      ctx.fillStyle='#080410';ctx.fill();ctx.strokeStyle='rgba(100,40,180,0.5)';ctx.lineWidth=1;ctx.stroke();
      // void face (spinning vortex)
      const bhR=(Date.now()/400)%(Math.PI*2);
      ctx.save();ctx.rotate(bhR);
      for(let arm=0;arm<3;arm++){ctx.save();ctx.rotate((Math.PI*2/3)*arm);ctx.beginPath();for(let t=0;t<=1;t+=0.05){const a=t*Math.PI*1.5,rad=t*r*.38;t===0?ctx.moveTo(Math.cos(a)*rad,Math.sin(a)*rad):ctx.lineTo(Math.cos(a)*rad,Math.sin(a)*rad);}ctx.strokeStyle=`rgba(180,80,255,0.8)`;ctx.lineWidth=1.8;ctx.stroke();ctx.restore();}
      ctx.restore();
      ctx.beginPath();ctx.arc(0,0,r*.16,0,Math.PI*2);ctx.fillStyle='rgba(5,0,15,0.98)';ctx.fill();
      // tentacles
      for(let i=0;i<4;i++){const a=bhR*1.5+(Math.PI/2)*i;ctx.beginPath();ctx.moveTo(0,r*.22);ctx.bezierCurveTo(Math.cos(a)*r*.3,r*.4+Math.sin(a)*r*.2,Math.cos(a+.5)*r*.5,r*.6+Math.sin(a+.5)*r*.2,Math.cos(a+1)*r*.3,r*.72);ctx.strokeStyle='rgba(80,20,140,0.7)';ctx.lineWidth=2.5;ctx.stroke();}
      break;
    }

    case 'timeWarden': {
      // clockwork robe
      ctx.beginPath();ctx.moveTo(-r*.18,r*.72);ctx.lineTo(-r*.36,-r*.16);ctx.lineTo(r*.36,-r*.16);ctx.lineTo(r*.18,r*.72);ctx.closePath();
      ctx.fillStyle='#6050a0';ctx.fill();
      // gear pattern on robe
      const twT=Date.now()/800;
      for(const[gx,gy] of [[r*.1,r*.12],[-r*.16,r*.3],[r*.06,r*.48]]){ctx.save();ctx.translate(gx,gy);ctx.rotate(twT);ctx.beginPath();ctx.arc(0,0,r*.08,0,Math.PI*2);ctx.fillStyle='rgba(200,180,255,0.3)';ctx.fill();for(let t=0;t<8;t++){ctx.save();ctx.rotate((Math.PI/4)*t);ctx.fillStyle='rgba(180,160,240,0.3)';ctx.fillRect(-r*.03,-r*.12,r*.06,r*.05);ctx.restore();}ctx.restore();}
      // clock face as head
      ctx.beginPath();ctx.arc(0,-r*.38,r*.28,0,Math.PI*2);ctx.fillStyle='#d0c8e8';ctx.fill();ctx.strokeStyle='#8070c0';ctx.lineWidth=2;ctx.stroke();
      for(let h=0;h<12;h++){const ha=(Math.PI/6)*h-Math.PI/2;ctx.beginPath();ctx.moveTo(Math.cos(ha)*r*.22,Math.sin(ha)*r*.38+r*.22+(-r*.6));ctx.lineTo(Math.cos(ha)*r*.28,Math.sin(ha)*r*.38+r*.22+(-r*.6));ctx.strokeStyle=`rgba(80,60,140,${h%3===0?.9:.4})`;ctx.lineWidth=h%3===0?2:1;ctx.stroke();}
      const now2=Date.now()/1000;
      ctx.beginPath();ctx.moveTo(0,-r*.38);ctx.lineTo(Math.cos(now2*.5-Math.PI/2)*r*.18,Math.sin(now2*.5-Math.PI/2)*r*.18-r*.38);ctx.strokeStyle='#302060';ctx.lineWidth=2;ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,-r*.38);ctx.lineTo(Math.cos(now2*6-Math.PI/2)*r*.24,Math.sin(now2*6-Math.PI/2)*r*.24-r*.38);ctx.strokeStyle='#302060';ctx.lineWidth=1.2;ctx.stroke();
      break;
    }

    case 'arcaneColossus': {
      // huge magical construct — big wide body
      ctx.beginPath();ctx.moveTo(-r*.52,r*.72);ctx.lineTo(-r*.58,-r*.32);ctx.lineTo(r*.58,-r*.32);ctx.lineTo(r*.52,r*.72);ctx.closePath();
      const acg=ctx.createLinearGradient(-r*.58,0,r*.58,0);acg.addColorStop(0,'#3020a0');acg.addColorStop(.5,'#5040c0');acg.addColorStop(1,'#3020a0');ctx.fillStyle=acg;ctx.fill();
      ctx.strokeStyle='rgba(200,160,255,0.5)';ctx.lineWidth=1.5;ctx.stroke();
      // rune lines on body
      for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-r*.4,r*.1+i*r*.2);ctx.lineTo(r*.4,r*.1+i*r*.2);ctx.strokeStyle=`rgba(180,140,255,${0.4-i*.1})`;ctx.lineWidth=1;ctx.stroke();}
      // no head — top is flat with glowing rune
      ctx.beginPath();ctx.arc(0,-r*.38,r*.3,0,Math.PI*2);
      const ahg=ctx.createRadialGradient(0,-r*.38,0,0,-r*.38,r*.3);ahg.addColorStop(0,'rgba(255,255,255,0.9)');ahg.addColorStop(.4,'rgba(200,160,255,0.85)');ahg.addColorStop(1,'rgba(80,40,160,0.8)');ctx.fillStyle=ahg;ctx.fill();
      ctx.strokeStyle='rgba(220,180,255,0.7)';ctx.lineWidth=1.5;ctx.stroke();
      // orbiting element orbs
      const acR=(Date.now()/600)%(Math.PI*2);
      const ec=['#ff6020','#40c0ff','#ffff40','#80ff40'];
      for(let i=0;i<4;i++){const a=acR+(Math.PI/2)*i;ctx.beginPath();ctx.arc(Math.cos(a)*r*.54,Math.sin(a)*r*.28-r*.1,r*.1,0,Math.PI*2);ctx.fillStyle=ec[i]+'cc';ctx.fill();}
      break;
    }

    case 'stormCaller': {
      ctx.beginPath();ctx.moveTo(-r*.18,r*.72);ctx.lineTo(-r*.36,-r*.16);ctx.lineTo(r*.36,-r*.16);ctx.lineTo(r*.18,r*.72);ctx.closePath();
      ctx.fillStyle='#5070a0';ctx.fill();
      ctx.beginPath();ctx.arc(0,-r*.36,r*.24,0,Math.PI*2);ctx.fillStyle='#d0dae8';ctx.fill();
      ctx.fillStyle='#203050';ctx.beginPath();ctx.arc(-r*.09,-r*.38,r*.05,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(r*.09,-r*.38,r*.05,0,Math.PI*2);ctx.fill();
      // storm cloud above head
      for(const[cx2,cy2,cr2]of[[0,-r*.7,r*.22],[-r*.2,-r*.62,r*.16],[r*.2,-r*.62,r*.16]]){ctx.beginPath();ctx.arc(cx2,cy2,cr2,0,Math.PI*2);ctx.fillStyle='rgba(140,150,180,0.85)';ctx.fill();}
      // lightning in both hands
      for(const hx of[-r*.38,r*.38]){
        ctx.beginPath();ctx.moveTo(hx,-r*.1);ctx.lineTo(hx+Math.sign(hx)*r*.08,r*.06);ctx.lineTo(hx-Math.sign(hx)*r*.06,r*.06);ctx.lineTo(hx+Math.sign(hx)*r*.08,r*.24);
        ctx.strokeStyle='rgba(255,240,80,0.95)';ctx.lineWidth=2;ctx.stroke();
      }
      break;
    }

    case 'bloodKnight': {
      // blood red plate armor
      ctx.fillStyle='#800010';ctx.fillRect(-r*.24,r*.2,r*.2,r*.56);ctx.fillRect(r*.04,r*.2,r*.2,r*.56);
      ctx.beginPath();ctx.moveTo(-r*.36,r*.22);ctx.lineTo(-r*.4,-r*.22);ctx.lineTo(r*.4,-r*.22);ctx.lineTo(r*.36,r*.22);ctx.closePath();
      ctx.fillStyle='#a01018';ctx.fill();ctx.strokeStyle='rgba(200,40,40,0.5)';ctx.lineWidth=1.5;ctx.stroke();
      // visor helm
      ctx.beginPath();ctx.arc(0,-r*.42,r*.28,0,Math.PI*2);ctx.fillStyle='#800010';ctx.fill();ctx.strokeStyle='rgba(200,40,40,0.6)';ctx.lineWidth=1.5;ctx.stroke();
      ctx.beginPath();ctx.ellipse(0,-r*.38,r*.2,r*.08,0,0,Math.PI*2);ctx.fillStyle='rgba(255,0,0,0.3)';ctx.fill();ctx.strokeStyle='rgba(255,60,60,0.7)';ctx.lineWidth=1;ctx.stroke();
      // shield
      ctx.beginPath();ctx.moveTo(-r*.38,-r*.24);ctx.lineTo(-r*.5,r*.0);ctx.lineTo(-r*.44,r*.32);ctx.lineTo(-r*.22,r*.44);ctx.lineTo(-r*.1,r*.1);ctx.lineTo(-r*.1,-r*.24);ctx.closePath();
      ctx.fillStyle='#900818';ctx.fill();ctx.strokeStyle='rgba(180,30,30,0.7)';ctx.lineWidth=1.5;ctx.stroke();
      ctx.beginPath();ctx.moveTo(-r*.3,r*.1);ctx.lineTo(-r*.3,-r*.14);ctx.moveTo(-r*.46,r*.1);ctx.lineTo(-r*.14,r*.1);ctx.strokeStyle='rgba(200,40,40,0.8)';ctx.lineWidth=1.5;ctx.stroke();
      // sword
      ctx.beginPath();ctx.moveTo(r*.36,-r*.24);ctx.lineTo(r*.36,r*.56);ctx.strokeStyle='#d0d0e0';ctx.lineWidth=3;ctx.stroke();
      ctx.fillStyle='#c0a030';ctx.fillRect(r*.22,-r*.18,r*.28,r*.1);
      break;
    }

    case 'voidRifter': {
      ctx.beginPath();ctx.moveTo(-r*.18,r*.72);ctx.lineTo(-r*.36,-r*.16);ctx.lineTo(r*.36,-r*.16);ctx.lineTo(r*.18,r*.72);ctx.closePath();
      ctx.fillStyle='#3010a0';ctx.fill();
      ctx.beginPath();ctx.arc(0,-r*.36,r*.24,0,Math.PI*2);ctx.fillStyle='#b090e0';ctx.fill();
      ctx.fillStyle='#180840';ctx.beginPath();ctx.arc(-r*.09,-r*.38,r*.05,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(r*.09,-r*.38,r*.05,0,Math.PI*2);ctx.fill();
      // hood
      ctx.beginPath();ctx.arc(0,-r*.36,r*.24,Math.PI,Math.PI*2);ctx.fillStyle='#240870';ctx.fill();
      ctx.beginPath();ctx.moveTo(-r*.3,-r*.26);ctx.lineTo(0,-r*.68);ctx.lineTo(r*.3,-r*.26);ctx.closePath();ctx.fillStyle='#240870';ctx.fill();
      // rift portal being held open
      const vrR=(Date.now()/500)%(Math.PI*2);
      ctx.save();ctx.translate(0,r*.14);ctx.rotate(vrR);
      ctx.beginPath();ctx.ellipse(0,0,r*.32,r*.18,0,0,Math.PI*2);ctx.fillStyle='rgba(10,0,30,0.9)';ctx.fill();ctx.strokeStyle='rgba(140,60,220,0.8)';ctx.lineWidth=2;ctx.stroke();
      ctx.restore();
      for(let arm=0;arm<3;arm++){ctx.save();ctx.translate(0,r*.14);ctx.rotate(vrR+(Math.PI*2/3)*arm);ctx.beginPath();for(let t=0;t<=1;t+=.08){const a=t*Math.PI*1.5,rad=t*r*.28;t===0?ctx.moveTo(Math.cos(a)*rad,Math.sin(a)*rad):ctx.lineTo(Math.cos(a)*rad,Math.sin(a)*rad);}ctx.strokeStyle=`rgba(160,80,255,0.7)`;ctx.lineWidth=1.5;ctx.stroke();ctx.restore();}
      break;
    }

    case 'banshee': {
      // wispy ghost form — no solid legs
      ctx.beginPath();ctx.moveTo(-r*.36,r*.72);ctx.bezierCurveTo(-r*.48,r*.3,-r*.52,-r*.18,-r*.36,-r*.5);ctx.bezierCurveTo(-r*.1,-r*.8,r*.1,-r*.8,r*.36,-r*.5);ctx.bezierCurveTo(r*.52,-r*.18,r*.48,r*.3,r*.36,r*.72);ctx.bezierCurveTo(r*.2,r*.52,r*.06,r*.62,0,r*.44);ctx.bezierCurveTo(-r*.06,r*.62,-r*.2,r*.52,-r*.36,r*.72);
      ctx.fillStyle='rgba(180,190,220,0.72)';ctx.fill();ctx.strokeStyle='rgba(200,210,240,0.5)';ctx.lineWidth=1;ctx.stroke();
      // hollow dark eyes
      for(const ex of[-r*.16,r*.16]){ctx.beginPath();ctx.ellipse(ex,-r*.2,r*.1,r*.13,0,0,Math.PI*2);ctx.fillStyle='rgba(10,0,30,0.95)';ctx.fill();}
      // screaming mouth
      ctx.beginPath();ctx.ellipse(0,r*.06,r*.18,r*.24,0,0,Math.PI*2);ctx.fillStyle='rgba(10,0,30,0.95)';ctx.fill();
      // outstretched arms
      ctx.beginPath();ctx.moveTo(-r*.36,-r*.1);ctx.bezierCurveTo(-r*.62,-r*.18,-r*.72,-r*.04,-r*.66,r*.1);ctx.strokeStyle='rgba(180,190,220,0.6)';ctx.lineWidth=r*.16;ctx.lineCap='round';ctx.stroke();
      ctx.beginPath();ctx.moveTo(r*.36,-r*.1);ctx.bezierCurveTo(r*.62,-r*.18,r*.72,-r*.04,r*.66,r*.1);ctx.strokeStyle='rgba(180,190,220,0.6)';ctx.lineWidth=r*.16;ctx.lineCap='round';ctx.stroke();
      break;
    }

    case 'mechanic': {
      // bulky mechanical suit
      ctx.fillStyle='#404858';ctx.fillRect(-r*.26,r*.2,r*.22,r*.56);ctx.fillRect(r*.04,r*.2,r*.22,r*.56);
      ctx.beginPath();ctx.moveTo(-r*.38,r*.22);ctx.lineTo(-r*.44,-r*.22);ctx.lineTo(r*.44,-r*.22);ctx.lineTo(r*.38,r*.22);ctx.closePath();
      ctx.fillStyle='#505868';ctx.fill();ctx.strokeStyle='rgba(120,160,200,0.4)';ctx.lineWidth=1;ctx.stroke();
      // helmet with visor
      ctx.beginPath();ctx.arc(0,-r*.4,r*.28,0,Math.PI*2);ctx.fillStyle='#404858';ctx.fill();ctx.strokeStyle='rgba(100,150,200,0.5)';ctx.lineWidth=1.5;ctx.stroke();
      ctx.beginPath();ctx.ellipse(0,-r*.38,r*.2,r*.1,0,0,Math.PI*2);ctx.fillStyle='rgba(100,180,255,0.5)';ctx.fill();
      // spinning shoulder gear
      const mT=Date.now()/800;
      ctx.save();ctx.translate(r*.42,-r*.12);ctx.rotate(mT);
      ctx.beginPath();ctx.arc(0,0,r*.18,0,Math.PI*2);ctx.fillStyle='#707880';ctx.fill();
      for(let t=0;t<8;t++){ctx.save();ctx.rotate((Math.PI/4)*t);ctx.fillStyle='#606870';ctx.fillRect(-r*.04,-r*.26,r*.08,r*.1);ctx.restore();}
      ctx.beginPath();ctx.arc(0,0,r*.08,0,Math.PI*2);ctx.fillStyle='#303840';ctx.fill();
      ctx.restore();
      // wrench in hand
      ctx.beginPath();ctx.moveTo(-r*.38,-r*.12);ctx.lineTo(-r*.46,r*.38);ctx.strokeStyle='#b0b8c0';ctx.lineWidth=3;ctx.stroke();
      ctx.beginPath();ctx.arc(-r*.38,-r*.12,r*.1,0,Math.PI*2);ctx.strokeStyle='#b0b8c0';ctx.lineWidth=3;ctx.stroke();
      break;
    }

    case 'gravityWell': {
      // floating spherical device — no person
      const gwR=(Date.now()/800)%(Math.PI*2);
      // orbital rings
      for(let i=3;i>=1;i--){ctx.save();ctx.rotate(gwR*i*.5);ctx.beginPath();ctx.ellipse(0,0,r*(i*.22+.12),r*(i*.14+.07),0,0,Math.PI*2);ctx.strokeStyle=`rgba(80,${40+i*30},${160+i*20},${.4+i*.15})`;ctx.lineWidth=1.5;ctx.stroke();ctx.restore();}
      // central sphere
      ctx.beginPath();ctx.arc(0,0,r*.3,0,Math.PI*2);
      const gwg=ctx.createRadialGradient(0,0,0,0,0,r*.3);gwg.addColorStop(0,'rgba(200,160,255,0.95)');gwg.addColorStop(1,'rgba(60,20,120,0.9)');ctx.fillStyle=gwg;ctx.fill();
      break;
    }

    case 'thornGolem': {
      // vine body — no human form
      ctx.beginPath();ctx.arc(0,r*.08,r*.4,0,Math.PI*2);ctx.fillStyle='#1a5810';ctx.fill();
      for(let i=0;i<5;i++){
        const va=(Math.PI*2/5)*i;
        ctx.beginPath();ctx.arc(0,r*.08,r*.52,(va-.5),(va+.5));ctx.strokeStyle='#2e8820';ctx.lineWidth=4;ctx.stroke();
        const mx=Math.cos(va)*r*.52,my=r*.08+Math.sin(va)*r*.52;
        ctx.beginPath();ctx.moveTo(mx,my);ctx.lineTo(mx+Math.cos(va+Math.PI/2)*r*.18,my+Math.sin(va+Math.PI/2)*r*.18);ctx.lineTo(mx+Math.cos(va)*r*.12,my+Math.sin(va)*r*.12);ctx.closePath();
        ctx.fillStyle='#70c040';ctx.fill();
      }
      // glowing green eyes
      for(const ex of[-r*.16,r*.16]){ctx.beginPath();ctx.arc(ex,-r*.02,r*.09,0,Math.PI*2);ctx.fillStyle='rgba(100,255,50,0.95)';ctx.fill();}
      break;
    }

    case 'shadowPriest': {
      // deep black hood/robe
      ctx.beginPath();ctx.moveTo(-r*.14,r*.72);ctx.lineTo(-r*.44,-r*.22);ctx.lineTo(0,-r*.6);ctx.lineTo(r*.44,-r*.22);ctx.lineTo(r*.14,r*.72);ctx.closePath();
      ctx.fillStyle='#080510';ctx.fill();ctx.strokeStyle='rgba(120,60,180,0.5)';ctx.lineWidth=1;ctx.stroke();
      // hood shadow
      ctx.beginPath();ctx.ellipse(0,-r*.3,r*.28,r*.34,0,0,Math.PI*2);ctx.fillStyle='#100818';ctx.fill();
      // glowing purple eyes
      for(const ex of[-r*.1,r*.1]){ctx.beginPath();ctx.arc(ex,-r*.3,r*.07,0,Math.PI*2);ctx.fillStyle='rgba(180,80,255,0.95)';ctx.fill();}
      // shadow staff orb
      ctx.beginPath();ctx.arc(r*.32,-r*.06,r*.16,0,Math.PI*2);
      const spg=ctx.createRadialGradient(r*.32,-r*.06,0,r*.32,-r*.06,r*.16);spg.addColorStop(0,'rgba(220,160,255,0.9)');spg.addColorStop(1,'rgba(80,20,120,0.6)');ctx.fillStyle=spg;ctx.fill();
      ctx.beginPath();ctx.moveTo(r*.32,r*.1);ctx.lineTo(r*.38,r*.66);ctx.strokeStyle='#604880';ctx.lineWidth=2;ctx.stroke();
      break;
    }

    case 'iceGolem': {
      // angular ice crystal body
      const shards=[[0,-r*.72,0],[r*.5,-r*.46,.4],[r*.64,r*.08,.9],[r*.38,r*.6,1.4],[0,r*.66,Math.PI/2*3],[-r*.38,r*.6,1.8],[-r*.64,r*.08,-.9],[-r*.5,-r*.46,-.4]];
      for(const[sx,sy,sa]of shards){ctx.save();ctx.translate(sx,sy);ctx.rotate(sa);ctx.beginPath();ctx.moveTo(0,-r*.2);ctx.lineTo(r*.1,0);ctx.lineTo(0,r*.2);ctx.lineTo(-r*.1,0);ctx.closePath();const ig=ctx.createLinearGradient(-r*.1,0,r*.1,0);ig.addColorStop(0,'rgba(150,220,255,0.9)');ig.addColorStop(.5,'rgba(220,245,255,0.95)');ig.addColorStop(1,'rgba(100,180,230,0.85)');ctx.fillStyle=ig;ctx.fill();ctx.restore();}
      ctx.beginPath();ctx.arc(0,0,r*.3,0,Math.PI*2);const ic=ctx.createRadialGradient(0,0,0,0,0,r*.3);ic.addColorStop(0,'rgba(240,250,255,0.95)');ic.addColorStop(1,'rgba(100,180,230,0.9)');ctx.fillStyle=ic;ctx.fill();
      break;
    }

    case 'manaVortex': {
      // floating swirling mana device
      const mvR=(Date.now()/400)%(Math.PI*2);
      ctx.rotate(mvR);
      for(let ring=3;ring>=1;ring--){for(let seg=0;seg<8;seg++){const a=(Math.PI/4)*seg;ctx.beginPath();ctx.arc(Math.cos(a)*r*(ring*.19),Math.sin(a)*r*(ring*.19),r*(.1-ring*.02),0,Math.PI*2);ctx.fillStyle=`rgba(${80+ring*20},${40+seg*8},${200+ring*15},${.5+ring*.1})`;ctx.fill();}}
      ctx.beginPath();ctx.arc(0,0,r*.22,0,Math.PI*2);const mvg=ctx.createRadialGradient(0,0,0,0,0,r*.22);mvg.addColorStop(0,'rgba(255,200,255,0.95)');mvg.addColorStop(1,'rgba(100,40,200,0.9)');ctx.fillStyle=mvg;ctx.fill();
      break;
    }

    case 'thunderstrike': {
      // heavy dark armored warrior
      ctx.fillStyle='#303440';ctx.fillRect(-r*.26,r*.2,r*.22,r*.56);ctx.fillRect(r*.04,r*.2,r*.22,r*.56);
      ctx.beginPath();ctx.moveTo(-r*.38,r*.22);ctx.lineTo(-r*.44,-r*.22);ctx.lineTo(r*.44,-r*.22);ctx.lineTo(r*.38,r*.22);ctx.closePath();
      ctx.fillStyle='#404550';ctx.fill();ctx.strokeStyle='rgba(200,200,60,0.4)';ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.arc(0,-r*.4,r*.28,0,Math.PI*2);ctx.fillStyle='#353a45';ctx.fill();ctx.strokeStyle='rgba(200,200,60,0.5)';ctx.lineWidth=1.5;ctx.stroke();
      // thunder hammer raised
      ctx.beginPath();ctx.moveTo(-r*.08,r*.1);ctx.lineTo(-r*.12,-r*.48);ctx.strokeStyle='#a08820';ctx.lineWidth=r*.1;ctx.lineCap='round';ctx.stroke();
      ctx.fillStyle='#808090';ctx.fillRect(-r*.44,-r*.62,r*.72,r*.3);ctx.strokeStyle='rgba(220,220,60,0.5)';ctx.lineWidth=1;ctx.strokeRect(-r*.44,-r*.62,r*.72,r*.3);
      // lightning on hammer
      ctx.beginPath();ctx.moveTo(r*.06,-r*.58);ctx.lineTo(-r*.06,-r*.38);ctx.lineTo(r*.04,-r*.38);ctx.lineTo(-r*.08,-r*.18);ctx.strokeStyle='rgba(255,240,60,0.95)';ctx.lineWidth=2;ctx.stroke();
      break;
    }

    case 'spiritGuide': {
      // glowing wisp — no solid body
      const spT=Date.now()/500;
      for(let i=4;i>=1;i--){const a=spT+i*.5;ctx.beginPath();ctx.arc(Math.cos(a)*r*(i*.1),Math.sin(a)*r*(i*.1)+r*.1*i,r*(.3-i*.04),0,Math.PI*2);ctx.fillStyle=`rgba(220,240,255,${.1+i*.05})`;ctx.fill();}
      ctx.beginPath();ctx.arc(0,0,r*.38,0,Math.PI*2);const spg=ctx.createRadialGradient(-r*.1,-r*.1,r*.02,0,0,r*.38);spg.addColorStop(0,'rgba(255,255,255,0.95)');spg.addColorStop(.4,'rgba(200,230,255,0.9)');spg.addColorStop(1,'rgba(120,180,255,0.55)');ctx.fillStyle=spg;ctx.fill();
      for(const ang of[0,Math.PI/2]){ctx.save();ctx.rotate(ang);ctx.beginPath();ctx.moveTo(0,-r*.58);ctx.lineTo(0,-r*.44);ctx.moveTo(0,r*.44);ctx.lineTo(0,r*.58);ctx.strokeStyle='rgba(255,255,255,0.7)';ctx.lineWidth=1.5;ctx.stroke();ctx.restore();}
      break;
    }

    case 'acidCatapult': {
      // wooden catapult
      ctx.fillStyle='#7a5828';ctx.fillRect(-r*.48,r*.08,r*.96,r*.46);ctx.fillRect(-r*.44,r*.08,r*.08,r*.46);ctx.fillRect(r*.36,r*.08,r*.08,r*.46);
      // wheels
      for(const wx of[-r*.32,r*.32]){ctx.beginPath();ctx.arc(wx,r*.56,r*.2,0,Math.PI*2);ctx.fillStyle='#4a3010';ctx.fill();ctx.strokeStyle='#705020';ctx.lineWidth=1.5;ctx.stroke();}
      // catapult arm raised
      ctx.save();ctx.translate(-r*.06,r*.1);ctx.rotate(-Math.PI*.4);
      ctx.fillStyle='#8a6830';ctx.fillRect(-r*.06,-r*.62,r*.12,r*.74);
      // acid flask at end
      ctx.beginPath();ctx.arc(0,-r*.62,r*.15,0,Math.PI*2);ctx.fillStyle='rgba(100,220,40,0.9)';ctx.fill();ctx.strokeStyle='rgba(150,255,60,0.7)';ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.arc(0,-r*.44,r*.07,0,Math.PI*2);ctx.fillStyle='rgba(120,255,50,0.8)';ctx.fill();
      ctx.restore();
      break;
    }

    case 'soulHarvester': {
      // dark reaper
      ctx.beginPath();ctx.moveTo(-r*.14,r*.72);ctx.lineTo(-r*.4,-r*.18);ctx.lineTo(0,-r*.54);ctx.lineTo(r*.4,-r*.18);ctx.lineTo(r*.14,r*.72);ctx.closePath();
      ctx.fillStyle='#0e0818';ctx.fill();ctx.strokeStyle='rgba(140,60,200,0.4)';ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.arc(0,-r*.36,r*.26,0,Math.PI*2);ctx.fillStyle='rgba(180,160,200,0.9)';ctx.fill();
      // deep hood
      ctx.beginPath();ctx.arc(0,-r*.36,r*.26,Math.PI,Math.PI*2);ctx.fillStyle='#0e0818';ctx.fill();
      ctx.beginPath();ctx.moveTo(-r*.3,-r*.26);ctx.lineTo(0,-r*.72);ctx.lineTo(r*.3,-r*.26);ctx.closePath();ctx.fillStyle='#0e0818';ctx.fill();
      // scythe
      ctx.save();ctx.translate(r*.08,0);ctx.rotate(Math.PI*.1);
      ctx.beginPath();ctx.moveTo(-r*.08,-r*.62);ctx.lineTo(-r*.08,r*.62);ctx.strokeStyle='#604080';ctx.lineWidth=2.5;ctx.stroke();
      ctx.beginPath();ctx.moveTo(-r*.08,-r*.56);ctx.bezierCurveTo(r*.44,-r*.68,r*.66,-r*.28,r*.5,r*.12);ctx.bezierCurveTo(r*.56,-r*.08,r*.46,-r*.52,-r*.08,-r*.36);ctx.closePath();
      const scg=ctx.createLinearGradient(-r*.08,-r*.56,r*.66,-r*.28);scg.addColorStop(0,'rgba(200,200,220,0.95)');scg.addColorStop(1,'rgba(120,60,180,0.8)');ctx.fillStyle=scg;ctx.fill();
      ctx.restore();
      break;
    }

    case 'mirrorMage': {
      ctx.beginPath();ctx.moveTo(-r*.18,r*.72);ctx.lineTo(-r*.36,-r*.16);ctx.lineTo(r*.36,-r*.16);ctx.lineTo(r*.18,r*.72);ctx.closePath();
      const mmg=ctx.createLinearGradient(-r*.36,0,r*.36,0);mmg.addColorStop(0,'rgba(160,200,240,0.8)');mmg.addColorStop(.5,'rgba(240,250,255,0.95)');mmg.addColorStop(1,'rgba(160,200,240,0.8)');ctx.fillStyle=mmg;ctx.fill();
      ctx.beginPath();ctx.arc(0,-r*.36,r*.24,0,Math.PI*2);ctx.fillStyle='#e8f0ff';ctx.fill();
      ctx.fillStyle='#204060';ctx.beginPath();ctx.arc(-r*.09,-r*.38,r*.05,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(r*.09,-r*.38,r*.05,0,Math.PI*2);ctx.fill();
      // diamond mirror held up
      ctx.beginPath();ctx.moveTo(r*.38,-r*.56);ctx.lineTo(r*.56,-r*.28);ctx.lineTo(r*.38,0);ctx.lineTo(r*.2,-r*.28);ctx.closePath();
      const dmg=ctx.createLinearGradient(r*.2,-r*.56,r*.56,0);dmg.addColorStop(0,'rgba(160,200,240,0.6)');dmg.addColorStop(.5,'rgba(240,250,255,0.9)');dmg.addColorStop(1,'rgba(160,200,240,0.6)');ctx.fillStyle=dmg;ctx.fill();ctx.strokeStyle='rgba(200,230,255,0.8)';ctx.lineWidth=1.5;ctx.stroke();
      // rainbow reflection lines
      const rainbowC=['rgba(255,60,60,0.7)','rgba(255,165,0,0.7)','rgba(255,255,0,0.7)','rgba(60,200,60,0.7)','rgba(60,120,255,0.7)'];
      for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(r*.56,-r*.28);ctx.lineTo(r*.56+r*.3,(-r*.28)+((i-2)*r*.12));ctx.strokeStyle=rainbowC[i];ctx.lineWidth=1.5;ctx.stroke();}
      break;
    }

    case 'vortexCannon': {
      // sci-fi cannon device
      ctx.beginPath();ctx.ellipse(0,r*.2,r*.38,r*.28,0,0,Math.PI*2);ctx.fillStyle='#484058';ctx.fill();ctx.strokeStyle='rgba(120,100,160,0.6)';ctx.lineWidth=1.5;ctx.stroke();
      // barrel
      ctx.fillStyle='#383048';ctx.fillRect(-r*.2,-r*.52,r*.4,r*.48);ctx.strokeStyle='rgba(100,80,140,0.5)';ctx.lineWidth=1;ctx.strokeRect(-r*.2,-r*.52,r*.4,r*.48);
      // vortex in barrel
      const vcR=(Date.now()/300)%(Math.PI*2);
      ctx.save();ctx.translate(0,-r*.28);ctx.rotate(vcR);
      for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,r*.17,(Math.PI/2)*i,(Math.PI/2)*i+Math.PI*.7);ctx.strokeStyle=`rgba(${120+i*20},${80+i*15},${200+i*10},0.8)`;ctx.lineWidth=1.5;ctx.stroke();}
      ctx.restore();
      break;
    }

    /* ── TIER 4 LEGENDARY ── */

    case 'celestialBeacon': {
      // divine column of light
      ctx.beginPath();ctx.moveTo(-r*.14,r*.72);ctx.lineTo(-r*.14,-r*.5);ctx.lineTo(r*.14,-r*.5);ctx.lineTo(r*.14,r*.72);
      const clg=ctx.createLinearGradient(0,r*.72,0,-r*.5);clg.addColorStop(0,'rgba(255,220,120,0.5)');clg.addColorStop(1,'rgba(255,255,255,0.9)');ctx.fillStyle=clg;ctx.fill();
      // rotating 8-pointed star
      const cbR=(Date.now()/1200)%(Math.PI*2);
      ctx.save();ctx.rotate(cbR);
      for(let i=0;i<8;i++){const a=(Math.PI/4)*i;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(a)*r*.7,Math.sin(a)*r*.7);ctx.lineTo(Math.cos(a+Math.PI/8)*r*.22,Math.sin(a+Math.PI/8)*r*.22);ctx.closePath();ctx.fillStyle=`rgba(255,${220+Math.sin(i)*20},${140+i*8},${.7+Math.cos(i*.8)*.2})`;ctx.fill();}
      ctx.restore();
      ctx.beginPath();ctx.arc(0,0,r*.24,0,Math.PI*2);const cg2=ctx.createRadialGradient(0,0,0,0,0,r*.24);cg2.addColorStop(0,'rgba(255,255,255,0.98)');cg2.addColorStop(1,'rgba(255,220,120,0.85)');ctx.fillStyle=cg2;ctx.fill();
      break;
    }

    case 'abyssalShrine': {
      // stone altar
      ctx.fillStyle='#140a22';ctx.fillRect(-r*.48,r*.18,r*.96,r*.52);ctx.fillStyle='#1e1030';ctx.fillRect(-r*.52,r*.06,r*.04,r*.16);
      ctx.fillStyle='#1e1030';ctx.fillRect(-r*.52,r*.06,r*1.04,r*.16);
      // rune glows
      for(const[rx,ry]of[[-r*.28,r*.34],[0,r*.34],[r*.28,r*.34]]){ctx.beginPath();ctx.arc(rx,ry,r*.07,0,Math.PI*2);ctx.fillStyle='rgba(160,60,255,0.8)';ctx.fill();}
      // dark flames
      for(const[fx,ofs]of[[-r*.28,-r*.28],[0,-r*.3],[r*.28,-r*.26]]){
        ctx.beginPath();ctx.moveTo(fx,r*.06);ctx.bezierCurveTo(fx-r*.14,-r*.14,fx-r*.1,-r*.5+ofs*r*.1,fx,-r*.54+ofs*r*.1);ctx.bezierCurveTo(fx+r*.1,-r*.5+ofs*r*.1,fx+r*.14,-r*.14,fx,r*.06);
        const afg=ctx.createLinearGradient(fx,r*.06,fx,-r*.54+ofs*r*.1);afg.addColorStop(0,'rgba(100,0,180,0.9)');afg.addColorStop(.5,'rgba(160,40,255,0.85)');afg.addColorStop(1,'rgba(60,0,100,0.7)');ctx.fillStyle=afg;ctx.fill();
      }
      break;
    }

    case 'chronoFortress': {
      // stone fortress tower
      ctx.fillStyle='#606070';ctx.fillRect(-r*.38,-r*.52,r*.76,r*1.18);
      // battlements
      for(let b=0;b<4;b++){ctx.fillStyle='#6a6a7a';ctx.fillRect(-r*.38+b*r*.22,-r*.68,r*.16,r*.18);}
      // arrow slits
      ctx.fillStyle='#1a1820';
      ctx.fillRect(-r*.08,-r*.28,r*.16,r*.24);ctx.fillRect(-r*.08,r*.12,r*.16,r*.24);
      // clock face in center
      ctx.beginPath();ctx.arc(0,-r*.04,r*.26,0,Math.PI*2);ctx.fillStyle='rgba(180,170,220,0.85)';ctx.fill();ctx.strokeStyle='rgba(140,130,180,0.7)';ctx.lineWidth=1;ctx.stroke();
      const cfN=Date.now()/1000;
      ctx.beginPath();ctx.moveTo(0,-r*.04);ctx.lineTo(Math.cos(cfN*.3-Math.PI/2)*r*.14,-r*.04+Math.sin(cfN*.3-Math.PI/2)*r*.14);ctx.strokeStyle='rgba(40,30,70,0.9)';ctx.lineWidth=2;ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,-r*.04);ctx.lineTo(Math.cos(cfN*6-Math.PI/2)*r*.2,-r*.04+Math.sin(cfN*6-Math.PI/2)*r*.2);ctx.strokeStyle='rgba(40,30,70,0.9)';ctx.lineWidth=1.2;ctx.stroke();
      break;
    }

    case 'thunderGod': {
      // divine imposing figure
      ctx.fillStyle='#8a7010';ctx.fillRect(-r*.28,r*.2,r*.24,r*.56);ctx.fillRect(r*.04,r*.2,r*.24,r*.56);
      ctx.beginPath();ctx.moveTo(-r*.46,r*.22);ctx.lineTo(-r*.52,-r*.28);ctx.lineTo(r*.52,-r*.28);ctx.lineTo(r*.46,r*.22);ctx.closePath();
      const tgg=ctx.createLinearGradient(-r*.52,0,r*.52,0);tgg.addColorStop(0,'#806010');tgg.addColorStop(.5,'#d0a820');tgg.addColorStop(1,'#806010');ctx.fillStyle=tgg;ctx.fill();
      ctx.strokeStyle='rgba(255,220,60,0.5)';ctx.lineWidth=1.5;ctx.stroke();
      // divine head with lightning crown
      ctx.beginPath();ctx.arc(0,-r*.46,r*.3,0,Math.PI*2);ctx.fillStyle='#e8c890';ctx.fill();ctx.strokeStyle='rgba(255,220,60,0.7)';ctx.lineWidth=2;ctx.stroke();
      // lightning crown
      const tgT=Date.now()/200;
      for(let c=0;c<5;c++){const ca=(Math.PI/4)*(c-2);ctx.beginPath();ctx.moveTo(Math.cos(ca)*r*.28,-r*.46+Math.sin(ca)*r*.28);ctx.lineTo(Math.cos(ca)*r*.44,-r*.46+Math.sin(ca)*r*.44);ctx.strokeStyle='rgba(255,240,80,0.9)';ctx.lineWidth=2;ctx.stroke();}
      // massive hammer
      ctx.beginPath();ctx.moveTo(-r*.16,-r*.22);ctx.lineTo(-r*.16,r*.62);ctx.strokeStyle='#c0a020';ctx.lineWidth=r*.12;ctx.lineCap='round';ctx.stroke();
      ctx.fillStyle='#a0a0b8';ctx.fillRect(-r*.54,-r*.42,r*.76,r*.3);ctx.strokeStyle='rgba(255,240,60,0.5)';ctx.lineWidth=1;ctx.strokeRect(-r*.54,-r*.42,r*.76,r*.3);
      ctx.beginPath();ctx.moveTo(r*.06,-r*.38);ctx.lineTo(-r*.1,-r*.16);ctx.lineTo(r*.08,-r*.16);ctx.lineTo(-r*.1,r*.06);ctx.strokeStyle='rgba(255,240,60,0.95)';ctx.lineWidth=2.2;ctx.stroke();
      break;
    }

    case 'naturesWrath': {
      // tree-person
      // roots/legs
      for(let i=0;i<4;i++){const ra=(Math.PI/3)*(i-1.5);ctx.beginPath();ctx.moveTo(0,r*.14);ctx.quadraticCurveTo(Math.cos(ra+.4)*r*.36,r*.14+Math.sin(ra+.4)*r*.36,Math.cos(ra)*r*.68,r*.14+Math.sin(ra)*r*.68);ctx.strokeStyle='#4a2a0a';ctx.lineWidth=3+Math.sin(i)*0.8;ctx.stroke();}
      // trunk body
      ctx.fillStyle='#6a3a10';ctx.fillRect(-r*.16,-r*.22,r*.32,r*.38);
      // face knot
      for(const[kx,ky]of[[-r*.08,-r*.08],[r*.08,-r*.08]]){ctx.beginPath();ctx.arc(kx,ky,r*.07,0,Math.PI*2);ctx.fillStyle='#402008';ctx.fill();}
      ctx.beginPath();ctx.arc(0,r*.06,r*.12,-Math.PI*.1,Math.PI*1.1);ctx.strokeStyle='#402008';ctx.lineWidth=1.5;ctx.stroke();
      // canopy
      for(const[cx3,cy3,cr3]of[[0,-r*.5,r*.34],[-r*.3,-r*.34,r*.24],[r*.3,-r*.34,r*.24]]){ctx.beginPath();ctx.arc(cx3,cy3,cr3,0,Math.PI*2);ctx.fillStyle='#288020';ctx.fill();}
      // glowing leaf eyes
      for(const[lx,ly]of[[0,-r*.66],[-r*.3,-r*.5],[r*.3,-r*.5]]){ctx.beginPath();ctx.arc(lx,ly,r*.07,0,Math.PI*2);ctx.fillStyle='rgba(160,255,60,0.9)';ctx.fill();}
      break;
    }

    case 'voidGolem': {
      // dark void-energy body
      const vgR=(Date.now()/700)%(Math.PI*2);
      for(let i=0;i<6;i++){const pa=vgR+(Math.PI/3)*i;ctx.beginPath();ctx.arc(Math.cos(pa)*r*.52,Math.sin(pa)*r*.52,r*.07,0,Math.PI*2);ctx.fillStyle=`rgba(${60+i*10},${20+i*5},${100+i*15},0.8)`;ctx.fill();}
      ctx.beginPath();ctx.arc(0,0,r*.44,0,Math.PI*2);const vgg=ctx.createRadialGradient(0,0,0,0,0,r*.44);vgg.addColorStop(0,'rgba(60,30,100,0.9)');vgg.addColorStop(1,'rgba(8,3,18,0.97)');ctx.fillStyle=vgg;ctx.fill();ctx.strokeStyle='rgba(100,50,160,0.7)';ctx.lineWidth=1.5;ctx.stroke();
      // hollow white eyes
      for(const ex of[-r*.16,r*.16]){ctx.beginPath();ctx.arc(ex,-r*.1,r*.1,0,Math.PI*2);ctx.fillStyle='rgba(200,200,255,0.95)';ctx.fill();ctx.beginPath();ctx.arc(ex,-r*.1,r*.05,0,Math.PI*2);ctx.fillStyle='rgba(10,5,20,0.95)';ctx.fill();}
      break;
    }

    case 'starfallTower': {
      // tower structure
      ctx.fillStyle='#444458';ctx.fillRect(-r*.22,-r*.28,r*.44,r*.96);
      for(let b=0;b<4;b++) ctx.fillRect(-r*.28+b*r*.2,-r*.42,r*.14,r*.16);
      ctx.fillStyle='#1a1828';ctx.fillRect(-r*.08,-r*.18,r*.16,r*.26);
      // animated shooting stars
      const sfT=Date.now()/350;
      for(let i=0;i<4;i++){const p=((sfT*.4+i*.25)%1),sx=-r*.6+p*r*1.2,sy=-r*.6+p*r*1.2;ctx.beginPath();ctx.arc(sx,sy,r*.07,0,Math.PI*2);ctx.fillStyle=`rgba(255,240,150,${1-p})`;ctx.fill();ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx-r*.3*(1-p),sy-r*.3*(1-p));ctx.strokeStyle=`rgba(255,200,80,${(1-p)*.6})`;ctx.lineWidth=1.5;ctx.stroke();}
      break;
    }

    // ── New Common ──────────────────────────────────────────────
    case 'torchbearer': {
      // Person holding a blazing torch
      ctx.beginPath();ctx.rect(-r*.12,-r*.05,r*.22,r*.45);ctx.fillStyle='#c06030';ctx.fill();ctx.strokeStyle='#804020';ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.arc(0,-r*.28,r*.16,0,Math.PI*2);ctx.fillStyle='#e8c090';ctx.fill();
      ctx.save();ctx.translate(r*.28,-r*.2);
      const ft=Date.now()/150;for(let f=0;f<4;f++){ctx.beginPath();ctx.arc(Math.sin(ft+f)*r*.07,f*-r*.08,r*.08-f*r*.01,0,Math.PI*2);ctx.fillStyle=`rgba(255,${140+f*20},20,${0.9-f*0.2})`;ctx.fill();}
      ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,r*.5);ctx.strokeStyle='#806040';ctx.lineWidth=2;ctx.stroke();ctx.restore();break;
    }
    case 'hedgeKnight': {
      // Armored knight with sword
      ctx.beginPath();ctx.rect(-r*.2,-r*.05,r*.4,r*.42);ctx.fillStyle='#8090a0';ctx.fill();ctx.strokeStyle='#506070';ctx.lineWidth=1.5;ctx.stroke();
      ctx.beginPath();ctx.arc(0,-r*.3,r*.18,0,Math.PI*2);ctx.fillStyle='#8090a0';ctx.fill();ctx.strokeStyle='#506070';ctx.lineWidth=1.5;ctx.stroke();
      ctx.beginPath();ctx.moveTo(-r*.18,-r*.38);ctx.lineTo(r*.18,-r*.38);ctx.strokeStyle='rgba(60,80,100,0.8)';ctx.lineWidth=2.5;ctx.stroke();
      ctx.save();ctx.translate(r*.3,-r*.1);ctx.beginPath();ctx.moveTo(0,r*.3);ctx.lineTo(0,-r*.55);ctx.strokeStyle='#c0c8d0';ctx.lineWidth=2;ctx.stroke();ctx.beginPath();ctx.moveTo(-r*.08,-r*.3);ctx.lineTo(r*.08,-r*.3);ctx.strokeStyle='#a0a8b0';ctx.lineWidth=2;ctx.stroke();ctx.restore();break;
    }
    case 'rifleman': {
      // Soldier with long rifle
      ctx.beginPath();ctx.rect(-r*.12,-r*.05,r*.22,r*.42);ctx.fillStyle='#a09070';ctx.fill();ctx.strokeStyle='#706040';ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.arc(0,-r*.28,r*.16,0,Math.PI*2);ctx.fillStyle='#d4a870';ctx.fill();
      ctx.save();ctx.translate(r*.1,-r*.1);ctx.rotate(-0.3);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(r*.8,0);ctx.strokeStyle='#605040';ctx.lineWidth=2.5;ctx.stroke();ctx.beginPath();ctx.moveTo(-r*.1,0);ctx.lineTo(r*.2,0);ctx.strokeStyle='#808080';ctx.lineWidth=1.5;ctx.stroke();ctx.restore();break;
    }
    case 'netThrower': {
      // Person with net
      ctx.beginPath();ctx.rect(-r*.12,-r*.05,r*.22,r*.42);ctx.fillStyle='#909860';ctx.fill();ctx.strokeStyle='#606840';ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.arc(0,-r*.28,r*.16,0,Math.PI*2);ctx.fillStyle='#c8a870';ctx.fill();
      // Net
      ctx.save();ctx.translate(r*.35,-r*.1);for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(i*r*.15,-r*.25);ctx.lineTo(i*r*.15,r*.25);ctx.strokeStyle='rgba(180,160,80,0.7)';ctx.lineWidth=1;ctx.stroke();}for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(-r*.25,i*r*.12);ctx.lineTo(r*.25,i*r*.12);ctx.strokeStyle='rgba(180,160,80,0.7)';ctx.lineWidth=1;ctx.stroke();}ctx.restore();break;
    }
    case 'brawler': {
      // Big fist person, hunched
      ctx.beginPath();ctx.ellipse(0,r*.08,r*.22,r*.28,0,0,Math.PI*2);ctx.fillStyle='#c06040';ctx.fill();ctx.strokeStyle='#903020';ctx.lineWidth=1.5;ctx.stroke();
      ctx.beginPath();ctx.arc(0,-r*.28,r*.2,0,Math.PI*2);ctx.fillStyle='#d09060';ctx.fill();
      // Fists
      ctx.beginPath();ctx.arc(-r*.3,r*.08,r*.1,0,Math.PI*2);ctx.fillStyle='#c06040';ctx.fill();ctx.strokeStyle='#903020';ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.arc(r*.3,r*.08,r*.1,0,Math.PI*2);ctx.fillStyle='#c06040';ctx.fill();ctx.strokeStyle='#903020';ctx.lineWidth=1;ctx.stroke();break;
    }
    case 'herbalist': {
      // Robed figure with herb bundle
      ctx.beginPath();ctx.moveTo(-r*.2,-r*.05);ctx.lineTo(-r*.28,r*.45);ctx.lineTo(r*.28,r*.45);ctx.lineTo(r*.2,-r*.05);ctx.closePath();ctx.fillStyle='#70c060';ctx.fill();ctx.strokeStyle='#409040';ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.arc(0,-r*.28,r*.16,0,Math.PI*2);ctx.fillStyle='#c8a870';ctx.fill();
      // Herb bundle
      for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(-r*.3+i*r*.18,r*.12,r*.07,0,Math.PI*2);ctx.fillStyle=`hsl(${100+i*20},60%,40%)`;ctx.fill();}break;
    }
    case 'watchtowerPost': {
      // Watch tower structure
      ctx.beginPath();ctx.rect(-r*.15,r*.1,r*.3,r*.35);ctx.fillStyle='#c8a060';ctx.fill();ctx.strokeStyle='#907040';ctx.lineWidth=1.5;ctx.stroke();
      // Platform
      ctx.beginPath();ctx.rect(-r*.28,-r*.08,r*.56,r*.2);ctx.fillStyle='#a07840';ctx.fill();ctx.strokeStyle='#706030';ctx.lineWidth=1;ctx.stroke();
      // Lookout person
      ctx.beginPath();ctx.arc(0,-r*.3,r*.14,0,Math.PI*2);ctx.fillStyle='#d0b870';ctx.fill();
      // Spyglass
      ctx.save();ctx.translate(r*.14,-r*.3);ctx.rotate(0.3);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(r*.3,0);ctx.strokeStyle='#808060';ctx.lineWidth=2;ctx.stroke();ctx.restore();break;
    }
    case 'demolisher': {
      // Big cannon on wheels
      ctx.beginPath();ctx.ellipse(0,r*.28,r*.16,r*.1,0,0,Math.PI*2);ctx.fillStyle='#505050';ctx.fill();
      // Wheels
      ctx.beginPath();ctx.arc(-r*.28,r*.32,r*.1,0,Math.PI*2);ctx.fillStyle='#404040';ctx.fill();ctx.strokeStyle='#686868';ctx.lineWidth=1.5;ctx.stroke();
      ctx.beginPath();ctx.arc(r*.28,r*.32,r*.1,0,Math.PI*2);ctx.fillStyle='#404040';ctx.fill();ctx.strokeStyle='#686868';ctx.lineWidth=1.5;ctx.stroke();
      // Cannon barrel
      ctx.beginPath();ctx.rect(-r*.14,-r*.25,r*.28,r*.45);ctx.fillStyle='#606060';ctx.fill();ctx.strokeStyle='#484848';ctx.lineWidth=1.5;ctx.stroke();
      ctx.beginPath();ctx.ellipse(0,-r*.28,r*.12,r*.08,0,0,Math.PI*2);ctx.fillStyle='#484848';ctx.fill();break;
    }
    // ── New Rare ────────────────────────────────────────────────
    case 'bloodArcher': {
      ctx.beginPath();ctx.rect(-r*.1,-r*.05,r*.2,r*.42);ctx.fillStyle='#802020';ctx.fill();ctx.strokeStyle='#601010';ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.arc(0,-r*.28,r*.16,0,Math.PI*2);ctx.fillStyle='#c08080';ctx.fill();
      // Blood-tipped bow
      ctx.save();ctx.translate(-r*.02,-r*.1);ctx.beginPath();ctx.arc(0,0,r*.35,Math.PI*0.6,Math.PI*1.4);ctx.strokeStyle='#601010';ctx.lineWidth=2;ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,-r*.35*0.8);ctx.lineTo(0,r*.35*0.8);ctx.strokeStyle='rgba(180,60,60,0.5)';ctx.lineWidth=1;ctx.stroke();ctx.restore();
      // Blood arrow
      ctx.save();ctx.translate(r*.18,-r*.1);ctx.rotate(-0.2);ctx.beginPath();ctx.moveTo(-r*.3,0);ctx.lineTo(r*.3,0);ctx.strokeStyle='#c03030';ctx.lineWidth=2;ctx.stroke();ctx.restore();break;
    }
    case 'ironGolemTower': {
      // Massive iron construct
      ctx.beginPath();ctx.rect(-r*.26,-r*.15,r*.52,r*.55);ctx.fillStyle='#707080';ctx.fill();ctx.strokeStyle='#505060';ctx.lineWidth=2;ctx.stroke();
      ctx.beginPath();ctx.ellipse(0,-r*.28,r*.22,r*.18,0,0,Math.PI*2);ctx.fillStyle='#707080';ctx.fill();ctx.strokeStyle='#505060';ctx.lineWidth=2;ctx.stroke();
      // Glowing eyes
      ctx.beginPath();ctx.arc(-r*.08,-r*.3,r*.04,0,Math.PI*2);ctx.fillStyle='#00d0ff';ctx.fill();
      ctx.beginPath();ctx.arc(r*.08,-r*.3,r*.04,0,Math.PI*2);ctx.fillStyle='#00d0ff';ctx.fill();
      // Iron fists
      ctx.beginPath();ctx.rect(-r*.42,r*.0,r*.18,r*.2);ctx.fillStyle='#606070';ctx.fill();ctx.strokeStyle='#484858';ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.rect(r*.24,r*.0,r*.18,r*.2);ctx.fillStyle='#606070';ctx.fill();ctx.strokeStyle='#484858';ctx.lineWidth=1;ctx.stroke();break;
    }
    case 'chronoMage': {
      // Mage with clock/time symbols
      ctx.beginPath();ctx.moveTo(-r*.18,-r*.05);ctx.lineTo(-r*.24,r*.45);ctx.lineTo(r*.24,r*.45);ctx.lineTo(r*.18,-r*.05);ctx.closePath();ctx.fillStyle='#6090d0';ctx.fill();ctx.strokeStyle='#4070b0';ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.arc(0,-r*.28,r*.16,0,Math.PI*2);ctx.fillStyle='#a0c0e8';ctx.fill();
      // Clock orb
      const ct=Date.now()/1000;ctx.beginPath();ctx.arc(r*.28,r*.0,r*.14,0,Math.PI*2);ctx.strokeStyle='#80b0e0';ctx.lineWidth=1.5;ctx.stroke();
      ctx.beginPath();ctx.moveTo(r*.28,r*.0);ctx.lineTo(r*.28+Math.cos(ct)*r*.1,r*.0+Math.sin(ct)*r*.1);ctx.strokeStyle='#40a0ff';ctx.lineWidth=1.5;ctx.stroke();break;
    }
    case 'boneShaman': {
      // Shaman with bone staff
      ctx.beginPath();ctx.moveTo(-r*.15,-r*.05);ctx.lineTo(-r*.2,r*.45);ctx.lineTo(r*.2,r*.45);ctx.lineTo(r*.15,-r*.05);ctx.closePath();ctx.fillStyle='#a09050';ctx.fill();ctx.strokeStyle='#706030';ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.arc(0,-r*.28,r*.16,0,Math.PI*2);ctx.fillStyle='#d0b870';ctx.fill();
      // Bone staff
      ctx.save();ctx.translate(-r*.3,-r*.05);ctx.beginPath();ctx.moveTo(0,-r*.5);ctx.lineTo(0,r*.35);ctx.strokeStyle='#d0c090';ctx.lineWidth=2;ctx.stroke();
      ctx.beginPath();ctx.arc(0,-r*.5,r*.06,0,Math.PI*2);ctx.fillStyle='#e0d0a0';ctx.fill();
      for(let i=0;i<2;i++){ctx.beginPath();ctx.moveTo(0,-r*.5);ctx.lineTo((i===0?-1:1)*r*.12,-r*.38);ctx.strokeStyle='#c0b080';ctx.lineWidth=1.5;ctx.stroke();}ctx.restore();break;
    }
    case 'tideCaller': {
      // Water mage with wave
      ctx.beginPath();ctx.moveTo(-r*.18,-r*.05);ctx.lineTo(-r*.22,r*.45);ctx.lineTo(r*.22,r*.45);ctx.lineTo(r*.18,-r*.05);ctx.closePath();ctx.fillStyle='#3070b0';ctx.fill();ctx.strokeStyle='#205090';ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.arc(0,-r*.28,r*.16,0,Math.PI*2);ctx.fillStyle='#90c0e8';ctx.fill();
      const wt=Date.now()/400;
      ctx.beginPath();for(let i=0;i<8;i++){const wx=-r*.4+i*r*.12;const wy=r*.12+Math.sin(wt+i*0.8)*r*.08;i===0?ctx.moveTo(wx,wy):ctx.lineTo(wx,wy);}ctx.strokeStyle='rgba(80,160,220,0.7)';ctx.lineWidth=2.5;ctx.stroke();break;
    }
    case 'vineTrap': {
      // Nature mage with vines
      ctx.beginPath();ctx.ellipse(0,r*.12,r*.18,r*.28,0,0,Math.PI*2);ctx.fillStyle='#508040';ctx.fill();ctx.strokeStyle='#306020';ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.arc(0,-r*.28,r*.16,0,Math.PI*2);ctx.fillStyle='#a0c080';ctx.fill();
      // Vines
      for(let v=0;v<3;v++){const va=v*(Math.PI*2/3);ctx.beginPath();ctx.moveTo(0,r*.0);ctx.quadraticCurveTo(Math.cos(va)*r*.5,Math.sin(va)*r*.4,Math.cos(va)*r*.6,Math.sin(va)*r*.6);ctx.strokeStyle='rgba(60,140,40,0.7)';ctx.lineWidth=1.5;ctx.stroke();}break;
    }
    case 'glassCannonTower': {
      // Crystal cannon
      const gcg=ctx.createLinearGradient(-r*.2,-r*.4,r*.2,r*.4);gcg.addColorStop(0,'rgba(180,210,255,0.9)');gcg.addColorStop(1,'rgba(220,240,255,0.6)');
      ctx.beginPath();ctx.rect(-r*.15,-r*.45,r*.3,r*.7);ctx.fillStyle=gcg;ctx.fill();ctx.strokeStyle='rgba(140,180,240,0.8)';ctx.lineWidth=1.5;ctx.stroke();
      ctx.beginPath();ctx.ellipse(0,-r*.48,r*.1,r*.06,0,0,Math.PI*2);ctx.fillStyle='rgba(120,160,255,0.9)';ctx.fill();
      const gcT=Date.now()/200;ctx.beginPath();ctx.arc(0,-r*.3,r*.06+Math.sin(gcT)*r*.02,0,Math.PI*2);ctx.fillStyle='rgba(100,140,255,0.8)';ctx.fill();break;
    }
    case 'sandGolemTower': {
      // Sandy golem with swirling sand
      ctx.beginPath();ctx.ellipse(0,r*.05,r*.24,r*.3,0,0,Math.PI*2);ctx.fillStyle='#c8a060';ctx.fill();ctx.strokeStyle='#907040';ctx.lineWidth=1.5;ctx.stroke();
      ctx.beginPath();ctx.ellipse(0,-r*.3,r*.2,r*.16,0,0,Math.PI*2);ctx.fillStyle='#c8a060';ctx.fill();ctx.strokeStyle='#907040';ctx.lineWidth=1.5;ctx.stroke();
      const st=Date.now()/400;
      for(let i=0;i<6;i++){const sa=st+i*(Math.PI/3);ctx.beginPath();ctx.arc(Math.cos(sa)*r*.35,Math.sin(sa)*r*.2,r*.04,0,Math.PI*2);ctx.fillStyle='rgba(200,170,80,0.6)';ctx.fill();}break;
    }
    case 'thunderDrum': {
      // Large drum with lightning
      ctx.beginPath();ctx.ellipse(0,r*.05,r*.28,r*.22,0,0,Math.PI*2);ctx.fillStyle='#6040a0';ctx.fill();ctx.strokeStyle='#403080';ctx.lineWidth=2;ctx.stroke();
      ctx.beginPath();ctx.ellipse(0,-r*.1,r*.28,r*.1,0,0,Math.PI*2);ctx.fillStyle='#5030a0';ctx.fill();ctx.strokeStyle='#302070';ctx.lineWidth=2;ctx.stroke();
      // Drum sticks + lightning
      for(let i=0;i<2;i++){ctx.save();ctx.translate((i===0?-1:1)*r*.12,-r*.35);ctx.rotate((i===0?-0.4:0.4));ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,r*.5);ctx.strokeStyle='#d0d0d0';ctx.lineWidth=2;ctx.stroke();ctx.restore();}
      const lt=Date.now()/200;ctx.beginPath();ctx.moveTo(-r*.1,-r*.42);ctx.lineTo(r*.04,-r*.2);ctx.lineTo(-r*.04,-r*.2);ctx.lineTo(r*.1,0);ctx.strokeStyle=`rgba(180,120,255,${0.7+Math.sin(lt)*0.3})`;ctx.lineWidth=2;ctx.stroke();break;
    }
    // ── New Epic ────────────────────────────────────────────────
    case 'phoenixTower': {
      // Phoenix flame bird
      const pht=Date.now()/300;
      // Wings
      ctx.beginPath();ctx.moveTo(0,-r*.1);ctx.quadraticCurveTo(-r*.8,-r*.2,-r*.6,r*.3);ctx.quadraticCurveTo(-r*.3,r*.1,0,-r*.1);ctx.fillStyle='rgba(255,120,20,0.8)';ctx.fill();
      ctx.beginPath();ctx.moveTo(0,-r*.1);ctx.quadraticCurveTo(r*.8,-r*.2,r*.6,r*.3);ctx.quadraticCurveTo(r*.3,r*.1,0,-r*.1);ctx.fillStyle='rgba(255,120,20,0.8)';ctx.fill();
      // Body fire
      for(let f=0;f<5;f++){ctx.beginPath();ctx.arc(Math.sin(pht+f*1.2)*r*.12,-r*.1+f*-r*.1,r*.1-f*r*.015,0,Math.PI*2);ctx.fillStyle=`rgba(255,${200-f*30},20,${0.9-f*0.15})`;ctx.fill();}
      // Tail
      ctx.beginPath();ctx.moveTo(-r*.1,r*.15);ctx.quadraticCurveTo(-r*.2,r*.6,-r*.05,r*.6);ctx.moveTo(r*.1,r*.15);ctx.quadraticCurveTo(r*.2,r*.6,r*.05,r*.6);ctx.strokeStyle='rgba(255,140,20,0.7)';ctx.lineWidth=2;ctx.stroke();break;
    }
    case 'voidStalkerTower': {
      // Shadowy assassin figure
      ctx.beginPath();ctx.ellipse(0,r*.1,r*.15,r*.28,0,0,Math.PI*2);ctx.fillStyle='rgba(40,10,70,0.95)';ctx.fill();ctx.strokeStyle='rgba(120,60,200,0.7)';ctx.lineWidth=1.5;ctx.stroke();
      ctx.beginPath();ctx.arc(0,-r*.32,r*.16,0,Math.PI*2);ctx.fillStyle='rgba(50,15,80,0.95)';ctx.fill();ctx.strokeStyle='rgba(120,60,200,0.7)';ctx.lineWidth=1.5;ctx.stroke();
      // Void eyes
      const vt=Date.now()/400;
      ctx.beginPath();ctx.arc(-r*.06,-r*.34,r*.04,0,Math.PI*2);ctx.fillStyle=`rgba(160,80,255,${0.8+Math.sin(vt)*0.2})`;ctx.fill();
      ctx.beginPath();ctx.arc(r*.06,-r*.34,r*.04,0,Math.PI*2);ctx.fillStyle=`rgba(160,80,255,${0.8+Math.sin(vt)*0.2})`;ctx.fill();
      // Void tendrils
      for(let t2=0;t2<3;t2++){const ta=vt*0.5+t2*(Math.PI*2/3);ctx.beginPath();ctx.moveTo(0,r*.0);ctx.lineTo(Math.cos(ta)*r*.45,Math.sin(ta)*r*.35);ctx.strokeStyle='rgba(100,40,160,0.4)';ctx.lineWidth=1;ctx.stroke();}break;
    }
    case 'astralCannon': {
      // Cosmic telescope/cannon
      const act=Date.now()/500;
      ctx.beginPath();ctx.rect(-r*.12,-r*.5,r*.24,r*.7);ctx.fillStyle='#5060c0';ctx.fill();ctx.strokeStyle='#4050a0';ctx.lineWidth=1.5;ctx.stroke();
      // Charging energy
      const charge=Math.sin(act)*0.5+0.5;ctx.beginPath();ctx.arc(0,-r*.5,r*.1+charge*r*.06,0,Math.PI*2);ctx.fillStyle=`rgba(100,140,255,${0.6+charge*0.4})`;ctx.fill();ctx.strokeStyle=`rgba(180,200,255,${charge})`;ctx.lineWidth=2;ctx.stroke();
      // Stars
      for(let s=0;s<4;s++){const sa=act+s*(Math.PI/2);ctx.beginPath();ctx.arc(Math.cos(sa)*r*.35,Math.sin(sa)*r*.2,r*.04,0,Math.PI*2);ctx.fillStyle='rgba(200,220,255,0.7)';ctx.fill();}break;
    }
    case 'runeForger': {
      // Dwarf with rune hammer
      ctx.beginPath();ctx.ellipse(0,r*.1,r*.2,r*.3,0,0,Math.PI*2);ctx.fillStyle='#c080e0';ctx.fill();ctx.strokeStyle='#9050c0';ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.arc(0,-r*.32,r*.18,0,Math.PI*2);ctx.fillStyle='#d0a0f0';ctx.fill();
      // Hammer
      ctx.save();ctx.translate(r*.32,-r*.15);ctx.beginPath();ctx.rect(-r*.06,-r*.2,r*.12,r*.14);ctx.fillStyle='#806090';ctx.fill();ctx.strokeStyle='#604070';ctx.lineWidth=1;ctx.stroke();ctx.beginPath();ctx.moveTo(0,-r*.06);ctx.lineTo(0,r*.28);ctx.strokeStyle='#a070c0';ctx.lineWidth=2;ctx.stroke();ctx.restore();
      // Rune glows
      const rt=Date.now()/600;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(Math.cos(rt+i*2.1)*r*.25,Math.sin(rt+i*2.1)*r*.15,r*.05,0,Math.PI*2);ctx.fillStyle='rgba(220,160,255,0.7)';ctx.fill();}break;
    }
    case 'infernoDrake': {
      // Dragon head breathing fire
      const idt=Date.now()/200;
      // Body
      ctx.beginPath();ctx.ellipse(-r*.05,r*.1,r*.22,r*.28,0.2,0,Math.PI*2);ctx.fillStyle='#c03010';ctx.fill();ctx.strokeStyle='#801000';ctx.lineWidth=1.5;ctx.stroke();
      // Head
      ctx.beginPath();ctx.ellipse(r*.18,-r*.28,r*.2,r*.14,-0.3,0,Math.PI*2);ctx.fillStyle='#d04020';ctx.fill();ctx.strokeStyle='#901010';ctx.lineWidth=1.5;ctx.stroke();
      // Eye
      ctx.beginPath();ctx.arc(r*.28,-r*.32,r*.04,0,Math.PI*2);ctx.fillStyle='#ffff00';ctx.fill();
      // Fire breath
      for(let f=0;f<4;f++){const fx=r*.38+f*r*.12;const fy=-r*.28+(Math.sin(idt+f*1.5)*r*.08);ctx.beginPath();ctx.arc(fx,fy,r*.08-f*r*.01,0,Math.PI*2);ctx.fillStyle=`rgba(255,${180-f*30},0,${0.8-f*0.18})`;ctx.fill();}
      // Wing
      ctx.beginPath();ctx.moveTo(-r*.18,-r*.08);ctx.quadraticCurveTo(-r*.6,-r*.3,-r*.5,r*.2);ctx.quadraticCurveTo(-r*.3,r*.05,-r*.18,-r*.08);ctx.fillStyle='rgba(180,30,10,0.7)';ctx.fill();break;
    }
    case 'tempestCallerTower': {
      // Wind mage with swirling air
      ctx.beginPath();ctx.moveTo(-r*.18,-r*.05);ctx.lineTo(-r*.22,r*.45);ctx.lineTo(r*.22,r*.45);ctx.lineTo(r*.18,-r*.05);ctx.closePath();ctx.fillStyle='#6080d0';ctx.fill();ctx.strokeStyle='#4060b0';ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.arc(0,-r*.28,r*.16,0,Math.PI*2);ctx.fillStyle='#b0d0f8';ctx.fill();
      // Wind spirals
      const tct=Date.now()/300;for(let i=0;i<3;i++){const ta=tct+i*(Math.PI*2/3);const tr=r*.35+i*r*.05;ctx.beginPath();ctx.arc(Math.cos(ta)*tr,Math.sin(ta)*tr*0.5,r*.06,0,Math.PI*2);ctx.fillStyle=`rgba(180,210,255,${0.4+i*0.15})`;ctx.fill();}break;
    }
    case 'deathKnight': {
      // Dark armored knight
      ctx.beginPath();ctx.rect(-r*.2,-r*.1,r*.4,r*.5);ctx.fillStyle='#302040';ctx.fill();ctx.strokeStyle='#201030';ctx.lineWidth=1.5;ctx.stroke();
      ctx.beginPath();ctx.arc(0,-r*.32,r*.2,0,Math.PI*2);ctx.fillStyle='#302040';ctx.fill();ctx.strokeStyle='#201030';ctx.lineWidth=1.5;ctx.stroke();
      // Glowing red visor
      ctx.beginPath();ctx.rect(-r*.14,-r*.36,r*.28,r*.08);ctx.fillStyle='rgba(200,30,30,0.9)';ctx.fill();
      // Dark sword
      ctx.save();ctx.translate(r*.3,-r*.15);ctx.beginPath();ctx.moveTo(0,r*.35);ctx.lineTo(0,-r*.55);ctx.strokeStyle='#a070c0';ctx.lineWidth=2.5;ctx.stroke();ctx.beginPath();ctx.moveTo(-r*.08,-r*.2);ctx.lineTo(r*.08,-r*.2);ctx.strokeStyle='#806090';ctx.lineWidth=2;ctx.stroke();ctx.restore();break;
    }
    case 'leechWraith': {
      // Ghostly cloaked figure
      const lwt=Date.now()/500;
      ctx.beginPath();ctx.moveTo(-r*.22,-r*.05);ctx.quadraticCurveTo(-r*.3,r*.3,-r*.22+Math.sin(lwt)*r*.06,r*.5);ctx.lineTo(r*.22+Math.sin(lwt+1)*r*.06,r*.5);ctx.quadraticCurveTo(r*.3,r*.3,r*.22,-r*.05);ctx.closePath();ctx.fillStyle='rgba(80,20,100,0.85)';ctx.fill();ctx.strokeStyle='rgba(180,60,220,0.6)';ctx.lineWidth=1.5;ctx.stroke();
      ctx.beginPath();ctx.arc(0,-r*.32,r*.18,0,Math.PI*2);ctx.fillStyle='rgba(100,30,130,0.9)';ctx.fill();
      // Drain tendrils
      for(let d=0;d<3;d++){const da=lwt*0.7+d*2.1;ctx.beginPath();ctx.moveTo(0,-r*.15);ctx.quadraticCurveTo(Math.cos(da)*r*.4,Math.sin(da)*r*.3,Math.cos(da)*r*.5,Math.sin(da)*r*.45);ctx.strokeStyle='rgba(200,80,255,0.4)';ctx.lineWidth=1;ctx.stroke();}
      ctx.beginPath();ctx.arc(-r*.07,-r*.34,r*.05,0,Math.PI*2);ctx.fillStyle='rgba(220,100,255,0.9)';ctx.fill();
      ctx.beginPath();ctx.arc(r*.07,-r*.34,r*.05,0,Math.PI*2);ctx.fillStyle='rgba(220,100,255,0.9)';ctx.fill();break;
    }
    case 'warpGate': {
      // Portal/gate structure
      const wgt=Date.now()/400;
      // Gate frame
      ctx.beginPath();ctx.rect(-r*.32,-r*.48,r*.64,r*.72);ctx.strokeStyle='#6030c0';ctx.lineWidth=3;ctx.stroke();
      ctx.beginPath();ctx.rect(-r*.24,-r*.38,r*.48,r*.56);ctx.strokeStyle='rgba(120,60,220,0.5)';ctx.lineWidth=1;ctx.stroke();
      // Swirling portal
      for(let i=0;i<3;i++){const pr=r*.2-i*r*.04;const pa=wgt*(1+i*0.3);ctx.beginPath();ctx.arc(Math.cos(pa)*r*.04,Math.sin(pa)*r*.04,pr,0,Math.PI*2);ctx.strokeStyle=`rgba(${100+i*40},${60+i*20},255,${0.4+i*0.15})`;ctx.lineWidth=1.5;ctx.stroke();}
      ctx.beginPath();ctx.arc(0,0,r*.08,0,Math.PI*2);ctx.fillStyle='rgba(100,50,200,0.9)';ctx.fill();break;
    }
    case 'crystalGolem': {
      // Crystal construct
      ctx.beginPath();ctx.moveTo(0,-r*.48);ctx.lineTo(r*.28,r*.1);ctx.lineTo(r*.18,r*.45);ctx.lineTo(-r*.18,r*.45);ctx.lineTo(-r*.28,r*.1);ctx.closePath();
      const cgg=ctx.createLinearGradient(0,-r*.48,0,r*.45);cgg.addColorStop(0,'rgba(100,230,210,0.9)');cgg.addColorStop(1,'rgba(40,160,150,0.8)');ctx.fillStyle=cgg;ctx.fill();ctx.strokeStyle='rgba(140,240,220,0.8)';ctx.lineWidth=1.5;ctx.stroke();
      // Crystal eyes
      ctx.beginPath();ctx.arc(-r*.1,-r*.1,r*.05,0,Math.PI*2);ctx.fillStyle='rgba(0,255,220,0.9)';ctx.fill();
      ctx.beginPath();ctx.arc(r*.1,-r*.1,r*.05,0,Math.PI*2);ctx.fillStyle='rgba(0,255,220,0.9)';ctx.fill();
      // Inner light
      const cgt=Date.now()/400;ctx.beginPath();ctx.arc(0,r*.0,r*.1+Math.sin(cgt)*r*.03,0,Math.PI*2);ctx.fillStyle='rgba(100,255,220,0.2)';ctx.fill();break;
    }
    case 'stormWyvern': {
      // Flying wyvern silhouette
      const swt=Date.now()/300;
      // Body
      ctx.beginPath();ctx.ellipse(0,-r*.05,r*.28,r*.14,0.1,0,Math.PI*2);ctx.fillStyle='#6080c0';ctx.fill();ctx.strokeStyle='#4060a0';ctx.lineWidth=1.5;ctx.stroke();
      // Wings
      ctx.beginPath();ctx.moveTo(-r*.2,-r*.05);ctx.bezierCurveTo(-r*.8,-r*.4,-r*.9,r*.2,-r*.5,r*.2);ctx.quadraticCurveTo(-r*.3,r*.05,-r*.2,-r*.05);ctx.fillStyle='rgba(80,120,200,0.8)';ctx.fill();
      ctx.beginPath();ctx.moveTo(r*.2,-r*.05);ctx.bezierCurveTo(r*.8,-r*.4,r*.9,r*.2,r*.5,r*.2);ctx.quadraticCurveTo(r*.3,r*.05,r*.2,-r*.05);ctx.fillStyle='rgba(80,120,200,0.8)';ctx.fill();
      // Lightning eye
      ctx.beginPath();ctx.arc(r*.18,-r*.08,r*.04,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,100,${0.8+Math.sin(swt)*0.2})`;ctx.fill();
      // Tail
      ctx.beginPath();ctx.moveTo(-r*.28,-r*.05);ctx.quadraticCurveTo(-r*.5,r*.2,-r*.4,r*.4);ctx.strokeStyle='rgba(80,120,200,0.7)';ctx.lineWidth=3;ctx.stroke();break;
    }
    case 'mysticWell': {
      // Stone well with magic water
      const mwt=Date.now()/600;
      // Well base
      ctx.beginPath();ctx.rect(-r*.25,r*.1,r*.5,r*.35);ctx.fillStyle='#608090';ctx.fill();ctx.strokeStyle='#406070';ctx.lineWidth=1.5;ctx.stroke();
      // Well top
      ctx.beginPath();ctx.ellipse(0,r*.08,r*.25,r*.1,0,0,Math.PI*2);ctx.fillStyle='#507080';ctx.fill();ctx.strokeStyle='#406070';ctx.lineWidth=1.5;ctx.stroke();
      // Magic water surface
      ctx.beginPath();ctx.ellipse(0,r*.12,r*.2,r*.08,0,0,Math.PI*2);ctx.fillStyle=`rgba(80,200,220,${0.6+Math.sin(mwt)*0.2})`;ctx.fill();
      // Magic wisps
      for(let i=0;i<3;i++){const wa=mwt+i*(Math.PI*2/3);ctx.beginPath();ctx.arc(Math.cos(wa)*r*.18,r*.05+Math.sin(wa)*r*.06,r*.05,0,Math.PI*2);ctx.fillStyle='rgba(100,220,240,0.6)';ctx.fill();}
      // Cross beams
      ctx.beginPath();ctx.moveTo(-r*.25,-r*.25);ctx.lineTo(r*.25,-r*.25);ctx.moveTo(0,-r*.5);ctx.lineTo(0,r*.1);ctx.strokeStyle='#604030';ctx.lineWidth=2;ctx.stroke();break;
    }
    // ── New Legendary ────────────────────────────────────────────
    case 'omegaCannon': {
      // Massive industrial cannon
      const oct=Date.now()/800;
      const charge=Math.sin(oct)*0.5+0.5;
      // Barrel
      ctx.beginPath();ctx.rect(-r*.2,-r*.6,r*.4,r*.8);ctx.fillStyle='#706050';ctx.fill();ctx.strokeStyle='#504030';ctx.lineWidth=2;ctx.stroke();
      // Reinforcement rings
      for(let i=0;i<3;i++){ctx.beginPath();ctx.rect(-r*.24,-r*.55+i*r*.22,r*.48,r*.08);ctx.fillStyle='#605040';ctx.fill();ctx.strokeStyle='#403020';ctx.lineWidth=1;ctx.stroke();}
      // Muzzle
      ctx.beginPath();ctx.ellipse(0,-r*.62,r*.18,r*.1,0,0,Math.PI*2);ctx.fillStyle='#504030';ctx.fill();ctx.strokeStyle='#302010';ctx.lineWidth=2;ctx.stroke();
      // Charge glow
      ctx.beginPath();ctx.arc(0,-r*.62,r*.12+charge*r*.08,0,Math.PI*2);ctx.fillStyle=`rgba(255,${100+charge*80},0,${charge*0.7})`;ctx.fill();
      // Base
      ctx.beginPath();ctx.rect(-r*.3,r*.22,r*.6,r*.2);ctx.fillStyle='#605040';ctx.fill();ctx.strokeStyle='#403020';ctx.lineWidth=1.5;ctx.stroke();break;
    }
    case 'lichLord': {
      // Lich king with dark crown
      const llt=Date.now()/500;
      // Robes
      ctx.beginPath();ctx.moveTo(-r*.25,-r*.05);ctx.lineTo(-r*.32,r*.5);ctx.lineTo(r*.32,r*.5);ctx.lineTo(r*.25,-r*.05);ctx.closePath();ctx.fillStyle='rgba(40,15,60,0.95)';ctx.fill();ctx.strokeStyle='rgba(100,50,150,0.7)';ctx.lineWidth=1.5;ctx.stroke();
      // Skull head
      ctx.beginPath();ctx.arc(0,-r*.32,r*.2,0,Math.PI*2);ctx.fillStyle='#d0c8b0';ctx.fill();ctx.strokeStyle='#a09880';ctx.lineWidth=1.5;ctx.stroke();
      // Skull eyes (empty)
      ctx.beginPath();ctx.arc(-r*.08,-r*.34,r*.05,0,Math.PI*2);ctx.fillStyle='rgba(80,0,120,0.9)';ctx.fill();
      ctx.beginPath();ctx.arc(r*.08,-r*.34,r*.05,0,Math.PI*2);ctx.fillStyle='rgba(80,0,120,0.9)';ctx.fill();
      // Crown
      for(let i=0;i<5;i++){const cx=-r*.2+i*r*.1;ctx.beginPath();ctx.moveTo(cx,-r*.52);ctx.lineTo(cx+r*.04,-r*.52-(i===2?r*.16:r*.1));ctx.lineTo(cx+r*.08,-r*.52);ctx.strokeStyle='#c0a000';ctx.lineWidth=2;ctx.stroke();}
      ctx.beginPath();ctx.rect(-r*.22,-r*.54,r*.44,r*.04);ctx.fillStyle='#c0a000';ctx.fill();
      // Soul wisps
      for(let s=0;s<3;s++){const sa=llt+s*2.1;ctx.beginPath();ctx.arc(Math.cos(sa)*r*.3,Math.sin(sa)*r*.2-r*.1,r*.04,0,Math.PI*2);ctx.fillStyle=`rgba(120,0,180,${0.5+Math.sin(llt+s)*0.3})`;ctx.fill();}break;
    }
    case 'celestialDragon': {
      // Holy dragon with glowing aura
      const cdt=Date.now()/350;
      // Body
      ctx.beginPath();ctx.ellipse(0,r*.05,r*.24,r*.16,0,0,Math.PI*2);ctx.fillStyle='#c0b0e8';ctx.fill();ctx.strokeStyle='#9080c0';ctx.lineWidth=1.5;ctx.stroke();
      // Wings
      ctx.beginPath();ctx.moveTo(-r*.18,-r*.05);ctx.bezierCurveTo(-r*.9,-r*.3,-r*.8,r*.3,-r*.4,r*.2);ctx.quadraticCurveTo(-r*.3,r*.0,-r*.18,-r*.05);ctx.fillStyle='rgba(200,180,255,0.75)';ctx.fill();ctx.strokeStyle='rgba(160,130,220,0.6)';ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.moveTo(r*.18,-r*.05);ctx.bezierCurveTo(r*.9,-r*.3,r*.8,r*.3,r*.4,r*.2);ctx.quadraticCurveTo(r*.3,r*.0,r*.18,-r*.05);ctx.fillStyle='rgba(200,180,255,0.75)';ctx.fill();ctx.strokeStyle='rgba(160,130,220,0.6)';ctx.lineWidth=1;ctx.stroke();
      // Head
      ctx.beginPath();ctx.ellipse(r*.28,-r*.12,r*.18,r*.12,-0.3,0,Math.PI*2);ctx.fillStyle='#d0c0f0';ctx.fill();ctx.strokeStyle='#a090d0';ctx.lineWidth=1.5;ctx.stroke();
      // Holy eye
      ctx.beginPath();ctx.arc(r*.36,-r*.16,r*.04,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,200,${0.8+Math.sin(cdt)*0.2})`;ctx.fill();
      // Holy aura
      const cdg=ctx.createRadialGradient(0,0,r*.1,0,0,r*.8);cdg.addColorStop(0,'rgba(200,180,255,0.15)');cdg.addColorStop(1,'rgba(200,180,255,0)');ctx.beginPath();ctx.arc(0,0,r*.8,0,Math.PI*2);ctx.fillStyle=cdg;ctx.fill();break;
    }
    case 'eternalFlame': {
      // Perpetual fire pillar
      const eft=Date.now()/150;
      // Base
      ctx.beginPath();ctx.ellipse(0,r*.38,r*.2,r*.1,0,0,Math.PI*2);ctx.fillStyle='#606060';ctx.fill();ctx.strokeStyle='#404040';ctx.lineWidth=1.5;ctx.stroke();
      // Flame column
      for(let f=0;f<8;f++){const fh=f/7;const fx=Math.sin(eft*1.5+f*0.8)*r*(0.12-fh*0.08);const fy=r*.35-f*r*.12;const fr=r*(0.2-fh*0.14);ctx.beginPath();ctx.arc(fx,fy,fr,0,Math.PI*2);ctx.fillStyle=`rgba(255,${200-f*22},0,${0.9-fh*0.3})`;ctx.fill();}
      // Eternal core
      ctx.beginPath();ctx.arc(0,-r*.25,r*.08,0,Math.PI*2);ctx.fillStyle='rgba(255,255,200,0.9)';ctx.fill();break;
    }
    case 'worldTree': {
      // Massive ancient tree
      const wtt=Date.now()/1000;
      // Trunk
      ctx.beginPath();ctx.rect(-r*.12,r*.0,r*.24,r*.48);ctx.fillStyle='#5c3a1e';ctx.fill();ctx.strokeStyle='#3a2010';ctx.lineWidth=1.5;ctx.stroke();
      // Roots
      for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-r*.05+i*r*.08,r*.48);ctx.quadraticCurveTo((-r*.3+i*r*.3),r*.6,(-r*.4+i*r*.4),r*.55);ctx.strokeStyle='#4a2e14';ctx.lineWidth=2;ctx.stroke();}
      // Canopy
      ctx.beginPath();ctx.arc(0,-r*.18,r*.38,0,Math.PI*2);ctx.fillStyle='#28702a';ctx.fill();ctx.strokeStyle='#186018';ctx.lineWidth=1.5;ctx.stroke();
      ctx.beginPath();ctx.arc(-r*.18,-r*.08,r*.24,0,Math.PI*2);ctx.fillStyle='#308030';ctx.fill();
      ctx.beginPath();ctx.arc(r*.18,-r*.08,r*.24,0,Math.PI*2);ctx.fillStyle='#308030';ctx.fill();
      // Glowing leaves
      for(let l=0;l<4;l++){const la=wtt+l*(Math.PI/2);ctx.beginPath();ctx.arc(Math.cos(la)*r*.28,-r*.18+Math.sin(la)*r*.2,r*.06,0,Math.PI*2);ctx.fillStyle='rgba(100,220,80,0.6)';ctx.fill();}break;
    }
    case 'stormGodTower': {
      // God-like figure with storm crown
      const sgt=Date.now()/300;
      // Robes
      ctx.beginPath();ctx.moveTo(-r*.22,-r*.05);ctx.lineTo(-r*.28,r*.5);ctx.lineTo(r*.28,r*.5);ctx.lineTo(r*.22,-r*.05);ctx.closePath();ctx.fillStyle='rgba(180,220,255,0.9)';ctx.fill();ctx.strokeStyle='rgba(100,160,220,0.7)';ctx.lineWidth=1.5;ctx.stroke();
      // Body glow
      const sgg=ctx.createRadialGradient(0,r*.2,r*.05,0,r*.2,r*.35);sgg.addColorStop(0,'rgba(150,200,255,0.3)');sgg.addColorStop(1,'rgba(150,200,255,0)');ctx.beginPath();ctx.ellipse(0,r*.2,r*.35,r*.3,0,0,Math.PI*2);ctx.fillStyle=sgg;ctx.fill();
      // Head
      ctx.beginPath();ctx.arc(0,-r*.32,r*.18,0,Math.PI*2);ctx.fillStyle='#d0e8ff';ctx.fill();ctx.strokeStyle='rgba(100,160,220,0.6)';ctx.lineWidth=1;ctx.stroke();
      // Storm crown (lightning bolts as crown)
      for(let i=0;i<5;i++){const ca=-r*.2+i*r*.1;ctx.beginPath();ctx.moveTo(ca,-r*.52);ctx.lineTo(ca+r*.03,-r*.62);ctx.lineTo(ca+r*.05,-r*.56);ctx.lineTo(ca+r*.08,-r*.66);ctx.strokeStyle=`rgba(180,220,255,${0.7+Math.sin(sgt+i)*0.3})`;ctx.lineWidth=1.5;ctx.stroke();}
      // Lightning hands
      for(let h=0;h<2;h++){const hx=(h===0?-1:1)*r*.4;const ht=sgt*(h===0?1:-1);ctx.beginPath();ctx.arc(hx+Math.cos(ht)*r*.05,-r*.05+Math.sin(ht)*r*.05,r*.07,0,Math.PI*2);ctx.fillStyle=`rgba(180,220,255,${0.6+Math.sin(sgt)*0.3})`;ctx.fill();}break;
    }

    case 'seraphGuardian': {
      // Six-winged white angel, support pose
      const t=Date.now()/800;
      // Wings (3 pairs)
      for(let w=0;w<3;w++){const wa=(w-1)*0.5+Math.sin(t+w)*0.08;ctx.save();ctx.rotate(wa);ctx.beginPath();ctx.moveTo(0,-r*.15);ctx.quadraticCurveTo(-r*.9,-r*.5,-r*.7,r*.2);ctx.quadraticCurveTo(-r*.3,-r*.1,0,-r*.15);ctx.fillStyle='rgba(255,252,230,0.7)';ctx.fill();ctx.strokeStyle='rgba(255,240,180,0.6)';ctx.lineWidth=1;ctx.stroke();ctx.restore();ctx.save();ctx.scale(-1,1);ctx.rotate(-wa);ctx.beginPath();ctx.moveTo(0,-r*.15);ctx.quadraticCurveTo(-r*.9,-r*.5,-r*.7,r*.2);ctx.quadraticCurveTo(-r*.3,-r*.1,0,-r*.15);ctx.fillStyle='rgba(255,252,230,0.7)';ctx.fill();ctx.strokeStyle='rgba(255,240,180,0.6)';ctx.lineWidth=1;ctx.stroke();ctx.restore();}
      // Halo
      ctx.beginPath();ctx.ellipse(0,-r*.62,r*.32,r*.08,0,0,Math.PI*2);ctx.strokeStyle='rgba(255,240,100,0.9)';ctx.lineWidth=2.5;ctx.stroke();
      // Body (white robe)
      ctx.beginPath();ctx.ellipse(0,r*.08,r*.18,r*.28,0,0,Math.PI*2);ctx.fillStyle='rgba(255,252,240,0.95)';ctx.fill();ctx.strokeStyle='rgba(220,210,180,0.6)';ctx.lineWidth=1;ctx.stroke();
      // Head
      ctx.beginPath();ctx.arc(0,-r*.32,r*.18,0,Math.PI*2);ctx.fillStyle='#ffe8c0';ctx.fill();ctx.strokeStyle='rgba(200,170,120,0.5)';ctx.lineWidth=1;ctx.stroke();
      // Glow
      const sg=ctx.createRadialGradient(0,0,r*.1,0,0,r*.8);sg.addColorStop(0,'rgba(255,255,200,0.15)');sg.addColorStop(1,'rgba(255,255,200,0)');ctx.beginPath();ctx.arc(0,0,r*.8,0,Math.PI*2);ctx.fillStyle=sg;ctx.fill();
      break;
    }
    case 'archangelCommander': {
      // Armored war angel, sword raised
      // Wings
      ctx.beginPath();ctx.moveTo(-r*.1,-r*.2);ctx.quadraticCurveTo(-r*1.1,-r*.3,-r*.8,r*.3);ctx.quadraticCurveTo(-r*.4,0,-r*.1,-r*.2);ctx.fillStyle='rgba(255,248,200,0.8)';ctx.fill();ctx.strokeStyle='rgba(255,220,100,0.7)';ctx.lineWidth=1.5;ctx.stroke();
      ctx.beginPath();ctx.moveTo(r*.1,-r*.2);ctx.quadraticCurveTo(r*1.1,-r*.3,r*.8,r*.3);ctx.quadraticCurveTo(r*.4,0,r*.1,-r*.2);ctx.fillStyle='rgba(255,248,200,0.8)';ctx.fill();ctx.strokeStyle='rgba(255,220,100,0.7)';ctx.lineWidth=1.5;ctx.stroke();
      // Armor body
      ctx.beginPath();ctx.roundRect(-r*.2,-r*.1,r*.4,r*.45,3);ctx.fillStyle='#d4af37';ctx.fill();ctx.strokeStyle='#a07820';ctx.lineWidth=1.5;ctx.stroke();
      // Head/helmet
      ctx.beginPath();ctx.arc(0,-r*.32,r*.2,0,Math.PI*2);ctx.fillStyle='#d4af37';ctx.fill();ctx.strokeStyle='#a07820';ctx.lineWidth=1.5;ctx.stroke();
      ctx.beginPath();ctx.moveTo(-r*.2,-r*.3);ctx.lineTo(r*.2,-r*.3);ctx.strokeStyle='rgba(255,200,50,0.8)';ctx.lineWidth=2;ctx.stroke();
      // Flaming sword
      const ft=Date.now()/200;
      ctx.save();ctx.translate(r*.28,-r*.5);ctx.rotate(0.4);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,r*.7);ctx.strokeStyle='#d4af37';ctx.lineWidth=2.5;ctx.stroke();
      for(let f=0;f<3;f++){ctx.beginPath();ctx.arc((Math.sin(ft+f*2)*r*.06),r*.1+f*r*.18,r*.05+Math.abs(Math.sin(ft+f))*r*.04,0,Math.PI*2);ctx.fillStyle=`rgba(255,${150+f*30},40,0.7)`;ctx.fill();}
      ctx.restore();
      // Halo
      ctx.beginPath();ctx.ellipse(0,-r*.58,r*.25,r*.07,0,0,Math.PI*2);ctx.strokeStyle='rgba(255,230,80,0.9)';ctx.lineWidth=2;ctx.stroke();
      break;
    }
    case 'divineOracle': {
      // Robed prophet, floating, all-seeing eye
      const ot=Date.now()/600;
      // Robe (flowing)
      ctx.beginPath();ctx.moveTo(-r*.22,-r*.1);ctx.lineTo(-r*.32,r*.5);ctx.lineTo(r*.32,r*.5);ctx.lineTo(r*.22,-r*.1);ctx.closePath();ctx.fillStyle='rgba(220,235,255,0.9)';ctx.fill();ctx.strokeStyle='rgba(160,190,240,0.6)';ctx.lineWidth=1;ctx.stroke();
      // Head
      ctx.beginPath();ctx.arc(0,-r*.32,r*.18,0,Math.PI*2);ctx.fillStyle='#e8d8c0';ctx.fill();ctx.strokeStyle='rgba(180,150,100,0.5)';ctx.lineWidth=1;ctx.stroke();
      // Hood
      ctx.beginPath();ctx.moveTo(-r*.22,-r*.28);ctx.quadraticCurveTo(-r*.24,-r*.62,0,-r*.62);ctx.quadraticCurveTo(r*.24,-r*.62,r*.22,-r*.28);ctx.fillStyle='rgba(160,190,240,0.8)';ctx.fill();
      // All-seeing eye (glowing)
      ctx.beginPath();ctx.ellipse(0,-r*.32,r*.1,r*.06,0,0,Math.PI*2);ctx.fillStyle=`rgba(100,160,255,${0.7+Math.sin(ot)*0.3})`;ctx.fill();ctx.strokeStyle='rgba(200,220,255,0.8)';ctx.lineWidth=1;ctx.stroke();
      // Floating orbs
      for(let i=0;i<3;i++){const a=ot+i*(Math.PI*2/3);ctx.beginPath();ctx.arc(Math.cos(a)*r*.45,Math.sin(a)*r*.2-r*.1,r*.06,0,Math.PI*2);ctx.fillStyle='rgba(180,210,255,0.8)';ctx.fill();}
      // Halo
      ctx.beginPath();ctx.ellipse(0,-r*.6,r*.28,r*.07,0,0,Math.PI*2);ctx.strokeStyle='rgba(200,220,255,0.8)';ctx.lineWidth=2;ctx.stroke();
      break;
    }
    case 'fallenSeraph': {
      // Corrupted dark angel, cracked wings, void energy
      const fs=Date.now()/300;
      // Cracked dark wings
      ctx.beginPath();ctx.moveTo(-r*.08,-r*.18);ctx.lineTo(-r*.9,-r*.4);ctx.lineTo(-r*.7,r*.1);ctx.lineTo(-r*.4,r*.05);ctx.lineTo(-r*.65,-r*.1);ctx.strokeStyle='rgba(160,100,220,0.8)';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='rgba(60,20,100,0.6)';ctx.fill();
      ctx.beginPath();ctx.moveTo(r*.08,-r*.18);ctx.lineTo(r*.9,-r*.4);ctx.lineTo(r*.7,r*.1);ctx.lineTo(r*.4,r*.05);ctx.lineTo(r*.65,-r*.1);ctx.strokeStyle='rgba(160,100,220,0.8)';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='rgba(60,20,100,0.6)';ctx.fill();
      // Dark robe body
      ctx.beginPath();ctx.ellipse(0,r*.1,r*.18,r*.3,0,0,Math.PI*2);ctx.fillStyle='rgba(50,20,80,0.9)';ctx.fill();ctx.strokeStyle='rgba(140,80,220,0.7)';ctx.lineWidth=1.5;ctx.stroke();
      // Head
      ctx.beginPath();ctx.arc(0,-r*.32,r*.18,0,Math.PI*2);ctx.fillStyle='#c8a8e8';ctx.fill();ctx.strokeStyle='rgba(140,80,220,0.6)';ctx.lineWidth=1;ctx.stroke();
      // Cracked halo (broken)
      ctx.beginPath();ctx.arc(0,-r*.6,r*.22,0.3,Math.PI*2-0.3);ctx.strokeStyle='rgba(180,120,255,0.7)';ctx.lineWidth=2;ctx.stroke();
      ctx.beginPath();ctx.arc(0,-r*.6,r*.22,0.0,0.2);ctx.strokeStyle='rgba(80,40,120,0.3)';ctx.lineWidth=2;ctx.stroke();
      // Void sparks
      for(let s=0;s<3;s++){const sa=fs+s*2.1;ctx.beginPath();ctx.arc(Math.cos(sa)*r*.25,Math.sin(sa)*r*.15-r*.05,r*.04,0,Math.PI*2);ctx.fillStyle=`rgba(180,100,255,${0.5+Math.sin(fs+s)*0.4})`;ctx.fill();}
      break;
    }
    case 'dawnArbiter': {
      // Towering judge angel with scales
      const dt2=Date.now()/700;
      // Grand wings
      ctx.beginPath();ctx.moveTo(-r*.1,-r*.15);ctx.bezierCurveTo(-r*1.0,-r*.2,-r*.9,r*.4,-r*.5,r*.35);ctx.quadraticCurveTo(-r*.3,r*.1,-r*.1,-r*.15);ctx.fillStyle='rgba(255,248,200,0.75)';ctx.fill();ctx.strokeStyle='rgba(255,220,100,0.6)';ctx.lineWidth=1.5;ctx.stroke();
      ctx.beginPath();ctx.moveTo(r*.1,-r*.15);ctx.bezierCurveTo(r*1.0,-r*.2,r*.9,r*.4,r*.5,r*.35);ctx.quadraticCurveTo(r*.3,r*.1,r*.1,-r*.15);ctx.fillStyle='rgba(255,248,200,0.75)';ctx.fill();ctx.strokeStyle='rgba(255,220,100,0.6)';ctx.lineWidth=1.5;ctx.stroke();
      // White robed body
      ctx.beginPath();ctx.roundRect(-r*.2,-r*.1,r*.4,r*.5,4);ctx.fillStyle='rgba(255,252,235,0.95)';ctx.fill();ctx.strokeStyle='rgba(200,180,100,0.5)';ctx.lineWidth=1;ctx.stroke();
      // Head
      ctx.beginPath();ctx.arc(0,-r*.34,r*.19,0,Math.PI*2);ctx.fillStyle='#ffe8c8';ctx.fill();ctx.strokeStyle='rgba(200,170,100,0.5)';ctx.lineWidth=1;ctx.stroke();
      // Scales (balance of judgment)
      const sb=Math.sin(dt2)*r*.05;
      ctx.beginPath();ctx.moveTo(-r*.3,-r*.02);ctx.lineTo(r*.3,-r*.02);ctx.strokeStyle='#c8a020';ctx.lineWidth=2;ctx.stroke();
      ctx.beginPath();ctx.moveTo(-r*.3,-r*.02);ctx.lineTo(-r*.3,r*.18+sb);ctx.moveTo(r*.3,-r*.02);ctx.lineTo(r*.3,r*.18-sb);ctx.strokeStyle='rgba(200,160,40,0.8)';ctx.lineWidth=1.5;ctx.stroke();
      ctx.beginPath();ctx.ellipse(-r*.3,r*.22+sb,r*.1,r*.04,0,0,Math.PI*2);ctx.fillStyle='rgba(255,215,0,0.7)';ctx.fill();
      ctx.beginPath();ctx.ellipse(r*.3,r*.22-sb,r*.1,r*.04,0,0,Math.PI*2);ctx.fillStyle='rgba(255,215,0,0.7)';ctx.fill();
      // Grand halo
      ctx.beginPath();ctx.ellipse(0,-r*.62,r*.3,r*.08,0,0,Math.PI*2);ctx.strokeStyle='rgba(255,235,80,0.9)';ctx.lineWidth=3;ctx.stroke();
      const dg=ctx.createRadialGradient(0,0,r*.2,0,0,r*.9);dg.addColorStop(0,'rgba(255,248,200,0.12)');dg.addColorStop(1,'rgba(255,248,200,0)');ctx.beginPath();ctx.arc(0,0,r*.9,0,Math.PI*2);ctx.fillStyle=dg;ctx.fill();
      break;
    }

    case 'prismTower': {
      // triangular crystal prism
      ctx.beginPath();ctx.moveTo(0,-r*.72);ctx.lineTo(r*.54,r*.42);ctx.lineTo(-r*.54,r*.42);ctx.closePath();
      const prg=ctx.createLinearGradient(-r*.54,-r*.72,r*.54,r*.42);prg.addColorStop(0,'rgba(255,255,255,0.85)');prg.addColorStop(.3,'rgba(220,230,240,0.8)');prg.addColorStop(1,'rgba(200,220,255,0.75)');ctx.fillStyle=prg;ctx.fill();ctx.strokeStyle='rgba(200,220,255,0.8)';ctx.lineWidth=1.5;ctx.stroke();
      // interior line
      ctx.beginPath();ctx.moveTo(0,-r*.72);ctx.lineTo(0,r*.42);ctx.strokeStyle='rgba(200,230,255,0.4)';ctx.lineWidth=1;ctx.stroke();
      // rainbow rays right side
      const rays=[['rgba(255,60,60,0.7)',.15],['rgba(255,165,0,0.7)',.28],['rgba(255,255,0,0.7)',.42],['rgba(60,200,60,0.7)',.56],['rgba(60,120,255,0.7)',.68],['rgba(160,60,255,0.7)',.8]];
      for(const[rc,ry]of rays){const rayY=-r*.72+ry*(r*.72+r*.42);ctx.beginPath();ctx.moveTo(r*.22,rayY);ctx.lineTo(r*.72,rayY+r*.06);ctx.strokeStyle=rc;ctx.lineWidth=1.5;ctx.stroke();}
      break;
    }

    case 'jester': {
      const jt = Date.now() / 500;
      const MODE_COLORS = ['#ff40ff','#40c0ff','#ffff40','#ff8040','#ff4080'];
      const curMode = (tower.specialState && tower.specialState.mode) || 0;
      // Body — diamond harlequin costume (alternating purple & gold diamonds)
      const diamonds = [
        {x:-r*.16,y:-r*.02,w:r*.18,h:r*.22,c:'#c820c0'},
        {x: r*.0, y:-r*.02,w:r*.18,h:r*.22,c:'#f0c020'},
        {x:-r*.16,y: r*.2, w:r*.18,h:r*.22,c:'#f0c020'},
        {x: r*.0, y: r*.2, w:r*.18,h:r*.22,c:'#c820c0'},
      ];
      // Legs
      ctx.fillStyle='#801080';ctx.fillRect(-r*.16,r*.42,r*.14,r*.26);
      ctx.fillStyle='#c0a000';ctx.fillRect(r*.02,r*.42,r*.14,r*.26);
      // Body diamonds
      for(const d of diamonds){
        ctx.save();ctx.translate(d.x+d.w/2,d.y+d.h/2);ctx.rotate(Math.PI/4);
        ctx.fillStyle=d.c;ctx.fillRect(-d.w/2,-d.h/2,d.w,d.h);ctx.restore();
      }
      // Body outline
      ctx.beginPath();ctx.moveTo(0,-r*.02);ctx.lineTo(-r*.16,r*.2);ctx.lineTo(0,r*.42);ctx.lineTo(r*.16,r*.2);ctx.closePath();
      ctx.strokeStyle='rgba(0,0,0,0.25)';ctx.lineWidth=1;ctx.stroke();
      // Head
      ctx.beginPath();ctx.arc(0,-r*.32,r*.18,0,Math.PI*2);ctx.fillStyle='#f0c880';ctx.fill();ctx.strokeStyle='rgba(0,0,0,0.2)';ctx.lineWidth=1;ctx.stroke();
      // Jester hat — two-pointed with bells
      ctx.beginPath();ctx.moveTo(-r*.22,-r*.28);ctx.lineTo(-r*.12,-r*.62);ctx.lineTo(0,-r*.44);ctx.lineTo(r*.12,-r*.62);ctx.lineTo(r*.22,-r*.28);ctx.closePath();ctx.fillStyle='#c820c0';ctx.fill();
      // Hat diamonds
      ctx.beginPath();ctx.moveTo(-r*.17,-r*.28);ctx.lineTo(-r*.12,-r*.5);ctx.lineTo(0,-r*.38);ctx.lineTo(-r*.06,-r*.28);ctx.closePath();ctx.fillStyle='#f0c020';ctx.fill();
      ctx.beginPath();ctx.moveTo(r*.06,-r*.28);ctx.lineTo(r*.12,-r*.5);ctx.lineTo(r*.17,-r*.28);ctx.closePath();ctx.fillStyle='#f0c020';ctx.fill();
      // Bells at hat tips (animated bounce)
      const b1=Math.sin(jt*2)*r*.04, b2=Math.sin(jt*2+1.5)*r*.04;
      ctx.beginPath();ctx.arc(-r*.12,-r*.65+b1,r*.07,0,Math.PI*2);ctx.fillStyle='#ffd700';ctx.fill();ctx.strokeStyle='#a08000';ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.arc(r*.12,-r*.65+b2,r*.07,0,Math.PI*2);ctx.fillStyle='#ffd700';ctx.fill();ctx.strokeStyle='#a08000';ctx.lineWidth=1;ctx.stroke();
      // Face — big smile and cheek marks
      ctx.beginPath();ctx.arc(0,-r*.28,r*.08,0.2,Math.PI-0.2);ctx.strokeStyle='#803000';ctx.lineWidth=1.5;ctx.stroke();
      for(const cx of[-r*.08,r*.08]){ctx.beginPath();ctx.arc(cx,-r*.3,r*.04,0,Math.PI*2);ctx.fillStyle='rgba(255,100,100,0.5)';ctx.fill();}
      // Eyes (animate with mode color)
      for(const ex of[-r*.07,r*.07]){ctx.beginPath();ctx.arc(ex,-r*.36,r*.025,0,Math.PI*2);ctx.fillStyle=MODE_COLORS[curMode];ctx.fill();}
      // Wand with star
      ctx.save();ctx.translate(r*.32,-r*.05);ctx.rotate(Math.sin(jt)*0.2);
      ctx.beginPath();ctx.moveTo(0,r*.1);ctx.lineTo(0,r*.55);ctx.strokeStyle='#8040a0';ctx.lineWidth=2;ctx.stroke();
      // Star at tip
      ctx.beginPath();
      for(let i=0;i<5;i++){const a=i*Math.PI*2/5-Math.PI/2;const a2=a+Math.PI/5;ctx.lineTo(Math.cos(a)*r*.1,Math.sin(a)*r*.1+r*.06);ctx.lineTo(Math.cos(a2)*r*.04,Math.sin(a2)*r*.04+r*.06);}
      ctx.closePath();ctx.fillStyle=MODE_COLORS[curMode];ctx.fill();
      ctx.restore();
      // Floating mode indicator orbs (5 small dots showing cycle position)
      for(let i=0;i<5;i++){
        const oa=jt*0.5+i*(Math.PI*2/5);
        const ox=Math.cos(oa)*r*.85, oy=Math.sin(oa)*r*.85;
        ctx.beginPath();ctx.arc(ox,oy,r*(i===curMode?0.10:0.055),0,Math.PI*2);
        ctx.fillStyle=i===curMode?MODE_COLORS[i]:'rgba(255,255,255,0.3)';ctx.fill();
      }
      break;
    }

    default: {
      // fallback glowing orb
      ctx.beginPath();ctx.arc(0,0,r*.72,0,Math.PI*2);
      const dg=ctx.createRadialGradient(-r*.2,-r*.2,r*.04,0,0,r*.72);dg.addColorStop(0,'rgba(255,255,255,0.6)');dg.addColorStop(1,tower.def.color||'rgba(100,100,180,0.8)');ctx.fillStyle=dg;ctx.fill();
      ctx.font=`bold ${Math.round(r*.55)}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff';ctx.fillText(tower.def.abbr||'?',0,0);
      break;
    }
  }

  ctx.restore();
  _tierRing(ctx, x, y, r, tc, tier);
}

function _dimColor(hex) {
  try {
    let n = parseInt(hex.replace('#',''), 16);
    const r = Math.max(0, Math.floor(((n>>16)&0xff)*0.35));
    const g = Math.max(0, Math.floor(((n>>8)&0xff)*0.35));
    const b = Math.max(0, Math.floor((n&0xff)*0.35));
    return `rgb(${r},${g},${b})`;
  } catch { return '#111'; }
}
