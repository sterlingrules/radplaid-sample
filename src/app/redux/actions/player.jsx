import * as TYPES from './../types.jsx'
import clone from 'lodash/clone'
import find from 'lodash/find'
import { request } from './../../helpers/request.jsx'
import { track } from './../../helpers/analytics.jsx'
import { existsWithKey } from './../../helpers'
import { isMobile } from './../../helpers/device-detect'
import { store } from './../store.jsx'

const fetchShow = (id) => {
	return new Promise((resolve, reject) => {
		if (!id) {
			return resolve([])
		}

		let show = clone(find(store.getState().app.shows, { slug: id }))

		if (show) {
			return resolve(show)
		}

		request({ path: `/shows/${id}` })
			.end((err, reply) => {
				if (err) {
					return reject(err)
				}

				show = reply.body

				return resolve((show.length) ? show[0] : show)
			})
	})
}

const fetchTrack = (id) => {
	return new Promise((resolve, reject) => {
		request({ path: `/tracks/${id}` })
			.end((err, reply) => {
				if (err) {
					return reject(err)
				}

				return resolve(reply.body)
			})
	})
}

const PlayerActions = {
	/**
	 * Starts playing a track from a `preview_url`
	 *
	 * @param {object} - track
	 *      @param {object.string} track.id - Spotify track id
	 *      @param {object.string} track.name - Song title
	 *      @param {object.object} track.artists - Song artist object
	 *      @param {object.number} track.duration_ms - Duration in milliseconds
	 *      @param {object.string} track.preview_url - Spotify URL
	 */
	playTrackFromPreviewUrl(track) {
		return (dispatch, getState) => {
			let lineup = [{
				name: track.name,
				artists: track.artists,
				duration_ms: track.duration_ms,
				id: track.id,
				show_id: null,
				preview_url: track.preview_url,
				source: track.source,
				active: true
			}]

			dispatch(PlayerActions.setPlaylist(lineup))
			dispatch(PlayerActions.setCurrentTrackById(track.id))
			dispatch(PlayerActions.play())
		}
	},

	/**
	 * Starts playing a track from a show (lineup)
	 *
	 * @param {object} - track
	 *      @param {object.string} track.showId - Show id
	 *      @param {object.string} track.trackId - Track id
	 */
	playTrackFromLineup(track) {
		return (dispatch, getState) => {
			let { showId, trackId } = track

			fetchShow(showId)
				.then((show) => {
					dispatch(PlayerActions.startPlayer(trackId, show))
				})
				.catch(err => console.log(err))
		}
	},

	/**
	 * Starts playing a track from add show review
	 *
	 * @param {object} - track
	 *      @param {object.string} track.showId - Show id
	 *      @param {object.string} track.trackId - Track id
	 */
	playTrackFromAddShowReview(track) {
		return (dispatch, getState) => {
			let { trackId } = track
			let { addShow } = getState().shows

			dispatch(PlayerActions.startPlayer(trackId, addShow))
		}
	},

	/**
	 * Pauses and removes current track state from player.
	 */
	stopPlayer() {
		return (dispatch, getState) => {
			dispatch(PlayerActions.pause())
			dispatch(PlayerActions.playing(0))
			dispatch(PlayerActions.setPlaylist(null))
		}
	},

	/**
	 * Starts the player once we have a lineup source
	 *
	 * @param {string} trackId - Spotify track id
	 * @param {object} show - Show object with at least a `lineup` key
	 */
	startPlayer(trackId = null, show) {
		return (dispatch, getState) => {
			let lineup = show.lineup
			let track = lineup ? find(lineup, { id: trackId }) : null

			// we only have one song
			if (track && !lineup) {
				lineup = [{
					name: track.name,
					artists: track.artists,
					duration_ms: track.duration_ms,
					id: track.id,
					show_id: null,
					preview_url: track.preview_url,
					source: track.source
				}]
			}
			else {
				for (let i = 0; i < lineup.length; i++) {
					lineup[i].show = show
				}
			}

			dispatch(PlayerActions.setPlaylist(lineup))
			dispatch(PlayerActions.setCurrentTrackById(trackId))

			// If the track doesn't have a preview_url
			// let's go to the next track and hope for the best
			if (!existsWithKey(track, 'preview_url') || !trackId) {
				dispatch(PlayerActions.playNextTrack())
			}

			dispatch(PlayerActions.play())
			dispatch(PlayerActions.pause())
			dispatch(PlayerActions.play())
		}
	},

	/**
	 * Set current track in playlist
	 *
	 * @param {string} trackId - track id to set as active.
	 *		Should be in current playlist
	 *
	 * @return {action}
	 */
	setCurrentTrackById(trackId = null) {
		return (dispatch, getState) => {
			let { playlist, isPlaying } = getState().player
			let currentTrack = find(playlist, { id: trackId })

			if (!trackId) {
				currentTrack = playlist[0]
			}

			dispatch(PlayerActions.pause())
			dispatch(PlayerActions.playing(0))
			dispatch(PlayerActions.setCurrentTrack(currentTrack))

			if (isPlaying) {
				dispatch(PlayerActions.play())
			}

			track('play', {
				action: 'play',
				show_id: currentTrack.show_id,
				track_id: trackId
			})
		}
	},

	/**
	 * Finds and plays the next valid track in the current playlist
	 *
	 * @param {number} direction - 1/-1 depending on which direction
	 *		to find the next song
	 *
	 * @return {action}
	 */
	playNextTrack(direction = 1) {
		return (dispatch, getState) => {
			let {
				playlist,
				currentTrack
			} = getState().player

			if (!currentTrack || !playlist) {
				return
			}

			let startIndex = playlist.indexOf(currentTrack)

			// Find next track wtih a `preview_url`
			for (let nextIndex = startIndex + direction; nextIndex < playlist.length; (direction == 1) ? nextIndex++ : nextIndex--) {
				if (!playlist[nextIndex]) {
					continue
				}

				if (playlist[nextIndex].preview_url) {
					dispatch(PlayerActions.setCurrentTrackById(playlist[nextIndex].id))
					return
				}
			}

			// If we get here, then there is not a
			// next/previous track – so let's just pause
			dispatch(PlayerActions.pause())

			// If we're on a phone, we have less real estate,
			// so let's also close the player
			if (isMobile) {
				dispatch(PlayerActions.setPlaylist(null))
			}
		}
	},

	/**
	 * Set active playlist/lineup
	 *
	 * @param {array} - playlist
	 *		@param {object.string} playlist.id
	 *		@param {object.string} playlist.name
	 *		@param {object.array} playlist.artists
	 *		@param {object.number} playlist.duration_ms
	 *		@param {object.string} playlist.show_id
	 *		@param {object.string} playlist.preview_url
	 *
	 * @return {action}
	 */
	setPlaylist(playlist) {
		return {
			type: TYPES.SET_PLAYLIST,
			playlist
		}
	},

	setCurrentTrack(currentTrack) {
		return {
			type: TYPES.SET_CURRENT_TRACK,
			currentTrack
		}
	},

	play(state = true) {
		return {
			type: TYPES.PLAY,
			isPlaying: state
		}
	},

	playing(trackPosition) {
		return {
			type: TYPES.PLAYING,
			trackPosition
		}
	},

	pause(state = false) {
		return {
			type: TYPES.PAUSE,
			isPlaying: state
		}
	}
}

export default PlayerActions
