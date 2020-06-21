import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { SIGNUP_BUTTON } from './../../constants.jsx'
import { localStorageExpire } from './../../helpers'
import { register, track } from './../../helpers/analytics.jsx'
import { IconClose } from './../../common/icons.jsx'
import Login from './../../authentication/components/login.jsx'
import InputEmail from './../../forms/input-email.jsx'
import Progress from './../../common/progress.jsx'

class ModalSignup extends Component {
	static propTypes = {
		type: PropTypes.string
	}

	constructor(props) {
		super(props)

		this.state = {
			email: '',
			emailValid: null,
			emailValidType: '',
			emailValidClass: '',
			emailMessage: '',

			sendingToken: false
		}
	}

	onInputChange = ({ target }) => {
		if (!target) {
			return
		}

		let { value, validType, validClass, valid } = target

		this.setState({
			email: value,
			emailValid: (valid || validType === 'duplicate'),
			emailValidType: validType,
			emailValidClass: (validClass && validType !== 'duplicate') ? validClass : 'form--valid',
			emailMessage: target.message || ''
		})
	}

	onSubmitEmail = (evt) => {
		evt.preventDefault()
	}

	_onClick = (evt) => {
		if (evt) {
			evt.preventDefault()
		}

		let { name } = evt.target
		let { email, emailValid } = this.state

		if (!emailValid) {
			return
		}

		this.setState({ sendingToken: true })

		this.props.sendLoginToken(email)

		track('cta', {
			action: `email ${name}`,
			source: 'modal signup'
		})
	}

	render() {
		let {
			loadStart,
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
			sendingToken
		} = this.state

		return (
			<div id="modal-signup" className="modal-content">
				{viewportName === 'small' && (
					<Progress />
				)}

				<div className="row">
					<div className="modal-close col col-12-of-12 text-right">
						<div className="modal-btn-close cursor-pointer inlineblock" onClick={close}>
							<IconClose />
						</div>
					</div>

					{sendingToken ? (
						<div className="modal-copy col col-12-of-12 text-center">
							<h2 className={`typography-headline text-center`}>Now, check your email to complete your signup</h2>
							<p className="typography-body">
								A secure login link has just been sent to <strong>{email}</strong>. You should see this email shortly or check your spam folder.
							</p>

							<ul className="list list--inlinelinks typography-small text-right" style={{ marginTop: '3rem' }}>
								<li><a href="https://radplaid.freshdesk.com/">Help</a></li>
								<li><Link to="/privacy-policy">Privacy Policy</Link></li>
							</ul>
						</div>
					) : (
						<div className="modal-copy col col-12-of-12 center">

							{(type === 'login') ? (
								<Fragment>
									<h2 className="typography-headline text-center">Welcome back!</h2>
									<p>
										<Login
											type="spotify"
											className="btn btn--hero btn--round widthfull"
											value="Log In with Spotify"
											loadStart={loadStart} />
									</p>
									<p>
										<Login
											type="facebook"
											className="btn btn--hero btn--round widthfull"
											value="Log In with Facebook"
											loadStart={loadStart} />
									</p>
								</Fragment>
							) : (
								<div className="text-center">
									<div className="inlineblock text-left">
										<h2 className="typography-headline">Join Rad Plaid</h2>
									</div>

									<p className="typography-body">Spotify let's us easily match your play history with local shows.</p>

									<p>
										<Login
											type="spotify"
											className="btn btn--hero btn--round widthfull"
											value={viewportName === 'small' ? 'Sign Up with Spotify' : 'Sign Up with Spotify'}
											loadStart={loadStart} />
									</p>
									<p>
										<Login
											type="facebook"
											className="btn btn--hero btn--round widthfull"
											value={viewportName === 'small' ? 'Sign Up with Facebook' : 'Sign Up with Facebook'}
											loadStart={loadStart} />
									</p>
								</div>
							)}

							<div className="break" name="or" />

							<form
								onSubmit={this.onSubmitEmail}
								action="#">

								<p className="typography-body text-center">{(type === 'login') ? 'Log in' : 'Sign up'} with your email address. We'll send you a secure login link.</p>

								<ul className="form-table">
									<li className={`${emailValidClass} form-message`}>{emailMessage}</li>
									<li className={emailValidClass}>
										<label htmlFor="editprofile-email" className="form-label form-label--center">Email</label>
										<InputEmail
											id="signup-email"
											className="form-input text-right"
											userId={'newuser'}
											validateDupes={true}
											value={email}
											onInputChange={this.onInputChange} />
										<div className="form-focus"></div>
									</li>
								</ul>

								{(typeof emailValid === 'boolean') && (
									(emailValidType === 'duplicate') ? (
										<button type="submit" name="login" className={`btn btn--hero widthfull ${sendingToken ? 'btn--disabled' : 'btn--accent'}`} onClick={this._onClick}>
											Log In
										</button>
									) : (
										<button type="submit" name="signup" className={`btn btn--hero widthfull ${(emailValid && !sendingToken) ? 'btn--accept' : 'btn--disabled'}`} onClick={this._onClick}>
											Email me a Log In
										</button>
									)
								)}

								<ul className="list list--inlinelinks typography-small text-right" style={{ marginTop: '2rem' }}>
									<li><a href="https://radplaid.freshdesk.com/">Help</a></li>
									<li><Link to="/privacy-policy">Privacy Policy</Link></li>
								</ul>
							</form>
						</div>
					)}
				</div>
			</div>
		)
	}
}

export default ModalSignup
