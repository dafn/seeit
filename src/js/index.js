const remote = require('electron').remote,
	win = remote.getCurrentWindow(),
	arg = remote.getGlobal('sharedObj').filepath,
	path = require('path'),
	fs = require('fs'),
	helper = require('../js/helpers')

fs.readdir(path.dirname(arg), (err, content) => {

	const dirname = path.dirname(arg) + '/',
		zoom = helper.zoom(100),
		croppie = helper.croppie()

	content.sort((a, b) =>
		fs.statSync(dirname + '/' + b).mtime.getTime() -
		fs.statSync(dirname + '/' + a).mtime.getTime()
	)

	let file = path.basename(arg),
		first = true,
		img = document.querySelector('#image'),
		vid = document.querySelector('video'),
		title = document.querySelector('title')

	const files = helper.iterator(content, content.indexOf(file))

	title.innerText = file

	if (path.extname(file) === '.webm' || path.extname(file) === '.mp4') {
		title.innerText = file

		vid.src = `${dirname}${file}`
		vid.style.visibility = 'visible'
		vid.style.zIndex = '1'

		vid.onloadeddata = () => {
			if (first) {
				first = false

				let size = helper.setWindowSize({
					wi: vid.videoWidth, hi: vid.videoHeight,
					ws: window.screen.availWidth, hs: window.screen.availHeight
				});

				win.setSize(size.w | 0, size.h | 0)
				win.setMaximumSize(window.screen.availWidth, window.screen.availHeight)
				win.center()

				win.show()
			}
		}
	} else {
		title.innerText = file

		img.src = `${dirname}${file}`
		img.style.visibility = 'visible'

		img.onload = () => {
			if (first) {
				first = false

				let size = helper.setWindowSize({
					wi: img.naturalWidth, hi: img.naturalHeight,
					ws: window.screen.availWidth, hs: window.screen.availHeight
				});

				win.setSize(size.w | 0, size.h | 0)
				win.setMaximumSize(window.screen.availWidth, window.screen.availHeight)
				win.center()

				zoom.reset()

				win.show()
			}
		}
	}

	let crop

	document.onkeydown = event => {
		switch (event.code) {
			case 'KeyD':
			case 'ArrowRight':
				return !crop && (
					file = helper.iterate(files, path, dirname, zoom, 1)
				)
			case 'KeyC':
				return vid.style.zIndex != 1 && (
					crop = croppie.crop()
				)
			case 'KeyA':
			case 'ArrowLeft':
				return !crop && (
					file = helper.iterate(files, path, dirname, zoom, -1)
				)
			case 'KeyW':
			case 'ArrowUp':
				return zoom.up()
			case 'KeyS':
			case 'ArrowDown':
				return zoom.down()
			case 'Enter':
				return crop && (
					crop.result('blob').then(blob => {
						croppie.save(blob, `${dirname}${file}`)
						crop = croppie.crop()
					})
				)
			case 'Backspace':
			case 'Delete':
				files.remove(`${dirname}${file}`)
				return file = helper.iterate(files, path, dirname, zoom, 1)
			default:
				return
		}
	}

	document.ondragover = e => e.preventDefault()
	document.ondrop = e => e.preventDefault()
	document.onmousewheel = e => (e.wheelDelta > 0) ? zoom.up() : zoom.down()

	$(() => {
		$("#image").draggable()
	})
})
