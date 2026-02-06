const stats = [
  {
    value: "500+",
    label: "Active Publishers",
    detail: "Premium content creators",
  },
  {
    value: "$2M+",
    label: "Ad Spend Processed",
    detail: "In total campaigns",
  },
  {
    value: "98%",
    label: "Satisfaction Rate",
    detail: "From verified users",
  },
  {
    value: "24/7",
    label: "Support Available",
    detail: "We are always here to help",
  },
]

export function Stats() {
  return (
    <section className="relative overflow-hidden bg-foreground py-20 sm:py-24">
      {/* Subtle cross-hatch on dark */}
      <div
        className="pointer-events-none absolute inset-0 opacity-100"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(40 30% 96% / 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(40 30% 96% / 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center lg:text-left">
              <div className="mb-1 font-serif text-4xl text-background sm:text-5xl">
                {stat.value}
              </div>
              <div className="mb-1 text-sm font-semibold tracking-wide text-[hsl(var(--accent))]">
                {stat.label}
              </div>
              <div className="text-xs text-background/35">
                {stat.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
