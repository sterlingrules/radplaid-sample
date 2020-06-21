import React, { Component } from 'react'
import URI from 'urijs'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { track } from './../../helpers/analytics.jsx'
import { IconClose } from './../../common/icons.jsx'

import {
	getSharePath,
	TwitterButton,
	FacebookButton,
	MessengerButton,
	MailButton
} from './../../common/share.jsx'

class ShowShare extends Component {
	static propTypes = {
		type: PropTypes.string, // ie. notification
		user: PropTypes.object,
		show: PropTypes.object,
		headline: PropTypes.string,
		setNotification: PropTypes.func,
		clearNotifications: PropTypes.func
	}

	constructor(props) {
		super(props)

		this.onCopy = this.onCopy.bind(this)
		this.trackShare = this.trackShare.bind(this)
	}

	trackShare(evt) {
		let { type, show } = this.props
		let { name } = evt.target

		track('share', {
			action: name,
			show_id: show.slug,
			source: type || 'show',
			label: show.slug
		})
	}

	onCopy() {
		let { show, type, setNotification } = this.props

		track('share', {
			action: 'copy',
			show_id: show.slug,
			source: type || 'show',
			label: show.slug
		})

		setNotification({
			status: 'info',
			message: 'Show link copied to clipboard'
		})

		if (this.copyEl) {
			this.copyEl.blur()
		}
	}

	render() {
		let {
			type,
			show,
			user,
			headline,
			setNotification,
			clearNotifications
		} = this.props

		let { title, date, slug } = show
		let username = user ? user.username : null

		const getSharePath = (medium) => {
			let { show, user } = this.props
			let uri = new URI(`${process.env.BASE_CLIENT_URL}/shows/${show.slug}`)

			if (user) {
				uri.search({ ref: user.username })
			}

			return uri.addSearch({
				utm_source: 'promote',
				utm_medium: medium
			})
		}

		return (
			<div className={`show-promo bubble bubble--nopadding text-left color-primary ${type === 'notification' ? 'show-promo--notification' : ''}`}>
				{headline && (
					<div className="bubble-subheadline divider-gradient">
						<span style={{ flexGrow: '1' }}>{headline}</span>
						<div className="cursor-pointer" onClick={clearNotifications}>
							<IconClose className="fill-keyline" />
						</div>
					</div>
				)}
				<div className="bubble-copy">
					<div className="listitem-action text-right">
						<ul className="list list--flex text-uppercase">
							<li>
								<TwitterButton
									slug={slug}
									title={title}
									date={date}
									username={username}
									source="show"
									btnClass="btn btn--twitter widthfull" />
							</li>

							<li>
								<FacebookButton
									slug={slug}
									username={username}
									source="show"
									btnClass="btn btn--facebook widthfull" />
							</li>

							<li className="hide small-show">
								<MessengerButton
									slug={slug}
									username={username}
									source="show"
									btnClass="btn btn--messenger widthfull" />
							</li>

							<li>
								<MailButton
									slug={slug}
									title={title}
									date={date}
									username={username}
									source="show"
									btnClass="btn btn--mail widthfull" />
							</li>
						</ul>
					</div>
					<div className="listitem-content show-sharelink">
						<CopyToClipboard
							text={ getSharePath(username, slug, 'show', 'radplaid') }
							className="cursor-pointer"
							onCopy={this.onCopy}>

							<input
								type="text"
								title="Click to Copy"
								ref={node => this.copyEl = node}
								value={ getSharePath(username, slug, 'show', 'radplaid') }
								readOnly />
						</CopyToClipboard>
					</div>
				</div>
			</div>
		)
	}
}

export default ShowShare
