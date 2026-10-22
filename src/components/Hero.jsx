import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import config from '../data/config';
import { Divider, Overlay } from './Ornaments';
import { asset } from '../utils';

const ease = [0.22, 1, 0.36, 1];

export default function Hero() {
  const { couple, hero } = config;
  const reduce = useReducedMotion();
  const coupleRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: coupleRef, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.02, 1.14]);
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [30, -30]);

  const fade = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.8, delay, ease },
  });

  return (
    <section id="home" className="relative overflow-hidden">
      {/* screen 1: pearl curtains, gold florals, invitation text */}
      <div className="relative flex min-h-[100svh] flex-col items-center justify-center px-8 pb-24 pt-20 text-center">
        <Overlay src="curtains.jpg" className="absolute inset-0 h-full w-full object-cover" />
        <Overlay src="sparkle.jpg" className="drift absolute inset-0 h-full w-full object-cover opacity-50" />
        <Overlay src="floral.jpg" className="absolute -left-6 top-0 w-[78%] opacity-90" />
        <Overlay src="floral.jpg" className="absolute -right-6 bottom-0 w-[78%] rotate-180 opacity-90" />

        <div className="relative">
          <motion.p {...fade(0.4)} className="shimmer-gold font-arabic text-3xl sm:text-4xl" dir="rtl">{hero.bismillah}</motion.p>
          <motion.p {...fade(0.9)} className="mx-auto mt-6 max-w-[17rem] font-display text-xl italic leading-relaxed text-cream/90 sm:max-w-sm sm:text-2xl">
            {hero.welcome}
          </motion.p>
          <motion.h1 {...fade(1.4)} className="mt-6 font-script leading-[1.05]">
            <span className="shimmer-gold block text-6xl sm:text-7xl">{couple.groom}</span>
            <span className="my-1 block font-display text-3xl italic text-gold-soft">&amp;</span>
            <span className="shimmer-gold block text-6xl sm:text-7xl">{couple.bride}</span>
          </motion.h1>
          <motion.div {...fade(1.9)} className="mt-8"><Divider /></motion.div>
        </div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3, duration: 1.5 }} aria-hidden="true">
          <span className="float-y block h-9 w-5 rounded-full border border-gold-soft"><span className="mx-auto mt-2 block h-2 w-0.5 rounded bg-gold-soft" /></span>
        </motion.div>
      </div>

      {/* screen 2: the couple, emerging from the dark */}
      <div ref={coupleRef} className="relative -mt-10 overflow-hidden">
        <motion.img
          src={asset('couple.jpg')}
          alt="The bride and groom walking together, seen from behind, in gold embroidered wedding attire"
          loading="lazy"
          decoding="async"
          className="block w-full mix-blend-screen"
          style={{ scale, y, WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 22%, #000 84%, transparent 100%)', maskImage: 'linear-gradient(to bottom, transparent 0, #000 22%, #000 84%, transparent 100%)' }}
        />
        <Overlay src="sparkle.jpg" className="drift absolute inset-0 h-full w-full object-cover opacity-40" />
      </div>
    </section>
  );
}
