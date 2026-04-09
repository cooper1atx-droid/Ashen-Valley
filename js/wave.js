// ============================================================
//  WAVE.JS — Wave manager, wave compositions
// ============================================================

const TOTAL_WAVES = 30;

// Infinite mode wave composition (wave 31+)
// ramp(excess, startAt, step): returns 0 until excess >= startAt, then +1 per `step` waves
function ramp(excess, startAt, step) {
  if (excess < startAt) return 0;
  return Math.floor((excess - startAt) / step) + 1;
}

function buildInfiniteWaveComposition(waveNum) {
  const enemies = [];
  const excess = waveNum - 30; // 1, 2, 3, ...

  // Core enemies — always present, scale steadily
  const grunt     = 8 + excess * 2;
  const armored   = 6 + excess * 2;
  const speeders  = 5 + excess * 2;
  const flyers    = 4 + excess;
  const tanks     = 1 + Math.floor(excess * 0.6);   // tanks start slower
  const invisible = 3 + excess;
  const healers   = 1 + Math.floor(excess / 2);

  // New enemies — introduced gradually across waves 34–45
  // Glass Assassin: wave 34 (excess 4), +1 per wave
  const glassAssassins = ramp(excess, 4, 1);
  // Splitter: wave 36 (excess 6), +1 every 2 waves
  const splitters      = ramp(excess, 6, 2);
  // Spawner: wave 38 (excess 8), +1 every 3 waves
  const spawners       = ramp(excess, 8, 3);
  // Shielder: wave 41 (excess 11), +1 every 4 waves — powerful support
  const shielders      = ramp(excess, 11, 4);
  // Disruptor: wave 45 (excess 15), +1 every 5 waves — most disruptive
  const disruptors     = ramp(excess, 15, 5);

  for (let i = 0; i < grunt;          i++) enemies.push('grunt');
  for (let i = 0; i < armored;        i++) enemies.push('armored');
  for (let i = 0; i < speeders;       i++) enemies.push('speeder');
  for (let i = 0; i < flyers;         i++) enemies.push('flyer');
  for (let i = 0; i < tanks;          i++) enemies.push('tank');
  for (let i = 0; i < invisible;      i++) enemies.push('invisible');
  for (let i = 0; i < healers;        i++) enemies.push('healer');
  for (let i = 0; i < glassAssassins; i++) enemies.push('glass_assassin');
  for (let i = 0; i < splitters;      i++) enemies.push('splitter');
  for (let i = 0; i < spawners;       i++) enemies.push('spawner');
  for (let i = 0; i < shielders;      i++) enemies.push('shielder');
  for (let i = 0; i < disruptors;     i++) enemies.push('disruptor');

  // Boss every 10 waves; double boss every 20 waves
  if (waveNum % 20 === 0) {
    enemies.push('boss');
    enemies.push('boss');
  } else if (waveNum % 10 === 0) {
    enemies.push('boss');
  }

  return enemies;
}

// Wave compositions
function buildWaveComposition(waveNum) {
  const enemies = [];

  if (waveNum <= 5) {
    // Waves 1-5: Grunts only
    const counts = [5, 8, 10, 12, 15];
    const count = counts[waveNum - 1];
    for (let i = 0; i < count; i++) enemies.push('grunt');
  } else if (waveNum <= 10) {
    // Waves 6-10: Grunts + Armored + first Speeder
    const grunt = 6 + (waveNum - 6) * 2;
    const armored = Math.floor((waveNum - 5) * 1.5);
    const speeders = waveNum >= 8 ? 2 + (waveNum - 8) : 0;
    for (let i = 0; i < grunt; i++) enemies.push('grunt');
    for (let i = 0; i < armored; i++) enemies.push('armored');
    for (let i = 0; i < speeders; i++) enemies.push('speeder');
  } else if (waveNum <= 20) {
    // Waves 11-20: Elites, Flyers, Invisible; Boss at wave 15; new enemies introduced
    const grunt = 4 + (waveNum - 10);
    const armored = 3 + (waveNum - 10);
    const speeders = 3 + (waveNum - 10) * 2;
    const flyers = waveNum >= 12 ? 2 + (waveNum - 12) : 0;
    const invisible = waveNum >= 13 ? 2 + (waveNum - 13) : 0;
    const healers = waveNum >= 14 ? 1 : 0;
    const glassAssassins = waveNum >= 12 ? 1 + Math.floor((waveNum - 12) / 2) : 0;
    const splitters = waveNum >= 14 ? 1 + Math.floor((waveNum - 14) / 3) : 0;
    const spawners = waveNum >= 16 ? 1 + Math.floor((waveNum - 16) / 2) : 0;
    const shielders = waveNum >= 18 ? 1 + Math.floor((waveNum - 18) / 2) : 0;
    const disruptors = waveNum >= 20 ? 1 : 0;
    for (let i = 0; i < grunt; i++) enemies.push('grunt');
    for (let i = 0; i < armored; i++) enemies.push('armored');
    for (let i = 0; i < speeders; i++) enemies.push('speeder');
    for (let i = 0; i < flyers; i++) enemies.push('flyer');
    for (let i = 0; i < invisible; i++) enemies.push('invisible');
    for (let i = 0; i < healers; i++) enemies.push('healer');
    for (let i = 0; i < glassAssassins; i++) enemies.push('glass_assassin');
    for (let i = 0; i < splitters; i++) enemies.push('splitter');
    for (let i = 0; i < spawners; i++) enemies.push('spawner');
    for (let i = 0; i < shielders; i++) enemies.push('shielder');
    for (let i = 0; i < disruptors; i++) enemies.push('disruptor');
    if (waveNum === 15) enemies.push('boss');
  } else {
    // Waves 21-30: Heavy Armored, Flyers, Tanks; Boss every 5 waves; all new types scale
    const grunt = 5 + (waveNum - 20);
    const armored = 6 + (waveNum - 20) * 2;
    const speeders = 5 + (waveNum - 20) * 2;
    const flyers = 4 + (waveNum - 20) * 2;
    const tanks = Math.floor((waveNum - 18) / 2);
    const invisible = 3 + (waveNum - 20);
    const healers = 2 + Math.floor((waveNum - 20) / 2);
    const glassAssassins = 2 + (waveNum - 20);
    const splitters = 1 + Math.floor((waveNum - 20) / 2);
    const spawners = 1 + Math.floor((waveNum - 20) / 3);
    const shielders = 1 + Math.floor((waveNum - 20) / 2);
    const disruptors = 1 + Math.floor((waveNum - 20) / 3);
    for (let i = 0; i < grunt; i++) enemies.push('grunt');
    for (let i = 0; i < armored; i++) enemies.push('armored');
    for (let i = 0; i < speeders; i++) enemies.push('speeder');
    for (let i = 0; i < flyers; i++) enemies.push('flyer');
    for (let i = 0; i < tanks; i++) enemies.push('tank');
    for (let i = 0; i < invisible; i++) enemies.push('invisible');
    for (let i = 0; i < healers; i++) enemies.push('healer');
    for (let i = 0; i < glassAssassins; i++) enemies.push('glass_assassin');
    for (let i = 0; i < splitters; i++) enemies.push('splitter');
    for (let i = 0; i < spawners; i++) enemies.push('spawner');
    for (let i = 0; i < shielders; i++) enemies.push('shielder');
    for (let i = 0; i < disruptors; i++) enemies.push('disruptor');
    if (waveNum % 5 === 0) enemies.push('boss');
    if (waveNum === 30) enemies.push('boss');
  }

  return enemies;
}

class WaveManager {
  constructor(economy, effects) {
    this.economy = economy;
    this.effects = effects;
    this.currentWave = 0;
    this.state = 'prep'; // 'prep', 'wave', 'complete', 'victory'
    this.prepTimer = 30;
    this.spawnQueue = [];
    this.spawnTimer = 0;
    this.spawnInterval = 0.8; // seconds between spawns
    this.activeEnemies = 0;
    this.waveEnemiesTotal = 0;
    this.waveEnemiesKilled = 0;
    this.waveEnemiesReached = 0;
    this.autoSkip = false;
    this.autoSkipTimer = -1;   // countdown after last spawn when autoSkip is on
    this.onWaveComplete = null;
    this.onGameOver = null;
    this.onVictory = null;
    this.isInfinite = false;
  }

  // Called to start the prep phase before wave N
  startPrep(waveNum) {
    this.currentWave = waveNum;
    this.state = 'prep';
    // Wave 1: wait for button. Auto skip: already waited 5s after last spawn, start immediately.
    // Normal waves 2+: 5s countdown.
    this.prepTimer = waveNum === 1 ? 99999 : (this.autoSkip ? 0 : 3);
  }

  // Only used for wave 1 start button
  startEarly() {
    if (this.state !== 'prep') return;
    this.startWave();
  }

  startWave() {
    if (this.state !== 'prep') return;
    this.state = 'wave';

    const composition = (this.isInfinite && this.currentWave > TOTAL_WAVES)
      ? buildInfiniteWaveComposition(this.currentWave)
      : buildWaveComposition(this.currentWave);
    // Shuffle slightly for variety, but keep boss at end
    const bosses = composition.filter(t => t === 'boss');
    const nonBosses = composition.filter(t => t !== 'boss');
    // Simple shuffle non-bosses
    for (let i = nonBosses.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nonBosses[i], nonBosses[j]] = [nonBosses[j], nonBosses[i]];
    }
    this.spawnQueue = [...nonBosses, ...bosses];
    this.waveEnemiesTotal = this.spawnQueue.length;
    this.waveEnemiesKilled = 0;
    this.waveEnemiesReached = 0;
    this.spawnTimer = 0;
    this.activeEnemies = 0;
    this.autoSkipTimer = -1;
  }

  update(dt, enemies, lives) {
    if (this.state === 'prep') {
      this.prepTimer -= dt;
      if (this.prepTimer <= 0) {
        this.startWave();
      }
      return;
    }

    if (this.state !== 'wave') return;

    // Spawn enemies
    if (this.spawnQueue.length > 0) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this.spawnTimer = this.spawnInterval;
        const type = this.spawnQueue.shift();
        const enemy = new Enemy(type);
        if (this.isInfinite) {
          if (this.currentWave > TOTAL_WAVES) {
            // Scale enemies up beyond wave 30
            const scale = 1 + (this.currentWave - TOTAL_WAVES) * 0.15;
            enemy.hp    = Math.ceil(enemy.hp    * scale);
            enemy.maxHp = Math.ceil(enemy.maxHp * scale);
            enemy.reward = Math.ceil(enemy.reward * (1 + (this.currentWave - TOTAL_WAVES) * 0.08));
          } else if (this.currentWave <= 20) {
            // Scale enemies down for early waves so new players can survive
            // Wave 1 = 45% HP, ramps up to 100% by wave 20
            const hpScale = 0.45 + (this.currentWave - 1) * (0.55 / 19);
            enemy.hp    = Math.ceil(enemy.hp    * hpScale);
            enemy.maxHp = Math.ceil(enemy.maxHp * hpScale);
          }
        }
        enemies.push(enemy);
        this.activeEnemies++;
      }
    }

    // Check dead/reached enemies
    for (const e of enemies) {
      if ((e.dead || e.reached) && !e._counted) {
        e._counted = true;
        if (e.dead) {
          this.waveEnemiesKilled++;
        } else if (e.reached) {
          this.waveEnemiesReached++;
          const livesLost = e.livesLost || 1;
          if (this.onGameOver) {
            // Let main.js handle lives
          }
        }
      }
    }

    // Auto skip: start 5s countdown the moment the last enemy leaves the spawn queue
    if (this.autoSkip && this.spawnQueue.length === 0 && this.autoSkipTimer < 0) {
      this.autoSkipTimer = 3;
    }
    if (this.autoSkip && this.autoSkipTimer >= 0) {
      this.autoSkipTimer -= dt;
      if (this.autoSkipTimer <= 0) {
        this._waveComplete(enemies);
        return;
      }
    }

    // Normal: wave complete when no more to spawn AND all enemies gone
    if (!this.autoSkip) {
      const remaining = enemies.filter(e => !e.dead && !e.reached && !e.isSkeleton);
      if (this.spawnQueue.length === 0 && remaining.length === 0) {
        this._waveComplete(enemies);
      }
    }
  }

  _waveComplete(enemies) {
    if (this.state !== 'wave') return;
    this.state = 'complete';

    // Clean up enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
      if (enemies[i].dead || enemies[i].reached) enemies.splice(i, 1);
    }

    // Wave completion bonus (infinite mode gets a bigger bonus to help sustain)
    const baseBonus = 25 + this.currentWave * 2;
    const bonus = this.isInfinite ? Math.ceil(baseBonus * 1.5) : baseBonus;
    this.economy.addGold(bonus);
    this.effects.addFloatText(COLS * CELL / 2, ROWS * CELL / 2 - 40, `+${bonus}g Wave Bonus!`, 'float-gold');

    if (this.onWaveComplete) this.onWaveComplete(this.currentWave);

    if (!this.isInfinite && this.currentWave >= TOTAL_WAVES) {
      this.state = 'victory';
      if (this.onVictory) this.onVictory();
    } else {
      this.startPrep(this.currentWave + 1);
    }
  }

  getTimerDisplay() {
    if (this.state === 'prep') {
      return Math.ceil(this.prepTimer);
    }
    return '--';
  }
}
