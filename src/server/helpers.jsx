import keys from 'lodash/keys'
import isEmpty from 'lodash/isEmpty'
import intersection from 'lodash/intersection'
import { SEARCH_PARAMS } from './../app/constants.jsx'

/**
 * Removes br and p tags from strings
 *
 * @param str {String} - string to remove html characters from
 * @return {String} - cleaned string
 */
export const stripHtml = (str) => {
	if (typeof str !== 'string') {
		return str
	}

	return str
		.replace(/<(br|\/p).*?>/gm, ' ')
		.replace(/<(?:.|\n)*?>|"/gm, ' ')
		.trim()
}

/**
 * Formats `searchPath` from a query object
 *
 * @param {Object} query - key value query pairs
 * @return {String} - `searchPath`
 */
export const formatQueryObject = (query) => {
	let _keys = keys(query)
	let searchPath = ''

	_keys.forEach((key, index) => {
		if (index === 0) {
			searchPath += '?'
		}
		else {
			searchPath += '&'
		}

		searchPath += `${key}=${query[key]}`
	})

	return searchPath
}

/**
 * Determines whether or not a URL path is a search
 *
 * @param query {string} - URL query string
 * @return {Boolean} - Whether or not the query is a valid search
 */
export const isSearch = (query) => {
	let queryKeys = keys(query)

	return (
		!isEmpty(query) &&
		intersection(queryKeys, SEARCH_PARAMS).length > 0
	)
}

/**
 * Format meta title based on search query object
 *
 * @param {Object} - URL query string
 *		- @param query {String} - search query
 *		- @param cost {String} - cost (ie. free, under-15, over-15)
 *		- @param tag {String} - show tag
 *		- @param location {String} - city, state or zip
 * @return {String} - meta title for use in the HTML header
 */
export const formatQueryTitle = ({ query, cost, tag, location }) => {
	let reason = []
	let isCostCopy = ''

	// Handle cost title
	if (cost === 'free') {
		isCostCopy = 'Free '
	}
	else if (cost === 'paid') {
		isCostCopy = 'Paid '
	}

	// Handle query titles
	if (location) {
		reason.push(`near ${location}`)
	}

	if (query) {
		reason.push(`matching '${query}'`)
	}

	if (tag) {
		reason.push(`tagged '${tag}'`)
	}

	// Final format
	let heading = `All ${isCostCopy}Local Shows`

	if (query) {
		heading = 'Search Results'
	}

	return `Rad Plaid | ${heading} ${reason.length ? reason.join(' ').trim() : ''}`
}
