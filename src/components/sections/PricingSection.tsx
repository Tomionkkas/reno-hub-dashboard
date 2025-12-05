import React from 'react';
import { Check, X } from 'lucide-react';
import { AnimatedCard, AnimatedCardContent, AnimatedCardDescription, AnimatedCardHeader, AnimatedCardTitle } from '@/components/ui/animated-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';

interface PricingSectionProps {
  className?: string;
}

const PricingSection: React.FC<PricingSectionProps> = ({ className }) => {
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
      popular: false
    },
    {
      id: 'pro',
      title: 'Pro',
      description: 'Jedna aplikacja, pełen dostęp',
      price: '20-40 zł',
      period: '/app/mies',
      discount: 'Roczna płatność: -20%',
      features: [
        { text: 'Pełen dostęp do wybranej aplikacji', included: true },
        { text: 'Nielimitowane projekty', included: true },
        { text: 'Eksport do PDF/Excel', included: true },
        { text: 'Standardowe wsparcie', included: true }
      ],
      buttonText: 'Wybierz plan Pro',
      buttonVariant: 'gradient' as const,
      delay: 200,
      popular: true
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
        { text: 'API dostęp', included: true }
      ],
      buttonText: 'Skontaktuj się',
      buttonVariant: 'outline' as const,
      delay: 400,
      popular: false
    }
  ];

  return (
    <section className={`py-20 px-4 ${className || ''}`} aria-labelledby="pricing-heading">
      <div className="container mx-auto">
        <h2 id="pricing-heading" className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text animate-fade-in">
          Plany Subskrypcyjne
        </h2>
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <AnimatedCard 
              key={plan.id}
              className={`glass-card border-white/10 ${plan.popular ? 'border-reno-purple relative scale-105 hover:scale-110 transition-transform duration-300' : ''}`} 
              delay={plan.delay}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 gradient-bg rounded-full text-white text-sm animate-bounce-gentle">
                  Najpopularniejszy
                </div>
              )}
              <AnimatedCardHeader>
                <AnimatedCardTitle className="text-white text-xl md:text-2xl">
                  {plan.title}
                </AnimatedCardTitle>
                <AnimatedCardDescription className="text-gray-300">
                  {plan.description}
                </AnimatedCardDescription>
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {plan.price}<span className="text-base md:text-lg text-gray-300">{plan.period}</span>
                </div>
                {plan.discount && (
                  <p className="text-sm text-gray-400">{plan.discount}</p>
                )}
              </AnimatedCardHeader>
              <AnimatedCardContent>
                <ul className="space-y-3 text-gray-300 mb-6 text-sm md:text-base">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 hover-lift">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-reno-mint flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                      )}
                      {feature.text}
                    </li>
                  ))}
                </ul>
                <EnhancedButton 
                  className="w-full text-white" 
                  variant={plan.buttonVariant}
                >
                  {plan.buttonText}
                </EnhancedButton>
              </AnimatedCardContent>
            </AnimatedCard>
          ))}
        </div>
        
        {/* Special Offer Banner */}
        <div className="mt-12 text-center animate-fade-in-up" style={{animationDelay: '600ms'}}>
          <div className="inline-block bg-gradient-to-r from-reno-purple to-reno-blue rounded-xl p-4 hover-lift">
            <p className="text-white font-semibold text-sm md:text-base">
              🚀 Oferta startowa: -30% na pierwsze 6 miesięcy dla wszystkich planów!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;


