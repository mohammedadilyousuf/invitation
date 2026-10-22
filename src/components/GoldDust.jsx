import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

// Soft gold dust drifting upward behind the whole invitation.
export default function GoldDust() {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, raf = 0, dots = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const make = (fresh) => ({
      x: Math.random() * w,
      y: fresh ? Math.random() * h : h + 10,
      r: 0.6 + Math.random() * 2.2,
      vy: 0.12 + Math.random() * 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      ph: Math.random() * 6.28,
      sp: 0.01 + Math.random() * 0.03,
    });
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = Array.from({ length: w < 600 ? 34 : 70 }, () => make(true));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.ph += d.sp;
        d.y -= d.vy; d.x += d.vx + Math.sin(d.ph) * 0.15;
        if (d.y < -10) Object.assign(d, make(false));
        const a = 0.25 + 0.55 * Math.abs(Math.sin(d.ph));
        const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 4);
        g.addColorStop(0, `rgba(246,227,166,${a})`);
        g.addColorStop(0.4, `rgba(201,162,75,${a * 0.5})`);
        g.addColorStop(1, 'rgba(201,162,75,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r * 4, 0, 6.28); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener('resize', resize);
    if (reduce) draw(), cancelAnimationFrame(raf); else draw();
    const vis = () => { if (document.hidden) cancelAnimationFrame(raf); else if (!reduce) raf = requestAnimationFrame(draw); };
    document.addEventListener('visibilitychange', vis);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', vis); };
  }, [reduce]);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[5]" aria-hidden="true" />;
}
