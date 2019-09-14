const { TYPES_ALL, TYPES_VIDEO } = require('./constants'),
  trash = require('trash')

let title = document.getElementById('title'),
  img = document.getElementById('image'),
  vid = document.getElementById('video')


exports.transform = (value = 1, increment = .05) => {
  let size = value, rotation = 0

  return {
    size: size => {
      this.size = size
    },
    up: () => {
      size += increment
      vid.style.transform = `translate(-50%, -50%) scale(${size}) rotate(${rotation}deg)`
      img.style.transform = `translate(-50%, -50%) scale(${size}) rotate(${rotation}deg)`
    },
    down: () => {
      size -= increment
      vid.style.transform = `translate(-50%, -50%) scale(${size}) rotate(${rotation}deg)`
      img.style.transform = `translate(-50%, -50%) scale(${size}) rotate(${rotation}deg)`

    },
    rotate: direction => {
      if (img.style.visibility === 'visible')
        img.style.transform = `translate(-50%, -50%) scale(${size}) rotate(${rotation += 90 * direction}deg)`
      else
        vid.style.transform = `translate(-50%, -50%) scale(${size}) rotate(${rotation += 90 * direction}deg)`
    },
    reset: () => {
      size = value
      rotation = 0
      
      img.style.transform = `translate(-50%, -50%) scale(${size}) rotate(${rotation}deg)`
      img.style.height = "100%"
      img.style.width = "100%"
      img.style.top = '50%'
      img.style.left = '50%'
      
      vid.style.transform = `translate(-50%, -50%) scale(${size}) rotate(${rotation}deg)`
      vid.style.height = "100%"
      vid.style.width = "100%"
      vid.style.top = '50%'
      vid.style.left = '50%'
    }
  }
}

exports.iterator = (array, index = 0) => {
  nextIndex = index

  return {
    next: () => (
      array[(nextIndex = (nextIndex + array.length + 1) % array.length)]
    ),
    prev: () => (
      array[(nextIndex = (nextIndex + array.length - 1) % array.length)]
    ),
    remove: file => (
      trash(file).then(() => {
        array.splice(nextIndex -= 1, 1)
      })
    )
  }
}

exports.iterate = (files, path, dirname, transform, direction) => {
  do file = direction == 1 ? files.next() : files.prev()
  while (TYPES_ALL.indexOf(path.extname(file).toLowerCase()) === -1)

  TYPES_VIDEO.indexOf(path.extname(file).toLowerCase()) !== -1 ?
    showVideo(`${dirname}${file}`, file) :
    showImage(`${dirname}${file}`, file)

  transform.reset()
  return file
}

exports.setWindowSize = dim => {

  if (dim.ws > dim.wi && dim.hs > dim.hi)
    return { w: dim.wi, h: dim.hi }

  return (dim.wi / dim.hi) < (dim.ws / dim.hs) ?
    { w: dim.wi * dim.hs / dim.hi, h: dim.hs } :
    { w: dim.ws, h: dim.hi * dim.ws / dim.wi }
}

exports.move = e => {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  e.preventDefault()
  pos3 = e.clientX
  pos4 = e.clientY

  document.onmousemove = e => {
    e.preventDefault()
    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY
    img.style.top = (img.offsetTop - pos2) + "px"
    img.style.left = (img.offsetLeft - pos1) + "px"
    vid.style.top = (img.offsetTop - pos2) + "px"
    vid.style.left = (img.offsetLeft - pos1) + "px"
  }

  document.onmouseup = () => {
    document.onmouseup = null
    document.onmousemove = null
  }
}

showVideo = (path, filename) => {
  title.innerText = filename

  img.style.visibility = 'hidden'
  vid.src = path
  vid.style.visibility = 'visible'
  vid.style.zIndex = 1
  img.src = ''
}

showImage = (path, filename) => {
  title.innerText = filename

  vid.style.visibility = 'hidden'
  img.src = path
  vid.style.zIndex = -1
  img.style.visibility = 'visible'
  vid.src = ''
}
