document.ondragover = e => e.preventDefault();
document.ondrop = e => e.preventDefault();

var imageTypes = ['.jpg', '.png', '.jpeg', '.gif'],
	extention;

const args = require('electron').remote.process.argv,
	path = require('path'),
	holder = document.getElementById('holder'),
	fs = require('fs');

fs.readdir(args[2], (err, content) => {

	files = iterator(content);
	zoom = zoom(100);

	do { extention = files.next(); }
	while (imageTypes.indexOf(path.extname(extention)) === -1);
	holder.style.backgroundImage = `url('${args[2]}${extention}')`;

	document.onkeydown = event => {
		if (event.code === 'ArrowRight') {
			do { extention = files.next(); }
			while (imageTypes.indexOf(path.extname(extention)) === -1);

			holder.style.backgroundImage = `url('${args[2]}${extention}')`;
			zoom.reset();

		} else if (event.code === 'ArrowLeft') {
			do { extention = files.prev(); }
			while (imageTypes.indexOf(path.extname(extention)) === -1);

			holder.style.backgroundImage = `url('${args[2]}${extention}')`;
			zoom.reset();
		}
	}
	document.onmousewheel = event => {
		(event.wheelDelta > 0) ? zoom.up() : zoom.down();
	}
});

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
			holder.style.height = `${size}%`;
			holder.style.width = `${size}%`;
		},
		down: () => {
			size -= 10;
			holder.style.height = `${size}%`;
			holder.style.width = `${size}%`;
		},
		reset: () => {
			size = value;
			holder.style.height = '100%';
			holder.style.width = '100%';
		}
	}
}