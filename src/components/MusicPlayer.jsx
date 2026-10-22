export default function MusicPlayer({ playing, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={playing ? 'Pause music' : 'Play music'}
      className="fixed bottom-5 left-5 z-50 grid h-12 w-12 place-items-center rounded-full border border-gold/70 bg-ink/85 text-gold-soft shadow-[0_0_25px_rgba(201,162,75,.35)] backdrop-blur transition-transform duration-500 hover:scale-105"
    >
      {playing ? (
        <span className="eq flex h-4 items-end" aria-hidden="true"><span /><span /><span /></span>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )}
    </button>
  );
}
