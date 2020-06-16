import { DEFAULT_VOTER } from './../../constants.jsx'
import * as TYPES from './../types.jsx'

const voter = (previousState = DEFAULT_VOTER, action) => {
	const { candidates, return_time } = action

	switch(action.type) {
		case TYPES.SET_CANDIDATES:
			return {
				...previousState,
				return_time,
				candidates,
			}
		case TYPES.SET_PERMISSION:
			return {
				...previousState,
				return_time,
			}
		default:
			return previousState
	}
}

export default voter
