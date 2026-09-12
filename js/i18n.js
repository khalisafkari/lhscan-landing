/**
 * i18n - Internationalization Module
 * Auto language detection based on IP geolocation
 * Supports: en, ja, vi, zh, ko, id
 */

(function() {
  'use strict';

  // Supported languages and country mappings
  const COUNTRY_TO_LANG = {
    'JP': 'ja',  // Japan
    'VN': 'vi',  // Vietnam
    'CN': 'zh',  // China
    'KR': 'ko',  // South Korea
    'ID': 'id'   // Indonesia
  };

  const DEFAULT_LANG = 'en';
  const SUPPORTED_LANGS = ['en', 'ja', 'vi', 'zh', 'ko', 'id'];
  const STORAGE_KEY = 'lovehug_language';
  const GEO_API_URL = 'https://ipapi.co/json/';
  const GEO_TIMEOUT = 3000; // 3 seconds

  let translations = {};
  let currentLang = DEFAULT_LANG;

  /**
   * Get language from localStorage
   */
  function getStoredLanguage() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  /**
   * Save language to localStorage
   */
  function saveLanguage(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Could not save language to localStorage');
    }
  }

  /**
   * Detect language from IP geolocation
   */
  function detectLanguageFromIP() {
    return new Promise((resolve) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), GEO_TIMEOUT);

      fetch(GEO_API_URL, { 
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      })
        .then(response => {
          clearTimeout(timeoutId);
          if (!response.ok) throw new Error('Geo API failed');
          return response.json();
        })
        .then(data => {
          const countryCode = data.country_code;
          const detectedLang = COUNTRY_TO_LANG[countryCode] || DEFAULT_LANG;
          resolve(detectedLang);
        })
        .catch(() => {
          clearTimeout(timeoutId);
          resolve(DEFAULT_LANG);
        });
    });
  }

  /**
   * Load translations for a specific language
   */
  async function loadTranslations(lang) {
    try {
      const response = await fetch(`lang/${lang}.json`);
      if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
      return await response.json();
    } catch (e) {
      console.error(`Error loading translations for ${lang}:`, e);
      // Fallback to English if translation file fails
      if (lang !== DEFAULT_LANG) {
        return loadTranslations(DEFAULT_LANG);
      }
      return {};
    }
  }

  /**
   * Apply translations to the page
   */
  function applyTranslations() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const keys = key.split('.');
      let value = translations;
      
      for (const k of keys) {
        value = value?.[k];
      }

      if (value !== undefined && value !== null) {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.value = value;
        } else if (element.tagName === 'IMG') {
          element.alt = value;
        } else {
          element.innerHTML = value;
        }
      }
    });

    // Update meta tags
    const titleEl = document.querySelector('title');
    if (titleEl && translations['meta.title']) {
      titleEl.textContent = translations['meta.title'];
    }

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && translations['meta.description']) {
      metaDesc.setAttribute('content', translations['meta.description']);
    }

    // Update html lang attribute
    document.documentElement.lang = currentLang;
  }

  /**
   * Initialize language system
   */
  async function initLanguage() {
    // Check for manually selected language first
    let lang = getStoredLanguage();

    if (!lang || !SUPPORTED_LANGS.includes(lang)) {
      // Auto-detect from IP
      lang = await detectLanguageFromIP();
      saveLanguage(lang);
    }

    currentLang = lang;
    translations = await loadTranslations(lang);
    
    // Update language selector if it exists
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
      langSelect.value = currentLang;
    }

    applyTranslations();
  }

  /**
   * Change language manually
   */
  window.changeLanguage = function(lang) {
    if (SUPPORTED_LANGS.includes(lang)) {
      currentLang = lang;
      saveLanguage(lang);
      loadTranslations(lang).then(t => {
        translations = t;
        applyTranslations();
      });
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguage);
  } else {
    initLanguage();
  }
})();
