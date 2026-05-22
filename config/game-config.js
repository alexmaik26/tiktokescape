// ============================================================
//  TIKTOK ESCAPE RACE v2 — Game Configuration
//  Edit this file to customise all game behaviour.
// ============================================================

module.exports = {

  // ─── TIKTOK ───────────────────────────────────────────────
  // Your TikTok username WITHOUT the @ symbol
  tiktokUsername: 'YOUR_TIKTOK_USERNAME',

  // Advanced connector options – usually leave as-is
  tiktokOptions: {
    enableExtendedGiftInfo: true,
  },

  // ─── SERVER ───────────────────────────────────────────────
  port: 3000,

  // ─── DISPLAY ──────────────────────────────────────────────
  resolution: { width: 1080, height: 1920 },   // Portrait 9:16

  // ─── RACE ─────────────────────────────────────────────────
  // Progress needed to win (finish line)
  raceTarget: 1000,

  // Progress per second added automatically to every team (base movement).
  // At 0.5 and raceTarget 1000 → ~33 min with ZERO gifts.
  // With moderate gifts expect 6-10 min races. Lower = longer races.
  baseSpeed: 0.5,

  // Maximum speed multiplier any team can ever reach (stacking cap)
  maxSpeedMultiplier: 4.0,

  // Max progress from a single gift event (anti-spam cap)
  maxBoostPerEvent: 400,

  // ─── TIMING ───────────────────────────────────────────────
  winnerScreenDuration: 10000,   // ms winner screen is shown
  countdownDuration:    5,       // seconds of countdown before race

  // ─── LEADERBOARD ──────────────────────────────────────────
  leaderboardMaxWins: 100,       // only last N wins are tracked

  // ─── GIFT FEED ────────────────────────────────────────────
  feedMaxItems:     6,           // max feed entries visible at once
  feedItemDuration: 8000,        // ms before entry fades out

  // ─── GIFT MAP PANEL ───────────────────────────────────────
  giftMapRotateMs: 4000,         // ms between rotating to next team group

  // ─── BOOST TIERS ──────────────────────────────────────────
  // Default values for each tier.
  // Individual gifts in gifts.js can override these with a `custom:{}` key.
  //
  // instantProgress  – immediate progress added
  // speedMultiplier  – temporary speed multiplier (1.0 = no boost)
  // boostDurationMs  – how long the speed boost lasts
  // effectType       – flash | boost | fire | turbo | rainbow
  // soundEffect      – small | big | mega
  boostTiers: {
    small: {
      instantProgress:  5,
      speedMultiplier:  1.0,
      boostDurationMs:  0,
      effectType:       'flash',
      soundEffect:      'small',
    },
    medium: {
      instantProgress:  20,
      speedMultiplier:  1.35,
      boostDurationMs:  4000,
      effectType:       'boost',
      soundEffect:      'small',
    },
    big: {
      instantProgress:  60,
      speedMultiplier:  1.85,
      boostDurationMs:  6000,
      effectType:       'fire',
      soundEffect:      'big',
    },
    mega: {
      instantProgress:  150,
      speedMultiplier:  2.6,
      boostDurationMs:  9000,
      effectType:       'turbo',
      soundEffect:      'mega',
    },
    ultra: {
      instantProgress:  400,
      speedMultiplier:  3.5,
      boostDurationMs:  12000,
      effectType:       'rainbow',
      soundEffect:      'mega',
    },
  },
};
