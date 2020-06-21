import UAParser from 'ua-parser-js'
import User from './../authentication/models/user.jsx'
import { DEBUG } from './../constants.jsx'
import { isMobile } from './device-detect'

export const getDeviceInfo = () => {
	if (typeof window === 'undefined') {
		return
	}

	const result = new UAParser().getResult()

	const deviceInfo = {
		device_category: isMobile ? 'mobile' : 'desktop',
		os: result.os,
		browser: result.browser
	}

	if (isMobile) {
		deviceInfo.mobile = result.device
	}

	if (DEBUG) {
		console.debug('deviceInfo ', deviceInfo)
	}

	return deviceInfo
}

export const setUser = (id, data) => {
	if (!process.browser || typeof mixpanel === 'undefined') {
		return
	}

	mixpanel.identify(id)
	mixpanel.people.set(data)

	window._sva = window._sva || {}
	window._sva.traits = {
		...data,
		user_id: id,
	}
}

export const register = (data) => {
	if (!process.browser || typeof mixpanel === 'undefined') {
		return
	}

	mixpanel.register(data)

	if (typeof fbq === 'function') {
		fbq('track', 'CompleteRegistration')
	}

	if (typeof gtag === 'function') {
		gtag('event', 'register', {
			event_category: 'engagement',
			event_label: 'register'
		})
	}
}

export const gTagReportConversion = (url) => {
	let callback = () => {
		if (typeof url !== 'undefined') {
			window.location = url
		}
	}

	if (typeof gtag === 'function' && process.env.GA_CONVERSION_ID) {
		gtag('event', 'conversion', {
			'send_to': `${process.env.GA_CONVERSION_ID}/r0A1CNn_mosBENHVovsC`,
			'event_callback': callback
		})
	}

	return false
}

export const t = (data, targets) => {
	if (!process.browser || typeof fetch === 'undefined' || typeof window === 'undefined') {
		return
	}

	delete targets.token

	let token = User.getToken()
	let jwt = token ? token : ''
	let device = btoa(JSON.stringify(getDeviceInfo()))
	let options = {
		headers: {
			'x-radplaid-client-id': process.env.RADPLAID_CLIENT_ID,
			'Authorization': jwt ? `Bearer ${jwt}` : '',
		}
	}

	data = btoa(JSON.stringify(data))
	targets = btoa(JSON.stringify(targets))

	requestAnimationFrame(() => {
		try {
			fetch(`${process.env.BASE_SERVER_URL}/${process.env.API_VERSION}/analytics/track?data=${data}&targets=${targets}&device=${device}`, options)
		} catch (error) {
			console.error(error)
		}
	})
}

/**
 * Mixpanel/Google Analytics Event Tracker
 *
 * @param name {String} - Name/Category of the event
 * @param data {Object}
 *		@param data.action {String} - Required. The type of interaction (e.g. 'play')
 *		@param data.label {String} - Optional. Useful for categorizing events (e.g. 'Fall Campaign')
 *		@param data.value {String} - Optional. Typically the object that was interacted with (e.g. 'Video')
 *		@param data.promoted {String} - Optional. If an event should be billed to the customer
 */
export const track = (name, data = {}) => {
	if (!process.browser || typeof mixpanel === 'undefined') {
		return
	}

	if (name !== 'impression') {
		mixpanel.track(name, data)
	}

	if (DEBUG) {
		// Tracking Warnings
		if (!data.action) {
			console.warn('`:action` param required. The type of interaction (e.g. \'play\')')
		}

		if (!data.label) {
			console.warn('`:label` param recommended. Useful for categorizing events (e.g. \'Fall Campaign\')')
		}

		if (!data.value) {
			console.warn('`:value` param recommended. Typically the object that was interacted with (e.g. \'Video\')')
		}
	}

	// Track plays
	if (name === 'play' && data.action === 'play') {
		t({ action: 'play', type: 'track' }, data)
	}

	if (name && name.indexOf('show_item') >= 0) {
		// Track impressions
		if (data.action === 'impression') {
			t({ action: 'impression', type: 'track', source: 'show_item' }, data)
		}

		// Track tickets
		if (data.action === 'ticket') {
			t({ action: 'ticket', type: 'click', source: 'show_item' }, data)
		}

		// Track follow
		if (data.action === 'follow') {
			t({ action: 'follow', type: 'click', source: 'show_item' }, data)
		}
	}
	else if (name && name.indexOf('show') >= 0) {
		// Track event url
		if (data.action === 'event_url') {
			t({ action: 'event_url', type: 'click', source: 'show' }, data)
		}

		// Track tickets
		if (data.action === 'ticket') {
			t({ action: 'ticket', type: 'click', source: 'show' }, data)
		}

		// Track follow
		if (data.action === 'follow') {
			t({ action: 'follow', type: 'click', source: 'show' }, data)
		}
	}

	if (name === 'share') {
		t({ action: data.action, type: 'click', source: 'show' }, data)
	}

	// Facebook
	if (typeof fbq === 'function' && data.action === 'ticket') {
		fbq('track', 'TicketClick')
	}

	// Google Tag
	if (typeof gtag === 'function') {
		gtag('event', name, {
			event_category: 'engagement',
			event_label: data.action || ''
		})
	}
}

export const timeEvent = (name) => {
	if (!process.browser || typeof mixpanel === 'undefined') {
		return
	}

	mixpanel.time_event(name)
}
