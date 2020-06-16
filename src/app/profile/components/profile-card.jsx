import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { IconAccountCircle, IconEdit } from './../../common/icons.jsx'
import { Avatar } from './../../shows/components/showorganizer.jsx'

class ProfileCard extends Component {
	render() {
		let { profile, id, isCurrentUserProfile } = this.props

		return (
			<div className="col col-3-of-12 col-small-12-of-12">
				{profile && (
					<div className="profile-info">
						<div className="profile-avatar">
							{isCurrentUserProfile && (
								<div className="corner-actions">
									<Link to="/settings" className="corner-action">
										<IconEdit style={{ width: 14, height: 14 }} />
									</Link>
								</div>
							)}

							<Avatar
								user={profile}
								withoutLink={true}
								size="large" />
						</div>

						<div className="profile-name">
							<h2 className="typography-body-headline">{profile.firstName || profile.username}</h2>
							{(profile.scenes.length > 0) && (
								<ul className="showitem-tags showitem-tags--right typography-small">
									{profile.scenes.map((scene, index) => {
										return (
											<li key={index}>
												<a
													href={`/location=${encodeURIComponent(scene.location.join(','))}`}
													className="violator violator--location">
													{scene.name}
												</a>
											</li>
										)
									})}
								</ul>
							)}
							{profile.bio && (<p className="profile-bio">{profile.bio}</p>)}
						</div>
					</div>
				)}
			</div>
		)
	}
}

export default ProfileCard
