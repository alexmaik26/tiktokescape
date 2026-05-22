// ============================================================
//  TIKTOK ESCAPE RACE v2 — Leaderboard Strip
//  Renders a thin horizontal bar above the gift boosts panel.
//  Shows all teams sorted by wins (most wins first).
// ============================================================

const LeaderboardManager = (() => {

  let teamsRef = [];

  function init(teams) {
    teamsRef = teams;
    // Render initial zero state
    render(teams.map(t => ({ team: t, wins: 0 })));
  }

  function update(data) {
    const { wins } = data;
    if (!wins) return;

    const sorted = teamsRef
      .map(t => ({ team: t, wins: wins[t.id] || 0 }))
      .sort((a, b) => b.wins - a.wins);

    render(sorted);
  }

  function render(sorted) {
    const strip = document.getElementById('leaderboardStrip');
    if (!strip) return;
    strip.innerHTML = '';

    for (const { team, wins } of sorted) {
      const entry = document.createElement('div');
      entry.className = 'ls-entry';

      const logo = document.createElement('img');
      logo.className = 'ls-logo';
      logo.src = team.logo;
      logo.alt = '';
      logo.onerror = () => { logo.style.opacity = '.25'; };

      const name = document.createElement('span');
      name.className = 'ls-name';
      name.style.color = wins > 0
        ? (team.accentColor || '#fff')
        : 'rgba(255,255,255,.3)';
      name.textContent = team.shortName || team.name;

      const winsEl = document.createElement('span');
      winsEl.className = 'ls-wins';
      winsEl.textContent = wins > 0 ? wins : '–';
      if (wins > 0) winsEl.style.color = '#FFD700';

      entry.appendChild(logo);
      entry.appendChild(name);
      entry.appendChild(winsEl);
      strip.appendChild(entry);
    }
  }

  return { init, update };
})();
