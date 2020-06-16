import React, { Component } from 'react'
import DateTime from './../../common/datetime.jsx'
import moment from 'moment'

export const ShowDateTime = ({ date, time, format }) => {
	if (!date) {
		return (<time />)
	}

	let showDate = moment(date).format(format || 'dddd, MMMM D, YYYY')

	return (
		<time className="showitem-date inlineblock" dateTime={showDate}>
			{showDate}&nbsp;
		</time>
	)
}

export const ShowItemVenue = ({ venue, venue_name }) => {
	return !!(venue_name) ? (
		<address className="show-venue typography-small">
			{venue_name || venue.name}
		</address>
	) : !!(venue) ? (
		<address className="show-venue typography-small">
			{venue.name}
		</address>
	) : (
		<div />
	)
}

const ShowMeta = ({ age, date, viewportName }) => {
	const DATE_FORMAT = (viewportName === 'small') ? 'ddd, MMM D' : 'ddd, MMMM D, YYYY'
	let showAge = 'All Ages'

	if (age && age !== 'all') {
		showAge = age
	}

	return (
		<div className="show-date">
			<div className="date">
				{date && (<DateTime date={date} format={DATE_FORMAT} className="typography-body-headline" />)}
				{date && (<span className="typography-body" style={{ margin: '0 0.5rem' }}>at</span>)}
				{date && (<DateTime date={date} format={'LT'} className="typography-body-headline" />)}
			</div>
			{showAge && (
				<div className="show-age typography-body-headline">{showAge}</div>
			)}
		</div>
	)
}

export default ShowMeta
