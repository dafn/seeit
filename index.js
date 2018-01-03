const { app, BrowserWindow } = require('electron'),
	{ INDEX } = require('./src/js/constants'),
	path = require('path');

let windows = []

createWindow = () => {

	process.platform == 'win32' && (
		global.sharedObj = { filepath: process.argv[INDEX], platform: process.platform }
	)

	// global.sharedObj = { filepath: process.argv[INDEX], platform: process.platform }

	let win = new BrowserWindow({
		minWidth: 128, minHeight: 128, autoHideMenuBar: true, titleBarStyle: 'hidden',
		darkTheme: true, backgroundColor: '#21252B', show: true
	})

	win.loadURL(`file://${__dirname}/src/view/index.html`)
	win.on('closed', () => win = null)

	// win.webContents.openDevTools();
	windows.push(win)
}

app.on('ready', createWindow)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => !!windows.length && createWindow())

app.on('will-finish-launching', () => {
	app.on('open-file', (event, path) => {
		event.preventDefault()
		global.sharedObj = { filepath: path, platform: process.platform }
		!!windows.length && createWindow()
	})
})
