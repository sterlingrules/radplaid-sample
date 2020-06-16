import URI from 'urijs'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import find from 'lodash/find'
import clone from 'lodash/clone'
import moment from 'moment'

import { IconLocationOff } from './../../common/icons.jsx'
import { VENUE_RESULTS_KEY } from './../../constants.jsx'
import { delay, verifyProtocol } from './../../helpers'
import { request } from './../../helpers/request.jsx'

class StepFour extends PureComponent {
	static propTypes = {
		addShow: PropTypes.object
	}

	constructor(props) {
		super(props)

		let { userLocation } = this.props
		let _prevVenueResults = JSON.parse(localStorage.getItem(VENUE_RESULTS_KEY) || '[]')
		let location = { name: '', coords: [] }

		if (userLocation && userLocation.name) {
			location = (userLocation.name === 'Portland') ? { name: 'Portland, ME' } : userLocation
		}

		this.state = {
			venue: '',
			isSearching: true,
			venueResults: _prevVenueResults,
			location
		}
	}

	componentDidMount() {
		const { onInputChange, userLocation } = this.props
		const { livestream_url, venue } = this.props.addShow
		const coords = (userLocation && userLocation.coords)
			? userLocation.coords
			: [ 0, 0 ]

		// Make sure livestream_url is set
		if (livestream_url && (!venue || venue && !venue.name)) {
			const valid_url = verifyProtocol(livestream_url)
			const _livestream_url = new URI(valid_url)
			const name = _livestream_url.domain() || livestream_url

			onInputChange({
				target: {
					name: 'venue',
					value: {
						id: null,
						type: 'livestream',
						name,
						url: valid_url,
						categories: [],
						location: {
							address: name,
							lat: coords[0] || 0,
							lng: coords[1] || 0,
						},
					},
				}
			})
		}
	}

	searchVenues = () => {
		let _venueResults = clone(this.state.venueResults)

		let { loadStart, loadEnd } = this.props
		let { location } = this.state
		let { venue } = this.state
		let settings = {
			path: `/venues/search?q=${encodeURIComponent(venue)}`,
		}

		loadStart()

		this.setState({ isSearching: false })

		request(settings)
			.end((err, reply) => {
				 _venueResults = reply.body ? reply.body.results : []

				localStorage.setItem(VENUE_RESULTS_KEY, JSON.stringify(_venueResults || []))

				loadEnd()

				this.setState({
					isSearching: true,
					venueResults: _venueResults
				})
			})
	}

	onSelectVenue = ({ target }) => {
		let { id } = target.dataset
		let { onInputChange } = this.props
		let { venueResults } = this.state

		return onInputChange({
			target: {
				name: 'venue',
				value: find(venueResults, { id })
			}
		})
	}

	onSearchVenue = ({ target }) => {
		let value = (target.name == 'location') ? { name: target.value, coords: [] } : target.value

		this.setState({ [target.name]: value })

		delay(() => {
			this.searchVenues()
		}, 500)
	}

	render() {
		let { isSearching, venueResults = [], venue, location } = this.state
		let { addShow, onVenueSelect, onShowSubmit, progress } = this.props
		let _venue = addShow.venue || { id: null }

		{/* Step Four */}
		return (
			<div className="row">
				<div className="row">
					<div id="add-step-four" className="addshow-step col col-6-of-12 push-3-of-12 col-medium-6-of-8 medium-un-push col-small-12-of-12">
						<div className="bubble">
							<ul className="form-table">
								<li>
									<label className="form-label form-label--center">Search</label>
									<input type="text" name="venue" autoComplete="off" className="form-input text-right" value={venue} placeholder="venue name, address, or phone" onChange={this.onSearchVenue} />
								</li>
								{/*<li>
									<label className="form-label form-label--center">Location</label>
									<input type="text" name="location" autoComplete="off" className="form-input text-right" value={location.name} placeholder="City, State or Zip" onChange={this.onSearchVenue} />
								</li>*/}

								{/* Venues */}
								<ul className="playlist playlist--canselect">
									{venueResults.map((venue, index) => {
										let address = venue.location

										return (
											<li className={`playlist-info ${(venue.id == _venue.id || venue.id == _venue.foursquare_id) && 'playlist-info--selected'}`} data-id={venue.id} key={venue.id} onClick={this.onSelectVenue}>
												<div className="playlist-track">
													<div className="playlist-artist typography-body-headline">{venue.name}</div>
													<address className="playlist-title typography-small">
														{address.address && (
															<span>{address.address}<br /></span>
														)}

														{(address.city && address.state) && (
															<span>
																{address.city && (address.city)}
																{(address.city && address.state) && (',')}
															</span>
														)}

														{address.state && (
															<span>{address.state}<br /></span>
														)}
													</address>
												</div>
											</li>
										)
									})}

									{(isSearching && !venueResults.length && (progress.length === 0) && venue) && (
										<li>
											<div className="bubble-copy" style={{ padding: '3rem 2rem' }}>
												<IconLocationOff className="icon--large center fill-copy" />
												<h3 className="typography-small-headline text-center text-uppercase" style={{ margin: '1rem 0' }}>Unable to find '{venue}' at this location</h3>

												<ul className="list list--default" style={{ marginBottom: '1rem' }}>
													<li>Make sure you're searching the venue's correct location.</li>
													<li>Double-check your spelling is correct.</li>
												</ul>

												{/*<p>Still can't find your location? Add it to <a href="https://foursquare.com/add-place" target="_blank" className="strong">Foursquare</a> then try searching again.</p>*/}
												<p>Still can't find your location? Reach out to us at <a href="mailto:hello@getradplaid.com" target="_blank" className="strong">hello@getradplaid.com</a>.</p>
											</div>
										</li>
									)}
								</ul>

							</ul>
						</div>

						<div className="text-center">
							<figure className="logo-powered-by-google"></figure>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default StepFour
