import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CreditCard, DollarSign, UserCircle, Shield, Zap, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { GlowEffect } from '@/components/ui/visual-enhancements';
import { PremiumShadow, GlowingText } from '@/components/ui/professional-polish';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface EnhancedFeaturesSectionProps {
  className?: string;
}

const EnhancedFeaturesSection: React.FC<EnhancedFeaturesSectionProps> = ({ className }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  const features = [
    { 
      icon: Shield, 
      title: "Bezpieczne przechowywanie", 
      desc: "Twoje projekty są bezpiecznie zapisane w chmurze z szyfrowaniem end-to-end",
      delay: 0,
      highlight: "99.9% uptime"
    },
    { 
      icon: DollarSign, 
      title: "Kontrola kosztów", 
      desc: "Śledź wydatki i optymalizuj budżet remontowy w czasie rzeczywistym",
      delay: 100,
      highlight: "Oszczędność 15-30%"
    },
    { 
      icon: UserCircle, 
      title: "Szybki dostęp", 
      desc: "Dostęp do wszystkich projektów z jednego miejsca na każdym urządzeniu",
      delay: 200,
      highlight: "Multi-platform"
    },
    { 
      icon: Zap, 
      title: "Szybka synchronizacja", 
      desc: "Zmiany synchronizują się automatycznie między urządzeniami",
      delay: 300,
      highlight: "Real-time sync"
    },
    { 
      icon: Users, 
      title: "Współpraca zespołowa", 
      desc: "Współdziel projekty z zespołem i śledź postępy wspólnie",
      delay: 400,
      highlight: "Team features"
    },
    { 
      icon: CreditCard, 
      title: "Bezpieczne płatności", 
      desc: "Bezpieczne transakcje z szyfrowaniem SSL i certyfikatem PCI DSS",
      delay: 500,
      highlight: "SSL secured"
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section title
      gsap.fromTo(
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
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top bottom-=100",
            end: "bottom top",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Stagger animation for feature cards
      gsap.fromTo(
        featuresRef.current?.querySelectorAll('.feature-card'),
        {
          y: 80,
          opacity: 0,
          scale: 0.8,
          rotationY: 15
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top bottom-=150",
            end: "bottom top",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Floating animation for background elements
      gsap.to(sectionRef.current?.querySelectorAll('.floating-bg'), {
        y: "random(-30, 30)",
        x: "random(-20, 20)",
        rotation: "random(-180, 180)",
        duration: "random(4, 8)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          each: 0.8,
          from: "random"
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={`py-20 px-4 bg-black/20 relative ${className || ''}`} 
      aria-labelledby="features-heading"
    >
             {/* Enhanced floating background elements */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="floating-bg absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
         <div className="floating-bg absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-500/5 rounded-full blur-2xl"></div>
         <div className="floating-bg absolute top-1/2 left-1/3 w-32 h-32 bg-purple-500/5 rounded-full blur-xl"></div>
       </div>
      
      <div className="container mx-auto relative z-10">
        <GlowingText intensity="medium" animated={true}>
          <h2 
            ref={titleRef}
            id="features-heading" 
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-white"
          >
            Dlaczego RenoHub?
          </h2>
        </GlowingText>
        <div 
          ref={featuresRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <PremiumShadow variant="colored" animated={false}>
              <div 
                key={index} 
                className="feature-card text-center group relative"
              >
                                 <div className="relative p-6 rounded-2xl bg-black/20 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 hover:bg-black/30">
                {/* Icon with enhanced animation */}
                <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 relative">
                  <feature.icon className="w-8 h-8 text-white" aria-hidden="true" />
                                     {/* Glow effect */}
                   <div className="absolute inset-0 rounded-full bg-cyan-500/40 blur-lg group-hover:blur-xl transition-all duration-300"></div>
                </div>
                
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:gradient-text transition-all duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 text-sm md:text-base mb-3">
                  {feature.desc}
                </p>

                {/* Highlight badge */}
                <Tooltip>
                  <TooltipTrigger asChild>
                                         <Badge 
                       className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/30 transition-all duration-300 cursor-help"
                       variant="outline"
                     >
                      {feature.highlight}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Kluczowa funkcja: {feature.highlight}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            </PremiumShadow>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EnhancedFeaturesSection;
