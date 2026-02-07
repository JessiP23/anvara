"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const testimonials = [
  {
    quote:
      "Anvara transformed how we approach sponsorships. We have tripled our reach with half the effort.",
    author: "Sarah Chen",
    role: "Marketing Director",
    company: "TechFlow",
  },
  {
    quote:
      "As a publisher, I love the transparency. I know exactly what sponsors want and can price accordingly.",
    author: "Marcus Johnson",
    role: "Newsletter Owner",
    company: "The Daily Byte",
  },
  {
    quote:
      "The analytics alone are worth it. Real-time data helps us optimize campaigns on the fly.",
    author: "Emily Rodriguez",
    role: "Growth Lead",
    company: "StartupKit",
  },
  {
    quote:
      "We switched from three different tools to just Anvara. Simpler, cheaper, and better results across the board.",
    author: "Daniel Park",
    role: "Head of Partnerships",
    company: "LaunchPad",
  },
  {
    quote:
      "The direct connection with publishers is what sealed it for us. No more intermediaries eating into our budget.",
    author: "Amara Okafor",
    role: "CMO",
    company: "GrowthHQ",
  },
];

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("div")?.offsetWidth ?? 400;
    el.scrollBy({
      left: direction === "left" ? -cardWidth - 20 : cardWidth + 20,
      behavior: "smooth",
    });
  };

  return (
    <section aria-labelledby="testimonials-heading" className="overflow-hidden py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header + navigation arrows */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <header>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[hsl(var(--accent))]">
              What people say
            </p>
            <h2
              id="testimonials-heading"
              className="text-balance font-serif text-3xl tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              Trusted by teams who ship
            </h2>
          </header>

          {/* Arrow buttons */}
          <nav aria-label="Testimonial navigation" className="flex gap-3">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-all duration-200 hover:bg-card disabled:cursor-default disabled:opacity-25"
              aria-label="Previous testimonial"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M10 12L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-all duration-200 hover:bg-card disabled:cursor-default disabled:opacity-25"
              aria-label="Next testimonial"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 4L10 8L6 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </nav>
        </div>

        {/* Horizontal scroll container */}
        <div
          ref={scrollRef}
          className="hide-scrollbar flex gap-5 overflow-x-auto scroll-smooth pb-4"
          role="list"
          aria-label="Customer testimonials"
        >
          {testimonials.map((t, index) => (
            <article
              key={index}
              role="listitem"
              className="flex w-[340px] flex-none flex-col justify-between rounded-2xl border border-border bg-card p-8 sm:w-[400px]"
            >
              {/* Quote mark */}
              <div aria-hidden="true" className="mb-5 font-serif text-5xl leading-none text-[hsl(var(--accent)_/_0.2)]">
                {"\u201C"}
              </div>

              <blockquote className="mb-8 flex-1 text-base leading-relaxed text-foreground">
                {t.quote}
              </blockquote>

              {/* Author */}
              <footer className="flex items-center gap-4">
                <div
                  aria-hidden="true"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--accent)_/_0.1)] text-sm font-semibold text-[hsl(var(--accent))]"
                >
                  {t.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <cite className="not-italic text-sm font-semibold text-foreground">
                    {t.author}
                  </cite>
                  <p className="text-xs text-muted-foreground">
                    {t.role}, {t.company}
                  </p>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}