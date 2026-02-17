import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { TypingAnimation } from '@/components/ui/typing-animation';
import { FloatingShapes } from '@/components/ui/floating-shapes';
import { ChevronDown } from 'lucide-react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface GSAPHeroProps {
  className?: string;
}

const GSAPHero: React.FC<GSAPHeroProps> = ({ className }) => {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLButtonElement>(null);
  const peekStripRef = useRef<HTMLDivElement>(null);

  const scrollToApps = () => {
    document.getElementById('apps')?.scrollIntoView({ behavior: 'smooth' });
  };

  const heroTexts = [
    "Jedna platforma – wszystkie Twoje aplikacje remontowe",
    "Zarządzaj projektami remontowymi profesjonalnie",
    "Obliczaj materiały i kontroluj koszty",
    "Planuj, realizuj, oszczędzaj"
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial timeline for hero entrance
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Animate background orbs
      gsap.fromTo(
        orbsRef.current?.children,
        {
          scale: 0,
          opacity: 0,
          rotation: 0
        },
        {
          scale: 1,
          opacity: 0.2,
          rotation: 360,
          duration: 2,
          stagger: 0.3,
          ease: "back.out(1.7)"
        }
      );

      // Hero title animation
      tl.fromTo(
        titleRef.current,
        {
          y: -100,
          opacity: 0,
          scale: 0.8
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "elastic.out(1, 0.3)"
        }
      )
      .fromTo(
        subtitleRef.current,
        {
          y: 50,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8
        },
        "-=0.6"
      )
      .fromTo(
        buttonsRef.current?.children,
        {
          y: 30,
          opacity: 0,
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: "back.out(1.7)"
        },
        "-=0.4"
      )
      .fromTo(
        chevronRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.2"
      )
      .fromTo(
        peekStripRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        "-=0.3"
      );

      // Parallax effect for background elements
      gsap.to(orbsRef.current?.children, {
        y: (i, target) => -target.offsetHeight * 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });

      // Floating animation for orbs
      gsap.to(orbsRef.current?.children, {
        y: "random(-20, 20)",
        x: "random(-15, 15)",
        rotation: "random(-180, 180)",
        duration: "random(3, 6)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          each: 0.5,
          from: "random"
        }
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  const peekApps = [
    {
      id: 'calcreno',
      name: 'CalcReno',
      image: '/calcreno-logo-full-transparent.png',
      status: 'Beta soon',
      statusClass: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400',
    },
    {
      id: 'renotimeline',
      name: 'RenoTimeline',
      image: '/renotimeline-logo-transparent.png',
      status: 'Available',
      statusClass: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
    },
    {
      id: 'renoscout',
      name: 'RenoScout',
      image: '/Renoscout logo.png',
      status: 'Coming Soon',
      statusClass: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
    },
  ];

  return (
    <section
      ref={heroRef}
      className={`pt-20 pb-12 md:pt-32 md:pb-20 px-4 relative overflow-hidden ${className || ''}`} 
      aria-labelledby="hero-heading"
    >
      {/* Enhanced Floating Background Elements */}
      <FloatingShapes count={8} className="opacity-30" />
      
      {/* Animated gradient orbs with GSAP */}
      <div ref={orbsRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-reno-purple/20 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-reno-blue/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-reno-mint/20 rounded-full blur-md"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-br from-reno-purple/10 to-reno-blue/10 rounded-full blur-2xl"></div>
      </div>
      
      <div className="container mx-auto text-center relative z-10">
        <h1 
          ref={titleRef}
          id="hero-heading" 
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          <span className="gradient-text">RenoHub</span>
        </h1>
        
        {/* Enhanced Hero Description with Typing Animation */}
        <div 
          ref={subtitleRef}
          className="text-xl md:text-2xl text-gray-300 mb-8 min-h-[3rem] flex items-center justify-center"
        >
          <TypingAnimation 
            texts={heroTexts}
            className="gradient-text font-semibold"
            speed={80}
            deleteSpeed={40}
            pauseDuration={3000}
          />
        </div>
        
        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <EnhancedButton 
              size="xl" 
              variant="floating" 
              className="w-full sm:w-auto"
              aria-label="Start using RenoHub"
            >
              Zacznij teraz
            </EnhancedButton>
          </Link>
          <EnhancedButton 
            size="xl" 
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 hover-glow w-full sm:w-auto"
            aria-label="View available applications"
            onClick={scrollToApps}
          >
            Zobacz aplikacje
          </EnhancedButton>
        </div>

        {/* App peek strip — mobile only */}
        <div
          ref={peekStripRef}
          className="md:hidden mt-8 -mx-4 px-4 flex gap-3 overflow-x-auto scrollbar-hide pb-2"
        >
          {peekApps.map((app) => (
            <button
              key={app.id}
              onClick={scrollToApps}
              className="flex-shrink-0 w-[148px] text-left flex flex-col gap-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-cyan-500/40 hover:bg-white/[0.07] transition-all duration-200 active:scale-95"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-900 to-cyan-800 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                  <img
                    src={app.image}
                    alt={app.name}
                    className="w-5 h-5 object-contain"
                  />
                </div>
                <span className="text-white text-sm font-semibold leading-tight">{app.name}</span>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full self-start font-medium border ${app.statusClass}`}>
                {app.status}
              </span>
            </button>
          ))}
          {/* Trailing spacer so last card doesn't hug the edge */}
          <div className="flex-shrink-0 w-2" />
        </div>
      </div>

      {/* Scroll chevron — mobile only */}
      <button
        ref={chevronRef}
        onClick={scrollToApps}
        className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 hover:text-white/70 transition-colors animate-bounce z-10"
        aria-label="Przewiń do aplikacji"
      >
        <ChevronDown size={28} />
      </button>
    </section>
  );
};

export default GSAPHero;
