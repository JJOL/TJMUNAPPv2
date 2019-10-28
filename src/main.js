const electron = require('electron');

const {app, BrowserWindow} = electron;


let win;
function createWindow() {
    win = new BrowserWindow({
        title: 'TJMUNv2',
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile('views/menu/index.html');

    // Open DevTools
    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    });

}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
})