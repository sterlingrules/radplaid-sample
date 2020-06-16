import { DEFAULT_PLAYER } from './../../constants.jsx'
import * as TYPES from './../types.jsx'

const player = (previousState = DEFAULT_PLAYER, action) => {
	switch(action.type) {
		case TYPES.PLAY:
		case TYPES.PAUSE:
			let { isPlaying } = action

			return {
				...previousState,
				isPlaying
			}
		case TYPES.SET_PLAYLIST:
			let { playlist } = action

			return {
				...previousState,
				playlist
			}
		case TYPES.SET_CURRENT_TRACK:
			let { currentTrack } = action

			return {
				...previousState,
				currentTrack
			}
		case TYPES.PLAYING:
			let { trackPosition } = action

			return {
				...previousState,
				trackPosition
			}
		default:
			return previousState
	}
}

export default player
