import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { sortable } from 'react-sortable'
import uniq from 'lodash/uniq'
import union from 'lodash/union'
import reduce from 'lodash/reduce'
import isArray from 'lodash/isArray'
import isEqual from 'lodash/isEqual'
import clone from 'lodash/clone'
import moment from 'moment'
import { request } from './../../helpers/request.jsx'
import { delay, toTitleCase, getValues } from './../../helpers'
import InputGenre from './../../forms/input-genre.jsx'
import ShowLineup from './../../shows/components/showlineup.jsx'

class StepThree extends Component {
	static propTypes = {
		progress: PropTypes.bool,
		addShow: PropTypes.object,
		onInputChange: PropTypes.func,
		onLineupSelect: PropTypes.func
	}

	constructor(props) {
		super(props)

		let currentTime = new Date().getTime()

		this.state = {
			hasSearchedLocal: false,
			hasSearchedSpotify: false,
			hasSearchedSoundCloud: false,

			lineupQuery: '',

			searchLocalResults: [],
			searchSpotifyResults: [],
			searchSoundCloudResults: [],

			createArtistId: 0,
			genreValue: []
		}
	}

	componentDidUpdate(prevProps, prevState) {
		let { loadEnd, progress, addShow } = prevProps
		let {
			hasSearchedLocal,
			hasSearchedSpotify,
			hasSearchedSoundCloud
		} = this.state

		if (hasSearchedLocal && hasSearchedSpotify && hasSearchedSoundCloud && progress.length > 0) {
			loadEnd()
		}

		if (!isEqual(addShow.lineup, this.props.addShow.lineup)) {
			this.setGenres()
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		const nextShow = nextProps.addShow
		const show = this.props.addShow

		return (
			!isEqual(nextProps.progress, this.props.progress) ||
			(isArray(nextShow.lineup) && isArray(show.lineup) && nextShow.lineup.length !== show.lineup.length) ||
			nextState.lineupQuery !== this.state.lineupQuery ||
			nextState.hasSearchedLocal !== this.state.hasSearchedLocal ||
			nextState.hasSearchedSpotify !== this.state.hasSearchedSpotify ||
			nextState.hasSearchedSoundCloud !== this.state.hasSearchedSoundCloud ||
			!isEqual(nextState.searchLocalResults, this.state.searchLocalResults) ||
			!isEqual(nextState.searchSpotifyResults, this.state.searchSpotifyResults) ||
			!isEqual(nextState.searchSoundCloudResults, this.state.searchSoundCloudResults) ||
			!isEqual(nextState.genreValue, this.state.genreValue) ||
			nextState.createArtistId !== this.state.createArtistId
		)
	}

	onSelect = (artist) => {
		let {
			addShow,
			onLineupSelect,
			setNotification,
			viewportName,
			loadEnd
		} = this.props

		let hasArtist = false

		loadEnd()

		for (let i = 0; i < addShow.lineup.length; i++) {
			if (addShow.lineup[i].artists[0].id == artist.artists[0].id) {
				hasArtist = true
				break
			}
		}

		// The artist has not been added yet
		if (!hasArtist) {
			this.setState({
				lineupQuery: '',
				searchLocalResults: [],
				searchSpotifyResults: [],
				searchSoundCloudResults: []
			})

			this.searchElement.focus()

			if (viewportName === 'small') {
				setNotification({
					status: 'info',
					message: `${artist.artists[0].name} added to lineup`
				})
			}

			onLineupSelect(artist)
		}
	}

	onSearchLineup = (evt) => {
		let { name, value } = evt.target

		this.setState({
			hasSearchedLocal: false,
			hasSearchedSpotify: false,
			hasSearchedSoundCloud: false,
			lineupQuery: value
		})

		delay(() => {
			if (!value || value === '') {
				return
			}

			this._search('spotify', value)
			this._search('soundcloud', value)
			this._search('local', value)
		}, 500)
	}

	sortChange = (evt) => {
		// If we don't have new items return
		if (!evt.items || !evt.items.length) {
			return
		}

		this.props.onInputChange({
			target: {
				name: 'lineup',
				value: evt.items
			}
		})
	}

	sortRemove = ({ target }) => {
		let { addShow, onInputChange } = this.props
		let _lineup = clone(addShow.lineup)

		_lineup.splice(target.dataset.index, 1)

		onInputChange({
			target: {
				name: 'lineup',
				value: _lineup
			}
		})
	}

	setGenres = () => {
		let { addShow, onInputChange } = this.props
		let _lineup = clone(addShow.lineup) || []
		let _genres = []

		_lineup.forEach((track, index) => {
			_genres = uniq(union(_genres, reduce(track.artists, (total, value) => {
				return union(total, value.genres)
			}, [])))
		})

		onInputChange({
			target: {
				name: 'genres',
				value: _genres,
			}
		})
	}

	createArtist = (evt) => {
		let { createArtistId, lineupQuery, genreValue } = this.state
		let artist = {
			id: String(createArtistId),
			create: true, // not sure if we need this
			artists: [{
				id: String(createArtistId),
				name: toTitleCase(lineupQuery),
				genres: getValues(genreValue, 'label'),
				images: [],
				source: null,
				source_id: String(createArtistId)
			}],
			name: null,
			preview_url: null,
			duration_ms: 0,
			source: null,
			source_id: String(createArtistId)
		}

		this.onSelect(artist)
		this.setState({
			createArtistId: createArtistId + 1,
			genreValue: []
		})
	}

	genreChange = (value) => {
		this.setState({ genreValue: value })
	}

	_filterLocal = (results) => {
		let { searchLocalResults } = this.state
		let localIds = []

		for (let i = 0; i < searchLocalResults.length; i++) {
			let localResult = searchLocalResults[i]

			if (localResult.spotify_id) {
				localIds.push(localResult.spotify_id)
			}

			if (localResult.soundcloud_id) {
				localIds.push(localResult.soundcloud_id)
			}
		}

		return results.filter((result) => {
			return (localIds.indexOf(result.source_id) < 0)
		})
	}

	_search = (type, value) => {
		let { loadStart, setNotification } = this.props
		let settings = {
			path: `/artists/search${type !== 'local' ? `/${type}` : ''}?q=${encodeURIComponent(value)}`
		}

		loadStart()

		let resultKey = 'Local'

		switch(type) {
			case 'spotify':
				resultKey = 'Spotify'
				break
			case 'soundcloud':
				resultKey = 'SoundCloud'
				break
		}

		this.setState({
			[`search${resultKey}Results`]: []
		})

		request(settings)
			.end((err, reply) => {
				let body = reply ? reply.body : null

				if (err || !body || body.type === 'error') {
					setNotification({
						status: 'error',
						message: `Sorry, we had trouble searching ${resultKey === 'Local' ? `for ${value}` : resultKey}, please try again`
					})

					return this.setState({
						[`hasSearched${resultKey}`]: true
					})
				}

				//
				// Stop request if query doesn't match user input
				//
				if (this.searchElement &&
					this.searchElement.value !== body.query &&
					this.searchElement.value !== '') {
					return
				}

				this.setState({
					[`hasSearched${resultKey}`]: true,
					[`search${resultKey}Results`]: body.artists || []
				})
			})
	}

	render() {
		let { addShow, progress } = this.props
		let {
			start_time,
			searchLocalResults,
			searchSpotifyResults,
			searchSoundCloudResults,
			hasSearchedLocal,
			hasSearchedSpotify,
			hasSearchedSoundCloud,
			lineupQuery,
			genreValue,
			createArtistId
		} = this.state

		let lineup = addShow.lineup || [{ start_time: start_time }]
		let searchComplete = (hasSearchedLocal && hasSearchedSpotify && hasSearchedSoundCloud)

		let _selectedArtistIds = addShow.lineup.map((artist, index) => {
			return artist.id
		})

		let _selectedArtistNames = addShow.lineup.map((artist, index) => {
			return artist.artists[0].name
		})

		let searchResultCount = 0

		if (searchLocalResults || searchSpotifyResults || searchSoundCloudResults) {
			searchResultCount = searchLocalResults.length + searchSpotifyResults.length + searchSoundCloudResults.length
		}

		return (
			<div id="add-step-three" className="row">
				<div className="row">
					<div className="col col-5-of-12 col-medium-3-of-8 col-small-12-of-12">
						{/**
						  * Search results
						  */}
						<div className="bubble bubble--visible">
							<ul className={`list form-table ${searchResultCount ? 'list--scrollable' : ''}`}>
								<li>
									<label className="form-label form-label--center form-label--overlay">Search</label>
									<input
										ref={node => this.searchElement = node}
										type="text"
										name="search"
										className="form-input text-right"
										value={lineupQuery}
										placeholder="artist, track, or album"
										onChange={this.onSearchLineup}
										autoComplete="off"
										autoCorrect="off"
										autoCapitalize="off"
										spellCheck="false" />
								</li>

								{searchResultCount ? (
									<div className="list-scroll">
										<div className="list-scrollcontent">
											{searchLocalResults.length ? (
												<React.Fragment>
													<li className="list-subheadline background-gradient color-white">Rad Plaid</li>
													<ShowLineup onSelect={this.onSelect} isSelected={_selectedArtistIds} lineup={searchLocalResults || []} spotifyTrack={[]} />
												</React.Fragment>
											) : (<li />)}
											{searchSpotifyResults.length ? (
												<React.Fragment>
													<li className="list-subheadline background-spotify color-white">Spotify</li>
													<ShowLineup onSelect={this.onSelect} isSelected={_selectedArtistIds} lineup={this._filterLocal(searchSpotifyResults) || []} spotifyTrack={[]} />
												</React.Fragment>
											) : (<li />)}
											{searchSoundCloudResults.length ? (
												<React.Fragment>
													<li className="list-subheadline background-soundcloud color-white">SoundCloud</li>
													<ShowLineup onSelect={this.onSelect} isSelected={_selectedArtistIds} lineup={this._filterLocal(searchSoundCloudResults) || []} spotifyTrack={[]} />
												</React.Fragment>
											) : (<li />)}
										</div>
									</div>
								) : !lineupQuery ? (
									<li>
										<div className="bubble-copy text-center" style={{ padding: '2rem 0' }}>
											<h3 className="typography-body-subheadline">What's your lineup?</h3>
										</div>
									</li>
								) : (searchComplete && !searchResultCount && lineupQuery && progress.length === 0) && (
									<li className="text-center">
										<div className="bubble-copy">{`No results for '${lineupQuery}'`}</div>
									</li>
								)}
							</ul>
						</div>

						{/**
						  * Create a new artist
						  */}
						{(searchComplete && lineupQuery && _selectedArtistNames.indexOf(toTitleCase(lineupQuery)) < 0 && progress.length === 0) && (
							<React.Fragment>
								<div className="typography-notice bubble-copy">
									Artist not in above search results?
								</div>
								<div className="bubble bubble--visible">
									<ul className="playlist">
										<li className="playlist-info playlist-addartist">
											<div><figure className="playlist-artistartwork"></figure></div>
											<div className="playlist-track" style={{ overflow: 'visible' }}>
												<div className="playlist-artist">{toTitleCase(lineupQuery)}</div>
												<InputGenre value={genreValue} onInputChange={this.genreChange} />
												<button onClick={this.createArtist} className={`btn btn--primary btn--small ${genreValue.length ? 'btn--primary' : 'hide'}`}>
													Create and add to lineup
												</button>
											</div>
										</li>
									</ul>
								</div>
							</React.Fragment>
						)}
					</div>

					{/**
						* Lineup
						*/}
					<div className="col col-7-of-12 col-medium-5-of-8 col-small-12-of-12">
						<div id="add-step-three" className="addshow-step">
							<div className="typography-notice bubble-copy hide small-show">
								<div className="typography-small-headline">Event Lineup</div>
							</div>
							<div className="bubble bubble--visible">
								{addShow.lineup.length > 0 ? (
									<div>
										{addShow.lineup.length >= 2 && (
											<div className={`text-center typography-notice`} style={{ paddingTop: '0' }}>Drag an artist below to reorder.</div>
										)}
										<ShowLineup isSortable={true} onSortChange={this.sortChange} onSortRemove={this.sortRemove} lineup={addShow.lineup} spotifyTrack={[]} />
									</div>
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
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default StepThree
