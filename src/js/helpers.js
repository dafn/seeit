const win = require('electron').remote.getCurrentWindow(),
	{ TYPES } = require('./constants');
img = document.getElementById('image'),
	vid = document.getElementsByTagName('video')[0];

exports.zoom = value => {
	let size = value;
	img, vid;

	return {
		size: size => {
			this.size = size;
		},
		up: () => {
			size += 4;
			img.style.height = `${size}%`;
			img.style.width = `${size}%`;
		},
		down: () => {
			size -= 4;
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

exports.next = (files, path, dirname, zoom) => {
	do { file = files.next(); }
	while (TYPES.indexOf(path.extname(file).toLowerCase()) === -1);

	if (path.extname(file) === '.webm' || path.extname(file) === '.mp4') {
		showVideo(`${dirname}${file}`, file);
	} else {
		showImage(`${dirname}${file}`, file);
	}

	zoom.reset();
	return file;
}

exports.prev = (files, path, dirname, zoom) => {
	do { file = files.prev(); }
	while (TYPES.indexOf(path.extname(file).toLowerCase()) === -1);

	if (path.extname(file) === '.webm' || path.extname(file) === '.mp4') {
		showVideo(`${dirname}${file}`, file);
	} else {
		showImage(`${dirname}${file}`, file);
	}

	zoom.reset();
	return file;
}

exports.setWindowSize = dim => {
	if (dim.ws > dim.wi && dim.hs > dim.hi) {
		return { w: dim.wi, h: dim.hi }
	}

	return (dim.wi / dim.hi) < (dim.ws / dim.hs) ?
		{ w: dim.wi * dim.hs / dim.hi, h: dim.hs } :
		{ w: dim.ws, h: dim.hi * dim.ws / dim.wi }
}

showVideo = (path, filename) => {
	document.getElementsByTagName('title')[0].innerText = filename;
	img, vid;

	vid.src = path;

	img.style.visibility = 'hidden';
	vid.style.visibility = 'visible';
	vid.style.zIndex = '1';
}

showImage = (path, filename) => {
	document.getElementsByTagName('title')[0].innerText = filename;
	img, vid;

	img.src = path;
	vid.style.zIndex = '-1';
	vid.style.visibility = 'hidden';
	vid.src = "";

	img.style.visibility = 'visible';
}
