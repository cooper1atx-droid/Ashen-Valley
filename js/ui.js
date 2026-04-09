// ============================================================
//  UI.JS — HUD, tower panel, tower info panel
// ============================================================

class UI {
  constructor(economy, waveManager, canvas) {
    this.economy = economy;
    this.waveManager = waveManager;
    this.canvas = canvas;
    this.selectedTowerType = null; // key of tower being placed
    this.selectedTower = null;     // placed tower instance

    this._buildTowerPanel();
    this._bindControls();
  }

  _buildTowerPanel() {
    const inner = document.getElementById('tower-panel-inner');
    inner.innerHTML = '';
    const user     = typeof getCurrentUser !== 'undefined' ? getCurrentUser() : null;
    const inDraft  = typeof isDraftMode !== 'undefined' && isDraftMode;
    const unlocked = inDraft
      ? (typeof draftPool !== 'undefined' ? draftPool : [])
      : user ? getLoadout(user.username) : ['archer', 'stoneThrower', 'spearman', 'scout', 'cannon'];
    for (const def of TOWER_DEFS) {
      if (!unlocked.includes(def.key)) continue;
      const btn = document.createElement('div');
      btn.className = 'tower-btn';
      btn.dataset.key = def.key;

      // Canvas model preview
      const previewCanvas = document.createElement('canvas');
      previewCanvas.className = 'tower-btn-canvas';
      previewCanvas.width = 46;
      previewCanvas.height = 46;
      this._renderTowerPreview(previewCanvas, def.key);

      const nameEl  = document.createElement('div');
      nameEl.className = 'tower-btn-name';
      nameEl.textContent = def.name;

      const costEl  = document.createElement('div');
      costEl.className = 'tower-btn-cost';
      costEl.textContent = inDraft ? 'Draft' : `${def.cost}g`;

      const tierEl  = document.createElement('div');
      tierEl.className = 'tower-tier-badge';
      tierEl.textContent = `T${def.tier}`;

      btn.appendChild(previewCanvas);
      btn.appendChild(nameEl);
      btn.appendChild(costEl);
      btn.appendChild(tierEl);

      btn.title = `${def.name} — ${def.description}`;
      btn.addEventListener('click', () => this._onTowerBtnClick(def.key));
      btn.addEventListener('mouseenter', (e) => this._showTowerTooltip(def, e));
      btn.addEventListener('mousemove',  (e) => this._moveTowerTooltip(e));
      btn.addEventListener('mouseleave', ()  => this._hideTowerTooltip());
      inner.appendChild(btn);
    }
  }

  // Render a tower's canvas model into a small canvas element
  _renderTowerPreview(canvas, defKey) {
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    try {
      const tempTower = new Tower(defKey, 0, 0);
      // tempTower.x = CELL/2 = 24; translate to center of our preview canvas
      ctx.save();
      ctx.translate(cx - tempTower.x, cy - tempTower.y);
      tempTower.render(ctx, false);
      ctx.restore();
    } catch (e) {
      // Fallback: colored circle + abbr
      const def = TOWER_DEFS.find(d => d.key === defKey);
      ctx.fillStyle = def ? def.color : '#888';
      ctx.beginPath();
      ctx.arc(cx, cy, cx - 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = def ? (def.textColor || '#fff') : '#fff';
      ctx.font = `bold ${Math.floor(cx * 0.55)}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(def ? def.abbr : '?', cx, cy);
    }
  }

  _onTowerBtnClick(key) {
    const inDraft = typeof isDraftMode !== 'undefined' && isDraftMode;
    if (inDraft) return; // in draft mode, clicking the bar does nothing — only draft picks place towers
    if (!this.economy.canAfford(TOWER_DEFS.find(d => d.key === key).cost)) return;
    if (this.selectedTowerType === key) {
      this.clearPlacementMode();
      return;
    }
    this.selectedTowerType = key;
    this.selectedTower = null;
    this.closeTowerInfo();
    document.getElementById('placement-indicator').classList.remove('hidden');
    document.getElementById('placing-name').textContent = TOWER_DEFS.find(d => d.key === key).name;
    document.querySelectorAll('.tower-btn').forEach(b => b.classList.remove('selected'));
    const btn = document.querySelector(`.tower-btn[data-key="${key}"]`);
    if (btn) btn.classList.add('selected');
    this.canvas.style.cursor = 'crosshair';
  }

  // Public — enters placement mode without checking cost (used by draft mode)
  startPlacing(key) {
    this.selectedTowerType = key;
    this.selectedTower = null;
    this.closeTowerInfo();
    document.getElementById('placement-indicator').classList.remove('hidden');
    document.getElementById('placing-name').textContent = TOWER_DEFS.find(d => d.key === key).name;
    document.querySelectorAll('.tower-btn').forEach(b => b.classList.remove('selected'));
    const btn = document.querySelector(`.tower-btn[data-key="${key}"]`);
    if (btn) btn.classList.add('selected');
    this.canvas.style.cursor = 'crosshair';
  }

  clearPlacementMode() {
    this.selectedTowerType = null;
    document.getElementById('placement-indicator').classList.add('hidden');
    document.querySelectorAll('.tower-btn').forEach(b => b.classList.remove('selected'));
    this.canvas.style.cursor = 'default';
  }

  _bindControls() {
    // Speed buttons
    document.getElementById('btn-pause').addEventListener('click', () => setGameSpeed(0));
    document.getElementById('btn-1x').addEventListener('click', () => setGameSpeed(1));
    document.getElementById('btn-2x').addEventListener('click', () => setGameSpeed(2));

    // Auto skip toggle
    document.getElementById('btn-auto-skip').addEventListener('click', () => {
      this.waveManager.autoSkip = !this.waveManager.autoSkip;
      document.getElementById('btn-auto-skip').classList.toggle('active', this.waveManager.autoSkip);
      if (!this.waveManager.autoSkip) {
        // Turning off: cancel any pending auto skip countdown
        this.waveManager.autoSkipTimer = -1;
      }
    });

    // Tower info close
    document.getElementById('ti-close').addEventListener('click', () => this.closeTowerInfo());

    // Tower upgrade
    document.getElementById('ti-upgrade-btn').addEventListener('click', () => {
      if (!this.selectedTower) return;
      const cost = this.selectedTower.getNextUpgradeCost();
      if (cost === null) return;
      if (!this.economy.spendGold(cost)) return;
      this.selectedTower.upgrade();
      this.updateTowerInfo(this.selectedTower);
      this.refreshPanel();
    });

    // Tower sell
    document.getElementById('ti-sell-btn').addEventListener('click', () => {
      if (!this.selectedTower) return;
      const val = this.selectedTower.getSellValue();
      this.economy.addGold(val);
      sellTower(this.selectedTower);
      this.closeTowerInfo();
      this.refreshPanel();
    });

    // Start early button
    document.getElementById('btn-start-early').addEventListener('click', () => {
      this.waveManager.startEarly();
      document.getElementById('prep-overlay').classList.add('hidden');
    });

    // Right click to cancel placement
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.clearPlacementMode();
    });

    // Retry
    document.getElementById('btn-retry').addEventListener('click', () => location.reload());
    document.getElementById('btn-play-again').addEventListener('click', () => location.reload());
    document.getElementById('btn-home').addEventListener('click', () => window.location.href = 'hub.html');
    document.getElementById('btn-home-defeat').addEventListener('click', () => window.location.href = 'hub.html');
  }

  selectTower(tower) {
    this.selectedTower = tower;
    this.clearPlacementMode();
    this.updateTowerInfo(tower);
    document.getElementById('tower-info').classList.remove('hidden');
  }

  _showTowerTooltip(def, e) {
    const tip = document.getElementById('tower-tooltip');
    let statsHtml = '';
    if (def.damage > 0)      statsHtml += `Damage: <b>${def.damage}</b><br>`;
    if (def.attackSpeed > 0) statsHtml += `Attack Speed: <b>${def.attackSpeed}s</b><br>`;
    if (def.range > 0 && def.range < 9000) statsHtml += `Range: <b>${def.range}px</b><br>`;
    if (def.aoeRadius)       statsHtml += `AoE Radius: <b>${def.aoeRadius}px</b><br>`;
    if (def.pierceCount)     statsHtml += `Pierce: <b>${def.pierceCount}</b><br>`;
    const _inDraft = typeof isDraftMode !== 'undefined' && isDraftMode;
    if (!_inDraft) statsHtml += `Cost: <b>${def.cost}g</b><br>`;
    statsHtml += `Tier: <b>${def.tier}</b>`;
    tip.innerHTML = `
      <div class="tt-name">${def.name}</div>
      <div class="tt-desc">${def.description || ''}</div>
      <div class="tt-stats">${statsHtml}</div>
      ${def.abilityName ? `<div class="tt-ability">⚡ <b>${def.abilityName}:</b> ${def.abilityDesc || ''}</div>` : ''}
    `;
    tip.classList.remove('hidden');
    this._moveTowerTooltip(e);
  }

  _moveTowerTooltip(e) {
    const tip = document.getElementById('tower-tooltip');
    const pad = 12;
    let x = e.clientX + pad;
    let y = e.clientY - tip.offsetHeight - pad;
    if (x + tip.offsetWidth > window.innerWidth)  x = e.clientX - tip.offsetWidth - pad;
    if (y < 0) y = e.clientY + pad;
    tip.style.left = x + 'px';
    tip.style.top  = y + 'px';
  }

  _hideTowerTooltip() {
    document.getElementById('tower-tooltip').classList.add('hidden');
  }

  closeTowerInfo() {
    this.selectedTower = null;
    document.getElementById('tower-info').classList.add('hidden');
  }

  updateTowerInfo(tower) {
    if (!tower) return;
    document.getElementById('ti-name').textContent = tower.def.name;

    // Render the tower's current model into the info panel preview
    const previewEl = document.getElementById('ti-preview');
    if (previewEl) {
      const pCtx = previewEl.getContext('2d');
      const cx = previewEl.width / 2;
      const cy = previewEl.height / 2;
      pCtx.clearRect(0, 0, previewEl.width, previewEl.height);
      pCtx.save();
      pCtx.translate(cx - tower.x, cy - tower.y);
      tower.render(pCtx, false);
      pCtx.restore();
    }

    // Preview next upgrade deltas
    const deltas = tower.previewNextUpgrade(); // null if max level

    function deltaTag(val, invert) {
      if (!val || val === 0) return '';
      // invert=true means negative delta is good (e.g. faster attack speed)
      const isGood = invert ? val < 0 : val > 0;
      const sign = val > 0 ? '+' : '';
      return `<span class="ti-delta ${isGood ? 'ti-delta-good' : 'ti-delta-bad'}">${sign}${val}</span>`;
    }

    // Current stats at upgrade level — show effective (boosted) values
    const dmgBonus  = tower.ampDmgBonus  || 1.0;
    const spdBonus  = tower.ampSpdBonus  || 1.0;
    const hasMend   = tower.mendSpdTimer   > 0;
    const hasOclock = tower.overclockTimer > 0;
    const totalSpdBonus = spdBonus * (hasMend ? 1.2 : 1) * (hasOclock ? 1.3 : 1);
    const isBoostedDmg = dmgBonus  > 1.001;
    const isBoostedSpd = totalSpdBonus > 1.001;

    function boostTag(label, val, extra) {
      return `<span class="ti-boosted" title="${label}">${extra ? extra + ' ' : ''}${val} ▲</span>`;
    }

    let statsHtml = '';
    if (tower.damage > 0) {
      const effDmg = Math.round(tower.damage * dmgBonus);
      const d = deltas && deltas.damage !== 0 ? deltaTag(deltas.damage, false) : '';
      const valHtml = isBoostedDmg
        ? `<span class="ti-stat-val-base">${tower.damage}</span>${boostTag('Boosted by ally', effDmg)}${d}`
        : `${tower.damage}${d}`;
      statsHtml += `<div class="ti-stat-row"><span class="ti-stat-label">⚔ Damage</span><span class="ti-stat-val">${valHtml}</span></div>`;
    }
    if (tower.attackSpeed > 0) {
      const effInterval = tower.getEffectiveAttackInterval();
      const d = deltas && deltas.attackSpeed !== 0 ? deltaTag(parseFloat(deltas.attackSpeed.toFixed(2)), true) : '';
      const valHtml = isBoostedSpd
        ? `<span class="ti-stat-val-base">${tower.attackSpeed.toFixed(2)}s</span>${boostTag('Boosted by ally', effInterval.toFixed(2) + 's')}${d}`
        : `${tower.attackSpeed.toFixed(2)}s${d}`;
      statsHtml += `<div class="ti-stat-row"><span class="ti-stat-label">⚡ Atk Speed</span><span class="ti-stat-val">${valHtml}</span></div>`;
    }
    if (tower.range > 0 && tower.range < 9000) {
      const d = deltas && deltas.range !== 0 ? deltaTag(deltas.range, false) : '';
      statsHtml += `<div class="ti-stat-row"><span class="ti-stat-label">◎ Range</span><span class="ti-stat-val">${tower.range}px${d}</span></div>`;
    }
    if (tower.def.key === 'goldMine') {
      statsHtml += `<div class="ti-stat-row"><span class="ti-stat-label">💰 Income</span><span class="ti-stat-val">${tower.specialState.incomePerInterval}g/${tower.specialState.interval}s</span></div>`;
    }
    statsHtml += `<div class="ti-stat-row"><span class="ti-stat-label">★ Level</span><span class="ti-stat-val">${tower.upgradeLevel}/3</span></div>`;
    statsHtml += `<div class="ti-stat-row"><span class="ti-stat-label">☠ Kills</span><span class="ti-stat-val">${tower.kills}</span></div>`;
    document.getElementById('ti-stats').innerHTML = statsHtml;

    // Ability box
    const abilityEl = document.getElementById('ti-ability-box');
    if (tower.def.abilityName) {
      abilityEl.innerHTML = `<span class="ti-ability-name">⚡ ${tower.def.abilityName}</span><span class="ti-ability-desc">${tower.def.abilityDesc || ''}</span>`;
      abilityEl.classList.remove('hidden');
    } else {
      abilityEl.classList.add('hidden');
    }

    // Upgrade button
    const upgBtn = document.getElementById('ti-upgrade-btn');
    const nextCost = tower.getNextUpgradeCost();
    if (nextCost === null) {
      upgBtn.textContent = 'Max Upgrade';
      upgBtn.disabled = true;
    } else {
      const upgDesc = tower.def.upgrades[tower.upgradeLevel].desc;
      upgBtn.textContent = `Upgrade → ${upgDesc} (${nextCost}g)`;
      upgBtn.disabled = !this.economy.canAfford(nextCost);
    }

    // Sell button
    const sellVal = tower.getSellValue();
    document.getElementById('ti-sell-btn').textContent = `Sell → +${sellVal}g`;
  }

  updateHUD() {
    // Refresh selected tower info every frame so boost indicators stay current
    if (this.selectedTower && !this.selectedTower.dead) {
      this.updateTowerInfo(this.selectedTower);
    }
    document.getElementById('lives-val').textContent = `${this.economy.lives}/${this.economy.maxLives}`;
    document.getElementById('gold-val').textContent = this.economy.gold;
    const wn = this.waveManager.currentWave;
    document.getElementById('wave-val').textContent = wn === 0 ? '0' : wn;

    let timerText = '--';
    if (this.waveManager.state === 'prep' && wn > 1) {
      timerText = `${Math.ceil(this.waveManager.prepTimer)}s`;
    } else if (this.waveManager.state === 'wave') {
      if (this.waveManager.autoSkip && this.waveManager.autoSkipTimer >= 0) {
        timerText = `${Math.ceil(this.waveManager.autoSkipTimer)}s`;
      } else {
        timerText = '⚔';
      }
    }
    document.getElementById('timer-val').textContent = timerText;
  }

  refreshPanel() {
    document.querySelectorAll('.tower-btn').forEach(btn => {
      const key = btn.dataset.key;
      const def = TOWER_DEFS.find(d => d.key === key);
      if (!def) return;
      const count = typeof towers !== 'undefined' ? towers.filter(t => t.def.key === key).length : 0;
      const atLimit = count >= def.maxCount;
      const inDraft = typeof isDraftMode !== 'undefined' && isDraftMode;
      btn.classList.toggle('unaffordable', !inDraft && !atLimit && !this.economy.canAfford(def.cost));
      btn.classList.toggle('draft-locked', inDraft);
      btn.classList.toggle('at-limit', atLimit);

      // Update or create the count badge
      let badge = btn.querySelector('.tower-count-badge');
      if (!badge) {
        badge = document.createElement('div');
        badge.className = 'tower-count-badge';
        btn.appendChild(badge);
      }
      badge.textContent = `${count}/${def.maxCount}`;
    });
  }

  showPrepOverlay() {
    document.getElementById('prep-overlay').classList.remove('hidden');
  }

  hidePrepOverlay() {
    document.getElementById('prep-overlay').classList.add('hidden');
  }

  showWaveBanner(text) {
    const banner = document.getElementById('wave-banner');
    const bannerText = document.getElementById('wave-banner-text');
    bannerText.textContent = text;
    banner.classList.remove('hidden');
    // Re-trigger animation
    bannerText.style.animation = 'none';
    bannerText.offsetHeight; // reflow
    bannerText.style.animation = 'bannerPop 2s ease-out forwards';
    setTimeout(() => banner.classList.add('hidden'), 2000);
  }

  showGameOver(stats) {
    document.getElementById('gameover-stats').innerHTML = stats;
    document.getElementById('gameover-screen').classList.remove('hidden');
  }

  showVictory(score) {
    document.getElementById('victory-score').innerHTML = score;
    document.getElementById('victory-screen').classList.remove('hidden');
  }

  updateSpeedButtons(speed) {
    document.getElementById('btn-pause').classList.toggle('active', speed === 0);
    document.getElementById('btn-1x').classList.toggle('active', speed === 1);
    document.getElementById('btn-2x').classList.toggle('active', speed === 2);
  }
}
