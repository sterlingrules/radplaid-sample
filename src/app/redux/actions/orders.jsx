import URI from 'urijs'
import * as TYPES from './../types.jsx'
import clone from 'lodash/clone'
import { request, requestOnce } from './../../helpers/request.jsx'
import { track } from './../../helpers/analytics.jsx'
import ShowModel from './../../shows/models/shows.jsx'
import * as AppActions from './app.jsx'
import ShowActions from './shows.jsx'

const OrderActions = {
	create: (data, callback) => {
		return (dispatch, getState) => {
			dispatch(AppActions.loadStart('order:create'))

			const _show = clone(getState().shows.activeShow || {})
			const { slug } = _show
			const settings = {
				path: `/orders/${slug}`,
				method: 'post',
				data,
			}

			requestOnce(settings).end((err, reply) => {
				dispatch(AppActions.loadEnd(err, 'order:create'))

				if (err) {
					return dispatch(AppActions.setNotification({
						status: 'error',
						title: 'Error creating promotion',
						message: 'We had a problem setting up this promotion.',
					}))
				}

				const { body = {} } = reply || {}

				_show.products = body.products

				dispatch(ShowActions.updateActiveShow(_show))

				if (typeof callback === 'function') {
					callback()
				}

				dispatch(AppActions.setNotification({
					status: 'success',
					title: 'Promotion created',
					message: 'Your show promotion is now live',
				}))

				// Recache
				dispatch(ShowActions.apiFetchShowById(slug, { recache: true }))
			})
		}
	},

	update: (data, callback) => {
		return (dispatch, getState) => {
			dispatch(AppActions.loadStart())

			const _show = clone(getState().shows.activeShow || {})

			_show.products = _show.products || []

			if (!_show.products.length) {
				if (typeof callback === 'function') {
					return callback()
				}

				return
			}

			const settings = {
				path: `/orders/${_show.products[0].id}`,
				method: 'put',
				data,
			}

			requestOnce(settings).end((err, reply) => {
				dispatch(AppActions.loadEnd(err))

				const { body = {} } = reply || {}

				_show.products = body.products
				_show.featured_active = body.products[0].active

				dispatch(ShowActions.updateActiveShow(_show))

				if (typeof callback === 'function') {
					callback()
				}

				dispatch(AppActions.setNotification({
					status: 'success',
					title: 'Promotion updated',
					message: 'Your show promotion has been updated',
				}))

				// Recache
				dispatch(ShowActions.apiFetchShowById(_show.slug, { recache: true }))
			})
		}
	},

	delete: (callback) => {
		return (dispatch, getState) => {
			dispatch(AppActions.loadStart())

			const _show = clone(getState().shows.activeShow || {})

			_show.products = _show.products || []

			if (!_show.products.length) {
				if (typeof callback === 'function') {
					return callback()
				}

				return
			}

			const settings = {
				path: `/orders/${_show.products[0].id}`,
				method: 'delete',
			}

			requestOnce(settings).end((err, reply) => {
				dispatch(AppActions.loadEnd(err))

				const { body = {} } = reply || {}

				_show.products = null

				dispatch(ShowActions.updateActiveShow(_show))

				if (typeof callback === 'function') {
					callback()
				}
			})
		}
	},

	fetchSetupIntent: () => {
		return (dispatch, getState) => {
			dispatch(AppActions.loadStart('setup-intent'))

			const settings = {
				path: `/orders/setup-intent`,
			}

			requestOnce(settings).end((err, reply) => {
				dispatch(AppActions.loadEnd(err, 'setup-intent'))

				const { body = {} } = reply || {}

				dispatch({
					type: TYPES.SET_SETUP_INTENT,
					...body,
				})
			})
		}
	},

	fetchEstimate: (props, callback) => {
		return (dispatch, getState) => {
			dispatch(AppActions.loadStart('estimate'))

			const query = new URI().setSearch(props).search()
			const { slug } = getState().shows.activeShow || {}
			const settings = {
				path: `/orders/${slug}/estimate${query}`,
			}

			requestOnce(settings).end((err, reply) => {
				dispatch(AppActions.loadEnd(err, 'estimate'))

				const { body = {} } = reply || {}

				dispatch({
					type: TYPES.SET_ESTIMATE,
					estimate: body,
				})

				if (typeof callback === 'function') {
					callback()
				}
			})
		}
	},
}

export default OrderActions
