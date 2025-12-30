import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CreditCard, DollarSign, UserCircle, Shield, Zap, Users } from 'lucide-react';

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
      highlight: "99.9% uptime"
    },
    {
      icon: DollarSign,
      title: "Kontrola kosztów",
      desc: "Śledź wydatki i optymalizuj budżet remontowy w czasie rzeczywistym",
      highlight: "Oszczędność 15-30%"
    },
    {
      icon: UserCircle,
      title: "Szybki dostęp",
      desc: "Dostęp do wszystkich projektów z jednego miejsca na każdym urządzeniu",
      highlight: "Multi-platform"
    },
    {
      icon: Zap,
      title: "Szybka synchronizacja",
      desc: "Zmiany synchronizują się automatycznie między urządzeniami",
      highlight: "Real-time sync"
    },
    {
      icon: Users,
      title: "Współpraca zespołowa",
      desc: "Współdziel projekty z zespołem i śledź postępy wspólnie",
      highlight: "Team features"
    },
    {
      icon: CreditCard,
      title: "Bezpieczne płatności",
      desc: "Bezpieczne transakcje z szyfrowaniem SSL i certyfikatem PCI DSS",
      highlight: "SSL secured"
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section title
      gsap.fromTo(
        titleRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Stagger animation for feature cards
      gsap.fromTo(
        featuresRef.current?.querySelectorAll('.feature-card'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`py-24 px-4 relative ${className || ''}`}
      aria-labelledby="features-heading"
    >
      <div className="container mx-auto max-w-6xl">
        <h2
          ref={titleRef}
          id="features-heading"
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-white"
        >
          Dlaczego RenoHub?
        </h2>

        <div
          ref={featuresRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group"
            >
              <div className="h-full p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-reno-purple to-reno-blue flex items-center justify-center mb-5">
                  <feature.icon className="w-6 h-6 text-white" aria-hidden="true" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {feature.desc}
                </p>

                {/* Highlight */}
                <span className="inline-block text-xs font-medium text-reno-mint/90 bg-reno-mint/10 px-3 py-1 rounded-full">
                  {feature.highlight}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EnhancedFeaturesSection;
