# 🏟 TikTok Escape Race

Interactive race game for TikTok Live. Viewers send gifts → teams get boosted → first team to finish wins!

---

## 📁 Folder Structure

```
tiktokescape/
├── server.js                   ← Backend (Node.js + Socket.IO + TikTok)
├── package.json
├── config/
│   ├── game-config.js          ← ⭐ Main settings (username, speed, timing)
│   ├── teams.js                ← ⭐ Team names, colors, players, logos
│   └── gifts.js                ← ⭐ Which TikTok gift boosts which team
└── public/
    ├── index.html              ← Game page (open in OBS Browser Source)
    ├── css/style.css
    ├── js/
    │   ├── game.js             ← Game logic & state machine
    │   ├── renderer.js         ← Canvas drawing
    │   ├── feed.js             ← Live gift feed overlay
    │   └── sounds.js           ← Audio manager
    └── assets/
        ├── logos/              ← Put team logo PNG files here
        ├── players/            ← Put player image PNG files here
        └── sounds/             ← Put MP3 audio files here
```

---

## 🖥️ Installation on Windows

### Step 1 — Install Node.js
1. Go to https://nodejs.org
2. Download the **LTS** version
3. Run the installer (keep all defaults, make sure "Add to PATH" is checked)
4. Open **Command Prompt** and verify: `node --version` → should show v18 or v20

### Step 2 — Get the project
Copy the `tiktokescape` folder anywhere you like, e.g.:
```
C:\Users\YourName\tiktokescape\
```

### Step 3 — Install dependencies
Open **Command Prompt**, navigate to the folder, and run:
```cmd
cd C:\Users\YourName\tiktokescape
npm install
```
Wait until it finishes (downloads express, socket.io, tiktok-live-connector).

### Step 4 — Start the server
```cmd
npm start
```
You should see:
```
╔════════════════════════════════════════════╗
║          TIKTOK ESCAPE RACE SERVER         ║
╠════════════════════════════════════════════╣
║  Game:     http://localhost:3000           ║
║  Dev Mode: http://localhost:3000?dev=1     ║
╚════════════════════════════════════════════╝
```

### Step 5 — Open in browser
Go to: **http://localhost:3000**
The race should start automatically.

To stop the server: press **Ctrl + C** in Command Prompt.

---

## 🎮 OBS Browser Source Setup

1. Open OBS Studio
2. In **Sources**, click **+** → **Browser**
3. Name it "TikTok Race Game"
4. Settings:
   - **URL**: `http://localhost:3000`
   - **Width**: `1920`
   - **Height**: `1080`
   - ✅ **Custom CSS**: leave empty (or add `body { background: transparent; }` for transparency)
   - ✅ **Shutdown source when not visible**: OFF
   - ✅ **Refresh browser when scene becomes active**: ON
5. Click OK
6. Resize/position the source to fill your canvas

> **Important**: The server (`npm start`) must be running before OBS loads the browser source.

---

## 🔧 Setting Your TikTok Username

Open `config/game-config.js` and change:
```js
tiktokUsername: 'YOUR_TIKTOK_USERNAME',
```
Replace `YOUR_TIKTOK_USERNAME` with your TikTok handle **without the @**.

Example:
```js
tiktokUsername: 'myTikTokName',
```

Then restart the server (`Ctrl+C`, then `npm start`).

---

## 🖼️ Adding Logos & Player Images

### Required filenames

**Team Logos** → `public/assets/logos/`
| File | Team |
|---|---|
| `al-hilal.png` | Al-Hilal |
| `al-nassr.png` | Al-Nassr |
| `fenerbahce.png` | Fenerbahçe |
| `besiktas.png` | Beşiktaş |
| `galatasaray.png` | Galatasaray |
| `olympiacos.png` | Olympiacos |
| `barcelona.png` | Barcelona |
| `real-madrid.png` | Real Madrid |
| `psg.png` | PSG |
| `bayern.png` | Bayern Munich |
| `man-city.png` | Man City |

**Player Images** → `public/assets/players/`
| File | Player |
|---|---|
| `al-dawsari.png` | Salem Al-Dawsari |
| `ronaldo.png` | Cristiano Ronaldo |
| `talisca.png` | Talisca |
| `kokcu.png` | Orkun Kökçü |
| `osimhen.png` | Victor Osimhen |
| `el-kaabi.png` | Ayoub El Kaabi |
| `yamal.png` | Lamine Yamal |
| `mbappe.png` | Kylian Mbappé |
| `dembele.png` | Ousmane Dembélé |
| `kane.png` | Harry Kane |
| `haaland.png` | Erling Haaland |

**Tips:**
- PNG with transparent background looks best for logos
- Player images: any ratio works, they're shown in a circle
- Recommended size: 200×200 px minimum
- If a file is missing, a coloured fallback is shown automatically — the game never crashes

To change paths, edit `config/teams.js` (the `logo` and `player.image` fields).

---

## 🔊 Adding Sound Files

Put MP3 files in `public/assets/sounds/`:
| File | When played |
|---|---|
| `small-gift.mp3` | Small / medium gifts |
| `big-gift.mp3` | Big / mega / ultra gifts |
| `winner.mp3` | When a team wins |

Missing sound files are silently ignored — the game won't crash.

---

## 🎁 Gift Mapping

Open `config/gifts.js` to see which TikTok gift boosts which team.

### ⚠️ Gift names are region-specific!
TikTok gift names may differ in your country. To find the exact names:

1. Set `DEBUG=1` when starting the server:
   ```cmd
   set DEBUG=1 && npm start
   ```
2. Go LIVE on TikTok
3. Ask a friend to send any gift
4. The terminal will print:
   ```
   [DEBUG gift] name="Rose" id=5655 repeat=1
   ```
5. Copy the exact name and update `config/gifts.js`

### Current gift mapping overview

| Tier | Progress | Speed Boost | Duration |
|---|---|---|---|
| small | +2 | none | — |
| medium | +8 | 1.4× | 4 sec |
| big | +22 | 2.0× | 6 sec |
| mega | +55 | 2.8× | 9 sec |
| ultra | +100 | 3.5× | 12 sec |

To change boost values, edit `config/game-config.js` → `boostTiers`.

---

## 🧪 Dev / Test Mode

Open: **http://localhost:3000?dev=1**

You'll see a panel in the top-left corner. Click any button to fire a fake gift event for any team, without needing TikTok Live.

Buttons: **S** = small, **M** = medium, **B** = big, **★** = mega, **☆** = ultra

---

## ⚙️ Quick Config Reference

All in `config/game-config.js`:

| Setting | Default | Description |
|---|---|---|
| `tiktokUsername` | `'YOUR_TIKTOK_USERNAME'` | Your TikTok handle |
| `baseSpeed` | `0.4` | Progress per second without gifts |
| `winnerScreenDuration` | `10000` | Winner screen time (ms) |
| `countdownDuration` | `5` | Seconds before new race |
| `feedMaxItems` | `8` | Max gift feed entries on screen |
| `port` | `3000` | Server port |

---

## 🔌 Troubleshooting TikTok Connection

### "No username set — running in DEMO MODE only"
→ Open `config/game-config.js`, set `tiktokUsername` to your handle, restart.

### "Connection failed: …"
Possible causes:
- You're not currently LIVE on TikTok
- Your stream is set to private/restricted
- TikTok changed their API (see below)

The server retries every 30 seconds automatically.

### If tiktok-live-connector stops working
TikTok occasionally changes the underlying API. Steps:
1. Check for library updates: `npm update tiktok-live-connector`
2. Check the library's GitHub issues: https://github.com/zerodytrash/TikTok-Live-Connector/issues
3. As a fallback, run in Dev Mode (`?dev=1`) to keep the game running manually

### Gifts arrive but team doesn't boost
→ The gift name in `config/gifts.js` doesn't match exactly.
→ Run with `DEBUG=1` to see the raw gift name in the terminal, then update gifts.js.

### OBS shows blank/white screen
- Make sure the server is running (`npm start`)
- Check the URL is exactly `http://localhost:3000`
- In OBS, right-click the Browser Source → **Refresh**
- Try opening `http://localhost:3000` in a regular browser first

### Port already in use
Change `port` in `config/game-config.js` to e.g. `3001`, then update OBS URL too.

---

## 🎨 Race Timing

With `baseSpeed: 0.4` and no gifts:
- Race finishes in approximately **4 minutes**

To make it longer: lower `baseSpeed` (e.g. `0.25` → ~7 min)
To make it shorter: raise `baseSpeed` (e.g. `0.7` → ~2.5 min)

Gifts add direct progress on top of the base movement.
