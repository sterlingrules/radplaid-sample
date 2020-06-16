import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, NavLink, Link } from 'react-router-dom'
import moment from 'moment'
import Helmet from 'react-helmet'
import { IconHeart } from './../common/icons.jsx'
import ShowList from './../shows/components/showlist-lazy.jsx'
import UserActions from './../redux/actions/user.jsx'
import ProfileCard from './components/profile-card.jsx'
import ProfileNavigation from './components/profile-navigation.jsx'
import { getAfterDate } from './../helpers'

const getProfileTab = (tab = 'default', isCurrentUserProfile = false) => {
	let tabs = {
		default: {
			label: '',
			action: '',
			emptyCopy: () => <div />
		},
		following: {
			label: 'Following',
			action: 'following',
			emptyCopyComponent: (props) => {
				return (
					<div>
						<IconHeart className="icon--large fill-copy center" />
						<br />
						<h2 className="typography-subheadline">
							{isCurrentUserProfile ? 'Events you follow will display here' : 'No followed events'}
						</h2>
					</div>
				)
			}
		},
		managing: {
			label: isCurrentUserProfile ? 'My Events' : 'Upcoming Events',
			action: 'managing',
			emptyCopyComponent: (props) => {
				return (
					<div>
						<h2 className="typography-subheadline">{isCurrentUserProfile ? 'Events you\'ve added will display here' : 'No upcoming events'}</h2>
						{isCurrentUserProfile && (
							<div>
								<br />
								<Link to="/add/1" className="btn btn--accept btn--hero">Add a new event</Link>
							</div>
						)}
					</div>
				)
			}
		}
	}

	return tabs[tab] ? tabs[tab] : null
}

const getTabFromPath = (pathname = '') => {
	if (pathname.search('/managing') >= 0) {
		return 'managing'
	}
	else if (pathname.search('/following') >= 0) {
		return 'following'
	}

	return null
}

class Profile extends Component {
	static propTypes = {
		user: PropTypes.object,
		profile: PropTypes.object,
		match: PropTypes.object,
		viewportName: PropTypes.string
	}

	constructor(props) {
		super(props)

		this._displayProfile = this._displayProfile.bind(this)
		this._fetchProfile = this._fetchProfile.bind(this)
		this._appendShows = this._appendShows.bind(this)
	}

	componentWillMount() {
		let tab = getTabFromPath(this.props.location.pathname)

		this.props.updateShowList('following')
		this.props.updateShowList('managing')
		this._fetchProfile()
	}

	componentDidMount() {
		this._displayProfile()
	}

	componentWillReceiveProps(nextProps) {
		let { profile, match, location } = nextProps
		let user_id = match.params.id

		if (user_id && profile) {
			if (user_id !== profile.id) {
				this.props.fetchProfile(user_id)
			}
		}
	}

	_fetchProfile(profile_id = null) {
		let { match, user, history, profile } = this.props
		let user_id = user ? user.id : null
		let id = profile_id || match.params.id || user_id
		let tab = getTabFromPath(history.location.pathname)

		if (id && !tab) {
			this.props.history.push(`/profile/${id}/following`)
			return
		}
		else if (id) {
			this.props.fetchProfile(id)
			return
		}

		this.props.history.push('/404')
	}

	_displayProfile() {
		let { match, user, history, profile } = this.props
		let tab = getTabFromPath(history.location.pathname)
		let user_id = match.params.id || user.id

		if (typeof window !== 'undefined') {
			window.scrollTo(0, 0)
		}

		this.props.fetchShowList({
			user_id: user_id,
			action: tab,
			from: moment().format(process.env.DATE_FORMAT)
		})
	}

	_appendShows(callback) {
		let {
			match,
			location,
			progress
		} = this.props

		let { params } = match
		let tab = getTabFromPath(location.pathname)
		let afterKey = `${tab}After`
		let shows = this.props[tab]

		if (progress.length > 0) {
			return
		}

		this.props.fetchShowList({
			user_id: params.id,
			action: tab,
			after: this.props[afterKey]
		})

		callback()
	}

	render() {
		let { user, profile, match, history, viewportName, progress } = this.props
		let { params } = match
		let { location } = history
		let tab = getTabFromPath(location.pathname)
		let id = params.id
		let userId = user ? user.id : null
		let profileId = profile ? profile.id : null
		let isCurrentUserProfile = (profileId === userId)
		let profileTab = getProfileTab(tab, isCurrentUserProfile)
		let title = profileTab ? profileTab.label : ''
		let shows = this.props[tab]

		return (
			<div>
				<Helmet>
					{profile && (
						<title>{profile.firstName || profile.username} | Rad Plaid</title>
					)}

					{profile && (
						<meta property="og:title" content={profile.firstName || profile.username} />
					)}

					<meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
				</Helmet>

				<div id="hero" className="hero hero-profile">
					<div className="hero-content grid">
						<div className="row hero-header">
							<div className="col col-6-of-12 col-small-12-of-12 center relative">
								{title && (
									<div className="show-headline">
										<div className="showlist-title">
											{title ? title : ''}
										</div>
									</div>
								)}

								<span className="hide small-show">
									<ProfileCard
										id={id}
										profile={profile}
										isCurrentUserProfile={isCurrentUserProfile} />
								</span>
							</div>
						</div>
					</div>
				</div>

				<div id="profile">
					<div className="grid">
						<div className="row">
							{viewportName !== 'small' && (
								<ProfileCard
									id={id}
									profile={profile}
									isCurrentUserProfile={isCurrentUserProfile} />
							)}

							<div className="col col-6-of-12 col-small-12-of-12 relative">
								{viewportName === 'small' && (
									<div className="profile-nav-small bubble bubble--nopadding">
										<ProfileNavigation
											isCurrentUserProfile={isCurrentUserProfile}
											profileId={id} />
									</div>
								)}

								<ShowList
									shows={shows || []}
									showsTotal={this.props[`${tab}Total`]}
									after={this.props[`${tab}After`]}
									isEnd={this.props[`${tab}IsEnd`]}
									isLoading={(progress.indexOf(`user:${tab}`) >= 0)}
									onScrollToBottom={this._appendShows}
									emptyCopyComponent={profileTab ? profileTab.emptyCopyComponent : null} />
							</div>

							<div className="col col-3-of-12 small-hide">
								<ProfileNavigation
									isCurrentUserProfile={isCurrentUserProfile}
									profileId={id} />
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = ({ user, app, routing }) => ({
	viewportName: app.viewportName,
	progress: app.progress,

	user: user.user,
	profile: user.profile,

	following: user.following,
	followingTotal: user.followingTotal,
	followingAfter: user.followingAfter,
	followingIsEnd: user.followingIsEnd,

	managing: user.managing,
	managingTotal: user.managingTotal,
	managingAfter: user.managingAfter,
	managingIsEnd: user.managingIsEnd,

	routing: routing
})

const mapDispatchToProps = dispatch => {
	return {
		updateShowList: (action, shows = []) => {
			dispatch(UserActions.updateShowList(action, shows))
		},

		fetchShowList: (query) => {
			dispatch(UserActions.apiFetchShowList(query))
		},

		fetchProfile: (user_id) => {
			dispatch(UserActions.apiFetchProfile(user_id))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
