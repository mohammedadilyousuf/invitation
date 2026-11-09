import { useEffect } from 'react';

// Keeps the phone screen on while `active` (the invitation plays like a video, so it must not dim or lock).
// Uses the Screen Wake Lock API; browsers release the lock when the tab is hidden, so it is taken again on return.
export default function useWakeLock(active) {
  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return;
    let lock = null;
    let cancelled = false;

    const acquire = async () => {
      try {
        const l = await navigator.wakeLock.request('screen');
        if (cancelled) l.release();
        else lock = l;
      } catch {
        // denied (e.g. battery saver): the screen simply follows the phone's own timeout
      }
    };
    const onVisible = () => { if (document.visibilityState === 'visible') acquire(); };

    acquire();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisible);
      lock?.release();
    };
  }, [active]);
}
