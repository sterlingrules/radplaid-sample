import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isMobile } from './../../helpers/device-detect'
import { request } from './../../helpers/request.jsx'
import { track } from './../../helpers/analytics.jsx'
import { IconPlay, IconPause } from './../../common/icons.jsx'
import PlayerActions from './../../redux/actions/player.jsx'

export class PlayButton extends Component {
	static propTypes = {
		type: PropTypes.string,
		showId: PropTypes.string,
		trackId: PropTypes.string,
	}

	constructor(props) {
		super(props)

		this.state = {
			isPlaying: false,
			isAttemptingToPlay: false
		}

		this.play = this.play.bind(this)
		this._prevTrackPosition = null
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.isPlaying !== this.props.isPlaying) {
			this.setState({ isAttemptingToPlay: false })
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			nextState.isAttemptingToPlay !== this.state.isAttemptingToPlay ||
			nextProps.trackPosition !== this.props.trackPosition ||
			nextProps.currentTrack !== this.props.currentTrack ||
			nextProps.isPlaying !== this.props.isPlaying ||
			nextProps.playlist !== this.props.playlist
		)
	}

	play(evt) {
		evt.preventDefault()

		if (this.state.isAttemptingToPlay) {
			return
		}

		this.setState({
			isAttemptingToPlay: true
		})

		let { showId, trackId, spotifyTrack } = this.props
		let { playTrackFromLineup, playFromPreviewUrl, playTrackFromAddShowReview } = this.props
		let { isPlaying } = this.state

		if (spotifyTrack) {
			return playFromPreviewUrl(spotifyTrack)
		}

		//
		// For now, let's assume a null show id means
		// the user is currently adding a show — is there
		// a safer way to confirm this?
		//
		if (!showId) {
			return playTrackFromAddShowReview({ trackId })
		}

		track('play', {
			action: 'play',
			show_id: showId,
			track_id: trackId
		})

		return playTrackFromLineup({ showId, trackId })
	}

	render() {
		let { onPause, isPlaying, source, showId, trackId, currentTrack, trackPosition } = this.props
		let { isAttemptingToPlay } = this.state
		let type = this.props.type || ''
		let isCurrentTrack = null
		let style = {}

		if (currentTrack) {
			source = currentTrack.source
			isCurrentTrack = (
				trackId == currentTrack.id &&
				showId == currentTrack.show_id
			)
		}

		if (isAttemptingToPlay) {
			style = {
				boxShadow: 'none',
				backgroundColor: '#d3e1e7',
				borderColor: '#d3e1e7'
			}
		}

		let isLoading = (isCurrentTrack && trackPosition === this._prevTrackPosition)

		this._prevTrackPosition = trackPosition

		return ((isCurrentTrack && isPlaying) ? (
			isMobile ? (
				<button data-tutorial-radius="48px" className={`btn btn-circle${type} btn--primary btn-play icon-pause ${isLoading && 'btn--loading'}`} aria-label="Pause" onTouchEnd={onPause} data-track-id={trackId}>
					<IconPause />
				</button>
			) : (
				<button data-tutorial-radius="48px" className={`btn btn-circle${type} btn--primary btn-play icon-pause ${isLoading && 'btn--loading'}`} aria-label="Pause" onClick={onPause} data-track-id={trackId}>
					<IconPause />
				</button>
			)
		) : (
			isMobile ? (
				<button data-tutorial-radius="48px" className={`btn btn-circle${type} btn-play icon-play`} aria-label="Play" style={style} onTouchEnd={this.play} data-track-id={trackId}>
					<IconPlay />
				</button>
			) : (
				<button data-tutorial-radius="48px" className={`btn btn-circle${type} btn-play icon-play`} aria-label="Play" style={style} onClick={this.play} data-track-id={trackId}>
					<IconPlay />
				</button>
			)
		))
	}
}

const mapStateToProps = ({ player }) => ({
	playlist: player.playlist,
	isPlaying: player.isPlaying,
	trackPosition: player.trackPosition,
	currentTrack: player.currentTrack
})

const mapDispatchToProps = dispatch => {
	return {
		onPause: () => {
			dispatch(PlayerActions.pause())
		},

		playFromPreviewUrl: (track) => {
			dispatch(PlayerActions.playTrackFromPreviewUrl(track))
		},

		playTrackFromLineup: (track) => {
			dispatch(PlayerActions.playTrackFromLineup(track))
		},

		playTrackFromAddShowReview: (track) => {
			dispatch(PlayerActions.playTrackFromAddShowReview(track))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayButton)
