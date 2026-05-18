// ============================================================
//  TIKTOK ESCAPE RACE — Sound Manager
//  Audio files go in: public/assets/sounds/
//    small-gift.mp3   — played on small/medium gifts
//    big-gift.mp3     — played on big/mega/ultra gifts
//    winner.mp3       — played when a winner is declared
//  Missing files are silently ignored.
// ============================================================

const SoundManager = (() => {
  const sounds = {};

  // Map tier → file key
  const tierToKey = {
    small:  'small',
    medium: 'small',
    big:    'big',
    mega:   'big',
    ultra:  'big',
  };

  async function init() {
    const files = {
      small:  '/assets/sounds/small-gift.mp3',
      big:    '/assets/sounds/big-gift.mp3',
      winner: '/assets/sounds/winner.mp3',
    };

    for (const [key, src] of Object.entries(files)) {
      try {
        const audio = new Audio(src);
        audio.volume = key === 'winner' ? 0.75 : 0.50;
        // Preload
        audio.load();
        sounds[key] = audio;
      } catch (e) {
        // File missing or format not supported — continue silently
      }
    }
  }

  function play(key) {
    const s = sounds[key];
    if (!s) return;
    try {
      const clone = s.cloneNode();
      clone.volume = s.volume;
      clone.play().catch(() => {});
    } catch (e) {}
  }

  function playForTier(tier) {
    play(tierToKey[tier] || 'small');
  }

  return { init, play, playForTier };
})();
