import { DEFAULT_USER } from './../../constants.jsx'
import * as TYPES from './../types.jsx'

const user = (previousState = DEFAULT_USER, action) => {
	let { jwt, user, shows, genres, _genres } = action

	switch(action.type) {
		case TYPES.LOGIN:
			return {
				...previousState,
				user,
				jwt,
			}
		case TYPES.LOGOUT:
			return {
				...previousState,
				user
			}
		case TYPES.SET_PROFILE:
			let { profile } = action

			return {
				...previousState,
				profile
			}
		case TYPES.SET_SIMILAR_GENRES:
			return {
				...previousState,
				genres,
				_genres
			}
		case TYPES.SET_EMAIL_STATUS:
			let { emailStatus } = action

			return {
				...previousState,
				emailStatus
			}
		case TYPES.SET_USER:
			return {
				...previousState,
				user
			}
		case TYPES.UPDATE_USER_SHOWLIST:
			return {
				...previousState,
				// [action.action]: shows
				...action
			}
		case TYPES.APPEND_USER_SHOWLIST:
			// let _previousState = _.clone(previousState)
			// let _shows = _.union(_previousState[action.action], shows)

			return {
				...previousState,
				// [action.action]: _shows
				...action
			}
		default:
			return previousState
	}
}

export default user
