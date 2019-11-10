/*
 * translateStaticElements(container, language)
 * finds every child element of container with data tag 'data-strname' and
 * replaces its innerHTML content with according language strname string.
*/
function translateStaticElements(container, language) {
    let keyEls = Array.from(container.querySelectorAll('[data-strname]'));
    for (let el of keyEls) {
        let key = el.dataset['strname'];
        el.innerHTML = language.getString(key, language.getActiveLang());
    }
}

class SessionsComponent {
    
}

class DelegatesComponent {

}

class LanguageComponent {
    constructor(elId, locked, language) {
        this.container = document.querySelector(elId);
        this.languagesContainer = this.container.querySelector('#language-container');

        this.language = language;
        this.fn = null;

        this.allLangs = this.language.getSupportedLanguages();

        this.render(locked, language);
    }

    render(locked, lang) {

        translateStaticElements(this.container, this.language);

        this.renderLanguages(this.allLangs, locked);
    }

    renderLanguages(languageList, locked) {
        // Clear View and Render
        this.languagesContainer.innerHTML = "";

        for (let lang of languageList) {
            let langEl = document.createElement('div');
            langEl.classList.add('col-2', 'language', 'labeled-img');
            langEl.id = lang.name;
            if (locked)
                langEl.setAttribute('disabled', true);
            langEl.addEventListener('click', () => {
                if (!locked)
                    this.onLanguageClick(langEl.id);
            })
            langEl.innerHTML = `<img src="../common/assets/${lang.img}" alt="">` +
                               `<span>${lang.name}</span>`;

            this.languagesContainer.appendChild(langEl);
        }
    }

    onLanguageClick(lang) {
        console.log(lang);
        this.language.setActiveLang(lang);
        
        if (this.fn)
            this.fn(lang);
    }

    setLocked(locked) {
        this.render(locked, this.language.getActiveLang());
    }

    setLang(lang) {
        this.render(this.locked, this.language.getActiveLang());
    }

    setOnLangChange(fn) {
        this.fn = fn;
    }
}

class LockComponent {
    constructor(elId, locked, language) {
        this.container = document.querySelector(elId);
        this.inputEl   = this.container.querySelector('#lock-input');
        this.btnEl     = this.container.querySelector('#lock-btn');
        this.locked = locked;
        this.language = language;

        this.fn = null;


        this.btnEl.addEventListener('click', () => {
            this.onLockBtnClick();
        });

        this.inputEl.addEventListener('keypress', (ev) => {
            if (ev.key == 'Enter')
                this.onLockBtnClick();
        })

        this.render(locked, language.getActiveLang())
    }

    render(locked, lang) {
        const language = this.language;

        translateStaticElements(this.container, language);

        if (locked) {
            this.btnEl.innerHTML = language.getString('lock_unlock_btn', lang);
        } else {
            this.btnEl.innerHTML = language.getString('lock_lock_btn', lang);
        }
    }

    onLockBtnClick() {
        const password  = this.inputEl.value;
        this.inputEl.value = '';

        // Check Correct Password to Unlock, otherwise save password
        if (this.locked) {
            const savedPass = storage.get('config-pass');

            if (password !== savedPass) {
                return;
            }
        } else {
            storage.set('config-pass', password);
        }
        
        // Trigger Lock
        this.locked = !this.locked;

        storage.setObj('menu-lock', this.locked);
        if (this.fn)
            this.fn(this.locked);
    }

    setOnLockChange(fn) {
        this.fn = fn;
    }

    setLocked(locked) {
        this.render(locked, this.language.getActiveLang());
    }

    setLang(lang) {
        this.render(this.locked, this.language.getActiveLang());
    }


}



module.exports.LockComponent = LockComponent;
module.exports.LanguageComponent = LanguageComponent;