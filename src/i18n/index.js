import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import commonEN from "./locales/en/common_en.json";
import commonES from "./locales/es/common_es.json";
import navigationEN from "./locales/en/navigation_en.json";
import navigationES from "./locales/es/navigation_es.json";
import createRecipeEN from "./locales/en/create-recipe_en.json";
import createRecipeES from "./locales/es/create-recipe_es.json";
import recipeListEN from "./locales/en/recipe-list_en.json";
import recipeListES from "./locales/es/recipe-list_es.json";

// Configure translation resources
const resources = {
  en: {
    common: commonEN,
    navigation: navigationEN,
    createRecipe: createRecipeEN,
    recipeList: recipeListEN,
  },
  es: {
    common: commonES,
    navigation: navigationES,
    createRecipe: createRecipeES,
    recipeList: recipeListES,
  },
};

i18n
  // Use browser language detector
  .use(LanguageDetector)
  // Connect to React
  .use(initReactI18next)
  // Init i18next
  .init({
    resources,

    // Default language
    fallbackLng: "en",

    // Available languages
    supportedLngs: ["en", "es"],

    // Language detection options
    detection: {
      // Detection order: localStorage -> navigator -> htmlTag
      order: ["localStorage", "navigator", "htmlTag"],
      // LocalStorage cache key
      caches: ["localStorage"],
    },

    // Interpolation options
    interpolation: {
      // React escape values by default
      escapeValue: false,
    },

    debug: false,

    // Namespace configuration (optional)
    defaultNS: "common",

    ns: ["common", "navigation", "createRecipe"],

    // Pluralization options
    pluralSeparator: "_",
    contextSeparator: "_",

    // Fallback namespace
    fallbackNS: "common",
  });

export default i18n;
