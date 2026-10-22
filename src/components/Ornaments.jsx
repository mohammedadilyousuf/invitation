import { asset } from '../utils';

export const GOLD = '#c9a24b';
export const GOLD_SOFT = '#e6cf8e';
export const PANEL = '#120e09';

// Black-background artwork blended with `screen` so only the gold remains.
export function Overlay({ src, className = '', style }) {
  return (
    <img
      src={asset(src)}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      draggable="false"
      className={`pointer-events-none select-none mix-blend-screen ${className}`}
      style={style}
    />
  );
}

// Pointed Mughal arch frame that stretches to its content.
export function Arch({ children, className = '', contentClass = '', fill = PANEL }) {
  return (
    <div className={`relative ${className}`} style={{ filter: 'drop-shadow(0 0 28px rgba(201,162,75,.22))' }}>
      <svg viewBox="0 0 300 440" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path d="M8 440V200C8 120 80 90 150 8C220 90 292 120 292 200V440Z" fill={fill} stroke={GOLD} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <path d="M22 440V204C22 130 88 100 150 26C212 100 278 130 278 204V440" fill="none" stroke={GOLD} strokeWidth="1" opacity=".6" vectorEffect="non-scaling-stroke" />
        <path d="M34 440V208C34 138 94 110 150 42C206 110 266 138 266 208V440" fill="none" stroke={GOLD} strokeWidth="1" strokeDasharray="2 5" opacity=".5" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className={`relative ${contentClass}`}>{children}</div>
    </div>
  );
}

// Rectangular frame with cut corners and a thin gold line.
export function Frame({ children, ch = 16, bg = PANEL, line = GOLD, className = '', innerClass = '' }) {
  const poly = (c) =>
    `polygon(${c}px 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% calc(100% - ${c}px), calc(100% - ${c}px) 100%, ${c}px 100%, 0 calc(100% - ${c}px), 0 ${c}px)`;
  return (
    <div className={className} style={{ background: line, clipPath: poly(ch), padding: 1.5 }}>
      <div className={innerClass} style={{ background: bg, clipPath: poly(ch - 1.5), height: '100%' }}>
        {children}
      </div>
    </div>
  );
}

export function Medallion({ className = '', size = 56 }) {
  const pts = Array.from({ length: 16 }, (_, i) => {
    const a = (i * Math.PI) / 8 - Math.PI / 2;
    const r = i % 2 ? 22 : 40;
    return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
  }).join(' ');
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill={PANEL} stroke={GOLD} strokeWidth="1.5" />
      <circle cx="50" cy="50" r="41" fill="none" stroke={GOLD} strokeWidth=".6" strokeDasharray="1.5 3" />
      <polygon points={pts} fill="none" stroke={GOLD} strokeWidth="1.2" />
      <circle cx="50" cy="50" r="6" fill={GOLD} />
    </svg>
  );
}

export function Divider({ className = '' }) {
  return (
    <svg viewBox="0 0 240 20" className={`mx-auto h-5 w-48 ${className}`} aria-hidden="true">
      <path d="M0 10H98M142 10H240" stroke={GOLD} strokeWidth=".8" />
      <path d="M120 2l8 8-8 8-8-8z" fill="none" stroke={GOLD} strokeWidth="1" />
      <circle cx="104" cy="10" r="2" fill={GOLD} />
      <circle cx="136" cy="10" r="2" fill={GOLD} />
    </svg>
  );
}

// Slowly rotating 16-point star: a quiet Islamic-geometry backdrop.
export function StarBackdrop({ className = '', stroke = GOLD }) {
  const star = (rOut, rIn, n) =>
    Array.from({ length: n * 2 }, (_, i) => {
      const a = (i * Math.PI) / n - Math.PI / 2;
      const r = i % 2 ? rIn : rOut;
      return `${100 + r * Math.cos(a)},${100 + r * Math.sin(a)}`;
    }).join(' ');
  return (
    <svg viewBox="0 0 200 200" className={`spin-slow pointer-events-none ${className}`} aria-hidden="true">
      <g fill="none" stroke={stroke} strokeWidth=".5">
        <circle cx="100" cy="100" r="98" opacity=".5" />
        <polygon points={star(96, 70, 16)} opacity=".6" />
        <polygon points={star(76, 52, 8)} opacity=".7" />
        <circle cx="100" cy="100" r="40" strokeDasharray="1.5 3" opacity=".6" />
        <polygon points={star(36, 22, 8)} opacity=".8" />
      </g>
    </svg>
  );
}

// Gold monogram ring with scripted initials.
export function Monogram({ initials, size = 'md' }) {
  const dims = size === 'sm' ? 'h-24 w-24 text-4xl' : 'h-44 w-44 text-6xl sm:h-52 sm:w-52 sm:text-7xl';
  return (
    <div className={`relative grid place-items-center ${dims}`}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <circle cx="100" cy="100" r="96" fill="none" stroke={GOLD} strokeWidth="1.6" />
        <circle cx="100" cy="100" r="88" fill="none" stroke={GOLD} strokeWidth=".7" />
        <circle cx="100" cy="100" r="80" fill="none" stroke={GOLD} strokeWidth=".7" strokeDasharray="1.5 4" />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d="M100 2l3.5 5-3.5 5-3.5-5z" fill={GOLD} transform={`rotate(${i * 30} 100 100)`} />
        ))}
      </svg>
      <div className="shimmer-gold relative flex items-center font-script leading-none">
        <span>{initials[0]}</span>
        <span className="mx-1 translate-y-1 font-display text-[.4em] italic">&amp;</span>
        <span>{initials[1]}</span>
      </div>
    </div>
  );
}

export function SectionTitle({ eyebrow, title }) {
  return (
    <div className="mb-12 text-center">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="font-display text-4xl font-medium text-cream sm:text-5xl">{title}</h2>
      <Divider className="mt-5" />
    </div>
  );
}
