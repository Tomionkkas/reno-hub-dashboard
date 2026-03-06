// src/hooks/useInView.ts
import { useEffect, useRef, useState } from 'react';

/**
 * Returns [ref, isInView].
 * Once the element enters the viewport it stays "in view" (no re-trigger on scroll out).
 */
export function useInView(threshold = 0.15): [React.RefObject<HTMLElement>, boolean] {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}
