/**
 * Simple code to be quickly loaded in the header
 */

window.IS_LOADED = false

const getQuery = (param) => {
	let params = window.location.search.substr(1).split('&')
	let p

	for (let i = 0; i < params.length; i++) {
		p = params[i].split('=');

		if (p[0] == param) {
			return decodeURIComponent(p[1]);
		}
	}

	return undefined;
}

const isiOS = () => {
	if (typeof navigator === 'undefined') {
		return false
	}

    return (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream)
}

const setViewport = () => {
	if (typeof window === 'undefined') {
		return
	}

	let viewportWidth = window.innerWidth
	let viewportClass = 'large'

	if (viewportWidth < 1024 && viewportWidth >= 768) {
		viewportClass = 'medium'
	}
	else if (viewportWidth < 768) {
		viewportClass = 'small'
	}

	// Clear last viewportName
	document.documentElement.classList.remove('large', 'medium', 'small')
	document.documentElement.classList.add(viewportClass)
}

const setDeviceType = () => {
	if (typeof window === 'undefined') {
		return
	}

	document.documentElement.classList.add(('ontouchstart' in document.documentElement) ? 'touch' : 'no-touch')
}

const cleanRoute = () => {
	if (typeof window === 'undefined') {
		return
	}

	let { pathname, search } = window.location

	// Clean any malformed pathnames
	if (pathname && pathname.search(/\/{2,}/g) >= 0) {
		window.location.href = `${pathname.replace(/\/{2,}/g, '/')}${search || ''}`
	}
}

const openApp = () => {
	if (typeof window === 'undefined' || !isiOS()) {
		return
	}

	const param = getQuery('open-app')

	if (typeof param !== 'undefined') {
		window.location = `radplaid://${param}`
		window.history.replaceState({}, '', window.location.pathname)
	}
}

(() => {
	if (typeof window === 'undefined') {
		return
	}

	cleanRoute()

	setViewport()
	setDeviceType()

	// Are we trying to open the mobile app?
	openApp()

	window.addEventListener('resize', () => {
		setViewport()
		setDeviceType()
	}, false)
})()
