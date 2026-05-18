// ============================================================
//  TIKTOK ESCAPE RACE — Game Configuration
//  Edit this file to customize the game behaviour.
// ============================================================

module.exports = {

  // ─── TIKTOK ───────────────────────────────────────────────
  // Change this to your TikTok username (without @)
  tiktokUsername: 'YOUR_TIKTOK_USERNAME',

  // Advanced TikTok connection options (usually leave as-is)
  tiktokOptions: {
    enableExtendedGiftInfo: true,
    // processInitialData: true,
    // fetchRoomInfoOnConnect: true,
  },

  // ─── SERVER ───────────────────────────────────────────────
  port: 3000,

  // ─── GAME TIMING ──────────────────────────────────────────
  // Base speed: progress points added per second without any gifts.
  // 100 / baseSpeed = seconds to finish with no gifts.
  // At 0.4 → ~250 seconds (~4 min) with no gifts. Lower = longer race.
  baseSpeed: 0.4,

  // Maximum progress (finish line). Keep at 100.
  raceLength: 100,

  // How long the winner screen is shown (milliseconds)
  winnerScreenDuration: 10000,

  // Countdown before a new race (seconds)
  countdownDuration: 5,

  // ─── DISPLAY ──────────────────────────────────────────────
  resolution: {
    width: 1920,
    height: 1080,
  },

  // ─── GIFT FEED ────────────────────────────────────────────
  feedMaxItems: 8,          // Max visible items in the gift feed
  feedItemDuration: 8000,   // ms before a feed item fades out

  // ─── BOOST TIERS ─────────────────────────────────────────
  // These define what each gift tier does.
  // progress:        immediate progress points added (0-100)
  // speedMultiplier: temporary speed multiplier (1.0 = no boost)
  // speedDuration:   how long the speed boost lasts (ms)
  // effect:          visual effect type: flash | boost | fire | turbo | rainbow
  boostTiers: {
    small: {
      progress: 2,
      speedMultiplier: 1.0,
      speedDuration: 0,
      effect: 'flash',
    },
    medium: {
      progress: 8,
      speedMultiplier: 1.4,
      speedDuration: 4000,
      effect: 'boost',
    },
    big: {
      progress: 22,
      speedMultiplier: 2.0,
      speedDuration: 6000,
      effect: 'fire',
    },
    mega: {
      progress: 55,
      speedMultiplier: 2.8,
      speedDuration: 9000,
      effect: 'turbo',
    },
    ultra: {
      progress: 100,
      speedMultiplier: 3.5,
      speedDuration: 12000,
      effect: 'rainbow',
    },
  },

  // Safety cap: max progress from a single gift event (prevents instant-win exploits)
  maxBoostPerEvent: 100,

  // Safety cap: max speed multiplier (stacking prevention)
  maxSpeedMultiplier: 4.0,
};
