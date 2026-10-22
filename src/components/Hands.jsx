import config from '../data/config';
import Reveal from './Reveal';
import { Frame, Overlay, SectionTitle } from './Ornaments';
import { asset } from '../utils';

export default function Hands() {
  const { hands } = config;
  return (
    <section id="hands" className="relative overflow-hidden px-6 py-28 sm:py-36">
      <Overlay src="sparkle.jpg" className="drift absolute inset-0 h-full w-full object-cover opacity-35" />
      <div className="relative">
        <SectionTitle eyebrow="Together" title={hands.title} />
        <Reveal className="mx-auto max-w-sm">
          <div style={{ filter: 'drop-shadow(0 0 30px rgba(201,162,75,.28))' }}>
            <Frame ch={26} innerClass="p-2">
              <div className="relative overflow-hidden">
                <img src={asset('hands.jpg')} alt="The bride's henna-decorated hand and the groom's hand, gently joined" loading="lazy" decoding="async" className="block w-full" />
              </div>
            </Frame>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-10 max-w-xs text-center font-display text-2xl italic leading-relaxed text-cream/85">{hands.caption}</p>
        </Reveal>
      </div>
    </section>
  );
}
