import isEqual from 'lodash/isEqual'
import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import ShowOrganizer from './../showorganizer.jsx'
import PlayAllButton from './../../../player/components/playall-button.jsx'
import { ShowArtworkAsset } from './../showartwork.jsx'
import { ShowDateTime, ShowItemVenue } from './../showmeta.jsx'
import ShowItemMoreMenu from './moremenu.jsx'
import { formatTitleFromLineup, existsWithKey } from './../../../helpers'
import { track } from './../../../helpers/analytics.jsx'
import { ARTWORK_FALLBACK } from './../../../constants.jsx'

class ShowItemCompact extends Component {
	static propTypes = {
		date: PropTypes.date,
		venue: PropTypes.object,
		artwork: PropTypes.object,
		lineup: PropTypes.array,
		title: PropTypes.string,
		organizer: PropTypes.object,
		slug: PropTypes.string
	}

	constructor(props) {
		super(props)

		this.state = {
			showId: null,
			firstTrackId: null
		}

		this._hasPlayableTracks = this._hasPlayableTracks.bind(this)
		this._getArtistArtwork = this._getArtistArtwork.bind(this)
		this._goToShow = this._goToShow.bind(this)
	}

	componentWillMount() {
		for (let i = 0; i < this.props.lineup.length; i++) {
			if (this.props.lineup[i].preview_url) {
				return this.setState({
					showId: this.props.slug,
					firstTrackId: this.props.lineup[i].id
				})
			}
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			!isEqual(nextProps, this.props)
		)
	}

	_goToShow(evt) {
		if (evt) evt.preventDefault()

		let { history, slug } = this.props

		track('visit', {
			action: 'owner:show_from_show_item',
			show_id: this.props.slug
		})

		history.push(`/shows/${slug}`)
	}

	_hasPlayableTracks() {
		for (let i = 0; i < this.props.lineup.length; i++) {
			if (this.props.lineup[i].preview_url) {
				return true
			}
		}

		return false
	}

	_getArtistArtwork(lineup = []) {
		for (let i = 0; i < lineup.length; i++) {
			let artist = lineup[i].artists[0]

			if (existsWithKey(artist, 'images') && artist.images.length > 0) {
				if (artist.images[0].url) {
					return {
						url: artist.images[0].url,
						secure_url: artist.images[0].url
					}
				}
			}
		}

		return ''
	}

	render() {
		let {
			user,
			date,
			venue,
			artwork,
			lineup,
			title,
			organizer,
			slug
		} = this.props

		let { showId, firstTrackId } = this.state

		return (
			<li className="showitem">
				<div className="bubble listitem listitem--info">
					<ShowArtworkAsset
						type="background"
						className="listitem-image cursor-pointer"
						onClick={this._goToShow}
						width={ 300 }
						path={artwork || this._getArtistArtwork(lineup)} />

					<Link to={`/shows/${slug}`} className="listitem-content cursor-pointer" onClick={this._goToShow}>
						<div className="typography-small-headline">
							<ShowDateTime date={date} format="ddd, MMM D, YYYY" />
							<ShowItemVenue venue={venue} />
						</div>
						<div className="typography-body">
							{title || formatTitleFromLineup(lineup)}
						</div>
					</Link>

					<div className="listitem-action">
						<ShowItemMoreMenu {...this.props} />
					</div>

					{/*{(firstTrackId) && (
						<div className="listitem-action">
							<PlayAllButton
								type="compact"
								showId={showId}
								trackId={firstTrackId} />
						</div>
					)}*/}
				</div>
			</li>

		)
	}
}

export default withRouter(ShowItemCompact)
