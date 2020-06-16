import React, { Component } from 'react'
import { IconSpotify, IconSoundCloud } from './../../common/icons.jsx'

class ArtistArtwork extends Component {
	render() {
		let { source, path } = this.props
		let artistArtwork = path ? { backgroundImage: `url(${path})` } : {}

		return (
			<figure className="playlist-artistartwork" style={artistArtwork}>
				{(source === 'spotify') && (
					<IconSpotify />
				)}
				{(source === 'soundcloud') && (
					<div className="icon-soundcloud-wrapper">
						<IconSoundCloud />
					</div>
				)}
			</figure>
		)
	}
}

export default ArtistArtwork
