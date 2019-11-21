const { ipcRenderer } = require('electron');

const storage  = require('../../storage');
const Language = require('../../languages');
const language = new Language(__dirname);

const LanguageComponent = require('./components').LanguageComponent;
const DelegatesComponent = require('./components').DelegatesComponent;
const SessionsComponent = require('./components').SessionsComponent;
const LockComponent     = require('./components').LockComponent;


let lockCont, langCont, delegCont, sessionCont;

function init() {
    let locked = storage.getObj('menu-lock', false);

    lockCont    = new LockComponent('#lock-component', locked, language)
    langCont    = new LanguageComponent('#language-component', locked, language);
    delegCont   = new DelegatesComponent('#delegates-component', locked, language);
    sessionCont = new SessionsComponent('#sessions-component', locked, language);
    let backBtn = document.getElementById('back-btn');

    // Bind Listeners
    lockCont.setOnLockChange((locked) => {
        lockCont.setLocked(locked);
        langCont.setLocked(locked);
        delegCont.setLocked(locked);
        sessionCont.setLocked(locked);
    });
    
    langCont.setOnLangChange((lang) => {
        lockCont.setLang(lang);
        langCont.setLang(lang);
        delegCont.setLang(lang);
        sessionCont.setLang(lang);
    });

    backBtn.addEventListener('click', () => {
        ipcRenderer.send('goto-view', 'menu');
    });
}