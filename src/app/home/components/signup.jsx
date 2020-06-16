import React from 'react'
import { Link } from 'react-router-dom'
import URI from 'urijs'
import Login from './../../authentication/components/login.jsx'
import ViewableMonitor from './../../common/utils/viewable-monitor.jsx'
import { SIGNUP_BUTTON } from './../../constants.jsx'
import { track } from './../../helpers/analytics.jsx'

export const ShowItemSignup = ({ isSearching }) => {
	return (
		<div className="showitem-signup">
			<div className="showitem-signup-content">
				<div className="relative color-white">
					<h3 className="typography-subheadline text-uppercase">#ListenLocal</h3>
					<h2 className="typography-hero-headline">
						{isSearching ? (
							<React.Fragment>Tell us your favorite artists. We'll show you some <span className="underline">rad</span> events.</React.Fragment>
						) : (
							<React.Fragment>What does your local scene <span className="underline">actually</span> sound like?</React.Fragment>
						)}
					</h2>
				</div>
				<br />
				<br />

				<Link
					to={{ pathname: '/', search: 'modal=signup' }}
					rel="nofollow"
					className="btn btn--accept btn--hero"
					onClick={() => {
						track('cta', {
							action: 'signup',
							source: 'signupblock'
						})
					}}>
					{SIGNUP_BUTTON}
				</Link>
				<Link to="/about" onClick={() => track('cta', { action: 'learn', source: 'signupblock' })} className="btn btn--hero">Learn more</Link>
			</div>
		</div>
	)
}

const SignupBlock = (props) => {
	let uri = new URI()
	let { value, style, className, isSearching } = props

	return (
		<ViewableMonitor minHeight={380} className={`marketingsignup ${className || ''}`} style={style || {}}>
			<div className="grid text-center">
				<div className="row">
					<div className="col col-6-of-12 col-medium-8-of-12 col-small-12-of-12 center">
						<div className="relative color-white">
							{!value && (
								<h3 className="typography-subheadline">#ListenLocal</h3>
							)}
							<h2 className="typography-hero-headline">
								{value ? (
									<React.Fragment>{value}</React.Fragment>
								) : isSearching ? (
									<React.Fragment>Tell us your favorite artists. We'll show you some <span className="underline">rad</span> events.</React.Fragment>
								) : (
									<React.Fragment>What does your local scene <span className="underline">actually</span> sound like?</React.Fragment>
								)}
							</h2>
						</div>
						<br />
						<br />

						<Link
							to={{ pathname: uri.pathname(), search: 'modal=signup' }}
							rel="nofollow"
							className="btn btn--accept btn--hero"
							onClick={() => {
								track('cta', {
									action: 'signup',
									source: 'signupblock'
								})
							}}>
							{SIGNUP_BUTTON}
						</Link>
						<Link to="/about" onClick={() => track('cta', { action: 'learn', source: 'signupblock' })} className="btn btn--hero">Learn more</Link>
					</div>
				</div>
			</div>
		</ViewableMonitor>
	)
}

export default SignupBlock
