import URI from 'urijs'
import find from 'lodash/find'
import isEqual from 'lodash/isEqual'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Experiment, Variant, emitter, experimentDebugger } from 'react-ab-test'
import ShowActions from './../../redux/actions/shows.jsx'
import Popover, { ArrowContainer } from 'react-tiny-popover'
import { IconHeart, IconHeartEmpty } from './../../common/icons.jsx'
import { track } from './../../helpers/analytics.jsx'

const EXPERIMENT_MARKETING = 'follow_copy'

emitter.defineVariants(EXPERIMENT_MARKETING, ['follow', 'remind'])

emitter.addPlayListener((experimentName, variantName) => {
	track('ab-test', { action: `play:${experimentName}:${variantName}` })
})

emitter.addWinListener((experimentName, variantName) => {
	track('ab-test', { action: `win:${experimentName}:${variantName}` })
})

class FollowButton extends Component {
	static propTypes = {
		slug: PropTypes.string.isRequired,
		followingUsers: PropTypes.array.isRequired,
		source: PropTypes.oneOf([ 'show_item', 'show' ]).isRequired,
		type: PropTypes.oneOf([ 'show', 'artist', 'user', 'venue' ]),
		size: PropTypes.oneOf([ 'small' ]),
		user: PropTypes.object,
		count: PropTypes.number
	}

	constructor(props) {
		super(props)

		this.state = {
			value: 'follow',
			active: false,
			count: 0
		}
	}

	componentWillMount() {
		let { user, followingUsers, sharedCount = 0 } = this.props
		let active = this.isActive(this.props)
		let followedCount = followingUsers ? followingUsers.length : 0

		this.setState({
			value: active ? 'following' : 'follow',
			count: followedCount + sharedCount,
			active: !!(active)
		})
	}

	componentWillReceiveProps(nextProps) {
		let { followingUsers, sharedCount = 0 } = nextProps
		let active = this.isActive(nextProps)
		let followedCount = followingUsers ? followingUsers.length : 0

		this.setState({
			value: active ? 'following' : 'follow',
			count: followedCount + sharedCount,
			active: !!(active)
		})
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			!isEqual(nextProps.followingUsers, this.props.followingUsers) ||
			!isEqual(nextProps.user, this.props.user) ||
			nextProps.sessions !== this.props.session ||
			nextState.value !== this.state.value ||
			nextState.active !== this.state.active ||
			nextState.count !== this.state.count
		)
	}

	onWin = (name = EXPERIMENT_MARKETING) => {
		emitter.emitWin(name)
	}

	isActive(props) {
		let { user, followingUsers } = props

		if (!Array.isArray(followingUsers)) {
			return
		}

		return !!(find(followingUsers, (user_id) => {
			return user && user.id === user_id
		}))
	}

	toggleFollow = (evt) => {
		if (evt) evt.preventDefault()

		let {
			type,
			user,
			slug,
			source,
			onAction,
			showAction,
			history
		} = this.props

		let uri = new URI()
		let { active, count } = this.state
		let _user

		if (user) {
			_user = user.id ? user : null
		}

		track(source, {
			action: 'follow',
			value: _user ? 'user' : 'new_user',
			show_id: slug,
			source
		})

		if (!_user) {
			history.push(`${uri.pathname()}?modal=signup&next=${uri.pathname()}`)
			return
		}

		this.setState({
			value: (!active) ? 'following' : 'follow',
			count: Math.max(active ? --count : ++count, 0),
			active: (!active)
		}, () => {
			showAction(slug)

			if (onAction) {
				onAction((!active) ? 'following' : 'follow')
			}

			this.onWin()
		})
	}

	render() {
		let { slug, size, className, session, ticketGiveaway } = this.props
		let { value, active, count } = this.state

		size = size || 'small'

		// return (
		// 	<Experiment name={EXPERIMENT_MARKETING} userIdentifier={session}>
		// 		<Variant name="follow">

		// 		{(size === 'small' ? (
		// 			<Popover
		// 				isOpen={(ticketGiveaway && !active)}
		// 				position={[ 'bottom' ]}
		// 				disableReposition={true}
		// 				content={({ position, targetRect, popoverRect }) => (
		// 					<ArrowContainer
		// 			            position={position}
		// 			            targetRect={targetRect}
		// 			            popoverRect={popoverRect}
		// 			            arrowColor={'#8b61a9'}
		// 			            arrowSize={6}
		// 			            arrowStyle={{ opacity: 1 }}>
		// 						<div className="popover-content">
		// 							Follow for a chance to win two tickets!
		// 						</div>
		// 					</ArrowContainer>
		// 				)}>
		// 				<button
		// 					className={`btn btn-action btn-${value} ${active ? 'active' : ''} ${className || ''}`}
		// 					data-tutorial-offset="60"
		// 					onClick={this.toggleFollow}
		// 					data-action={value}
		// 					title={value}>
		// 					{active ? <IconHeart /> : <IconHeartEmpty />}
		// 					{(count > 0) && (
		// 						<span style={{ marginLeft: '0.2rem' }}>{count}</span>
		// 					)}
		// 				</button>
		// 			</Popover>
		// 		) : (
		// 			<Popover
		// 				isOpen={(ticketGiveaway && !active)}
		// 				position={[ 'bottom' ]}
		// 				disableReposition={true}
		// 				content={({ position, targetRect, popoverRect }) => (
		// 					<ArrowContainer
		// 			            position={position}
		// 			            targetRect={targetRect}
		// 			            popoverRect={popoverRect}
		// 			            arrowColor={'#8b61a9'}
		// 			            arrowSize={6}
		// 			            arrowStyle={{ opacity: 1 }}>
		// 						<div className="popover-content">
		// 							Follow for a chance to win two tickets!
		// 						</div>
		// 					</ArrowContainer>
		// 				)}>
		// 				<button
		// 					className={`btn btn--round btn--hero btn-action btn-${value} ${active ? 'active' : ''} ${className || ''}`}
		// 					data-tutorial-offset="60"
		// 					onClick={this.toggleFollow}
		// 					data-action={value}
		// 					title={value}>
		// 					{active ? <IconHeart /> : <IconHeartEmpty />}
		// 					{active ? <span className="btn-value">Following</span> : <span className="btn-value">Follow</span>}
		// 					{active && <span className="btn-value-hover">Unfollow</span>}
		// 				</button>
		// 			</Popover>
		// 		))}

		// 		</Variant>
		// 		<Variant name="remind">

		// 		{(size === 'small' ? (
		// 			<Popover
		// 				isOpen={(ticketGiveaway && !active)}
		// 				position={[ 'bottom' ]}
		// 				disableReposition={true}
		// 				content={({ position, targetRect, popoverRect }) => (
		// 					<ArrowContainer
		// 			            position={position}
		// 			            targetRect={targetRect}
		// 			            popoverRect={popoverRect}
		// 			            arrowColor={'#8b61a9'}
		// 			            arrowSize={6}
		// 			            arrowStyle={{ opacity: 1 }}>
		// 						<div className="popover-content">
		// 							Tap for a chance to win two tickets!
		// 						</div>
		// 					</ArrowContainer>
		// 				)}>
		// 				<button
		// 					className={`btn btn-action btn-${value} ${active ? 'active' : ''} ${className || ''}`}
		// 					data-tutorial-offset="60"
		// 					onClick={this.toggleFollow}
		// 					data-action={value}
		// 					title={value}>
		// 					{active ? <IconHeart /> : <IconHeartEmpty />}
		// 					{(count > 0) && (
		// 						<span style={{ marginLeft: '0.2rem' }}>{count}</span>
		// 					)}
		// 				</button>
		// 			</Popover>
		// 		) : (
		// 			<Popover
		// 				isOpen={(ticketGiveaway && !active)}
		// 				position={[ 'bottom' ]}
		// 				disableReposition={true}
		// 				content={({ position, targetRect, popoverRect }) => (
		// 					<ArrowContainer
		// 			            position={position}
		// 			            targetRect={targetRect}
		// 			            popoverRect={popoverRect}
		// 			            arrowColor={'#8b61a9'}
		// 			            arrowSize={6}
		// 			            arrowStyle={{ opacity: 1 }}>
		// 						<div className="popover-content">
		// 							Tap for a chance to win two tickets!
		// 						</div>
		// 					</ArrowContainer>
		// 				)}>
		// 				<button
		// 					className={`btn btn--round btn--hero btn-action btn-${value} ${active ? 'active' : ''} ${className || ''}`}
		// 					data-tutorial-offset="60"
		// 					onClick={this.toggleFollow}
		// 					data-action={value}
		// 					title={value}>
		// 					{active ? <IconHeart /> : <IconHeartEmpty />}
		// 					{active ? <span className="btn-value">Following</span> : <span className="btn-value">Remind Me</span>}
		// 					{active && <span className="btn-value-hover">Unfollow</span>}
		// 				</button>
		// 			</Popover>
		// 		))}

		// 		</Variant>
		// 	</Experiment>
		// )

		return (
			<Experiment name={EXPERIMENT_MARKETING} userIdentifier={session}>
				<Variant name="follow">

				{(size === 'small' ? (
					<button
						className={`btn btn-action btn-${value} ${active ? 'active' : ''} ${className || ''}`}
						onClick={this.toggleFollow}
						data-tutorial-offset="60"
						data-tip
						data-for={`follow-${slug}`}
						data-action={value}
						title={value}>
						{active ? <IconHeart /> : <IconHeartEmpty />}
						{(count > 0) && (
							<span style={{ marginLeft: '0.2rem' }}>{count}</span>
						)}
					</button>
				) : size === 'medium' ? (
					<button
						className={`btn btn--round btn--hero btn-action btn-${value} medium ${active ? 'active' : ''} ${className || ''}`}
						data-tutorial-offset="60"
						onClick={this.toggleFollow}
						data-tip
						data-for={`follow-${slug}`}
						data-action={value}
						title={value}>
						{active ? <IconHeart /> : <IconHeartEmpty />}
					</button>
				) : (
					<button
						className={`btn btn--round btn--hero btn-action btn-${value} ${active ? 'active' : ''} ${className || ''}`}
						data-tutorial-offset="60"
						onClick={this.toggleFollow}
						data-tip
						data-for={`follow-${slug}`}
						data-action={value}
						title={value}>
						{active ? <IconHeart /> : <IconHeartEmpty />}
						{active ? <span className="btn-value">Following</span> : <span className="btn-value">Follow</span>}
						{active && <span className="btn-value-hover">Unfollow</span>}
					</button>
				))}

				</Variant>
				<Variant name="remind">

				{(size === 'small' ? (
					<button
						className={`btn btn-action btn-${value} ${active ? 'active' : ''} ${className || ''}`}
						data-tutorial-offset="60"
						onClick={this.toggleFollow}
						data-tip
						data-for={`follow-${slug}`}
						data-action={value}
						title={value}>
						{active ? <IconHeart /> : <IconHeartEmpty />}
						{(count > 0) && (
							<span style={{ marginLeft: '0.2rem' }}>{count}</span>
						)}
					</button>
				) : size === 'medium' ? (
					<button
						className={`btn btn--round btn--hero btn-action btn-${value} medium ${active ? 'active' : ''} ${className || ''}`}
						data-tutorial-offset="60"
						onClick={this.toggleFollow}
						data-tip
						data-for={`follow-${slug}`}
						data-action={value}
						title={value}>
						{active ? <IconHeart /> : <IconHeartEmpty />}
					</button>
				) : (
					<button
						className={`btn btn--round btn--hero btn-action btn-${value} ${active ? 'active' : ''} ${className || ''}`}
						data-tutorial-offset="60"
						onClick={this.toggleFollow}
						data-tip
						data-for={`follow-${slug}`}
						data-action={value}
						title={value}>
						{active ? <IconHeart /> : <IconHeartEmpty />}
						{active ? <span className="btn-value">Following</span> : <span className="btn-value">Remind Me</span>}
						{active && <span className="btn-value-hover">Unfollow</span>}
					</button>
				))}

				</Variant>
			</Experiment>
		)
	}
}

const mapStateToProps = ({ app, user }) => ({
	session: app.session,
	user: user.user,
})

const mapDispatchToProps = dispatch => {
	return {
		showAction(slug) {
			dispatch(ShowActions.apiShowAction(slug))
		}
	}
}

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(FollowButton)
)
