import moment from 'moment'
import React, { Fragment } from 'react'
import ReactTooltip from 'react-tooltip'
import { Link } from 'react-router-dom'
import { track } from './../../helpers/analytics.jsx'
import URI from 'urijs'

export const isLive = (date) => {
	const now = moment().utc().toISOString()
	return (
		moment(now).utc().isAfter(moment(date).utc().subtract(5, 'm').toISOString()) &&
		moment(now).utc().isBefore(moment(date).utc().add(3, 'h').toISOString())
	)
}

const LiveStreamButton = (props) => {
	const {
		slug,
		date,
		url,
	} = props

	const onClick = () => {
		track('show', {
			action: 'livestream',
			source: 'show',
			show_id: slug,
		})
	}

	const source = props.source || new URI(url || '').domain()
	const _isLive = isLive(date)

	return url ? (
		<a
			href={url}
			className={`btn livestream ${_isLive ? 'is-live btn--accent-two--secondary' : 'btn--accept'}`}
			title="Watch Live Stream"
			data-tip data-for={`livestream-${slug}`}
			data-action="Watch Live Stream"
			target="_blank"
			onClick={onClick}>
			<div className={`livestream-alert ${_isLive ? 'is-live' : ''}`} />
			<span className={_isLive ? 'color-error' : ''}>Watch Live</span>
		</a>
	) : (
		<Fragment />
	)
}

export const LiveStreamButtonFull = (props) => {
	const {
		slug,
		date,
		url,
	} = props

	const onClick = () => {
		track('show', {
			action: 'livestream',
			source: 'show',
			show_id: slug,
		})
	}

	const source = props.source || new URI(url || '').domain()
	const _isLive = isLive(date)

	return url ? (
		<div className="buy">
			<ReactTooltip id={`livestream-${slug}`} place="top" effect="solid">
				<span className="tooltip-copy">Where this show will be live streamed</span>
			</ReactTooltip>

			<ReactTooltip id={`follow-${slug}`} place="top" effect="solid">
				<span className="tooltip-copy">Follow to be reminded when they go live</span>
			</ReactTooltip>

			<a
				href={url}
				className={`btn livestream btn-action btn--hero btn--round ${_isLive ? 'is-live btn--accent-two--secondary' : 'btn--accept'}`}
				title="Watch Live Stream"
				data-tip data-for={`livestream-${slug}`}
				data-action="Watch Live Stream"
				target="_blank"
				onClick={onClick}>
				<div className={`livestream-alert ${_isLive ? 'is-live' : ''}`} />
				Watch Live
			</a>

			{source && (
				<div className="buy-source text-ellipsis">
					via <a href={url} target="_blank">{source}</a>
				</div>
			)}
		</div>
	) : (
		<Fragment />
	)
}

export default LiveStreamButton
