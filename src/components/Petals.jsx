import { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';

const COLORS = ['#f6e3a6', '#c9a24b', '#efe4c8', '#e6cf8e', '#9a7632'];

// Soft floating petals. Subtle by design: a small, slow field.
export default function Petals({ active }) {
  const reduce = useReducedMotion();
  const petals = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 8 + Math.random() * 10,
        duration: 14 + Math.random() * 12,
        delay: -Math.random() * 20,
        sway: (Math.random() - 0.5) * 120,
        color: COLORS[i % COLORS.length],
      })),
    []
  );
  if (!active || reduce) return null;
  return (
    <div aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className="petal"
          style={{
            left: `${p.left}%`, width: p.size, height: p.size * 1.2, background: p.color,
            animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`, '--sway': `${p.sway}px`,
          }}
        />
      ))}
    </div>
  );
}
