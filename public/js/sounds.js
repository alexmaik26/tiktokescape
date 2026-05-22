// ============================================================
//  TIKTOK ESCAPE RACE v2 — Sound Manager
//
//  Place audio files in: public/assets/sounds/
//    small-gift.mp3   – small & medium gifts
//    big-gift.mp3     – big gifts
//    mega-boost.mp3   – mega & ultra gifts
//    winner.mp3       – winner celebration
//
//  Missing files are silently ignored – the game never crashes.
// ============================================================

const SoundManager = (() => {
  const loaded = {};

  const files = {
    small:  '/assets/sounds/small-gift.mp3',
    big:    '/assets/sounds/big-gift.mp3',
    mega:   '/assets/sounds/mega-boost.mp3',
    winner: '/assets/sounds/winner.mp3',
  };

  const volumes = { small: 0.45, big: 0.55, mega: 0.65, winner: 0.75 };

  async function init() {
    for (const [key, src] of Object.entries(files)) {
      try {
        const a = new Audio(src);
        a.volume = volumes[key] ?? 0.5;
        a.load();
        loaded[key] = a;
      } catch { /* file missing – silently skip */ }
    }
  }

  function play(key) {
    const s = loaded[key];
    if (!s) return;
    try {
      const c = s.cloneNode();
      c.volume = s.volume;
      c.play().catch(() => {});
    } catch { }
  }

  // soundKey comes from gift config: 'small' | 'big' | 'mega'
  function playFromGift(soundKey) {
    play(soundKey || 'small');
  }

  return { init, play, playFromGift };
})();
