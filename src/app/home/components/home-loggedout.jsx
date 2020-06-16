import moment from 'moment'
import isEqual from 'lodash/isEqual'
import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Experiment, Variant } from 'react-ab-test'
import { track } from './../../helpers/analytics.jsx'
import { toTitleCase } from './../../helpers'
import Carousel from './../../common/carousel.jsx'
import { IconChevron } from './../../common/icons.jsx'
import TrackImpression from './../../common/utils/track-impression.jsx'
import { Loader, LoadingCopyComponent } from './../../common/loader.jsx'
import ViewableMonitor from './../../common/utils/viewable-monitor.jsx'
import ShowSimilar from './../../shows/components/showsimilar.jsx'
import * as AppActions from './../../redux/actions/app.jsx'
import ShowActions from './../../redux/actions/shows.jsx'
import AppDownload from './app-download.jsx'

const options = {
	perView: 3,
	gap: 20,
	keyboard: false,
	peek: {
		before: 0,
		after: 64,
	},
	breakpoints: {
		1023: {
			perView: 2,
			peek: {
				before: 0,
				after: 32,
			},
		},
		767: {
			perView: 1,
			peek: {
				before: 0,
				after: 32,
			},
		},
	},
}

class HomeLoggedOut extends Component {
	state = {
		activeClass: '',
	}

	hasUnmounted = false

	componentWillMount() {
		if (this.props.user) {
			this.setState({ activeClass: 'active' })
		}
	}

	componentDidMount() {
		const {
			blogPosts,
			fetchPopularShows,
			fetchBlogPosts,
		} = this.props

		if (typeof window !== 'undefined') {
			window.scrollTo(0, 0)
		}

		fetchPopularShows(() => {
			if (blogPosts && blogPosts.length <= 0) {
				fetchBlogPosts()
			}
		})

		setTimeout(() => {
			if (this.hasUnmounted) {
				return
			}

			this.setState(() => {
				return {
					activeClass: 'active'
				}
			})
		}, 250)
	}

	componentDidUpdate(prevProps, nextState) {
		const { windowLoad } = prevProps

		if (this.props.windowLoad && windowLoad !== this.props.windowLoad) {
			window.scrollTo(0, 0)
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			!isEqual(nextProps.user, this.props.user) ||
			!isEqual(nextProps.popularShows, this.props.popularShows) ||
			!isEqual(nextProps.blogPosts, this.props.blogPosts) ||
			nextProps.windowLoad !== this.props.windowLoad ||
			nextState.activeClass !== this.state.activeClass
		)
	}

	// goHome = () => {
	// 	if (typeof window !== 'undefined') {
	// 		window.scrollTo(0, 0)
	// 	}

	// 	this.props.resetHome()
	// 	this.props.history.push('/')
	// }

	goAddShow = () => {
		this.props.history.push('/add')
	}

	onClick = (post) => {
		track('visit', {
			action: 'news',
			label: post.title,
		})
	}

	render() {
		const {
			user,
			shows = [],
			// userLocationName,
			showsLocationName,
			popularShows = [],
			blogPosts = [],
		} = this.props

		const { activeClass } = this.state
		const newsPostUrls = (blogPosts || []).map(b => b.url)
		const locationName = showsLocationName

		return (!user ? (
			<div id="home-without-feed" className={`hero-animation ${activeClass}`}>
				<figure id="hero">
					<div className="hero-content">
						<div className="typography-hero-headline hero-headline">
							Maine's Live Music.<br />Right in Your Pocket.
						</div>
						<p className="typography-hero-body hero-copy">
							Live music moves fast. Stay connected with Rad Plaid. Be part of your music scene.
						</p>

						<div className="hero-action">
							<AppDownload />
						</div>
					</div>
				</figure>

				<figure id="phones" />

				<section className="section-features">
					<div className="features-top" />
					<div className="section-content">
						<div className="grid">
							<div className="row">
								<div className="col col-4-of-12 col-small-10-of-12">
									<figure className="complete" />
									<div className="text-beard text-center color-white">
										Stay up-to-date
									</div>
									<p>Maine's most complete live music calendar.</p>
								</div>
								<div className="col col-4-of-12 col-small-10-of-12">
									<figure className="listen-follow" />
									<div className="text-beard text-center color-white">
										Listen &amp; Follow
									</div>
									<p>Listen to Events via Spotify and SoundCloud. Save shows for later.</p>
								</div>
								<div className="col col-4-of-12 col-small-10-of-12">
									<figure className="personalized" />
									<div className="text-beard text-center color-white">
										Personalized
									</div>
									<p>Get personalized show recommendations.</p>
								</div>
							</div>

							<AppDownload />
						</div>
					</div>
					<div className="features-bottom" />
				</section>

				{popularShows.length > 0 && (
					<section className="section-trending grid">
						<div className="row show-similar news">
							<div className="col col-12-of-12">
								<ShowSimilar
									user={user}
									carouselOptions={options}
									title={
										<div className="news-headline text-beard color-accent-two">
											Trending Shows
										</div>
									}
									shows={popularShows}>
									<a href={`/?location=${showsLocationName}`} className="carousel-readmore">
										<figure
											className="showitem-artwork">
											<div className="carousel-readmore-label">
												Search {showsLocationName}
											</div>
										</figure>
									</a>
								</ShowSimilar>
							</div>
						</div>
					</section>
				)}

				{blogPosts.length > 0 && (
					<section className="section-music-news grid">
						<div className="row news">
							<div className="col col-12-of-12">
								<TrackImpression
									name="news"
									data={{
										action: 'impression',
										value: newsPostUrls
									}}>
									<div className="row">
										<Carousel
											options={options}
											title={
												<div className="news-headline text-beard color-accent-two">
													Music News
												</div>
											}>
											{blogPosts.map((post, index) => (
												<div key={index}>
													<a href={post.url} target="_blank" onClick={this.onClick.bind(this, post)}>
														<figure
															className="showitem-artwork news-image"
															style={{
																backgroundImage: `url(${post.image})`,
																backgroundPosition: post.backgroundPosition || 'center',
																backgroundSize: post.backgroundSize || 'cover',
															}}>
														</figure>

														<h3 className="news-source typography-small-headline text-uppercase">{post.source_title}</h3>
														<h2 className="news-title">
															{(Array.isArray(post.categories) && post.categories.length > 0) && (
																<span>{toTitleCase(post.categories[0])}: </span>
															)}
															{post.title}
														</h2>

														{typeof post.description === 'string' ? (
															<p className="news-content">{post.description.slice(0, 90)}{post.description.length > 87 ? '...' : ''}</p>
														) : (typeof post.subtitle === 'string') && (
															<p className="news-content">{post.subtitle.slice(0, 90)}{post.subtitle.length > 87 ? '...' : ''}</p>
														)}

														<p>
															{post.author && (
																<span className="typography-small" style={{ maringRight: '0.2rem' }}>{post.author}</span>
															)}
															{(post.author && post.date) && (
																<span className="typography-small inline" style={{ margin: '0 0.4rem' }}>|</span>
															)}
															{post.date && (
																<time className="typography-small">{moment(post.date).format('MMM D, YYYY')}</time>
															)}
														</p>
													</a>
												</div>
											))}

											<a href="https://medium.com/radplaid" target="_blank" className="carousel-readmore" onClick={this.onClick.bind(this, { title: 'Read More' })}>
												<figure
													className="showitem-artwork">
													<div className="carousel-readmore-label">
														Read More
													</div>
												</figure>
											</a>
										</Carousel>
									</div>
								</TrackImpression>
							</div>
						</div>
					</section>
				)}

				<section className="section-addshow grid">
					<figure className="hero-addshow cursor-pointer" onClick={this.goAddShow}>
						<div className="row">
							<div className="col col-5-of-12 push-6-of-12 push-small-0-of-12 col-small-12-of-12 text-right">
								<h2 className="typography-hero-headline">Got Shows?</h2>
								<p className="typography-hero-body">Quickly add all your upcoming events. We'll connect them with the perfect fans.</p>
								<Link
									to={{ pathname: '/add' }}
									className="btn btn--hero"
									onClick={() => {
										track('cta', {
											action: 'addshow',
											source: 'signupblock'
										})
									}}>
									Get Started
								</Link>
							</div>
						</div>
					</figure>
				</section>

				<section className="section-partners text-center grid">
					<div className="flex partner-logos">
						<a href="/?query=Genos+Rock+Club" title="Geno's Rock Club" target="_blank" className="relationship"><img src="https://res.cloudinary.com/radplaid/image/upload/f_auto/v1580698674/logos/genos.png" alt="Geno's Rock Club" /></a>
						<a href="https://www.coffeebydesign.com/" title="Coffee By Design" target="_blank" className="relationship"><img src="https://res.cloudinary.com/radplaid/image/upload/f_auto/v1580698674/logos/cbd.png" alt="Coffee By Design" /></a>
						<a href="https://www.crookedcove.com/" title="Crooked Cove" target="_blank" className="relationship"><img src="https://res.cloudinary.com/radplaid/image/upload/f_auto/v1580698674/logos/crooked-cove.png" alt="Crooked Cove" /></a>
						{/*<a href="https://wblm.com/show/greetings-from-area-code-207/" title="Greetings from Area Code 207" target="_blank" className="relationship"><img src="/img/home-v2/logos/gfac207.png" alt="Greetings from Area Code 207" /></a>*/}
						<a href="https://portlandovations.org/" title="Portland Ovations" target="_blank" className="relationship"><img src="https://res.cloudinary.com/radplaid/image/upload/f_auto/v1580698675/logos/portland-ovations.png" alt="Portland Ovations" /></a>
						<a href="https://www.eatdrinklucky.com/" title="Eat Drink Lucky" target="_blank" className="relationship"><img src="https://res.cloudinary.com/radplaid/image/upload/f_auto/v1580698674/logos/eat-drink-lucky.png" alt="Eat Drink Lucky" /></a>
						<a href="https://www.wmpg.org/show/fri1930/" title="WMPG Local Motives" target="_blank" className="relationship"><img src="https://res.cloudinary.com/radplaid/image/upload/f_auto/v1580698675/logos/wmpg.png" alt="WMPG Local Motives" /></a>
						{/*<a href="https://www.womencrushmusic.com/" title="Women Crush Music" target="_blank" className="relationship"><img src="/img/home-v2/logos/wcm.png" alt="Women Crush Music" /></a>*/}
					</div>

					<div className="row">
						<div className="col col-6-of-12 col-medium-10-of-12 col-small-12-of-12 center">
							<h2 className="typography-hero-headline">Let's Work Together</h2>
							<p className="typography-hero-body">
								We offer high-quality & affordable promotional services &mdash; whether you’re new or been around the block. We help artists, promoters, venues, and event organizers be successful.
							</p>
							<div>
								<a href="https://share.hsforms.com/18JzIbP7RS7-is4bvqAU60Q47o61" target="_blank" className="btn btn--hero btn--secondary">Contact Us</a>
								<Link
									to={{ pathname: '/services' }}
									className="btn btn--hero btn--secondary btn--knockout"
									onClick={() => {
										track('cta', {
											action: 'learn',
											source: 'contact'
										})
									}}>
									Learn More
								</Link>
							</div>
						</div>
					</div>
				</section>
			</div>
		) : (
			<div />
		))
	}
}

const mapStateToProps = ({ app, user, shows }) => ({
	userLocationName: app.userLocation ? app.userLocation.name : 'Portland, ME',
	showsLocationName: shows.showsLocation ? shows.showsLocation.name : 'Portland, ME',
	blogPosts: app.blogPosts,
	windowLoad: app.windowLoad,
	user: user.user,
	shows: shows.shows,
	popularShows: shows.popularShows,
})

const mapDispatchToProps = dispatch => {
	return {
		loadStart: (name) => {
			dispatch(AppActions.loadStart(name))
		},

		resetHome: () => {
			dispatch(AppActions.resetHome())
		},

		fetchBlogPosts: () => {
			dispatch(AppActions.apiFetchBlogPosts())
		},

		fetchPopularShows: (callback) => {
			dispatch(ShowActions.apiFetchPopularShows(callback))
		},

		userAction(id, action = 'follow') {
			dispatch(ShowActions.apiShowAction(id, action))
		},

		updateUser: (user) => {
			dispatch(UserActions.updateUser(user))
		},

		updateUserPassive: (user) => {
			dispatch(UserActions.updateUserPassive(user))
		},

		sendLoginToken: (email) => {
			dispatch(UserActions.sendLoginToken(email))
		},
	}
}

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(HomeLoggedOut)
)
