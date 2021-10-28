const { app, BrowserWindow, ipcMain } = require("electron");
const { INDEX } = require("./src/js/constants");

let windows = [];
global.seeit = {};

createWindow = (env) => {
  if (process.platform == "win32" || process.env.NODE_ENV === "development") {
    global.seeit.filepath = process.argv[INDEX];
  }

  let window = new BrowserWindow({
    minWidth: 128,
    minHeight: 128,
    autoHideMenuBar: true,
    frame: !process.platform == "win32",
    titleBarStyle: process.platform == "win32" ? "default" : "hidden",
    darkTheme: true,
    backgroundColor: "#21252B",
    show: process.env.NODE_ENV === "development",
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });

  window.loadURL(`file://${__dirname}/src/view/index.html`);

  process.env.NODE_ENV === "development" && window.webContents.openDevTools();

  windows.push(window);
};

if (process.platform == "darwin" && process.env.NODE_ENV !== "development") {
  app.on("will-finish-launching", () => {
    app.on("open-file", (event, path) => {
      event.preventDefault();
      app.whenReady().then(() => {
        global.seeit.filepath = path;
        createWindow();
      });
    });
  });
} else {
  app.on("ready", createWindow);
}

app.on("window-all-closed", app.quit);

ipcMain.on(`remote`, (event, arg) => {
  const [command, ...args] = arg;
  const window = windows.find(
    (window) => !window.isDestroyed() && window.id === event.sender.id
  );

  switch (command) {
    case "filepath":
      event.returnValue = global.seeit.filepath;
      break;
    case "platform":
      event.returnValue = process.platform;
      break;
    default:
      window[command](...args);
      event.returnValue = null;
      break;
  }
});
