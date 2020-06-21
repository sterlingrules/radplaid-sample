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

			steps: [{
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
			}]
		}

		this.isScrolling = false
		this.spotlightEl = null
		this.overlayEl = null

		this.onChange = this.onChange.bind(this)
		this._runTutorial = this._runTutorial.bind(this)
		this._endTutorial = this._endTutorial.bind(this)
		this._updateSpotlight = this._updateSpotlight.bind(this)
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

	_updateSpotlight(selector, offset = 10) {
		let element = document.querySelector(selector)

		if (!element) {
			return this._endTutorial()
		}

		let offsetTooltip = parseInt(element.dataset.tutorialOffset || '0')
		let { top, left, width, height } = element.getBoundingClientRect()
		let elementCenter = window.scrollY + top + offsetTooltip + (height / 2) - (window.innerHeight / 2)

		if (elementCenter > 0 && elementCenter < document.body.offsetHeight) {
			moveTo(elementCenter, 300)
		}
	}

	_runTutorial(nextProps) {
		let { user, showsSort, run } = nextProps || this.props
		let steps = clone(this.state.steps)
		let createdAt = (user && user.createdAt) ? new Date(user.createdAt).getTime() : null
		let tutorialCreation = new Date('2018-11-13').getTime() // Nov 12, 2018

		if (createdAt < tutorialCreation) {
			return
		}

		this.setState({ steps, run })
	}

	_endTutorial(type) {
		let { user, updateUserPassive } = this.props

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
