import React from 'react'
import MoreMenu from './../../../common/more-menu.jsx'

const ShowItemMoreMenu = (props) => {
	let {
		user,
		organizer,
		slug,
		title,
		deleteShow,
		deletedShowId,
		onReport,
		onClaim
	} = props

	let options = []
	let userNotRadPlaid = ((user && user.firstName !== 'Rad Plaid') || (!user))

	if (user && organizer) {
		if (user.id === organizer.id) {
			// options.push({})
			options.push({ label: 'Edit', path: `/shows/${slug}/edit/1` })
			options.push({
				label: 'Delete',
				action: () => {
					deleteShow(slug || null, title)
				}
			})
		}
	}

	if (userNotRadPlaid && organizer && organizer.firstName === 'Rad Plaid') {
		// options.push({})
		options.push({ label: 'Claim', action: onClaim })
	}

	return (options.length > 0 ? (
			<MoreMenu
				source="show_item"
				options={options} />
		) : (
			<div />
		)
	)
}

export default ShowItemMoreMenu
