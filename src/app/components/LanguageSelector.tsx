import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "az", label: "Azərbaycan", flag: "/images/flags/az.png" },
  { code: "en", label: "English", flag: "/images/flags/en.png" },
  { code: "ru", label: "Русский", flag: "/images/flags/ru.png" },
];

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(
    localStorage.getItem("lang") || "en"
  );
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const handleLanguageChange = (lng: string) => setCurrentLang(lng);
    i18n.on("languageChanged", handleLanguageChange);
    return () => i18n.off("languageChanged", handleLanguageChange);
  }, [i18n]);

  const current = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative select-none">
      <button
        onClick={() => setOpen((o) => !o)}
        className="
          relative flex-shrink-0
          p-2 sm:p-3
          rounded-full
        "
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <img
          src={current.flag}
          alt={current.label}
          className="
            w-8 h-8
            sm:w-10 sm:h-10
            lg:w-12 lg:h-12
            rounded-full border
          "
        />
      </button>


      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-[#222] rounded-xl p-6 w-full max-w-xs relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
              aria-label="Bağla"
            >
              ×
            </button>

            <h2 className="text-white text-lg font-bold mb-6 text-center">
              {t("languageSelector.selectLanguage")}
            </h2>

            <div className="flex flex-col gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white font-medium transition
                    ${
                      currentLang === lang.code
                        ? "bg-gray-700"
                        : "hover:bg-gray-800"
                    }
                  `}
                >
                  <img
                    src={lang.flag}
                    alt={lang.label}
                    className="w-7 h-7 rounded-full border"
                  />
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
