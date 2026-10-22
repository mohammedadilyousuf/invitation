import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import config from '../data/config';
import Reveal from './Reveal';
import { Overlay, SectionTitle } from './Ornaments';
import { fmtDate, fmtTime, saveTheDate } from '../utils';

// Same heart path is used for the foil on the canvas and the SVG outline underneath.
const HEART = 'M50 85C10 55 0 35 0 22 0 10 10 0 24 0c11 0 21 6 26 15C55 6 65 0 76 0c14 0 24 10 24 22 0 13-10 33-50 63z';
const COLORS = ['#f6e3a6', '#c9a24b', '#efe4c8', '#e6cf8e', '#9a7632'];

function PetalBurst() {
  const petals = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => {
        const a = Math.random() * Math.PI * 2;
        const d = 100 + Math.random() * 200;
        return {
          id: i, x: Math.cos(a) * d, y: Math.sin(a) * d - 60, rot: Math.random() * 540 - 270,
          size: 7 + Math.random() * 9, color: COLORS[i % COLORS.length], dur: 1.6 + Math.random() * 1.4,
        };
      }),
    []
  );
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2" aria-hidden="true">
      {petals.map((p) => (
        <motion.span
          key={p.id}
          className="absolute block"
          style={{ width: p.size, height: p.size * 1.25, background: p.color, borderRadius: '150% 0 150% 0' }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 140], opacity: [1, 1, 0], scale: 1, rotate: p.rot }}
          transition={{ duration: p.dur, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

export default function ScratchReveal({ onRevealed }) {
  const { scratch } = config;
  const ev = config.events[0];
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const cb = useRef(onRevealed);
  cb.current = onRevealed;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { width, height } = wrap.getBoundingClientRect();
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const scale = canvas.width / 100;

    // gold foil heart
    ctx.save();
    ctx.scale(scale, scale);
    const g = ctx.createLinearGradient(0, 0, 100, 90);
    g.addColorStop(0, '#a87f2a');
    g.addColorStop(0.5, '#f3dc9a');
    g.addColorStop(1, '#9a7632');
    ctx.fillStyle = g;
    ctx.fill(new Path2D(HEART));
    ctx.restore();
    ctx.globalCompositeOperation = 'source-atop';
    for (let i = 0; i < 1200; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.3})`;
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, dpr * 1.6, dpr * 1.6);
    }
    ctx.fillStyle = 'rgba(40,26,6,.65)';
    ctx.font = `700 ${canvas.width * 0.06}px Lato, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height * 0.5);
    ctx.globalCompositeOperation = 'destination-out';

    const opaque = () => {
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let n = 0;
      for (let i = 3; i < d.length; i += 16) if (d[i] > 0) n++;
      return n;
    };
    const total = opaque();

    let drawing = false, last = null, lastCheck = 0, done = false;
    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (canvas.width / r.width), y: (e.clientY - r.top) * (canvas.height / r.height) };
    };
    const down = (e) => { drawing = true; last = pos(e); canvas.setPointerCapture(e.pointerId); move(e); };
    const up = () => { drawing = false; };
    function move(e) {
      if (!drawing || done) return;
      const p = pos(e);
      ctx.lineWidth = canvas.width * 0.13;
      ctx.lineCap = ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(p.x + 0.01, p.y);
      ctx.stroke();
      last = p;
      const now = performance.now();
      if (now - lastCheck > 150) {
        lastCheck = now;
        if (1 - opaque() / total > 0.5) { done = true; setRevealed(true); cb.current?.(); }
      }
    }
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    return () => {
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
    };
  }, []);

  return (
    <section id="invite" className="relative overflow-hidden px-6 py-28 sm:py-36">
      <Overlay src="sparkle.jpg" className="drift absolute inset-0 h-full w-full object-cover opacity-50" />
      <div className="relative">
        <SectionTitle eyebrow={scratch.eyebrow} title={scratch.hint} />
        <Reveal className="relative mx-auto w-[min(88vw,400px)]">
          <div ref={wrapRef} className="relative aspect-[100/90] touch-none" style={{ filter: 'drop-shadow(0 0 40px rgba(201,162,75,.35))' }}>
            <svg viewBox="0 0 100 90" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <path d={HEART} fill="#120e09" stroke="#c9a24b" strokeWidth=".8" />
            </svg>
            {/* what lies beneath the foil */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-[20%] pb-[8%] text-center">
              <span className="shimmer-gold font-script text-[clamp(1.6rem,7.5vw,2.4rem)] leading-none">{scratch.title}</span>
              <span className="eyebrow mt-1 !text-[.55rem] sm:!text-[.65rem]">{fmtDate(ev.start, { weekday: 'long' })}</span>
              <span className="font-display text-[clamp(1.5rem,7.5vw,2.5rem)] font-medium leading-tight text-gold-bright">{fmtDate(ev.start, { day: 'numeric', month: 'long' })}</span>
              <span className="font-display text-[clamp(1rem,4vw,1.4rem)] leading-tight text-cream">{fmtDate(ev.start, { year: 'numeric' })}</span>
              <span className="mt-1 font-display text-[clamp(.95rem,3.6vw,1.3rem)] italic text-gold-soft">{fmtTime(ev.start)} onwards</span>
            </div>
            <canvas
              ref={canvasRef}
              role="img"
              aria-label="Gold foil heart. Scratch to reveal the wedding date."
              className={`absolute inset-0 h-full w-full cursor-grab transition-opacity duration-1000 ${revealed ? 'pointer-events-none opacity-0' : ''}`}
            />
          </div>
          {revealed && <PetalBurst />}
        </Reveal>

        <div className="mt-12 min-h-[5rem] text-center">
          {!revealed && <p className="eyebrow animate-pulse">Scratch to continue</p>}
          {revealed && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.6 }}>
              <button type="button" onClick={() => saveTheDate(ev)} className="btn-gold btn-solid">{scratch.saveTheDate}</button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
