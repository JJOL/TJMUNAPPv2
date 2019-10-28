
const { ipcRenderer } = require('electron');

function bindListeners() {
    let backBtnEl = document.querySelector("#back-btn");
    backBtnEl.addEventListener("click", () => {
        console.log("Send GotTo(menu)")
        ipcRenderer.send('goto-view', 'menu');
    });
}

bindListeners();