import URI from 'urijs'
import { Link } from 'react-router-dom'
import React, { Component } from 'react'
import { SIGNUP_BUTTON } from './../../constants.jsx'
import { localStorageExpire } from './../../helpers'
import { register, track } from './../../helpers/analytics.jsx'
import { IconClose } from './../../common/icons.jsx'
import Login from './../../authentication/components/login.jsx'
import InputUrl from './../../forms/input-url.jsx'
import Progress from './../../common/progress.jsx'
import Select from './../../forms/select.jsx'
import Modal from './modal.jsx'

const CLAIM_EXAMPLES = {
	artist: {
		placeholder: 'https://awesome.bandcamp.com/',
		copy: 'If you\'re one of the bands, please share an artist website with your name.'
	},
	venue: {
		placeholder: 'https://awesomevenue.com/',
		copy: 'If you work with the venue, please share any website to the venue with your name.'
	},
	organizer: {
		placeholder: 'https://eventbrite.com/awesome',
		copy: 'If you are the event organizer, please share a website with this event and your name.'
	}
}

class ModalReport extends Component {
	static propTypes = {
		claim: PropTypes.object
	}

	constructor(props) {
		super(props)

		this.state = {
			report: null
		}
	}

	onInputChange = ({ target }) => {
		if (!target) {
			return
		}

		let { name } = target

		this.setState({ report: name })
	}

	_postReport = () => {
		let { user, claim, close, postClaim } = this.props
		let { url, role } = this.state

		close()
		postClaim({
			...claim,
			claimant: user.id,
			role: role.value,
			url
		})
	}

	render() {
		let {
			user,
			location,
			loadStart,
			sendLoginToken,
			viewportName,
			progress,
			report,
			close
		} = this.props

		return (report && (
			<Modal id="modal-report" close={close}>
				<form
					onSubmit={evt => evt.preventDefault()}
					action="#">

					<div className={`typography-small text-uppercase`}>Claim {claim.type || 'event'}</div>
					<h2 className={`${viewportName === 'small' ? 'typography-subheadline' : 'typography-headline'}`}>{claim.title}</h2>
					<p className="typography-body">Please, let us know your role on this <strong className="text-capitalize">{claim.type || 'event'}</strong> and a website so we can verify and transfer ownership.</p>

					<div
						style={{
						    marginBottom: '1rem',
							padding: '0.4rem 0.8rem',
							borderLeft: '4px solid #3f5765'
						}}>
						<div className={`typography-small text-uppercase`}>Request Ownership Transfer to:</div>
						<div className="typography-subheadline">{user.firstName}</div>
					</div>

					<ul className="form-table">
						<li>
							<label htmlFor="url" className="form-label form-label--center">Duplicate</label>
							<input
								id="url"
								type="radio"
								name="duplicate"
								className="form-input text-right"
								value={this.state.report === 'duplicate'}
								onInputChange={this.onInputChange} />
							<div className="form-focus"></div>
						</li>
						<li>
							<label htmlFor="url" className="form-label form-label--center">Incorrect</label>
							<input
								id="url"
								type="radio"
								name="incorrect"
								className="form-input text-right"
								value={this.state.report === 'incorrect'}
								onInputChange={this.onInputChange} />
							<div className="form-focus"></div>
						</li>
						<li>
							<label htmlFor="url" className="form-label form-label--center">Inappropriate</label>
							<input
								id="url"
								type="radio"
								name="inappropriate"
								className="form-input text-right"
								value={this.state.report === 'inappropriate'}
								onInputChange={this.onInputChange} />
							<div className="form-focus"></div>
						</li>
					</ul>

					<button type="submit" name="login" className={`btn btn--hero widthfull ${!!(this.state.report) ? 'btn--accent' : 'btn--disabled'}`} onClick={this._postReport}>
						Send Report
					</button>

					<ul className="list list--inlinelinks typography-small text-right" style={{ marginTop: '2rem' }}>
						<li><a href="https://radplaid.freshdesk.com/">Help</a></li>
						<li><Link to="/privacy-policy">Privacy Policy</Link></li>
					</ul>
				</form>
			</Modal>
		))
	}
}

export default ModalReport
