import config from '../data/config';
import Reveal from './Reveal';
import { Frame, Medallion, Overlay, SectionTitle } from './Ornaments';
import { fmtDate, fmtTime, mapsHref, saveTheDate } from '../utils';

function Card({ ev, delay }) {
  const { venue } = ev;
  return (
    <Reveal delay={delay}>
      <div className="mx-auto w-full max-w-sm" style={{ filter: 'drop-shadow(0 0 30px rgba(201,162,75,.22))' }}>
        <Frame ch={24} bg="#100c07">
          {/* header with gold florals */}
          <div className="relative overflow-hidden bg-[#0a0806] px-8 pb-8 pt-9 text-center">
            <Overlay src="floral.jpg" className="absolute -left-4 -top-2 w-[75%] opacity-80" />
            <Overlay src="floral.jpg" className="absolute -right-4 -top-2 w-[75%] -scale-x-100 opacity-80" />
            <div className="relative">
              <Medallion size={42} className="mx-auto mb-3 block" />
              <p className="shimmer-gold font-arabic text-4xl" dir="rtl" lang="ar">{ev.arabic}</p>
              <h3 className="mt-1 font-display text-4xl font-medium uppercase tracking-[.22em] text-cream">{ev.name}</h3>
            </div>
          </div>

          <div className="px-8 pb-10 pt-8 text-center">
            <p className="eyebrow">{fmtDate(ev.start, { weekday: 'long' })}</p>
            <p className="shimmer-gold my-1 font-display text-8xl font-medium leading-none">{fmtDate(ev.start, { day: 'numeric' })}</p>
            <p className="font-display text-xl uppercase tracking-[.3em] text-cream">{fmtDate(ev.start, { month: 'long', year: 'numeric' })}</p>
            <div className="mx-auto my-6 h-px w-16 bg-gold/60" />

            <dl className="space-y-5 font-display text-xl text-cream">
              <div>
                <dt className="eyebrow mb-1">Time</dt>
                <dd>{fmtTime(ev.start)} onwards</dd>
              </div>
              <div>
                <dt className="eyebrow mb-1">Venue</dt>
                <dd className="text-2xl text-gold-bright">{venue.name}</dd>
                <dd className="mt-1 text-lg italic text-cream/70">{venue.address}</dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-col items-center gap-3">
              <a href={mapsHref(venue)} target="_blank" rel="noopener noreferrer" className="btn-gold btn-solid">View Location</a>
              <button type="button" onClick={() => saveTheDate(ev)} className="btn-gold">Add to Calendar</button>
            </div>
          </div>
        </Frame>
      </div>
    </Reveal>
  );
}

export default function Events() {
  return (
    <section id="events" className="relative scroll-mt-4 overflow-hidden px-5 py-28 sm:py-36">
      <Overlay src="sparkle.jpg" className="drift absolute inset-0 h-full w-full object-cover opacity-35" />
      <div className="relative">
        <SectionTitle eyebrow="Celebrations" title="Join Us" />
        <div className="space-y-16">
          {config.events.map((ev, i) => (
            <Card key={ev.key} ev={ev} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
