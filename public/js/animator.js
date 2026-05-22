// ============================================================
//  TIKTOK ESCAPE RACE v2 — Player Animation System
//
//  Supports two modes per team (configured in config/teams.js):
//
//  Mode A — Simple Image (useSprite: false)
//    Uses the playerImage PNG.
//    Applies a vertical bounce to simulate running.
//    Ball rotates based on distance travelled.
//
//  Mode B — Sprite Sheet (useSprite: true)
//    Uses playerSprite sheet: all frames on ONE horizontal row.
//    Frame layout: frameWidth × frames = total image width.
//    Cycles frames automatically at the configured duration.
// ============================================================

const Animator = (() => {

  // Preloaded images
  const sprites  = {};   // { teamId: HTMLImageElement (sprite sheet) }
  const players  = {};   // { teamId: HTMLImageElement (single image) }
  const balls    = {};   // { teamId: HTMLImageElement }  — keyed by team.id or 'default'
  const logos    = {};   // { teamId: HTMLImageElement }

  function _img(src) {
    const i = new Image();
    i.src = src;
    return i;
  }

  // Call once after teams config is loaded
  function preload(teams) {
    let defaultBallSrc = null;
    for (const t of teams) {
      if (t.playerImage)  players[t.id]  = _img(t.playerImage);
      if (t.playerSprite) sprites[t.id]  = _img(t.playerSprite);
      if (t.logo)         logos[t.id]    = _img(t.logo);

      const ballSrc = t.ballImage || '/assets/balls/default-ball.png';
      balls[t.id] = _img(ballSrc);
      if (!defaultBallSrc) defaultBallSrc = ballSrc;
    }
    balls['default'] = _img(defaultBallSrc || '/assets/balls/default-ball.png');
  }

  // ── Mode A: vertical bounce offset ──────────────────────────
  function getBounceOffset(team, ts) {
    const speed  = team.animationSpeed ?? 1.0;
    const amount = 5;
    return Math.sin(ts * 0.009 * speed) * amount;
  }

  // Secondary bounce (slightly offset phase) used for the ball
  function getBallBounce(team, ts) {
    const speed = team.animationSpeed ?? 1.0;
    return Math.sin(ts * 0.009 * speed + 0.8) * 3;
  }

  // Ball rotation angle (based on how far the team has progressed)
  function getBallAngle(team) {
    return (team.progress ?? 0) * 0.20;
  }

  // ── Mode B: current sprite frame index ──────────────────────
  function getSpriteFrame(team, ts) {
    if (!team.sprite) return 0;
    const { frames, duration } = team.sprite;
    return Math.floor((ts % duration) / duration * frames);
  }

  // ── Draw character (player image or sprite or fallback) ──────
  //  x, y   = centre of character circle
  //  r      = radius of character circle
  //  ctx    = canvas 2d context
  function drawCharacter(ctx, team, x, y, r, ts) {
    // Clip to circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.clip();

    let drawn = false;

    if (team.useSprite) {
      // ── Mode B: sprite sheet ─────────────────────────────────
      const img = sprites[team.id];
      if (img && img.complete && img.naturalWidth > 0) {
        const { frameWidth, frameHeight } = team.sprite ?? {};
        if (frameWidth && frameHeight) {
          const frame = getSpriteFrame(team, ts);
          ctx.drawImage(img,
            frame * frameWidth, 0, frameWidth, frameHeight,
            x - r, y - r, r * 2, r * 2);
          drawn = true;
        }
      }
    }

    if (!drawn) {
      // ── Mode A: single player image ───────────────────────────
      const img = players[team.id];
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, x - r, y - r, r * 2, r * 2);
        drawn = true;
      }
    }

    if (!drawn) {
      // ── Fallback: coloured circle with short name ─────────────
      ctx.fillStyle = team.color || '#444';
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
      ctx.fillStyle = team.accentColor || '#fff';
      ctx.font = `bold ${Math.floor(r * 0.55)}px Segoe UI, Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(team.shortName || '?', x, y);
    }

    ctx.restore();

    // Border ring
    ctx.strokeStyle = team.accentColor || team.color || '#fff';
    ctx.lineWidth   = team.speedBoost > 1.5 ? 4 : 2.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // ── Draw ball ─────────────────────────────────────────────────
  //  x, y   = centre of ball
  //  r      = radius
  function drawBall(ctx, team, x, y, r, ts) {
    const angle = getBallAngle(team);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    const img = balls[team.id] || balls['default'];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, -r, -r, r * 2, r * 2);
    } else {
      // Fallback: simple soccer ball
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#111';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#333';
      const pr = r * 0.38;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        i === 0
          ? ctx.moveTo(Math.cos(a) * pr, Math.sin(a) * pr)
          : ctx.lineTo(Math.cos(a) * pr, Math.sin(a) * pr);
      }
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  // ── Logo (small badge) ────────────────────────────────────────
  function drawLogo(ctx, team, x, y, r) {
    const img = logos[team.id];
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.clip();

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, x - r, y - r, r * 2, r * 2);
    } else {
      ctx.fillStyle = team.color || '#555';
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
      ctx.fillStyle = team.accentColor || '#fff';
      ctx.font = `bold ${Math.floor(r * 0.7)}px Segoe UI, Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(team.shortName || '?', x, y);
    }

    ctx.restore();
  }

  return {
    preload,
    getBounceOffset,
    getBallBounce,
    getBallAngle,
    getSpriteFrame,
    drawCharacter,
    drawBall,
    drawLogo,
    // Expose for renderer
    logos,
  };
})();
