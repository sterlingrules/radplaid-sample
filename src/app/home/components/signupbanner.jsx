import URI from 'urijs'
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { DATE_PATHS, SIGNUP_BUTTON } from './../../constants.jsx'
import { track } from './../../helpers/analytics.jsx'
import { delay } from './../../helpers'
import { IconChevron } from './../../common/icons.jsx'
import Login from './../../authentication/components/login.jsx'
import { store } from './../../redux/store.jsx'

class SignupBanner extends Component {
	constructor(props) {
		super(props)

		this.state = {
			active: false
		}

		this._isActive = this._isActive.bind(this)
	}

	componentDidMount() {
		delay(() => {
			this.setState({ active: this._isActive() })
		}, 3000)
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ active: this._isActive(nextProps) })
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (nextState.active !== this.state.active)
	}

	_isActive(props) {
		let { user, pathname, isSearching } = props || this.props
		let isDatePath = (DATE_PATHS.indexOf(pathname) >= 0)

		return (!user && (pathname !== '/' || isSearching))
	}

	_onTrackSignup = () => {
		track('cta', {
			action: 'signup',
			source: 'signupbanner'
		})
	}

	render() {
		let { active } = this.state
		let { locationName, isSearching } = this.props
		let uri = new URI()

		return (isSearching ? (
			<div className={`signupbanner ${active ? 'active' : ''}`}>
				<div className="signupbanner-content">
					<h2 className="typography-body-headline inlineblock">
						Join for music updates & suggestions
					</h2>

					<Link
						to={{ pathname: uri.pathname(), search: 'modal=signup' }}
						className="btn btn--accent-two--secondary"
						rel="nofollow"
						onClick={this._onTrackSignup}>
						{SIGNUP_BUTTON}
					</Link>
				</div>
			</div>
		) : (
			<a href={`/?location=${locationName || 'Portland, ME'}`} className={`signupbanner ${active ? 'active' : ''}`}>
				<div className="signupbanner-content">
					<h2 className="typography-body-headline inlineblock" style={{ marginBottom: 0 }}>
						Search more {`${locationName ? `${locationName} ` : 'Portland, ME'}`} events
					</h2>

					<div className="btn btn--round btn--accent-two--secondary">
						<IconChevron />
					</div>
				</div>
			</a>
		))
	}
}

export default SignupBanner
