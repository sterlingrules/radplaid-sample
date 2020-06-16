import { DEFAULT_APP } from './../../constants.computed.jsx'
import User from './../../authentication/models/user.jsx'
import { getCurrentDate } from './../../helpers'
import * as TYPES from './../types.jsx'

const app = (previousState = DEFAULT_APP, action) => {
	let {
		from,
		activeShow,
		shows,
		addShow,
		user,
		claim,
		connection,
		runHomeTutorial,
		resetSearch,
		blogPosts,
		progressStatus,
		progressName,
		progress,
		isBrowser
	} = action

	switch(action.type) {
		case TYPES.INITIALIZE_SESSION:
			let { initialized } = action

			return {
				...previousState,
				initialized,
			}
		case TYPES.SET_CONNECTION:
			return {
				...previousState,
				connection,
			}
		case TYPES.LOGGING_IN:
			let { loggingIn } = action

			return {
				...previousState,
				loggingIn
			}
		case TYPES.IS_BROWSER:
			return {
				...previousState,
				isBrowser
			}
		case TYPES.SET_NOTIFICATION:
			let {
				messageId,
				messageSticky,
				messageTitle,
				messageType,
				messageChildren,
				message,
				messageAction
			} = action

			return {
				...previousState,
				messageClear: false,
				messageId,
				messageSticky,
				messageTitle,
				messageType,
				messageAction,
				messageChildren,
				message
			}
		case TYPES.CLEAR_NOTIFICATION:
			return {
				...previousState,
				messageClear: true,
				messageId: null
			}
		case TYPES.RUN_HOME_TUTORIAL:
			return {
				...previousState,
				runHomeTutorial
			}
		case TYPES.LOAD_START:
			return {
				...previousState,
				progressName,
				progressStatus,
				progress
			}
		case TYPES.LOAD_END:
			return {
				...previousState,
				progressName,
				progressStatus,
				progress
			}
		case TYPES.SET_SESSION:
			let { session } = action

			return {
				...previousState,
				session
			}
		case TYPES.SET_SCENES:
			let { scenes } = action

			return {
				...previousState,
				scenes
			}
		case TYPES.SET_VENUES:
			let { venues } = action

			return {
				...previousState,
				venues
			}
		case TYPES.SET_BLOG_POSTS:
			return {
				...previousState,
				blogPosts
			}
		case TYPES.SET_CLAIM:
			return {
				...previousState,
				claim
			}
		case TYPES.SET_VIEWPORT_NAME:
			let { viewportName } = action

			return {
				...previousState,
				viewportName
			}
		case TYPES.SET_WINDOW_LOAD:
			let { windowLoad } = action

			return {
				...previousState,
				windowLoad
			}
		case TYPES.SET_WINDOW_PROPS:
			let { windowProps } = action

			return {
				...previousState,
				windowProps
			}
		case TYPES.SET_IS_SEARCHING:
			let { isSearching } = action

			return  {
				...previousState,
				isSearching
			}
		case TYPES.SET_SEARCH_SORT:
			let { searchSort } = action

			return {
				...previousState,
				searchSort
			}
		case TYPES.SET_SEARCH_LIVE_STREAM:
			let { searchLiveStream } = action

			return {
				...previousState,
				searchLiveStream
			}
		case TYPES.SET_SEARCH_VENUE:
			let { searchVenue } = action

			return {
				...previousState,
				searchVenue
			}
		case TYPES.SET_SEARCH_QUERY:
			let { searchQuery } = action

			return {
				...previousState,
				searchQuery
			}
		case TYPES.SET_USER_IP:
			let { ip } = action

			return {
				...previousState,
				ip
			}
		case TYPES.SET_SEARCH_LOCATION:
			let { searchLocation } = action

			return {
				...previousState,
				searchLocation
			}
		case TYPES.SET_SEARCH_DATE_RANGE:
			let { to } = action

			return {
				...previousState,
				searchDateFrom: from,
				searchDateTo: to
			}
		case TYPES.SET_SEARCH_COST:
			let { cost } = action

			return {
				...previousState,
				searchCost: cost
			}
		case TYPES.SET_SEARCH_TAG:
			let { tag } = action

			return {
				...previousState,
				searchTag: tag
			}
		case TYPES.SET_INITIAL_SEARCH:
			return {
				...previousState,
				...action
			}
		case TYPES.SET_USER_LOCATION:
			let { userLocation } = action

			return {
				...previousState,
				userLocation
			}
		case TYPES.SET_WELCOME_TOTAL:
			let { welcomeTotal } = action

			return {
				...previousState,
				welcomeTotal
			}
		case TYPES.RESET_SEARCH:
			return {
				...previousState,
				searchSort: User.getSort(),
				searchQuery: '',
				searchLocation: '',
				searchCost: '',
				searchTag: '',
				searchDateFrom: getCurrentDate(),
				searchDateTo: '',
				searchVenue: '',
				resetSearch
			}
		case TYPES.RUN_TUTORIAL:
			return {
				...previousState,
				runTutorial
			}
		default:
			return previousState
	}
}

export default app
