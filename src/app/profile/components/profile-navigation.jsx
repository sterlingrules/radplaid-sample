import React from 'react'
import { NavLink } from 'react-router-dom'

const ProfileNavigation = ({ isCurrentUserProfile, profileId }) => {
	return (
		<ul className="profile-nav">
			<li className="profile-navitem">
				<NavLink to={`/profile/${profileId}/following`} activeClassName="active">Following</NavLink>
			</li>
			<li className="profile-navitem">
				<NavLink to={`/profile/${profileId}/managing`} activeClassName="active">{isCurrentUserProfile ? 'My Events' : 'Upcoming Events'}</NavLink>
			</li>
		</ul>
	)
}

export default ProfileNavigation
