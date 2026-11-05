const helper = (() => {
  const title = document.getElementById("title");
  const label = document.getElementById("label");
  const imageEl = document.getElementById("image");
  const videoEl = document.getElementById("video");

  const transform = (initialScale = 1, increment = 0.05) => {
    let scale = initialScale,
      rotation = 0;

    return {
      size: (value) => {
        this.size = value;
      },
      up: () => {
        scale += increment;
        videoEl.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
        imageEl.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
      },
      down: () => {
        scale -= increment;
        videoEl.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
        imageEl.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
      },
      rotate: (direction) => {
        if (imageEl.style.visibility === "visible") {
          imageEl.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${(rotation +=
            90 * direction)}deg)`;
        } else {
          videoEl.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${(rotation +=
            90 * direction)}deg)`;
        }
      },
      reset: () => {
        scale = initialScale;
        rotation = 0;

        imageEl.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
        imageEl.style.height = "100%";
        imageEl.style.width = "100%";
        imageEl.style.top = "50%";
        imageEl.style.left = "50%";

        videoEl.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
        videoEl.style.height = "100%";
        videoEl.style.width = "100%";
        videoEl.style.top = "50%";
        videoEl.style.left = "50%";
      },
    };
  };

  const iterator = (array, index = 0) => {
    let nextIndex = index;

    return {
      next: () =>
        array[(nextIndex = (nextIndex + array.length + 1) % array.length)],
      prev: () =>
        array[(nextIndex = (nextIndex + array.length - 1) % array.length)],
      size: () => array.length,
      peek: (direction) => {
        const count = array.length;
        for (let i = 1; i <= count; i++) {
          const candidate = array[(nextIndex + count + direction * i) % count];
          if (candidate && ALL_TYPES.includes(path.extname(candidate).toLowerCase())) {
            return candidate;
          }
        }
        return undefined;
      },
      remove: async (filePath) => {
        fs.rmSync(filePath);
        array.splice(nextIndex, 1);
        nextIndex -= 1;
      },
    };
  };

  const isSupported = (pathLib, fileName) =>
    ALL_TYPES.includes(pathLib.extname(fileName).toLowerCase());

  // Checks each file at most once, so a folder without supported files can't loop forever.
  const findSupportedFile = (files, pathLib, direction) => {
    for (let checked = 0; checked < files.size(); checked++) {
      const fileName = direction == 1 ? files.next() : files.prev();
      if (isSupported(pathLib, fileName)) {
        return fileName;
      }
    }
    return undefined;
  };

  const iterate = (files, pathLib, dirname, transform, direction, current) => {
    const fileName = findSupportedFile(files, pathLib, direction);
    if (!fileName) {
      return current;
    }

    ALL_VIDEO_TYPES.indexOf(pathLib.extname(fileName).toLowerCase()) !== -1
      ? showVideo(`${dirname}${fileName}`, fileName)
      : showImage(`${dirname}${fileName}`, fileName);

    transform.reset();
    prefetch(files, pathLib, dirname);
    return fileName;
  };

  const setWindowSize = ({
    wi: mediaWidth,
    hi: mediaHeight,
    ws: screenWidth,
    hs: screenHeight,
  }) => {
    if (screenWidth > mediaWidth && screenHeight > mediaHeight) {
      return { w: mediaWidth, h: mediaHeight };
    }

    return mediaWidth / mediaHeight < screenWidth / screenHeight
      ? { w: (mediaWidth * screenHeight) / mediaHeight, h: screenHeight }
      : { w: screenWidth, h: (mediaHeight * screenWidth) / mediaWidth };
  };

  const move = (e) => {
    let deltaX = 0,
      deltaY = 0,
      lastX = 0,
      lastY = 0;

    e.preventDefault();
    lastX = e.clientX;
    lastY = e.clientY;

    document.onmousemove = (e) => {
      e.preventDefault();
      deltaX = lastX - e.clientX;
      deltaY = lastY - e.clientY;
      lastX = e.clientX;
      lastY = e.clientY;
      imageEl.style.top = imageEl.offsetTop - deltaY + "px";
      imageEl.style.left = imageEl.offsetLeft - deltaX + "px";
      videoEl.style.top = imageEl.offsetTop - deltaY + "px";
      videoEl.style.left = imageEl.offsetLeft - deltaX + "px";
    };

    document.onmouseup = () => {
      document.onmouseup = null;
      document.onmousemove = null;
    };
  };

  const showVideo = (filePath, fileName) => {
    title.innerText = fileName;
    label.innerText = fileName;

    imageEl.style.visibility = "hidden";
    videoEl.src = pathToFileURL(filePath);
    videoEl.style.visibility = "visible";
    videoEl.style.zIndex = 1;
  };

  const showImage = (filePath, fileName) => {
    title.innerText = fileName;
    label.innerText = fileName;

    videoEl.style.visibility = "hidden";
    imageEl.src = pathToFileURL(filePath);
    videoEl.style.zIndex = -1;
    imageEl.style.visibility = "visible";
    videoEl.removeAttribute("src");
    videoEl.load();
  };

  // Warm the browser cache for the next/previous supported file so
  // arrow-key navigation is instant.
  const prefetch = (files, pathLib, dirname) => {
    for (const direction of [1, -1]) {
      const neighbor = files.peek(direction);
      if (neighbor) {
        const mediaEl = ALL_VIDEO_TYPES.includes(
          pathLib.extname(neighbor).toLowerCase(),
        )
          ? document.createElement("video")
          : new Image();
        mediaEl.preload = "auto";
        mediaEl.src = pathToFileURL(`${dirname}${neighbor}`);
      }
    }
  };

  return { transform, iterator, iterate, setWindowSize, move, prefetch };
})();
