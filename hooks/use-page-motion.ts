"use client";

import { useEffect, type RefObject } from "react";

export function usePageMotion(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const page = root.current;
    if (!page) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = Array.from(
      page.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    let observer: IntersectionObserver | undefined;

    function configureMotion() {
      observer?.disconnect();
      if (preference.matches || !("IntersectionObserver" in window)) {
        elements.forEach((element) =>
          element.removeAttribute("data-motion-state"),
        );
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.setAttribute("data-motion-state", "visible");
            observer?.unobserve(entry.target);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
      );

      elements.forEach((element) => {
        if (element.dataset.motionState === "visible") return;
        // Content above the current scroll position remains immediately available.
        if (element.getBoundingClientRect().bottom < 0) return;
        element.dataset.motionState = "pending";
        observer?.observe(element);
      });
    }

    function revealFocusedContent(event: FocusEvent) {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest('[data-motion-state="pending"]');
      if (element) {
        element.setAttribute("data-motion-state", "visible");
        observer?.unobserve(element);
      }
    }

    configureMotion();
    preference.addEventListener("change", configureMotion);
    page.addEventListener("focusin", revealFocusedContent);
    return () => {
      observer?.disconnect();
      preference.removeEventListener("change", configureMotion);
      page.removeEventListener("focusin", revealFocusedContent);
      elements.forEach((element) =>
        element.removeAttribute("data-motion-state"),
      );
    };
  }, [root]);
}
