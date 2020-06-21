import React, { Fragment, Component } from 'react'
import { DEBUG } from './../../constants.jsx'
import { Experiment, Variant, emitter, experimentDebugger } from 'react-ab-test'
import { track } from './../../helpers/analytics.jsx'
import Carousel from './../../common/carousel.jsx'
import { Link } from 'react-router-dom'

import {
	IconHeart,
	IconToday,
	IconMailUnread,
	IconNotificationActive,
} from './../../common/icons.jsx'

const EXPERIMENT_MARKETING = 'marketing_simple'

emitter.defineVariants(EXPERIMENT_MARKETING, ['a', 'b'])

emitter.addPlayListener((experimentName, variantName) => {
	track('ab-test', { action: `play:${experimentName}:${variantName}` })
})

emitter.addWinListener((experimentName, variantName) => {
	track('ab-test', { action: `win:${experimentName}:${variantName}` })
})

class MarketingSignupSimple extends Component {
	constructor(props) {
		super(props)
	}

	onWin = (name = EXPERIMENT_MARKETING) => {
		emitter.emitWin(name)
	}

	onTrack = () => {
		this.onWin()

		track('cta', {
			action: 'signup',
			source: 'marketing-simple',
		})
	}

	render() {
		const { session, next } = this.props
		const options = {
			perView: 1,
			rewind: true,
			keyboard: false,
			autoplay: 5000,
			animationDuration: 800,
			bound: true,
			breakpoints: {
				767: {
					perView: 1,
					peek: {
						before: 0,
						after: 0
					}
				}
			}
		}

		return (
			<Experiment name={EXPERIMENT_MARKETING} userIdentifier={session}>
				<Variant name="a">

					<div className="marketingsignup-simple-headline">Join <span style={{ fontWeight: 800 }}>Rad Plaid</span></div>
					<Link to={`?modal=signup${next ? `&next=${next}` : ''}`} className="marketingsignup-simple" onClick={this.onTrack}>
						<div className="marketingsignup-simple-carousel">
							<Carousel options={options}>
								<div className="flex">

									<IconHeart
										className="marketingsignup-simple-image" />

									<div className="marketingsignup-simple-content">
										Follow events for reminders, updates, and curated listings
									</div>
								</div>
								<div className="flex">

									<IconNotificationActive
										className="marketingsignup-simple-image" />

									<div className="marketingsignup-simple-content">
										Get alerts from the music and artists you love.
									</div>
								</div>
								<div className="flex">

									<IconToday
										className="marketingsignup-simple-image" />

									<div className="marketingsignup-simple-content">
										Maine’s most complete live local music calendar
									</div>
								</div>
							</Carousel>
						</div>
						<div className="marketingsignup-simple-action">
							<div className="btn btn--accent-two--secondary btn--round btn--small">
								Sign Up Free
							</div>
						</div>
					</Link>

				</Variant>
				<Variant name="b">

					<Link to={`?modal=signup${next ? `&next=${next}` : ''}`} className="marketingsignup-simple" onClick={this.onTrack}>
						<div className="flex">

							<IconMailUnread
								className="marketingsignup-simple-image" />

							<div className="marketingsignup-simple-content">
								Music in your inbox! Get weekly events tailored to your tastes.
							</div>
						</div>
						<div className="marketingsignup-simple-action">
							<div className="btn btn--accent-two--secondary btn--round btn--small">
								Sign Up Free
							</div>
						</div>
					</Link>

				</Variant>
			</Experiment>
		)
	}
}

export default MarketingSignupSimple
