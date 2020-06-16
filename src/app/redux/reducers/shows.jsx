import clone from 'lodash/clone'
import defaults from 'lodash/defaults'
import { DEFAULT_SHOWS } from './../../constants.computed.jsx'
import * as TYPES from './../types.jsx'

const _getShowsTotal = (shows) => {
	if (!Array.isArray(shows)) {
		return 0
	}

	let total = 0

	shows.forEach((show, index) => {
		if (Array.isArray(show)) {
			show.forEach((ownerShow) => {
				total++
			})
		}
		else if (show.type !== 'title') {
			total++
		}
	})

	return total
}

const shows = (previousState = DEFAULT_SHOWS, action) => {
	let {
		id,
		title,
		shows,
		showsLocation,
		showsSort,
		showsTotal,
		featuredShows,
		popularShows,
		similarShows,
		noShows,
		map,
		after,
		afterPage,
		searchPage = 0,
		isEnd,
		isAdminVisible,
		summary,
		activeShow,
		editShow,
		addShow
	} = action

	switch(action.type) {
		case TYPES.SET_ADMIN_VISIBLE:
			return {
				...previousState,
				isAdminVisible,
			}
		case TYPES.SET_SHOW_TITLE:
			return {
				...previousState,
				title
			}
		case TYPES.SET_SHOW_SORT:
			return {
				...previousState,
				showsSort
			}
		case TYPES.SET_ACTIVE_SHOW:
			return {
				...previousState,
				activeShow
			}
		case TYPES.SET_FEATURED_SHOWS:
			return {
				...previousState,
				featuredShows,
			}
		case TYPES.SET_POPULAR_SHOWS:
			return {
				...previousState,
				popularShows,
			}
		case TYPES.SET_SIMILAR_SHOWS:
			return {
				...previousState,
				similarShows
			}
		case TYPES.SET_SHOWLIST:
			return {
				...previousState,
				shows,
			}
		case TYPES.SET_EDIT_SHOW:
			return {
				...previousState,
				editShow
			}
		case TYPES.UPDATE_SHOWLIST:
			return {
				...previousState,
				showsTotal: showsTotal || _getShowsTotal(shows),
				showsLocation,
				shows,
				showsSort,
				map,
				after,
				afterPage,
				searchPage,
				isEnd,
				summary,
				noShows
			}
		case TYPES.UPDATE_WELCOMELIST:
			let { welcome } = action

			return {
				...previousState,
				welcome,
				map,
				showsTotal: showsTotal || _getShowsTotal(welcome),
				after,
				isEnd
			}
		case TYPES.UPDATE_SHOWLIST_BY_ID:
			return {
				...previousState,
				shows
			}
		case TYPES.DELETE_SHOW:
			return {
				...previousState,
				deletedShowId: id
			}
		case TYPES.APPEND_SHOWLIST:
			let _previousShows = clone(previousState.shows || [])
			let _shows = _previousShows.concat(shows)

			return {
				...previousState,
				showsTotal: showsTotal,
				showsLocation,
				shows: _shows,
				after,
				afterPage,
				searchPage,
				isEnd,
				summary
			}
		case TYPES.UPDATE_ACTIVE_SHOW:
			let _activeShow = defaults(activeShow, previousState.activeShow)

			return {
				...previousState,
				activeShow: _activeShow
			}
		case TYPES.UPDATE_ADD_SHOW:
			return {
				...previousState,
				addShow
			}
		case TYPES.UPDATE_EDIT_SHOW:
			return {
				...previousState,
				editShow
			}
		default:
			return previousState
	}
}

export default shows
