import moment from 'moment'
import union from 'lodash/union'
import pull from 'lodash/pull'
import isEqual from 'lodash/isEqual'
import isObject from 'lodash/isObject'
import React, { Component } from 'react'
import { withRouter, NavLink, Link } from 'react-router-dom'
import { isMobile } from './../../helpers/device-detect.js'
import { connect } from 'react-redux'
import URI from 'urijs'
import Select from './../../forms/select.jsx'
import { DATE_PATHS } from './../../constants.jsx'
import { DEFAULT_SELECT_SETTINGS } from './../../constants.computed.jsx'
import { IconClose, IconToday } from './../icons.jsx'
import { store } from './../../redux/store.jsx'
import User from './../../authentication/models/user.jsx'
import UserActions from './../../redux/actions/user.jsx'
import * as AppActions from './../../redux/actions/app.jsx'
import { getCurrentDate, getDateRange, getDateName, getOptionByValue } from './../../helpers'
import { track } from './../../helpers/analytics.jsx'
import CalendarFilter from './../calendar-filter.jsx'
import Carousel from './../carousel.jsx'

//
// FILTER OPTIONS
//
const OPTIONS_SCENE = [
	{ value: 'all', label: 'All Scenes' }
]

const OPTIONS_VENUE = [
	{ value: 'all', label: 'All Venues' }
]

const OPTIONS_SORT = [
	{ value: 'all', label: 'All Shows' },
	{ value: 'best', label: 'Best Shows' }
]

const OPTIONS_DATE = [
	{ value: 'all', label: 'All Dates' },
	{ value: 'weekend', label: 'This Weekend' },
	{ value: 'next-weekend', label: 'Next Weekend' },
	{ value: 'next-week', label: 'Next Week' }
]

const OPTIONS_COST = [
	{ value: 'all', label: 'All Prices' },
	{ value: 'free', label: 'Free' },
	{ value: 'under-15', label: 'Under $15' },
	{ value: '15-and-over', label: '$15 and Over' }
]


//
// DEFAULTS
//
const DEFAULT_FILTERS = {
	sort: User.getSort() || 'all',
	venue: getOptionByValue(OPTIONS_VENUE, 'all'),
	date: getCurrentDate(),
	cost: 'all'
}

//
// Component
//
class Filter extends Component {
	constructor(props) {
		super(props)

		this.state = DEFAULT_FILTERS

		this._resetHome = this._resetHome.bind(this)
		this._setToggleFocus = this._setToggleFocus.bind(this)
		this._setDateRange = this._setDateRange.bind(this)
		this._getVenues = this._getVenues.bind(this)
		this._setVenue = this._setVenue.bind(this)
		this._setSort = this._setSort.bind(this)
		this._setCost = this._setCost.bind(this)
	}

	componentWillMount() {
		this.props.fetchVenues()
		this._resetFilter()
	}

	componentWillReceiveProps(nextProps) {
		let {
			shows = [],
			userLocation,
			searchSort,
			fetchVenues,
			resetSearch,
			venues = [],
			user
		} = nextProps

		if (searchSort !== this.state.sort) {
			this.setState({ sort: searchSort })
		}

		if (resetSearch !== this.props.resetSearch) {
			this._resetFilter()
		}

		if (!isEqual(userLocation, this.props.userLocation) ||
			!venues.length && shows.length > 0) {
			this.props.fetchVenues()
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			nextState.focus !== this.state.focus ||
			nextProps.resetSearch !== this.props.resetSearch ||
			nextProps.searchSort !== this.props.searchSort ||
			!isEqual(nextProps.userLocation, this.props.userLocation) ||
			!isEqual(nextProps.venues, this.props.venues) ||
			!isEqual(nextProps.user, this.props.user) ||
			!isEqual(nextState.sort, this.state.sort) ||
			!isEqual(nextState.venue, this.state.venue) ||
			!isEqual(nextState.date, this.state.date) ||
			!isEqual(nextState.cost, this.state.cost)
		)
	}

	_search() {
		let searchButtonEl = document.querySelector('form#search [type="submit"]')

		if (searchButtonEl) {
			searchButtonEl.click()
		}
	}

	_resetHome() {
		this.setState(DEFAULT_FILTERS)
		this.props.resetHome()
	}

	_resetFilter = () => {
		let uri = new URI()
		let { user, history, searchSort, fetchVenues } = this.props
		let { pathname, search } = history.location
		let query = uri.setSearch(search).search(true)
		let dateName = query.from ? getDateName(decodeURIComponent(query.from)) : 'all'

		// Set defaults
		this._setSort(User.getSort() || 'all')

		this.setState({ cost: query.cost || 'all' })

		this.setState({
			date: query.from ? moment(query.from) : getCurrentDate()
		})

		if (query.venue) {
			this.setState({
				venue: {
					value: decodeURIComponent(query.venue),
					label: decodeURIComponent(query.venue)
				}
			})
		}
		else {
			this.setState({
				venue: getOptionByValue(OPTIONS_VENUE, 'all')
			})
		}

		if (DATE_PATHS.indexOf(pathname) >= 0) {
			switch(pathname) {
				case '/weekend':
					this.setState({ date: getOptionByValue(OPTIONS_DATE, 'weekend') })
					break
				case '/next-weekend':
					this.setState({ date: getOptionByValue(OPTIONS_DATE, 'next-weekend') })
					break
				case '/next-week':
					this.setState({ date: getOptionByValue(OPTIONS_DATE, 'next-week') })
					break
			}

			this.props.setSearchDateRange(getDateRange(pathname))
		}
	}

	_setSort(evt) {
		let value = (isObject(evt) && evt.target) ? evt.target.value : evt
		let { user, searchSort, setSearchSort, setSearchLiveStream, clearSearch } = this.props
		let { pathname } = this.props.history.location

		if (isEqual(value, this.state.sort)) {
			return
		}

		this.setState({ sort: value })

		// Save sort option
		if (user) {
			User.setSort(value)
		}

		clearSearch()
		setSearchSort(value)
		setSearchLiveStream('')

		track('filter', {
			action: value,
			label: value,
			filter: value
		})
	}

	_setVenue(evt) {
		let { value, label } = evt
		let { setSearchVenue } = this.props
		let venues = this._getVenues()
		let venueNames = venues.map(v => v.value)

		if (isEqual(evt, this.state.venue)) {
			return
		}

		this.setState({ venue: (value === 'all') ? OPTIONS_VENUE[0] : evt })
		setSearchVenue((value === 'all') ? null : value)

		track('filter', {
			action: value,
			label: value,
			filter: value
		})
	}

	_setCost(evt) {
		let value = (isObject(evt) && evt.target) ? evt.target.value : evt
		let { setSearchCost } = this.props

		if (isEqual(value, this.state.cost)) {
			return
		}

		this.setState({ cost: value })

		setSearchCost(value)

		track('filter', {
			action: value,
			label: value,
			filter: value
		})
	}

	_setDateRange(value) {
		let { setSearchDateRange } = this.props

		if (isEqual(value, this.state.date)) {
			return
		}

		value = moment(value).startOf('day').format(process.env.DATE_FORMAT)

		this.setState({ date: value })
		setSearchDateRange({ from: value })

		track('filter', {
			action: value,
			label: value,
			filter: value
		})
	}

	_setToggleFocus(focus) {
		this.setState({ focus })
	}

	_getVenues() {
		let { user, venues } = this.props
		let _venues = []

		if (venues && venues.length > 0) {
			venues.forEach((venue, index) => {
				_venues.push({
					value: venue.name,
					label: venue.name,
				})
			})
		}

		_venues = union(OPTIONS_VENUE, _venues)

		return _venues
	}

	render() {
		let {
			user,
			history,
			viewportName,

			searchSort,
			searchQuery,
			searchLocation,
			searchDateTo,
			searchCost,
			searchTag
		} = this.props

		let { focus } = this.state

		let { pathname, search } = history.location
		let isSearching = (searchQuery || searchLocation || searchDateTo || searchCost || searchTag)
		let venues = this._getVenues()
		let classColumn = user ? 'col-7-of-12 col-medium-10-of-12' : 'col-6-of-12 col-medium-8-of-12'

		return (
			<div className="header-filter">
				<ul>
					<li className="filter-venue">
						<Select
							type="pill"
							settings={{
								...DEFAULT_SELECT_SETTINGS,
								name: 'venue',
								value: (this.state.venue && this.state.venue.value === 'all') ? venues[0] : this.state.venue,
								defaultValue: venues[0],
								onChange: this._setVenue,
								onFocus: this._setToggleFocus.bind(this, true),
								onBlur: this._setToggleFocus.bind(this, false)
							}}
							options={venues} />
					</li>

					{user && (
						<li className="filter-sort">
							<div className="form-radioset--pill">
								<input id="all-shows" type="checkbox" name="show" value="all" onChange={this._setSort} checked={this.state.sort === 'all' ? 'checked' : false} />
								<label htmlFor="all-shows" className="form-radio">
									All Shows
								</label>

								<input id="best-shows" type="checkbox" name="show" value="best" onChange={this._setSort} checked={this.state.sort === 'best' ? 'checked' : false} />
								<label htmlFor="best-shows" className="form-radio">
									Best Shows
								</label>
							</div>
						</li>
					)}

					<li className="filter-cost">
						<div className="form-radioset--pill">
							<input id="all-cost" type="checkbox" name="cost" value="all" onChange={this._setCost} checked={this.state.cost === 'all' ? 'checked' : false} />
							<label htmlFor="all-cost" className="form-radio">
								All Prices
							</label>

							<input id="free" type="checkbox" name="cost" value="free" onChange={this._setCost} checked={this.state.cost === 'free' ? 'checked' : false} />
							<label htmlFor="free" className="form-radio">
								Free
							</label>

							<input id="$" type="checkbox" name="cost" value="under-15" onChange={this._setCost} checked={this.state.cost === 'under-15' ? 'checked' : false} />
							<label htmlFor="$" className="form-radio">
								$
							</label>

							<input id="$$" type="checkbox" name="cost" value="15-and-over" onChange={this._setCost} checked={this.state.cost === '15-and-over' ? 'checked' : false} />
							<label htmlFor="$$" className="form-radio">
								$$
							</label>
						</div>
					</li>

					<li className="filter-date">
						<CalendarFilter
							value={this.state.date}
							onChange={this._setDateRange} />
					</li>
				</ul>
			</div>
		)
	}
}

const mapStateToProps = ({ app, user, shows }) => ({
	shows: shows.shows,
	showsSort: shows.showsSort,

	user: user.user,

	scenes: app.scenes,
	venues: app.venues,
	userLocation: app.userLocation,
	viewportName: app.viewportName,
	resetSearch: app.resetSearch,
	searchSort: app.searchSort,
	searchQuery: app.searchQuery,
	searchLocation: app.searchLocation,
	searchDateFrom: app.searchDateFrom,
	searchDateTo: app.searchDateTo,
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

		resetHome: () => {
			dispatch(AppActions.resetHome())
		},

		clearSearch: () => {
			dispatch(AppActions.resetSearch())
		},

		fetchVenues: () => {
			dispatch(AppActions.apiFetchVenues())
		},

		setSearchQuery: (query) => {
			dispatch(AppActions.setSearchQuery(query))
		},

		setSearchSort: (sort = 'all') => {
			dispatch(AppActions.setSearchSort(sort))
		},

		setSearchLocation: (scene) => {
			dispatch(AppActions.setSearchLocation(scene))
		},

		setSearchLiveStream: (filter = '') => {
			dispatch(AppActions.setSearchLiveStream(filter))
		},

		setSearchVenue: (venue) => {
			dispatch(AppActions.setSearchVenue(venue))
		},

		setSearchDateRange: (range) => {
			dispatch(AppActions.setSearchDateRange(range))
		},

		setSearchCost: (cost) => {
			dispatch(AppActions.setSearchCost(cost))
		}
	}
}

export default withRouter(
	React.memo(connect(mapStateToProps, mapDispatchToProps)(Filter))
)
