import clone from 'lodash/clone'
import isEqual from 'lodash/isEqual'
import moment from 'moment'
import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import Countdown from 'react-countdown-now'
import { track } from './../helpers/analytics.jsx'
import { requestPublic } from './../helpers/request.jsx'
import ShowControl from './../shows/components/showcontrol.jsx'
import ViewableMonitor from './../common/utils/viewable-monitor.jsx'
import HeadMeta from './../common/headmeta.jsx'

const VOTE_DATE = '2019-12-01'

const countdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
	if (completed) {
		// Render a completed state
		// return <VotingComponent />
		return <div />
	} else {
		// Render a countdown
		return (
			<div className="text-center">
				<div className="countdown">
					<figure className="countdown-item">
						<div className="countdown-time">{days}</div>
						<figcaption className="countdown-caption">day{days > 1 ? 's' : ''}</figcaption>
					</figure>

					<figure className="countdown-item">
						<div className="countdown-time">{hours}</div>
						<figcaption className="countdown-caption">hour{hours > 1 ? 's' : ''}</figcaption>
					</figure>

					<figure className="countdown-item">
						<div className="countdown-time">{minutes}</div>
						<figcaption className="countdown-caption">minute{minutes > 1 ? 's' : ''}</figcaption>
					</figure>

					<figure className="countdown-item">
						<div className="countdown-time">{seconds}</div>
						<figcaption className="countdown-caption">seconds</figcaption>
					</figure>
				</div>
				<div className="typography-hero-subheadline color-accent-two">left to submit your video</div>
			</div>
		)
	}
}

class MVP extends Component {
	state = {
		show: null
	}

	componentDidMount() {
		if (typeof window === 'undefined') {
			return
		}

		window.scrollTo(0,0)
		this.fetchMVP()
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			!isEqual(nextProps.user, this.props.user) ||
			!isEqual(nextState.show, this.state.show)
		)
	}

	fetchMVP = () => {
		requestPublic({ path: '/shows/music-video-portland-iii-01232020' })
			.end((err, reply) => {
				const show = reply ? reply.body : null
				this.setState({ show })
			})
	}

	onAction = (state) => {
		let user = clone(this.props.user || {})
		let show = clone(this.state.show || {})

		show.following = show.following || []
		show.following_users = show.following_users || []

		if (state === 'following') {
			show.following.push(user)
			show.following_users.push(user.id)
		}
		else {
			show.following = reject(show.following, u => (u.id === user.id))
			show.following_users = reject(show.following_users, id => (id === user.id))
		}

		this.setState({ show })
	}

	_trackSubmit = () => {
		track('visit', {
			action: 'mvp tickets',
			label: 'mvp tickets',
		})
	}

	_trackSubmit = () => {
		track('visit', {
			action: 'mvp learn',
			label: 'mvp learn',
		})
	}

	render() {
		const { show } = this.state

		return (
			<section id="mvp">

				<HeadMeta
					title="Music Video Portland III | Bayside Bowl | January 23, 2020"
					description="Maine's first, best and ONLY music video awards show"
					canonicalUrl={`${process.env.BASE_CLIENT_URL}/mvp`}
					artwork={{
						url: `${process.env.BASE_CLIENT_URL}${process.env.ASSET_URL}/img/mvp/og-mvp.jpg`,
						secure_url: `${process.env.BASE_CLIENT_URL}${process.env.ASSET_URL}/img/mvp/og-mvp.jpg`,
						width: '1200',
						height: '630'
					}} />

				<div id="hero" className={`hero hero-mvp`}>
					<div className="grid">
						<div className="row">
							<div className={`col col-6-of-12 col-medium-8-of-12 col-small-12-of-12 text-center center`}>
								<div className="hero-headline">
									<div className="typography-subheadline">
										Hot Trash: Portland! & Rad Plaid Present
									</div>
									<figure className="typography-hero-headline">
										<figcaption>Music Video Portland III</figcaption>
									</figure>
								</div>

								{/*<p className="hero-copy typography-subheadline">
									Music Video Portland - Maine’s first, best and ONLY music video awards show - is back for another year of music videos, comedy, dance, live music performance, #nopants, and charming crustaceans with a heart of gold!
								</p>*/}

								<p className="hero-copy typography-subheadline">
									January 23, 2020
								</p>

								{/*<div className="hero-action">
									<a
										href="https://www.musicvideoportland.com/submit"
										style={{ marginLeft: 0 }}
										rel="nofollow"
										className="btn btn--accent-two--secondary btn--hero"
										onClick={this._trackSubmit}>
										Submit Video
									</a>
									<a
										href="https://www.musicvideoportland.com/home"
										style={{ marginBottom: 0, textShadow: 'none' }}
										className="btn btn--hero"
										onClick={this._trackLearn}>
										Learn More
									</a>
								</div>*/}
							</div>
						</div>
					</div>
				</div>

				<div className="marketing-content">
					<div className="grid">
						<div className="row col col-8-of-12 col-small-12-of-12 text-center center">
							{show && (
								<div style={{ marginBottom: '2rem' }}>
									<ShowControl
										{...show}
										showId={show.slug}
										followers={show.following}
										followingUsers={show.following_users}
										sharedCount={show.shared_count}
										ticketUrl={show.ticket_url}
										ticketAffiliate={show.ticket_affiliate}
										advancePrice={show.advance_price}
										doorPrice={show.door_price}
										ticketGiveaway={false}
										onAction={this.onAction} />
								</div>
							)}

							<p className="typography-hero-body">
								<Link to="/shows/music-video-portland-iii-01232020">Music Video Portland</Link> — Maine's first, best and ONLY music video awards show — is back for another year of music videos, comedy, dance, live music performance, #nopants, and charming crustaceans with a heart of gold!
							</p>
						</div>
					</div>
				</div>

				{/*<div id="hero" className={`hero hero-mvp`} style={{ padding: '48px 0' }}>
					<div className="grid">
						<div className="row">
							<div className={`col col-6-of-12 col-medium-8-of-12 col-small-12-of-12 text-center center`}>
								<div className="hero-action">
									<a
										href="https://www.musicvideoportland.com/submit"
										style={{ marginLeft: 0 }}
										rel="nofollow"
										className="btn btn--accent-two--secondary btn--hero"
										onClick={this._trackSubmit}>
										Submit Video
									</a>
									<a
										href="https://www.musicvideoportland.com/home"
										style={{ marginBottom: 0, textShadow: 'none' }}
										className="btn btn--hero"
										onClick={this._trackLearn}>
										Learn More
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="marketing-content text-center">
					<Countdown
						date={moment(VOTE_DATE).toDate()}
						renderer={countdownRenderer} />
				</div>*/}

				{/*<div id="hero" className={`hero hero-mvp`} style={{ padding: '96px 0 0' }} />*/}

				<ViewableMonitor minHeight={128} className="marketingsignup bg-relationships" style={{ margin: '0 0 1rem' }}>
					<div className="grid text-center">
						<div className="typography-subheadline color-white" style={{ marginBottom: '2rem' }}>Sponsors</div>
					</div>
					<div className="grid text-left">
						<div className="flex">
							<a href="https://www.coffeebydesign.com/" title="Coffee By Design" target="_blank" className="relationship"><img src="/img/mvp/logo-cbd.png" style={{ maxHeight: 240 }} alt="Coffee By Design" /></a>
							<Link to="/" title="Rad Plaid" target="_blank" className="relationship"><img src="/img/mvp/logo-rp.png" style={{ maxHeight: 240 }} alt="Rad Plaid" /></Link>
							<a href="https://baysidebowl.com" title="Bayside Bowl" target="_blank" className="relationship"><img src="/img/mvp/logo-baysidebowl.png" style={{ maxHeight: 240 }} alt="Bayside Bowl" /></a>
						</div>
					</div>
				</ViewableMonitor>

				<div className="marketing-content">
					<div className="grid">
						<div className="row col col-8-of-12 col-small-12-of-12 text-center center">
							<figure className="logo-hottrash"></figure>
							<p className="typography-hero-body">Music Video Portland is a production of <a href="http://hottrashportland.com" target="_blank" className="color-secondary strong underline">HOT TRASH: Portland!</a> and <a href="https://getradplaid.com/" className="color-secondary strong underline">Rad Plaid</a>, with generous love, hard work, creative input and all around support from Will Bradford and Steph Harmon. Love and gratitude to Dave Gutter, Jeff Beam, Spose, Olive, Ian Riley, Cherry Lemonade, and all of our performers and winners.</p>
							<p className="typography-hero-body">XOXO4LYFE.</p>
						</div>
					</div>
				</div>

				{/*<div id="hero" className={`hero hero-mvp`} style={{ marginBottom: -80 }}>
					<div className="grid">
						<div className="row">
							<div className={`col col-6-of-12 col-medium-8-of-12 col-small-12-of-12 text-center center`}>
								<p className="hero-copy typography-hero-body">
									<strong>Artists, the submission window is open! Submit your music videos for consideration for MVP III, taking place on Thursday, January 23 2020 at our new venue Bayside Bowl!</strong>
								</p>

								<div className="hero-action">
									<a
										href="https://www.musicvideoportland.com/submit"
										style={{ marginLeft: 0 }}
										rel="nofollow"
										className="btn btn--accent-two--secondary btn--hero"
										onClick={this._trackSubmit}>
										Submit Video
									</a>
									<a
										href="https://www.musicvideoportland.com/home"
										style={{ marginBottom: 0, textShadow: 'none' }}
										className="btn btn--hero"
										onClick={this._trackLearn}>
										Learn More
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>*/}

				<div id="hero" className={`hero hero-mvp`} style={{ padding: '48px 0', marginBottom: -80 }}>
					<div className="grid">
						<div className="row">
							<div className={`col col-6-of-12 col-medium-8-of-12 col-small-12-of-12 text-center center`}>
								<div className="hero-action">
									<a
										href="https://www.eventbrite.com/e/80050572417?ref=radplaid"
										style={{ marginLeft: 0 }}
										className="btn btn--accent-two--secondary btn--hero"
										onClick={this._trackSubmit}>
										Get Tickets
									</a>
									<Link
										to="/shows/music-video-portland-iii-01232020"
										style={{ marginBottom: 0, textShadow: 'none' }}
										className="btn btn--hero"
										onClick={this._trackLearn}>
										Learn More
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		)
	}
}

const mapStateToProps = ({ app, shows, user, routing }) => ({
	user: user.user,

	isBrowser: app.isBrowser,
	progress: app.progress,
	progressName: app.progressName,
	initialized: app.initialized,
})

const mapDispatchToProps = dispatch => {
	return {
		loadStart: () => {
			dispatch(AppActions.loadStart())
		},

		loadEnd: () => {
			dispatch(AppActions.loadEnd())
		},
	}
}

export default withRouter(React.memo(connect(mapStateToProps, mapDispatchToProps)(MVP)))
