// ============================================================
//  TIKTOK ESCAPE RACE v2 — Teams & Player Configuration
//
//  PLAYER ASSET PATHS:
//    playerImage  → public/assets/players/<filename>.png
//    playerSprite → public/assets/sprites/<filename>.png
//    logo         → public/assets/logos/<filename>.png
//    ballImage    → public/assets/balls/<filename>.png
//
//  ANIMATION MODES:
//    useSprite: false  → uses playerImage with CSS-style bounce animation
//    useSprite: true   → uses playerSprite sheet, plays frame by frame
//
//  SPRITE SHEET FORMAT:
//    All frames on a single horizontal row.
//    frameWidth × frames = total image width
//    frameHeight = image height
//    Example: 6 frames × 96px wide × 96px tall = 576×96 image
//
//  If any asset is missing, a coloured fallback is shown silently.
// ============================================================

module.exports = {
  teams: [

    // ─── AL-HILAL ─────────────────────────────────────────
    {
      id:          'al-hilal',
      name:        'Al-Hilal',
      shortName:   'HIL',
      color:       '#1565C0',
      accentColor: '#42A5F5',

      logo:        '/assets/logos/al-hilal.png',

      playerName:  'Salem Al-Dawsari',
      playerImage: '/assets/players/al-hilal-player.png',
      playerSprite: '/assets/sprites/al-hilal-run.png',
      useSprite:   false,
      sprite: { frameWidth: 96, frameHeight: 96, frames: 6, duration: 600, loop: true },

      characterSize: 68,
      ballImage:  '/assets/balls/default-ball.png',
      ballSize:   26,
      ballOffset: 34,
      animationType:  'bounce-run',
      animationSpeed: 1.0,
    },

    // ─── AL-NASSR ─────────────────────────────────────────
    {
      id:          'al-nassr',
      name:        'Al-Nassr',
      shortName:   'NAS',
      color:       '#E65100',
      accentColor: '#FFD54F',

      logo:        '/assets/logos/al-nassr.png',

      playerName:  'Cristiano Ronaldo',
      playerImage: '/assets/players/al-nassr-player.png',
      playerSprite: '/assets/sprites/al-nassr-run.png',
      useSprite:   false,
      sprite: { frameWidth: 96, frameHeight: 96, frames: 6, duration: 600, loop: true },

      characterSize: 68,
      ballImage:  '/assets/balls/default-ball.png',
      ballSize:   26,
      ballOffset: 34,
      animationType:  'bounce-run',
      animationSpeed: 1.0,
    },

    // ─── FENERBAHÇE ───────────────────────────────────────
    {
      id:          'fenerbahce',
      name:        'Fenerbahçe',
      shortName:   'FEN',
      color:       '#1B4F8A',
      accentColor: '#FFEE58',

      logo:        '/assets/logos/fenerbahce.png',

      playerName:  'Talisca',
      playerImage: '/assets/players/fenerbahce-player.png',
      playerSprite: '/assets/sprites/fenerbahce-run.png',
      useSprite:   false,
      sprite: { frameWidth: 96, frameHeight: 96, frames: 6, duration: 600, loop: true },

      characterSize: 68,
      ballImage:  '/assets/balls/default-ball.png',
      ballSize:   26,
      ballOffset: 34,
      animationType:  'bounce-run',
      animationSpeed: 1.0,
    },

    // ─── BEŞİKTAŞ ────────────────────────────────────────
    {
      id:          'besiktas',
      name:        'Beşiktaş',
      shortName:   'BJK',
      color:       '#212121',
      accentColor: '#E0E0E0',

      logo:        '/assets/logos/besiktas.png',

      playerName:  'Orkun Kökçü',
      playerImage: '/assets/players/besiktas-player.png',
      playerSprite: '/assets/sprites/besiktas-run.png',
      useSprite:   false,
      sprite: { frameWidth: 96, frameHeight: 96, frames: 6, duration: 600, loop: true },

      characterSize: 68,
      ballImage:  '/assets/balls/default-ball.png',
      ballSize:   26,
      ballOffset: 34,
      animationType:  'bounce-run',
      animationSpeed: 1.0,
    },

    // ─── GALATASARAY ──────────────────────────────────────
    {
      id:          'galatasaray',
      name:        'Galatasaray',
      shortName:   'GS',
      color:       '#B71C1C',
      accentColor: '#FF8F00',

      logo:        '/assets/logos/galatasaray.png',

      playerName:  'Victor Osimhen',
      playerImage: '/assets/players/galatasaray-player.png',
      playerSprite: '/assets/sprites/galatasaray-run.png',
      useSprite:   false,
      sprite: { frameWidth: 96, frameHeight: 96, frames: 6, duration: 600, loop: true },

      characterSize: 68,
      ballImage:  '/assets/balls/default-ball.png',
      ballSize:   26,
      ballOffset: 34,
      animationType:  'bounce-run',
      animationSpeed: 1.05,
    },

    // ─── OLYMPIACOS ───────────────────────────────────────
    {
      id:          'olympiacos',
      name:        'Olympiacos',
      shortName:   'OLY',
      color:       '#B71C1C',
      accentColor: '#EF9A9A',

      logo:        '/assets/logos/olympiacos.png',

      playerName:  'Ayoub El Kaabi',
      playerImage: '/assets/players/olympiacos-player.png',
      playerSprite: '/assets/sprites/olympiacos-run.png',
      useSprite:   false,
      sprite: { frameWidth: 96, frameHeight: 96, frames: 6, duration: 600, loop: true },

      characterSize: 68,
      ballImage:  '/assets/balls/default-ball.png',
      ballSize:   26,
      ballOffset: 34,
      animationType:  'bounce-run',
      animationSpeed: 1.0,
    },

    // ─── BARCELONA ────────────────────────────────────────
    {
      id:          'barcelona',
      name:        'Barcelona',
      shortName:   'BAR',
      color:       '#0D47A1',
      accentColor: '#CC0000',

      logo:        '/assets/logos/barcelona.png',

      playerName:  'Lamine Yamal',
      playerImage: '/assets/players/barcelona-player.png',
      playerSprite: '/assets/sprites/barcelona-run.png',
      useSprite:   false,
      sprite: { frameWidth: 96, frameHeight: 96, frames: 6, duration: 600, loop: true },

      characterSize: 68,
      ballImage:  '/assets/balls/default-ball.png',
      ballSize:   26,
      ballOffset: 34,
      animationType:  'bounce-run',
      animationSpeed: 1.1,
    },

    // ─── REAL MADRID ──────────────────────────────────────
    {
      id:          'real-madrid',
      name:        'Real Madrid',
      shortName:   'RMA',
      color:       '#FAFAFA',
      accentColor: '#FFD700',

      logo:        '/assets/logos/real-madrid.png',

      playerName:  'Kylian Mbappé',
      playerImage: '/assets/players/real-madrid-player.png',
      playerSprite: '/assets/sprites/real-madrid-run.png',
      useSprite:   false,
      sprite: { frameWidth: 96, frameHeight: 96, frames: 6, duration: 550, loop: true },

      characterSize: 68,
      ballImage:  '/assets/balls/default-ball.png',
      ballSize:   26,
      ballOffset: 34,
      animationType:  'bounce-run',
      animationSpeed: 1.15,
    },

    // ─── PANATHINAIKOS ────────────────────────────────────
    {
      id:          'panathinaikos',
      name:        'Panathinaikos',
      shortName:   'PAO',
      color:       '#1B5E20',
      accentColor: '#66BB6A',

      logo:        '/assets/logos/panathinaikos.png',

      playerName:  'Tasos Bakasetas',
      playerImage: '/assets/players/panathinaikos-player.png',
      playerSprite: '/assets/sprites/panathinaikos-run.png',
      useSprite:   false,
      sprite: { frameWidth: 96, frameHeight: 96, frames: 6, duration: 600, loop: true },

      characterSize: 68,
      ballImage:  '/assets/balls/default-ball.png',
      ballSize:   26,
      ballOffset: 34,
      animationType:  'bounce-run',
      animationSpeed: 1.0,
    },

    // ─── PARTIZAN ─────────────────────────────────────────
    {
      id:          'partizan',
      name:        'Partizan',
      shortName:   'PAR',
      color:       '#212121',
      accentColor: '#FFFFFF',

      logo:        '/assets/logos/partizan.png',

      playerName:  'Bibars Natcho',
      playerImage: '/assets/players/partizan-player.png',
      playerSprite: '/assets/sprites/partizan-run.png',
      useSprite:   false,
      sprite: { frameWidth: 96, frameHeight: 96, frames: 6, duration: 600, loop: true },

      characterSize: 68,
      ballImage:  '/assets/balls/default-ball.png',
      ballSize:   26,
      ballOffset: 34,
      animationType:  'bounce-run',
      animationSpeed: 1.0,
    },

    // ─── RED STAR BELGRADE ────────────────────────────────
    {
      id:          'red-star',
      name:        'Red Star',
      shortName:   'CZV',
      color:       '#C62828',
      accentColor: '#FF8A80',

      logo:        '/assets/logos/red-star-belgrade.png',

      playerName:  'Mirko Ivanić',
      playerImage: '/assets/players/red-star-player.png',
      playerSprite: '/assets/sprites/red-star-run.png',
      useSprite:   false,
      sprite: { frameWidth: 96, frameHeight: 96, frames: 6, duration: 600, loop: true },

      characterSize: 68,
      ballImage:  '/assets/balls/default-ball.png',
      ballSize:   26,
      ballOffset: 34,
      animationType:  'bounce-run',
      animationSpeed: 1.0,
    },

  ],
};
