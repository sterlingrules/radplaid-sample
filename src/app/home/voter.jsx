import clone from 'lodash/clone'
import isEqual from 'lodash/isEqual'
import isObject from 'lodash/isObject'
import isNull from 'lodash/isNull'
import groupBy from 'lodash/groupBy'
import flatMap from 'lodash/flatMap'
import reject from 'lodash/reject'
import omit from 'lodash/omit'
import pull from 'lodash/pull'
import keys from 'lodash/keys'
import find from 'lodash/find'
import uniq from 'lodash/uniq'

import URI from 'urijs'
import moment from 'moment'
import ReactPlayer from 'react-player'
import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import Countdown from 'react-countdown-now'
import { withRouter, Link } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { isMobile } from './../helpers/device-detect.js'
import { track } from './../helpers/analytics.jsx'
import VoterActions from './../redux/actions/voter.jsx'
import * as AppActions from './../redux/actions/app.jsx'
import { requestOnce, requestPublic } from './../helpers/request.jsx'
import ShowControl from './../shows/components/showcontrol.jsx'
import ShareButton from './../common/buttons/share-button.jsx'
import ViewableMonitor from './../common/utils/viewable-monitor.jsx'
import Carousel from './../common/carousel.jsx'
import { Loader } from './../common/loader.jsx'
import { IconChevronLeft, IconChevron } from './../common/icons.jsx'
import HeadMeta from './../common/headmeta.jsx'
import { toTitleCase } from './../helpers'

import {
	TwitterButton,
	FacebookButton,
	MessengerButton,
	MailButton
} from './../common/share.jsx'

const IS_DAYOF = (moment().isAfter(moment([ 2020, 0, 23 ]).hour(17)))
const EVENT_NAME = IS_DAYOF ? 'mvp-dayof' : 'mvp'
const getSharePath = (username, slug, source, medium) => {
	let uri = new URI(`${process.env.BASE_CLIENT_URL}/${slug}`)

	if (username) {
		uri.search({ ref: username })
	}

	return uri.addSearch({
		utm_source: source,
		utm_medium: medium,
		utm_campaign: 'share'
	})
}

const options = {
	perView: 1,
	keyboard: false,
	peek: {
		before: 0,
		after: 0,
	},
	breakpoints: {
		767: {
			perView: 1,
			peek: {
				before: 0,
				after: 32,
			},
		},
	},
}

const DefaultHeaderMeta = () => (
	<HeadMeta
		title="Vote for your favorite music videos for 2020 | Music Video Portland III"
		description="Maine's first, best and ONLY music video awards show"
		canonicalUrl={`${process.env.BASE_CLIENT_URL}/vote`} />
)

const countdownRenderer = ({ days, hours, minutes, seconds, completed }) => (
	<div className="text-center" style={{ marginTop: '1rem' }}>
		<div
			className="typography-headline color-accent-two"
			style={{ margin: '2rem 0 1rem' }}>
			You've already voted in the last 24 hours.
		</div>

		<div className="countdown countdown--small">
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
	</div>
)

const VoterWelcome = ({ user, isLoading, onStart, return_time }) => {
	let headerEl = null
	let nextPath = (typeof window !== 'undefined') ? window.location.pathname : '/vote'

	return (
		<div className="modal voter-confirm">
			<div className="modal-content voter-confirm-content">
				<div className="modal-body">
					<h2 ref={node => headerEl = node} className="typography-body-headline">Hot Trash: Portland & Rad Plaid present</h2>
					<ReactPlayer
						url="https://www.youtube.com/watch?v=mHqJ5Zxibm8"
						width="100%"
						height={(headerEl && headerEl.offsetWidth) ? Math.round(headerEl.offsetWidth * 0.5625) : 222}
						style={{
							margin: '1rem auto',
							maxWidth: 640,
							backgroundColor: '#000',
						}} />

					{isLoading ? (
						<div className="relative" style={{ padding: '2rem 0' }}>
							<Loader />
						</div>
					) : !user ? (
						<Fragment>
							<div className="typography-hero-subheadline" style={{ marginBottom: '1rem' }}>Please, log in to vote.</div>
							<div className="flex">
								<Link to={`?modal=login&next=${nextPath}`} className="btn btn--accept btn--knockout btn--hero widthfull" style={{ marginRight: '0.4rem' }}>Log In</Link>
								<Link to={`?modal=signup&next=${nextPath}`} className="btn btn--accept btn--hero widthfull" style={{ marginLeft: '0.4rem' }}>Sign Up Free</Link>
							</div>
						</Fragment>
					) : return_time ? (
						<Countdown
							date={moment(return_time).toDate()}
							renderer={countdownRenderer} />
					) : (
						<Fragment>
							<p className="typography-hero-body">
								{IS_DAYOF ? (
									<span>Maine's BEST music videos of 2019 await. Please vote for your favorite.</span>
								) : (
									<span>Maine's BEST music videos of 2019 await. Please vote for your favorite in each category. You can vote once a day, so vote early and vote often!</span>
								)}
							</p>
							{!IS_DAYOF && (
								<p className="typography-hero-body">
									We’ll reveal the winners at the <a href="https://www.eventbrite.com/e/80050572417?ref=radplaid" target="_blank" className="link">MVP awards show on January 23rd at Bayside Bowl.</a>
								</p>
							)}
							<br />
							<div
								className="btn btn--hero btn--accept btn--round widthfull"
								onClick={onStart}>
								Start Voting
							</div>
						</Fragment>
					)}
					<br />
					<br />

					<div className="mvp-sponsors">
						<figure className="mvp-sponsor mvp-sponsor-cbd" alt="Coffee By Design" />
						<figure className="mvp-sponsor mvp-sponsor-baysidebowl" alt="Bayside Bowl" />
					</div>
				</div>
			</div>
		</div>
	)
}

const VoterShare = ({ show, slug, title, username, setNotification, onAction }) => {
	let copyEl = null
	const onCopy = () => {
		track('share', {
			action: 'copy',
			source: 'vote',
			label: 'vote'
		})

		setNotification({
			status: 'info',
			message: 'MVP Vote link copied to clipboard'
		})

		if (copyEl) {
			copyEl.blur()
		}
	}

	return (
		<div className="modal voter-confirm">
			<div className="modal-content voter-confirm-content">
				<div className="modal-body">

					{IS_DAYOF ? (
						<div className="share bubble">
							<div className="bubble-copy">
								<div className="typography-hero-headline text-center">
									Now, enjoy the show!
								</div>
							</div>
						</div>
					) : (
						<div className="share bubble">
							<div className="bubble-copy">
								<div className="share-copy" style={{ marginBottom: '3rem' }}>
									<div className="typography-hero-headline text-center" style={{ marginBottom: '2rem' }}>
										You done!
									</div>
									<p className="text-center typography-hero-body">
										Vote daily to help your favorite artists.
									</p>
									<p className="text-center typography-hero-body">
										Winners will be announced at the Music Video Awards show at Bayside Bowl, January 23rd. Grab your tickets now!
									</p>
								</div>

								{show && (
									<div style={{ marginBottom: '4rem' }}>
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
											onAction={onAction} />
									</div>
								)}

								<div
									className="typography-body-headline text-center text-uppercase"
									style={{ marginBottom: '0.5rem' }}>
									Share with your friends & family
								</div>

								<div className="listitem-action text-right">
									<ul className="list list--flex text-uppercase">
										<li>
											<TwitterButton
												slug="mvp"
												url={getSharePath(username, 'vote', 'vote', 'twitter')}
												title={title}
												username={username}
												source="show"
												btnClass="btn btn--twitter widthfull" />
										</li>

										<li>
											<FacebookButton
												slug="mvp"
												url={getSharePath(username, 'vote', 'vote', 'facebook')}
												username={username}
												source="show"
												btnClass="btn btn--facebook widthfull" />
										</li>

										<li className="hide small-show">
											<MessengerButton
												slug="mvp"
												url={getSharePath(username, 'vote', 'vote', 'messenger')}
												username={username}
												source="show"
												btnClass="btn btn--messenger widthfull" />
										</li>

										<li>
											<MailButton
												slug="mvp"
												url={getSharePath(username, 'vote', 'vote', 'email')}
												title={title}
												username={username}
												source="show"
												btnClass="btn btn--mail widthfull" />
										</li>
									</ul>
								</div>
								<div className="listitem-content show-sharelink">
									<CopyToClipboard
										text={getSharePath(username, 'vote', 'vote', 'radplaid')}
										className="cursor-pointer"
										onCopy={onCopy}>

										<input
											type="text"
											title="Click to Copy"
											ref={node => copyEl = node}
											value={getSharePath(username, 'vote', 'vote', 'radplaid')}
											readOnly />
									</CopyToClipboard>
								</div>
							</div>
						</div>
					)}

				</div>
			</div>
		</div>
	)
}

const VoterConfirm = ({ votes = {}, progress = [], candidates = [], onSubmit, onCancel, onVoteAll }) => {
	const _candidates = flatMap(candidates)

	return (
		<div className="modal voter-confirm">
			<div className="modal-content voter-confirm-content">
				<div className="modal-body">
					<h2 className="typography-headline">Ready to Cast?</h2>
					<br />

					<ul className="list voter-list">
						{keys(votes).map(vote => {
							const candidate = find(_candidates, { id: votes[vote].candidate_id })
							return (candidate && (
								<li key={candidate.id}>
									<strong>Best {toTitleCase(vote)}:</strong> {candidate.title ? `"${candidate.title}" by ${candidate.artist_name}` : candidate.artist_name}
								</li>
							))
						})}
					</ul>
					<br />

					<div
						className={`btn btn--hero ${(progress.indexOf('voting') > 0) ? 'btn--disabled' : 'btn--accept'} widthfull`}
						onClick={onSubmit}>
						Cast Your Votes
					</div>

					{(candidates || []).length > 1 ? (
						<div
							className="btn btn--hero btn--accept btn--knockout widthfull"
							style={{
								marginTop: '0.6rem',
								marginLeft: 0,
							}}
							onClick={onCancel}>
							Change Votes
						</div>
					) : !IS_DAYOF && (
						<div
							className="btn btn--hero btn--accept btn--knockout widthfull"
							style={{
								marginTop: '0.6rem',
								marginLeft: 0,
							}}
							onClick={onVoteAll}>
							Vote All Categories
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

const CategoryFooter = ({ id, title, media_url, artist_name, votes, category, user, onVote }) => (
	<div className="voter-item-footer">
		<div className="voter-item-title">
			<a href={media_url} target="_blank" className="typography-subheadline color-accent-two">{title}</a>
			<div className="typography-body">by {artist_name}</div>
		</div>
		<button
			onClick={() => onVote(id, category)}
			className={`btn btn--hero ${(votes[category] && votes[category].candidate_id === id) ? 'btn--disabled' : 'btn--accept'}`}
			style={{ marginRight: '0.4rem' }}>
			Vote
		</button>
		<ShareButton
			path="/vote"
			slug={id}
			username={user ? user.username : null}
			title={`Vote for "${title}" by ${artist_name}`}
			source="show_item" />
	</div>
)

const Player = ({ id, media_url, media_source, height, isPlaying, onPlay }) => (
	(media_source === 'vimeo') ? (
		<iframe
			src={`https://player.vimeo.com/video/${media_url.replace('https://vimeo.com/', '')}`}
			width="100%"
			height={height}
			frameBorder="0"
			allow="autoplay; fullscreen"
			allowFullScreen
			style={{
				display: 'block',
				maxWidth: 640,
				margin: 'auto auto 0.6rem',
			}}>
		</iframe>
	) : (
		<ReactPlayer
			url={media_url}
			playing={(isPlaying === id)}
			onStart={() => {
				onPlay(id)
			}}
			width="100%"
			height={height}
			style={{
				margin: 'auto',
				marginBottom: '0.6rem',
				maxWidth: 640,
				backgroundColor: '#000',
			}} />
	)
)

const VoterCategory = ({ index = 0, total, isPlaying, user, votes = {}, category, candidates = [], onBack, onSkip, onVote, onPlay }) => {
	if (typeof window === 'undefined') {
		return (<Fragment />)
	}

	const height = (window.innerWidth < 640) ? Math.round(window.innerWidth * 0.5625) : 360
	const voteCount = isObject(votes) ? keys(votes).length : 0

	return (
		<Fragment>
			{candidates.length === 1 ? (
				<HeadMeta
					title={`Vote for \"${candidates[0].title}\" by ${candidates[0].artist_name} | Music Video Portland III`}
					description="Maine's first, best and ONLY music video awards show"
					canonicalUrl={`${process.env.BASE_CLIENT_URL}/vote/${candidates[0].id}`}
					artwork={{
						url: `http://res.cloudinary.com/radplaid/image/upload/f_auto/v1571782525/featured/og-mvp.jpg`,
						secure_url: `https://res.cloudinary.com/radplaid/image/upload/f_auto/v1571782525/featured/og-mvp.jpg`,
						width: '1200',
						height: '630'
					}} />
			) : (
				<DefaultHeaderMeta />
			)}

			{!!(total) && (
				<div className={`voter-header ${category.toLowerCase().replace(/\s|&/ig, '-')}`}>
					<div className="grid">
						<div className="row relative">
							{index > 0 && (
								<div
									className="btn-back center-vertical"
									onClick={onBack}>
									<IconChevronLeft className="icon--large" />
								</div>
							)}

							<h2 className="voter-title text-ellipsis">
								Best {toTitleCase(category)}
								<div className="voter-subtitle">
									{candidates.length} Candidates • {index + 1} / {total} Steps
								</div>
							</h2>

							<button
								className="btn btn--accent-two--secondary center-vertical"
								style={{
									position: 'absolute',
									padding: '0 0.2rem 0 0.6rem',
									right: 0
								}}
								onClick={onSkip}>
								Skip <IconChevron />
							</button>
						</div>
					</div>

					<figure
						className="voter-border"
						style={{ width: `${100 * ((index + 1) / 10)}%` }} />
				</div>
			)}

			{candidates.length > 0 ? (
				candidates.map((c, i) => (
					<div
						key={i}
						className="voter-item">

						{c.media_urls ? (
							<div className="row voter-carousel" style={{ margin: 'auto', maxWidth: 640 }}>
								<Carousel title={c.artist_name} options={options}>
									{c.media_urls.map((media, index) => (
										<div key={index}>
											<Player id={c.id} {...media} isPlaying={isPlaying} onPlay={onPlay} height={height} />
											<CategoryFooter
												{...c}
												{...media}
												id={c.id}
												category={category}
												onVote={onVote}
												votes={votes} />
										</div>
									))}
								</Carousel>
							</div>
						) : c.media_url && (
							<ViewableMonitor minHeight={300}>
								<Player {...c} isPlaying={isPlaying} onPlay={onPlay} height={height} />
								<CategoryFooter
									{...c}
									category={category}
									onVote={onVote}
									votes={votes} />
							</ViewableMonitor>
						)}

					</div>
				))
			) : (
				<div className="text-center">
					<p>We're having trouble loading the Candidates.</p>
					<p>
						Please try <a href="#" className="text-underline" onClick={(evt) => {
							evt.preventDefault()
							window.location.reload()
						}}>refreshing the page.</a>
					</p>
				</div>
			)}
		</Fragment>
	)
}

class Voter extends Component {
	state = {
		started: false,
		finished: false,
		confirm: false,
		categories: [],
		candidates: [],
		activeCategory: '',
		votes: {},
		show: null,
		isPlaying: null,
	}

	constructor(props) {
		super(props)

		this.isVoting = false
	}

	componentWillMount() {
		this._fetchCandidates()
	}

	componentDidMount() {
		if (this.props.match.params.id) {
			this.props.getPermission()
		}

		this.fetchMVP()
	}

	_fetchCandidates = () => {
		const { user, history, location, match, candidates = [], return_time } = this.props
		const { id } = match.params

		if (id) {
			if (candidates.length && isNull(return_time)) {
				this.setCategories()
				this.setState({ started: true })
				return
			}
			else {
				return this.props.fetchById(EVENT_NAME, id)
			}
		}

		this.props.fetchCandidates(EVENT_NAME)
	}

	componentWillReceiveProps(nextProps) {
		const { user, progress, candidates, match, return_time } = nextProps
		const { id } = match.params

		// If just signing in
		if (user && !isEqual(user, this.props.user)) {
			this._fetchCandidates()
		}

		// Setup categories on candidate init
		if (!this.state.categories.length &&
			Array.isArray(candidates) &&
			!isEqual(candidates, this.props.candidates)) {

			this.setCategories(nextProps)

			// Have an id? Let's start the vote
			if (id && !return_time) {
				this.setState({ started: true })
			}
			else if (return_time) {
				this.props.history.push(`/vote${id ? `/${id}` : ''}`)
			}
		}

		if (return_time && return_time !== this.props.return_time) {
			this.setState({ started: false })
			this.props.history.push(`/vote${id ? `/${id}` : ''}`)
		}
	}

	setCategories = (props) => {
		let { candidates = [] } = props || this.props
		let categories = uniq(candidates.map(c => c.category))
			.sort(() => 0.5 - Math.random())

		if (EVENT_NAME === 'mvp') {
			categories = pull(categories, 'performance', 'director')

			if (candidates.length > 1) {
				categories.push('director')
				categories.push('performance')
			}
		}

		candidates = groupBy(candidates, 'category')

		keys(candidates).map(category => {
			candidates[category]
				.sort(() => 0.5 - Math.random())
		})

		this.setState({
			activeCategory: categories[0],
			candidates,
			categories,
		})
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

	onStart = () => {
		this.setState({ started: true })
	}

	onPlay = (candidate_id) => {
		this.setState({ isPlaying: candidate_id })
	}

	onCancel = () => {
		let { activeCategory } = this.state
		let votes = clone(this.state.votes || {})

		votes = omit(votes, activeCategory)

		this.setState({
			confirm: false,
			votes,
		})
	}

	onBack = () => {
		let { categories = [], activeCategory } = this.state
		let index = Math.max(categories.indexOf(activeCategory) - 1, 0)
		let votes = clone(this.state.votes || {})

		votes = omit(votes, categories[index] || activeCategory)

		this.setState({
			confirm: false,
			isPlaying: null,
			activeCategory: categories[index],
			votes,
		})
	}

	onSkip = () => {
		const { categories = [], activeCategory } = this.state
		const votes = clone(this.state.votes || {})
		const index = Math.max(categories.indexOf(activeCategory) + 1, 0)

		this.setState({
			confirm: !(categories[index]),
			isPlaying: null,
			activeCategory: categories[index] || activeCategory,
			votes,
		})
	}

	onVoteAll = () => {
		this.props.history.push(`/vote`)
	}

	onVote = (candidate_id, category) => {
		const { user } = this.props
		const { categories = [] } = this.state
		const votes = clone(this.state.votes || {})
		const index = categories.indexOf(category) + 1

		votes[category] = {
			user_id: user.id,
			candidate_id,
		}

		if (!categories[index]) {
			this.setState({
				votes,
				confirm: true,
				isPlaying: null,
			})
		}
		else if (index) {
			this.setState({
				votes,
				activeCategory: categories[index],
				isPlaying: null,
			})
		}

		window.scrollTo(0, 0)
	}

	onSubmit = () => {
		const { votes } = this.state
		const { loadStart, loadEnd, progress = [] } = this.props
		const categories = keys(votes)

		let data = []

		categories.forEach(c => {
			data.push(votes[c])
		})

		if (this.isVoting) {
			return
		}

		loadStart('app')
		this.isVoting = true

		requestOnce({
			method: 'post',
			path: '/vote',
			data: data,
		})
		.end((err, reply) => {
			loadEnd(null, 'app')

			this.isVoting = false
			this.setState({ finished: true })
		})
	}

	render() {
		const {
			show,
			confirm,
			started,
			finished,
			votes,
			categories,
			candidates,
			activeCategory = '',
			isPlaying
		} = this.state

		const { progress, user, return_time = null, setNotification } = this.props

		return (
			<div id="voter" className={`voter ${confirm ? 'modal-active' : ''}`}>
				<DefaultHeaderMeta />

				<div className="modal voter-confirm">
					<div className="modal-content voter-confirm-content">
						<div className="modal-body">
							<h2 className="typography-body-headline">Hot Trash: Portland & Rad Plaid present</h2>
							<figure className="mvp-title" title="MVP III" />
							<p className="typography-hero-body">
								Voting is now over. Thank you to everyone who participated. We love you and we'll see you again next year!
							</p>
							<p className="typography-hero-body oblique color-copy-secondary">
								Results announced soon.
							</p>
							<a href={`/?location=Portland, ME`} className="btn btn--accept btn--knockout btn--hero widthfull">
								Explore Live Music
							</a>
							<br />
							<br />

							<div className="mvp-sponsors">
								<figure className="mvp-sponsor mvp-sponsor-cbd" alt="Coffee By Design" />
								<figure className="mvp-sponsor mvp-sponsor-baysidebowl" alt="Bayside Bowl" />
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

Voter.serverFetch = (pathname) => {
	let candidateId = pathname.replace(/\/vote\/|\?.*/g, '')
	return VoterActions.fetchById(EVENT_NAME, candidateId)
}

const mapStateToProps = ({ app, user, voter }) => ({
	progress: app.progress,
	candidates: voter.candidates,
	return_time: voter.return_time,
	user: user.user,
})

const mapDispatchToProps = dispatch => {
	return {
		loadClear: () => {
			dispatch(AppActions.loadClear())
		},

		loadStart: (name) => {
			dispatch(AppActions.loadStart(name))
		},

		loadEnd: (name) => {
			dispatch(AppActions.loadEnd(null, name))
		},

		setNotification: (message) => {
			dispatch(AppActions.setNotification(message))
		},

		fetchCandidates: (eventName) => {
			dispatch(VoterActions.fetchCandidates(eventName))
		},

		fetchById: (eventName, candidateId) => {
			dispatch(VoterActions.fetchById(eventName, candidateId))
		},

		getPermission: (eventName) => {
			dispatch(VoterActions.getPermission(eventName))
		},
	}
}

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(Voter)
)
