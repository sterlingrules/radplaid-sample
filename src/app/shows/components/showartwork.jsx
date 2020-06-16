import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { delay } from './../../helpers'
import ViewableMonitor from './../../common/utils/viewable-monitor.jsx'
// import cloudinary from 'cloudinary-core'

export const getArtworkUrl = ({ path, width, height, blob }) => {
	width = width || 484
	height = height || 190

	let protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:'
	let dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 'auto'
	let source = null

	if (path && (path.secure_url || path.url)) {
		source = `${protocol === 'https:' ? path.secure_url : path.url}` // ?${new Date().getTime()}`

		if (path.public_id && path.format) {
			if (path.crop && JSON.stringify(path.crop) !== '{}') {
				const { ui, areaPixels } = path.crop
				const aspectRatio = areaPixels.height / areaPixels.width

				source = `https://res.cloudinary.com/radplaid/image/upload/f_auto/x_${areaPixels.x},y_${areaPixels.y},z_${path.zoom || 1},w_${areaPixels.width},h_${areaPixels.height},c_crop,dpr_auto${path.version ? `/v${path.version}` : ''}/${path.public_id}`
			}
			else {
				source = `https://res.cloudinary.com/radplaid/image/upload/f_auto/c_lfill,w_${width},h_${height},dpr_auto,g_faces:auto${path.version ? `/v${path.version}` : ''}/${path.public_id}`
			}
		}
	}
	else {
		source = blob ? blob : ''
	}

	return source
}

/**
 *
 * Component for the show artwork asset
 *
 * @param blob {String} - Local image asset blob
 * @param width {Number} - Image width. Defaults 484px
 * @param path {Object}
 *		path.url {String} - Image asset path for public urls (http)
 * 		path.secure_url {String} - Image asset path for secure urls (https)
 * @param onLoad {Function} - Method to call when asset loads
 * @param crossOrigin {Boolean} - Whether or not to permit `crossOrigin` access
 *
 * @return {React Component}
 *
 */
export const ShowArtworkAsset = (props) => {
	let {
		type,
		width,
		height,
		className,
		style,
		onClick,
		blob,
		path,
		onLoad,
		onError,
		crossOrigin,
		title
	} = props

	title = title || ''

	let _onClick = typeof onClick === 'function' ? onClick : () => {}
	let source = getArtworkUrl({ path, width, height, blob })
	// let position = `g_faces:auto`
	// let transform = {
	// 	crop: 'lfill',
	// 	gravity: 'face',
	// 	fetch_format: 'auto',
	// 	secure: (protocol === 'https:'),
	// 	width,
	// 	height
	// }

	crossOrigin = crossOrigin || ''
	style = source ? Object.assign({ backgroundImage: `url(${source})` }, style || {}) : style

	return (type === 'background' ? (
			<div className={`relative img-background ${className}`} onClick={_onClick} style={style} />
		) : (
			<img src={source} alt={title} aria-label={title} onClick={_onClick} onLoad={onLoad} onError={onError} crossOrigin={crossOrigin} />
		)
	)
}

export const LineupAsArtwork = ({ lineup }) => {

	lineup = lineup || []

	return (
		<div className={`artistartwork artistartwork-count-${lineup.length}`}>
			<ul>
				{lineup.map((track, index) => {
					let artist = track.artists[0]
					let imageSrc = ''

					if (artist && Array.isArray(artist.images) && artist.images[0]) {
						imageSrc = artist.images[0].url || ''
					}

					return (
						<li key={index} style={{ backgroundImage: `url(${imageSrc})` }}>
							<img src={`${process.env.BASE_CLIENT_URL}${process.env.ASSET_URL}/img/spacer.png`} />
						</li>
					)
				})}
			</ul>
		</div>
	)
}

class ShowArtwork extends Component {
	static propTypes = {
		type: PropTypes.string, // ie. full, compact
		path: PropTypes.object, // url, secure_url
		width: PropTypes.number, // defaults: 'auto'
		onImageLoad: PropTypes.func,
		crossOrigin: PropTypes.string
	}

	// state = {
	// 	active: false,
	// 	distance: 0,
	// 	scrollTop: 0,
	// 	scrollBottom: 0,
	// 	translateY: 0
	// }

	constructor(props) {
		super(props)

		// this.canUpdate = false
		// this.isImageLoaded = false

		this.state = {
			isImageLoaded: false,
			isImageErrored: false
		}

		this.imageLoaded = this.imageLoaded.bind(this)
		this.imageErrored = this.imageErrored.bind(this)
		// this._setScrollPosition = this._setScrollPosition.bind(this)
		// this._updateMetrics = this._updateMetrics.bind(this)
		// this._getTranslateY = this._getTranslateY.bind(this)
		// this._paint = this._paint.bind(this)
	}

	// componentDidMount() {
	// 	this.canUpdate = true

	// 	window.addEventListener('scroll', this._setScrollPosition, false, false)
	// 	window.addEventListener('resize', this._updateMetrics, false, false)

	// 	this._updateMetrics()
	// 	this._paint()
	// }

	// componentWillUnmount() {
	// 	this.canUpdate = false

	// 	window.removeEventListener('scroll', this._setScrollPosition, false, false)
	// 	window.removeEventListener('resize', this._updateMetrics, false, false)
	// }

	shouldComponentUpdate(nextProps, nextState) {
		return (
			nextProps.path !== this.props.path ||
			nextState !== this.state
		)
	}

	imageLoaded(evt) {
		if (this.state.isImageLoaded) {
			return
		}

		let { onImageLoad } = this.props

		// this._updateMetrics()
		this.setState({ isImageLoaded: true })

		if (onImageLoad && evt) {
			delay(onImageLoad(evt), 50)
		}
	}

	imageErrored() {
		if (this.state.isImageErrored) {
			return
		}

		this.setState({ isImageErrored: true })
	}

	// _paint() {
	// 	if (this.props.type === 'full' || !this.canUpdate) {
	// 		return
	// 	}

	// 	let { innerHeight } = window
	// 	let { scrollTop, scrollBottom, distance, translateY } = this.state

	// 	if (this.scrollPosition + innerHeight > scrollTop &&
	// 		this.scrollPosition < scrollBottom) {

	// 		this.translateY = this._getTranslateY()
	// 	}
	// 	else if (this.scrollPosition + innerHeight < scrollTop && translateY !== 0) {
	// 		this.translateY = 0
	// 	}
	// 	else if (this.scrollPosition > scrollBottom && translateY !== distance) {
	// 		this.translateY = distance * -1
	// 	}

	// 	this.imageEl.style.transform = `translateY(${this.translateY}px)`

	// 	requestAnimationFrame(this._paint)
	// }

	// _getTranslateY(state) {
	// 	if (!this.canUpdate) {
	// 		return
	// 	}

	// 	let { scrollTop, scrollBottom, distance } = state || this.state
	// 	let scrollPosition = window.scrollY

	// 	let translateY = (distance * normalize(scrollPosition, scrollBottom, scrollTop - innerHeight))

	// 	if (translateY > 0) {
	// 		return Math.min(translateY, distance) * -1
	// 	}

	// 	return 0
	// }

	// _setScrollPosition({ target }) {
	// 	if (!this.canUpdate) {
	// 		return
	// 	}

	// 	this.scrollPosition = window.scrollY
	// 	this.isScrolling = true

	// 	// Handle metric update
	// 	if (!this.rafFired) {
	// 		this._updateMetrics()
	// 		this.rafFired = true
	// 	}

	// 	delay(() => {
	// 		this.isScrolling = false
	// 		this.rafFired = false
	// 	}, 500)
	// }

	// _updateMetrics() {
	// 	if (!this.canUpdate) {
	// 		return
	// 	}

	// 	let { top, bottom } = this.figureEl.getBoundingClientRect()
	// 	let state = {
	// 		active: true,
	// 		scrollTop: window.scrollY + top,
	// 		scrollBottom: window.scrollY + bottom,
	// 		distance: this.imageEl.offsetHeight - this.figureEl.offsetHeight
	// 	}

	// 	this.scrollPosition = scrollY

	// 	if (window.scrollY < state.scrollTop) {
	// 		state.translateY = 0
	// 	}
	// 	else if (window.scrollY > state.scrollBottom) {
	// 		state.translateY = state.distance
	// 	}
	// 	else {
	// 		state.translateY = this._getTranslateY(state)
	// 	}

	// 	requestAnimationFrame(() => this.setState(state))
	// }

	render() {
		let { type, path, blob } = this.props
		let { translateY, active, isImageLoaded, isImageErrored } = this.state
		let corners = []

		return (
			<figure ref={(element) => this.figureEl = element} className={`showitem-artwork showitem--${type || 'compact'} ${isImageLoaded ? 'is-loaded' : ''}`}>
				<div ref={(element) => this.imageEl = element} className="showitem-artwork-image">
					<ViewableMonitor style={{ height: '100%' }}>
						<ShowArtworkAsset {...this.props} onLoad={this.imageLoaded} onError={this.imageErrored} />
					</ViewableMonitor>

					{((path || blob) && (!isImageLoaded && !isImageErrored)) && (
						<div className="loader loader--small center-center">
							<div className="loader-pill"></div>
						</div>
					)}
				</div>
			</figure>
		)
	}
}

export default ShowArtwork
