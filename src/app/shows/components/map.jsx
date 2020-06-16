import isEqual from 'lodash/isEqual'
import isObject from 'lodash/isObject'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isMobile } from './../../helpers/device-detect.js'
// import { StaticMap, Marker } from 'react-map-gl'
// import { IconLocation } from './../../common/icons.jsx'
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
				// overlay.push(`pin-s-${marker.count || marker.label}+${color}(${marker.longitude},${marker.latitude})`)
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
		// console.log('staticMapUrl ', staticMapUrl)
		return (
			<div id="map">
				{validCoordinates && (
					<div className="show-map" style={{ backgroundImage: `url("${staticMapUrl}")`, height: `${height}px` }}>
						{/*<div className="map-marker">
							<IconLocation className="icon--large" />
						</div>
						<div className="map">
							<img src={staticMapUrl} style={{ objectFit: 'cover' }} />
							<StaticMap
								mapboxApiAccessToken={process.env.MAPBOX_ACCESS_TOKEN}
								mapStyle={`mapbox://styles/radplaid/${style || 'cjlf8qddf0q0p2ss97tknczy3'}${DEBUG ? `?${new Date().getTime()}` : '?optimize=true'}`}
								reuseMaps={true}
								width={width || 768}
								height={height || 200}
								latitude={isNumber(coordinates[1]) ? coordinates[1] : 0}
								longitude={isNumber(coordinates[0]) ? coordinates[0] : 0}
								zoom={zoom || 13}>

								{markers.map((marker, index) => {
									return (
										<Marker
											key={index}
											latitude={marker.latitude}
											longitude={marker.longitude}
											offsetLeft={-16}
											offsetTop={-16}>
											<div className="mapboxgl-markerlabel" title={marker.label} aria-label={marker.label}>
												{marker.count}
											</div>
										</Marker>
									)
								})}

							</StaticMap>
						</div>*/}
					</div>
				)}
			</div>
		)
	}
}

export default React.memo(Map)
