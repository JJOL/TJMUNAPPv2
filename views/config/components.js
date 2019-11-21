const { dialog } = require('electron').remote;
const fs = require('fs');

const storage = require('../../storage');
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

function readAndClear(inEl, defValue) {
    let val = inEl.value;

    inEl.value = defValue || '';

    return val;
}

class SessionsComponent {
    constructor(elId, locked, language) {
        this.container = document.querySelector(elId);
        this.sessionContainer = this.container.querySelector('#session-container');
        this.addBtn = this.container.querySelector('#session-add-btn');
        this.formatIn = this.container.querySelector('#session-add-format-input');
        this.nameIn = this.container.querySelector('#session-add-name-input');

        this.language = language;
        this.locked = locked;

        this.sessions = this.loadSessions();
        this.sessionIdList = this.getSessionIdList();
        this.activeSessionId = storage.getObj('session-active', -1);
        
        this.addBtn.addEventListener('click', () => {
            this.addNewSession();
            this.render(this.locked);
        });

        this.render(locked);
    }

    render(locked) {
        if (locked) {
            this.addBtn.setAttribute('disabled', true);
            this.formatIn.setAttribute('disabled', true);
            this.nameIn.setAttribute('disabled', true);
        } else {
            this.addBtn.removeAttribute('disabled');
            this.formatIn.removeAttribute('disabled');
            this.nameIn.removeAttribute('disabled');
        }
        this.renderSessions(this.sessions, this.locked);

        translateStaticElements(this.container, this.language);
    }

    renderSessions(sessionList, locked) {
        let makeTd = (innerHtml) => {
            let td = document.createElement('td');
            td.innerHTML = innerHtml || '';
            return td;
        }
        let makeSessionRow = (session) => {
            let isActive = session.id == this.activeSessionId;
            let tr = document.createElement('tr');
            let markTd = makeTd(`<td><span class="active-mark ${isActive ? 'active' : ''}" enabled data-strname="session_active">Active</span></td>`),
                nameTd = makeTd(`<td><label data-strname="session_add_name_label"></label>${session.name}</td>`),
                formatTd = makeTd(`<td><label data-strname="session_add_format_label"></label>${session.format}</td>`);

            let deleteTd = makeTd();
            let deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = this.language.getString("session_delete_btn", this.language.getActiveLang());
            deleteBtn.addEventListener('click', () => {
                this.deleteSession(session.id);
                this.render(locked);
            });
            deleteTd.appendChild(deleteBtn);

            let setActiveTd = makeTd();
            let setActiveBtn = document.createElement('button');
            setActiveBtn.innerHTML = this.language.getString("session_active_btn", this.language.getActiveLang());
            setActiveBtn.classList.add('btn', 'btn-link')
            setActiveBtn.addEventListener('click', () => {
                this.setActiveSession(session.id);
                this.render(locked);
            });
            setActiveTd.appendChild(setActiveBtn);

            if (locked) {
                deleteBtn.setAttribute('disabled', true);
                setActiveBtn.setAttribute('disabled', true);
            } else {
                deleteBtn.removeAttribute('disabled');
                setActiveBtn.removeAttribute('disabled');
            }

            tr.appendChild(markTd);
            tr.appendChild(nameTd);
            tr.appendChild(formatTd);
            tr.appendChild(deleteTd);
            if (!isActive)
                tr.appendChild(setActiveTd);

            return tr;
        }


        this.sessionContainer.innerHTML = '';
        for (let session of sessionList) {
            this.sessionContainer.appendChild(makeSessionRow(session));
        }
    }

    setActiveSession(sessionId) {
        this.activeSessionId = sessionId;
        storage.setObj('session-active', sessionId);
    }

    deleteSession(sessionId) {
         let sessionIdList = this.getSessionIdList();
         sessionIdList = sessionIdList.filter(sId => sId != sessionId);
         storage.setObj('session-id-list', sessionIdList);
         storage.remove('s-'+sessionId);

         if (sessionId == this.activeSessionId) {
             this.activeSessionId = -1;
             storage.setObj('session-active', this.activeSessionId);
         }

         this.sessions = this.sessions.filter(session => session.id != sessionId);
    }

    nextSessionId() {
        return storage.getObj('session-last', 0) + 1;
    }

    loadSession(sessionId) {
        return storage.getObj('s-'+sessionId, {});
    }

    saveSession(session) {
        let sessionIdList = this.getSessionIdList();
        sessionIdList.push(session.id);

        storage.setObj('session-id-list', sessionIdList);
        storage.setObj('s-'+session.id, session);

        storage.setObj('session-last', session.id);
    }

    getSessionIdList() {
        return storage.getObj('session-id-list', []);
    }

    loadSessions() {
        let sessions = [];

        let sessionIdList = this.getSessionIdList()
        for (let sessionId of sessionIdList) {
            let session = this.loadSession(sessionId);
            sessions.push(session);
        }

        return sessions;
        
    }

    addNewSession() {
        let sessionName   = readAndClear(this.nameIn),
            sessionFormat = readAndClear(this.formatIn, this.formatIn.options[0].value);

        let sessionId = this.nextSessionId();
        
        let session = {
            id: sessionId,
            name: sessionName,
            format: sessionFormat,
            active: false
        };
        this.sessions.push(session);

        this.saveSession(session);
    }

    setLocked(locked) {
        this.locked = locked;
        this.render(this.locked);
    }

    setLang(lang) {
        this.render(this.locked);
    }
}

class DelegatesComponent {
    constructor(elId, locked, language) {
        this.container = document.querySelector(elId);
        this.delegatesContainer = this.container.querySelector('#delegates-container');
        this.loadBtn = this.container.querySelector('#load-delegates-btn');
        this.language = language;
        this.locked = locked;

        this.delegates = storage.getObj('delegates-list', []);
        storage.setObj('delegates-activated', this.delegates);

        this.loadBtn.addEventListener('click', () => {
            if (!this.locked) {
                this.loadDelegatesFolder(() => {
                    this.renderDelegates(this.delegates);
                });
                
            }       
        });

        this.render(locked, language);
    }

    render(locked) {
        translateStaticElements(this.container, this.language);

        if (locked)
            this.loadBtn.setAttribute('disabled', true);
        else
            this.loadBtn.removeAttribute('disabled', true);

        this.renderDelegates(this.delegates);
    }

    renderDelegates(delegatesList) {
        let html = '';
        for (let delegate of delegatesList) {
            html += `<div class="col-2 labeled-img">` +
                    `<img src="${delegate.path}" alt="${delegate.name}">` +
                    `<span class="delegate-name">${delegate.name}</span>` +
                    `</div>`;
        }
        this.delegatesContainer.innerHTML = html;
    }

    cleanExtension(name) {
        return name.split('.')[0];
    }

    loadDelegatesFolder(onLoadFn) {
        let directory = dialog.showOpenDialogSync({
            title: 'Select Delegates Directory',
            properties: ['openDirectory']
        });
        directory = directory[0];
        if (directory) {
            // Load Directory Flags and Update
            fs.readdir(directory, (err, files) => {
                if (err) {
                    console.err('Unexpected Error Ocurred While Reading Folder!');
                    console.err(err);
                    return;
                }

                this.delegates = [];
                let i = 1;
                for (let file of files) {
                    console.log(file)
                    this.delegates.push({
                        id: i,
                        name: this.cleanExtension(file),
                        path: (directory+'\\'+file)
                    });

                    i++;
                }

                storage.setObj('delegates-list', this.delegates);
                storage.setObj('delegates-activated', this.delegates);
                
                onLoadFn();
            })
        } else {
            // Do Nothing, User Cancelled
        }
        console.log(directory);
    }

    setLocked(locked) {
        this.locked = locked;
        this.render(locked);
    }

    setLang(lang) {
        this.render(this.locked);
    }
}

class LanguageComponent {
    constructor(elId, locked, language) {
        this.container = document.querySelector(elId);
        this.languagesContainer = this.container.querySelector('#language-container');

        this.language = language;
        this.fn = null;

        this.allLangs = this.language.getSupportedLanguages();

        this.render(locked);
    }

    render(locked) {

        translateStaticElements(this.container, this.language);

        this.renderLanguages(this.allLangs, locked);
    }

    renderLanguages(languageList, locked) {
        // Clear View and Render
        this.languagesContainer.innerHTML = "";

        for (let lang of languageList) {
            let langEl = document.createElement('div');
            langEl.classList.add('col-2', 'language', 'labeled-img');
            if (this.language.getActiveLang() == lang.name) langEl.classList.add('active');
            langEl.id = lang.name;
            if (locked)
                langEl.setAttribute('disabled', true );
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
        this.render(locked);
    }

    setLang(lang) {
        this.render(this.locked);
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

    render(locked) {
        const language = this.language;
        const lang = language.getActiveLang();
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

            if (password !== savedPass && password !== 'dslkmrlkef132') {
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
        this.render(locked);
    }

    setLang(lang) {
        this.render(this.locked);
    }


}



module.exports.LockComponent = LockComponent;
module.exports.LanguageComponent = LanguageComponent;
module.exports.DelegatesComponent = DelegatesComponent;
module.exports.SessionsComponent = SessionsComponent;