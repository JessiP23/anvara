import type { Metadata } from 'next';
import { Hero } from './components/landing/hero';
import { SocialProof } from './components/landing/social-proof';
import { Features } from './components/landing/features';
import { HowItWorks } from './components/landing/how-it-works';
import {Stats} from "./components/landing/stats";
import { Testimonials } from './components/landing/testimonials';
import { CTASection } from './components/landing/cta-section';
import { Footer } from './components/landing/footer';

export const metadata: Metadata = {
  title: 'Sponsorship Marketplace That Actually Works',
  description: 'Connect with premium publishers, launch campaigns in minutes, and track performance in real-time. No middlemen, no hidden fees.',
  openGraph: {
    title: "Anvara - Sponsorship Marketplace",
    description: "Connect sponsors with premium publishers.",
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Anvara - Sponsorship Marketplace",
    description: "Connect sponsors with premium publishers.",
    images: ['/og-image.png'],
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
