import dotenv from 'dotenv'

dotenv.config()

import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import path from 'path'
import compression from 'compression'
import requestIp from 'request-ip'
import cors from 'cors'
import Handlebars from 'handlebars'
import { CronJob } from 'cron'
import React from 'react'
import moment from 'moment'
import keys from 'lodash/keys'
import isEmpty from 'lodash/isEmpty'
import { Provider } from 'react-redux'
import { Helmet } from 'react-helmet'
import { createStore } from 'redux'
import { renderToString, renderToNodeStream } from 'react-dom/server'
import { StaticRouter, matchPath } from 'react-router-dom'
import { stripHtml, formatQueryObject, isSearch, formatQueryTitle } from './server/helpers'
import { formatTitleFromLineup } from './app/helpers'
import { requestPublic } from './app/helpers/request.jsx'
import UserActions from './app/redux/actions/user'
import * as AppActions from './app/redux/actions/app'
import PlayerActions from './app/redux/actions/player'
import ShowActions from './app/redux/actions/shows'
import HeadMeta from './app/common/headmeta.jsx'
import { store, reducers, persistor } from './app/redux/store'
import Routes from './app/routes.jsx'
import { META_TITLE, META_DESCRIPTION } from './app/constants.jsx'
import { getArtworkUrl } from './app/shows/components/showartwork.jsx'
import SimplePageTemplate from './server/templates/simple-page.jsx'
import manifest from './../public/js/manifest.json'
import getSitemap from './server/get-sitemap'
import App from './app/app.jsx'

import {
	DEFAULT_HEADER,
	BRANCH_IO,
	MIXPANEL,
	FACEBOOK_PIXEL,
	FACEBOOK_SDK,
	SENTRY_SDK,
	GOOGLE_ANALYTICS,
	SURVICATE,
	DRIFT,
	ONE_SIGNAL,
} from './templates/vendors.jsx'

const app = express()

const getScripts = () => {
	let scripts = []

	keys(manifest).forEach((key, index) => {
		if (key.search(/[0-9]|head|simple/g) < 0) {
			scripts.push(`<script async src="${manifest[key]}"></script>`)
		}
	})

	return scripts.join('\n')
}

const DailySitemap = new CronJob({
	cronTime: '00 05 00 * * *', // Every Day at 12:05am
	timeZone: 'America/New_York',
	start: true,
	onTick: getSitemap,
	onComplete: () => {
		console.info('New sitemap created')
	}
})

const reactHeaderQuery = (query) => {
	// Search Header
	return `
		<title>${formatQueryTitle(query)}</title>

		<meta name="description" content="${META_DESCRIPTION}" />

		<meta name="apple-itunes-app" content="app-id=${process.env.APPLE_APP_ID}" />

		<meta property="fb:app_id" content="${process.env.FACEBOOK_APP_ID}" />
		<meta property="og:url" content="${process.env.BASE_CLIENT_URL}" />
		<meta property="og:type" content="website" />
		<meta property="og:title" content="${formatQueryTitle(query)}" />
		<meta property="og:description" content="${META_DESCRIPTION}" />
		<meta property="og:image" content="${process.env.BASE_CLIENT_URL}/img/og.jpg?${new Date().getTime()}" />

		<meta name="twitter:card" content="summary" />
		<meta name="twitter:site" content="@getradplaid" />
		<meta name="twitter:creator" content="@getradplaid" />
		<meta name="twitter:url" content="${process.env.BASE_CLIENT_URL}" />
		<meta name="twitter:title" content="${formatQueryTitle(query)}" />
		<meta name="twitter:description" content="${META_DESCRIPTION}" />
		<meta name="twitter:image" content="${process.env.BASE_CLIENT_URL}/img/og.jpg?${new Date().getTime()}" />

		<link rel="canonical" href="${process.env.BASE_CLIENT_URL}" />
	`
}

const reactHeader = ({ shows, voter }, url) => {

	// Default Header
	if (!shows.activeShow) {
		return DEFAULT_HEADER
	}

	// Shows Header
	let { id, title, lineup, date, description, artwork, slug } = shows.activeShow
	let artworkType = 'url'

	if (artwork) {
		artwork.width = Math.max(artwork.width, 200)
		artwork.height = Math.max(artwork.height, 200)
	}
	else if (Array.isArray(lineup) && lineup.length > 0) {
		artwork = {
			width: 400,
			height: 400,
			url: lineup[0].artwork,
			secure_url: lineup[0].artwork,
			preview: lineup[0].artwork,
			crop: {},
		}
	}

	let artworkPath = getArtworkUrl({ path: artwork })
	let formattedDate = date ? moment(date).format('MMMM D, YYYY') : ''
	let socialTitle = title || ''
	let metaTitle = title || ''
	let metaDescription

	if (lineup && !metaTitle) {
		metaTitle = socialTitle = formatTitleFromLineup(lineup)
	}

	if (description) {
		metaDescription = `${description.substr(0, 150).replace(/\r?\n|\r/g, ' ')}${(description.length > 147) ? '...' : ''}`
	}

	if (metaTitle) {
		//
		// 55 is recommended for a header title – Google SEO
		// 4 is for `... `
		// 12 if for ` | Rad Plaid`
		//
		if (metaTitle.length + formattedDate.length > 71) {
			let remainder = (metaTitle.length + formattedDate.length - 71)
			metaTitle = `${metaTitle.substr(0, metaTitle.length - remainder)}... ${formattedDate}`
		}
		else {
			metaTitle = `${metaTitle}`
			metaTitle += `, ${formattedDate}`
		}

		metaTitle += ` | Rad Plaid`
		socialTitle += ` | Rad Plaid`
	}
	else {
		metaTitle = 'Unable to find this show'
		socialTitle = META_TITLE
	}

	if (typeof window !== 'undefined') {
		artworkType = window.location.protocol === 'https:' ? 'secure_url' : 'url'
	}

	socialTitle = socialTitle || title
	description = stripHtml(description)

	return `
		<title>${metaTitle}</title>

		<link rel="canonical" href="${process.env.BASE_CLIENT_URL}/shows/${slug}" />

		<meta name="apple-itunes-app" content="app-id=${process.env.APPLE_APP_ID}, app-argument=radplaid://s/${slug}" />

		${description ? `<meta name="description" content="${description}" />` : ''}
		${description ? `<meta property="og:description" content="${description}" />` : ''}

		<meta property="og:url" content="${process.env.BASE_CLIENT_URL}/shows/${slug}" />
		<meta property="og:title" content="${metaTitle}" />
		<meta property="og:locale" content="en_US" />

		${artwork ? `<meta property="og:image" content="${artworkPath || artwork[artworkType]}" />` : ''}
		${artwork ? `<meta property="og:image:width" content="${artwork.width}" />` : ''}
		${artwork ? `<meta property="og:image:height" content="${artwork.height}" />` : ''}

		<meta name="twitter:card" content="summary" />
		<meta name="twitter:site" content="@getradplaid" />
		<meta name="twitter:creator" content="@getradplaid" />
		<meta name="twitter:url" content="${process.env.BASE_CLIENT_URL}/shows/${slug}" />
		<meta name="twitter:title" content="${metaTitle}" />

		${description ? `<meta name="twitter:description" content="${description}" />` : ''}
		${artwork ? `<meta name="twitter:image" content="${artworkPath || artwork[artworkType]}" />` : ''}

		<meta name="branch:deeplink:slug" content="${slug}" />
	`
}

const htmlStart = (reactHead) => {
	return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta name="fragment" content="!">

			<meta charset="utf-8">
			<meta http-equiv="x-ua-compatible" content="ie=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

			${reactHead}

			<link rel="apple-touch-icon" href="${process.env.BASE_CLIENT_URL}/img/icons/app-icon.180.png" />
			<link rel="apple-touch-icon" sizes="152x152" href="${process.env.BASE_CLIENT_URL}/img/icons/app-icon.152.png" />
			<link rel="apple-touch-icon" sizes="120x120" href="${process.env.BASE_CLIENT_URL}/img/icons/app-icon.120.png" />
			<link rel="apple-touch-icon" sizes="180x180" href="${process.env.BASE_CLIENT_URL}/img/icons/app-icon.180.png" />
			<link rel="apple-touch-icon" sizes="167x167" href="${process.env.BASE_CLIENT_URL}/img/icons/app-icon.167.png" />
			<meta name="apple-mobile-web-app-title" content="Rad Plaid" />
			<meta name="apple-mobile-web-app-capable" content="no" />

			<!-- <link rel="preload" as="style" href="/css/app.css" /> -->
			<link rel="preload" as="script" href="${manifest['head.js']}" />

			<link rel="stylesheet" type="text/css" href="/css/app.css" media="all" />
			<link rel="icon" type="image/png" href="/img/icons/favicon.png" />

			${(manifest['vendors-head.js']) ?
				`<script async src="${manifest['vendors-head.js']}"></script>` :
				''
			}

			<script async src="${manifest['head.js']}"></script>

			${BRANCH_IO}
			${GOOGLE_ANALYTICS}
			${FACEBOOK_PIXEL}
			${MIXPANEL}
		</head>
		<body>
			<div id="root">`
}

const reactFooter = ({ shows }) => {
	if (!shows.activeShow) {
		let defaultStructuredData = {
			'@context': 'http://schema.org',
			'@type': 'Organization',
			'name': 'Rad Plaid',
			'url': 'https://getradplaid.com',
			'logo': 'https://getradplaid.com/img/press/radplaid-logo_gradient.png',
			'sameAs': [
				'http://instagram.com/getradplaid',
				'http://www.facebook.com/radplaid',
				'http://twitter.com/getradplaid'
			]
		}

		return `<script type="application/ld+json">${JSON.stringify(defaultStructuredData)}</script>`
	}

	let { venue = {} } = shows.activeShow
	let address = {}
	let structuredData = {
		'@context': 'http://schema.org',
		'@type': 'Event',
		'name': shows.activeShow.title || '',
		'description': stripHtml(shows.activeShow.description || META_DESCRIPTION).slice(0, 160),
		'startDate': moment(shows.activeShow.date).utc().format('YYYY-MM-DDTHH:mm:ss'),
		'endDate': moment(shows.activeShow.date).utc().add(4, 'hours').format('YYYY-MM-DDTHH:mm:ss'),
		'location': {
			'@type': 'Place',
			'name': venue ? venue.name : ''
		},
		'image': [],
		'performer': []
	}

	// Venue
	if (venue) {
		if (venue.address) {
			address.streetAddress = venue.address
		}

		if (venue.postalCode) {
			address.postalCode = venue.postalCode
		}

		if (venue.city) {
			address.addressLocality = venue.city
		}

		if (venue.state) {
			address.addressRegion = venue.state
		}

		if (venue.cc) {
			address.addressCountry = venue.cc
		}
	}

	// Artwork
	if (shows.activeShow.artwork && shows.activeShow.artwork.secure_url) {
		structuredData.image.push(shows.activeShow.artwork.secure_url)
	}
	else if (
		Array.isArray(shows.activeShow.lineup) &&
		shows.activeShow.lineup.length > 0 &&
		Array.isArray(shows.activeShow.lineup[0].artists) &&
		Array.isArray(shows.activeShow.lineup[0].artists[0].images) &&
		shows.activeShow.lineup[0].artists[0].images[0]) {

		structuredData.image.push(shows.activeShow.lineup[0].artists[0].images[0].url)

	}

	// Performers
	if (Array.isArray(shows.activeShow.lineup)) {
		shows.activeShow.lineup.forEach((lineup, index) => {
			if (lineup && Array.isArray(lineup.artists) && lineup.artists[0].name) {
				structuredData.performer.push({
					'@type': 'PerformingGroup',
					'name': lineup.artists[0].name
				})
			}
		})
	}

	// Offers
	if (shows.activeShow.ticket_affiliate || shows.activeShow.ticket_url) {
		structuredData.offers = {
			'@type': 'Offer',
			'url': shows.activeShow.ticket_affiliate || shows.activeShow.ticket_url,
			'price': shows.activeShow.door_price || shows.activeShow.advance_price || 0,
			'priceCurrency': 'USD',
			'validFrom': moment(shows.activeShow.createdAt).utc().format('YYYY-MM-DDTHH:mm:ss'),
			'availability': 'http://schema.org/InStock'
		}
	}
	else if (shows.activeShow.door_price) {
		structuredData.offers = {
			'@type': 'Offer',
			'url': shows.activeShow.event_url || `${process.env.BASE_CLIENT_URL}/shows/${shows.activeShow.slug}`,
			'price': shows.activeShow.door_price,
			'priceCurrency': 'USD',
			'validFrom': moment(shows.activeShow.createdAt).utc().format('YYYY-MM-DDTHH:mm:ss'),
			'availability': 'http://schema.org/InStock'
		}
	}
	else {
		structuredData.offers = {
			'@type': 'Offer',
			'url': shows.activeShow.event_url || `${process.env.BASE_CLIENT_URL}/shows/${shows.activeShow.slug}`,
			'price': 0,
			'priceCurrency': 'USD',
			'validFrom': moment(shows.activeShow.createdAt).utc().toDate(),
			'availability': 'http://schema.org/InStock'
		}
	}

	structuredData.location.address = address

	return `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`
}

const htmlEnd = (reactFoot, reduxState) => {
	return `</div>

			<script>
				window.prerenderReady = true;
				window.REDUX_DATA = ${JSON.stringify(reduxState)}
			</script>

			${SENTRY_SDK}

			<!-- Vendors -->
			${getScripts()}

			${reactFoot}

			${FACEBOOK_SDK}
			${SURVICATE}
			${DRIFT}
			${ONE_SIGNAL}

			${process.env.NODE_ENV === 'development' ? (
				`<script src="${process.env.BROWSER_REFRESH_URL}"></script>`
			) : ''}

			<noscript>
				<p style="text-align:center; padding:1em 1em 2em;">For full functionality of this site it is necessary to enable JavaScript.
				Here are the <a href="https://www.enable-javascript.com/" style="text-decoration:underline; font-weight:600;">
				instructions how to enable JavaScript in your web browser</a>.</p>
			</noscript>
			<noscript>
				<img alt="facebook pixel" height="1" width="1" src="https://www.facebook.com/tr?id=663814383984446&ev=PageView&noscript=1" />
			</noscript>
		</body>
		</html>
	`
}

app.use(requestIp.mw())
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.static(path.resolve(__dirname, './../public')))
app.use(compression({
	filter: (req, res) => {
		if (req.headers['x-no-compression']) {
			return false
		}

		return compression.filter(req, res)
	}
}))

app.use(session({
	secret: process.env.SESSION_SECRET,
	saveUninitialized: true,
	resave: false
}))

app.get('/fans', (req, res) => {
	const templateHtml = Handlebars.compile(SimplePageTemplate())
	const data = {
		title: META_TITLE,
		description: META_DESCRIPTION,
		facebook_id: process.env.FACEBOOK_APP_ID,
		ga_id: process.env.GA_ID,
		url: `${process.env.BASE_CLIENT_URL}/fans`,
		base_url: process.env.BASE_CLIENT_URL,
		base_server_url: process.env.BASE_SERVER_URL,
		js_inject: manifest['simple.js'],
	}

	const html = templateHtml(data)

	res.send(html)
})

app.get('/apple-app-site-association', (req, res, ) => {
	res.set('Content-Type', 'application/json')
	res.status(200).send({
		"applinks": {
			"apps": [],
			"details": [
				{
					"appID": "1476084506.com.reactjs.native.radplaid",
					"paths": [ "/shows/*" ]
				}
			]
		}
	})
});

app.get('/*', (req, res) => {
	if (req.path.search(/\/{2,}/g) >= 0) {
		return res.redirect(`${req.path.replace(/\/{2,}/g, '/')}${formatQueryObject(req.query)}`)
	}

	let COOKIE_KEY_USER = encodeURIComponent(`${process.env.HOSTNAME}:user`)
	let COOKIE_KEY_JWT = encodeURIComponent(`${process.env.HOSTNAME}:jwt`)
	let user = req.signedCookies[COOKIE_KEY_USER] || req.cookies[COOKIE_KEY_USER]
	let jwt = req.signedCookies[COOKIE_KEY_JWT] || req.cookies[COOKIE_KEY_JWT]

	user = user ? JSON.parse(user) : null

	// Reset Redux State
	store.dispatch(PlayerActions.stopPlayer())
	store.dispatch(AppActions.resetSearch())
	store.dispatch(AppActions.initializeSession(false))
	store.dispatch(AppActions.setSession(req.sessionID))
	store.dispatch(UserActions.loginUser(user, jwt))

	const CONTEXT = {}
	const DATA_REQUIREMENTS = Routes
		.filter(route => matchPath(req.path, route)) // filter matching paths
		.map(route => route.component) // map to components
		.filter(component => component.serverFetch) // check if components have data requirement
		.map(component => store.dispatch(component.serverFetch(req.path, req.query))) // dispatch data requirement

	const renderApp = () => {
		let jsx
		let reactHead
		let reactRoot
		let reactFoot
		let reduxState

		reduxState = store.getState()

		jsx = (
			<Provider store={store}>
				<StaticRouter context={CONTEXT} location={req.url}>
					<App />
				</StaticRouter>
			</Provider>
		)

		reactHead = isSearch(req.query) ?
			reactHeaderQuery(req.query) :
			reactHeader(reduxState, req.path)

		reactRoot = renderToNodeStream(jsx)
		reactFoot = reactFooter(reduxState)

		if (res.headersSent) {
			return
		}

		res.writeHead(200, {
			'Content-Type': 'text/html'
		})

		res.write(htmlStart(reactHead))
		reactRoot.pipe(res, { end: false })
		reactRoot.on('end', () => {
			res.write(htmlEnd(reactFoot, reduxState))
			res.end()
		})
	}

	Promise.all(DATA_REQUIREMENTS).then(() => {
		store.dispatch(AppActions.clearNotifications())

		const isShow = (req.url.search('/shows/') >= 0 && req.url.search('/edit/') < 0)
		const isVote = !!(req.url.search('/vote/') >= 0 && req.url.replace(/\/vote\/|\?.*/g, ''))

		// Shows Route:
		//		Wait for show to populate reduxState
		//		before rendering App
		if (isShow) {
			let unsubscribe = store.subscribe(() => {
				let { activeShow } = store.getState().shows

				// console.log('activeShow ', activeShow)

				if (!isEmpty(activeShow) && req.url.search(activeShow.slug) >= 0) {
					unsubscribe()

					store.dispatch(AppActions.initializeSession())
					renderApp()
				}
			})
		}

		// All Routes:
		// 		Render App
		else {
			store.dispatch(ShowActions.setActiveShow(null))
			renderApp()
		}

		// If we don't get a response fast enough
		setTimeout(() => renderApp(), 3000)
	})
})

app.listen(process.env.PORT, () => {
	if (process.send) {
		process.send({
			event:'online',
			url:`http://localhost:${process.env.PORT}`
		})
	}
})
