class TranslationManager {
    constructor() {
        this.currentLang = 'ca';
        this.translations = {};
    }

    async loadTranslations(lang) {
        try {
            const response = await fetch(`./js/translations/${lang}.json`);

            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                return;
            }

            this.translations[lang] = await response.json();

            // Verify if loaded
        } catch (error) {
            console.error('Error loading translations', error);
        }
    }

    async changeLang(lang) {
        if (!this.translations[lang]) {
            await this.loadTranslations(lang);
        }
        this.currentLang = lang;
        this.updatePageContent();
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