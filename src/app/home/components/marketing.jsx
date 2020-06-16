import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import isObject from 'lodash/isObject'
import React, { Component, Fragment } from 'react'
import { isMobile } from './../../helpers/device-detect'
import { Link } from 'react-router-dom'
import { SIGNUP_BUTTON } from './../../constants.jsx'
import { delay } from './../../helpers'
import { track } from './../../helpers/analytics.jsx'
import Login from './../../authentication/components/login.jsx'
import Map from './../../shows/components/map-lazy.jsx'
import { IconChevron } from './../../common/icons.jsx'
import { Loader } from './../../common/loader.jsx'
import InputEmail from './../../forms/input-email.jsx'

class HeroSignup extends Component {
	constructor(props) {
		super(props)

		this.state = {
			email: '',
			emailValid: null,
			emailValidType: '',
			emailValidClass: '',
			emailMessage: '',

			sendingToken: false,
			focus: false,
		}
	}

	onInputChange = ({ target }) => {
		if (!target) {
			return
		}

		let { value, validType, validClass } = target

		this.setState({
			email: value,
			emailValid: target.valid,
			emailValidType: validType,
			emailValidClass: (validClass && validType !== 'duplicate') ? validClass : 'form--valid',
			emailMessage: target.message || ''
		})
	}

	onInputState = (type) => {
		this.setState({ focus: (type === 'focus') || this.state.email })
	}

	_onClick = ({ target }) => {
		let { name } = target
		let { email } = this.state

		this.setState({ sendingToken: true })

		this.props.sendLoginToken(email)

		track('cta', {
			action: `email ${name}`,
			source: 'hero signup'
		})
	}

	render() {
		let {
			user,
			loadStart,
			locationName,
			sendLoginToken,
			viewportName,
			progress,
			type,
			close
		} = this.props

		let {
			email,
			emailValid,
			emailValidType,
			emailValidClass,
			emailMessage,
			sendingToken,
			focus
		} = this.state

		return (!user && (
			<div className="hero-signup row">
				{sendingToken ? (
					<div className="col col-6-of-12 col-small-12-of-12 center">
						<div className="bubble">
							<div className="bubble-content text-center">
								<h2 className={`typography-headline text-center`}>Now, check your email to complete your signup</h2>

								<p className="typography-body">
									A secure login link has just been sent to <strong>{email}</strong>. You should see this email shortly or check your spam folder.
								</p>
							</div>
						</div>
					</div>
				) : (
					<div className="col col-8-of-12 col-medium-10-of-12 col-small-12-of-12 center">
						<ul className={`list list--inline signup-methods ${focus ? 'input--focus' : ''}`}>
							<li className="signup-oauth">
								<Login
									type="spotify"
									className="btn btn--hero widthfull"
									value="Sign Up with Spotify"
									loadStart={loadStart}
									onWin={this._onWin} />
							</li>
							<li className="signup-oauth">
								<Login
									type="facebook"
									className="btn btn--hero widthfull"
									value="Sign Up with Facebook"
									loadStart={loadStart}
									onWin={this._onWin} />
							</li>
						</ul>

						<h3 className="signup-extra typography-hero-body" style={{ marginTop: '0.8rem' }}>
							Sign up, always free.
							<a
								href={`/?location=${locationName ? locationName : 'Portland, ME'}`}
								className="strong color-white underline"
								style={{ marginLeft: '0.4rem' }}
								onClick={() => {
									track('cta', {
										action: 'view all events',
										source: 'showlist'
									})
								}}>
								Search {locationName ? `${locationName} ` : ''}Events
							</a>
						</h3>
					</div>
				)}
			</div>
		))
	}
}

class Marketing extends Component {
	static propTypes = {
		type: PropTypes.string // compact, full
	}

	constructor(props) {
		super(props)

		this.state = {
			width: (typeof window !== 'undefined') ? window.innerWidth : 1620,
			height: (typeof window !== 'undefined' && props.type !== 'compact') ? window.innerHeight * 0.9 : 320,
			activeClass: ''
		}

		this.hasUnmounted = false
	}

	componentWillMount() {
		if (this.props.user) {
			this.setState({ activeClass: 'active' })
		}
	}

	componentDidMount() {
		this._setMetrics()

		setTimeout(() => {
			if (this.hasUnmounted) {
				return
			}

			this.setState(() => {
				return {
					activeClass: 'active'
				}
			})
		}, 500)
	}

	componentWillUnmount() {
		this.hasUnmounted = true

		if (this.winListener) {
			this.winListener.remove()
		}

		if (this.playListener) {
			this.playListener.remove()
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!isEqual(nextProps.windowProps, this.props.windowProps)) {
			this._setMetrics()
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			!isEqual(nextProps.user, this.props.user) ||
			!isEqual(nextProps.windowProps, this.props.windowProps) ||
			!isEqual(nextProps.progress, this.props.progress) ||
			!isEqual(nextProps.venue, this.props.venue) ||
			nextProps.locationName !== this.props.locationName ||
			nextProps.isSearching !== this.props.isSearching ||
			nextProps.viewportName !== this.props.viewportName ||
			nextProps.map !== this.props.map ||
			nextState.activeClass !== this.state.activeClass ||
			nextProps.type !== this.props.type ||
			nextState.height !== this.state.height ||
			nextState.width !== this.state.width
		)
	}

	_trackLearn = () => {
		track('cta', {
			action: 'learn',
			source: 'hero'
		})
	}

	_trackSignup = () => {
		track('cta', {
			action: 'signup',
			source: 'hero'
		})
	}

	_setMetrics = () => {
		let _state = {}

		setTimeout(() => {
			if (this.state.width !== window.innerWidth) {
				_state.width = window.innerWidth
			}

			if (this.state.height !== this._getMapHeight()) {
				_state.height = this._getMapHeight()
			}

			this.setState(_state)
		}, 300)
	}

	_getMapHeight = () => {
		let { type, viewportName } = this.props
		let defaultHeight = (viewportName === 'small') ? 380 : 320

		if (typeof window === 'undefined') {
			return defaultHeight
		}

		return (type === 'compact') ? defaultHeight : Math.max(window.innerHeight * 0.9, 800)
	}

	render() {
		let {
			type,
			user,
			session,
			shows = [],
			progress = [],
			loadStart,
			venue,
			locationName,
			viewportName,
			isSearching,
			map,
		} = this.props

		let { width, height } = this.state
		let style = 'cjlgmqhzw6kxu2rln300bu2de'
		let zoom = (type === 'compact') ? 12.8 : isMobile ? 13 : 14
		let welcomeMessage = (locationName && progress.indexOf('shows') < 0) ? `Welcome to ${locationName}` : 'Welcome,'

		return (
			<div id="hero" ref={(node) => this.heroEl = node} className={`hero hero-marketing ${type !== 'compact' ? 'hero--dark' : ''} hero-${type || 'full'} ${this.state.activeClass}`}>
				<div className="hero-content grid">
					<div className="row">
						<div className={`col ${type === 'compact' ? 'col-8-of-12' : 'col-6-of-12'} col-medium-8-of-12 col-small-12-of-12 text-center center`}>
							{user ? (
								((progress.indexOf('shows') >= 0) && !shows.length) ? (
									<Loader />
								) : (
									<div className="hero-headline">
										 {locationName && (
											<Fragment>
												<div className="typography-headline">Welcome to the</div>
												<div className="typography-hero-headline">{`${locationName} `}Music Scene</div>
											</Fragment>
										)}
									</div>
								)
							) : (
								isSearching ? (
									<div className="hero-headline">
										{locationName && (
											<div className="typography-subheadline">{welcomeMessage}</div>
										)}
										<div className="typography-hero-headline">
											Your Live Local<br />Music Calendar
											{/*All the music.<br />None of the noise.*/}
										</div>
									</div>
								) : (
									<div className="hero-headline is-logged-out">
										{locationName === 'Portland, ME' ? (
											<div className="typography-hero-headline">
												Your Live Local<br />Music Calendar
												{/*All the music.<br />None of the noise.*/}
											</div>
										) : (
											<Fragment>
												{locationName && (
													<div className="typography-subheadline">{welcomeMessage}</div>
												)}
												<div className="typography-hero-headline">
													Your Live Local<br />Music Calendar
													{/*All the music.<br />None of the noise.*/}
												</div>
											</Fragment>
										)}
									</div>
								)
							)}

							{/*<p className="hero-copy typography-hero-body">
								Never miss a live show again. The most complete up to date live local music calendar in {locationName || 'Portland, ME'}. {locationName === 'Portland, ME' ? 'From Sun Tiki to State Theatre.'}
							</p>*/}

							<p className="hero-copy typography-hero-body">
								{locationName || 'Maine'}'s most complete and up-to-date live music calendar. Never miss a live show again.
							</p>

							<div className="hero-action">
								<Link
									to={{ pathname: '/', search: 'modal=signup' }}
									style={{ marginLeft: 0 }}
									rel="nofollow"
									className="btn btn--accept btn--hero"
									onClick={this._trackSignup}>
									{SIGNUP_BUTTON}
								</Link>
								<Link
									to={{ pathname: '/about' }}
									style={{ marginLeft: 0, marginBottom: 0, textShadow: 'none' }}
									className="btn btn--accent-two--secondary btn--hero"
									onClick={this._trackLearn}>
									Learn
								</Link>
							</div>
						</div>
					</div>

					{(type !== 'compact') && (
						<HeroSignup
							onWin={this._onWin}
							{...this.props} />
					)}
				</div>

				{(type === 'compact') && (
					<Map
						markers={isObject(map) ? map.markers : []}
						{...{ venue, width, height, style, zoom, map }} />
				)}
			</div>
		)
	}
}

export default Marketing
