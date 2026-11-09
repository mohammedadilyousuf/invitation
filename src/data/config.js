// Everything on the invitation is edited here. No other file needs to change.
const config = {
  siteTitle: 'Mazhar & Samreen | Wedding Invitation',
  timezone: 'Asia/Kolkata',

  couple: {
    groom: 'Mazhar',
    bride: 'Samreen',
    initials: ['M', 'S'],
  },

  intro: {
    sealText: 'TAP TO OPEN',
  },

  hero: {
    bismillah: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
    welcome: 'We are honoured to welcome you to the wedding ceremony of',
  },

  // "Scratch to reveal" heart: shows the first event's date and time.
  scratch: {
    eyebrow: 'A little surprise',
    hint: 'Scratch the heart to reveal',
    title: "You're Invited",
  },

  hands: {
    title: 'Two Hands, One Promise',
    caption: 'Hand in hand, with the blessings of Allah and the duas of our loved ones.',
  },

  closing: {
    line: "We can't wait to celebrate with you",
    dua: 'بَارَكَ ٱللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ',
  },

  verse: {
    arabic: 'وَخَلَقْنَـٰكُمْ أَزْوَٰجًا',
    translation: 'And We created you in pairs.',
    reference: 'Quran 78:8',
  },

  // start/end: ISO 8601 with offset. The countdown targets the first event.
  events: [
    {
      key: 'nikah',
      name: 'Nikah',
      arabic: 'ٱلنِّكَاح',
      start: '2026-12-28T16:00:00+05:30',
      end: '2026-12-28T21:00:00+05:30',
      venue: {
        name: 'Amber Garden Function Hall',
        address: 'Chandrayangutta Road, Hyderabad',
        mapsUrl: 'https://maps.app.goo.gl/WDo57p2DMbiKMZdJ7?g_st=ic',
      },
    },
    {
      key: 'walima',
      name: 'Walima',
      arabic: 'ٱلْوَلِيمَة',
      start: '2026-12-30T19:00:00+05:30',
      end: '2026-12-30T23:00:00+05:30',
      venue: {
        name: 'Patel Garden Function Hall',
        address: 'Zaheerabad, Telangana',
        mapsUrl: 'https://maps.app.goo.gl/JUjDJmGyJzw18QpK9?g_st=ic',
      },
    },
  ],

  rsvp: {
    deadline: '2026-12-15',
    whatsappNumber: '917730887850', // country code + number, digits only
    // Google Apps Script web-app URL (see google-apps-script/README.md). Empty => WhatsApp only.
    // Replies are saved to your Google Sheet; the WhatsApp button stays as an optional extra.
    endpoint: 'https://script.google.com/macros/s/AKfycbxjuY0NLka14YC2Ts12PltOfoKXCf5SLYpeGBaJMnKf6gG7Y08WUfGqkCY2EW349y_9xg/exec',
  },

  contact: { name: 'Mazhar', phone: '+91 77308 87850' },

  music: '/music.m4a', // file in /public. Empty hides the music button.
};

// Which events each invitation link includes. The page reads data-invite from index.html (full) or walima/index.html (walima).
// Everything else (scratch heart date, countdown, venues, calendar) follows the first event in the list.
const VARIANTS = {
  full: ['nikah', 'walima'],
  walima: ['walima'],
};
const invite =
  (typeof document !== 'undefined' && document.getElementById('root')?.dataset.invite) || 'full';
config.invite = VARIANTS[invite] ? invite : 'full';
config.events = config.events.filter((e) => VARIANTS[config.invite].includes(e.key));

export default config;
