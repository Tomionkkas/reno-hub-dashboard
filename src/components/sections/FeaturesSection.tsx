import React from 'react';
import { CreditCard, DollarSign, UserCircle } from 'lucide-react';

interface FeaturesSectionProps {
  className?: string;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ className }) => {
  const features = [
    { 
      icon: CreditCard, 
      title: "Bezpieczne przechowywanie", 
      desc: "Twoje projekty są bezpiecznie zapisane w chmurze", 
      delay: 0 
    },
    { 
      icon: DollarSign, 
      title: "Kontrola kosztów", 
      desc: "Śledź wydatki i optymalizuj budżet remontowy", 
      delay: 100 
    },
    { 
      icon: UserCircle, 
      title: "Szybki dostęp", 
      desc: "Dostęp do wszystkich projektów z jednego miejsca", 
      delay: 200 
    }
  ];

  return (
    <section className={`py-20 px-4 bg-black/20 relative ${className || ''}`} aria-labelledby="features-heading">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-reno-purple/5 rounded-full blur-3xl animate-float-random"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-reno-blue/5 rounded-full blur-2xl animate-float-random" style={{animationDelay: '3s'}}></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <h2 id="features-heading" className="text-3xl md:text-4xl font-bold text-center mb-12 text-white animate-fade-in">
          Dlaczego RenoHub?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="text-center animate-fade-in-up group" 
              style={{animationDelay: `${feature.delay}ms`}}
            >
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4 hover-lift group-hover:animate-glow-pulse transition-all duration-300">
                <feature.icon className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:gradient-text transition-all duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 text-sm md:text-base">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;


