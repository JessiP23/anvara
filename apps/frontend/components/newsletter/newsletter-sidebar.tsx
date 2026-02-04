'use client'
import { NewsletterForm } from './newsletter-form';

export function NewsletterSidebar() {
  return (
    <aside className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 shadow-lg">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100 opacity-50" />
      <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-indigo-100 opacity-50" />

      <div className="relative">
        <h3 className="mb-2 text-lg font-bold text-gray-900">Stay in the Loop</h3>
        <p className="mb-5 text-sm leading-relaxed text-gray-600">
          Get the hottest ad placements and exclusive deals delivered straight to your inbox. No
          spam, ever.
        </p>
        <NewsletterForm />

        <div className="mt-5 flex items-center gap-4 border-t border-blue-100 pt-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="text-green-500">✓</span> Free forever
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="text-green-500">✓</span> Unsubscribe anytime
          </div>
        </div>
      </div>
    </aside>
  );
}