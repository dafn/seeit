// The renderer runs with nodeIntegration: false and contextIsolation: true,
// so page scripts have no Node.js access. This preload script runs in an
// isolated context before the page loads and is the only bridge between the
// page and the OS: it exposes just these functions on window (via
// contextBridge) and nothing else. Anything not listed here is unreachable
// from the renderer.
const { contextBridge, ipcRenderer } = require("electron");
const path = require("path");
const fs = require("fs");
const { pathToFileURL } = require("url");

contextBridge.exposeInMainWorld("seeit", {
  remote: (command, ...args) => ipcRenderer.sendSync("remote", [command, ...args]),
});

contextBridge.exposeInMainWorld("path", {
  dirname: (p) => path.dirname(p),
  basename: (p) => path.basename(p),
  extname: (p) => path.extname(p),
});

contextBridge.exposeInMainWorld("fs", {
  readdir: (p, cb) => fs.readdir(p, cb),
  rmSync: (p) => fs.rmSync(p, { recursive: true, force: true }),
  mtime: (p) => fs.statSync(p).mtime.getTime(),
});

contextBridge.exposeInMainWorld("pathToFileURL", (p) => pathToFileURL(p).href);
