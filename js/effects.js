// ============================================================
//  EFFECTS.JS — Visual hit effects, floating text, screen shake
// ============================================================

const EFFECT_COLORS = {
  physical: { primary: '#d0d0d0', secondary: '#909090', glow: '#ffffff' },
  fire:     { primary: '#ff6020', secondary: '#ff2000', glow: '#ff9040' },
  ice:      { primary: '#80d0ff', secondary: '#4090ff', glow: '#c0eaff' },
  lightning:{ primary: '#ffff40', secondary: '#ffffff', glow: '#ffff99' },
  poison:   { primary: '#80ff40', secondary: '#40b000', glow: '#c0ff80' },
  shadow:   { primary: '#c040ff', secondary: '#7000d0', glow: '#e090ff' },
  holy:     { primary: '#ffee80', secondary: '#ffd700', glow: '#ffffd0' }
};

// ── Hit Effect (per-projectile impact) ──────────────────────
class HitEffect {
  constructor(x, y, element) {
    this.x = x;
    this.y = y;
    this.element = element;
    this.timer = 0;
    this.duration = 0.30;
    this.particles = [];
    const c = EFFECT_COLORS[element] || EFFECT_COLORS.physical;

    // Element configs: count, speed multiplier, gravity multiplier, size multiplier
    const cfg = {
      fire:     { count: 9,  spd: 1.2, grav: -40,  size: 1.4 },
      ice:      { count: 7,  spd: 1.1, grav:  80,  size: 1.2 },
      lightning:{ count: 8,  spd: 2.2, grav:   0,  size: 0.9 },
      poison:   { count: 7,  spd: 0.8, grav: -50,  size: 1.3 },
      shadow:   { count: 6,  spd: 0.9, grav: -20,  size: 1.4 },
      holy:     { count: 8,  spd: 1.3, grav: -25,  size: 1.2 },
      physical: { count: 7,  spd: 1.0, grav:  80,  size: 1.0 },
    }[element] || { count: 7, spd: 1.0, grav: 70, size: 1.0 };

    for (let i = 0; i < cfg.count; i++) {
      const spread = (Math.PI * 2 / cfg.count);
      const angle  = spread * i + (Math.random() - 0.5) * spread * 0.8;
      const speed  = (45 + Math.random() * 70) * cfg.spd;
      this.particles.push({
        x: 0, y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: Math.random() < 0.55 ? c.primary : c.secondary,
        size: (1.8 + Math.random() * 3.5) * cfg.size,
        gravity: cfg.grav,
        rot: Math.random() * Math.PI * 2,
        rotSpd: (Math.random() - 0.5) * 12,
      });
    }
    this.glowColor = c.glow;
    this.primaryColor = c.primary;
    this.ringDuration = 0.18;
    this.ringMaxR = 22;
  }

  update(dt) {
    this.timer += dt;
    for (const p of this.particles) {
      p.x  += p.vx * dt;
      p.y  += p.vy * dt;
      p.vy += p.gravity * dt;
      p.vx *= Math.pow(0.94, dt * 60);
      p.rot += p.rotSpd * dt;
    }
    return this.timer < this.duration;
  }

  render(ctx) {
    const t     = this.timer / this.duration;
    const alpha = 1 - t;

    ctx.save();

    // Ring flash at impact
    if (this.timer < this.ringDuration) {
      const rt     = this.timer / this.ringDuration;
      const ringR  = this.ringMaxR * rt;
      ctx.globalAlpha = (1 - rt) * 0.85;
      ctx.beginPath();
      ctx.arc(this.x, this.y, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = this.primaryColor;
      ctx.lineWidth   = 2.5 * (1 - rt) + 0.5;
      ctx.stroke();
    }

    // Central flash
    const flashR = 12 * (1 - t * t);
    if (flashR > 0.4) {
      ctx.globalAlpha = alpha * 0.9;
      ctx.beginPath();
      ctx.arc(this.x, this.y, flashR, 0, Math.PI * 2);
      ctx.fillStyle = this.glowColor;
      ctx.fill();
    }

    // Particles (no shadowBlur — too expensive per-particle)
    ctx.globalAlpha = alpha;

    for (const p of this.particles) {
      const pSize = p.size * alpha;
      if (pSize < 0.3) continue;
      const px = this.x + p.x;
      const py = this.y + p.y;
      ctx.fillStyle = p.color;

      if (this.element === 'ice') {
        // Ice: sharp shard triangles
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(p.rot);
        ctx.beginPath();
        ctx.moveTo(0, -pSize * 1.6);
        ctx.lineTo(pSize * 0.55, pSize * 0.9);
        ctx.lineTo(-pSize * 0.55, pSize * 0.9);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else if (this.element === 'lightning') {
        // Lightning: line sparks oriented along velocity
        const angle = Math.atan2(p.vy, p.vx);
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angle);
        ctx.lineWidth = pSize * 0.55;
        ctx.strokeStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(-pSize * 2.2, 0);
        ctx.lineTo(pSize * 2.2, 0);
        ctx.stroke();
        ctx.restore();
      } else if (this.element === 'fire') {
        // Fire: elongated ember teardrops
        const angle = Math.atan2(p.vy, p.vx);
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angle + Math.PI / 2);
        ctx.beginPath();
        ctx.ellipse(0, 0, pSize * 0.5, pSize * 1.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        // Default: circles
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }
}

// ── AoE Effect (explosion ring) ─────────────────────────────
class AoEEffect {
  constructor(x, y, radius, element) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.element = element;
    this.timer = 0;
    this.duration = 0.55;
    const c = EFFECT_COLORS[element] || EFFECT_COLORS.physical;
    this.color    = c.primary;
    this.glowColor = c.glow;

    // Scatter particles at perimeter
    this.particles = [];
    const count = 10;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
      const speed = 35 + Math.random() * 50;
      this.particles.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 20,
        size: 2 + Math.random() * 3,
        color: Math.random() < 0.5 ? c.primary : c.secondary,
      });
    }
  }

  update(dt) {
    this.timer += dt;
    for (const p of this.particles) {
      p.x  += p.vx * dt;
      p.y  += p.vy * dt;
      p.vy += 80 * dt;
      p.vx *= Math.pow(0.92, dt * 60);
    }
    return this.timer < this.duration;
  }

  render(ctx) {
    const t     = this.timer / this.duration;
    const alpha = (1 - t) * 0.6;

    ctx.save();

    // Outer ring
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * (0.4 + t * 0.6), 0, Math.PI * 2);
    ctx.strokeStyle = this.color;
    ctx.lineWidth   = 3.5 * (1 - t) + 0.5;
    ctx.stroke();

    // Inner ring (faster)
    const t2 = Math.min(1, t * 1.6);
    ctx.globalAlpha = (1 - t2) * 0.5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * (0.2 + t2 * 0.5), 0, Math.PI * 2);
    ctx.strokeStyle = this.glowColor;
    ctx.lineWidth   = 2 * (1 - t2) + 0.3;
    ctx.stroke();

    // Fill pulse
    ctx.globalAlpha = (1 - t) * 0.12;
    ctx.shadowBlur  = 0;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * (0.4 + t * 0.6), 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();

    // Scatter particles
    ctx.shadowBlur = 4;
    ctx.globalAlpha = (1 - t) * 0.8;
    for (const p of this.particles) {
      const pAlpha = 1 - t;
      if (pAlpha < 0.05) continue;
      ctx.globalAlpha = pAlpha * 0.8;
      ctx.fillStyle   = p.color;
      ctx.beginPath();
      ctx.arc(this.x + p.x, this.y + p.y, p.size * (1 - t * 0.5), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// ── Chain Effect (lightning chain between enemies) ───────────
class ChainEffect {
  constructor(points, fromX, fromY) {
    this.points = [{ x: fromX, y: fromY }, ...points];
    this.timer = 0;
    this.duration = 0.28;
    // Pre-compute jagged offsets for each segment
    this.segments = [];
    for (let i = 0; i < this.points.length - 1; i++) {
      const a = this.points[i];
      const b = this.points[i + 1];
      const dx = b.x - a.x, dy = b.y - a.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const nx = -dy / len, ny = dx / len; // perpendicular
      const mids = [];
      const numMids = Math.max(2, Math.floor(len / 20));
      for (let j = 1; j < numMids; j++) {
        const frac   = j / numMids;
        const offset = (Math.random() - 0.5) * Math.min(len * 0.3, 16);
        mids.push({
          x: a.x + dx * frac + nx * offset,
          y: a.y + dy * frac + ny * offset,
        });
      }
      this.segments.push({ from: a, to: b, mids });
    }
  }

  update(dt) {
    this.timer += dt;
    return this.timer < this.duration;
  }

  _drawPath(ctx) {
    for (const seg of this.segments) {
      ctx.beginPath();
      ctx.moveTo(seg.from.x, seg.from.y);
      for (const m of seg.mids) ctx.lineTo(m.x, m.y);
      ctx.lineTo(seg.to.x, seg.to.y);
      ctx.stroke();
    }
  }

  render(ctx) {
    const alpha = 1 - (this.timer / this.duration);
    ctx.save();

    // Thick outer glow
    ctx.globalAlpha = alpha * 0.5;
    ctx.strokeStyle = '#ffff80';
    ctx.lineWidth   = 5;
    ctx.lineJoin    = 'round';
    this._drawPath(ctx);

    // Thin bright core
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth   = 1.5;
    this._drawPath(ctx);

    // Node sparks at chain points
    for (const pt of this.points) {
      ctx.globalAlpha = alpha * 0.9;
      ctx.fillStyle   = '#ffff99';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// ── Cataclysm Effect (full-screen beam) ─────────────────────
class CataclysmEffect {
  constructor() {
    this.timer = 0;
    this.duration = 1.5;
  }

  update(dt) {
    this.timer += dt;
    return this.timer < this.duration;
  }

  render(ctx) {
    const t     = this.timer / this.duration;
    const alpha = t < 0.2 ? t / 0.2 : (1 - t) / 0.8;
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha) * 0.8;
    const gradient = ctx.createLinearGradient(0, 0, COLS * CELL, 0);
    gradient.addColorStop(0,           'transparent');
    gradient.addColorStop(0.3 + t * 0.4, '#ff8040');
    gradient.addColorStop(0.5 + t * 0.3, '#ffffff');
    gradient.addColorStop(0.7 + t * 0.2, '#ff8040');
    gradient.addColorStop(1,           'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
    ctx.restore();
  }
}

// ── Effects Manager ──────────────────────────────────────────
class EffectsManager {
  constructor(floatLayer) {
    this.hitEffects      = [];
    this.aoeEffects      = [];
    this.chainEffects    = [];
    this.cataclysmEffects = [];
    this.floatLayer      = floatLayer;
    this.screenShake     = 0;
    this.shakeX          = 0;
    this.shakeY          = 0;
  }

  addHitEffect(x, y, element) {
    if (this.hitEffects.length >= 20) this.hitEffects.shift();
    this.hitEffects.push(new HitEffect(x, y, element));
  }

  addAoEEffect(x, y, radius, element) {
    if (this.aoeEffects.length >= 10) this.aoeEffects.shift();
    this.aoeEffects.push(new AoEEffect(x, y, radius, element));
  }

  addChainEffect(points, fromX, fromY) {
    this.chainEffects.push(new ChainEffect(points, fromX, fromY));
  }

  addCataclysmEffect() {
    this.cataclysmEffects.push(new CataclysmEffect());
  }

  addScreenShake(intensity) {
    this.screenShake = Math.max(this.screenShake, intensity);
  }

  addFloatText(x, y, text, cssClass) {
    const el = document.createElement('div');
    el.className = `float-text ${cssClass}`;
    el.textContent = text;
    el.style.left = `${x - 20}px`;
    el.style.top  = `${y - 10}px`;
    this.floatLayer.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 1300);
  }

  addBaseHitEffect() {
    const wrapper = document.getElementById('canvas-wrapper');
    wrapper.style.boxShadow = '0 0 50px rgba(255,0,0,0.9) inset';
    setTimeout(() => { wrapper.style.boxShadow = ''; }, 400);
  }

  update(dt) {
    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - dt * 18);
      this.shakeX = (Math.random() - 0.5) * this.screenShake * 2.5;
      this.shakeY = (Math.random() - 0.5) * this.screenShake * 2.5;
    } else {
      this.shakeX = 0;
      this.shakeY = 0;
    }
    this.hitEffects       = this.hitEffects.filter(e => e.update(dt));
    this.aoeEffects       = this.aoeEffects.filter(e => e.update(dt));
    this.chainEffects     = this.chainEffects.filter(e => e.update(dt));
    this.cataclysmEffects = this.cataclysmEffects.filter(e => e.update(dt));
  }

  render(ctx) {
    for (const e of this.chainEffects)     e.render(ctx);
    for (const e of this.aoeEffects)       e.render(ctx);
    for (const e of this.hitEffects)       e.render(ctx);
    for (const e of this.cataclysmEffects) e.render(ctx);
  }
}
