// src/hooks/useAnimatedNumber.ts
import { useEffect, useRef, useState } from 'react';

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Animates a number from its previous value to the new target value.
 * Returns the current animated value (a raw number, format it yourself).
 */
export function useAnimatedNumber(target: number, duration = 350): number {
  const [display, setDisplay] = useState(target);
  const startRef = useRef(target);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = startRef.current;
    const to = target;

    if (from === to) return;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOut(progress);
      const current = from + (to - from) * eased;

      setDisplay(current);
      startRef.current = current;  // keep from in sync with display

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplay(to);
        startRef.current = to;
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [target, duration]);

  return display;
}
