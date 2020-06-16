import moment from 'moment'
import React, { Component, Fragment } from 'react'
import ViewableMonitor from './../../common/utils/viewable-monitor.jsx'
import { IconChevron } from './../../common/icons.jsx'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Stay22 from './stay22.jsx'
import Map from './map.jsx'

const Venue = (props) => {
	let { isOutOfTown, date, venue, className } = props
	let coordinates = venue ? { lng: venue.lng, lat: venue.lat } : null
	let addressQuery = venue ? `${venue.lat},${venue.lng}` : ''
	let hasAddress = (venue && venue.formattedAddress && Array.isArray(venue.formattedAddress))
	let venueLocation = hasAddress ? venue.formattedAddress.join(', ') : venue ? `${venue.city}, ${venue.state}` : ''
	let isPast = (moment().isAfter(moment(date)))

	return (venue && venue.type === 'venue' && typeof venue.lat === 'number' && typeof venue.lng === 'number') ? (
		<div className={className || ''}>
			<ViewableMonitor minHeight={200}>
				{(isOutOfTown && !isPast) ? (
					<Stay22
						date={date}
						venue={venue}
						height={360} />
				) : (
					<Map
						venue={venue}
						map={{ markers: [{ label: 'music', latitude: venue.lat, longitude: venue.lng }] }}
						width={typeof window !== 'undefined' ? window.innerWidth : null}
						height={240} />
				)}
			</ViewableMonitor>

			<div className="grid">
				<div className="row">
					<div className="col col-6-of-12 col-medium-8-of-12 col-small-12-of-12 center">
						<div className="show-venue bubble bubble--nopadding">
							<div className="bubble-copy">
								{venue ? (
									<address>
										<a
											href={`/?venue=${venue.name}${venueLocation ? `&location=${venueLocation}` : ``}`}
											className="typography-subheadline color-secondary">
											{venue.name}
											<IconChevron className="fill-secondary inlineblock icon--small" />
										</a>

										<a
											href={`http://maps.apple.com/?q=${venue.name}&ll=${addressQuery}`}
											className="typography-small">
											{(venue.formattedAddress && Array.isArray(venue.formattedAddress)) ? venue.formattedAddress.map((value, index) => {
												return <span key={index}>{value}</span>
											}) : (
												<Fragment>{venue.address}, {venue.city}, {venue.state}</Fragment>
											)}
										</a>
									</address>
								) : (<address />)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	) : (
		<div />
	)
}

export default Venue
