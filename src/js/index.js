const remote = require('electron').remote,
	win = remote.getCurrentWindow(),
	sharedObj = remote.getGlobal('sharedObj'),
	path = require('path'),
	fs = require('fs'),
	helper = require('../js/helpers')

let size = { w: 128, h: 128 }

if (sharedObj.platform == 'win32')
	document.querySelector('#win-titlebar-btns').style.visibility = 'visible'

fs.readdir(path.dirname(sharedObj.filepath), (err, content) => {

	const dirname = path.dirname(sharedObj.filepath) + '/',
		zoom = helper.zoom()

	content.sort((a, b) =>
		fs.statSync(dirname + '/' + b).mtime.getTime() -
		fs.statSync(dirname + '/' + a).mtime.getTime()
	)

	let file = path.basename(sharedObj.filepath),
		first = true,
		img = document.querySelector('img'),
		vid = document.querySelector('video'),
		title = document.querySelector('title')

	const files = helper.iterator(content, content.indexOf(file))

	title.innerText = file

	if (path.extname(file).toLowerCase() === '.webm' || path.extname(file).toLowerCase() === '.mp4') {
		title.innerText = file

		vid.src = `${dirname}${file}`
		vid.style.visibility = 'visible'
		vid.style.zIndex = '1'

		vid.onloadeddata = () => {
			if (first) {
				first = false

				size = helper.setWindowSize({
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

				size = helper.setWindowSize({
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

	document.onkeydown = event => {
		switch (event.code) {
			case 'KeyD':
			case 'ArrowRight':
				return file = helper.iterate(files, path, dirname, zoom, 1)
			case 'KeyA':
			case 'ArrowLeft':
				return file = helper.iterate(files, path, dirname, zoom, -1)
			case 'KeyW':
			case 'ArrowUp':
				return zoom.up()
			case 'KeyS':
			case 'ArrowDown':
				return zoom.down()
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

	document.getElementById("close-btn").addEventListener("click", e => win.close())
	document.getElementById("min-btn").addEventListener("click", e => win.minimize())
	document.getElementById("max-btn").addEventListener("click", e => {
		if (win.isMaximized()) win.setSize(size.w, size.h)
		else win.maximize()
		zoom.reset()
	})

	img.ondrag = e => {
		e.preventDefault()

		e.target.style.left = e.clientX
		e.target.style.top = e.clientY
	}
})
