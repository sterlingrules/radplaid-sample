import { DEFAULT_ORDERS } from './../../constants.jsx'
import * as TYPES from './../types.jsx'

const voter = (previousState = DEFAULT_ORDERS, action) => {
	const { estimate, setupIntent, customer } = action

	switch(action.type) {
		case TYPES.SET_ESTIMATE:
			return {
				...previousState,
				estimate,
			}
		case TYPES.SET_SETUP_INTENT:
			return {
				...previousState,
				customer,
				setupIntent,
			}
		default:
			return previousState
	}
}

export default voter
