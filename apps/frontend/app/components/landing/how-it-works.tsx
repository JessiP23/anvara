import Image from 'next/image';

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[hsl(230_30%_97%)] via-[hsl(240_30%_98%)] to-[--color-background] py-28 sm:py-36">
      {/* Subtle pattern overlay */}
      <div className="cross-hatch pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[--color-secondary]">
            How It Works
          </p>
          <h2 className="mb-5 text-balance font-serif text-3xl tracking-tight text-[--color-foreground] sm:text-4xl lg:text-5xl">
            From signup to success in 4 steps
          </h2>
          <p className="text-pretty text-base leading-relaxed text-[--color-muted]">
            We&apos;ve simplified the sponsorship process so you can focus on what matters most—growing your business.
          </p>
        </div>

        {/* Process image */}
        <div className="relative mx-auto max-w-5xl">
          {/* Glow effects */}
          <div className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[--color-primary]/5 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[--color-secondary]/5 blur-3xl" />

          <div className="relative overflow-hidden rounded-3xl">
            <Image
              src="/image2.png"
              alt="How Anvara works - 4 step process"
              width={1400}
              height={500}
              className="w-full"
              priority
            />
          </div>
        </div>

        {/* Optional: Text callouts below image */}
        <div className="mx-auto mt-16 grid max-w-4xl gap-8 sm:grid-cols-4">
          <div className="text-center">
            <div className="mb-2 text-2xl font-bold text-[--color-primary]">01</div>
            <p className="text-sm font-medium text-[--color-foreground]">Create account</p>
            <p className="mt-1 text-xs text-[--color-muted]">No credit card needed</p>
          </div>
          <div className="text-center">
            <div className="mb-2 text-2xl font-bold text-[--color-primary]">02</div>
            <p className="text-sm font-medium text-[--color-foreground]">Browse or list</p>
            <p className="mt-1 text-xs text-[--color-muted]">Find perfect matches</p>
          </div>
          <div className="text-center">
            <div className="mb-2 text-2xl font-bold text-[--color-primary]">03</div>
            <p className="text-sm font-medium text-[--color-foreground]">Connect</p>
            <p className="mt-1 text-xs text-[--color-muted]">Negotiate directly</p>
          </div>
          <div className="text-center">
            <div className="mb-2 text-2xl font-bold text-[--color-primary]">04</div>
            <p className="text-sm font-medium text-[--color-foreground]">Launch</p>
            <p className="mt-1 text-xs text-[--color-muted]">Track in real-time</p>
          </div>
        </div>
      </div>
    </section>
  );
}