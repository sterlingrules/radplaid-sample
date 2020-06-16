// import 'cross-fetch/polyfill'
import 'react-app-polyfill/stable'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isMobile, isAndroid } from './helpers/device-detect.js'
import { connect } from 'react-redux'
import { LastLocationProvider } from 'react-router-last-location'
import { withRouter, BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom'
import PrivateRoute from './authentication/components/private-route.jsx'
import URI from 'urijs'
import Helmet from 'react-helmet'
import moment from 'moment'

import { DATE_PATHS, META_TITLE, META_DESCRIPTION } from './constants.jsx'
import { delay, getQuery, events } from './helpers'
import { setUser, gTagReportConversion } from './helpers/analytics.jsx'
import Header from './common/header/index.jsx'
import ExitIntent from './common/exit-intent.jsx'
import Footer from './common/footer.jsx'
import Modals from './modals/index.jsx'
import Player from './player/index.jsx'
import * as AppActions from './redux/actions/app.jsx'
import User from './authentication/models/user.jsx'
import UserActions from './redux/actions/user.jsx'

// Views
import routes from './routes.jsx'
import NotFound from './common/404.jsx'

class App extends Component {
	static contextTypes = {
		store: PropTypes.object.isRequired
	}

	constructor(props) {
		super(props)

		this.state = {
			user: User.get()
		}
	}

	componentWillMount() {
		let metaToRemove = (typeof document !== 'undefined') ? document.querySelectorAll('[data-initial]') : []

		//
		// Handle MetaData setup. But we can probably
		// remove this once SSR is working properly
		if (!metaToRemove.length) {
			return
		}

		for (let i = 0; i < metaToRemove.length; i++) {
			metaToRemove[i].remove()
		}
	}

	componentDidMount() {
		if (typeof window === 'undefined') {
			return
		}

		let { isBrowser } = this.props
		let jwt = getQuery('jwt')
		let _jwt = localStorage.getItem('jwt')
		let token = getQuery('token')
		let uid = getQuery('uid')

		// Facebook Stuff
		let code = getQuery('code')
		let state = getQuery('state')

		let user

		let uri = new URI().removeQuery([
			'jwt',
			'token',
			'uid',
			'code',
			'state'
		])

		this.props.history.replace(`${uri.pathname()}${uri.search()}`)
		this.props.setIsBrowser(isBrowser)

		//
		// Check if we have a user,
		// then start the app
		if (this.state.user) {
			this.props.saveUser(this.state.user)
			this.props.initializeApp()
		}
		// Spotify Login
		else if (jwt) {
			User.set(jwt)
				.then((user) => {
					this.props.saveUser(user)
					this.props.initializeApp()
				})
		}
		// Passwordless Login
		else if (token && uid) {
			this.props.verifyLoginToken(token, uid)
		}
		// No user
		else {
			setTimeout(() => {
				this.props.initializeApp()
				User.clear()
			}, 100)
		}

		this._setViewportName()
		this._handlePushNotifications()
		this._listen()
	}

	componentWillUnmount() {
		this._listen('remove')
	}

	componentWillReceiveProps(nextProps) {
		let { user, progress, isBrowser } = nextProps
		let { location } = this.props
		let query = new URI().setSearch(location.search).search(true)

		if (!user || JSON.stringify(user) === '{}') {
			return
		}

		setUser(user.id, {
			"username": user.username,
			"$distinct_id": user.id,
			"$first_name": user.firstName,
			"$last_name": user.lastName,
			"$created": user.createdAt,
			"$last_login": new Date(),
			"$email": user.email
		})

		// New User, let's prompt for deets
		if (!user.username && progress.length === 0) {
			if (query.modal !== 'editprofile') {
				this.props.history.push('?modal=editprofile')
				gTagReportConversion()
			}
		}

		if (isBrowser !== this.props.isBrowser) {
			this.props.setIsBrowser(isBrowser)
		}
	}

	_onResize = (evt) => {
		delay(this._setViewportName, 1)
		events.publish('resize')

		if (isAndroid && typeof document !== 'undefined') {
			const isInput = (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')

			if (isInput) {
				setTimeout(() => {
					document.activeElement.scrollIntoView({
						behavior: 'smooth',
						block: 'end',
						inline: 'nearest'
					})
				}, 0)
			}
		}
	}

	_handlePushNotifications = () => {
		const { user } = this.props

		if (typeof OneSignal === 'undefined' || !user) {
			return
		}

		OneSignal.push(() => {
			OneSignal.setExternalUserId(user.id)
		})
	}

	_setViewportName = () => {
		let { setViewportName, setWindowProps } = this.props
		let viewportWidth = window.innerWidth
		let viewportHeight = window.innerHeight
		let htmlClassNames = document.documentElement.classList
		let viewportName = 'large'

		if (viewportWidth >= 768 && viewportWidth <= 1023) {
			viewportName = 'medium'
		}
		else if (viewportWidth <= 767) {
			viewportName = 'small'
		}

		setViewportName(viewportName)
		setWindowProps({
			width: viewportWidth,
			height: viewportHeight
		})
	}

	_listen = (state = 'add') => {
		const { setWindowLoad } = this.props

		window[`${state}EventListener`]('scroll', () => {
			if (isMobile) {
				return
			}

			events.publish('scroll', {
				top: window.scrollY,
				type: 'scroll'
			})
		})

		window[`${state}EventListener`]('touchmove', () => {
			events.publish('scroll', {
				top: window.scrollY,
				type: 'touchmove'
			})
		})

		window[`${state}EventListener`]('resize', this._onResize, false)
		window[`${state}EventListener`]('load', setWindowLoad, false)
	}

	render() {
		const {
			location,
			user,
			initialized,
			searchQuery,
			searchCost,
			searchTag,
			searchLocation,
			isSearching
		} = this.props

		let isNotice = false
		let isDatePath = (DATE_PATHS.indexOf(location.pathname) >= 0)
		let hasSearchParams = (searchQuery || searchCost || searchTag || searchLocation || isDatePath)
		let { steps } = this.state

		return (initialized && (
			<div className={`view is-logged-${user ? 'in' : 'out'} ${isNotice ? 'is-notice' : ''} ${isSearching ? 'is-searching' : ''} view-${location.pathname.substring(1).toLowerCase().replace(/\//g, '-') || 'home'}`}>
				<Helmet>
					<meta name="description" content={META_DESCRIPTION} />

					<meta property="fb:app_id" content={process.env.FACEBOOK_APP_ID} />

					<meta property="og:url" content={process.env.BASE_CLIENT_URL} />
					<meta property="og:type" content="website" />
					<meta property="og:title" content={META_TITLE} />
					<meta property="og:description" content={META_DESCRIPTION} />
					<meta property="og:image" content={`${process.env.BASE_CLIENT_URL}${process.env.ASSET_URL}/img/og.jpg`} />
					<meta property="og:locale" content="en_US" />

					<title>{META_TITLE}</title>

					<meta name="twitter:card" content="summary" />
					<meta name="twitter:site" content="@getradplaid" />
					<meta name="twitter:creator" content="@getradplaid" />
					<meta name="twitter:url" content={process.env.BASE_CLIENT_URL} />
					<meta name="twitter:title" content={META_TITLE} />
					<meta name="twitter:description" content={META_DESCRIPTION} />
					<meta name="twitter:image" content={`${process.env.BASE_CLIENT_URL}${process.env.ASSET_URL}/img/og.jpg`} />

					<link rel="canonical" href={process.env.BASE_CLIENT_URL} />
				</Helmet>

				{/*<ExitIntent user={user} />*/}

				<Header
					isNotice={isNotice}
					location={location} />

				<main className="main">
					<LastLocationProvider>
						<Switch>
							{routes.map((route) => {
								if (route.private) {
									return <PrivateRoute key={route.path} {...route} />
								}

								if (route.redirect) {
									return <Redirect key={route.path} to={route.redirect} exact={true} />
								}

								return <Route key={route.path} {...route} />
							})}
							<Route component={NotFound} />
						</Switch>
					</LastLocationProvider>
				</main>

				<Footer />

				<Player {...this.props} />
				<Modals {...this.props} />
			</div>
		))
	}
}

const mapStateToProps = ({ user, app }) => ({
	user: user.user,
	progress: app.progress,
	initialized: app.initialized,

	searchQuery: app.searchQuery,
	searchCost: app.searchCost,
	searchTag: app.searchTag,
	searchLocation: app.searchLocation,
	isSearching: app.isSearching
})

const mapDispatchToProps = dispatch => {
	return {
		initializeApp: () => {
			dispatch(AppActions.initializeSession())
		},

		loggingInUser: (state) => {
			dispatch(AppActions.loggingInUser(state))
		},

		setIsBrowser: (state) => {
			dispatch(AppActions.isBrowser(state))
		},

		logout: () => {
			dispatch(UserActions.logoutUser())
		},

		saveUser: (user) => {
			dispatch(UserActions.loginUser(user))
		},

		logoutUser: () => {
			dispatch(UserActions.logoutUser())
		},

		setViewportName: (name) => {
			dispatch(AppActions.setViewportName(name))
		},

		setWindowProps: (props) => {
			dispatch(AppActions.setWindowProps(props))
		},

		setWindowLoad: () => {
			dispatch(AppActions.setWindowLoad())
		},

		verifyLoginToken: (token, uid) => {
			dispatch(UserActions.verifyLoginToken(token, uid))
		},
	}
}

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(App)
)
