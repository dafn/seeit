const ALL_VIDEO_TYPES = [
  ".webm",
  ".mp4",
  ".m4v",
  ".mov",
  ".ogv",
  ".ogg",
];

const ALL_IMAGE_TYPES = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".webp",
  ".apng",
  ".svg",
  ".ico",
  ".tiff",
];

const ALL_TYPES = [...ALL_IMAGE_TYPES, ...ALL_VIDEO_TYPES];

const INDEX =
  typeof process !== "undefined" && process.env.NODE_ENV === "development"
    ? 2
    : 1;

// CommonJS export for the main process; in the renderer (no `module`)
// the consts above stay as globals shared by the classic scripts.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    ALL_VIDEO_TYPES,
    ALL_TYPES,
    INDEX,
  };
}
