import { useEffect, useState } from 'react';
import config from '../data/config';
import Reveal from './Reveal';
import { Frame, Overlay, SectionTitle } from './Ornaments';

const pad = (n) => String(n).padStart(2, '0');

function useCountdown(target, endAt) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = target - now;
  if (diff <= 0) return { done: true, live: now < endAt };
  return {
    done: false,
    parts: [
      ['Days', Math.floor(diff / 864e5)],
      ['Hours', Math.floor(diff / 36e5) % 24],
      ['Minutes', Math.floor(diff / 6e4) % 60],
      ['Seconds', Math.floor(diff / 1e3) % 60],
    ],
  };
}

export default function Countdown() {
  const first = new Date(config.events[0].start).getTime();
  const last = new Date(config.events[config.events.length - 1].end).getTime();
  const cd = useCountdown(first, last);

  return (
    <section id="countdown" className="relative overflow-hidden px-5 py-28 sm:py-36">
      <Overlay src="curtains.jpg" className="absolute inset-0 h-full w-full object-cover opacity-60" />
      <div className="relative">
        <SectionTitle eyebrow="Counting the moments" title="Until We Say Qubool Hai" />
        <Reveal className="mx-auto max-w-md">
          {cd.done ? (
            <p className="shimmer-gold text-center font-display text-3xl italic">
              {cd.live ? 'The celebrations have begun!' : 'Thank you for celebrating with us'}
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {cd.parts.map(([label, v]) => (
                <Frame key={label} ch={10} bg="#0e0a06">
                  <div className="px-1 py-6 text-center">
                    <div className="font-display text-4xl font-medium tabular-nums text-gold-bright">{pad(v)}</div>
                    <div className="eyebrow mt-2 !text-[.55rem] !tracking-[.2em]">{label}</div>
                  </div>
                </Frame>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
