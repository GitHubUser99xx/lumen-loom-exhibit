import { useT, type Lang } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { lang, setLang } = useT();
  const langs: Lang[] = ["EN", "FA"];

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center gap-3 rounded-full border border-ivory/20 bg-midnight-deep/60 px-4 py-1.5 font-mono text-[11px] backdrop-blur-md"
    >
      {langs.map((l, i) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={
            "transition-colors " +
            (lang === l ? "text-aurora font-medium" : "text-ivory/50 hover:text-ivory")
          }
        >
          <span className={l === "FA" ? "font-arabic" : ""}>
            {l === "FA" ? "فارسی" : "English"}
          </span>
          {i < langs.length - 1 && <span className="ml-3 text-ivory/20">/</span>}
        </button>
      ))}
    </div>
  );
}
