// ============================================================
//  TIKTOK ESCAPE RACE v2 — Backend Server
//  Express + Socket.IO + TikTok Live Connector
//  Portrait 9:16 | Session Leaderboard | Gift Processing
// ============================================================

const express    = require('express');
const http       = require('http');
const { Server } = require('socket.io');
const path       = require('path');

const cfg                          = require('./config/game-config');
const { teams }                    = require('./config/teams');
const { findTeamByGift, getAllGifts } = require('./config/gifts');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: '*' } });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const DEBUG = process.env.DEBUG === '1';

// ─── Session Leaderboard ─────────────────────────────────────
// Resets when the server restarts (= new live session).
const leaderboard = {
  wins:          {},   // { teamId: count }
  recentWinners: [],   // array of teamId strings (most recent first)
};

teams.forEach(t => { leaderboard.wins[t.id] = 0; });

function recordWin(teamId) {
  leaderboard.wins[teamId] = (leaderboard.wins[teamId] || 0) + 1;
  leaderboard.recentWinners.unshift(teamId);

  // Keep only the last N wins
  if (leaderboard.recentWinners.length > cfg.leaderboardMaxWins) {
    const removed = leaderboard.recentWinners.pop();
    // Recount: faster than full rebuild since we only removed one
    if (leaderboard.wins[removed] > 0) leaderboard.wins[removed]--;
  }

  io.emit('leaderboard-update', buildLeaderboardPayload());
}

function buildLeaderboardPayload() {
  return {
    wins:          leaderboard.wins,
    recentWinners: leaderboard.recentWinners.slice(0, 20),
    totalRaces:    leaderboard.recentWinners.length,
  };
}

// ─── APIs ─────────────────────────────────────────────────────
app.get('/api/config', (_req, res) => {
  res.json({
    teams,
    game: {
      baseSpeed:            cfg.baseSpeed,
      raceTarget:           cfg.raceTarget,
      maxSpeedMultiplier:   cfg.maxSpeedMultiplier,
      maxBoostPerEvent:     cfg.maxBoostPerEvent,
      winnerScreenDuration: cfg.winnerScreenDuration,
      countdownDuration:    cfg.countdownDuration,
      leaderboardMaxWins:   cfg.leaderboardMaxWins,
      feedMaxItems:         cfg.feedMaxItems,
      feedItemDuration:     cfg.feedItemDuration,
      giftMapRotateMs:      cfg.giftMapRotateMs,
      boostTiers:           cfg.boostTiers,
      resolution:           cfg.resolution,
    },
  });
});

app.get('/api/gifts', (_req, res) => {
  res.json(getAllGifts());
});

app.get('/api/leaderboard', (_req, res) => {
  res.json(buildLeaderboardPayload());
});

// ─── Helper ───────────────────────────────────────────────────
function log(...args) {
  const t = new Date().toLocaleTimeString();
  console.log(t, ...args);
}

function handleGiftEvent(data) {
  io.emit('gift', data);
  log(
    `[GIFT] ${data.nickname || data.uniqueId}`,
    `→ ${data.teamId}`,
    `| "${data.giftName}"`,
    `(${data.giftTier})`,
    `| +${data.instantProgress} pts`,
    data.speedMultiplier > 1 ? `| ×${data.speedMultiplier} speed` : '',
  );
}

// ─── Socket.IO ────────────────────────────────────────────────
io.on('connection', (socket) => {
  log('[Socket] Client connected:', socket.id);

  // Send current leaderboard to newly connected client
  socket.emit('leaderboard-update', buildLeaderboardPayload());

  // Winner notification from client (client decides win, server records it)
  socket.on('race-winner', ({ teamId }) => {
    if (!teams.find(t => t.id === teamId)) return;
    log(`[Race] Winner: ${teamId}`);
    recordWin(teamId);
    // Broadcast to all clients so every browser source is in sync
    io.emit('race-winner', { teamId });
  });

  // Dev mode: simulate gift from browser
  socket.on('simulate-gift', (data) => {
    const tier    = data.tier || 'small';
    const tierCfg = cfg.boostTiers[tier] || cfg.boostTiers.small;

    handleGiftEvent({
      uniqueId:        'DevTest',
      nickname:        'DevTest',
      giftName:        `Test ${tier}`,
      giftId:          0,
      teamId:          data.teamId,
      giftTier:        tier,
      instantProgress: tierCfg.instantProgress,
      speedMultiplier: tierCfg.speedMultiplier,
      boostDurationMs: tierCfg.boostDurationMs,
      effectType:      tierCfg.effectType,
      soundEffect:     tierCfg.soundEffect,
      repeatCount:     1,
    });
  });

  socket.on('disconnect', () => {
    log('[Socket] Client disconnected:', socket.id);
  });
});

// ─── TikTok Live Connection ───────────────────────────────────
let tiktokConn   = null;
let reconnTimer  = null;

function connectTikTok() {
  if (!cfg.tiktokUsername || cfg.tiktokUsername === 'YOUR_TIKTOK_USERNAME') {
    log('[TikTok] No username set → DEMO MODE only.');
    log('[TikTok] Edit config/game-config.js → tiktokUsername');
    return;
  }

  let WebcastPushConnection;
  try {
    ({ WebcastPushConnection } = require('tiktok-live-connector'));
  } catch {
    log('[TikTok] tiktok-live-connector not installed. Run: npm install');
    return;
  }

  log(`[TikTok] Connecting to @${cfg.tiktokUsername}…`);
  tiktokConn = new WebcastPushConnection(cfg.tiktokUsername, cfg.tiktokOptions);

  tiktokConn.connect()
    .then(state => {
      log(`[TikTok] ✓ Connected – Room ID: ${state.roomId}`);
      clearTimeout(reconnTimer);
    })
    .catch(err => {
      log('[TikTok] Connection failed:', err.message);
      scheduleReconnect(30_000);
    });

  tiktokConn.on('gift', (data) => {
    // Skip mid-streak events; only fire on streak end (repeatEnd)
    if (data.giftType === 1 && !data.repeatEnd) return;

    const name = data.giftName || '';

    if (DEBUG) {
      log(`[DEBUG gift] name="${name}" id=${data.giftId} repeat=${data.repeatCount}`);
    }

    const result = findTeamByGift(name);
    if (!result) {
      if (DEBUG) log(`[DEBUG] Unknown gift: "${name}" — add it to config/gifts.js`);
      return;
    }

    const repeat = data.repeatCount || 1;

    handleGiftEvent({
      uniqueId:        data.uniqueId,
      nickname:        data.nickname || data.uniqueId,
      giftName:        name,
      giftId:          data.giftId,
      teamId:          result.teamId,
      giftTier:        result.tier,
      instantProgress: Math.min(result.instantProgress * repeat, cfg.maxBoostPerEvent),
      speedMultiplier: Math.min(result.speedMultiplier, cfg.maxSpeedMultiplier),
      boostDurationMs: result.boostDurationMs,
      effectType:      result.effectType,
      soundEffect:     result.soundEffect,
      repeatCount:     repeat,
    });
  });

  tiktokConn.on('disconnected', () => {
    log('[TikTok] Disconnected – reconnecting in 10 s…');
    scheduleReconnect(10_000);
  });

  tiktokConn.on('error', err => {
    log('[TikTok] Error:', err.message || err);
  });
}

function scheduleReconnect(ms) {
  clearTimeout(reconnTimer);
  reconnTimer = setTimeout(connectTikTok, ms);
}

// ─── Start ────────────────────────────────────────────────────
const PORT = cfg.port || 3000;

server.listen(PORT, () => {
  const line = '═'.repeat(44);
  console.log(`\n╔${line}╗`);
  console.log(`║       TIKTOK ESCAPE RACE v2 · SERVER        ║`);
  console.log(`╠${line}╣`);
  console.log(`║  Game:     http://localhost:${PORT}               ║`);
  console.log(`║  Dev Mode: http://localhost:${PORT}?dev=1          ║`);
  console.log(`║  TikTok:   @${(cfg.tiktokUsername || 'NOT SET').padEnd(31)}║`);
  console.log(`╚${line}╝\n`);
  connectTikTok();
});

process.on('SIGINT', () => {
  log('\n[Server] Shutting down…');
  if (tiktokConn) tiktokConn.disconnect().catch(() => {});
  server.close(() => process.exit(0));
});
