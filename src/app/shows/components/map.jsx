import isEqual from 'lodash/isEqual'
import isObject from 'lodash/isObject'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isMobile } from './../../helpers/device-detect.js'
import { DEBUG } from './../../constants.jsx'

class Map extends Component {
	static propTypes = {
		venue: PropTypes.object.isRequired, // min. { lat: {Number}, lng: {Number} }
		width: PropTypes.number,
		height: PropTypes.number,
		style: PropTypes.string,
		zoom: PropTypes.number
	}

	constructor(props) {
		super(props)

		this.state = {
			coordinates: null
		}

		this._setCoordinates = this._setCoordinates.bind(this)
	}

	componentWillMount() {
		this._setCoordinates()
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.venue !== this.props.venue) {
			this._setCoordinates(nextProps)
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			!isEqual(nextState.coordinates, this.state.coordinates) ||
			!isEqual(nextProps.markers, this.props.markers) ||
			nextProps.width !== this.props.width ||
			nextProps.height !== this.props.height ||
			nextProps.style !== this.props.style ||
			nextProps.zoom !== this.props.zoom
		)
	}

	_setCoordinates(props) {
		let { venue } = props || this.props
		let coordinates = venue ? [ venue.lng, venue.lat ] : null

		if (!venue || !process.browser) {
			return
		}

		this.setState({ coordinates })
	}

	render() {
		let { coordinates } = this.state
		let { width, height, style, map = {} } = this.props
		let zoom = map.zoom || 12
		let validCoordinates = (Array.isArray(coordinates) && !isNaN(coordinates[1]) && !isNaN(coordinates[0]))
		let color = 'f6a692'
		let overlay = []

		if (isObject(map) && Array.isArray(map.markers)) {
			if (map.center) {
				coordinates = map.center
			}

			map.markers.forEach(marker => {
				overlay.push(`pin-s-music+${color}(${marker.longitude},${marker.latitude})`)
			})
		}

		width = Math.min(Math.round(width || 768), 1280)
		height = Math.min(Math.round(height || 200), 1280)

		const latitude = (validCoordinates && typeof coordinates[1] === 'number') ? coordinates[1] : 0
		const longitude = (validCoordinates && typeof coordinates[0] === 'number') ? coordinates[0] : 0
		const staticMapParams = [
			'https://api.mapbox.com/styles/v1/radplaid',
			style || 'cjlf8qddf0q0p2ss97tknczy3',
			`static${overlay.length > 0 ? `/${overlay.join(',')}` : ''}`,
			[
				longitude,
				latitude,
				zoom,
			].join(','),
			`${width}x${height}@2x`,
		].join('/')

		const staticMapQuery = [
			'logo=false',
			'attribution=false',
			`access_token=${process.env.MAPBOX_ACCESS_TOKEN}`
		].join('&')

		const staticMapUrl = `${staticMapParams}?${staticMapQuery}`

		return (
			<div id="map">
				{validCoordinates && (
					<div
						className="show-map"
						style={{
							backgroundImage: `url("${staticMapUrl}")`,
							height: `${height}px`
						}} />
				)}
			</div>
		)
	}
}

export default React.memo(Map)
