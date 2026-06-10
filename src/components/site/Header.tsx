import { useState } from "react";
import { useT } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const { t } = useT();
    const navItems = [
    { href: "#exhibition", label: t("nav.exhibitions") },
    { href: "#hall", label: t("nav.hall") },
    { href: "#artists", label: t("nav.artists") },
    { href: "#contact", label: t("nav.contact") },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-b-3xl border border-ivory/10 bg-midnight/75 px-6 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur-2xl md:px-12">
        <a href="#top" className="flex items-baseline gap-3">
          <span className="font-display text-2xl tracking-[0.2em] text-ivory">LUMEN</span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-ivory-soft/60 sm:block">
            hall
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-3 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex items-center justify-center rounded-full px-5 py-3 text-[12px] uppercase tracking-[0.24em] bg-sky-500 text-ivory shadow-sm transition-colors duration-200 hover:bg-purple-600 active:bg-purple-700"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((s) => !s)}
            className="inline-flex items-center justify-center rounded-full p-2 md:hidden bg-midnight/20 text-ivory"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <LanguageSwitcher />
        </div>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen && (
      <div className="md:hidden fixed inset-x-4 top-18 z-50 rounded-2xl bg-midnight/95 p-4 shadow-lg">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-4 py-3 text-sm uppercase tracking-[0.2em] text-ivory hover:bg-midnight-deep"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

