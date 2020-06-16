import moment from 'moment'
import React, { Component, Fragment } from 'react'
import { Loader, LoadingCopyComponent } from './../../common/loader.jsx'
import { Link } from 'react-router-dom'
import { getCurrentDate } from './../../helpers'
import Marketing from './marketing.jsx'
import MarketingFooter from './marketingfooter.jsx'
import { DEBUG, IS_APP } from './../../constants.jsx'
import { track } from './../../helpers/analytics.jsx'
import moveTo from './../../helpers/scroll.jsx'
import CalendarFilter from './../../common/calendar-filter.jsx'
import FollowingCarousel from './../../shows/components/following-carousel.jsx'
import ShowList from './../../shows/components/showlist-lazy.jsx'
import SearchSummary from './../../common/header/search-summary.jsx'
import HeadMeta from './../../common/headmeta.jsx'
import Search from './../../common/header/search.jsx'
import Filter from './../../common/header/filter.jsx'

const NoShowCopy = ({ searchQuery, shows }) => {
	return (
		<div>
			<span className="block">Nothing found for '{searchQuery}'.</span>
			<span className="block">
				{shows.length > 1 ? 'But, here are some similar local events.' : 'But, here\'s a similar event.'}
			</span>
		</div>
	)
}

class HomeWithFeed extends Component {
	constructor(props) {
		super(props)

		this.state = {
			runTutorial: false
		}

		this.onScrollToBottom = this.onScrollToBottom.bind(this)
	}

	componentWillMount() {
		let {
			user,
			shows = [],
			following,
		} = this.props

		if (shows.length <= 0 && typeof window !== 'undefined') {
			window.scrollTo(0,0)
		}
	}

	queryLiveStreams = () => {
		moveTo(600, 500, 'easeOutQuad', () => {
			this.props.setSearchLiveStream(new Date().getTime())
			window.history.pushState({}, '', '/')
		})
	}

	onScrollToBottom(callback = () => {}) {
		let {
			shows,
			after,
			afterPage,
			search,
			isSearching,
			searchSort,
			searchQuery,
			searchCost,
			searchTag,
			searchLocation,
			searchDateFrom,
			searchDateTo,
			fetchShowList,
			progress
		} = this.props

		if (progress.indexOf('shows') >= 0) {
			return
		}

		const query = {
			sort: searchSort,
			query: searchQuery,
			cost: searchCost,
			tag: searchTag,
			location: searchLocation,
			from: searchDateFrom,
			after: after,
			page: afterPage,
			to: searchDateTo
		}

		if (isSearching) {
			search(query)
			return callback()
		}

		fetchShowList(query)
		callback()
	}

	render() {
		let {
			shows,
			showsTotal,
			after,
			isEnd,
			searchSummary,
			noShows,
			map,

			ip,
			user = {},
			title,
			venue,
			progress = [],
			searchSort,
			following,
			followingIsEnd,
			featuredShows,
			locationName,
			searchQuery,
			viewportName,
			windowProps,
			isBrowser,
			isSearching,

			// Methods
			fetchUserShowList,
			onScrollToBottom,
			updateUserPassive,
			runHomeTutorial,
			updateUser,
			userAction,
			loadStart,
			onWin,
		} = this.props

		let hasShows = (Array.isArray(shows) && shows.length > 0)
		let hasNoShows = (Array.isArray(noShows) && noShows.length > 0)
		let hasFeatured = (featuredShows.length > 0 && !isSearching)
		let notEnoughGenres = !!(user && (user.genres || []).length === 0)
		let columnClassesInset = `col col-6-of-12 push-1-of-12 col-medium-7-of-12 medium-un-push col-small-12-of-12 relative`
		let columnClasses = `col col-7-of-12 col-medium-10-of-12 col-small-12-of-12 center relative`

		// We have shows
		if (hasShows) {
			shows = shows
		}
		// We have `noShows`
		else if (hasNoShows) {
			shows = noShows
			showsTotal = noShows.length
		}
		// We have nothing :(
		else {
			shows = []
		}

		if (IS_APP) {
			return (<div />)
		}

		return (
			<div id="home-with-feed" className={(hasFeatured && !notEnoughGenres) ? 'is-featured' : ''}>
				{/*<NewUserTutorial
					run={this.state.runTutorial}
					{...{ user, updateUserPassive, viewportName }} />*/}

				{title && (
					<HeadMeta title={`Rad Plaid | ${title}`} />
				)}

				<Marketing
					type="compact"
					{...{
						user,
						title,
						onWin,
						progress,
						loadStart,
						venue,
						shows,
						locationName,
						map,
						viewportName,
						windowProps,
						isBrowser,
						isSearching,
					}} />

				{/*<div className="search-title">
					<div className="grid">
						<div className="row">
							<div className={`col col-6-of-12 ${user ? 'col-medium-8-of-12' : 'col-medium-6-of-12'} col-small-12-of-12 center text-center`}>
							{(user && hasShows) ? (
								<h2>{title ? title : (<span className="text-capitalize">{`${searchSort} Upcoming Events`}</span>)}</h2>
							) : hasNoShows ? (
								<NoShowCopy {...{ searchQuery, shows }} />
							) : title ? (
								<h2>{title}</h2>
							) : (
								<Loader size="small" />
							)}
							</div>
						</div>
					</div>
				</div>*/}

				<div id="home">
					{(notEnoughGenres) && (
						<div className="complete-profile grid">
							<div className="row">
								<div className={`${columnClassesInset} center`}>
									<div className="addshow-progress addshow-progress--large" style={{ marginBottom: '0.8rem' }}>
										<div className="addshow-progress-4">
											<div className="addshow-progress-bar-wrapper">
												<div className="addshow-progress-bar"></div>
											</div>
										</div>
									</div>

									<div className="flex" style={{ alignItems: 'center' }}>
										<div className="typography-body color-accent-two">
											You're almost done!
										</div>
										<div className="text-right" style={{ flexGrow: 1 }}>
											<Link
												to={{ search: '?modal=editprofile&step=2' }}
												className={`btn btn--secondary ${(progress.length > 0) ? 'btn--disabled' : ''}`}
												onClick={() => {
													track('cta', {
														action: 'complete profile',
														label: 'complete profile'
													})
												}}>
												{viewportName === 'small' ? 'Complete Profile' : 'Complete Your Profile'}
											</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					<div className="grid">

						{/*MVP Banner*/}
						<div className="row">
							<div className="col col-10-of-12 push-1-of-12 col-medium-12-of-12 medium-un-push col-small-12-of-12 relative">
								<div className="showlist-banner">
									<div className="showlist-banner-image" />
									<div className="showlist-banner-content typography--formatted">
										<div className="typography-subheadline">Quarantined? Why not Live Stream?</div>
										<p className="typography-small">We've recently added support for Live Video Streaming. Connect with your local music scene while keeping everyone healthy and safe.</p>
										<p className="typography-small">In a <a href="https://www.cdc.gov/coronavirus/2019-ncov/community/large-events/mass-gatherings-ready-for-covid-19.html" target="_blank">Guidance Announcement</a> issued 3/15, the CDC is recommending the cancellation or postponement of in-person events that consist of 50+ people.</p>
										<div className="list list--inline">
											<Link to="/add/1" className="btn btn--accent-two--secondary">Add Event</Link>
											<div onClick={this.queryLiveStreams} className="btn btn--accept">Search Live Streaming Events</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="row">
							<div className={columnClassesInset}>

								<div className="feed-gutter">

									<FollowingCarousel />

									<SearchSummary
										viewportName={viewportName}
										summary={searchSummary} />

									<ShowList
										title={title || ''}
										shows={shows}
										showsTotal={showsTotal}
										after={after}
										isEnd={isEnd}
										isLoading={(progress.indexOf('shows') >= 0)}
										locationName={locationName}
										onScrollToBottom={this.onScrollToBottom}
										loadingCopyComponent={LoadingCopyComponent}
										isSearching={isSearching} />
								</div>

							</div>
							<div className="col col-4-of-12 col-medium-5-of-12">
								<div className="sidebar">
									<Search />
									<div className="break" name="filter" />
									<Filter />
								</div>
							</div>
						</div>
					</div>
				</div>

				{(!user && showsTotal > 2) && (
					<MarketingFooter />
				)}
			</div>
		)
	}
}

export default HomeWithFeed
