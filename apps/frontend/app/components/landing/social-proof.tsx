export function SocialProof() {
  const brands = [
    "TechFlow",
    "The Daily Byte",
    "StartupKit",
    "LaunchPad",
    "GrowthHQ",
    "Beacon Media",
    "Relay Digital",
    "Signal Labs",
  ]

  // Duplicate for seamless loop
  const allBrands = [...brands, ...brands]

  return (
    <section className="border-b border-border bg-card py-10 overflow-hidden">
      <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Trusted by leading brands and publishers
      </p>
      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-card to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-card to-transparent" />

        {/* Scrolling marquee */}
        <div className="flex animate-marquee items-center gap-16 whitespace-nowrap">
          {allBrands.map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              className="text-sm font-semibold tracking-tight text-foreground/25 transition-colors duration-300 hover:text-foreground"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
