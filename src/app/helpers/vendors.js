export const loadFreshdeskWidget = (callback) => {
	window.fwSettings = {
		'widget_id': 61000000662,
	}

	const element_id = 'freshdesk-widget'
	const existingScript = document.getElementById(element_id)

	if (existingScript && typeof callback === 'function') {
		return callback()
	}

	const script = document.createElement('script')

	script.src = `https://widget.freshworks.com/widgets/${window.fwSettings.widget_id}.js`
	script.id = element_id

	document.body.appendChild(script)

	script.onload = () => {
		if('function' != typeof window.FreshworksWidget) {
			let n = function () {
				n.q.push(arguments)
			}

			n.q = []
			window.FreshworksWidget = n
		}

		if (typeof callback === 'function') {
			callback()
		}
	}
}

export const unloadLib = (element_id) => {
	const scriptEl = document.getElementById(element_id)

	if (scriptEl) {
		scriptEl.parentNode.removeChild(scriptEl)
	}
}
