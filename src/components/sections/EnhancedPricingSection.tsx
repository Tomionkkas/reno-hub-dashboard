import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, X, Star, Zap, Crown, Info } from 'lucide-react';
import { GSAPCard, GSAPCardContent, GSAPCardDescription, GSAPCardHeader, GSAPCardTitle } from '@/components/animations/GSAPCard';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface EnhancedPricingSectionProps {
  className?: string;
}

const EnhancedPricingSection: React.FC<EnhancedPricingSectionProps> = ({ className }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const plansRef = useRef<HTMLDivElement>(null);

  const plans = [
    {
      id: 'free',
      title: 'Free',
      description: 'Podstawowe funkcje',
      price: '0 zł',
      period: '/mies',
      features: [
        { text: 'Dostęp do podstawowych funkcji', included: true },
        { text: 'Maksymalnie 3 projekty', included: true },
        { text: 'Ograniczone eksporty', included: true },
        { text: 'Brak premium wsparcia', included: false }
      ],
      buttonText: 'Zacznij za darmo',
      buttonVariant: 'outline' as const,
      delay: 0,
      popular: false,
      icon: Star,
      color: 'blue'
    },
    {
      id: 'pro',
      title: 'Pro',
      description: 'Jedna aplikacja, pełen dostęp',
      price: '49 zł',
      period: '/app/mies',
      discount: 'Roczna płatność: -20%',
      features: [
        { text: 'Pełen dostęp do wybranej aplikacji', included: true },
        { text: 'Nielimitowane projekty', included: true },
        { text: 'Eksport do PDF/Excel', included: true },
        { text: 'Standardowe wsparcie', included: true },
        { text: 'Zaawansowane raporty', included: true }
      ],
      buttonText: 'Wybierz plan Pro',
      buttonVariant: 'gradient' as const,
      delay: 200,
      popular: true,
      icon: Zap,
      color: 'purple'
    },
    {
      id: 'expert',
      title: 'Expert',
      description: 'Dla zespołów i firm',
      price: '200-220 zł',
      period: '/mies',
      discount: 'Roczna płatność: -25% | Do 3 użytkowników',
      features: [
        { text: 'Dostęp do wszystkich aplikacji', included: true },
        { text: 'Wsparcie dla 2-3 użytkowników', included: true },
        { text: 'Premium wsparcie techniczne', included: true },
        { text: 'Wczesny dostęp do nowości', included: true },
        { text: 'API dostęp', included: true },
        { text: 'Dedykowany menedżer', included: true }
      ],
      buttonText: 'Skontaktuj się',
      buttonVariant: 'outline' as const,
      delay: 400,
      popular: false,
      icon: Crown,
      color: 'gold'
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

      // Stagger animation for pricing cards
      gsap.fromTo(
        plansRef.current?.querySelectorAll('.pricing-card'),
        {
          y: 100,
          opacity: 0,
          scale: 0.8,
          rotationY: 20
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: plansRef.current,
            start: "top bottom-=150",
            end: "bottom top",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Floating animation for popular badge
      gsap.to(plansRef.current?.querySelector('.popular-badge'), {
        y: -5,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'border-blue-500/30 hover:border-blue-400/60';
      case 'purple':
        return 'border-reno-purple/50 hover:border-reno-purple/70';
      case 'gold':
        return 'border-yellow-500/30 hover:border-yellow-400/60';
      default:
        return 'border-white/10 hover:border-white/20';
    }
  };

  return (
    <section 
      ref={sectionRef}
      className={`py-20 px-4 ${className || ''}`} 
      aria-labelledby="pricing-heading"
    >
      <div className="container mx-auto">
        <h2 
          ref={titleRef}
          id="pricing-heading" 
          className="text-3xl md:text-4xl font-bold text-center mb-4 gradient-text"
        >
          Plany Subskrypcyjne
        </h2>
        
        {/* Beta Status Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-reno-purple/20 to-reno-blue/20 border border-reno-purple/30 rounded-xl px-6 py-3 mb-4">
            <div className="w-8 h-8 bg-reno-purple/30 rounded-full flex items-center justify-center">
              <Info className="w-4 h-4 text-reno-purple" />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold text-sm md:text-base">
                Aplikacje w fazie beta - obecnie darmowe
              </p>
              <p className="text-gray-300 text-xs md:text-sm">
                Ciesz się darmowym dostępem podczas rozwoju aplikacji
              </p>
            </div>
          </div>
          
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            Poniższe ceny będą obowiązywać po zakończeniu fazy beta. 
            <span className="text-reno-mint font-medium"> Obecnie wszystkie aplikacje są dostępne za darmo!</span>
          </p>
        </div>
        
        <div 
          ref={plansRef}
          className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan) => (
            <GSAPCard 
              key={plan.id}
              className={`pricing-card ${getColorClasses(plan.color)} ${plan.popular ? 'relative scale-105 hover:scale-110 transition-transform duration-300' : ''}`} 
              delay={plan.delay}
              hover="lift"
              trigger="scroll"
            >
              {plan.popular && (
                <div className="popular-badge absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 gradient-bg rounded-full text-white text-sm">
                  <Zap className="w-3 h-3 inline mr-1" />
                  Najpopularniejszy
                </div>
              )}
              
              {/* Future Pricing Badge */}
              <div className="absolute -top-2 -right-2">
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                  Po fazie beta
                </Badge>
              </div>
              
              <GSAPCardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    plan.color === 'purple' ? 'bg-reno-purple/20' : 
                    plan.color === 'gold' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                  }`}>
                    <plan.icon className={`w-6 h-6 ${
                      plan.color === 'purple' ? 'text-reno-purple' : 
                      plan.color === 'gold' ? 'text-yellow-500' : 'text-blue-500'
                    }`} />
                  </div>
                  <div>
                    <GSAPCardTitle className="text-white text-xl md:text-2xl">
                      {plan.title}
                    </GSAPCardTitle>
                    <GSAPCardDescription className="text-gray-300">
                      {plan.description}
                    </GSAPCardDescription>
                  </div>
                </div>
                
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {plan.price}<span className="text-base md:text-lg text-gray-300">{plan.period}</span>
                </div>
                {plan.discount && (
                  <p className="text-sm text-gray-400">{plan.discount}</p>
                )}
              </GSAPCardHeader>
              
              <GSAPCardContent>
                <ul className="space-y-3 text-gray-300 mb-6 text-sm md:text-base">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 hover-lift group">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-reno-mint flex-shrink-0 group-hover:scale-110 transition-transform" />
                      ) : (
                        <X className="w-4 h-4 text-red-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      )}
                      <span className={feature.included ? '' : 'line-through opacity-60'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <EnhancedButton 
                        className="w-full text-white opacity-60 cursor-not-allowed" 
                        variant={plan.buttonVariant}
                        disabled
                      >
                        {plan.buttonText}
                      </EnhancedButton>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Dostępne po zakończeniu fazy beta</p>
                  </TooltipContent>
                </Tooltip>
              </GSAPCardContent>
            </GSAPCard>
          ))}
        </div>
        
        {/* Enhanced Special Offer Banner */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-gradient-to-r from-reno-purple to-reno-blue rounded-xl p-6 hover-lift relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="relative">
              <p className="text-white font-semibold text-sm md:text-base flex items-center justify-center gap-2">
                <span className="text-2xl">🚀</span>
                Oferta startowa: -30% na pierwsze 6 miesięcy dla wszystkich planów po fazie beta!
                <span className="text-2xl">🎉</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedPricingSection;


