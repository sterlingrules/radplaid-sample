import 'babel-polyfill'

import moment from 'moment'
import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import isArray from 'lodash/isArray'
import isEqual from 'lodash/isEqual'
import clone from 'lodash/clone'
import DateRangePicker from 'react-dates/lib/components/DateRangePicker'
import { withRouter, Link } from 'react-router-dom'
import InputRange from './../../../forms/input-range.jsx'
import { Loader } from './../../../common/loader.jsx'
import { IconDone, IconPlus } from './../../../common/icons.jsx'
import { formatPrice, delay, formatNumber } from './../../../helpers'
import * as AppActions from './../../../redux/actions/app.jsx'
import OrderActions from './../../../redux/actions/orders.jsx'
import ShowActions from './../../../redux/actions/shows.jsx'

class Certified extends Component {
	state = {
		budget: 5,
		payment_method: null,
		start_date: moment(),
		end_date: moment(),
		max_date: moment(),
		focusedInput: null,
	}

	componentDidMount() {
		const {
			order,
			customer = {},
			isAdminVisible = '',
			activePromotions,
			activeShow,
			fetchEstimate,
			updateView,
			canPromote,
		} = this.props

		const { start_date, budget } = this.state
		const { date, products = [] } = activeShow
		const isEditing = (isAdminVisible.indexOf('/edit') >= 0)
		const isPromoted = (activePromotions && activePromotions.length)
		const payment_method = (customer && isArray(customer.payment_methods) && customer.payment_methods.length > 0)
			? customer.payment_methods[0].id
			: null

		if (!isEditing && (isPromoted || !canPromote)) {
			return updateView({
				target: {
					dataset: {
						name: '',
					},
				},
			})
		}

		this.setState({
			max_date: moment(date),
			end_date: moment(date),
			payment_method,
			...order,
		}, (state) => {
			this.initialState = clone(this.state)
			this._fetchEstimate(() => {
				this.props.onUpdate({ start_date, end_date: moment(date) })
				this.props.fetchSetupIntent()
			})
		})
	}

	componentDidUpdate(prevProps, prevState) {
		const { start_date, end_date } = this.state
		const { activeShow, progress } = this.props
		const date = moment(activeShow.date)
		const isLoading = (progress.indexOf('estimate') >= 0)
		const dateChange = !!(
			moment(end_date).isValid() && end_date.diff(prevState.end_date) ||
			moment(start_date).isValid() && start_date.diff(prevState.start_date) ||
			!prevState.start_date && moment(start_date).isValid() ||
			!prevState.end_date && moment(end_date).isValid()
		)

		if (dateChange && !isLoading) {
			delay(this._fetchEstimate, 300)
		}
	}

	componentWillReceiveProps(nextProps) {
		const { customer } = nextProps

		if (customer && !isEqual(customer, this.props.customer)) {
			const { payment_methods, invoice_settings } = customer || {}
			const { default_payment_method } = invoice_settings || {}
			const payment_method = (isArray(payment_methods) && payment_methods.length > 0)
				? payment_methods[0].id
				: null

			if (default_payment_method) {
				return this.setState({ payment_method: default_payment_method })
			}

			this.setState({ payment_method })
		}
	}

	_fetchEstimate = (callback) => {
		const { start_date, end_date, budget } = this.state
		const date = moment(this.props.activeShow.date)
		const query = { budget }

		if (moment(start_date).isValid() && moment(end_date).isValid()) {
			query.start_date = start_date.startOf('day').toDate()
			query.end_date = end_date.isAfter(date) ? date.toDate() : end_date.endOf('day').toDate()
		}

		this.props.fetchEstimate(query, callback)
	}

	toggleDefaultPayment = (payment_method) => {
		this.setState({ payment_method })
	}

	onStartPromotion = () => {
		const { estimate, order } = this.props
		const { payment_method } = this.state

		this.props.createOrder({
			...estimate,
			...order,
			payment_method,
		}, () => {
			this.props.onBack()
		})
	}

	onEditPromotion = () => {
		const { order, estimate } = this.props
		const { payment_method } = this.state

		this.props.updateOrder({
			...estimate,
			...order,
			payment_method,
		}, () => {
			this.props.onBack()
		})
	}

	onDatesChange = ({ startDate, endDate }) => {
		this.setState({
			start_date: startDate,
			end_date: endDate
		})

		this.props.onUpdate({
			start_date: startDate,
			end_date: endDate
		})
	}

	onRangeChange = (budget) => {
		this.setState({ budget })
		this.props.onUpdate({ budget })
	}

	render() {
		const {
			start_date,
			end_date,
			max_date,
			payment_method,
			focusedInput,
			budget,
		} = this.state

		const {
			stripe,
			estimate,
			progress,
			isAdminVisible = '',
			updateView,
			customer = {},
			onBack
		} = this.props

		const isLoading = (progress.indexOf('order:create') >= 0)
		const isChanged = (!isEqual(this.initialState, this.state))
		const isEditing = (isAdminVisible.indexOf('/edit') >= 0)
		const isDateValid = (
			moment(start_date).isValid() &&
			moment(end_date).isValid()
		)

		const {
			max_budget,
			estimated_min_impressions,
			estimated_max_impressions,
			max_impressions
		} = estimate || {}

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

				<div className="admin-content">
					<div className="admin-item">
						<div className="bubble-subheadline color-primary">
							Duration
						</div>

						<div className="promo flex" style={{ alignItems: 'center' }}>
							<div className="promo-control">
								<DateRangePicker
									minimumNights={1}
									startDate={start_date}
									startDateId="your_unique_start_date_id"
									endDate={end_date}
									displayFormat="MMM DD, YYYY"
									noBorder={true}
									appendToBody={true}
									small={true}
									endDateId="your_unique_end_date_id"
									onDatesChange={this.onDatesChange}
									isDayBlocked={day => day.isAfter(max_date)}
									focusedInput={focusedInput}
									onFocusChange={focusedInput => {
										this.setState({ focusedInput })
									}} />
							</div>
							<div className="promo-value">
								<div className="typography-headline">{isDateValid ? end_date.diff(start_date, 'days') : 0}</div>
								<div className="typography-small">days</div>
							</div>
						</div>
					</div>

					<div className="admin-item">
						<div className="bubble-subheadline color-primary">
							Budget
						</div>

						<div className="promo flex" style={{ alignItems: 'center' }}>
							<div className="promo-control">
								<div className="budget-label">
									<div className="typography-subheadline flex-grow color-accent-two">
										${formatPrice(budget)}
									</div>
									<div className="typography-body-headline color-copy-secondary">
										${max_budget || 20}
									</div>
								</div>

								<InputRange
									step={1}
									value={budget}
									min={1}
									max={max_budget || 20}
									onFinalChange={this._fetchEstimate}
									onChange={this.onRangeChange} />

								{!!(estimated_min_impressions && estimated_max_impressions && max_impressions) && (
									<div className="flex budget-caption">
										<div className="typography-tiny-headline flex-grow">{formatNumber(estimated_min_impressions)} - {formatNumber(estimated_max_impressions)} impressions</div>
										<div className="typography-tiny-headline color-copy-secondary">of {formatNumber(max_impressions)}</div>
									</div>
								)}
							</div>
							<div className="promo-value">
								<div className="typography-headline">${formatPrice(budget)}</div>
								<div className="typography-small">total</div>
							</div>
						</div>
					</div>

					{(customer && isArray(customer.payment_methods) && customer.payment_methods.length > 0) ? (
						<div className="admin-item" style={{ paddingTop: '0.5rem' }}>
							<div className="bubble-subheadline color-primary">
								Payments
							</div>

							<ul className="payment-methods">
								{customer.payment_methods.map(payment => (
									<li
										key={payment.id}
										className={`payment-method ${(payment.id === payment_method) ? 'payment-method-default' : ''}`}
										onClick={this.toggleDefaultPayment.bind(this, payment.id)}>
										<div className="flex-grow">
											<div className="typography-body">
												<strong className="text-uppercase text-ellipsis">{payment.billing_details.name}</strong> XXXX-{payment.card.last4}
											</div>
											<div className="typography-small">
												Expires {payment.card.exp_month}/{payment.card.exp_year} &nbsp;&nbsp; Added {moment(payment.created).format('DD MMM YYYY')}
											</div>
										</div>
										{(payment.id === payment_method) && (
											<IconDone />
										)}
									</li>
								))}

								<li className="payment-method" data-name="payment" onClick={updateView}>
									<IconPlus />
									Add Card
								</li>
							</ul>
						</div>
					) : (progress.indexOf('setup-intent') >= 0) && (
						<div className="admin-item">
							<Loader center={true} />
						</div>
					)}

					<div
						className="admin-item flex"
						style={{ paddingBottom: '1rem' }}>
						<div className="btn btn--accent-two--secondary flex-grow" onClick={onBack}>
							Cancel
						</div>
						{isEditing ? (
							<button className={`btn ${(isLoading || !isChanged) ? 'btn--disabled' : 'btn--accept'} flex-grow`} data-name="payment" onClick={this.onEditPromotion}>
								{isLoading ? <Loader /> : 'Update Promotion'}
							</button>
						) : payment_method ? (
							<button className={`btn ${isLoading ? 'btn--disabled' : 'btn--accept'} flex-grow`} data-name="payment" onClick={this.onStartPromotion}>
								{isLoading ? <Loader /> : 'Start Promotion'}
							</button>
						) : (
							<button className={`btn ${isLoading ? 'btn--disabled' : 'btn--accept'} flex-grow`} data-name="payment" onClick={updateView}>
								{isLoading ? <Loader /> : 'Add Payment'}
							</button>
						)}
					</div>

					{payment_method && (
						<div className="typography-small color-copy-secondary">
							By selecting "Start Promotion", I authorise Rad Plaid to send instructions to the financial institution that issued my card to take payments from my card account in accordance with the terms of my agreement with you.
						</div>
					)}
				</div>
			</Fragment>
		)
	}
}

const mapStateToProps = ({ app, shows, user, orders }) => ({
	progress: app.progress,
	viewportName: app.viewportName,

	user: user.user,

	activeShow: shows.activeShow,
	isAdminVisible: shows.isAdminVisible,

	estimate: orders.estimate,
	customer: orders.customer,
})

const mapDispatchToProps = dispatch => {
	return {
		setNotification: (notification) => {
			dispatch(AppActions.setNotification(notification))
		},

		createOrder: (data, callback) => {
			dispatch(OrderActions.create(data, callback))
		},

		updateOrder: (props, callback) => {
			dispatch(OrderActions.update(props, callback))
		},

		fetchEstimate: (props, callback) => {
			dispatch(OrderActions.fetchEstimate(props, callback))
		},

		fetchSetupIntent: () => {
			dispatch(OrderActions.fetchSetupIntent())
		},
	}
}

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(Certified)
)
