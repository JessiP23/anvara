import Link from "next/link"

export function CTASection() {
  return (
    <section className="relative overflow-hidden border-t border-border py-28 sm:py-36 cross-hatch">
      {/* Warm glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(12_60%_52%_/_0.05)] blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <h2 className="mb-5 text-balance font-serif text-3xl tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Ready to grow your business?
        </h2>
        <p className="mx-auto mb-10 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground">
          Join hundreds of sponsors and publishers already using Anvara to
          power their sponsorships. Start free, upgrade when you are ready.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/login"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-8 text-sm font-medium text-background transition-opacity duration-300 hover:opacity-90"
          >
            Get Started Free
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
              {"->"}
            </span>
          </Link>
        </div>

        <p className="mt-10 text-xs text-muted-foreground/50">
          No credit card required. Free forever plan available.
        </p>
      </div>
    </section>
  )
}
