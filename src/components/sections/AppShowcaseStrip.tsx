import React, { useState, useEffect, useRef, useCallback } from 'react';

type AppKey = 'calcreno' | 'renotimeline';

const TABS: { key: AppKey; label: string }[] = [
  { key: 'calcreno', label: 'CalcReno' },
  { key: 'renotimeline', label: 'RenoTimeline' },
];

interface Screenshot {
  label: string;
  src: string;
}

const SCREENSHOTS: Record<AppKey, Screenshot[]> = {
  calcreno: [
    { label: 'Lista projektów',       src: '/calcreno/screenshots/Home page project lists.PNG' },
    { label: '2D Planner',            src: '/calcreno/screenshots/2D planner.PNG' },
    { label: 'Podsumowanie kosztów',  src: '/calcreno/screenshots/Cost summary.PNG' },
  ],
  renotimeline: [
    { label: 'Dashboard',  src: '/renotimeline/screenshots/dashboard.png' },
    { label: 'Zadania',    src: '/renotimeline/screenshots/kanban.png' },
    { label: 'Projekty',   src: '/renotimeline/screenshots/projects.png' },
  ],
};

// ─── Device frames ────────────────────────────────────────────────────────────

export const PhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative mx-auto w-[260px] md:w-[360px]">
    <div className="bg-slate-800 rounded-[2.5rem] p-3 border-2 border-slate-600 shadow-2xl shadow-black/60">
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-800 rounded-b-2xl z-10" />
      <div className="bg-slate-950 rounded-[2rem] overflow-hidden" style={{ aspectRatio: '9/19' }}>
        {children}
      </div>
    </div>
    <div className="absolute right-[-3px] top-20 w-1 h-8 bg-slate-700 rounded-r-sm" />
    <div className="absolute left-[-3px] top-16 w-1 h-6 bg-slate-700 rounded-l-sm" />
    <div className="absolute left-[-3px] top-24 w-1 h-6 bg-slate-700 rounded-l-sm" />
  </div>
);

const BrowserFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mx-auto w-full max-w-[340px] md:max-w-[780px] shadow-2xl shadow-black/60 rounded-xl overflow-hidden border border-slate-700">
    <div className="bg-slate-800 px-3 py-2 flex items-center gap-2 border-b border-slate-700">
      <div className="flex gap-1.5 shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
      </div>
      <div className="flex-1 bg-slate-700 rounded px-2 py-0.5 text-[10px] text-slate-400 truncate">
        renotimeline.com
      </div>
    </div>
    <div className="bg-slate-950 overflow-hidden" style={{ aspectRatio: '16/10' }}>
      {children}
    </div>
  </div>
);

// ─── Main strip ───────────────────────────────────────────────────────────────

interface AppShowcaseStripProps {
  /** Restrict which app tabs are shown. Defaults to all tabs. */
  tabs?: AppKey[];
}

export const AppShowcaseStrip: React.FC<AppShowcaseStripProps> = ({ tabs }) => {
  const visibleTabs = tabs ? TABS.filter(t => tabs.includes(t.key)) : TABS;
  const [activeTab, setActiveTab] = useState<AppKey>(visibleTabs[0]?.key ?? 'calcreno');
  const [index, setIndex] = useState(0);
  const [frameVisible, setFrameVisible] = useState(true);
  const [contentVisible, setContentVisible] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeTabRef = useRef(activeTab);
  activeTabRef.current = activeTab;

  // Scroll entrance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (stripRef.current) observer.observe(stripRef.current);
    return () => observer.disconnect();
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const len = SCREENSHOTS[activeTabRef.current].length;
      setContentVisible(false);
      setTimeout(() => { setIndex(prev => (prev + 1) % len); setContentVisible(true); }, 250);
    }, 4000);
  }, []);

  useEffect(() => {
    setIndex(0);
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [activeTab, startTimer]);

  const handleTabChange = (key: AppKey) => {
    if (key === activeTab) return;
    setFrameVisible(false);
    setTimeout(() => { setActiveTab(key); setFrameVisible(true); }, 250);
  };

  const handleDot = (i: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setContentVisible(false);
    setTimeout(() => { setIndex(i); setContentVisible(true); startTimer(); }, 250);
  };

  const screenshots = SCREENSHOTS[activeTab];
  const current = screenshots[index];
  const isCyan = activeTab === 'calcreno';
  const Frame = activeTab === 'calcreno' ? PhoneFrame : BrowserFrame;

  return (
    <div
      ref={stripRef}
      className={`py-6 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <p className="text-center text-[10px] uppercase tracking-widest text-slate-500 mb-4">
        See it in action
      </p>

      {/* Tab switcher — hidden when only one app is shown */}
      {visibleTabs.length > 1 && (
      <div className="flex justify-center mb-6">
        <div className="flex bg-slate-800/60 rounded-full p-1 gap-1 border border-slate-700/60">
          {visibleTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === tab.key
                  ? tab.key === 'calcreno'
                    ? 'bg-cyan-500 text-black shadow'
                    : 'bg-blue-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      )}

      {/* Device frame */}
      <div
        className="transition-all"
        style={{
          opacity: frameVisible ? 1 : 0,
          transform: frameVisible ? 'scale(1)' : 'scale(0.97)',
          transitionDuration: '250ms',
        }}
      >
        <Frame>
          <div
            className="w-full h-full transition-opacity"
            style={{ opacity: contentVisible ? 1 : 0, transitionDuration: '250ms' }}
          >
            <img
              src={current.src}
              alt={current.label}
              className="w-full h-full object-cover object-top"
            />
          </div>
        </Frame>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {screenshots.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDot(i)}
            aria-label={`Screenshot ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index
                ? isCyan ? 'bg-cyan-400 w-4' : 'bg-blue-400 w-4'
                : 'bg-slate-600 w-1.5 hover:bg-slate-500'
            }`}
          />
        ))}
      </div>

      {/* Label */}
      <p
        className={`text-center text-xs mt-2.5 transition-opacity ${
          contentVisible ? 'opacity-100' : 'opacity-0'
        } ${isCyan ? 'text-cyan-400/50' : 'text-blue-400/50'}`}
        style={{ transitionDuration: '250ms' }}
      >
        {current.label}
      </p>
    </div>
  );
};

export default AppShowcaseStrip;
