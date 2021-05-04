const TYPES_VIDEO = [
  '.ogg',
  '.webm',
  '.mp4',
  '.mkv',
  '.wav'
]

const TYPES_ALL = [
  '.jpg',
  '.jpeg',
  '.gif',
  '.png',
  '.apng',
  '.avif',
  '.tiff',
  '.svg',
  '.ico',
  '.webp',
  '.bmp',
  ...TYPES_VIDEO
]

const INDEX = process.env.NODE_ENV === 'development' ? 2 : 1

module.exports = {
  TYPES_VIDEO,
  TYPES_ALL,
  INDEX
}
