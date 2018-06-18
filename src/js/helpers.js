const win = require('electron').remote.getCurrentWindow(),
	fs = require('fs'),
	{ TYPES } = require('./constants'),
	trash = require('trash')

let title = document.querySelector('title'),
	img = $('#image'),
	vid = $('video')

exports.zoom = (value = 100, increment = 4) => {
	let size = value

	return {
		size: size => {
			this.size = size
		},
		up: () => {
			size += increment
			img.css({ 'height': `${size}vh`, 'width': `${size}vw`, })
		},
		down: () => {
			size -= increment
			img.css({ 'height': `${size}vh`, 'width': `${size}vw`, })
		},
		reset: () => {
			size = value
			img.css({
				'height': `${size}vh`,
				'width': `${size}vw`,
				'top': '50%',
				'left': '50%'
			})
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
				cropping = new Croppie(document.querySelector("#image"), {
					viewport: { width: 150, height: 150 },
					enableResize: true,
					showZoomer: false
				});
			} else {
				img.unwrap()
				$('.cr-boundary, .cr-slider-wrap').remove()
				cropping = null
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

	img.css('visibility', 'hidden')
	vid.attr('src', path)
	vid.css({ 'visibility': 'visible', 'zIndex': '1' })
}

showImage = (path, filename) => {
	title.innerText = filename

	img.attr('src', path)
	vid.css({ 'visibility': 'hidden', 'zIndex': '-1' })
	img.css('visibility', 'visible')
	vid.attr('src', '')
}
