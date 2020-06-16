import * as TYPES from './../types.jsx'
import { request } from './../../helpers/request.jsx'
import { track } from './../../helpers/analytics.jsx'
import { existsWithKey } from './../../helpers'
import * as AppActions from './app.jsx'

const VoterActions = {
	/**
	 * Fetchs candidates by an event
	 *
	 * @param {string} eventName - name of the event
	 */
	fetchCandidates: (eventName = 'mvp') => {
		return (dispatch, getState) => {
			dispatch(AppActions.loadStart())

			const { user } = getState().user
			const settings = {
				path: `/candidates/${eventName}`,
			}

			if (!user) {
				return dispatch(AppActions.loadEnd())
			}

			request(settings).end((err, reply) => {
				dispatch(AppActions.loadEnd(err))

				const { body = {} } = reply || {}
				const { candidates = [], return_time = null } = body

				dispatch({
					type: TYPES.SET_CANDIDATES,
					return_time,
					candidates,
				})
			})
		}
	},

	fetchById: (eventName = 'mvp', candidateId) => {
		return (dispatch, getState) => {
			dispatch(AppActions.loadStart())

			const settings = {
				path: `/candidates/${eventName}/${candidateId}`,
			}

			request(settings).end((err, reply) => {
				dispatch(AppActions.loadEnd(err))

				const { body = {} } = reply || {}
				const { candidates = [], return_time = null } = body

				dispatch({
					type: TYPES.SET_CANDIDATES,
					return_time,
					candidates,
				})
			})
		}
	},

	getPermission: (eventName = 'mvp') => {
		return (dispatch, getState) => {
			dispatch(AppActions.loadStart())

			const settings = {
				path: `/vote/permission/${eventName}`,
			}

			request(settings).end((err, reply) => {
				dispatch(AppActions.loadEnd(err))

				const { body = {} } = reply || {}
				const { return_time = null } = body

				dispatch({
					type: TYPES.SET_PERMISSION,
					return_time,
				})
			})
		}
	},
}

export default VoterActions
