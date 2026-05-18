// ============================================================
//  TIKTOK ESCAPE RACE — Gift Feed Manager
//  Manages the live gift feed overlay on the right side.
// ============================================================

const FeedManager = (() => {

  let teamsRef   = [];
  let maxItems   = 8;
  let itemTTL    = 8000;
  let feedItems  = [];   // { id, el, timerId }

  const TIER_ICON = {
    small:  '⚡',
    medium: '🔥',
    big:    '🚀',
    mega:   '💥',
    ultra:  '🌟',
  };

  function init(teams, config) {
    teamsRef = teams;
    maxItems = config?.feedMaxItems   ?? 8;
    itemTTL  = config?.feedItemDuration ?? 8000;
  }

  function addItem(data) {
    const team = teamsRef.find(t => t.id === data.teamId);
    if (!team) return;

    const container = document.getElementById('feedItems');
    if (!container) return;

    const id    = `fi-${Date.now()}-${Math.random()}`;
    const icon  = TIER_ICON[data.giftTier] || '🎁';
    const color = team.accentColor || team.color || '#fff';

    const el = document.createElement('div');
    el.className = 'feed-item';
    el.id        = id;
    el.style.borderColor = color;
    el.innerHTML = `
      <div class="fi-viewer">👤 ${esc(data.nickname || data.uniqueId || 'Viewer')}</div>
      <div class="fi-gift">${icon} ${esc(data.giftName || 'Gift')}</div>
      <div class="fi-boost" style="color:${color}">→ ${esc(team.name)} +${data.boostPoints}</div>
    `;

    // Insert at top
    if (container.firstChild) {
      container.insertBefore(el, container.firstChild);
    } else {
      container.appendChild(el);
    }

    // Remove excess items
    while (container.children.length > maxItems) {
      const last = container.lastChild;
      if (last) removeEl(last);
    }

    // Schedule auto-removal
    const timerId = setTimeout(() => removeEl(el), itemTTL);
    feedItems.push({ id, el, timerId });
  }

  function removeEl(el) {
    if (!el || !el.parentNode) return;
    el.classList.add('removing');
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 420);
    feedItems = feedItems.filter(fi => fi.el !== el);
  }

  function esc(str) {
    const d = document.createElement('div');
    d.textContent = String(str);
    return d.innerHTML;
  }

  return { init, addItem };
})();
