import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { NavLink, Link } from 'react-router-dom'
import omit from 'lodash/omit'
import Login from './../../authentication/components/login.jsx'
import { DATE_PATHS, SIGNUP_BUTTON } from './../../constants.jsx'
import { IconPlus, IconClose } from './../icons.jsx'
import { track } from './../../helpers/analytics.jsx'
import { Avatar } from './../../shows/components/showorganizer.jsx'
import { isHome } from './../../helpers'

const HeaderControl = ({ user, location, onLogout, onSignup, loadStart, loggingInUser }) => {
	const _isHome = isHome(location.pathname)
	const onTrack = (action) => {
		track('cta', {
			action,
			source: 'header'
		})
	}

	let classColumn = _isHome ? 'col-6-of-12 col-medium-7-of-12 right' : 'col-3-of-12 col-medium-3-of-12'

	if (user) {
		classColumn = 'col-3-of-12 col-medium-2-of-12 right'
	}

	return (
		<div className={`header-control col small-hide`}>
			{user ? (
				<Fragment>
					{!location.pathname.includes('/add') && (
						<span className="medium-hide">
							<NavLink
								to="/add/1"
								onClick={onTrack.bind(null, 'addshow')}
								className="btn btn--accent btn--round btn-addshow"
								activeClassName="active">
								<IconPlus />
								Add Show
							</NavLink>
						</span>
					)}

					<nav className="header-menu">
						<Avatar user={user} size="small" />

						<ul className="dropdown-menu">
							<li className="header-viewprofile">
								<Link to={`/profile/${user.id}/following`}>
									<span className="typography-body-headline text-ellipsis">{user.firstName || user.username}</span>
									<span>View Profile</span>
								</Link>
							</li>
							<li className="hide medium-show small-hide" style={{ padding: '0.4em 0.8em' }}>
								<NavLink
									to="/add/1"
									onClick={onTrack.bind(null, 'addshow')}
									className="btn btn--accept widthfull"
									activeClassName="active">
									Add Show
								</NavLink>
							</li>
							<li className="divider"></li>
							<li><Link to="/" className={_isHome ? 'active' : ''}>Home</Link></li>
							<li><NavLink to={`/profile/${user.id}/following`} activeClassName="active">Following</NavLink></li>
							<li><NavLink to={`/profile/${user.id}/managing`} activeClassName="active">My Events</NavLink></li>
							<li className="divider"></li>
							<ul className="dropdown-footer">
								<li><NavLink to="/settings">Settings</NavLink></li>
								<li><NavLink to="/about">About</NavLink></li>
								<li><a href="https://forms.gle/YwHhRfgong94bqZS6" title="Submit News" target="_blank">Submit News</a></li>
								<li><a href="https://radplaid.freshdesk.com/">Help</a></li>
								<li><a href="/logout" onClick={onLogout}>Sign Out</a></li>
							</ul>
						</ul>
					</nav>
				</Fragment>
			) : (
				<Fragment>
					{/*_isHome && (
						<Link
							to={{ pathname: '/about' }}
							className="btn btn--primary btn--noborder">
							About Us
						</Link>
					)*/}

					{_isHome && (
						<Link
							to="/add/1"
							onClick={onTrack.bind(null, 'addshow')}
							className="btn btn--primary btn--noborder">
							Add Show
						</Link>
					)}

					<Link
						to={`?modal=login&next=${location.pathname}`}
						rel="nofollow"
						className="btn btn--accent-two--secondary"
						onClick={onTrack.bind(null, 'login')}>
						Log In
					</Link>
					<Link
						to={`?modal=signup&next=${location.pathname}`}
						rel="nofollow"
						className="btn btn--accept"
						onClick={onTrack.bind(null, 'signup')}>
						{SIGNUP_BUTTON}
					</Link>
				</Fragment>
			)}
		</div>
	)
}

const HeaderControlSmall = ({ user, onLogout, onSignup, onAnchorChange, loadStart, loggingInUser, location }) => {
	const { pathname } = location
	const onAddShow = () => {
		onAnchorChange()
		track('cta', {
			action: 'addshow',
			source: 'header'
		})
	}

	const onTrack = (action) => {
		track('cta', {
			action,
			source: 'header'
		})
	}

	return (
		<div className="header-control">
			<div onClick={onAnchorChange}>
				<IconClose className="icon-close" />
			</div>

			{user ? (
				<nav className="header-menu">
					<ul className="dropdown-menu">
						<li>
							<Link to={`/profile/${user.id}/following`} onClick={onAnchorChange}>
								<div className="typography-subheadline" style={{ fontWeight: 900 }}>{user.firstName}</div>
								<div>View Profile</div>
							</Link>
						</li>
						<li className="divider"></li>
						<li><Link to="/" onClick={onAnchorChange} className={isHome(pathname) ? 'active' : ''}>Home</Link></li>
						<li>
							<NavLink
								to="/add/1"
								onClick={onAddShow}
								className={pathname.indexOf('/add/') >= 0 ? 'active' : ''}
								activeClassName="active">
								<IconPlus />
								Add Show
							</NavLink>
						</li>
						<li><NavLink to="/about" onClick={onAnchorChange} activeClassName="active">About Us</NavLink></li>
						<li className="divider"></li>
						<ul className="dropdown-footer">
							<li><NavLink to="/settings" onClick={onAnchorChange} activeClassName="active">Settings</NavLink></li>
							<li><a href="https://forms.gle/YwHhRfgong94bqZS6" title="Submit News" target="_blank" onClick={onAnchorChange}>Submit News</a></li>
							<li><a href="https://radplaid.freshdesk.com/" target="_blank">Help</a></li>
							<li><a href="/logout" onClick={onLogout}>Sign Out</a></li>
						</ul>
					</ul>
				</nav>
			) : (
				<nav className="header-menu">
					<ul className="dropdown-menu">
						<li style={{ padding: '0.4em 0.8em' }}>
							<Link
								to={`?modal=signup&next=${location.pathname}`}
								rel="nofollow"
								className="btn btn--accept widthfull"
								onClick={onTrack.bind(null, 'signup')}>
								{SIGNUP_BUTTON}
							</Link>
						</li>
						<li style={{ padding: '0.4em 0.8em' }}>
							<Link
								to={`?modal=login&next=${location.pathname}`}
								rel="nofollow"
								className="btn btn--accent-two--secondary widthfull"
								onClick={onTrack.bind(null, 'login')}>
								Log In
							</Link>
						</li>
						<li className="divider"></li>
						<li><Link to="/" onClick={onAnchorChange} className={isHome(pathname) ? 'active' : ''}>Home</Link></li>
						<li>
							<Link
								to="/add/1"
								onClick={onAddShow}>
								<IconPlus />
								Add Show
							</Link>
						</li>
						<li><NavLink to="/about" onClick={onAnchorChange} activeClassName="active">About Us</NavLink></li>
						<li><a href="https://forms.gle/YwHhRfgong94bqZS6" title="Submit News" target="_blank" onClick={onAnchorChange}>Submit News</a></li>
						<li><a href="https://radplaid.freshdesk.com/" target="_blank" onClick={onAnchorChange}>Help</a></li>
					</ul>
				</nav>
			)}
		</div>
	)
}

class Control extends Component {
	static propTypes = {
		user: PropTypes.object,
		viewportName: PropTypes.string,
		location: PropTypes.object,
		onLogout: PropTypes.func
	}

	onLogout = (evt) => {
		evt.preventDefault()
		evt.stopPropagation()

		this.props.onLogout()
		this.props.history.push('/')

		if (typeof window !== 'undefined') {
			window.scrollTo(0, 0)
		}
	}

	render() {
		let _props = omit(this.props, 'onLogout')
		let { user, viewportName } = this.props

		return (viewportName === 'small' ? (
				<HeaderControlSmall onLogout={this.onLogout} {..._props} />
			) : (
				<HeaderControl onLogout={this.onLogout} {..._props} />
			)
		)
	}
}

export default Control
