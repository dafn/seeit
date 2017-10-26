const win = require('electron').remote.getCurrentWindow(),
	img = document.getElementById('image'),
	vid = document.getElementsByTagName('video')[0];

exports.zoom = value => {
	let size = value;

	img, vid;

	return {
		size: (size) => {
			this.size = size;
		},
		up: () => {
			size += 5;
			img.style.height = `${size}%`;
			img.style.width = `${size}%`;
		},
		down: () => {
			size -= 5;
			img.style.height = `${size}%`;
			img.style.width = `${size}%`;
		},
		reset: () => {
			size = value;
			img.style.height = `${size}%`;
			img.style.width = `${size}%`;

			img.style.top = '50%';
			img.style.left = '50%';

			vid.style.top = '50%';
			vid.style.left = '50%';
		}
	}
}

exports.iterator = (array, index) => {
	index ? nextIndex = index : nextIndex = 0;

	return {
		next: () => {
			nextIndex++;
			return (nextIndex < array.length) ? array[nextIndex] : array[nextIndex = 0]
		},
		prev: () => {
			nextIndex--;
			return (nextIndex >= 0) ? array[nextIndex] : array[nextIndex = array.length - 1]
		},
		remove: file => {
			fs.unlinkSync(file);
			array.splice(nextIndex, 1)
		}
	};
}

exports.showVideo = (path, filename) => {
	document.getElementsByTagName('title')[0].innerText = filename;

	img, vid;

	vid.src = path;

	img.style.visibility = 'hidden';
	vid.style.visibility = 'visible';
	vid.style.zIndex = '1';
}

exports.showImage = (path, filename) => {
	document.getElementsByTagName('title')[0].innerText = filename;

	img, vid;

	img.src = ""; // removes flickering when switching image after drag
	img.src = path;
/*
	img.onload = () => {
		if (!win.isFullScreen() && !win.isMaximized()) {
			win.setSize(img.naturalWidth, img.naturalHeight);
			win.setPosition(
				parseInt((window.screen.availWidth-win.getSize()[0])/2),
				parseInt((window.screen.availHeight-win.getSize()[1])/2)
			);
			
		}
	}
*/
	vid.style.zIndex = '-1';
	vid.style.visibility = 'hidden';
	vid.src = "";

	img.style.visibility = 'visible';
}

exports.next = (files, imageTypes, path, dirname, zoom) => {
	do { file = files.next(); }
	while (imageTypes.indexOf(path.extname(file).toLowerCase()) === -1);

	if (path.extname(file) === '.webm' || path.extname(file) === '.mp4') {
		exports.showVideo(`${dirname}${file}`, file);
	} else {
		exports.showImage(`${dirname}${file}`, file);
	}

	zoom.reset();
	return file;
}

exports.prev = (files, imageTypes, path, dirname, zoom) => {
	do { file = files.prev(); }
	while (imageTypes.indexOf(path.extname(file).toLowerCase()) === -1);

	if (path.extname(file) === '.webm' || path.extname(file) === '.mp4') {
		exports.showVideo(`${dirname}${file}`, file);
	} else {
		exports.showImage(`${dirname}${file}`, file);
	}

	zoom.reset();
	return file;
}