import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { withLastLocation } from 'react-router-last-location'
import URI from 'urijs'
import keys from 'lodash/keys'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import without from 'lodash/without'
import intersection from 'lodash/intersection'
import moment from 'moment'
import { SEARCH_PARAMS } from './../constants.jsx'
import HomeLoggedOut from './components/home-loggedout.jsx'
import HomeWithFeed from './components/home-withfeed.jsx'
import { store } from './../redux/store.jsx'
import * as AppActions from './../redux/actions/app.jsx'
import UserActions from './../redux/actions/user.jsx'
import ShowActions from './../redux/actions/shows.jsx'
import { track } from './../helpers/analytics.jsx'
import { getCurrentDate } from './../helpers'

class Home extends Component {
	constructor(props) {
		super(props)
		this.uri = new URI()
	}

	componentDidMount() {
		if (typeof window === 'undefined') {
			return
		}

		// let hasScrollRestoration = ('scrollRestoration' in history)

		// if (!this.props.lastLocation) {
		// 	if (hasScrollRestoration) {
		// 		history.scrollRestoration = 'manual'
		// 	}

		// 	window.onload = () => {
		// 		// scroll(0, 0)

		// 		if (hasScrollRestoration) {
		// 			history.scrollRestoration = 'auto'
		// 		}
		// 	}
		// }
	}

	componentWillReceiveProps(nextProps) {
		let { user, location, shows } = nextProps
		let { pathname, search } = location
		let query = new URI(`${pathname}${search}`).search(true)
		let redirectAfterLogin = localStorage.getItem('next')

		//
		// Track users show results
		//
		if (!isEqual(shows, this.props.shows)) {
			if (shows && shows.length) {
				track('showlist', {
					action: 'load feed',
					slugs: without(shows.map(s => s.slug), undefined),
				})
			}
		}

		//
		// Handles any previous redirects
		//
		if (user && redirectAfterLogin && !query.modal) {
			localStorage.removeItem('next')
			this.props.history.push(redirectAfterLogin)
			return
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			this.props.ip !== nextProps.ip ||
			this.props.title !== nextProps.title ||
			this.props.shows !== nextProps.shows ||
			this.props.after !== nextProps.after ||
			this.props.isEnd !== nextProps.isEnd ||
			this.props.isSearching !== nextProps.isSearching ||
			this.props.featuredShows !== nextProps.featuredShows ||
			this.props.following !== nextProps.following ||
			this.props.windowProps !== nextProps.windowProps ||
			this.props.showsTotal !== nextProps.showsTotal ||
			this.props.welcome !== nextProps.welcome ||
			!isEqual(this.props.progress, nextProps.progress) ||
			!isEqual(this.props.showsLocation, nextProps.showsLocation) ||
			!isEqual(this.props.userLocation, nextProps.userLocation) ||
			this.props.location !== nextProps.location ||
			this.props.user !== nextProps.user
		)
	}

	render() {
		let {
			user,
			initialized,
			isSearching,
			userLocation,
			showsLocation,
			searchQuery,
			searchLocation,
			searchDateFrom,
			searchCost,
			searchTag
		} = this.props

		let coords = null
		let venue = null
		let locationName = showsLocation ? showsLocation.name : ''
		let locationOptions = [
			showsLocation,
			userLocation
		]

		for (let i = 0; i < locationOptions.length; i++) {
			coords = (
				locationOptions[i] && (
					locationOptions[i].coords && locationOptions[i].coords.length > 0 ||
					locationOptions[i].location && locationOptions[i].location.length > 0
				)
			)

			if (coords) {
				locationName = locationOptions[i].name
				coords = locationOptions[i].coords || locationOptions[i].location
				venue = coords ? { lat: coords[0], lng: coords[1] } : null
				break
			}
		}

		return (
			initialized ? (
				// If logged out OR not searching
				(!user && !isSearching) ? (
					<HomeLoggedOut
						locationName={locationName}
						venue={venue}
						{...this.props} />
				) : (
					<HomeWithFeed
						locationName={locationName}
						venue={venue}
						{...this.props} />
				)
			) : (
				<div />
			)
		)
	}
}

Home.serverFetch = (pathname, query) => {
	let _keys = keys(query)

	store.dispatch(AppActions.setSearchSort(query.sort))
	// store.dispatch(ShowActions.apiFetchFeaturedShows())

	// Should only run when a proper query is involved
	if (!isEmpty(query) && intersection(_keys, SEARCH_PARAMS).length > 0) {
		store.dispatch(AppActions.resetSearch())
		store.dispatch(AppActions.setIsSearching(true))

		if (query.venue) {
			let venue = decodeURIComponent(query.venue)
			store.dispatch(AppActions.setSearchVenue((venue === 'all') ? null : venue))
		}

		if (query.query) store.dispatch(AppActions.setSearchQuery(query.query))
		if (query.location) store.dispatch(AppActions.setSearchLocation(query.location))
		if (query.cost) store.dispatch(AppActions.setSearchCost(query.cost))
		if (query.tag) store.dispatch(AppActions.setSearchTag(query.tag))
		if (query.livestream) store.dispatch(AppActions.setSearchLiveStream(query.livestream))

		if (query.from || query.to) {
			store.dispatch(AppActions.setSearchDateRange({
				from: query.from || getCurrentDate(),
				to: query.to || ''
			}))
		}
	}

	return { type: null }
}

const mapStateToProps = ({ app, user, shows }) => ({
	user: user.user,
	following: user.following,

	ip: app.ip,
	progress: app.progress,
	progressName: app.progressName,
	initialized: app.initialized,
	viewportName: app.viewportName,
	windowProps: app.windowProps,
	runHomeTutorial: app.runHomeTutorial,
	session: app.session,
	isBrowser: app.isBrowser,
	isSearching: app.isSearching,
	searchSort: app.searchSort,
	searchQuery: app.searchQuery,
	searchCost: app.searchCost,
	searchTag: app.searchTag,
	searchLocation: app.searchLocation,
	searchDateFrom: app.searchDateFrom,
	searchDateTo: app.searchDateTo,
	userLocation: app.userLocation,

	title: shows.title,
	shows: shows.shows,
	showsTotal: shows.showsTotal,
	searchSummary: shows.summary,
	after: shows.after,
	afterPage: shows.afterPage,
	isEnd: shows.isEnd,
	showsLocation: shows.showsLocation,
	featuredShows: shows.featuredShows,
	noShows: shows.noShows,
	map: shows.map,
	welcome: shows.welcome
})

const mapDispatchToProps = dispatch => {
	return {
		loadStart: () => {
			dispatch(AppActions.loadStart())
		},

		search: (query) => {
			dispatch(AppActions.apiSearch('shows', query))
		},

		resetHome: () => {
			dispatch(AppActions.resetHome())
		},

		resetSearch: () => {
			dispatch(AppActions.resetSearch())
		},

		setSearchCost: (filter = '') => {
			dispatch(AppActions.setSearchCost(filter))
		},

		setSearchLiveStream: (filter = '') => {
			dispatch(AppActions.setSearchLiveStream(filter))
		},

		setSearchTag: (filter = '') => {
			dispatch(AppActions.setSearchTag(filter))
		},

		setSearchDateRange: (range = {}) => {
			dispatch(AppActions.setSearchDateRange(range))
		},

		setHomeTutorial: (run) => {
			dispatch(AppActions.setHomeTutorial(run))
		},

		fetchShowList: (query) => {
			dispatch(ShowActions.apiFetchShowList(query))
		},

		userAction(id, action = 'follow') {
			dispatch(ShowActions.apiShowAction(id, action))
		},

		fetchUserShowList: (query) => {
			dispatch(UserActions.apiFetchShowList(query))
		},

		updateUser: (user) => {
			dispatch(UserActions.updateUser(user))
		},

		updateUserPassive: (user) => {
			dispatch(UserActions.updateUserPassive(user))
		},

		sendLoginToken: (email) => {
			dispatch(UserActions.sendLoginToken(email))
		}
	}
}

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(Home)
)
