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
  const GEO_API_URL = 'https://api.ipquery.io/';
  const GEO_TIMEOUT = 5000; // 5 seconds

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
          // Handle ipquery.io response format
          const countryCode = data.location?.country_code || data.country_code || data.country?.country_code;
          console.log('IP Query Response:', data);
          console.log('Country Code:', countryCode);
          const detectedLang = COUNTRY_TO_LANG[countryCode] || DEFAULT_LANG;
          console.log('Detected Language:', detectedLang);
          resolve(detectedLang);
        })
        .catch((err) => {
          clearTimeout(timeoutId);
          console.warn('Geo API error, falling back to English:', err);
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
   * Get Play Store badge URL for current language
   */
  function getPlayStoreBadgeUrl(lang) {
    const badges = {
      en: "https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png",
      ja: "https://play.google.com/intl/ja_jp/badges/static/images/badges/ja_badge_web_generic.png",
      vi: "https://play.google.com/intl/vi_vn/badges/static/images/badges/vi_badge_web_generic.png",
      zh: "https://play.google.com/intl/zh_cn/badges/static/images/badges/zh_badge_web_generic.png",
      ko: "https://play.google.com/intl/ko_kr/badges/static/images/badges/ko_badge_web_generic.png",
      id: "https://play.google.com/intl/id_id/badges/static/images/badges/id_badge_web_generic.png"
    };
    return badges[lang] || badges['en'];
  }

  /**
   * Apply translations to the page
   */
  function applyTranslations() {
    console.log('Applying translations for language:', currentLang);
    
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
          // Special handling for Play Store badge - update src based on language
          if (element.alt === 'Get it on Google Play' || element.classList.contains('playstore-badge')) {
            element.src = getPlayStoreBadgeUrl(currentLang);
          }
          element.alt = value;
        } else {
          element.innerHTML = value;
        }
      }
    });

    // Update Play Store link images specifically
    document.querySelectorAll('.playStore img, img[src*="play.google.com"]').forEach(img => {
      img.src = getPlayStoreBadgeUrl(currentLang);
    });

    // Update all kutt.it links to kutt.to
    document.querySelectorAll('a[href*="kutt.it"]').forEach(link => {
      link.href = link.href.replace('kutt.it', 'kutt.to');
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
    
    console.log('Translations applied successfully');
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
