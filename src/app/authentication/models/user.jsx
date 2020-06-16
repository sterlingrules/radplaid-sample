import omit from 'lodash/omit'
import isEmpty from 'lodash/isEmpty'
import { localStorageExpire, getCurrentDate } from './../../helpers'
import { request, requestPublic } from './../../helpers/request.jsx'
import { DEBUG, SHOWLIST_KEY } from './../../constants.jsx'
import { LOCATION } from './../../constants.computed.jsx'
import { SEARCH_SORT } from './../../constants.computed.jsx'
import { setUser } from './../../helpers/analytics.jsx'
import Cookies from 'js-cookie'

const ls = typeof localStorage !== 'undefined' ? localStorage : null
const KEY_USER = 'user'
const KEY_TOKEN = 'jwt'

const User = {
	save(data) {
		if (!ls) {
			return
		}

		let isApp = (
			typeof window !== 'undefined' &&
			typeof window.ReactNativeWebView !== 'undefined'
		)

		let cookieOpts = {
			domain: process.env.HOSTNAME,
			secure: !DEBUG,
		}

		let user = (typeof data === 'object') ? JSON.stringify(data.user) : data.user
		let token = data.token || ''
		let _user = omit(JSON.parse(user), [
			'role',
			'scenes',
			'bio',
			'attending',
			'following',
			'top_artists',
			'following_artists',
			'genres',
			'genres_extensions',
			'avatar',
			'photo',
		])

		if (user) {
			setUser(_user.id, {
				"username": _user.username,
				"$first_name": _user.firstName,
				"$last_name": _user.lastName,
				"$created": _user.createdAt,
				"$email": _user.email
			})

			ls.setItem(KEY_USER, user)

			if (!isApp) {
				Cookies.set(`${process.env.HOSTNAME}:${KEY_USER}`, _user, cookieOpts)
			}
		}

		if (token) {
			ls.setItem(KEY_TOKEN, token)

			if (!isApp) {
				Cookies.set(`${process.env.HOSTNAME}:${KEY_TOKEN}`, token, cookieOpts)
			}
		}
	},

	get() {
		let user = ls ? ls.getItem(KEY_USER) : null

		if (!user) {
			user = Cookies.get(`${process.env.HOSTNAME}:${KEY_USER}`) || null
		}

		return user ? JSON.parse(user) : null
	},

	getToken() {
		let token = ls ? ls.getItem(KEY_TOKEN) : null

		if (!token) {
			token = Cookies.get(`${process.env.HOSTNAME}:${KEY_TOKEN}`) || null
		}

		return token
	},

	getSort() {
		if (!ls) {
			return SEARCH_SORT
		}

		return ls.getItem('sort') || SEARCH_SORT
	},

	getLocation() {
		if (!localStorageExpire) {
			return {}
		}

		let storedLocation = localStorageExpire.get('location')

		try {
			if (storedLocation !== 'undefined' && storedLocation) {
				return (typeof storedLocation === 'string') ? JSON.parse(storedLocation) : storedLocation
			}
		}
		catch(err) {
			console.error(err)
			return {}
		}
	},

	getFollowing() {
		if (!ls) {
			return {}
		}

		let following = ls.getItem('following') ? JSON.parse(ls.getItem('following')) : { shows: [] }
		let now = new Date(getCurrentDate()).getTime()

		if (Array.isArray(following.shows)) {
			following.shows = following.shows.filter(s => new Date(s).getTime() > now)
		}

		return isEmpty(following) ? { shows: [] } : following
	},

	clearFollowing() {
		if (ls) {
			ls.removeItem('following')
		}
	},

	clear() {
		ls.removeItem('jwt')
		ls.removeItem('user')
		ls.removeItem('sort')
		ls.removeItem('next')
		ls.removeItem('following')
		ls.removeItem('location')
		ls.removeItem('claim')
		ls.removeItem(ls.getItem(SHOWLIST_KEY))
		ls.removeItem(SHOWLIST_KEY)
		ls.removeItem(KEY_TOKEN)

		const options = {
			domain: process.env.HOSTNAME,
			secure: (window.location.protocol === 'https:')
		}

		Cookies.remove(`${process.env.HOSTNAME}:${KEY_USER}`)
		Cookies.remove(`${process.env.HOSTNAME}:${KEY_USER}`, options)
		Cookies.remove(`${process.env.HOSTNAME}:${KEY_TOKEN}`)
		Cookies.remove(`${process.env.HOSTNAME}:${KEY_TOKEN}`, options)
		Cookies.remove(encodeURIComponent(`${process.env.HOSTNAME}:${KEY_USER}`))
		Cookies.remove(encodeURIComponent(`${process.env.HOSTNAME}:${KEY_USER}`), options)
		Cookies.remove(encodeURIComponent(`${process.env.HOSTNAME}:${KEY_TOKEN}`))
		Cookies.remove(encodeURIComponent(`${process.env.HOSTNAME}:${KEY_TOKEN}`), options)

		if (typeof mixpanel !== 'undefined') {
			mixpanel.reset()
		}
	},

	set(jwt = null) {
		let settings = {
			path: '/token',
			method: 'post',
			data: {
				token: jwt
			}
		}

		User.setSort('best')

		return new Promise((resolve, reject) => {
			requestPublic(settings)
				.end((err, reply) => {
					if (typeof window === 'undefined') {
						return resolve(null)
					}

					let { pathname, hash } = window.location
					let { user } = reply.body

					this.save(reply.body)
					window.history.replaceState({}, '', `${pathname}${hash}`)

					return resolve(user)
				})
		})
	},

	setFollowing(shows) {
		if (!ls) {
			return
		}

		ls.setItem('following', JSON.stringify(shows))
	},

	setLocation(location) {
		localStorageExpire.set(
			'location',
			JSON.stringify(location),
			604800000 // 1 week
		)
	},

	setSort(value) {
		if (ls) {
			ls.setItem('sort', value)
		}
	}
}

export default User
