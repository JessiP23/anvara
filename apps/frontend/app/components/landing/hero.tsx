import Link from 'next/link';

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="cross-hatch relative overflow-hidden py-20 sm:py-32">
      {/* Peach glow behind headline */}
      <div aria-hidden="true" className="peach-glow pointer-events-none absolute inset-0" />

      {/* Decorative blurs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-20 h-72 w-72 rounded-full bg-[--color-primary] opacity-[0.03] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 bottom-20 h-60 w-60 rounded-full bg-[--color-secondary] opacity-[0.04] blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        {/* Badge */}
        <p className="mb-8 inline-flex items-center gap-2 rounded-full border border-[--color-border] bg-[--color-card] px-4 py-1.5 text-sm font-medium text-[--color-foreground]">
          <span aria-hidden="true" className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[--color-primary] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[--color-primary]" />
          </span>
          Now connecting 500+ publishers &amp; sponsors
        </p>

        {/* Headline */}
        <h1
          id="hero-heading"
          className="mb-6 text-4xl font-extrabold tracking-tight text-[--color-foreground] sm:text-5xl lg:text-6xl"
        >
          The Sponsorship Marketplace
          <span className="mt-2 block text-[--color-primary]">That Actually Works</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[--color-muted] sm:text-xl">
          Connect with premium publishers, launch campaigns in minutes, and track
          performance in real-time. No middlemen, no hidden fees, just results.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/login" className="btn-primary btn-lg">
            Start Free Today
            <span aria-hidden="true"> →</span>
          </Link>
        </div>

        {/* Trust indicators */}
        <ul
          className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[--color-muted]"
          aria-label="Trust indicators"
        >
          <li>No credit card required</li>
          <li aria-hidden="true">·</li>
          <li>Setup in 5 minutes</li>
          <li aria-hidden="true">·</li>
          <li>Cancel anytime</li>
        </ul>
      </div>
    </section>
  );
}