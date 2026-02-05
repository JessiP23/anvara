// TODO: This should be a marketing landing page, not just a simple welcome screen
// TODO: Add proper metadata for SEO (title, description, Open Graph)
// TODO: Add hero section, features, testimonials, etc.
// HINT: Check out the bonus challenge for marketing landing page!
import { responsive } from "@/lib/responsive";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className={cn('mb-4 font-bold', responsive.text.heading, 'text-3xl md:text-4xl')}>Welcome to Anvara</h1>
      <p className={cn('mb-8 max-w-md text-[--color-muted]', responsive.text.body)}>
        The sponsorship marketplace connecting sponsors with publishers.
      </p>

      <a
        href="/login"
        className={cn('rounded-lg bg-[--color-primary] px-6 text-white hover:bg-[--color-primary-hover]', responsive.button.full, responsive.button.touch)}
      >
        Get Started
      </a>

      <div className={cn('mt-12 grid w-full gap-4 text-left md:mt-16', responsive.grid.cols2)}>
        <div className={cn('rounded-lg border border-[--color-border]', responsive.spacing.card)}>
          <h2 className={cn('mb-2 font-semibold text-[--color-primary]', responsive.text.subheading)}>For Sponsors</h2>
          <p className={cn('text-[--color-muted]', responsive.text.small)}>
            Create campaigns, set budgets, and reach your target audience through premium
            publishers.
          </p>
        </div>
        <div className={cn('rounded-lg border border-[--color-border]', responsive.spacing.card)}>
          <h2 className={cn('mb-2 font-semibold text-[--color-secondary]', responsive.text.subheading)}>For Publishers</h2>
          <p className={cn('text-[--color-muted]', responsive.text.small)}>
            List your ad slots, set your rates, and connect with sponsors looking for your audience.
          </p>
        </div>
      </div>
    </div>
  );
}
