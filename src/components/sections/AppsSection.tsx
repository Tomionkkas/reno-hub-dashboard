import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatedCard, AnimatedCardContent, AnimatedCardDescription, AnimatedCardHeader, AnimatedCardTitle } from '@/components/ui/animated-card';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface AppsSectionProps {
  className?: string;
}

const AppsSection: React.FC<AppsSectionProps> = ({ className }) => {
  const apps = [
    {
      id: 'calcreno',
      title: 'CalcReno',
      description: 'Narzędzie do obliczeń materiałów budowlanych. Zaplanuj projekt i oblicz dokładne ilości potrzebnych materiałów.',
      image: '/calcreno-logo-full-transparent.png',
      imageAlt: 'CalcReno application icon',
      tags: ['Mobile', 'iOS/Android'],
      link: null,
      delay: 0
    },
    {
      id: 'renotimeline',
      title: 'RenoTimeline',
      description: 'Narzędzie do zarządzania projektami remontowymi. Planuj etapy, śledź postępy i kontroluj koszty.',
      image: '/renotimeline-logo-transparent.png',
      imageAlt: 'RenoTimeline application icon',
      tags: ['Web App', 'Browser'],
      link: null,
      delay: 200
    },
    {
      id: 'renoscout',
      title: 'RenoScout',
      description: 'Nowoczesna platforma AI do wyszukiwania, analizy i oceny okazji inwestycyjnych na rynku nieruchomości w Polsce. Automatyzuje zbieranie danych, analizę rynku i scoring inwestycji.',
      image: '/Renoscout logo.png',
      imageAlt: 'RenoScout application icon',
      tags: ['Web App', 'AI'],
      link: '/renoscout',
      delay: 400
    }
  ];

  return (
    <section className={`py-20 px-4 relative ${className || ''}`} aria-labelledby="apps-heading">
      <div className="container mx-auto">
        <h2 id="apps-heading" className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text animate-fade-in">
          Nasze Aplikacje
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {apps.map((app) => {
            const cardContent = (
              <AnimatedCard 
                className="glass-card border-white/10 hover:border-blue-400/60 transition-colors hover:shadow-2xl hover:shadow-blue-400/20" 
                delay={app.delay} 
                hover="glow" 
                role="article" 
                aria-labelledby={`${app.id}-title`}
              >
                <AnimatedCardHeader>
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-200 via-purple-100 to-purple-50 rounded-xl flex items-center justify-center mb-4 hover-lift animate-glow-pulse shadow-xl border border-purple-300/60">
                    <OptimizedImage 
                      src={app.image} 
                      alt={app.imageAlt} 
                      className="w-[4.5rem] h-[4.5rem] object-contain -mt-0.5"
                    />
                  </div>
                  <AnimatedCardTitle id={`${app.id}-title`} className="text-white text-xl md:text-2xl">
                    {app.title}
                  </AnimatedCardTitle>
                  <AnimatedCardDescription className="text-gray-300 text-sm md:text-base">
                    {app.description}
                  </AnimatedCardDescription>
                </AnimatedCardHeader>
                <AnimatedCardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {app.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-reno-mint/20 text-reno-mint rounded-full text-sm hover-lift transition-all duration-300 hover:bg-reno-mint/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </AnimatedCardContent>
              </AnimatedCard>
            );

            return app.link ? (
              <Link key={app.id} to={app.link} className="contents">
                {React.cloneElement(cardContent, { className: cardContent.props.className + ' cursor-pointer' })}
              </Link>
            ) : (
              <div key={app.id}>
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AppsSection;
