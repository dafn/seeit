const win = require('electron').remote.getCurrentWindow(),
	fs = require('fs'),
	{ TYPES } = require('./constants'),
	trash = require('trash')
Croppr = require('croppr')

let title = document.querySelector('title'),
	img = document.querySelector('img'),
	vid = document.querySelector('video')

exports.zoom = (value = 100, increment = 4) => {
	let size = value

	return {
		size: size => {
			this.size = size
		},
		up: () => {
			size += increment
			img.style.height = `${size}vh`
			img.style.width = `${size}vw`
		},
		down: () => {
			size -= increment
			img.style.height = `${size}vh`
			img.style.width = `${size}vw`
		},
		reset: () => {
			size = value
			img.style.height = `${size}vh`
			img.style.width = `${size}vw`
			img.style.top = '50%'
			img.style.left = '50%'
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

exports.iterate = (files, path, dirname, zoom, direction) => {
	do file = direction == 1 ? files.next() : files.prev()
	while (TYPES.indexOf(path.extname(file).toLowerCase()) === -1)

	path.extname(file).toLowerCase() === '.webm' || path.extname(file).toLowerCase() === '.mp4' ?
		showVideo(`${dirname}${file}`, file) :
		showImage(`${dirname}${file}`, file)

	zoom.reset()
	return file
}

exports.setWindowSize = dim => {

	if (dim.ws > dim.wi && dim.hs > dim.hi) {
		return { w: dim.wi, h: dim.hi }
	}

	return (dim.wi / dim.hi) < (dim.ws / dim.hs) ?
		{ w: dim.wi * dim.hs / dim.hi, h: dim.hs } :
		{ w: dim.ws, h: dim.hi * dim.ws / dim.wi }
}

exports.croppie = () => {
	let cropping

	return {
		crop: () => {
			if (!cropping) {
				console.log('wip')
			} else {
				console.log('wip')
			}
			return cropping
		},
		save: (blob, path) => {
			let reader = new FileReader()

			reader.onload = () => {
				let base64 = reader.result.split(',')[1],
					buffer = new Buffer(base64, 'base64')
				fs.writeFile(path, buffer, err => {
					err ? console.log(err) : console.log('croppie success')
				})
			}

			reader.readAsDataURL(blob)
		}
	}
}

showVideo = (path, filename) => {
	title.innerText = filename

	img.style.visibility = 'hidden'
	vid.src = path
	vid.style.visibility = 'visible'
	vid.style.zIndex = 1
}

showImage = (path, filename) => {
	title.innerText = filename

	img.src = path
	vid.style.visibility = 'hidden'
	vid.style.zIndex = -1
	img.style.visibility = 'visible'
	vid.src = ''
}
