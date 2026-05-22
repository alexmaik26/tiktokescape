// ============================================================
//  TIKTOK ESCAPE RACE v2 — Gift Configuration
//  Verified gift names for Greece region.
//
//  3 gifts per team: Mini (1 coin, 1pt) · Medium (10 coins, 5pt) · Mega (500 coins, 25pt)
//  Every gift name is unique — no gift belongs to two teams.
//
//  HOW TO VERIFY GIFT NAMES IN YOUR REGION:
//    1. Start server:  set DEBUG=1 && npm start
//    2. Go LIVE on TikTok
//    3. Ask a viewer to send a gift
//    4. Terminal prints: [DEBUG gift] name="Rose" id=5655
//    5. Update giftName below to match exactly
//
//  HOW TO ADD / CHANGE A GIFT:
//    Edit the giftsConfig array below. Fields:
//      giftName  – exact TikTok gift name (case-sensitive)
//      giftIcon  – emoji shown in UI when image is missing
//      giftImage – path to local PNG in public/assets/gifts/
//      teamId    – must match id in config/teams.js
//      tier      – 'Mini' | 'Medium' | 'Mega'
//      coinPrice – for reference only (not used in game logic)
//      points    – instantProgress added to the team's race bar
// ============================================================

const gameConfig = require('./game-config');

const giftsConfig = [

  // ══════════════════════════════════════════════
  //  AL-HILAL
  // ══════════════════════════════════════════════
  { giftName: 'Rose',             giftIcon: '🌹', giftImage: '/assets/gifts/rose.png',                 teamId: 'al-hilal',      tier: 'Mini',   coinPrice: 1,   points: 1  },
  { giftName: 'Rosa',             giftIcon: '🌺', giftImage: '/assets/gifts/rosa.png',                 teamId: 'al-hilal',      tier: 'Medium', coinPrice: 10,  points: 5  },
  { giftName: 'Money Gun',        giftIcon: '💸', giftImage: '/assets/gifts/money-gun.png',             teamId: 'al-hilal',      tier: 'Mega',   coinPrice: 500, points: 25 },

  // ══════════════════════════════════════════════
  //  AL-NASSR
  // ══════════════════════════════════════════════
  { giftName: 'Pop',              giftIcon: '🎉', giftImage: '/assets/gifts/pop.png',                  teamId: 'al-nassr',      tier: 'Mini',   coinPrice: 1,   points: 1  },
  { giftName: 'Friendship Necklace', giftIcon: '📿', giftImage: '/assets/gifts/friendship-necklace.png', teamId: 'al-nassr',   tier: 'Medium', coinPrice: 10,  points: 5  },
  { giftName: "Lion's Mane",      giftIcon: '🦁', giftImage: '/assets/gifts/lions-mane.png',           teamId: 'al-nassr',      tier: 'Mega',   coinPrice: 500, points: 25 },

  // ══════════════════════════════════════════════
  //  FENERBAHÇE
  // ══════════════════════════════════════════════
  { giftName: 'GG',               giftIcon: '🎮', giftImage: '/assets/gifts/gg.png',                   teamId: 'fenerbahce',    tier: 'Mini',   coinPrice: 1,   points: 1  },
  { giftName: 'Slow motion',      giftIcon: '🐢', giftImage: '/assets/gifts/slow-motion.png',           teamId: 'fenerbahce',    tier: 'Medium', coinPrice: 10,  points: 5  },
  { giftName: 'Mic Drop',         giftIcon: '🎤', giftImage: '/assets/gifts/mic-drop.png',              teamId: 'fenerbahce',    tier: 'Mega',   coinPrice: 500, points: 25 },

  // ══════════════════════════════════════════════
  //  BEŞİKTAŞ
  // ══════════════════════════════════════════════
  { giftName: "You're awesome",   giftIcon: '🙌', giftImage: '/assets/gifts/youre-awesome.png',         teamId: 'besiktas',      tier: 'Mini',   coinPrice: 1,   points: 1  },
  { giftName: 'Journey Pass',     giftIcon: '🎫', giftImage: '/assets/gifts/journey-pass.png',          teamId: 'besiktas',      tier: 'Medium', coinPrice: 10,  points: 5  },
  { giftName: "You're Amazing",   giftIcon: '⭐', giftImage: '/assets/gifts/youre-amazing.png',         teamId: 'besiktas',      tier: 'Mega',   coinPrice: 500, points: 25 },

  // ══════════════════════════════════════════════
  //  GALATASARAY
  // ══════════════════════════════════════════════
  { giftName: 'Love you so much', giftIcon: '💖', giftImage: '/assets/gifts/love-you-so-much.png',      teamId: 'galatasaray',   tier: 'Mini',   coinPrice: 1,   points: 1  },
  { giftName: 'League Ball',      giftIcon: '⚽', giftImage: '/assets/gifts/league-ball.png',           teamId: 'galatasaray',   tier: 'Medium', coinPrice: 10,  points: 5  },
  { giftName: 'VR Goggles',       giftIcon: '🥽', giftImage: '/assets/gifts/vr-goggles.png',            teamId: 'galatasaray',   tier: 'Mega',   coinPrice: 500, points: 25 },

  // ══════════════════════════════════════════════
  //  OLYMPIACOS
  // ══════════════════════════════════════════════
  { giftName: 'Creeper',          giftIcon: '🟩', giftImage: '/assets/gifts/creeper.png',               teamId: 'olympiacos',    tier: 'Mini',   coinPrice: 1,   points: 1  },
  { giftName: 'Lucky Pony',       giftIcon: '🐴', giftImage: '/assets/gifts/lucky-pony.png',            teamId: 'olympiacos',    tier: 'Medium', coinPrice: 10,  points: 5  },
  { giftName: 'DJ Glasses',       giftIcon: '🕶️', giftImage: '/assets/gifts/dj-glasses.png',           teamId: 'olympiacos',    tier: 'Mega',   coinPrice: 500, points: 25 },

  // ══════════════════════════════════════════════
  //  BARCELONA
  // ══════════════════════════════════════════════
  { giftName: 'Wink wink',        giftIcon: '😉', giftImage: '/assets/gifts/wink-wink.png',             teamId: 'barcelona',     tier: 'Mini',   coinPrice: 1,   points: 1  },
  { giftName: 'Chocolate',        giftIcon: '🍫', giftImage: '/assets/gifts/chocolate.png',             teamId: 'barcelona',     tier: 'Medium', coinPrice: 10,  points: 5  },
  { giftName: 'Manifesting',      giftIcon: '🔮', giftImage: '/assets/gifts/manifesting.png',           teamId: 'barcelona',     tier: 'Mega',   coinPrice: 500, points: 25 },

  // ══════════════════════════════════════════════
  //  REAL MADRID
  // ══════════════════════════════════════════════
  { giftName: 'Glow Stick',       giftIcon: '🪄', giftImage: '/assets/gifts/glow-stick.png',            teamId: 'real-madrid',   tier: 'Mini',   coinPrice: 1,   points: 1  },
  { giftName: 'Gold Boxing Gloves', giftIcon: '🥊', giftImage: '/assets/gifts/gold-boxing-gloves.png', teamId: 'real-madrid',   tier: 'Medium', coinPrice: 10,  points: 5  },
  { giftName: 'Dragon Crown',     giftIcon: '🐉', giftImage: '/assets/gifts/dragon-crown.png',          teamId: 'real-madrid',   tier: 'Mega',   coinPrice: 500, points: 25 },

  // ══════════════════════════════════════════════
  //  PANATHINAIKOS
  // ══════════════════════════════════════════════
  { giftName: 'Music Play',       giftIcon: '🎵', giftImage: '/assets/gifts/music-play.png',            teamId: 'panathinaikos', tier: 'Mini',   coinPrice: 1,   points: 1  },
  { giftName: 'Tiny Diny',        giftIcon: '🦖', giftImage: '/assets/gifts/tiny-diny.png',             teamId: 'panathinaikos', tier: 'Medium', coinPrice: 10,  points: 5  },
  { giftName: 'Star Map Polaris', giftIcon: '🗺️', giftImage: '/assets/gifts/star-map-polaris.png',     teamId: 'panathinaikos', tier: 'Mega',   coinPrice: 500, points: 25 },

  // ══════════════════════════════════════════════
  //  PARTIZAN
  // ══════════════════════════════════════════════
  { giftName: 'TikTok',           giftIcon: '🎶', giftImage: '/assets/gifts/tiktok.png',                teamId: 'partizan',      tier: 'Mini',   coinPrice: 1,   points: 1  },
  { giftName: 'Cherry Blossom Bunny', giftIcon: '🐰', giftImage: '/assets/gifts/cherry-blossom-bunny.png', teamId: 'partizan', tier: 'Medium', coinPrice: 10,  points: 5  },
  { giftName: 'XXXL Flowers',     giftIcon: '💐', giftImage: '/assets/gifts/xxxl-flowers.png',          teamId: 'partizan',      tier: 'Mega',   coinPrice: 500, points: 25 },

  // ══════════════════════════════════════════════
  //  RED STAR BELGRADE
  // ══════════════════════════════════════════════
  { giftName: 'Freestyle',        giftIcon: '🕺', giftImage: '/assets/gifts/freestyle.png',             teamId: 'red-star',      tier: 'Mini',   coinPrice: 1,   points: 1  },
  { giftName: 'Shepherd',         giftIcon: '🐑', giftImage: '/assets/gifts/shepherd.png',              teamId: 'red-star',      tier: 'Medium', coinPrice: 10,  points: 5  },
  { giftName: 'Flower Show',      giftIcon: '🌸', giftImage: '/assets/gifts/flower-show.png',           teamId: 'red-star',      tier: 'Mega',   coinPrice: 500, points: 25 },

];

// ─────────────────────────────────────────────────────────────
//  Fast name → entry lookup (used by server.js on every event)
// ─────────────────────────────────────────────────────────────
const giftLookup = {};
for (const g of giftsConfig) {
  giftLookup[g.giftName] = g;
}

// Tier display order (Mini first)
const TIER_ORDER = ['Mini', 'Medium', 'Mega'];

// ─────────────────────────────────────────────────────────────
//  Returns { teamId → [gifts sorted Mini→Medium→Mega] }
//  Included in /api/config so the frontend doesn't need a
//  separate request.
// ─────────────────────────────────────────────────────────────
function getTeamGiftsMap() {
  const map = {};
  for (const g of giftsConfig) {
    if (!map[g.teamId]) map[g.teamId] = [];
    map[g.teamId].push({
      giftName:  g.giftName,
      giftIcon:  g.giftIcon,
      giftImage: g.giftImage,
      tier:      g.tier,
      coinPrice: g.coinPrice,
      points:    g.points,
    });
  }
  for (const tid of Object.keys(map)) {
    map[tid].sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier));
  }
  return map;
}

// ─────────────────────────────────────────────────────────────
//  Called by server.js on every incoming TikTok gift event.
//  instantProgress comes from gift.points (not from boostTiers).
// ─────────────────────────────────────────────────────────────
function findTeamByGift(giftName) {
  const gift = giftLookup[giftName];
  if (!gift) return null;

  const tierCfg = gameConfig.boostTiers[gift.tier];
  if (!tierCfg) return null;

  return {
    teamId:          gift.teamId,
    tier:            gift.tier,
    instantProgress: gift.points,          // explicit per gift
    speedMultiplier: tierCfg.speedMultiplier,
    boostDurationMs: tierCfg.boostDurationMs,
    effectType:      tierCfg.effectType,
    soundEffect:     tierCfg.soundEffect,
    giftIcon:        gift.giftIcon,
    giftImage:       gift.giftImage,
  };
}

function getAllGifts() {
  return giftLookup;
}

module.exports = { findTeamByGift, getAllGifts, giftsConfig, getTeamGiftsMap };
