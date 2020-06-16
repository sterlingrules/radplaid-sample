import isEqual from 'lodash/isEqual'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import { isMobile } from './../helpers/device-detect.js'
import { connect } from 'react-redux'
import { Howl } from 'howler'
import moment from 'moment'
import { getCurrentDate } from './../helpers'
import * as AppActions from './../redux/actions/app.jsx'
import PlayerActions from './../redux/actions/player.jsx'
import Notification from './../common/notification.jsx'
import Audio from './controllers/audio.jsx'
import SignupBanner from './../home/components/signupbanner.jsx'
import HelpButton from './../common/help.jsx'
import { IconPlay, IconPause, IconSkipNext, IconSkipPrevious } from './../common/icons.jsx'

class Player extends Component {
	static contextTypes = {
		store: PropTypes.object.isRequired
	}

	constructor(props) {
		super(props)

		this.state = {
			pathname: '',
			displayPlayer: true
		}

		this.toggleState = this.toggleState.bind(this)
		this.playPrevious = this.playPrevious.bind(this)
		this.playNext = this.playNext.bind(this)
		this.setSeeker = this.setSeeker.bind(this)
		this._togglePlayerDisplay = this._togglePlayerDisplay.bind(this)
		this._listen = this._listen.bind(this)

		this._currentTrackAudio = null
	}

	componentWillMount() {
		//
		// TODO: Set this to start when user interacts with the page
		//
		// This makes sure the first user
		// initiated sound will actually play
		if (typeof document === 'undefined') {
			return
		}

		const initPlayer = () => {
			let sound = new Howl({
			    src: 'data:audio/mp3;base64,SUQzAwAAAAAAFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/4xjAAAAAAlwAAAAAtASxAAAACAAATQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/4xjAMQAAAlwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/4xjAbAAAAlwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
			})

			sound.unload()
			document.removeEventListener('click', initPlayer)
		}

		document.addEventListener('click', initPlayer)
	}

	componentDidMount() {
		if (typeof window === 'undefined' || !isMobile) {
			return
		}

		// Let's minimize player on mobile input focus
		// const inputEls = document.querySelectorAll('input, textarea')

		// for (let i = 0; i < inputEls.length; i++) {
		// 	inputEls[i].addEventListener('focus', this._togglePlayerDisplay)
		// 	inputEls[i].addEventListener('blur', this._togglePlayerDisplay)
		// }
		this._inputListen()
	}

	_inputListen = (state = 'add') => {
		if (!isMobile) {
			return
		}

		// Let's minimize player on mobile input focus
		const inputEls = document.querySelectorAll('input, textarea')

		for (let i = 0; i < inputEls.length; i++) {
			if (!inputEls[i].getAttribute('data-listen')) {
				inputEls[i][`${state}EventListener`]('focus', this._togglePlayerDisplay)
				inputEls[i][`${state}EventListener`]('blur', this._togglePlayerDisplay)

				if (state === 'add') {
					inputEls[i].setAttribute('data-listen', true)
				}
				else {
					inputEls[i].removeAttribute('data-listen')
				}
			}
		}
	}

	componentWillUnmount() {
		if (typeof window === 'undefined' || !isMobile) {
			return
		}

		// Let's minimize player on mobile input focus
		this._inputListen('remove')
	}

	componentWillReceiveProps(nextProps) {
		let { currentTrack, isPlaying, onPause, history, pathname } = nextProps

		// If a track does not exist
		// due to error
		if (!currentTrack && !isEqual(currentTrack, this.props.currentTrack)) {
			return onPause()
		}

		// If there's nothing queued
		if (!currentTrack && isPlaying) {
			return onPause()
		}

		// Clear input handlers
		if (pathname !== this.props.pathname) {
			this._inputListen('remove')
		}

		// Set new currentTrack
		if (!isEqual(currentTrack, this.props.currentTrack)) {
			if (this._currentTrackAudio) {
				this._currentTrackAudio.destroy()
			}

			// Create Audio Instance
			this._currentTrackAudio = new Audio(
				currentTrack.preview_url,
				currentTrack.extension,
				currentTrack.source
			)

			// Set Audio listeners
			this._listen()
		}

		// Set playing state
		if (this._currentTrackAudio) {
			if (isPlaying !== this._currentTrackAudio.isPlaying) {
				if (isPlaying) {
					this._currentTrackAudio.play()
				}
				else {
					this._currentTrackAudio.pause()
				}
			}
		}
	}

	componentDidUpdate(prevProps, prevState) {
		let { pathname, isPlaying } = prevProps

		if (isPlaying !== this.props.isPlaying) {
			if (this.props.isPlaying) {
				this.setSeeker()
			}
		}

		// Set input handlers
		if (pathname !== this.props.pathname) {
			this._inputListen()
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			nextState.displayPlayer !== this.state.displayPlayer ||
			nextProps.user !== this.props.user ||
			nextProps.search !== this.props.search ||
			nextProps.pathname !== this.props.pathname ||
			nextProps.isPlaying !== this.props.isPlaying ||
			nextProps.viewportName !== this.props.viewportName ||
			nextProps.trackPosition !== this.props.trackPosition ||
			nextProps.searchDateFrom !== this.props.searchDateFrom ||
			nextProps.searchLocation !== this.props.searchLocation ||
			nextProps.searchQuery !== this.props.searchQuery ||
			nextProps.searchCost !== this.props.searchCost ||
			nextProps.searchTag !== this.props.searchTag ||
			!isEqual(nextProps.currentTrack, this.props.currentTrack) ||
			!isEqual(nextProps.playlist, this.props.playlist)
		)
	}

	toggleState() {
		let { isPlaying, onPause, onPlay } = this.props

		if (isPlaying) {
			onPause()
		}

		if (!isPlaying) {
			onPlay()
		}
	}

	playNext() {
		this._listen('off')
		this.props.playNextTrack()
	}

	playPrevious() {
		this._listen('off')
		this.props.playNextTrack(-1)
	}

	setSeeker() {
		let { isPlaying, onPlaying, trackPosition } = this.props

		if (isPlaying && this._currentTrackAudio) {
			let _currentPosition = this._currentTrackAudio.getCurrentPosition()

			if (trackPosition !== _currentPosition) {
				onPlaying(_currentPosition)
			}

			requestAnimationFrame(this.setSeeker)
		}
	}

	render() {
		let {
			user,
			playlist,
			isPlaying,
			trackPosition,
			currentTrack,
			viewportName,
			loadStart,
			showsLocation,
			pathname,
			search,
			searchQuery,
			searchLocation,
			searchDateFrom,
			searchCost,
			searchTag,
			isSearching
		} = this.props

		let show = currentTrack ? currentTrack.show : null
		let { displayPlayer } = this.state
		let canPlay = (playlist && displayPlayer)
		let dateFormat = (viewportName === 'small') ? 'ddd, MMM D, YYYY' : 'dddd, MMMM D, YYYY'
		let isSearchDateFromNotCurrent = (searchDateFrom !== getCurrentDate())
		let locationName = showsLocation ? showsLocation.name : ''
		// let isSearching = !!(searchQuery || searchCost || searchTag || searchLocation || isSearchDateFromNotCurrent)
		let isFirstTrack
		let isLastTrack
		let artistName
		let date
		let venue

		if (currentTrack) {
			let { artists } = currentTrack
			artistName = Array.isArray(artists) ? artists[0].name : artists.name
		}

		if (playlist && currentTrack) {
			isFirstTrack = (playlist[0].id === currentTrack.id)
			isLastTrack = (playlist[playlist.length - 1].id === currentTrack.id)
		}

		if (show) {
			date = moment(show.date).format(dateFormat)
			venue = show.venue.name
		}

		return (
			<section id="player" className={`player text-center ${canPlay ? 'player--active' : ''}`}>
				<HelpButton />
				<Notification />

				<SignupBanner
					user={user}
					pathname={pathname}
					locationName={locationName}
					isSearching={isSearching}
					loadStart={loadStart} />

				{canPlay && (
					<div className="grid">
						<div className="player-tracker">
							<div className="player-seeker" style={{ width: `${trackPosition}%` }}></div>
						</div>

						<button onClick={this.playPrevious} className={`btn btn-previous ${isFirstTrack && 'btn--disabled'}`} aria-label="Previous Track">
							<IconSkipPrevious />
						</button>

						{isPlaying ? (
							<button className={`btn btn-pause`} aria-label="Pause" onClick={this.toggleState}>
								<IconPause />
							</button>
						) : (
							<button className={`btn btn-play`} aria-label="Play" onClick={this.toggleState}>
								<IconPlay />
							</button>
						)}

						<button onClick={this.playNext} className={`btn btn-next ${isLastTrack && 'btn--disabled'}`} aria-label="Next Track">
							<IconSkipNext />
						</button>

						{(artistName && currentTrack) && (
							<div className="player-display">
								{show && (<Link to={`/shows/${show.slug}`} className="typography-small text-ellipsis">{`${date} @ ${venue}`}</Link>)}
								<div className="text-ellipsis">
									<span className="player-artistname">{artistName}</span>
									<span className="player-trackname text-ellipsis">
										{currentTrack.name} ({
											currentTrack.source === 'spotify' ?
												moment(30000).format('m:ss') :
												moment(currentTrack.duration_ms).format('m:ss')
										})
									</span>
								</div>
							</div>
						)}
					</div>
				)}
			</section>
		)
	}

	//
	// PRIVATE
	//
	_togglePlayerDisplay(evt) {
		this.setState({ displayPlayer: (evt.type === 'blur') })
	}

	_listen(method = 'once') {
		if (!this._currentTrackAudio) {
			return
		}

		this._currentTrackAudio[method]('end', this.playNext)
		this._currentTrackAudio[method]('error', (evt) => {
			this.props.onPause()
			this.props.setNotification({
				status: 'error',
				title: 'Player Problems',
				message: 'Oh no! We were unable to play your song preview. Please try again, or check your internet connection.'
			})
		})
	}
}

const mapStateToProps = ({ app, user, shows, player, routing }) => ({
	user: user.user,

	viewportName: app.viewportName,
	searchQuery: app.searchQuery,
	searchLocation: app.searchLocation,
	searchDateFrom: app.searchDateFrom,
	searchCost: app.searchCost,
	searchTag: app.searchTag,
	isSearching: app.isSearching,

	showsLocation: shows.showsLocation,

	currentTrack: player.currentTrack,
	playlist: player.playlist,
	isPlaying: player.isPlaying,
	trackPosition: player.trackPosition,

	pathname: routing.location ? routing.location.pathname : '',
	search: routing.location ? routing.location.search : ''
})

const mapDispatchToProps = dispatch => {
	return {
		loadStart: () => {
			dispatch(AppActions.loadStart())
		},

		setNotification: (data) => {
			dispatch(AppActions.setNotification(data))
		},

		playNextTrack: (direction) => {
			dispatch(PlayerActions.playNextTrack(direction))
		},

		onPlay: (state) => {
			dispatch(PlayerActions.play(state))
		},

		onPause: (state) => {
			dispatch(PlayerActions.pause(state))
		},

		onPlaying: (trackPosition) => {
			dispatch(PlayerActions.playing(trackPosition))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Player)
