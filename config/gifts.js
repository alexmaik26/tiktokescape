// ============================================================
//  TIKTOK ESCAPE RACE v2 — Gift Mapping
//
//  ⚠  GIFT NAMES ARE REGION-SPECIFIC:
//     TikTok gift names vary by country. The names below are
//     common English names. Verify exact names in your region:
//
//  HOW TO FIND EXACT GIFT NAMES:
//     1. Start server with: set DEBUG=1 && npm start  (Windows)
//     2. Go LIVE on TikTok
//     3. Ask a viewer to send a gift
//     4. The terminal prints: [DEBUG gift] name="Rose" id=5655
//     5. Copy the exact name and update this file
//
//  RULES:
//     - Each gift name belongs to exactly ONE team
//     - Tiers: small | medium | big | mega | ultra
//     - Boost values come from game-config.js → boostTiers
//     - Per-gift overrides: add a `custom:{}` key (see example below)
//
//  HOW TO ADD A NEW GIFT:
//     'Exact Gift Name': { teamId: 'team-id', tier: 'small' },
//
//  HOW TO OVERRIDE BOOST VALUES FOR ONE SPECIFIC GIFT:
//     'Dragon': {
//       teamId: 'galatasaray', tier: 'ultra',
//       custom: { instantProgress: 500, speedMultiplier: 4.0 }
//     },
// ============================================================

const gameConfig = require('./game-config');

const giftMap = {

  // ═══════════════════════════════════════
  //  AL-HILAL  (blue)
  // ═══════════════════════════════════════
  'Rose':           { teamId: 'al-hilal', tier: 'small'  },
  'Heart Me':       { teamId: 'al-hilal', tier: 'medium' },
  'Confetti':       { teamId: 'al-hilal', tier: 'big'    },
  'Lion':           { teamId: 'al-hilal', tier: 'ultra'  },

  // ═══════════════════════════════════════
  //  AL-NASSR  (gold/yellow)
  // ═══════════════════════════════════════
  'TikTok':         { teamId: 'al-nassr', tier: 'small'  },
  'Love Bang':      { teamId: 'al-nassr', tier: 'medium' },
  'Fireworks':      { teamId: 'al-nassr', tier: 'mega'   },
  'Galaxy':         { teamId: 'al-nassr', tier: 'ultra'  },

  // ═══════════════════════════════════════
  //  FENERBAHÇE  (navy/yellow)
  // ═══════════════════════════════════════
  'Panda':          { teamId: 'fenerbahce', tier: 'small'  },
  'Sun Cream':      { teamId: 'fenerbahce', tier: 'medium' },
  'Butterfly':      { teamId: 'fenerbahce', tier: 'big'    },
  'Drama Queen':    { teamId: 'fenerbahce', tier: 'mega'   },

  // ═══════════════════════════════════════
  //  BEŞİKTAŞ  (black/white)
  // ═══════════════════════════════════════
  'Italian Hand':   { teamId: 'besiktas', tier: 'small'  },
  'Paper Crane':    { teamId: 'besiktas', tier: 'medium' },
  'VIP Entrance':   { teamId: 'besiktas', tier: 'big'    },
  'Yacht':          { teamId: 'besiktas', tier: 'mega'   },

  // ═══════════════════════════════════════
  //  GALATASARAY  (red/orange)
  // ═══════════════════════════════════════
  'Finger Heart':   { teamId: 'galatasaray', tier: 'small'  },
  'Wishing Bottle': { teamId: 'galatasaray', tier: 'medium' },
  'Cheer Bear':     { teamId: 'galatasaray', tier: 'big'    },
  'Universe':       { teamId: 'galatasaray', tier: 'ultra'  },

  // ═══════════════════════════════════════
  //  OLYMPIACOS  (red/white)
  // ═══════════════════════════════════════
  'Sunglasses':       { teamId: 'olympiacos', tier: 'small'  },
  'RGB Light Stick':  { teamId: 'olympiacos', tier: 'medium' },
  'Sports Car':       { teamId: 'olympiacos', tier: 'big'    },
  'Starship':         { teamId: 'olympiacos', tier: 'ultra'  },

  // ═══════════════════════════════════════
  //  BARCELONA  (blaugrana)
  // ═══════════════════════════════════════
  'Cap':            { teamId: 'barcelona', tier: 'small'  },
  'Perfume':        { teamId: 'barcelona', tier: 'medium' },
  'Castle':         { teamId: 'barcelona', tier: 'big'    },
  'Crown':          { teamId: 'barcelona', tier: 'mega'   },

  // ═══════════════════════════════════════
  //  REAL MADRID  (white/gold)
  // ═══════════════════════════════════════
  'Mic':            { teamId: 'real-madrid', tier: 'small'  },
  'Lucky Box':      { teamId: 'real-madrid', tier: 'medium' },
  'Fire':           { teamId: 'real-madrid', tier: 'big'    },
  'Superstar':      { teamId: 'real-madrid', tier: 'ultra'  },

  // ═══════════════════════════════════════
  //  PANATHINAIKOS  (green/white)
  // ═══════════════════════════════════════
  'Hat':            { teamId: 'panathinaikos', tier: 'small'  },
  'Doughnut':       { teamId: 'panathinaikos', tier: 'medium' },
  'Football':       { teamId: 'panathinaikos', tier: 'big'    },
  'Eagle':          { teamId: 'panathinaikos', tier: 'mega'   },

  // ═══════════════════════════════════════
  //  PARTIZAN  (black/white)
  // ═══════════════════════════════════════
  'Camera':         { teamId: 'partizan', tier: 'small'  },
  'Ice Cream':      { teamId: 'partizan', tier: 'medium' },
  'Bicycle':        { teamId: 'partizan', tier: 'big'    },
  'Diamond':        { teamId: 'partizan', tier: 'mega'   },

  // ═══════════════════════════════════════
  //  RED STAR BELGRADE  (red/white)
  // ═══════════════════════════════════════
  'Guitar':         { teamId: 'red-star', tier: 'small'  },
  'Cake':           { teamId: 'red-star', tier: 'medium' },
  'Lightning':      { teamId: 'red-star', tier: 'big'    },
  'Rocket':         { teamId: 'red-star', tier: 'mega'   },

};

// ─────────────────────────────────────────────────────────────
//  Lookup – called by server.js on every incoming gift event
// ─────────────────────────────────────────────────────────────
function findTeamByGift(giftName) {
  const entry = giftMap[giftName];
  if (!entry) return null;

  const tierCfg = gameConfig.boostTiers[entry.tier];
  if (!tierCfg) return null;

  const custom = entry.custom || {};

  return {
    teamId:          entry.teamId,
    tier:            entry.tier,
    instantProgress: custom.instantProgress ?? tierCfg.instantProgress,
    speedMultiplier: custom.speedMultiplier  ?? tierCfg.speedMultiplier,
    boostDurationMs: custom.boostDurationMs  ?? tierCfg.boostDurationMs,
    effectType:      custom.effectType       ?? tierCfg.effectType,
    soundEffect:     custom.soundEffect      ?? tierCfg.soundEffect,
  };
}

function getAllGifts() { return giftMap; }

module.exports = { findTeamByGift, getAllGifts, giftMap };
