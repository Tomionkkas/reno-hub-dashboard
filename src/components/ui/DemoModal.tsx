import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { PhoneFrame } from '@/components/sections/AppShowcaseStrip';

interface Annotation {
  text: string;
  top: string;
  left?: string;
  right?: string;
  wide?: boolean;
}

interface DemoSlide {
  src: string;
  annotations: Annotation[];
}

const SLIDES: DemoSlide[] = [
  {
    // Page 1: top-left + bottom-left (quiet area below cards)
    src: '/calcreno/screenshots/Home page project lists.PNG',
    annotations: [
      { text: 'Wszystkie projekty w jednym miejscu', top: '10%', left: '4%' },
      { text: 'Szybki podgląd statusu remontu', top: '78%', left: '4%' },
    ],
  },
  {
    // Page 2: top right only
    src: '/calcreno/screenshots/Project detail.PNG',
    annotations: [
      { text: 'Pełna lista pomieszczeń', top: '12%', right: '4%' },
    ],
  },
  {
    // Page 3: top right only
    src: '/calcreno/screenshots/Room editor.PNG',
    annotations: [
      { text: 'Edytuj wymiary każdego pokoju', top: '12%', right: '4%' },
    ],
  },
  {
    // Page 4: one wider annotation, top right
    src: '/calcreno/screenshots/Material calculator.PNG',
    annotations: [
      { text: 'Oblicz szacowanie ilości materiałów. Aktualne ceny brane z największych sklepów w Polsce.', top: '10%', right: '4%', wide: true },
    ],
  },
  {
    // Page 5: updated text
    src: '/calcreno/screenshots/Material details modal.PNG',
    annotations: [
      { text: 'Szczegółowe ilości/ceny materiałów w projekcie/pomieszczeniu', top: '14%', left: '6%', wide: true },
    ],
  },
  {
    // Page 6: bottom annotation updated
    src: '/calcreno/screenshots/2D planner.PNG',
    annotations: [
      { text: 'Wizualny plan pomieszczeń', top: '10%', left: '6%' },
      { text: 'Możliwość eksportu PNG/SVG', top: '70%', left: '6%' },
    ],
  },
  {
    // Page 7: bottom annotation moved up and left to avoid the blue button
    src: '/calcreno/screenshots/Cost summary.PNG',
    annotations: [
      { text: 'Pełne zestawienie kosztów', top: '12%', left: '6%' },
      { text: 'Eksportuj lub udostępnij listę', top: '58%', left: '4%' },
    ],
  },
];

interface DemoModalProps {
  open: boolean;
  onClose: () => void;
}

const TRANSITION_MS = 280;

export const DemoModal: React.FC<DemoModalProps> = ({ open, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [index, setIndex] = useState(0);
  const [contentVisible, setContentVisible] = useState(true);
  const [annotationsVisible, setAnnotationsVisible] = useState(false);
  const touchStartX = useRef(0);
  const annotationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unmountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAnnotationTimer = () => {
    if (annotationTimerRef.current) clearTimeout(annotationTimerRef.current);
  };

  // Show annotations with a delay after content appears
  const scheduleAnnotations = useCallback(() => {
    clearAnnotationTimer();
    annotationTimerRef.current = setTimeout(() => setAnnotationsVisible(true), 300);
  }, []);

  // Mount/unmount with enter and exit animation
  useEffect(() => {
    if (unmountTimerRef.current) clearTimeout(unmountTimerRef.current);
    if (open) {
      setMounted(true);
      setIndex(0);
      setContentVisible(true);
      setAnnotationsVisible(false);
      document.body.style.overflow = 'hidden';
      // Two rAFs so the initial opacity:0 state is painted before we flip to 1
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setShow(true);
        scheduleAnnotations();
      }));
    } else {
      setShow(false);
      unmountTimerRef.current = setTimeout(() => {
        setMounted(false);
        document.body.style.overflow = '';
      }, TRANSITION_MS);
    }
    return () => {
      clearAnnotationTimer();
      if (unmountTimerRef.current) clearTimeout(unmountTimerRef.current);
      document.body.style.overflow = '';
    };
  }, [open, scheduleAnnotations]);

  // Escape key closes modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const goTo = useCallback((nextIndex: number) => {
    clearAnnotationTimer();
    // Fade annotations out immediately
    setAnnotationsVisible(false);
    // Short pause, then swap screenshot
    setTimeout(() => {
      setContentVisible(false);
      setTimeout(() => {
        setIndex(nextIndex);
        setContentVisible(true);
        scheduleAnnotations();
      }, 150);
    }, 80);
  }, [scheduleAnnotations]);

  const goNext = useCallback(() => goTo((index + 1) % SLIDES.length), [index, goTo]);
  const goPrev = useCallback(() => goTo((index - 1 + SLIDES.length) % SLIDES.length), [index, goTo]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) < 50) return;
    delta > 0 ? goNext() : goPrev();
  };

  if (!mounted) return null;

  const slide = SLIDES[index];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
      style={{
        backgroundColor: show ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0)',
        transition: `background-color ${TRANSITION_MS}ms ease-out`,
      }}
    >
      <div
        className="relative mx-4 my-8 bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          opacity: show ? 1 : 0,
          transform: show ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(12px)',
          transition: `opacity ${TRANSITION_MS}ms ease-out, transform ${TRANSITION_MS}ms ease-out`,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Zamknij"
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header label */}
        <p className="text-center text-[10px] uppercase tracking-widest text-slate-500 mb-4">
          See it in action
        </p>

        {/* Phone frame + annotation overlays */}
        <div className="relative flex justify-center">
          {/* Screenshot inside phone */}
          <div
            style={{
              opacity: contentVisible ? 1 : 0,
              transition: 'opacity 150ms',
            }}
          >
            <PhoneFrame>
              <img
                src={slide.src}
                alt="CalcReno screenshot"
                className="w-full h-full object-cover object-top"
              />
            </PhoneFrame>
          </div>

          {/* Floating annotation boxes — absolutely over the phone frame */}
          {slide.annotations.map((ann, i) => (
            <div
              key={`${index}-${i}`}
              className={`absolute bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-white shadow-lg pointer-events-none ${ann.wide ? 'max-w-[160px]' : 'max-w-[130px]'}`}
              style={{
                top: ann.top,
                ...(ann.left !== undefined ? { left: ann.left } : {}),
                ...(ann.right !== undefined ? { right: ann.right } : {}),
                opacity: annotationsVisible ? 1 : 0,
                transform: annotationsVisible ? 'translateY(0)' : 'translateY(5px)',
                transition: 'opacity 300ms, transform 300ms',
                transitionDelay: annotationsVisible ? `${i * 180}ms` : '0ms',
              }}
            >
              {ann.text}
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Screenshot ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'bg-cyan-400 w-4' : 'bg-slate-600 w-1.5 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
