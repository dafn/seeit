exports.zoom = value => {
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

			document.getElementById('id').style.top = '50%';
			document.getElementById('id').style.left = '50%';

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
	document.getElementsByTagName('img')[0].src = ""; // remove flickering when switching image after move
	document.getElementsByTagName('img')[0].src = path;

	document.getElementsByTagName('video')[0].style.zIndex = '-1';
	document.getElementsByTagName('video')[0].style.visibility = 'hidden';
	document.getElementsByTagName('img')[0].style.visibility = 'visible';

	
}