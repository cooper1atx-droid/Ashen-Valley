// ============================================================
//  ENEMY.JS — Enemy types, path following, spawning
// ============================================================

let enemyIdCounter = 0;

// Enemy type definitions
const ENEMY_TYPES = {
  grunt: {
    name: 'Grunt',
    hp: 60, speed: 80, armor: 0, reward: 8,
    color: '#c8783c', size: 9, livesLost: 1,
    shape: 'triangle'
  },
  speeder: {
    name: 'Speeder',
    hp: 30, speed: 160, armor: 0, reward: 6,
    color: '#f0e040', size: 7, livesLost: 1,
    shape: 'triangle'
  },
  armored: {
    name: 'Armored',
    hp: 150, speed: 50, armor: 0.4, reward: 20,
    color: '#7090b0', size: 11, livesLost: 1,
    shape: 'square'
  },
  flyer: {
    name: 'Flyer',
    hp: 80, speed: 100, armor: 0.1, reward: 12,
    color: '#c080f0', size: 9, livesLost: 1,
    shape: 'diamond',
    isFlyer: true
  },
  tank: {
    name: 'Tank',
    hp: 400, speed: 30, armor: 0.6, reward: 40,
    color: '#5090a0', size: 15, livesLost: 2,
    shape: 'hexagon'
  },
  healer: {
    name: 'Healer',
    hp: 40, speed: 80, armor: 0, reward: 15,
    color: '#60e090', size: 8, livesLost: 1,
    shape: 'circle',
    isHealer: true, healRadius: 60, healPerSec: 5
  },
  invisible: {
    name: 'Invisible',
    hp: 70, speed: 80, armor: 0, reward: 10,
    color: '#9090c0', size: 9, livesLost: 1,
    shape: 'triangle',
    isInvisible: true
  },
  boss: {
    name: 'Boss',
    hp: 1200, speed: 40, armor: 0.3, reward: 200,
    color: '#e04040', size: 18, livesLost: 3,
    shape: 'star',
    isBoss: true
  },
  // ── New enemy types ──
  spawner: {
    name: 'Spawner',
    hp: 350, speed: 45, armor: 0.2, reward: 35,
    color: '#a06030', size: 14, livesLost: 2,
    shape: 'hexagon',
    isSpawner: true, spawnInterval: 4, spawnType: 'spawner_mini', spawnCount: 2
  },
  spawner_mini: {
    name: 'Spawn Imp',
    hp: 40, speed: 110, armor: 0, reward: 4,
    color: '#c08050', size: 6, livesLost: 1,
    shape: 'triangle'
  },
  glass_assassin: {
    name: 'Glass Assassin',
    hp: 45, speed: 220, armor: 0, reward: 18,
    color: '#e8d060', size: 7, livesLost: 1,
    shape: 'diamond',
    deathSpawn: 'brute'
  },
  brute: {
    name: 'Brute',
    hp: 500, speed: 35, armor: 0.5, reward: 25,
    color: '#905040', size: 16, livesLost: 2,
    shape: 'hexagon'
  },
  splitter: {
    name: 'Splitter',
    hp: 120, speed: 70, armor: 0, reward: 12,
    color: '#d06080', size: 10, livesLost: 1,
    shape: 'square',
    splitOnDeath: true, splitType: 'splitter_child', splitCount: 2
  },
  splitter_child: {
    name: 'Split Half',
    hp: 55, speed: 90, armor: 0, reward: 5,
    color: '#e080a0', size: 7, livesLost: 1,
    shape: 'triangle',
    splitOnDeath: true, splitType: 'splitter_tiny', splitCount: 2
  },
  splitter_tiny: {
    name: 'Split Shard',
    hp: 22, speed: 105, armor: 0, reward: 2,
    color: '#f0b0c0', size: 4, livesLost: 1,
    shape: 'triangle'
  },
  shielder: {
    name: 'Shielder',
    hp: 200, speed: 55, armor: 0.3, reward: 28,
    color: '#5080d0', size: 12, livesLost: 1,
    shape: 'square',
    isShielder: true, shieldRadius: 70, shieldReduction: 0.4
  },
  disruptor: {
    name: 'Disruptor',
    hp: 140, speed: 65, armor: 0.1, reward: 22,
    color: '#b030e0', size: 11, livesLost: 1,
    shape: 'diamond',
    isDisruptor: true, disruptorRadius: 110, disruptorStunDuration: 1.5, disruptorInterval: 4
  }
};

// Path waypoints in pixel coords (center of each waypoint tile)
function buildPixelWaypoints() {
  return PATH_WAYPOINTS.map(wp => ({
    x: wp.col * CELL + CELL / 2,
    y: wp.row * CELL + CELL / 2
  }));
}

class Enemy {
  constructor(type) {
    this.id = enemyIdCounter++;
    const def = ENEMY_TYPES[type];
    this.type = type;
    this.name = def.name;
    this.maxHp = def.hp;
    this.hp = def.hp;
    this.baseSpeed = def.speed;
    this.speed = def.speed;
    this.armor = def.armor;
    this.reward = def.reward;
    this.color = def.color;
    this.size = def.size;
    this.livesLost = def.livesLost;
    this.shape = def.shape;
    this.isFlyer = def.isFlyer || false;
    this.isHealer = def.isHealer || false;
    this.isInvisibleType = def.isInvisible || false; // whether this enemy type can toggle
    this.isInvisible = def.isInvisible || false;     // current visibility state
    this.isBoss = def.isBoss || false;
    this.isRevealed = false; // revealed by scout
    this.invisToggleTimer = 1.0; // seconds until next visibility flip

    // Flyers take direct path from spawn to base
    if (this.isFlyer) {
      const spawnWp = PATH_WAYPOINTS[0];
      const baseWp = PATH_WAYPOINTS[PATH_WAYPOINTS.length - 1];
      this.waypoints = [
        { x: spawnWp.col * CELL + CELL / 2, y: spawnWp.row * CELL + CELL / 2 },
        { x: baseWp.col * CELL + CELL / 2, y: baseWp.row * CELL + CELL / 2 }
      ];
    } else {
      this.waypoints = buildPixelWaypoints();
    }

    const start = this.waypoints[0];
    this.x = start.x;
    this.y = start.y;
    this.waypointIndex = 1;
    this.distanceTraveled = 0;
    this.reached = false;
    this.dead = false;
    this.angle = 0;

    // Status effects
    this.slowFactor = 1.0;   // multiplied into speed (1.0 = normal)
    this.stunTimer = 0;
    this.frozen = false;
    this.frozenTimer = 0;
    this.burnTimer = 0;
    this.burnDamage = 0;
    this.burnTick = 0;
    this.poisonTimer = 0;
    this.poisonDamage = 0;
    this.poisonTick = 0;
    this.chillStacks = 0;
    this.chillTimer = 0;
    this.frozenDmgBonus = false; // +30% dmg bonus when frozen
    this.burningDmgBonus = false; // +20% all dmg when burning
    this.corrodedArmor = 0; // from poison alchemist upgrade
    this.markedByScout = false; // +15% damage taken
    this.sanctified = false; // -15% armor from healer monk
    this.taunted = false;    // stone golem taunt: -15% armor
    this.lichCursed = false; // lich lord curse: +20% damage taken
    this.blackHolePulled = false; // black hole effect
    this.cursed = false;    // bone shaman / shadow priest curse
    this.curseBonus = 0;    // bone shaman: +% damage taken
    this.curseTimer = 0;    // bone shaman: duration
    this.curseSpread = 0;   // shadow priest: spread % of damage to nearby
    this.flareMarked = false;   // flare post: bonus damage
    this.flareMarkBonus = 0;
    this.marked = false;        // watch post: bonus damage
    this.markBonus = 0;
    this.mirrorSpread = 0;      // mirror mage: spread % of damage to nearby
    this.mirrorTargets = 2;
    this.mirrorEnemies = null;

    // Spin-up tracking (for Gatling)
    this.gatlingConsecutive = {};

    // Healer
    this.healRadius = def.healRadius || 0;
    this.healPerSec = def.healPerSec || 0;
    this.healTick = 0;

    // Spawner
    this.isSpawner = def.isSpawner || false;
    this.spawnInterval = def.spawnInterval || 4;
    this.spawnType = def.spawnType || null;
    this.spawnCount = def.spawnCount || 0;
    this.spawnerTimer = def.spawnInterval || 4;
    // Death spawn (Glass Assassin → Brute)
    this.deathSpawn = def.deathSpawn || null;
    // Splitter
    this.splitOnDeath = def.splitOnDeath || false;
    this.splitType = def.splitType || null;
    this.splitCount = def.splitCount || 0;
    // Shielder
    this.isShielder = def.isShielder || false;
    this.shieldRadius = def.shieldRadius || 0;
    this.shieldReduction = def.shieldReduction || 0;
    this.shielded = false; // set each frame by main.js
    // Disruptor
    this.isDisruptor = def.isDisruptor || false;
    this.disruptorRadius = def.disruptorRadius || 0;
    this.disruptorStunDuration = def.disruptorStunDuration || 0;
    this.disruptorInterval = def.disruptorInterval || 4;
    this.disruptorTimer = def.disruptorInterval || 4;
    this.disruptorJustPulsed = false;
    // Mid-wave spawn queue (drained by main.js)
    this.pendingSpawns = [];

    // For skeleton (Necromancer)
    this.isSkeleton = false;
    this.skeletonTimer = 0;
    this.skeletonMaxTime = 0;
    this.skeletonX = 0;
    this.skeletonY = 0;
  }

  getEffectiveArmor() {
    let armor = this.armor;
    if (this.corrodedArmor) armor *= (1 - 0.2);
    if (this.sanctified) armor *= (1 - 0.15);
    if (this.taunted)    armor *= (1 - 0.15);
    return Math.max(0, armor);
  }

  takeDamage(dmg, source, isSpread = false) {
    if (this.dead) return 0;
    let finalDmg = dmg * (1 - this.getEffectiveArmor());
    if (this.shielded) finalDmg *= 0.6; // shielder aura: 40% damage reduction
    // Bonus damage modifiers
    if (this.frozen && this.frozenDmgBonus) finalDmg *= 1.3;
    if (this.burnTimer > 0 && this.burningDmgBonus) finalDmg *= 1.2;
    if (this.markedByScout) finalDmg *= 1.15;
    if (this.flareMarked && this.flareMarkBonus) finalDmg *= (1 + this.flareMarkBonus);
    if (this.marked && this.markBonus) finalDmg *= (1 + this.markBonus);
    if (this.blackHolePulled) finalDmg *= 1.5;
    if (this.lichCursed) finalDmg *= 1.20;
    if (this.cursed && this.curseBonus > 0) finalDmg *= (1 + this.curseBonus);
    this.hp -= finalDmg;
    if (this.hp <= 0) {
      this.hp = 0;
      this.dead = true;
    }
    // Mirror Mage — spread % of damage to nearby enemies (not from spread hits)
    if (!isSpread && finalDmg > 0 && this.mirrorSpread > 0 && this.mirrorEnemies) {
      const spreadDmg = finalDmg * this.mirrorSpread;
      const targets = this.mirrorEnemies
        .filter(o => o !== this && !o.dead && !o.reached)
        .filter(o => { const dx = o.x-this.x, dy = o.y-this.y; return dx*dx+dy*dy <= 80*80; })
        .slice(0, this.mirrorTargets || 2);
      for (const o of targets) o.takeDamage(spreadDmg, source, true);
    }
    return finalDmg;
  }

  applyBurn(dmgPerSec, duration) {
    this.burnDamage = Math.max(this.burnDamage, dmgPerSec);
    this.burnTimer = Math.max(this.burnTimer, duration);
  }

  applyPoison(dmgPerSec, duration) {
    this.poisonDamage = Math.max(this.poisonDamage, dmgPerSec);
    this.poisonTimer = Math.max(this.poisonTimer, duration);
  }

  applySlow(factor, duration) {
    // factor: 0.0 = stop, 1.0 = normal speed
    this.slowFactor = Math.min(this.slowFactor, factor);
    this.slowTimer = Math.max(this.slowTimer || 0, duration);
  }

  applyFreeze(duration) {
    this.frozen = true;
    this.frozenTimer = Math.max(this.frozenTimer, duration);
    this.chillStacks = 0;
  }

  applyStun(duration) {
    this.stunTimer = Math.max(this.stunTimer, duration);
  }

  applyChill(extraStack) {
    this.chillStacks = Math.min(5, this.chillStacks + (extraStack || 1));
    this.chillTimer = 3.0; // stacks decay after 3s
  }

  update(dt, allEnemies, effects) {
    if (this.dead || this.reached) return;

    // Invisible toggle: flicker between visible and invisible every 1s
    if (this.isInvisibleType && !this.isRevealed) {
      this.invisToggleTimer -= dt;
      if (this.invisToggleTimer <= 0) {
        this.isInvisible = !this.isInvisible;
        this.invisToggleTimer = 1.0;
      }
    }

    // Skeleton: seeks nearest enemy, attacks on contact, expires after timer
    if (this.isSkeleton) {
      this.skeletonTimer -= dt;
      if (this.skeletonTimer <= 0) { this.dead = true; return; }

      // Find nearest living non-skeleton enemy
      let nearest = null, nearestDist = Infinity;
      for (const e of allEnemies) {
        if (e === this || e.dead || e.reached || e.isSkeleton) continue;
        if (e.isInvisible && !e.isRevealed) continue;
        const dx = e.x - this.x, dy = e.y - this.y;
        const d = dx*dx + dy*dy;
        if (d < nearestDist) { nearestDist = d; nearest = e; }
      }

      if (nearest) {
        const dx = nearest.x - this.x, dy = nearest.y - this.y;
        const dist = Math.sqrt(nearestDist);
        if (dist > 14) {
          // Move toward enemy
          this.x += (dx / dist) * 65 * dt;
          this.y += (dy / dist) * 65 * dt;
        } else {
          // Attack on collision
          this.skeletonAttackTimer = (this.skeletonAttackTimer || 0) - dt;
          if (this.skeletonAttackTimer <= 0) {
            this.skeletonAttackTimer = 0.4;
            nearest.takeDamage(20, null);
          }
        }
      }
      return;
    }

    // Status timers
    this.stunTimer = Math.max(0, this.stunTimer - dt);
    if (this.frozen) {
      this.frozenTimer -= dt;
      if (this.frozenTimer <= 0) {
        this.frozen = false;
        this.chillStacks = 0;
      }
    }

    // Slow timer
    if (this.slowTimer > 0) {
      this.slowTimer -= dt;
      if (this.slowTimer <= 0) {
        this.slowTimer = 0;
        this.slowFactor = 1.0;
      }
    } else {
      this.slowFactor = 1.0;
    }

    // Bone Shaman curse decay
    if (this.curseTimer > 0) {
      this.curseTimer -= dt;
      if (this.curseTimer <= 0) { this.curseTimer = 0; this.curseBonus = 0; this.cursed = false; }
    }

    // Chill decay
    if (this.chillTimer > 0) {
      this.chillTimer -= dt;
      if (this.chillTimer <= 0) {
        this.chillStacks = 0;
        this.chillTimer = 0;
      }
    }

    // Burn DoT
    if (this.burnTimer > 0) {
      this.burnTimer -= dt;
      this.burnTick += dt;
      while (this.burnTick >= 0.25) {
        const dmg = this.burnDamage * 0.25 * (1 - this.getEffectiveArmor());
        this.hp -= dmg;
        if (this.hp <= 0) { this.hp = 0; this.dead = true; }
        this.burnTick -= 0.25;
      }
      if (this.burnTimer <= 0) { this.burnDamage = 0; this.burnTick = 0; }
    }

    // Poison DoT
    if (this.poisonTimer > 0) {
      this.poisonTimer -= dt;
      this.poisonTick += dt;
      while (this.poisonTick >= 0.25) {
        const dmg = this.poisonDamage * 0.25 * (1 - this.getEffectiveArmor());
        this.hp -= dmg;
        if (this.hp <= 0) { this.hp = 0; this.dead = true; }
        this.poisonTick -= 0.25;
      }
      if (this.poisonTimer <= 0) { this.poisonDamage = 0; this.poisonTick = 0; }
    }

    if (this.dead) return;

    // Healer ability
    if (this.isHealer) {
      this.healTick += dt;
      if (this.healTick >= 1.0) {
        this.healTick -= 1.0;
        for (const e of allEnemies) {
          if (!e.dead && !e.reached && e !== this) {
            const dx = e.x - this.x, dy = e.y - this.y;
            if (dx * dx + dy * dy <= this.healRadius * this.healRadius) {
              e.hp = Math.min(e.maxHp, e.hp + this.healPerSec);
            }
          }
        }
      }
    }

    // Spawner: periodically push minions to pendingSpawns
    if (this.isSpawner) {
      this.spawnerTimer -= dt;
      if (this.spawnerTimer <= 0) {
        this.spawnerTimer = this.spawnInterval;
        for (let i = 0; i < this.spawnCount; i++) {
          this.pendingSpawns.push(this.spawnType);
        }
      }
    }

    // Disruptor: periodic stun pulse — actual tower stun applied in main.js
    if (this.isDisruptor) {
      this.disruptorTimer -= dt;
      if (this.disruptorTimer <= 0) {
        this.disruptorTimer = this.disruptorInterval;
        this.disruptorJustPulsed = true;
      }
    }

    // Movement
    if (this.stunTimer > 0 || this.frozen) return;

    let effectiveSpeed = this.speed;
    if (this.chillStacks > 0) {
      effectiveSpeed *= (1 - this.chillStacks * 0.05); // each stack = 5% slow (max 25% at 5)
    }
    effectiveSpeed *= this.slowFactor;

    const target = this.waypoints[this.waypointIndex];
    if (!target) {
      this.reached = true;
      return;
    }

    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    this.angle = Math.atan2(dy, dx);

    const step = effectiveSpeed * dt;
    if (dist <= step) {
      this.x = target.x;
      this.y = target.y;
      this.distanceTraveled += dist;
      this.waypointIndex++;
      if (this.waypointIndex >= this.waypoints.length) {
        this.reached = true;
      }
    } else {
      this.x += (dx / dist) * step;
      this.y += (dy / dist) * step;
      this.distanceTraveled += step;
    }
  }

  // Progress along path (0 = start, 1 = end) for targeting
  getProgress() {
    return this.distanceTraveled;
  }

  render(ctx) {
    if (this.dead) return;

    const x = this.x, y = this.y;
    const r = this.size;
    const invisible = this.isInvisible && !this.isRevealed;

    ctx.save();
    if (invisible) {
      // Fade in/out over last 0.2s of each 1s cycle for a smooth flicker
      const fadeWindow = 0.2;
      const t = this.invisToggleTimer;
      const alpha = t < fadeWindow ? 0.18 + (1 - 0.18) * (1 - t / fadeWindow)
                  : t > 1.0 - fadeWindow ? 0.18 + (1 - 0.18) * ((t - (1.0 - fadeWindow)) / fadeWindow)
                  : 0.18;
      ctx.globalAlpha = Math.min(1, Math.max(0.18, alpha));
    }

    // Status glow (reduced blur for performance)
    if (this.frozen)              { ctx.shadowColor = '#80c0ff'; ctx.shadowBlur = 6; }
    else if (this.burnTimer  > 0) { ctx.shadowColor = '#ff6600'; ctx.shadowBlur = 5; }
    else if (this.poisonTimer> 0) { ctx.shadowColor = '#80ff40'; ctx.shadowBlur = 5; }
    else if (this.stunTimer  > 0) { ctx.shadowColor = '#ffff40'; ctx.shadowBlur = 5; }

    ctx.translate(x, y);
    ctx.rotate(this.angle + Math.PI / 2);  // face direction of travel

    _drawEnemyAvatar(ctx, this.type, r, this);

    ctx.restore();
    ctx.save();

    // HP bar
    if (!invisible) {
      const barW = r * 3.2, barH = 4;
      const bx = x - barW / 2, by = y - r - 11;
      ctx.fillStyle = '#1a0000';
      ctx.fillRect(bx, by, barW, barH);
      const pct = Math.max(0, this.hp / this.maxHp);
      ctx.fillStyle = pct > 0.5 ? '#22dd44' : pct > 0.25 ? '#ffcc00' : '#ee3322';
      ctx.fillRect(bx, by, barW * pct, barH);
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(bx, by, barW, barH);
    }

    if (this.isBoss) {
      ctx.font = 'bold 8px Arial';
      ctx.fillStyle = '#ff6060';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('⬆ BOSS', x, y + r + 4);
    }

    ctx.restore();
  }
}

// ============================================================
//  Skeleton (Necromancer raised dead)
// ============================================================
function createSkeleton(x, y, duration) {
  const sk = new Enemy('grunt');
  sk.isSkeleton = true;
  sk.x = x;
  sk.y = y;
  sk.hp = 60;
  sk.maxHp = 60;
  sk.color = '#c0c0c0';
  sk.shape = 'circle';
  sk.size = 8;
  sk.skeletonTimer = duration;
  sk.skeletonMaxTime = duration;
  sk.skeletonAttackTimer = 0;
  sk.speed = 0;
  sk.dead = false;
  sk.reached = false;
  sk.distanceTraveled = 999999; // max progress = behind all enemies
  sk.waypointIndex = 999;
  sk.reward = 0; // no reward for skeletons
  return sk;
}

// ============================================================
//  _drawEnemyAvatar — unique per-type pseudo-3D enemy visuals
//  ctx is already translated to (x,y) and rotated to face travel dir
// ============================================================
function _grad3(ctx, r, light, mid, dark) {
  const g = ctx.createRadialGradient(-r*0.3, -r*0.4, r*0.1, 0, 0, r*1.1);
  g.addColorStop(0,   light);
  g.addColorStop(0.5, mid);
  g.addColorStop(1,   dark);
  return g;
}

function _tri(ctx, r) {
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.lineTo(-r * 0.82, r * 0.82);
  ctx.lineTo( r * 0.82, r * 0.82);
  ctx.closePath();
}

function _drawEnemyAvatar(ctx, type, r, enemy) {
  // Mobile skeleton (Lich Lord raised dead) — draw as skull
  if (enemy.isSkeleton) {
    ctx.save();
    // Body — pale greenish-white
    ctx.beginPath(); ctx.ellipse(0, r*0.2, r*0.45, r*0.55, 0, 0, Math.PI*2);
    ctx.fillStyle = '#c8d4c0'; ctx.fill();
    ctx.strokeStyle = '#607060'; ctx.lineWidth = 1; ctx.stroke();
    // Skull
    ctx.beginPath(); ctx.arc(0, -r*0.25, r*0.42, 0, Math.PI*2);
    ctx.fillStyle = '#d8e0d0'; ctx.fill();
    ctx.strokeStyle = '#607060'; ctx.lineWidth = 1; ctx.stroke();
    // Eye sockets
    ctx.fillStyle = '#202820';
    ctx.beginPath(); ctx.ellipse(-r*0.15, -r*0.28, r*0.12, r*0.14, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse( r*0.15, -r*0.28, r*0.12, r*0.14, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -r*0.25, r*0.42, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(128,60,200,0.5)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.restore();
    return;
  }

  const isBoss = enemy.isBoss;
  const bs     = isBoss ? 1.4 : 1.0;

  ctx.save();
  ctx.scale(bs, bs);

  switch (type) {

    // ── GRUNT — hunched green goblin ──
    case 'grunt': {
      // Body
      ctx.beginPath(); ctx.ellipse(0, r*0.22, r*0.52, r*0.62, 0, 0, Math.PI*2);
      const gbg = ctx.createLinearGradient(0, -r*0.35, 0, r*0.85);
      gbg.addColorStop(0,'#8ac050'); gbg.addColorStop(0.5,'#507030'); gbg.addColorStop(1,'#203010');
      ctx.fillStyle = gbg; ctx.fill();
      // Big ears
      for (const s of [-1,1]) {
        ctx.beginPath(); ctx.moveTo(s*r*0.33,-r*0.36); ctx.lineTo(s*r*0.76,-r*0.58); ctx.lineTo(s*r*0.56,-r*0.14); ctx.closePath();
        ctx.fillStyle = '#70a040'; ctx.fill();
      }
      // Head
      ctx.beginPath(); ctx.ellipse(0,-r*0.4,r*0.4,r*0.38,0,0,Math.PI*2);
      const ghg = ctx.createRadialGradient(-r*0.1,-r*0.52,r*0.04,0,-r*0.4,r*0.4);
      ghg.addColorStop(0,'#a0d060'); ghg.addColorStop(1,'#3a5018');
      ctx.fillStyle = ghg; ctx.fill();
      // Eyes
      for (const ex of [-r*0.16,r*0.16]) {
        ctx.beginPath(); ctx.ellipse(ex,-r*0.45,r*0.1,r*0.085,0,0,Math.PI*2);
        ctx.fillStyle='#dd1808'; ctx.fill();
        ctx.beginPath(); ctx.arc(ex+r*0.038,-r*0.47,r*0.032,0,Math.PI*2);
        ctx.fillStyle='rgba(255,200,140,0.9)'; ctx.fill();
      }
      // Angry brows
      ctx.beginPath(); ctx.moveTo(-r*0.33,-r*0.58); ctx.lineTo(-r*0.1,-r*0.53);
      ctx.moveTo(r*0.1,-r*0.53); ctx.lineTo(r*0.33,-r*0.58);
      ctx.strokeStyle='#180800'; ctx.lineWidth=2; ctx.stroke();
      // Fangs
      ctx.beginPath(); ctx.arc(0,-r*0.27,r*0.17,0.2,Math.PI-0.2); ctx.strokeStyle='#100800'; ctx.lineWidth=1.5; ctx.stroke();
      for (const fx of [-r*0.085,r*0.085]) {
        ctx.beginPath(); ctx.moveTo(fx,-r*0.24); ctx.lineTo(fx-r*0.038,-r*0.13); ctx.lineTo(fx+r*0.038,-r*0.13); ctx.closePath();
        ctx.fillStyle='#e8dfc0'; ctx.fill();
      }
      // Horns
      for (const s of [-1,1]) {
        ctx.beginPath(); ctx.moveTo(s*r*0.2,-r*0.75); ctx.lineTo(s*r*0.28,-r*0.96); ctx.lineTo(s*r*0.11,-r*0.73); ctx.closePath();
        ctx.fillStyle='#804020'; ctx.fill();
      }
      break;
    }

    // ── SPEEDER — swift bat-demon with wings ──
    case 'speeder': {
      // Wings
      for (const s of [-1,1]) {
        ctx.beginPath(); ctx.moveTo(s*r*0.14,-r*0.07); ctx.lineTo(s*r*1.02,-r*0.36); ctx.lineTo(s*r*0.86,r*0.56); ctx.lineTo(s*r*0.17,r*0.26); ctx.closePath();
        const swg = ctx.createLinearGradient(s*r*0.18,0,s*r*1.02,0);
        swg.addColorStop(0,'#c09018'); swg.addColorStop(1,'#584010');
        ctx.fillStyle=swg; ctx.fill(); ctx.strokeStyle='#f0c030'; ctx.lineWidth=0.6; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(s*r*0.14,-r*0.05); ctx.lineTo(s*r*0.86,r*0.48);
        ctx.strokeStyle='rgba(255,220,80,0.4)'; ctx.lineWidth=1; ctx.stroke();
      }
      // Slim body
      ctx.beginPath(); ctx.ellipse(0,r*0.1,r*0.19,r*0.5,0,0,Math.PI*2);
      const sbbg = ctx.createLinearGradient(0,-r*0.42,0,r*0.62);
      sbbg.addColorStop(0,'#e8b820'); sbbg.addColorStop(1,'#583808');
      ctx.fillStyle=sbbg; ctx.fill();
      // Head
      ctx.beginPath(); ctx.ellipse(0,-r*0.53,r*0.21,r*0.19,0,0,Math.PI*2); ctx.fillStyle='#c08818'; ctx.fill();
      // Glowing eyes
      for (const ex of [-r*0.09,r*0.09]) {
        ctx.beginPath(); ctx.arc(ex,-r*0.55,r*0.062,0,Math.PI*2); ctx.fillStyle='#ffff30'; ctx.fill();
      }
      // Tail
      ctx.beginPath(); ctx.moveTo(0,r*0.56); ctx.quadraticCurveTo(r*0.28,r*0.88,r*0.05,r*1.08);
      ctx.strokeStyle='#c08818'; ctx.lineWidth=2.5; ctx.lineCap='round'; ctx.stroke(); ctx.lineCap='butt';
      ctx.beginPath(); ctx.moveTo(r*0.05,r*1.08); ctx.lineTo(r*0.13,r*1.02); ctx.lineTo(-r*0.05,r*1.18); ctx.closePath();
      ctx.fillStyle='#c08818'; ctx.fill();
      break;
    }

    // ── ARMORED — heavy plate-armored orc with glowing visor ──
    case 'armored': {
      // Shoulder pads
      for (const s of [-1,1]) {
        ctx.beginPath(); ctx.ellipse(s*r*0.66,0,r*0.27,r*0.19,s*0.35,0,Math.PI*2);
        const asg = ctx.createLinearGradient(s*r*0.38,-r*0.18,s*r,r*0.18);
        asg.addColorStop(0,'#888'); asg.addColorStop(1,'#282828');
        ctx.fillStyle=asg; ctx.fill(); ctx.strokeStyle='#b0b0b0'; ctx.lineWidth=0.8; ctx.stroke();
      }
      // Body armor
      ctx.beginPath(); ctx.moveTo(-r*0.5,-r*0.07); ctx.lineTo(-r*0.5,r*0.9); ctx.lineTo(r*0.5,r*0.9); ctx.lineTo(r*0.5,-r*0.07); ctx.closePath();
      const abg = ctx.createLinearGradient(0,-r*0.07,0,r*0.9);
      abg.addColorStop(0,'#666'); abg.addColorStop(0.5,'#363636'); abg.addColorStop(1,'#121212');
      ctx.fillStyle=abg; ctx.fill(); ctx.strokeStyle='#888'; ctx.lineWidth=1.5; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-r*0.5,r*0.27); ctx.lineTo(r*0.5,r*0.27); ctx.moveTo(-r*0.5,r*0.58); ctx.lineTo(r*0.5,r*0.58);
      ctx.strokeStyle='rgba(155,155,155,0.3)'; ctx.lineWidth=1; ctx.stroke();
      // Helmet
      ctx.beginPath(); ctx.arc(0,-r*0.36,r*0.44,Math.PI,Math.PI*2); ctx.lineTo(r*0.44,-r*0.07); ctx.lineTo(-r*0.44,-r*0.07); ctx.closePath();
      const ahg = ctx.createLinearGradient(0,-r*0.8,0,-r*0.07);
      ahg.addColorStop(0,'#757575'); ahg.addColorStop(1,'#222');
      ctx.fillStyle=ahg; ctx.fill(); ctx.strokeStyle='#aaa'; ctx.lineWidth=1.2; ctx.stroke();
      // Visor slit
      ctx.beginPath(); ctx.rect(-r*0.26,-r*0.3,r*0.52,r*0.115); ctx.fillStyle='#ff8020'; ctx.fill();
      break;
    }

    // ── FLYER — harpy with bat-wings and glowing eyes ──
    case 'flyer': {
      for (const s of [-1,1]) {
        ctx.beginPath();
        ctx.moveTo(s*r*0.17,-r*0.27);
        ctx.bezierCurveTo(s*r*0.74,-r*0.86,s*r*1.26,-r*0.05,s*r*1.06,r*0.66);
        ctx.bezierCurveTo(s*r*0.64,r*0.46,s*r*0.37,r*0.26,s*r*0.13,r*0.17);
        ctx.closePath();
        const fwg = ctx.createLinearGradient(s*r*0.17,-r*0.28,s*r*1.24,r*0.58);
        fwg.addColorStop(0,'#7a2888'); fwg.addColorStop(1,'#200a28');
        ctx.fillStyle=fwg; ctx.fill(); ctx.strokeStyle='#b850d0'; ctx.lineWidth=0.8; ctx.stroke();
        for (let wi=1;wi<=3;wi++) {
          ctx.beginPath(); ctx.moveTo(s*r*0.15,-r*0.21+wi*r*0.1); ctx.lineTo(s*r*(0.54+wi*0.17),r*(wi*0.13-0.07));
          ctx.strokeStyle='rgba(190,90,210,0.3)'; ctx.lineWidth=0.8; ctx.stroke();
        }
      }
      ctx.beginPath(); ctx.ellipse(0,r*0.17,r*0.27,r*0.46,0,0,Math.PI*2); ctx.fillStyle='#883878'; ctx.fill();
      ctx.beginPath(); ctx.ellipse(0,-r*0.38,r*0.27,r*0.25,0,0,Math.PI*2); ctx.fillStyle='#b85898'; ctx.fill();
      for (const ex of [-r*0.11,r*0.11]) {
        ctx.beginPath(); ctx.arc(ex,-r*0.4,r*0.072,0,Math.PI*2); ctx.fillStyle='#ff80ff'; ctx.fill();
      }
      break;
    }

    // ── TANK — massive stone ogre with boulder fists ──
    case 'tank': {
      // Huge body
      ctx.beginPath();
      ctx.moveTo(-r*0.76,-r*0.14); ctx.lineTo(-r*0.86,r); ctx.lineTo(r*0.86,r); ctx.lineTo(r*0.76,-r*0.14); ctx.closePath();
      const tbg = ctx.createLinearGradient(0,-r*0.14,0,r);
      tbg.addColorStop(0,'#767676'); tbg.addColorStop(0.5,'#464646'); tbg.addColorStop(1,'#161616');
      ctx.fillStyle=tbg; ctx.fill(); ctx.strokeStyle='#8c8c8c'; ctx.lineWidth=2; ctx.stroke();
      // Cracks
      ctx.beginPath(); ctx.moveTo(-r*0.36,r*0.17); ctx.lineTo(-r*0.11,r*0.58); ctx.lineTo(-r*0.3,r*0.88);
      ctx.moveTo(r*0.27,r*0.07); ctx.lineTo(r*0.54,r*0.68);
      ctx.strokeStyle='rgba(0,0,0,0.5)'; ctx.lineWidth=1.8; ctx.stroke();
      // Moss
      ctx.fillStyle='rgba(28,88,14,0.45)';
      ctx.beginPath(); ctx.ellipse(-r*0.3,r*0.58,r*0.19,r*0.11,-0.3,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(r*0.37,r*0.27,r*0.13,r*0.085,0.4,0,Math.PI*2); ctx.fill();
      // Boulder fists
      for (const s of [-1,1]) {
        ctx.beginPath(); ctx.arc(s*r*0.9,r*0.4,r*0.26,0,Math.PI*2); ctx.fillStyle='#565656'; ctx.fill(); ctx.strokeStyle='#868686'; ctx.lineWidth=1; ctx.stroke();
      }
      // Head
      ctx.beginPath(); ctx.ellipse(0,-r*0.5,r*0.51,r*0.4,0,0,Math.PI*2);
      const thg = ctx.createRadialGradient(-r*0.13,-r*0.6,r*0.04,0,-r*0.5,r*0.51);
      thg.addColorStop(0,'#868686'); thg.addColorStop(1,'#262626');
      ctx.fillStyle=thg; ctx.fill(); ctx.strokeStyle='#8c8c8c'; ctx.lineWidth=1.5; ctx.stroke();
      // Angry brows
      for (const s of [-1,1]) {
        ctx.beginPath(); ctx.moveTo(s*r*0.4,-r*0.66); ctx.lineTo(s*r*0.11,-r*0.54);
        ctx.strokeStyle='#161616'; ctx.lineWidth=2.8; ctx.stroke();
      }
      // Fierce eyes
      for (const ex of [-r*0.24,r*0.24]) {
        ctx.beginPath(); ctx.ellipse(ex,-r*0.5,r*0.09,r*0.09,0,0,Math.PI*2); ctx.fillStyle='#ff3300'; ctx.fill();
      }
      // Big mouth + stone teeth
      ctx.beginPath(); ctx.arc(0,-r*0.3,r*0.31,0.15,Math.PI-0.15); ctx.strokeStyle='#0a0a0a'; ctx.lineWidth=2; ctx.stroke();
      for (let i=-2;i<=2;i++) {
        ctx.beginPath(); ctx.moveTo(i*r*0.11,-r*0.31); ctx.lineTo(i*r*0.11-r*0.048,-r*0.19); ctx.lineTo(i*r*0.11+r*0.048,-r*0.19); ctx.closePath();
        ctx.fillStyle='#c4b494'; ctx.fill();
      }
      break;
    }

    // ── HEALER — shaman with glowing staff and mystical robe ──
    case 'healer': {
      // Glow aura
      const hag = ctx.createRadialGradient(0,0,r*0.1,0,0,r);
      hag.addColorStop(0,'rgba(60,255,100,0.38)'); hag.addColorStop(1,'rgba(60,255,100,0)');
      ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fillStyle=hag; ctx.fill();
      // Robe
      ctx.beginPath(); ctx.moveTo(0,-r*0.27); ctx.lineTo(-r*0.58,r*0.9); ctx.lineTo(r*0.58,r*0.9); ctx.closePath();
      const hrg = ctx.createLinearGradient(0,-r*0.27,0,r*0.9);
      hrg.addColorStop(0,'#38c058'); hrg.addColorStop(0.5,'#18783a'); hrg.addColorStop(1,'#082818');
      ctx.fillStyle=hrg; ctx.fill(); ctx.strokeStyle='#55e075'; ctx.lineWidth=0.8; ctx.stroke();
      // Staff
      ctx.beginPath(); ctx.moveTo(r*0.46,-r*0.8); ctx.lineTo(r*0.46,r*0.9);
      ctx.strokeStyle='#784828'; ctx.lineWidth=2.8; ctx.stroke();
      ctx.beginPath(); ctx.arc(r*0.46,-r*0.82,r*0.13,0,Math.PI*2); ctx.fillStyle='#40ff80'; ctx.fill();
      // Head
      ctx.beginPath(); ctx.arc(0,-r*0.43,r*0.29,0,Math.PI*2); ctx.fillStyle='#68b878'; ctx.fill(); ctx.strokeStyle='#90e898'; ctx.lineWidth=0.8; ctx.stroke();
      for (const ex of [-r*0.11,r*0.11]) {
        ctx.beginPath(); ctx.arc(ex,-r*0.45,r*0.062,0,Math.PI*2); ctx.fillStyle='#ffffff'; ctx.fill();
      }
      break;
    }

    // ── INVISIBLE — ghostly wispy wraith ──
    case 'invisible': {
      ctx.beginPath();
      ctx.moveTo(-r*0.46,-r*0.53); ctx.bezierCurveTo(-r*0.5,-r*0.96,r*0.5,-r*0.96,r*0.46,-r*0.53);
      ctx.bezierCurveTo(r*0.66,-r*0.17,r*0.76,r*0.36,r*0.46,r*0.76);
      ctx.bezierCurveTo(r*0.31,r*0.96,r*0.13,r*0.8,0,r*0.9);
      ctx.bezierCurveTo(-r*0.13,r*0.8,-r*0.31,r*0.96,-r*0.46,r*0.76);
      ctx.bezierCurveTo(-r*0.76,r*0.36,-r*0.66,-r*0.17,-r*0.46,-r*0.53);
      const igg = ctx.createLinearGradient(0,-r,0,r);
      igg.addColorStop(0,'rgba(195,155,255,0.88)'); igg.addColorStop(0.5,'rgba(130,70,215,0.68)'); igg.addColorStop(1,'rgba(75,15,155,0.35)');
      ctx.fillStyle=igg; ctx.fill(); ctx.strokeStyle='rgba(215,175,255,0.6)'; ctx.lineWidth=0.8; ctx.stroke();
      for (const ex of [-r*0.19,r*0.19]) {
        ctx.beginPath(); ctx.ellipse(ex,-r*0.5,r*0.105,r*0.086,0,0,Math.PI*2); ctx.fillStyle='#8822cc'; ctx.fill();
        ctx.beginPath(); ctx.ellipse(ex,-r*0.5,r*0.042,r*0.036,0,0,Math.PI*2); ctx.fillStyle='rgba(0,0,0,0.85)'; ctx.fill();
      }
      break;
    }

    // ── BOSS — demon lord with horns, wings, armor and crown ──
    case 'boss': {
      const aura = ctx.createRadialGradient(0,0,r*0.2,0,0,r*2.0);
      aura.addColorStop(0,'rgba(150,0,0,0.32)'); aura.addColorStop(1,'rgba(80,0,0,0)');
      ctx.beginPath(); ctx.arc(0,0,r*2.0,0,Math.PI*2); ctx.fillStyle=aura; ctx.fill();
      // Horns
      for (const s of [-1,1]) {
        ctx.lineWidth=r*0.21; ctx.strokeStyle='#601808'; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(s*r*0.32,-r*0.7); ctx.bezierCurveTo(s*r*0.86,-r*1.36,s*r*1.46,-r*0.76,s*r*1.16,-r*0.09); ctx.stroke();
        ctx.lineWidth=r*0.065; ctx.strokeStyle='#cc3818';
        ctx.beginPath(); ctx.moveTo(s*r*0.32,-r*0.7); ctx.bezierCurveTo(s*r*0.86,-r*1.36,s*r*1.46,-r*0.76,s*r*1.16,-r*0.09); ctx.stroke();
        ctx.lineCap='butt';
      }
      // Wings
      for (const s of [-1,1]) {
        ctx.beginPath(); ctx.moveTo(s*r*0.42,-r*0.07); ctx.bezierCurveTo(s*r*1.26,-r*0.56,s*r*1.76,r*0.27,s*r*1.46,r*0.86); ctx.bezierCurveTo(s*r*0.96,r*0.66,s*r*0.64,r*0.46,s*r*0.37,r*0.36); ctx.closePath();
        const bwg = ctx.createLinearGradient(s*r*0.46,0,s*r*1.76,r*0.48); bwg.addColorStop(0,'rgba(135,8,8,0.92)'); bwg.addColorStop(1,'rgba(35,0,0,0.72)');
        ctx.fillStyle=bwg; ctx.fill(); ctx.strokeStyle='#ff1818'; ctx.lineWidth=0.8; ctx.stroke();
      }
      // Body
      ctx.beginPath(); ctx.ellipse(0,r*0.14,r*0.6,r*0.8,0,0,Math.PI*2);
      const bbg = ctx.createRadialGradient(-r*0.17,-r*0.27,r*0.07,0,r*0.14,r*0.8);
      bbg.addColorStop(0,'#cc1818'); bbg.addColorStop(0.5,'#560000'); bbg.addColorStop(1,'#140000');
      ctx.fillStyle=bbg; ctx.fill(); ctx.strokeStyle='#ff1818'; ctx.lineWidth=2; ctx.stroke();
      // Chest armor
      ctx.beginPath(); ctx.moveTo(-r*0.44,-r*0.09); ctx.lineTo(0,-r*0.37); ctx.lineTo(r*0.44,-r*0.09); ctx.lineTo(r*0.37,r*0.27); ctx.lineTo(0,r*0.07); ctx.lineTo(-r*0.37,r*0.27); ctx.closePath();
      ctx.fillStyle='rgba(56,0,0,0.72)'; ctx.fill(); ctx.strokeStyle='#ff2828'; ctx.lineWidth=0.8; ctx.stroke();
      // Head
      ctx.beginPath(); ctx.ellipse(0,-r*0.6,r*0.38,r*0.35,0,0,Math.PI*2);
      const bhhg = ctx.createRadialGradient(-r*0.1,-r*0.7,r*0.04,0,-r*0.6,r*0.38);
      bhhg.addColorStop(0,'#dd1818'); bhhg.addColorStop(1,'#3c0000');
      ctx.fillStyle=bhhg; ctx.fill(); ctx.strokeStyle='#ff2828'; ctx.lineWidth=1.5; ctx.stroke();
      // Glowing eyes
      for (const ex of [-r*0.16,r*0.16]) {
        ctx.beginPath(); ctx.ellipse(ex,-r*0.63,r*0.105,r*0.086,0,0,Math.PI*2); ctx.fillStyle='#ff5800'; ctx.fill();
        ctx.beginPath(); ctx.ellipse(ex,-r*0.63,r*0.042,r*0.053,0,0,Math.PI*2); ctx.fillStyle='#ffdd00'; ctx.fill();
      }
      // Crown spikes
      for (let i=-2;i<=2;i++) {
        ctx.beginPath(); ctx.moveTo(i*r*0.16-r*0.062,-r*0.93); ctx.lineTo(i*r*0.16,-r*1.2); ctx.lineTo(i*r*0.16+r*0.062,-r*0.93); ctx.closePath();
        ctx.fillStyle='#bb0808'; ctx.fill();
      }
      break;
    }

    // ── SPAWNER — hulking toad with a sac on its back ──
    case 'spawner': {
      // Body
      ctx.beginPath(); ctx.ellipse(0, r*0.15, r*0.72, r*0.8, 0, 0, Math.PI*2);
      const spg = ctx.createRadialGradient(-r*0.2,-r*0.1,r*0.1,0,r*0.15,r*0.8);
      spg.addColorStop(0,'#d08040'); spg.addColorStop(0.6,'#804010'); spg.addColorStop(1,'#3a1800');
      ctx.fillStyle=spg; ctx.fill(); ctx.strokeStyle='#c06020'; ctx.lineWidth=1.5; ctx.stroke();
      // Spawn sac on back (bulging purple sac)
      ctx.beginPath(); ctx.ellipse(0,-r*0.55,r*0.42,r*0.38,0,0,Math.PI*2);
      const sacg = ctx.createRadialGradient(-r*0.1,-r*0.65,r*0.06,0,-r*0.55,r*0.42);
      sacg.addColorStop(0,'rgba(200,120,220,0.9)'); sacg.addColorStop(1,'rgba(100,40,130,0.8)');
      ctx.fillStyle=sacg; ctx.fill(); ctx.strokeStyle='rgba(220,160,255,0.7)'; ctx.lineWidth=1; ctx.stroke();
      // Eyes
      for (const ex of [-r*0.22,r*0.22]) {
        ctx.beginPath(); ctx.ellipse(ex,-r*0.0,r*0.13,r*0.11,0,0,Math.PI*2); ctx.fillStyle='#ffcc00'; ctx.fill();
        ctx.beginPath(); ctx.ellipse(ex,-r*0.0,r*0.055,r*0.07,0,0,Math.PI*2); ctx.fillStyle='#000'; ctx.fill();
      }
      // Warts
      for (const [wx,wy] of [[-r*0.45,r*0.3],[r*0.4,r*0.1],[0,r*0.62]]) {
        ctx.beginPath(); ctx.arc(wx,wy,r*0.1,0,Math.PI*2); ctx.fillStyle='#6a3010'; ctx.fill();
      }
      break;
    }

    // ── SPAWNER_MINI — tiny aggressive imp ──
    case 'spawner_mini': {
      ctx.beginPath(); ctx.ellipse(0,r*0.1,r*0.48,r*0.56,0,0,Math.PI*2);
      const smg = ctx.createLinearGradient(0,-r*0.4,0,r*0.7);
      smg.addColorStop(0,'#e09060'); smg.addColorStop(1,'#703818');
      ctx.fillStyle=smg; ctx.fill();
      // Head
      ctx.beginPath(); ctx.arc(0,-r*0.46,r*0.34,0,Math.PI*2);
      ctx.fillStyle='#d07840'; ctx.fill();
      // Tiny horns
      for (const s of [-1,1]) {
        ctx.beginPath(); ctx.moveTo(s*r*0.12,-r*0.76); ctx.lineTo(s*r*0.2,-r*0.94); ctx.lineTo(s*r*0.07,-r*0.73); ctx.closePath();
        ctx.fillStyle='#602010'; ctx.fill();
      }
      // Eyes
      for (const ex of [-r*0.13,r*0.13]) {
        ctx.beginPath(); ctx.arc(ex,-r*0.5,r*0.08,0,Math.PI*2); ctx.fillStyle='#ff3300'; ctx.fill();
      }
      break;
    }

    // ── GLASS ASSASSIN — sleek crystalline dagger-form ──
    case 'glass_assassin': {
      // Crystal body — elongated diamond shape
      ctx.beginPath();
      ctx.moveTo(0,-r*1.1); ctx.lineTo(r*0.42,0); ctx.lineTo(0,r*0.8); ctx.lineTo(-r*0.42,0); ctx.closePath();
      const gag = ctx.createLinearGradient(0,-r*1.1,0,r*0.8);
      gag.addColorStop(0,'rgba(255,240,100,0.95)'); gag.addColorStop(0.4,'rgba(220,180,50,0.85)'); gag.addColorStop(1,'rgba(120,80,0,0.7)');
      ctx.fillStyle=gag; ctx.fill(); ctx.strokeStyle='rgba(255,255,180,0.9)'; ctx.lineWidth=1; ctx.stroke();
      // Inner glint
      ctx.beginPath(); ctx.moveTo(0,-r*0.9); ctx.lineTo(r*0.14,-r*0.1); ctx.lineTo(0,r*0.6); ctx.lineTo(-r*0.14,-r*0.1); ctx.closePath();
      ctx.fillStyle='rgba(255,255,200,0.35)'; ctx.fill();
      // Eye slit
      ctx.beginPath(); ctx.ellipse(0,-r*0.36,r*0.13,r*0.06,0,0,Math.PI*2); ctx.fillStyle='#cc1100'; ctx.fill();
      break;
    }

    // ── BRUTE — massive rocky troll ──
    case 'brute': {
      // Body
      ctx.beginPath(); ctx.ellipse(0,r*0.2,r*0.75,r*0.86,0,0,Math.PI*2);
      const brg = ctx.createRadialGradient(-r*0.2,-r*0.1,r*0.1,0,r*0.2,r*0.86);
      brg.addColorStop(0,'#b06050'); brg.addColorStop(0.6,'#603020'); brg.addColorStop(1,'#1e0a08');
      ctx.fillStyle=brg; ctx.fill(); ctx.strokeStyle='#904030'; ctx.lineWidth=2; ctx.stroke();
      // Shoulder guards
      for (const s of [-1,1]) {
        ctx.beginPath(); ctx.arc(s*r*0.7,-r*0.1,r*0.3,0,Math.PI*2);
        ctx.fillStyle='#704030'; ctx.fill(); ctx.strokeStyle='#c06040'; ctx.lineWidth=1; ctx.stroke();
      }
      // Head
      ctx.beginPath(); ctx.ellipse(0,-r*0.55,r*0.45,r*0.42,0,0,Math.PI*2);
      const brhg = ctx.createRadialGradient(-r*0.1,-r*0.62,r*0.06,0,-r*0.55,r*0.45);
      brhg.addColorStop(0,'#c06050'); brhg.addColorStop(1,'#3a1008');
      ctx.fillStyle=brhg; ctx.fill(); ctx.strokeStyle='#905030'; ctx.lineWidth=1.5; ctx.stroke();
      // Eyes
      for (const ex of [-r*0.18,r*0.18]) {
        ctx.beginPath(); ctx.ellipse(ex,-r*0.6,r*0.12,r*0.1,0,0,Math.PI*2); ctx.fillStyle='#ff6600'; ctx.fill();
        ctx.beginPath(); ctx.arc(ex,-r*0.6,r*0.045,0,Math.PI*2); ctx.fillStyle='#000'; ctx.fill();
      }
      // Tusks
      for (const s of [-1,1]) {
        ctx.beginPath(); ctx.moveTo(s*r*0.1,-r*0.32); ctx.lineTo(s*r*0.18,-r*0.15); ctx.lineTo(s*r*0.04,-r*0.18); ctx.closePath();
        ctx.fillStyle='#e8d090'; ctx.fill();
      }
      break;
    }

    // ── SPLITTER — pulsing gelatinous blob ──
    case 'splitter': {
      ctx.beginPath(); ctx.arc(0,0,r*0.88,0,Math.PI*2);
      const slg = ctx.createRadialGradient(-r*0.25,-r*0.25,r*0.08,0,0,r*0.88);
      slg.addColorStop(0,'rgba(240,140,180,0.96)'); slg.addColorStop(0.5,'rgba(190,60,100,0.88)'); slg.addColorStop(1,'rgba(100,10,50,0.7)');
      ctx.fillStyle=slg; ctx.fill(); ctx.strokeStyle='rgba(255,160,200,0.8)'; ctx.lineWidth=1.5; ctx.stroke();
      // Division line showing it will split
      ctx.beginPath(); ctx.moveTo(0,-r*0.82); ctx.lineTo(0,r*0.82);
      ctx.setLineDash([3,3]); ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=1; ctx.stroke(); ctx.setLineDash([]);
      // Eyes
      for (const ex of [-r*0.22,r*0.22]) {
        ctx.beginPath(); ctx.arc(ex,-r*0.2,r*0.12,0,Math.PI*2); ctx.fillStyle='rgba(255,50,100,0.9)'; ctx.fill();
        ctx.beginPath(); ctx.arc(ex,-r*0.2,r*0.05,0,Math.PI*2); ctx.fillStyle='#000'; ctx.fill();
      }
      break;
    }
    case 'splitter_child': {
      ctx.beginPath(); ctx.arc(0,0,r*0.88,0,Math.PI*2);
      const scg = ctx.createRadialGradient(-r*0.2,-r*0.2,r*0.06,0,0,r*0.88);
      scg.addColorStop(0,'rgba(255,160,200,0.96)'); scg.addColorStop(1,'rgba(150,40,80,0.75)');
      ctx.fillStyle=scg; ctx.fill(); ctx.strokeStyle='rgba(255,180,210,0.7)'; ctx.lineWidth=1; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,-r*0.78); ctx.lineTo(0,r*0.78);
      ctx.setLineDash([2,2]); ctx.strokeStyle='rgba(255,255,255,0.4)'; ctx.lineWidth=0.8; ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(0,-r*0.22,r*0.14,0,Math.PI*2); ctx.fillStyle='rgba(220,40,80,0.85)'; ctx.fill();
      break;
    }
    case 'splitter_tiny': {
      ctx.beginPath(); ctx.arc(0,0,r*0.9,0,Math.PI*2);
      const stg = ctx.createRadialGradient(-r*0.15,-r*0.15,0,0,0,r*0.9);
      stg.addColorStop(0,'rgba(255,180,210,0.92)'); stg.addColorStop(1,'rgba(180,60,100,0.65)');
      ctx.fillStyle=stg; ctx.fill(); ctx.strokeStyle='rgba(255,200,220,0.5)'; ctx.lineWidth=0.6; ctx.stroke();
      break;
    }

    // ── SHIELDER — armored knight with a glowing barrier ──
    case 'shielder': {
      // Barrier aura ring
      ctx.beginPath(); ctx.arc(0,0,r*1.35,0,Math.PI*2);
      ctx.strokeStyle='rgba(80,160,255,0.35)'; ctx.lineWidth=2.5; ctx.stroke();
      // Body
      ctx.beginPath(); ctx.rect(-r*0.52,-r*0.78,r*1.04,r*1.48);
      const shg = ctx.createLinearGradient(0,-r*0.78,0,r*0.7);
      shg.addColorStop(0,'#7090d8'); shg.addColorStop(0.5,'#3050a0'); shg.addColorStop(1,'#101830');
      ctx.fillStyle=shg; ctx.fill(); ctx.strokeStyle='#80b0f0'; ctx.lineWidth=1.5; ctx.stroke();
      // Shield face plate
      ctx.beginPath(); ctx.moveTo(0,-r*0.68); ctx.lineTo(r*0.38,-r*0.28); ctx.lineTo(r*0.38,r*0.42); ctx.lineTo(0,r*0.72); ctx.lineTo(-r*0.38,r*0.42); ctx.lineTo(-r*0.38,-r*0.28); ctx.closePath();
      ctx.fillStyle='rgba(40,80,180,0.7)'; ctx.fill(); ctx.strokeStyle='#90c0ff'; ctx.lineWidth=1; ctx.stroke();
      // Visor
      ctx.beginPath(); ctx.ellipse(0,-r*0.18,r*0.28,r*0.1,0,0,Math.PI*2);
      ctx.fillStyle='rgba(100,200,255,0.8)'; ctx.fill();
      break;
    }

    // ── DISRUPTOR — crackling electric eel-like creature ──
    case 'disruptor': {
      // Electric aura
      ctx.beginPath(); ctx.arc(0,0,r*1.2,0,Math.PI*2);
      ctx.strokeStyle='rgba(180,50,230,0.3)'; ctx.lineWidth=2; ctx.stroke();
      // Body — elongated serpentine
      ctx.beginPath(); ctx.ellipse(0,0,r*0.42,r*0.86,0,0,Math.PI*2);
      const dg = ctx.createRadialGradient(-r*0.1,-r*0.2,r*0.05,0,0,r*0.86);
      dg.addColorStop(0,'#d060f0'); dg.addColorStop(0.55,'#7010a0'); dg.addColorStop(1,'#1e0030');
      ctx.fillStyle=dg; ctx.fill(); ctx.strokeStyle='#c040e0'; ctx.lineWidth=1.5; ctx.stroke();
      // Electric spine
      ctx.beginPath(); ctx.moveTo(0,-r*0.8);
      for (let i=1;i<=5;i++) { ctx.lineTo((i%2===0?r*0.18:-r*0.18), -r*0.8+i*r*0.32); }
      ctx.strokeStyle='rgba(220,180,255,0.85)'; ctx.lineWidth=1.5; ctx.stroke();
      // Eyes
      for (const ex of [-r*0.16,r*0.16]) {
        ctx.beginPath(); ctx.arc(ex,-r*0.46,r*0.1,0,Math.PI*2); ctx.fillStyle='#ee00ff'; ctx.fill();
        ctx.beginPath(); ctx.arc(ex+r*0.03,-r*0.46,r*0.038,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill();
      }
      break;
    }

    // ── SKELETON (Necromancer) ──
    default: {
      ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2);
      const g = _grad3(ctx, r, '#e0e0e0', '#a0a0a0', '#404040');
      ctx.fillStyle=g; ctx.fill(); ctx.strokeStyle='#fff'; ctx.lineWidth=1; ctx.stroke();
      ctx.font=`${r*1.2}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillStyle='rgba(0,0,0,0.7)'; ctx.fillText('☠',0,0);
      break;
    }
  }

  ctx.restore();
}
