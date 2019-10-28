


const { ipcRenderer } = require('electron');


function bindListeners() {
    let resumeBtnEl = document.querySelector("#resume-btn");

    resumeBtnEl.addEventListener("click", () => {
        //TODO: Go to Present Committee View
    });


    let configBtnEl = document.querySelector('#config-btn');
    configBtnEl.addEventListener('click', () => {
        console.log("Sending Event GoTo")
        ipcRenderer.send('goto-view', 'config');
    });
}


bindListeners();