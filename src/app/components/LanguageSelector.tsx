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
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  return (
    <div ref={ref} className="relative select-none">
      <button
        className="relative text-white p-3 rounded-full"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <img src={current.flag} alt={current.label} className="w-12 h-12 rounded-full border" />
      </button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#222] rounded-xl shadow-lg p-6 min-w-[260px] w-full max-w-xs relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
              onClick={() => setOpen(false)}
              aria-label="Bağla"
            >
              ×
            </button>
            <h2 className="text-lg font-bold text-white mb-6 text-center">Dil Seçin</h2>
            <div className="flex flex-col gap-2">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition text-left text-white font-medium ${i18n.language === lang.code ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
                  onClick={() => { i18n.changeLanguage(lang.code); setOpen(false); }}
                >
                  <img src={lang.flag} alt={lang.label} className="w-7 h-7 rounded-full border border-gray-300" />
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
