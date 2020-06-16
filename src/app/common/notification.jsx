import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import NotificationSystem from 'react-notification-system'
import { IconChevron, IconRefresh } from './icons.jsx'
import ReactHtmlParser from 'react-html-parser'

const getMessageByType = (type = 'success') => {
	switch(type) {
		case 'success':
			return 'Yippee!'
		case 'error':
			return 'Oh no!'
		default:
			return 'Woohoo!'
	}
}

const getButtonValue = ({ label, icon }) => {
	if (icon) {
		if (icon === 'refresh') {
			return <IconRefresh alt={label} />
		}

		if (icon === 'chevron') {
			return <IconChevron alt={label} />
		}
	}
	else {
		return label
	}
}

class Notification extends Component {
	static propTypes = {
		// @param message {String} - Main message content
		message: PropTypes.string,

		// @param messageType {String} - `success`, `error`, `warning` and `info`
		messageType: PropTypes.string,

		// @param messageTitle {String} - Notification title
		messageTitle: PropTypes.string,

		// @param messageSticky {Boolean} - Sets notification to stay
		messageSticky: PropTypes.bool,

		// @param messageAction {Object} - Sets an action a user can take from a notification
		//		@param messageAction.label {String} - Button label
		// 		@param messageAction.callback {Function} - Action button should take
		messageAction: PropTypes.object
	}

	constructor(props) {
		super(props)

		this.state = {
			previousId: null
		}

		this._listen = this._listen.bind(this)
	}

	componentDidMount() {
		this._listen()
	}

	componentWillUnmount() {
		this._listen(false)
	}

	_listen(state = true) {
		let method = state ? 'addEventListener' : 'removeEventListener'
		let { clearNotifications } = this.props

		const onKeyUp = ({ keyCode, which }) => {
			if (keyCode === 27 || which === 27) {
				if (this.notificationSystem) {
					this.notificationSystem.clearNotifications()
				}
			}
		}

		window[method]('keyup', onKeyUp)
	}

	componentWillReceiveProps(nextProps) {
		let {
			message,
			messageId = new Date().getTime(),
			messageType,
			messageTitle,
			messageSticky,
			messageAction,
			messageChildren,
			messageClear
		} = nextProps

		let sticky = 5

		if (messageSticky === true) {
			sticky = 0
		}
		else if (messageSticky && typeof messageSticky === 'number') {
			sticky = messageSticky
		}

		if (messageClear) {
			this.notificationSystem.clearNotifications()
			this.setState({ previousId: null })
			return
		}

		if (!messageType) {
			console.warn('Notication type required: `success`, `error`, `warning` and `info`')
			return
		}

		/**
		 * NOTIFICATION TYPES:
		 * 		`success`, `error`, `warning` and `info`
		 *
		 * https://github.com/igorprado/react-notification-system
		 */
		let notification = {
			uid: messageId,
			level: messageType,
			position: 'br', // tr (top right), tl, tc, br, bl, bc
			autoDismiss: sticky, // in seconds
			dismissible: 'click',
			children: messageChildren ? messageChildren : (
				<div className="notification-content">
					<div className={`notification-message ${(messageAction && messageAction.icon) ? 'notification-simple' : ''}`}>
						<div className="notification-body">
							{messageTitle && (<h4 className="text-uppercase">{messageTitle}</h4>)}
							{message && (<p>{ReactHtmlParser(message)}</p>)}
						</div>
						{messageAction && (
							<button
								className="notification-action-button text-ellipsis"
								onClick={() => messageAction.callback(this.props.history)}>
								{getButtonValue(messageAction)}
							</button>
						)}
					</div>
				</div>
			)
		}

		// We're editing the current notification
		if (notification.uid === this.state.previousId) {
			this.notificationSystem.editNotification(messageId, notification)
		}
		// Otherwise, we're creating one
		else {
			this.notificationSystem.addNotification(notification)
			this.setState({ previousId: notification.uid })
		}
	}

	render() {
		let { messageChildren } = this.props

		// style={false} - disables inline styles
		return (
			<Fragment>
				<NotificationSystem
					style={false}
					ref={node => this.notificationSystem = node} />
			</Fragment>
		)
	}
}

const mapStateToProps = ({ app, shows }) => ({
	message: app.message,
	messageId: app.messageId,
	messageType: app.messageType,
	messageTitle: app.messageTitle,
	messageAction: app.messageAction,
	messageChildren: app.messageChildren,
	messageSticky: app.messageSticky,
	messageClear: app.messageClear
})

const mapDispatchToProps = dispatch => {
	return {}
}

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(Notification)
)
