const arg = require('electron').remote.process.argv[1],
	path = require('path'),
	fs = require('fs'),
	helper = require('./help');

var imageTypes = ['.jpg', '.png', '.jpeg', '.gif', '.webm', '.mp4'];

fs.readdir(path.dirname(arg), (err, content) => {

	let file = path.basename(arg);

	const files = helper.iterator(content, content.indexOf(file)),
		dirname = path.dirname(arg) + '/',
		zoom = helper.zoom(90);

	document.getElementsByTagName('title')[0].innerText = file;

	if (path.extname(file) === '.webm' || path.extname(file) === '.mp4') {
		helper.showVideo(`${dirname}${file}`, file);
	} else {
		helper.showImage(`${dirname}${file}`, file);
	}

	document.onkeydown = event => {
		if (event.code === 'ArrowRight') {
			do { file = files.next(); }
			while (imageTypes.indexOf(path.extname(file)) === -1);

			if (path.extname(file) === '.webm' || path.extname(file) === '.mp4') {
				helper.showVideo(`${dirname}${file}`, file);
			} else {
				helper.showImage(`${dirname}${file}`, file);
			}

			zoom.reset();

		} else if (event.code === 'ArrowLeft') {
			do { file = files.prev(); }
			while (imageTypes.indexOf(path.extname(file)) === -1);

			if (path.extname(file) === '.webm' || path.extname(file) === '.mp4') {
				helper.showVideo(`${dirname}${file}`, file);
			} else {
				helper.showImage(`${dirname}${file}`, file);
			}

			zoom.reset();

		} else if (event.code === 'Delete') {
			files.remove(`${dirname}${file}`);

			do { file = files.next(); }
			while (imageTypes.indexOf(path.extname(file)) === -1);

			if (path.extname(file) === '.webm' || path.extname(file) === '.mp4') {
				helper.showVideo(`${dirname}${file}`, file);
			} else {
				helper.showImage(`${dirname}${file}`, file);
			}

			zoom.reset();

		}
	}

	document.onmousewheel = event => {
		(event.wheelDelta > 0) ? zoom.up() : zoom.down();
	}
});

document.onmousedown = (e) => {
	e.preventDefault();

	target = e.target;

	coordX = parseInt(target.style.left);
	coordY = parseInt(target.style.top);
	drag = true;

	document.onmousemove = e => {
		if (!drag) { return };

		target.style.left = e.clientX + 'px';
		target.style.top = e.clientY + 'px';
	};
}

document.onmouseup = () => drag = false;

document.ondragover = e => e.preventDefault();
document.ondrop = e => e.preventDefault();