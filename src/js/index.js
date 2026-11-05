const win = initIpcRenderer();
const sharedObj = {
  filepath: win.filepath(),
  platform: win.platform(),
};

const imageEl = document.getElementById("image");
const videoEl = document.getElementById("video");
const title = document.getElementById("title");
const label = document.getElementById("label");
const dirname = sharedObj.filepath
  ? path.dirname(sharedObj.filepath) + "/"
  : "";
const transform = helper.transform();

let first = true;
let file = sharedObj.filepath ? path.basename(sharedObj.filepath) : "";

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
    .addEventListener("click", (e) => {
      win.close();
      e.currentTarget.blur();
    });
  document
    .getElementById("min-btn")
    .addEventListener("click", (e) => {
      win.minimize();
      e.currentTarget.blur();
    });
  document
    .getElementById("max-btn")
    .addEventListener("click", (e) => {
      win.isMaximized() ? win.unmaximize() : win.maximize();
      e.currentTarget.blur();
    });
}

if (!sharedObj.filepath) {
  title.innerText = "seeit";
  label.innerText = "No file opened";
  label.style.opacity = "1";
  win.show();
} else if (ALL_VIDEO_TYPES.indexOf(path.extname(file).toLowerCase()) !== -1) {
  title.innerText = file;
  label.innerText = file;

  videoEl.src = pathToFileURL(dirname + file);
  videoEl.style.visibility = "visible";
  videoEl.style.zIndex = "1";

  videoEl.onloadeddata = () => {
    if (first) {
      first = false;

      const size = helper.setWindowSize({
        wi: videoEl.videoWidth,
        hi: videoEl.videoHeight,
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

  imageEl.src = pathToFileURL(dirname + file);
  imageEl.style.visibility = "visible";

  imageEl.onload = () => {
    if (first) {
      first = false;

      const size = helper.setWindowSize({
        wi: imageEl.naturalWidth,
        hi: imageEl.naturalHeight,
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

  videoEl.onerror = () => {
    win.show();
    alert(`Error opening file: \n\n${dirname}${file}`);
    win.close();
  };

  imageEl.onerror = (e) => {
    win.show();
    alert(`Error opening file: \n\n${dirname}${file}`);
    win.close();
  };
}

document.ondragover = (e) => e.preventDefault();
document.ondrop = (e) => e.preventDefault();
document.addEventListener("wheel", (e) =>
  e.deltaY < 0 ? transform.up() : transform.down(),
);

imageEl.onmousedown = (e) => e.which === 1 && helper.move(e);
videoEl.onmousedown = (e) => e.which === 1 && helper.move(e);

// Clicking the native controls focuses the <video>; blur it so
// Space/arrow keys keep driving the app shortcuts, not the media element.
videoEl.addEventListener("click", () => videoEl.blur());

if (sharedObj.filepath) {
  fs.listDir(path.dirname(sharedObj.filepath))
    .then((content) => {
      const files = helper.iterator(content, content.indexOf(file));

      helper.prefetch(files, path, dirname);

      title.innerText = file;

      document.onkeydown = (e) => {
        // Cancel media-element defaults (seek/volume/play-pause) so these keys
        // drive the app even when the <video> has focus.
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"].includes(e.code)) {
          e.preventDefault();
        }
        switch (e.code) {
          case "KeyD":
            return transform.rotate(1);
          case "ArrowRight":
            return (file = helper.iterate(
              files,
              path,
              dirname,
              transform,
              1,
              file,
            ));
          case "KeyA":
            return transform.rotate(-1);
          case "ArrowLeft":
            return (file = helper.iterate(
              files,
              path,
              dirname,
              transform,
              -1,
              file,
            ));
          case "KeyW":
          case "ArrowUp":
            return transform.up();
          case "KeyS":
          case "ArrowDown":
            return transform.down();
          case "Backspace":
          case "Delete":
            files.remove(`${dirname}${file}`);
            return (file = helper.iterate(
              files,
              path,
              dirname,
              transform,
              1,
              file,
            ));
          case "Space":
            e.preventDefault(); // keep Space from re-clicking a focused titlebar button
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
            return (file = helper.iterate(
              files,
              path,
              dirname,
              transform,
              -1,
              file,
            ));
          case 5:
            return (file = helper.iterate(
              files,
              path,
              dirname,
              transform,
              1,
              file,
            ));
        }
      };
    })
    .catch(() => {
      // folder unreadable - keep showing the current file, no navigation
    });
}
