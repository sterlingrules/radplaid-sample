import React, { Component } from 'react'

const InviteButton = () => {
	return (
		<a
			href="#"
			className="btn btn--hero btn--round btn--accept"
			onClick={evt => {
				evt.preventDefault()

				if (typeof FB !== 'undefined') {
					FB.ui({
						method: 'send',
						link: 'http://www.nytimes.com/interactive/2015/04/15/travel/europe-favorite-streets.html',
					})
				}
			}}>Invite</a>
	)
}

export default InviteButton
