const electron = require('electron'),
	{ app, BrowserWindow } = electron,
	{ INDEX } = require('./src/js/constants'),
	path = require('path'),
	url = require('url'),
	sizeOf = require('image-size');

let win;

createWindow = () => {

	if (process.platform == 'win32') {
		global.sharedObj = { filepath: process.argv[INDEX], platform: process.platform };
	}

	// global.sharedObj = { filepath: process.argv[INDEX], platform: process.platform };

	sizeOf(global.sharedObj.filepath, (err, dimensions) => {

		const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize,
			size = getSize({
				wi: dimensions ? dimensions.width : 700, hi: dimensions ? dimensions.height : 500,
				ws: width, hs: height
			});

		win = new BrowserWindow({
			minWidth: 300, minHeight: 400, width: parseInt(size.w), height: parseInt(size.h),
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
app.on('will-finish-launching', () => {
	app.releaseSingleInstance();
	app.on('open-file', (event, path) => {
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

const getSize = dim => {
	if (dim.ws > dim.wi && dim.hs > dim.hi) {
		return { w: dim.wi, h: dim.hi }
	}

	return (dim.wi / dim.hi) < (dim.ws / dim.hs) ?
		{ w: dim.wi * dim.hs / dim.hi, h: dim.hs } :
		{ w: dim.ws, h: dim.hi * dim.ws / dim.wi }
}