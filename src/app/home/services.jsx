import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import Carousel from './../common/carousel.jsx'
import { track } from './../helpers/analytics.jsx'
import { DEBUG, LINEUP, SIGNUP_BUTTON } from './../constants.jsx'
import { IconVerified, IconChevron, IconMail } from './../common/icons.jsx'
import PhotographerCredit from './../common/photographer-credit.jsx'
import ViewableMonitor from './../common/utils/viewable-monitor.jsx'
import SignupBlock from './components/signup.jsx'
import Partners from './components/partners.jsx'
import HeadMeta from './../common/headmeta.jsx'

const Divider = ({ id, src, authorUsername, authorName, position, children }) => {
	let styles = {
		backgroundImage: `url(${process.env.BASE_CLIENT_URL}${process.env.ASSET_URL}/img/${src})`
	}

	if (position) {
		styles.backgroundPosition = position
	}

	return (src ? (
			<aside id={id} className="aside--background" style={styles}>
				{children}
				<PhotographerCredit
					authorUsername={authorUsername}
					authorName={authorName} />
			</aside>
		) : (
			<aside id={id}>
				{children}
			</aside>
		)
	)
}

class Services extends Component {
	componentDidMount() {
		if (typeof window !== 'undefined') {
			window.scrollTo(0, 0)
		}
	}

	render() {
		let { user, viewportName } = this.props
		let pathname = (typeof window !== 'undefined') ? window.location.pathname : ''
		let centerSlidePercentage = 33.33

		if (viewportName === 'medium') {
			centerSlidePercentage = 50
		}
		else if (viewportName === 'small') {
			centerSlidePercentage = 100
		}

		return (
			<div id="services" className="color-primary">

				<HeadMeta
					title="Work With Us | Rad Plaid"
					description="We make enriching your life with local music as simple, friendly, and delightful as possible."
					canonicalUrl={`${process.env.BASE_CLIENT_URL}/about`}
					artwork={{
						url: `http://res.cloudinary.com/radplaid/image/upload/f_auto/v1555855910/services/promoter-alice-donovan-rouse.jpg`,
						secure_url: `https://res.cloudinary.com/radplaid/image/upload/f_auto/v1555855910/services/promoter-alice-donovan-rouse.jpg`,
						width: '1600',
						height: '1067'
					}} />

				<figure id="hero" className="hero hero-services" />

				<div className="grid relative">
					<div className="row marketing-content">
						<div className="col col-6-of-12 col-medium-8-of-12 col-small-12-of-12 push-1-of-12 medium-un-push">
							<div className="bubble about-missioncopy">
								<div className="bubble-copy bubble-content">
									<h1 className="typography-small-headline text-uppercase text-beard color-accent-two">Work With Us</h1>
									<h2 className="typography-hero-headline typography-gradient">Let's make beautiful music together.</h2>
									<p>We offer high-quality professional design and promotional services—whether you’re a new artist, promoter, or venue, or organizing your 10th Annual Music Festival. Contact us and let’s make something special.</p>
									<a href="mailto:hello@getradplaid.com" className="btn btn--accept">
										Contact us <IconChevron className="fill-white" />
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="grid relative">
					<div className="row marketing-content">
						<div className="col col-7-of-12 col-medium-6-of-12 col-small-12-of-12 relative">
							<div className="gallery-grid">
								<div className="gallery-column">
									<figure className="img img-alsarah" />
									<figure className="img img-janaesound-rihanna" />
								</div>
								<div className="gallery-column">
									<figure className="img img-seepeoples" />
									<figure className="img img-papatim-blackcrowes" />
								</div>
							</div>
						</div>

						<div className="col col-5-of-12 col-medium-6-of-12 col-small-12-of-12">
							<h2 className="typography-small-headline text-uppercase text-beard color-accent-two">Artwork Design</h2>
							<h3 className="typography-hero-headline typography-gradient">
								Digital &amp; Print Design
							</h3>
							<p>With over ten years of experience creating artwork for nationally touring artists and events, let us handle your artwork to make your event visually standout. We’ll also develop matching elements for your social media channels to make your events recognizable across the internet.</p>
							<ul className="list list--default" style={{ paddingBottom: '2rem' }}>
								<li>Custom created, artfully designed show flyer.</li>
								<li>Matching social media artwork.</li>
								<li>Get a free week of <a href="#certified-rad" className="strong">Certified Rad</a>.</li>
								<li>Get featured in one of our social media channels during the week leading up to your event.</li>
							</ul>

							<div className="price">
								<a href="mailto:hello@getradplaid.com" className="price-action btn btn--accept">
									Contact us <IconChevron className="fill-white" />
								</a>
							</div>
						</div>
					</div>
				</div>

				<div id="certified-rad" className="grid relative">
					<div className="row marketing-content">
						<div className="col col-5-of-12 push-1-of-12 col-medium-6-of-12 medium-un-push col-small-12-of-12">
							<h2 className="typography-small-headline text-uppercase text-beard color-accent-two">Certified Rad</h2>
							<h3 className="typography-hero-headline typography-gradient">
								<IconVerified className="icon-certified fill-accent-two icon--large inlineblock" /> Digital Promotion
							</h3>
							<p>Our fans are always looking for unique live music experiences. Let us improve your shows reach by certifying it with our <span className="violator violator--radplaid">Certified Rad</span> badge.</p>
							<ul className="list list--default" style={{ paddingBottom: '2rem' }}>
								<li>Get featured on our homepage</li>
								<li>Get featured in similar show listings found on our other event pages</li>
								<li>Have your event marked <strong>Certified Rad</strong> and get increased organic exposure</li>
								<li>Get featured in the weekly show recommendations sent to all our users</li>
								<li>Get featured on our social media channels</li>
								<li>Get featured throughout our partner network</li>
							</ul>
							<div className="price">
								<a href="mailto:hello@getradplaid.com" className="price-action btn btn--accept">
									Contact us <IconChevron className="fill-white" />
								</a>
							</div>
						</div>

						<div className="col col-6-of-12 col-small-12-of-12">
							<div className="services-group">
								<div className="service-item">
									<h2 className="typography-small-headline text-uppercase text-beard color-white">Rad Badge</h2>
									<h3 className="typography-subheadline">
										Rad Badge on your event
									</h3>
								</div>
								<div className="service-item">
									<h2 className="typography-small-headline text-uppercase text-beard color-white">Email Feature</h2>
									<h3 className="typography-subheadline">
										Featured in our weekly emails
									</h3>
								</div>
								<div className="service-item">
									<h2 className="typography-small-headline text-uppercase text-beard color-white">Website Feature</h2>
									<h3 className="typography-subheadline">
										Featured on Rad Plaid
									</h3>
								</div>
								<div className="service-item">
									<h2 className="typography-small-headline text-uppercase text-beard color-white">Social Media</h2>
									<h3 className="typography-subheadline">
										Get a Social Media Shoutout
									</h3>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div id="contact" className="grid relative" style={{ zIndex: 1, marginTop: '-3rem' }}>
					<div className="row">
						<div className="col col-6-of-12 col-medium-8-of-12 col-small-12-of-12 text-center center">
							<h2 className="typography-small-headline text-uppercase text-beard color-accent-two text-center">Contact Us</h2>
							<h3 className="typography-hero-headline typography-gradient">
								Let's get this show on the road
							</h3>
							<p>Interested in something else? We're always open to talking about new and creative ways to promote our local music scene.</p>
							<br />

							<a href="https://share.hsforms.com/18JzIbP7RS7-is4bvqAU60Q47o61" className="btn btn--hero btn--accept">
								Contact Us
							</a>
						</div>
					</div>
				</div>

				<Partners style={{ marginTop: '6rem' }} />
			</div>
		)
	}
}
const mapStateToProps = ({ app, user }) => ({
	user: user.user,
	viewportName: app.viewportName
})

const mapDispatchToProps = dispatch => {
	return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Services)
