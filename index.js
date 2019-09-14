const { app, BrowserWindow } = require('electron'),
	{ INDEX } = require('./src/js/constants')

let windows = []

createWindow = () => {

	if (process.platform == 'win32') {
		global.sharedObj = { filepath: process.argv[INDEX], platform: process.platform }

		let win32_win = new BrowserWindow({
			minWidth: 128, minHeight: 128, autoHideMenuBar: true, frame: false,
			darkTheme: true, backgroundColor: '#21252B', show: process.env.NODE_ENV === 'development',
			webPreferences: { nodeIntegration: true }
		})

		win32_win.loadURL(`file://${__dirname}/src/view/index.html`)
		win32_win.on('closed', () => win = null)

		process.env.NODE_ENV === 'development' &&
			win32_win.webContents.openDevTools()

	} else {

		if (process.env.NODE_ENV === 'development')
			global.sharedObj = { filepath: process.argv[INDEX], platform: process.platform }

		let win = new BrowserWindow({
			minWidth: 128, minHeight: 128, autoHideMenuBar: true, titleBarStyle: 'hidden',
			darkTheme: true, backgroundColor: '#21252B', show: process.env.NODE_ENV === 'development',
			webPreferences: { nodeIntegration: true }
		})

		win.loadURL(`file://${__dirname}/src/view/index.html`)
		win.on('closed', () => win = null)

		process.env.NODE_ENV === 'development' &&
			win.webContents.openDevTools()

		windows.push(win)
	}
}

process.platform == 'darwin' &&
	app.on('will-finish-launching', () => {
		app.on('open-file', (event, path) => {
			event.preventDefault()
			global.sharedObj = { filepath: path, platform: 'darwin' }
			app.isReady() && createWindow()
		})
	})

app.on('ready', createWindow)
app.on('window-all-closed', app.quit)
