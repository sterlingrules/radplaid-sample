import React from 'react'
import TrackImpression from './../utils/track-impression.jsx'
import { IconChevron } from './../icons.jsx'

const PartnerAd = ({ track, title, description, url, displayUrl, image }) => {
	return (
		<TrackImpression
			name="ad"
			data={{
				label: title,
				url,
			}}>
			<a
				href={url}
				target="_blank"
				rel="nofollow"
				className="bubble bubble-copy show-metadata"
				onClick={() => {
					track('ad', {
						action: 'click',
						label: title,
						url,
					})
				}}>

				{image ? (
					<div className="show-metadata-image" style={{ backgroundImage: `url(${image})` }} />
				) : (
					<IconLink className="show-metadata-icon icon--large" />
				)}

				<div className="show-metadata-body">
					<h4 className="typography-tiny-headline text-ellipsis">{title}</h4>
					{description && (
						<div className="typography-tiny text-ellipsis">{`${description.substr(0, 100)}${description.length > 100 ? '...' : ''}`}</div>
					)}
					<div className="typography-tiny text-ellipsis">{displayUrl || url}</div>
				</div>
				<IconChevron className="show-metadata-chevron" />
			</a>
		</TrackImpression>
	)
}

export default PartnerAd
