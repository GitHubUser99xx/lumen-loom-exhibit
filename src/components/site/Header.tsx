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

        <LanguageSwitcher />
      </div>
    </header>
  );
}

