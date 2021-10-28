const fs = require("fs");

exports.initIpcMain = (ipc, window, env) => {
  ipc.on(`${env.nr}`, (event, arg) => {
    const [command, ...args] = arg;

    // console.log(event.sender.id)

    // fs.writeFileSync(
    //   "/Users/dafn/Desktop/seeit.txt",
    //   `senderId: ${event.sender.id} env: ${JSON.stringify(env)}`
    // );

    switch (command) {
      case "filepath":
        event.returnValue = env.filepath;
        break;
      case "platform":
        event.returnValue = env.platform;
        break;
      default:
        window[command](...args);
        event.returnValue = null;
        break;
    }
  });

  // ipc.on("getNumber", (event) => {
  //   event.returnValue = env.nr;
  // });

  /*
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
  });

  ipc.on("platform", (event) => {
    event.returnValue = env.platform;
  });
  */
};

exports.initIpcRenderer = (nr = 1) => {
  return {
    show: () => ipcRenderer.sendSync(`${nr}`, ["show"]),
    close: () => ipcRenderer.sendSync(`${nr}`, ["close"]),
    center: () => ipcRenderer.sendSync(`${nr}`, ["center"]),
    setSize: (arg) => ipcRenderer.sendSync(`${nr}`, ["setSize", ...arg]),
    setMaximumSize: (arg) =>
      ipcRenderer.sendSync(`${nr}`, ["setMaximumSize", ...arg]),
    maximize: () => ipcRenderer.sendSync(`${nr}`, ["maximize"]),
    isMaximized: () => ipcRenderer.sendSync(`${nr}`, ["isMaximized"]),
    unmaximize: () => ipcRenderer.sendSync(`${nr}`, ["unmaximize"]),
    filepath: () => ipcRenderer.sendSync(`${nr}`, ["filepath"]),
    platform: () => ipcRenderer.sendSync(`${nr}`, ["platform"]),
  };
};

// exports.getNr = () => ipcRenderer.sendSync("getNumber");

// exports.initIpcRenderer = () => {
//   return {
//     show: () => ipcRenderer.sendSync("show", "show"),
//     close: () => ipcRenderer.sendSync("close", "close"),
//     center: () => ipcRenderer.sendSync("center", "center"),
//     setSize: (arg) => ipcRenderer.sendSync("setSize", arg),
//     setMaximumSize: (arg) => ipcRenderer.sendSync("setMaximumSize", arg),
//     maximize: () => ipcRenderer.sendSync("maximize", "maximize"),
//     isMaximized: () => ipcRenderer.sendSync("isMaximized", "isMaximized"),
//     unmaximize: () => ipcRenderer.sendSync("unmaximize", "unmaximize"),
//     filepath: () => ipcRenderer.sendSync("filepath", "filepath"),
//     platform: () => ipcRenderer.sendSync("platform", "platform"),
//   };
// };
