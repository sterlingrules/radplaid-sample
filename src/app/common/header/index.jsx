import URI from 'urijs'
import isEqual from 'lodash/isEqual'
import isString from 'lodash/isString'
import values from 'lodash/values'
import concat from 'lodash/concat'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { DATE_PATHS } from './../../constants.jsx'
import * as AppActions from './../../redux/actions/app.jsx'
import ShowActions from './../../redux/actions/shows.jsx'
import UserActions from './../../redux/actions/user.jsx'
import { delay, getDateRange, getCurrentDate } from './../../helpers'
import { track } from './../../helpers/analytics.jsx'
import { IconSearch, IconMenu } from './../icons.jsx'
import LogoType from './../logotype.jsx'
import Progress from './../progress.jsx'
import Control from './control.jsx'
import Search, { SearchSmall } from './search.jsx'
import Filter from './filter.jsx'
import ShowAdmin from './../../shows/components/showadmin.jsx'
import Login from './../../authentication/components/login.jsx'

export const SEARCH_CLASS = 'enable-search'
export const CONTROL_CLASS = 'enable-control'
export const ACTIVE_CLASS = 'active'

class Header extends Component {
	constructor(props) {
		super(props)

		const { location } = props

		this.state = {
			mobileSearchEnabled: false,
			mobileNavigationEnabled: false,
			pathname: location ? location.pathname : '',
			search: location ? location.search : ''
		}

		this.engaged = {
			query: false,
			location: false
		}

		this.unsubscribeFromHistory = () => {}
		this.homeScrollPosition = (typeof window !== 'undefined') ? window.scrollY : 0
		this.isTouchScrolling = false
		this.isMetricsSet = false
		this.lastHomeLocation = null
		this.prevQuery = false

		this.heroBottom = 0

		this.onEngage = this.onEngage.bind(this)
		this.onLogout = this.onLogout.bind(this)
		this.hideMobileDropdown = this.hideMobileDropdown.bind(this)
		this.toggleMobileSearch = this.toggleMobileSearch.bind(this)
		this.toggleMobileNav = this.toggleMobileNav.bind(this)

		this._updateMetrics = this._updateMetrics.bind(this)
		this._handleBlur = this._handleBlur.bind(this)
		this._onScroll = this._onScroll.bind(this)
		this._listen = this._listen.bind(this)
	}

	componentDidMount() {
		let { user } = this.props

		this._listen()
		this._handleHeaderTransition()
	}

	componentWillUnmount() {
		this._listen('remove')
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.viewportName !== this.props.viewportName) {
			this._updateMetrics()
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			nextProps.loggingIn !== this.props.loggingIn ||
			nextProps.isSearching !== this.props.isSearching ||
			nextProps.viewportName !== this.props.viewportName ||
			!isEqual(nextProps.location, this.props.location) ||
			!isEqual(nextProps.searchSummary, this.props.searchSummary) ||
			!isEqual(nextProps.user, this.props.user) ||
			!isEqual(nextState, this.state)
		)
	}

	onEngage = ({ type, target }) => {
		let { viewportName } = this.props

		this.engaged[target.name] = (type === 'focus')

		delay(() => {
			if (viewportName === 'small' && values(this.engaged).indexOf(true) === -1) {
				this.hideMobileDropdown()
			}
		}, 100)
	}

	onLogout = () => {
		this.hideMobileDropdown()
		this.props.logout()
		this.props.resetSearch()
	}

	toggleMobileSearch = (evt) => {
		let queryInputEl = (this.headerEl) ? this.headerEl.querySelector('.header-search .search-input input') : null

		this.headerEl.classList.toggle(SEARCH_CLASS)

		if (this.headerEl.classList.contains(SEARCH_CLASS)) {
			this.headerEl.classList.remove(CONTROL_CLASS)

			setTimeout(() => queryInputEl.focus(), 500)
		}
	}

	toggleMobileNav = (evt) => {
		this.headerEl.classList.toggle(CONTROL_CLASS)

		if (this.headerEl.classList.contains(CONTROL_CLASS)) {
			this.headerEl.classList.remove(SEARCH_CLASS)
		}
	}

	hideMobileDropdown = (evt) => {
		if (!this.headerEl) {
			return
		}

		let inputFields = this.headerEl.querySelectorAll('input')

		if (!inputFields || !inputFields.length) {
			return
		}

		for (let i = 0; i < inputFields.length; i++) {
			if (typeof inputFields[i].blur === 'function') {
				inputFields[i].blur()
			}
		}

		this.headerEl.classList.remove(SEARCH_CLASS, CONTROL_CLASS)
	}

	goHome = (evt) => {
		if (evt) evt.preventDefault()

		const { pathname = '/', search } = this.state
		const isHome = (pathname === '/')

		if (isHome) {
			if (typeof window !== 'undefined') {
				if (window.scrollY <= 0) {
					this.props.history.push(`/`)
					this.props.resetHome()
				}

				requestAnimationFrame(() => {
					window.scrollTo(0, 0)
				})
			}
		}
		else {
			this.props.history.push(this.lastHomeLocation || `/`)
			requestAnimationFrame(() => {
				window.scrollTo(0, this.homeScrollPosition)
			})
		}
	}

	onTrack = () => {
		track('visit', {
			action: 'mvp',
			label: 'MVP III',
			source: 'notice',
		})
	}

	_listen = (state = 'add') => {
		if (typeof window === 'undefined') {
			return
		}

		window[`${state}EventListener`]('mousedown', this._handleBlur, false)
		window[`${state}EventListener`]('touchmove', this._onScroll, false)
		window[`${state}EventListener`]('touchend', this._handleBlur, false)
		window[`${state}EventListener`]('scroll', this._onScroll, false)

		if (state === 'add') {
			return this.unsubscribeFromHistory = this.props.history.listen((location, action) => {
				this.setState({
					pathname: location.pathname,
					search: location.search
				})

				requestAnimationFrame(this._updateMetrics)
			})
		}

		this.unsubscribeFromHistory()
	}

	_updateMetrics = () => {
		if (typeof window === 'undefined') {
			return
		}

		// Helps submenus look better on transition (ie. profile-nav-small)
		let smallOffset = (this.props.viewportName == 'small') ? 72 : 0

		if (!this.headerEl) {
			this.heroBottom = 0
			return
		}

		this.heroBottom = 0
		this.isMetricsSet = true
	}

	_onScroll = (evt) => {
		if (typeof window === 'undefined') {
			return
		}

		const { pathname } = this.props.location

		// Prevents double firing
		if (evt.type === 'scroll' && this.isTouchScrolling) {
			return evt.preventDefault()
		}
		// `touchmove` fires first
		else if (evt.type === 'touchmove') {
			this.isTouchScrolling = true
		}

		if (pathname === '/') {
			this.homeScrollPosition = window.scrollY
		}

		this.scrollPosition = window.scrollY
		this.isScrolling = true

		// Handle Scroll/Animation
		if (!this.rafFired) {
			this._handleHeaderTransition()
			this.rafFired = true
		}

		delay(() => {
			this.isScrolling = false
			this.rafFired = false
		}, 500)

		// Make sure we have our metrics first
		if (!this.isMetricsSet) {
			return this._updateMetrics()
		}
	}

	_handleHeaderTransition = () => {
		if (!this.isScrolling || !this.headerEl) {
			return
		}

		// Toggle active class
		if (this.scrollPosition > this.heroBottom && this.props.windowLoad) {
			this.headerEl.classList.add(ACTIVE_CLASS)
		}
		else if (this.scrollPosition <= this.heroBottom) {
			this.headerEl.classList.remove(ACTIVE_CLASS)
		}

		requestAnimationFrame(this._handleHeaderTransition)
	}

	_handleBlur = ({ target }) => {
		const findParent = (element = { tagName: null }) => {
			if (!element || !this.headerEl) {
				return
			}

			let hasClass = (element.classList && element.classList.contains('view'))
			let ieSupport = (isString(element.className) && element.className.indexOf('view') >= 0)

			if (hasClass || ieSupport) {
				return this.hideMobileDropdown()
			}

			if (element == this.headerEl ||
				element == this.headerEl.parentElement) {
				return
			}

			findParent(element.parentElement)
		}

		this.isTouchScrolling = false

		findParent(target)
	}

	render() {
		let {
			searchQuery,
			searchLocation,
			mobileSearchEnabled,
			mobileNavigationEnabled
		} = this.state

		let {
			user,
			isNotice,
			isSearching,
			viewportName,
			loggingInUser,
			searchSummary,
			searchDateFrom,
			searchDateTo,
			location,
			loadStart,
			loadEnd,
			history,
		} = this.props

		let { pathname } = location

		let isHome = (concat([ '/' ], DATE_PATHS).indexOf(pathname) >= 0)
		let isEditing = (pathname.indexOf('/edit') >= 0)
		let isAdding = (pathname.indexOf('/add') >= 0)
		let classColumn = isHome ? 'hide' : 'col-6-of-12 col-medium-6-of-12'

		if (user) {
			classColumn = 'col-6-of-12 col-medium-7-of-12'
		}

		return (
			<header ref={(node) => this.headerEl = node}>
				<Progress />

				{isNotice && (
					<Link
						to="/vote"
						onClick={this.onTrack}
						className="notice notice--mvp text-ellipsis">
						Voting for Music Video Portland is now open!
					</Link>
				)}

				<ShowAdmin />

				{viewportName === 'small' ? (
					<React.Fragment>
						<div className="header-content grid">
							<div className="row">
								<div className="col col-9-of-12">
									<LogoType onClick={this.goHome} />
								</div>
							</div>
						</div>

						<div className="header-nav-small text-right">
							<div className="grid">
								<button className="btn-search btn btn-circlecompact btn--noborder" onClick={this.toggleMobileSearch}>
									<IconSearch />
								</button>
								<button className="btn-menu btn btn-circlecompact btn--noborder" onClick={this.toggleMobileNav}>
									<IconMenu />
								</button>
							</div>
						</div>

						<div className={`col col-12-of-12 hide small-show`}>
							<Search
								goHome={this.goHome}
								onEngage={this.onEngage}
								hideMobileDropdown={this.hideMobileDropdown} />
						</div>

						<Control
							user={user}
							onLogout={this.onLogout}
							onAnchorChange={this.hideMobileDropdown}
							viewportName={viewportName}
							location={location}
							history={history}
							loadStart={loadStart}
							loadEnd={loadEnd}
							loggingInUser={loggingInUser} />

						{/*<Filter />*/}

						<div
							className="modal-overlay"
							onClick={(evt) => {
								evt.preventDefault()
								this.hideMobileDropdown()
							}} />
					</React.Fragment>
				) : (
					<div className="header-content grid">
						<div className="row">
							<LogoType onClick={this.goHome} className="col" />

							<div className={`col flex-grow hide large-show small-hide`}>
								{(!isHome || (isHome && !isSearching && !user)) && (
									<Search
										goHome={this.goHome}
										onEngage={this.onEngage}
										className="header-search--simple"
										hideMobileDropdown={this.hideMobileDropdown} />
								)}
							</div>

							<Control
								user={user}
								location={location}
								history={history}
								onLogout={this.onLogout}
								loadStart={loadStart}
								loadEnd={loadEnd}
								loggingInUser={loggingInUser} />
						</div>
					</div>
				)}
			</header>
		)
	}
}

const mapStateToProps = ({ app, shows, user, routing }) => ({
	user: user.user,
	shows: shows.shows,
	searchSummary: shows.summary,
	isSearching: app.isSearching,
	viewportName: app.viewportName,
	windowLoad: app.windowLoad,
	searchQuery: app.searchQuery,
	searchLocation: app.searchLocation,
	searchDateFrom: app.searchDateFrom,
	searchDateTo: app.searchDateTo,
})

const mapDispatchToProps = dispatch => {
	return {
		loadStart: () => {
			dispatch(AppActions.loadStart())
		},

		loadEnd: () => {
			dispatch(AppActions.loadEnd())
		},

		loggingInUser: (state) => {
			dispatch(AppActions.loggingInUser(state))
		},

		resetSearch: () => {
			dispatch(AppActions.resetSearch())
		},

		resetHome: () => {
			dispatch(AppActions.resetHome())
		},

		fetchShowList: (query) => {
			dispatch(ShowActions.apiFetchShowList(query))
		},

		updateShowList: (shows = []) => {
			dispatch(ShowActions.updateShowList(shows))
		},

		logout: (data) => {
			dispatch(UserActions.logoutUser())
		}
	}
}

export default React.memo(withRouter(
	connect(mapStateToProps, mapDispatchToProps)(Header)
))
