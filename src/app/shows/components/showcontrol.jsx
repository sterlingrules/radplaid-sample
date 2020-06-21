import URI from 'urijs'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import PropTypes from 'prop-types'
import { track } from './../../helpers/analytics.jsx'
import FollowButton from './../../common/buttons/follow-button.jsx'
import TicketButton, { TicketButtonFull } from './../../common/buttons/ticket-button.jsx'
import LiveStreamButton, { LiveStreamButtonFull } from './../../common/buttons/livestream-button.jsx'
import ShareButton from './../../common/buttons/share-button.jsx'
import { setNotification, clearNotifications } from './../../redux/actions/app.jsx'
import { Avatar } from './showorganizer.jsx'
import { IconDone, IconBookmark, IconOpenInNew, IconHeart, IconAccountCircle } from './../../common/icons.jsx'

const _getActive = (user, usersByAction) => {
	if (usersByAction && user) {
		for (let i = 0; i < usersByAction.length; i++) {
			if (usersByAction[i].id == user.id) {
				return true
			}
		}
	}

	return false
}

const ActionAvatars = ({ className, following = [], sharedCount }) => {
	let followedCount = following ? following.length : 0
	let total = followedCount + sharedCount
	let avatars = []

	following = following.sort((a, b) => a.photo ? 0 : 1)

	for (let i = 0; i < total; i++) {
		if (i > 4) {
			break
		}

		let avatar = (
			following[i] ? (
				<li key={i} className="show-actionavatar">
					<Avatar user={following[i]} size="small" />
				</li>
			) : (
				<li key={i} className="show-actionavatar">
					<figure className={`avatar avatar--small`}>
						<IconAccountCircle className="center-center fill-white" />
					</figure>
				</li>
			)
		)

		avatars.push(avatar)
	}

	return (total > 0 ? (
			<ul className={`show-actionavatars ${className || ''}`}>
				{avatars}

				<li className="typography-small-headline show-actioncount">
					{total} follow{total > 1 ? 's' : ''}{sharedCount > 0 && ' or shares'}
				</li>
			</ul>
		) : (
			<div className="show-actionavatars" />
		)
	)
}

const CompactControl = (props) => {
	const {
		index,
		title,
		date,
		showId,
		donationUrl,
		donationSource,
		ticketUrl,
		ticketAffiliate,
		ticketGiveaway,
		livestreamUrl,
		livestreamSource,
		advancePrice,
		doorPrice,
		type,
		user,
		organizer,
		following,
		followingUsers = [],
		sharedCount,
		onAction,
	} = props

	return (
		<ul className={`showitem-control ${livestreamUrl ? 'is-streamable' : ''}`}>
			<li>
				<TicketButton
					slug={showId}
					url={ticketUrl}
					affiliate={ticketAffiliate}
					donationUrl={donationUrl}
					donationSource={donationSource}
					advancePrice={advancePrice}
					doorPrice={doorPrice}
					isFree={(!advancePrice && !doorPrice)}
					source="show_item" />

				<LiveStreamButton
					slug={showId}
					date={date}
					source={livestreamSource}
					url={livestreamUrl} />
			</li>
			<li>
				<FollowButton
					type="show"
					slug={showId}
					followers={following}
					followingUsers={followingUsers}
					sharedCount={sharedCount}
					ticketGiveaway={ticketGiveaway}
					onAction={onAction}
					source="show_item" />

				<ShareButton
					slug={showId}
					username={user ? user.username : null}
					title={title}
					date={date}
					source="show_item" />
			</li>
		</ul>
	)
}

class FullControl extends Component {
	static propTypes = {
		type: PropTypes.string, // compact, full
		advancePrice: PropTypes.number,
		doorPrice: PropTypes.number,
		ticketUrl: PropTypes.string,
		ticketAffiliate: PropTypes.string,
		user: PropTypes.object,
		organizer: PropTypes.object,
		following: PropTypes.array,
		attending: PropTypes.array,
		onAction: PropTypes.func,
	}

	componentWillMount() {
		this.setState({ following: this.props.following || [] })
	}

	_onTrackTicket = () => {
		track('show', {
			action: 'ticket',
			show_id: this.props.showId || null,
			source: this.props.showId || null
		})
	}

	render() {
		let {
			id,
			showId,
			advancePrice,
			doorPrice,
			donationUrl,
			donationSource,
			ticketUrl,
			ticketAffiliate,
			ticketSource,
			ticketGiveaway,
			livestreamUrl,
			livestreamDisplayUrl,
			type,
			user,
			date,
			livestreamSource,
			organizer,
			following = [],
			followingUsers = [],
			sharedCount = 0,
			onAction,
		} = this.props

		let classNames = [
			'show-control',
			(!ticketUrl) ? 'show-control--noticket' : ''
		]

		return (
			<div>
				<ActionAvatars
					following={following}
					sharedCount={sharedCount} />

				<div className={classNames.join(' ')}>
					<TicketButtonFull
						slug={showId}
						url={ticketUrl}
						donationUrl={donationUrl}
						donationSource={donationSource}
						affiliate={ticketAffiliate}
						advancePrice={advancePrice}
						doorPrice={doorPrice}
						isFree={(!advancePrice && !doorPrice)}
						source={ticketSource} />

					<LiveStreamButtonFull
						slug={showId}
						date={date}
						source={livestreamSource}
						url={livestreamUrl} />

					<div>
						<FollowButton
							type="show"
							size={livestreamUrl ? 'medium' : 'large'}
							slug={showId}
							followers={following}
							followingUsers={followingUsers}
							ticketGiveaway={ticketGiveaway}
							onAction={onAction}
							source="show" />
					</div>
				</div>
			</div>
		)
	}
}

class ShowControl extends Component {
	render() {
		let { type } = this.props

		return (type === 'compact' ? (
				<CompactControl {...this.props} />
			) : (
				<FullControl {...this.props} />
			)
		)
	}
}

export default withRouter(ShowControl)
