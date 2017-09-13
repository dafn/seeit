document.ondragover = e => e.preventDefault();
document.ondrop = e => e.preventDefault();

var imageTypes = ['.jpg', '.png', '.jpeg', '.gif', '.webm', '.mp4'],
	file;

const args = require('electron').remote.process.argv,
	path = require('path'),
	holder = document.getElementById('holder'),
	fs = require('fs');


fs.readdir(args[2], (err, content) => {

	files = iterator(content);
	zoom = zoom(90);

	do { file = files.next(); }
	while (imageTypes.indexOf(path.extname(file)) === -1);

	document.getElementsByTagName('title')[0].innerText = file;

	if (path.extname(file) === '.webm' || path.extname(file) === '.mp4') {
		showVideo(`${args[2]}${file}`);
	} else {
		showImage(`${args[2]}${file}`);
	}

	document.onkeydown = event => {
		if (event.code === 'ArrowRight') {
			do { file = files.next(); }
			while (imageTypes.indexOf(path.extname(file)) === -1);

			if (path.extname(file) === '.webm' || path.extname(file) === '.mp4') {
				showVideo(`${args[2]}${file}`);
			} else {
				showImage(`${args[2]}${file}`);
			}

			zoom.reset();

		} else if (event.code === 'ArrowLeft') {
			do { file = files.prev(); }
			while (imageTypes.indexOf(path.extname(file)) === -1);

			if (path.extname(file) === '.webm' || path.extname(file) === '.mp4') {
				showVideo(`${args[2]}${file}`);
			} else {
				showImage(`${args[2]}${file}`);
			}

			zoom.reset();
		}
	}
	document.onmousewheel = event => {
		(event.wheelDelta > 0) ? zoom.up() : zoom.down();
	}
});

showVideo = path => {
	document.getElementsByTagName('title')[0].innerText = file;
	document.getElementsByTagName('video')[0].src = path;
	document.getElementsByTagName('img')[0].style.opacity = '0';
	document.getElementsByTagName('video')[0].style.opacity = '1';
}

showImage = path => {
	document.getElementsByTagName('title')[0].innerText = file;
	document.getElementsByTagName('img')[0].src = path;
	document.getElementsByTagName('video')[0].style.opacity = '0';
	document.getElementsByTagName('img')[0].style.opacity = '1';
}

iterator = array => {
	let nextIndex = 0;

	return {
		next: () => {
			nextIndex++;
			return (nextIndex < array.length) ? array[nextIndex] : array[nextIndex = 0]
		},
		prev: () => {
			nextIndex--;
			return (nextIndex >= 0) ? array[nextIndex] : array[nextIndex = array.length - 1]
		}
	};
}

zoom = value => {
	let size = value;

	return {
		up: () => {
			size += 10;
			document.getElementById('id').style.height = `${size}%`;
			document.getElementById('id').style.width = `${size}%`;
		},
		down: () => {
			size -= 10;
			document.getElementById('id').style.height = `${size}%`;
			document.getElementById('id').style.width = `${size}%`;
		},
		reset: () => {
			size = value;
			document.getElementById('id').style.height = `${size}%`;
			document.getElementById('id').style.width = `${size}%`;
		}
	}
}