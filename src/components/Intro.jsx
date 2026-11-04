import { useEffect, useRef, useState } from 'react';
import { useAnimate } from 'framer-motion';
import config from '../data/config';
import { asset } from '../utils';
import { Overlay, Seal } from './Ornaments';

const EASE = [0.22, 1, 0.36, 1];

// The door-opening video (poster = its first frame). The doors sit still for a moment at the start, so playback skips ahead.
const VIDEO_START = 0.8;
const PLAYBACK_RATE = 1.3; // 1 = the video's own speed
const FADE_AT = 6.2; // seconds into the video when the doors are open and the invitation begins to fade in

// Picks how the artwork is laid out for the current screen shape.
//  portrait : phones (tall screens), the video fills the screen
//  pillar   : tablets/laptops, the portrait video is centred over a blurred copy of itself, with gold florals in the corners
function useLayout() {
  const calc = () => window.innerWidth / window.innerHeight;
  const [aspect, setAspect] = useState(calc);
  useEffect(() => {
    const on = () => setAspect(calc());
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return aspect < 0.62 ? 'portrait' : 'pillar';
}

// Closed ornate doors with a gold seal. Tap: the seal breaks, the doors swing open onto the palace courtyard.
export default function Intro({ onTap, onReveal, onDone }) {
  const [scope, animate] = useAnimate();
  const [busy, setBusy] = useState(false);
  const { couple, intro } = config;
  const layout = useLayout();
  const videoRef = useRef(null);
  const bgVideoRef = useRef(null); // blurred backdrop copy (laptop/tablet layout only)
  // On wider screens the portrait video sits over its blurred copy, so its left and right edges fade into the backdrop.
  const fade = 'linear-gradient(to right, transparent 0, #000 20%, #000 80%, transparent 100%)';
  // The side artwork ends at its image edge; fade that edge so it dissolves toward the centre instead of being cut off.
  const soft = (dir) => { const m = `linear-gradient(to ${dir}, #000 60%, transparent 100%)`; return { WebkitMaskImage: m, maskImage: m }; };
  const stageStyle = layout === 'pillar'
    ? { width: 'min(100vw, 560px, 56.28svh)', WebkitMaskImage: fade, maskImage: fade }
    : { width: '100%' };

  async function open() {
    if (busy) return;
    setBusy(true);
    onTap?.(); // inside the click so audio is allowed to start
    animate('#halo', { scale: [1, 3.2], opacity: [1, 0] }, { duration: 1.5, ease: 'easeOut' });
    await animate('#seal', { scale: [1, 1.12, 0.01], rotate: [0, 0, 30], opacity: [1, 1, 0] }, { duration: 1, times: [0, 0.35, 1] });
    if (layout === 'pillar') {
      animate('#florals', { scale: 1.12, opacity: 0.35 }, { duration: 3.2, ease: EASE });
    }
    // Play the doors; once they are open (or if the video cannot play) the invitation starts and the intro fades out.
    const v = videoRef.current;
    try {
      const bg = bgVideoRef.current;
      if (bg) { bg.currentTime = VIDEO_START; bg.playbackRate = PLAYBACK_RATE; bg.play().catch(() => {}); }
      v.currentTime = VIDEO_START;
      v.playbackRate = PLAYBACK_RATE;
      await v.play();
      await Promise.race([
        new Promise((res) => {
          const check = () => (v.currentTime >= FADE_AT || v.ended ? res() : requestAnimationFrame(check));
          check();
        }),
        new Promise((res) => setTimeout(res, 12000)),
      ]);
    } catch (err) {
      console.error('Door video failed:', err);
    }
    onReveal?.();
    await animate(scope.current, { opacity: 0 }, { duration: 1.6 });
    onDone?.();
  }

  return (
    <div ref={scope} className="fixed inset-0 z-[70] grid place-items-center bg-[#050403]" role="dialog" aria-label="Wedding invitation. Tap the seal to open.">
      {layout === 'pillar' && (
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          {/* a blurred, dimmed copy of the same video fills the screen, so the sharp doors share its colours */}
          <video
            ref={bgVideoRef}
            src={asset('doors-open.mp4')}
            poster={asset('doors-poster.jpg')}
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full scale-125 object-cover opacity-70 blur-3xl"
          />
          <div className="absolute inset-0 bg-black/45" />
          {/* warm light behind the doors, and side shading that pulls the eye to the centre (none at the top or bottom) */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 30% 80% at 50% 50%, rgba(201,162,75,.24), transparent 72%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,.55), transparent 30%, transparent 70%, rgba(0,0,0,.55))' }} />
          <Overlay src="sparkle.jpg" className="drift absolute inset-0 h-full w-full object-cover opacity-35" />
          {/* gold florals in all four corners */}
          <div id="florals" className="absolute inset-0">
            <Overlay src="floral.jpg" style={soft('right')} className="absolute left-0 top-0 h-[96%] w-auto max-w-none" />
            <Overlay src="floral.jpg" style={soft('right')} className="absolute right-0 top-0 h-[96%] w-auto max-w-none -scale-x-100" />
            <Overlay src="floral.jpg" style={soft('right')} className="absolute bottom-0 left-0 h-[70%] w-auto max-w-none -scale-y-100 opacity-80" />
            <Overlay src="floral.jpg" style={soft('right')} className="absolute bottom-0 right-0 h-[70%] w-auto max-w-none rotate-180 opacity-80" />
          </div>
        </div>
      )}
      <div className="relative h-full overflow-hidden" style={stageStyle}>
        {/* the doors: paused on the closed first frame, plays when the seal is tapped */}
        <video
          ref={videoRef}
          src={asset('doors-open.mp4')}
          poster={asset('doors-poster.jpg')}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* seal on the seam */}
        <div className="absolute inset-0 grid place-items-center">
          <div id="halo" className="absolute h-56 w-56 rounded-full bg-gold/30 blur-3xl" aria-hidden="true" />
          <div
            id="seal"
            role="button"
            tabIndex={0}
            aria-label="Tap to open the invitation"
            onClick={open}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && open()}
            className="relative w-[min(48vw,200px,27svh)] cursor-pointer select-none outline-none transition-transform duration-500 hover:scale-105 focus-visible:scale-105"
            style={{ filter: 'drop-shadow(0 12px 22px rgba(0,0,0,.75))' }}
          >
            <span className="pointer-events-none absolute inset-0 rounded-full border border-gold/70 animate-ping [animation-duration:2.8s]" aria-hidden="true" />
            <Seal initials={couple.initials} />
            <p className="absolute left-1/2 top-full mt-6 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap font-sans text-[.7rem] font-bold uppercase tracking-[.35em] text-[#fff6dc] [text-shadow:0_1px_8px_#000,0_0_14px_#000]">
              <span className="h-px w-8 bg-gold/80" aria-hidden="true" />
              {intro.sealText}
              <span className="h-px w-8 bg-gold/80" aria-hidden="true" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
