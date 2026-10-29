"use client";

import { useEffect, useRef, type MouseEvent } from "react";

export default function ContactLink() {
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => () => observer.current?.disconnect(), []);

  function highlightContact(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;

    const social = document.querySelector<HTMLElement>(
      "#footer .footer-social",
    );
    if (!social) return;

    observer.current?.disconnect();
    observer.current = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 1) return;

        observer.current?.disconnect();
        social.getAnimations().forEach((animation) => animation.cancel());
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        const green = getComputedStyle(social)
          .getPropertyValue("--ek-green")
          .trim();

        social.animate(
          reducedMotion
            ? [{ outlineColor: green }, { outlineColor: green }]
            : [
                { outlineColor: "transparent", offset: 0 },
                { outlineColor: green, offset: 0.15 },
                { outlineColor: green, offset: 0.8 },
                { outlineColor: "transparent", offset: 1 },
              ],
          { duration: 2000, easing: "ease-in-out" },
        );
      },
      { threshold: 1 },
    );
    observer.current.observe(social);
  }

  return (
    <a href="#footer" onClick={highlightContact}>
      Contact
    </a>
  );
}
