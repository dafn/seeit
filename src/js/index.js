const remote = require('electron').remote,
	win = remote.getCurrentWindow(),
	arg = remote.getGlobal('sharedObj').filepath,
	path = require('path'),
	fs = require('fs'),
	helper = require('../js/helpers');

fs.readdir(path.dirname(arg), (err, content) => {

	const dirname = path.dirname(arg) + '/',
		zoom = helper.zoom(104);

	content.sort((a, b) => {
		return fs.statSync(dirname + '/' + b).mtime.getTime() -
			fs.statSync(dirname + '/' + a).mtime.getTime();
	});

	let file = path.basename(arg),
		first = true;

	const files = helper.iterator(content, content.indexOf(file));

	document.getElementsByTagName('title')[0].innerText = file;

	if (path.extname(file) === '.webm' || path.extname(file) === '.mp4') {
		document.getElementsByTagName('title')[0].innerText = file;

		let vid = document.getElementsByTagName('video')[0];

		vid.src = `${dirname}${file}`;
		vid.style.visibility = 'visible';
		vid.style.zIndex = '1';

		vid.onloadeddata = () => {
			if (first) {
				first = false;

				let size = helper.setWindowSize({
					wi: vid.videoWidth, hi: vid.videoHeight,
					ws: window.screen.availWidth, hs: window.screen.availHeight
				});

				win.setSize(size.w | 0, size.h | 0);
				win.setMaximumSize(window.screen.availWidth, window.screen.availHeight);
				win.center();

				win.show();
			}
		}
	} else {
		document.getElementsByTagName('title')[0].innerText = file;

		let img = document.getElementById('image');
		img.src = `${dirname}${file}`;
		img.style.visibility = 'visible';

		img.onload = () => {
			if (first) {
				first = false;

				let size = helper.setWindowSize({
					wi: img.naturalWidth, hi: img.naturalHeight,
					ws: window.screen.availWidth, hs: window.screen.availHeight
				});

				win.setSize(size.w | 0, size.h | 0);
				win.setMaximumSize(window.screen.availWidth, window.screen.availHeight);
				win.center();

				zoom.reset();

				win.show();
			}
		}
	}

	document.onkeydown = event => {
		switch (event.code) {
			case 'KeyD':
			case 'ArrowRight':
				file = helper.next(files, path, dirname, zoom);
				break;
			case 'KeyA':
			case 'ArrowLeft':
				file = helper.prev(files, path, dirname, zoom);
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
				file = helper.next(files, path, dirname, zoom);
				break;
			default:
				break;
		}
	}
});

document.ondragover = e => e.preventDefault();
document.ondrop = e => e.preventDefault();

document.onmousewheel = e => {
	e.preventDefault();
	(e.wheelDelta > 0) ? zoom.up() : zoom.down();
}

window.onresize = e => {
	TODO: 'center image on rezise'
}

$(() => {
	$("#image").draggable();
});
