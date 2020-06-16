import React, { Fragment, Component } from 'react'
import exitIntent from 'exit-intent'

import {
	IconClose,
	IconTwitter,
	IconInstagram,
	IconFacebook,
} from './icons.jsx'

class ExitIntent extends Component {
	state = {
		showPopup: false,
	}

	componentDidMount() {
		const { user } = this.props

		if (!user) {
			this.setupExitIntent()
		}
	}

	componentWillReceiveProps(nextProps) {
		const { user } = nextProps

		if (user && !this.props.user) {
			if (typeof this.removeExitIntent === 'function') {
				this.removeExitIntent()
			}
		}
	}

	close = () => {
		this.setState({ showPopup: false })
	}

	setupExitIntent = () => {
		this.removeExitIntent = exitIntent({
			maxDisplays: 200,
			onExitIntent: () => {
				this.setState({ showPopup: true })
				this.removeExitIntent()
			}
		})
	}

	render() {
		const { showPopup } = this.state

		console.log('showPopup ', showPopup)

		return (showPopup ? (
			<section id="modal" className="modal modal-active">
				<div className="modal-content background-accent-two">
					<div className="modal-close text-right">
						<div className="modal-btn-close cursor-pointer inlineblock" onClick={this.close}>
							<IconClose />
						</div>
					</div>

					<div className="modal-copy">
						<h2 className="typography-hero-subheadline">Be our Internet Friend!</h2>
						<p className="typography-hero-copy">Get all the latest live music news, events, and ticket giveaways.</p>

						<a href="https://twitter.com/getradplaid" target="_blank" className="btn btn--hero btn--facebook block"><IconFacebook /> Facebook</a>
						<a href="https://twitter.com/getradplaid" target="_blank" className="btn btn--hero btn--instagram block"><IconInstagram /> Instagram</a>
						<a href="https://twitter.com/getradplaid" target="_blank" className="btn btn--hero btn--twitter block"><IconTwitter /> Twitter</a>

						{/*If they came from Facebook, let's only show this
						<iframe
							src="https://www.facebook.com/plugins/like.php?href=https%3A%2F%2Fwww.facebook.com%2FRadPlaid%2F&width=300&layout=standard&action=like&size=large&show_faces=true&share=true&height=80&appId=619275231530846"
							width="300"
							height="80"
							style={{ border: 'none', overflow: 'hidden' }}
							scrolling="no"
							frameBorder="0"
							allowtransparency={true}
							allow="encrypted-media">
						</iframe>*/}
					</div>
				</div>
				<div className="modal-overlay" onClick={this.close}></div>
			</section>
		) : (
			<Fragment></Fragment>
		))
	}
}

export default ExitIntent
