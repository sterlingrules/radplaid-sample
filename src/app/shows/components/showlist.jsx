import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import { connect } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroller'
import { withRouter, Link } from 'react-router-dom'
import { IconDone } from './../../common/icons.jsx'
import { Loader } from './../../common/loader.jsx'
import { track } from './../../helpers/analytics.jsx'
import { isHome, getCurrentDate } from './../../helpers'
import moveTo from './../../helpers/scroll.jsx'
import { SIGNUP_BUTTON } from './../../constants.jsx'
import MarketingSignupSimple from './marketingsignup-simple.jsx'
import UserModel from './../../authentication/models/user.jsx'
import * as AppActions from './../../redux/actions/app.jsx'
import PlayerActions from './../../redux/actions/player.jsx'
import ShowActions from './../../redux/actions/shows.jsx'
import AppDownload from './../../home/components/app-download.jsx'
import ShowItemCompact from './showitem/compact.jsx'
import Blog from './../../home/components/blog.jsx'
import ShowItem from './showitem/index.jsx'

class ShowList extends Component {
	static propTypes = {
		// list of shows
		shows: PropTypes.array.isRequired,

		// number of shows in list
		showsTotal: PropTypes.number,

		// Empty state Component
		emptyCopyComponent: PropTypes.func,

		// Loading state Component
		loadingCopyComponent: PropTypes.func,

		// function to call when user scrolls to bottom of `showlist`
		onScrollToBottom: PropTypes.func.isRequired
	}

	constructor(props) {
		super(props)

		this._prevIsOwner = false
		this.scrollPosition = 0
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			!isEqual(this.props.progress, nextProps.progress) ||
			!isEqual(this.props.viewportName, nextProps.viewportName) ||
			!isEqual(this.props.featuredShows, nextProps.featuredShows) ||
			!isEqual(this.props.emptyCopyComponent, nextProps.emptyCopyComponent) ||
			!isEqual(this.props.title, nextProps.title) ||
			!isEqual(this.props.shows, nextProps.shows) ||
			this.props.isSearching !== nextProps.isSearching ||
			this.props.locationName !== nextProps.locationName ||
			this.props.showsTotal !== nextProps.showsTotal ||
			this.props.afterPage !== nextProps.afterPage ||
			this.props.after !== nextProps.after ||
			this.props.isEnd !== nextProps.isEnd
		)
	}

	sortEventsBy = (sort = 'best') => {
		moveTo(0, 500, 'easeOutQuad', () => {
			UserModel.setSort(sort)

			this.props.setSearchSort(sort)
			this.props.resetSearch()

			window.history.pushState({}, '', '/')
		})
	}

	onLoadMore = () => {
		const { progress, onScrollToBottom } = this.props
		const isLoading = (progress.indexOf('shows') >= 0)

		if (!onScrollToBottom || isLoading) {
			return
		}

		onScrollToBottom(() => {
			this.canCheckScroll = false
		})
	}

	render() {
		let {
			user,
			progress,
			progressStatus,
			viewportName,
			userAction,
			emptyCopyComponent,
			playTrackFromLineup,
			setActiveShow,
			session,
			setClaim,
			locationName,
			isSearching,
			searchSort,
			searchLocation,
			featuredShows,
			deleteShow,
			deletedShowId,
			searchQuery,
			// history,
			location,
			title,

			shows,
			showsTotal,
			afterPage,
			isEnd
		} = this.props

		shows = shows || []

		let showIndex = -1

		featuredShows = featuredShows || []

		const EmptyCopyComponent = this.props.emptyCopyComponent
		const LoadingCopyComponent = this.props.loadingCopyComponent
		const _isHome = isHome(location.pathname)
		const isLoading = (progress.indexOf('shows') >= 0)

		this._prevIsOwner

		let _shows = shows.length ? shows.map((show, index) => {
			if (show.type === 'title') {
				return (
					<li key={index} className="show-subheadline">
						<h2 className="typography-hero-subheadline">{show.value}</h2>
					</li>
				)
			}

			if (Array.isArray(show)) {
				return (
					<ul key={index} className="showlist-owner">
						{show.map((ownerShow, _index) => {
							return (
								<ShowItemCompact
									key={ownerShow.id}
									user={user}
									deleteShow={deleteShow}
									deletedShowId={deletedShowId}
									setClaim={setClaim}
									{...ownerShow} />
							)
						})}
					</ul>
				)
			}

			showIndex++

			return (
				<Fragment key={`${show.id}:${index}`}>
					<ShowItem
						user={user}
						index={showIndex}
						showsTotal={showsTotal}
						userAction={userAction}
						isSearching={isSearching}
						playTrackFromLineup={playTrackFromLineup}
						setActiveShow={setActiveShow}
						viewportName={viewportName}
						setClaim={setClaim}
						{...show} />

					{(showIndex === 2) && (
						<div style={{ margin: '0 0 4rem' }}>
							<div className="marketingsignup-simple block text-center">
								<div className="typography-body-headline color-white">Get the Mobile App</div>
								<AppDownload theme="light" size="small" />
							</div>
						</div>
					)}

					{(showIndex === 3 && !isSearching) && (
						<Blog />
					)}

					{(showIndex === 6 && !user) && (
						<div className="showitem">
							<div className="bubble">
								<MarketingSignupSimple
									next={location.pathname}
									session={session}
									track={track} />
							</div>
						</div>
					)}
				</Fragment>
			)
		}) : (<li />)

		return (
			<InfiniteScroll
				initialLoad={true}
				pageStart={0}
				threshold={typeof window === 'undefined' ? 980 : window.innerHeight}
				loadMore={this.onLoadMore}
				hasMore={(!isEnd && progressStatus !== 'error')}
				className="showlist list relative"
				loader={LoadingCopyComponent ? (
					<LoadingCopyComponent
						key={Math.round(Math.random() * 1000)}
						showsLength={showsTotal} />
				) : (
					<li
						key={Math.round(Math.random() * 1000)}
						className="showlist-endcap">
						<Loader size="small" />

						{!afterPage && (
							<figure className="state searching"></figure>
						)}
					</li>
				)}>

				{_shows}

				{(progressStatus === 'error') && (
					<Fragment>
						<figure className="state fatal-error"></figure>
						<h2 className="typography-subheadline text-center" style={{ marginBottom: '2rem' }}>
							Something went wrong, but we're on it!
						</h2>
					</Fragment>
				)}

				{(!user && !isSearching && _isHome && _shows) && (
					<a
						href={`/?location=${locationName ? locationName : 'Portland, ME'}`}
						className="btn btn--accept btn--hero widthfull"
						onClick={this._onTrackExplore}>
						Search more {locationName ? `${locationName} ` : ''}events
					</a>
				)}

				{(isEnd && !isLoading) && (
					<li className="showlist-endcap text-center">
						{(_shows.length > 0) ? (
							<Fragment>
								<IconDone className="fill-secondary center" />
								<h3 className="typography-small-headline text-uppercase color-secondary">
									Nice! You made it to the end
								</h3>
							</Fragment>
						) : (
							EmptyCopyComponent ? (
								<EmptyCopyComponent />
							) : (
								<DefaultEmptyComponent
									{...{ title, searchQuery, searchLocation }} />
							)
						)}

						{(_isHome && user) && (
							searchSort === 'best' ? (
								<Fragment>
									<br />
									<h3 className="typography-small color-secondary">Want more events?</h3>
									<div className="list list--inline text-center">
										<button
											className="btn btn--accept btn--small"
											onClick={this.sortEventsBy.bind(this, 'all')}>
											Search All Events
										</button>
										<button
											className="btn btn--accent-two--secondary btn--small"
											onClick={this.props.resetHome}>
											Clear Search
										</button>
									</div>
								</Fragment>
							) : (
								<Fragment>
									<br />
									<h3 className="typography-small color-secondary">Want our suggestions?</h3>
									<div className="list list--inline text-center">
										<button
											className="btn btn--accept btn--small"
											onClick={this.sortEventsBy.bind(this, 'best')}>
											Search our Smart Suggestions
										</button>
										<button
											className="btn btn--accent-two--secondary btn--small"
											onClick={this.props.resetHome}>
											Clear Search
										</button>
									</div>
								</Fragment>
							)
						)}
					</li>
				)}
			</InfiniteScroll>
		)
	}

	//
	// Helpers
	//
	_onTrackExplore = () => {
		track('cta', {
			action: 'view all events',
			source: 'showlist'
		})
	}
}

const DefaultEmptyComponent = ({ title, searchQuery, searchLocation }) => {
	return (
		<Fragment>
			<figure className="state empty"></figure>

			{title ? (
				<h2 className="typography-subheadline">{title}</h2>
			) : (
				<h2 className="typography-subheadline">
					Sorry, we were unable to find shows for that search
				</h2>
			)}

			{(searchQuery || searchLocation) && (
				<ul className="list list--default text-left" style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
					{searchLocation && (
						<li>Try searching a different location (ex. Portland, ME).</li>
					)}

					{searchQuery && (
						<Fragment>
							<li>There may not be shows nearby that match this search. Try changing your location or filters.</li>
							<li>Double check your spelling.</li>
						</Fragment>
					)}
				</ul>
			)}
		</Fragment>
	)
}

const mapStateToProps = ({ app, user, shows }) => {
	return {
		session: app.session,
		progress: app.progress,
		progressStatus: app.progressStatus,
		viewportName: app.viewportName,
		isSearching: app.isSearching,
		searchSort: app.searchSort,
		searchQuery: app.searchQuery,
		searchLocation: app.searchLocation,

		user: user.user,

		afterPage: shows.afterPage,
		featuredShows: shows.featuredShows,
		deletedShowId: shows.deletedShowId,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setClaim: (type, show) => {
			dispatch(AppActions.setClaim(type, show))
		},

		resetHome: () => {
			dispatch(AppActions.resetHome())
		},

		resetSearch: () => {
			dispatch(AppActions.resetSearch())
		},

		setSearchSort: (sort) => {
			dispatch(AppActions.setSearchSort(sort))
		},

		playTrackFromLineup: (lineup) => {
			dispatch(PlayerActions.playTrackFromLineup(lineup))
		},

		userAction(id, action = 'follow') {
			dispatch(ShowActions.apiShowAction(id, action))
		},

		setActiveShow: (show) => {
			dispatch(ShowActions.setActiveShow(show))
		},

		fetchShowList: (query) => {
			dispatch(ShowActions.apiFetchShowList(query))
		},

		deleteShow: (slug, title) => {
			dispatch(ShowActions.apiDeleteShow(slug, title))
		}
	}
}

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(ShowList)
)
