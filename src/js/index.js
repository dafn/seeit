const { initIpcRenderer } = require("../js/ipc");

const win = initIpcRenderer();
const sharedObj = {
  filepath: win.filepath(),
  platform: win.platform(),
};

const path = require("path");
const fs = require("fs");
const helper = require("../js/helpers");
const { pathToFileURL } = require("url");
const { ALL_VIDEO_TYPES: TYPES_VIDEO } = require("../js/constants");

const img = document.getElementById("image");
const vid = document.getElementById("video");
const title = document.getElementById("title");
const label = document.getElementById("label");
const dirname = path.dirname(sharedObj.filepath) + "/";
const transform = helper.transform();

let first = true;
let file = path.basename(sharedObj.filepath);

if (sharedObj.platform == "win32") {
  const titlebarButtons = document.getElementById("win-titlebar-btns"),
    titlebar = document.getElementById("titlebar");

  titlebarButtons.style.visibility = "visible";
  titlebarButtons.innerHTML = `
			<button id="min-btn" class="windows_toolbar_buttons">-</button>
			<button id="max-btn" class="windows_toolbar_buttons">+</button>
			<button id="close-btn" class="windows_toolbar_buttons">x</button>
		`;

  titlebar.classList.add("win");

  document
    .getElementById("close-btn")
    .addEventListener("click", (e) => win.close());
  document
    .getElementById("min-btn")
    .addEventListener("click", (e) => win.minimize());
  document
    .getElementById("max-btn")
    .addEventListener("click", (e) =>
      win.isMaximized() ? win.unmaximize() : win.maximize()
    );
}

if (TYPES_VIDEO.indexOf(path.extname(file).toLowerCase()) !== -1) {
  title.innerText = file;
  label.innerText = file;

  vid.src = pathToFileURL(dirname + file).href;
  vid.style.visibility = "visible";
  vid.style.zIndex = "1";

  vid.onloadeddata = () => {
    if (first) {
      first = false;

      size = helper.setWindowSize({
        wi: vid.videoWidth,
        hi: vid.videoHeight,
        ws: window.screen.availWidth,
        hs: window.screen.availHeight,
      });

      win.setSize([size.w | 0, size.h | 0]);
      win.setMaximumSize([window.screen.availWidth, window.screen.availHeight]);
      win.center();

      transform.reset();

      win.show();
    }
  };
} else {
  title.innerText = file;
  label.innerText = file;

  img.src = pathToFileURL(dirname + file).href;
  img.style.visibility = "visible";

  img.onload = () => {
    if (first) {
      first = false;

      size = helper.setWindowSize({
        wi: img.naturalWidth,
        hi: img.naturalHeight,
        ws: window.screen.availWidth,
        hs: window.screen.availHeight,
      });

      win.setSize([size.w | 0, size.h | 0]);
      win.setMaximumSize([window.screen.availWidth, window.screen.availHeight]);
      win.center();

      transform.reset();

      win.show();
    }
  };

  img.onerror = (e) => {
    alert(`Error opening file: \n\n${dirname}${file}`);
    // win.close();
  };
}

document.ondragover = (e) => e.preventDefault();
document.ondrop = (e) => e.preventDefault();
document.onmousewheel = (e) =>
  e.wheelDelta > 0 ? transform.up() : transform.down();

img.onmousedown = (e) => e.which === 1 && helper.move(e);
vid.onmousedown = (e) => e.which === 1 && helper.move(e);

fs.readdir(path.dirname(sharedObj.filepath), (err, content) => {
  content.sort(
    (a, b) =>
      fs.statSync(dirname + "/" + b).mtime.getTime() -
      fs.statSync(dirname + "/" + a).mtime.getTime()
  );

  const files = helper.iterator(content, content.indexOf(file));

  title.innerText = file;

  document.onkeydown = (e) => {
    switch (e.code) {
      case "KeyD":
        return transform.rotate(1);
      case "ArrowRight":
        return (file = helper.iterate(files, path, dirname, transform, 1));
      case "KeyA":
        return transform.rotate(-1);
      case "ArrowLeft":
        return (file = helper.iterate(files, path, dirname, transform, -1));
      case "KeyW":
      case "ArrowUp":
        return transform.up();
      case "KeyS":
      case "ArrowDown":
        return transform.down();
      case "Backspace":
      case "Delete":
        files.remove(`${dirname}${file}`);
        return (file = helper.iterate(files, path, dirname, transform, 1));
      case "Space":
        return label.style.opacity === "1"
          ? (label.style.opacity = "0")
          : (label.style.opacity = "1");
      case "Tab":
        e.preventDefault();
        return win.isMaximized() ? win.unmaximize() : win.maximize();
      case "Escape":
        return win.close();
      default:
        return;
    }
  };

  document.onmousedown = ({ button }) => {
    switch (button) {
      case 4:
        return (file = helper.iterate(files, path, dirname, transform, -1));
      case 5:
        return (file = helper.iterate(files, path, dirname, transform, 1));
    }
  };
});
