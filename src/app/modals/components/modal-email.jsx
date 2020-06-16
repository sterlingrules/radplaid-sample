import React, { Component } from 'react'
import Select from 'react-select'

class ModalEmail extends Component {
	state = {
		email: '',
		fname: '',
		lname: '',
		zipcode: '',
		role: 'Show Goer'
	}

	constructor(props) {
		super(props)

		this.onInputChange = this.onInputChange.bind(this)
		this.onRoleChange = this.onRoleChange.bind(this)
	}

	componentDidMount() {
		this.autofocusEl.focus()
	}

	onInputChange({ target }) {
		this.setState({
			[target.name.toLowerCase()]: target.value
		})
	}

	onRoleChange({ label, value }) {
		this.setState({ role: value })
	}

	render() {
		let gradients = [
			['#b2dbdf', '#1ED760'], // green - spotify green
			['#1ED760', '#F36A9D'] // purple - pink
		]

		return (
			<div id="modal-email" className="modal-content">
				<div className="row">
					<div className="modal-copy col col-12-of-12 center">
						<h2 className="typography-headline text-uppercase">Get updates</h2>
						<h3 className="typography-subheadline">Join our Rad Email List</h3>

						<div id="mc_embed_signup">
							<form action="https://getradplaid.us17.list-manage.com/subscribe/post?u=29bf1347cfc1063917d7993ff&amp;id=e57f2984a3" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
								<ul id="mc_embed_signup_scroll" className="form-table">
									<li className="mc-field-group">
										<label className="form-label form-label--center form-label--overlay" htmlFor="mce-EMAIL">Email</label>
										<input type="email" value={this.state.email} onChange={this.onInputChange} ref={node => this.autofocusEl = node} name="EMAIL" autoComplete="email" className="form-input text-right required email" id="mce-EMAIL" />
										<div className="form-focus"></div>
									</li>

									<li className="mc-field-group">
										<label className="form-label form-label--center form-label--overlay" htmlFor="mce-FNAME">First Name</label>
										<input type="text" value={this.state.fname} onChange={this.onInputChange} name="FNAME" className="form-input text-right" id="mce-FNAME" />
										<div className="form-focus"></div>
									</li>
									<li className="mc-field-group">
										<label className="form-label form-label--center form-label--overlay" htmlFor="mce-LNAME">Last Name</label>
										<input type="text" value={this.state.lname} onChange={this.onInputChange} name="LNAME" className="form-input text-right" id="mce-LNAME" />
										<div className="form-focus"></div>
									</li>
									<li className="mc-field-group">
										<label className="form-label form-label--center form-label--overlay" htmlFor="mce-ZIPCODE">Zip/Postal Code</label>
										<input type="text" value={this.state.zipcode} onChange={this.onInputChange} name="ZIPCODE" autoComplete="postal-code" className="form-input text-right" id="mce-ZIPCODE" />
										<div className="form-focus"></div>
									</li>

									<li className="form-select mc-field-group">
										<Select
											multi={false}
											clearable={false}
											searchable={false}
											value={this.state.role}
											onChange={this.onRoleChange}
											placeholder={`What's your role?`}
											options={[
												{ label: 'Show Goer', value: 'Show Goer' },
												{ label: 'Musician', value: 'Musician' },
												{ label: 'Organizer', value: 'Organizer' }
											]} />
									</li>
									<li className="mc-field-group input-group" style={{ display: 'none' }}>
										<strong>Role</strong>
										<ul>
											<li><input type="radio" value="Show Goer" checked={(this.state.role === 'Show Goer')} name="ROLE" id="mce-ROLE-0" readOnly={true} /><label htmlFor="mce-ROLE-0">Show Goer</label></li>
											<li><input type="radio" value="Musician" checked={(this.state.role === 'Musician')} name="ROLE" id="mce-ROLE-1" readOnly={true} /><label htmlFor="mce-ROLE-1">Musician</label></li>
											<li><input type="radio" value="Organizer" checked={(this.state.role === 'Organizer')} name="ROLE" id="mce-ROLE-2" readOnly={true} /><label htmlFor="mce-ROLE-2">Organizer</label></li>
										</ul>
									</li>

									<div id="mce-responses" className="clear">
										<div className="response" id="mce-error-response" style={{ display: 'none' }}></div>
										<div className="response" id="mce-success-response" style={{ display: 'none' }}></div>
									</div>

									<div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
										<input type="text" name="b_29bf1347cfc1063917d7993ff_cc7d77f24f" autoComplete="off" tabIndex="-1" value="" />
									</div>
								</ul>

								<input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" className="btn btn--accept widthfull" />
							</form>
						</div>

					</div>
				</div>
			</div>
		)
	}
}

export default ModalEmail
