import { Link } from 'react-router-dom';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { TypingAnimation } from '@/components/ui/typing-animation';
import { FloatingShapes } from '@/components/ui/floating-shapes';

interface HeroSectionProps {
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ className }) => {
  const heroTexts = [
    "Jedna platforma – wszystkie Twoje aplikacje remontowe",
    "Zarządzaj projektami remontowymi profesjonalnie",
    "Obliczaj materiały i kontroluj koszty",
    "Planuj, realizuj, oszczędzaj"
  ];

  return (
    <section className={`pt-32 pb-20 px-4 relative overflow-hidden ${className || ''}`} aria-labelledby="hero-heading">
      {/* Enhanced Floating Background Elements */}
      <FloatingShapes count={8} className="opacity-30" />
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-reno-purple/20 rounded-full blur-xl animate-float-random"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-reno-blue/20 rounded-full blur-lg animate-float-random" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-reno-mint/20 rounded-full blur-md animate-float-random" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-br from-reno-purple/10 to-reno-blue/10 rounded-full blur-2xl animate-glow-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="container mx-auto text-center relative z-10">
        <h1 id="hero-heading" className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-down">
          <span className="gradient-text">RenoHub</span>
        </h1>
        
        {/* Enhanced Hero Description with Typing Animation */}
        <div className="text-xl md:text-2xl text-gray-300 mb-8 min-h-[3rem] flex items-center justify-center animate-fade-in-up" style={{animationDelay: '200ms'}}>
          <TypingAnimation 
            texts={heroTexts}
            className="gradient-text font-semibold"
            speed={80}
            deleteSpeed={40}
            pauseDuration={3000}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in" style={{animationDelay: '400ms'}}>
          <Link to="/register">
            <EnhancedButton 
              size="xl" 
              variant="floating" 
              className="animate-glow-pulse w-full sm:w-auto"
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
          >
            Zobacz aplikacje
          </EnhancedButton>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;


