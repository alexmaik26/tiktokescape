// ============================================================
//  TIKTOK ESCAPE RACE — Canvas Renderer
//  Handles all visual drawing: background, lanes, racers,
//  particles, finish line, speed effects.
// ============================================================

const Renderer = (() => {

  // ─── Layout constants ──────────────────────────────────────
  const W           = 1920;
  const H           = 1080;
  const HEADER_H    = 72;
  const LABEL_W     = 195;   // left side: rank + logo + name
  const TRACK_LEFT  = LABEL_W;
  const TRACK_RIGHT = 1790;
  const TRACK_W     = TRACK_RIGHT - TRACK_LEFT;
  const FINISH_W    = 22;    // width of checkered finish block

  let canvas, ctx;
  let teamsRef = [];
  let configRef = {};
  let teamImgs   = {};       // { teamId: HTMLImageElement (logo) }
  let playerImgs = {};       // { teamId: HTMLImageElement (player) }
  let bgGrad, headerGrad;

  // ─── Init ──────────────────────────────────────────────────
  function init(canvasEl, teams, config) {
    canvas   = canvasEl;
    ctx      = canvas.getContext('2d');
    teamsRef = teams;
    configRef = config;

    for (const t of teams) {
      teamImgs[t.id]   = makeImage(t.logo);
      playerImgs[t.id] = makeImage(t.player.image);
    }

    // Pre-build static gradients
    bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0,   '#080d18');
    bgGrad.addColorStop(0.5, '#0a1220');
    bgGrad.addColorStop(1,   '#050810');

    headerGrad = ctx.createLinearGradient(0, 0, 0, HEADER_H);
    headerGrad.addColorStop(0, 'rgba(0,0,0,.94)');
    headerGrad.addColorStop(1, 'rgba(0,0,0,.70)');
  }

  function makeImage(src) {
    const img = new Image();
    img.src = src;
    return img;
  }

  // ─── Per-team geometry ─────────────────────────────────────
  function laneH()      { return (H - HEADER_H) / teamsRef.length; }
  function laneTop(i)   { return HEADER_H + i * laneH(); }
  function laneCY(i)    { return laneTop(i) + laneH() / 2; }
  function racerX(prog) { return TRACK_LEFT + (prog / 100) * TRACK_W; }

  // ─── Particle System ───────────────────────────────────────
  function spawnEffect(team, effectType) {
    const x  = racerX(team.progress);
    const y  = laneCY(teamsRef.indexOf(team));
    const lh = laneH();

    if (!team.particles) team.particles = [];

    const configs = {
      flash:   { count: 10,  color: '#ffffff',        speed: 55,  size: [3,6],  life: .035 },
      boost:   { count: 18,  color: team.accentColor, speed: 75,  size: [3,7],  life: .028 },
      fire:    { count: 30,  color: '#ff7b1a',        speed: 90,  size: [4,9],  life: .022 },
      turbo:   { count: 45,  color: '#00cfff',        speed: 110, size: [4,10], life: .018 },
      rainbow: { count: 60,  color: null,             speed: 130, size: [4,12], life: .014 },
    };

    const c = configs[effectType] || configs.flash;
    const spread = Math.min(lh * 0.45, 38);

    for (let i = 0; i < c.count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd   = c.speed * (.5 + Math.random() * .5);
      const sz    = c.size[0] + Math.random() * (c.size[1] - c.size[0]);
      const col   = c.color || `hsl(${Math.random() * 360},100%,60%)`;

      team.particles.push({
        x, y: y + (Math.random() - .5) * spread,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd * .55,
        color: col, size: sz,
        life: 1, decay: c.life + Math.random() * .01,
      });
    }
  }

  function updateParticles(team, dt) {
    if (!team.particles || team.particles.length === 0) return;
    team.particles = team.particles.filter(p => p.life > 0);
    for (const p of team.particles) {
      p.x  += p.vx * dt;
      p.y  += p.vy * dt;
      p.vy += 35 * dt;       // gentle gravity
      p.vx *= .97;
      p.life -= p.decay;
    }
  }

  // ─── Main Draw ─────────────────────────────────────────────
  function draw(gameState, teams, winner, ts) {
    ctx.clearRect(0, 0, W, H);

    drawBackground(ts);
    drawHeader(ts);
    drawLanes(ts);
    drawFinishLine();
    drawRacers(ts);
    drawParticles();
    if (gameState === 'racing') drawSpeedLines();
  }

  // ─── Background ────────────────────────────────────────────
  function drawBackground(ts) {
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Stadium light cones from top
    const lightX = [120, 420, 720, 960, 1200, 1500, 1800];
    for (const lx of lightX) {
      const g = ctx.createRadialGradient(lx, 0, 0, lx, 200, 280);
      g.addColorStop(0, 'rgba(255,230,140,.10)');
      g.addColorStop(1, 'rgba(255,230,140,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, 380);
    }

    // Alternating lane grass strips
    const lh = laneH();
    for (let i = 0; i < teamsRef.length; i++) {
      ctx.fillStyle = i % 2 === 0
        ? 'rgba(18,40,28,.55)'
        : 'rgba(12,28,18,.55)';
      ctx.fillRect(TRACK_LEFT, laneTop(i), TRACK_W + FINISH_W + 10, lh);
    }

    // Subtle crowd noise rows below track
    ctx.fillStyle = 'rgba(20,32,50,.5)';
    for (let y = Math.max(HEADER_H + teamsRef.length * lh, 900); y < H; y += 14) {
      ctx.fillRect(0, y, W, 8);
    }
  }

  // ─── Header bar ────────────────────────────────────────────
  function drawHeader(ts) {
    ctx.fillStyle = headerGrad;
    ctx.fillRect(0, 0, W, HEADER_H);

    // Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 30px "Segoe UI", Arial';
    ctx.fillText('🏟  TIKTOK ESCAPE RACE', W / 2, 38);

    // Sub-line
    ctx.font = '14px "Segoe UI", Arial';
    ctx.fillStyle = 'rgba(255,255,255,.45)';
    ctx.fillText('Send gifts to boost your team!  ·  First to the finish line wins!', W / 2, 58);

    // Bottom border
    ctx.strokeStyle = 'rgba(255,200,0,.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, HEADER_H);
    ctx.lineTo(W, HEADER_H);
    ctx.stroke();
  }

  // ─── Lanes + Labels ────────────────────────────────────────
  function drawLanes(ts) {
    const lh = laneH();
    const sorted = [...teamsRef].sort((a, b) => b.progress - a.progress);

    for (let i = 0; i < teamsRef.length; i++) {
      const t   = teamsRef[i];
      const ty  = laneTop(i);
      const cy  = laneCY(i);
      const rank = sorted.indexOf(t) + 1;

      // Subtle lane separator
      ctx.strokeStyle = 'rgba(255,255,255,.07)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, ty + lh);
      ctx.lineTo(W, ty + lh);
      ctx.stroke();

      // Thin progress stripe along bottom of lane
      drawLaneProgressBar(t, ty, lh);

      // Left label block
      drawTeamLabel(t, ty, lh, cy, rank);
    }
  }

  function drawLaneProgressBar(team, ty, lh) {
    const barH = 3;
    const barY = ty + lh - barH;

    ctx.fillStyle = 'rgba(255,255,255,.08)';
    ctx.fillRect(TRACK_LEFT, barY, TRACK_W, barH);

    const pct = team.progress / 100;
    if (pct <= 0) return;

    const g = ctx.createLinearGradient(TRACK_LEFT, 0, TRACK_LEFT + TRACK_W, 0);
    g.addColorStop(0, team.color    || '#4caf50');
    g.addColorStop(1, team.accentColor || '#8bc34a');
    ctx.fillStyle = g;
    ctx.fillRect(TRACK_LEFT, barY, TRACK_W * pct, barH);
  }

  function drawTeamLabel(team, ty, lh, cy, rank) {
    const logoSize = Math.min(lh - 16, 52);
    const logoX = 40;
    const logoY = cy - logoSize / 2;

    // Rank
    const isFirst = rank === 1;
    ctx.fillStyle = isFirst ? '#FFD700' : 'rgba(255,255,255,.45)';
    ctx.font = `bold ${isFirst ? 20 : 16}px "Segoe UI", Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(`#${rank}`, 20, cy + 6);

    // Logo circle background
    ctx.fillStyle = 'rgba(0,0,0,.4)';
    ctx.beginPath();
    ctx.arc(logoX + logoSize / 2, cy, logoSize / 2 + 3, 0, Math.PI * 2);
    ctx.fill();

    // Logo image or fallback
    const img = teamImgs[team.id];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(logoX + logoSize / 2, cy, logoSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
      ctx.restore();
    } else {
      drawColorCircle(team, logoX, cy, logoSize / 2, team.shortName || team.name.slice(0, 3));
    }

    // Team name
    const nameX = logoX + logoSize + 8;
    const maxW  = LABEL_W - nameX - 4;

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold 13px "Segoe UI", Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(truncateText(team.name, maxW), nameX, cy - 4);

    // Player name
    ctx.fillStyle = 'rgba(255,255,255,.48)';
    ctx.font = `11px "Segoe UI", Arial`;
    ctx.fillText(truncateText(team.player.name, maxW), nameX, cy + 11);
  }

  function drawColorCircle(team, x, cy, r, label) {
    ctx.fillStyle = team.color || '#555';
    ctx.beginPath();
    ctx.arc(x + r, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.floor(r * .7)}px "Segoe UI", Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(label, x + r, cy + r * .25);
  }

  function truncateText(text, maxW) {
    if (ctx.measureText(text).width <= maxW) return text;
    while (text.length > 2 && ctx.measureText(text + '…').width > maxW) {
      text = text.slice(0, -1);
    }
    return text + '…';
  }

  // ─── Finish Line ───────────────────────────────────────────
  function drawFinishLine() {
    const x    = TRACK_RIGHT;
    const top  = HEADER_H;
    const h    = H - HEADER_H;
    const sq   = 11;

    // Checkered pattern
    const rows = Math.ceil(h / sq);
    for (let r = 0; r < rows; r++) {
      for (let col = 0; col < 2; col++) {
        const even = (r + col) % 2 === 0;
        ctx.fillStyle = even ? '#fff' : '#111';
        ctx.fillRect(x + col * sq - sq, top + r * sq, sq, sq);
      }
    }

    // Glow
    const glow = ctx.createLinearGradient(x - 40, 0, x + 40, 0);
    glow.addColorStop(0, 'rgba(255,255,255,0)');
    glow.addColorStop(.5, 'rgba(255,255,255,.12)');
    glow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(x - 40, top, 80, h);

    // "FINISH" label (rotated)
    ctx.save();
    ctx.translate(x + 18, top + h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.font = 'bold 13px "Segoe UI", Arial';
    ctx.textAlign = 'center';
    ctx.fillText('FINISH', 0, 4);
    ctx.restore();
  }

  // ─── Racers ────────────────────────────────────────────────
  function drawRacers(ts) {
    const lh = laneH();
    for (let i = 0; i < teamsRef.length; i++) {
      drawRacer(teamsRef[i], i, lh, ts);
    }
  }

  function drawRacer(team, i, lh, ts) {
    const x    = racerX(team.progress);
    const cy   = laneCY(i);
    const size = Math.min(lh - 14, 68);
    const r    = size / 2;
    const now  = Date.now();

    // ── Speed trail ──
    if (team.speedBoost > 1.05) {
      const len = (team.speedBoost - 1) * 70;
      const trailG = ctx.createLinearGradient(x - len, cy, x - r, cy);
      trailG.addColorStop(0, 'transparent');
      const ac = team.accentColor || '#fff';
      trailG.addColorStop(1, ac + 'aa');
      ctx.fillStyle = trailG;
      ctx.beginPath();
      ctx.ellipse(x - r - len / 2, cy, len / 2, r * .55, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Outer glow (boost active) ──
    if (team.speedBoost > 1.2) {
      const strength = Math.min((team.speedBoost - 1) / 3, 1);
      const glowR    = r * 1.7;
      const glow     = ctx.createRadialGradient(x, cy, r * .3, x, cy, glowR);
      let glowCol;
      if (team.speedBoost >= 3)    glowCol = `rgba(200,0,255,${strength * .55})`;
      else if (team.speedBoost >= 2) glowCol = `rgba(0,180,255,${strength * .5})`;
      else                          glowCol = `rgba(255,130,0,${strength * .45})`;

      glow.addColorStop(0, glowCol);
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(x - glowR, cy - glowR, glowR * 2, glowR * 2);
    }

    // ── Effect overlay ring ──
    if (team.effect && team.effectEnd > now) {
      const alpha = Math.min((team.effectEnd - now) / 1500, 1) * .45;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(x, cy, r * 1.5, 0, Math.PI * 2);
      if (team.effect === 'rainbow') {
        ctx.fillStyle = `hsl(${(ts / 8) % 360},100%,60%)`;
      } else if (team.effect === 'turbo') {
        ctx.fillStyle = '#00cfff';
      } else if (team.effect === 'fire') {
        ctx.fillStyle = '#ff7b1a';
      } else {
        ctx.fillStyle = team.accentColor || '#fff';
      }
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // ── Player image (clipped circle) ──
    const playerImg = playerImgs[team.id];
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, cy, r, 0, Math.PI * 2);
    ctx.clip();
    if (playerImg && playerImg.complete && playerImg.naturalWidth > 0) {
      ctx.drawImage(playerImg, x - r, cy - r, size, size);
    } else {
      ctx.fillStyle = team.color || '#333';
      ctx.fillRect(x - r, cy - r, size, size);
      ctx.fillStyle = team.accentColor || '#fff';
      ctx.font = `bold ${Math.floor(r * .55)}px "Segoe UI", Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(team.shortName || '?', x, cy + r * .2);
    }
    ctx.restore();

    // ── Circle border ──
    ctx.strokeStyle = team.accentColor || team.color || '#fff';
    ctx.lineWidth   = team.speedBoost > 1.5 ? 4 : 2.5;
    ctx.beginPath();
    ctx.arc(x, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // ── Logo badge (top-right of racer) ──
    const bR   = 14;
    const bx   = x + r * .6;
    const by   = cy - r * .6;
    const logo = teamImgs[team.id];

    ctx.fillStyle = 'rgba(0,0,0,.75)';
    ctx.beginPath();
    ctx.arc(bx, by, bR + 2, 0, Math.PI * 2);
    ctx.fill();

    if (logo && logo.complete && logo.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(bx, by, bR, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(logo, bx - bR, by - bR, bR * 2, bR * 2);
      ctx.restore();
    }
  }

  // ─── Speed Lines ───────────────────────────────────────────
  function drawSpeedLines() {
    ctx.save();
    for (let i = 0; i < teamsRef.length; i++) {
      const t = teamsRef[i];
      if (t.speedBoost < 1.6) continue;

      const x  = racerX(t.progress);
      const cy = laneCY(i);
      const lines = Math.floor((t.speedBoost - 1.5) * 5);

      for (let j = 0; j < lines; j++) {
        const off = (j - lines / 2) * 9;
        const len = (t.speedBoost - 1) * 32;
        const a   = (.15 + .05 * j);
        ctx.globalAlpha = a;
        ctx.strokeStyle = t.accentColor || '#fff';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x - 16 - len, cy + off);
        ctx.lineTo(x - 16, cy + off);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // ─── Particles ─────────────────────────────────────────────
  function drawParticles() {
    ctx.save();
    for (const t of teamsRef) {
      if (!t.particles) continue;
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

  // ─── Public API ────────────────────────────────────────────
  return { init, draw, spawnEffect, updateParticles };
})();
