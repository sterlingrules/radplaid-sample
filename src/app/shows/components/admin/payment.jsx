import 'babel-polyfill'

import moment from 'moment'
import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import DateRangePicker from 'react-dates/lib/components/DateRangePicker'
import { withRouter, Link } from 'react-router-dom'
import { Loader } from './../../../common/loader.jsx'
import InputRange from './../../../forms/input-range.jsx'
import InputEmail from './../../../forms/input-email.jsx'
import { formatPrice, delay, formatNumber, formatPhoneNumber } from './../../../helpers'
import * as AppActions from './../../../redux/actions/app.jsx'
import OrderActions from './../../../redux/actions/orders.jsx'
import ShowActions from './../../../redux/actions/shows.jsx'
import { IconLock } from './../../../common/icons.jsx'

import { loadStripe } from '@stripe/stripe-js'
import {
	CardElement,
	Elements,
	ElementsConsumer
} from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY)
const CARD_OPTIONS = {
	iconStyle: 'solid',
}

class CheckoutForm extends React.Component {
	state = {
		error: null,
		complete: false,
		processing: false,
		name: this.props.user.fullName || '',
		email: this.props.user.email || '',
		phone: '',
	}

	componentDidMount() {
		const {
			order,
			estimate = {},
			customer = {},
			updateView,
			fetchSetupIntent
		} = this.props

		if (isEmpty(estimate) && isEmpty(order)) {
			return updateView({
				target: {
					dataset: {
						name: 'certified'
					}
				}
			})
		}

		const _customer = {}

		if (customer.name) {
			_customer.name = customer.name
		}

		if (customer.email) {
			_customer.email = customer.email
		}

		if (customer.phone) {
			_customer.phone = customer.phone
		}

		this.setState({ ..._customer })
	}

	onInputChange = ({ target }) => {
		console.log('target ', target)
		const state = { [target.name]: target.value }

		if (target.name === 'email') {
			state.emailValid = target.valid
		}

		this.setState(state)
	}

	onCardChange = ({ complete, ...data }) => {
		this.setState({ complete })
	}

	onSubmit = async (event) => {
		event.preventDefault()

		const { stripe, elements, estimate, order, setupIntent } = this.props
		const { email, phone, name, processing } = this.state
		const _order = order || estimate
		const active = (_order && _order.start_date && moment().isAfter(_order.start_date))

		if (!stripe || !elements || processing) {
			return
		}

		if (this.state.error) {
			elements.getElement('card').focus()
			return
		}

		this.setState({
			processing: true,
			error: null,
		})

		const { error, setupIntent: payload } = await stripe.confirmCardSetup(setupIntent, {
			payment_method: {
				card: elements.getElement(CardElement),
				billing_details: {
					name,
					email,
					phone,
				},
			},
		})


		if (error) {
			this.setState({
				error: error.message,
				processing: false,
			})
		}

		this.props[order && order.id ? 'updateOrder' : 'createOrder']({
			...estimate,
			...order,
			name,
			email,
			phone,
			payment_method: payload.payment_method,
		}, () => {
			this.setState({ processing: false })
			this.props.onBack()
		})
	}

	render() {
		const { error, processing, name, email, emailValid, phone, complete } = this.state
		const { stripe, progress, order, onBack } = this.props
		const isLoading = (progress.indexOf('app') >= 0)
		const fieldsComplete = (name && email && emailValid && phone && phone.length >= 10)
		const isDisabled = (isLoading || processing || !complete || error || !fieldsComplete)
		const isEditing = (order && order.id)

		return (
			<Fragment>
				<div
					className="featured-headline"
					style={{
						marginTop: -1,
						textAlign: 'left',
						fontStyle: 'normal',
						borderRadius: 0,
					}}>
					<span className="typography-small-headline">Promote Your Show</span>
				</div>

				<form className="admin-content" onSubmit={this.onSubmit}>
					<fieldset className="admin-item">
						{error && (
							<p className="alert alert--error">{error}</p>
						)}

						<ul className="form-table-v2">
							<li className={`${name ? 'form--valid' : 'form--invalid'}`}>
								<label className="form-label form-label--center form-label--overlay">Name</label>
								<input type="text" name="name" autoComplete="name" required className={`form-input text-right`} value={name} placeholder="Full Name" onChange={this.onInputChange} />
							</li>
							<li className={`${emailValid ? 'form--valid' : 'form--invalid'}`}>
								<label className="form-label form-label--center form-label--overlay">Email</label>
								<InputEmail
									id="editprofile-email"
									className="form-input text-right"
									validateDupes={false}
									value={email}
									onInputChange={this.onInputChange} />
							</li>
							<li className={`${(phone && phone.length >= 10) ? 'form--valid' : 'form--invalid'}`}>
								<label className="form-label form-label--center form-label--overlay">Phone</label>
								<input value={formatPhoneNumber(phone)} type="tel" name="phone" autoComplete="tel" required className={`form-input text-right`} placeholder="Phone" onChange={this.onInputChange} />
							</li>
						</ul>
					</fieldset>

					<fieldset className="admin-item" style={{ paddingTop: '1rem' }}>
						<div className="bubble-subheadline color-primary">
							Payment
						</div>
						<div className="payments">
							<CardElement options={CARD_OPTIONS} onChange={this.onCardChange} />
						</div>
					</fieldset>

					<div
						className="admin-item flex"
						style={{ paddingTop: '2rem', paddingBottom: '1rem' }}>
						<div className="btn btn--accent-two--secondary flex-grow" onClick={onBack}>
							Cancel
						</div>

						{isDisabled ? (
							<button type="submit" className="btn btn--disabled flex-grow">
								{processing ? <Loader /> : (
									<span>
										<IconLock
											className="icon--small"
											style={{ marginRight: '0.4rem' }} />
										Complete Form
									</span>
								)}
							</button>
						) : (
							<button type="submit" className="btn btn--accept flex-grow">
								{isEditing ? (
									<span>
										<IconLock
											className="icon--small"
											style={{ marginRight: '0.4rem' }} />
										Update Promotion
									</span>
								) : (
									<span>
										<IconLock
											className="icon--small"
											style={{ marginRight: '0.4rem' }} />
										Start Promotion
									</span>
								)}
							</button>
						)}
					</div>

					<div className="typography-small color-copy-secondary">
						By selecting "Start Promoting", I authorise Rad Plaid to send instructions to the financial institution that issued my card to take payments from my card account in accordance with the terms of my agreement with you.
					</div>
					<img
						src="https://res.cloudinary.com/radplaid/image/upload/f_auto/v1583684671/badges/powered_by_stripe_2x.png"
						style={{ marginTop: '1rem' }}
						width="119"
						height="26" />
				</form>
			</Fragment>
		)
	}
}

const InjectedCheckoutForm = (props) => (
	<ElementsConsumer>
		{({stripe, elements}) => (
			<CheckoutForm stripe={stripe} elements={elements} {...props} />
		)}
	</ElementsConsumer>
)

const Payment = (props) => (
	<Elements stripe={stripePromise}>
		<InjectedCheckoutForm {...props} />
	</Elements>
)

const mapStateToProps = ({ app, shows, user, orders }) => ({
	progress: app.progress,
	viewportName: app.viewportName,

	user: user.user,

	activeShow: shows.activeShow,

	setupIntent: orders.setupIntent,
	customer: orders.customer,
	estimate: orders.estimate,
})

const mapDispatchToProps = dispatch => {
	return {
		setNotification: (notification) => {
			dispatch(AppActions.setNotification(notification))
		},

		createOrder: (data, callback) => {
			dispatch(OrderActions.create(data, callback))
		},

		updateOrder: (data, callback) => {
			dispatch(OrderActions.update(data, callback))
		},

		fetchEstimate: (props) => {
			dispatch(OrderActions.fetchEstimate(props))
		},

		fetchSetupIntent: () => {
			dispatch(OrderActions.fetchSetupIntent())
		},
	}
}

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(Payment)
)
