export const getTranslationLanguage = (): string => {
  if (typeof window === "undefined") return "english";

  const languageCode = (
    window.navigator.language.split("-")[0] || "en"
  ).toLowerCase();

  const languageMap: Record<string, string> = {
    ar: "arabic",
    bn: "bengali",
    de: "german",
    en: "english",
    es: "spanish",
    fr: "french",
    hi: "hindi",
    it: "italian",
    ja: "japanese",
    ko: "korean",
    mr: "marathi",
    pa: "punjabi",
    pt: "portuguese",
    ru: "russian",
    ta: "tamil",
    te: "telugu",
    ur: "urdu",
    zh: "chinese",
  };

  return languageMap[languageCode] || "english";
};
