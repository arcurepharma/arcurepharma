"use client";

import { useLanguageStore } from "@/store/language";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguageStore();

  return (
    <div className="relative">
      <button
        onClick={() => setLanguage(language === "en" ? "ur" : "en")}
        className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors"
        aria-label="Switch language"
      >
        <Globe className="w-4 h-4" />
        <span>{language === "en" ? "EN" : "اردو"}</span>
      </button>
    </div>
  );
}
