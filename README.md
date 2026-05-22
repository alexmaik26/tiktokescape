# 🏟 TikTok Escape Race — v2 (Portrait 9:16)

Interactive football race game for TikTok Live.  
Viewers send TikTok gifts → teams get boosted → first team to the finish line wins!

**Layout:** Portrait 1080×1920 · Designed for OBS Browser Source on a vertical canvas.

---

## 📁 Folder Structure

```
tiktokescape/
├── server.js                      ← Backend: Express + Socket.IO + TikTok
├── package.json
├── config/
│   ├── game-config.js             ← ⭐ Main settings (username, speed, timing)
│   ├── teams.js                   ← ⭐ All 11 teams + player + animation config
│   └── gifts.js                   ← ⭐ Which TikTok gift boosts which team
└── public/
    ├── index.html
    ├── css/style.css
    ├── js/
    │   ├── game.js                ← Game state machine & orchestrator
    │   ├── renderer.js            ← Canvas drawing (portrait layout)
    │   ├── animator.js            ← Player image/sprite animation system
    │   ├── feed.js                ← Live gift feed overlay
    │   ├── leaderboard.js         ← Session leaderboard display
    │   └── sounds.js              ← Audio manager
    └── assets/
        ├── logos/                 ← Team logo PNG files
        ├── players/               ← Player image PNG files
        ├── sprites/               ← Sprite sheet PNG files
        ├── balls/                 ← Ball image PNG files
        └── sounds/                ← MP3 audio files
```

---

## 🖥️ Installation on Windows

### Step 1 — Install Node.js
1. Go to **https://nodejs.org** → download the **LTS** version
2. Run the installer (keep all defaults, ensure "Add to PATH" is checked)
3. Open **Command Prompt** and verify: `node --version`

### Step 2 — Copy the project
Place the `tiktokescape` folder anywhere, e.g.:
```
C:\Users\YourName\tiktokescape\
```

### Step 3 — Install dependencies
```cmd
cd C:\Users\YourName\tiktokescape
npm install
```

### Step 4 — Set your TikTok username
Open `config/game-config.js` and change:
```js
tiktokUsername: 'YOUR_TIKTOK_USERNAME',
```
Replace with your TikTok handle **without the @**.

### Step 5 — Start the server
```cmd
npm start
```
You should see:
```
╔════════════════════════════════════════════╗
║       TIKTOK ESCAPE RACE v2 · SERVER       ║
╠════════════════════════════════════════════╣
║  Game:     http://localhost:3000           ║
║  Dev Mode: http://localhost:3000?dev=1     ║
╚════════════════════════════════════════════╝
```

Open **http://localhost:3000** in a browser to verify it works.

---

## 📺 OBS Browser Source Setup (Portrait 9:16)

1. Open **OBS Studio**
2. In Sources, click **+** → **Browser**
3. Name it: `TikTok Race Game`
4. Configure:
   - **URL**: `http://localhost:3000`
   - **Width**: `1080`
   - **Height**: `1920`
   - **Custom CSS**: *(leave empty)*
   - **Shutdown source when not visible**: OFF
   - **Refresh browser when scene becomes active**: ON
5. Click **OK**

> **Important**: The server (`npm start`) must be running **before** OBS loads the source.  
> If the screen is blank, right-click the source → **Refresh**.

### OBS Scene for Vertical TikTok Streams
- Set your OBS canvas to **1080×1920** *(Settings → Video → Base Resolution)*
- Or, in a normal 16:9 scene, place the 1080×1920 Browser Source and crop/resize it to fit your layout

---

## 🖼️ Adding Logos, Player Images & Sprites

### Where to put files

| Asset | Folder | Used for |
|---|---|---|
| Team logos | `public/assets/logos/` | Lane labels, leaderboard, winner screen |
| Player images | `public/assets/players/` | Character in each lane |
| Sprite sheets | `public/assets/sprites/` | Animated running (optional) |
| Ball images | `public/assets/balls/` | Ball in front of each player |
| Sounds | `public/assets/sounds/` | Gift & winner audio |

**If any file is missing, a coloured fallback is shown — the game never crashes.**

---

### Required filenames

**Logos** → `public/assets/logos/`
```
al-hilal.png           al-nassr.png         fenerbahce.png
besiktas.png           galatasaray.png      olympiacos.png
barcelona.png          real-madrid.png      panathinaikos.png
partizan.png           red-star-belgrade.png
```

**Player images** → `public/assets/players/`
```
al-hilal-player.png      al-nassr-player.png    fenerbahce-player.png
besiktas-player.png      galatasaray-player.png olympiacos-player.png
barcelona-player.png     real-madrid-player.png panathinaikos-player.png
partizan-player.png      red-star-player.png
```

**Sprite sheets** → `public/assets/sprites/`
*(only needed if you set `useSprite: true` for a team)*
```
al-hilal-run.png         al-nassr-run.png       fenerbahce-run.png
besiktas-run.png         galatasaray-run.png    olympiacos-run.png
barcelona-run.png        real-madrid-run.png    panathinaikos-run.png
partizan-run.png         red-star-run.png
```

**Balls** → `public/assets/balls/`
```
default-ball.png       ← used by all teams unless a custom path is set
```

---

### Recommended image sizes

| Asset | Recommended size | Notes |
|---|---|---|
| Logo PNG | 256×256 or 512×512 | Transparent background preferred |
| Player PNG | 256×256 | Will be shown in a circle |
| Sprite sheet | `frameWidth × frames` wide, `frameHeight` tall | All frames on one horizontal row |
| Ball PNG | 64×64 or 128×128 | Transparent background |

---

### How to change image paths

Open `config/teams.js` and update the relevant path for any team:
```js
logo:        '/assets/logos/my-custom-logo.png',
playerImage: '/assets/players/my-player.png',
```

---

## 🎬 Player Animation System

Each team has two animation modes. Switch between them in `config/teams.js`.

### Mode A — Simple Image + Bounce (default, `useSprite: false`)
- Uses the `playerImage` PNG
- The game applies a vertical bounce animation to simulate running
- **No extra work needed** — just drop in a player PNG

Config example:
```js
useSprite:      false,
animationType:  'bounce-run',
animationSpeed: 1.0,    // 1.0 = normal, 1.5 = faster bounce
characterSize:  68,     // character diameter in pixels
ballSize:       26,     // ball diameter in pixels
ballOffset:     34,     // gap between character edge and ball centre
```

### Mode B — Sprite Sheet Animation (`useSprite: true`)
- Uses the `playerSprite` sheet
- All frames must be on **one horizontal row**, left to right
- Frame 0 is leftmost

Config example:
```js
useSprite:    true,
playerSprite: '/assets/sprites/my-team-run.png',
sprite: {
  frameWidth:  96,     // pixel width of one frame
  frameHeight: 96,     // pixel height of one frame
  frames:      6,      // total number of frames
  duration:    600,    // ms for one full animation cycle
  loop:        true,
},
```

### Making all teams use the same style
Set the same `useSprite`, `characterSize`, `animationType`, and `animationSpeed` for all teams in `config/teams.js`.

### Making each team different
Each team entry in `config/teams.js` is independent — set any values you like per team.

### Disabling sprite for a specific team
Set `useSprite: false` on that team entry. It will fall back to `playerImage` automatically.

---

## 🔊 Sound Files

| File | When played |
|---|---|
| `public/assets/sounds/small-gift.mp3` | Small & medium gifts |
| `public/assets/sounds/big-gift.mp3` | Big gifts |
| `public/assets/sounds/mega-boost.mp3` | Mega & ultra gifts |
| `public/assets/sounds/winner.mp3` | When a winner is declared |

Missing audio files are silently ignored — the game continues without sound.

---

## 🎁 Gift Mapping

Open `config/gifts.js` to see which TikTok gift boosts which team.

### ⚠️ Gift names are region-specific!

TikTok gift names differ between countries. To find exact names:

1. Start server with debug logging:
   ```cmd
   set DEBUG=1 && npm start
   ```
2. Go **LIVE** on TikTok
3. Ask a viewer to send any gift
4. The terminal prints:
   ```
   [DEBUG gift] name="Rose" id=5655 repeat=1
   ```
5. Copy the exact name and update `config/gifts.js`

### Gift mapping overview

| Tier | Instant Progress | Speed Boost | Duration |
|---|---|---|---|
| small | +5 | none | — |
| medium | +20 | 1.35× | 4 sec |
| big | +60 | 1.85× | 6 sec |
| mega | +150 | 2.6× | 9 sec |
| ultra | +400 | 3.5× | 12 sec |

Change these values in `config/game-config.js` → `boostTiers`.

### Per-team gift assignments (current defaults)

| Team | Small | Medium | Big | Mega/Ultra |
|---|---|---|---|---|
| Al-Hilal | Rose | Heart Me | Confetti | Lion |
| Al-Nassr | TikTok | Love Bang | — | Fireworks / Galaxy |
| Fenerbahçe | Panda | Sun Cream | Butterfly | Drama Queen |
| Beşiktaş | Italian Hand | Paper Crane | VIP Entrance | Yacht |
| Galatasaray | Finger Heart | Wishing Bottle | Cheer Bear | Universe |
| Olympiacos | Sunglasses | RGB Light Stick | Sports Car | Starship |
| Barcelona | Cap | Perfume | Castle | Crown |
| Real Madrid | Mic | Lucky Box | Fire | Superstar |
| Panathinaikos | Hat | Doughnut | Football | Eagle |
| Partizan | Camera | Ice Cream | Bicycle | Diamond |
| Red Star | Guitar | Cake | Lightning | Rocket |

### Adding a new gift or overriding boost values
```js
// config/gifts.js

// Simple assignment:
'Paw Print': { teamId: 'panathinaikos', tier: 'small' },

// With custom override:
'Dragon': {
  teamId: 'galatasaray', tier: 'ultra',
  custom: { instantProgress: 500, speedMultiplier: 4.0, boostDurationMs: 15000 }
},
```

---

## ⚙️ Quick Config Reference (`config/game-config.js`)

| Setting | Default | Effect |
|---|---|---|
| `tiktokUsername` | `'YOUR_TIKTOK_USERNAME'` | Your TikTok handle |
| `baseSpeed` | `0.5` | Progress/sec added automatically |
| `raceTarget` | `1000` | Progress needed to win |
| `winnerScreenDuration` | `10000` | ms winner screen shows |
| `countdownDuration` | `5` | Seconds before race starts |
| `leaderboardMaxWins` | `100` | Session win history size |
| `feedMaxItems` | `6` | Max gift feed entries visible |
| `port` | `3000` | Server port |

### Tuning race duration

At `baseSpeed: 0.5` and `raceTarget: 1000`:
- With **no gifts**: race finishes in ~33 min
- With **moderate gifts** (few per minute per team): expect **6–10 min** races
- With **heavy gift rain**: expect 3–5 min

To make races longer → lower `baseSpeed` (e.g. `0.3`)  
To make races shorter → raise `baseSpeed` (e.g. `1.0`)  
You can also raise `raceTarget` for finer control without touching speeds.

---

## 🧪 Dev / Test Mode

Open: **http://localhost:3000?dev=1**

A panel appears in the top-right corner with buttons for each team:
- **S** = simulate small gift
- **M** = simulate medium gift
- **B** = simulate big gift
- **★** = simulate mega gift
- **☆** = simulate ultra gift

Test the full race, winner screen, and leaderboard without going live.

---

## 🔌 Troubleshooting TikTok Connection

### "No username set — DEMO MODE only"
→ Open `config/game-config.js`, set `tiktokUsername`, restart server.

### "Connection failed" error
- You must be **currently LIVE** on TikTok
- Stream must be **public**
- Server auto-retries every 30 seconds

### Gifts arrive but team doesn't boost
→ Gift name doesn't match `config/gifts.js`  
→ Run with `DEBUG=1`, check terminal for exact gift name, update gifts.js

### tiktok-live-connector stops working (TikTok API changed)
1. Update the library: `npm update tiktok-live-connector`
2. Check for issues: https://github.com/zerodytrash/TikTok-Live-Connector/issues
3. Use Dev Mode (`?dev=1`) to keep the game running while the library updates

### OBS shows blank or white screen
- Confirm server is running (`npm start`)
- URL in OBS must be exactly `http://localhost:3000`
- Right-click source → **Refresh**
- Try opening the URL in a normal browser first

### Port already in use
Change `port` in `config/game-config.js` to e.g. `3001`, update OBS URL to match.

---

## 📋 What Changed vs v1

| Feature | v1 | v2 |
|---|---|---|
| Layout | Landscape 1920×1080 | **Portrait 1080×1920** |
| Teams | PSG, Bayern, Man City | **Panathinaikos, Partizan, Red Star** |
| Race duration | ~4 min | **6–10 min** (tunable) |
| Race target | 100 | **1000** (finer control) |
| Player system | Fixed image in circle | **Asset-driven: image OR sprite sheet** |
| Ball animation | None | **Rotating ball in front of player** |
| Bounce animation | None | **Vertical bounce simulate running** |
| Leaderboard | None | **Session-based, last 100 wins** |
| Gift map panel | None | **Rotating panel in UI** |
| Gift config | tier only | **Per-gift custom overrides** |
| Sounds | 2 files | **3 tiers: small / big / mega** |
| Gift feed | Bottom-right corner | **Bottom-right panel, compact** |
| Boost notifications | Middle of screen | **Middle of screen (same)** |
