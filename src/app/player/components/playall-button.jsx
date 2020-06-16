import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { request } from './../../helpers/request.jsx'
import { track } from './../../helpers/analytics.jsx'
import { IconPlay, IconPause } from './../../common/icons.jsx'
import PlayerActions from './../../redux/actions/player.jsx'

class PlayAllButton extends Component {
	static propTypes = {
		type: PropTypes.oneOf(['compact', 'full']),
		showId: PropTypes.string, // `slug`
		trackId: PropTypes.string
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

		let {
			showId,
			trackId,
			playTrackFromLineup
		} = this.props

		// No song found
		if (!trackId) {
			return
		}

		track('play', {
			action: 'play all',
			show_id: showId
		})

		return playTrackFromLineup({ showId, trackId })
	}

	render() {
		let {
			onPause,
			isPlaying,
			showId,
			trackId,
			currentTrack,
			trackPosition,
			className
		} = this.props

		let { isAttemptingToPlay } = this.state
		let type = this.props.type || ''
		let isCurrentTrack = null
		let style = {}

		if (currentTrack) {
			isCurrentTrack = (showId == currentTrack.show_id)
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
			<button data-tutorial-radius="48px" style={style} className={`btn-playall btn btn-circle${type} btn--primary btn-play icon-pause ${isLoading && 'btn--loading'} ${className}`} aria-label="Pause" onClick={onPause} data-track-id={trackId}>
				<IconPause />
			</button>
		) : (
			<button data-tutorial-radius="48px" style={style} className={`btn-playall btn btn-circle${type} btn-play icon-play ${className}`} aria-label="Play All" onClick={this.play} data-track-id={trackId}>
				<IconPlay />
			</button>
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
		onPlay: () => {
			dispatch(PlayerActions.play())
		},

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

export default connect(mapStateToProps, mapDispatchToProps)(PlayAllButton)
