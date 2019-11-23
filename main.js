const electron = require('electron');

const {app, BrowserWindow} = electron;


let win;
function createWindow() {
    win = new BrowserWindow({
        title: 'TJMUNv2',
        width: 800,
        height: 600,
        icon: './views/common/assets/itj.ico',
        webPreferences: {
            nodeIntegration: true
            // allowRunningInsecureContent: false
        }
    });

    
    win.loadFile(`./views/menu/index.html`);
    // window.loadURL(url.format({
    //     pathname: path.join(__dirname, 'dist/index.html'), // important
    //     protocol: 'file:',
    //     slashes: true,
    //     // baseUrl: 'dist'
    //   }));

    // Open DevTools
    // win.webContents.openDevTools();

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


// IPC EVENTS
const { ipcMain } = electron;

// View Transition
ipcMain.on('goto-view', (event, viewArg) => {
    console.log(`Receiving Event goto-view(${viewArg})`);

    win.loadFile(`./views/${viewArg}/index.html`);
})


require('./languages')