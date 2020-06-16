import React, { Component } from 'react'
import { DEBUG } from './../constants.jsx'
import HeadMeta from './../common/headmeta.jsx'
import Venue from './../shows/components/venue.jsx'
import Map from './../shows/components/map-lazy.jsx'

class Press extends Component {
	componentDidMount() {
		if (typeof window !== 'undefined') {
			window.scrollTo(0, 0)
		}
	}

	render() {
		const HQ = {
			name: 'Rad Plaid',
			lat: 43.6671733,
			lng: -70.3515974,
			formattedAddress: [
				'Portland',
				'ME'
			]
		}

		return (
			<div id="press">

				<HeadMeta
					title="Press | Rad Plaid"
					description="Using your Spotify play history, we craft a feed of local shows built just for you, with real playable songs."
					canonicalUrl={`${process.env.BASE_CLIENT_URL}/what-is-rad-plaid`}
					artwork={{
						url: `${process.env.BASE_CLIENT_URL}/img/promoter-alice-donovan-rouse.jpg`,
						secure_url: `${process.env.BASE_CLIENT_URL}/img/promoter-alice-donovan-rouse.jpg`,
						width: '1600',
						height: '1067'
					}} />

				<div id="hero" className="hero hero-press">
					<div className="hero-content grid">
						<div className="row">
							<div className="col col-8-of-12 push-2-of-12 col-small-12-of-12 push-small-0-of-12 text-uppercase">
								<h1 className="hero-headline typography-hero-headline">
									<div className="hero-headline-copy">
										Press
										<span></span>
									</div>
								</h1>
							</div>
						</div>
					</div>
				</div>

				<div className="grid">
					<div className="row">
						<div className="col col-8-of-12 push-2-of-12 col-small-12-of-12 push-small-0-of-12">
							<div className="bubble">
								<div className="bubble-content">
									<h2 className="typography-body-headline">A little bit about us</h2>
									<p>Rad Plaid makes enriching your life with local music as simple, friendly, and delightful as possible. It's easy to feel overwhelmed when it comes to attending intimate shows, but based on your Spotify listening history, we'll find you the best shows to attend accompanied by songs from the show. Learn more about your local bands, local venues, even buy tickets—all before you step inside. Be part of your local music scene.</p>

									<h2 className="typography-body-headline">How it all works</h2>
									<p>Show discovery for those yet to be discovered. We aim to be much more than just another way to fill your time on a Friday night. While we all love the band releasing their 12th record on their 40th world tour, we also believe that live local music matters; because even they were once just a local artist. So, based on your music history our algorithms find you the best shows featuring up-and-coming local artists—not just the popular ones. We believe the local music scene is important because the best ideas are often fragile and without a healthy support system they can be lost—leaving us with nothing more than the status quo.</p>

									<p>Have any questions? Hit us up!<br /><a href="mailto:press@getradplaid.com">press@getradplaid.com</a></p>
								</div>
							</div>

							<div className="bubble">
								<div className="bubble-content">
									<h2 className="typography-body-headline">Why, as told by co-founder Sterling Salzberg</h2>
									<p>"I play in a band, I’ve booked shows, played in even more, but most importantly I’ve attended countless shows as a fan of music. Most of them local. A lot of shows for friends and with friends. However, since growing up in the Miami music scene, I’ve moved a lot and getting acclimated to a new music scene has always been difficult. I merely wanted a clear way to understand the artists, venues, and sounds of my new city. And..."</p>
									<a href="https://medium.com/@sterlingrules/why-i-built-rad-plaid-the-concert-discovery-platform-you-can-hear-f06bce2413ef" target="_blank" className="btn btn--accept">Read the full story on Medium</a>
								</div>
							</div>
						</div>
					</div>

					<div className="row relative">
						<div className="press-map col col-8-of-12 push-4-of-12 col-small-12-of-12 push-small-0-of-12">
							<Map venue={HQ} height={400} />
						</div>

						<div className="press-summary col col-4-of-12 push-2-of-12 col-small-10-of-12 push-small-1-of-12">
							<div className="bubble">
								<div className="bubble-content">
									<h2 className="typography-body-headline">Rad Plaid</h2>
									<ul className="list">
										<li><strong>Founded:</strong> November 2017</li>
										<li><strong>Location:</strong> Portland, Maine, USA</li>
										<li><strong>Team Size:</strong> 5</li>
									</ul>
								</div>
							</div>
						</div>
					</div>

					<div className="row founders-content">
						<a href={`${process.env.BASE_CLIENT_URL}/img/press/founders_hires.jpg`} className="col col-10-of-12 col-small-12-of-12 push-small-0-of-12" target="_blank">
							<figure className="founders" title="Click for High Resolution">
								<h2 className="typography-hero-headline color-white">
									Founders
								</h2>
							</figure>
						</a>

						<div className="col col-4-of-12 push-2-of-12 col-small-12-of-12 push-small-0-of-12 founders-copy typography--formatted">
							<h2 className="typography-body-headline">Caitlin Salzberg</h2>
							<h3 className="typography-small-headline">COO / Co-Founder</h3>
							<p>Caitlin has always had a passion for entertaining and bringing people together. She’s taken that passion from Professional Event Coordinator to Chef and back again. She not only brings her ability to put on a good show to the Rad Plaid team, but the frustration of missing out on great bands while she could still see them in a tiny dive bar and approach them without a backstage pass.</p>
						</div>
						<div className="col col-4-of-12 col-small-12-of-12 founders-copy typography--formatted">
							<h2 className="typography-body-headline">Sterling Salzberg</h2>
							<h3 className="typography-small-headline">CEO / Co-Founder</h3>
							<p>The only thing Sterling has worked on longer than web development is making music. For over 20 years Sterling has taken part in music scenes from Miami to Chicago to San Francisco. Ironically, in order to focus on music he began freelancing in web development, until his efforts took him all the way to companies such as <a href="https://reverb.com/" target="_blank" className="inlineblock">Reverb.com</a> and <a href="https://apple.com/" target="_blank" className="inlineblock">Apple.</a> During his over 10 years in the tech world, he's still managed to run a music production company, and put out 7 releases from 5 different music projects, with many more releases on the horizon. Music has always been where he's wanted to be and now he's taking what he knows about tech to make the music around him and those who make it, better and more accessible.</p>
						</div>
					</div>

					<div className="press-content row">
						<div className="press-heading col col-8-of-12 push-2-of-12 col-small-12-of-12 push-small-0-of-12">
							<a className="btn btn--accept inlineblock right center-vertical" href={`${process.env.BASE_CLIENT_URL}/img/press/Rad Plaid Logos.zip`} target="_blank" download>Download<span className="small-hide"> Logos</span></a>
							<h2 className="typography-hero-headline hero-headline" style={{ marginLeft: '1rem' }}>
								<div className="hero-headline-copy">
									Logos
									<span></span>
								</div>
							</h2>
						</div>

						<div className="col col-4-of-12 col-small-6-of-12">
							<a href={`${process.env.BASE_CLIENT_URL}/img/press/Rad-Plaid-Logo-Purple.png`} target="_blank" download>
								<img src={`${process.env.BASE_CLIENT_URL}/img/press/Rad-Plaid-Logo-Purple.png`} width="100%" height="auto" />
							</a>
						</div>

						<div className="col col-4-of-12 col-small-6-of-12">
							<a className="background-transparent" href={`${process.env.BASE_CLIENT_URL}/img/press/Rad-Plaid-Logo-White.png`} target="_blank" download>
								<img src={`${process.env.BASE_CLIENT_URL}/img/press/Rad-Plaid-Logo-White.png`} width="100%" height="auto" />
							</a>
						</div>

						<div className="col col-4-of-12 col-small-12-of-12">
							<div className="col col-12-of-12">
								<a href={`${process.env.BASE_CLIENT_URL}/img/press/Rad-Plaid-Logotype-on-Purple.png`} target="_blank" download>
									<img src={`${process.env.BASE_CLIENT_URL}/img/press/Rad-Plaid-Logotype-on-Purple.png`} width="100%" height="auto" />
								</a>
							</div>
							<div className="col col-12-of-12">
								<a href={`${process.env.BASE_CLIENT_URL}/img/press/Rad-Plaid-Logotype-on-White.png`} target="_blank" download>
									<img src={`${process.env.BASE_CLIENT_URL}/img/press/Rad-Plaid-Logotype-on-White.png`} width="100%" height="auto" />
								</a>
							</div>
							<div className="col col-12-of-12">
								<a href={`${process.env.BASE_CLIENT_URL}/img/press/Rad-Plaid-Logotype-Purple.png`} target="_blank" download>
									<img src={`${process.env.BASE_CLIENT_URL}/img/press/Rad-Plaid-Logotype-Purple.png`} width="100%" height="auto" />
								</a>
							</div>
							<div className="col col-12-of-12">
								<a className="background-transparent" href={`${process.env.BASE_CLIENT_URL}/img/press/Rad-Plaid-Logotype-White.png`} target="_blank" download>
									<img src={`${process.env.BASE_CLIENT_URL}/img/press/Rad-Plaid-Logotype-White.png`} width="100%" height="auto" />
								</a>
							</div>
						</div>
					</div>

					<div className="press-content">
						<div className="press-heading row">
							<div className="col col-8-of-12 push-2-of-12 col-small-12-of-12 push-small-0-of-12">
								<a className="btn btn--accept inlineblock right center-vertical" href={`${process.env.BASE_CLIENT_URL}/img/press/Rad Plaid Product Screens.zip`} target="_blank" download>Download<span className="small-hide"> Screens</span></a>
								<h2 className="typography-hero-headline hero-headline" style={{ marginLeft: '1rem' }}>
									<div className="hero-headline-copy">
										Product
										<span></span>
									</div>
								</h2>
							</div>
						</div>

						{/*Screenshots*/}
						<div className="row product-screens">
							<div className="col col-4-of-12 col-small-12-of-12">
								<figure>
									<a href={`${process.env.BASE_CLIENT_URL}/img/press/product/rp-product.jpg`} target="_blank" download style={{ border: '4px solid #fff' }}>
										<img src={`${process.env.BASE_CLIENT_URL}/img/press/product/rp-product.jpg`} width="100%" height="auto" />
									</a>
									<figcaption>
										The Rad Plaid Flyer
									</figcaption>
								</figure>
							</div>
							<div className="col col-4-of-12 col-small-12-of-12">
								<figure>
									<a href={`${process.env.BASE_CLIENT_URL}/img/press/product/rp-product-mobile.jpg`} target="_blank" download>
										<img src={`${process.env.BASE_CLIENT_URL}/img/press/product/rp-product-mobile.jpg`} width="100%" height="auto" />
									</a>
									<figcaption>
										Mobile friendly
									</figcaption>
								</figure>
							</div>
							<div className="col col-4-of-12 col-small-12-of-12">
								<figure>
									<a href={`${process.env.BASE_CLIENT_URL}/img/press/product/rp-product-listen.jpg`} target="_blank" download>
										<img src={`${process.env.BASE_CLIENT_URL}/img/press/product/rp-product-listen.jpg`} width="100%" height="auto" />
									</a>
									<figcaption>
										Listen to the show before you go
									</figcaption>
								</figure>
							</div>

							<div className="col col-4-of-12 col-small-12-of-12">
								<figure>
									<a href={`${process.env.BASE_CLIENT_URL}/img/press/product/rp-product-similar.jpg`} target="_blank" download>
										<img src={`${process.env.BASE_CLIENT_URL}/img/press/product/rp-product-similar.jpg`} width="100%" height="auto" />
									</a>
									<figcaption>
										Local shows based on your most‑loved Spotify songs
									</figcaption>
								</figure>
							</div>
							<div className="col col-4-of-12 col-small-12-of-12">
								<figure>
									<a href={`${process.env.BASE_CLIENT_URL}/img/press/product/rp-product-follow.jpg`} target="_blank" download>
										<img src={`${process.env.BASE_CLIENT_URL}/img/press/product/rp-product-follow.jpg`} width="100%" height="auto" />
									</a>
									<figcaption>
										Stay in the know with the artists you follow
									</figcaption>
								</figure>
							</div>
							<div className="col col-4-of-12 col-small-12-of-12">
								<figure>
									<a href={`${process.env.BASE_CLIENT_URL}/img/press/product/rp-product-show-by-song.jpg`} target="_blank" download>
										<img src={`${process.env.BASE_CLIENT_URL}/img/press/product/rp-product-show-by-song.jpg`} width="100%" height="auto" />
									</a>
									<figcaption>
										Create show lineups from Spotify and SoundCloud songs
									</figcaption>
								</figure>
							</div>

							<div className="col col-4-of-12 col-small-12-of-12">
								<figure>
									<a href={`${process.env.BASE_CLIENT_URL}/img/press/product/rp-product-location.jpg`} target="_blank" download>
										<img src={`${process.env.BASE_CLIENT_URL}/img/press/product/rp-product-location.jpg`} width="100%" height="auto" />
									</a>
									<figcaption>
										Learn where the artists are from
									</figcaption>
								</figure>
							</div>
							<div className="col col-4-of-12 col-small-12-of-12">
								<figure>
									<a href={`${process.env.BASE_CLIENT_URL}/img/press/product/rp-product-notifications.jpg`} target="_blank" download>
										<img src={`${process.env.BASE_CLIENT_URL}/img/press/product/rp-product-notifications.jpg`} width="100%" height="auto" />
									</a>
									<figcaption>
										Stay in the know
									</figcaption>
								</figure>
							</div>
							<div className="col col-4-of-12 col-small-12-of-12">
								<figure>
									<a href={`${process.env.BASE_CLIENT_URL}/img/press/product/rp-product-listenlocal.jpg`} target="_blank" download>
										<img src={`${process.env.BASE_CLIENT_URL}/img/press/product/rp-product-listenlocal.jpg`} width="100%" height="auto" />
									</a>
									<figcaption>
										Eat local. Shop local. #ListenLocal
									</figcaption>
								</figure>
							</div>
						</div>
					</div>
				</div>

			</div>
		)
	}
}

export default Press
