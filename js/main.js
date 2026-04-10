// ============================================================
//  MAIN.JS — Game loop, initialization
// ============================================================

// ---- Global game state ----
let canvas, ctx;
let gameSpeed = 1; // 0 = paused, 1 = normal, 2 = fast
let lastTime = 0;
let gameOver = false;
let gameWon = false;
let gemsEarned = 0;

const isInfiniteMode = new URLSearchParams(location.search).get('mode') === 'infinite';
const isDraftMode    = new URLSearchParams(location.search).get('mode') === 'draft';

// Draft state
let draftPool    = []; // tower keys the player has drafted this run
let draftPending = false; // true = game frozen, waiting for pick

// Game objects
let economy;
let effects;
let waveManager;
let ui;
let towers = [];
let enemies = [];
let projectiles = [];

// Input state
let hoveredCol = -1, hoveredRow = -1;
let hoveredX = -1, hoveredY = -1;

// ---- Initialization ----
function init() {
  canvas = document.getElementById('game-canvas');
  ctx = canvas.getContext('2d');

  // Size canvas to map
  canvas.width = COLS * CELL;
  canvas.height = ROWS * CELL;

  // Init subsystems
  const floatLayer = document.getElementById('float-layer');
  effects = new EffectsManager(floatLayer);
  economy = new Economy(isDraftMode ? 80 : isInfiniteMode ? 500 : 300, 20, effects);
  // Draft mode: gold only exists for upgrades — scale kill rewards way down
  if (isDraftMode) {
    const _origAdd = economy.addGold.bind(economy);
    economy.addGold = (amount, x, y) => _origAdd(Math.ceil(amount * 0.3), x, y);
  }
  // Infinite mode: slight kill gold boost to help early game
  if (isInfiniteMode) {
    const _origAdd = economy.addGold.bind(economy);
    economy.addGold = (amount, x, y) => _origAdd(Math.ceil(amount * 1.3), x, y);
  }
  waveManager = new WaveManager(economy, effects);
  waveManager.isInfinite = isInfiniteMode;

  // Set up wave callbacks
  waveManager.onWaveComplete = (waveNum) => {
    ui.showWaveBanner(`Wave ${waveNum} Complete!`);
    gemsEarned += 10;
    // Draft every 2 waves: after wave 2, 4, 6...
    if (isDraftMode && waveNum % 2 === 0) triggerDraft(waveNum + 1);
    // Gold mine wave bonus
    for (const t of towers) {
      if (t.def.key === 'goldMine' && t.specialState.waveBonusGold) {
        economy.addGold(t.specialState.waveBonusGold, t.x, t.y);
      }
    }
    // Divine Oracle wave bonus
    for (const t of towers) {
      if (t.def.key === 'divineOracle' && t.specialState.waveBonusGold > 0) {
        economy.addGold(t.specialState.waveBonusGold, t.x, t.y);
      }
    }
    ui.refreshPanel();
  };

  waveManager.onVictory = () => {
    gameWon = true;
    const score = economy.lives * 100 + economy.gold * 2 + waveManager.waveEnemiesKilled * 10;
    recordGameResult(true, gemsEarned);

    // Draft mode reward: unlock The Jester
    const user = getCurrentUser();
    if (isDraftMode && user) {
      const alreadyHas = getUnlockedUnits(user.username).includes('jester');
      if (!alreadyHas) {
        _unlockUnit(user.username, 'jester');
        showDraftReward(false);
      } else {
        // Already own it — give crystals instead
        addCrystals(user.username, 500);
        showDraftReward(true);
      }
      return; // reward screen shows first; it has its own "Home" button
    }

    ui.showVictory(`
      Score: ${score}<br>
      Lives Remaining: ${economy.lives}/${economy.maxLives}<br>
      Gold Remaining: ${economy.gold}g<br>
      Enemies Defeated: ${waveManager.waveEnemiesKilled}<br>
      💎 Gems Earned: ${gemsEarned}
    `);
  };

  function showDraftReward(alreadyOwned) {
    const overlay = document.getElementById('draft-reward-overlay');
    if (!overlay) return;
    overlay.querySelector('#reward-already-msg').style.display = alreadyOwned ? 'block' : 'none';
    overlay.querySelector('#reward-new-msg').style.display = alreadyOwned ? 'none' : 'block';
    // Draw the jester on the canvas
    const canvas = overlay.querySelector('#reward-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      const fakeTower = { def: { key: 'jester', tier: 5, color: '#d020c8', abbr: 'JE' }, specialState: { mode: 0 } };
      const r = canvas.width * 0.42;
      _drawTowerAvatar(ctx, 'jester', 0, 0, r, 5, '#d020c8', fakeTower);
      ctx.restore();
    }
    overlay.classList.remove('hidden');
    overlay.querySelector('#reward-claim-btn').onclick = () => {
      overlay.classList.add('hidden');
      const score = economy.lives * 100 + economy.gold * 2 + waveManager.waveEnemiesKilled * 10;
      ui.showVictory(`
        Score: ${score}<br>
        Lives Remaining: ${economy.lives}/${economy.maxLives}<br>
        Gold Remaining: ${economy.gold}g<br>
        Enemies Defeated: ${waveManager.waveEnemiesKilled}<br>
        💎 Gems Earned: ${gemsEarned}
      `);
    };
  }

  // Infinite mode HUD
  if (isInfiniteMode) {
    const denom = document.getElementById('wave-denom');
    if (denom) denom.textContent = '/∞';
    const prepTitle = document.getElementById('prep-title');
    if (prepTitle) prepTitle.textContent = 'The Ashen Valley — Infinite';
    const prepSub = document.getElementById('prep-subtitle');
    if (prepSub) prepSub.textContent = 'Endless waves await — survive as long as you can!';
  }

  ui = new UI(economy, waveManager, canvas);

  // Economy listeners
  economy.onGoldChange(() => { ui.refreshPanel(); if (ui.selectedTower) ui.updateTowerInfo(ui.selectedTower); });
  economy.onLivesChange((lives) => {
    if (lives <= 0 && !gameOver) {
      gameOver = true;
      recordGameResult(false, gemsEarned);
      const waveLabel = isInfiniteMode
        ? `Survived: ${waveManager.currentWave} Waves`
        : `Reached Wave: ${waveManager.currentWave}/30`;
      ui.showGameOver(`
        ${waveLabel}<br>
        Enemies Defeated: ${waveManager.waveEnemiesKilled}<br>
        Gold Earned: ${economy.totalEarned}g<br>
        💎 Gems Earned: ${gemsEarned}
      `);
    }
  });

  // Bind canvas events
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('click', onCanvasClick);
  canvas.addEventListener('contextmenu', e => { e.preventDefault(); ui.clearPlacementMode(); });

  // Start first prep phase
  waveManager.startPrep(1);
  ui.refreshPanel();

  if (isDraftMode) {
    // Draft mode: update HUD label, trigger first draft before showing prep
    const denom = document.getElementById('wave-denom');
    if (denom) denom.textContent = '/30 Draft';
    triggerDraft(1);
  } else {
    ui.showPrepOverlay();
  }

  requestAnimationFrame(gameLoop);
}

// ---- Game Loop ----
function gameLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  let rawDt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  // Cap dt to avoid huge jumps (tab unfocus etc.)
  rawDt = Math.min(rawDt, 0.05);

  const dt = rawDt * gameSpeed;

  if (!gameOver && !gameWon) {
    update(dt, rawDt);
  }

  render();
  requestAnimationFrame(gameLoop);
}

// ---- Update ----
function update(dt, rawDt) {
  if (draftPending) {
    effects.update(rawDt);
    return; // freeze game while player picks a tower
  }
  if (gameSpeed === 0) {
    // Still update effects at real time when paused
    effects.update(rawDt);
    return;
  }

  effects.update(dt);

  // Update wave manager
  waveManager.update(dt, enemies, economy.lives);

  // Prep overlay only for wave 1; waves 2+ use HUD countdown
  if (waveManager.state === 'prep' && waveManager.currentWave === 1) {
    ui.showPrepOverlay();
  } else {
    ui.hidePrepOverlay();
  }

  // Wave start banner
  if (waveManager.state === 'wave' && waveManager.spawnTimer > waveManager.spawnInterval - 0.05) {
    if (enemies.length === 0 && waveManager.spawnQueue.length === waveManager.waveEnemiesTotal - 0) {
      // First frame of wave
    }
  }

  // Apply amplifier buffs before tower updates
  applyAmplifierBuffs();

  // Update towers
  for (const tower of towers) {
    tower.update(dt, enemies, projectiles, effects, economy, towers, enemies);
  }

  // Note: ampDmgBonus / ampSpdBonus are reset at the START of applyAmplifierBuffs()
  // so they remain valid through the rest of this frame (render + UI reads).

  // Apply shielder auras (reset first, then set for nearby allies)
  for (const e of enemies) e.shielded = false;
  for (const e of enemies) {
    if (e.isShielder && !e.dead && !e.reached) {
      for (const other of enemies) {
        if (other !== e && !other.dead && !other.reached) {
          const dx = other.x - e.x, dy = other.y - e.y;
          if (dx*dx + dy*dy <= e.shieldRadius * e.shieldRadius) other.shielded = true;
        }
      }
    }
  }

  // Update enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    e.update(dt, enemies, effects);

    if (e.reached && !e._livesDeducted) {
      e._livesDeducted = true;
      economy.loseLife(e.livesLost);
      effects.addBaseHitEffect();
      effects.addFloatText(e.x, e.y, `-${e.livesLost} ❤️`, 'float-damage');
    }
  }

  // Drain pendingSpawns (Spawner minions spawned mid-wave)
  const newSpawns = [];
  for (const e of enemies) {
    if (e.pendingSpawns && e.pendingSpawns.length > 0) {
      for (const type of e.pendingSpawns) {
        const mini = new Enemy(type);
        mini.x = e.x + (Math.random() - 0.5) * 20;
        mini.y = e.y + (Math.random() - 0.5) * 20;
        mini.waypointIndex = e.waypointIndex;
        mini.distanceTraveled = e.distanceTraveled;
        newSpawns.push(mini);
        waveManager.waveEnemiesTotal++;
      }
      e.pendingSpawns = [];
    }
  }
  for (const e of newSpawns) enemies.push(e);

  // Handle Disruptor tower-stun pulses
  for (const e of enemies) {
    if (e.isDisruptor && e.disruptorJustPulsed) {
      e.disruptorJustPulsed = false;
      effects.addFloatText(e.x, e.y - 14, '⚡ DISRUPT', 'float-damage');
      for (const t of towers) {
        const dx = t.x - e.x, dy = t.y - e.y;
        if (dx*dx + dy*dy <= e.disruptorRadius * e.disruptorRadius) {
          t.towerStunTimer = Math.max(t.towerStunTimer || 0, e.disruptorStunDuration);
        }
      }
    }
  }

  // Update projectiles
  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].update(dt, enemies, effects, economy);
    if (projectiles[i].done) projectiles.splice(i, 1);
  }

  // Clean up poison puddle timers
  for (const t of towers) {
    if (t.def.key === 'poisonAlchemist' && t.specialState.puddles) {
      t.specialState.puddles = t.specialState.puddles.filter(p => {
        p.timer -= dt;
        return p.timer > 0;
      });
      // Apply puddle effects to enemies on puddle
      for (const puddle of t.specialState.puddles) {
        for (const e of enemies) {
          if (!e.dead && !e.reached && !(e.isInvisible && !e.isRevealed)) {
            const dx = e.x - puddle.x, dy = e.y - puddle.y;
            if (dx*dx + dy*dy <= puddle.r * puddle.r) {
              e.applySlow(0.85, 0.2);
              e.applyPoison(t.upgradeLevel >= 2 ? 20 : 12, 0.3);
            }
          }
        }
      }
    }
  }

  // Clean up dead/reached enemies (don't remove skeletons that are still alive)
  // Keep them for rendering until timer expires
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    if (e.dead && !e._oracleGoldChecked) {
      e._oracleGoldChecked = true;
      for (const t of towers) {
        if (t.def.key === 'divineOracle') {
          const dx = e.x - t.x, dy = e.y - t.y;
          if (dx*dx + dy*dy <= t.range * t.range) {
            const bonus = Math.floor(e.reward * t.specialState.goldBonus);
            if (bonus > 0) economy.addGold(bonus, e.x, e.y);
          }
        }
      }
    }
    // Death spawn logic (Glass Assassin → Brute; Splitter → children)
    if (e.dead && !e._deathSpawnHandled) {
      e._deathSpawnHandled = true;
      if (e.deathSpawn) {
        const spawned = new Enemy(e.deathSpawn);
        spawned.x = e.x; spawned.y = e.y;
        spawned.waypointIndex = e.waypointIndex;
        spawned.distanceTraveled = e.distanceTraveled;
        enemies.push(spawned);
        waveManager.waveEnemiesTotal++;
        effects.addFloatText(e.x, e.y - 14, '💀 BRUTE EMERGES', 'float-damage');
      }
      if (e.splitOnDeath && e.splitType) {
        for (let s = 0; s < e.splitCount; s++) {
          const child = new Enemy(e.splitType);
          child.x = e.x + (Math.random() - 0.5) * 16;
          child.y = e.y + (Math.random() - 0.5) * 16;
          child.waypointIndex = e.waypointIndex;
          child.distanceTraveled = e.distanceTraveled;
          enemies.push(child);
          waveManager.waveEnemiesTotal++;
        }
      }
    }

    if (e.dead || e.reached) {
      enemies.splice(i, 1);
    }
  }

  // Update HUD
  ui.updateHUD();
}

// ---- Apply Amplifier Buffs ----
function applyAmplifierBuffs() {
  // Reset bonuses first so re-application is clean each frame
  for (const tower of towers) {
    tower.ampDmgBonus = 1.0;
    tower.ampSpdBonus = 1.0;
  }
  // Single pass to categorize — avoids 4 separate filter() allocations
  const amps = [], archangels = [], mechanics = [], scouts = [];
  for (const t of towers) {
    switch (t.def.key) {
      case 'amplifier':           amps.push(t); break;
      case 'archangelCommander':  archangels.push(t); break;
      case 'mechanic':            mechanics.push(t); break;
      case 'scout':               scouts.push(t); break;
    }
  }

  for (const amp of amps) {
    const r2 = amp.range * amp.range;
    for (const tower of towers) {
      if (tower === amp) continue;
      const dx = tower.x - amp.x, dy = tower.y - amp.y;
      if (dx*dx + dy*dy <= r2) {
        tower.ampDmgBonus *= (1 + amp.specialState.dmgBuff);
        tower.ampSpdBonus *= (1 + amp.specialState.spdBuff);
        if (amp.specialState.cooldownReduce > 0) tower.ampSpdBonus *= (1 + amp.specialState.cooldownReduce);
      }
    }
  }

  for (const arc of archangels) {
    const r2 = arc.range * arc.range;
    for (const tower of towers) {
      if (tower === arc) continue;
      const dx = tower.x - arc.x, dy = tower.y - arc.y;
      if (dx*dx + dy*dy <= r2) {
        tower.ampSpdBonus *= (1 + arc.specialState.spdBuff);
      }
    }
  }

  for (const mec of mechanics) {
    const r2 = mec.range * mec.range;
    for (const tower of towers) {
      if (tower === mec) continue;
      const dx = tower.x - mec.x, dy = tower.y - mec.y;
      if (dx*dx + dy*dy <= r2) {
        tower.ampSpdBonus *= (1 + mec.specialState.speedBuff);
        if (mec.specialState.dmgBuff > 0) tower.ampDmgBonus *= (1 + mec.specialState.dmgBuff);
      }
    }
  }

  for (const scout of scouts) {
    const adjBuff = scout.upgradeLevel >= 2 ? 0.2 : 0.1;
    for (const tower of towers) {
      if (tower === scout) continue;
      const dcol = Math.abs(tower.col - scout.col);
      const drow = Math.abs(tower.row - scout.row);
      if (dcol <= 1 && drow <= 1) {
        tower.ampSpdBonus *= (1 + adjBuff);
      }
    }
  }
}

// ---- Draft Mode ----
function triggerDraft(waveNum) {
  // Equal chance for every tower — duplicates allowed, all 100 available
  const allKeys = TOWER_DEFS.map(d => d.key);

  // Pick 3 distinct options this offer (no same tower shown twice in one pick)
  const shuffled = [...allKeys].sort(() => Math.random() - 0.5);
  const choices  = shuffled.slice(0, 3);

  draftPending = true;
  document.getElementById('draft-wave-num').textContent = waveNum;
  document.getElementById('draft-pool-count').textContent = draftPool.length;

  const container = document.getElementById('draft-choices');
  container.innerHTML = '';

  choices.forEach((key, idx) => {
    const def = TOWER_DEFS.find(d => d.key === key);
    if (!def) return;

    const card = document.createElement('div');
    card.className = 'draft-card';
    card.style.animationDelay = `${idx * 0.12}s`;
    card.classList.add('draft-card-reveal');

    // Tower canvas preview
    const cv = document.createElement('canvas');
    cv.width = 64; cv.height = 64;
    cv.className = 'draft-card-canvas';
    try {
      const t = new Tower(key, 0, 0);
      const tctx = cv.getContext('2d');
      tctx.save();
      tctx.translate(32 - t.x, 32 - t.y);
      t.render(tctx, false);
      tctx.restore();
    } catch(e) {
      const tctx = cv.getContext('2d');
      tctx.fillStyle = def.color || '#888';
      tctx.beginPath(); tctx.arc(32,32,28,0,Math.PI*2); tctx.fill();
    }

    const tierColors = ['','#c0d080','#80c0ff','#c080ff','#ffd700','#ff8040'];
    card.innerHTML += `
      <div class="draft-card-tier-badge" style="background:${tierColors[def.tier] || '#888'}22;border-color:${tierColors[def.tier] || '#888'}88;color:${tierColors[def.tier] || '#aaa'}">T${def.tier}</div>
      <div class="draft-card-name">${def.name}</div>
      <div class="draft-card-cost">${def.cost}g</div>
      <div class="draft-card-desc">${def.description}</div>
    `;
    card.prepend(cv);

    card.addEventListener('click', () => pickDraftCard(key, waveNum));
    container.appendChild(card);
  });

  document.getElementById('draft-overlay').classList.remove('hidden');
}

function pickDraftCard(key, waveNum) {
  draftPool.push(key);
  draftPending = false;
  document.getElementById('draft-overlay').classList.add('hidden');
  document.getElementById('draft-pool-count').textContent = draftPool.length;
  ui._buildTowerPanel();
  ui.refreshPanel();
  // For wave 1, show the prep overlay then enter placement mode
  if (waveNum === 1) ui.showPrepOverlay();
  // Immediately enter placement mode for the drafted tower — it's free
  ui.startPlacing(key);
}

// ---- Render ----
function render() {
  ctx.save();
  ctx.translate(effects.shakeX, effects.shakeY);

  ctx.clearRect(-10, -10, canvas.width + 20, canvas.height + 20);

  // Draw map
  renderMap(ctx);

  // Freeform placement cursor
  if (ui.selectedTowerType !== null && hoveredX >= 0 && hoveredY >= 0) {
    const def = TOWER_DEFS.find(d => d.key === ui.selectedTowerType);
    const currentCount = towers.filter(t => t.def.key === ui.selectedTowerType).length;
    const atLimit = def && currentCount >= def.maxCount;
    const canPlace = !atLimit && isValidPlacement(hoveredX, hoveredY, towers);

    if (canPlace && def) {
      // Ghost tower
      ctx.globalAlpha = 0.55;
      ctx.beginPath(); ctx.arc(hoveredX, hoveredY, 18, 0, Math.PI * 2);
      ctx.fillStyle = def.color; ctx.fill();
      ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 2; ctx.stroke();
      ctx.globalAlpha = 1.0;
      // Range ring
      ctx.beginPath(); ctx.arc(hoveredX, hoveredY, def.range, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,215,0,0.28)'; ctx.lineWidth = 1; ctx.stroke();
    }

    // Placement indicator ring (green = ok, red = blocked)
    ctx.beginPath(); ctx.arc(hoveredX, hoveredY, 20, 0, Math.PI * 2);
    ctx.strokeStyle = canPlace ? 'rgba(80,220,60,0.9)' : 'rgba(220,60,60,0.9)';
    ctx.lineWidth = 2; ctx.stroke();
  }

  // Draw towers
  for (const tower of towers) {
    tower.render(ctx, tower === ui.selectedTower);
  }

  // Draw enemies
  for (const e of enemies) {
    e.render(ctx);
  }

  // Draw projectiles
  for (const p of projectiles) {
    p.render(ctx);
  }

  // Draw effects
  effects.render(ctx);

  ctx.restore();
}

// ---- Input Handlers ----
function onMouseMove(e) {
  const rect = canvas.getBoundingClientRect();
  hoveredX = e.clientX - rect.left;
  hoveredY = e.clientY - rect.top;
  hoveredCol = Math.floor(hoveredX / CELL);
  hoveredRow = Math.floor(hoveredY / CELL);
}

function getTowerAtPixel(px, py, radius = 22) {
  for (const t of towers) {
    const dx = px - t.x, dy = py - t.y;
    if (dx * dx + dy * dy <= radius * radius) return t;
  }
  return null;
}

function onCanvasClick(e) {
  const rect = canvas.getBoundingClientRect();
  const px = e.clientX - rect.left;
  const py = e.clientY - rect.top;

  if (ui.selectedTowerType) {
    if (isValidPlacement(px, py, towers)) {
      const def = TOWER_DEFS.find(d => d.key === ui.selectedTowerType);
      const currentCount = towers.filter(t => t.def.key === ui.selectedTowerType).length;
      if (currentCount >= def.maxCount) return;
      const canPlace = isDraftMode || economy.spendGold(def.cost);
      if (canPlace) {
        const tower = new Tower(ui.selectedTowerType, px, py);
        towers.push(tower);
        effects.addHitEffect(tower.x, tower.y, 'holy');
        ui.clearPlacementMode();
        ui.refreshPanel();
      }
    }
  } else {
    const tower = getTowerAtPixel(px, py);
    if (tower) {
      ui.selectTower(tower);
    } else {
      ui.closeTowerInfo();
    }
  }
}

// ---- Sell tower (called from UI) ----
function sellTower(tower) {
  const idx = towers.indexOf(tower);
  if (idx !== -1) towers.splice(idx, 1);
}

// ---- Speed control ----
function setGameSpeed(speed) {
  gameSpeed = speed;
  if (ui) ui.updateSpeedButtons(speed);
}

// ---- Expose waveManager globally for UI ----
let waveManagerRef = null;

// ---- Account integration ----
function initAccountUI() {
  const user = getCurrentUser();
  if (!user) return;
  const el = document.getElementById('hud-username');
  if (el) el.textContent = '⚔ ' + user.username;
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  // Admin panel
  if (user.username === 'Admin') {
    const panel = document.getElementById('admin-panel');
    if (panel) panel.classList.remove('hidden');
    document.getElementById('admin-set-wave').addEventListener('click', () => {
      const n = parseInt(document.getElementById('admin-wave-input').value, 10);
      adminSetWave(n);
    });
    document.getElementById('admin-wave-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('admin-set-wave').click();
    });
  }
}

function adminSetWave(n) {
  n = Math.max(1, Math.min(isInfiniteMode ? 9999 : 30, n || 1));
  // Clear all enemies and projectiles
  enemies.length = 0;
  projectiles.length = 0;
  // Reset wave manager to prep state for chosen wave
  waveManager.state = 'prep';
  waveManager.currentWave = n;
  waveManager.prepTimer = 3; // short 3s countdown so it starts quickly
  waveManager.spawnQueue = [];
  waveManager.activeEnemies = 0;
  gameOver = false;
  gameWon = false;
  document.getElementById('gameover-screen').classList.add('hidden');
  document.getElementById('victory-screen').classList.add('hidden');
  ui.showWaveBanner(`Admin → Wave ${n}`);
}

function recordGameResult(won, gems) {
  const user = getCurrentUser();
  if (!user) return;
  const score = waveManager
    ? (economy.lives * 100 + economy.gold * 2 + (waveManager.waveEnemiesKilled || 0) * 10)
    : 0;
  saveGameResult({
    username: user.username,
    score,
    wave: waveManager ? waveManager.currentWave : 0,
    kills: waveManager ? (waveManager.waveEnemiesKilled || 0) : 0,
    won,
    gems: gems || 0,
  });
}

// ---- Start ----
window.addEventListener('load', () => {
  initAccountUI();
  init();
});
