const features = [
  {
    label: "Targeted Reach",
    title: "Find your perfect audience",
    description:
      "Connect with publishers that match your audience demographics and niche. No more guesswork, just precision matching.",
    span: "lg:col-span-2",
  },
  {
    label: "Lightning Fast",
    title: "Launch in minutes, not weeks",
    description:
      "Our streamlined process gets you from brief to live campaign faster than any other platform.",
    span: "lg:col-span-1",
  },
  {
    label: "Real-time Analytics",
    title: "Data you can act on",
    description:
      "Track impressions, clicks, and conversions as they happen. Make smarter decisions with live dashboards.",
    span: "lg:col-span-1",
  },
  {
    label: "Transparent Pricing",
    title: "No surprises, ever",
    description:
      "See exactly what you pay. No hidden fees, no surprise charges. Just clear, honest pricing from day one.",
    span: "lg:col-span-2",
  },
  {
    label: "Direct Relationships",
    title: "Cut out the middlemen",
    description:
      "Work directly with publishers. Build lasting partnerships without intermediaries taking a cut.",
    span: "lg:col-span-1",
  },
  {
    label: "Brand Safe",
    title: "Your brand, protected",
    description:
      "Every publisher is vetted. Your brand appears only where you want it to, guaranteed.",
    span: "lg:col-span-1",
  },
  {
    label: "Smart Matching",
    title: "AI-powered recommendations",
    description:
      "Our matching engine surfaces the best publisher-sponsor pairings so you spend less time searching and more time growing.",
    span: "lg:col-span-1",
  },
]

export function Features() {
  return (
    <section className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mx-auto mb-20 max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[hsl(var(--accent))]">
            Why Anvara
          </p>
          <h2 className="mb-5 text-balance font-serif text-3xl tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Everything you need to scale sponsorships
          </h2>
          <p className="text-pretty text-base leading-relaxed text-muted-foreground">
            Built by marketers, for marketers. We understand what it takes to run
            successful campaigns at any scale.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all duration-500 hover:border-[hsl(var(--accent)_/_0.35)] hover:shadow-sm ${feature.span}`}
            >
              {/* Accent top line on hover */}
              <div className="absolute left-0 right-0 top-0 h-px bg-[hsl(var(--accent))] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[hsl(var(--accent))]">
                {feature.label}
              </p>
              <h3 className="mb-3 text-lg font-semibold tracking-tight text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
