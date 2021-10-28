const { app, BrowserWindow, ipcMain } = require("electron");
const { initIpcMain } = require("./src/js/ipc");
const { INDEX } = require("./src/js/constants");

let windows = [];

createWindow = (env) => {
  if (process.platform == "win32") {
    env = {
      filepath: process.argv[INDEX],
      platform: process.platform,
    };

    let window = new BrowserWindow({
      minWidth: 128,
      minHeight: 128,
      autoHideMenuBar: true,
      frame: false,
      darkTheme: true,
      backgroundColor: "#21252B",
      show: process.env.NODE_ENV === "development",
      webPreferences: { nodeIntegration: true, contextIsolation: false },
    });

    window.loadURL(`file://${__dirname}/src/view/index.html`);
    window.on("closed", () => (win = null));

    process.env.NODE_ENV === "development" && window.webContents.openDevTools();

    initIpcMain(ipcMain, window, env);
  } else {
    if (process.env.NODE_ENV === "development") {
      env = {
        filepath: process.argv[INDEX],
        platform: process.platform,
      };
    }

    let window = new BrowserWindow({
      minWidth: 128,
      minHeight: 128,
      autoHideMenuBar: true,
      titleBarStyle: "hidden",
      darkTheme: true,
      backgroundColor: "#21252B",
      show: process.env.NODE_ENV === "development",
      webPreferences: { nodeIntegration: true, contextIsolation: false },
    });

    window.loadURL(`file://${__dirname}/src/view/index.html`);
    window.on("closed", () => (window = null));

    process.env.NODE_ENV === "development" && window.webContents.openDevTools();

    windows.push(window);

    initIpcMain(ipcMain, window, env);
  }
};

if (process.platform == "darwin") {
  app.on("will-finish-launching", () => {
    app.on("open-file", (event, path) => {
      event.preventDefault();
      app.whenReady().then(() => {
        createWindow({ filepath: path, platform: "darwin" });
      });
    });
  });
} else {
  app.on("ready", createWindow);
}

app.on("window-all-closed", app.quit);
