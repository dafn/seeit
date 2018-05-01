const { app, BrowserWindow } = require('electron'),
	{ INDEX } = require('./src/js/constants'),
	path = require('path');

let windows = [],
	win32_win

createWindow = () => {

	// global.sharedObj = { filepath: process.argv[INDEX], platform: process.platform }

	if (process.platform == 'win32') {
		global.sharedObj = { filepath: process.argv[INDEX], platform: process.platform }

		win32_win = new BrowserWindow({
			minWidth: 128, minHeight: 128, autoHideMenuBar: true, titleBarStyle: 'hidden',
			darkTheme: true, backgroundColor: '#21252B', show: false
		})

		win32_win.loadURL(`file://${__dirname}/src/view/index.html`)
		win32_win.on('closed', () => win = null)
	} else {

		let win = new BrowserWindow({
			minWidth: 128, minHeight: 128, autoHideMenuBar: true, titleBarStyle: 'hidden',
			darkTheme: true, backgroundColor: '#21252B', show: false
		})

		win.loadURL(`file://${__dirname}/src/view/index.html`)
		win.on('closed', () => win = null)

		// win.webContents.openDevTools();
		windows.push(win)
	}

}

app.on('ready', createWindow)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => process.platform == 'win32' ? createWindow() : !!windows.length && createWindow())

app.on('will-finish-launching', () => {
	app.on('open-file', (event, path) => {
		event.preventDefault()
		global.sharedObj = { filepath: path, platform: process.platform }
		process.platform == 'win32' ? createWindow() : !!windows.length && createWindow()
	})
})
