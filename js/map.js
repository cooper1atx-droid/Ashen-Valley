// ============================================================
//  MAP.JS — Map data, grid rendering
// ============================================================

const TILE = {
  BLOCKED: 'X',
  OPEN: ' ',
  HIGH_GROUND: 'H',
  GOLD_MINE: 'G',
  WATER: '~',
  PATH: '=',
  SPAWN: 'S',
  BASE: 'B'
};

const TILE_COLORS = {
  [TILE.BLOCKED]:     '#1a1a1a',
  [TILE.OPEN]:        '#1e2d1a',
  [TILE.HIGH_GROUND]: '#3a3218',
  [TILE.GOLD_MINE]:   '#2a2800',
  [TILE.WATER]:       '#0e1e3a',
  [TILE.PATH]:        '#3d2a10',
  [TILE.SPAWN]:       '#3a1010',
  [TILE.BASE]:        '#0e2040'
};

const TILE_BORDER_COLORS = {
  [TILE.BLOCKED]:     '#222',
  [TILE.OPEN]:        '#243320',
  [TILE.HIGH_GROUND]: '#5c5028',
  [TILE.GOLD_MINE]:   '#8a7c00',
  [TILE.WATER]:       '#1a3060',
  [TILE.PATH]:        '#5c3e18',
  [TILE.SPAWN]:       '#7a2020',
  [TILE.BASE]:        '#1a40a0'
};

const COLS = 20;
const ROWS = 14;
const CELL = 48;

// Map grid: 14 rows × 20 cols
// Using the exact layout from map.md (0-indexed)
const MAP_RAW = [
  // Row 0 (A): X X X X H H _ _ _ _ _ H H X X X X X X X
  'X','X','X','X','H','H',' ',' ',' ',' ',' ','H','H','X','X','X','X','X','X','X',
  // Row 1 (B): X X X H _ _ _ _ _ _ _ _ H X X X X X X X
  'X','X','X','H',' ',' ',' ',' ',' ',' ',' ',' ','H','X','X','X','X','X','X','X',
  // Row 2 (C): X X S = = = = = = = = = = _ _ _ _ X X X
  'X','X','S','=','=','=','=','=','=','=','=','=','=',' ',' ',' ',' ','X','X','X',
  // Row 3 (D): X X X _ _ _ _ _ _ _ _ _ = _ _ _ _ _ X X
  'X','X','X',' ',' ',' ',' ',' ',' ',' ',' ',' ','=',' ',' ',' ',' ',' ','X','X',
  // Row 4 (E): X X X G _ _ _ H H _ _ _ = _ _ H _ _ X X
  'X','X','X','G',' ',' ',' ','H','H',' ',' ',' ','=',' ',' ','H',' ',' ','X','X',
  // Row 5 (F): X X X _ _ ~ ~ ~ ~ _ _ _ = _ _ _ _ _ X X
  'X','X','X',' ',' ','~','~','~','~',' ',' ',' ','=',' ',' ',' ',' ',' ','X','X',
  // Row 6 (G): X X X _ _ ~ G ~ ~ _ _ _ = _ G _ _ _ X X
  'X','X','X',' ',' ','~','G','~','~',' ',' ',' ','=',' ','G',' ',' ',' ','X','X',
  // Row 7 (H): X X X _ _ ~ ~ ~ ~ _ _ _ = _ _ _ H _ X X
  'X','X','X',' ',' ','~','~','~','~',' ',' ',' ','=',' ',' ',' ','H',' ','X','X',
  // Row 8 (I): X X X _ _ _ _ H H _ _ _ = _ _ _ _ _ X X
  'X','X','X',' ',' ',' ',' ','H','H',' ',' ',' ','=',' ',' ',' ',' ',' ','X','X',
  // Row 9 (J): X X X G _ _ _ _ _ _ _ _ = _ _ H _ _ X X
  'X','X','X','G',' ',' ',' ',' ',' ',' ',' ',' ','=',' ',' ','H',' ',' ','X','X',
  // Row 10 (K): X X X X _ _ _ _ _ _ _ _ = = = = = = = B
  'X','X','X','X',' ',' ',' ',' ',' ',' ',' ',' ','=','=','=','=','=','=','=','B',
  // Row 11 (L): X X X X H _ _ _ _ _ _ H H X X X X X X X
  'X','X','X','X','H',' ',' ',' ',' ',' ',' ','H','H','X','X','X','X','X','X','X',
  // Row 12 (M): all X
  'X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X',
  // Row 13 (N): all X
  'X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X'
];

// Enemy path waypoints (col, row) 0-indexed
// Spawn at (2,2), go right to (12,2), down to (12,10), right to (19,10)
const PATH_WAYPOINTS = [
  { col: 2, row: 2 },
  { col: 12, row: 2 },
  { col: 12, row: 10 },
  { col: 19, row: 10 }
];

// Build ordered list of path tiles for reference
function buildPathTiles() {
  const tiles = [];
  const wp = PATH_WAYPOINTS;
  for (let i = 0; i < wp.length - 1; i++) {
    const from = wp[i], to = wp[i + 1];
    if (from.col === to.col) {
      const dir = to.row > from.row ? 1 : -1;
      for (let r = from.row; r !== to.row + dir; r += dir) {
        tiles.push({ col: from.col, row: r });
      }
    } else {
      const dir = to.col > from.col ? 1 : -1;
      for (let c = from.col; c !== to.col + dir; c += dir) {
        tiles.push({ col: c, row: from.row });
      }
    }
  }
  // Deduplicate
  const seen = new Set();
  return tiles.filter(t => {
    const key = `${t.col},${t.row}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const PATH_TILES = buildPathTiles();

function getTile(col, row) {
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return TILE.BLOCKED;
  return MAP_RAW[row * COLS + col];
}

function isPlaceable(col, row) {
  const t = getTile(col, row);
  return t === TILE.OPEN || t === TILE.HIGH_GROUND || t === TILE.GOLD_MINE;
}

// ── Offscreen map cache ──
let _mapCache = null;

function _buildMapCache() {
  const oc = document.createElement('canvas');
  const W = COLS * CELL, H = ROWS * CELL;
  oc.width = W; oc.height = H;
  const ctx = oc.getContext('2d');

  // 1. Grass base
  ctx.fillStyle = '#1d2e18';
  ctx.fillRect(0, 0, W, H);

  // 2. Subtle grass texture (deterministic dots per tile)
  ctx.fillStyle = 'rgba(8,18,6,0.55)';
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const t = getTile(col, row);
      if (t === TILE.BLOCKED || t === TILE.WATER) continue;
      const x = col * CELL, y = row * CELL;
      for (const [sa, sb] of [
        [(col*7+row*13)%44+2, (col*11+row*7)%44+2],
        [(col*3+row*19)%44+2, (col*17+row*5)%44+2],
        [(col*5+row*11)%44+2, (col*2+row*23)%44+2],
      ]) {
        ctx.beginPath(); ctx.arc(x+sa, y+sb, 1, 0, Math.PI*2); ctx.fill();
      }
    }
  }

  // 3. Blocked areas (dark stone)
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (getTile(col, row) !== TILE.BLOCKED) continue;
      const x = col*CELL, y = row*CELL;
      ctx.fillStyle = '#10100c'; ctx.fillRect(x, y, CELL, CELL);
      ctx.strokeStyle = '#191610'; ctx.lineWidth = 0.5;
      ctx.strokeRect(x+3, y+3, CELL-6, CELL-6);
    }
  }

  // 4. Water
  ctx.fillStyle = '#0d1e38';
  for (let row = 0; row < ROWS; row++)
    for (let col = 0; col < COLS; col++)
      if (getTile(col, row) === TILE.WATER) ctx.fillRect(col*CELL, row*CELL, CELL, CELL);
  // ripples
  ctx.strokeStyle = 'rgba(40,90,160,0.4)'; ctx.lineWidth = 1;
  const wCx = 6.5*CELL+CELL/2, wCy = 6.5*CELL+CELL/2;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath(); ctx.ellipse(wCx, wCy, 22+i*18, 12+i*10, 0, 0, Math.PI*2); ctx.stroke();
  }

  // 5. Smooth dirt path (drawn as stroked polyline — no grid look)
  const pathPts = PATH_WAYPOINTS.map(wp => ({ x: wp.col*CELL+CELL/2, y: wp.row*CELL+CELL/2 }));
  function strokePath(color, width) {
    ctx.save();
    ctx.strokeStyle = color; ctx.lineWidth = width;
    ctx.lineCap = 'square'; ctx.lineJoin = 'miter';
    ctx.beginPath(); ctx.moveTo(pathPts[0].x, pathPts[0].y);
    for (let i = 1; i < pathPts.length; i++) ctx.lineTo(pathPts[i].x, pathPts[i].y);
    ctx.stroke(); ctx.restore();
  }
  strokePath('#18080a', CELL + 10); // dark border
  strokePath('#4a2e10', CELL);       // dirt fill
  strokePath('#5c3a18', CELL - 12); // lighter center

  // 6. Path direction arrows
  ctx.fillStyle = 'rgba(190,130,50,0.45)';
  for (let s = 0; s < pathPts.length - 1; s++) {
    const from = pathPts[s], to = pathPts[s+1];
    const dx = to.x-from.x, dy = to.y-from.y;
    const len = Math.hypot(dx, dy), angle = Math.atan2(dy, dx);
    const count = Math.max(1, Math.floor(len / (CELL*2.5)));
    for (let i = 1; i <= count; i++) {
      const t = i/(count+1);
      ctx.save(); ctx.translate(from.x+dx*t, from.y+dy*t); ctx.rotate(angle);
      ctx.beginPath(); ctx.moveTo(10,0); ctx.lineTo(-7,-5); ctx.lineTo(-7,5);
      ctx.closePath(); ctx.fill(); ctx.restore();
    }
  }

  // 7. Spawn marker
  const sp = pathPts[0];
  ctx.save();
  ctx.fillStyle = 'rgba(220,40,40,0.25)';
  ctx.beginPath(); ctx.arc(sp.x, sp.y, 20, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = 'rgba(255,80,60,0.7)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#ff6050'; ctx.font = 'bold 8px Arial';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('SPAWN', sp.x, sp.y);
  ctx.restore();

  // 8. Base marker
  const bs = pathPts[pathPts.length-1];
  ctx.save();
  ctx.fillStyle = 'rgba(30,70,200,0.3)';
  ctx.beginPath(); ctx.arc(bs.x, bs.y, 20, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = 'rgba(80,140,255,0.75)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#80c0ff'; ctx.font = 'bold 8px Arial';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('BASE', bs.x, bs.y);
  ctx.restore();

  _mapCache = oc;
}

function tileCenter(col, row) {
  return { x: col * CELL + CELL / 2, y: row * CELL + CELL / 2 };
}

function pixelToTile(px, py) {
  return { col: Math.floor(px / CELL), row: Math.floor(py / CELL) };
}

// Just blit the cached map — all placement overlays handled in main.js
function renderMap(ctx) {
  if (!_mapCache) _buildMapCache();
  ctx.drawImage(_mapCache, 0, 0);
}

// ── Freeform placement ──

function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx-ax, dy = by-ay, lenSq = dx*dx+dy*dy;
  if (lenSq === 0) return Math.hypot(px-ax, py-ay);
  const t = Math.max(0, Math.min(1, ((px-ax)*dx+(py-ay)*dy)/lenSq));
  return Math.hypot(px-(ax+t*dx), py-(ay+t*dy));
}

function isValidPlacement(px, py, towers) {
  if (px < 4 || py < 4 || px >= COLS*CELL-4 || py >= ROWS*CELL-4) return false;
  const tile = getTile(Math.floor(px/CELL), Math.floor(py/CELL));
  if (tile !== TILE.OPEN && tile !== TILE.HIGH_GROUND && tile !== TILE.GOLD_MINE) return false;

  // Must not be too close to path centerline (path half-width + tower radius)
  const pts = PATH_WAYPOINTS.map(wp => ({ x: wp.col*CELL+CELL/2, y: wp.row*CELL+CELL/2 }));
  const minDist = CELL/2 + 18;
  for (let i = 0; i < pts.length-1; i++)
    if (distToSegment(px, py, pts[i].x, pts[i].y, pts[i+1].x, pts[i+1].y) < minDist) return false;

  // Must not overlap another tower (38px = can nearly touch)
  for (const t of towers) {
    const dx = px-t.x, dy = py-t.y;
    if (dx*dx+dy*dy < 38*38) return false;
  }
  return true;
}
