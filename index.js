const { app, BrowserWindow, ipcMain, nativeTheme } = require("electron");
const path = require("path");
const { pathToFileURL } = require("url");

const { INDEX } = require("./src/js/constants");

let windows = [];
global.seeit = {};

nativeTheme.themeSource = "dark";

const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  app.quit();
}

app.on("second-instance", (event, argv) => {
  if (!gotSingleInstanceLock) {
    return;
  }
  global.seeit.filepath = argv[INDEX] ?? null;
  createWindow();
});

const createWindow = () => {
  if (process.platform == "win32" || process.env.NODE_ENV === "development") {
    global.seeit.filepath = process.argv[INDEX] ?? null;
  }

  let window = new BrowserWindow({
    minWidth: 128,
    minHeight: 128,
    autoHideMenuBar: true,
    frame: process.platform != "win32",
    titleBarStyle: process.platform == "win32" ? "default" : "hidden",
    backgroundColor: "#21252B",
    show: process.env.NODE_ENV === "development",
    webPreferences: {
      preload: path.join(__dirname, "src/js/preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  window.loadURL(pathToFileURL(path.join(__dirname, "src/view/index.html")).href);

  windows.push(window);
};

let opened = false;

if (process.platform == "darwin" && process.env.NODE_ENV !== "development") {
  app.on("will-finish-launching", () => {
    app.on("open-file", (event, path) => {
      event.preventDefault();
      opened = true;
      app.whenReady().then(() => {
        global.seeit.filepath = path;
        createWindow();
      });
    });
  });
  app.on("ready", () => {
    if (!opened && gotSingleInstanceLock) {
      createWindow();
    }
  });
} else {
  app.on("ready", () => {
    if (gotSingleInstanceLock) {
      createWindow();
    }
  });
}

app.on("window-all-closed", app.quit);

const ALLOWED_COMMANDS = [
  "show",
  "close",
  "minimize",
  "maximize",
  "unmaximize",
  "isMaximized",
  "center",
  "setSize",
  "setMaximumSize",
];

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
      event.returnValue =
        ALLOWED_COMMANDS.includes(command) && typeof window[command] === "function"
          ? window[command](...args) ?? null
          : null;
      break;
  }
});
