export const isMobile = (() => {
	if (typeof navigator === 'undefined') {
		return false
	}

	return (
		navigator.userAgent.match(/Android/i) ||
		navigator.userAgent.match(/webOS/i) ||
		navigator.userAgent.match(/iPhone/i) ||
		navigator.userAgent.match(/iPad/i) ||
		navigator.userAgent.match(/iPod/i) ||
		navigator.userAgent.match(/BlackBerry/i) ||
		navigator.userAgent.match(/Windows Phone/i)
	)
})()

export const isAndroid = (() => {
	if (typeof navigator === 'undefined') {
		return false
	}

	return (/Mobi|Android/i.test(navigator.userAgent))
})

export const isiOS = (() => {
	if (typeof navigator === 'undefined') {
		return false
	}

    return (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream)
})()

export const getChromeVersion = () => {
	const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)
	return raw ? parseInt(raw[2], 10) : false
}
