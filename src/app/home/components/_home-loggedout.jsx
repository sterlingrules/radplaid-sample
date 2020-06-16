import {
	SIGNUP_BUTTON,
	SHOW_PRESS_PLAY,
	SHOW_SOUNDS_LIKE
} from './../../constants.jsx'

import {
	delay,
	getDateRange,
	getCurrentDate,
	toTitleCase
} from './../../helpers'

import moment from 'moment'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Experiment, Variant } from 'react-ab-test'
import { track } from './../../helpers/analytics.jsx'
import { Loader, LoadingCopyComponent } from './../../common/loader.jsx'
import Login from './../../authentication/components/login.jsx'
import DateTime from './../../common/datetime.jsx'
import Carousel from './../../common/carousel.jsx'
import Marketing from './marketing.jsx'
// import MusicNews from './music-news.jsx'
import { IconChevron } from './../../common/icons.jsx'
import Map from './../../shows/components/map-lazy.jsx'
import ShowList from './../../shows/components/showlist-lazy.jsx'
import ElementEngagement from './../../common/utils/element-engagement.jsx'
import SearchSummary from './../../common/header/search-summary.jsx'
import Search from './../../common/header/search-lazy.jsx'
import Filter from './../../common/header/filter.jsx'
import MarketingFooter from './marketingfooter.jsx'
import SignupBlock from './signup.jsx'

const formatCommaNumbers = (number) => {
	number = (typeof number === 'number') ? Math.floor(number / 100) * 100 : number
	return number.toLocaleString('en')
}

const SocialProof = () => {
	return (
		<div className="social grid">
			<div className="row">
				<div className="col col-12-of-12 social-items">

					<div className="social-testimonials">
						<Carousel
							options={{
								type: 'slider',
								perView: 1,
								rewind: true,
								keyboard: false,
								hoverpause: true,
								autoplay: 5000,
								breakpoints: {
									767: {
										perView: 1,
										peek: {
											before: 0,
											after: 0
										}
									}
								}
							}}>
							<blockquote>
								<h3 className="quote">...the biggest and best local music calendar that has ever existed.</h3>
								<cite className="oblique">&mdash;Jeff Beam, <a href="https://themaineembassy.com/?ref=radplaid" target="_blank">The Maine Embassy</a></cite>
							</blockquote>

							<blockquote>
								<h3 className="quote">Rad Plaid is great<br />... F!@k yes local music.</h3>
								<cite className="oblique">&mdash;Brooke, <a href="https://getradplaid.com/?query=theWorst" target="_blank">theWorst</a></cite>
							</blockquote>

							<blockquote>
								<h3 className="quote">... you can keep up with all our shows, because sometimes your girl needs a break from social media.</h3>
								<cite className="oblique">&mdash;Viva, <a href="https://getradplaid.com/profile/5beb30409d24f94e7c4c7634/managing" target="_blank">Viva & The Reinforcements</a></cite>
							</blockquote>

							<blockquote>
								<h3 className="quote">dude. this rules.</h3>
								<cite className="oblique">&mdash;Jen, The Hammerbombs</cite>
							</blockquote>
						</Carousel>
					</div>

				</div>
			</div>
		</div>
	)
}

class HomeLoggedOut extends Component {
	constructor(props) {
		super(props)

		this.goHome = this.goHome.bind(this)
	}

	goHome() {
		this.props.resetHome()
		this.props.history.push('/')
	}

	render() {
		let {
			title,
			shows = [],
			showsTotal,
			featuredShows = [],
			searchSummary,

			progress = [],
			user,
			location,
			isEnd,
			after,
			venue,
			locationName,
			sendLoginToken,
			map,
			viewportName,
			windowProps,
			isSearching,
			loadStart,
			session,

			userAction
		} = this.props

		const ENGAGE_OFFSET = (viewportName === 'small') ? 0.3 : 0.6

		return (!user ? (
			<div id="home-without-feed">
				<Marketing
					goHome={this.goHome}
					{...{ title, session, progress, sendLoginToken, locationName, venue, map, viewportName, windowProps, isSearching }} />

				<SocialProof />

				<div className="grid">
					<div className="row">
						<div className="col col-6-of-12 push-1-of-12 col-medium-7-of-12 col-small-12-of-12 relative">
							<div className="feed-gutter">
								<SearchSummary
									viewportName={viewportName}
									summary={searchSummary} />

								{(progress.indexOf('shows') >= 0) && (
									<ul className="list" style={{ marginBottom: '2rem' }}>
										<LoadingCopyComponent />
									</ul>
								)}

								<ShowList
									title={title || ''}
									shows={shows}
									isLoading={(progress.indexOf('shows') >= 0)}
									showsTotal={showsTotal}
									locationName={locationName}
									isEnd={true}
									after={after}
									loadingCopyComponent={LoadingCopyComponent} />
							</div>
						</div>
						<div className="col col-4-of-12 col-medium-5-of-12 medium-un-push">
							<div className="sidebar">
								<Search />
								<div className="break" name="filter" />
								<Filter />
							</div>
						</div>
					</div>
				</div>

				<MarketingFooter />
			</div>
		) : (
			<div />
		))
	}
}

export default HomeLoggedOut
