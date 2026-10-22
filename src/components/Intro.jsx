import { useEffect, useState } from 'react';
import { useAnimate } from 'framer-motion';
import config from '../data/config';
import { asset } from '../utils';
import { Overlay } from './Ornaments';

const EASE = [0.22, 1, 0.36, 1];

// Picks how the artwork is laid out for the current screen shape.
//  portrait : phones (tall screens), art fills the screen
//  pillar   : tablets/laptops, portrait art centred with a blurred, dimmed copy filling the sides
//  wide     : laptops, when doors-wide.jpg and scene-wide.jpg exist, true full-screen landscape art
function useLayout() {
  const calc = () => window.innerWidth / window.innerHeight;
  const [aspect, setAspect] = useState(calc);
  const [hasWide, setHasWide] = useState(false);
  useEffect(() => {
    const on = () => setAspect(calc());
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  useEffect(() => {
    const probe = (name) => new Promise((res) => { const i = new Image(); i.onload = () => res(true); i.onerror = () => res(false); i.src = asset(name); });
    Promise.all([probe('doors-wide.jpg'), probe('scene-wide.jpg')]).then(([a, b]) => setHasWide(a && b));
  }, []);
  if (aspect < 0.62) return 'portrait';
  return hasWide && aspect > 1.2 ? 'wide' : 'pillar';
}

// Gold seal with embossed initials and a ring of "TAP TO OPEN" text.
function Seal({ initials, text }) {
  const ring = `${text} • `.repeat(3);
  const dots = Array.from({ length: 36 }, (_, i) => {
    const a = (i * Math.PI * 2) / 36;
    return <circle key={i} cx={120 + 76 * Math.cos(a)} cy={120 + 76 * Math.sin(a)} r="2.4" fill="#e6cf8e" />;
  });
  return (
    <svg viewBox="0 0 240 240" className="w-full overflow-visible">
      <defs>
        <radialGradient id="sealGold" cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#fbe7a8" />
          <stop offset=".45" stopColor="#c9a24b" />
          <stop offset="1" stopColor="#7a5a1c" />
        </radialGradient>
        <radialGradient id="sealInner" cx="60%" cy="65%" r="85%">
          <stop offset="0" stopColor="#e9cf86" />
          <stop offset=".6" stopColor="#b8902f" />
          <stop offset="1" stopColor="#8a6420" />
        </radialGradient>
        <path id="ringPath" d="M120 120m-104 0a104 104 0 1 1 208 0a104 104 0 1 1-208 0" />
      </defs>
      <g className="spin-12" style={{ transformOrigin: '120px 120px' }}>
        <text fontFamily="Lato, sans-serif" fontSize="12" fontWeight="700" fill="#f6e3a6" stroke="#000" strokeWidth="2.5" paintOrder="stroke" textLength={2 * Math.PI * 104 - 8} lengthAdjust="spacing">
          <textPath href="#ringPath">{ring}</textPath>
        </text>
      </g>
      <circle cx="120" cy="120" r="82" fill="url(#sealGold)" stroke="#6b4c14" strokeWidth="1.5" />
      {dots}
      <circle cx="120" cy="120" r="64" fill="none" stroke="#7a5a1c" strokeWidth="1.5" />
      <circle cx="120" cy="120" r="62" fill="none" stroke="#fbe7a8" strokeWidth=".8" opacity=".7" />
      <circle cx="120" cy="120" r="54" fill="url(#sealInner)" />
      <g fontFamily="Pinyon Script, cursive" textAnchor="middle">
        <g fill="#fbe7a8" opacity=".75" transform="translate(1.2 1.4)">
          <text x="92" y="140" fontSize="52">{initials[0]}</text>
          <text x="148" y="140" fontSize="52">{initials[1]}</text>
        </g>
        <g fill="#3a2608">
          <text x="92" y="140" fontSize="52">{initials[0]}</text>
          <text x="148" y="140" fontSize="52">{initials[1]}</text>
          <text x="120" y="128" fontSize="26" fontFamily="Cormorant Garamond, serif" fontStyle="italic">&amp;</text>
        </g>
      </g>
    </svg>
  );
}

// Closed ornate doors with a gold seal. Tap: the seal breaks, the doors swing open onto the palace courtyard.
export default function Intro({ onTap, onReveal, onDone }) {
  const [scope, animate] = useAnimate();
  const [busy, setBusy] = useState(false);
  const { couple, intro } = config;
  const layout = useLayout();
  const doorsFile = layout === 'wide' ? 'doors-wide.jpg' : 'doors.jpg';
  const sceneFile = layout === 'wide' ? 'scene-wide.jpg' : 'scene.jpg';
  const door = { backgroundImage: `url(${asset(doorsFile)})` };
  const stageStyle = layout === 'pillar' ? { width: 'min(100vw, 560px, 56.28svh)' } : { width: '100%' };

  async function open() {
    if (busy) return;
    setBusy(true);
    onTap?.(); // inside the click so audio is allowed to start
    animate('#halo', { scale: [1, 3.2], opacity: [1, 0] }, { duration: 1.5, ease: 'easeOut' });
    await animate('#seal', { scale: [1, 1.12, 0.01], rotate: [0, 0, 30], opacity: [1, 1, 0] }, { duration: 1, times: [0, 0.35, 1] });
    onReveal?.();
    animate('#scene', { scale: [1, 1.35] }, { duration: 7, ease: 'easeOut' });
    if (layout === 'pillar') {
      animate('#curtL', { x: '-45%' }, { duration: 3, ease: EASE });
      animate('#curtR', { x: '45%' }, { duration: 3, ease: EASE });
      animate('#florals', { scale: 1.12, opacity: 0.35 }, { duration: 3.2, ease: EASE });
    }
    await Promise.all([
      animate('#doorL', { rotateY: -112 }, { duration: 2.8, ease: EASE }),
      animate('#doorR', { rotateY: 112 }, { duration: 2.8, ease: EASE }),
    ]);
    await animate(scope.current, { opacity: 0 }, { duration: 1.6, delay: 0.5 });
    onDone?.();
  }

  return (
    <div ref={scope} className="fixed inset-0 z-[70] grid place-items-center bg-[#050403]" role="dialog" aria-label="Wedding invitation. Tap the seal to open.">
      {layout === 'pillar' && (
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 top-1/2 h-[80%] w-[min(60vw,640px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/25 blur-3xl" />
          <Overlay src="sparkle.jpg" className="drift absolute inset-0 h-full w-full object-cover opacity-60" />
          {/* pearl drapes hang at both edges of the screen */}
          <div id="curtL" className="absolute inset-y-0 left-0 w-1/2 overflow-hidden"><Overlay src="curtains.jpg" className="absolute left-0 top-0 h-full w-auto max-w-none" /></div>
          <div id="curtR" className="absolute inset-y-0 right-0 w-1/2 overflow-hidden"><Overlay src="curtains.jpg" className="absolute right-0 top-0 h-full w-auto max-w-none" /></div>
          {/* gold florals in all four corners */}
          <div id="florals" className="absolute inset-0">
            <Overlay src="floral.jpg" className="absolute left-0 top-0 h-[96%] w-auto max-w-none" />
            <Overlay src="floral.jpg" className="absolute right-0 top-0 h-[96%] w-auto max-w-none -scale-x-100" />
            <Overlay src="floral.jpg" className="absolute bottom-0 left-0 h-[70%] w-auto max-w-none -scale-y-100 opacity-80" />
            <Overlay src="floral.jpg" className="absolute bottom-0 right-0 h-[70%] w-auto max-w-none rotate-180 opacity-80" />
          </div>
        </div>
      )}
      <div className="relative h-full overflow-hidden" style={stageStyle}>
        {/* courtyard behind the doors */}
        <div id="scene" className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${asset(sceneFile)})`, transformOrigin: '50% 42%' }} />
        {/* doors: one image split into two leaves that swing on their outer edges */}
        <div className="absolute inset-0 flex" style={{ perspective: 1800 }}>
          <div id="doorL" className="relative h-full w-1/2 overflow-hidden" style={{ transformOrigin: 'left center' }}>
            <div className="absolute inset-y-0 left-0 w-[200%] bg-cover bg-center" style={door} />
          </div>
          <div id="doorR" className="relative h-full w-1/2 overflow-hidden" style={{ transformOrigin: 'right center' }}>
            <div className="absolute inset-y-0 right-0 w-[200%] bg-cover bg-center" style={door} />
          </div>
        </div>
        {/* seal on the seam */}
        <div className="absolute inset-0 grid place-items-center">
          <div id="halo" className="absolute h-56 w-56 rounded-full bg-gold/50 blur-3xl" aria-hidden="true" />
          <div
            id="seal"
            role="button"
            tabIndex={0}
            aria-label="Tap to open the invitation"
            onClick={open}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && open()}
            className="relative w-[min(58vw,250px,32svh)] cursor-pointer select-none outline-none transition-transform duration-500 hover:scale-105 focus-visible:scale-105"
            style={{ filter: 'drop-shadow(0 12px 22px rgba(0,0,0,.75))' }}
          >
            <Seal initials={couple.initials} text={intro.sealText} />
          </div>
        </div>
      </div>
    </div>
  );
}
