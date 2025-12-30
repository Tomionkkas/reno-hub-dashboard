import React from 'react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={`py-12 px-4 bg-black/30 relative ${className || ''}`} role="contentinfo">
      <div className="container mx-auto text-center">
        <div className="text-xl md:text-2xl font-bold gradient-text mb-4 animate-fade-in hover-lift">
          RenoHub
        </div>
        <p className="text-gray-400 mb-6 animate-fade-in-up text-sm md:text-base" style={{animationDelay: '100ms'}}>
          Jedna platforma – wszystkie Twoje aplikacje remontowe
        </p>
        <nav 
          className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm text-gray-400 animate-fade-in-up" 
          style={{animationDelay: '200ms'}} 
          aria-label="Footer navigation"
        >
          <a href="#" className="nav-link hover:text-white transition-colors hover:gradient-text">
            Regulamin
          </a>
          <a href="/privacy-policy" className="nav-link hover:text-white transition-colors hover:gradient-text">
            Polityka prywatności
          </a>
          <a href="#" className="nav-link hover:text-white transition-colors hover:gradient-text">
            Kontakt
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;


