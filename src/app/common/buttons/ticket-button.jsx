import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { track } from './../../helpers/analytics.jsx'
import URI from 'urijs'

const TicketButton = (props) => {
	const {
		value,
		slug,
		url,
		donationUrl,
		affiliate,
		source,
		advancePrice,
		doorPrice,
		isFree = false
	} = props

	const onClick = () => {
		track('show_item', {
			action: 'ticket',
			source: source || null,
			show_id: slug
		})
	}

	const onDonateClick = () => {
		track('show_item', {
			action: 'donate',
			source: source || null,
			show_id: slug
		})
	}

	return (affiliate || url) ? (
		<a
			href={affiliate || url}
			className={`btn btn-action btn--buy`}
			title="Get Tickets"
			data-action="Get Tickets"
			target="_blank"
			onClick={onClick}>
			{value || `${advancePrice ? `$${advancePrice} — ` : ''}Get Tickets`}
		</a>
	) : (donationUrl) ? (
		<a
			href={donationUrl}
			className={`btn btn-action btn--buy`}
			title="Donate"
			data-action="Donate"
			target="_blank"
			onClick={onDonateClick}>
			Donate
		</a>
	) : isFree ? (
		<Link
			to={`/shows/${slug}`}
			className={`btn btn--accent-three`}
			title="Free">
			Free
		</Link>
	) : (advancePrice || doorPrice) && (
		<Link
			to={`/shows/${slug}`}
			className={`btn btn--disabled`}>
			{advancePrice && (`$${advancePrice}`)}
			{(advancePrice && doorPrice) && ' / '}
			{doorPrice && (`$${doorPrice}`)}
			{` — Doors`}
		</Link>
	)
}

export const TicketButtonFull = (props) => {
	const {
		value,
		slug,
		url = '',
		donationUrl,
		affiliate,
		advancePrice,
		doorPrice,
		isFree = false
	} = props

	const source = props.source || new URI(url || '').domain()
	const donationSource = props.donationSource || new URI(url || '').domain()

	const onClick = () => {
		track('show', {
			action: 'ticket',
			source: 'show',
			show_id: slug
		})
	}

	const onDonateClick = () => {
		track('show_item', {
			action: 'donate',
			source: 'show',
			show_id: slug
		})
	}

	return (
		<div className="buy text-center">
			{(affiliate || url) ? (
				<Fragment>
					<a
						href={affiliate || url}
						className={`btn btn--round btn--hero btn-action btn--buy`}
						title="Get Tickets"
						data-action="Get Tickets"
						target="_blank"
						onClick={onClick}>
						{value || `${advancePrice ? `$${advancePrice} — ` : ''}Get Tickets`}
					</a>
					{source && (
						<div className="buy-source text-ellipsis">
							via <a href={affiliate || url} target="_blank">{source}</a>
						</div>
					)}
				</Fragment>
			) : (donationUrl) ? (
				<Fragment>
					<a
						href={donationUrl}
						className={`btn btn--round btn--hero btn-action btn--buy`}
						title="Donate"
						data-action="Donate"
						target="_blank"
						onClick={onDonateClick}>
						Donate
					</a>
					{donationSource && (
						<div className="buy-source text-ellipsis">
							via <a href={donationUrl} target="_blank">{donationSource}</a>
						</div>
					)}
				</Fragment>
			) : isFree ? (
				<div
					className={`btn btn--round btn--hero btn--accent-three pointerevent-none`}
					style={{ boxShadow: 'none' }}
					title="Free">
					Free
				</div>
			) : (advancePrice || doorPrice) && (
				<div
					className={`btn btn--round btn--hero btn--disabled pointerevent-none`}
					style={{ boxShadow: 'none' }}>
					{advancePrice && (`$${advancePrice}`)}
					{(advancePrice && doorPrice) && ' / '}
					{doorPrice && (`$${doorPrice}`)}
					{` — Doors`}
				</div>
			)}
		</div>
	)
}

export default TicketButton
