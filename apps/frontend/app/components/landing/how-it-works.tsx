const steps = [
  {
    number: "01",
    title: "Create your account",
    description:
      "Sign up as a sponsor or publisher in seconds. No credit card required to get started.",
  },
  {
    number: "02",
    title: "Browse or list",
    description:
      "Sponsors browse premium ad slots. Publishers list their inventory with custom pricing.",
  },
  {
    number: "03",
    title: "Connect & negotiate",
    description:
      "Request quotes, negotiate terms, and finalize deals directly with your partners.",
  },
  {
    number: "04",
    title: "Launch & track",
    description:
      "Go live instantly and monitor performance with real-time analytics dashboards.",
  },
]

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-card py-28 sm:py-36">
      <div className="relative z-10 mx-auto max-w-5xl px-6">
        {/* Section header */}
        <div className="mx-auto mb-20 max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[hsl(var(--accent))]">
            How it works
          </p>
          <h2 className="mb-4 text-balance font-serif text-3xl tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            From signup to success in four steps
          </h2>
        </div>

        {/* Steps */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="group relative">
              {/* Number */}
              <span className="mb-6 block font-serif text-5xl text-foreground/10 transition-colors duration-500 group-hover:text-[hsl(var(--accent)_/_0.3)]">
                {step.number}
              </span>

              {/* Connector line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-7 hidden h-px w-8 translate-x-full bg-border lg:block" />
              )}

              <h3 className="mb-3 text-base font-semibold tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
