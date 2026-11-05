const initIpcRenderer = () => ({
  show: () => seeit.remote("show"),
  close: () => seeit.remote("close"),
  center: () => seeit.remote("center"),
  setSize: (arg) => seeit.remote("setSize", ...arg),
  setMaximumSize: (arg) => seeit.remote("setMaximumSize", ...arg),
  minimize: () => seeit.remote("minimize"),
  maximize: () => seeit.remote("maximize"),
  isMaximized: () => seeit.remote("isMaximized"),
  unmaximize: () => seeit.remote("unmaximize"),
  filepath: () => seeit.remote("filepath"),
  platform: () => seeit.remote("platform"),
});
