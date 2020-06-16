import ShowActions from './../redux/actions/shows.jsx'
import PlayerActions from './../redux/actions/player.jsx'
import * as AppActions from './../redux/actions/app.jsx'
import { ARTWORK_FALLBACK, META_TITLE } from './../constants.jsx'

import moment from 'moment'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import union from 'lodash/union'
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { isMobile } from './../helpers/device-detect'
import ReactHtmlParser from 'react-html-parser'
import ReactTooltip from 'react-tooltip'
import anchorme from 'anchorme'
import URI from 'urijs'

import { Loader } from './../common/loader.jsx'
import HeadMeta from './../common/headmeta.jsx'
import PartnerAd from './../common/ads/partner.jsx'
import TicketMaster from './../common/ads/ticketmaster.jsx'
import ShowControl from './components/showcontrol.jsx'
import Marketing from './../home/components/marketing.jsx'
import AppDownload from './../home/components/app-download.jsx'
import Footer from './../common/footer.jsx'
import ShowMeta from './components/showmeta.jsx'
import ShowAdmin from './components/admin/index.jsx'
import ShowArtwork, { LineupAsArtwork } from './components/showartwork.jsx'
import MarketingSignupSimple from './components/marketingsignup-simple-lazy.jsx'
import ShowLineup from './components/showlineup-lazy.jsx'
import ShowSimilar from './components/showsimilar.jsx'
import ShowReasonsYouCare from './components/reasonsyoucare.jsx'
import ShowShare from './components/showshare.jsx'
import ElementEngagement from './../common/utils/element-engagement.jsx'
import ShowOrganizer, { Avatar } from './components/showorganizer.jsx'
import Venue from './components/venue.jsx'
import Tags from './components/showtags.jsx'
import { requestPublic } from './../helpers/request.jsx'
import { track } from './../helpers/analytics.jsx'

import {
	distance,
	formatTitleFromLineup,
	stripHtml,
	verifyOwner,
	cleanDescription,
	existsWithKey
} from './../helpers'

import {
	IconPlay,
	IconPause,
	IconChevron,
	IconLink,
	IconNotificationActive,
} from './../common/icons.jsx'

class ShowInfo extends Component {
	state = {
		isExpanded: false
	}

	toggleExpand = (evt) => {
		evt.preventDefault()
		this.setState({ isExpanded: !this.state.isExpanded })
	}

	render() {
		const LIMIT = 180
		const { isExpanded } = this.state
		const { description } = this.props
		const ExpandComponent = ({ isExpanded }) => (
			<a
				href="#"
				onClick={this.toggleExpand}
				style={{ marginLeft: '1rem' }}
				className="text-center text-nobreak">
				{isExpanded ? 'Show less' : 'Show more'}
				<IconChevron
					size="small"
					className="fill-secondary inlineblock" />
			</a>
		)

		let preview = stripHtml(description || '')

		return (description ? (
			<div className="showdetail-item typography--formatted">
				{(preview.length > LIMIT) ? (
					<Fragment>
						{isExpanded ? (
							<Fragment>
								{ReactHtmlParser(description)}
								<ExpandComponent {...{ isExpanded }} />
							</Fragment>
						) : (
							<p>
								<span style={{ marginRight: '0.6rem' }}>{preview.slice(0, LIMIT)}...</span>
								<ExpandComponent {...{ isExpanded }} />
							</p>
						)}
					</Fragment>
				) : ReactHtmlParser(description)}
			</div>
		) : (
			<Fragment />
		))
	}
}

class Header extends Component {
	shouldComponentUpdate(nextProps) {
		return (
			nextProps.id !== this.props.id
		)
	}

	render() {
		let { id, title, lineup, date, description, artwork, slug, viewportName } = this.props
		let formattedDate = date ? moment(date).format('MMMM D, YYYY') : ''
		let socialTitle = title || ''
		let metaTitle = title || ''
		let metaDescription

		if (lineup && !metaTitle) {
			metaTitle = socialTitle = formatTitleFromLineup(lineup)
		}

		if (description) {
			metaDescription = `${description.substr(0, 150).replace(/\r?\n|\r/g, ' ')}${(description.length > 147) ? '...' : ''}`
		}

		if (metaTitle) {
			//
			// 55 is recommended for a header title – Google SEO
			// 4 is for `... `
			// 12 if for ` | Rad Plaid`
			//
			if (metaTitle.length + formattedDate.length > 71) {
				let remainder = (metaTitle.length + formattedDate.length - 71)
				metaTitle = `${metaTitle.substr(0, metaTitle.length - remainder)}... ${formattedDate}`
			}
			else {
				metaTitle = `${metaTitle}`
				metaTitle += `, ${formattedDate}`
			}

			metaTitle += ` | Rad Plaid`
			socialTitle += ` | Rad Plaid`
		}
		else {
			metaTitle = 'Unable to find this show'
			socialTitle = META_TITLE
		}

		return (
			<HeadMeta
				title={metaTitle}
				appUrl={`radplaid://s/${slug}`}
				canonicalUrl={`${process.env.BASE_CLIENT_URL}/shows/${slug}`}
				socialTitle={socialTitle}
				description={metaDescription}
				artwork={artwork} />
		)
	}
}

const EventUrlMetaData = ({ showId, data }) => {
	return (
		<a
			href={data.url}
			target="_blank"
			rel="nofollow"
			className="bubble bubble-copy show-metadata"
			onClick={() => {
				track('show', {
					action: 'event_url',
					show_id: showId
				})
			}}>

			{data.image ? (
				<div className="show-metadata-image" style={{ backgroundImage: `url(${data.image})` }} />
			) : (
				<IconLink className="show-metadata-icon icon--large" />
			)}

			<div className="show-metadata-body">
				<h4 className="typography-tiny-headline text-ellipsis">{data.title ? `WEBSITE: ${data.title}` : 'WEBSITE'}</h4>
				{data.description && (
					<div className="typography-tiny text-ellipsis">{`${data.description.substr(0, 100)}${data.description.length > 100 ? '...' : ''}`}</div>
				)}
				<div className="typography-tiny text-ellipsis">{data.display_url || data.url}</div>
			</div>
			<IconChevron className="show-metadata-chevron" />
		</a>
	)
}

class Shows extends Component {
	static propTypes = {
		viewportName: PropTypes.string,
		user: PropTypes.object,
		activeShow: PropTypes.object,
		currentTrack: PropTypes.object,
		history: PropTypes.object,
		isPlaying: PropTypes.bool,
		setNotification: PropTypes.func,
		clearNotifications: PropTypes.func,
		onPlay: PropTypes.func,
		deleteShow: PropTypes.func
	}

	constructor(props) {
		super(props)

		this.state = {
			backgroundColor: '#1e4687'
		}
	}

	componentWillMount() {
		this.setCurrentShow()
	}

	componentWillUnmount() {
		this.props.clearNotifications()
	}

	componentWillReceiveProps(nextProps) {
		const { match } = nextProps
		const { slug } = match.params
		const { activeShow = {} } = this.props
		const show_id = activeShow ? activeShow.id : null

		if (nextProps.deletedShowId === show_id) {
			return this.props.history.push(`/`)
		}

		if (nextProps.activeShow &&
			nextProps.activeShow.event_url &&
			!nextProps.activeShow.event_url_metadata) {
			this.props.fetchEventUrlMetadata()
		}

		if (this.props.match.params.slug !== slug) {
			this.setCurrentShow(nextProps)
		}
	}

	componentDidMount() {
		if (typeof window === 'undefined') {
			return
		}

		const { activeShow, match } = this.props
		const { params } = match

		if (activeShow && activeShow.slug === params.slug) {
			this.props.fetchReasonsYouCare()
			this.props.fetchSimilar()
		}

		requestAnimationFrame(() => window.scrollTo(0, 0))
	}

	componentDidUpdate(prevProps, prevState) {
		const hasActiveShow = (isEmpty(prevProps.activeShow) && !isEmpty(this.props.activeShow))
		const { params } = this.props.match

		if (hasActiveShow && this.props.activeShow.slug === params.slug) {
			this.props.fetchReasonsYouCare()
			this.props.fetchSimilar()
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			!isEqual(nextProps.activeShow, this.props.activeShow) ||
			!isEqual(nextProps.similarShows, this.props.similarShows) ||
			!isEqual(nextProps.progress, this.props.progress) ||
			nextProps.match.params.slug !== this.props.match.params.slug ||
			nextState.backgroundColor !== this.state.backgroundColor ||
			nextProps.deletedShowId !== this.props.deletedShowId ||
			nextProps.viewportName !== this.props.viewportName ||
			nextProps.isPlaying !== this.props.isPlaying ||
			nextProps.user !== this.props.user
		)
	}

	setCurrentShow = (nextProps) => {
		let { shows, activeShow, match } = nextProps || this.props
		let { params } = match

		if (activeShow && activeShow.slug === '404') {
			this.props.history.replace(`/404`)

			track('show', {
				action: 'view_not_found',
				show_id: params.slug
			})

			return
		}

		if ((!activeShow && params.slug) || params.slug !== activeShow.slug) {
			if (typeof window !== 'undefined') {
				requestAnimationFrame(() => {
					window.scrollTo(0, 0)
				})
			}

			this.props.fetchActiveShow(params.slug)

			track('show', {
				action: 'view',
				show_id: params.slug
			})
		}
	}

	clearCache = (slug, action) => {
		const { activeShow } = this.props

		if (activeShow) {
			requestPublic({ path: `/clear-cache/${activeShow.slug}` })
		}
	}

	onClaim = () => {
		let { activeShow, location } = this.props
		let { id, slug, title } = activeShow

		this.props.setClaim('show', { id, slug, title })
		this.props.history.push(`${location.pathname}?modal=claim`)
	}

	// onAction = ({ target }) => {
	// 	let { action } = target.dataset
	// 	let { activeShow } = this.props

	// 	target.classList.toggle('btn--active')

	// 	if (target.classList.contains('btn--active')) {
	// 		track('action:show', {
	// 			show_id: activeShow.slug,
	// 			action: action
	// 		})
	// 	}

	// 	this.props.showAction(activeShow.slug, action)
	// }

	render() {
		let { isAdminVisible, backgroundColor } = this.state
		let {
			user,
			userLocation,
			session,
			progress,
			progressName,
			activeShow,
			viewportName,
			setNotification,
			clearNotifications,
			currentTrack,
			history,
			isPlaying,
			isBrowser,
			similarShows = {},
			match,
			onPlay,
		} = this.props

		if (!activeShow) {
			return (
				<div id="show" style={{ padding: '8rem 0' }}>
					<Loader />
				</div>
			)
		}

		let {
			id,
			slug,
			artwork,
			date,
			title,
			byline,
			lineup,
			age,
			organizer,
			description,
			venue,
			venue_name,
			donation_url,
			donation_source,
			ticket_url,
			ticket_source,
			ticket_affiliate,
			ticket_giveaway,
			event_url,
			event_url_metadata,
			livestream_url,
			livestream_display_url,
			livestream_source,
			advance_price,
			door_price,
			following,
			following_users = [],
			shared_count = 0,
			reasons,
			tags,
		} = activeShow

		const { featured, genre, owner = [] } = similarShows
		const bySimilar = union(featured || [], genre || [])
		const isOutOfTown = (
			venue &&
			userLocation &&
			Array.isArray(userLocation.coords) &&
			distance(userLocation.coords, [ venue.lat, venue.lng ]) > 25 // 25 miles
		)

		let user_id = user ? user.id : null
		let isAdmin = (user && Array.isArray(user.role) && user.role.indexOf('admin') >= 0)
		let organizer_id = organizer ? organizer.id : null
		let isSmall = (viewportName === 'small')
		let isMedium = (viewportName === 'medium')
		let artworkHeight = (isMobile || isSmall) ? 200 : isMedium ? 300 : 400

		ticket_source = ticket_source || new URI(ticket_url || '').domain()

		if (description) {
			description = anchorme(description, {
				truncate: 40
			})
		}

		return (activeShow && activeShow.slug === match.params.slug) ? (
			<Fragment>

			{(verifyOwner(user, activeShow) || isAdmin) && (
				<ShowAdmin isVisible={isAdminVisible} />
			)}

			<div id="show">

				{!isEmpty(activeShow) && (
					<Header {...activeShow} />
				)}

				<div className="show-hero">
					{artwork ? (
						<ShowArtwork
							crossOrigin="anonymous"
							width={typeof window !== 'undefined' ? Math.min(window.innerWidth, 1000) : 'auto'}
							height={artworkHeight}
							path={ artwork ? artwork : ARTWORK_FALLBACK } />
					) : (
						<LineupAsArtwork {...{ lineup }} />
					)}
				</div>

				{/**
				  * SHOW BODY
				  */}

				{!isEmpty(activeShow) && (
					<div className="show-header relative grid" style={{ zIndex: 2 }}>
						<div className="row">
							<div className={`col col-6-of-12 col-medium-8-of-12 col-small-12-of-12 center`}>

								<div className="bubble">
									<ShowReasonsYouCare
										className="show-reasons show-reasons--center"
										user={user}
										{...activeShow} />

									<div className="bubble-copy">
										<div className="showdetail-item text-center">
											<ShowMeta
												age={age}
												viewportName={viewportName}
												date={date} />

											{byline && (
												<React.Fragment>
													<ReactTooltip id={`byline-${slug}`} effect="solid">
														<span className="tooltip-copy">Presented by</span>
													</ReactTooltip>
													<h3
														data-tip data-for={`byline-${slug}`}
														className="show-byline typography-small-headline text-ellipsis">
														{byline}
													</h3>
												</React.Fragment>
											)}

											{title ? (
												<h2 className="show-title typography-hero-headline typography-gradient">{title}</h2>
											) : lineup && (
												<h2 className="show-title typography-hero-headline typography-gradient">{formatTitleFromLineup(lineup)}</h2>
											)}

											<ShowControl
												type="full"
												user={user}
												date={date}
												showId={slug}
												livestreamSource={livestream_source}
												following={following}
												followingUsers={following_users}
												sharedCount={shared_count}
												donationUrl={donation_url}
												donationSource={donation_source}
												ticketUrl={ticket_url}
												ticketSource={ticket_source}
												ticketAffiliate={ticket_affiliate}
												ticketGiveaway={ticket_giveaway}
												livestreamUrl={livestream_url}
												livestreamDisplayUrl={livestream_display_url}
												advancePrice={advance_price}
												doorPrice={door_price} />
										</div>
									</div>
								</div>

								{(isBrowser && !user) && (
									<div className="showdetail-item">
										<div className="marketingsignup-simple">
											<div className="typography-body-headline color-white">Get the Mobile App</div>
											<AppDownload theme="light" size="small" />
										</div>
									</div>
								)}

								{process.browser && (
									<div className="showdetail-item relative">
										<ShowLineup id={slug} lineup={lineup} />
									</div>
								)}
							</div>
						</div>
					</div>
				)}

				<Venue
					date={date}
					isOutOfTown={isOutOfTown}
					className="showdetail-item"
					venue={venue} />

				{!isEmpty(activeShow) && (
					<Fragment>
						<div className="grid show-info">
							<div className="row showdetail-item" style={{ paddingBottom: '4rem' }}>
								<div className="col col-6-of-12 col-medium-8-of-12 col-small-12-of-12 center">

									<ShowInfo {...{ description }} />

									{event_url_metadata && (
										<div className="showdetail-item">
											<EventUrlMetaData data={event_url_metadata} showId={slug} />
										</div>
									)}

									<div className="showdetail-item">
										<ElementEngagement offset={0.2}>
											<div id="share">
												<ShowShare
													user={user}
													show={activeShow}
													headline="Tell Your Friends"
													setNotification={setNotification}
													clearNotifications={clearNotifications} />
											</div>
										</ElementEngagement>
									</div>

									{activeShow.featured && (
										<div className="showdetail-item">
											<div className="typography-body-headline text-uppercase color-primary" style={{ paddingBottom: '1rem' }}>
												Businesses for Local Music
											</div>
											<PartnerAd
												track={track}
												image="https://res.cloudinary.com/radplaid/image/upload/v1565358398/logos/cbd-color.png"
												title="Coffee By Design"
												description="Coffee By Design is a craft-roasted coffee purveyor from Portland, Maine. Coffees that taste great – and you can feel good about buying."
												url="https://www.coffeebydesign.com/"
												displayUrl="coffeebydesign.com" />
										</div>
									)}
								</div>
							</div>
						</div>

						{((genre || []).length > 0 || owner.length > 0) ? (
							<div className="showdetail-item">
								<div className="grid show-info">
									{((genre || []).length > 0) && (
										<div className="row showdetail-item show-similar">
											<div className="col col-6-of-12 col-medium-8-of-12 col-small-12-of-12 center" style={{ marginBottom: `${bySimilar.length > 3 ? '-2rem' : '0.6rem'}` }}>
												<h3
													className="bubble-subheadline color-primary"
													style={{ borderBottom: 'none', padding: 0 }}>
													More shows like this ({bySimilar.length})
												</h3>
											</div>
											<div className="col col-12-of-12">
												<ShowSimilar
													user={user}
													onAction={this.clearCache}
													titleClass="col col-6-of-12 col-medium-8-of-12 col-small-12-of-12 center"
													shows={bySimilar} />
											</div>
										</div>
									)}

									{(owner.length > 0 && organizer) && (
										<div className="row show-similar">
											<div className="col col-6-of-12 col-medium-8-of-12 col-small-12-of-12 center" style={{ marginBottom: `${owner.length > 3 ? '-2rem' : '0.6rem'}` }}>
												<h3
													className="bubble-subheadline color-primary text-ellipsis"
													style={{ marginRight: '6rem', padding: 0, borderBottom: 'none' }}>
													More from {organizer.firstName} ({owner.length})
												</h3>
											</div>
											<div className="col col-12-of-12">
												<ShowSimilar
													user={user}
													onAction={this.clearCache}
													titleClass="col col-6-of-12 col-medium-8-of-12 col-small-12-of-12 center"
													shows={owner} />
											</div>
										</div>
									)}
								</div>
							</div>
						) : (progress.indexOf('fetch-similar') >= 0) && (
							<div className="showdetail-item">
								<Loader />
							</div>
						)}

						<div className="grid show-info">
							<div className="row">
								<div className="col col-6-of-12 col-medium-8-of-12 col-small-12-of-12 center">
									{(organizer && user && user.id !== organizer.id && organizer.firstName === 'Rad Plaid') ? (
										<div className="text-center showdetail-item">
											Is this your event? <div className="btn btn--accept btn--small" style={{ marginLeft: '0.4rem' }} onClick={this.onClaim}>Claim</div>
										</div>
									) : (
										<div className="showdetail-item">
											<ShowOrganizer user={organizer} />
										</div>
									)}

									{/*Ads*/}
									<TicketMaster
										ticketSource={ticket_source}
										viewportName={viewportName} />
								</div>
							</div>
						</div>
					</Fragment>
				)}
			</div>
			</Fragment>
		) : (progress.indexOf('activeshow') < 0) && (
			<div id="show" style={{ padding: '8rem 0' }}>
				<Loader />
			</div>
		)
	}
}

Shows.serverFetch = (pathname, query = {}) => {
	let showId = pathname.replace(/\/shows\/|\/admin.{0,}|\?.*/g, '')
	query.recache = !!(pathname.indexOf('/admin') >= 0)
	return ShowActions.apiFetchShowById(showId, query)
}

const mapStateToProps = ({ app, shows, player, user }) => ({
	session: app.session,
	progress: app.progress,
	viewportName: app.viewportName,
	isBrowser: app.isBrowser,
	userLocation: app.userLocation,

	user: user.user,

	shows: shows.shows,
	activeShow: shows.activeShow,
	similarShows: shows.similarShows,
	deletedShowId: shows.deletedShowId,

	playlist: player.playlist,
	isPlaying: player.isPlaying,
	currentTrack: player.currentTrack,
})

const mapDispatchToProps = dispatch => {
	return {
		fetchActiveShow: (showId) => {
			dispatch(ShowActions.apiFetchShowById(showId))
		},

		fetchReasonsYouCare: () => {
			dispatch(ShowActions.apiFetchReasonsYouCare())
		},

		fetchSimilar: () => {
			dispatch(ShowActions.apiFetchSimilar())
		},

		fetchEventUrlMetadata: () => {
			dispatch(ShowActions.apiFetchEventUrlMetadata())
		},

		deleteShow: (showId) => {
			dispatch(ShowActions.apiDeleteShow(showId))
		},

		showAction(id, action = 'follow') {
			dispatch(ShowActions.apiShowAction(id, action))
		},

		onChangeActiveShow: (activeShow) => {
			dispatch(ShowActions.setActiveShow(activeShow))
		},

		onChangePlaylist: (lineup) => {
			dispatch(PlayerActions.setPlaylist(lineup))
		},

		onPlay: (state) => {
			dispatch(PlayerActions.play(state))
		},

		onPause: (state) => {
			dispatch(PlayerActions.pause(state))
		},

		playTrackFromLineup: (lineup) => {
			dispatch(PlayerActions.playTrackFromLineup(lineup))
		},

		setClaim: (type, show) => {
			dispatch(AppActions.setClaim(type, show))
		},

		setNotification: (data) => {
			dispatch(AppActions.setNotification(data))
		},

		clearNotifications: () => {
			dispatch(AppActions.clearNotifications())
		},

		resetSearch: () => {
			dispatch(AppActions.resetSearch())
		},
	}
}

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(Shows)
)
