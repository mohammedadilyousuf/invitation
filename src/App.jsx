import { useCallback, useEffect, useRef, useState } from 'react';
import config from './data/config';
import Intro from './components/Intro';
import Film from './components/Film';
import MusicPlayer from './components/MusicPlayer';
import Petals from './components/Petals';
import GoldDust from './components/GoldDust';
import { Overlay } from './components/Ornaments';

export default function App() {
  // closed: sealed doors | revealing: doors opening | done: intro gone, page scrolls
  const [phase, setPhase] = useState('closed');
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    document.title = config.siteTitle;
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden'; // the film is a fixed stage; only the RSVP panel scrolls
  }, []);

  useEffect(() => {
    if (!config.music) return;
    const a = new Audio(import.meta.env.BASE_URL + config.music.replace(/^\//, ''));
    a.loop = true;
    a.volume = 0.6;
    audioRef.current = a;
    return () => a.pause();
  }, []);

  const toggleMusic = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().then(() => setPlaying(true)).catch(() => {});
    else { a.pause(); setPlaying(false); }
  }, []);

  // Music starts only after the visitor's first tap.
  const onTap = useCallback(() => {
    audioRef.current?.play().then(() => setPlaying(true)).catch(() => {});
  }, []);

  const revealed = phase !== 'closed';

  return (
    <>
      <GoldDust />
      {/* on wide screens, gold florals frame the invitation column */}
      <div className="pointer-events-none fixed inset-y-0 left-0 z-[1] hidden w-[calc((100vw-560px)/2)] overflow-hidden min-[900px]:block" aria-hidden="true">
        <Overlay src="floral.jpg" className="w-[min(100%,420px)] opacity-80" />
      </div>
      <div className="pointer-events-none fixed inset-y-0 right-0 z-[1] hidden w-[calc((100vw-560px)/2)] overflow-hidden min-[900px]:block" aria-hidden="true">
        <Overlay src="floral.jpg" className="ml-auto w-[min(100%,420px)] -scale-x-100 opacity-80" />
      </div>

      <Petals active={revealed} />
      {phase !== 'done' && <Intro onTap={onTap} onReveal={() => setPhase('revealing')} onDone={() => setPhase('done')} />}
      {config.music && revealed && <MusicPlayer playing={playing} onToggle={toggleMusic} />}
      {revealed && <Film />}
    </>
  );
}
