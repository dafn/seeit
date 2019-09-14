const TYPES_VIDEO = [
  '.ogg',
  '.webm',
  '.mp4',
  '.mkv',
]

const TYPES_ALL = [
  '.jpg',
  '.jpeg',
  '.gif',
  '.png',
  '.tiff',
  '.svg',
  '.ico',
  '.webp',
  ...TYPES_VIDEO
]

const INDEX = process.env.NODE_ENV === 'development' ? 2 : 1

module.exports = {
  TYPES_VIDEO,
  TYPES_ALL,
  INDEX
}
