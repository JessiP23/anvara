import Image from 'next/image';

const steps = [
  { num: '01', title: 'Create account', detail: 'No credit card needed' },
  { num: '02', title: 'Browse or list', detail: 'Find perfect matches' },
  { num: '03', title: 'Connect', detail: 'Negotiate directly' },
  { num: '04', title: 'Launch', detail: 'Track in real-time' },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works-heading" className="relative overflow-hidden bg-gradient-to-b from-[hsl(230_30%_97%)] via-[hsl(240_30%_98%)] to-[--color-background] py-28 sm:py-36">
      {/* Subtle pattern overlay */}
      <div aria-hidden="true" className="cross-hatch pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section header */}
        <header className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[--color-secondary]">
            How It Works
          </p>
          <h2
            id="how-it-works-heading"
            className="mb-5 text-balance font-serif text-3xl tracking-tight text-[--color-foreground] sm:text-4xl lg:text-5xl"
          >
            From signup to success in 4 steps
          </h2>
          <p className="text-pretty text-base leading-relaxed text-[--color-muted]">
            We&apos;ve simplified the sponsorship process so you can focus on what matters most—growing your business.
          </p>
        </header>

        {/* Process image */}
        <figure className="relative mx-auto max-w-5xl">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[--color-primary]/5 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[--color-secondary]/5 blur-3xl"
          />

          <div className="relative overflow-hidden rounded-3xl">
            <Image
              src="/image2.png"
              alt="Four-step process diagram showing account creation, browsing listings, connecting with partners, and launching campaigns"
              width={1400}
              height={500}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              className="w-full"
              priority
            />
          </div>
        </figure>

        <ol className="mx-auto mt-16 grid max-w-4xl gap-8 sm:grid-cols-4">
          {steps.map((step) => (
            <li key={step.num} className="text-center">
              <span className="mb-2 block text-2xl font-bold text-[--color-primary]">{step.num}</span>
              <p className="text-sm font-medium text-[--color-foreground]">{step.title}</p>
              <p className="mt-1 text-xs text-[--color-muted]">{step.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}