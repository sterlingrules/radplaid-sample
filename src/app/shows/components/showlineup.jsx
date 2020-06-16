import moment from 'moment'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { sortable } from 'react-sortable'
import { isMobile } from './../../helpers/device-detect'
import { isEmpty } from './../../helpers'
import { DEBUG } from './../../constants.jsx'
import MarketingCopy from './../../home/components/marketingcopy.jsx'
import ArtistArtwork from './../../artists/components/artistartwork.jsx'
import PlayButton from './../../player/components/play-button.jsx'
import ShowLineupCompact from './showlineup-compact.jsx'
import MoreMenu from './../../common/more-menu.jsx'
// import Carousel from './../../common/carousel.jsx'

const LineupItem = (props) => {
	return (
		<li {...props} className="playlist-info playlist-sortable">{props.children}</li>
	)
}

const SortableListItem = sortable(LineupItem)

class ShowLineup extends Component {
	static propTypes = {
		onSelect: PropTypes.func,
		onSortChange: PropTypes.func,
		onSortRemove: PropTypes.func,

		isSortable: PropTypes.bool,
		isSelected: PropTypes.array,

		type: PropTypes.string, // ie. Full, Compact, Carousel
		// carouselOptions: PropTypes.object, // options if type is carousel
		index: PropTypes.number,
		spotifyTrack: PropTypes.array,
		lineup: PropTypes.array.isRequired,
		user: PropTypes.object
	}

	constructor(props) {
		super(props)

		this.state = {
			draggingIndex: null
		}

		this._sortChange = this._sortChange.bind(this)
		this._playTrack = this._playTrack.bind(this)
		this._onSelect = this._onSelect.bind(this)
	}

	_sortChange(evt) {
		this.setState(evt)
		this.props.onSortChange(evt)
	}

	_onSelect({ target }) {
		let { lineup, onSelect } = this.props

		if (!onSelect) {
			return this._playTrack(target)
		}

		for (let i = 0; i < lineup.length; i++) {
			if (lineup[i].id == target.dataset.id) {
				return onSelect(lineup[i])
			}
		}
	}

	_playTrack(target) {
		let playButton = target.querySelector('button.btn')

		if (playButton) {
			playButton.click()
		}
	}

	render() {
		let {
			id,
			type,
			index,
			lineup,
			// carouselOptions,
			onSortChange,
			onSortRemove,
			spotifyTrack,
			user
		} = this.props

		const showIndex = index
		const isSelected = this.props.isSelected || []
		const canSelect = this.props.onSelect ? 'playlist--canselect' : ''
		const hasLineup = (lineup && lineup.length > 0 && !isEmpty(lineup[0]))
		const showLineup = !hasLineup ? (
			<li />
		) : (
			lineup.map((track, index) => {
				let { artists } = track
				let trackElementId = `lineupitem-${this.props.id}-${track.id}`
				let imagePath = track.artwork || null
				let location = ''
				let artistName = ''
				let _isSelected = (isSelected.indexOf(track.id) > -1)
				let genres = []
				let images = []

				let artist
				let trackName
				let trackSource = (
					<span className={`violator violator--${track.source} text-uppercase`}>{track.source}</span>
				)

				// Artist
				if (artists.length) {
					artist = artists[0]
					genres = artist.genres || []
					artistName = artists.name || artist.name
					images = artists.images || artist.images || []

					if (images.length && !imagePath) {
						imagePath = images[0].url
					}

					location += (artist.city) ? artist.city : ''
					location += (artist.city && artist.state_code) ? `, ${artist.state_code}` : ''
					location += (!artist.city && artist.state) ? artist.state : ''

					if (location) {
						location = (
							<span className="violator violator--location">{location}</span>
						)
					}
				}

				// Track
				if (track.name) {
					if (track.source === 'spotify' && track.preview_url) {
						trackName = (
							<div className="playlist-title">
								<div className="flex">
									<span className="text-ellipsis">{track.name}</span>
									<span className="playlist-time">(0:30)</span>
								</div>
								<span className="block">{location}</span>
							</div>
						)
					}
					else {
						trackName = (
							<div className="playlist-title">
								<div className="flex">
									<span className="text-ellipsis">{track.name}</span>
									<span className="playlist-time">({moment(track.duration_ms).format('m:ss')})</span>
								</div>
								<span className="block">{location}</span>
							</div>
						)
					}
				}
				else if (genres.length) {
					trackName = (
						<div className="playlist-title text-capitalize">
							{genres.slice(0, 2).map((genre, index) => {
								return <span key={index} className="violator">{genre}</span>
							})}
							{location}
							{genres.length > 2 && (
								<MoreMenu
									options={genres.slice(2).map((genre) => {
										return { label: genre }
									})} />
							)}
						</div>
					)
				}

				if (this.props.isSortable && !isMobile) {
					return (
						<SortableListItem
							sortId={index}
							key={index}
							onSortItems={this._sortChange}
							items={lineup}>

							<ArtistArtwork
								path={imagePath}
								source={track.source} />

							<div className="playlist-track">
								{artistName && (<div className="playlist-artist">{artistName}</div>)}
								{trackName}
								{onSortRemove && (
									<div className="typography-small color-error cursor-pointer inline" onClick={onSortRemove} data-index={index} title="Remove from lineup">Remove</div>
								)}
							</div>
							{track.preview_url && (
								<PlayButton
									type="compact"
									showId={this.props.id}
									trackId={track.id}
									source={track.source}
									spotifyTrack={spotifyTrack ? track : false} />
							)}

						</SortableListItem>
					)
				}

				return (
					<ShowLineupItem
						{...this.props}
						{...{ index, showIndex, track, imagePath, artistName, trackName, spotifyTrack, onSortRemove }}
						key={index}
						isSelected={_isSelected}
						onSelect={this._onSelect} />
				)
			})
		)

		return (
			<ul className={[ 'playlist', canSelect ].join(' ').trim()}>
				{showLineup}
			</ul>
		)

		// return (type === 'carousel' ? (
		// 		<Carousel
		// 			id={id}
		// 			className={[ 'playlist', canSelect ].join(' ').trim()}
		// 			options={carouselOptions}
		// 			onMountAfter={() => {
		// 				document
		// 					.querySelectorAll(`#${id} .glide__slide`)
		// 					.forEach((item, index) => {
		// 						item.addEventListener('click', this._onSelect)
		// 					})
		// 			}}>
		// 			{showLineup}
		// 		</Carousel>
		// 	) : (
		// 		<ul className={[ 'playlist', canSelect ].join(' ').trim()}>
		// 			{showLineup}
		// 		</ul>
		// 	)
		// )
	}
}

const ShowLineupItem = (props) => {
	let {
		id,
		index,
		showIndex,
		user,
		track,
		artistName,
		trackName,
		imagePath,
		spotifyTrack,
		isSelected,
		onSortRemove,
		onSelect
	} = props

	let canMarket = (
		track.preview_url &&
		index === 0 &&
		showIndex === 0 &&
		!user.id
	)

	return (
		<div className={`cursor-pointer playlist-info ${isSelected ? 'playlist-info--selected' : ''}`} data-id={track.id} onClick={onSelect}>

			<ArtistArtwork
				path={imagePath}
				source={track.source} />

			<div className="playlist-track">
				{artistName && (<div className="playlist-artist">{artistName}</div>)}
				{trackName}
				{(onSortRemove && isMobile) && (
					<div className="typography-small color-error cursor-pointer inline" onClick={onSortRemove} data-index={index} title="Remove from lineup">Remove</div>
				)}
			</div>

			{track.preview_url && (
				<div style={{ alignSelf: 'center' }}>
					<PlayButton
						type="compact"
						showId={id}
						trackId={track.id}
						spotifyTrack={spotifyTrack ? track : false} />
				</div>
			)}
		</div>
	)
}

export default ShowLineup
