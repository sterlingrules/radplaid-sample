import isEqual from 'lodash/isEqual'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ShowReasonsYouCare from './../reasonsyoucare.jsx'
import { ShowArtworkAsset } from './../showartwork.jsx'
import PlayAllButton from './../../../player/components/playall-button.jsx'
import TrackImpression from './../../../common/utils/track-impression.jsx'
import ViewableMonitor from './../../../common/utils/viewable-monitor.jsx'
import Carousel from './../../../common/carousel.jsx'
import { IconChevron } from './../../../common/icons.jsx'
import { track } from './../../../helpers/analytics.jsx'
import DateTime from './../../../common/datetime.jsx'
import { ShowItemVenue } from './../showmeta.jsx'
import ShowControl from './../showcontrol.jsx'

class ShowItemFeatured extends Component {
	constructor(props) {
		super(props)

		this.state = {
			currentIndex: 0,
			firstTrackId: null,
			noImage: false,
			options: {
				type: 'carousel',
				perView: 1,
				autoplay: 5000,
				animationDuration: 800,
				rewind: true,
				keyboard: false,
				hoverpause: true,
				bound: false,
				breakpoints: {
					767: {
						perView: 1,
						peek: {
							before: 0,
							after: 0
						}
					}
				}
			}
		}
	}

	componentDidMount() {
		let lineup = this.props.lineup || []

		for (let i = 0; i < lineup.length; i++) {
			if (lineup[i].preview_url) {
				this.setState({
					firstTrackId: lineup[i].id
				})
			}
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			!isEqual(nextProps.featuredShows, this.props.featuredShows) ||
			!isEqual(nextProps.user, this.props.user)
		)
	}

	onCarouselChange = ({ index }) => {
		this.setState({ currentIndex: index })
	}

	onClick = () => {
		track('visit', {
			action: 'show_from_featured',
			show_id: this.props.slug
		})
	}

	onError = () => {
		this.setState({ noImage: true })
	}

	render() {
		const { user, featuredShows = [] } = this.props
		const { currentIndex, firstTrackId, noImage, options } = this.state
		const slugs = featuredShows.map(s => s.slug)
		const trackEvents = []

		slugs.forEach((slug, index) => {
			trackEvents.push({
				action: 'impression',
				promoted: true,
				show_id: slug,
				value: slug
			})
		})

		return (
			<TrackImpression
				name="show_item:featured"
				data={trackEvents}>

				<figure className={`featured ${noImage ? 'featured--noimage' : ''}`}>
					<div className="featured-carousel">
						<Carousel
							minLength={1}
							options={options}>
							{featuredShows.map((featuredShow, index) => {
								const {
									slug,
									title,
									date,
									tags,
									venue,
									reason,
									genres,
									featured,
									byline,
									door_price,
									ticket_url,
									ticket_affiliate,
									ticket_giveaway,
									organizer,
									following,
									following_artist,
									following_users = [],
									shared_count,
									advance_price
								} = featuredShow

								return (featured && (
									<div className="featured-item" key={index}>
										<Link to={`/shows/${slug}`} className="widthfull" onClick={this.onClick}>
											<ShowArtworkAsset
												type="background"
												className="featured-image"
												style={{ backgroundPosition: featured.position || 'center center' }}
												onError={this.onError}
												path={featured}
												{...featured} />
										</Link>

										<div key={index} className="showitem">
											<div className="bubble showitem-content">
												<div className="showitem-meta cursor-pointer">
													<Link to={`/shows/${slug}`} onClick={this.onClick} className="showitem-meta-body">
														<ShowReasonsYouCare
															user={user}
															{...featuredShow} />

														<DateTime
															date={date}
															format="ddd, MMM D, YYYY"
															className="showitem-date typography-body" />

														<div className="typography-headline typography-gradient">{title}</div>

														{featured.quote && (
															<blockquote>
																<span className="quote">{featured.quote}</span>
																{featured.citation && (
																	<cite> ‑{featured.citation}</cite>
																)}
															</blockquote>
														)}

														<ShowItemVenue venue={venue} />
													</Link>

													{firstTrackId && (
														<PlayAllButton type="compact" showId={slug} trackId={firstTrackId} />
													)}
												</div>

												<ShowControl
													type="compact"
													showId={slug}
													user={user}
													ticketUrl={ticket_url}
													ticketAffiliate={ticket_affiliate}
													ticketGiveaway={ticket_giveaway}
													organizer={{
														id: organizer ? organizer.id : null,
														byline
													}}
													following={following}
													followingUsers={following_users}
													sharedCount={shared_count} />
											</div>
										</div>
									</div>
								))
							})}
						</Carousel>
					</div>
				</figure>

			</TrackImpression>
		)
	}
}

export default ShowItemFeatured
