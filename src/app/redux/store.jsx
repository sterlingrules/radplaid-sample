import defaults from 'lodash/defaults'
import { routerReducer } from 'react-router-redux'
import { persistStore, persistReducer, persistCombineReducers } from 'redux-persist'
import { applyMiddleware, createStore, combineReducers, compose } from 'redux'
// import { CookieStorage } from 'redux-persist-cookie-storage'
import { DEBUG } from './../constants.jsx'
import { DEFAULT_APP, DEFAULT_SHOWS } from './../constants.computed.jsx'
import storage from 'redux-persist/lib/storage'
import createLogger from 'redux-logger'
import Cookies from 'js-cookie'
import thunk from 'redux-thunk'

import app from './reducers/app.jsx'
import user from './reducers/user.jsx'
import shows from './reducers/shows.jsx'
import player from './reducers/player.jsx'
import orders from './reducers/orders.jsx'
import voter from './reducers/voter.jsx'

const logger = createLogger()
// const composeEnhancers = (typeof window !== 'undefined') ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose

const INITIAL_STORE = {
	app: DEFAULT_APP,
	shows: DEFAULT_SHOWS,
}

const persistConfig = {
	key: 'root',
	storage,
	stateReconciler: (inboundState, originalState, reducedState) => {
		if (typeof window === 'undefined' || !window.REDUX_DATA) {
			return reducedState
		}

		reducedState.user = defaults(window.REDUX_DATA.user, reducedState.user)

		return reducedState
	},
	whitelist: [
		'user'
	],
	blacklist: [
		'app',
		'shows',
		'player',
		'voter',
		'routing',
		'orders',
	]
}

const appPersistConfig = {
	key: 'app',
	storage,
	stateReconciler: (inboundState, originalState, reducedState) => {
		if (typeof window === 'undefined' || !window.REDUX_DATA) {
			return reducedState
		}

		return defaults(window.REDUX_DATA.app, reducedState)
	},
	blacklist: [
		'initialized',
		'loggingIn',
		'session',
		'connection',
		'isBrowser',
		'progress',
		'progressStatus',

		'messageId',
		'message',
		'messageTitle',
		'messageType',
		'messageAction',
		'messageSticky',
		'messageClear',
		'messageChildren',

		'isSearching',
		// 'searchSort',
		'searchQuery',
		'searchVenue',
		'searchCost',
		'searchTag',
		'searchLocation',
		'searchDateFrom',
		'searchDateTo',
	],
}

const showsPersistConfig = {
	key: 'shows',
	storage,
	stateReconciler: (inboundState, originalState, reducedState) => {
		if (typeof window === 'undefined' || !window.REDUX_DATA) {
			return reducedState
		}

		return defaults(window.REDUX_DATA.shows, reducedState)
	},
	blacklist: [
		'activeShow',
	],
}

export const persistedReducer = persistReducer(
	persistConfig,
	combineReducers({
		app: persistReducer(appPersistConfig, app),
		shows: persistReducer(showsPersistConfig, shows),
		player,
		user,
		voter,
		orders,
		routing: routerReducer,
	}),
	(typeof window !== 'undefined') ? window.REDUX_DATA : INITIAL_STORE,
)

console.log('DEBUG ', DEBUG)
console.log('process.env.NODE_ENV ', process.env.NODE_ENV)

export const store = createStore(
	persistedReducer,
	compose(
		DEBUG ? applyMiddleware(thunk, logger) : applyMiddleware(thunk)
	)
)

export const persistor = persistStore(store)
