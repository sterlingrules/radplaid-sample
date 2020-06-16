import URI from 'urijs'
import * as TYPES from './../types.jsx'
import union from 'lodash/union'
import defaults from 'lodash/defaults'
import without from 'lodash/without'
import clone from 'lodash/clone'
import moment from 'moment'
import { isMobile } from './../../helpers/device-detect'
import User from './../../authentication/models/user.jsx'
import { request, requestSimple, requestPublic, requestOnce } from './../../helpers/request.jsx'
import { existsWithKey, getDateRange, getCurrentDate, localStorageExpire, replaceQuery } from './../../helpers'
import { DATE_PATHS, DEBUG, IS_APP } from './../../constants.jsx'
import { LOCATION_FALLBACK } from './../../constants.computed.jsx'
import ShowActions from './shows.jsx'

const updatePushNotificationLocation = ({ userId, name, coords = [] }) => {
	if (typeof window === 'undefined' || typeof OneSignal === 'undefined') {
		return
	}

	let data = {
		locationName: name,
		latitude: coords[0],
		longitude: coords[1],
	}

	if (userId) {
		data.userId = userId
	}

	OneSignal.push(() => {
		OneSignal.sendTags(data)
	})
}

export const initializeSession = (state = true) => {
	return (dispatch, getState) => {
		let { user, userLocation } = getState().app

		dispatch(loggingInUser(false))

		return dispatch({
			type: TYPES.INITIALIZE_SESSION,
			initialized: state
		})
	}
}

export const setConnection = (connection) => {
	return (dispatch, getState) => {
		const prevConnection = getState().app.connection

		if (connection !== prevConnection) {
			dispatch({
				type: TYPES.SET_CONNECTION,
				connection,
			})
		}

		if (!connection) {
			return setTimeout(() => {
				const callback = (err, reply) => {
					let isConnected = !!(reply && reply.status === 200)

					dispatch(setConnection(isConnected))

					if (isConnected) {
						dispatch(loadClear())
					}
				}

				requestSimple('/check-connection')
					.end(callback)
			}, 5000)
		}

		if (!prevConnection && connection) {
			dispatch(clearNotifications())
			dispatch(setNotification({
				status: 'success',
				message: 'Rad Plaid reconnected successfully. Please refresh.',
				action: {
					label: 'Reload',
					icon: 'refresh',
					callback: () => window.location.reload()
				}
			}))
		}
	}
}

export const loggingInUser = (state = false) => {
	return {
		type: TYPES.LOGGING_IN,
		loggingIn: state
	}
}

export const startTutorial = () => {
	return {
		type: TYPES.RUN_TUTORIAL,
		runTutorial: true
	}
}

export const resetHome = () => {
	return (dispatch, getState) => {
		// let uri = new URI()

		let { searchSort, searchDateTo } = getState().app
		let { user } = getState().user
		let { location } = getState().routing
		let { shows, afterPage } = getState().shows
		let pathOptions = union(DATE_PATHS, [ '/' ])

		// Clears if we hit home while on home
		if (pathOptions.indexOf(location.pathname) >= 0 || !shows.length) {
			dispatch(resetSearch())
			dispatch(setSearchLiveStream(''))
			dispatch(ShowActions.apiFetchShowList({
				sort: User.getSort() || searchSort,
				cost: '',
				tag: '',
				venue: '',
				from: getCurrentDate(),
				to: searchDateTo || '',
				livestream: '',
				page: 0
			}, true))
		}
	}
}

export const setIsSearching = (isSearching) => {
	return (dispatch, getState) => {
		let uri = new URI()

		// Clear url params
		if (!isSearching) {
			uri.removeSearch('sort')
			uri.removeSearch('query')
			uri.removeSearch('location')
			uri.removeSearch('venue')
			uri.removeSearch('from')
			uri.removeSearch('to')
			uri.removeSearch('cost')
			uri.removeSearch('tag')
			uri.removeSearch('page')
		}

		dispatch({
			type: TYPES.SET_IS_SEARCHING,
			isSearching,
		})
	}
}

export const setSearchSort = (searchSort = 'all') => {
	return {
		type: TYPES.SET_SEARCH_SORT,
		searchSort,
	}
}

export const setSearchVenue = (searchVenue = '') => {
	return {
		type: TYPES.SET_SEARCH_VENUE,
		searchVenue,
	}
}

export const setSearchLiveStream = (searchLiveStream = '') => ({
	type: TYPES.SET_SEARCH_LIVE_STREAM,
	searchLiveStream,
})

export const setSearchQuery = (query) => {
	return {
		type: TYPES.SET_SEARCH_QUERY,
		searchQuery: query,
	}
}

export const setSearchLocation = (searchLocation) => {
	return {
		type: TYPES.SET_SEARCH_LOCATION,
		searchLocation,
	}
}

export const setSearchDateRange = (range = {}) => {
	let _range = defaults(range, { from: getCurrentDate(), to: '' })

	return {
		type: TYPES.SET_SEARCH_DATE_RANGE,
		from: _range.from,
		to: _range.to,
	}
}

export const setSearchCost = (cost = '') => {
	return {
		type: TYPES.SET_SEARCH_COST,
		cost,
	}
}

export const setSearchTag = (tag = '') => {
	return {
		type: TYPES.SET_SEARCH_TAG,
		tag,
	}
}

export const setInitialSearch = (query) => {
	return {
		type: TYPES.SET_INITIAL_SEARCH,
		...query,
	}
}

export const setUserIp = (ip) => {
	return {
		type: TYPES.SET_USER_IP,
		ip,
	}
}

export const resetSearch = () => {
	return {
		type: TYPES.RESET_SEARCH,
		resetSearch: new Date().getTime(),
	}
}


/**
 * Pushing an in-web-app notification
 *
 * @param messageType {String} - Notification type: success, error, info
 * @param message {String} - Notification body copy
 * @param messageTitle {String} - Notification title
 */
export const setNotification = (message = {}) => {
	return {
		type: TYPES.SET_NOTIFICATION,
		messageId: message.id || new Date().getTime(),
		messageType: message.status,
		messageTitle: message.title,
		message: message.message,
		messageAction: message.action,
		messageSticky: message.sticky,
		messageChildren: message.children
	}
}

export const clearNotifications = () => {
	return {
		type: TYPES.CLEAR_NOTIFICATION
	}
}

export const setHomeTutorial = (runHomeTutorial) => {
	return {
		type: TYPES.RUN_HOME_TUTORIAL,
		runHomeTutorial
	}
}

export const loadClear = () => {
	return {
		type: TYPES.LOAD_END,
		progressStatus: 'success',
		progress: [],
	}
}

export const loadStart = (name = 'app') => {
	return (dispatch, getState) => {
		let progress = clone(getState().app.progress) || []

		if (name) {
			if (progress.indexOf(name) >= 0) {
				return
			}

			progress.push(name)
		}

		return dispatch({
			type: TYPES.LOAD_START,
			progressStatus: '',
			progress
		})
	}
}

export const loadEnd = (err, name = 'app') => {
	return (dispatch, getState) => {
		let progress = clone(getState().app.progress) || []

		if (name && progress.indexOf(name) >= 0) {
			progress = without(progress, name)
		}
		// Clear all loaders
		else {
			progress = []
		}

		return dispatch({
			type: TYPES.LOAD_END,
			progressStatus: err ? 'error' : 'success',
			progress
		})
	}
}

export const setSession = (session = null) => {
	return {
		type: TYPES.SET_SESSION,
		session
	}
}

export const setViewportName = (viewportName = 'large') => {
	return {
		type: TYPES.SET_VIEWPORT_NAME,
		viewportName
	}
}

export const setWindowProps = (props) => {
	let defaultProps = {}

	if (typeof window !== 'undefined') {
		defaultProps.width = window.innerWidth
		defaultProps.height = window.innerHeight
	}

	props = defaults(props, defaultProps)

	return {
		type: TYPES.SET_WINDOW_PROPS,
		windowProps: props
	}
}

export const setWindowLoad = () => {
	return {
		type: TYPES.SET_WINDOW_LOAD,
		windowLoad: true
	}
}

export const setBlogPosts = (blogPosts) => {
	return {
		type: TYPES.SET_BLOG_POSTS,
		blogPosts
	}
}

export const isBrowser = (state = false) => {
	return {
		type: TYPES.IS_BROWSER,
		isBrowser: state
	}
}

/**
 * Claims
 */
export const setClaim = (type, data = {}) => {
	return {
		type: TYPES.SET_CLAIM,
		claim: {
			...data,
			type
		}
	}
}

export const clearClaim = () => {
	return {
		type: TYPES.SET_CLAIM,
		claim: {}
	}
}

/**
 * Set Report
 */
export const setReport = (type, data = {}) => {
	return {
		type: TYPES.SET_CLAIM,
		claim: {
			...data,
			type
		}
	}
}

/**
 * Search Action
 *
 * @param type {String} - The index to search. Default. `shows`
 * @param queryObject {Object} - An object with query params to search
 */
export const apiSearch = (type = 'shows', queryObject) => {
	return (dispatch, getState) => {
		let uri = queryObject ? new URI().setSearch(queryObject) : new URI()
		let { userLocation, ip, progress } = getState().app
		let { shows } = getState().shows
		let initialShowRequest = false
		let query = queryObject || uri.search(true)

		let settings = {
			path: `/search/${type}/${uri.search()}`
		}

		// Let's not start a new search
		// if one is in progress
		if (progress.indexOf('shows') >= 0) {
			return
		}

		if (process.browser) {
			dispatch(loadStart('shows'))
			dispatch(setIsSearching(true))
		}

		//
		// TODO: Clear `showlist` and display a loading message
		//
		if (!queryObject.page) {
			initialShowRequest = true
			dispatch(ShowActions.setShowTitle(''))
			dispatch(ShowActions.updateShowList({}))
		}

		requestPublic(settings)
			.end((err, reply) => {
				if (err) {
					dispatch(loadEnd(err, 'shows'))
					return
				}

				let { body } = reply
				let currentSlugs = initialShowRequest ? [] : shows.map(s => s.slug)

				body.shows = body.shows.filter(s => currentSlugs.indexOf(s.slug) < 0)

				if (query.page > 0) {
					dispatch(ShowActions.appendShowList(body))
				}
				else {
					replaceQuery({ sort: body.sort })

					dispatch(setSearchSort(body.sort))
					dispatch(ShowActions.setShowTitle(body.title))
					dispatch(ShowActions.updateShowList(body))

					if (Array.isArray(body.venues) && body.venues.length > 0) {
						dispatch({
							type: TYPES.SET_VENUES,
							venues: body.venues,
						})
					}
				}

				dispatch(loadEnd(err, 'shows'))
			})
	}
}

export const apiFetchBlogPosts = () => {
	return (dispatch, getState) => {
		requestPublic({ path: '/news' })
			.end((err, reply) => {
				if (err) {
					console.error(err)
				}

				let { body } = reply || {}

				dispatch(setBlogPosts(body))
			})
	}
}

export const apiFetchVenues = () => {
	return (dispatch, getState) => {
		let { venues, userLocation } = getState().app
		let coords = userLocation.coords ? userLocation.coords : []
		let settings = {
			path: `/venues/${coords.join(',')}`,
		}

		// We only need to query this once
		if (!venues || venues.length > 0 || !coords.length) {
			return
		}

		requestPublic(settings)
			.end((err, reply) => {
				if (err) {
					console.error(err)
				}

				if (!reply || !reply.body) {
					return
				}

				let { body } = reply || {}

				return dispatch({
					type: TYPES.SET_VENUES,
					venues: body.venues || []
				})
			})
	}
}

export const apiPostClaim = (claim) => {
	return (dispatch, getState) => {
		let settings = {
			method: 'post',
			path: '/claims',
			data: claim
		}

		request(settings)
			.end((err, reply) => {
				if (err) {
					console.error(err)
				}

				clearClaim()
				dispatch(clearNotifications())
				dispatch(setNotification({
					status: 'info',
					message: 'Claim received! You\'ll hear back from us within 24 hours.'
				}))
			})
	}
}

export const fetchScenes = () => {
	return (dispatch, getState) => {
		let { scenes } = getState().app
		let settings = {
			path: '/scenes'
		}

		if (scenes && scenes.length > 0) {
			return
		}

		requestPublic(settings)
			.end((err, reply) => {
				if (err) {
					console.error(err)
				}

				let { body } = reply

				return dispatch({
					type: TYPES.SET_SCENES,
					scenes: body
				})
			})
	}
}

export const setUserLocation = () => {
	return (dispatch, getState) => {
		if (IS_APP) {
			return
		}

		let { userLocation } = getState().app
		let { user } = getState().user
		let prevUserLocation = User.getLocation()

		// Check and set `prevUserLocation`
		// We want to use geolocation on mobile devices
		// if (existsWithKey(prevUserLocation, 'coords') && !isMobile) {
		if (prevUserLocation &&
			Array.isArray(prevUserLocation.coords) &&
			prevUserLocation.coords.length > 0) {

			// If we already have it in redux, stop
			if (userLocation.name == prevUserLocation.name) {
				return
			}

			return dispatch({
				type: TYPES.SET_USER_LOCATION,
				userLocation: prevUserLocation
			})
		}

		// If we didn't get a set location via IP
		// we'll need to ask the user for their location
		if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
			return
		}

		// Let's not nag for a users location
		// before they've logged in
		// if (!user) {
		// 	return
		// }

		dispatch(loadStart('userLocation'))

		navigator.geolocation.getCurrentPosition((position) => {
			let { latitude, longitude } = position.coords
			let coords = [ latitude, longitude ]
			let settings = {
				path: `/location/${latitude},${longitude}`
			}

			if (!latitude || !longitude) {
				return dispatch(loadEnd(null, 'userLocation'))
			}

			requestOnce(settings)
				.end((err, reply) => {
					dispatch(loadEnd(null, 'userLocation'))

					if (err || !reply) {
						return
					}

					let { body = {} } = reply

					body.coords = coords

					dispatch(clearNotifications())

					// if (location && location.coords.length > 0) {
					if (!prevUserLocation || prevUserLocation.name !== body.name) {
						User.setLocation(body)

						updatePushNotificationLocation({
							...body,
							userId: user ? user.id : null,
						})

						dispatch({
							type: TYPES.SET_USER_LOCATION,
							userLocation: body,
						})
					}
				})

		}, (error) => {
			if (DEBUG) {
				console.error('DEBUG: Error retrieving location ', error)
			}
		})
	}
}
