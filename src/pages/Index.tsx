import { usePerformanceMonitor } from '@/hooks/use-performance';
import { SEOHead } from '@/components/ui/seo-head';
import { SkipLink } from '@/components/ui/accessibility-skip-link';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import Navigation from '@/components/Navigation';
import HeroSectionD from '@/components/sections/HeroSectionD';
import AppSwitcherSection from '@/components/sections/AppSwitcherSection';
import QuoteSection from '@/components/sections/QuoteSection';
import BlogGridSection from '@/components/sections/BlogGridSection';
import CTASectionD from '@/components/sections/CTASectionD';
import FooterD from '@/components/sections/FooterD';

const Index = () => {
  usePerformanceMonitor('Index');

  return (
    <div className="min-h-screen" style={{ background: '#0A0B1E' }}>
      <SEOHead
        title="RenoHub — Aplikacje remontowe"
        description="RenoHub to rodzina aplikacji, które pomagają zaplanować remont — od pierwszego kosztorysu przez harmonogram po decyzje inwestycyjne. CalcReno, RenoTimeline, RenoScout."
        keywords="remont, aplikacje remontowe, kalkulator remontu, CalcReno, RenoTimeline, RenoScout"
      />
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <Navigation />

      <main id="main-content">
        <HeroSectionD />
        <AppSwitcherSection />
        <QuoteSection />
        <BlogGridSection />
        <CTASectionD />
      </main>

      <FooterD />
      <ScrollToTop />
    </div>
  );
};

export default Index;
