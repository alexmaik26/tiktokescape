// ============================================================
//  TIKTOK ESCAPE RACE — Teams Configuration
//
//  HOW TO ADD LOGOS & PLAYER IMAGES:
//    Put files in:
//      public/assets/logos/<filename>.png
//      public/assets/players/<filename>.png
//    Then update the logo/player.image paths below.
//
//  If an image is missing, the game shows a coloured fallback.
// ============================================================

module.exports = {
  teams: [
    {
      id: 'al-hilal',
      name: 'Al-Hilal',
      shortName: 'HIL',
      color: '#1565C0',
      accentColor: '#42A5F5',
      logo: '/assets/logos/al-hilal.png',
      player: {
        name: 'Salem Al-Dawsari',
        image: '/assets/players/al-dawsari.png',
      },
    },
    {
      id: 'al-nassr',
      name: 'Al-Nassr',
      shortName: 'NAS',
      color: '#F9A825',
      accentColor: '#FFD54F',
      logo: '/assets/logos/al-nassr.png',
      player: {
        name: 'Cristiano Ronaldo',
        image: '/assets/players/ronaldo.png',
      },
    },
    {
      id: 'fenerbahce',
      name: 'Fenerbahçe',
      shortName: 'FEN',
      color: '#FDD835',
      accentColor: '#FFEE58',
      logo: '/assets/logos/fenerbahce.png',
      player: {
        name: 'Talisca',
        image: '/assets/players/talisca.png',
      },
    },
    {
      id: 'besiktas',
      name: 'Beşiktaş',
      shortName: 'BJK',
      color: '#212121',
      accentColor: '#BDBDBD',
      logo: '/assets/logos/besiktas.png',
      player: {
        name: 'Orkun Kökçü',
        image: '/assets/players/kokcu.png',
      },
    },
    {
      id: 'galatasaray',
      name: 'Galatasaray',
      shortName: 'GS',
      color: '#C62828',
      accentColor: '#FF8F00',
      logo: '/assets/logos/galatasaray.png',
      player: {
        name: 'Victor Osimhen',
        image: '/assets/players/osimhen.png',
      },
    },
    {
      id: 'olympiacos',
      name: 'Olympiacos',
      shortName: 'OLY',
      color: '#B71C1C',
      accentColor: '#EF9A9A',
      logo: '/assets/logos/olympiacos.png',
      player: {
        name: 'Ayoub El Kaabi',
        image: '/assets/players/el-kaabi.png',
      },
    },
    {
      id: 'barcelona',
      name: 'Barcelona',
      shortName: 'BAR',
      color: '#0D47A1',
      accentColor: '#A50044',
      logo: '/assets/logos/barcelona.png',
      player: {
        name: 'Lamine Yamal',
        image: '/assets/players/yamal.png',
      },
    },
    {
      id: 'real-madrid',
      name: 'Real Madrid',
      shortName: 'RMA',
      color: '#FAFAFA',
      accentColor: '#FFD700',
      logo: '/assets/logos/real-madrid.png',
      player: {
        name: 'Kylian Mbappé',
        image: '/assets/players/mbappe.png',
      },
    },
    {
      id: 'psg',
      name: 'PSG',
      shortName: 'PSG',
      color: '#002157',
      accentColor: '#DA020E',
      logo: '/assets/logos/psg.png',
      player: {
        name: 'Ousmane Dembélé',
        image: '/assets/players/dembele.png',
      },
    },
    {
      id: 'bayern',
      name: 'Bayern Munich',
      shortName: 'FCB',
      color: '#C8102E',
      accentColor: '#FFD700',
      logo: '/assets/logos/bayern.png',
      player: {
        name: 'Harry Kane',
        image: '/assets/players/kane.png',
      },
    },
    {
      id: 'man-city',
      name: 'Man City',
      shortName: 'MCI',
      color: '#6CABDD',
      accentColor: '#97C1E7',
      logo: '/assets/logos/man-city.png',
      player: {
        name: 'Erling Haaland',
        image: '/assets/players/haaland.png',
      },
    },
  ],
};
