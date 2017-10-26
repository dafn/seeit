const { app, BrowserWindow } = require('electron'),
	{ index } = require('./src/js/constants'),
	path = require('path'),
	url = require('url'),
	sizeOf = require('image-size');

let win;

createWindow = () => {
	
	if (process.platform == 'win32') {
		global.sharedObj = { filepath: process.argv[index], platform: process.platform };
	}

	sizeOf(global.sharedObj.filepath, (err, dimensions) => {
		win = new BrowserWindow({
			minWidth: 100, minHeight: 200, width: dimensions ? dimensions.width : 700, height: dimensions ? dimensions.height : 800,
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

app.on('ready', createWindow);
app.on('will-finish-launching', function () {
	app.on('open-file', function (event, path) {
		event.preventDefault();
		global.sharedObj = { filepath: path, platform: process.platform };
	});
});

app.on('window-all-closed', () => {
	app.quit();
})

app.on('activate', () => {
	if (win === null) {
		createWindow();
	}
})

app.releaseSingleInstance();
