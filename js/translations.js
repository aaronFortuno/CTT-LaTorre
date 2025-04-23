class TranslationManager {
    constructor() {
        this.currentLang = 'ca';
        this.translations = {};
    }

    async loadTranslations(lang) {
        const response = await fetch(`./js/translations/${lang}.json`);

        if (!response.ok) {
            throw new Error(`Failed to load translations for ${lang}. Status: ${response.status}`);
        }

        this.translations[lang] = await response.json();
        // Verify if loaded
    }

    async changeLang(lang) {
        try {
            if (!this.translations[lang]) {
                await this.loadTranslations(lang);
            }
            this.currentLang = lang;
            this.updatePageContent();
        } catch (error) {
            console.error('Error changing language:', error);
                // TODO show message to user
            throw error;
        }
    }

    getText(key) {
        const keys = key.split('.');
        let text = this.translations[this.currentLang];

        for (const k of keys) {
            text = text?.[k];
        }

        if (!text) {
            console.warn(`Translation for: ${key} not found`);
        }

        return text || key;
    }

    updatePageContent() {
        const elements = document.querySelectorAll('[data-i18n]');

        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.getText(key);
        });
    }
}

// Create global instance
window.translator = new TranslationManager();

// Init when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Starts with Catalan
    await translator.changeLang('ca');
});