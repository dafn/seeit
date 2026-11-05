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
  dirname: (filePath) => path.dirname(filePath),
  basename: (filePath) => path.basename(filePath),
  extname: (filePath) => path.extname(filePath),
});

contextBridge.exposeInMainWorld("fs", {
  rmSync: (filePath) => fs.rmSync(filePath, { recursive: true, force: true }),
  // One parallel stat pass instead of a statSync per sort comparison.
  // Returns names sorted by mtime, newest first; vanished files sort last.
  listDir: async (dir) => {
    const names = await fs.promises.readdir(dir);
    const entries = await Promise.all(
      names.map(async (name) => {
        try {
          return { name, mtime: (await fs.promises.stat(dir + "/" + name)).mtimeMs };
        } catch {
          return { name, mtime: 0 };
        }
      })
    );
    return entries.sort((a, b) => b.mtime - a.mtime).map((e) => e.name);
  },
});

contextBridge.exposeInMainWorld("pathToFileURL", (filePath) => pathToFileURL(filePath).href);
