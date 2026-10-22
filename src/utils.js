import config from './data/config';

const tz = config.timezone;

export const fmtDate = (iso, opts = { day: 'numeric', month: 'long', year: 'numeric' }) =>
  new Date(iso).toLocaleDateString('en-GB', { timeZone: tz, ...opts });

export const fmtTime = (iso) =>
  new Date(iso).toLocaleTimeString('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit' });

export const mapsHref = (v) =>
  v.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${v.name} ${v.address}`)}`;

const icsDate = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const esc = (s) => s.replace(/[,;]/g, '\\$&');

export function downloadIcs(ev) {
  const title = `${ev.name}: ${config.couple.groom} & ${config.couple.bride}`;
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Invitation//EN',
    'BEGIN:VEVENT',
    `UID:${ev.key}-${icsDate(new Date(ev.start))}@invitation`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(new Date(ev.start))}`,
    `DTEND:${icsDate(new Date(ev.end))}`,
    `SUMMARY:${esc(title)}`,
    `LOCATION:${esc(`${ev.venue.name}, ${ev.venue.address}`)}`,
    `DESCRIPTION:${esc(`${ev.name} at ${ev.venue.name}.\\nDirections: ${mapsHref(ev.venue)}`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  a.download = `${ev.key}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function gcalHref(ev) {
  const d = (x) => icsDate(new Date(x));
  const title = `${ev.name}: ${config.couple.groom} & ${config.couple.bride}`;
  return (
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    `&text=${encodeURIComponent(title)}` +
    `&dates=${d(ev.start)}/${d(ev.end)}` +
    `&location=${encodeURIComponent(`${ev.venue.name}, ${ev.venue.address}`)}` +
    `&details=${encodeURIComponent(`${ev.name} at ${ev.venue.name}.\nDirections: ${mapsHref(ev.venue)}`)}`
  );
}

// One "save the date" action: Apple devices get the calendar file, everyone else gets Google Calendar.
export function saveTheDate(ev) {
  const apple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
  if (apple) downloadIcs(ev);
  else window.open(gcalHref(ev), '_blank', 'noopener');
}

// Image helper that respects the deploy base path (GitHub Pages serves from /<repo>/).
export const asset = (name) => `${import.meta.env.BASE_URL}images/${name}`;
