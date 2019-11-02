
const path = require('path');

const STORAGE_ACTIVE_LANG = 'active_lang';
const DEFAULT_ACTIVE_LANG = 'English';

let supportedLanguages = [
    {name: 'English', img: 'united_states_small.jpg', fileName: 'english'},
    {name: 'Spanish', img: 'mexican_small.jpg', fileName: 'spanish'}
]

class Language {

    constructor(localPath) {
        this.localPath = localPath;

        this.dictionaries = {};

        // Set Active Language to Default if none has been used so far.
        if (!this.getActiveLang())
            this.setActiveLang(DEFAULT_ACTIVE_LANG);

        this.loadDictionaries(localPath);
    }

    findLangObj(langName) {
        for (let lang of supportedLanguages) {
            if (lang.name === langName) {
                return lang;
            }
        }
        return undefined;
    }

    getSupportedLanguages() {
        return supportedLanguages;
    }

    setActiveLang(langName) {
        localStorage.setItem(STORAGE_ACTIVE_LANG, langName);
    }

    getActiveLang() {
        return localStorage.getItem(STORAGE_ACTIVE_LANG);
    }

    loadDictionaries(localPath) {
        for (let lang of this.getSupportedLanguages()) {
            this.dictionaries[lang.name] = require(path.join(localPath, 'strings', lang.fileName))
        }
    }

    getString(key, langName) {
        const UNKNOWN = '<UNKNOWN>';
        if (!this.findLangObj(langName))
            return UNKNOWN;
        
        let str = this.dictionaries[langName][key] || this.dictionaries[DEFAULT_ACTIVE_LANG][key] || UNKNOWN;
        return str;
    }
}

module.exports = Language;