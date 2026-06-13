import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { supabase } from "@/integrations/supabase/client";

export function Header() {
  const { t } = useT();
  const { data: me } = useCurrentUser();
  const navItems = [
    { href: "#exhibition", label: t("nav.exhibitions") },
    { href: "#hall", label: t("nav.hall") },
    { href: "#artists", label: t("nav.artists") },
    { href: "#contact", label: t("nav.contact") },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const roles = me?.roles ?? [];
  const isArtist = roles.includes("artist") || roles.includes("admin");
  const isCurator = roles.includes("curator") || roles.includes("admin");
  const isAdmin = roles.includes("admin");

  async function signOut() {
    await supabase.auth.signOut();
    setUserOpen(false);
    window.location.reload();
  }

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

        <div className="flex items-center gap-3">
          {/* User menu */}
          {me ? (
            <div className="relative">
              <button
                onClick={() => setUserOpen((s) => !s)}
                className="inline-flex items-center gap-2 rounded-full border border-ivory/20 bg-midnight/40 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ivory hover:bg-midnight/60"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-sky-500 text-[10px]">
                  {(me.displayName ?? me.email ?? "?").slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden sm:inline">{me.displayName ?? me.email}</span>
              </button>
              {userOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-ivory/10 bg-midnight/95 p-2 shadow-xl">
                  {isArtist && (
                    <Link to="/studio" onClick={() => setUserOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-ivory hover:bg-midnight-deep">
                      Artist studio
                    </Link>
                  )}
                  {isCurator && (
                    <Link to="/curator" onClick={() => setUserOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-ivory hover:bg-midnight-deep">
                      Curator
                    </Link>
                  )}
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setUserOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-ivory hover:bg-midnight-deep">
                      Admin
                    </Link>
                  )}
                  {!isArtist && !isCurator && !isAdmin && (
                    <p className="px-3 py-2 text-xs text-ivory-soft/60">
                      Ask an administrator for artist access.
                    </p>
                  )}
                  <div className="my-1 h-px bg-ivory/10" />
                  <button onClick={signOut} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-ivory hover:bg-midnight-deep">
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="hidden md:inline-flex items-center justify-center rounded-full border border-ivory/20 bg-midnight/40 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ivory hover:bg-midnight/60"
            >
              Sign in
            </Link>
          )}

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
            {!me && (
              <Link to="/auth" onClick={() => setMobileOpen(false)} className="block rounded-lg px-4 py-3 text-sm uppercase tracking-[0.2em] text-ivory hover:bg-midnight-deep">
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
