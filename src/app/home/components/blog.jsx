import moment from 'moment'
import React, { Component } from 'react'
import { toTitleCase } from './../../helpers'
import { request } from './../../helpers/request.jsx'
import { track } from './../../helpers/analytics.jsx'
import Carousel from './../../common/carousel.jsx'
import ViewableMonitor from './../../common/utils/viewable-monitor.jsx'
import { IconChevron, IconMedium } from './../../common/icons.jsx'
import TrackImpression from './../../common/utils/track-impression.jsx'
import { apiFetchBlogPosts } from './../../redux/actions/app.jsx'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

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
			<div className="following-headline color-accent-two">Music News</div>
			<a href="https://medium.com/radplaid" onClick={onViewMore} target="_blank" className="following-headline color-accent-two">
				<IconMedium className="icon--small inlineblock" /> <span>View more news</span> <IconChevron className="inlineblock" />
			</a>
		</div>
	)
}

class Blog extends Component {
	constructor(props) {
		super(props)
	}

	componentWillMount() {
		let { blogPosts, fetchBlogPosts } = this.props

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
		let { user, blogPosts, viewportName } = this.props
		let blogPostSlugs = []

		blogPosts = Array.isArray(blogPosts) ? blogPosts : []
		blogPostSlugs = blogPosts.map(b => b.url)

		return (blogPosts.length > 0 && (
			<TrackImpression
				name="blog"
				data={{
					action: 'impression',
					value: blogPostSlugs
				}}>

				{viewportName === 'small' ? (
					<div className="news blog">
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

											{typeof post.description === 'string' && (
												<p className="typography-body">{post.description.slice(0, 90)}{post.description.length > 87 ? '...' : ''}</p>
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
					</div>
				) : (
					<div className="news blog">
						<NewsHeadline />

						{/*<div className="list list--info" style={{ marginBottom: '1rem' }}>
							<a href="https://medium.com/radplaid" target="_blank" className="listitem">
								<div className="listitem-content" style={{ padding: 0 }}>
									<div className="typography-hero-subheadline color-primary" style={{ lineHeight: 1 }}>
										<span
											style={{
												display: 'inline-block',
												verticalAlign: 'top',
												marginTop: '0.32rem'
											}}>
											<IconMedium className="fill-primary" />
										</span> Music News
									</div>
								</div>
								<div className="listitem-action" style={{ padding: 0, marginTop: '0.4rem' }}>
									<div className="btn btn--accept btn--knockout btn--small">
										Follow on Medium
									</div>
								</div>
							</a>
						</div>*/}

						<ul className="list list--info">
							{blogPosts.map((post, index) => {
								return (
									<li key={index}>
										<a href={post.url} target="_blank" className="listitem">
											<div className="listitem-content">
												<h2 className="typography-subheadline">{post.title}</h2>

												{typeof post.description === 'string' && (
													<p className="typography-small">{post.description.slice(0, 60)}{post.description.length > 57 ? '...' : ''}</p>
												)}

												{post.author && (
													<span className="typography-small" style={{ maringRight: '0.2rem' }}>{post.author}</span>
												)}
												{(post.author && post.date) && (
													<span className="typography-small inline" style={{ margin: '0 0.4rem' }}>|</span>
												)}
												{post.date && (
													<time className="typography-small">{moment(post.date).format('MMM D, YYYY')}</time>
												)}
											</div>
											<ViewableMonitor className="listitem-image" style={{ backgroundImage: `url(${post.image})` }} />
										</a>
									</li>
								)
							})}
						</ul>

						{user && (
							<p
								className="following-headline text-right"
								style={{
									paddingTop: '1rem',
									marginRight: -10,
								}}>
								<a
									href="https://forms.gle/YwHhRfgong94bqZS6"
									className="text-uppercase color-accent-two"
									style={{ fontWeight: '700' }}
									target="_blank">
									<span>Submit News</span> <IconChevron className="inlineblock" />
								</a>
							</p>
						)}
					</div>
				)}
			</TrackImpression>
		))
	}
}

const mapStateToProps = ({ app, user }) => ({
	user: user.user,
	blogPosts: app.blogPosts,
	viewportName: app.viewportName,
})

const mapDispatchToProps = dispatch => {
	return {
		fetchBlogPosts: () => {
			dispatch(apiFetchBlogPosts())
		}
	}
}

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(Blog))
