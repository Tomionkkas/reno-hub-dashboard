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
