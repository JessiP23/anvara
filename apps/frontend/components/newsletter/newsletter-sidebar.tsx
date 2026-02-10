'use client'
import { NewsletterForm } from './newsletter-form';

export function NewsletterSidebar() {
  return (
    <aside className="relative overflow-hidden rounded-2xl border border-[--color-border] bg-gradient-to-br from-[--color-primary]/10 via-[--color-card] to-[--color-primary]/5 p-6 shadow-lg">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[--color-primary]/10 opacity-50" />
      <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-[--color-primary]/10 opacity-50" />

      <div className="relative">
        <h3 className="mb-2 text-lg font-bold text-[--color-foreground]">Stay in the Loop</h3>
        <p className="mb-5 text-sm leading-relaxed text-[--color-muted]">
          Get the hottest ad placements and exclusive deals delivered straight to your inbox. No
          spam, ever.
        </p>
        <NewsletterForm />

        <div className="mt-5 flex items-center gap-4 border-t border-[--color-border] pt-4">
          <div className="flex items-center gap-1.5 text-xs text-[--color-muted]">
            <span className="text-[--color-success]">✓</span> Free forever
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[--color-muted]">
            <span className="text-[--color-success]">✓</span> Unsubscribe anytime
          </div>
        </div>
      </div>
    </aside>
  );
}