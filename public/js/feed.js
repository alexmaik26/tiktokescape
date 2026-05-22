// ============================================================
//  TIKTOK ESCAPE RACE v2 — Live Gift Feed
// ============================================================

const FeedManager = (() => {

  let teamsRef  = [];
  let maxItems  = 6;
  let itemTTL   = 8000;

  const TIER_ICON = { small:'⚡', medium:'🔥', big:'🚀', mega:'💥', ultra:'🌟' };

  function init(teams, config) {
    teamsRef = teams;
    maxItems = config?.feedMaxItems   ?? 6;
    itemTTL  = config?.feedItemDuration ?? 8000;
  }

  function addItem(data) {
    const team = teamsRef.find(t => t.id === data.teamId);
    if (!team) return;

    const container = document.getElementById('feedItems');
    if (!container) return;

    const color = team.accentColor || team.color || '#fff';
    const icon  = TIER_ICON[data.giftTier] || '🎁';

    const el = document.createElement('div');
    el.className = 'feed-item';
    el.style.borderColor = color;
    el.innerHTML = `
      <div class="fi-viewer">👤 ${_esc(data.nickname || data.uniqueId || 'Viewer')}</div>
      <div class="fi-gift">${icon} ${_esc(data.giftName || 'Gift')}</div>
      <div class="fi-boost" style="color:${color}">→ ${_esc(team.name)} +${data.instantProgress}</div>
    `;

    // Insert at top
    container.insertBefore(el, container.firstChild);

    // Prune oldest items
    while (container.children.length > maxItems) {
      _remove(container.lastChild);
    }

    // Auto-remove after TTL
    setTimeout(() => _remove(el), itemTTL);
  }

  function _remove(el) {
    if (!el || !el.parentNode) return;
    el.classList.add('removing');
    setTimeout(() => el.parentNode?.removeChild(el), 420);
  }

  function _esc(s) {
    const d = document.createElement('div');
    d.textContent = String(s);
    return d.innerHTML;
  }

  return { init, addItem };
})();
