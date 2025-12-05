import React from 'react';
import { Link } from 'react-router-dom';
import { EnhancedButton } from '@/components/ui/enhanced-button';

interface CTASectionProps {
  className?: string;
}

const CTASection: React.FC<CTASectionProps> = ({ className }) => {
  return (
    <section className={`py-20 px-4 bg-gradient-to-r from-reno-purple to-reno-blue animated-gradient relative overflow-hidden ${className || ''}`} aria-labelledby="cta-heading">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 border border-white/30 rounded-full animate-float-random"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 border border-white/30 rounded-full animate-float-random" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-12 h-12 border border-white/30 rounded-full animate-float-random" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="container mx-auto text-center relative z-10">
        <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-white mb-6 animate-fade-in">
          Gotowy na start?
        </h2>
        <p className="text-lg md:text-xl text-white/80 mb-8 animate-fade-in-up" style={{animationDelay: '200ms'}}>
          Dołącz do tysięcy zadowolonych użytkowników
        </p>
        <div className="animate-scale-in" style={{animationDelay: '400ms'}}>
          <Link to="/register">
            <EnhancedButton 
              size="xl" 
              className="bg-white text-reno-purple hover:bg-gray-100 font-semibold hover:scale-110 transition-all duration-300 hover:shadow-2xl"
            >
              Zarejestruj się teraz
            </EnhancedButton>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;


