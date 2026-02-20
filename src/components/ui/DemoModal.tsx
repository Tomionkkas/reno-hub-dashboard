import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { PhoneFrame } from '@/components/sections/AppShowcaseStrip';

interface Annotation {
  text: string;
  /** CSS top value relative to the PhoneFrame outer div */
  top: string;
  /** CSS left value relative to the PhoneFrame outer div */
  left: string;
}

interface DemoSlide {
  src: string;
  annotations: Annotation[];
}

const SLIDES: DemoSlide[] = [
  {
    src: '/calcreno/screenshots/Home page project lists.PNG',
    annotations: [
      { text: 'Wszystkie projekty w jednym miejscu', top: '12%', left: '6%' },
      { text: 'Szybki podgląd statusu remontu', top: '68%', left: '6%' },
    ],
  },
  {
    src: '/calcreno/screenshots/Project detail.PNG',
    annotations: [
      { text: 'Pełna lista pomieszczeń', top: '12%', left: '6%' },
      { text: 'Materiały i wymiary w jednym widoku', top: '65%', left: '6%' },
    ],
  },
  {
    src: '/calcreno/screenshots/Room editor.PNG',
    annotations: [
      { text: 'Edytuj wymiary każdego pokoju', top: '12%', left: '6%' },
      { text: 'Dodaj materiały bezpośrednio', top: '68%', left: '6%' },
    ],
  },
  {
    src: '/calcreno/screenshots/Material calculator.PNG',
    annotations: [
      { text: 'Oblicz farby, płytki i więcej', top: '12%', left: '6%' },
      { text: 'Zero ręcznych obliczeń', top: '68%', left: '6%' },
    ],
  },
  {
    src: '/calcreno/screenshots/Material details modal.PNG',
    annotations: [
      { text: 'Szczegółowe dane z jednostkami', top: '14%', left: '6%' },
    ],
  },
  {
    src: '/calcreno/screenshots/2D planner.PNG',
    annotations: [
      { text: 'Wizualny plan pomieszczeń', top: '10%', left: '6%' },
      { text: 'Automatyczny układ ścian i drzwi', top: '70%', left: '6%' },
    ],
  },
  {
    src: '/calcreno/screenshots/Cost summary.PNG',
    annotations: [
      { text: 'Pełne zestawienie kosztów', top: '12%', left: '6%' },
      { text: 'Eksportuj lub udostępnij listę', top: '68%', left: '6%' },
    ],
  },
];

interface DemoModalProps {
  open: boolean;
  onClose: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ open, onClose }) => {
  const [index, setIndex] = useState(0);
  const [contentVisible, setContentVisible] = useState(true);
  const [annotationsVisible, setAnnotationsVisible] = useState(false);
  const touchStartX = useRef(0);
  const annotationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAnnotationTimer = () => {
    if (annotationTimerRef.current) clearTimeout(annotationTimerRef.current);
  };

  // Show annotations with a delay after content appears
  const scheduleAnnotations = useCallback(() => {
    clearAnnotationTimer();
    annotationTimerRef.current = setTimeout(() => setAnnotationsVisible(true), 300);
  }, []);

  // Reset and show on open
  useEffect(() => {
    if (open) {
      setIndex(0);
      setContentVisible(true);
      setAnnotationsVisible(false);
      scheduleAnnotations();
      // Lock body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      clearAnnotationTimer();
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

  if (!open) return null;

  const slide = SLIDES[index];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative mx-4 my-8 bg-[#0b1120] border border-cyan-500/25 rounded-2xl p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
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
              className="absolute bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-white max-w-[130px] shadow-lg pointer-events-none"
              style={{
                top: ann.top,
                left: ann.left,
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
