import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { track } from './../../helpers/analytics.jsx'
import ViewableMonitor from './../../common/utils/viewable-monitor.jsx'
import SignupBlock from './signup.jsx'
import Partners from './partners.jsx'

const MarketingFooter = () => {
	return (
		<Fragment>
			<SignupBlock
				value={`Easily find and follow more of the events you'll love`}
				className="bg-fan" />

			<ViewableMonitor minHeight={200} className={`marketingsignup bg-promoters`}>
				<div className="grid text-left">
					<div className="row">
						<div className="col col-6-of-12 col-small-10-of-12">
							<div className="relative color-white">
								<h2 className="typography-hero-headline">Got Events?</h2>
								<p className="typography-subheadline">
									Quickly add all your upcoming events. We'll connect them with the perfect fans.
								</p>
							</div>
							<br />

							<Link
								to={{ pathname: '/add' }}
								className="btn btn--accent btn--hero"
								onClick={() => {
									track('cta', {
										action: 'addshow',
										source: 'signupblock'
									})
								}}>
								Add Your Events
							</Link>
						</div>
					</div>
				</div>
			</ViewableMonitor>

			<Partners />
		</Fragment>
	)
}

export default MarketingFooter
