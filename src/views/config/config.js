
// const { ipcRenderer } = require('electron');
// const { dialog } = require('electron').remote;
// const fs = require('fs');

// const Language = require('../../languages');
// const language = new Language(__dirname);



// // GET COMPONENTS
//     // Navigation Control
//     let backBtnEl = document.querySelector('#back-btn');

//     // Config Security Locking
//     let lockInputEl = document.querySelector('#lock-input');
//     let lockBtnEl = document.querySelector('#lock-btn');

//     // Language Selection
//     let languageContEl = document.querySelector('#language-container');

//     // Delegates Loading
//     let loadDelegatesBtn = document.querySelector('#load-delegates-btn');
//     let delegatesContainer = document.querySelector('#delegates-container');

//     // Sessions
//     let sessionNameInputEl = document.querySelector('#session-add-name-input');
//     let sessionFormatInputEl = document.querySelector('#session-add-format-input');
//     let sessionAddBtnEl = document.querySelector('#session-add-btn');
//     let sessionContainer = document.querySelector('#session-container');


// // DEFINE DATA FORMAT

//     const delegates = [];

//     const sessions = [];

// // RENDER
//     renderView(language);

//     renderLanguages(language.getSupportedLanguages(), language);
//     renderDelegates(delegates, language);
//     renderSessions(sessions, language);

// // BIND LISTENERS
    

// // // LOAD DATA
//     // // Delegates
//     // loadPrevDelegates(language);
//     // // Sessions
//     // loadPrevSessions();



// // Finds Titles and Strings and Replaces them with Language String
// function renderView(lang) {
//     let keyEls = Array.from(document.querySelectorAll('[data-strname]'));
//     for (let el of keyEls) {
//         let key = el.dataset['strname'];
//         el.innerHTML = lang.getString(key, lang.getActiveLang());
//     }
// }


// function renderLanguages(languagesList, language) {
//     let html = '';
//     for (let lang of languagesList) {
//         html += `<div class="col-2 language labeled-img" id="${lang.name}" onclick="onLangClick(this.id)">` +
//                 `<img src="../common/assets/${lang.img}" alt="">` +
//                 `<span>${lang.name}</span>` +
//                 `</div>` 
//     }
//     languageContEl.innerHTML = html;
// }

// function renderDelegates(delegates, language) {
//     let html = '';
//     for (let delegate of delegates) {
//         html += `<div class="col-2 labeled-img">` +
//                 `<img src="${delegate.path}" alt="${delegate.name}">` +
//                 `<span class="delegate-name">${delegate.name}</span>` +
//                 `</div>`;
//     }
//     delegatesContainer.innerHTML = html;
// }

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


// // Listeneres
// function onLangClick(langName) {
//     console.log(`Language: ${langName}`)
//     language.setActiveLang(langName);


//     // UPDATE EVERY COMPONENT
//     renderView(language);
// }

















// let delegates = [];









// function bindListeners() {
//     let backBtnEl = document.querySelector("#back-btn");
//     backBtnEl.addEventListener("click", () => {
//         console.log("Send GotTo(menu)")
//         ipcRenderer.send('goto-view', 'menu');
//     });

//     let loadDelegatesBtn = document.querySelector('#load-delegates-btn');
//     loadDelegatesBtn.addEventListener('click', () => {
//         let directory = dialog.showOpenDialogSync({
//             title: 'Select Delegates Directory',
//             properties: ['openDirectory']
//         });
//         directory = directory[0];
//         if (directory) {
//             // Load Directory Flags and Update
//             fs.readdir(directory, (err, files) => {
//                 if (err) {
//                     console.err('Unexpected Error Ocurred While Reading Folder!');
//                     console.err(err);
//                     return;
//                 }

//                 for (let file of files) {
//                     console.log(file)
//                     delegates.push({
//                         name: file,
//                         path: (directory+'\\'+file)
//                     });

//                     // PUT DELEGATE NAME IN DELEGATES CONTAINER
//                     // SET DELEGATE IMG SRC TO PATH
//                 }
//                 renderDelegates(delegates);
//             })
//         } else {
//             // Do Nothing, User Cancelled
//         }
//         console.log(directory);
//     });
// }

// function renderDelegates(delegates) {
//     let delegatesContainer = document.querySelector('#delegates-container');
//     let html = '';
//     for (let delegate of delegates) {
//         html += `<div class="col-2 labeled-img">` +
//                 `<img src="${delegate.path}" alt="${delegate.name}">` +
//                 `<span class="delegate-name">${delegate.name}</span>` +
//                 `</div>`;
//     }
//     delegatesContainer.innerHTML = html;
// }

// let languageContEl = document.querySelector('#language-container');

// let html = '';
// for (let lang of language.getSupportedLanguages()) {
//     html += `<div class="col-2 language labeled-img" id="${lang.name}" onclick="onLangClick(this.id)">` +
//             `<img src="../common/assets/${lang.img}" alt="">` +
//             `<span>${lang.name}</span>` +
//             `</div>` 
// }
// languageContEl.innerHTML = html;

// function onLangClick(langName) {
//     console.log(`Language: ${langName}`)
//     language.setActiveLang(langName);
// }


// bindListeners();

// console.log(language.getString('languages_title', 'Spanish'));














const storage  = require('../../storage');
const Language = require('../../languages');
const language = new Language(__dirname);

const LanguageComponent = require('./components').LanguageComponent;
// const DelegatesComponent = require('./components').DelegatesComponent;
// const SessionsComponent = require('./components').LanguageComponent;
const LockComponent     = require('./components').LockComponent;


let lockCont, langCont, delegCont, sessionCont;

function init() {
    let locked = storage.getObj('menu-lock', false);

    lockCont    = new LockComponent('#lock-component', locked, language)
    langCont    = new LanguageComponent('#language-component', locked, language);
    // delegCont   = new DelegatesComponent('#delegates-component', locked, language);
    // sessionCont = new SessionsComponent('#sessions-component', locked, language);

    // Bind Listeners
    lockCont.setOnLockChange((locked) => {
        console.log('YEY');
        
        lockCont.setLocked(locked);
        langCont.setLocked(locked);
        // delegCont.setLocked(locked);
        // sessionCont.setLocked(locked);
    });

    
    langCont.setOnLangChange((lang) => {
        lockCont.setLang(lang);
        langCont.setLang(lang);
    //     delegCont.setLang(lang);
    //     sessionCont.setLang(lang);
    });
}




























