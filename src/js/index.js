const arg = require('electron').remote.process.argv[2],
	path = require('path'),
	fs = require('fs'),
	helper = require('../js/help');

const imageTypes = ['.jpg', '.png', '.jpeg', '.gif', '.webm', '.mp4'];

if (arg) {
	fs.readdir(path.dirname(arg), (err, content) => {

		TODO: 'Sort files by folder sort'

		var file = path.basename(arg);

		const files = helper.iterator(content, content.indexOf(file)),
			dirname = path.dirname(arg) + '/',
			zoom = helper.zoom(100);

		document.getElementsByTagName('title')[0].innerText = file;

		if (path.extname(file) === '.webm' || path.extname(file) === '.mp4') {
			helper.showVideo(`${dirname}${file}`, file);
		} else {
			helper.showImage(`${dirname}${file}`, file);
		}

		document.onkeydown = event => {
			switch (event.code) {
				case 'KeyD':
				case 'ArrowRight':
					file = helper.next(files, imageTypes, path, dirname, zoom);
					break;
				case 'KeyA':
				case 'ArrowLeft':
					file = helper.prev(files, imageTypes, path, dirname, zoom);
					break;
				case 'KeyW':
				case 'ArrowUp':
					zoom.up();
					break;
				case 'KeyS':
				case 'ArrowDown':
					zoom.down();
					break;
				case 'Backspace':
				case 'Delete':
					files.remove(`${dirname}${file}`);
					file = helper.next(files, imageTypes, path, dirname, zoom);
					break;
				default:
					break;
			}
		}

		document.onmousewheel = e => {
			e.preventDefault();
			(e.wheelDelta > 0) ? zoom.up() : zoom.down();
		}

		window.onresize = e => {
			TODO: 'center image on rezise'
		}
	});
} else {
	TODO: 'What if no file is given?'
}

$(function () {
	$("#image").draggable();
});

document.ondragover = e => e.preventDefault();
document.ondrop = e => e.preventDefault();
