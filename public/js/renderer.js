// ============================================================
//  TIKTOK ESCAPE RACE v2 — Canvas Renderer (Portrait 9:16)
//  Canvas: 1080 × 1920
//
//  Layout zones (matching CSS overlay positions):
//    RACE_TOP    = 220  (90px header + 130px gift map)
//    RACE_BOTTOM = 1610 (1920 - 310px bottom panel)
//    LABEL_W     = 150  (left side: rank + logo + names)
//    FINISH_X    = 1055 (right edge finish line)
// ============================================================

const Renderer = (() => {

  // ── Constants ─────────────────────────────────────────────
  const W          = 1080;
  const H          = 1920;
  const RACE_TOP   = 220;
  const RACE_BOT   = 1610;
  const RACE_H     = RACE_BOT - RACE_TOP;   // 1390
  const LABEL_W    = 150;
  const FINISH_X   = 1056;
  const TRACK_W    = FINISH_X - LABEL_W;    // 906

  let canvas, ctx;
  let teamsRef     = [];
  let raceTarget   = 1000;
  let teamGiftsMap = {};
  const giftImages = {};

  // ── Init ──────────────────────────────────────────────────
  function init(canvasEl, teams, config) {
    canvas     = canvasEl;
    ctx        = canvas.getContext('2d');
    teamsRef   = teams;
    raceTarget = config.game.raceTarget;

    Animator.preload(teams);
  }

  function setTeamGifts(map) {
    teamGiftsMap = map;
    for (const gifts of Object.values(map)) {
      for (const g of gifts) {
        if (g.giftImage && !giftImages[g.giftImage]) {
          const img = new Image();
          img.src = g.giftImage;
          giftImages[g.giftImage] = img;
        }
      }
    }
  }

  // ── Geometry helpers ──────────────────────────────────────
  function laneH()      { return RACE_H / teamsRef.length; }
  function laneTop(i)   { return RACE_TOP + i * laneH(); }
  function laneCY(i)    { return laneTop(i) + laneH() / 2; }
  function racerX(prog) {
    const clamped = Math.min(Math.max(prog, 0), raceTarget);
    return LABEL_W + (clamped / raceTarget) * TRACK_W;
  }

  // ── Main draw ─────────────────────────────────────────────
  function draw(gameState, teams, winner, ts) {
    ctx.clearRect(0, 0, W, H);
    ctx.textBaseline = 'alphabetic';

    drawBackground(ts);
    drawLanes(ts);
    drawFinishLine();
    drawRacers(ts);
    drawParticles();
    if (gameState === 'racing') drawSpeedLines();
  }

  // ── Background ────────────────────────────────────────────
  function drawBackground(ts) {
    // Deep stadium base
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0,   '#06090f');
    bg.addColorStop(0.5, '#08111e');
    bg.addColorStop(1,   '#040710');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Stadium light cones from top
    const lights = [80, 280, 540, 800, 1000];
    for (const lx of lights) {
      const g = ctx.createRadialGradient(lx, RACE_TOP, 0, lx, RACE_TOP + 160, 280);
      g.addColorStop(0, 'rgba(255,230,140,.09)');
      g.addColorStop(1, 'rgba(255,230,140,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, RACE_TOP, W, 400);
    }

    // Alternating lane tints
    const lh = laneH();
    for (let i = 0; i < teamsRef.length; i++) {
      ctx.fillStyle = i % 2 === 0
        ? 'rgba(14,35,22,.60)'
        : 'rgba(10,25,16,.60)';
      ctx.fillRect(LABEL_W, laneTop(i), TRACK_W, lh);
    }

    // Crowd texture rows (very bottom and top of race area)
    ctx.fillStyle = 'rgba(20,30,50,.38)';
    for (let y = 100; y < RACE_TOP; y += 13) ctx.fillRect(0, y, W, 7);
    for (let y = RACE_BOT + 10; y < H - 310; y += 13) ctx.fillRect(0, y, W, 7);
  }

  // ── Lanes ─────────────────────────────────────────────────
  function drawLanes(ts) {
    const sorted = [...teamsRef].sort((a, b) => b.progress - a.progress);
    const lh = laneH();

    for (let i = 0; i < teamsRef.length; i++) {
      const t    = teamsRef[i];
      const ty   = laneTop(i);
      const cy   = laneCY(i);
      const rank = sorted.indexOf(t) + 1;

      // Lane separator
      ctx.strokeStyle = 'rgba(255,255,255,.065)';
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.moveTo(0, ty + lh);
      ctx.lineTo(W, ty + lh);
      ctx.stroke();

      // Progress bar at lane bottom
      drawProgressBar(t, ty, lh);

      // Left label area
      drawLabel(t, ty, lh, cy, rank);
    }
  }

  function drawProgressBar(team, ty, lh) {
    const barH = 3;
    const barY = ty + lh - barH;

    ctx.fillStyle = 'rgba(255,255,255,.10)';
    ctx.fillRect(LABEL_W, barY, TRACK_W, barH);

    const pct = Math.min(team.progress / raceTarget, 1);
    if (pct <= 0) return;

    const g = ctx.createLinearGradient(LABEL_W, 0, LABEL_W + TRACK_W, 0);
    g.addColorStop(0, team.color    || '#4caf50');
    g.addColorStop(1, team.accentColor || '#8bc34a');
    ctx.fillStyle = g;
    ctx.fillRect(LABEL_W, barY, TRACK_W * pct, barH);
  }

  function drawLabel(team, ty, lh, cy, rank) {
    const logoR  = 22;
    const logoX  = 38;
    const logoY  = cy;

    // Rank
    const isFirst = rank === 1;
    ctx.fillStyle    = isFirst ? '#FFD700' : 'rgba(255,255,255,.45)';
    ctx.font         = `bold ${isFirst ? 14 : 12}px Segoe UI, Arial`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`#${rank}`, 14, cy);

    // Logo background
    ctx.fillStyle = 'rgba(0,0,0,.45)';
    ctx.beginPath();
    ctx.arc(logoX, logoY, logoR + 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Logo
    Animator.drawLogo(ctx, team, logoX, logoY, logoR);

    // Three-line label: team name / gift icons / player name
    const nameX = 64;
    const maxW  = LABEL_W - nameX - 3;

    ctx.textAlign    = 'left';
    ctx.textBaseline = 'alphabetic';

    // Line 1 – team name
    ctx.fillStyle = '#fff';
    ctx.font      = `bold 11.5px Segoe UI, Arial`;
    ctx.fillText(_trunc(team.name, maxW), nameX, cy - 10);

    // Line 2 – gift icons (Mini → Medium → Mega)
    const gifts    = teamGiftsMap[team.id] || [];
    const iconSize = 13;
    const iconGap  = 3;
    let ix = nameX;
    for (const g of gifts) {
      const img = g.giftImage && giftImages[g.giftImage];
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, ix, cy + 2 - iconSize, iconSize, iconSize);
      } else {
        ctx.font         = `${iconSize}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle    = '#fff';
        ctx.fillText(g.giftIcon || '🎁', ix, cy + 2);
        ctx.font         = `bold 11.5px Segoe UI, Arial`;
      }
      ix += iconSize + iconGap;
    }

    // Line 3 – player name
    ctx.fillStyle    = 'rgba(255,255,255,.50)';
    ctx.font         = `10px Segoe UI, Arial`;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(_trunc(team.playerName || '', maxW), nameX, cy + 16);
  }

  function _trunc(text, maxW) {
    if (!text) return '';
    while (text.length > 1 && ctx.measureText(text).width > maxW) {
      text = text.slice(0, -1);
    }
    return text;
  }

  // ── Finish Line ───────────────────────────────────────────
  function drawFinishLine() {
    const x   = FINISH_X;
    const top = RACE_TOP;
    const h   = RACE_H;
    const sq  = 12;

    // Checkered blocks
    const rows = Math.ceil(h / sq);
    for (let r = 0; r < rows; r++) {
      for (let col = 0; col < 2; col++) {
        ctx.fillStyle = (r + col) % 2 === 0 ? '#fff' : '#111';
        ctx.fillRect(x + col * sq - sq, top + r * sq, sq, sq);
      }
    }

    // Glow
    const glow = ctx.createLinearGradient(x - 36, 0, x + 36, 0);
    glow.addColorStop(0,   'rgba(255,255,255,0)');
    glow.addColorStop(0.5, 'rgba(255,255,255,.13)');
    glow.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(x - 36, top, 72, h);

    // "FINISH" rotated text
    ctx.save();
    ctx.translate(x + 14, top + h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle    = 'rgba(255,255,255,.55)';
    ctx.font         = 'bold 14px Segoe UI, Arial';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('FINISH', 0, 0);
    ctx.restore();
  }

  // ── Racers ────────────────────────────────────────────────
  function drawRacers(ts) {
    for (let i = 0; i < teamsRef.length; i++) {
      drawRacer(teamsRef[i], i, ts);
    }
  }

  function drawRacer(team, i, ts) {
    const charR     = Math.min((team.characterSize || 68) / 2, laneH() / 2 - 6);
    const ballR     = (team.ballSize || 26) / 2;
    const ballOff   = team.ballOffset || 34;

    const rx     = racerX(team.progress);
    const cy     = laneCY(i);
    const bounce = Animator.getBounceOffset(team, ts);
    const now    = Date.now();

    // ── Speed trail ─────────────────────────────────────────
    if (team.speedBoost > 1.05) {
      const len = (team.speedBoost - 1) * 75;
      const tg  = ctx.createLinearGradient(rx - len - charR, cy, rx - charR, cy);
      tg.addColorStop(0, 'transparent');
      tg.addColorStop(1, (team.accentColor || '#fff') + 'aa');
      ctx.fillStyle = tg;
      ctx.beginPath();
      ctx.ellipse(rx - charR - len / 2, cy, len / 2, charR * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Speed outer glow ─────────────────────────────────────
    if (team.speedBoost > 1.2) {
      const str = Math.min((team.speedBoost - 1) / 3, 1);
      const gr  = charR * 1.7;
      const grd = ctx.createRadialGradient(rx, cy, charR * 0.3, rx, cy, gr);
      let col;
      if (team.speedBoost >= 3)      col = `rgba(200,0,255,${str*.55})`;
      else if (team.speedBoost >= 2) col = `rgba(0,180,255,${str*.50})`;
      else                           col = `rgba(255,140,0,${str*.45})`;
      grd.addColorStop(0, col);
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(rx - gr, cy - gr, gr * 2, gr * 2);
    }

    // ── Effect overlay ring ───────────────────────────────────
    if (team.effect && team.effectEnd > now) {
      const alpha = Math.min((team.effectEnd - now) / 1500, 1) * 0.45;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(rx, cy + bounce, charR * 1.5, 0, Math.PI * 2);
      switch (team.effect) {
        case 'rainbow': ctx.fillStyle = `hsl(${(ts / 7) % 360},100%,60%)`; break;
        case 'turbo':   ctx.fillStyle = '#00cfff'; break;
        case 'fire':    ctx.fillStyle = '#ff7b1a'; break;
        default:        ctx.fillStyle = team.accentColor || '#fff';
      }
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // ── Character (clipped circle) ────────────────────────────
    Animator.drawCharacter(ctx, team, rx, cy + bounce, charR, ts);

    // ── Ball (in front of character) ─────────────────────────
    const ballX = rx + charR + ballOff;
    if (ballX < FINISH_X + 15) {
      const ballBounce = Animator.getBallBounce(team, ts);
      Animator.drawBall(ctx, team, ballX, cy + ballBounce, ballR, ts);
    }

    // ── Small logo badge on top-right of character ────────────
    const badgeR = 11;
    const badgeX = rx + charR * 0.62;
    const badgeY = cy + bounce - charR * 0.62;

    ctx.fillStyle = 'rgba(0,0,0,.72)';
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, badgeR + 2, 0, Math.PI * 2);
    ctx.fill();

    Animator.drawLogo(ctx, team, badgeX, badgeY, badgeR);
  }

  // ── Speed lines ───────────────────────────────────────────
  function drawSpeedLines() {
    ctx.save();
    for (let i = 0; i < teamsRef.length; i++) {
      const t  = teamsRef[i];
      if (t.speedBoost < 1.55) continue;

      const rx  = racerX(t.progress);
      const cy  = laneCY(i);
      const cnt = Math.floor((t.speedBoost - 1.5) * 5);

      for (let j = 0; j < cnt; j++) {
        const offY = (j - cnt / 2) * 9;
        const len  = (t.speedBoost - 1) * 35;
        ctx.globalAlpha = 0.15 + j * 0.04;
        ctx.strokeStyle = t.accentColor || '#fff';
        ctx.lineWidth   = 1.2;
        ctx.beginPath();
        ctx.moveTo(rx - 18 - len, cy + offY);
        ctx.lineTo(rx - 18, cy + offY);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // ── Particle System ───────────────────────────────────────
  function spawnEffect(team, effectType) {
    if (!team.particles) team.particles = [];
    const i   = teamsRef.indexOf(team);
    const x   = racerX(team.progress);
    const cy  = laneCY(i);
    const lh  = laneH();

    const presets = {
      flash:   { count: 12,  color: '#fff',           speed: 58,  sz:[3,6],  decay:.038 },
      boost:   { count: 20,  color: team.accentColor, speed: 80,  sz:[3,8],  decay:.030 },
      fire:    { count: 32,  color: '#ff7b1a',        speed: 95,  sz:[4,10], decay:.024 },
      turbo:   { count: 48,  color: '#00cfff',        speed: 115, sz:[4,11], decay:.019 },
      rainbow: { count: 65,  color: null,             speed: 135, sz:[4,12], decay:.015 },
    };
    const p = presets[effectType] || presets.flash;
    const spread = Math.min(lh * 0.42, 36);

    for (let k = 0; k < p.count; k++) {
      const angle = Math.random() * Math.PI * 2;
      const spd   = p.speed * (0.5 + Math.random() * 0.5);
      const sz    = p.sz[0] + Math.random() * (p.sz[1] - p.sz[0]);
      const col   = p.color || `hsl(${Math.random() * 360},100%,60%)`;

      team.particles.push({
        x, y: cy + (Math.random() - 0.5) * spread,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd * 0.55,
        color: col, size: sz,
        life: 1, decay: p.decay + Math.random() * 0.01,
      });
    }
  }

  function updateParticles(team, dt) {
    if (!team.particles || team.particles.length === 0) return;
    team.particles = team.particles.filter(p => p.life > 0);
    for (const p of team.particles) {
      p.x   += p.vx * dt;
      p.y   += p.vy * dt;
      p.vy  += 38 * dt;
      p.vx  *= 0.97;
      p.life -= p.decay;
    }
  }

  function drawParticles() {
    ctx.save();
    for (const t of teamsRef) {
      if (!t.particles || t.particles.length === 0) continue;
      for (const p of t.particles) {
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle   = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  return { init, setTeamGifts, draw, spawnEffect, updateParticles };
})();
