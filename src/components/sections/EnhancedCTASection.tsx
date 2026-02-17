import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GSAPButton from '@/components/animations/GSAPButton';
import GSAPTextReveal from '@/components/animations/GSAPTextReveal';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface EnhancedCTASectionProps {
  className?: string;
}

const EnhancedCTASection: React.FC<EnhancedCTASectionProps> = ({ className }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const particleAnimationRefs: gsap.core.Tween[] = [];

    const ctx = gsap.context(() => {
      // Create particle system
      const createParticles = () => {
        const particles = particlesRef.current;
        if (!particles) return;

        // Kill all existing particle animations before creating new ones
        particleAnimationRefs.forEach(anim => anim.kill());
        particleAnimationRefs.length = 0;

        // Clear existing particles
        particles.innerHTML = '';

        // Create multiple particles
        for (let i = 0; i < 20; i++) {
          const particle = document.createElement('div');
          particle.className = 'particle';
          particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            pointer-events: none;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
          `;
          particles.appendChild(particle);

          // Animate particle and store reference
          const anim = gsap.to(particle, {
            y: -100 - Math.random() * 200,
            x: Math.random() * 100 - 50,
            opacity: 0,
            duration: Math.random() * 3 + 2,
            repeat: -1,
            ease: "none",
            delay: Math.random() * 2
          });
          particleAnimationRefs.push(anim);
        }
      };

      createParticles();

      // Section entrance animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom-=100",
          end: "bottom top",
          toggleActions: "play none none reverse"
        }
      });

      tl.fromTo(
        titleRef.current,
        {
          y: 50,
          opacity: 0,
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out"
        }
      )
      .fromTo(
        subtitleRef.current,
        {
          y: 30,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out"
        },
        "-=0.6"
      )
      .fromTo(
        buttonRef.current,
        {
          y: 30,
          opacity: 0,
          scale: 0.8
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)"
        },
        "-=0.4"
      );

      // Floating background elements
      gsap.to(sectionRef.current?.querySelectorAll('.floating-bg'), {
        y: "random(-20, 20)",
        x: "random(-15, 15)",
        rotation: "random(-180, 180)",
        duration: "random(4, 8)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          each: 0.5,
          from: "random"
        }
      });

      // Parallax effect for background gradient
      gsap.to(sectionRef.current, {
        backgroundPosition: "100% 100%",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

    }, sectionRef);

    return () => {
      // Kill all particle animations before context revert
      particleAnimationRefs.forEach(anim => anim.kill());
      ctx.revert();
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={`py-20 px-4 bg-gradient-to-r from-reno-purple to-reno-blue animated-gradient relative overflow-hidden ${className || ''}`} 
      aria-labelledby="cta-heading"
      style={{
        backgroundSize: '200% 200%',
        backgroundPosition: '0% 0%'
      }}
    >
      {/* Enhanced floating background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="floating-bg absolute top-10 left-10 w-20 h-20 border border-white/30 rounded-full"></div>
        <div className="floating-bg absolute bottom-10 right-10 w-16 h-16 border border-white/30 rounded-full"></div>
        <div className="floating-bg absolute top-1/2 left-1/3 w-12 h-12 border border-white/30 rounded-full"></div>
        <div className="floating-bg absolute top-1/4 right-1/4 w-8 h-8 border border-white/30 rounded-full"></div>
        <div className="floating-bg absolute bottom-1/3 left-1/2 w-10 h-10 border border-white/30 rounded-full"></div>
      </div>

      {/* Particle system */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />
      
      <div className="container mx-auto text-center relative z-10">
        <h2 
          ref={titleRef}
          id="cta-heading" 
          className="text-3xl md:text-4xl font-bold text-white mb-6"
        >
          <GSAPTextReveal type="word" duration={0.8} stagger={0.1}>
            Gotowy na start?
          </GSAPTextReveal>
        </h2>
        
        <div
          ref={subtitleRef}
          className="text-lg md:text-xl text-white/80 mb-8"
        >
          <GSAPTextReveal type="character" duration={0.6} stagger={0.03}>
            Dołącz do tysięcy zadowolonych użytkowników
          </GSAPTextReveal>
        </div>
        
        <div ref={buttonRef}>
          <Link to="/register">
            <GSAPButton 
              size="xl" 
              variant="gradient"
              className="bg-gradient-to-r from-white to-gray-100 text-reno-purple hover:from-gray-100 hover:to-white font-bold text-lg shadow-2xl hover:shadow-white/20 border-2 border-white/20 hover:border-white/40 transform hover:scale-105 transition-all duration-300"
              ripple={true}
              magnetic={true}
              hoverEffect="bounce"
            >
              Zarejestruj się teraz
            </GSAPButton>
          </Link>
        </div>

        {/* Additional CTA elements */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Bezpłatne konto</span>
          </div>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>Natychmiastowy dostęp</span>
          </div>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span>Bez zobowiązań</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedCTASection;
