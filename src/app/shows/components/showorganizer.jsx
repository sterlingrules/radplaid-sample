import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { IconAccountCircle } from './../../common/icons.jsx'
import { getArtworkUrl } from './showartwork.jsx'

export const Avatar = ({ user, size, withoutLink }) => {
	let sizeClass = size ? `avatar--${size} icon--${size}` : ''
	let displayName = user.firstName || user.username
	let artwork = ''
	let style = {}

	if (user.photo) {
		artwork = getArtworkUrl({ path: user.photo })
		style.backgroundImage = `url(${artwork})`
	}
	else if (user.avatar) {
		style.backgroundImage = `url(${user.avatar})`
	}

	return (withoutLink ? (
		<Fragment>
			{user.photo ? (
				<figure className={`avatar ${sizeClass}`} style={style} />
			) : (
				<figure className={`avatar ${sizeClass}`}>
					<IconAccountCircle className="center-center fill-white" />
				</figure>
			)}
		</Fragment>
	) : (
		<Link to={`/profile/${user.id}/managing`} title={displayName}>
			{user.photo ? (
				<figure className={`avatar ${sizeClass}`} style={style} />
			) : (
				<figure className={`avatar ${sizeClass}`}>
					<IconAccountCircle className="center-center fill-white" />
				</figure>
			)}
		</Link>
	))
}

const Organizer = ({ user }) => {
	return (
		<div className="showitem-author">
			{user && (
				<React.Fragment>
					<Avatar user={user} size="small" />
					<div className="showitem-authorname">
						<span className="typography-tiny block">{user.byline ? 'Presented by' : 'added by'}</span>
						<span className="strong block typography-small-headline color-primary">
							{user.byline ? (
								<div>{user.byline}</div>
							) : (
								<Link to={`/profile/${user.id}/managing`} className="text-ellipsis">{user.firstName || user.username}</Link>
							)}
						</span>
					</div>
				</React.Fragment>
			)}
		</div>
	)
}

export default Organizer
