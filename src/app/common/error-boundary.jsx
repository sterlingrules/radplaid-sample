import React, { Component } from 'react'
import { IconWarning } from './icons.jsx'
import { track } from './../helpers/analytics.jsx'

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			hasError: false
		}

		this.reloadPage = this.reloadPage.bind(this)
		this.goHome = this.goHome.bind(this)
	}

	componentDidCatch(error, info) {
		this.setState({ hasError: true })

		if (typeof Sentry !== 'undefined') {
			Sentry.captureException(error, info)
		}

		track('error', {
			action: 'error-boundary',
			info
		})
	}

	reloadPage() {
		if (typeof window !== 'undefined') {
			window.location.reload()
		}
	}

	goHome() {
		if (typeof window !== 'undefined') {
			window.location = process.env.BASE_CLIENT_URL
		}
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="error-boundary">
					<div className="grid">
						<div className="row">
							<div className="col col-6-of-12 col-small-12-of-12 center">
								<div className="bubble">
									<div className="bubble-copy bubble-content">
										<IconWarning className="icon--large fill-warning" />
										<h1 className="typography-headline">Uh-oh, not so Rad.</h1>
										<p>Sorry, looks like something went wrong. Our team has already been notified.</p>
										<button onClick={this.reloadPage} className="btn btn--accept">
											Try Refreshing
										</button>
										<button onClick={this.goHome} className="btn btn--accept btn--knockout">
											Home
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)
		}

		return this.props.children
	}
}

export default ErrorBoundary
