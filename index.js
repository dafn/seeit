const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

let win

function createWindow() {
    win = new BrowserWindow({ width: 800, height: 600, autoHideMenuBar: true, titleBarStyle: 'hidden', darkTheme: true, backgroundColor: '#21252B'})

    win.loadURL(url.format({
        pathname: path.join(__dirname, './src/view/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    win.on('closed', () => {
        win = null
    })

    // win.webContents.openDevTools();
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
    app.quit();
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

global.sharedObject = {prop1: process.argv}

