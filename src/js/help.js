exports.zoom = value => {
	let size = value;

	return {
		up: () => {
			size += 5;
			document.getElementById('image').style.height = `${size}%`;
			document.getElementById('image').style.width = `${size}%`;
		},
		down: () => {
			size -= 5;
			document.getElementById('image').style.height = `${size}%`;
			document.getElementById('image').style.width = `${size}%`;
		},
		reset: () => {
			size = value;
			document.getElementById('image').style.height = `${size}%`;
			document.getElementById('image').style.width = `${size}%`;

			document.getElementById('image').style.top = '50%';
			document.getElementById('image').style.left = '50%';

			document.getElementsByTagName('video')[0].style.top = '50%';
			document.getElementsByTagName('video')[0].style.left = '50%';
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
	document.getElementsByTagName('video')[0].src = path;

	document.getElementsByTagName('img')[0].style.visibility = 'hidden';
	document.getElementsByTagName('video')[0].style.visibility = 'visible';
	document.getElementsByTagName('video')[0].style.zIndex = '1';
}

exports.showImage = (path, filename) => {
	document.getElementsByTagName('title')[0].innerText = filename;
	document.getElementsByTagName('img')[0].src = ""; // removes flickering when switching image after drag
	document.getElementsByTagName('img')[0].src = path;

	document.getElementsByTagName('video')[0].style.zIndex = '-1';
	document.getElementsByTagName('video')[0].style.visibility = 'hidden';
	document.getElementsByTagName('img')[0].style.visibility = 'visible';
}

exports.next = (files, imageTypes, path, dirname, zoom) => {
	do { file = files.next(); }
	while (imageTypes.indexOf(path.extname(file)) === -1);

	if (path.extname(file) === '.webm' || path.extname(file) === '.mp4') {
		exports.showVideo(`${dirname}${file}`, file);
	} else {
		exports.showImage(`${dirname}${file}`, file);
	}
	console.log('next(): ', file)

	zoom.reset();
	return file;
}

exports.prev = (files, imageTypes, path, dirname, zoom) => {
	do { file = files.prev(); }
	while (imageTypes.indexOf(path.extname(file)) === -1);

	if (path.extname(file) === '.webm' || path.extname(file) === '.mp4') {
		exports.showVideo(`${dirname}${file}`, file);
	} else {
		exports.showImage(`${dirname}${file}`, file);
	}

	zoom.reset();
	return file;
}
