// CodeVerse Language Manager - Multilingual Support

class LanguageManager {
  constructor() {
    this.currentLanguage = 'en'; // Default English
    this.translations = {};
    this.supportedLanguages = {
      'en': { name: 'English', flag: '🇬🇧', nativeName: 'English' },
      'hi': { name: 'Hindi', flag: '🇮🇳', nativeName: 'हिंदी' },
      'ta': { name: 'Tamil', flag: '🇮🇳', nativeName: 'தமிழ்' },
      'te': { name: 'Telugu', flag: '🇮🇳', nativeName: 'తెలుగు' },
      'ml': { name: 'Malayalam', flag: '🇮🇳', nativeName: 'മലയാളം' }
    };
  }

  async initialize() {
    // Load translations
    await this.loadTranslations();
    
    // Get user's saved language preference
    const savedLang = await this.getSavedLanguage();
    if (savedLang) {
      this.currentLanguage = savedLang;
    } else {
      // Detect browser language
      this.currentLanguage = this.detectBrowserLanguage();
    }
    
    // Apply language
    this.applyLanguage(this.currentLanguage);
  }

  async loadTranslations() {
    try {
      const response = await fetch('data/translations.json');
      this.translations = await response.json();
    } catch (error) {
      console.error('Error loading translations:', error);
      this.translations = this.getDefaultTranslations();
    }
  }

  detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0];
    
    if (this.supportedLanguages[langCode]) {
      return langCode;
    }
    
    return 'en';
  }

  async getSavedLanguage() {
    if (!window.currentUserId) return null;
    
    try {
      const dbRef = window.firebaseRef(window.database, `users/${window.currentUserId}/preferences/language`);
      const snapshot = await window.firebaseGet(dbRef);
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error('Error getting saved language:', error);
      return null;
    }
  }

  async saveLanguage(langCode) {
    if (!window.currentUserId) return;
    
    try {
      await window.firebaseSet(
        window.firebaseRef(window.database, `users/${window.currentUserId}/preferences/language`),
        langCode
      );
    } catch (error) {
      console.error('Error saving language:', error);
    }
  }

  async setLanguage(langCode) {
    if (!this.supportedLanguages[langCode]) {
      console.error('Unsupported language:', langCode);
      return;
    }
    
    this.currentLanguage = langCode;
    await this.saveLanguage(langCode);
    this.applyLanguage(langCode);
    
    // Notify Tuto about language change
    if (window.tutoAI) {
      window.tutoAI.onLanguageChange(langCode);
    }
  }

  applyLanguage(langCode) {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.translate(key);
      
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translation;
      } else {
        element.textContent = translation;
      }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = langCode;
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: langCode } }));
  }

  translate(key, params = {}) {
    const keys = key.split('.');
    let translation = this.translations[this.currentLanguage];
    
    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        // Fallback to English
        translation = this.translations['en'];
        for (const k2 of keys) {
          if (translation && translation[k2]) {
            translation = translation[k2];
          } else {
            return key; // Return key if not found
          }
        }
        break;
      }
    }
    
    // Replace parameters
    if (typeof translation === 'string') {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param]);
      });
    }
    
    return translation;
  }

  t(key, params = {}) {
    return this.translate(key, params);
  }

  showLanguageSelector() {
    const modal = document.createElement('div');
    modal.className = 'language-selector-modal';
    modal.innerHTML = `
      <div class="language-selector-container">
        <h2>${this.translate('language.select_language')}</h2>
        <p class="language-subtitle">${this.translate('language.choose_preferred')}</p>
        <div class="language-grid">
          ${Object.entries(this.supportedLanguages).map(([code, lang]) => `
            <div class="language-option ${code === this.currentLanguage ? 'selected' : ''}" 
                 onclick="languageManager.selectLanguage('${code}')">
              <div class="language-flag">${lang.flag}</div>
              <div class="language-name">${lang.nativeName}</div>
              <div class="language-english">${lang.name}</div>
            </div>
          `).join('')}
        </div>
        <button class="btn-primary" onclick="languageManager.closeLanguageSelector()">
          ${this.translate('common.continue')}
        </button>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  selectLanguage(langCode) {
    // Update UI
    document.querySelectorAll('.language-option').forEach(option => {
      option.classList.remove('selected');
    });
    // If called from an onclick attribute, try to use the global event if available
    let targetEl = null;
    try {
      targetEl = (typeof event !== 'undefined' && event && event.target) ? event.target.closest('.language-option') : null;
    } catch (e) {
      targetEl = null;
    }

    if (targetEl) targetEl.classList.add('selected');

    // Set language
    this.setLanguage(langCode);
  }

  closeLanguageSelector() {
    const modal = document.querySelector('.language-selector-modal');
    if (modal) {
      modal.remove();
    }
  }

  getDefaultTranslations() {
    return {
      'en': {
        'common': {
          'continue': 'Continue',
          'back': 'Back',
          'next': 'Next',
          'submit': 'Submit',
          'cancel': 'Cancel',
          'save': 'Save',
          'loading': 'Loading...'
        },
        'language': {
          'select_language': 'Select Your Language',
          'choose_preferred': 'Choose your preferred language for learning'
        },
        'welcome': {
          'title': 'Welcome to CodeVerse!',
          'subtitle': 'Your journey to master Computer Science begins here'
        }
      }
    };
  }
}

// Global instance
window.languageManager = new LanguageManager();
