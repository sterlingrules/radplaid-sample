import URI from 'urijs'
import clone from 'lodash/clone'
import union from 'lodash/union'
import isFunction from 'lodash/isFunction'
import isObject from 'lodash/isObject'
import isEqual from 'lodash/isEqual'
import moment from 'moment-timezone'
import User from './../../authentication/models/user.jsx'
import { delay, logError, localStorageExpire, getCurrentDate, cleanUser } from './../../helpers'
import { track, setUser, register } from './../../helpers/analytics.jsx'
import { request, requestPublic, requestOnce } from './../../helpers/request.jsx'
import { FOLLOWING_KEY, TIMEZONE_LOCALES } from './../../constants.jsx'
import * as TYPES from './../types.jsx'
import * as AppActions from './app.jsx'
import ShowActions from './shows.jsx'
import PlayerActions from './player.jsx'

moment.tz.load(TIMEZONE_LOCALES)

const UserActions = {
	prevShowListQuery: {},

	setUser(user) {
		return {
			type: TYPES.SET_USER,
			user
		}
	},

	setProfile(profile) {
		return {
			type: TYPES.SET_PROFILE,
			profile
		}
	},

	updateShowList: (action, { shows, total, after, isEnd }) => {
		User.setFollowing({ shows, total, after, isEnd })

		return {
			type: TYPES.UPDATE_USER_SHOWLIST,
			[action]: shows,
			[`${action}Total`]: total,
			[`${action}After`]: after,
			[`${action}IsEnd`]: isEnd
		}
	},

	appendShowList: (action, { shows, total, after, isEnd }) => {
		return (dispatch, getState) => {
			let _previousShows = clone(getState().user[action] || [])
			let _shows = union(_previousShows, shows)

			return dispatch({
				type: TYPES.APPEND_USER_SHOWLIST,
				[action]: _shows,
				[`${action}Total`]: total,
				[`${action}After`]: after,
				[`${action}IsEnd`]: isEnd
			})
		}
	},

	loginUser(user, jwt) {
		return {
			type: TYPES.LOGIN,
			user,
			jwt,
		}
	},

	loginFacebookUser(user) {
		let token = User.getToken()
		let settings = {
			method: 'post',
			path: '/auth/facebook',
			data: { user }
		}

		return (dispatch, getState) => {
			const { userLocation } = getState().app

			dispatch(AppActions.loadStart())

			if (user && isObject(userLocation) && userLocation.id) {
				settings.data = {
					user: {
						...user,
						scenes: [{
							id: userLocation.id,
						}],
					},
				}
			}

			if (token) {
				return User.set(token)
					.then((user) => {
						dispatch(AppActions.loadEnd())
						dispatch(UserActions.loginUser(user))
						dispatch(AppActions.initializeSession())
					})
			}

			requestOnce(settings)
				.end((err, reply) => {
					if (err || !reply) {
						return
					}

					let { body } = reply

					dispatch(AppActions.loadEnd())

					if (!body.jwt) {
						return
					}

					User.set(body.jwt)
						.then((user) => {
							dispatch(AppActions.loadEnd())
							dispatch(UserActions.loginUser(user))
							dispatch(AppActions.initializeSession())
						})
				})
		}
	},

	sendLoginToken(email) {
		let settings = {
			method: 'post',
			path: `/auth/send-token`,
			data: {
				user: email
			}
		}

		return (dispatch, getState) => {
			dispatch(AppActions.loadStart())

			requestOnce(settings)
				.end((err, reply) => {
					if (err || !reply) {
						return
					}

					let { body } = reply

					dispatch(AppActions.loadEnd())

					if (body.user) {
						setUser(body.user.id, {
							"$created": body.user.createdAt,
							"$last_login": new Date(),
							"$email": body.user.email
						})
					}
				})
		}
	},

	verifyLoginToken(token, uid) {
		let settings = {
			path: `/auth/verify-token?token=${token}&uid=${uid}`
		}

		return (dispatch, getState) => {
			dispatch(AppActions.loadStart())

			requestPublic(settings)
				.end((err, reply) => {

					console.log('body ', reply.body)

					if (err || !reply) {
						dispatch(AppActions.initializeSession())
						dispatch(AppActions.loadEnd())
						dispatch(AppActions.clearNotifications())
						dispatch(AppActions.setNotification({
							status: 'error',
							title: 'Error signing in',
							message: 'Your log in link may have already been used, or expired.'
						}))

						return
					}

					let { body } = reply

					User.set(body.jwt)
						.then((user) => {
							dispatch(AppActions.loadEnd())
							dispatch(UserActions.loginUser(user))
							dispatch(AppActions.initializeSession())
						})
				})
		}
	},

	logoutUser() {
		let token = User.getToken()
		let settings = {
			path: `/logout`
		}

		if (!User.getToken()) {
			User.clear()
		}

		if (typeof FB !== 'undefined' &&
			typeof window !== 'undefined' &&
			FB.hasOwnProperty('logout') &&
			window.location.protocol.indexOf('https') >= 0) {
			FB.getLoginStatus((reply) => {
				if (reply.status === 'connected') {
					FB.logout()
				}
			})
		}

		return (dispatch, getState) => {
			dispatch({
				type: TYPES.LOGOUT,
				user: null
			})

			dispatch(AppActions.clearNotifications())
			dispatch(PlayerActions.stopPlayer())
			dispatch(ShowActions.setShowTitle(''))
			dispatch(ShowActions.updateShowList({}))

			dispatch(ShowActions.apiFetchShowList({
				from: getCurrentDate()
			}))

			if (!token) {
				return User.clear()
			}

			request(settings)
				.end((err, reply) => {
					User.clear()
				})
		}
	},

	updateUser(user, recache = false) {
		return (dispatch, getState) => {
			let { searchDateFrom, searchDateTo } = getState().app
			let token = User.getToken()
			let settings = {
				path: `/users/${user.id}`,
				method: 'put',
				data: {
					user: user
				}
			}

			// Update meta data
			settings.data.user.time_zone = moment.tz.guess()

			settings.data.token = token

			dispatch(AppActions.clearNotifications())
			dispatch(AppActions.loadStart())

			requestOnce(settings).end((err, reply) => {
				if (typeof window !== 'undefined' &&
					typeof window.ReactNativeWebView !== 'undefined' &&
					isFunction(window.ReactNativeWebView.postMessage)) {
					window.ReactNativeWebView.postMessage('user-profile-complete')
					return dispatch(UserActions.logoutUser())
				}

				if (err || !reply) {
					return logError(err)
				}

				let _user = reply.body.user
				let { token } = reply.body

				User.save({ user: _user })

				dispatch(UserActions.setUser(user))
				dispatch(UserActions.loginUser(_user))

				dispatch(AppActions.loadEnd(err))
				dispatch(AppActions.setNotification({
					status: 'success',
					message: 'Profile has been updated successfully!',
					action: {
						label: 'View',
						icon: 'chevron',
						callback: () => {
							window.location.href = `/profile/${user.id}/following`
							return
						}
					}
				}))

				// Update users sort
				User.setSort('best')
				dispatch(AppActions.setSearchSort('best'))

				// Reset feed on user update
				dispatch(ShowActions.setShowTitle(''))
				dispatch(ShowActions.updateShowList({}))
				dispatch(ShowActions.apiFetchShowList({
					sort: 'best',
					from: getCurrentDate(),
					to: searchDateTo
				}, recache))

				// Update Mixpanel profile
				register(cleanUser(_user))
			})
		}
	},

	updateUserPassive(user) {
		return (dispatch, getState) => {
			let token = User.getToken()
			let settings = {
				path: `/users/${user.id}`,
				method: 'put',
				data: {
					user: user
				}
			}

			// Update meta data
			settings.data.token = token

			request(settings).end((err, reply) => {
				let { user } = reply.body

				User.save({ user })

				dispatch(UserActions.setUser(user))

				// Update Mixpanel profile
				register(cleanUser(user))
			})
		}
	},


	//
	// API CALLS
	//
	apiFetchProfile: (user_id = null) => {
		return (dispatch, getState) => {
			let settings = {
				path: `/users/${user_id}`,
			}

			// Start loading
			dispatch(AppActions.loadStart('userprofile'))

			request(settings)
				.end((err, reply) => {
					if (err || !reply || !reply.body) {
						return
					}

					dispatch(AppActions.loadEnd(err, 'userprofile'))
					dispatch(UserActions.setProfile(reply.body))
				})
		}
	},

	apiFetchSimilarGenres: (genres = [], callback) => {
		return (dispatch, getState) => {
			let settings = {
				path: `/genres/similar`,
				method: 'post',
				data: { genres }
			}

			request(settings)
				.end((err, reply) => {
					dispatch({
						type: TYPES.SET_SIMILAR_GENRES,
						...reply.body
					})

					if (isFunction(callback)) {
						callback(reply.body._genres)
					}
				})
		}
	},

	apiFetchShowList: (query = {}, passive = false) => {
		let uri = new URI('/')
		let initialShowRequest = (query.from === getCurrentDate())
		let settings

		const _time = (date) => {
			return new Date(date).getTime()
		}

		uri.setSearch(query)

		return (dispatch, getState) => {
			let { progress, isSearching, connection } = getState().app
			let { following = [] } = getState().user
			let shows = getState().user[query.action]
			let followingCache = User.getFollowing()

			if (!connection) {
				return
			}

			settings = {
				path: `/users/${query.user_id}/shows/${query.action}${uri.search()}`,
				forceUpdate: true,
			}

			// Populate `following`
			if (query.action === 'following') {
				if (followingCache && Array.isArray(followingCache.shows) && followingCache.shows.length > 0) {
					return dispatch(UserActions.updateShowList('following', User.getFollowing()))
				}
			}

			// We're searching the same shit, so let's not do it again
			if (progress.indexOf(`user:${query.action}`) >= 0 && isEqual(query, UserActions.prevShowListQuery)) {
				return
			}

			// Start loading
			dispatch(AppActions.loadStart(`user:${query.action}`))
			UserActions.prevShowListQuery = query

			request(settings)
				.end((err, reply) => {
					if (err || !reply) {
						dispatch(AppActions.loadEnd(err, `user:${query.action}`))
						return
					}

					let { body } = reply || {}
					let currentSlugs = initialShowRequest ? [] : (shows || []).map(s => s.slug)

					body.shows = body.shows.filter(s => currentSlugs.indexOf(s.slug) < 0)

					if (query.after) {
						// dispatch(UserActions.appendShowList(query.action, body.shows))
						dispatch(UserActions.appendShowList(query.action, body))
					}
					else {
						// dispatch(UserActions.updateShowList(query.action, body.shows))
						dispatch(UserActions.updateShowList(query.action, body))
					}

					dispatch(AppActions.loadEnd(err, `user:${query.action}`))
				})
		}
	}
}

export default UserActions
