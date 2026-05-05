import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import Navigation from '@/components/Navigation';
import './ConstellationExplorer.css';

const STAR_COUNT = 90;

const APPS = [
  {
    id: 'calcreno',
    name: 'CalcReno',
    icon: '/calcreno-logo-full-transparent.webp',
    tag: 'Kalkulator materiałów',
    desc: 'Oblicz dokładny kosztorys remontu — materiały, robocizna, rezerwy. Koniec z niespodziankami na budowie.',
    benefit: 'Oszczędź średnio 3 000 zł dzięki precyzyjnej wycenie',
    stat: '3 000 zł',
    statLabel: 'średnia oszczędność',
    color: '#6366f1',
  },
  {
    id: 'renotimeline',
    name: 'RenoTimeline',
    icon: '/renotimeline-logo-transparent.webp',
    tag: 'Harmonogram prac',
    desc: 'Zarządzaj całym projektem remontowym. Etapy, ekipy, terminy — wszystko w jednym miejscu.',
    benefit: 'Redukuj opóźnienia o 60% dzięki inteligentnemu harmonogramowaniu',
    stat: '−60%',
    statLabel: 'mniej opóźnień',
    color: '#ec4899',
  },
  {
    id: 'renoscout',
    name: 'RenoScout',
    icon: '/renoscout-logo.webp',
    tag: 'AI · Wkrótce',
    desc: 'Sztuczna inteligencja analizuje okazje inwestycyjne. Znajdź perełki zanim zrobi to konkurencja.',
    benefit: 'AI skanuje tysiące ofert — Ty dostajesz tylko najlepsze',
    stat: '∞',
    statLabel: 'ofert analizowanych',
    color: '#06b6d4',
  },
] as const;

export const ConstellationExplorer: React.FC = () => {
  const navigate = useNavigate();

  const rootRef    = useRef<HTMLDivElement>(null);
  const starsRef   = useRef<HTMLDivElement>(null);
  const svgRef     = useRef<SVGSVGElement>(null);
  const hubRef     = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const ctaRef     = useRef<HTMLButtonElement>(null);
  const glitchRef  = useRef<HTMLDivElement>(null);
  const nodeRefs   = useRef<(HTMLDivElement | null)[]>([null, null, null]);

  const [unlocked, setUnlocked]     = useState<Set<number>>(new Set());
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [ctaReady, setCtaReady]     = useState(false);
  const cardTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Stars ──────────────────────────────────────────────────
  useEffect(() => {
    const container = starsRef.current;
    if (!container) return;

    for (let i = 0; i < STAR_COUNT; i++) {
      const el = document.createElement('div');
      el.className = 'ce-star';
      el.style.cssText = [
        `width:${(Math.random() * 2.5 + 1).toFixed(1)}px`,
        `height:${(Math.random() * 2.5 + 1).toFixed(1)}px`,
        `top:${(Math.random() * 100).toFixed(2)}%`,
        `left:${(Math.random() * 100).toFixed(2)}%`,
        `animation-delay:${(Math.random() * 5).toFixed(2)}s`,
        `animation-duration:${(2 + Math.random() * 3).toFixed(2)}s`,
      ].join(';');
      container.appendChild(el);
    }

    return () => { container.innerHTML = ''; };
  }, []);

  // ── SVG constellation lines (desktop only) ─────────────────
  const drawLines = useCallback(() => {
    // Wait two frames so CSS transforms (translateX -50% on node-2) are settled
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const svg     = svgRef.current;
      const hub     = hubRef.current;
      const wrapper = rootRef.current;
      if (!svg || !hub || !wrapper) return;

      if (window.innerWidth < 768) {
        svg.innerHTML = '';
        return;
      }

      const wRect  = wrapper.getBoundingClientRect();
      const hRect  = hub.getBoundingClientRect();
      const cx     = hRect.left - wRect.left + hRect.width / 2;
      const cy     = hRect.top  - wRect.top  + hRect.height / 2;
      const colors = ['#6366f1', '#ec4899', '#06b6d4'];

      let html = '<defs>';

      // Gradient per line
      colors.forEach((c, i) => {
        html += `<linearGradient id="ceg-${i}" gradientUnits="userSpaceOnUse" x1="${cx}" y1="${cy}" x2="0" y2="0">
          <stop offset="0%"   stop-color="${c}" stop-opacity="0.7"/>
          <stop offset="100%" stop-color="${c}" stop-opacity="0.08"/>
        </linearGradient>`;
      });

      // Glow filter
      html += `<filter id="ce-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter></defs>`;

      nodeRefs.current.forEach((node, i) => {
        if (!node) return;
        const r  = node.getBoundingClientRect();
        const nx = r.left - wRect.left + r.width / 2;
        const ny = r.top  - wRect.top  + r.height / 2;

        // Update gradient endpoint to actual node position
        const grad = html.indexOf(`id="ceg-${i}"`);
        // Draw both a thick glow line and a thin sharp line for depth
        html += `
          <line class="ce-line ce-line--glow"
            x1="${cx.toFixed(1)}" y1="${cy.toFixed(1)}"
            x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}"
            stroke="${colors[i]}" stroke-width="4" stroke-opacity="0.12"
            filter="url(#ce-glow)"/>
          <line class="ce-line"
            x1="${cx.toFixed(1)}" y1="${cy.toFixed(1)}"
            x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}"
            stroke="url(#ceg-${i})" stroke-width="1.5"/>`;
      });

      svg.innerHTML = html;
    }));
  }, []);

  // ── Entry animation ─────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.fromTo(starsRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.4 }, 0)

        .fromTo(headlineRef.current,
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.85 }, 0.45)

        .fromTo(hubRef.current,
          { opacity: 0, scale: 0.45 },
          { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(2)' }, 0.65)

        .fromTo(
          nodeRefs.current.filter(Boolean),
          { opacity: 0, scale: 0.35 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.18,
            ease: 'back.out(2)',
            onComplete: drawLines,
          }, 0.88);
    }, rootRef);

    return () => ctx.revert();
  }, [drawLines]);

  useEffect(() => {
    window.addEventListener('resize', drawLines);
    return () => window.removeEventListener('resize', drawLines);
  }, [drawLines]);

  // ── Mouse parallax (desktop) ────────────────────────────────
  useEffect(() => {
    const wrapper = rootRef.current;
    const stars   = starsRef.current;
    if (!wrapper || !stars) return;

    const onMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return;
      const rect = wrapper.getBoundingClientRect();
      const xPct = (e.clientX - rect.left)  / rect.width  - 0.5;
      const yPct = (e.clientY - rect.top)   / rect.height - 0.5;
      gsap.to(stars, { x: xPct * -30, y: yPct * -18, duration: 1.8, ease: 'power1.out' });
    };

    wrapper.addEventListener('mousemove', onMove);
    return () => wrapper.removeEventListener('mousemove', onMove);
  }, []);

  // ── Unlock interaction ──────────────────────────────────────
  const unlock = useCallback((i: number) => {
    setUnlocked(prev => {
      if (prev.has(i)) return prev;

      const next = new Set(prev);
      next.add(i);

      // Glitch flash
      gsap.fromTo(
        glitchRef.current,
        { opacity: 0.55 },
        { opacity: 0, duration: 0.38, ease: 'power2.out' }
      );

      // Node bounce
      const face = nodeRefs.current[i]?.querySelector('.ce-node-face');
      if (face) {
        gsap.fromTo(face,
          { scale: 1 },
          { scale: 1.18, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.inOut' }
        );
      }

      // Reveal card
      if (cardTimerRef.current) clearTimeout(cardTimerRef.current);
      setActiveCard(i);
      cardTimerRef.current = setTimeout(() => setActiveCard(null), 3600);

      // All unlocked → show CTA
      if (next.size === APPS.length) {
        setTimeout(() => {
          gsap.to(headlineRef.current, { opacity: 0, y: -22, duration: 0.4, ease: 'power2.in' });
          gsap.fromTo(
            ctaRef.current,
            { opacity: 0, scale: 0.72, y: 28 },
            { opacity: 1, scale: 1, y: 0, duration: 0.65, delay: 0.3, ease: 'back.out(2)' }
          );
          setCtaReady(true);
        }, 600);
      }

      return next;
    });
  }, []);

  const handleCTA = useCallback(() => {
    gsap.to(rootRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => navigate('/kalkulator-remontu'),
    });
  }, [navigate]);

  return (
    <div ref={rootRef} className="ce-root">
      <div ref={starsRef} className="ce-stars" aria-hidden="true" />
      <svg  ref={svgRef}  className="ce-svg"   aria-hidden="true" />
      <div  ref={glitchRef} className="ce-glitch" aria-hidden="true" />

      {/* Ambient gradient orbs — purely decorative depth layer */}
      <div className="ce-orb ce-orb--tl" aria-hidden="true" />
      <div className="ce-orb ce-orb--br" aria-hidden="true" />
      <div className="ce-orb ce-orb--tr" aria-hidden="true" />
      <div className="ce-orb ce-orb--bl" aria-hidden="true" />

      <Navigation />

      <div className="ce-content">
        {/* Headline */}
        <div ref={headlineRef} className="ce-headline">
          <div className="ce-badge">
            <span className="ce-badge-dot" aria-hidden="true" />
            Dashboard wkrótce dostępny
          </div>
          <h1 className="ce-headline-title">
            Odkryj narzędzia{' '}
            <span className="ce-gradient-text">bez chaosu.</span>
          </h1>
          <p className="ce-headline-sub">
            Kliknij każdą aplikację, żeby dowiedzieć się więcej
          </p>
          <p className="ce-headline-note">
            Pełny dashboard odblokuje się po premierze subskrypcji CalcReno i RenoTimeline.
          </p>
        </div>

        {/* Constellation */}
        <div className="ce-cluster">
          <div ref={hubRef} className="ce-hub" aria-hidden="true">
            <img src="/Renohub-logo.webp" alt="RenoHub" className="ce-hub-img" />
          </div>

          <div className="ce-nodes">
            {APPS.map((app, i) => (
              <div
                key={app.id}
                ref={el => { nodeRefs.current[i] = el; }}
                className={`ce-node ce-node--${i}${unlocked.has(i) ? ' ce-node--unlocked' : ''}`}
                onClick={() => unlock(i)}
                role="button"
                tabIndex={0}
                aria-label={`Odkryj ${app.name}`}
                onKeyDown={e => e.key === 'Enter' && unlock(i)}
              >
                <div className="ce-node-body">
                  <div className="ce-node-face">
                    <img src={app.icon} alt={app.name} className="ce-node-icon" />
                    {unlocked.has(i) && (
                      <span className="ce-check" aria-label="odblokowano">✓</span>
                    )}
                  </div>
                </div>
                <span className="ce-node-label">{app.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reveal zone — fills empty space, shows card or idle hint */}
        <div className="ce-reveal-zone">
          {activeCard !== null ? (
            <div
              className="ce-card"
              key={activeCard}
              role="status"
              style={{ '--ce-accent': APPS[activeCard].color } as React.CSSProperties}
            >
              <div className="ce-card-left">
                <img src={APPS[activeCard].icon} alt={APPS[activeCard].name} className="ce-card-icon" />
                <div className="ce-card-stat">
                  <span className="ce-card-stat-num">{APPS[activeCard].stat}</span>
                  <span className="ce-card-stat-label">{APPS[activeCard].statLabel}</span>
                </div>
              </div>
              <div className="ce-card-right">
                <div className="ce-card-top-row">
                  <p className="ce-card-name">{APPS[activeCard].name}</p>
                  <span className="ce-card-tag">{APPS[activeCard].tag}</span>
                </div>
                <p className="ce-card-desc">{APPS[activeCard].desc}</p>
                <p className="ce-card-benefit">✦ {APPS[activeCard].benefit}</p>
              </div>
            </div>
          ) : (
            <p className="ce-idle-hint">
              {unlocked.size === 0
                ? '↑ kliknij aplikację, żeby odkryć więcej'
                : `${APPS.length - unlocked.size} ${APPS.length - unlocked.size === 1 ? 'aplikacja pozostała' : 'aplikacje pozostały'} do odkrycia`}
            </p>
          )}
        </div>

        {/* Progress pips */}
        <div className="ce-pips" role="progressbar" aria-valuenow={unlocked.size} aria-valuemax={APPS.length}>
          {APPS.map((app, i) => (
            <div key={i} className={`ce-pip${unlocked.has(i) ? ' ce-pip--done' : ''}`} title={app.name} />
          ))}
        </div>

        {/* CTA */}
        <button
          ref={ctaRef}
          className="ce-cta"
          style={{ opacity: 0, pointerEvents: ctaReady ? 'auto' : 'none' }}
          onClick={handleCTA}
        >
          Zacznij od liczb — kalkulator remontu →
        </button>
      </div>
    </div>
  );
};
