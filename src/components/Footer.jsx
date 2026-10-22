import config from '../data/config';
import Reveal from './Reveal';
import { Divider, Monogram, Overlay } from './Ornaments';

export default function Footer() {
  const { couple, closing } = config;
  return (
    <footer className="relative overflow-hidden px-6 py-32 text-center sm:py-40">
      <Overlay src="curtains.jpg" className="absolute inset-0 h-full w-full object-cover opacity-90" />
      <Overlay src="sparkle.jpg" className="drift absolute inset-0 h-full w-full object-cover opacity-45" />
      <Overlay src="floral.jpg" className="absolute -left-10 -top-4 w-[75%] opacity-85" />
      <Reveal className="relative mx-auto max-w-md">
        <div className="flex justify-center"><Monogram initials={couple.initials} /></div>
        <p className="shimmer-gold mt-10 font-script text-5xl leading-tight sm:text-6xl">{closing.line}</p>
        <Divider className="mt-8" />
        <p className="mt-8 font-display text-4xl text-cream sm:text-5xl">
          {couple.bride} <span className="font-script text-gold">&amp;</span> {couple.groom}
        </p>
        <p className="mt-8 font-arabic text-2xl text-gold-soft" dir="rtl">{closing.dua}</p>
      </Reveal>
    </footer>
  );
}
