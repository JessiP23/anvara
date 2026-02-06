import type { Metadata } from 'next';
import { Hero } from './components/landing/hero';
import { SocialProof } from './components/landing/social-proof';
import { Features } from './components/landing/features';
import { HowItWorks } from './components/landing/how-it-works';
import {Stats} from "./components/landing/stats";
import { Testimonials } from './components/landing/testimonials';
import { CTASection } from './components/landing/cta-section';
import { Footer } from './components/landing/footer';
// TODO: This should be a marketing landing page, not just a simple welcome screen
// TODO: Add proper metadata for SEO (title, description, Open Graph)
// TODO: Add hero section, features, testimonials, etc.
// HINT: Check out the bonus challenge for marketing landing page!

export const metadata: Metadata = {
  title: 'Welcome',
  description: "The sponsorship marketplace connecting sponsors with premium publishers. Create campaigns, list ad slots, and grow your business.",
  openGraph: {
    title: "Anvara - Sponsorship Marketplace",
    description: "Connect sponsors with premium publishers.",
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Anvara - Sponsorship Marketplace",
    description: "Connect sponsors with premium publishers."
  }
}

export default function Home() {
  return (
    <main>
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <CTASection />
      <Footer />
    </main>
  );
}
