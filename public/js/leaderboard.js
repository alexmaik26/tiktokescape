// ============================================================
//  TIKTOK ESCAPE RACE v2 — Session Leaderboard
//  Session-based: resets when server restarts (new live).
// ============================================================

const LeaderboardManager = (() => {

  let teamsRef = [];

  function init(teams) {
    teamsRef = teams;
  }

  // Called when server emits 'leaderboard-update'
  function update(data) {
    const { wins } = data;
    if (!wins) return;

    // Build sorted list: most wins first
    const sorted = teamsRef
      .map(t => ({ team: t, wins: wins[t.id] || 0 }))
      .sort((a, b) => b.wins - a.wins);

    render(sorted);
  }

  function render(sorted) {
    const list = document.getElementById('leaderboardList');
    if (!list) return;
    list.innerHTML = '';

    sorted.forEach(({ team, wins }, idx) => {
      const rank = idx + 1;
      const row  = document.createElement('div');
      row.className = 'lb-row';

      const rankClass = rank === 1 ? 'top1' : rank === 2 ? 'top2' : rank === 3 ? 'top3' : '';
      const color     = wins > 0 ? (team.accentColor || '#fff') : 'rgba(255,255,255,.35)';

      row.innerHTML = `
        <span class="lb-rank ${rankClass}">#${rank}</span>
        <img class="lb-logo" src="${team.logo}" alt=""
             onerror="this.style.opacity='.3'">
        <span class="lb-name" style="color:${color}">${_esc(team.name)}</span>
        <span class="lb-wins" style="color:${wins > 0 ? '#FFD700' : 'rgba(255,255,255,.25)'}">${wins}</span>
      `;

      list.appendChild(row);
    });
  }

  function _esc(s) {
    const d = document.createElement('div');
    d.textContent = String(s);
    return d.innerHTML;
  }

  return { init, update };
})();
