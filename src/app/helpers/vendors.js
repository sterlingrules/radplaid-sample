// class LoadWidget {
// 	constructor(props) {
// 		super(props)

// 		window.fwSettings = {}

// 		this.element_id = props.element_id
// 		this.existingScript = document.getElementById(element_id)
// 		this.src = props.src

// 		this.init()
// 	}

// 	init() {

// 	}
// }

// class loadFreshdesk extends LoadWidget {

// }

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

// export const loadFreshchatWidget = (callback) => {
// 	<script>
// 	  function initFreshChat() {
// 	    window.fcWidget.init({
// 	      token: "6adc066b-2967-4f7b-9654-8bbcf69c2770",
// 	      host: "https://wchat.freshchat.com"
// 	    });
// 	  }
// 	  function initialize(i,t){var e;i.getElementById(t)?initFreshChat():((e=i.createElement("script")).id=t,e.async=!0,e.src="https://wchat.freshchat.com/js/widget.js",e.onload=initFreshChat,i.head.appendChild(e))}function initiateCall(){initialize(document,"freshchat-js-sdk")}window.addEventListener?window.addEventListener("load",initiateCall,!1):window.attachEvent("load",initiateCall,!1);
// 	</script>
// }

export const unloadLib = (element_id) => {
	const scriptEl = document.getElementById(element_id)

	if (scriptEl) {
		scriptEl.parentNode.removeChild(scriptEl)
	}
}
