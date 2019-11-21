


const { ipcRenderer } = require('electron');
const Language = require('../../languages');
// const language = new Language(__dirname);

let configBtnEl, resumeBtnEl;

function init() {
    configBtnEl = document.querySelector('#config-btn');
    resumeBtnEl = new ResumeButton('#resume-btn');

    configBtnEl.addEventListener('click', () => {
        console.log("Sending Event GoTo")
        ipcRenderer.send('goto-view', 'config');
    });
}


const storage = require('../../storage');

class ResumeButton {
    constructor(elemId) {
        this.container = document.querySelector(elemId);
        this.activeSessionId = storage.getObj('session-active', -1);

        this.session = storage.getObj('s-'+this.activeSessionId, { name: 'Unknown Error' });

        if (this.activeSessionId == -1) {
            this.container.setAttribute('disabled', true);
            this.container.innerHTML = 'No Selected Active Session';
        } else {
            this.container.innerHTML = 'Resume: ' + this.session.name;
        }

        this.container.addEventListener('click', () => {
            this.gotoSession();
        });
    }

    gotoSession() {
        let format = this.session.format.toLowerCase();
        ipcRenderer.send('goto-view', format);
    }
}