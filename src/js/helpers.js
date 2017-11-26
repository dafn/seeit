const win = require('electron').remote.getCurrentWindow(),
	fs = require('fs'),
	{ TYPES } = require('./constants');
let img = $('#image'),
	vid = $('video');

exports.zoom = value => {
	let size = value;

	return {
		size: size => {
			this.size = size;
		},
		up: () => {
			size += 4;
			img.css({ 'height': `${size}vh`, 'width': `${size}vw`, })
		},
		down: () => {
			size -= 4;
			img.css({ 'height': `${size}vh`, 'width': `${size}vw`, })
		},
		reset: () => {
			size = value;
			img.css({
				'height': `${size}vh`,
				'width': `${size}vw`,
				'top': '50%',
				'left': '50%'
			});
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

exports.croppie = () => {
	let cropping;

	return {
		crop: () => {
			if (!cropping) {
				cropping = new Croppie(document.getElementById("image"), {
					viewport: { width: 150, height: 150 },
					enableResize: true,
					showZoomer: false
				});
			} else {
				img.unwrap();
				$('.cr-boundary, .cr-slider-wrap').remove();
				cropping = null;
			}
			return cropping;
		},
		save: (blob, path) => {
			let reader = new FileReader();

			reader.onload = () => {
				let base64 = reader.result.split(',')[1],
					buffer = new Buffer(base64, 'base64');
				fs.writeFile(path, buffer, err => {
					err ? console.log(err) : console.log('success');
				})
			};

			reader.readAsDataURL(blob);
		}
	}
}

showVideo = (path, filename) => {
	document.getElementsByTagName('title')[0].innerText = filename;

	img.css('visibility', 'hidden');
	vid.attr('src', path);
	vid.css({ 'visibility': 'visible', 'zIndex': '1' })
}

showImage = (path, filename) => {
	document.getElementsByTagName('title')[0].innerText = filename;

	img.attr('src', path);
	vid.css({ 'visibility': 'hidden', 'zIndex': '-1' })
	img.css('visibility', 'visible');
	vid.attr('src', '');
}
