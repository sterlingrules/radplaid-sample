import React, { Fragment, Component } from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import keys from 'lodash/keys'
import clone from 'lodash/clone'
import isArray from 'lodash/isArray'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import isNumber from 'lodash/isNumber'
import Certified from './certified.jsx'
import Promotions from './promotions.jsx'
import Payment from './payment.jsx'
import { Loader } from './../../../common/loader.jsx'
import OrderActions from './../../../redux/actions/orders.jsx'
import * as AppActions from './../../../redux/actions/app.jsx'
import ShowActions from './../../../redux/actions/shows.jsx'
import { PRODUCTS } from './../../../constants.jsx'
import { loadFreshdeskWidget } from './../../../helpers/vendors.js'
import { track } from './../../../helpers/analytics.jsx'
import { formatNumber } from './../../../helpers'

import {
	IconHelp,
	IconStar,
	IconChevronLeft,
	IconClose,
	IconEdit,
	IconPlay,
	IconPause,
} from './../../../common/icons.jsx'

class Admin extends Component {
	static propTypes = {
		isAdminVisible: PropTypes.bool,
	}

	state = {
		order: {},
		widgetLoaded: !!(
			typeof window !== 'undefined' &&
			window.FreshworksWidget
		),
	}

	componentDidMount() {
		const { location, match, isAdminVisible, setAdminVisible, activeShow } = this.props
		const order = this._getCurrentOrder()

		if (location.pathname.indexOf('/admin') >= 0 && !isAdminVisible) {
			this.setState({ order })
			setAdminVisible('/admin')
		}

		// If we've mounted and don't have stats, let's fetch them
		if (activeShow && !isNumber(activeShow.impression_total)) {
			this.props.fetchShowById(activeShow.slug)
		}

		loadFreshdeskWidget(() => {
			const widgetLoaded = !!(window.FreshworksWidget)

			if (!widgetLoaded) {
				return
			}

			FreshworksWidget(isAdminVisible ? 'show' : 'hide', 'launcher')

			this.setState({ widgetLoaded })
		})
	}

	componentDidUpdate(prevProps, prevState) {
		const { location, match, isAdminVisible } = this.props
		const { widgetLoaded } = this.state

		if (widgetLoaded && isAdminVisible !== prevState.isAdminVisible) {
			FreshworksWidget(isAdminVisible ? 'show' : 'hide', 'launcher')

			if (!isAdminVisible) {
				FreshworksWidget('close')
			}
		}

		window.history.replaceState({}, '', `/shows/${match.params.slug}${isAdminVisible}`)
	}

	componentWillUnmount() {
		if (this.state.widgetLoaded) {
			FreshworksWidget('hide', 'launcher')
			FreshworksWidget('close')
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			nextProps.activeShow !== this.props.activeShow ||
			nextProps.isAdminVisible !== this.props.isAdminVisible ||
			!isEqual(nextState.order, this.state.order)
		)
	}

	onLearnMore = () => {
		const { slug } = this.props.activeShow

		if (this.state.widgetLoaded) {
			FreshworksWidget('open')
		}

		track('cta', {
			label: 'learn more promotion',
			action: 'learn more',
			source: 'admin',
			showId: slug,
		})
	}

	onEdit = () => {
		const { slug } = this.props.activeShow

		this.props.setAdminVisible('/admin/certified/edit')

		track('cta', {
			label: `edit promotion`,
			action: 'edit',
			source: 'admin',
			showId: slug,
		})
	}

	onUpdate = (value = {}) => {
		const names = keys(value)
		const { slug } = this.props.activeShow
		const order = clone(this.state.order)

		names.forEach((name) => {
			order[name] = value[name]
		})

		this.setState({ order })

		track('cta', {
			label: `update promotion`,
			action: 'update',
			source: 'admin',
			showId: slug,
		})
	}

	toggleActive = (active) => {
		const { slug } = this.props.activeShow
		const { order } = this.state

		this.props.updateOrder({
			active,
			status: active ? 'running' : 'paused',
		})

		track('cta', {
			label: active ? 'running' : 'paused',
			action: 'toggle promotion status',
			source: 'admin',
			showId: slug,
		})
	}

	clearView = () => {
		this.props.setAdminVisible('/admin')
	}

	updateView = ({ target }) => {
		const { slug } = this.props.activeShow

		this.props.setAdminVisible(`/admin/${target.dataset.name}`)

		track('visit', {
			label: `/admin/${target.dataset.name}`,
			action: `/admin/${target.dataset.name}`,
			source: 'admin',
			showId: slug,
		})
	}

	closeAdmin = () => {
		this.props.setAdminVisible('')
	}

	deleteOrder = () => {
		const { slug } = this.props.activeShow
		const question = confirm('Are you sure you want to delete your promotion? This cannot be undone.')

		if (question) {
			this.setState({ order: {} })
			this.props.deleteOrder(() => {
				track('cta', {
					label: 'delete promotion',
					action: 'delete promotion',
					source: 'admin',
					show_id: slug,
				})
			})
		}
	}

	deleteShow = () => {
		let { activeShow, deleteShow, resetSearch } = this.props
		let showId = activeShow ? activeShow.slug : null
		let title = activeShow ? activeShow.title : ''

		deleteShow(showId, title, () => {
			track('cta', {
				action: 'delete show',
				label: `delete ${showId}`,
				source: 'admin',
				show_id: showId,
			})

			this.props.history.push(`/`)
			resetSearch()
		})
	}

	_getCurrentOrder = () => {
		const { products = [] } = this.props.activeShow
		const activePromotions = isArray(products) && products.filter(p => !(p.billed))
		const order = (activePromotions.length > 0) ? activePromotions[0] : {}

		if (order.start_date) {
			order.start_date = moment(order.start_date)
		}

		if (order.end_date) {
			order.end_date = moment(order.end_date)
		}

		return order
	}

	render() {
		const { order } = this.state
		const { isAdminVisible, activeShow, progress } = this.props
		const {
			slug,
			date,
			title = '',
			products = [],
			genres = [],
			impression_total,
			engagement_total,
			ticket_total,
			ticket_url,
		} = activeShow || {}

		const endedPromotions = isArray(products) && products.filter(p => !!(p.billed))
		const activePromotions = isArray(products) && products.filter(p => !(p.billed))

		const canPromote = (
			isArray(genres) &&
			genres.length > 0 &&
			!activePromotions.length &&
			moment().add(1, 'days').isBefore(date)
		)

		return (
			<div id="admin" className={`admin modal ${isAdminVisible ? 'modal-active' : ''}`}>
				<div className="admin-panel">
					<div className="admin-header">
						{(isAdminVisible.search(/certified|\/payment|\/edit/) >= 0) && (
							<div className="btn-back cursor-pointer" onClick={this.clearView}>
								<IconChevronLeft />
							</div>
						)}
						<h3 className="typography-subheadline text-ellipsis">{title}</h3>
						<div className="cursor-pointer" onClick={this.closeAdmin}>
							<IconClose />
						</div>
					</div>

					{(isAdminVisible.indexOf('certified') >= 0 && canPromote) ||
					(isAdminVisible.indexOf('certified/edit') >= 0 && activePromotions.length > 0) ? (
						<Certified
							order={order}
							currentView={isAdminVisible}
							canPromote={canPromote}
							endedPromotions={endedPromotions}
							activePromotions={activePromotions}
							onUpdate={this.onUpdate}
							updateView={this.updateView}
							onBack={this.clearView} />
					) : (isAdminVisible.indexOf('payment') >= 0) ? (
						<Payment
							order={order}
							currentView={isAdminVisible}
							onUpdate={this.onUpdate}
							updateView={this.updateView}
							onBack={this.clearView} />
					) : (
						<div className="admin-content">

							<div className="admin-item">
								<div className="bubble-subheadline color-primary">
									Analytics
								</div>

								{(progress.indexOf('activeshow') >= 0) ? (
									<Loader center={true} />
								) : (
									<div className="data">
										{(ticket_url && isNumber(ticket_total)) && (
											<div className="data-item background-buy">
												<div className="data-item-content">
													<div className="data-stat">
														<div className="data-value">{formatNumber(ticket_total)}</div>
														<div className="data-label">tickets</div>
													</div>

													<ReactTooltip id="help-tickets" place="left" effect="solid">
														<span className="tooltip-copy">Total ticket clicks this show has received</span>
													</ReactTooltip>

													<div data-tip data-for="help-tickets" className="data-help">
														<IconHelp />
													</div>
												</div>
											</div>
										)}

										{isNumber(impression_total) && (
											<div className="data-item background-secondary">
												<div className="data-item-content">
													<div className="data-stat">
														<div className="data-value">{impression_total}</div>
														<div className="data-label">impressions</div>
													</div>

													<ReactTooltip id="help-impressions" place="left" effect="solid">
														<span className="tooltip-copy">Total times this show was included in fan feeds, similar show listings, emails, and partners.</span>
													</ReactTooltip>

													<div data-tip data-for="help-impressions" className="data-help">
														<IconHelp />
													</div>
												</div>
											</div>
										)}

										{isNumber(engagement_total) && (
											<div className="data-item background-accent-two">
												<div className="data-item-content">
													<div className="data-stat">
														<div className="data-value">{engagement_total}</div>
														<div className="data-label">engagement</div>
													</div>

													<ReactTooltip id="help-engagement" place="left" effect="solid">
														<span className="tooltip-copy">Total plays, follows, and shares</span>
													</ReactTooltip>

													<div data-tip data-for="help-engagement" className="data-help">
														<IconHelp />
													</div>
												</div>
											</div>
										)}
									</div>
								)}
							</div>

							<Promotions
								products={products}
								endedPromotions={endedPromotions}
								activePromotions={activePromotions}
								updateView={this.updateView}
								canPromote={canPromote}
								onEdit={this.onEdit}
								onLearnMore={this.onLearnMore}
								onToggleActive={this.toggleActive}
								onCancel={this.deleteOrder} />
						</div>
					)}

					<div className="admin-footer">
						<Link to={`/shows/${slug}/edit/1`} className="btn btn--accept btn--knockout">
							Edit
						</Link>
						<div className="btn btn--error btn--small" onClick={this.deleteShow}>Delete</div>
					</div>
				</div>

				<div className="modal-overlay" onClick={this.closeAdmin} />
			</div>
		)
	}
}

const mapStateToProps = ({ app, shows, user }) => ({
	progress: app.progress,
	viewportName: app.viewportName,

	user: user.user,

	activeShow: shows.activeShow,
	isAdminVisible: shows.isAdminVisible,
})

const mapDispatchToProps = dispatch => {
	return {
		updateOrder: (props, callback) => {
			dispatch(OrderActions.update(props, callback))
		},

		deleteOrder: (callback) => {
			dispatch(OrderActions.delete(callback))
		},

		deleteShow: (slug, title, callback) => {
			dispatch(ShowActions.apiDeleteShow(slug, title, callback))
		},

		setAdminVisible: (isVisible) => {
			dispatch(ShowActions.setAdminVisible(isVisible))
		},

		fetchShowById: (slug) => {
			dispatch(ShowActions.apiFetchShowById(slug))
		},

		setNotification: (notification) => {
			dispatch(AppActions.setNotification(notification))
		},
	}
}

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(Admin)
)
