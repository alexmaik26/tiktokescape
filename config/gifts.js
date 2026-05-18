// ============================================================
//  TIKTOK ESCAPE RACE — Gift Mapping
//
//  ⚠  IMPORTANT — GIFT NAMES ARE REGION-SPECIFIC:
//     TikTok gift names may differ between countries.
//     To find the exact names in your region:
//       1. Start a TikTok LIVE
//       2. Ask a friend to send any gift
//       3. Enable console logging (run server with DEBUG=1)
//          and check the terminal — it prints every gift name received
//       4. Update the names below to match exactly
//
//  RULES:
//    - Each gift name must belong to exactly ONE team
//    - Tiers: small | medium | big | mega | ultra
//    - Boost values come from game-config.js boostTiers
//      (you can override per-gift with custom: { progress, speedMultiplier, ... })
//
//  HOW TO ADD A GIFT:
//    'Exact Gift Name': { teamId: 'team-id', tier: 'small' },
// ============================================================

const gameConfig = require('./game-config');

const giftMap = {

  // ═══════════════════════════════
  //  AL-HILAL  (blue)
  // ═══════════════════════════════
  'Rose':            { teamId: 'al-hilal', tier: 'small'  },
  'Heart Me':        { teamId: 'al-hilal', tier: 'medium' },
  'Confetti':        { teamId: 'al-hilal', tier: 'big'    },
  'Lion':            { teamId: 'al-hilal', tier: 'ultra'  },

  // ═══════════════════════════════
  //  AL-NASSR  (yellow/gold)
  // ═══════════════════════════════
  'TikTok':          { teamId: 'al-nassr', tier: 'small'  },
  'Love Bang':       { teamId: 'al-nassr', tier: 'medium' },
  'Fireworks':       { teamId: 'al-nassr', tier: 'mega'   },
  'Galaxy':          { teamId: 'al-nassr', tier: 'ultra'  },

  // ═══════════════════════════════
  //  FENERBAHÇE  (yellow/navy)
  // ═══════════════════════════════
  'Panda':           { teamId: 'fenerbahce', tier: 'small'  },
  'Sun Cream':       { teamId: 'fenerbahce', tier: 'medium' },
  'Butterfly':       { teamId: 'fenerbahce', tier: 'big'    },
  'Drama Queen':     { teamId: 'fenerbahce', tier: 'mega'   },

  // ═══════════════════════════════
  //  BEŞİKTAŞ  (black/white)
  // ═══════════════════════════════
  'Italian Hand':    { teamId: 'besiktas', tier: 'small'  },
  'Paper Crane':     { teamId: 'besiktas', tier: 'medium' },
  'VIP Entrance':    { teamId: 'besiktas', tier: 'big'    },
  'Yacht':           { teamId: 'besiktas', tier: 'mega'   },

  // ═══════════════════════════════
  //  GALATASARAY  (red/orange)
  // ═══════════════════════════════
  'Finger Heart':    { teamId: 'galatasaray', tier: 'small'  },
  'Wishing Bottle':  { teamId: 'galatasaray', tier: 'medium' },
  'Cheer Bear':      { teamId: 'galatasaray', tier: 'big'    },
  'Universe':        { teamId: 'galatasaray', tier: 'ultra'  },

  // ═══════════════════════════════
  //  OLYMPIACOS  (red/white)
  // ═══════════════════════════════
  'Sunglasses':      { teamId: 'olympiacos', tier: 'small'  },
  'RGB Light Stick': { teamId: 'olympiacos', tier: 'medium' },
  'Sports Car':      { teamId: 'olympiacos', tier: 'big'    },
  'Starship':        { teamId: 'olympiacos', tier: 'ultra'  },

  // ═══════════════════════════════
  //  BARCELONA  (blaugrana)
  // ═══════════════════════════════
  'Cap':             { teamId: 'barcelona', tier: 'small'  },
  'Perfume':         { teamId: 'barcelona', tier: 'medium' },
  'Castle':          { teamId: 'barcelona', tier: 'big'    },
  'Crown':           { teamId: 'barcelona', tier: 'mega'   },

  // ═══════════════════════════════
  //  REAL MADRID  (white/gold)
  // ═══════════════════════════════
  'Mic':             { teamId: 'real-madrid', tier: 'small'  },
  'Lucky Box':       { teamId: 'real-madrid', tier: 'medium' },
  'Fire':            { teamId: 'real-madrid', tier: 'big'    },
  'Superstar':       { teamId: 'real-madrid', tier: 'ultra'  },

  // ═══════════════════════════════
  //  PSG  (dark blue/red)
  // ═══════════════════════════════
  'Hat':             { teamId: 'psg', tier: 'small'  },
  'Ice Cream':       { teamId: 'psg', tier: 'medium' },
  'Football':        { teamId: 'psg', tier: 'big'    },
  'Diamond':         { teamId: 'psg', tier: 'mega'   },

  // ═══════════════════════════════
  //  BAYERN MUNICH  (red/gold)
  // ═══════════════════════════════
  'Camera':          { teamId: 'bayern', tier: 'small'  },
  'Doughnut':        { teamId: 'bayern', tier: 'medium' },
  'Bicycle':         { teamId: 'bayern', tier: 'big'    },
  'Rocket':          { teamId: 'bayern', tier: 'mega'   },

  // ═══════════════════════════════
  //  MANCHESTER CITY  (sky blue)
  // ═══════════════════════════════
  'Guitar':          { teamId: 'man-city', tier: 'small'  },
  'Cake':            { teamId: 'man-city', tier: 'medium' },
  'Lightning':       { teamId: 'man-city', tier: 'big'    },
  'Eagle':           { teamId: 'man-city', tier: 'ultra'  },
};

// ─────────────────────────────────────────────────────────────
//  Lookup function — called by server.js on every gift event
// ─────────────────────────────────────────────────────────────
function findTeamByGift(giftName) {
  const entry = giftMap[giftName];
  if (!entry) return null;

  const tierConfig = gameConfig.boostTiers[entry.tier];
  if (!tierConfig) return null;

  // Allow per-gift overrides (add a `custom` key to any gift entry above)
  const custom = entry.custom || {};

  return {
    teamId:          entry.teamId,
    tier:            entry.tier,
    boostPoints:     custom.progress        ?? tierConfig.progress,
    speedMultiplier: custom.speedMultiplier ?? tierConfig.speedMultiplier,
    speedDuration:   custom.speedDuration   ?? tierConfig.speedDuration,
    effect:          custom.effect          ?? tierConfig.effect,
  };
}

function getAllGifts() {
  return giftMap;
}

module.exports = { findTeamByGift, getAllGifts, giftMap };
