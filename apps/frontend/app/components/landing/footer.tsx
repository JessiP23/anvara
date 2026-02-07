import Link from "next/link"

const navigation = {
  product: [
    { name: "Marketplace", href: "#" },
    { name: "For Sponsors", href: "#" },
    { name: "For Publishers", href: "#" },
    { name: "Pricing", href: "#" },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#" },
  ],
  legal: [
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
    { name: "Cookies", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="font-serif text-xl tracking-tight text-foreground">
              Anvara
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The sponsorship marketplace that connects sponsors and publishers
              directly.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
              Product
            </h3>
            <ul className="flex flex-col gap-3">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
              Company
            </h3>
            <ul className="flex flex-col gap-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
              Legal
            </h3>
            <ul className="flex flex-col gap-3">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            2026 Anvara. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Twitter
            </Link>
            <Link href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              LinkedIn
            </Link>
            <Link href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
