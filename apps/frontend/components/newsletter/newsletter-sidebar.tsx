import { NewsletterForm } from "./newsletter-form";

export function NewsletterSidebar() {
    return (
        <aside className="rounded-lg border bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-semibold">Stay Updated</h3>
            <p className="mb-3 text-sm text-gray-600">Get Weekly Ad placements in your inbox.</p>
            <NewsletterForm />
        </aside>
    )
}