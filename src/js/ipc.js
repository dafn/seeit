exports.initIpcMain = (ipc, window, env) => {
  ipc.on("show", (event, arg) => {
    window.show();
    event.returnValue = null;
  });

  ipc.on("center", (event) => {
    window.center();
    event.returnValue = null;
  });

  ipc.on("setSize", (event, arg) => {
    window.setSize(...arg);
    event.returnValue = null;
  });

  ipc.on("setMaximumSize", (event, arg) => {
    window.setMaximumSize(...arg);
    event.returnValue = null;
  });

  ipc.on("close", (event) => {
    window.close();
    event.returnValue = null;
  });

  ipc.on("isMaximized", (event) => {
    window.isMaximized();
    event.returnValue = null;
  });

  ipc.on("maximize", (event) => {
    window.maximize();
    event.returnValue = null;
  });

  ipc.on("unmaximize", (event) => {
    window.unmaximize();
    event.returnValue = null;
  });

  ipc.on("filepath", (event) => {
    event.returnValue = env.filepath;
    // "/Users/dafn/MEGA/Photos/Daniels Bilder/OtherCelebs/7b77da8eb689ba6fd17ebd8a4c1183b4.jpg";
  });

  ipc.on("platform", (event) => {
    event.returnValue = env.platform; // "darwin";
  });
};

exports.initIpcRenderer = () => {
  return {
    show: () => ipcRenderer.sendSync("show", "show"),
    close: () => ipcRenderer.sendSync("close", "close"),
    center: () => ipcRenderer.sendSync("center", "center"),
    setSize: (arg) => ipcRenderer.sendSync("setSize", arg),
    setMaximumSize: (arg) => ipcRenderer.sendSync("setMaximumSize", arg),
    maximize: () => ipcRenderer.sendSync("maximize", "maximize"),
    isMaximized: () => ipcRenderer.sendSync("isMaximized", "isMaximized"),
    unmaximize: () => ipcRenderer.sendSync("unmaximize", "unmaximize"),
    filepath: () => ipcRenderer.sendSync("filepath", "filepath"),
    platform: () => ipcRenderer.sendSync("platform", "platform"),
  };
};
