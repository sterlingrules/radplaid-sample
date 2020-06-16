import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import Carousel from './../common/carousel.jsx'
import { IconChevron } from './../common/icons.jsx'
import { track } from './../helpers/analytics.jsx'
import { LINEUP, SIGNUP_BUTTON } from './../constants.jsx'
import PhotographerCredit from './../common/photographer-credit.jsx'
import HeadMeta from './../common/headmeta.jsx'
import SignupBlock from './components/signup.jsx'

const Divider = ({ id, src, authorUsername, authorName, position, children }) => {
	let styles = {
		backgroundImage: `url(${process.env.BASE_CLIENT_URL}${process.env.ASSET_URL}/img/${src})`
	}

	if (position) {
		styles.backgroundPosition = position
	}

	return (src ? (
			<aside id={id} className="aside--background aside--fixed" style={styles}>
				{children}
				{(authorUsername && authorName) && (
					<PhotographerCredit
						authorUsername={authorUsername}
						authorName={authorName} />
				)}
			</aside>
		) : (
			<aside id={id}>
				{children}
			</aside>
		)
	)
}

class AboutPage extends Component {
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
			<div id="about">

				<HeadMeta
					title="About Us | Rad Plaid"
					description="We make enriching your life with local music as simple, friendly, and delightful as possible."
					canonicalUrl={`${process.env.BASE_CLIENT_URL}/about`}
					artwork={{
						url: `${process.env.BASE_CLIENT_URL}${process.env.ASSET_URL}/img/promoter-alice-donovan-rouse.jpg`,
						secure_url: `${process.env.BASE_CLIENT_URL}${process.env.ASSET_URL}/img/promoter-alice-donovan-rouse.jpg`,
						width: '1600',
						height: '1067'
					}} />

				<div id="hero" className="hero hero-about">
					<div className="hero-content grid" />
				</div>

				<div className="grid relative">
					<div className="row marketing-content">
						<div className="col col-6-of-12 col-medium-8-of-12 col-small-12-of-12 push-6-of-12 push-medium-4-of-12 small-un-push">
							<div className="bubble about-missioncopy">
								<div className="bubble-copy bubble-content">
									<h1 className="typography-small-headline text-uppercase text-beard">Our Mission</h1>
									<h2 className="typography-hero-headline">We help you fall in love with local music.</h2>
									<p className="oblique">For the first time or all over again.</p>
									<p>We are a Portland, Maine company connecting local music fans, artists, and venues in the simplest most delightful way possible. We're deeply passionate about music, the vibrant communities that surround them, and providing a sustainable way for live musicians to be successful—whatever your definition.</p>
								</div>
							</div>
						</div>
					</div>

					<div className="row marketing-content">
						<div className="col col-5-of-12 push-1-of-12 col-medium-6-of-12 medium-un-push col-small-12-of-12">
							<h1 className="typography-small-headline text-uppercase text-beard">What We Do</h1>
							<h2 className="typography-hero-headline">We personalize your live music experience</h2>
							<p>While some might enjoy pouring over long, daunting lists of events, we take much of the guesswork out of finding where to spend your time by using your favorite artists and finding local events that sound similar or even feature those artists.</p>
						</div>
						<div className="col col-5-of-12 col-medium-6-of-12 col-small-12-of-12">
							<h1 className="typography-small-headline text-uppercase text-beard">What We Do</h1>
							<h2 className="typography-hero-headline">We keep you up to date</h2>
							<p>Every week we'll send you a personalized email of upcoming shows worthy of your attention as well as timely alerts of the artists you follow. Every show even provides a follow button to notify you when a show is coming up, so you never miss out.</p>
						</div>
					</div>
				</div>

				<aside className={`about-hero bg-promoters aside--fixed`}>
					<div className="grid text-left">
						<div className="row">
							<div className="col col-4-of-12 push-1-of-12 col-medium-5-of-12 medium-un-push col-small-10-of-12">
								<h1 className="typography-small-headline text-uppercase text-beard color-white">What We Do</h1>
								<h2 className="typography-hero-headline">We spread the word</h2>
								<p>Merely adding your event to a website isn't enough. When shows are added to Rad Plaid, we do everything we can to help get the right people to attend. Add your upcoming show and let us spread the word by sharing on our social networks, our partner networks, ads, posters, and handing out actual flyers around town. And we're always on the lookout for more opportunities to get local musicians exposure.</p>
							</div>
						</div>
					</div>
				</aside>

				<div className="grid relative">
					<div className="row marketing-content" style={{ marginTop: '2rem' }}>
						<div className="col col-8-of-12 push-1-of-12 col-medium-12-of-12 medium-un-push">
							<h1 className="typography-small-headline text-uppercase text-beard">What We Do</h1>
							<h2 className="typography-hero-headline">We make a great partner</h2>
							<p>Putting together a big music event, festival, rallying around an important cause? We'd love to work together. Reach out <a href="mailto:hello@getradplaid.com" className="strong underline">hello@getradplaid.com.</a></p>
						</div>
					</div>
				</div>

				<Divider
					id="founders"
					src="press/founders.jpg" />

				<div className="grid relative about-team" style={{ zIndex: 1 }}>
					<span className="marketing-content">
						<div className="row">
							<div className="col col-6-of-12 col-small-12-of-12">
								<div className="bubble">
									<div className="bubble-copy bubble-content">
										<h1 className="typography-small-headline text-uppercase text-beard">COO & Co-Founder</h1>
										<h2 className="typography-hero-headline">Cait Salzberg</h2>
									</div>
									<div className="bubble-copy bubble-content typography--formatted">
										<p>Caitlin has always had a passion for entertaining and bringing people together. She’s taken that passion from Professional Event Coordinator to Chef and back again. She not only brings her ability to put on a good show to the Rad Plaid team, but the frustration of missing out on great bands while she could still see them in a tiny dive bar and approach them without a backstage pass.</p>
									</div>
								</div>
							</div>
							<div className="col col-6-of-12 col-small-12-of-12">
								<div className="bubble">
									<div className="bubble-copy bubble-content">
										<h1 className="typography-small-headline text-uppercase text-beard">CEO & Co-Founder</h1>
										<h2 className="typography-hero-headline">Sterling Salzberg</h2>
									</div>
									<div className="bubble-copy bubble-content typography--formatted">
										<p>The only thing Sterling has worked on longer than web development is making music. For over 20 years Sterling has taken part in music scenes from Miami to Chicago to San Francisco. Ironically, in order to focus on music he began freelancing in web development, until his efforts took him all the way to companies such as <a href="https://reverb.com/" target="_blank">Reverb.com</a> and <a href="https://apple.com/" target="_blank">Apple.</a> During his over 10 years in the tech world, he's still managed to run a music production company, and put out 7 releases from 5 different music projects, with many more releases on the horizon. Music has always been where he's wanted to be and now he's taking what he knows about tech to make the music around him and those who make it, better and more accessible.</p>
									</div>
								</div>
							</div>
						</div>
					</span>
				</div>

				{!user && (
					<SignupBlock />
				)}
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

export default connect(mapStateToProps, mapDispatchToProps)(AboutPage)
