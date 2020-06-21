import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'
import isEqual from 'lodash/isEqual'
import flatMap from 'lodash/flatMap'
import concat from 'lodash/concat'
import moment from 'moment'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { withLastLocation } from 'react-router-last-location'
import { purge, getQuery, getDateRange, getCurrentDate } from './../../helpers'
import { track } from './../../helpers/analytics.jsx'
import { DATE_PATHS } from './../../constants.jsx'
import { IconSearch, IconLocation, IconClose } from './../icons.jsx'
import * as AppActions from './../../redux/actions/app.jsx'
import UserModel from './../../authentication/models/user.jsx'
import ShowActions from './../../redux/actions/shows.jsx'
import Filter from './filter.jsx'

const SEARCH_PLACEHOLDER = 'Search live music events'
const LOCATION_PLACEHOLDER = 'City, State or Zip'

export class SearchSmall extends Component {
	static propTypes = {
		query: PropTypes.string,
		viewportName: PropTypes.string,
		locationName: PropTypes.string,
		searchQuery: PropTypes.string,
		searchLocation: PropTypes.string,
		onSearch: PropTypes.func,
		onChange: PropTypes.func,
		onEngage: PropTypes.func
	}

	constructor(props) {
		super(props)

		this._initQueryValue = ''
		this._initLocationValue = ''
	}

	onClose = () => {
		const {
			searchQuery,
			searchLocationState,
			hideMobileDropdown,
			onSearch
		} = this.props

		hideMobileDropdown()

		if (searchQuery || searchLocationState) {
			onSearch()
		}
	}

	_onFocus = (evt) => {
		this._initQueryValue = this.props.searchQuery

		if (typeof this.props.onEngage === 'function') {
			this.props.onEngage(evt)
		}
	}

	_onBlur = () => {
		if (this._initQueryValue === this.props.searchQuery) {
			return this.searchFieldEl.blur()
		}

		this.props.onSearch()
	}

	_onKeyUp = (evt) => {
		let keyCode = evt.which || evt.keyCode

		if (keyCode == 13) {
			this.searchFieldEl.blur()
			this.locationFieldEl.blur()
			this.props.onSearch()
		}
	}

	render() {
		let {
			className,
			locationName,
			searchQuery,
			searchLocationState,
			onSearch,
			onChange,
			onEngage
		} = this.props

		return (
			<form id="search" action="#" onSubmit={onSearch} onKeyUp={this._onKeyUp} className={`header-search ${className || ''}`}>
				<div onClick={this.onClose}>
					<IconClose className="icon-close" />
				</div>

				<div className="grid">
					<div className="search-input">
						<input
							name="query"
							type="search"
							ref={(node) => this.searchFieldEl = node}
							value={searchQuery}
							onChange={onChange}
							onFocus={this._onFocus}
							onBlur={this._onBlur}
							onKeyUp={this._onKeyUp}
							autoCorrect="off"
							autoCapitalize="off"
							spellCheck="off"
							className="form-input"
							placeholder={SEARCH_PLACEHOLDER} />

						<button type="submit" onClick={this.props.onSearch} className={`btn ${!searchQuery ? 'btn--disabled' : 'btn--accept'}`}>
							<IconSearch />
						</button>
					</div>

					<div className="location-input">
						<input
							name="location"
							type="search"
							ref={(node) => this.locationFieldEl = node}
							value={searchLocationState}
							onChange={onChange}
							onFocus={onEngage}
							onBlur={onEngage}
							onKeyUp={this._onKeyUp}
							autoCapitalize="off"
							className="form-input"
							placeholder={locationName || LOCATION_PLACEHOLDER} />

						<button type="submit" onClick={this.props.onSearch} className={`btn ${!searchLocationState ? 'btn--disabled' : 'btn--accept'}`}>
							<IconLocation />
						</button>
					</div>

					<div className="break" name="filter" />

					<Filter />
				</div>
				<input type="submit" />
			</form>
		)
	}
}

class Search extends Component {
	static propTypes = {
		user: PropTypes.object,
		query: PropTypes.string,
		viewportName: PropTypes.string,
		locationName: PropTypes.string,
		onEngage: PropTypes.func
	}

	constructor(props) {
		super(props)

		let query = new URI().search(true)

		this.state = {
			searchQuery: query.query || '',
			searchLocation: query.location || ''
		}
	}

	componentWillMount() {
		let uri = new URI()
		let { history, searchLocation } = this.props
		let { pathname, search } = history.location
		let query = uri.setSearch(search).search(true)

		if (query.location) {
			this.setState({ searchLocation: decodeURIComponent(query.location) })
		}
		else if (searchLocation) {
			this.setState({ searchLocation })
		}

		this.props.setUserLocation()
	}

	componentDidMount() {
		let { user, pathname, progress, shows = [], isSearching } = this.props
		let noShows = (shows.length === 0 && !isSearching)
		let isLoggedIn = (user && !isSearching)
		let canDisplayShows = (
			progress.indexOf('shows') < 0 &&
			concat([ '/' ], DATE_PATHS).indexOf(pathname) >= 0 &&
			isLoggedIn
		)

		if (canDisplayShows && (noShows || this._isPast())) {
			this.props.resetHome()
		}
 	}

	_isPast = () => {
		let { shows = [] } = this.props
		let firstShow = flatMap(shows)
			.filter(s => s.type === 'show')
			.sort((a, b) => {
				return new Date(a.date).getTime() - new Date(b.date).getTime()
			})[0]

		return (firstShow && moment(firstShow.date).isBefore(moment().startOf('day')))
	}

	componentWillReceiveProps(nextProps) {
		let {
			location,
			userLocation,
			isBrowser,
			initialized,
			searchPath,
			searchLocation,
			resetSearch
		} = nextProps

		let { pathname, search } = this.props.history.location
		let tag = getQuery('tag')

		if (searchLocation !== this.props.searchLocation) {
			this.setState({ searchLocation })
		}

		if (pathname !== '/' && resetSearch !== this.props.resetSearch) {
			window.history.pushState({}, '', pathname)
		}

		if (isBrowser !== this.props.isBrowser) {
			this.props.setUserLocation()
		}

		if (pathname === '/' && !searchLocation && !isEqual(userLocation, this.props.userLocation)) {
			this._onSearch()
		}
	}

	componentDidUpdate(prevProps, prevState) {
		let {
			pathname,
			showsLocation,
			searchSort,
			searchVenue,
			searchTag,
			searchCost,
			searchLiveStream,
			searchDateFrom,
			searchDateTo,
			searchLocation,
			viewportName,
			userLocation,
		} = prevProps

		let currentDate = getCurrentDate()
		let isLoggedIn = !!(this.props.user)
		let isLiveStreamChanged = (searchLiveStream !== this.props.searchLiveStream)
		let isLocationChanged = ((searchLocation !== this.props.searchLocation) && (searchLocation !== this.state.searchLocation))
		let isTagChanged = (searchTag !== this.props.searchTag)
		let isVenueChanged = (searchVenue !== this.props.searchVenue)
		let isCostChanged = !isEqual(searchCost, this.props.searchCost)
		let isSortChanged = (isLoggedIn && searchSort !== this.props.searchSort)
		let isDateChanged = (
			searchDateFrom !== this.props.searchDateFrom ||
			searchDateTo !== this.props.searchDateTo
		)

		if (!this.props.initialized) {
			return
		}

		// If a user has the website open into a new day
		// we should be aware of that on any subsequent searches
		if (moment(searchDateFrom).isBefore(currentDate)) {
			return this.props.setSearchDateRange()
		}

		if (pathname === '/' || viewportName === 'small') {
			if (isSortChanged ||
				isVenueChanged ||
				isDateChanged ||
				isCostChanged ||
				isTagChanged ||
				isLocationChanged ||
				isLiveStreamChanged) {
				this._onSearch({ isSortChanged, isDateChanged })
			}
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			this.state.searchLocation !== nextState.searchLocation ||
			this.props.pathname !== nextProps.pathname ||
			this.props.isBrowser !== nextProps.isBrowser ||
			this.props.viewportName !== nextProps.viewportName ||
			this.props.userLocation !== nextProps.userLocation ||
			this.props.showsSort !== nextProps.showsSort ||
			this.props.searchSort !== nextProps.searchSort ||
			this.props.searchQuery !== nextProps.searchQuery ||
			this.props.searchVenue !== nextProps.searchVenue ||
			this.props.searchCost !== nextProps.searchCost ||
			this.props.searchTag !== nextProps.searchTag ||
			this.props.searchLocation !== nextProps.searchLocation ||
			this.props.searchLiveStream !== nextProps.searchLiveStream ||
			this.props.searchDateFrom !== nextProps.searchDateFrom ||
			this.props.searchDateTo !== nextProps.searchDateTo
		)
	}

	_onChange = ({ target }) => {
		let { name, value } = target

		switch(name) {
			case 'query':
				this.props.setQuery(value)
				break
			case 'location':
				this.setState({ searchLocation: value })
				break
		}
	}

	_onSearch = (evt) => {
		if (!this.props.initialized) {
			return
		}

		if (evt && evt.preventDefault) {
			evt.preventDefault()
		}

		let {
			user,
			shows,
			searchSort,
			searchQuery,
			searchVenue,
			searchDateFrom,
			searchDateTo,
			searchLiveStream,
			searchCost,
			searchTag,
			viewportName
		} = this.props

		let { searchLocation } = this.state
		let { location, lastLocation } = this.props
		let { pathname, search } = location
		let isLoggedIn = !!(user)
		let isDatePath = (DATE_PATHS.indexOf(pathname) >= 0)
		let isSearchDateFromCurrent = (searchDateFrom === getCurrentDate())
		let isSortChanged = (evt && evt.isSortChanged)
		let isDateChanged = (evt && evt.isDateChanged)
		let historyMethod = (!lastLocation) ? 'replace' : 'push'

		let query = {
			sort: searchSort,
			query: searchQuery,
			location: searchLocation,
			venue: searchVenue,
			from: searchDateFrom,
			to: searchDateTo,
			cost: searchCost,
			tag: searchTag,
			livestream: searchLiveStream,
			page: 0,
		}

		let searchPath = new URI().setSearch(query).search()

		// Sort change can only happen if logged in
		if (isLoggedIn && searchSort) {
			query.sort = searchSort
		}

		// Handle small viewport
		if (viewportName === 'small' &&
			this.props.hideMobileDropdown) {
			this.props.hideMobileDropdown()
		}

		if (!query.query &&
			!query.location &&
			!query.venue &&
			!query.cost &&
			!query.tag &&
			!query.livestream &&
			!isDateChanged &&
			isSearchDateFromCurrent) {

			// Only reset home on initial load
			// Subsequent resets are handled in `Header`
			if (isSortChanged || shows.length === 0) {
				this.props.resetHome()
			}

			if (`${pathname}${search}` !== `/${search}`) {
				this.props.history[historyMethod](`/${search}`)
			}

			if (typeof window !== 'undefined') {
				requestAnimationFrame(() => window.scroll(0, 0))
			}

			return
		}

		// Switch to home when searching
		// from `searchfield`
		if (pathname !== '/' && !isDatePath) {
			this.props.history[historyMethod]('/')
		}

		// We need to set the `searchLocation`
		if (searchLocation) {
			this.props.setLocation(searchLocation)
		}

		// Otherwise, let's run a search
		this.props.search(query)

		if (typeof window !== 'undefined') {
			window.history.replaceState({ searchPath }, '', searchPath)
		}

		track('search', {
			...query,
			action: 'search'
		})
	}

	render() {
		let {
			user,
			showsLocation,
			userLocation,
			location,
			onEngage,
			className,
			searchQuery,
			searchVenue,
			viewportName
		} = this.props

		let { searchLocation } = this.state
		let locationName = showsLocation ? showsLocation.name : userLocation ? userLocation.name : ''

		return (viewportName === 'small' ? (
				<SearchSmall
					locationName={locationName}
					searchLocationState={searchLocation}
					onSearch={this._onSearch}
					onChange={this._onChange}
					onFocus={onEngage}
					onBlur={onEngage}
					{...this.props} />
			) : (
				<Fragment>
					<form
						id="search"
						action="#"
						onSubmit={this._onSearch}
						className={`header-search ${className || ''}`}>
						<div className="search-input">
							<input
								name="query"
								type="search"
								ref={(node) => this.searchFieldEl = node}
								value={searchQuery}
								maxLength={140}
								onChange={this._onChange}
								autoCorrect="off"
								autoCapitalize="off"
								spellCheck="off"
								className="form-input"
								placeholder={SEARCH_PLACEHOLDER} />
						</div>

						<button type="submit" onClick={this._onSearch} className={`btn ${!searchQuery && !searchLocation ? 'btn--disabled' : 'btn--accept'}`}>
							<IconSearch />
						</button>
					</form>

					<form
						id="location"
						action="#"
						onSubmit={this._onSearch}
						className={`header-search header-location ${className || ''}`}
						style={{ marginTop: '1rem' }}>
						<div className="location-input">
							<input
								name="location"
								type="search"
								value={searchLocation}
								maxLength={140}
								onChange={this._onChange}
								autoCapitalize="off"
								className="form-input"
								placeholder={locationName || LOCATION_PLACEHOLDER} />
						</div>

						<button type="submit" onClick={this._onSearch} className={`btn ${!searchQuery && !searchLocation ? 'btn--disabled' : 'btn--accept'}`}>
							<IconLocation />
						</button>
					</form>
				</Fragment>
			)
		)
	}
}

const mapStateToProps = ({ app, shows, user, routing }) => ({
	user: user.user,
	searchPath: routing.location ? routing.location.search : '',
	pathname: routing.location ? routing.location.pathname : '',

	shows: shows.shows,
	showsSort: shows.showsSort,
	showsLocation: shows.showsLocation,

	isBrowser: app.isBrowser,
	progress: app.progress,
	progressName: app.progressName,
	initialized: app.initialized,
	userLocation: app.userLocation,
	viewportName: app.viewportName,
	resetSearch: app.resetSearch,
	isSearching: app.isSearching,
	searchSort: app.searchSort,
	searchVenue: app.searchVenue,
	searchQuery: app.searchQuery,
	searchLocation: app.searchLocation,
	searchDateFrom: app.searchDateFrom,
	searchDateTo: app.searchDateTo,
	searchLiveStream: app.searchLiveStream,
	searchCost: app.searchCost,
	searchTag: app.searchTag
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

		resetHome: () => {
			dispatch(AppActions.resetHome())
		},

		setQuery: (query) => {
			dispatch(AppActions.setSearchQuery(query))
		},

		setSearchDateRange: (range) => {
			dispatch(AppActions.setSearchDateRange(range))
		},

		setLocation: (location) => {
			dispatch(AppActions.setSearchLocation(location))
		},

		setSearchTag: (tag) => {
			dispatch(AppActions.setSearchTag(tag))
		},

		setInitialSearch: (query) => {
			dispatch(AppActions.setInitialSearch(query))
		},

		setUserLocation: () => {
			dispatch(AppActions.setUserLocation())
		},

		search: (query) => {
			dispatch(AppActions.apiSearch('shows', query))
		}
	}
}

export default withRouter(React.memo(withLastLocation(
	connect(mapStateToProps, mapDispatchToProps)(Search)
)))
