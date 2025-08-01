const ALL_VIDEO_TYPES = [
  ".ogg",
  ".webm",
  ".mp4",
  ".mkv",
  ".avi",
  ".mov",
  ".flv",
  ".wmv",
  ".mpeg",
  ".mpg",
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

const INDEX = process.env.NODE_ENV === "development" ? 2 : 1;

module.exports = {
  ALL_VIDEO_TYPES,
  ALL_TYPES,
  INDEX,
};
