const remote = require('electron').remote,
	win = remote.getCurrentWindow(),
	sharedObj = remote.getGlobal('sharedObj'),
	path = require('path'),
	fs = require('fs'),
	helper = require('../js/helpers'),
	{ TYPES_VIDEO } = require('../js/constants')

if (sharedObj.platform == 'win32') {
	const titlebarButtons = document.getElementById('win-titlebar-btns')

	titlebarButtons.style.visibility = 'visible'
	titlebarButtons.innerHTML = `
		<button id="min-btn">-</button>
		<button id="max-btn">+</button>
		<button id="close-btn">x</button>
	`
	document.getElementById("close-btn").addEventListener("click", e => win.close())
	document.getElementById("min-btn").addEventListener("click", e => win.minimize())
	document.getElementById("max-btn").addEventListener("click", e =>
		win.isMaximized() ? win.unmaximize() : win.maximize()
	)
}

fs.readdir(path.dirname(sharedObj.filepath), (err, content) => {

	const dirname = path.dirname(sharedObj.filepath) + '/',
		zoom = helper.zoom()

	content.sort((a, b) =>
		fs.statSync(dirname + '/' + b).mtime.getTime() -
		fs.statSync(dirname + '/' + a).mtime.getTime()
	)

	let first = true,
		file = path.basename(sharedObj.filepath)

	const img = document.getElementById('image'),
		vid = document.getElementById('video'),
		title = document.getElementById('title'),
		files = helper.iterator(content, content.indexOf(file))

	title.innerText = file

	if (TYPES_VIDEO.indexOf(path.extname(file).toLowerCase()) !== -1) {
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
				})

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
				})

				win.setSize(size.w | 0, size.h | 0)
				win.setMaximumSize(window.screen.availWidth, window.screen.availHeight)
				win.center()

				zoom.reset()

				win.show()
			}
		}

		img.onerror = e => {
			alert(`File extension "${path.extname(file)}" is not supported by seeit`)
			win.close()
		}
	}

	document.onkeydown = event => {
		switch (event.code) {
			case 'KeyD':
				return img.style.visibility != 'hidden' && (
					img.style.transform = `translate(-50%, -50%) rotate(${helper.getRotation(1)}deg)`)
			case 'ArrowRight':
				return file = helper.iterate(files, path, dirname, zoom, 1)
			case 'KeyA':
				return img.style.visibility != 'hidden' && (
					img.style.transform = `translate(-50%, -50%) rotate(${helper.getRotation(-1)}deg)`)
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

	img.onmousedown = helper.move
})
