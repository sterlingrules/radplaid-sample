import moment from 'moment'
import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import { track } from './../../helpers/analytics.jsx'
import { IconChevron, IconMedium } from './../../common/icons.jsx'
import Carousel from './../../common/carousel.jsx'
import ViewableMonitor from './../../common/utils/viewable-monitor.jsx'
import TrackImpression from './../../common/utils/track-impression.jsx'
import { apiFetchBlogPosts } from './../../redux/actions/app.jsx'
import { toTitleCase } from './../../helpers'

const options = {
	perView: 1,
	keyboard: false,
	peek: {
		before: 0,
		after: 32,
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

const NewsHeadline = () => {
	const onViewMore = (evt) => {
		track('visit', {
			action: 'medium',
			label: 'medium',
		})
	}

	return (
		<div className="row news-headline">
			<div className="col col-6-of-12">
				<div className="following-headline color-accent-two">Music News</div>
			</div>
			<div className="col col-6-of-12 text-right">
				<a href="https://medium.com/radplaid" onClick={onViewMore} target="_blank" className="following-headline color-accent-two">
					<IconMedium className="icon--small inlineblock" /> <span>View more news</span> <IconChevron className="inlineblock" />
				</a>
			</div>
		</div>
	)
}

class MusicNews extends Component {
	componentWillMount() {
		const { blogPosts, fetchBlogPosts } = this.props

		if (blogPosts && blogPosts.length <= 0) {
			fetchBlogPosts()
		}
	}

	onClick = (post) => {
		track('visit', {
			action: 'news',
			label: post.title,
		})
	}

	render() {
		const { viewportName, blogPosts = [] } = this.props
		const newsPostUrls = (blogPosts || []).map(b => b.url)
		const mainStory = (Array.isArray(blogPosts) && blogPosts.length > 0) ? blogPosts[0] : null

		return (mainStory ? (
			<div className="news">
				<TrackImpression
					name="news"
					data={{
						action: 'impression',
						value: newsPostUrls
					}}>
					{viewportName === 'small' ? (
						<div className="row">
							<Carousel
								options={options}
								title={
									<div className={`following-headline color-accent-two`}>
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
											<h2 className="typography-headline">
												{(Array.isArray(post.categories) && post.categories.length > 0) && (
													<span>{toTitleCase(post.categories[0])}: </span>
												)}
												{post.title}
											</h2>

											{typeof post.description === 'string' ? (
												<p className="typography-body">{post.description.slice(0, 90)}{post.description.length > 87 ? '...' : ''}</p>
											) : (typeof post.subtitle === 'string') && (
												<p className="typography-body">{post.subtitle.slice(0, 90)}{post.subtitle.length > 87 ? '...' : ''}</p>
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
							</Carousel>
						</div>
					) : (
						<Fragment>
							<NewsHeadline />
							<div className="row">
								<div className="col col-7-of-12">
									<a href={mainStory.url} target="_blank" onClick={this.onClick.bind(this, mainStory)}>
										<figure
											className="showitem-artwork news-image"
											style={{
												backgroundImage: `url(${mainStory.image})`,
												backgroundPosition: mainStory.backgroundPosition || 'center',
												backgroundSize: mainStory.backgroundSize || 'cover',
											}}>
										</figure>

										<h3 className="news-source typography-small-headline text-uppercase">{mainStory.source_title}</h3>
										<h2 className="typography-headline">
											{(Array.isArray(mainStory.categories) && mainStory.categories.length > 0) && (
												<span>{toTitleCase(mainStory.categories[0])}: </span>
											)}
											{mainStory.title}
										</h2>

										{typeof mainStory.description === 'string' && (
											<p className="typography-body">{mainStory.description.slice(0, 140)}{mainStory.description.length > 137 ? '...' : ''}</p>
										)}

										<p>
											{mainStory.author && (
												<span className="typography-small" style={{ maringRight: '0.2rem' }}>{mainStory.author}</span>
											)}
											{(mainStory.author && mainStory.date) && (
												<span className="typography-small inline" style={{ margin: '0 0.4rem' }}>|</span>
											)}
											{mainStory.date && (
												<time className="typography-small">{moment(mainStory.date).format('MMM D, YYYY')}</time>
											)}
										</p>
									</a>
								</div>
								<div className="col col-5-of-12">
									<ul className="list list--info" style={{ marginLeft: '1rem' }}>
										{blogPosts.map((post, index) => {
											if (index === 0 ||
												index === 4 && viewportName === 'medium') {
												return <Fragment key={index}></Fragment>
											}

											return (
												<li key={index} className="listitem">
													<a href={post.url} target="_blank" className="listitem" onClick={this.onClick.bind(this, post)}>
														<ViewableMonitor className="listitem-image" style={{ backgroundImage: `url(${post.image})` }} />
														<div className="listitem-content">
															<h3 className="news-source typography-tiny-headline text-uppercase">{post.source_title}</h3>
															<h2 className="typography-subheadline">
																{(Array.isArray(post.categories) && post.categories.length > 0) && (
																	<span>{toTitleCase(post.categories[0])}: </span>
																)}
																{post.title}
															</h2>
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
														</div>
													</a>
												</li>
											)
										})}
									</ul>
								</div>
							</div>
						</Fragment>
					)}
				</TrackImpression>
			</div>
		) : (
			<div className="news" style={{ width: '100%' }}>
				{viewportName === 'small' ? (
					<div className="row" style={{ marginBottom: '2rem' }}>
						<div className="col col-12-of-12">
							<figure className="showitem-artwork background-gray" style={{ marginBottom: '1rem' }} />
							<div className="playlist-track" style={{ width: '100%' }}>
								<div className="playlist-artist playlist-empty" />
								<div className="playlist-title playlist-empty" />
							</div>
						</div>
					</div>
				) : (
					<Fragment>
						<NewsHeadline />
						<div className="row">
							<div className="col col-7-of-12">
								<figure className="showitem-artwork background-gray" style={{ marginBottom: '1rem' }} />
								<div className="playlist-track" style={{ width: '100%' }}>
									<div className="playlist-artist playlist-empty" />
									<div className="playlist-title playlist-empty" />
								</div>
							</div>
							<div className="col col-5-of-12">
								<ul className="list list--info" style={{ marginLeft: '1rem' }}>
									{[1, 2, 3, 4].map((post, index) => (
										<li key={index} className="listitem">
											<div className="listitem-image background-gray" />
											<div className="listitem-content">
												<div className="playlist-track" style={{ width: '100%' }}>
													<div className="playlist-artist playlist-empty" />
													<div className="playlist-title playlist-empty" />
												</div>
											</div>
										</li>
									))}
								</ul>
							</div>
						</div>
					</Fragment>
				)}
			</div>
		))
	}
}

const mapStateToProps = ({ app }) => ({
	viewportName: app.viewportName,
	blogPosts: app.blogPosts,
})

const mapDispatchToProps = dispatch => {
	return {
		fetchBlogPosts: () => {
			dispatch(apiFetchBlogPosts())
		}
	}
}

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(MusicNews))
