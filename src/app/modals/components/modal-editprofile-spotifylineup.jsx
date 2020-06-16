import clone from 'lodash/clone'
import React, { Component } from 'react'
import ShowLineup from './../../shows/components/showlineup.jsx'
import Carousel from './../../common/carousel.jsx'
import { Loader } from './../../common/loader.jsx'
import { track } from './../../helpers/analytics.jsx'
import { request } from './../../helpers/request.jsx'
import { delay } from './../../helpers'

const LOAD_NAME = 'search:spotify'

export const ARTIST_LIMIT = 3

class SpotifyLineup extends Component {
	constructor(props) {
		super(props)

		this.state = {
			lineupQuery: '',
			searchResults: []
		}

		this.onSelect = this.onSelect.bind(this)
		this.onSortChange = this.onSortChange.bind(this)
		this.onSortRemove = this.onSortRemove.bind(this)
		this._search = this._search.bind(this)
	}

	onSelect(artist) {
		let {
			lineup,
			onLineupSelect,
			setNotification,
			viewportName,
			loadEnd
		} = this.props

		let _lineup = clone(lineup) || []
		let hasArtist = false

		loadEnd(null, LOAD_NAME)

		for (let i = 0; i < lineup.length; i++) {
			if (lineup[i].artists[0].id == artist.artists[0].id) {
				hasArtist = true
				break
			}
		}

		// The artist has not been added yet
		if (!hasArtist) {
			_lineup.push(artist)

			this.setState({
				lineupQuery: '',
				searchResults: [],
				lineup: _lineup
			})

			onLineupSelect({
				target: {
					name: 'lineup',
					value: _lineup,
					valid: (_lineup.length >= ARTIST_LIMIT)
				}
			})

			this.searchElement.focus()

			if (viewportName === 'small') {
				setNotification({
					status: 'info',
					message: `${artist.artists[0].name} added to lineup`
				})
			}
		}
	}

	onSortChange(evt) {
		let { onLineupSelect } = this.props

		// If we don't have new items return
		if (!evt.items || !evt.items.length) {
			return
		}

		onLineupSelect({
			target: {
				name: 'lineup',
				value: evt.items
			}
		})
	}

	onSortRemove({ target }) {
		let { lineup, onLineupSelect } = this.props
		let _lineup = clone(lineup)

		_lineup.splice(target.dataset.index, 1)

		onLineupSelect({
			target: {
				name: 'lineup',
				value: _lineup
			}
		})
	}

	_search({ target }) {
		let { name, value } = target
		let { loadStart, loadEnd, setNotification  } = this.props
		let settings = {
			path: `/artists/search/spotify?q=${encodeURIComponent(`${value || ''}`.trim())}`
		}

		loadStart(LOAD_NAME)

		this.setState({
			lineupQuery: value,
			searchResults: []
		})

		delay(() => {
			if (!value || value === '') {
				return loadEnd(null, LOAD_NAME)
			}

			request(settings)
				.end((err, reply) => {
					loadEnd(null, LOAD_NAME)

					let body = reply ? reply.body : null
					let searchValue = this.searchElement ? this.searchElement.value.trim() : ''
					let artists = []

					if (err || !body || body.type === 'error') {
						return setNotification({
							status: 'error',
							message: `Sorry, we had trouble searching Spotify, please try again`
						})
					}

					//
					// Stop request if query doesn't match user input
					//
					if (searchValue !== body.query &&
						searchValue !== '') {
						return
					}

					this.setState({
						searchResults: body.artists || []
					})

					// Track Results
					if (Array.isArray(body.artists) && body.artists.length) {
						body.artists.map((artist, index) => {
							artists.push({
								name: artist.artists[0].name,
								title: artist.name
							})
						})
					}

					track('search', {
						action: 'search artists',
						results: artists,
						value
					})
				})
		}, 500)
	}

	render() {
		let { lineup, progress, progressName, placeholder, onLineupSelect } = this.props
		let { lineupQuery, searchResults } = this.state
		let _selectedArtistIds = lineup.map((artist, index) => {
			return artist.id
		})

		return (
			<form
				action="#"
				onSubmit={(evt) => {
					evt.preventDefault()
					evt.stopPropagation()
				}}>
				{/*Lineup Search*/}
				<ul className="list form-table">
					<li style={{ marginBottom: '1rem' }}>
						<label className="form-label form-label--center form-label--overlay">Search</label>
						<input
							ref={node => this.searchElement = node}
							type="text"
							name="search"
							className="form-input text-right"
							value={lineupQuery}
							placeholder={placeholder || 'artist, track, or album'}
							onChange={this._search}
							autoComplete="off"
							autoCorrect="off"
							autoCapitalize="off"
							spellCheck="false" />
						<div className="form-focus"></div>
					</li>

					{searchResults.length > 0 ? (
						<div>
							<ShowLineup
								id="showlineup-editprofile-spotify"
								type="carousel"
								carouselOptions={{
									perView: 1,
									keyboard: true,
									peek: {
										before: 0,
										after: 0
									},
									breakpoints: {
										767: {
											perView: 1,
											peek: {
												before: 0,
												after: 32
											}
										}
									}
								}}
								onSelect={this.onSelect}
								isSelected={_selectedArtistIds}
								lineup={searchResults || []}
								spotifyTrack={[]} />
						</div>
					) : (searchResults.length === 0 && lineupQuery && progress.length === 0) ? (
						<li className="text-center" style={{ paddingBottom: '1rem' }}>
							<div className="bubble-copy">{`No results for '${lineupQuery}'`}</div>
						</li>
					) : (progress.indexOf(LOAD_NAME) >= 0) && (
						<div style={{ padding: '2rem 0' }}>
							<Loader size="small" />
						</div>
					)}
				</ul>

				{/*Lineup*/}
				<div style={{ paddingBottom: '1rem' }}>
					{(lineup.length > 0) ? (
						<ShowLineup isSortable={true} onSortChange={this.onSortChange} onSortRemove={this.onSortRemove} lineup={lineup} spotifyTrack={[]} />
					) : (
						<ul className="playlist">
							{[ 1, 2, 3 ].map((element, index) => (
								<li className="playlist-info" key={index}>
									<figure className="playlist-artistartwork playlist-empty"></figure>
									<div className="playlist-track">
										<div className="playlist-artist playlist-empty"></div>
										<div className="playlist-title playlist-empty"></div>
									</div>
								</li>
							))}
						</ul>
					)}
				</div>
			</form>
		)
	}
}

export default SpotifyLineup
