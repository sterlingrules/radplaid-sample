// 'strict mode'
import 'react-app-polyfill/stable'

// Polyfills
import 'raf/polyfill'
import 'object.values'
import 'core-js/es6/map'
import 'core-js/es6/set'
import 'core-js/es6/promise'
import 'core-js/es6/weak-map'
import 'core-js/fn/string/pad-start'
import 'core-js/fn/array/from'
import 'core-js/fn/array/for-each'
import 'core-js/modules/es6.array.is-array'
import 'core-js/es6/reflect'
import './helpers/polyfills'

// Application
import React from 'react'
import ReactDOM from 'react-dom'
import intersection from 'lodash/intersection'
import ErrorBoundary from './common/error-boundary.jsx'
import App from './app.jsx'
import { createBrowserHistory as createHistory } from 'history'
import { PersistGate } from 'redux-persist/integration/react'
import { ConnectedRouter } from 'react-router-redux'
import { connect, Provider } from 'react-redux'
import { DEBUG, SEARCH_PARAMS } from './constants.jsx'
import { isBrowser } from './redux/actions/app.jsx'

import { store, persistor } from './redux/store.jsx'

let prevLocation = ''

const history = typeof createHistory !== 'undefined' ? createHistory() : {}

if (process.env.NODE_ENV !== 'local') {
	// Setup error capture
	Sentry.init({
		dsn: process.env.SENTRY_DSN,
		environment: process.env.NODE_ENV,
		ignoreUrls: [
			/https?:\/\/.+?\.google(|apis|bot)\.com/
		]
	})
}

const pageViewListener = (location = null) => {
	if (typeof window !== 'undefined') {
		location = location || window.location

		let path = location.pathname + location.search

		if (path !== prevLocation) {
			if (DEBUG) {
				console.info('GA page: ', location.pathname + location.search)
			}

			if (typeof ga === 'function') {
				ga('set', 'page', location.pathname + location.search)
				ga('send', 'pageview')

				prevLocation = path
			}
		}
	}
}

const app = (
	<ErrorBoundary>
		<Provider store={store}>
			<PersistGate
				loading={null}
				persistor={persistor}>
				<ConnectedRouter history={history}>
					<App isBrowser={true} />
				</ConnectedRouter>
			</PersistGate>
		</Provider>
	</ErrorBoundary>
)

history.listen(pageViewListener)
ReactDOM.hydrate(app, document.getElementById('root'))
