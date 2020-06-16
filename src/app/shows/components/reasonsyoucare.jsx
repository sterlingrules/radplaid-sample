import moment from 'moment'
import React, { Fragment, Component } from 'react'
import { Link } from 'react-router-dom'
import { IconHeart, IconStar } from './../../common/icons.jsx'
import { isLive } from './../../common/buttons/livestream-button.jsx'
import ReactTooltip from 'react-tooltip'

const ShowReasonsYouCare = ({ date, className, user, organizer, livestream_url, featured_active, tags, genres, reason, ffo, is_following_artist, is_genre, slug, door_price, advance_price }) => {
	const isOrganizer = (organizer && user && organizer.id === user.id)
	const hasTags = (Array.isArray(tags) && tags.length > 0)
	const hasGenres = (Array.isArray(genres) && genres.length > 0)
	const hasReason = (featured_active || livestream_url || (reason || hasTags || hasGenres))
	const _isLive = isLive(date)

	return (hasReason && (
		<div style={{ flexGrow: 1 }} className={className}>
			{featured_active && (
				<ReactTooltip id={`featured-${slug}`} effect="solid">
					<span className="tooltip-copy">Promoted Event</span>
				</ReactTooltip>
			)}

			{reason && (
				is_following_artist ? (
					<ReactTooltip id={`reason-${slug}`} effect="solid">
						<IconHeart className="fill-white inlineblock icon--small" />
						<span className="tooltip-copy">{reason && reason.split(/,|and/).length > 1 ? 'Artists' : 'An artist'} you follow</span>
					</ReactTooltip>
				) : is_genre && (
					<ReactTooltip id={`reason-${slug}`} effect="solid">
						<IconStar className="fill-white inlineblock icon--small" />
						<span className="tooltip-copy">{(user && user.spotify_connect) ? 'If' /* 'Because' */ : 'If'} you like {reason}, we think you'll dig this event.</span>
					</ReactTooltip>
				)
			)}

			<div className="showitem-ryc">
				{!!(livestream_url) && (
					<div className={`violator ${_isLive ? 'violator--live' : 'violator--active'}`}>
						<div className={`livestream-alert ${_isLive ? 'is-live' : ''}`} />
						<span>Live Stream</span>
					</div>
				)}

				{(!isOrganizer && reason && (is_following_artist || is_genre)) ? (
					<div
						data-tip data-for={`reason-${slug}`}
						data-tutorial-offset="100"
						className={`violator violator--reason text-ellipsis violator--reason-icon`}
						title={reason}>
						{is_following_artist ? (
							<IconHeart className="center-vertical icon--small" />
						) : is_genre && (
							<IconStar className="center-vertical icon--small" />
						)}
						{reason}
					</div>
				) : hasGenres ? (
					<div
						data-tip data-for={`reason-${slug}`}
						data-tutorial-offset="100"
						className={`violator violator--reason text-ellipsis`}
						title={genres.slice(0, 3).join(', ')}>
						{genres.slice(0, 3).join(', ')}
					</div>
				) : hasTags && (
					tags.map((tag, index) => {
						if (index < 3) {
							return (
								<Link
									key={tag.id || tag.value}
									className="violator"
									to={{
										pathname: `/`,
										search: `tag=${encodeURIComponent(tag.value)}`
									}}>
									{tag.value}
								</Link>
							)
						}
					})
				)}

				{featured_active && (
					<div
						data-tip data-for={`featured-${slug}`}
						className="violator violator--radplaid">
						Promoted
					</div>
				)}
			</div>
		</div>
	))
}

export default ShowReasonsYouCare
