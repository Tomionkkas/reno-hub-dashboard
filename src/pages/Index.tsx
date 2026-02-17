import React from 'react';
import Navigation from '@/components/Navigation';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { SkipLink } from '@/components/ui/accessibility-skip-link';
import { SEOHead } from '@/components/ui/seo-head';
import { usePerformanceMonitor } from '@/hooks/use-performance';
import GSAPHero from '@/components/animations/GSAPHero';
import EnhancedAppsSection from '@/components/sections/EnhancedAppsSection';
import EnhancedFeaturesSection from '@/components/sections/EnhancedFeaturesSection';
import EnhancedPricingSection from '@/components/sections/EnhancedPricingSection';
import EnhancedCTASection from '@/components/sections/EnhancedCTASection';
import Footer from '@/components/sections/Footer';
import GSAPPerformance from '@/components/animations/GSAPPerformance';
import AccessibilityEnhancer from '@/components/ui/accessibility-enhancer';
import { FeedbackManager, useFeedback } from '@/components/ui/user-feedback';
import UserFeedback from '@/components/ui/user-feedback';
import { RippleEffect, MagneticEffect, FloatingAnimation } from '@/components/ui/micro-interactions';
import { GradientBackground, ParticleSystem, FloatingOrbs, GlowEffect } from '@/components/ui/visual-enhancements';
import { PremiumShadow, AnimatedBackground, GlowingText, FloatingElements } from '@/components/ui/professional-polish';

const Index = () => {
  usePerformanceMonitor('Index');
  const { feedbacks, removeFeedback, success, error, warning, info } = useFeedback();

  // Demo feedback on component mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      success('Witamy w RenoHub!', 'Sukces', 3000);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <GSAPPerformance autoRefresh={true} refreshPriority="high" throttleTime={16}>
      <AccessibilityEnhancer skipToContent={true} announceChanges={true}>
        <GradientBackground
          colors={['from-black', 'via-slate-900', 'to-black']}
          direction="to-br"
          animated={true}
          speed={30}
          className="min-h-screen relative"
        >
          {/* Enhanced Background Effects */}
          <ParticleSystem count={50} speed={20} size="sm" colors={['#00D4FF', '#FF0080', '#7F67FF']} />
          <FloatingOrbs count={12} size="md" colors={['#00D4FF', '#FF0080', '#7F67FF']} />
          <FloatingElements count={20} elements={['star', 'circle', 'triangle']}>
            <div />
          </FloatingElements>
          <SEOHead
            title="RenoHub - Platforma aplikacji remontowych"
            description="Jedna platforma – wszystkie Twoje aplikacje remontowe. CalcReno do obliczeń materiałów i RenoTimeline do zarządzania projektami."
            keywords="remont, aplikacje remontowe, kalkulatory budowlane, zarządzanie projektami remontowymi, CalcReno, RenoTimeline"
          />

          <SkipLink href="#main-content">Skip to main content</SkipLink>
          <Navigation />

          {/* Enhanced Hero Section with GSAP */}
          <GSAPHero />

          {/* Main Content with Enhanced Sections */}
          <main id="main-content">
            <EnhancedAppsSection />
            <EnhancedFeaturesSection />
            <EnhancedPricingSection />
            <EnhancedCTASection />
          </main>

          {/* Footer */}
          <Footer />

          <ScrollToTop />

          {/* User Feedback Manager */}
          <FeedbackManager>
            {feedbacks.map((feedback) => (
              <UserFeedback
                key={feedback.id}
                type={feedback.type}
                title={feedback.title}
                message={feedback.message}
                duration={feedback.duration}
                onDismiss={() => removeFeedback(feedback.id)}
              />
            ))}
          </FeedbackManager>
        </GradientBackground>
      </AccessibilityEnhancer>
    </GSAPPerformance>
  );
};

export default Index;
