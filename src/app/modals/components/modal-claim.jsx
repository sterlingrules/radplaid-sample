import URI from 'urijs'
import { Link } from 'react-router-dom'
import React, { Component } from 'react'
import { SIGNUP_BUTTON } from './../../constants.jsx'
import { DEFAULT_SELECT_SETTINGS } from './../../constants.computed.jsx'
import { localStorageExpire } from './../../helpers'
import { register, track } from './../../helpers/analytics.jsx'
import { IconClose } from './../../common/icons.jsx'
import Login from './../../authentication/components/login.jsx'
import InputUrl from './../../forms/input-url.jsx'
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

class ModalClaim extends Component {
	static propTypes = {
		claim: PropTypes.object
	}

	constructor(props) {
		super(props)

		this.state = {
			url: '',
			urlValid: null,
			urlValidType: '',
			urlValidClass: '',
			urlMessage: '',

			role: ''
		}
	}

	componentWillMount() {
		if (typeof localStorage === 'undefined') {
			return
		}

		const prevClaim = localStorage.getItem('claim')

		if (prevClaim) {
			this.setState(JSON.parse(prevClaim))
		}
	}

	onInputChange = ({ target }) => {
		if (!target) {
			return
		}

		let { value, validType, validClass } = target

		this.setState({
			url: value,
			urlValid: target.valid,
			urlValidType: validType,
			urlValidClass: validClass,
			urlMessage: target.message || ''
		})
	}

	_postClaim = () => {
		let { user, claim, close, postClaim } = this.props
		let { url, role } = this.state

		localStorage.setItem('claim', JSON.stringify({ url, role }))

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
			claim,
			close
		} = this.props

		let {
			role,
			url,
			urlValid,
			urlValidType,
			urlValidClass,
			urlMessage
		} = this.state

		return (claim && (
			<Modal id="modal-claim" close={close}>
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
						<li className="form-select">
							<Select
								options={[
									{ value: 'artist', label: 'Artist' },
									{ value: 'venue', label: 'Venue' },
									{ value: 'organizer', label: 'Organizer' }
								]}
								settings={{
									...DEFAULT_SELECT_SETTINGS,
									name: 'role',
									placeholder: `What is your role?`,
									value: role,
									defaultValue: role,
									onChange: (option) => {
										this.setState({ role: option })
									}
								}} />
						</li>

						<li className={`${urlValidClass} form-message`}>{urlMessage}</li>
						<li className={urlValidClass} style={{ paddingLeft: '0.7rem' }}>
							<label htmlFor="url" className="form-label form-label--center">{role === 'artist' ? 'Artist Url' : role === 'venue' ? 'Venue Url' : 'Website'}</label>
							<InputUrl
								id="url"
								strict={false}
								className="form-input text-right"
								value={this.state.url}
								placeholder={role ? CLAIM_EXAMPLES[role.value].placeholder : ''}
								onInputChange={this.onInputChange} />
							<div className="form-focus"></div>
						</li>
					</ul>

					{role && (
						<p className="typography-body">{CLAIM_EXAMPLES[role.value].copy}</p>
					)}

					<button type="submit" name="login" className={`btn btn--hero widthfull ${(role && urlValid) ? 'btn--accent' : 'btn--disabled'}`} onClick={this._postClaim}>
						Send Claim
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

export default ModalClaim
