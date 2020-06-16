import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MoreMenu from './../more-menu.jsx'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { setNotification } from './../../redux/actions/app.jsx'
import { track } from './../../helpers/analytics.jsx'
import { IconCopy, IconShare } from './../icons.jsx'
import { connect } from 'react-redux'

import {
	getSharePath,
	TwitterButton,
	FacebookButton,
	MessengerButton,
	MailButton
} from './../share.jsx'

const MoreButton = ({ slug, onClick }) => {
	return (
		<button
			className={`btn btn-action`}
			onClick={onClick}
			data-tip
			data-for={`share-${slug}`}
			data-place="topLeft"
			data-action="Share"
			title="Share">
			<IconShare />
		</button>
	)
}

class ShareButton extends Component {
	constructor(props) {
		super(props)
	}

	onCopy = () => {
		let { slug, type, setNotification } = this.props

		track('share', {
			action: 'copy',
			show_id: slug,
			source: 'show_item',
			label: slug
		})

		this.props.setNotification({
			status: 'info',
			message: 'Show link copied to clipboard'
		})
	}

	render() {
		let {
			username,
			viewportName,
			text,
			path,
			slug,
			title,
			date
		} = this.props

		let options = [
			{
				component: () => {
					return (
						<TwitterButton
							path={path}
							slug={slug}
							title={title}
							date={date}
							username={username}
							source="show_item"
							iconClass="fill-twitter" />
					)
				}
			}, {
				component: () => {
					return (
						<FacebookButton
							path={path}
							slug={slug}
							title={title}
							date={date}
							username={username}
							source="show_item"
							iconClass="fill-facebook" />
					)
				}
			}, {
				component: () => {
					return (
						<MailButton
							path={path}
							slug={slug}
							title={title}
							date={date}
							username={username}
							source="show_item"
							iconClass="fill-copy" />
					)
				}
			}, {
				component: () => {
					return (
						<CopyToClipboard
							text={getSharePath(username, path, slug, 'show_item', 'radplaid')}
							onCopy={this.onCopy}>
							<a href="#" onClick={(evt) => evt.preventDefault()}>
								<IconCopy className="fill-copy" />
							</a>
						</CopyToClipboard>
					)
				}
			}
		]

		if (viewportName === 'small') {
			options.splice(2, 0, {
				component: () => {
					return (
						<MessengerButton
							slug={slug}
							title={title}
							date={date}
							username={username}
							source="show_item"
							iconClass="fill-messenger" />
					)
				}
			})
		}

		return (
			<MoreMenu
				className="more-menu--inline"
				source="show_item"
				slug={slug}
				options={options}
				moreButton={MoreButton} />
		)
	}
}

const mapStateToProps = ({ app, user }) => {
	return {
		viewportName: app.viewportName,
		user: user.user
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setNotification: (message) => {
			dispatch(setNotification(message))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ShareButton)
