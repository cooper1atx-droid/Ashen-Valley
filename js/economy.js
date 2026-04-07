// ============================================================
//  ECONOMY.JS — Gold and lives management
// ============================================================

class Economy {
  constructor(startGold, startLives, effects) {
    this.gold = startGold;
    this.lives = startLives;
    this.maxLives = startLives;
    this.effects = effects;
    this.totalEarned = 0;
    this.totalSpent = 0;
    this._goldListeners = [];
    this._livesListeners = [];
  }

  addGold(amount, x, y) {
    this.gold += amount;
    this.totalEarned += amount;
    if (x !== undefined && y !== undefined && this.effects) {
      this.effects.addFloatText(x, y, `+${amount}g`, 'float-gold');
    }
    this._notify('gold');
  }

  _isAdmin() {
    try { const u = getCurrentUser(); return u && u.username === 'Admin'; } catch { return false; }
  }

  spendGold(amount) {
    if (this._isAdmin()) return true; // infinite gold
    if (this.gold < amount) return false;
    this.gold -= amount;
    this.totalSpent += amount;
    this._notify('gold');
    return true;
  }

  canAfford(amount) {
    if (this._isAdmin()) return true;
    return this.gold >= amount;
  }

  loseLife(amount) {
    this.lives = Math.max(0, this.lives - amount);
    this._notify('lives');
    return this.lives;
  }

  healLife(amount) {
    if (this.lives >= this.maxLives) return;
    this.lives = Math.min(this.maxLives, this.lives + amount);
    this._notify('lives');
  }

  _notify(type) {
    if (type === 'gold') for (const fn of this._goldListeners) fn(this.gold);
    if (type === 'lives') for (const fn of this._livesListeners) fn(this.lives);
  }

  onGoldChange(fn) { this._goldListeners.push(fn); }
  onLivesChange(fn) { this._livesListeners.push(fn); }
}
