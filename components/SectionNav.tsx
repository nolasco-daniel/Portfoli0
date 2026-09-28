"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { useLanguage } from "@/components/LanguageProvider";

type IconName = "home" | "stack" | "experience" | "projects" | "contact";

function NavIcon({ name }: { name: IconName }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "home") {
    return <svg {...common}><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z" /></svg>;
  }
  if (name === "stack") {
    return <svg {...common}><path d="m8 6-6 6 6 6" /><path d="m16 6 6 6-6 6" /><path d="m14 3-4 18" /></svg>;
  }
  if (name === "experience") {
    return <svg {...common}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M3 12h18" /><path d="M10 12v2h4v-2" /></svg>;
  }
  if (name === "projects") {
    return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>;
  }
  return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
}

// Vertical dots fixed to the right edge that highlight the current section
// using the same `data-kb-section` markers the 3D scene already observes.
// Click a dot → smooth scroll (Lenis is wrapping the document, so a regular
// scrollIntoView gets intercepted and animated by Lenis). Hidden on small
// screens to avoid crowding the keyboard.
export default function SectionNav() {
  const [active, setActive] = useState<string>("hero");
  const navigationTarget = useRef<string | null>(null);
  const pointerNavigation = useRef<string | null>(null);
  const goToRef = useRef<(id: string, immediate?: boolean) => void>(() => {});
  const lenis = useLenis();
  const { t } = useLanguage();

  const SECTIONS = [
    { id: "hero", label: t("nav.home") },
    { id: "stack", label: t("nav.stack") },
    { id: "experience", label: t("nav.experience") },
    { id: "project1", label: `${t("nav.project")} 01` },
    { id: "project2", label: `${t("nav.project")} 02` },
    { id: "project3", label: `${t("nav.project")} 03` },
    { id: "project4", label: `${t("nav.project")} 04` },
    { id: "project5", label: `${t("nav.project")} 05` },
    { id: "project6", label: `${t("nav.project")} 06` },
    { id: "contact", label: t("nav.contact") },
  ];

  const mobileSections: Array<{
    id: string;
    label: string;
    icon: IconName;
    matches: (section: string) => boolean;
  }> = [
    { id: "hero", label: t("nav.home"), icon: "home", matches: (section) => section === "hero" },
    { id: "stack", label: t("nav.stack"), icon: "stack", matches: (section) => section === "stack" },
    { id: "experience", label: t("nav.experience"), icon: "experience", matches: (section) => section === "experience" },
    { id: "project1", label: t("nav.project"), icon: "projects", matches: (section) => section.startsWith("project") },
    { id: "contact", label: t("nav.contact"), icon: "contact", matches: (section) => section === "contact" },
  ];

  useEffect(() => {
    const ids = [
      "hero",
      "stack",
      "experience",
      "project1",
      "project2",
      "project3",
      "project4",
      "project5",
      "project6",
      "contact",
    ];
    const els = ids.map((id) =>
      document.querySelector<HTMLElement>(`[data-kb-section="${id}"]`)
    );
    let frame: number | null = null;

    const updateActiveSection = () => {
      frame = null;
      if (navigationTarget.current) return;

      const viewportCenter = window.innerHeight / 2;
      let closest: { id: string; distance: number } | null = null;

      for (const el of els) {
        if (!el) continue;
        const id = el.dataset.kbSection;
        if (!id) continue;

        const rect = el.getBoundingClientRect();
        if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
          setActive(id);
          return;
        }

        const distance = Math.abs((rect.top + rect.bottom) / 2 - viewportCenter);
        if (!closest || distance < closest.distance) closest = { id, distance };
      }

      if (closest) setActive(closest.id);
    };

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveSection);
    };

    const cancelNavigationOnManualScroll = () => {
      navigationTarget.current = null;
      handleScroll();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", cancelNavigationOnManualScroll, { passive: true });
    window.addEventListener("touchstart", cancelNavigationOnManualScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", cancelNavigationOnManualScroll);
      window.removeEventListener("touchstart", cancelNavigationOnManualScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const clearNavigationTarget = () => {
    navigationTarget.current = null;
  };

  const goTo = (id: string, immediate = false) => {
    const target = document.querySelector<HTMLElement>(
      `[data-kb-section="${id}"]`
    );
    if (!target) return;

    clearNavigationTarget();
    navigationTarget.current = id;
    setActive(id);

    const completeNavigation = () => {
      if (navigationTarget.current !== id) return;
      clearNavigationTarget();
      setActive(id);
    };

    if (lenis) {
      lenis.scrollTo(target, {
        immediate,
        duration: immediate ? undefined : 1.1,
        onComplete: completeNavigation,
      });
      return;
    }

    target.scrollIntoView({ behavior: immediate ? "auto" : "smooth", block: "start" });
    window.setTimeout(completeNavigation, immediate ? 0 : 1100);
  };
  useEffect(() => {
    goToRef.current = goTo;
  });

  useEffect(() => {
    const handleSectionNavigation = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      if (typeof id === "string") goToRef.current(id);
    };

    window.addEventListener("section-nav:go-to", handleSectionNavigation);
    return () => window.removeEventListener("section-nav:go-to", handleSectionNavigation);
  }, []);

  const handleMobilePointerDown = (id: string) => {
    pointerNavigation.current = id;
    goTo(id, true);
  };

  const handleMobileClick = (id: string) => {
    if (pointerNavigation.current === id) {
      pointerNavigation.current = null;
      return;
    }
    goTo(id, true);
  };

  return (
    <>
      <nav
        aria-label={t("nav.aria")}
        className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3 pointer-events-auto"
      >
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(s.id, true)}
              data-cursor="hover"
              className="group relative flex items-center gap-3"
              aria-label={s.label}
              aria-current={isActive ? "true" : undefined}
            >
              <span
                className={`text-[10px] uppercase tracking-[0.25em] text-ice-200 transition-all duration-300 ${
                  isActive
                    ? "opacity-100 -translate-x-1"
                    : "opacity-0 translate-x-2 group-hover:opacity-80 group-hover:translate-x-0"
                }`}
              >
                {s.label}
              </span>
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isActive
                    ? "w-2.5 h-2.5 bg-ice-100 shadow-[0_0_12px_rgba(234,242,251,0.6)]"
                    : "w-1.5 h-1.5 bg-ice-500/60 group-hover:bg-ice-200"
                }`}
              />
            </button>
          );
        })}
      </nav>

      <nav className="mobile-section-nav" aria-label={t("nav.aria")}>
        {mobileSections.map((section) => {
          const isActive = section.matches(active);
          return (
            <button
              key={section.id}
              type="button"
              onPointerDown={() => handleMobilePointerDown(section.id)}
              onClick={() => handleMobileClick(section.id)}
              data-cursor="hover"
              className="mobile-section-nav__item"
              aria-current={isActive ? "page" : undefined}
            >
              <span className="mobile-section-nav__icon"><NavIcon name={section.icon} /></span>
              <span className="mobile-section-nav__label">{section.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
