
// const { ipcRenderer } = require('electron');

// function renderSessions(sessions, language) {
//     let html = '';
//     for (let delegate of delegates) {
//         html += `<tr>` +
//                 `<td><span class="active-mark" enabled data-strname="session_active">Active</span></td>` +
//                 `<td><span class="active-mark" enabled data-strname="session_active">Active</span></td>` +

//                 `</tr>`;
//     }
//     sessionContainer.innerHTML = html;
// }

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
}