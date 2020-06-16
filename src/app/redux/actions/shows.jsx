import URI from 'urijs'
import clone from 'lodash/clone'
import flatten from 'lodash/flatten'
import defaults from 'lodash/defaults'
import isFunction from 'lodash/isFunction'
import isEqual from 'lodash/isEqual'
import keys from 'lodash/keys'
import { isMobile } from './../../helpers/device-detect'
import * as TYPES from './../types.jsx'
import User from './../../authentication/models/user.jsx'
import * as AppActions from './../actions/app.jsx'
import UserActions from './../actions/user.jsx'
import { DEBUG } from './../../constants.jsx'
import { LOCATION_FALLBACK, DEFAULT_SHOWS } from './../../constants.computed.jsx'
import { delay, existsWithKey, distance, getCurrentDate, replaceQuery } from './../../helpers'
import { request, requestPublic, upload } from './../../helpers/request.jsx'
import { track } from './../../helpers/analytics.jsx'
import ShowModel from './../../shows/models/shows.jsx'
import UserModel from './../../authentication/models/user.jsx'
import store from './../store.jsx'

//
// Helpers
//
const filterCurrentShows = (currentShows, shows) => {
	let currentSlugs = []

	currentShows.forEach(show => {
		if (Array.isArray(show)) {
			currentSlugs.push(show.map(s => s.slug && s.slug))
		}
		else if (show.slug) {
			currentSlugs.push(show.slug)
		}
		else if (show.type === 'title') {
			currentSlugs.push(show.value)
		}
	})

	currentSlugs = flatten(currentSlugs)

	shows = shows.filter(show => {
		if (Array.isArray(show)) {
			show = show.filter(s => {
				return (currentSlugs.indexOf(s.slug) < 0)
			})

			return show
		}

		if (show.type === 'title') {
			return (currentSlugs.indexOf(show.value) < 0)
		}

		return (currentSlugs.indexOf(show.slug) < 0)
	})

	return { shows, currentSlugs }
}

const setFeaturedShow = (featuredShows, shows, currentSlugs = []) => {
	if (!featuredShows.length) {
		return shows
	}

	featuredShows = featuredShows.filter(s => (currentSlugs.indexOf(s.slug) < 0))

	if (featuredShows.length > 0) {
		let showIndex = 0
		let randomIndex = Math.floor(Math.random() * featuredShows.length)

		for (let i = 0; i < shows.length; i++) {
			if (showIndex === 1) {
				featuredShows[randomIndex].type = 'promoted'
				shows = shows.filter(s => s.slug !== featuredShows[randomIndex].slug)
				shows.splice(i, 0, featuredShows[randomIndex])
				break
			}

			if (shows[i].type === 'show') {
				showIndex++
			}
		}
	}

	return shows
}

const getUserTabFromPath = (pathname) => {
	if (pathname.search('profile') === -1) {
		return false
	}

	if (pathname.search('attending') >= 0) {
		return 'attending'
	}
	else if (pathname.search('following') >= 0) {
		return 'following'
	}
	else if (pathname.search('managing') >= 0) {
		return 'managing'
	}
}

//
// Shows
//
const ShowActions = {
	prevShowListQuery: {},
	progressQuiet: false,

	setAdminVisible: (isAdminVisible = false) => {
		return {
			type: TYPES.SET_ADMIN_VISIBLE,
			isAdminVisible,
		}
	},

	setActiveShow: (activeShow) => {
		return {
			type: TYPES.SET_ACTIVE_SHOW,
			activeShow,
		}
	},

	setEditShow: (editShow) => {
		return {
			type: TYPES.SET_EDIT_SHOW,
			editShow,
		}
	},

	setShowTitle: (title = '') => {
		return {
			type: TYPES.SET_SHOW_TITLE,
			title,
		}
	},

	setShowSort: (showsSort = '') => {
		return {
			type: TYPES.SET_SHOW_SORT,
			showsSort,
		}
	},

	updateActiveShow: (activeShow) => {
		return {
			type: TYPES.UPDATE_ACTIVE_SHOW,
			activeShow,
		}
	},

	updateShowList: ({ shows = [], location = null, map, total, sort, after, afterPage, searchPage, isEnd, summary, noShows }) => {
		return {
			type: TYPES.UPDATE_SHOWLIST,
			shows,
			showsLocation: location,
			showsTotal: total,
			showsSort: sort,
			map,
			noShows,
			after,
			afterPage,
			searchPage,
			isEnd,
			summary,
		}
	},

	updateFeaturedShowList: (featuredShows = []) => {
		return {
			type: TYPES.SET_FEATURED_SHOWS,
			featuredShows
		}
	},

	updatePopularShowList: (popularShows = []) => {
		return {
			type: TYPES.SET_POPULAR_SHOWS,
			popularShows
		}
	},

	appendShowList: ({ shows, total, location, after, afterPage, searchPage, isEnd, summary }) => {
		return {
			type: TYPES.APPEND_SHOWLIST,
			shows,
			showsTotal: total,
			showsLocation: location,
			after,
			afterPage,
			searchPage,
			isEnd,
			summary
		}
	},

	clearAddShow: () => {
		return {
			type: TYPES.UPDATE_ADD_SHOW,
			addShow: DEFAULT_SHOWS.addShow
		}
	},

	updateAddShow: (data) => {
		return (dispatch, getState) => {
			let addShow = clone(getState().shows.addShow)

			addShow = defaults(data, addShow)

			dispatch({
				type: TYPES.UPDATE_ADD_SHOW,
				addShow
			})
		}
	},

	updateEditShow: (data) => {
		return (dispatch, getState) => {
			let editShow = clone(getState().shows.editShow)

			editShow = defaults(data, editShow)

			dispatch({
				type: TYPES.UPDATE_EDIT_SHOW,
				editShow
			})
		}
	},

	updateShowById: (show) => {
		return (dispatch, getState) => {
			let { activeShow, featuredShows, similarShows } = getState().shows
			let { shows, showsLocation, map, showsTotal, after, afterPage, isEnd, noShows, summary } = getState().shows
			let _similarShows = clone(similarShows || {})
			let _featuredShows = clone(featuredShows)
			let _shows = clone(shows)

			activeShow = activeShow || {}

			// Update Shows
			for (let i = 0; i < _shows.length; i++) {
				if (_shows[i].id == show.id) {
					_shows[i] = defaults(show, _shows[i])
					break
				}
			}

			// Update Featured Shows
			for (let i = 0; i < _featuredShows.length; i++) {
				if (_featuredShows[i].id == show.id) {
					_featuredShows[i] = defaults(show, _featuredShows[i])
					break
				}
			}

			// Update Similar Shows
			let _keys = keys(_similarShows)

			for (let i = 0; i < _keys.length; i++) {
				if (Array.isArray(_similarShows[_keys[i]])) {
					for (let j = 0; j < _similarShows[_keys[i]].length; j++) {
						if (_similarShows[_keys[i]][j].id === show.id) {
							_similarShows[_keys[i]][j] = defaults(show, _similarShows[keys[i]][j])
							break
						}
					}
				}
			}

			if (activeShow.id == show.id) {

				// Let's retain the `event_url_metadata`
				// without having to query for it again
				if (existsWithKey(activeShow, 'event_url_metadata')) {
					show.event_url_metadata = activeShow.event_url_metadata
				}

				dispatch(ShowActions.updateActiveShow(show))
			}

			dispatch(ShowActions.updateFeaturedShowList(_featuredShows))

			dispatch({
				type: TYPES.SET_SHOWLIST,
				shows: _shows,
			})

			dispatch({
				type: TYPES.SET_SIMILAR_SHOWS,
				similarShows: _similarShows,
			})
		}
	},

	deleteShow: (slug, title) => {
		return (dispatch, getState) => {
			let { shows, showsLocation, map, showsTotal, after, afterPage, searchPage, isEnd, noShows } = getState().shows
			let _shows = clone(shows || [])

			dispatch({ type: TYPES.DELETE_SHOW, id: slug })
			dispatch(AppActions.setNotification({
				status: 'success',
				title: 'Show Deleted',
				message: `'${title || ''}' event deleted successfully`
			}))

			if (Array.isArray(_shows)) {
				for (let i = 0; i < _shows.length; i++) {
					if (_shows[i].slug === slug) {
						_shows.splice(i, 1)
					}

					if (Array.isArray(_shows[i])) {
						for (let j = 0; j < _shows[i].length; j++) {
							if (_shows[i][j].slug === slug) {
								_shows[i].splice(j, 1)
							}
						}
					}
				}

				dispatch(ShowActions.updateShowList({
					shows: _shows,
					showsLocation,
					showsTotal,
					map,
					after,
					afterPage,
					searchPage,
					isEnd,
					noShows
				}))
			}
		}
	},

	//
	// API CALLS
	//
	apiDeleteShow: (slug, title, callback) => {
		return (dispatch, getState) => {
			if (!slug) {
				return
			}

			let question = confirm('Are you sure you want to delete this show?')

			if (question) {
				dispatch(AppActions.loadStart())

				request({
						path: `/shows/${slug}`,
						method: 'del'
					})
					.end((err, reply) => {
						dispatch(AppActions.loadEnd(err))

						if (err) return

						dispatch(ShowActions.deleteShow(slug, title))
						dispatch(AppActions.resetSearch())
					})
			}

			if (typeof callback === 'function') {
				callback()
			}
		}
	},

	// apiFetchFeaturedShows: () => {
	// 	return (dispatch, getState) => {
	// 		let uri = new URI('/')
	// 		let { userLocation } = getState().app
	// 		let coords = userLocation.coords || LOCATION_FALLBACK
	// 		let query = {
	// 			from: getCurrentDate(),
	// 			coords: coords.join(',')
	// 		}

	// 		dispatch(AppActions.loadStart('featured'))

	// 		request({ path: `/shows/featured${uri.setSearch(query).search()}` })
	// 			.end((err, reply) => {
	// 				dispatch(AppActions.loadEnd(err, 'featured'))

	// 				if (err || !reply) {
	// 					return
	// 				}

	// 				let { body } = reply || {}

	// 				return dispatch(ShowActions.updateFeaturedShowList(body.shows))
	// 			})
	// 	}
	// },

	apiFetchPopularShows: (callback) => {
		return (dispatch, getState) => {
			let uri = new URI('/')
			let { userLocation } = getState().app
			let coords = userLocation.coords || LOCATION_FALLBACK
			let query = {
				from: getCurrentDate(),
				coords: coords.join(',')
			}

			dispatch(AppActions.loadStart('popular'))

			request({ path: `/shows/popular${uri.setSearch(query).search()}` })
				.end((err, reply) => {
					dispatch(AppActions.loadEnd(err, 'popular'))

					if (err || !reply) {
						return
					}

					let { body } = reply || {}

					dispatch(ShowActions.updatePopularShowList(body.shows))

					if (isFunction(callback)) {
						callback()
					}
				})
		}
	},

	apiFetchShowList: (query = {}, recache = false) => {
		return (dispatch, getState) => {
			let uri = new URI()
			let { searchLocation, searchSort, userLocation, ip, progress, connection } = getState().app
			let { shows, featuredShows = [], searchPage = 0 } = getState().shows
			let { user } = getState().user
			let initialShowRequest = (!query.page)
			let show

			if (!connection) {
				return
			}

			query.searchPage = searchPage || 0

			// New users need a fresh cache
			if (recache) {
				query.recache = recache
			}

			// Format location
			if (searchLocation !== '') {
				query.location = searchLocation
			}
			else if (
				Array.isArray(userLocation.coords) &&
				userLocation.coords.length) {
				query.coords = userLocation.coords.join(',')
			}
			else if (ip) {
				query.ip = ip
			}

			// Set sort
			if (searchSort) {
				query.sort = searchSort
			}

			// We're searching the same shit, so let's not do it again
			if (progress.indexOf('shows') >= 0 && isEqual(query, ShowActions.prevShowListQuery)) {
				return
			}

			// Start loading
			dispatch(AppActions.loadStart('shows'))
			dispatch(AppActions.setIsSearching(false))
			ShowActions.prevShowListQuery = clone(query)

			// Clear `showlist` before fetching
			if (initialShowRequest) {
				query.limit = 5
				dispatch(ShowActions.updateShowList({}))
			}

			ShowModel.get(null, query, recache)
				.end((err, reply) => {
					ShowActions.prevShowListQuery = {}

					if (err) {
						return dispatch(AppActions.loadEnd(err, 'shows'))
					}

					let { body } = reply
					let currentSlugs = []

					// Set featured shows
					if (Array.isArray(body.featured) && body.featured.length > 0 &&
						Array.isArray(featuredShows) && !featuredShows.length) {
						dispatch(ShowActions.updateFeaturedShowList(body.featured))
					}

					if (!initialShowRequest) {
						let _body = filterCurrentShows(shows, body.shows)

						body.shows = _body.shows
						currentSlugs = _body.currentSlugs || []
					}

					featuredShows = getState().shows.featuredShows || []
					body.shows = setFeaturedShow(featuredShows, body.shows, currentSlugs)

					// Clear showlist if new search and we haven't scrolled to the bottom
					if (!query.page && !isEqual(query, ShowActions.prevShowListQuery)) {
						dispatch(ShowActions.setShowTitle(''))
					}

					// Appending
					if (query.page) {
						dispatch(ShowActions.appendShowList(body))
						dispatch(AppActions.loadEnd(err, 'shows'))
						return
					}

					// Correct sort if different
					// if (searchSort !== body.sort) {
					// 	dispatch(AppActions.setSearchSort(body.sort))
					// }

					dispatch(AppActions.setSearchSort(body.sort))

					if (user && query.sort === 'best' && body.sort === 'all') {
						User.setSort(body.sort)
						replaceQuery({ sort: body.sort })

						if (user.username) {
							dispatch(AppActions.clearNotifications())
							dispatch(AppActions.setNotification({
								status: 'info',
								title: 'All Events',
								message: 'Select more genres to improve your show recommendations!',
								action: {
									label: 'Select Genres',
									icon: 'chevron',
									callback: (history) => history.push('?modal=editprofile&step=2')
								}
							}))
						}
					}

					// Set initial Shows
					dispatch(ShowActions.updateShowList(body))

					dispatch(AppActions.loadEnd(err, 'shows'))
				})
		}
	},

	apiShowAction: (slug, action = 'follow') => {
		return (dispatch, getState) => {
			let { user } = getState().user
			let { after, afterPage } = getState().shows
			let { connection, progress } = getState().app
			let { pathname } = getState().routing.location
			let userTab = getUserTabFromPath(pathname)
			let settings = {
				path: `/shows/${slug}/${action}/${user.id}`,
				method: 'post'
			}

			if (!connection || progress.indexOf('showaction') >= 0 || !slug) {
				return
			}

			const ACTION_MESSAGES = {
				add: 'Rad! We\'ll keep you updated',
				remove: 'This show has been unfollowed',
			}

			dispatch(AppActions.loadStart('showaction'))

			request(settings)
				.end((err, reply) => {
					dispatch(AppActions.loadEnd(err, 'showaction'))

					if (err) return

					let { body } = reply || {}
					let { method, show } = body
					let _userShows

					if (Array.isArray(show.following)) {
						for (let i = 0; i < show.following.length; i++) {
							if (show.following[i].id === user.id) {
								show.following[i] = user
								break
							}
						}
					}

					dispatch(ShowActions.updateShowById({
						id: show.id,
						following_users: show.following_users,
						following: show.following,
					}))

					dispatch(AppActions.clearNotifications())
					dispatch(AppActions.setNotification({
						status: 'success',
						message: ACTION_MESSAGES[method],
						// title: (method === 'add') ? 'Following' : 'Unfollowed'
					}))

					dispatch(UserActions.apiFetchShowList({
						user_id: user.id,
						action: 'following',
						from: getCurrentDate()
					}))
				})
		}
	},

	apiFetchReasonsYouCare: () => {
		return (dispatch, getState) => {
			let user = getState().user.user || UserModel.get()
			let { activeShow } = getState().shows
			let { connection, progress } = getState().app
			let settings = {}

			if (!connection || progress.indexOf('ryc') >= 0) {
				return
			}

			if (!activeShow) {
				return
			}

			dispatch(AppActions.loadStart('ryc'))

			settings.path = `/shows/${activeShow.slug}/ryc/${user ? user.id : ''}`

			request(settings)
				.end((err, reply) => {
					dispatch(AppActions.loadEnd(err, 'ryc'))

					let { body } = reply || {}
					let _show = clone(activeShow)

					_show = defaults(body, _show)

					dispatch(ShowActions.updateActiveShow(_show))
				})
		}
	},

	// apiFetchShowStats: (slug) => {
	// 	return (dispatch, getState) => {
	// 		const settings = {
	// 			path: `/shows/${slug}/analytics`
	// 		}

	// 		request(settings)
	// 			.end((err, reply) => {
	// 				dispatch(AppActions.loadEnd(err, 'ryc'))

	// 				let { body } = reply || {}
	// 				let _show = clone(activeShow)

	// 				_show = defaults(body, _show)

	// 				dispatch(ShowActions.updateActiveShow(_show))
	// 			})
	// 	}
	// },

	apiFetchShowById: (slug, query = {}) => {
		return (dispatch, getState) => {
			let { shows, user, activeShow, isAdminVisible } = getState().shows
			let { connection, progress } = getState().app
			// let recache = (typeof window !== 'undefined' && localStorage.getItem(`recache:${slug}`))
			// let query = {}
			let show

			if (!connection || progress.indexOf('activeshow') >= 0) {
				return
			}

			if (process.browser) {
				dispatch(AppActions.loadStart('activeshow'))
			}

			if (activeShow && activeShow.slug !== slug) {
				dispatch(ShowActions.setActiveShow(null))
			}

			// if (recache) {
			// 	query.recache = recache
			// }

			// Check store
			if (shows) {
				if (shows.length) {
					for (let i = 0; i < shows.length; i++) {
						if (shows[i].slug == slug) {

							show = shows[i]

							dispatch(AppActions.loadEnd(null, 'activeshow'))
							dispatch(ShowActions.setActiveShow(show))
						}
					}
				}
			}

			// Not in store already
			// find from server
			ShowModel.get(slug, query)
				.end((err, reply) => {
					dispatch(AppActions.loadEnd(err, 'activeshow'))

					if (!reply) {
						return
					}

					// if (process.browser) {
					// 	localStorage.removeItem(`recache:${slug}`)

					// 	if (err || reply.status === '404') {
					// 		return dispatch(ShowActions.setActiveShow({
					// 			slug: '404',
					// 			lineup: [],
					// 			venue: null,
					// 			organizer: {
					// 				id: null
					// 			}
					// 		}))
					// 	}
					// }

					if (err || reply.status === '404') {
						return dispatch(ShowActions.setActiveShow({
							slug: '404',
							lineup: [],
							venue: null,
							organizer: {
								id: null
							}
						}))
					}

					let { body } = reply
					let activeShow = body.length ? body[0] : body

					dispatch(ShowActions.setActiveShow(activeShow))
				})
		}
	},

	apiFetchSimilar: () => {
		return (dispatch, getState) => {
			let { activeShow } = getState().shows
			let { connection, progress } = getState().app

			if (!connection || progress.indexOf('fetch-similar') >= 0) {
				return
			}

			if (!activeShow) {
				return
			}

			dispatch(AppActions.loadStart('fetch-similar'))

			requestPublic({
				path: `/shows/${activeShow.slug}/similar`,
			})
			.end((err, data) => {
				dispatch(AppActions.loadEnd(err, 'fetch-similar'))

				if (err || !data.body || data.body.status === 'error') {
					return
				}

				const { shows = {} } = data.body || {}

				dispatch({
					type: TYPES.SET_SIMILAR_SHOWS,
					similarShows: shows,
				})
			})
		}
	},

	apiFetchEventUrlMetadata: () => {
		return (dispatch, getState) => {
			let { activeShow } = getState().shows
			let { connection } = getState().app

			if (!connection) {
				return
			}

			if (!activeShow) {
				return
			}

			let { event_url, event_url_metadata } = activeShow
			let _activeShow = clone(activeShow)

			if (!event_url || event_url_metadata) {
				return
			}

			if (ShowActions.progressQuiet) {
				return
			}

			ShowActions.progressQuiet = true

			// Allows us to query metadata
			// after we have a show
			requestPublic({
				method: 'post',
				path: `/meta/`,
				data: {
					url: encodeURIComponent(event_url)
				}
			})
			.end((err, data) => {
				if (err || !data.body || data.body.status === 'error') {
					return
				}

				ShowActions.progressQuiet = false

				_activeShow = clone(activeShow)
				_activeShow.event_url_metadata = data.body

				dispatch(ShowActions.updateActiveShow(_activeShow))
			})
		}
	}
}

export default ShowActions
