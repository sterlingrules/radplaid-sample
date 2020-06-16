import clone from 'lodash/clone'
import React, { Component } from 'react'
import Joyride from 'react-joyride'
import { DEBUG } from './../constants.jsx'
import { IconStar, IconHeart } from './../common/icons.jsx'
import moveTo from './../helpers/scroll.jsx'
import { track } from './../helpers/analytics.jsx'
import { delay } from './../helpers'

const DEFAULT_BUTTON = {
	cursor: 'pointer',
	position: 'relative',
	verticalAlign: 'middle',
	boxSizing: 'border-box',
	display: 'inline-block',
	minHeight: 36,
	paddingTop: 0,
	paddingRight: 16,
	paddingBottom: 0,
	paddingLeft: 16,
	textAlign: 'center',
	textDecoration: 'none',
	fontFamily: 'Barlow, Proxima, Helvetica, -apple-system, sans-serif',
	fontSize: '0.875rem',
	lineHeight: '2.28571',
	letterSpacing: '0.04em',
	fontSmoothing: 'antialiased',
	fontWeight: 600,
	lineHeight: 1,
	whiteSpace: 'nowrap',
	color: '#fff',
	fill: '#fff',
	border: '2px solid #fff',
	transition: 'all 0.1s ease-in-out 0s',
	WebkitFontSmoothing: 'antialiased',
	WebkitAppearance: 'none'
}

const JOYRIDE_SETTINGS = {
	debug: DEBUG,
	continuous: true,
	disableCloseOnEsc: false,
	disableOverlay: true,
	disableScrolling: false,
	disableOverlayClose: false,
	scrollToFirstStep: false,
	locale: {
		last: 'Finish'
	},
	floaterProps: {
		disableFlip: true
	}
}

class NewUserTutorial extends Component {
	constructor(props) {
		super(props)

		this.state = {
			run: false,

			styles: {
				options: {
					primaryColor: '#f0c40f'
				},
				buttonBack: {
					...DEFAULT_BUTTON,
					color: '#1e4687',
					backgroundColor: 'transparent',
					borderColor: 'transparent'
				},
				buttonNext: {
					...DEFAULT_BUTTON,
					backgroundColor: '#8b61a9',
					borderColor: '#8b61a9',
					borderRadius: 4,
					textShadow: '0 1px 0 rgba(30,70,135, 0.2)',
					boxShadow: '0 2px 4px rgba(30,70,135, 0.2)',
				},
				tooltip: {
					padding: 16, // 1rem
					borderRadius: 4,
					boxShadow: '0 4px 12px 4px rgba(30,70,135,.15)'
				},
				tooltipFooter: {
					display: 'block',
					textAlign: 'right'
				},
				spotlight: {
					display: 'none'
				},
				overlay: {
					display: 'none'
				}
			},

			steps: [
			// {
			// 	target: 'body',
			// 	placement: 'center',
			// 	disableBeacon: false,
			// 	content: <div />,
			// 	locale: {
			// 		next: 'Begin the Tour'
			// 	}
			// },
			// {
			// 	target: '.showitem',
			// 	placement: 'top',
			// 	content: <div />
			// },
			{
				target: '.header-filter .filter-sort',
				placement: 'bottom-start',
				content: (
					<div className="text-left typography-reset">
						<h3 className="typography-body-headline">Discover the Best and Everything</h3>
						<p className="typography-small">Filter between our recommendations for you, or just look through everything happening nearby.</p>
					</div>
				)
			},
			{
				target: '.showitem .showitem-ryc .violator--reason',
				placement: 'bottom-start',
				content: (
					<div className="text-left typography-reset">
						<h3 className="typography-body-headline">Just for you</h3>
						<div style={{ overflow: 'auto', marginBottom: '0.6rem' }}>
							<div style={{ verticalAlign: 'middle' }}>
								<IconHeart
									className="fill-accent-two inlineblock icon--large left"
									style={{
										padding: '6px',
										boxSizing: 'border-box'
									}} />
							</div>
							<p
								className="typography-small inlineblock"
								style={{
									width: 'calc(100% - 48px)',
									paddingLeft: '0.6rem',
									boxSizing: 'border-box',
									verticalAlign: 'middle'
								}}>
								<strong>Hearts</strong> let you know an artist you follow is playing.
							</p>
						</div>
						<div style={{ overflow: 'auto' }}>
							<div style={{ verticalAlign: 'middle' }}>
								<IconStar className="fill-accent-two inlineblock icon--large left" />
							</div>
							<p
								className="typography-small inlineblock"
								style={{
									width: 'calc(100% - 48px)',
									paddingLeft: '0.6rem',
									boxSizing: 'border-box',
									verticalAlign: 'middle'
								}}>
								<strong>Stars</strong> give you an idea who the event sounds like based on your favorite artists and genres.
							</p>
						</div>
					</div>
				)
			},
			{
				target: '.showitem button.btn-play',
				placement: 'bottom-end',
				content: (
					<div className="text-left typography-reset">
						<h3 className="typography-body-headline">Press Play</h3>
						<p className="typography-small">
							Tap <strong>Play</strong> to hear 30-second artist previews before the event.
						</p>
					</div>
				)
			},
			{
				target: 'button[title="follow"]',
				placement: 'bottom-end',
				content: (
					<div className="text-left typography-reset">
						<h3 className="typography-body-headline">Follow Events</h3>
						<p className="typography-small">
							<strong>Follow</strong> events you care about to get reminders and help us find you even better local event recommendations.
						</p>
					</div>
				)
			},
			{
				target: '.following .col .showitem-mini:first-child',
				placement: 'top',
				content: (
					<div className="text-left typography-reset">
						<h3 className="typography-body-headline">Followed Events</h3>
						<p className="typography-small">Quickly view all the events you're <strong>Following</strong> here at the top of your feed.</p>
					</div>
				)
			}

			// {
			// 	target: '.header-content .btn-addshow',
			// 	placement: 'bottom',
			// 	content: (
			// 		<div className="text-left typography-reset">
			// 			<h3 className="typography-body-headline">Got Events?</h3>
			// 			<p className="typography-small">
			// 				Add your upcoming events to share them with your local music scene. We've built one of the simplest and most powerful event adding tools out there.
			// 			</p>
			// 		</div>
			// 	)
			// }

			// {
			// 	target: 'body',
			// 	placement: 'center',
			// 	disableBeacon: false,
			// 	content: (
			// 		<div className="text-center typography-reset">
			// 			<img
			// 				src="//res.cloudinary.com/radplaid/image/upload/f_auto/v1546464149/rockon_tenacious_d_t2gvxs.gif"
			// 				title={`Rock On!`}
			// 				style={{
			// 					display: 'block',
			// 					width: '100%',
			// 					maxWidth: '320px',
			// 					height: 'auto',
			// 					margin: '0 auto 1rem',
			// 					borderRadius: '4px'
			// 				}} />
			// 			<h3 className="typography-body-headline">See you at an event!</h3>
			// 			<div className="typography-body color-love">
			// 				<div className="inlineblock" style={{ verticalAlign: 'middle', marginTop: '0.1rem' }}>
			// 					<IconHeart className="fill-love icon--small" />
			// 				</div>
			// 				<p className="inlineblock" style={{ verticalAlign: 'middle', marginTop: 0, marginLeft: '0.4rem' }}>
			// 					Rad Plaid
			// 				</p>
			// 			</div>
			// 		</div>
			// 	)
			// }
			]
		}

		this.isScrolling = false
		this.spotlightEl = null
		this.overlayEl = null

		this.onChange = this.onChange.bind(this)
		this._runTutorial = this._runTutorial.bind(this)
		this._endTutorial = this._endTutorial.bind(this)
		// this._removeSpotlight = this._removeSpotlight.bind(this)
		this._updateSpotlight = this._updateSpotlight.bind(this)
		// this._setupSpotlight = this._setupSpotlight.bind(this)
		// this._setupOverlay = this._setupOverlay.bind(this)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.run !== this.props.run && nextProps.run) {
			this._runTutorial(nextProps)
		}

		if (nextProps.viewportName !== this.props.viewportName) {
			this._updateSpotlight()
		}
	}

	onChange(evt) {
		let { action, index, type } = evt
		let { steps } = this.state

		if (action === 'close') {
			return this._endTutorial(type)
		}

		// Setup Tour elements
		if (type === 'tour:start') {
			track('tour', { action: 'start' })
		}
		// Readjust the second step `spotlight`
		else if ([ 'tooltip', 'step:before' ].indexOf(type) >= 0) {
			this._updateSpotlight(steps[index].target)

			track('tour', { action: `next:${index}` })

			// Let's be at the top for body elements
			if (steps[index].target === 'body') {
				moveTo(0, 300)
			}
		}
		// Handle saving after last step
		else if (type === 'tour:end') {
			this._endTutorial(type)

			track('tour', { action: 'finish' })
		}
	}

	// _setupSpotlight() {
	// 	if (this.spotlightEl) {
	// 		return
	// 	}

	// 	if (!this.overlayEl) {
	// 		this._setupOverlay()
	// 	}

	// 	this.spotlightEl = document.createElement('div')

	// 	this.spotlightEl.style.display = 'block'
	// 	this.spotlightEl.style.position = 'absolute'
	// 	this.spotlightEl.style.borderRadius = '8px'
	// 	this.spotlightEl.style.backgroundColor = 'gray'

	// 	this.overlayEl.append(this.spotlightEl)
	// }

	// _setupOverlay() {
	// 	if (this.overlayEl) {
	// 		return
	// 	}

	// 	this.overlayEl = document.createElement('div')
	// 	this.overlayEl.style.cursor = 'pointer'
	// 	this.overlayEl.style.height = `${document.documentElement.offsetHeight}px`
	// 	this.overlayEl.style['pointer-events'] = 'auto'
	// 	this.overlayEl.style['background-color'] = 'rgba(0,0,0, 0.5)'
	// 	this.overlayEl.style['mix-blend-mode'] = 'hard-light'
	// 	this.overlayEl.style['z-index'] = '20'
	// 	this.overlayEl.style.overflow = 'hidden'
	// 	this.overlayEl.style.position = 'absolute'
	// 	this.overlayEl.style.top = '0'
	// 	this.overlayEl.style.right = '0'
	// 	this.overlayEl.style.bottom = '0'
	// 	this.overlayEl.style.left = '0'
	// 	this.overlayEl.style.opacity = '0.35'
	// 	this.overlayEl.style.transition = 'opacity 0.2s ease-in 0s'

	// 	document.body.append(this.overlayEl)
	// }

	_updateSpotlight(selector, offset = 10) {
		// if (selector === 'body') {
		// 	return this._removeSpotlight()
		// }

		// this._setupOverlay()
		// this._setupSpotlight()

		// selector = selector || this.spotlightEl.dataset.selector

		let element = document.querySelector(selector)

		if (!element) {
			return this._endTutorial()
		}

		// let borderRadius = element.dataset.tutorialRadius || '8px'
		// let { style } = this.spotlightEl
		let offsetTooltip = parseInt(element.dataset.tutorialOffset || '0')
		let { top, left, width, height } = element.getBoundingClientRect()
		let elementCenter = window.scrollY + top + offsetTooltip + (height / 2) - (window.innerHeight / 2)

		// this.spotlightEl.style.top = `${top + window.scrollY - offset}px`
		// this.spotlightEl.style.left = `${left - offset}px`,
		// this.spotlightEl.style.width = (selector === 'body') ? 0 : `${width + (offset * 2)}px`
		// this.spotlightEl.style.height = (selector === 'body') ? 0 : `${height + (offset * 2)}px`
		// this.spotlightEl.style.borderRadius = borderRadius

		// add `data-selector`
		// this.spotlightEl.dataset.selector = selector

		if (elementCenter > 0 && elementCenter < document.body.offsetHeight) {
			moveTo(elementCenter, 300)
		}
	}

	_runTutorial(nextProps) {
		let { user, showsSort, run } = nextProps || this.props
		let steps = clone(this.state.steps)
		let createdAt = (user && user.createdAt) ? new Date(user.createdAt).getTime() : null
		let tutorialCreation = new Date('2018-11-13').getTime() // Nov 12, 2018

		//
		// TODO: This is stupid—let's query the server
		//		for an updated user schema and bust localStorage user cache
		//
		// This is here because we store users locally until they've signed out and
		// we don't kow whether or not they've already been created for a tutorial
		//
		if (createdAt < tutorialCreation) {
			return
		}

		// steps[0].content = (
		// 	<div className="typography-reset">
		// 		<img
		// 			src="//res.cloudinary.com/radplaid/image/upload/f_auto/v1546464149/bear_waving_yaczfp.gif"
		// 			title={`Hello, ${user.firstName}!`}
		// 			style={{
		// 				display: 'block',
		// 				width: '100%',
		// 				maxWidth: '320px',
		// 				height: 'auto',
		// 				margin: '0 auto 1rem',
		// 				borderRadius: '4px'
		// 			}} />
		// 		<h2 className="typography-subheadline">Welcome, {user.firstName}!</h2>
		// 		<p className="typography-body">Let's show you around.</p>
		// 	</div>
		// )

		// steps[1].content = (
		// 	<div className="text-left typography-reset">
		// 		<h3 className="typography-body-headline">The Flyer</h3>
		// 		<p className="typography-small">
		// 			Get a quick overview of {showsSort === 'best' ? 'personalized ' : ''}local events. Tap the <strong>artwork</strong> to view more info, share with friends, get directions, and more.
		// 		</p>
		// 	</div>
		// )

		this.setState({ steps, run })
	}

	// _removeSpotlight() {
	// 	if (!this.spotlightEl) {
	// 		return
	// 	}

	// 	this.spotlightEl.remove()
	// 	this.spotlightEl = null
	// }

	_endTutorial(type) {
		let { user, updateUserPassive } = this.props

		// this._removeSpotlight()

		// if (this.overlayEl) {
		// 	this.overlayEl.remove()
		// 	this.overlayEl = null
		// }

		if (type === 'tour:end') {
			user.tutorial_home = true
			updateUserPassive(user)
		}
	}

	render() {
		return (
			<Joyride
				{...JOYRIDE_SETTINGS}
				{...this.state}
				callback={this.onChange} />
		)
	}
}

export default NewUserTutorial
