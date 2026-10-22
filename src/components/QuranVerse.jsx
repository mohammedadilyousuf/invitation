import config from '../data/config';
import Reveal from './Reveal';
import { Arch, Medallion, Overlay } from './Ornaments';

export default function QuranVerse() {
  const { verse } = config;
  return (
    <section id="verse" className="relative scroll-mt-4 overflow-hidden px-6 py-28 sm:py-36">
      <Overlay src="floral.jpg" className="absolute -left-10 -top-6 w-[80%] opacity-80" />
      <Overlay src="floral.jpg" className="absolute -right-10 bottom-0 w-[80%] rotate-180 opacity-80" />
      <Medallion className="absolute left-4 top-6" size={42} />
      <Medallion className="absolute right-4 top-6" size={42} />
      <Medallion className="absolute bottom-6 left-4" size={42} />
      <Medallion className="absolute bottom-6 right-4" size={42} />

      <Reveal className="relative mx-auto max-w-sm">
        <Arch contentClass="px-9 pb-20 pt-[36%] text-center">
          <p className="shimmer-gold font-arabic text-5xl leading-[1.9] sm:text-6xl" dir="rtl" lang="ar">{verse.arabic}</p>
          <div className="mx-auto my-6 h-px w-20 bg-gold/70" />
          <p className="font-display text-2xl italic text-cream sm:text-3xl">{verse.translation}</p>
          <p className="eyebrow mt-6">{verse.reference}</p>
        </Arch>
      </Reveal>
    </section>
  );
}
