// ============================================================
//  TIKTOK ESCAPE RACE v2 — Main Game Controller
//  Orchestrates: socket, renderer, animator, feed, leaderboard,
//  sounds, winner flow, countdown, gift map panel, dev panel.
// ============================================================

// ── State ────────────────────────────────────────────────────
let socket;
let teams      = [];
let gameCfg    = {};
let gameState  = 'waiting';   // waiting | countdown | racing | winner
let winner     = null;
let lastTs     = 0;
let rafId      = null;
let isDevMode  = false;
let confCtx    = null;
let confParts  = [];

// ── Bootstrap ────────────────────────────────────────────────
window.addEventListener('load', async () => {
  isDevMode = new URLSearchParams(window.location.search).has('dev');

  let serverData;
  try {
    const res = await fetch('/api/config');
    serverData = await res.json();
  } catch (e) {
    console.error('[Game] Failed to load /api/config:', e);
    return;
  }

  gameCfg = serverData.game;

  // Build runtime team objects
  teams = serverData.teams.map(t => ({
    ...t,
    progress:      0,
    speedBoost:    1.0,
    speedBoostEnd: 0,
    effect:        null,
    effectEnd:     0,
    particles:     [],
  }));

  // Subsystems
  await SoundManager.init();

  const canvas = document.getElementById('gameCanvas');
  Renderer.init(canvas, teams, serverData);

  FeedManager.init(teams, gameCfg);
  LeaderboardManager.init(teams);

  // Confetti canvas
  _setupConfettiCanvas();

  // Gift map panel
  await _buildGiftMapPanel(teams);

  // Dev panel
  if (isDevMode) _buildDevPanel();

  // Socket
  socket = io();
  socket.on('connect',            () => console.log('[Socket] connected'));
  socket.on('disconnect',         () => console.log('[Socket] disconnected'));
  socket.on('gift',               onGift);
  socket.on('leaderboard-update', data => LeaderboardManager.update(data));

  // If another client (same server) declares a winner, sync this client too
  socket.on('race-winner', ({ teamId }) => {
    if (gameState !== 'winner') {
      const t = teams.find(t => t.id === teamId);
      if (t) triggerWinner(t, false); // false = don't re-notify server
    }
  });

  startCountdown();
});

// ── Gift Event ────────────────────────────────────────────────
function onGift(data) {
  if (gameState !== 'racing') return;

  const team = teams.find(t => t.id === data.teamId);
  if (!team) return;

  const boost = Math.min(data.instantProgress || 0, gameCfg.maxBoostPerEvent || 400);
  team.progress = Math.min(gameCfg.raceTarget, team.progress + boost);

  if (data.speedMultiplier > 1) {
    const cap = gameCfg.maxSpeedMultiplier || 4;
    // Stack: keep whichever is greater
    if (data.speedMultiplier > team.speedBoost) {
      team.speedBoost = Math.min(data.speedMultiplier, cap);
    }
    const newEnd = Date.now() + (data.boostDurationMs || 0);
    if (newEnd > team.speedBoostEnd) team.speedBoostEnd = newEnd;
  }

  team.effect    = data.effectType || 'flash';
  team.effectEnd = Date.now() + 2200;
  Renderer.spawnEffect(team, team.effect);

  FeedManager.addItem(data);
  SoundManager.playFromGift(data.soundEffect);
  _showBoostNotif(team, data);

  if (team.progress >= gameCfg.raceTarget) triggerWinner(team, true);
}

// ── Game Loop ─────────────────────────────────────────────────
function gameLoop(ts) {
  const dt = Math.min((ts - lastTs) / 1000, 0.08);
  lastTs = ts;

  if (gameState === 'racing') {
    _updateTeams(dt, ts);
    _checkWinner();
  }

  _updateConfetti(dt);
  Renderer.draw(gameState, teams, winner, ts);
  if (gameState === 'winner') _drawConfetti();

  rafId = requestAnimationFrame(gameLoop);
}

function _updateTeams(dt, now) {
  const base = gameCfg.baseSpeed || 0.5;

  for (const t of teams) {
    if (t.speedBoostEnd > 0 && now > t.speedBoostEnd) {
      t.speedBoost    = 1.0;
      t.speedBoostEnd = 0;
    }
    if (t.effectEnd > 0 && now > t.effectEnd) {
      t.effect    = null;
      t.effectEnd = 0;
    }

    t.progress = Math.min(gameCfg.raceTarget, t.progress + base * t.speedBoost * dt);
    Renderer.updateParticles(t, dt);
  }
}

function _checkWinner() {
  const f = teams.find(t => t.progress >= gameCfg.raceTarget);
  if (f) triggerWinner(f, true);
}

// ── State Machine ─────────────────────────────────────────────
function startCountdown() {
  gameState = 'countdown';
  winner    = null;
  confParts = [];

  for (const t of teams) {
    t.progress      = 0;
    t.speedBoost    = 1.0;
    t.speedBoostEnd = 0;
    t.effect        = null;
    t.effectEnd     = 0;
    t.particles     = [];
  }

  document.getElementById('winnerOverlay').classList.add('hidden');
  document.getElementById('headerStatus').textContent = 'Get ready!';

  const overlay = document.getElementById('countdownOverlay');
  const numEl   = document.getElementById('cdNumber');
  const total   = gameCfg.countdownDuration ?? 5;
  overlay.classList.remove('hidden');
  numEl.textContent = total;

  let count = total;
  const tick = () => {
    count--;
    if (count <= 0) {
      overlay.classList.add('hidden');
      _startRace();
      return;
    }
    numEl.textContent = count;
    numEl.style.animation = 'none';
    void numEl.offsetWidth; // reflow
    numEl.style.animation = 'countPulse 1s ease';
    setTimeout(tick, 1000);
  };
  setTimeout(tick, 1000);
}

function _startRace() {
  gameState = 'racing';
  lastTs    = performance.now();
  document.getElementById('headerStatus').textContent = 'Race in progress';

  if (!rafId) rafId = requestAnimationFrame(gameLoop);
}

function triggerWinner(team, notifyServer) {
  if (gameState === 'winner') return;
  gameState = 'winner';
  winner    = team;
  team.progress = gameCfg.raceTarget;

  document.getElementById('headerStatus').textContent = `${team.name} wins! 🏆`;

  SoundManager.play('winner');
  _showWinnerOverlay(team);
  _spawnConfetti();

  if (notifyServer && socket) {
    socket.emit('race-winner', { teamId: team.id });
  }

  const dur = gameCfg.winnerScreenDuration ?? 10000;
  setTimeout(startCountdown, dur);
}

// ── Winner Overlay ────────────────────────────────────────────
function _showWinnerOverlay(team) {
  document.getElementById('winnerLogo').src         = team.logo;
  document.getElementById('winnerTeamName').textContent   = team.name;
  document.getElementById('winnerTeamName').style.color   = team.accentColor || '#fff';
  document.getElementById('winnerPlayerName').textContent = team.playerName || '';
  document.getElementById('winnerOverlay').classList.remove('hidden');
}

// ── Boost Notification ────────────────────────────────────────
function _showBoostNotif(team, data) {
  const container = document.getElementById('boostNotifs');
  const el        = document.createElement('div');
  el.className    = 'boost-notif';
  const icons = { small:'⚡', medium:'🔥', big:'🚀', mega:'💥', ultra:'🌟' };
  el.style.color  = team.accentColor || '#FFD700';
  el.textContent  = `${icons[data.giftTier] || '⚡'} ${team.name} +${data.instantProgress}`;
  container.appendChild(el);
  setTimeout(() => el.remove(), 2200);
}

// ── Confetti ──────────────────────────────────────────────────
function _setupConfettiCanvas() {
  const wrap = document.getElementById('confettiCanvas');
  if (!wrap) return;
  // The canvas element is already in HTML with correct dimensions
  confCtx = wrap.getContext('2d');
}

function _spawnConfetti() {
  confParts = [];
  const COLORS = ['#FFD700','#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#ff2d55','#FFEAA7','#a29bfe'];
  for (let i = 0; i < 140; i++) {
    confParts.push({
      x:     200 + Math.random() * 680,
      y:     -20 - Math.random() * 300,
      vx:    (Math.random() - .5) * 130,
      vy:    70 + Math.random() * 130,
      angle: Math.random() * Math.PI * 2,
      spin:  (Math.random() - .5) * 9,
      w:     5 + Math.random() * 9,
      h:     4 + Math.random() * 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life:  1,
      decay: .0028 + Math.random() * .004,
    });
  }
}

function _updateConfetti(dt) {
  if (!confParts.length) return;
  confParts = confParts.filter(p => p.life > 0);
  for (const p of confParts) {
    p.x     += p.vx * dt;
    p.y     += p.vy * dt;
    p.angle += p.spin * dt;
    p.vy    += 28 * dt;
    p.vx    *= .992;
    p.life  -= p.decay;
  }
}

function _drawConfetti() {
  if (!confCtx) return;
  confCtx.clearRect(0, 0, 1080, 1920);
  for (const p of confParts) {
    confCtx.save();
    confCtx.globalAlpha = Math.max(p.life, 0);
    confCtx.translate(p.x, p.y);
    confCtx.rotate(p.angle);
    confCtx.fillStyle = p.color;
    confCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    confCtx.restore();
  }
}

// ── Gift Map Panel ────────────────────────────────────────────
async function _buildGiftMapPanel(teams) {
  let giftMap;
  try {
    const res = await fetch('/api/gifts');
    giftMap = await res.json();
  } catch { return; }

  const rotateDuration = (window._gameCfg?.giftMapRotateMs) || 4000;

  // Build per-team gift lists
  const teamGifts = {};
  for (const [giftName, entry] of Object.entries(giftMap)) {
    if (!teamGifts[entry.teamId]) teamGifts[entry.teamId] = [];
    teamGifts[entry.teamId].push({ name: giftName, tier: entry.tier });
  }

  const tiers = ['small', 'medium', 'big', 'mega', 'ultra'];
  const content  = document.getElementById('gmpContent');
  const pager    = document.getElementById('gmpPager');
  const pageSize = 3; // teams visible at once
  let   page     = 0;
  const totalPages = Math.ceil(teams.length / pageSize);

  function renderPage() {
    content.innerHTML = '';
    const slice = teams.slice(page * pageSize, page * pageSize + pageSize);

    for (const team of slice) {
      const gifts = teamGifts[team.id] || [];

      const row = document.createElement('div');
      row.className = 'gmp-row';

      const logo = document.createElement('img');
      logo.className = 'gmp-logo';
      logo.src = team.logo;
      logo.alt = '';
      logo.onerror = () => { logo.style.opacity = '.3'; };

      const name = document.createElement('span');
      name.className   = 'gmp-name';
      name.textContent = team.name;
      name.style.color = team.accentColor || '#fff';

      const giftsWrap = document.createElement('div');
      giftsWrap.className = 'gmp-gifts';

      // Sort gifts by tier order
      const sorted = [...gifts].sort((a, b) =>
        tiers.indexOf(a.tier) - tiers.indexOf(b.tier)
      );

      for (const g of sorted) {
        const chip = document.createElement('span');
        chip.className   = `gmp-gift ${g.tier}`;
        chip.textContent = g.name;
        giftsWrap.appendChild(chip);
      }

      row.appendChild(logo);
      row.appendChild(name);
      row.appendChild(giftsWrap);
      content.appendChild(row);
    }

    pager.textContent = `${page + 1} / ${totalPages}`;
  }

  renderPage();
  setInterval(() => {
    page = (page + 1) % totalPages;
    renderPage();
  }, rotateDuration);
}

// ── Dev Panel ─────────────────────────────────────────────────
function _buildDevPanel() {
  const panel  = document.getElementById('devPanel');
  const list   = document.getElementById('devTeams');
  const tiers  = ['small', 'medium', 'big', 'mega', 'ultra'];
  panel.classList.remove('hidden');

  for (const team of teams) {
    const row  = document.createElement('div');
    row.className = 'dev-row';

    const label = document.createElement('span');
    label.className   = 'dev-name';
    label.style.color = team.accentColor || '#fff';
    label.textContent = team.name;
    row.appendChild(label);

    const btns = document.createElement('div');
    btns.className = 'dev-btns';

    for (const tier of tiers) {
      const btn     = document.createElement('button');
      btn.className = `db ${tier}`;
      btn.textContent = tier[0].toUpperCase();
      btn.title     = `${team.name} — ${tier}`;
      btn.addEventListener('click', () => {
        if (socket) socket.emit('simulate-gift', { teamId: team.id, tier });
      });
      btns.appendChild(btn);
    }

    row.appendChild(btns);
    list.appendChild(row);
  }
}
