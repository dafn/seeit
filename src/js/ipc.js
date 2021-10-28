exports.initIpcRenderer = (ipc = "remote") => {
  return {
    show: () => ipcRenderer.sendSync(ipc, ["show"]),
    close: () => ipcRenderer.sendSync(ipc, ["close"]),
    center: () => ipcRenderer.sendSync(ipc, ["center"]),
    setSize: (arg) => ipcRenderer.sendSync(ipc, ["setSize", ...arg]),
    setMaximumSize: (arg) =>
      ipcRenderer.sendSync(ipc, ["setMaximumSize", ...arg]),
    maximize: () => ipcRenderer.sendSync(ipc, ["maximize"]),
    isMaximized: () => ipcRenderer.sendSync(ipc, ["isMaximized"]),
    unmaximize: () => ipcRenderer.sendSync(ipc, ["unmaximize"]),
    filepath: () => ipcRenderer.sendSync(ipc, ["filepath"]),
    platform: () => ipcRenderer.sendSync(ipc, ["platform"]),
  };
};
