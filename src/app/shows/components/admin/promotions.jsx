import moment from 'moment'
import React, { Fragment } from 'react'
import ReactTooltip from 'react-tooltip'
import { formatPrice } from './../../../helpers'
import { PRODUCTS } from './../../../constants.jsx'

import {
	IconHelp,
	IconStar,
	IconClose,
	IconEdit,
	IconPlay,
	IconPause,
} from './../../../common/icons.jsx'

const DATE_FORMAT = 'MMM DD, YYYY'

const PromoMarketing = ({ updateView, onLearnMore }) => (
	<div className="admin-item promo">
		<div className="bubble-subheadline color-primary">
			Promote Your Show
		</div>
		<div className="bubble bubble--shadow">
			<div className="featured-headline">
				<IconStar className="icon--small" />
				Recommended
			</div>
			<div className="bubble-copy">
				<div className="typography-small-headline color-accent-two">Promote</div>
				<div className="typography-subheadline">
					$0.01 <span>per impression</span>
				</div>
				<p>Get your event featured in front of real music fans throughout Rad Plaid, emails, partner sites, and our mobile apps.</p>

				<div className="flex">
					<div className="btn btn--accept btn--small" data-name="certified" onClick={updateView}>
						Get Started
					</div>
					<div
						className="btn btn--accent-two--secondary btn--small"
						onClick={onLearnMore}>
						Learn More
					</div>
				</div>
			</div>
		</div>
	</div>
)

const Promotions = (props) => {
	const {
		products,
		endedPromotions,
		activePromotions,
		canPromote,
		updateView,
		onEdit,
		onLearnMore,
		onToggleActive,
		onCancel
	} = props

	return (
		<Fragment>
			{canPromote && (
				<PromoMarketing
					onLearnMore={onLearnMore}
					updateView={updateView} />
			)}

			{(activePromotions.length > 0) && (
				<div className="admin-item promo">
					<div className="bubble-subheadline color-primary">
						Active Promotion{activePromotions.length > 1 ? 's' : ''}
					</div>

					{activePromotions.map(p => (
						<div key={p.id} className="data">
							<div className={`data-item data-item-stack ${p.active ? 'background-reverse-gradient' : 'background-copy-secondary'}`}>
								<ReactTooltip id="help-promotion" place="left" effect="solid">
									<span className="tooltip-copy">Total Certified Rad impressions and cost</span>
								</ReactTooltip>

								<div className="data-item-header">
									<div className="flex-grow typography-small-headline">
										{moment(p.start_date).format(DATE_FORMAT)} - {moment(p.end_date).format(DATE_FORMAT)}
									</div>
									<div data-tip data-for="help-promotion" className="data-help">
										<IconHelp />
									</div>
								</div>

								<div className="data-item-content">
									<div className="data-stat">
										<div className="data-value">{p.impression_total}</div>
										<div className="data-label">impressions</div>
									</div>

									<div className="data-stat">
										<div className="data-value">
											${Math.min(p.impression_total * (p.rate || PRODUCTS.CERTIFIED_RAD), p.budget).toFixed(2)}
											<span className="typography-hero-body"> / ${formatPrice(p.budget)}</span>
										</div>
										<div className="data-label">cost</div>
									</div>
								</div>

								<div className="data-item-footer">
									{(
										moment().isAfter(moment(p.start_date)) &&
										moment().isBefore(moment(p.end_date))
									) ? (
										<div className="btn btn--accent-two--secondary btn--tiny" onClick={() => onToggleActive(!p.active)}>
											{(p.active && p.status === 'running') ? (
												<Fragment>
													<IconPause className="icon--small" /> Pause
												</Fragment>
											) : (
												<Fragment>
													<IconPlay className="icon--small" /> Resume
												</Fragment>
											)}
										</div>
									) : moment().isBefore(moment(p.start_date)) ? (
										<div className="btn btn--disabled btn--tiny">
											Scheduled
										</div>
									) : (
										<div className="btn btn--disabled btn--tiny">
											Ended
										</div>
									)}
									<div className="btn btn--accent-two--secondary btn--tiny" onClick={onEdit}>
										<IconEdit className="icon--small" /> Edit
									</div>
									<div className="btn btn--accent-two--secondary btn--tiny" onClick={onCancel}>
										<IconClose className="icon--small" /> Cancel
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{(endedPromotions.length > 0) && (
				<div className="admin-item promo">
					<div className="bubble-subheadline color-primary">
						Completed Promotion{endedPromotions.length > 1 ? 's' : ''}
					</div>

					{endedPromotions.map(p => (
						<div key={p.id} className="data">
							<div className="data-item data-item-stack background-copy-secondary">
								<ReactTooltip id="help-promotion" place="left" effect="solid">
									<span className="tooltip-copy">Total Certified Rad impressions and cost</span>
								</ReactTooltip>

								<div className="data-item-header">
									<div className="flex-grow typography-small-headline">
										{moment(p.start_date).format(DATE_FORMAT)} - {moment(p.end_date).format(DATE_FORMAT)}
									</div>
									<div data-tip data-for="help-promotion" className="data-help">
										<IconHelp />
									</div>
								</div>

								<div className="data-item-content">
									<div className="data-stat">
										<div className="data-value">{p.impression_total}</div>
										<div className="data-label">impressions</div>
									</div>

									<div className="data-stat">
										<div className="data-value">
											${Math.min(p.impression_total * (p.rate || PRODUCTS.CERTIFIED_RAD), p.budget).toFixed(2)}
											<span className="typography-hero-body"> / ${formatPrice(p.budget)}</span>
										</div>
										<div className="data-label">cost</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</Fragment>
	)
}

export default Promotions
