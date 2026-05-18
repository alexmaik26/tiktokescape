// ============================================================
//  TIKTOK ESCAPE RACE — Main Game Controller
//  Connects all subsystems: socket, renderer, feed, sounds.
// ============================================================

// ─── State ──────────────────────────────────────────────────
let socket;
let teams       = [];
let gameConfig  = {};
let gameState   = 'waiting';   // waiting | countdown | racing | winner
let winner      = null;
let lastTs      = 0;
let rafId       = null;
let isDevMode   = false;
let confettiCtx = null;
let confettiParticles = [];

// ─── Bootstrap ──────────────────────────────────────────────
window.addEventListener('load', async () => {
  isDevMode = new URLSearchParams(window.location.search).has('dev');

  // Fetch config from server
  let serverData;
  try {
    const res = await fetch('/api/config');
    serverData = await res.json();
  } catch (e) {
    console.error('[Game] Could not load config from server:', e);
    return;
  }

  gameConfig = serverData.game;

  // Build team objects with runtime state
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

  FeedManager.init(teams, gameConfig);

  // Confetti canvas (inside winner overlay)
  setupConfettiCanvas();

  // Dev panel
  if (isDevMode) buildDevPanel();

  // Socket.IO
  socket = io();
  socket.on('connect',    () => console.log('[Socket] connected'));
  socket.on('disconnect', () => console.log('[Socket] disconnected'));
  socket.on('gift',       onGift);

  // Kick off
  startCountdown();
});

// ─── Gift Event ─────────────────────────────────────────────
function onGift(data) {
  if (gameState !== 'racing') return;

  const team = teams.find(t => t.id === data.teamId);
  if (!team) return;

  // Apply progress
  const boost = Math.min(data.boostPoints || 0, gameConfig.maxBoostPerEvent || 100);
  team.progress = Math.min(100, team.progress + boost);

  // Apply speed boost
  if (data.speedMultiplier > 1) {
    const capMult = Math.min(data.speedMultiplier, gameConfig.maxSpeedMultiplier || 4);
    // Stack: take the higher value
    if (capMult > team.speedBoost) team.speedBoost = capMult;
    const newEnd = Date.now() + (data.speedDuration || 0);
    if (newEnd > team.speedBoostEnd) team.speedBoostEnd = newEnd;
  }

  // Apply visual effect
  team.effect    = data.effect || 'flash';
  team.effectEnd = Date.now() + 2200;
  Renderer.spawnEffect(team, team.effect);

  // Feed + sound + notification
  FeedManager.addItem(data);
  SoundManager.playForTier(data.giftTier);
  showBoostNotif(team, data);

  // Win check
  if (team.progress >= 100) triggerWinner(team);
}

// ─── Game Loop ───────────────────────────────────────────────
function gameLoop(ts) {
  const dt = Math.min((ts - lastTs) / 1000, 0.08);  // cap at 80 ms
  lastTs = ts;

  if (gameState === 'racing') {
    updateTeams(dt, ts);
    checkWinner();
  }

  updateConfetti(dt);

  Renderer.draw(gameState, teams, winner, ts);

  if (gameState === 'winner') drawConfetti();

  rafId = requestAnimationFrame(gameLoop);
}

function updateTeams(dt, now) {
  const base = gameConfig.baseSpeed || 0.4;

  for (const t of teams) {
    // Expire speed boost
    if (t.speedBoostEnd > 0 && now > t.speedBoostEnd) {
      t.speedBoost    = 1.0;
      t.speedBoostEnd = 0;
    }

    // Expire visual effect
    if (t.effectEnd > 0 && now > t.effectEnd) {
      t.effect    = null;
      t.effectEnd = 0;
    }

    // Move (base * boost * dt)
    t.progress = Math.min(100, t.progress + base * t.speedBoost * dt);

    // Particles
    Renderer.updateParticles(t, dt);
  }
}

function checkWinner() {
  const finisher = teams.find(t => t.progress >= 100);
  if (finisher) triggerWinner(finisher);
}

// ─── State Machine ───────────────────────────────────────────
function startCountdown() {
  gameState = 'winner-screen-gone';

  // Reset all teams
  for (const t of teams) {
    t.progress      = 0;
    t.speedBoost    = 1.0;
    t.speedBoostEnd = 0;
    t.effect        = null;
    t.effectEnd     = 0;
    t.particles     = [];
  }
  winner = null;
  confettiParticles = [];

  // Hide overlays
  document.getElementById('winnerOverlay').classList.add('hidden');

  const overlay  = document.getElementById('countdownOverlay');
  const numEl    = document.getElementById('countdownNumber');
  const total    = gameConfig.countdownDuration ?? 5;
  overlay.classList.remove('hidden');

  let count = total;
  numEl.textContent = count;

  function tick() {
    count--;
    if (count <= 0) {
      overlay.classList.add('hidden');
      startRace();
      return;
    }
    numEl.textContent = count;
    // Re-trigger CSS animation
    numEl.style.animation = 'none';
    void numEl.offsetWidth;
    numEl.style.animation = 'countPulse 1s ease';
    setTimeout(tick, 1000);
  }

  gameState = 'countdown';
  setTimeout(tick, 1000);
}

function startRace() {
  gameState = 'racing';
  lastTs    = performance.now();

  if (!rafId) {
    rafId = requestAnimationFrame(gameLoop);
  }
}

function triggerWinner(team) {
  if (gameState === 'winner') return;
  gameState = 'winner';
  winner = team;
  team.progress = 100;

  SoundManager.play('winner');
  showWinnerOverlay(team);
  spawnConfetti();

  const dur = gameConfig.winnerScreenDuration ?? 10000;
  setTimeout(startCountdown, dur);
}

// ─── Winner Screen ───────────────────────────────────────────
function showWinnerOverlay(team) {
  const overlay    = document.getElementById('winnerOverlay');
  const logoEl     = document.getElementById('winnerLogo');
  const nameEl     = document.getElementById('winnerTeamName');
  const playerEl   = document.getElementById('winnerPlayerName');

  logoEl.src            = team.logo;
  nameEl.textContent    = team.name;
  nameEl.style.color    = team.accentColor || '#fff';
  playerEl.textContent  = team.player.name;

  overlay.classList.remove('hidden');
}

// ─── Boost Notification ──────────────────────────────────────
function showBoostNotif(team, data) {
  const container = document.getElementById('boostNotifications');
  const el        = document.createElement('div');
  el.className    = 'boost-notif';

  const icons = { small:'⚡', medium:'🔥', big:'🚀', mega:'💥', ultra:'🌟' };
  const icon  = icons[data.giftTier] || '⚡';

  el.style.color = team.accentColor || '#FFD700';
  el.textContent = `${icon} ${team.name}  +${data.boostPoints}`;
  container.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}

// ─── Confetti ────────────────────────────────────────────────
function setupConfettiCanvas() {
  const wrap = document.getElementById('confettiCanvas');
  const cvs  = document.createElement('canvas');
  cvs.width  = 1920;
  cvs.height = 1080;
  cvs.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';
  wrap.appendChild(cvs);
  confettiCtx = cvs.getContext('2d');
}

function spawnConfetti() {
  confettiParticles = [];
  const COLORS = ['#FFD700','#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#ff2d55','#FFEAA7','#a29bfe'];

  for (let i = 0; i < 120; i++) {
    confettiParticles.push({
      x:     400 + Math.random() * 1120,
      y:     -20 - Math.random() * 200,
      vx:    (Math.random() - .5) * 120,
      vy:    60 + Math.random() * 120,
      angle: Math.random() * Math.PI * 2,
      spin:  (Math.random() - .5) * 8,
      w:     6 + Math.random() * 8,
      h:     4 + Math.random() * 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life:  1,
      decay: .003 + Math.random() * .004,
    });
  }
}

function updateConfetti(dt) {
  if (!confettiParticles.length) return;
  confettiParticles = confettiParticles.filter(p => p.life > 0);
  for (const p of confettiParticles) {
    p.x     += p.vx * dt;
    p.y     += p.vy * dt;
    p.angle += p.spin * dt;
    p.vy    += 25 * dt;
    p.vx    *= .99;
    p.life  -= p.decay;
  }
}

function drawConfetti() {
  if (!confettiCtx) return;
  confettiCtx.clearRect(0, 0, 1920, 1080);
  for (const p of confettiParticles) {
    confettiCtx.save();
    confettiCtx.globalAlpha = Math.max(p.life, 0);
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.angle);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    confettiCtx.restore();
  }
}

// ─── Dev Panel ───────────────────────────────────────────────
function buildDevPanel() {
  const panel  = document.getElementById('devPanel');
  const list   = document.getElementById('devTeams');
  const tiers  = ['small', 'medium', 'big', 'mega', 'ultra'];
  panel.classList.remove('hidden');

  for (const team of teams) {
    const row = document.createElement('div');
    row.className = 'dev-row';

    const label = document.createElement('span');
    label.className   = 'dev-team-label';
    label.style.color = team.accentColor || '#fff';
    label.textContent = team.name;
    row.appendChild(label);

    const btns = document.createElement('div');
    btns.className = 'dev-btns';

    for (const tier of tiers) {
      const btn       = document.createElement('button');
      btn.className   = `dev-badge ${tier}`;
      btn.textContent = tier[0].toUpperCase();
      btn.title       = `${team.name} — ${tier}`;
      btn.addEventListener('click', () => {
        socket.emit('simulate-gift', { teamId: team.id, tier });
      });
      btns.appendChild(btn);
    }

    row.appendChild(btns);
    list.appendChild(row);
  }
}
