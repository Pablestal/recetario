// src/i18n/index.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Importar archivos de traducción
import commonEN from "./locales/en/common_en.json";
import commonES from "./locales/es/common_es.json";
import navigationEN from "./locales/en/navigation_en.json";
import navigationES from "./locales/es/navigation_es.json";
import createRecipeEN from "./locales/en/create-recipe_en.json";
import createRecipeES from "./locales/es/create-recipe_es.json";

// Configuración de recursos de traducción
const resources = {
  en: {
    common: commonEN,
    navigation: navigationEN,
    createRecipe: createRecipeEN,
  },
  es: {
    common: commonES,
    navigation: navigationES,
    createRecipe: createRecipeES,
  },
};

i18n
  // Detectar idioma del navegador
  .use(LanguageDetector)
  // Conectar con React
  .use(initReactI18next)
  // Inicializar i18next
  .init({
    resources,

    // Idioma por defecto si no se detecta ninguno
    fallbackLng: "en",

    // Idiomas disponibles
    supportedLngs: ["en", "es"],

    // Configuración del detector de idioma
    detection: {
      // Orden de detección: localStorage -> navigator -> htmlTag
      order: ["localStorage", "navigator", "htmlTag"],
      // Caché en localStorage
      caches: ["localStorage"],
    },

    // Opciones de interpolación
    interpolation: {
      // React ya escapa por defecto
      escapeValue: false,
    },

    debug: true,

    // Configuración de namespaces (opcional)
    defaultNS: "common",

    ns: ["common", "navigation", "createRecipe"],

    // Configuración de pluralización
    pluralSeparator: "_",
    contextSeparator: "_",

    // Fallback entre namespaces
    fallbackNS: "common",
  });

export default i18n;
