const { app, BrowserWindow } = require('electron'),
	path = require('path'),
	url = require('url'),
	sizeOf = require('image-size');

let win;

createWindow = () => {
	
	sizeOf(process.argv[2], (err, dimensions) => {
		win = new BrowserWindow({
			minWidth: 700, minHeight: 800, width: dimensions ? dimensions.width : 700, height: dimensions ? dimensions.height : 800,
			autoHideMenuBar: true, titleBarStyle: 'hidden', darkTheme: true, backgroundColor: '#21252B', center: true, show: false
		})

		win.loadURL(url.format({
			pathname: path.join(__dirname, './src/view/index.html'),
			protocol: 'file:',
			slashes: true
		}))

		win.on('closed', () => {
			win = null;
		})
	});
	
	// win.webContents.openDevTools();
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
	app.quit();
})

app.on('activate', () => {
	if (win === null) {
		createWindow();
	}
})

