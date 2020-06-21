import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import union from 'lodash/union'
import omit from 'lodash/omit'
import moment from 'moment'
import ReactTooltip from 'react-tooltip'
import { withRouter, Link } from 'react-router-dom'
import ShowItemCompact from './compact.jsx'
import TrackImpression from './../../../common/utils/track-impression.jsx'
import { ShowItemVenue } from './../showmeta.jsx'
import ShowArtwork, { LineupAsArtwork } from './../showartwork.jsx'
import ShowReasonsYouCare from './../reasonsyoucare.jsx'
import ShowControl from './../showcontrol.jsx'
import ShowItemMoreMenu from './moremenu.jsx'
import Tags from './../showtags.jsx'
import MarketingCopy from './../../../home/components/marketingcopy.jsx'
import { ARTWORK_FALLBACK, DATE_PATHS } from './../../../constants.jsx'
import PlayAllButton from './../../../player/components/playall-button.jsx'
import { IconChevron } from './../../../common/icons.jsx'
import { track } from './../../../helpers/analytics.jsx'

const DateStack = ({ date }) => {
	return (
		<div className="datestack">
			<div className="datestack-bubble">
				<div className="datestack-small">{moment(date).utc().format('ddd')}</div>
				<div className="datestack-large">{moment(date).utc().format('D')}</div>
				<div className="datestack-small">{moment(date).utc().format('MMM')}</div>
			</div>
			<div className="datestack-footer">{moment(date).utc().format('h:mm')}</div>
		</div>
	)
}

class ShowItem extends Component {
	static propTypes = {
		type: PropTypes.string,
		artwork: PropTypes.object,
		className: PropTypes.string,

		id: PropTypes.string,
		index: PropTypes.number,
		slug: PropTypes.string.isRequired,
		venue: PropTypes.object,
		artwork: PropTypes.object,
		organizer: PropTypes.object,
		lineup: PropTypes.array,
		className: PropTypes.string,
		following: PropTypes.array,
		attending: PropTypes.array,
		reason: PropTypes.string,
		tags: PropTypes.array,
		user: PropTypes.object,

		onImageLoad: PropTypes.func
	}

	constructor(props) {
		super(props)

		this.state = {
			firstTrackId: null
		}

		this.isTouchScrolling = false
	}

	componentWillMount() {
		if (typeof window === 'undefined') {
			return
		}

		let lineup = this.props.lineup || []

		for (let i = 0; i < lineup.length; i++) {
			if (lineup[i].preview_url) {
				return this.setState({
					firstTrackId: lineup[i].id
				})
			}
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			!isEqual(nextProps.following_users, this.props.following_users) ||
			!isEqual(nextProps.viewportName, this.props.viewportName) ||
			nextState.firstTrackId !== this.state.firstTrackId
		)
	}

	goToShow = (evt) => {
		const { action } = this.props

		track('visit', {
			action: action || 'show_from_show_item',
			show_id: this.props.slug
		})
	}

	setClaim = () => {
		let { id, slug, title, location, history, user } = this.props

		if (!user) {
			history.push(`${location.pathname}?modal=signup&next=${location.pathname}`)
			return
		}

		this.props.setClaim('show', { id, slug, title })
		this.props.history.push(`${location.pathname}?modal=claim`)
	}

	setReport = ({ label }) => {
		let { id, slug, title, location } = this.props

		this.props.setReport('show', { id, slug, title })
		this.props.history.push(`${location.pathname}?modal=report`)
	}

	_isHome = () => {
		let { pathname } = this.props.history.location
		return (union([ '/' ], DATE_PATHS).indexOf(pathname) >= 0)
	}

	render() {
		let {
			id,
			user,
			index,
			slug,
			date,
			type,
			title,
			venue,
			venue_name,
			artwork,
			featured,
			featured_active,
			organizer,
			door_price,
			advance_price,
			donation_url,
			donation_source,
			ticket_url,
			ticket_affiliate,
			ticket_giveaway,
			livestream_url,
			livestream_source,
			lineup,
			className,
			following,
			disableTracking = false,
			shared_count = 0,
			reasons,
			reason,
			showsTotal,
			isSearching,
			following_artist,
			following_users = [],

			viewportName,
			onImageLoad,
			onAction,
		} = this.props

		let { firstTrackId } = this.state

		user = user || { id: null }

		return (
			<div className={`showitem ${featured ? 'showitem--featured' : ''} is-${type}`} ref={node => this.showItemElement = node} data-tutorial-offset="-300">
				<TrackImpression
					name="show_item"
					disabled={disableTracking}
					data={{
						show_id: slug,
						promoted: (type === 'promoted'),
						value: slug,
						index: index
					}}>

					{reason && (
						<MarketingCopy index={0} showIndex={index} userId={user.id} position="left">
							<div className="marketingcopy-content">
								<p className="marketingcopy-body">Discover local artists based on genres and artists you already know and love.</p>
							</div>
						</MarketingCopy>
					)}

					<MarketingCopy index={1} showIndex={index} userId={user.id} position="left" arrowPosition="right">
						<div className="marketingcopy-content">
							<p className="marketingcopy-body">Tap the artwork to view more and share with your friends.</p>
						</div>
					</MarketingCopy>

					<div className="bubble showitem-content" style={index === 2 ? { zIndex: 1 } : {}}>
						{featured_active && (
							<Fragment>
								<ReactTooltip id={`featured-${slug}`} effect="solid">
									<span className="tooltip-copy">A Rad Plaid Partnered Event</span>
								</ReactTooltip>
								<div
									data-tip data-for={`featured-${slug}`}
									className="featured-headline">
									Promoted
								</div>
							</Fragment>
						)}

						<div className="relative">

							<div className="showitem-header">
								<ShowReasonsYouCare {...omit(this.props, [ 'featured_active' ])} />
								<ShowItemMoreMenu
									{...this.props}
									onReport={this.setReport}
									onClaim={this.setClaim} />
							</div>

							<DateStack date={date} />

							<Link to={`/shows/${slug}`} className="cursor-pointer block" onClick={this.goToShow}>
								{artwork ? (
									artwork.url ? (
										<ShowArtwork
											type="compact"
											alt={title}
											path={artwork || ARTWORK_FALLBACK}
											onImageLoad={(evt) => {
												if (onImageLoad) {
													onImageLoad()
												}
											}} />
									) : (
										<ShowArtwork
											type="compact"
											alt={title}
											blob={artwork.blob || '/public/img/08032016.ig.jpg'}
											onImageLoad={(evt) => {
												if (onImageLoad) {
													onImageLoad()
												}
											}} />
									)
								) : (
									<LineupAsArtwork {...{ lineup }} />
								)}
							</Link>
						</div>

						<div className="showitem-meta cursor-pointer" onClick={this.goToShow}>

							<Link to={`/shows/${slug}`} className="showitem-meta-body">
								<div className="showitem-title">{title}</div>
								<ShowItemVenue venue={venue} venue_name={venue_name} />
							</Link>

							{firstTrackId && (
								<PlayAllButton type="compact" showId={slug} trackId={firstTrackId} />
							)}

							<IconChevron className="showitem-meta-chevron" />
						</div>

						<ShowControl
							type="compact"
							index={index}
							showId={slug}
							user={user}
							date={date}
							title={title}
							donationSource={donation_source}
							donationUrl={donation_url}
							ticketUrl={ticket_url}
							ticketAffiliate={ticket_affiliate}
							ticketGiveaway={ticket_giveaway}
							livestreamSource={livestream_source}
							livestreamUrl={livestream_url}
							advancePrice={advance_price}
							doorPrice={door_price}
							organizer={organizer}
							following={following}
							followingUsers={following_users}
							sharedCount={shared_count}
							onAction={onAction} />
					</div>

					{firstTrackId && (
						<MarketingCopy index={0} showIndex={index} userId={user.id} position="left" arrowPosition="top-right">
							<div className="marketingcopy-content">
								<p className="marketingcopy-body">Press play to hear previews from Spotify and SoundCloud.</p>
							</div>
						</MarketingCopy>
					)}

					<MarketingCopy index={1} showIndex={index} userId={user.id} position="left" arrowPosition="top-right-follow">
						<div className="marketingcopy-content">
							<p className="marketingcopy-body">Tap the heart for reminders and event changes.</p>
						</div>
					</MarketingCopy>
				</TrackImpression>

				{type === 'promoted' && (
					<div className="sponsored-bg">
						<div className="grid">
							<div className="row"></div>
						</div>
					</div>
				)}
			</div>
		)
	}
}

export default React.memo(withRouter(ShowItem))
