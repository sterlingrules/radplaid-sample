import React, { Component } from 'react'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'

class Page extends Component {
	static propTypes = {
		id: PropTypes.string,
		className: PropTypes.string,
		title: PropTypes.string
	}

	componentWillMount() {
		if (typeof window !== 'undefined') {
			window.scrollTo(0, 0)
		}
	}

	render() {
		let { id, className, title, children } = this.props

		return (
			<div className="page" id={id}>
				<Helmet>
					<title>{title} | Rad Plaid</title>
				</Helmet>

				<div id="hero" className="hero hero--compact">
					{title && (
						<div className="grid">
							<div className="row">
								<div className="hero-content col col-8-of-12 col-small-12-of-12 center">
									<h2 className="typography-hero-headline">{title}</h2>
								</div>
							</div>
						</div>
					)}
				</div>

				<div className="grid">
					<div className="row">
						<div className={`col col-8-of-12 col-small-12-of-12 center ${className}`}>
							{children}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Page
