import URI from 'urijs'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import FacebookLogin from 'react-facebook-login'
import { IconSpotify, IconFacebook } from './../../common/icons.jsx'
import * as AppActions from './../../redux/actions/app.jsx'
import UserActions from './../../redux/actions/user.jsx'
import { track } from './../../helpers/analytics.jsx'
import { request } from './../../helpers/request.jsx'

class Login extends Component {
	static propTypes = {
		onLogin: PropTypes.func,
		loadStart: PropTypes.func,
		loadEnd: PropTypes.func,
		loggingInUser: PropTypes.func
	}

	constructor(props) {
		super(props)

		this.state = {
			identifier: '',
			password: ''
		}

		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	onChange(evt) {
		let key = evt.target.name
		let value = evt.target.value

		this.setState({ [key] : value })
	}

	// Only for local signin!
	onSubmit(evt) {
		evt.preventDefault()

		this.props.loadStart()
		this.props.loggingInUser(true)

		request({
				path: '/auth/local',
				method: 'post',
				data: this.state
			})
			.end((err, reply) => {
				this.props.loadEnd()
				this.props.onLogin(reply.response)
			})
	}

	render() {
		let {
			provider,
			className,
			value,
			source,
			loadStart,
			loadEnd,
			loggingIn,
			progress,
			type = 'spotify',
			loggingInUser,
			loginFacebookUser,
			viewportName,
			onWin,
		} = this.props

		let isLoadingSpotify = (progress.indexOf('login:spotify') >= 0)
		let isLoadingFacebook = (progress.indexOf('login:facebook') >= 0)

		return (type === 'facebook' ? (
			<FacebookLogin
				appId={process.env.FACEBOOK_APP_ID}
				autoLoad={true}
				isMobile={false}
				version="3.3"
				fields="name,email,picture"
				tag="a"
				icon={<IconFacebook className="fill-white" />}
				cssClass={`${className} btn--${type || 'facebook'} ${isLoadingFacebook ? 'btn--disabled' : ''}`}
				textButton={isLoadingFacebook ? '*Queue hold music*' : value}
				onClick={evt => {
					const { user } = this.state

					loadStart(`login:${type || 'facebook'}`)
					loggingInUser(true)

					track('cta', {
						action: 'signup',
						type: type || 'facebook',
						source: source || 'signup',
						viewport: viewportName,
						copy: value
					})

					if (user && user.accessToken) {
						loginFacebookUser(user)
					}

					if (onWin) {
						onWin()
					}
				}}
				callback={reply => {
					const { pathname, search } = this.props.location
					const uri = new URI(search).removeQuery('modal')

					this.props.history.push(`${pathname}${uri.search()}`)
					this.setState({ user: reply })

					// We only want to trigger this after a click,
					// but we can potentially get a user object
					// before the user has triggered which would
					// be a bizarre experience.
					if (reply && reply.accessToken) {
						return loginFacebookUser(reply)
					}

					loadEnd(null, `login:${type || 'facebook'}`)
					loggingInUser(false)
				}} />
		) : (
			<a
				href={`${process.env.BASE_SERVER_URL}/${process.env.API_VERSION}/auth/spotify?callback_url=${process.env.BASE_CLIENT_URL}`}
				className={`${className} btn--${type || 'spotify'} ${isLoadingSpotify ? 'btn--disabled' : ''}`}
				onClick={(evt) => {
					if (evt && isLoadingSpotify) {
						return evt.preventDefault()
					}

					loadStart(`login:${type || 'spotify'}`)
					loggingInUser(true)

					track('cta', {
						action: 'signup',
						type: type || 'spotify',
						source: source || 'signup',
						viewport: viewportName,
						copy: value
					})

					if (onWin) {
						onWin()
					}
				}}>
				<IconSpotify className="fill-white" />
				{isLoadingSpotify ? '*Queue hold music*' : value}
			</a>
		))
	}
}

const mapStateToProps = ({ app, user }) => ({
	user: user.user,
	loggingIn: app.loggingIn,
	viewportName: app.viewportName,
	progress: app.progress
})

const mapDispatchToProps = dispatch => {
	return {
		loadStart: (name) => {
			dispatch(AppActions.loadStart(name))
		},

		loadEnd: (name) => {
			dispatch(AppActions.loadEnd(null, name))
		},

		loggingInUser: () => {
			dispatch(AppActions.loggingInUser(true))
		},

		loginFacebookUser: (user) => {
			dispatch(UserActions.loginFacebookUser(user))
		}
	}
}

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(Login)
)
