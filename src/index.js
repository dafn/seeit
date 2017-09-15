const arg = require('electron').remote.process.argv[2],
	path = require('path'),
	fs = require('fs'),
	helper = require('./help');

var imageTypes = ['.jpg', '.png', '.jpeg', '.gif', '.webm', '.mp4'];

fs.readdir(path.dirname(arg), (err, content) => {

	let file = path.basename(arg);

	const files = helper.iterator(content, content.indexOf(file)),
		dirname = path.dirname(arg) + '/',
		zoom = helper.zoom(95);

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

document.onmousedown = e => {
	e.preventDefault();

	if (e.target.nodeName !== 'IMG') { return }

	let targ = e.target;
	let drag = false;

	if (!targ.style.left) {
		targ.style.left = '0px';
		targ.style.top = '0px';
		targ.style.transform = 'translate(0, 0)';
	};
	
	let coordX = parseInt(targ.style.left);
	let coordY = parseInt(targ.style.top);

	let offsetX = e.clientX;
	let offsetY = e.clientY;

	drag = true;

	document.onmousemove = e => {
		if (!drag) { return };

		document.getElementById('image').style.left = (coordX + e.clientX - offsetX) + 'px';
		document.getElementById('image').style.top = (coordY + e.clientY - offsetY) + 'px';
		document.getElementById('image').style.transform = 'translate(0, 0)';
	}

	document.onmouseup = () => drag = false;
}

document.ondragover = e => e.preventDefault();
document.ondrop = e => e.preventDefault();