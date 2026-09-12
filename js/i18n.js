/**
 * i18n - Internationalization Module
 * Auto language detection based on IP geolocation using ipquery.io
 * Supports: en, ja, vi, zh, ko, id
 */

(function() {
  'use strict';

  const COUNTRY_TO_LANG = {
    'JP': 'ja',
    'VN': 'vi',
    'CN': 'zh',
    'KR': 'ko',
    'ID': 'id'
  };

  const DEFAULT_LANG = 'en';
  const SUPPORTED_LANGS = ['en', 'ja', 'vi', 'zh', 'ko', 'id'];
  const STORAGE_KEY = 'lovehug_language';
  const GEO_API_URL = 'https://api.ipquery.io/?format=json';
  const GEO_TIMEOUT = 5000;

  let translations = {};
  let currentLang = DEFAULT_LANG;

  // Play Store badge URLs for each language
  const PLAYSTORE_BADGES = {
    en: "https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png",
    ja: "../assets/images/jp.png",
    vi: "../assets/images/vn.png",
    zh: "../assets/images/cn.png",
    ko: "..assets/images/kr.png",
    id: "../assets/images/id.png"
  };

  function getStoredLanguage() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function saveLanguage(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Could not save language to localStorage');
    }
  }

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
          const countryCode = data.location?.country_code || data.country_code || data.country?.country_code;
          console.log('[i18n] Country Code:', countryCode);
          const detectedLang = COUNTRY_TO_LANG[countryCode] || DEFAULT_LANG;
          console.log('[i18n] Detected Language:', detectedLang);
          resolve(detectedLang);
        })
        .catch((err) => {
          clearTimeout(timeoutId);
          console.warn('[i18n] Geo API error, falling back to English:', err);
          resolve(DEFAULT_LANG);
        });
    });
  }

  async function loadTranslations(lang) {
    try {
      const response = await fetch('lang/' + lang + '.json');
      if (!response.ok) throw new Error('Failed to load ' + lang + '.json');
      return await response.json();
    } catch (e) {
      console.error('[i18n] Error loading translations for ' + lang + ':', e);
      if (lang !== DEFAULT_LANG) {
        return loadTranslations(DEFAULT_LANG);
      }
      return {};
    }
  }

  function getPlayStoreBadgeUrl(lang) {
    return PLAYSTORE_BADGES[lang] || PLAYSTORE_BADGES.en;
  }

  function applyTranslations() {
    console.log('[i18n] Applying translations for:', currentLang);
    console.log('[i18n] Translations keys:', Object.keys(translations));
    
    // Apply text translations
    document.querySelectorAll('[data-i18n]').forEach(function(element) {
      var key = element.getAttribute('data-i18n');
      var value = translations[key];
      
      if (value !== undefined && value !== null && value !== '') {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.value = value;
        } else if (element.tagName === 'IMG' && element.id === 'playstore-img') {
          // Update Play Store badge
          element.src = getPlayStoreBadgeUrl(currentLang);
          element.alt = value;
        } else {
          element.innerHTML = value;
        }
      } else {
        console.warn('[i18n] No translation found for key:', key);
      }
    });

    // Always update Play Store badge if it exists
    var playstoreImg = document.getElementById('playstore-img');
    if (playstoreImg) {
      playstoreImg.src = getPlayStoreBadgeUrl(currentLang);
    }

    // Fix any kutt.it links
    document.querySelectorAll('a[href*="kutt.it"]').forEach(function(link) {
      link.href = link.href.replace('kutt.it', 'kutt.to');
    });

    // Update title
    var titleEl = document.querySelector('title');
    if (titleEl && translations['meta.title']) {
      titleEl.textContent = translations['meta.title'];
    }

    // Update meta description
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && translations['meta.description']) {
      metaDesc.setAttribute('content', translations['meta.description']);
    }

    // Update html lang attribute
    document.documentElement.lang = currentLang;
    console.log('[i18n] Translations applied successfully');
  }

  async function initLanguage() {
    var lang = getStoredLanguage();
    console.log('[i18n] Stored language:', lang);

    if (!lang || SUPPORTED_LANGS.indexOf(lang) === -1) {
      console.log('[i18n] Detecting from IP...');
      lang = await detectLanguageFromIP();
      saveLanguage(lang);
    }

    currentLang = lang;
    translations = await loadTranslations(lang);
    console.log('[i18n] Loaded translations for:', currentLang);
    
    var langSelect = document.getElementById('lang-select');
    if (langSelect) {
      langSelect.value = currentLang;
    }

    applyTranslations();
  }

  window.changeLanguage = function(lang) {
    console.log('[i18n] Manual change to:', lang);
    if (SUPPORTED_LANGS.indexOf(lang) !== -1) {
      currentLang = lang;
      saveLanguage(lang);
      loadTranslations(lang).then(function(t) {
        translations = t;
        applyTranslations();
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguage);
  } else {
    initLanguage();
  }
})();
