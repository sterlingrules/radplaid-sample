import URI from 'urijs'
import moment from 'moment'
import { localStorageExpire, getCurrentDate } from './helpers'
import { isMobile } from './helpers/device-detect'

const uri = new URI()
const query = uri.search(true)

// Portland, ME
export const LOCATION_FALLBACK = [ 43.6590472, -70.2660581 ]
export const LOCATION = {
	id: null,
	name: 'Portland, ME',
	time_zone: 'America/New_York',
	zip: '04101',
	coords: LOCATION_FALLBACK
}

export const DEFAULT_SELECT_SETTINGS = {
	isMulti: false,
	isClearable: false,
	isSearchable: false,
	openMenuOnFocus: true,
	blurInputOnSelect: true,
	controlShouldRenderValue: true,
	menuShouldScrollIntoView: false,
	maxMenuHeight: 160,
	menuShouldBlockScroll: isMobile
}

export const SEARCH_SORT = (() => {
	if (typeof localStorage === 'undefined') {
		return 'all'
	}

	return localStorage.getItem('sort') || 'all'
})()

// **************************************************
// APPLICATION
// **************************************************

export const DEFAULT_APP = {
	// name: 'Rad Plaid',
	initialized: false,
	loggingIn: false,
	session: null,
	connection: true,
	welcomeTotal: null,
	runHomeTutorial: false,
	blogPosts: [],

	viewportName: 'large',
	isBrowser: (typeof window !== 'undefined'),
	windowLoad: true,
	windowProps: {
		width: (typeof window !== 'undefined') ? window.innerWidth : null,
		height: (typeof window !== 'undefined') ? window.innerHeight : null
	},

	progress: [],
	progressName: '',
	progressStatus: 'success',

	messageId: null,
	message: null,
	messageTitle: null,
	messageType: null,
	messageAction: null,
	messageSticky: false,
	messageClear: false,
	messageChildren: null,

	resetSearch: new Date().getTime(),
	isSearching: false,
	searchSort: query.sort || SEARCH_SORT || 'all',
	searchLiveStream: query.searchLiveStream || '',
	searchQuery: query.query || '', // search term
	searchVenue: query.venue || '',
	searchCost: query.cost || '', // additional search paramters (ie. cost)
	searchTag: query.tag || '', // search hashtags
	searchLocation: query.location || '', // search location (city, state, zip)
	searchDateFrom: (typeof getCurrentDate === 'function') ? getCurrentDate() : null,
	searchDateTo: '',

	claim: {},

	ip: null,
	scenes: [],
	venues: [],
	userLocation: (() => {
		if (!localStorageExpire) {
			return {} // LOCATION
		}

		let storedLocation = localStorageExpire.get('location')

		if (storedLocation !== 'undefined' && storedLocation) {
			return JSON.parse(storedLocation)
		}

		return {} // LOCATION
	})()
}

// **************************************************
// SHOWS
// **************************************************

export const DEFAULT_SHOWS = {

	title: '',

	featuredShows: [],
	popularShows: [],

	// listing of shows (could be nearby, filtered, etc.)
	shows: [],
	showsTotal: 0,
	showsLocation: null,
	showsSort: SEARCH_SORT || 'all',
	after: null, // late show date
	afterPage: 0, // next search page
	searchPage: 0,
	isEnd: false,
	isAdminVisible: '',
	summary: {},
	noShows: [], // if no results are returned
	map: {},

	welcome: [],

	// currently queued show
	activeShow: null,

	editShow: null,

	deletedShowId: '',

	// show currently being added
	addShow: {
		date: moment(new Date()).add(1, 'day').utc().set({ hour: 19, minute: 0, second: 0 }).format(),
		advance_price: '',
		door_price: '',
		ticket_url: '',
		event_url: '',
		age: 'all',
		title: '',
		description: '',
		tags: [],
		lineup: [],
		genres: [],
	}
}
