import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import config from '../data/config';
import Countdown from './Countdown';
import ScratchReveal from './ScratchReveal';
import RSVP from './RSVP';
import { Divider, Medallion, Overlay, Seal } from './Ornaments';
import { asset, coupleImage, handsImage, fmtDate, fmtTime, mapsHref, saveTheDate } from '../utils';

const ease = [0.22, 1, 0.36, 1];
const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.4, delay, ease },
});

const Stage = ({ children, className = '' }) => (
  <div className={`absolute inset-0 flex flex-col items-center justify-center px-8 pb-20 pt-16 text-center ${className}`}>
    {/* dark pool behind the copy so light text never sits on the gold artwork */}
    <div className="scrim pointer-events-none absolute inset-0" aria-hidden="true" />
    {/* own stacking layer so the copy always paints above the scrim, animated or not */}
    <div className="relative z-10 flex w-full flex-col items-center">{children}</div>
  </div>
);

function Names() {
  const { couple, hero } = config;
  return (
    <Stage>
      <motion.p {...rise(0.3)} className="shimmer-ivory font-arabic text-3xl sm:text-4xl" dir="rtl">{hero.bismillah}</motion.p>
      <motion.p {...rise(1.2)} className="mx-auto mt-6 max-w-[17rem] font-display text-xl italic leading-relaxed text-cream sm:max-w-sm sm:text-2xl">{hero.welcome}</motion.p>
      <motion.h1 {...rise(2.6)} className="mt-6 font-display font-medium italic leading-[1.1] tracking-wide">
        <span className="shimmer-ivory block text-5xl sm:text-6xl">{couple.groom}</span>
        <span className="my-1 block font-display text-3xl italic text-gold-soft">&amp;</span>
        <span className="shimmer-ivory block text-5xl sm:text-6xl">{couple.bride}</span>
      </motion.h1>
      <motion.div {...rise(4)} className="mt-8"><Divider /></motion.div>
    </Stage>
  );
}

// The couple photo with the verse written over it: slow zoom, then the verse fades in line by line.
function CoupleVerse() {
  const { verse } = config;
  return (
    <div className="absolute inset-0">
      <motion.img
        src={coupleImage()}
        alt="The bride and groom walking together, seen from behind, in gold embroidered wedding attire"
        className="h-full w-full object-cover mix-blend-screen"
        initial={{ scale: 1.02 }}
        animate={{ scale: 1.16 }}
        transition={{ duration: 12, ease: 'linear' }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/95 via-black/80 to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 z-10 px-8 pb-24 text-center">
        <motion.p {...rise(1.5)} className="shimmer-ivory font-arabic text-5xl" dir="rtl" lang="ar">{verse.arabic}</motion.p>
        <motion.div {...rise(3)} className="mx-auto my-4 h-px w-20 bg-gold/70" />
        <motion.p {...rise(3.4)} className="font-display text-2xl italic text-cream">{verse.translation}</motion.p>
        <motion.p {...rise(4.6)} className="eyebrow mt-4">{verse.reference}</motion.p>
      </div>
    </div>
  );
}

function Hands() {
  const { hands } = config;
  return (
    <Stage>
      <motion.p {...rise(0.2)} className="eyebrow">Together</motion.p>
      <motion.h2 {...rise(0.5)} className="shimmer-ivory mt-2 font-display text-4xl font-medium italic tracking-wide">{hands.title}</motion.h2>
      <motion.img
        {...rise(1)}
        src={handsImage()}
        alt="The bride's henna-decorated hand and the groom's hand, gently joined"
        className="mt-5 max-h-[46svh] w-auto border border-gold/70 p-1.5"
        style={{ filter: 'drop-shadow(0 0 30px rgba(201,162,75,.28))' }}
      />
      <motion.p {...rise(2)} className="mx-auto mt-5 max-w-xs font-display text-xl italic leading-relaxed text-cream">{hands.caption}</motion.p>
    </Stage>
  );
}

function EventScene({ ev }) {
  const { venue } = ev;
  return (
    <Stage>
      <motion.div {...rise(0.2)}>
        <Medallion size={38} className="mx-auto mb-2 block" />
        <p className="shimmer-ivory font-arabic text-4xl" dir="rtl" lang="ar">{ev.arabic}</p>
        <h3 className="font-display text-3xl font-medium uppercase tracking-[.22em] text-cream">{ev.name}</h3>
      </motion.div>
      <motion.div {...rise(1)} className="mt-5">
        <p className="eyebrow">{fmtDate(ev.start, { weekday: 'long' })}</p>
        <p className="shimmer-ivory my-1 font-display text-8xl font-medium leading-none">{fmtDate(ev.start, { day: 'numeric' })}</p>
        <p className="font-display text-xl uppercase tracking-[.3em] text-cream">{fmtDate(ev.start, { month: 'long', year: 'numeric' })}</p>
      </motion.div>
      <motion.div {...rise(2)} className="mt-5 font-display text-xl text-cream">
        <p>{fmtTime(ev.start)} onwards</p>
        <p className="mt-3 text-2xl text-gold-bright">{venue.name}</p>
        <p className="text-lg italic text-cream/90">{venue.address}</p>
      </motion.div>
      <motion.div {...rise(3)} className="mt-6 flex flex-wrap justify-center gap-3">
        <a href={mapsHref(venue)} target="_blank" rel="noopener noreferrer" className="btn-gold btn-solid !px-5">View Location</a>
        <button type="button" onClick={() => saveTheDate(ev)} className="btn-gold !px-5">Add to Calendar</button>
      </motion.div>
    </Stage>
  );
}

function Closing({ onRsvp, onReplay }) {
  const { couple, closing } = config;
  return (
    <Stage>
      <motion.div {...rise(0.2)} className="w-36"><Seal initials={couple.initials} /></motion.div>
      <motion.p {...rise(1)} className="shimmer-ivory mt-8 font-display text-4xl font-medium italic leading-snug tracking-wide">{closing.line}</motion.p>
      <motion.p {...rise(1.8)} className="mt-6 font-display text-3xl text-cream">
        {couple.groom} <span className="font-script text-gold">&amp;</span> {couple.bride}
      </motion.p>
      <motion.p {...rise(2.4)} className="mt-6 font-arabic text-2xl text-gold-soft" dir="rtl">{closing.dua}</motion.p>
      <motion.div {...rise(3.2)} className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onRsvp} className="btn-gold btn-solid !px-6">RSVP</button>
        <button type="button" onClick={onReplay} className="btn-gold !px-6">Watch Again</button>
      </motion.div>
    </Stage>
  );
}

const Btn = ({ label, onClick, disabled, children }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    disabled={disabled}
    className="grid h-10 w-10 place-items-center rounded-full border border-gold/60 bg-ink/80 text-gold-soft backdrop-blur transition-opacity disabled:opacity-30"
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{children}</svg>
  </button>
);

// The invitation as a self-playing film: timed scenes, a progress bar per scene, and a final scene that waits for the guest.
export default function Film({ onPauseChange }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [scratched, setScratched] = useState(false); // the scratch scene waits for the guest before the film moves on

  const scenes = [
    { key: 'names', ms: 9500, bg: 'curtains', node: <Names /> },
    { key: 'couple', ms: 11000, node: <CoupleVerse /> },
    { key: 'scratch', ms: 6000, gate: true, node: <div className="absolute inset-0 flex items-center justify-center"><ScratchReveal compact onRevealed={() => setScratched(true)} /></div> },
    { key: 'hands', ms: 7000, node: <Hands /> },
    ...config.events.map((ev) => ({ key: ev.key, ms: 8000, node: <EventScene ev={ev} /> })),
    { key: 'countdown', ms: 6500, node: <Stage><Countdown /></Stage> },
    { key: 'closing', ms: 0, bg: 'curtains', node: <Closing onRsvp={() => setRsvpOpen(true)} onReplay={() => go(0)} /> },
  ];
  const last = scenes.length - 1;
  const go = (i) => { setScratched(false); setIndex(Math.max(0, Math.min(last, i))); };
  const scene = scenes[index];
  const locked = scene.gate && !scratched;

  return (
    <div className="fixed inset-0 z-10 flex justify-center">
    <div className="column relative h-full w-full overflow-hidden">
      {/* persistent backdrop */}
      {/* the pearl curtains frame only the opening and closing scenes; elsewhere they fade away */}
      <motion.div className="absolute inset-0" animate={{ opacity: scene.bg === 'curtains' ? 1 : 0 }} transition={{ duration: 1.2 }}>
        <Overlay src="curtains.jpg" className="h-full w-full object-cover opacity-60" />
      </motion.div>
      <Overlay src="sparkle.jpg" className="drift absolute inset-0 h-full w-full object-cover opacity-30" />
      <Overlay src="floral.jpg" className="absolute -left-6 top-0 w-[50%] opacity-55" />
      <Overlay src="floral.jpg" className="absolute -right-6 bottom-0 w-[55%] rotate-180 opacity-70" />

      <AnimatePresence mode="wait">
        <motion.div
          key={scene.key}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.9, ease }}
        >
          {scene.node}
        </motion.div>
      </AnimatePresence>

      {/* progress: finishing a scene's bar advances the film */}
      <div className="absolute inset-x-4 top-3 z-50 flex gap-1" aria-hidden="true">
        {scenes.map((s, i) => (
          <div key={s.key} className="h-[2px] flex-1 overflow-hidden rounded bg-gold/25">
            {(i < index || (i === index && !s.ms)) && <div className="h-full w-full bg-gold-soft" />}
            {i === index && s.ms > 0 && !(s.gate && !scratched) && (
              <div
                className="film-fill h-full w-full origin-left bg-gold-soft"
                style={{ animationDuration: `${s.ms}ms`, animationPlayState: paused || rsvpOpen ? 'paused' : 'running' }}
                onAnimationEnd={() => go(index + 1)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="absolute bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3">
        <Btn label="Previous" onClick={() => go(index - 1)} disabled={index === 0}><path d="M6 5h2v14H6zM20 5v14L9 12z" /></Btn>
        <Btn label={paused ? 'Play' : 'Pause'} onClick={() => { setPaused(!paused); onPauseChange?.(!paused); }} disabled={index === last}>
          {paused ? <path d="M7 4v16l13-8z" /> : <path d="M6 4h4v16H6zM14 4h4v16h-4z" />}
        </Btn>
        <Btn label="Next" onClick={() => go(index + 1)} disabled={index === last || locked}><path d="M16 5h2v14h-2zM4 5v14l11-7z" /></Btn>
      </div>

      <AnimatePresence>
        {rsvpOpen && (
          <motion.div className="absolute inset-0 z-[60] overflow-y-auto bg-[#0a0806]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" onClick={() => setRsvpOpen(false)} className="btn-gold fixed right-4 top-4 z-10 bg-ink/80 !px-4 !py-2">Close</button>
            <RSVP />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
  );
}
