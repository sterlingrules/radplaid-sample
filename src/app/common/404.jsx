import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Helmet from 'react-helmet'
import URI from 'urijs'
import PhotographerCredit from './photographer-credit.jsx'

class NotFound extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		let uri = new URI()

		return (
			<div id="hero" className="hero hero-404">
				<Helmet>
					<meta name="prerender-status-code" content="404" />
				</Helmet>

				<div className="hero-content grid">
					<div className="row">
						<div className="col col-12-of-12">
							<h1 className="typography-hero-headline">404</h1>
							<h2 className="typography-subheadline">Oops.</h2>
							<h2 className="typography-subheadline">Looks like something is missing.</h2>
						</div>
					</div>
					<div className="row">
						<div className="col col-12-of-12">
							<Link to='/' className="btn btn--primary btn--hero">Return Home</Link>
						</div>
					</div>
				</div>

				<PhotographerCredit authorUsername="bonneville1983" authorName="Chang Hsien" />
			</div>
		)
	}
}

export default NotFound
