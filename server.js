// ============================================================
//  TIKTOK ESCAPE RACE — Backend Server
//  Node.js + Express + Socket.IO + TikTok Live Connector
// ============================================================

const express    = require('express');
const http       = require('http');
const { Server } = require('socket.io');
const path       = require('path');

const gameConfig           = require('./config/game-config');
const { teams }            = require('./config/teams');
const { findTeamByGift, getAllGifts } = require('./config/gifts');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: '*' } });

const DEBUG = process.env.DEBUG === '1';

// ─── Static files ────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ─── API: Send config to the browser ─────────────────────────
app.get('/api/config', (_req, res) => {
  res.json({
    teams,
    game: {
      baseSpeed:            gameConfig.baseSpeed,
      raceLength:           gameConfig.raceLength,
      winnerScreenDuration: gameConfig.winnerScreenDuration,
      countdownDuration:    gameConfig.countdownDuration,
      boostTiers:           gameConfig.boostTiers,
      feedMaxItems:         gameConfig.feedMaxItems,
      feedItemDuration:     gameConfig.feedItemDuration,
      maxBoostPerEvent:     gameConfig.maxBoostPerEvent,
      maxSpeedMultiplier:   gameConfig.maxSpeedMultiplier,
    },
  });
});

// ─── API: Gift map (for debug page) ──────────────────────────
app.get('/api/gifts', (_req, res) => {
  res.json(getAllGifts());
});

// ─── Helpers ─────────────────────────────────────────────────
function log(...args) {
  console.log(new Date().toLocaleTimeString(), ...args);
}

function handleGiftEvent(eventData) {
  // Broadcast to all connected browser clients
  io.emit('gift', eventData);

  if (DEBUG || true) {
    log(
      `[GIFT] ${eventData.nickname || eventData.uniqueId}`,
      `→ ${eventData.teamId}`,
      `| ${eventData.giftName}`,
      `(${eventData.giftTier})`,
      `| +${eventData.boostPoints} pts`,
      eventData.speedMultiplier > 1 ? `| ${eventData.speedMultiplier}x speed ${eventData.speedDuration}ms` : '',
    );
  }
}

// ─── Socket.IO ───────────────────────────────────────────────
io.on('connection', (socket) => {
  log('[Socket] Client connected:', socket.id);

  // Dev-mode: browser can simulate a gift event
  socket.on('simulate-gift', (data) => {
    const tier     = data.tier || 'small';
    const tierConf = gameConfig.boostTiers[tier] || gameConfig.boostTiers.small;

    handleGiftEvent({
      uniqueId:        'DevTest',
      nickname:        'DevTest',
      giftName:        data.giftName || `Test ${tier}`,
      giftId:          0,
      teamId:          data.teamId,
      giftTier:        tier,
      boostPoints:     tierConf.progress,
      speedMultiplier: tierConf.speedMultiplier,
      speedDuration:   tierConf.speedDuration,
      effect:          tierConf.effect,
      repeatCount:     1,
    });
  });

  socket.on('disconnect', () => {
    log('[Socket] Client disconnected:', socket.id);
  });
});

// ─── TikTok Live Connection ───────────────────────────────────
let tiktokConnection = null;
let reconnectTimer   = null;

function connectToTikTok() {
  if (
    !gameConfig.tiktokUsername ||
    gameConfig.tiktokUsername === 'YOUR_TIKTOK_USERNAME'
  ) {
    log('[TikTok] No username set — running in DEMO MODE only.');
    log('[TikTok] Open config/game-config.js and set tiktokUsername.');
    return;
  }

  // Dynamically require so missing package doesn't crash demo mode
  let WebcastPushConnection;
  try {
    ({ WebcastPushConnection } = require('tiktok-live-connector'));
  } catch (e) {
    log('[TikTok] tiktok-live-connector not found. Run: npm install');
    return;
  }

  log(`[TikTok] Connecting to @${gameConfig.tiktokUsername}…`);

  tiktokConnection = new WebcastPushConnection(
    gameConfig.tiktokUsername,
    gameConfig.tiktokOptions,
  );

  tiktokConnection
    .connect()
    .then((state) => {
      log(`[TikTok] ✓ Connected — Room ID: ${state.roomId}`);
      clearTimeout(reconnectTimer);
    })
    .catch((err) => {
      log('[TikTok] Connection failed:', err.message);
      scheduleReconnect(30000);
    });

  // ── Gift event ────────────────────────────────────────────
  tiktokConnection.on('gift', (data) => {
    // For streakable gifts (type 1), only fire when the streak ends
    if (data.giftType === 1 && !data.repeatEnd) return;

    const giftName = data.giftName || '';

    // Log every gift in DEBUG mode so you can learn exact gift names
    if (DEBUG) {
      log(`[DEBUG gift] name="${giftName}" id=${data.giftId} repeat=${data.repeatCount}`);
    }

    const giftResult = findTeamByGift(giftName);
    if (!giftResult) {
      if (DEBUG) log(`[DEBUG] Unknown gift: "${giftName}" — add it to config/gifts.js`);
      return;
    }

    const repeat = data.repeatCount || 1;

    handleGiftEvent({
      uniqueId:        data.uniqueId,
      nickname:        data.nickname || data.uniqueId,
      giftName,
      giftId:          data.giftId,
      teamId:          giftResult.teamId,
      giftTier:        giftResult.tier,
      boostPoints:     Math.min(giftResult.boostPoints * repeat, gameConfig.maxBoostPerEvent),
      speedMultiplier: Math.min(giftResult.speedMultiplier, gameConfig.maxSpeedMultiplier),
      speedDuration:   giftResult.speedDuration,
      effect:          giftResult.effect,
      repeatCount:     repeat,
    });
  });

  tiktokConnection.on('disconnected', () => {
    log('[TikTok] Disconnected — reconnecting in 10 s…');
    scheduleReconnect(10000);
  });

  tiktokConnection.on('error', (err) => {
    log('[TikTok] Error:', err.message || err);
  });
}

function scheduleReconnect(delay) {
  clearTimeout(reconnectTimer);
  reconnectTimer = setTimeout(connectToTikTok, delay);
}

// ─── Start ────────────────────────────────────────────────────
const PORT = gameConfig.port || 3000;

server.listen(PORT, () => {
  const line = '═'.repeat(44);
  console.log(`\n╔${line}╗`);
  console.log(`║          TIKTOK ESCAPE RACE SERVER           ║`);
  console.log(`╠${line}╣`);
  console.log(`║  Game:     http://localhost:${PORT}               ║`);
  console.log(`║  Dev Mode: http://localhost:${PORT}?dev=1          ║`);
  console.log(`║  TikTok:   @${(gameConfig.tiktokUsername || 'NOT SET').padEnd(31)}║`);
  console.log(`╚${line}╝\n`);

  connectToTikTok();
});

// Graceful shutdown
process.on('SIGINT', () => {
  log('\n[Server] Shutting down…');
  if (tiktokConnection) tiktokConnection.disconnect().catch(() => {});
  server.close(() => process.exit(0));
});
