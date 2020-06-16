import { store } from './../redux/store.jsx'
import * as AppActions from './../redux/actions/app.jsx'
import { track } from './analytics.jsx'
import { DEBUG } from './../constants.jsx'
import User from './../authentication/models/user.jsx'
import superagent from 'superagent'
import superagentCache from 'superagent-cache'

const RETRY_COUNT = 3
let retries = 0

const timeoutOptions = {
	response: 10000 * 2, // Wait 10 seconds for the server to start sending,
	deadline: 30000 // but allow 30 seconds for the file to finish loading.
}

const retrying = (err, path) => {
	if (!err) return false

	track('api', {
		action: 'retry',
		label: path,
		message: err,
	})

	return true
}

const apiError = (err) => {
	retries++
	store.dispatch(AppActions.loadEnd(err))

	const { connection } = store.getState().app

	if (process.env.DEBUG && err) {
		console.error(err)
	}

	// Only display errors
	// in the browser
	if (!connection || !process.browser) {
		return
	}

	if (err.timeout && retries >= RETRY_COUNT) {
		track('api', {
			action: 'error',
			label: 'timeout',
			message: err
		})

		store.dispatch(AppActions.setConnection(false))
		store.dispatch(AppActions.clearNotifications())
		store.dispatch(AppActions.setNotification({
			status: 'error',
			message: 'Sorry, struggling to reach Rad Plaid at the moment.',
			title: 'Timeout'
		}))

		retries = 0

		return
	}
	else if (err && err.status !== 404) {
		track('api', {
			action: 'error',
			label: 'error',
			message: err
		})

		if (DEBUG) {
			console.log('Server err ', err)
		}

		store.dispatch(AppActions.setConnection(false))
		store.dispatch(AppActions.clearNotifications())
		store.dispatch(AppActions.setNotification({
			status: 'error',
			message: 'Sorry, we\'ve encountered an error. Our team is on it.'
		}))
	}
}

const uploadError = (err) => {
	store.dispatch(AppActions.loadEnd(err))

	if (err) {
		track('upload', {
			action: 'error',
			label: err,
			message: err,
		})

		store.dispatch(AppActions.setNotification({
			status: 'error',
			message: 'Sorry, we\'ve encountered an error uploading your flyer. Please, try again.'
		}))
	}
}

export const upload = (path, data, onProgress = () => {}) => {
	let token = User.getToken()
	let jwt = token ? token : ''
	let options = {
		method: 'POST',
		body: data,
		headers: {
			'x-radplaid-client-id': process.env.RADPLAID_CLIENT_ID,
			'Authorization': jwt ? `Bearer ${jwt}` : ''
		}
	}

	return superagent.post(`${process.env.BASE_SERVER_URL}/${process.env.API_VERSION}${path}`)
		.timeout({
			response: 1000 * 180, // Wait 10 seconds for the server to start sending,
			deadline: 1000 * 180 // but allow 3 minutes for the file to finish loading.
		})
		.set('Authorization', `Bearer ${jwt}`)
		.set('x-radplaid-client-id', process.env.RADPLAID_CLIENT_ID)
		.field('tags', data.tags || 'flyer')
		.field('zoom', data.zoom || 1)
		.field('crop', JSON.stringify(data.crop || '{}'))
		.field('name', data.name || 'artwork')
		.attach(data.name, data.file)
		.on('progress', onProgress)
		.on('error', uploadError)
}

export const requestOnce = (_settings = {}) => {
	let worker
	let token = User.getToken() || store.getState().user.jwt
	let jwt = token ? token : ''
	let forceUpdate = _settings.forceUpdate || false
	let retries = 0
	let settings = Object.assign({
		path: '',
		method: 'get',
		data: {},
	}, _settings)

	return superagent[settings.method](`${process.env.BASE_SERVER_URL}/${process.env.API_VERSION}${settings.path}`)
		.timeout(timeoutOptions)
		.set('Content-Type', 'application/json')
		.set('x-radplaid-client-id', process.env.RADPLAID_CLIENT_ID)
		.set('Authorization', jwt ? `Bearer ${jwt}` : '')
		.on('error', apiError)
		.send(settings.data)
}

export const requestPublic = (_settings = {}) => {
	let worker
	let token = User.getToken() || store.getState().user.jwt
	let jwt = token ? token : ''
	let forceUpdate = _settings.forceUpdate || false
	let retries = 0
	let settings = Object.assign({
		path: '',
		method: 'get',
		data: {},
	}, _settings)

	return superagent[settings.method](`${process.env.BASE_SERVER_URL}/${process.env.API_VERSION}${settings.path}`)
		.timeout(timeoutOptions)
		.retry(RETRY_COUNT, (err, reply) => retrying(err, settings.path))
		.set('Content-Type', 'application/json')
		.set('x-radplaid-client-id', process.env.RADPLAID_CLIENT_ID)
		.set('Authorization', jwt ? `Bearer ${jwt}` : '')
		.on('error', apiError)
		.send(settings.data)
}


/*
 * Queries Rad Plaid API Server
 *
 * @param _settings {Object}
 * @param _settings.path {String} - API request path without `process.env.BASE_SERVER_URL` (ie. `/shows/create`)
 * @param _settings.method {String} - API method. Defaults to `get`
 * @param _settings.data {Object} - API data object if method is `post || put`
 *
 * @return
 *      {err} - If error, will return error data
 *      {reply} - If successful, returns completed request data
 */
export const request = (_settings = {}) => {
	let worker
	let token = User.getToken() || store.getState().user.jwt
	let jwt = token ? token : ''
	let forceUpdate = _settings.forceUpdate || false
	let settings = Object.assign({
		path: '',
		method: 'get',
		data: {},
	}, _settings)

	if (!jwt) {
		return requestPublic(_settings)
	}

	return superagent[settings.method](`${process.env.BASE_SERVER_URL}/${process.env.API_VERSION}${settings.path}`)
		.timeout(timeoutOptions)
		.retry(RETRY_COUNT, (err, reply) => retrying(err, settings.path))
		.set('Content-Type', 'application/json')
		.set('Authorization', `Bearer ${jwt}`)
		.set('x-radplaid-client-id', process.env.RADPLAID_CLIENT_ID)
		.on('error', apiError)
		.send(settings.data)
}

export const requestSimple = (path, callback) => {
	let settings = {
		path,
		method: 'get',
	}

	return superagent[settings.method](`${process.env.BASE_SERVER_URL}/${process.env.API_VERSION}${settings.path}`)
		.timeout(timeoutOptions)
		.set('Content-Type', 'application/json')
		.set('x-radplaid-client-id', process.env.RADPLAID_CLIENT_ID)
}
