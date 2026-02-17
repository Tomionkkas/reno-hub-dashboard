import React, { useEffect, useRef, useState } from 'react';
import { NewsletterModal } from '@/components/ui/newsletter-modal';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GSAPCard, GSAPCardContent, GSAPCardDescription, GSAPCardHeader, GSAPCardTitle } from '@/components/animations/GSAPCard';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import InteractiveCard from '@/components/ui/interactive-card';
import { RippleEffect, MagneticEffect } from '@/components/ui/micro-interactions';
import { ProgressIndicator } from '@/components/ui/user-feedback';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface EnhancedAppsSectionProps {
  className?: string;
}

const EnhancedAppsSection: React.FC<EnhancedAppsSectionProps> = ({ className }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

  const apps = [
    {
      id: 'calcreno',
      title: 'CalcReno',
      description: 'Narzędzie do obliczeń materiałów budowlanych. Zaplanuj projekt i oblicz dokładne ilości potrzebnych materiałów.',
      image: '/calcreno-logo-full-transparent.png',
      imageAlt: 'CalcReno application icon',
      tags: ['Mobile', 'iOS/Android'],
      link: null,
      delay: 0,
      status: 'In beta soon',
      cta: 'Dołącz do listy oczekujących'
    },
    {
      id: 'renotimeline',
      title: 'RenoTimeline',
      description: 'Narzędzie do zarządzania projektami remontowymi. Planuj etapy, śledź postępy i kontroluj koszty.',
      image: '/renotimeline-logo-transparent.png',
      imageAlt: 'RenoTimeline application icon',
      tags: ['Web App', 'Browser'],
      link: 'https://www.renotimeline.com',
      delay: 200,
      status: 'Available',
      cta: 'Otwórz aplikację'
    },
    {
      id: 'renoscout',
      title: 'RenoScout',
      description: 'Nowoczesna platforma AI do wyszukiwania, analizy i oceny okazji inwestycyjnych na rynku nieruchomości w Polsce. Automatyzuje zbieranie danych, analizę rynku i scoring inwestycji.',
      image: '/Renoscout logo.png',
      imageAlt: 'RenoScout application icon',
      tags: ['Web App', 'AI'],
      link: '/renoscout',
      delay: 400,
      progress: 60,
      status: 'Coming Soon',
      cta: 'Dowiedz się więcej'
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

      // Stagger animation for cards
      gsap.fromTo(
        sectionRef.current?.querySelectorAll('.app-card'),
        {
          y: 100,
          opacity: 0,
          rotationY: 15
        },
        {
          y: 0,
          opacity: 1,
          rotationY: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom-=150",
            end: "bottom top",
            toggleActions: "play none none reverse"
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const isExternalLink = (url: string): boolean => {
    return url.startsWith('http://') || url.startsWith('https://');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Beta':
      case 'In beta soon':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Coming Soon':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Available':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <section
      ref={sectionRef}
      id="apps"
      className={`py-10 md:py-20 px-4 relative ${className || ''}`}
      aria-labelledby="apps-heading"
    >
      <div className="container mx-auto">
        <h2
          ref={titleRef}
          id="apps-heading"
          className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text"
        >
          Nasze Aplikacje
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {apps.map((app) => {
            const cardContent = (
              <RippleEffect>
                <GSAPCard
                  className="app-card group hover:border-cyan-500/60 transition-colors hover:shadow-2xl hover:shadow-cyan-500/30"
                  delay={app.delay}
                  hover="lift"
                  trigger="scroll"
                  role="article"
                  aria-labelledby={`${app.id}-title`}
                >
                  <GSAPCardHeader>
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-cyan-900 via-cyan-800 to-cyan-700 rounded-xl flex items-center justify-center mb-4 hover-lift shadow-xl border border-cyan-500/40">
                        <OptimizedImage
                          src={app.image}
                          alt={app.imageAlt}
                          className="w-[4.5rem] h-[4.5rem] object-contain -mt-0.5"
                        />
                      </div>
                      <Badge
                        className={`absolute -top-2 -right-2 ${getStatusColor(app.status)} border`}
                        variant="outline"
                      >
                        {app.status}
                      </Badge>
                    </div>
                    <GSAPCardTitle id={`${app.id}-title`} className="text-white text-xl md:text-2xl">
                      {app.title}
                    </GSAPCardTitle>
                    <GSAPCardDescription className="text-gray-300 text-sm md:text-base">
                      {app.description}
                    </GSAPCardDescription>
                  </GSAPCardHeader>
                  <GSAPCardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {app.tags.map((tag, index) => (
                        <Tooltip key={index}>
                          <TooltipTrigger asChild>
                            <Badge
                              className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm hover-lift transition-all duration-300 hover:bg-cyan-500/30 cursor-help"
                            >
                              {tag}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Platforma: {tag}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>

                    {/* Enhanced Progress indicator - only show for RenoScout */}
                    {app.progress && (
                      <div className="mt-4">
                        <ProgressIndicator
                          progress={app.progress}
                          label="Rozwój"
                          showPercentage={true}
                          animated={true}
                        />
                      </div>
                    )}

                    {/* CTA strip */}
                    {app.cta && (
                      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                        <span className="text-sm font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                          {app.cta}
                        </span>
                        <span className="text-cyan-400 text-sm transition-transform duration-200 group-hover:translate-x-1">→</span>
                      </div>
                    )}
                  </GSAPCardContent>
                </GSAPCard>
              </RippleEffect>
            );

            if (!app.link) {
              if (app.id === 'calcreno') {
                return (
                  <div
                    key={app.id}
                    id={`app-${app.id}`}
                    onClick={() => setIsNewsletterOpen(true)}
                    className="cursor-pointer"
                    role="button"
                    aria-label="Zapisz się na newsletter CalcReno"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setIsNewsletterOpen(true)}
                  >
                    {cardContent}
                  </div>
                );
              }
              return (
                <div key={app.id} id={`app-${app.id}`}>
                  {cardContent}
                </div>
              );
            }

            const isExternal = isExternalLink(app.link);

            if (isExternal) {
              return (
                <div key={app.id} id={`app-${app.id}`}>
                  <a
                    href={app.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contents"
                  >
                    {React.cloneElement(cardContent, { className: cardContent.props.className + ' cursor-pointer' })}
                  </a>
                </div>
              );
            }

            return (
              <div key={app.id} id={`app-${app.id}`}>
                <Link to={app.link} className="contents">
                  {React.cloneElement(cardContent, { className: cardContent.props.className + ' cursor-pointer' })}
                </Link>
              </div>
            );
          })}
        </div>

        <NewsletterModal
          open={isNewsletterOpen}
          onOpenChange={setIsNewsletterOpen}
        />
      </div>
    </section>
  );
};

export default EnhancedAppsSection;
